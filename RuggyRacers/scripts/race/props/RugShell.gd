extends Area3D
## RugShell — the "Rug Pull Shell" projectile. Flies forward, lightly homing
## toward a target kart if one was provided, and spins out the first kart it
## touches (that isn't the owner). Despawns on hit, on wall contact, or timeout.
##
## Scene: Area3D + MeshInstance3D (a green/red turtle-ish shell) + CollisionShape
## (small sphere). Set collision so it overlaps karts (layer 2).

@export var speed: float = 46.0
@export var homing: float = 2.0
@export var lifetime: float = 6.0

var _dir: Vector3 = Vector3.FORWARD
var _owner_kart: KartController
var _target: KartController
var _age: float = 0.0

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	area_entered.connect(_on_area_entered)

## Called by RaceManager right after instancing.
func launch(dir: Vector3, owner_kart: KartController, target: KartController = null) -> void:
	_dir = dir.normalized()
	_owner_kart = owner_kart
	_target = target

func _physics_process(delta: float) -> void:
	_age += delta
	if _age > lifetime:
		queue_free()
		return
	# Gentle homing toward target's current position.
	if _target and is_instance_valid(_target):
		var to_t := (_target.global_position - global_position)
		to_t.y = 0.0
		if to_t.length() > 0.1:
			_dir = _dir.slerp(to_t.normalized(), clampf(homing * delta, 0.0, 1.0))
	global_position += _dir * speed * delta
	look_at(global_position + _dir, Vector3.UP)

func _on_body_entered(body: Node) -> void:
	if body is KartController and body != _owner_kart:
		(body as KartController).spinout()
		queue_free()
	elif not (body is KartController):
		# Hit a wall / static geometry.
		queue_free()

func _on_area_entered(_a: Area3D) -> void:
	pass
