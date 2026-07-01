extends Control
## ResultsScreen — shows the finishing order (podium-style), flavor text, and a
## stats recap. Handles three flavors:
##   - Speedrun: shows total time, best lap, medal, and new-record callout.
##   - Grand Prix: shows this race's order + running cup points, then "Next Race"
##     or the final cup standings + unlocks.
##   - Quick/Vs: order + "Race Again" / "Menu".
##
## The podium uses the racers' accent colors + signature flavor lines as a
## stand-in for the 3D victory poses described in the concept art.

const FLAVOR := {
	"lambo": "\"Easy money.\"",
	"trench": "\"Rolled over the competition.\"",
	"banned": "\"Can't ban THIS.\"",
	"moon": "\"TO THE MOOOON!\"",
	"golden": "\"Whale status confirmed.\"",
	"lotto": "\"JACKPOT, baby!\"",
}

var _results: Array = []

func _ready() -> void:
	AudioManager.play_music("results")
	UITheme.fullscreen_bg(self, Color(0.10, 0.06, 0.02), Color(0.18, 0.10, 0.02))
	_results = GameManager.get_meta("last_results", [])

	if GameManager.mode == GameManager.GameMode.SPEEDRUN:
		_build_speedrun()
	else:
		_build_race_results()

# ---------------------------------------------------------------------------

func _build_race_results() -> void:
	var player := _player_result()
	var placement: int = player.get("placement", 1)

	var title := UITheme.make_title(_headline(placement), 64)
	title.set_anchors_and_offsets_preset(Control.PRESET_TOP_WIDE)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.position.y = 30
	add_child(title)

	# Podium: each card now contains its own 3D model view up top.
	var podium := HBoxContainer.new()
	podium.alignment = BoxContainer.ALIGNMENT_CENTER
	podium.add_theme_constant_override("separation", 30)
	podium.set_anchors_and_offsets_preset(Control.PRESET_CENTER_TOP)
	podium.position = Vector2(-360, 150)
	add_child(podium)
	var order := [1, 0, 2] # 2nd, 1st, 3rd visual arrangement
	for slot in order:
		if slot < _results.size():
			podium.add_child(_podium_card(_results[slot], slot + 1))

	# Full standings list.
	var list := VBoxContainer.new()
	list.position = Vector2(120, 560)
	list.add_theme_constant_override("separation", 4)
	add_child(list)
	for r in _results:
		var row := Label.new()
		var tm: String = _fmt(r["time_ms"]) if r["time_ms"] > 0 else "DNF"
		row.text = "%d.  %-18s  %s" % [r["placement"], r["name"], tm]
		row.add_theme_font_size_override("font_size", 24)
		row.add_theme_color_override("font_color", UITheme.GOLD if r["is_player"] else UITheme.TEXT)
		list.add_child(row)

	# Reward line.
	var reward := Label.new()
	reward.text = "💰 Rug Coins: %d" % SaveManager.get_currency()
	reward.add_theme_font_size_override("font_size", 28)
	reward.add_theme_color_override("font_color", UITheme.GOLD)
	reward.position = Vector2(120, 812)
	add_child(reward)

	_build_buttons()

func _build_speedrun() -> void:
	var s: Dictionary = GameManager.get_meta("speedrun_summary", {})
	var title := UITheme.make_title("TIME TRIAL", 64)
	title.set_anchors_and_offsets_preset(Control.PRESET_TOP_WIDE)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.position.y = 30
	add_child(title)

	var box := VBoxContainer.new()
	box.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	box.position = Vector2(-200, -120)
	box.add_theme_constant_override("separation", 16)
	add_child(box)

	var medal_emoji := {"gold": "🥇", "silver": "🥈", "bronze": "🥉", "none": "—"}
	box.add_child(_big("Total:  " + _fmt(int(s.get("total_ms", 0))), 48, UITheme.GOLD))
	box.add_child(_big("Best Lap:  " + _fmt(int(s.get("best_lap_ms", 0))), 32, UITheme.TEXT))
	box.add_child(_big("Medal:  " + medal_emoji.get(s.get("medal", "none"), "—"), 40, UITheme.NEON))
	if s.get("record", false):
		var rec := _big("★ NEW RECORD! Ghost saved. ★", 30, UITheme.HOT)
		box.add_child(rec)
		var t := rec.create_tween().set_loops()
		t.tween_property(rec, "modulate:a", 0.3, 0.5)
		t.tween_property(rec, "modulate:a", 1.0, 0.5)

	_build_buttons()

func _build_buttons() -> void:
	var nav := HBoxContainer.new()
	nav.set_anchors_and_offsets_preset(Control.PRESET_BOTTOM_WIDE)
	nav.alignment = BoxContainer.ALIGNMENT_CENTER
	nav.add_theme_constant_override("separation", 24)
	nav.position.y -= 60
	add_child(nav)

	if GameManager.mode == GameManager.GameMode.GRAND_PRIX and not _is_gp_done():
		nav.add_child(UITheme.make_button("NEXT RACE ▶", _next_gp_race, true))
	else:
		nav.add_child(UITheme.make_button("RACE AGAIN", _race_again, true))
	nav.add_child(UITheme.make_button("MAIN MENU", func(): GameManager.goto_scene("main_menu"), true))

# ---------------------------------------------------------------------------

## A self-contained mini 3D view of one racer's kart+Ruggy, front-facing, on a
## floor so it can't fall. Embedded at the top of each podium card so the model
## always sits right above its own name — no fragile cross-alignment.
func _make_racer_view(rid: String, px: int) -> SubViewport:
	var vp := SubViewport.new()
	vp.size = Vector2i(px, px)
	vp.transparent_bg = true
	vp.own_world_3d = true
	vp.world_3d = World3D.new()
	vp.render_target_update_mode = SubViewport.UPDATE_ALWAYS

	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color(0, 0, 0, 0)
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color(0.66, 0.66, 0.76)
	env.ambient_light_energy = 1.3
	var cam := Camera3D.new()
	cam.environment = env
	cam.fov = 42.0
	vp.add_child(cam)
	cam.current = true
	cam.position = Vector3(0.7, 2.1, 5.4)
	cam.look_at(Vector3(0, 0.85, 0), Vector3.UP)
	var key := DirectionalLight3D.new()
	key.rotation_degrees = Vector3(-35, 25, 0)
	key.light_energy = 1.5
	vp.add_child(key)

	var fb := StaticBody3D.new()
	fb.collision_layer = 1
	var fs := CollisionShape3D.new()
	var fbox := BoxShape3D.new()
	fbox.size = Vector3(12, 1, 12)
	fs.shape = fbox
	fs.position = Vector3(0, -0.5, 0)
	fb.add_child(fs)
	vp.add_child(fb)

	var kart: Node3D = load("res://scenes/karts/Kart.tscn").instantiate()
	if kart is KartController:
		(kart as KartController).is_player = false
		(kart as KartController).control_locked = true
	vp.add_child(kart)
	if kart.has_method("apply_theme"):
		kart.call("apply_theme", rid, true)
	var c := kart.get_node_or_null("CameraRig/Camera3D")
	if c:
		(c as Camera3D).current = false
	kart.position = Vector3(0, 0.6, 0)
	kart.rotation.y = PI # face the camera (front toward the viewer)
	return vp

func _podium_card(r: Dictionary, place: int) -> Control:
	var v := VBoxContainer.new()
	v.alignment = BoxContainer.ALIGNMENT_END
	var col: Color = RacerDB.get_racer(r["racer_id"])["accent_color"]

	# 3D model of this racer, sitting directly above their card (1st is biggest).
	var view_px: int = {1: 300, 2: 240, 3: 210}.get(place, 210)
	var vp := _make_racer_view(r["racer_id"], view_px)
	add_child(vp) # SubViewport must be in the tree to render
	var view_tr := TextureRect.new()
	view_tr.texture = vp.get_texture()
	view_tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	view_tr.custom_minimum_size = Vector2(view_px, view_px)
	view_tr.mouse_filter = Control.MOUSE_FILTER_IGNORE
	v.add_child(view_tr)

	var panel := Panel.new()
	var heights := {1: 260, 2: 200, 3: 160}
	panel.custom_minimum_size = Vector2(200, heights.get(place, 160))
	var sb := StyleBoxFlat.new()
	sb.bg_color = col.darkened(0.1)
	sb.set_corner_radius_all(12)
	panel.add_theme_stylebox_override("panel", sb)
	var medal := Label.new()
	medal.text = {1: "🥇", 2: "🥈", 3: "🥉"}.get(place, "")
	medal.add_theme_font_size_override("font_size", 48)
	medal.set_anchors_and_offsets_preset(Control.PRESET_CENTER_TOP)
	panel.add_child(medal)
	var nm := Label.new()
	nm.text = r["name"]
	nm.add_theme_font_size_override("font_size", 20)
	nm.set_anchors_and_offsets_preset(Control.PRESET_BOTTOM_WIDE)
	nm.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	panel.add_child(nm)
	v.add_child(panel)
	if place == 1:
		var fl := Label.new()
		fl.text = FLAVOR.get(r["racer_id"], "")
		fl.add_theme_color_override("font_color", UITheme.GOLD)
		fl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		fl.custom_minimum_size = Vector2(200, 0)
		v.add_child(fl)
	return v

func _headline(placement: int) -> String:
	match placement:
		1: return "YOU RUGGED THEM! 🏆"
		2, 3: return "ON THE PODIUM!"
		_: return "GET REKT — TRY AGAIN"

func _next_gp_race() -> void:
	if GameManager.advance_grand_prix():
		GameManager.start_race()
	else:
		GameManager.goto_scene("main_menu")

func _race_again() -> void:
	GameManager.start_race()

func _is_gp_done() -> bool:
	var cup := RacerDB.get_cup(GameManager.cup_id)
	return GameManager.gp_track_index >= cup["tracks"].size() - 1

func _player_result() -> Dictionary:
	for r in _results:
		if r["is_player"]:
			return r
	return _results[0] if not _results.is_empty() else {"placement": 1, "name": "Ruggy"}

func _big(text: String, size: int, color: Color) -> Label:
	var l := Label.new()
	l.text = text
	l.add_theme_font_size_override("font_size", size)
	l.add_theme_color_override("font_color", color)
	return l

func _fmt(ms: int) -> String:
	var total := ms / 1000.0
	return "%d:%05.2f" % [int(total) / 60, fmod(total, 60.0)]
