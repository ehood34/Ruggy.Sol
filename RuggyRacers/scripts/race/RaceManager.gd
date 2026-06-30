extends Node3D
class_name RaceManager
## RaceManager — the authority for a single race.
##
## Responsibilities:
##   - Spawn the human player(s) + AI on the grid.
##   - Run the 3-2-1-GO countdown and final-lap state.
##   - Count laps via ordered checkpoints and compute live race positions.
##   - Resolve item effects that touch other karts (shells, lightning, hazards).
##   - Drive the HUD and, for Speedrun mode, record/replay ghosts and lap splits.
##   - On finish, push results into GameManager for progression/unlocks.
##
## TRACK CONTRACT (what every track scene must provide as children/groups):
##   - "Grid": Marker3D children = start positions (front to back).
##   - "Checkpoints": ordered child Area3D nodes running Checkpoint.gd. The LAST
##     one before index wrap is the finish line (set is_finish = true on it).
##   - "AIWaypoints": a Path3D OR Marker3D children in group "ai_waypoints"
##     defining the racing line in order.
##   - Optional: ItemBoxes (ItemBox.gd), BoostPads (BoostPad.gd), hazards.
##
## See README for the exact node layout and how to author a new track.

signal race_started
signal countdown_tick(value: int)        # 3,2,1,0(=GO)
signal lap_changed(racer: Node, lap: int)
signal final_lap()
signal race_finished(results: Array)     # [{racer_id, name, time_ms, placement, is_player}]
signal positions_updated(ordered: Array)

const KART_SCENE := "res://scenes/karts/Kart.tscn"

@export var total_checkpoints: int = 0    # auto-filled from the Checkpoints node

var laps_required: int = 3
var racers: Array = []                    # array of dicts (see _make_racer_entry)
var player_entries: Array = []            # subset that are human
var checkpoints: Array = []               # ordered Checkpoint nodes
var waypoints: PackedVector3Array = PackedVector3Array()

var state: String = "intro"               # intro -> countdown -> racing -> finished
var race_time_ms: int = 0
var _countdown_t: float = 0.0
var _countdown_val: int = 3

# Speedrun / ghost
var is_speedrun: bool = false
var ghost_samples: Array = []             # recorded [{t, pos, rot}] for player 1
var _ghost_accum: float = 0.0
const GHOST_SAMPLE_DT := 0.05

func _ready() -> void:
	add_to_group("race_manager")
	laps_required = GameManager.laps
	is_speedrun = GameManager.mode == GameManager.GameMode.SPEEDRUN
	# Procedural tracks build themselves here (adding to us, which is safe in our
	# own _ready). Bespoke hand-built tracks simply have no TrackBuilder child.
	var builder := get_node_or_null("TrackBuilder")
	if builder and builder.has_method("build"):
		builder.build(self)
	_collect_track_nodes()
	_spawn_field()
	_start_countdown()
	AudioManager.play_music(GameManager.track_id)

# ---------------------------------------------------------------------------
# Track wiring
# ---------------------------------------------------------------------------

func _collect_track_nodes() -> void:
	var cp_root := get_node_or_null("Checkpoints")
	if cp_root:
		for c in cp_root.get_children():
			if c.has_method("get_index_in_track"):
				checkpoints.append(c)
		checkpoints.sort_custom(func(a, b): return a.checkpoint_index < b.checkpoint_index)
		for c in checkpoints:
			c.body_passed.connect(_on_checkpoint_passed.bind(c))
	total_checkpoints = checkpoints.size()

	# Racing line for the AI.
	var path := get_node_or_null("AIWaypoints")
	if path is Path3D and path.curve:
		var pts: PackedVector3Array = path.curve.get_baked_points()
		# Downsample so AI lookahead math stays cheap.
		var step: int = max(1, int(pts.size() / 64.0))
		for i in range(0, pts.size(), step):
			waypoints.append(path.to_global(pts[i]))
	else:
		for m in get_tree().get_nodes_in_group("ai_waypoints"):
			waypoints.append((m as Node3D).global_position)
	# Fallback: if no line authored, derive one from checkpoints.
	if waypoints.is_empty():
		for c in checkpoints:
			waypoints.append((c as Node3D).global_position)

# ---------------------------------------------------------------------------
# Spawning
# ---------------------------------------------------------------------------

func _spawn_field() -> void:
	var grid := get_node_or_null("Grid")
	var spawns: Array = []
	if grid:
		for m in grid.get_children():
			if m is Marker3D:
				spawns.append(m as Marker3D)
	if spawns.is_empty():
		push_warning("RaceManager: no Grid markers found; spawning at origin.")

	var human_count: int = GameManager.player_racers.size()
	var total := human_count + GameManager.ai_count
	var kart_packed: PackedScene = load(KART_SCENE)

	# Shuffle which AI racers appear (excluding ones humans picked, ideally).
	var ai_pool := RacerDB.RACER_ORDER.duplicate()
	ai_pool.shuffle()

	for i in total:
		var entry := {}
		var spawn_xform: Transform3D = spawns[i].global_transform if i < spawns.size() \
			else Transform3D(Basis(), Vector3(0, 1, -i * 4.0))
		var kart: KartController = kart_packed.instantiate()
		var is_human := i < human_count
		var rid: String = GameManager.player_racers[i] if is_human else _pick_ai_racer(ai_pool, i)
		kart.racer_id = rid
		kart.is_player = is_human
		kart.stats = KartStats.from_racer(rid)
		add_child(kart)
		kart.global_transform = spawn_xform
		kart.control_locked = true # locked until GO

		entry = _make_racer_entry(kart, rid, is_human, i)
		racers.append(entry)
		if is_human:
			player_entries.append(entry)

		# Apply per-racer visual theme (fur/kart colors from RacerDB).
		if kart.has_method("apply_theme"):
			kart.apply_theme(rid)
		else:
			_apply_theme_fallback(kart, rid)

		if is_human:
			_setup_player_camera_and_hud(kart, human_count, i)
		else:
			var ai := AIController.new()
			kart.add_child(ai)
			ai.setup(kart, GameManager.ai_difficulty, waypoints)
			entry["ai"] = ai

	# Load a ghost for speedrun comparison.
	if is_speedrun and GameManager.speedrun_use_ghost:
		_spawn_ghost()

func _pick_ai_racer(pool: Array, i: int) -> String:
	# Prefer racers the human(s) didn't pick, but it's fine to reuse.
	for rid in pool:
		if rid not in GameManager.player_racers:
			pool.erase(rid)
			return rid
	return RacerDB.RACER_ORDER[i % RacerDB.RACER_ORDER.size()]

func _make_racer_entry(kart: KartController, rid: String, is_human: bool, grid_idx: int) -> Dictionary:
	return {
		"kart": kart,
		"racer_id": rid,
		"name": RacerDB.get_racer(rid)["name"],
		"is_player": is_human,
		"lap": 1,
		"checkpoint": -1,          # (legacy, unused by lap logic now)
		"line_t": -1.0,            # current fraction 0..1 around the racing line
		"passed_half": false,      # reached the far side this lap (anti false-lap)
		"progress": 0.0,           # monotonic progress for sorting
		"finished": false,
		"finish_time_ms": 0,
		"placement": 0,
		"grid": grid_idx,
		"ai": null,
		"last_lap_ms": 0,
		"lap_start_ms": 0,
		"best_lap_ms": 0x7FFFFFFF,
		"stuck_time": 0.0,         # seconds spent barely moving (for rescue)
	}

func _setup_player_camera_and_hud(kart: KartController, human_count: int, idx: int) -> void:
	# Enable this kart's camera; assign split-screen viewport in multiplayer.
	var rig := kart.get_node_or_null("CameraRig")
	if rig:
		var cam := rig.get_node_or_null("Camera3D")
		if cam:
			cam.current = (human_count == 1) # single player uses the main viewport
	# HUD is instanced by the track scene's CanvasLayer; we just hand it our kart.
	var hud := get_tree().get_first_node_in_group("race_hud")
	if hud and hud.has_method("bind_kart"):
		hud.bind_kart(kart, self, idx)
	# Split-screen viewport assignment is documented in README (SplitScreen.tscn).

func _apply_theme_fallback(kart: KartController, rid: String) -> void:
	# Tints the kart's main mesh if the model script doesn't handle theming.
	var r := RacerDB.get_racer(rid)
	var mesh := kart.find_child("BodyMesh", true, false)
	if mesh and mesh is MeshInstance3D:
		var mat := StandardMaterial3D.new()
		mat.albedo_color = r["kart_color"]
		mat.metallic = 0.4
		mat.roughness = 0.4
		(mesh as MeshInstance3D).material_override = mat

# ---------------------------------------------------------------------------
# Countdown & main loop
# ---------------------------------------------------------------------------

func _start_countdown() -> void:
	state = "countdown"
	_countdown_val = 3
	_countdown_t = 1.0
	emit_signal("countdown_tick", _countdown_val)
	AudioManager.play_sfx("countdown_beep")

func _process(delta: float) -> void:
	match state:
		"countdown":
			_countdown_t -= delta
			if _countdown_t <= 0.0:
				_countdown_val -= 1
				_countdown_t = 1.0
				emit_signal("countdown_tick", _countdown_val)
				if _countdown_val > 0:
					AudioManager.play_sfx("countdown_beep")
				else:
					_begin_race()
		"racing":
			race_time_ms += int(delta * 1000.0)
			_update_positions()
			_update_rescue(delta)
			_record_ghost(delta)
		_:
			pass

func _begin_race() -> void:
	state = "racing"
	AudioManager.play_sfx("countdown_go")
	for e in racers:
		e["kart"].control_locked = false
		e["lap_start_ms"] = 0
	emit_signal("race_started")

# ---------------------------------------------------------------------------
# Lap counting & positions
# ---------------------------------------------------------------------------

func _on_checkpoint_passed(_body: Node, _cp) -> void:
	# Lap counting no longer relies on driving through Area3D gates in exact
	# order — that stalled forever if a kart (or a rescue teleport) ever skipped
	# one. Laps are now derived continuously from racing-line position in
	# _update_positions(). Checkpoints remain only for the mini-map.
	pass

func _complete_lap(entry: Dictionary) -> void:
	var lap_ms := race_time_ms - int(entry["lap_start_ms"])
	entry["last_lap_ms"] = lap_ms
	entry["best_lap_ms"] = min(entry["best_lap_ms"], lap_ms)
	entry["lap_start_ms"] = race_time_ms
	entry["lap"] += 1
	emit_signal("lap_changed", entry["kart"], entry["lap"])
	AudioManager.play_sfx("lap_complete")

	if entry["lap"] == laps_required:
		if entry["is_player"]:
			emit_signal("final_lap")
			AudioManager.play_sfx("final_lap")
	elif entry["lap"] > laps_required:
		_finish_racer(entry)

func _finish_racer(entry: Dictionary) -> void:
	entry["finished"] = true
	entry["finish_time_ms"] = race_time_ms
	entry["kart"].control_locked = true
	# Placement = number already finished + 1.
	var done := 0
	for e in racers:
		if e["finished"]:
			done += 1
	entry["placement"] = done
	if entry["is_player"]:
		AudioManager.play_sfx("finish")
		_on_player_finished(entry)

func _update_positions() -> void:
	# Continuous progress from racing-line position. Robust to wall-bonks,
	# rescues, and the chaotic start — no ordered-gate requirement to stall on.
	for e in racers:
		if e["finished"]:
			continue
		var kart: Node3D = e["kart"]
		var frac := _nearest_line_frac(kart.global_position)
		var prev_t: float = e["line_t"]
		if prev_t < 0.0:
			prev_t = frac # first sample: seed without counting a lap
		# Mark having reached the far half of the loop (so a lap can't be faked
		# by jittering back and forth across the start line).
		if frac > 0.4 and frac < 0.6:
			e["passed_half"] = true
		# Forward wrap (~0.9 -> ~0.05) past the start line == a completed lap.
		if prev_t > 0.7 and frac < 0.3:
			if e["passed_half"]:
				e["passed_half"] = false
				_complete_lap(e)
		# Backward wrap: went the wrong way; just clear the half flag.
		elif prev_t < 0.3 and frac > 0.7:
			e["passed_half"] = false
		e["line_t"] = frac
		e["progress"] = e["lap"] * 10.0 + frac

	# Sort: finished first (by finish time), then by progress descending.
	var ordered := racers.duplicate()
	ordered.sort_custom(_compare_progress)
	for i in ordered.size():
		var e: Dictionary = ordered[i]
		var pos := i + 1
		# Feed item system position for weighting.
		var isys = e["kart"].get_node_or_null("ItemSystem")
		if isys:
			isys.race_position = pos
			isys.race_total = racers.size()
		# Feed AI rubber-band info.
		if e["ai"]:
			e["ai"].race_position = pos
			e["ai"].leader_distance_ahead = _leader_gap_for(e, ordered)
	emit_signal("positions_updated", ordered)

func _compare_progress(a: Dictionary, b: Dictionary) -> bool:
	if a["finished"] != b["finished"]:
		return a["finished"] # finished racers rank ahead
	if a["finished"] and b["finished"]:
		return a["finish_time_ms"] < b["finish_time_ms"]
	return a["progress"] > b["progress"]

# ---------------------------------------------------------------------------
# Stuck rescue ("Lakitu") — the safety net that keeps a race alive.
#
# Without this, karts that wedge against a wall or each other (very common at
# the start) sit there flooring the throttle forever, so the player ends up
# "with no one to race". Any kart that crawls below a speed threshold for a
# couple of seconds is lifted back onto the racing line, facing forward.
# ---------------------------------------------------------------------------

const RESCUE_SPEED := 3.0      # m/s below which a kart counts as "stuck"
const RESCUE_AFTER := 2.0      # seconds of being stuck before a rescue

func _update_rescue(delta: float) -> void:
	for e in racers:
		if e["finished"]:
			continue
		var kart: KartController = e["kart"]
		# Out of bounds: flew off a ramp over the walls, or fell through the world.
		# Speed-based rescue never catches these (they're moving fast), so check
		# position explicitly and rescue immediately.
		var gp := kart.global_position
		if gp.y < -8.0 or Vector2(gp.x, gp.z).length() > 95.0:
			_rescue_kart(kart)
			e["stuck_time"] = 0.0
			continue
		if kart.control_locked or kart.spinout_time > 0.0:
			e["stuck_time"] = 0.0
			continue
		if absf(kart.forward_speed) < RESCUE_SPEED:
			e["stuck_time"] += delta
		else:
			e["stuck_time"] = 0.0
		if e["stuck_time"] >= RESCUE_AFTER:
			_rescue_kart(kart)
			e["stuck_time"] = 0.0

## Teleport a kart to the nearest point on the racing line, upright and facing
## the next waypoint, with momentum cleared so it can drive away cleanly.
func _rescue_kart(kart: KartController) -> void:
	if waypoints.is_empty():
		return
	var best_i := 0
	var best_d := INF
	for i in waypoints.size():
		var d := kart.global_position.distance_to(waypoints[i])
		if d < best_d:
			best_d = d
			best_i = i
	var here: Vector3 = waypoints[best_i]
	var nxt: Vector3 = waypoints[(best_i + 1) % waypoints.size()]
	var dir := nxt - here
	dir.y = 0.0
	if dir.length() < 0.01:
		dir = -kart.global_transform.basis.z
	# Reset all motion state so it doesn't keep its stuck velocity.
	kart.velocity = Vector3.ZERO
	kart.forward_speed = 0.0
	kart.lateral_speed = 0.0
	kart.vertical_speed = 0.0
	kart.is_drifting = false
	kart.drift_charge = 0.0
	kart.boost_time = 0.0
	kart.boost_speed = 0.0
	kart.global_position = here + Vector3.UP * 1.2
	# look_at points -Z (our forward) at the target.
	kart.look_at(kart.global_position + dir, Vector3.UP)

## Fraction 0..1 around the racing line of the waypoint nearest to `pos`.
func _nearest_line_frac(pos: Vector3) -> float:
	var w := waypoints.size()
	if w == 0:
		return 0.0
	var best_i := 0
	var best_d := INF
	for i in w:
		var d := pos.distance_squared_to(waypoints[i])
		if d < best_d:
			best_d = d
			best_i = i
	return float(best_i) / float(w)

func _leader_gap_for(entry: Dictionary, ordered: Array) -> float:
	# Approximate metres the human leader is ahead of this AI (for rubber-band).
	var leader: Dictionary = ordered[0]
	if leader == entry:
		return 0.0
	return (leader["progress"] - entry["progress"]) * 0.01

# ---------------------------------------------------------------------------
# Finish / results
# ---------------------------------------------------------------------------

func _on_player_finished(entry: Dictionary) -> void:
	# In single-player, ending P1 ends the race (AI placements filled in).
	if is_speedrun:
		_finalize_speedrun(entry)
	_finish_race()

func _finish_race() -> void:
	if state == "finished":
		return
	state = "finished"
	# Assign placements to anyone not yet finished by current standing.
	var standing := racers.duplicate()
	standing.sort_custom(_compare_progress)
	var p := 1
	for e in standing:
		if e["placement"] == 0:
			e["placement"] = p
		p += 1
	standing.sort_custom(func(a, b): return a["placement"] < b["placement"])

	var results: Array = []
	for e in standing:
		results.append({
			"racer_id": e["racer_id"],
			"name": e["name"],
			"time_ms": e["finish_time_ms"] if e["finished"] else race_time_ms,
			"best_lap_ms": e["best_lap_ms"] if e["best_lap_ms"] < 0x7FFFFFFF else 0,
			"placement": e["placement"],
			"is_player": e["is_player"],
		})

	# Apply progression for the human player (P1).
	for e in player_entries:
		GameManager.apply_race_results(e["placement"], e["racer_id"])

	AudioManager.play_sfx("crowd_cheer")
	emit_signal("race_finished", results)
	# Stash results for the results screen and transition after a beat.
	GameManager.set_meta("last_results", results)
	await get_tree().create_timer(2.5).timeout
	if GameManager.mode == GameManager.GameMode.GRAND_PRIX:
		GameManager.goto_scene("results") # results screen handles "next race"
	else:
		GameManager.goto_scene("results")

# ---------------------------------------------------------------------------
# Speedrun: ghost recording + lap splits
# ---------------------------------------------------------------------------

func _record_ghost(delta: float) -> void:
	if not is_speedrun or player_entries.is_empty():
		return
	_ghost_accum += delta
	if _ghost_accum < GHOST_SAMPLE_DT:
		return
	_ghost_accum = 0.0
	var k: Node3D = player_entries[0]["kart"]
	ghost_samples.append({
		"t": race_time_ms,
		"px": k.global_position.x, "py": k.global_position.y, "pz": k.global_position.z,
		"ry": k.rotation.y,
	})

func _finalize_speedrun(entry: Dictionary) -> void:
	var total: int = entry["finish_time_ms"]
	var best_lap: int = entry["best_lap_ms"]
	var medal := RacerDB.medal_for_time(GameManager.track_id, total)
	var is_record := SaveManager.record_time_trial(GameManager.track_id, total, best_lap, medal)
	if is_record:
		SaveManager.save_ghost(GameManager.track_id, ghost_samples)
	GameManager.set_meta("speedrun_summary", {
		"total_ms": total, "best_lap_ms": best_lap, "medal": medal, "record": is_record,
	})

func _spawn_ghost() -> void:
	var samples := SaveManager.load_ghost(GameManager.track_id)
	if samples.is_empty():
		return
	var ghost := preload("res://scripts/race/GhostPlayer.gd").new()
	add_child(ghost)
	ghost.setup(samples, GameManager.player_racers[0])

# ---------------------------------------------------------------------------
# Item resolution (called by ItemSystem) — single authority for fairness
# ---------------------------------------------------------------------------

## Fire a shell from `source` toward the nearest kart ahead (or spread offset).
func fire_shell(source: KartController, spread_index: int = 0) -> void:
	var target := _nearest_ahead(source)
	# If we have a shell scene, spawn a real projectile; else apply directly to
	# the target so the effect still lands (graceful degradation).
	var scene_path := "res://scenes/props/RugShell.tscn"
	if ResourceLoader.exists(scene_path):
		var shell: Node3D = load(scene_path).instantiate()
		add_child(shell)
		var fwd := -source.global_transform.basis.z
		# Spread offsets fan the barrage out.
		fwd = fwd.rotated(Vector3.UP, deg_to_rad(spread_index * 12.0 - 12.0))
		shell.global_position = source.global_position + fwd * 2.5 + Vector3.UP * 0.5
		if shell.has_method("launch"):
			shell.launch(fwd, source, target)
	elif target:
		await get_tree().create_timer(0.4).timeout
		if is_instance_valid(target):
			target.spinout()

## Lightning: slow/squash every kart currently ahead of `source`.
func lightning_strike(source: KartController) -> void:
	var src_entry = _entry_for_kart(source)
	if src_entry == null:
		return
	for e in racers:
		if e["kart"] == source or e["finished"]:
			continue
		if e["progress"] > src_entry["progress"]:
			(e["kart"] as KartController).squash(2.0)

## Drop a hazard (banana/bomb/fake box) just behind `source`.
func spawn_hazard(scene_path: String, source: KartController, item_id: String) -> void:
	var behind := source.global_transform.basis.z # +z is backward
	var pos := source.global_position + behind * 2.5
	if scene_path != "" and ResourceLoader.exists(scene_path):
		var hz: Node3D = load(scene_path).instantiate()
		add_child(hz)
		hz.global_position = pos
		if hz.has_method("set_item_id"):
			hz.set_item_id(item_id)
	# If no scene authored yet, the hazard is a no-op (documented in README).

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

func _entry_for_kart(kart: Node) -> Variant:
	for e in racers:
		if e["kart"] == kart:
			return e
	return null

func _nearest_ahead(source: KartController) -> KartController:
	var src_entry = _entry_for_kart(source)
	if src_entry == null:
		return null
	var best: KartController = null
	var best_gap := INF
	for e in racers:
		if e["kart"] == source or e["finished"]:
			continue
		var gap: float = e["progress"] - src_entry["progress"]
		if gap > 0.0 and gap < best_gap:
			best_gap = gap
			best = e["kart"]
	return best

func get_player_entry(idx: int = 0) -> Dictionary:
	return player_entries[idx] if idx < player_entries.size() else {}

func get_racer_count() -> int:
	return racers.size()
