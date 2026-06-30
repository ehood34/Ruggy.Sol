extends Area3D
class_name BoostPad
## A themed boost strip ("Pump Pad", "Moon Booster", "Golden Gains", ...).
## Driving over it grants the kart an instant additive boost. The label/color
## is purely cosmetic; set `boost_amount` / `boost_time` for strength.
##
## Place flat on the track surface; the CollisionShape should be a thin, wide
## box matching the pad mesh.

@export var boost_amount: float = 10.0
@export var boost_time: float = 1.0
@export var voice_line: String = "to_the_moon" # AudioManager sfx key, optional

func _ready() -> void:
	body_entered.connect(_on_body_entered)

func _on_body_entered(body: Node) -> void:
	if body is KartController:
		(body as KartController).apply_boost(boost_amount, boost_time)
		if voice_line != "":
			AudioManager.play_sfx(voice_line)
