extends Control
## MainMenu — the hub. Buttons route through GameManager. The background is a
## placeholder gradient + drifting particles; drop the cover scene / a looping
## render here for the real "racers flying past" intro.

func _ready() -> void:
	AudioManager.play_music("menu")
	UITheme.fullscreen_bg(self)
	_add_drifting_particles()

	var center := VBoxContainer.new()
	center.alignment = BoxContainer.ALIGNMENT_CENTER
	center.add_theme_constant_override("separation", 14)
	center.set_anchors_and_offsets_preset(Control.PRESET_CENTER_LEFT)
	center.position = Vector2(120, 0)
	add_child(center)

	var title := UITheme.make_title("RUGGY\nRACERS", 96)
	center.add_child(title)

	var spacer := Control.new()
	spacer.custom_minimum_size = Vector2(0, 30)
	center.add_child(spacer)

	center.add_child(UITheme.make_button("SINGLE PLAYER (Grand Prix)", _on_grand_prix, true))
	center.add_child(UITheme.make_button("QUICK RACE", _on_quick_race, true))
	center.add_child(UITheme.make_button("LOCAL VS (Split-Screen)", _on_local_vs, true))
	center.add_child(UITheme.make_button("TOURNAMENT", _on_tournament, true))
	center.add_child(UITheme.make_button("SPEEDRUN MODE", _on_speedrun, true))
	center.add_child(UITheme.make_button("RUGGY'S GARAGE", func(): GameManager.goto_scene("garage"), true))
	center.add_child(UITheme.make_button("OPTIONS", func(): GameManager.goto_scene("options"), true))
	center.add_child(UITheme.make_button("QUIT", func(): get_tree().quit(), true))

	var tag := Label.new()
	tag.text = "AVAILABLE NOW ON ALL MAJOR PLATFORMS  •  v0.1"
	tag.add_theme_color_override("font_color", Color(0.7, 0.7, 0.85))
	tag.set_anchors_and_offsets_preset(Control.PRESET_BOTTOM_WIDE)
	tag.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	tag.position.y -= 30
	add_child(tag)

# Each mode routes to character select first; the chosen mode is stashed so the
# downstream menus know how to configure the race.
func _on_grand_prix() -> void: _route("grand_prix")
func _on_quick_race() -> void: _route("quick_race")
func _on_local_vs() -> void: _route("local_vs")
func _on_tournament() -> void: _route("tournament")
func _on_speedrun() -> void: _route("speedrun")

func _route(intent: String) -> void:
	AudioManager.play_sfx("ui_confirm")
	GameManager.set_meta("menu_intent", intent)
	GameManager.goto_scene("character_select")

func _add_drifting_particles() -> void:
	var p := CPUParticles2D.new()
	p.amount = 60
	p.lifetime = 6.0
	p.position = Vector2(800, 1000)
	p.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	p.emission_rect_extents = Vector2(900, 20)
	p.direction = Vector2(0, -1)
	p.gravity = Vector2(0, -30)
	p.initial_velocity_min = 20.0
	p.initial_velocity_max = 60.0
	p.scale_amount_min = 1.0
	p.scale_amount_max = 4.0
	p.color = Color(1.0, 0.7, 0.1, 0.5)
	add_child(p)
