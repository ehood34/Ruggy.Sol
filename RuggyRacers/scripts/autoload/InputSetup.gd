extends Node
## InputSetup (autoload singleton)
##
## Registers every gameplay input action AT RUNTIME via the InputMap API.
##
## Why in code instead of project.godot? The serialized InputEvent format in
## project.godot is fiddly and easy to get wrong (a malformed [input] block
## silently yields actions with zero bound events — the kart then never moves
## even though the action "exists"). Building the map here is reliable, works
## the same on every Godot 4.x version, and is unit-testable headless.
##
## Split-screen note: per-player actions (e.g. "accelerate_p2") can be added
## here too; KartController._gather_input already accepts an action suffix.

# action_name -> { keys:[KEY_*], buttons:[JOY_BUTTON_*],
#                  axes:[[JOY_AXIS_*, dir]], deadzone:float }
const ACTIONS := {
	"accelerate": {
		"keys": [KEY_W, KEY_UP],
		"buttons": [JOY_BUTTON_A],
		"axes": [[JOY_AXIS_TRIGGER_RIGHT, 1.0]],
		"deadzone": 0.2,
	},
	"brake": {
		"keys": [KEY_S, KEY_DOWN],
		"buttons": [JOY_BUTTON_B],
		"axes": [[JOY_AXIS_TRIGGER_LEFT, 1.0]],
		"deadzone": 0.2,
	},
	"steer_left": {
		"keys": [KEY_A, KEY_LEFT],
		"buttons": [],
		"axes": [[JOY_AXIS_LEFT_X, -1.0]],
		"deadzone": 0.3,
	},
	"steer_right": {
		"keys": [KEY_D, KEY_RIGHT],
		"buttons": [],
		"axes": [[JOY_AXIS_LEFT_X, 1.0]],
		"deadzone": 0.3,
	},
	"drift": {
		"keys": [KEY_SPACE, KEY_SHIFT],
		"buttons": [JOY_BUTTON_RIGHT_SHOULDER],
		"axes": [],
		"deadzone": 0.5,
	},
	"use_item": {
		"keys": [KEY_L, KEY_E],
		"buttons": [JOY_BUTTON_X],
		"axes": [],
		"deadzone": 0.5,
	},
	"look_back": {
		"keys": [KEY_C],
		"buttons": [JOY_BUTTON_Y],
		"axes": [],
		"deadzone": 0.5,
	},
	"pause": {
		"keys": [KEY_ESCAPE],
		"buttons": [JOY_BUTTON_START],
		"axes": [],
		"deadzone": 0.5,
	},
	"ui_restart": {
		"keys": [KEY_R],
		"buttons": [],
		"axes": [],
		"deadzone": 0.5,
	},
}

func _ready() -> void:
	_install()

func _install() -> void:
	for action_name in ACTIONS:
		var cfg: Dictionary = ACTIONS[action_name]
		# Create the action fresh so any malformed/empty version is replaced.
		if InputMap.has_action(action_name):
			InputMap.action_erase_events(action_name)
		else:
			InputMap.add_action(action_name)
		InputMap.action_set_deadzone(action_name, cfg.get("deadzone", 0.5))

		for kc in cfg["keys"]:
			var ek := InputEventKey.new()
			ek.physical_keycode = kc # physical = layout-independent (WASD works on AZERTY)
			InputMap.action_add_event(action_name, ek)

		for b in cfg["buttons"]:
			var eb := InputEventJoypadButton.new()
			eb.button_index = b
			InputMap.action_add_event(action_name, eb)

		for axis_def in cfg["axes"]:
			var em := InputEventJoypadMotion.new()
			em.axis = axis_def[0]
			em.axis_value = axis_def[1]
			InputMap.action_add_event(action_name, em)
