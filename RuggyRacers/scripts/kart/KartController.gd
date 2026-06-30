extends CharacterBody3D
class_name KartController
## KartController — the core arcade kart physics.
##
## Design goals (in priority order):
##   1. Feel GREAT instantly: snappy throttle, weighty drift, satisfying boost.
##   2. Forgiving in the air with real mid-air control.
##   3. Data-driven per racer via KartStats so all 6 feel distinct.
##
## This is deliberately NOT a realistic vehicle sim. We keep velocity simple:
##   - A scalar `forward_speed` along the kart's facing.
##   - A small `lateral_speed` that the drift system bleeds in and grip kills.
##   - Gravity handled separately while airborne.
## This gives that classic kart "on rails but slidey" feel that real wheel
## colliders fight against.
##
## SCENE SETUP (see README): root is this CharacterBody3D with:
##   - CollisionShape3D (a slightly rounded box ~1.4 x 0.7 x 2.0)
##   - "Model" Node3D holding the kart + Ruggy meshes (this node gets the
##     visual lean/squash; physics root stays upright)
##   - 4 RayCast3D ground feelers named GroundRayFL/FR/RL/RR under the body
##   - "CameraRig" with a SpringArm3D + Camera3D (player karts only)
##   - GPUParticles3D drift sparks under Model/DriftSparks (optional)

signal drift_boost_released(tier: int)
signal hit_by_item(spinout_time: float)
signal landed(fall_speed: float)

# --- Configuration assigned by the spawner before _ready (or use defaults) ---
@export var is_player: bool = true
@export var racer_id: String = "lambo"
var stats: KartStats

# --- Tunables shared by all karts (per-racer overrides live in KartStats) ---
const GRAVITY := 26.0
const FAST_FALL_MULT := 1.35       # heavier feel on the way down
const GROUND_SNAP_LEN := 1.2       # how far below to stick to the track
const ALIGN_LERP := 10.0           # how fast the mesh aligns to ground normal
const HOP_VELOCITY := 5.5

# Drift mini-turbo charge thresholds (seconds of held, turning drift).
const MT_BLUE := 0.65              # tier 1 (blue sparks)
const MT_ORANGE := 1.4             # tier 2 (orange sparks)
const MT_PURPLE := 2.3             # tier 3 (purple sparks, "ultra")
const MT_BOOST := [0.0, 7.0, 11.0, 16.0]      # extra speed per tier
const MT_BOOST_TIME := [0.0, 0.45, 0.8, 1.2]  # boost duration per tier

# --- Runtime state ---
var forward_speed: float = 0.0
var lateral_speed: float = 0.0
var vertical_speed: float = 0.0
var grounded: bool = true
var ground_normal: Vector3 = Vector3.UP

var steer_input: float = 0.0       # -1..1
var throttle_input: float = 0.0    # -1..1 (negative = brake/reverse)
var drift_held: bool = false

# Drift
var is_drifting: bool = false
var drift_dir: int = 0             # -1 left, +1 right (locked at drift start)
var drift_charge: float = 0.0      # seconds accumulated

# Boost (from mini-turbo, pads, items)
var boost_speed: float = 0.0       # additive bonus on top of max_speed
var boost_time: float = 0.0

# Status effects
var spinout_time: float = 0.0      # >0 = spun out, no control
var invincible_time: float = 0.0
var slow_time: float = 0.0         # market crash lightning
var control_locked: bool = false   # countdown / finish

# Cached nodes
@onready var model: Node3D = $Model if has_node("Model") else self
@onready var camera_rig: Node3D = get_node_or_null("CameraRig")
@onready var _ground_rays: Array[RayCast3D] = _collect_ground_rays()
var _input_provider: Object = null # set for AI / ghost playback; null = local input

func _ready() -> void:
	if stats == null:
		stats = KartStats.from_racer(racer_id)
	add_to_group("karts")
	# Ground rays look downward; ensure they're enabled.
	for r in _ground_rays:
		r.enabled = true
		r.target_position = Vector3(0, -GROUND_SNAP_LEN - 0.4, 0)

## Tints the placeholder kart + Ruggy meshes from RacerDB colors. Replace this
## with per-racer materials/models once art is in (see README "Theming").
func apply_theme(rid: String) -> void:
	var r: Dictionary = RacerDB.get_racer(rid)
	var body := find_child("BodyMesh", true, false)
	if body and body is MeshInstance3D:
		var m := StandardMaterial3D.new()
		m.albedo_color = r["kart_color"]
		m.metallic = 0.5
		m.roughness = 0.35
		# Golden Ruggy reads as polished metal; Banned reads matte black tech.
		if rid == "golden":
			m.metallic = 1.0
			m.roughness = 0.15
		(body as MeshInstance3D).material_override = m
	var fur := find_child("FurMesh", true, false)
	if fur and fur is MeshInstance3D:
		var fm := StandardMaterial3D.new()
		fm.albedo_color = r["fur_color"]
		fm.roughness = 0.9
		if rid == "golden":
			fm.metallic = 0.9
			fm.roughness = 0.25
		(fur as MeshInstance3D).material_override = fm

func _collect_ground_rays() -> Array[RayCast3D]:
	var arr: Array[RayCast3D] = []
	for n in ["GroundRayFL", "GroundRayFR", "GroundRayRL", "GroundRayRR", "GroundRay"]:
		var r := get_node_or_null(n)
		if r is RayCast3D:
			arr.append(r)
	return arr

# ---------------------------------------------------------------------------
# Input
# ---------------------------------------------------------------------------

## Assign an AIController or GhostPlayer here to drive this kart non-locally.
## The provider must expose get_kart_input() -> {steer, throttle, drift, item}.
func set_input_provider(provider: Object) -> void:
	_input_provider = provider
	is_player = false

func _gather_input(action_suffix: String = "") -> void:
	if control_locked or spinout_time > 0.0:
		steer_input = 0.0
		throttle_input = move_toward(throttle_input, 0.0, 0.05)
		drift_held = false
		return

	if _input_provider != null:
		var inp: Dictionary = _input_provider.get_kart_input(self)
		steer_input = clampf(inp.get("steer", 0.0), -1.0, 1.0)
		throttle_input = clampf(inp.get("throttle", 0.0), -1.0, 1.0)
		drift_held = bool(inp.get("drift", false))
		if bool(inp.get("item", false)):
			_try_use_item()
		return

	# Local human input. `action_suffix` supports split-screen ("_p2" etc.).
	var accel := Input.get_action_strength("accelerate" + action_suffix)
	var brk := Input.get_action_strength("brake" + action_suffix)
	throttle_input = accel - brk
	steer_input = Input.get_action_strength("steer_right" + action_suffix) \
		- Input.get_action_strength("steer_left" + action_suffix)
	drift_held = Input.is_action_pressed("drift" + action_suffix)
	if Input.is_action_just_pressed("use_item" + action_suffix):
		_try_use_item()

func _try_use_item() -> void:
	var item_sys := get_node_or_null("ItemSystem")
	if item_sys and item_sys.has_method("use_held_item"):
		item_sys.use_held_item()

# ---------------------------------------------------------------------------
# Physics step
# ---------------------------------------------------------------------------

func _physics_process(delta: float) -> void:
	_gather_input()
	_update_timers(delta)
	_update_ground(delta)

	if grounded:
		_drive(delta)
		_handle_drift(delta)
	else:
		_air_control(delta)

	_apply_boost(delta)
	_compose_velocity()
	move_and_slide()
	_post_move()
	_update_visuals(delta)

func _update_timers(delta: float) -> void:
	spinout_time = max(0.0, spinout_time - delta)
	invincible_time = max(0.0, invincible_time - delta)
	slow_time = max(0.0, slow_time - delta)
	if boost_time > 0.0:
		boost_time -= delta
		if boost_time <= 0.0:
			boost_speed = 0.0

func _update_ground(delta: float) -> void:
	# Average the hit normals of whichever feelers touch the track.
	var hits := 0
	var n := Vector3.ZERO
	for r in _ground_rays:
		r.force_raycast_update()
		if r.is_colliding():
			hits += 1
			n += r.get_collision_normal()
	var was_grounded := grounded
	grounded = hits > 0 or is_on_floor()
	if hits > 0:
		ground_normal = (n / hits).normalized()
	else:
		ground_normal = ground_normal.lerp(Vector3.UP, delta * 2.0)

	if grounded and not was_grounded:
		emit_signal("landed", abs(vertical_speed))
		# Landing momentum: keep a touch of the launch boost feel.
		vertical_speed = 0.0

# --- Ground driving ---------------------------------------------------------

func _drive(delta: float) -> void:
	var target := 0.0
	var current_max := stats.max_speed + boost_speed
	if slow_time > 0.0:
		current_max *= 0.55 # market crash lightning slows top speed

	if throttle_input > 0.05:
		target = current_max * throttle_input
		forward_speed = move_toward(forward_speed, target, stats.accel * delta)
	elif throttle_input < -0.05:
		if forward_speed > 0.5:
			# Braking
			forward_speed = move_toward(forward_speed, 0.0, stats.brake * delta)
		else:
			# Reverse
			forward_speed = move_toward(forward_speed, -stats.reverse_speed, stats.accel * 0.7 * delta)
	else:
		# Coast: gentle engine braking.
		forward_speed = move_toward(forward_speed, 0.0, stats.accel * 0.35 * delta)

	# Steering. Turn rate scales down a little at very low speed (no pivot in
	# place) and is amplified during a drift. Reverse flips steering feel.
	var speed_factor := clampf(absf(forward_speed) / 8.0, 0.0, 1.0)
	var turn := stats.turn_speed * speed_factor
	if is_drifting:
		turn *= stats.drift_turn_bonus
		# Bias steering toward the drift direction so you carve a tight arc but
		# can still modulate the radius with the stick.
		var bias := 0.55 * drift_dir
		var carve := clampf(bias + steer_input * 0.6, -1.2, 1.2)
		_rotate_kart(carve * turn * delta)
	else:
		var dir := signf(forward_speed) if absf(forward_speed) > 0.5 else 1.0
		_rotate_kart(steer_input * turn * delta * dir)

	# Grip: continuously kill sideways velocity (less while drifting).
	var grip := stats.grip * (0.25 if is_drifting else 1.0)
	lateral_speed = move_toward(lateral_speed, 0.0, grip * delta)

func _rotate_kart(yaw: float) -> void:
	rotate_y(yaw)

# --- Drifting ---------------------------------------------------------------

func _handle_drift(delta: float) -> void:
	# Start a drift: must be holding drift, moving forward, and steering.
	if drift_held and not is_drifting and forward_speed > stats.max_speed * 0.35:
		if absf(steer_input) > 0.3:
			_start_drift(signi(int(signf(steer_input))))
		else:
			# Holding drift without steer = a hop (useful to start a drift mid-air
			# or to bunny-hop over a banana at the last second).
			if grounded:
				vertical_speed = HOP_VELOCITY
				grounded = false

	if is_drifting:
		# Feed sideways slide so the kart visibly powerslides.
		lateral_speed = move_toward(lateral_speed, drift_dir * forward_speed * 0.45, 18.0 * delta)
		drift_charge += delta
		# Cancel drift -> release mini-turbo based on charge tier.
		if not drift_held or forward_speed < stats.max_speed * 0.2:
			_release_drift()

func _start_drift(dir: int) -> void:
	is_drifting = true
	drift_dir = dir
	drift_charge = 0.0
	if grounded:
		vertical_speed = HOP_VELOCITY * 0.7 # little hop to kick off the slide
		grounded = false
	AudioManager.play_sfx("drift_charge")

func _release_drift() -> void:
	is_drifting = false
	var tier := current_drift_tier()
	if tier > 0:
		apply_boost(MT_BOOST[tier], MT_BOOST_TIME[tier])
		emit_signal("drift_boost_released", tier)
		SaveManager.bump_stat("total_drift_boosts")
		AudioManager.play_sfx("drift_release", 1.0 + 0.1 * tier)
	drift_charge = 0.0
	drift_dir = 0

## Current charge tier: 0 none, 1 blue, 2 orange, 3 purple.
func current_drift_tier() -> int:
	if drift_charge >= MT_PURPLE:
		return 3
	if drift_charge >= MT_ORANGE:
		return 2
	if drift_charge >= MT_BLUE:
		return 1
	return 0

# --- Air control ------------------------------------------------------------

func _air_control(delta: float) -> void:
	# Limited steering and a satisfying tilt while airborne. Moon Ruggy's high
	# air_control makes this expressive; everyone gets *some*.
	var auth := stats.air_control
	_rotate_kart(steer_input * stats.turn_speed * 0.4 * auth * delta)
	# Pitch nudge: pushing forward noses down (faster landing), back noses up
	# (floatier) — applied to the model so physics body stays simple.
	if model:
		var pitch := -throttle_input * 0.25 * auth
		model.rotation.x = lerpf(model.rotation.x, pitch, delta * 4.0)
	# Let drift be "held" through the air so you can land already sliding.
	if drift_held and absf(steer_input) > 0.3 and not is_drifting:
		drift_dir = signi(int(signf(steer_input)))
		is_drifting = true
		drift_charge = max(drift_charge, 0.0)

# --- Boost ------------------------------------------------------------------

## Public: apply an additive speed boost for a duration. Stacks by taking the
## stronger boost (so a pad during a mini-turbo doesn't shorten it).
func apply_boost(amount: float, duration: float) -> void:
	if amount >= boost_speed or boost_time <= 0.0:
		boost_speed = amount
		boost_time = duration
	else:
		boost_time = max(boost_time, duration)
	# Instantly pop speed toward the new ceiling for snappy feedback.
	forward_speed = max(forward_speed, stats.max_speed * 0.85)

func _apply_boost(_delta: float) -> void:
	# Boost decay handled in _update_timers; nothing extra needed here, but kept
	# as a hook for boost-specific FX (camera FOV kick lives in the camera rig).
	pass

# --- Velocity composition & post-move --------------------------------------

func _compose_velocity() -> void:
	var fwd := -transform.basis.z
	var right := transform.basis.x
	var horizontal := fwd * forward_speed + right * lateral_speed

	if grounded:
		# Project movement onto the ground plane so we hug slopes/ramps and get
		# launched naturally off their lips.
		horizontal = horizontal.slide(ground_normal)
		vertical_speed = -2.0 # gentle stick-to-ground bias; snap handles the rest
	else:
		var g := GRAVITY * (FAST_FALL_MULT if vertical_speed < 0.0 else 1.0)
		# Moon's low-gravity feel: the air master floats down more slowly.
		if stats.trait_id == "air_master":
			g *= 0.7
		vertical_speed -= g * get_physics_process_delta_time()

	velocity = horizontal + Vector3.UP * vertical_speed

func _post_move() -> void:
	# Re-derive scalar speeds from the resolved velocity so collisions (walls,
	# ramming) actually bleed our speed instead of being ignored next frame.
	var fwd := -transform.basis.z
	var right := transform.basis.x
	forward_speed = velocity.dot(fwd)
	lateral_speed = velocity.dot(right)
	if not grounded:
		vertical_speed = velocity.y

	# Ground snap: if a feeler is close but move_and_slide left us a hair above,
	# pull down so we don't chatter on slopes.
	if grounded and not is_on_floor():
		var snap := _ground_rays.size() > 0 and _ground_rays[0].is_colliding()
		if snap:
			global_position.y = lerpf(global_position.y,
				_ground_rays[0].get_collision_point().y + 0.05,
				0.5)

# ---------------------------------------------------------------------------
# Visuals — lean, squash, ground alignment, drift spark color
# ---------------------------------------------------------------------------

func _update_visuals(delta: float) -> void:
	if model == null:
		return
	# Align the model's up-vector to the ground normal for slope-hugging looks.
	if grounded:
		var target_basis := _basis_aligned_to_normal(ground_normal)
		model.global_transform.basis = model.global_transform.basis.slerp(target_basis, delta * ALIGN_LERP).orthonormalized()

	# Body roll into turns / drifts.
	var lean_target := -steer_input * 0.18
	if is_drifting:
		lean_target = -drift_dir * 0.35
	model.rotation.z = lerpf(model.rotation.z, lean_target, delta * 8.0)

	# Drift spark particles + color tiering.
	var sparks := model.get_node_or_null("DriftSparks")
	if sparks and sparks is GPUParticles3D:
		var tier := current_drift_tier()
		sparks.emitting = is_drifting and tier > 0
		var mat := sparks.process_material
		if mat and mat is ParticleProcessMaterial:
			match tier:
				1: mat.color = Color(0.3, 0.6, 1.0)   # blue
				2: mat.color = Color(1.0, 0.55, 0.1)  # orange
				3: mat.color = Color(0.8, 0.3, 1.0)   # purple
				_: pass

func _basis_aligned_to_normal(n: Vector3) -> Basis:
	var fwd := -global_transform.basis.z
	var right := n.cross(fwd).normalized()
	if right.length() < 0.01:
		right = global_transform.basis.x
	var new_fwd := right.cross(n).normalized()
	return Basis(right, n, -new_fwd).orthonormalized()

# ---------------------------------------------------------------------------
# External effects (called by ItemSystem, hazards, AI ramming)
# ---------------------------------------------------------------------------

## Spin the kart out (banana, shell, bomb). Heavier karts recover faster.
func spinout(duration: float = 1.4) -> void:
	if invincible_time > 0.0:
		return
	spinout_time = duration / clampf(stats.weight, 0.6, 1.6)
	forward_speed *= 0.3
	boost_speed = 0.0
	boost_time = 0.0
	is_drifting = false
	drift_charge = 0.0
	emit_signal("hit_by_item", spinout_time)
	AudioManager.play_sfx("hit")

## Squash flat (lightning / honeypot). Brief, with a movement-speed penalty.
func squash(duration: float = 2.5) -> void:
	if invincible_time > 0.0:
		return
	slow_time = duration
	spinout(0.5)

func make_invincible(duration: float) -> void:
	invincible_time = duration

func is_invincible() -> bool:
	return invincible_time > 0.0

## Knockback from a ramming neighbor; weight resists it.
func apply_knockback(dir: Vector3, force: float) -> void:
	var resist := clampf(stats.weight, 0.5, 1.7)
	velocity += dir.normalized() * (force / resist)

func get_speed_kmh() -> float:
	return absf(forward_speed) * 3.6

## Normalized drift charge 0..1 for HUD boost meters.
func get_drift_charge_ratio() -> float:
	return clampf(drift_charge / MT_PURPLE, 0.0, 1.0)
