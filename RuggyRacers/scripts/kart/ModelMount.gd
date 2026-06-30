class_name ModelMount
extends RefCounted
## Loads a 3D model from a folder and auto-fits it onto a kart, so you can drop
## in FBX/GLB/GLTF assets (e.g. Meshy exports) WITHOUT hand-editing scenes.
##
## How it works:
##   - Scans a folder (res://assets/models/<racer>/<part>/) for the first model
##     file and instances it.
##   - Measures its bounding box and scales it so its largest dimension matches
##     a target size — this fixes the wildly different units FBX exporters use
##     (centimetres vs metres, etc.).
##   - Drops its base onto y=0 and centres it, then applies per-model tweaks
##     (extra scale, rotation, offset) defined in RacerDB so we can nudge each
##     model into place.
##
## Returns the instanced node, or null if no model file was found (callers then
## keep the placeholder mesh).

const MODEL_EXTS := [".glb", ".gltf", ".fbx", ".obj", ".blend", ".tscn", ".escn"]

static func mount(parent: Node3D, cfg: Dictionary) -> Node3D:
	var dir_path: String = cfg.get("dir", "")
	var path := _find_model_path(dir_path)
	if path == "" or not ResourceLoader.exists(path):
		return null
	var res := load(path)
	var inst: Node3D = null
	if res is PackedScene:
		inst = (res as PackedScene).instantiate()
	elif res is Mesh:
		var mi := MeshInstance3D.new()
		mi.mesh = res
		inst = mi
	if inst == null:
		return null
	parent.add_child(inst)

	# --- Auto-fit by bounding box ---
	var aabb := _local_aabb(inst, parent)
	var dim := maxf(aabb.size.x, maxf(aabb.size.y, aabb.size.z))
	var target: float = cfg.get("size", 1.6)
	var s := 1.0
	if dim > 0.0001:
		s = (target / dim) * float(cfg.get("scale", 1.0))
	inst.scale = Vector3(s, s, s)
	# Sit the base on y=0 and centre x/z (in the scaled frame).
	inst.position = Vector3(
		-(aabb.position.x + aabb.size.x * 0.5) * s,
		-aabb.position.y * s,
		-(aabb.position.z + aabb.size.z * 0.5) * s)

	# --- Per-model tweaks (from RacerDB) ---
	inst.position += cfg.get("offset", Vector3.ZERO)
	inst.rotation_degrees += Vector3(
		float(cfg.get("rot_x", 0.0)),
		float(cfg.get("rot_y", 0.0)),
		float(cfg.get("rot_z", 0.0)))
	return inst

# ---------------------------------------------------------------------------

static func _find_model_path(dir_path: String) -> String:
	if dir_path == "":
		return ""
	var d := DirAccess.open(dir_path)
	if d == null:
		return "" # folder doesn't exist yet -> caller keeps the placeholder
	# Collect all model files, then pick by MODEL_EXTS priority (GLB/GLTF before
	# FBX — they're Godot-native, import more reliably, and are usually lighter).
	var found: Array[String] = []
	d.list_dir_begin()
	while true:
		var f := d.get_next()
		if f == "":
			break
		if d.current_is_dir() or f.to_lower().ends_with(".import"):
			continue
		found.append(f)
	for ext in MODEL_EXTS:
		for f in found:
			if f.to_lower().ends_with(ext):
				return dir_path.path_join(f)
	return ""

## Union AABB of every VisualInstance3D under `root`, expressed in `space`'s
## local frame (root has just been added with identity-ish transform).
static func _local_aabb(root: Node3D, space: Node3D) -> AABB:
	var inv := space.global_transform.affine_inverse()
	var out := AABB()
	var has := false
	for vi in _visual_instances(root):
		var a: AABB = vi.get_aabb()
		a = (inv * vi.global_transform) * a
		if not has:
			out = a
			has = true
		else:
			out = out.merge(a)
	return out if has else AABB(Vector3(-0.5, 0, -0.5), Vector3.ONE)

static func _visual_instances(node: Node) -> Array:
	var result: Array = []
	if node is VisualInstance3D:
		result.append(node)
	for c in node.get_children():
		result.append_array(_visual_instances(c))
	return result
