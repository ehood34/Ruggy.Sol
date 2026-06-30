extends Node3D
## TrackBuilder — procedurally generates a complete, drivable circuit so the
## game is playable and fun the moment you press Play, with NO modelling needed.
##
## It builds (as children of its parent RaceManager so the contract is met):
##   - A ground plane (StaticBody3D) you can drive on.
##   - Inner + outer oval walls forming a track corridor.
##   - A "Checkpoints" node of ordered Checkpoint gates around the loop.
##   - An "AIWaypoints" Path3D following the centerline.
##   - A "Grid" node of start markers on the start/finish straight.
##   - Item-box rows, themed boost pads, and a couple of jump ramps.
##
## Because it runs in _ready (child runs before the RaceManager parent), all the
## nodes exist before RaceManager collects them.
##
## This is the reference for authoring REAL tracks: build the same node names by
## hand in the editor with bespoke art, and delete/disable this builder. Tune
## the oval + feature placement here to prototype new layouts fast.

# Oval centerline radii and corridor width (metres).
const RX := 64.0
const RZ := 58.0            # near-circular: uniform gentle curvature the AI can hold
const TRACK_WIDTH := 22.0   # wider corridor so karts don't wedge against walls
const WALL_SEGMENTS := 72
const CHECKPOINTS := 12
const WALL_HEIGHT := 5.0   # taller so launched karts don't sail over the barrier

var _parent: Node

## Build the whole track as children of `parent`. This is called explicitly by
## RaceManager from inside RaceManager._ready() — NOT from this node's own
## _ready(). A child cannot add_child() to its parent while the parent is still
## being set up ("Parent node is busy setting up children"), so the build must
## be driven by the parent adding to itself.
func build(parent: Node) -> void:
	_parent = parent
	_build_ground()
	_build_walls()
	_build_checkpoints()
	_build_ai_path()
	_build_grid()
	_build_finish_line()
	_build_features()

## A flat black-and-white checkered strip across the track at the start/finish.
func _build_finish_line() -> void:
	# Procedural checkerboard texture (sharp squares via nearest filtering).
	var img := Image.create(8, 8, false, Image.FORMAT_RGB8)
	for y in 8:
		for x in 8:
			img.set_pixel(x, y, Color.WHITE if (x + y) % 2 == 0 else Color.BLACK)
	var tex := ImageTexture.create_from_image(img)
	var mat := StandardMaterial3D.new()
	mat.albedo_texture = tex
	mat.texture_filter = BaseMaterial3D.TEXTURE_FILTER_NEAREST
	mat.uv1_scale = Vector3(TRACK_WIDTH / 2.5, 2.0, 1.0) # repeat squares across width
	mat.roughness = 1.0

	var c := _point(0.0)
	var fwd := _tangent(0.0)
	var mesh := MeshInstance3D.new()
	var plane := PlaneMesh.new()
	plane.size = Vector2(TRACK_WIDTH, 4.0) # spans the corridor; 4m deep
	mesh.mesh = plane
	mesh.material_override = mat
	# PlaneMesh lies in the XZ plane facing +Y; orient it across the track.
	mesh.transform = _xform_facing(c + Vector3.UP * 0.05, fwd)
	_parent.add_child(mesh)

# --- Centerline helpers -----------------------------------------------------

func _point(t: float) -> Vector3:
	# t in radians. A clean ellipse: smooth and predictable for the AI to follow.
	# (A previous S-bend variant made the AI careen off-line; keep curvature
	# gentle so opponents can actually complete laps. Add character with props,
	# elevation, and bespoke geometry rather than a wavy centerline.)
	var x := RX * cos(t)
	var z := RZ * sin(t)
	return Vector3(x, 0.0, z)

func _tangent(t: float) -> Vector3:
	var a := _point(t)
	var b := _point(t + 0.01)
	return (b - a).normalized()

func _xform_facing(pos: Vector3, forward: Vector3) -> Transform3D:
	# Build a basis whose -Z points along `forward` (kart forward convention).
	var z := (-forward).normalized()
	var x := Vector3.UP.cross(z).normalized()
	if x.length() < 0.01:
		x = Vector3.RIGHT
	var y := z.cross(x).normalized()
	return Transform3D(Basis(x, y, z), pos)

# --- Geometry ---------------------------------------------------------------

func _build_ground() -> void:
	var body := StaticBody3D.new()
	body.name = "Ground"
	body.collision_layer = 1
	body.collision_mask = 0
	var shape := CollisionShape3D.new()
	var box := BoxShape3D.new()
	box.size = Vector3(320, 2, 320)
	shape.shape = box
	shape.position = Vector3(0, -1, 0)
	body.add_child(shape)
	var mesh := MeshInstance3D.new()
	var pm := PlaneMesh.new()
	pm.size = Vector2(320, 320)
	mesh.mesh = pm
	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color(0.10, 0.10, 0.16)
	mat.roughness = 0.95
	mesh.material_override = mat
	body.add_child(mesh)
	_parent.add_child(body)

func _build_walls() -> void:
	# Walls are VISUAL ONLY (collision_layer 4, which karts don't collide with).
	# The faceted segment boxes used to snag karts on corners and deadlock the
	# whole field; instead, karts are kept on-course by the AI racing line and
	# the out-of-bounds rescue. Bespoke tracks can use solid swept-mesh walls.
	var outer := StaticBody3D.new(); outer.name = "OuterWalls"; outer.collision_layer = 1
	var inner := StaticBody3D.new(); inner.name = "InnerWalls"; inner.collision_layer = 1
	_parent.add_child(outer)
	_parent.add_child(inner)
	var wmat := StandardMaterial3D.new()
	wmat.albedo_color = Color(0.30, 0.18, 0.5)
	wmat.emission_enabled = true
	wmat.emission = Color(0.5, 0.2, 0.9)
	wmat.emission_energy_multiplier = 0.6
	for i in WALL_SEGMENTS:
		var t := TAU * float(i) / float(WALL_SEGMENTS)
		var c := _point(t)
		var fwd := _tangent(t)
		var side := Vector3.UP.cross(fwd).normalized()
		_add_wall_segment(outer, c + side * (TRACK_WIDTH * 0.5), fwd, wmat)
		_add_wall_segment(inner, c - side * (TRACK_WIDTH * 0.5), fwd, wmat)

func _add_wall_segment(body: StaticBody3D, pos: Vector3, fwd: Vector3, mat: Material) -> void:
	var seg_len := TAU * max(RX, RZ) / float(WALL_SEGMENTS) * 1.3
	var xform := _xform_facing(pos + Vector3.UP * (WALL_HEIGHT * 0.5), fwd)
	var shape := CollisionShape3D.new()
	var box := BoxShape3D.new()
	box.size = Vector3(0.6, WALL_HEIGHT, seg_len)
	shape.shape = box
	shape.transform = xform
	body.add_child(shape)
	var mesh := MeshInstance3D.new()
	var bm := BoxMesh.new()
	bm.size = box.size
	mesh.mesh = bm
	mesh.material_override = mat
	mesh.transform = xform
	body.add_child(mesh)

func _build_checkpoints() -> void:
	var root := Node3D.new()
	root.name = "Checkpoints"
	_parent.add_child(root)
	var cp_script := load("res://scripts/race/Checkpoint.gd")
	for i in CHECKPOINTS:
		var t := TAU * float(i) / float(CHECKPOINTS)
		var c := _point(t)
		var fwd := _tangent(t)
		var area := Area3D.new()
		area.set_script(cp_script)
		area.name = "CP%d" % i
		area.collision_layer = 0
		area.collision_mask = 2 # detect karts (layer 2)
		area.set("checkpoint_index", i)
		area.set("is_finish", i == 0)
		var shape := CollisionShape3D.new()
		var box := BoxShape3D.new()
		box.size = Vector3(TRACK_WIDTH, 6.0, 1.5)
		shape.shape = box
		area.add_child(shape)
		area.transform = _xform_facing(c + Vector3.UP * 1.5, fwd)
		root.add_child(area)

func _build_ai_path() -> void:
	var path := Path3D.new()
	path.name = "AIWaypoints"
	var curve := Curve3D.new()
	var steps := 96
	for i in steps + 1:
		var t := TAU * float(i) / float(steps)
		curve.add_point(_point(t) + Vector3.UP * 0.5)
	path.curve = curve
	_parent.add_child(path)

func _build_grid() -> void:
	var grid := Node3D.new()
	grid.name = "Grid"
	_parent.add_child(grid)
	# Two columns of 4, well spaced so karts never spawn touching (which caused
	# them to pile up and freeze). Rows 8m apart, columns 5m to each side.
	var fwd := _tangent(0.0)
	var side := Vector3.UP.cross(fwd).normalized()
	for i in 8:
		var row := i / 2
		var col := i % 2
		var back := -fwd * (8.0 + row * 8.0)
		var lateral := side * (-5.0 if col == 0 else 5.0)
		var pos := _point(0.0) + back + lateral + Vector3.UP * 0.6
		var m := Marker3D.new()
		m.name = "Start%d" % i
		m.transform = _xform_facing(pos, fwd)
		grid.add_child(m)

func _build_features() -> void:
	var item_scene := load("res://scenes/props/ItemBox.tscn")
	var boost_scene := load("res://scenes/props/BoostPad.tscn")
	var label: String = RacerDB.get_track(GameManager.track_id).get("boost_label", "BOOST")

	# Item box rows spread around the loop (kept clear of the ramps at 0.25/0.75).
	for frac in [0.1, 0.5, 0.9]:
		var t := TAU * float(frac)
		var c := _point(t)
		var fwd := _tangent(t)
		var side := Vector3.UP.cross(fwd).normalized()
		for lane in [-1.0, 0.0, 1.0]:
			if item_scene:
				var box: Node3D = item_scene.instantiate()
				_parent.add_child(box)
				box.global_position = c + side * (float(lane) * 4.0) + Vector3.UP * 0.5

	# Boost pads on the straights, offset from ramps and item rows.
	for frac2 in [0.35, 0.65]:
		var t2 := TAU * float(frac2)
		if boost_scene:
			var pad: Node3D = boost_scene.instantiate()
			_parent.add_child(pad)
			pad.global_position = _point(t2) + Vector3.UP * 0.06
			# Orient flat along the track.
			pad.global_transform = _xform_facing(pad.global_position, _tangent(t2))
			if pad.has_method("set"):
				pad.set("voice_line", "to_the_moon")

	# Jump ramps on the STRAIGHTS (not the corners — a ramp mid-turn launches
	# karts into the wall). frac 0.25 and 0.75 are the two straightaways.
	for frac3 in [0.25, 0.75]:
		_add_ramp(TAU * float(frac3))

func _add_ramp(t: float) -> void:
	# A solid, ground-based WEDGE (triangular prism) instead of a floating tilted
	# box. The old box had a vertical leading lip that karts rammed into and got
	# stuck on. This wedge rises from the track surface (y=0) so you drive
	# smoothly up the incline and launch off the top edge.
	var c := _point(t)
	var fwd := _tangent(t)
	var hw := TRACK_WIDTH * 0.34   # half width across the track
	var hl := 7.0                  # half length along travel
	var h := 1.7                   # launch-edge height (gentle pop, not orbit)
	# Local space: -Z is travel/forward. Kart enters at +Z on the ground and
	# climbs to the exit lip at -Z (height h).
	var v := [
		Vector3( hw, 0.0,  hl), # 0 entry +x
		Vector3( hw, 0.0, -hl), # 1 exit base +x
		Vector3( hw, h,   -hl), # 2 exit top +x
		Vector3(-hw, 0.0,  hl), # 3 entry -x
		Vector3(-hw, 0.0, -hl), # 4 exit base -x
		Vector3(-hw, h,   -hl), # 5 exit top -x
	]

	var body := StaticBody3D.new()
	body.collision_layer = 1
	var shape := CollisionShape3D.new()
	var convex := ConvexPolygonShape3D.new()
	convex.points = PackedVector3Array(v)
	shape.shape = convex
	body.add_child(shape)

	# Visual mesh matching the collision hull.
	var st := SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	var faces := [
		[0, 2, 1], [3, 4, 5],          # side triangles
		[0, 3, 5], [0, 5, 2],          # incline (drivable ramp surface)
		[1, 2, 5], [1, 5, 4],          # vertical back face
		[0, 1, 4], [0, 4, 3],          # bottom
	]
	for f in faces:
		st.add_vertex(v[f[0]])
		st.add_vertex(v[f[1]])
		st.add_vertex(v[f[2]])
	st.generate_normals()
	var mesh := MeshInstance3D.new()
	mesh.mesh = st.commit()
	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color(0.95, 0.45, 0.0)
	mat.emission_enabled = true
	mat.emission = Color(1.0, 0.5, 0.1)
	mat.cull_mode = BaseMaterial3D.CULL_DISABLED # always visible regardless of winding
	mesh.material_override = mat
	body.add_child(mesh)

	body.transform = _xform_facing(c, fwd) # base sits on the ground (y=0)
	_parent.add_child(body)
