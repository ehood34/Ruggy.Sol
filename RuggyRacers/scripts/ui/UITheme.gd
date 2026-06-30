extends RefCounted
class_name UITheme
## Shared helpers so every code-built menu has a consistent, premium look.
## When you design a real Theme resource in the editor, assign it on each menu
## root and these helpers become optional.

const BG_DARK := Color(0.06, 0.04, 0.13)
const BG_PANEL := Color(0.11, 0.08, 0.20, 0.92)
const GOLD := Color(1.0, 0.72, 0.0)
const HOT := Color(1.0, 0.25, 0.45)
const NEON := Color(0.30, 0.65, 1.0)
const TEXT := Color(0.95, 0.95, 1.0)

static func fullscreen_bg(parent: Node, top: Color = BG_DARK, bottom: Color = Color(0.12, 0.05, 0.22)) -> void:
	var grad := GradientTexture2D.new()
	grad.gradient = Gradient.new()
	grad.gradient.set_color(0, top)
	grad.gradient.set_color(1, bottom)
	grad.fill_from = Vector2(0, 0)
	grad.fill_to = Vector2(0, 1)
	var tr := TextureRect.new()
	tr.texture = grad
	tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	tr.stretch_mode = TextureRect.STRETCH_SCALE
	tr.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	parent.add_child(tr)

static func make_title(text: String, size: int = 72) -> Label:
	var l := Label.new()
	l.text = text
	l.add_theme_font_size_override("font_size", size)
	l.add_theme_color_override("font_color", GOLD)
	l.add_theme_color_override("font_outline_color", Color(0.6, 0.1, 0.0))
	l.add_theme_constant_override("outline_size", 8)
	return l

static func make_button(text: String, callback: Callable, big: bool = false) -> Button:
	var b := Button.new()
	b.text = text
	b.add_theme_font_size_override("font_size", 28 if big else 22)
	b.custom_minimum_size = Vector2(360, 64 if big else 48)
	b.pressed.connect(callback)
	b.focus_mode = Control.FOCUS_ALL
	# Light hover juice.
	b.mouse_entered.connect(func():
		AudioManager.play_sfx("ui_move")
		var t := b.create_tween()
		t.tween_property(b, "scale", Vector2(1.05, 1.05), 0.08))
	b.mouse_exited.connect(func():
		var t := b.create_tween()
		t.tween_property(b, "scale", Vector2.ONE, 0.08))
	return b
