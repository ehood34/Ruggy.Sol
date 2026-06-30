extends Control
## CharacterSelect — horizontal carousel of all 6 racers with a big preview,
## stat bars (Speed / Acceleration / Handling / Weight), flavor bio and the
## signature trait. Locked racers show a padlock. Confirm routes onward based
## on the menu intent stashed by MainMenu.
##
## The "3D preview" is a placeholder portrait panel tinted with the racer's
## colors. Replace `_build_preview()` with a SubViewport rendering the actual
## character + kart scene for the real thing (see README "Character preview").

var _index: int = 0
var _intent: String = "quick_race"
var _preview_panel: Panel
var _name_label: Label
var _vehicle_label: Label
var _bio_label: Label
var _trait_label: Label
var _stat_bars: Dictionary = {}
var _lock_label: Label

# Live 3D preview (SubViewport renders the selected kart + Ruggy).
var _preview_vp: SubViewport
var _preview_cam: Camera3D
var _preview_holder: Node3D     # spins; holds the instanced kart
var _preview_kart: Node3D

func _ready() -> void:
	_intent = GameManager.get_meta("menu_intent", "quick_race")
	UITheme.fullscreen_bg(self)
	_build_ui()
	# Start on the first unlocked racer.
	_index = 0
	for i in RacerDB.RACER_ORDER.size():
		if SaveManager.is_racer_unlocked(RacerDB.RACER_ORDER[i]):
			_index = i
			break
	_refresh()

func _build_ui() -> void:
	var title := UITheme.make_title("CHOOSE YOUR RUGGY", 56)
	title.set_anchors_and_offsets_preset(Control.PRESET_TOP_WIDE)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.position.y = 30
	add_child(title)

	# Big preview panel (left).
	_preview_panel = Panel.new()
	_preview_panel.custom_minimum_size = Vector2(560, 520)
	_preview_panel.position = Vector2(90, 150)
	add_child(_preview_panel)

	_build_preview3d()

	_name_label = Label.new()
	_name_label.add_theme_font_size_override("font_size", 44)
	_name_label.position = Vector2(20, 16)
	_preview_panel.add_child(_name_label)

	_vehicle_label = Label.new()
	_vehicle_label.add_theme_color_override("font_color", UITheme.NEON)
	_vehicle_label.position = Vector2(22, 70)
	_preview_panel.add_child(_vehicle_label)

	_lock_label = Label.new()
	_lock_label.text = "🔒 LOCKED"
	_lock_label.add_theme_font_size_override("font_size", 40)
	_lock_label.add_theme_color_override("font_color", UITheme.HOT)
	_lock_label.position = Vector2(180, 240)
	_preview_panel.add_child(_lock_label)

	# Info panel (right).
	var info := VBoxContainer.new()
	info.position = Vector2(720, 160)
	info.custom_minimum_size = Vector2(700, 500)
	info.add_theme_constant_override("separation", 12)
	add_child(info)

	_trait_label = Label.new()
	_trait_label.add_theme_font_size_override("font_size", 26)
	_trait_label.add_theme_color_override("font_color", UITheme.GOLD)
	_trait_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_trait_label.custom_minimum_size = Vector2(680, 0)
	info.add_child(_trait_label)

	_bio_label = Label.new()
	_bio_label.add_theme_color_override("font_color", UITheme.TEXT)
	_bio_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_bio_label.custom_minimum_size = Vector2(680, 90)
	info.add_child(_bio_label)

	# Stat bars.
	for stat in ["speed", "accel", "handling", "weight"]:
		var row := HBoxContainer.new()
		var nm := Label.new()
		nm.text = stat.capitalize()
		nm.custom_minimum_size = Vector2(160, 0)
		nm.add_theme_color_override("font_color", UITheme.TEXT)
		row.add_child(nm)
		var bar := ProgressBar.new()
		bar.max_value = 10
		bar.custom_minimum_size = Vector2(420, 26)
		bar.show_percentage = false
		_stat_bars[stat] = bar
		row.add_child(bar)
		info.add_child(row)

	# Navigation buttons.
	var nav := HBoxContainer.new()
	nav.position = Vector2(720, 560)
	nav.add_theme_constant_override("separation", 20)
	add_child(nav)
	nav.add_child(UITheme.make_button("◀ Prev", func(): _move(-1)))
	nav.add_child(UITheme.make_button("Next ▶", func(): _move(1)))

	var ready_btn := UITheme.make_button("READY!", _confirm, true)
	ready_btn.position = Vector2(1080, 700)
	add_child(ready_btn)

	var back := UITheme.make_button("Back", func():
		AudioManager.play_sfx("ui_back")
		GameManager.goto_scene("main_menu"))
	back.position = Vector2(40, 980)
	add_child(back)

func _move(dir: int) -> void:
	AudioManager.play_sfx("ui_move")
	_index = wrapi(_index + dir, 0, RacerDB.RACER_ORDER.size())
	_refresh()

func _refresh() -> void:
	var rid: String = RacerDB.RACER_ORDER[_index]
	var r := RacerDB.get_racer(rid)
	var unlocked := SaveManager.is_racer_unlocked(rid)

	_name_label.text = r["name"]
	_name_label.add_theme_color_override("font_color", r["accent_color"])
	_vehicle_label.text = "🏎  " + r["vehicle"]
	_trait_label.text = "★ " + r["trait_text"]
	_bio_label.text = r["bio"]
	_lock_label.visible = not unlocked

	# Tint the preview panel with the racer's colors as a stand-in for the model.
	var sb := StyleBoxFlat.new()
	sb.bg_color = r["fur_color"].darkened(0.2)
	sb.border_color = r["accent_color"]
	sb.set_border_width_all(6)
	sb.set_corner_radius_all(18)
	_preview_panel.add_theme_stylebox_override("panel", sb)

	var s: Dictionary = r["stats"]
	for stat in _stat_bars:
		(_stat_bars[stat] as ProgressBar).value = s[stat]
		var fill := StyleBoxFlat.new()
		fill.bg_color = r["accent_color"]
		fill.set_corner_radius_all(6)
		(_stat_bars[stat] as ProgressBar).add_theme_stylebox_override("fill", fill)

	_spawn_preview(rid)

# ---------------------------------------------------------------------------
# Live 3D preview
# ---------------------------------------------------------------------------

func _build_preview3d() -> void:
	_preview_vp = SubViewport.new()
	_preview_vp.size = Vector2i(540, 500)
	_preview_vp.transparent_bg = true
	_preview_vp.own_world_3d = true
	_preview_vp.world_3d = World3D.new()
	_preview_vp.render_target_update_mode = SubViewport.UPDATE_ALWAYS
	add_child(_preview_vp)

	# Ambient + key light so the model reads well against the transparent bg.
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color(0, 0, 0, 0)
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color(0.6, 0.6, 0.72)
	env.ambient_light_energy = 1.2
	_preview_cam = Camera3D.new()
	_preview_cam.environment = env
	_preview_cam.fov = 40.0
	_preview_vp.add_child(_preview_cam)
	_preview_cam.current = true
	var key := DirectionalLight3D.new()
	key.rotation_degrees = Vector3(-35, 35, 0)
	key.light_energy = 1.4
	_preview_vp.add_child(key)

	# A floor for the kart to rest on (so it can't fall out of frame), styled as
	# a little showroom turntable platform.
	var floor_body := StaticBody3D.new()
	floor_body.collision_layer = 1
	var fshape := CollisionShape3D.new()
	var fbox := BoxShape3D.new()
	fbox.size = Vector3(12, 1, 12)
	fshape.shape = fbox
	fshape.position = Vector3(0, -0.5, 0) # top surface at y=0
	floor_body.add_child(fshape)
	var fmesh := MeshInstance3D.new()
	var disc := CylinderMesh.new()
	disc.top_radius = 3.2
	disc.bottom_radius = 3.2
	disc.height = 0.3
	fmesh.mesh = disc
	fmesh.position = Vector3(0, -0.15, 0)
	var fmat := StandardMaterial3D.new()
	fmat.albedo_color = Color(0.14, 0.12, 0.22)
	fmat.metallic = 0.3
	fmat.roughness = 0.5
	fmesh.material_override = fmat
	floor_body.add_child(fmesh)
	_preview_vp.add_child(floor_body)

	_preview_holder = Node3D.new()
	_preview_vp.add_child(_preview_holder)

	# Show the viewport's render inside the panel, behind the text labels.
	var tr := TextureRect.new()
	tr.texture = _preview_vp.get_texture()
	tr.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	tr.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_preview_panel.add_child(tr)
	_preview_panel.move_child(tr, 0) # behind the labels added later

func _spawn_preview(rid: String) -> void:
	if _preview_holder == null:
		return
	if _preview_kart and is_instance_valid(_preview_kart):
		_preview_kart.queue_free()
		_preview_kart = null
	var packed := load("res://scenes/karts/Kart.tscn")
	if packed == null:
		return
	var kart: Node3D = packed.instantiate()
	# Display dummy: keep physics ON so it settles onto the floor, but lock its
	# controls so it just sits there (no input-driven driving in the menu).
	if kart is KartController:
		(kart as KartController).is_player = false
		(kart as KartController).control_locked = true
	_preview_holder.add_child(kart)
	# Mount models/tint. animate=false: the menu shows a static pose so a future
	# Mixamo clip's root motion can't drift the character out of frame here.
	if kart.has_method("apply_theme"):
		kart.call("apply_theme", rid, false)
	var cam := kart.get_node_or_null("CameraRig/Camera3D")
	if cam:
		(cam as Camera3D).current = false
	kart.position = Vector3(0, 0.6, 0) # drop in just above the floor and settle
	_preview_kart = kart

var _orbit_angle: float = 0.7

func _process(delta: float) -> void:
	# Orbit the camera around the kart (turntable) — the kart itself stays put on
	# the floor, so physics and the spin never fight.
	_orbit_angle += delta * 0.5
	var r := 4.2
	_preview_cam.position = Vector3(sin(_orbit_angle) * r, 1.7, cos(_orbit_angle) * r)
	_preview_cam.look_at(Vector3(0, 0.7, 0), Vector3.UP)

func _input(event: InputEvent) -> void:
	if event.is_action_pressed("steer_left"):
		_move(-1)
	elif event.is_action_pressed("steer_right"):
		_move(1)
	elif event.is_action_pressed("use_item") or event.is_action_pressed("drift"):
		_confirm()

func _confirm() -> void:
	var rid: String = RacerDB.RACER_ORDER[_index]
	if not SaveManager.is_racer_unlocked(rid):
		AudioManager.play_sfx("ui_back")
		return
	AudioManager.play_sfx("ui_confirm")
	# Stash the pick. For local_vs this would loop per player; single-player picks one.
	GameManager.player_racers = [rid]
	# Route based on intent.
	match _intent:
		"grand_prix", "tournament":
			GameManager.set_meta("config_mode", _intent)
			GameManager.goto_scene("track_select") # track select doubles as cup select
		_:
			GameManager.set_meta("config_mode", _intent)
			GameManager.goto_scene("track_select")
