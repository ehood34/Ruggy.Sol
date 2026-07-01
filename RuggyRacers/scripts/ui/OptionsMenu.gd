extends Control
## OptionsMenu — volume sliders, fullscreen toggle, speed units, camera shake,
## and a "reset save" button. All changes persist immediately via SaveManager.

func _ready() -> void:
	UITheme.fullscreen_bg(self)
	var title := UITheme.make_title("OPTIONS", 56)
	title.set_anchors_and_offsets_preset(Control.PRESET_TOP_WIDE)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.position.y = 30
	add_child(title)

	var box := VBoxContainer.new()
	box.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	box.position = Vector2(-300, -150)
	box.add_theme_constant_override("separation", 18)
	add_child(box)

	box.add_child(_slider("Master Volume", "master_volume"))
	box.add_child(_slider("Music Volume", "music_volume"))
	box.add_child(_slider("SFX Volume", "sfx_volume"))
	box.add_child(_slider("Camera Shake", "camera_shake"))

	box.add_child(_toggle("Fullscreen", "fullscreen", func(v):
		DisplayServer.window_set_mode(
			DisplayServer.WINDOW_MODE_FULLSCREEN if v else DisplayServer.WINDOW_MODE_WINDOWED)))
	box.add_child(_choice("Speed Units", "speed_units", ["kmh", "mph"]))

	var reset := UITheme.make_button("Reset All Progress", func():
		SaveManager.reset_save()
		AudioManager.play_sfx("ui_back"))
	box.add_child(reset)

	var back := UITheme.make_button("Back", func():
		GameManager.goto_scene("main_menu"))
	back.position = Vector2(40, 820)
	add_child(back)

func _slider(label: String, key: String) -> Control:
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 16)
	var nm := Label.new(); nm.text = label; nm.custom_minimum_size = Vector2(240, 0)
	nm.add_theme_color_override("font_color", UITheme.TEXT)
	row.add_child(nm)
	var s := HSlider.new()
	s.min_value = 0.0; s.max_value = 1.0; s.step = 0.05
	s.value = float(SaveManager.get_setting(key, 1.0))
	s.custom_minimum_size = Vector2(320, 0)
	s.value_changed.connect(func(v):
		SaveManager.set_setting(key, v)
		AudioManager.apply_volume_settings())
	row.add_child(s)
	return row

func _toggle(label: String, key: String, on_change: Callable) -> Control:
	var b := CheckButton.new()
	b.text = label
	b.button_pressed = bool(SaveManager.get_setting(key, false))
	b.toggled.connect(func(v):
		SaveManager.set_setting(key, v)
		on_change.call(v))
	return b

func _choice(label: String, key: String, options: Array) -> Control:
	var row := HBoxContainer.new()
	var nm := Label.new(); nm.text = label; nm.custom_minimum_size = Vector2(240, 0)
	nm.add_theme_color_override("font_color", UITheme.TEXT)
	row.add_child(nm)
	var ob := OptionButton.new()
	for o in options:
		ob.add_item(String(o).to_upper())
	ob.selected = max(0, options.find(SaveManager.get_setting(key, options[0])))
	ob.item_selected.connect(func(i): SaveManager.set_setting(key, options[i]))
	row.add_child(ob)
	return row
