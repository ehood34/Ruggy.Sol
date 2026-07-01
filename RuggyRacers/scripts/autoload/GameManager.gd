extends Node
## GameManager (autoload singleton)
##
## Holds the "what are we about to play" intent and drives scene transitions.
## Menus write to it (mode, track, racer selections); RaceManager reads from it
## when a race scene loads. Keeping this here means race scenes don't need to
## know which menu launched them.
##
## How to extend:
##   - Add a new GameMode and branch on it in RaceManager.
##   - For multiplayer, `player_racers` already supports up to 4 local players.

signal race_config_changed

enum GameMode { QUICK_RACE, GRAND_PRIX, LOCAL_VS, TOURNAMENT, SPEEDRUN }

# --- Current race configuration (filled by menus) ---
var mode: GameMode = GameMode.QUICK_RACE
var track_id: String = "pump_street"
var laps: int = 3
var ai_count: int = 5
var ai_difficulty: float = 1.0 # 0.7 easy .. 1.3 brutal; scales AI target speed
var items_enabled: bool = true

# Per-local-player chosen racer ids. Length == number of human players (1..4).
var player_racers: Array[String] = ["lambo"]

# --- Grand Prix / Tournament progress (transient, per session) ---
var cup_id: String = "degen_cup"
var gp_track_index: int = 0
var gp_points: Dictionary = {} # racer_id (or "P1") -> accumulated points
var gp_results_log: Array = [] # per-race placement snapshots

# --- Speedrun options ---
var speedrun_practice: bool = false
var speedrun_use_ghost: bool = true

func _ready() -> void:
	# Apply saved display/audio settings on boot.
	_apply_window_settings()
	# Warm the resource cache: start loading the (large) racer models in the
	# background while the player is in menus, so entering a race/results screen
	# doesn't stall waiting on them. Deferred so it never blocks the boot frame.
	call_deferred("_preload_models")

## Kicks off threaded background loads of every custom model + honk clip. When a
## kart later calls load() on the same path, it returns the already-cached
## resource instantly instead of reading the big file mid-transition.
func _preload_models() -> void:
	for rid in RacerDB.MODELS:
		var cfg: Dictionary = RacerDB.MODELS[rid]
		for part in cfg:
			var d: String = cfg[part].get("dir", "")
			if d == "":
				continue
			var p := ModelMount.find_model_path(d)
			if p != "" and ResourceLoader.exists(p):
				ResourceLoader.load_threaded_request(p)
			# Also warm any honk/extra clip files in the same folder.
			_preload_extra_files(d)

func _preload_extra_files(dir_path: String) -> void:
	var dir := DirAccess.open(dir_path)
	if dir == null:
		return
	dir.list_dir_begin()
	while true:
		var f := dir.get_next()
		if f == "":
			break
		if dir.current_is_dir() or f.to_lower().ends_with(".import"):
			continue
		if "honk" in f.to_lower():
			var hp := dir_path.path_join(f)
			if ResourceLoader.exists(hp):
				ResourceLoader.load_threaded_request(hp)

func _apply_window_settings() -> void:
	var fs: bool = bool(SaveManager.get_setting("fullscreen", false))
	DisplayServer.window_set_mode(
		DisplayServer.WINDOW_MODE_FULLSCREEN if fs else DisplayServer.WINDOW_MODE_WINDOWED
	)

# ---------------------------------------------------------------------------
# Configuration helpers used by menus
# ---------------------------------------------------------------------------

func configure_quick_race(p_track: String, p_racer: String, p_ai: int, p_laps: int, p_diff: float) -> void:
	mode = GameMode.QUICK_RACE
	track_id = p_track
	player_racers = [p_racer]
	ai_count = p_ai
	laps = p_laps
	ai_difficulty = p_diff
	items_enabled = true
	emit_signal("race_config_changed")

func configure_speedrun(p_track: String, p_racer: String, practice: bool, use_ghost: bool) -> void:
	mode = GameMode.SPEEDRUN
	track_id = p_track
	player_racers = [p_racer]
	ai_count = 0
	laps = 3
	speedrun_practice = practice
	speedrun_use_ghost = use_ghost
	items_enabled = practice and items_enabled # items off by default in TT
	emit_signal("race_config_changed")

func configure_local_vs(p_track: String, racers: Array[String], p_ai: int, p_laps: int) -> void:
	mode = GameMode.LOCAL_VS
	track_id = p_track
	player_racers = racers.duplicate()
	ai_count = p_ai
	laps = p_laps
	items_enabled = true
	emit_signal("race_config_changed")

func start_grand_prix(p_cup: String, p_racer: String, p_diff: float) -> void:
	mode = GameMode.GRAND_PRIX
	cup_id = p_cup
	player_racers = [p_racer]
	ai_difficulty = p_diff
	laps = 3
	gp_track_index = 0
	gp_points = {}
	gp_results_log = []
	track_id = RacerDB.get_cup(cup_id)["tracks"][0]
	items_enabled = true
	emit_signal("race_config_changed")

## Advance to the next GP race. Returns false when the cup is finished.
func advance_grand_prix() -> bool:
	var cup: Dictionary = RacerDB.get_cup(cup_id)
	gp_track_index += 1
	if gp_track_index >= cup["tracks"].size():
		return false
	track_id = cup["tracks"][gp_track_index]
	return true

func is_grand_prix_finished() -> bool:
	var cup: Dictionary = RacerDB.get_cup(cup_id)
	return gp_track_index >= cup["tracks"].size() - 1

# ---------------------------------------------------------------------------
# Scene flow
# ---------------------------------------------------------------------------

const SCENES := {
	"boot": "res://scenes/ui/Boot.tscn",
	"main_menu": "res://scenes/ui/MainMenu.tscn",
	"character_select": "res://scenes/ui/CharacterSelect.tscn",
	"mode_select": "res://scenes/ui/ModeSelect.tscn",
	"track_select": "res://scenes/ui/TrackSelect.tscn",
	"results": "res://scenes/ui/ResultsScreen.tscn",
	"garage": "res://scenes/ui/Garage.tscn",
	"options": "res://scenes/ui/OptionsMenu.tscn",
}

func goto_scene(key: String) -> void:
	if SCENES.has(key):
		get_tree().change_scene_to_file(SCENES[key])
	else:
		push_error("GameManager: unknown scene key '%s'" % key)

## Loads the configured track scene (the actual race).
func start_race() -> void:
	var scene_path: String = RacerDB.get_track(track_id)["scene"]
	get_tree().change_scene_to_file(scene_path)

# ---------------------------------------------------------------------------
# Post-race progression (called by RaceManager when a race ends)
# ---------------------------------------------------------------------------

## Applies rewards and unlocks for a finished race. `placement` is 1-based.
func apply_race_results(placement: int, racer_id: String) -> void:
	SaveManager.bump_stat("races_finished")
	if placement == 1:
		SaveManager.bump_stat("first_places")
	# Currency scales with placement.
	var reward: int = max(50, 300 - (placement - 1) * 40)
	SaveManager.add_currency(reward)

	if mode == GameMode.GRAND_PRIX:
		var pts: int = RacerDB.GP_POINTS[placement - 1] if placement - 1 < RacerDB.GP_POINTS.size() else 0
		gp_points["P1"] = int(gp_points.get("P1", 0)) + pts
		gp_results_log.append({"track": track_id, "placement": placement})
