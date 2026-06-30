extends Node
class_name AIController
## AIController — drives a KartController by implementing the input-provider
## interface: get_kart_input(kart) -> {steer, throttle, drift, item}.
##
## It follows the track's ordered waypoints (a Path3D curve baked into points,
## or Marker3D nodes in group "ai_waypoints"). Steering aims at a look-ahead
## point; it drifts through sharp corners and fires items on a timer.
##
## Rubber-banding: target speed is scaled by `difficulty` AND by how far the AI
## is from the human leader — fair-feeling catch-up without teleporting.
##
## How to extend:
##   - Tune LOOKAHEAD / corner thresholds for tighter or sloppier lines.
##   - Provide multiple racing lines (inside/outside) per waypoint for variety.

var kart: KartController
var difficulty: float = 1.0          # 0.7..1.3 from GameManager
var waypoints: PackedVector3Array = PackedVector3Array()
var wp_index: int = 0
var personality: float = 0.0         # -0.15..0.15 steer/throttle jitter seed

# Rubber-band reference, set each frame by RaceManager.
var leader_distance_ahead: float = 0.0 # metres the human leader is ahead of us
var race_position: int = 1

const LOOKAHEAD := 14.0              # metres ahead on the line to aim at
const WP_REACH := 9.0                # how close counts as "reached" a waypoint
const DRIFT_ANGLE := 0.55           # radians of upcoming turn that triggers drift
const ITEM_MIN_DELAY := 1.5
const ITEM_MAX_DELAY := 4.0

var _item_timer: float = 0.0

func setup(p_kart: KartController, p_difficulty: float, p_waypoints: PackedVector3Array) -> void:
	kart = p_kart
	difficulty = p_difficulty
	waypoints = p_waypoints
	personality = randf_range(-0.15, 0.15)
	_item_timer = randf_range(ITEM_MIN_DELAY, ITEM_MAX_DELAY)
	# Snap our starting waypoint to the nearest point ahead.
	wp_index = _nearest_waypoint(kart.global_position)
	kart.set_input_provider(self)

func get_kart_input(_k: KartController) -> Dictionary:
	if waypoints.is_empty():
		return {"steer": 0.0, "throttle": 1.0, "drift": false, "item": false}

	_advance_waypoint()
	var aim := _lookahead_point()
	var to_aim := aim - kart.global_position
	to_aim.y = 0.0

	# Steering: signed angle between our forward and the aim direction.
	var fwd := -kart.global_transform.basis.z
	fwd.y = 0.0
	var steer := _signed_angle(fwd, to_aim) / (PI * 0.5) # normalize to ~-1..1
	steer = clampf(steer + personality * 0.3, -1.0, 1.0)

	# Decide whether to drift: look two waypoints ahead for a sharp bend.
	var bend := _upcoming_bend()
	var want_drift := bend > DRIFT_ANGLE and absf(steer) > 0.35

	# Throttle / target speed with rubber-banding.
	var target_ratio := clampf(difficulty, 0.5, 1.4)
	# Catch up if far behind the leader, ease off if way ahead.
	target_ratio += clampf(leader_distance_ahead / 120.0, -0.15, 0.25)
	# Slow slightly for very sharp corners so the AI doesn't wall-ride.
	if bend > DRIFT_ANGLE * 1.6:
		target_ratio *= 0.82
	var throttle := 1.0
	if kart.get_speed_kmh() / 3.6 > kart.stats.max_speed * target_ratio:
		throttle = 0.2 # coast down toward the rubber-banded target

	# Item use on a timer; the AI isn't tactical, just keeps the chaos flowing.
	var use_item := false
	_item_timer -= get_process_delta_time()
	if _item_timer <= 0.0:
		var isys := kart.get_node_or_null("ItemSystem")
		if isys and isys.has_method("has_item") and isys.has_item():
			use_item = true
			_item_timer = randf_range(ITEM_MIN_DELAY, ITEM_MAX_DELAY)
		else:
			_item_timer = 0.5

	return {
		"steer": steer,
		"throttle": throttle,
		"drift": want_drift,
		"item": use_item,
	}

# ---------------------------------------------------------------------------

func _advance_waypoint() -> void:
	var here := kart.global_position
	if here.distance_to(waypoints[wp_index]) < WP_REACH:
		wp_index = (wp_index + 1) % waypoints.size()

func _lookahead_point() -> Vector3:
	# Walk forward along the line accumulating LOOKAHEAD metres for a smooth aim.
	var remaining := LOOKAHEAD
	var idx := wp_index
	var prev := kart.global_position
	for _i in waypoints.size():
		var wp := waypoints[idx]
		var d := prev.distance_to(wp)
		if d >= remaining:
			return prev.lerp(wp, remaining / max(0.001, d))
		remaining -= d
		prev = wp
		idx = (idx + 1) % waypoints.size()
	return waypoints[wp_index]

func _upcoming_bend() -> float:
	# Angle between the segment we're on and the next segment.
	var a := waypoints[wp_index]
	var b := waypoints[(wp_index + 1) % waypoints.size()]
	var c := waypoints[(wp_index + 2) % waypoints.size()]
	var v1 := (b - a); v1.y = 0.0
	var v2 := (c - b); v2.y = 0.0
	if v1.length() < 0.01 or v2.length() < 0.01:
		return 0.0
	return absf(v1.normalized().angle_to(v2.normalized()))

func _nearest_waypoint(pos: Vector3) -> int:
	if waypoints.is_empty():
		return 0
	var best := 0
	var best_d := INF
	for i in waypoints.size():
		var d := pos.distance_to(waypoints[i])
		if d < best_d:
			best_d = d
			best = i
	return (best + 1) % waypoints.size()

func _signed_angle(from: Vector3, to: Vector3) -> float:
	if from.length() < 0.001 or to.length() < 0.001:
		return 0.0
	var a := from.normalized()
	var b := to.normalized()
	var ang := a.angle_to(b)
	# Sign via cross product Y component (we're on a flattened plane).
	return ang if a.cross(b).y >= 0.0 else -ang
