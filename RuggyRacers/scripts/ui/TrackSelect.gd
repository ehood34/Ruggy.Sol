extends Control
## TrackSelect / Race Config — adapts to the chosen mode (stashed as
## "config_mode" by CharacterSelect):
##   quick_race / local_vs : pick track + AI count + laps + difficulty.
##   speedrun              : pick track + practice toggle + ghost toggle, shows
##                           your best time and target medals.
##   grand_prix / tournament : pick a Cup (shows its 4 tracks).
##
## Confirm hands everything to GameManager and launches the race scene.

var _mode: String = "quick_race"
var _track_index: int = 0
var _cup_index: int = 0
var _ai_count: int = 5
var _laps: int = 3
var _difficulty: float = 1.0
var _practice: bool = false
var _use_ghost: bool = true

var _info_label: Label
var _title_label: Label
var _options_box: VBoxContainer

func _ready() -> void:
	_mode = GameManager.get_meta("config_mode", "quick_race")
	UITheme.fullscreen_bg(self)
	_build_ui()
	_refresh()

func _build_ui() -> void:
	_title_label = UITheme.make_title("SELECT TRACK", 56)
	_title_label.set_anchors_and_offsets_preset(Control.PRESET_TOP_WIDE)
	_title_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_title_label.position.y = 30
	add_child(_title_label)

	var panel := Panel.new()
	panel.position = Vector2(90, 150)
	panel.custom_minimum_size = Vector2(620, 520)
	add_child(panel)
	_info_label = Label.new()
	_info_label.position = Vector2(24, 24)
	_info_label.custom_minimum_size = Vector2(580, 470)
	_info_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_info_label.add_theme_color_override("font_color", UITheme.TEXT)
	_info_label.add_theme_font_size_override("font_size", 22)
	panel.add_child(_info_label)

	var nav := HBoxContainer.new()
	nav.position = Vector2(90, 690)
	nav.add_theme_constant_override("separation", 20)
	add_child(nav)
	nav.add_child(UITheme.make_button("◀", func(): _cycle(-1)))
	nav.add_child(UITheme.make_button("▶", func(): _cycle(1)))

	_options_box = VBoxContainer.new()
	_options_box.position = Vector2(760, 170)
	_options_box.add_theme_constant_override("separation", 16)
	add_child(_options_box)
	_build_options()

	var start := UITheme.make_button("START RACE", _confirm, true)
	start.position = Vector2(1080, 720)
	add_child(start)

	var back := UITheme.make_button("Back", func():
		AudioManager.play_sfx("ui_back")
		GameManager.goto_scene("character_select"))
	back.position = Vector2(40, 980)
	add_child(back)

func _build_options() -> void:
	for c in _options_box.get_children():
		c.queue_free()
	match _mode:
		"speedrun":
			_title_label.text = "SPEEDRUN — PICK TRACK"
			_options_box.add_child(_toggle_row("Practice (items %s)" , func(): return _practice, func(): _practice = not _practice; _refresh()))
			_options_box.add_child(_toggle_row("Race Ghost: %s", func(): return _use_ghost, func(): _use_ghost = not _use_ghost; _refresh()))
		"grand_prix", "tournament":
			_title_label.text = "SELECT CUP"
		_:
			_title_label.text = "RACE SETUP"
			_options_box.add_child(_stepper_row("AI Racers", func(): return str(_ai_count),
				func(): _ai_count = clampi(_ai_count - 1, 0, 7); _refresh(),
				func(): _ai_count = clampi(_ai_count + 1, 0, 7); _refresh()))
			_options_box.add_child(_stepper_row("Laps", func(): return str(_laps),
				func(): _laps = _prev_in([3,5,7], _laps); _refresh(),
				func(): _laps = _next_in([3,5,7], _laps); _refresh()))
			_options_box.add_child(_stepper_row("Difficulty", func(): return _diff_name(),
				func(): _difficulty = clampf(_difficulty - 0.15, 0.7, 1.3); _refresh(),
				func(): _difficulty = clampf(_difficulty + 0.15, 0.7, 1.3); _refresh()))

func _cycle(dir: int) -> void:
	AudioManager.play_sfx("ui_move")
	if _mode in ["grand_prix", "tournament"]:
		_cup_index = wrapi(_cup_index + dir, 0, RacerDB.CUPS.size())
	else:
		# Only cycle through unlocked tracks.
		var unlocked := _unlocked_tracks()
		var cur = unlocked[_track_index % unlocked.size()]
		var pos := unlocked.find(cur)
		_track_index = wrapi(pos + dir, 0, unlocked.size())
	_refresh()

func _refresh() -> void:
	if _mode in ["grand_prix", "tournament"]:
		var cup_id = RacerDB.CUPS.keys()[_cup_index]
		var cup := RacerDB.get_cup(cup_id)
		var lines := "[ %s ]\n\n" % cup["name"]
		for i in cup["tracks"].size():
			var t := RacerDB.get_track(cup["tracks"][i])
			lines += "  %d. %s\n     %s\n" % [i + 1, t["name"], t["theme"]]
		lines += "\nReward: %d Rug Coins" % cup["reward_currency"]
		_info_label.text = lines
	else:
		var unlocked := _unlocked_tracks()
		var tid = unlocked[_track_index % unlocked.size()]
		var t := RacerDB.get_track(tid)
		var best := SaveManager.get_time_trial(tid)
		var lines := "[ %s ]\n\n%s\n\nBoost: %s pads\nHazards: %s\n" % [
			t["name"], t["theme"], t["boost_label"], ", ".join(t["hazards"])]
		if _mode == "speedrun":
			var tg = t["targets"]
			lines += "\n— Target Times —\n🥇 %s   🥈 %s   🥉 %s\n" % [
				_fmt(tg["gold"]), _fmt(tg["silver"]), _fmt(tg["bronze"])]
			if best.has("best_total_ms"):
				lines += "\nYour Best: %s  (%s)\n" % [_fmt(best["best_total_ms"]), best.get("medal", "none")]
			else:
				lines += "\nYour Best: — no record yet —\n"
		_info_label.text = lines
	_build_options()

# --- Confirm ---------------------------------------------------------------

func _confirm() -> void:
	AudioManager.play_sfx("ui_confirm")
	var racer: String = GameManager.player_racers[0]
	match _mode:
		"speedrun":
			var tid = _unlocked_tracks()[_track_index % _unlocked_tracks().size()]
			GameManager.configure_speedrun(tid, racer, _practice, _use_ghost)
		"grand_prix":
			var cup_id = RacerDB.CUPS.keys()[_cup_index]
			GameManager.start_grand_prix(cup_id, racer, _difficulty)
		"tournament":
			var cup_id2 = RacerDB.CUPS.keys()[_cup_index]
			GameManager.start_grand_prix(cup_id2, racer, _difficulty) # tournament reuses GP flow
			GameManager.mode = GameManager.GameMode.TOURNAMENT
		_:
			var tid2 = _unlocked_tracks()[_track_index % _unlocked_tracks().size()]
			GameManager.configure_quick_race(tid2, racer, _ai_count, _laps, _difficulty)
	GameManager.start_race()

# --- Small widget helpers --------------------------------------------------

func _stepper_row(label: String, getter: Callable, dec: Callable, inc: Callable) -> Control:
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 10)
	var nm := Label.new(); nm.text = label; nm.custom_minimum_size = Vector2(220, 0)
	nm.add_theme_color_override("font_color", UITheme.TEXT)
	row.add_child(nm)
	var minus := Button.new(); minus.text = "−"; minus.pressed.connect(dec); row.add_child(minus)
	var val := Label.new(); val.text = getter.call(); val.custom_minimum_size = Vector2(140, 0)
	val.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	val.add_theme_color_override("font_color", UITheme.GOLD)
	row.add_child(val)
	var plus := Button.new(); plus.text = "+"; plus.pressed.connect(inc); row.add_child(plus)
	return row

func _toggle_row(fmt: String, getter: Callable, toggle: Callable) -> Control:
	var b := Button.new()
	var on: bool = getter.call()
	b.text = fmt % ("ON" if on else "OFF")
	b.toggle_mode = false
	b.pressed.connect(func(): toggle.call())
	b.custom_minimum_size = Vector2(360, 48)
	return b

func _diff_name() -> String:
	if _difficulty <= 0.8: return "Chill"
	if _difficulty <= 1.0: return "Normal"
	if _difficulty <= 1.15: return "Hard"
	return "Brutal"

func _unlocked_tracks() -> Array:
	var out: Array = []
	for tid in RacerDB.TRACK_ORDER:
		if SaveManager.is_track_unlocked(tid):
			out.append(tid)
	return out if not out.is_empty() else ["pump_street"]

func _prev_in(arr: Array, v: int) -> int:
	var i := arr.find(v)
	return arr[wrapi(i - 1, 0, arr.size())]

func _next_in(arr: Array, v: int) -> int:
	var i := arr.find(v)
	return arr[wrapi(i + 1, 0, arr.size())]

func _fmt(ms: int) -> String:
	var total := ms / 1000.0
	return "%d:%05.2f" % [int(total) / 60, fmod(total, 60.0)]
