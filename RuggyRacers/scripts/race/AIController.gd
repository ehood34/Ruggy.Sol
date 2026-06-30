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

const LOOKAHEAD := 10.0              # metres ahead on the line to aim at (tighter following)
const WP_REACH := 7.0                # how close counts as "reached" a waypoint
const CURVE_WINDOW := 6              # waypoints ahead to measure upcoming curvature
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

	# Steering: signed angle to the aim point, with a strong gain (full lock by
	# ~40 degrees) so the AI actually commits to corners instead of wall-riding.
	var fwd := -kart.global_transform.basis.z
	fwd.y = 0.0
	# NOTE the minus: _signed_angle is positive when the target is to the LEFT,
	# but KartController's steer convention is positive == turn RIGHT. Without
	# this negation the AI steers away from every corner and drives off-track.
	var ang := _signed_angle(fwd, to_aim)
	var steer := clampf(-ang / deg_to_rad(40.0) + personality * 0.2, -1.0, 1.0)

	# Upcoming curvature over the next several waypoints (radians of total bend).
	var curve := _path_curvature(CURVE_WINDOW)

	# Target speed: full on straights, scaled down for bends so the AI brakes
	# BEFORE the corner rather than plowing into the outside wall.
	var corner_factor := clampf(1.0 - maxf(0.0, curve - 0.5) * 0.55, 0.6, 1.0)
	var target_ratio := clampf(difficulty, 0.6, 1.4) * corner_factor
	target_ratio += clampf(leader_distance_ahead / 120.0, -0.15, 0.25) # rubber-band
	var target_speed := kart.stats.max_speed * target_ratio
	var cur_speed := kart.get_speed_kmh() / 3.6

	var throttle := 1.0
	if cur_speed > target_speed * 1.3:
		throttle = -0.25                # well over: light brake into the corner
	elif cur_speed > target_speed:
		throttle = 0.15                 # slightly over: ease off
	var want_drift := curve > 0.9 and absf(steer) > 0.4 and cur_speed > kart.stats.max_speed * 0.55

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

## Total bend (radians) summed over the next `n` segments from wp_index — a
## measure of how sharp the upcoming stretch is, used to set corner speed.
func _path_curvature(n: int) -> float:
	var w := waypoints.size()
	if w < 3:
		return 0.0
	var total := 0.0
	var idx := wp_index
	for _i in n:
		var a := waypoints[idx]
		var b := waypoints[(idx + 1) % w]
		var c := waypoints[(idx + 2) % w]
		var v1 := (b - a); v1.y = 0.0
		var v2 := (c - b); v2.y = 0.0
		if v1.length() > 0.01 and v2.length() > 0.01:
			total += absf(v1.normalized().angle_to(v2.normalized()))
		idx = (idx + 1) % w
	return total

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
