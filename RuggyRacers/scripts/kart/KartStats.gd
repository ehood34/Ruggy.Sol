extends Resource
class_name KartStats
## Per-racer tuning derived from RacerDB's 1..10 design stats.
##
## Keeping the conversion in one place means designers tweak readable 1..10
## numbers in RacerDB and the physics stay coherent. KartController reads these
## fields directly. All speeds are in metres/second (1 unit = 1 metre).

@export var max_speed: float = 38.0          # forward top speed
@export var reverse_speed: float = 10.0
@export var accel: float = 22.0              # m/s^2 toward max_speed
@export var brake: float = 34.0
@export var turn_speed: float = 2.6          # rad/s base steering rate
@export var grip: float = 9.0                # how fast lateral velocity is killed (higher = less slide)
@export var weight: float = 1.0              # ramming authority + knockback resistance (0.4..1.6)
@export var drift_turn_bonus: float = 1.5    # extra steer multiplier while drifting
@export var air_control: float = 1.0         # mid-air tilt/steer authority multiplier
@export var jump_power: float = 7.0          # hop/ramp launch strength multiplier
@export var luck: float = 1.0                # ItemSystem roll weighting
@export var trait_id: String = "balanced"

## Builds a KartStats from a RacerDB racer id.
static func from_racer(racer_id: String) -> KartStats:
	var r: Dictionary = RacerDB.get_racer(racer_id)
	var s: Dictionary = r["stats"]
	var ks := KartStats.new()
	# Normalize 1..10 -> 0..1 for interpolation.
	var spd := float(s["speed"]) / 10.0
	var acc := float(s["accel"]) / 10.0
	var hand := float(s["handling"]) / 10.0
	var wt := float(s["weight"]) / 10.0

	ks.max_speed   = lerpf(30.0, 46.0, spd)
	ks.accel       = lerpf(16.0, 30.0, acc)
	ks.brake       = 34.0
	ks.turn_speed  = lerpf(2.0, 3.2, hand)
	ks.grip        = lerpf(6.5, 11.0, hand)        # better handling = more grip / less wash-out
	ks.weight      = lerpf(0.55, 1.6, wt)
	ks.drift_turn_bonus = 1.5
	ks.air_control = 1.0
	ks.jump_power  = 7.0
	ks.luck        = 1.0
	ks.trait_id    = r.get("trait_id", "balanced")

	# --- Signature trait modifiers (the flavor that makes each racer feel unique) ---
	match ks.trait_id:
		"fragile_speed": # Banned: blazing top end, twitchy grip
			ks.max_speed += 3.0
			ks.grip *= 0.78
		"air_master":    # Moon: owns the air, floatier
			ks.air_control = 1.8
			ks.jump_power = 9.5
		"heavy_brawler": # Golden: tank
			ks.weight = 1.7
			ks.grip += 1.0
		"aggressive":    # Trench: punchy accel + ramming
			ks.accel += 3.0
			ks.weight += 0.15
		"lucky":         # Lotto: item luck
			ks.luck = 1.6
		_:
			pass
	return ks
