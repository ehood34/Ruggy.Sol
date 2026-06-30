extends Control
## Boot — first scene loaded (set as main scene in project.godot). Gives the
## autoloads a frame to initialize, shows a quick splash, then jumps to the menu.
## Replace the label with the fiery "RUGGY RACERS" logo art when available.

func _ready() -> void:
	var bg := ColorRect.new()
	bg.color = Color(0.05, 0.03, 0.12)
	bg.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(bg)

	var title := Label.new()
	title.text = "RUGGY RACERS"
	title.add_theme_font_size_override("font_size", 84)
	title.add_theme_color_override("font_color", Color(1.0, 0.6, 0.0))
	title.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	add_child(title)

	var sub := Label.new()
	sub.text = "loading the degeneracy..."
	sub.add_theme_color_override("font_color", Color(0.7, 0.7, 0.8))
	sub.position = Vector2(0, 80)
	sub.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	sub.position.y += 70
	add_child(sub)

	await get_tree().create_timer(0.8).timeout
	GameManager.goto_scene("main_menu")
