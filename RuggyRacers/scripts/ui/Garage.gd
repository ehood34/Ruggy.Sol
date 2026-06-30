extends Control
## Garage — "Ruggy's Garage" collection hub. Shows which racers/tracks are
## unlocked, your currency, best times, and titles earned. A spend-currency
## shop for cosmetics can hang off the right-hand panel later.

func _ready() -> void:
	UITheme.fullscreen_bg(self, Color(0.10, 0.07, 0.02), Color(0.16, 0.10, 0.03))
	var title := UITheme.make_title("RUGGY'S GARAGE", 56)
	title.set_anchors_and_offsets_preset(Control.PRESET_TOP_WIDE)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.position.y = 30
	add_child(title)

	var coins := Label.new()
	coins.text = "💰 %d Rug Coins" % SaveManager.get_currency()
	coins.add_theme_font_size_override("font_size", 30)
	coins.add_theme_color_override("font_color", UITheme.GOLD)
	coins.position = Vector2(40, 110)
	add_child(coins)

	# Racer collection grid.
	var grid := GridContainer.new()
	grid.columns = 3
	grid.position = Vector2(80, 170)
	grid.add_theme_constant_override("h_separation", 20)
	grid.add_theme_constant_override("v_separation", 20)
	add_child(grid)
	for rid in RacerDB.RACER_ORDER:
		grid.add_child(_racer_card(rid))

	# Track + records list.
	var list := VBoxContainer.new()
	list.position = Vector2(900, 170)
	list.add_theme_constant_override("separation", 6)
	add_child(list)
	var hdr := Label.new(); hdr.text = "TRACK RECORDS"
	hdr.add_theme_font_size_override("font_size", 28)
	hdr.add_theme_color_override("font_color", UITheme.NEON)
	list.add_child(hdr)
	for tid in RacerDB.TRACK_ORDER:
		var t := RacerDB.get_track(tid)
		var rec := SaveManager.get_time_trial(tid)
		var row := Label.new()
		var unlocked := SaveManager.is_track_unlocked(tid)
		if not unlocked:
			row.text = "🔒 %s" % t["name"]
			row.add_theme_color_override("font_color", Color(0.5, 0.5, 0.6))
		elif rec.has("best_total_ms"):
			row.text = "%s — %s (%s)" % [t["name"], _fmt(rec["best_total_ms"]), rec.get("medal", "none")]
			row.add_theme_color_override("font_color", UITheme.TEXT)
		else:
			row.text = "%s — no time set" % t["name"]
			row.add_theme_color_override("font_color", UITheme.TEXT)
		list.add_child(row)

	var back := UITheme.make_button("Back", func(): GameManager.goto_scene("main_menu"))
	back.position = Vector2(40, 980)
	add_child(back)

func _racer_card(rid: String) -> Control:
	var r := RacerDB.get_racer(rid)
	var unlocked := SaveManager.is_racer_unlocked(rid)
	var panel := Panel.new()
	panel.custom_minimum_size = Vector2(240, 150)
	var sb := StyleBoxFlat.new()
	sb.bg_color = (r["fur_color"] if unlocked else Color(0.15, 0.15, 0.18)).darkened(0.1)
	sb.border_color = r["accent_color"]
	sb.set_border_width_all(4)
	sb.set_corner_radius_all(12)
	panel.add_theme_stylebox_override("panel", sb)
	var nm := Label.new()
	nm.text = r["name"] if unlocked else "🔒 ???"
	nm.add_theme_font_size_override("font_size", 22)
	nm.position = Vector2(14, 12)
	panel.add_child(nm)
	if unlocked:
		var veh := Label.new()
		veh.text = r["vehicle"]
		veh.add_theme_color_override("font_color", UITheme.TEXT)
		veh.position = Vector2(14, 48)
		panel.add_child(veh)
	return panel

func _fmt(ms: int) -> String:
	var total := ms / 1000.0
	return "%d:%05.2f" % [int(total) / 60, fmod(total, 60.0)]
