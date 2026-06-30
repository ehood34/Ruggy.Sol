extends Node
## SaveManager (autoload singleton)
##
## Owns ALL persistent state: settings, unlocks, best times / ghosts,
## grand-prix progress and currency. Backed by a single JSON file under
## user:// so it survives across runs and platforms.
##
## How to extend:
##   - Add a new field to DEFAULT_DATA, then read/write it via the typed
##     helper methods. Old save files auto-merge missing keys on load.
##   - Ghost data is stored separately per track under "ghosts" to keep the
##     main file small; large ghosts could later move to their own files.

const SAVE_PATH := "user://ruggy_racers_save.json"
const SAVE_VERSION := 1

## The canonical default save. Any key missing from a loaded file is filled
## in from here, so adding new keys never breaks old saves.
const DEFAULT_DATA := {
	"version": SAVE_VERSION,
	"settings": {
		"master_volume": 1.0,
		"music_volume": 0.8,
		"sfx_volume": 1.0,
		"fullscreen": false,
		"camera_shake": 1.0,
		"speed_units": "kmh", # "kmh" | "mph"
	},
	"unlocks": {
		# Racers/tracks unlocked from the start. Others unlock via progression.
		"racers": ["lambo", "trench", "banned"],
		"tracks": ["pump_street", "banned_boulevard", "rug_war_zone"],
		"titles": [],
	},
	"currency": 0, # "Rug Coins" earned from races, spent in the Garage.
	"grand_prix": {}, # cup_id -> { "best_placement": int, "completed": bool }
	"time_trials": {}, # track_id -> { "best_total_ms": int, "best_lap_ms": int, "medal": "gold|silver|bronze|none" }
	"stats": {
		"races_finished": 0,
		"first_places": 0,
		"items_used": 0,
		"total_drift_boosts": 0,
	},
}

var data: Dictionary = {}

func _ready() -> void:
	load_game()

# ---------------------------------------------------------------------------
# Load / save
# ---------------------------------------------------------------------------

func load_game() -> void:
	data = _deep_duplicate(DEFAULT_DATA)
	if not FileAccess.file_exists(SAVE_PATH):
		save_game()
		return
	var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if f == null:
		push_warning("SaveManager: could not open save file, using defaults.")
		return
	var text := f.get_as_text()
	f.close()
	var parsed: Variant = JSON.parse_string(text)
	if typeof(parsed) != TYPE_DICTIONARY:
		push_warning("SaveManager: corrupt save, regenerating defaults.")
		save_game()
		return
	# Merge so new keys from DEFAULT_DATA appear even in old saves.
	data = _deep_merge(_deep_duplicate(DEFAULT_DATA), parsed)
	data["version"] = SAVE_VERSION

func save_game() -> void:
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f == null:
		push_error("SaveManager: failed to open save file for writing.")
		return
	f.store_string(JSON.stringify(data, "\t"))
	f.close()

func reset_save() -> void:
	data = _deep_duplicate(DEFAULT_DATA)
	save_game()

# ---------------------------------------------------------------------------
# Settings helpers
# ---------------------------------------------------------------------------

func get_setting(key: String, fallback: Variant = null) -> Variant:
	return data["settings"].get(key, fallback)

func set_setting(key: String, value: Variant) -> void:
	data["settings"][key] = value
	save_game()

# ---------------------------------------------------------------------------
# Unlocks
# ---------------------------------------------------------------------------

func is_racer_unlocked(racer_id: String) -> bool:
	return racer_id in data["unlocks"]["racers"]

func is_track_unlocked(track_id: String) -> bool:
	return track_id in data["unlocks"]["tracks"]

func unlock_racer(racer_id: String) -> bool:
	if racer_id in data["unlocks"]["racers"]:
		return false
	data["unlocks"]["racers"].append(racer_id)
	save_game()
	return true

func unlock_track(track_id: String) -> bool:
	if track_id in data["unlocks"]["tracks"]:
		return false
	data["unlocks"]["tracks"].append(track_id)
	save_game()
	return true

func unlock_title(title: String) -> bool:
	if title in data["unlocks"]["titles"]:
		return false
	data["unlocks"]["titles"].append(title)
	save_game()
	return true

# ---------------------------------------------------------------------------
# Currency
# ---------------------------------------------------------------------------

func add_currency(amount: int) -> void:
	data["currency"] = max(0, int(data["currency"]) + amount)
	save_game()

func get_currency() -> int:
	return int(data["currency"])

# ---------------------------------------------------------------------------
# Time trials / speedrun
# ---------------------------------------------------------------------------

## Records a time-trial result if it beats the stored best. Returns true if a
## new record was set. `medal` is computed by the caller from track targets.
func record_time_trial(track_id: String, total_ms: int, best_lap_ms: int, medal: String) -> bool:
	var tt: Dictionary = data["time_trials"]
	var prev: Dictionary = tt.get(track_id, {})
	var prev_best: int = int(prev.get("best_total_ms", 0x7FFFFFFF))
	if total_ms >= prev_best:
		return false
	tt[track_id] = {
		"best_total_ms": total_ms,
		"best_lap_ms": min(best_lap_ms, int(prev.get("best_lap_ms", 0x7FFFFFFF))),
		"medal": medal,
	}
	save_game()
	return true

func get_time_trial(track_id: String) -> Dictionary:
	return data["time_trials"].get(track_id, {})

## Ghost recordings live in their own files so the JSON save stays light.
func save_ghost(track_id: String, samples: Array) -> void:
	var path := "user://ghost_%s.json" % track_id
	var f := FileAccess.open(path, FileAccess.WRITE)
	if f == null:
		return
	f.store_string(JSON.stringify(samples))
	f.close()

func load_ghost(track_id: String) -> Array:
	var path := "user://ghost_%s.json" % track_id
	if not FileAccess.file_exists(path):
		return []
	var f := FileAccess.open(path, FileAccess.READ)
	var parsed: Variant = JSON.parse_string(f.get_as_text())
	f.close()
	return parsed if typeof(parsed) == TYPE_ARRAY else []

# ---------------------------------------------------------------------------
# Stats
# ---------------------------------------------------------------------------

func bump_stat(key: String, amount: int = 1) -> void:
	data["stats"][key] = int(data["stats"].get(key, 0)) + amount
	save_game()

# ---------------------------------------------------------------------------
# Internal dictionary utilities
# ---------------------------------------------------------------------------

func _deep_duplicate(src: Variant) -> Variant:
	if typeof(src) == TYPE_DICTIONARY:
		var out := {}
		for k in src:
			out[k] = _deep_duplicate(src[k])
		return out
	elif typeof(src) == TYPE_ARRAY:
		var out := []
		for v in src:
			out.append(_deep_duplicate(v))
		return out
	return src

## Recursively fills `base` with values from `over` (over wins on conflicts),
## but keeps keys that only exist in `base` (the defaults).
func _deep_merge(base: Dictionary, over: Dictionary) -> Dictionary:
	for k in over:
		if base.has(k) and typeof(base[k]) == TYPE_DICTIONARY and typeof(over[k]) == TYPE_DICTIONARY:
			base[k] = _deep_merge(base[k], over[k])
		else:
			base[k] = over[k]
	return base
