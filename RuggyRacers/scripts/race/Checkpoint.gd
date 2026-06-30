extends Area3D
class_name Checkpoint
## A single ordered checkpoint / lap gate. Place these in sequence around the
## track under the "Checkpoints" node. Index 0 doubles as the finish line when
## a lap wraps. Set `is_finish` on the gate that physically sits on the line.
##
## Make the Area3D's CollisionShape a wide, tall box spanning the track so a
## kart can't slip past it. Karts are on collision layer 2 (see README).

signal body_passed(body: Node)

@export var checkpoint_index: int = 0
@export var is_finish: bool = false

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	monitoring = true

func _on_body_entered(body: Node) -> void:
	if body is KartController:
		emit_signal("body_passed", body)

## Used by RaceManager when collecting/sorting checkpoints.
func get_index_in_track() -> int:
	return checkpoint_index
