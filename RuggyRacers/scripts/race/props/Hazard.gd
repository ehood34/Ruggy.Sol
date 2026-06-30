extends Area3D
## Hazard — shared script for dropped ground items: Liquidity Banana, Honeypot
## Bomb, and Fake Item Box. Behavior keys off `item_id` so one scene type can
## back all three (or duplicate the scene and hard-set item_id per prop).
##
##   liquidity_banana : spin out on touch (peel).
##   honeypot_bomb    : explodes on touch OR after a fuse, spins out everyone
##                      in blast radius with screen shake.
##   fake_box         : looks like an item box, spins out whoever grabs it.
##
## Scene: Area3D + Mesh + CollisionShape (small box/sphere). See README.

@export var item_id: String = "liquidity_banana"
@export var fuse: float = 0.0          # >0 = auto-explode after this many seconds
@export var blast_radius: float = 4.5
@export var arm_delay: float = 0.4     # don't hit the dropper instantly

var _armed: bool = false

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	await get_tree().create_timer(arm_delay).timeout
	_armed = true
	if item_id == "honeypot_bomb" and fuse > 0.0:
		await get_tree().create_timer(fuse).timeout
		_explode()

func set_item_id(id: String) -> void:
	item_id = id

func _on_body_entered(body: Node) -> void:
	if not _armed or not (body is KartController):
		return
	match item_id:
		"honeypot_bomb":
			_explode()
		_:
			(body as KartController).spinout()
			AudioManager.play_sfx("hit")
			queue_free()

func _explode() -> void:
	AudioManager.play_sfx("hit", 0.8)
	# Spin out every kart within the blast radius.
	for k in get_tree().get_nodes_in_group("karts"):
		if k is KartController and k.global_position.distance_to(global_position) <= blast_radius:
			var dir = (k.global_position - global_position).normalized()
			(k as KartController).spinout()
			(k as KartController).apply_knockback(dir, 12.0)
	# TODO: spawn explosion particles + camera shake here when FX scene exists.
	queue_free()
