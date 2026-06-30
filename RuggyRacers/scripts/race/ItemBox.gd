extends Area3D
class_name ItemBox
## Floating item box. When a kart drives through it, that kart's ItemSystem
## rolls an item. The box vanishes briefly then respawns so the track keeps
## flowing. Spin + bob animation is done in code so no AnimationPlayer needed.
##
## Place several around the track (often in rows on the racing line and on
## shortcuts). The mesh is a glowing translucent cube with a "?" — see README.

@export var respawn_time: float = 3.0
@export var spin_speed: float = 2.0
@export var bob_height: float = 0.25

var _active: bool = true
var _t: float = 0.0
var _base_y: float = 0.0
@onready var _mesh: Node3D = get_node_or_null("Mesh")
@onready var _shape: CollisionShape3D = get_node_or_null("CollisionShape3D")

func _ready() -> void:
	_base_y = position.y
	body_entered.connect(_on_body_entered)

func _process(delta: float) -> void:
	_t += delta
	if _mesh:
		_mesh.rotate_y(spin_speed * delta)
		_mesh.position.y = sin(_t * 3.0) * bob_height
		_mesh.visible = _active

func _on_body_entered(body: Node) -> void:
	if not _active or not (body is KartController):
		return
	var isys = body.get_node_or_null("ItemSystem")
	if isys and isys.has_method("pick_up_box"):
		isys.pick_up_box()
	_consume()

func _consume() -> void:
	_active = false
	if _shape:
		_shape.set_deferred("disabled", true)
	await get_tree().create_timer(respawn_time).timeout
	_active = true
	if _shape:
		_shape.set_deferred("disabled", false)
