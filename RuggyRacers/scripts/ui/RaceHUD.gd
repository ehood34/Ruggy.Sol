extends CanvasLayer
## RaceHUD — in-race overlay: speedometer, lap counter + position, item slot,
## drift/boost meter, mini-map, countdown and final-lap banner.
##
## It self-builds its widgets and binds to the player's kart + the RaceManager
## (RaceManager calls bind_kart()). For split-screen, instance one HUD per
## viewport and bind each to its player (see README).

var kart: KartController
var rm: RaceManager
var player_index: int = 0

# Widgets
var _speed_label: Label
var _pos_label: Label
var _lap_label: Label
var _item_panel: Panel
var _item_icon: Label
var _boost_bar: ProgressBar
var _countdown_label: Label
var _banner_label: Label
var _minimap: Control
var _minimap_pts: Array = []

func _ready() -> void:
	add_to_group("race_hud")
	_build()

func bind_kart(p_kart: KartController, p_rm: RaceManager, idx: int) -> void:
	kart = p_kart
	rm = p_rm
	player_index = idx
	# Hook signals for item + boost feedback and race events.
	var isys = kart.get_node_or_null("ItemSystem")
	if isys:
		isys.item_changed.connect(_on_item_changed)
	kart.drift_boost_released.connect(_on_boost)
	rm.countdown_tick.connect(_on_countdown)
	rm.final_lap.connect(_on_final_lap)
	rm.positions_updated.connect(_on_positions)
	rm.lap_changed.connect(_on_lap_changed)

func _build() -> void:
	# Speedometer (bottom-right).
	_speed_label = _mk_label(40, Color(0.6, 1.0, 0.8))
	_speed_label.set_anchors_and_offsets_preset(Control.PRESET_BOTTOM_RIGHT)
	_speed_label.position += Vector2(-220, -90)
	add_child(_speed_label)

	# Position + lap (top-left).
	_pos_label = _mk_label(56, UITheme.GOLD)
	_pos_label.position = Vector2(40, 30)
	add_child(_pos_label)
	_lap_label = _mk_label(34, UITheme.TEXT)
	_lap_label.position = Vector2(44, 110)
	add_child(_lap_label)

	# Item slot (top-center).
	_item_panel = Panel.new()
	_item_panel.custom_minimum_size = Vector2(110, 110)
	_item_panel.set_anchors_and_offsets_preset(Control.PRESET_CENTER_TOP)
	_item_panel.position = Vector2(-55, 24)
	add_child(_item_panel)
	_item_icon = _mk_label(56, UITheme.TEXT)
	_item_icon.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	_item_icon.position = Vector2(-20, -36)
	_item_panel.add_child(_item_icon)

	# Boost / drift charge meter (bottom-center).
	_boost_bar = ProgressBar.new()
	_boost_bar.max_value = 1.0
	_boost_bar.show_percentage = false
	_boost_bar.custom_minimum_size = Vector2(300, 18)
	_boost_bar.set_anchors_and_offsets_preset(Control.PRESET_CENTER_BOTTOM)
	_boost_bar.position = Vector2(-150, -40)
	add_child(_boost_bar)

	# Countdown / banner (center).
	_countdown_label = _mk_label(140, UITheme.HOT)
	_countdown_label.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	_countdown_label.position = Vector2(-60, -120)
	_countdown_label.visible = false
	add_child(_countdown_label)

	_banner_label = _mk_label(64, UITheme.GOLD)
	_banner_label.set_anchors_and_offsets_preset(Control.PRESET_CENTER_TOP)
	_banner_label.position = Vector2(-200, 160)
	_banner_label.visible = false
	add_child(_banner_label)

	# Mini-map (top-right): a simple dot map drawn each frame.
	_minimap = Control.new()
	_minimap.custom_minimum_size = Vector2(220, 220)
	_minimap.set_anchors_and_offsets_preset(Control.PRESET_TOP_RIGHT)
	_minimap.position = Vector2(-240, 30)
	_minimap.draw.connect(_draw_minimap)
	add_child(_minimap)

func _process(_delta: float) -> void:
	if kart == null:
		return
	var units: String = SaveManager.get_setting("speed_units", "kmh")
	var spd := kart.get_speed_kmh()
	if units == "mph":
		_speed_label.text = "%3d MPH" % int(spd * 0.621)
	else:
		_speed_label.text = "%3d KM/H" % int(spd)
	# Boost meter shows drift charge while drifting, else current boost timer.
	if kart.is_drifting:
		_boost_bar.value = kart.get_drift_charge_ratio()
		_tint_boost(kart.current_drift_tier())
	else:
		_boost_bar.value = clampf(kart.boost_time, 0.0, 1.0)
		_tint_boost(0)
	_minimap.queue_redraw()

# --- Signal handlers --------------------------------------------------------

func _on_item_changed(item_id: String) -> void:
	var isys = kart.get_node_or_null("ItemSystem")
	_item_icon.text = isys.get_held_icon() if isys else ""
	if item_id != "" and item_id != "rolling":
		# Pop animation.
		var t := _item_panel.create_tween()
		_item_panel.scale = Vector2(1.4, 1.4)
		t.tween_property(_item_panel, "scale", Vector2.ONE, 0.2)

func _on_boost(tier: int) -> void:
	# Camera FOV kick for boost juice.
	var rig := kart.get_node_or_null("CameraRig")
	var cam := rig.get_node_or_null("Camera3D") if rig else null
	if cam:
		var t := cam.create_tween()
		cam.fov = 80.0 + tier * 4.0
		t.tween_property(cam, "fov", 70.0, 0.5)

func _on_countdown(value: int) -> void:
	_countdown_label.visible = true
	_countdown_label.text = "GO!" if value <= 0 else str(value)
	_countdown_label.scale = Vector2(1.6, 1.6)
	var t := _countdown_label.create_tween()
	t.tween_property(_countdown_label, "scale", Vector2.ONE, 0.4)
	if value <= 0:
		t.tween_interval(0.6)
		t.tween_property(_countdown_label, "modulate:a", 0.0, 0.3)
		t.tween_callback(func(): _countdown_label.visible = false; _countdown_label.modulate.a = 1.0)

func _on_final_lap() -> void:
	_flash_banner("FINAL LAP!")

func _on_lap_changed(_racer: Node, lap: int) -> void:
	if lap <= GameManager.laps:
		_lap_label.text = "LAP %d/%d" % [lap, GameManager.laps]

func _on_positions(ordered: Array) -> void:
	for i in ordered.size():
		if ordered[i]["kart"] == kart:
			_pos_label.text = "%d%s" % [i + 1, _ordinal(i + 1)]
			break
	if _lap_label.text == "":
		_lap_label.text = "LAP 1/%d" % GameManager.laps

func _flash_banner(text: String) -> void:
	_banner_label.text = text
	_banner_label.visible = true
	_banner_label.modulate.a = 1.0
	var t := _banner_label.create_tween()
	t.tween_interval(1.5)
	t.tween_property(_banner_label, "modulate:a", 0.0, 0.6)
	t.tween_callback(func(): _banner_label.visible = false)

# --- Mini-map ---------------------------------------------------------------

func _draw_minimap() -> void:
	if rm == null:
		return
	# Background.
	_minimap.draw_rect(Rect2(0, 0, 220, 220), Color(0, 0, 0, 0.4))
	# Compute bounds from checkpoints to scale world -> map.
	if rm.checkpoints.is_empty():
		return
	var minx := INF; var minz := INF; var maxx := -INF; var maxz := -INF
	for c in rm.checkpoints:
		var p: Vector3 = (c as Node3D).global_position
		minx = min(minx, p.x); maxx = max(maxx, p.x)
		minz = min(minz, p.z); maxz = max(maxz, p.z)
	var w := maxx - minx + 0.001
	var h := maxz - minz + 0.001
	var scale := 200.0 / maxf(w, h)
	var off := Vector2(10, 10)
	# Track outline.
	var prev := Vector2.ZERO
	for i in rm.checkpoints.size():
		var p: Vector3 = (rm.checkpoints[i] as Node3D).global_position
		var pt := Vector2((p.x - minx) * scale, (p.z - minz) * scale) + off
		if i > 0:
			_minimap.draw_line(prev, pt, Color(0.5, 0.5, 0.6), 2.0)
		prev = pt
	# Racer dots.
	for e in rm.racers:
		var p: Vector3 = (e["kart"] as Node3D).global_position
		var pt := Vector2((p.x - minx) * scale, (p.z - minz) * scale) + off
		var col: Color = UITheme.GOLD if e["is_player"] else Color(0.9, 0.3, 0.3)
		_minimap.draw_circle(pt, 5.0 if e["is_player"] else 4.0, col)

# --- helpers ----------------------------------------------------------------

func _mk_label(size: int, color: Color) -> Label:
	var l := Label.new()
	l.add_theme_font_size_override("font_size", size)
	l.add_theme_color_override("font_color", color)
	l.add_theme_color_override("font_outline_color", Color.BLACK)
	l.add_theme_constant_override("outline_size", 6)
	return l

func _tint_boost(tier: int) -> void:
	var c := UITheme.NEON
	match tier:
		1: c = Color(0.3, 0.6, 1.0)
		2: c = Color(1.0, 0.55, 0.1)
		3: c = Color(0.8, 0.3, 1.0)
	var sb := StyleBoxFlat.new()
	sb.bg_color = c
	sb.set_corner_radius_all(8)
	_boost_bar.add_theme_stylebox_override("fill", sb)

func _ordinal(n: int) -> String:
	match n:
		1: return "st"
		2: return "nd"
		3: return "rd"
		_: return "th"
