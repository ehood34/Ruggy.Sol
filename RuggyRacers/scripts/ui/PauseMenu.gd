extends CanvasLayer
## PauseMenu — toggled by the "pause" action during a race. Add an instance of
## PauseMenu.tscn to each track scene (or to the HUD). Pausing sets the tree
## paused; this CanvasLayer runs in PROCESS_MODE_ALWAYS so it still responds.

var _panel: Control
var _open: bool = false

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	_build()
	_set_open(false)

func _build() -> void:
	_panel = Control.new()
	_panel.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(_panel)
	var dim := ColorRect.new()
	dim.color = Color(0, 0, 0, 0.6)
	dim.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_panel.add_child(dim)

	var box := VBoxContainer.new()
	box.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	box.position = Vector2(-180, -160)
	box.add_theme_constant_override("separation", 14)
	_panel.add_child(box)
	box.add_child(UITheme.make_title("PAUSED", 56))
	box.add_child(UITheme.make_button("Resume", func(): _set_open(false), true))
	box.add_child(UITheme.make_button("Restart Race", func():
		get_tree().paused = false
		GameManager.start_race(), true))
	box.add_child(UITheme.make_button("Quit to Menu", func():
		get_tree().paused = false
		GameManager.goto_scene("main_menu"), true))

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("pause"):
		_set_open(not _open)

func _set_open(v: bool) -> void:
	_open = v
	_panel.visible = v
	get_tree().paused = v
