extends Node3D
class_name GhostPlayer
## Replays a recorded ghost for Speedrun mode. Spawns a translucent copy of the
## racer's kart and interpolates it along the recorded samples by race time.
##
## Samples format (from RaceManager._record_ghost):
##   [{t:int ms, px,py,pz:float, ry:float}, ...]
##
## It reads the live race clock from the RaceManager so the ghost stays in sync
## even if the framerate differs from the recording.

var samples: Array = []
var racer_id: String = "lambo"
var _idx: int = 0
var _kart_visual: Node3D
var _rm: RaceManager

func setup(p_samples: Array, p_racer: String) -> void:
	samples = p_samples
	racer_id = p_racer

func _ready() -> void:
	_rm = get_tree().get_first_node_in_group("race_manager")
	_build_visual()

func _build_visual() -> void:
	# Reuse the kart scene but strip control/physics — it's just a ghostly mesh.
	var scene := load(RaceManager.KART_SCENE)
	if scene == null:
		return
	_kart_visual = scene.instantiate()
	add_child(_kart_visual)
	# Disable physics/control on the ghost.
	if _kart_visual is KartController:
		(_kart_visual as KartController).set_physics_process(false)
		(_kart_visual as KartController).set_process(false)
	_apply_ghost_material(_kart_visual)

func _apply_ghost_material(node: Node) -> void:
	for child in node.get_children():
		if child is MeshInstance3D:
			var mat := StandardMaterial3D.new()
			mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
			mat.albedo_color = Color(0.5, 0.8, 1.0, 0.35)
			mat.emission_enabled = true
			mat.emission = Color(0.3, 0.6, 1.0)
			(child as MeshInstance3D).material_override = mat
		_apply_ghost_material(child)

func _process(_delta: float) -> void:
	if samples.is_empty() or _rm == null or _kart_visual == null:
		return
	var now: int = _rm.race_time_ms
	# Advance to the bracketing sample pair.
	while _idx < samples.size() - 1 and int(samples[_idx + 1]["t"]) < now:
		_idx += 1
	if _idx >= samples.size() - 1:
		_set_from_sample(samples[samples.size() - 1])
		return
	var a: Dictionary = samples[_idx]
	var b: Dictionary = samples[_idx + 1]
	var span := float(int(b["t"]) - int(a["t"]))
	var f := 0.0 if span <= 0.0 else clampf((now - int(a["t"])) / span, 0.0, 1.0)
	var pa := Vector3(a["px"], a["py"], a["pz"])
	var pb := Vector3(b["px"], b["py"], b["pz"])
	_kart_visual.global_position = pa.lerp(pb, f)
	_kart_visual.rotation.y = lerp_angle(float(a["ry"]), float(b["ry"]), f)

func _set_from_sample(s: Dictionary) -> void:
	_kart_visual.global_position = Vector3(s["px"], s["py"], s["pz"])
	_kart_visual.rotation.y = float(s["ry"])
