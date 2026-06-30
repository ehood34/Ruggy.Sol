extends Node
class_name ItemSystem
## ItemSystem — per-kart item holder, roller, and activator.
##
## Attach as a child node named "ItemSystem" under a KartController. It pulls
## the owning kart automatically. Item rolls are POSITION-WEIGHTED like Mario
## Kart: leaders get weak items, trailers get game-changers. Lotto Ruggy's
## `luck` stat shifts the whole table toward the good stuff.
##
## How to extend:
##   - Add an entry to ITEMS and a case in _activate(). Projectiles / hazards
##     spawn placeholder scenes referenced by SPAWN_SCENES (created in editor).

signal item_changed(item_id: String)
signal item_used(item_id: String)

# --- The 10 items. `weights` maps a coarse race-position bucket to a base
# weight. Buckets: "lead" (1st-2nd), "mid", "back" (last third). ---
const ITEMS := {
	"hype_pump": {     # mushroom: instant speed boost
		"name": "Hype Pump", "icon": "🍄",
		"weights": {"lead": 6, "mid": 8, "back": 6}},
	"rug_shell": {     # shell: homing-ish projectile that spins out a rival
		"name": "Rug Pull Shell", "icon": "🐢",
		"weights": {"lead": 5, "mid": 7, "back": 4}},
	"liquidity_banana":{ # banana: drop a hazard behind you
		"name": "Liquidity Banana", "icon": "🍌",
		"weights": {"lead": 7, "mid": 5, "back": 3}},
	"diamond_star": {  # star: invincibility + speed
		"name": "Diamond Hands Star", "icon": "⭐",
		"weights": {"lead": 0, "mid": 2, "back": 6}},
	"market_crash": {  # lightning: slow/squash everyone ahead
		"name": "Market Crash", "icon": "⚡",
		"weights": {"lead": 0, "mid": 1, "back": 5}},
	"honeypot_bomb": { # bomb: drop/throw an exploding hazard
		"name": "Honeypot Bomb", "icon": "💣",
		"weights": {"lead": 3, "mid": 5, "back": 4}},
	"fake_box": {      # fake item box: looks like a real box, spins out
		"name": "Fake Item Box", "icon": "📦",
		"weights": {"lead": 4, "mid": 3, "back": 2}},
	"golden_ticket": { # temporary massive luck (next box is great) + small boost
		"name": "Golden Ticket", "icon": "🎫",
		"weights": {"lead": 1, "mid": 2, "back": 3}},
	"barrage": {       # Trench special: multi projectile spread
		"name": "Barrage", "icon": "🔫",
		"weights": {"lead": 1, "mid": 2, "back": 3}},
	"jackpot_777": {   # Lotto special: random high-value effect
		"name": "777 Jackpot", "icon": "🎰",
		"weights": {"lead": 1, "mid": 2, "back": 3}},
}

# Scenes for spawned items. Create these in the editor (see README) and point
# the paths here; missing scenes degrade gracefully (effect still applies).
const SPAWN_SCENES := {
	"rug_shell": "res://scenes/props/RugShell.tscn",
	"liquidity_banana": "res://scenes/props/Banana.tscn",
	"honeypot_bomb": "res://scenes/props/HoneypotBomb.tscn",
	"fake_box": "res://scenes/props/FakeItemBox.tscn",
}

@onready var kart: KartController = get_parent() as KartController

var held_item: String = ""
var is_rolling: bool = false
var _roll_time: float = 0.0
var _roll_result: String = ""
var golden_ticket_active: bool = false # next roll guaranteed top-tier

# RaceManager sets this each frame so weighting knows our standing.
var race_position: int = 1
var race_total: int = 8

func _process(delta: float) -> void:
	if is_rolling:
		_roll_time -= delta
		if _roll_time <= 0.0:
			is_rolling = false
			held_item = _roll_result
			emit_signal("item_changed", held_item)
			AudioManager.play_sfx("item_get")

## Called when the kart drives through an item box. Begins the roulette spin;
## the actual item lands after a short delay for that classic anticipation.
func pick_up_box() -> void:
	if held_item != "" or is_rolling:
		return # already holding / rolling
	is_rolling = true
	_roll_time = 0.9
	_roll_result = _roll_item()
	emit_signal("item_changed", "rolling")
	AudioManager.play_sfx("item_pickup")

## Weighted random roll honoring race position + racer luck + golden ticket.
func _roll_item() -> String:
	if golden_ticket_active:
		golden_ticket_active = false
		# Guaranteed strong item.
		return ["diamond_star", "market_crash", "jackpot_777"].pick_random()

	var bucket := _position_bucket()
	var luck: float = kart.stats.luck if kart and kart.stats else 1.0
	var table: Array = []
	var weights: Array[float] = []
	for id in ITEMS:
		var base: float = float(ITEMS[id]["weights"][bucket])
		if base <= 0.0:
			continue
		# Luck pushes weight toward "strong" items (those weak/zero in the lead).
		var is_strong: bool = int(ITEMS[id]["weights"]["lead"]) <= 1
		var w: float = base * (luck if is_strong else 1.0)
		# Specials are reserved as a flavor bonus for their owner.
		if id == "barrage" and (kart == null or kart.stats.trait_id != "aggressive"):
			w *= 0.25
		if id == "jackpot_777" and (kart == null or kart.stats.trait_id != "lucky"):
			w *= 0.25
		table.append(id)
		weights.append(w)
	return _weighted_pick(table, weights)

func _position_bucket() -> String:
	var frac := float(race_position) / float(max(1, race_total))
	if race_position <= 2:
		return "lead"
	if frac >= 0.7:
		return "back"
	return "mid"

func _weighted_pick(items: Array, weights: Array[float]) -> String:
	var total := 0.0
	for w in weights:
		total += w
	if total <= 0.0:
		return "hype_pump"
	var r := randf() * total
	for i in items.size():
		r -= weights[i]
		if r <= 0.0:
			return items[i]
	return items[items.size() - 1]

## Use the currently held item. Called by KartController on the item button.
func use_held_item() -> void:
	if held_item == "" or is_rolling:
		return
	var id := held_item
	held_item = ""
	emit_signal("item_changed", "")
	emit_signal("item_used", id)
	SaveManager.bump_stat("items_used")
	_activate(id)

# ---------------------------------------------------------------------------
# Item activation. Effects that touch other karts go through RaceManager so a
# single authority resolves them (works for AI and multiplayer alike).
# ---------------------------------------------------------------------------

func _activate(id: String) -> void:
	var rm := _race_manager()
	match id:
		"hype_pump":
			kart.apply_boost(9.0, 1.1)
			AudioManager.play_sfx("hype_pump")
		"golden_ticket":
			golden_ticket_active = true
			kart.apply_boost(4.0, 0.6)
			AudioManager.play_sfx("jackpot")
		"diamond_star":
			kart.make_invincible(7.0)
			kart.apply_boost(6.0, 7.0)
			AudioManager.play_sfx("star_loop")
		"liquidity_banana":
			_spawn_behind("liquidity_banana")
			AudioManager.play_sfx("banana_drop")
		"honeypot_bomb":
			_spawn_behind("honeypot_bomb")
		"fake_box":
			_spawn_behind("fake_box")
		"rug_shell":
			if rm: rm.fire_shell(kart)
			AudioManager.play_sfx("rug_shell")
		"barrage":
			if rm:
				for i in 3:
					rm.fire_shell(kart, i) # spread of small projectiles
			AudioManager.play_sfx("rug_shell", 1.2)
		"market_crash":
			if rm: rm.lightning_strike(kart)
			AudioManager.play_sfx("lightning")
		"jackpot_777":
			_jackpot(rm)

## 777 Jackpot: random high-value effect — the chaotic Lotto signature.
func _jackpot(rm) -> void:
	AudioManager.play_sfx("jackpot")
	match randi() % 4:
		0: # triple boost
			kart.apply_boost(18.0, 2.0)
		1: # star + boost
			kart.make_invincible(5.0)
			kart.apply_boost(8.0, 5.0)
		2: # lightning everyone ahead
			if rm: rm.lightning_strike(kart)
		3: # full barrage
			if rm:
				for i in 5:
					rm.fire_shell(kart, i)

func _spawn_behind(id: String) -> void:
	var rm := _race_manager()
	var path: String = SPAWN_SCENES.get(id, "")
	if rm and rm.has_method("spawn_hazard"):
		rm.spawn_hazard(path, kart, id)

func _race_manager():
	# RaceManager registers itself in the "race_manager" group.
	var nodes := get_tree().get_nodes_in_group("race_manager")
	return nodes[0] if nodes.size() > 0 else null

func has_item() -> bool:
	return held_item != "" and not is_rolling

func get_held_icon() -> String:
	if is_rolling:
		return "❓"
	return ITEMS.get(held_item, {}).get("icon", "")
