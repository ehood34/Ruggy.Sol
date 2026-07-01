extends Node
## RacerDB (autoload singleton)
##
## Static design data for the 6 racers, their signature karts, the 6 tracks,
## and the 2 cups. This is the single source of truth that every menu, the
## character-select preview, and the kart spawner read from.
##
## All visual descriptions reference the user's concept art so a modeller /
## texture artist can match each variant exactly. Stats are normalized 1..10
## and are converted to physics tuning by KartStats.from_racer().
##
## How to extend:
##   - Add an entry to RACERS / TRACKS / CUPS. Nothing else hard-codes the count.
##   - `unlock` marks whether it must be earned; SaveManager owns actual state.

# ---------------------------------------------------------------------------
# RACERS
# ---------------------------------------------------------------------------
# stats: speed / accel / handling / weight  (1..10)
# trait_id drives a gameplay hook in KartController / ItemSystem.

const RACERS := {
	"lambo": {
		"name": "Lambo Ruggy",
		"vehicle": "Yellow Lamborghini",
		"bio": "Suit, red tie, fat stack of $100s. The poster boy. Does everything well and looks good doing it.",
		"trait_id": "balanced",
		"trait_text": "All-Rounder — no weaknesses.",
		"stats": {"speed": 7, "accel": 7, "handling": 7, "weight": 6},
		"fur_color": Color(0.48, 0.30, 0.16),
		"accent_color": Color(1.0, 0.84, 0.0),
		"kart_color": Color(1.0, 0.78, 0.0),
		"unlock": false,
	},
	"trench": {
		"name": "Trench Ruggy",
		"vehicle": "Battle Jeep",
		"bio": "Helmet, torn camo, permanent scowl. Lives in the trenches. Gun is cosmetic until the Barrage special fires.",
		"trait_id": "aggressive",
		"trait_text": "Warpath — ramming and item hits are stronger.",
		"stats": {"speed": 6, "accel": 9, "handling": 6, "weight": 7},
		"fur_color": Color(0.40, 0.26, 0.14),
		"accent_color": Color(0.32, 0.36, 0.22),
		"kart_color": Color(0.30, 0.34, 0.24),
		"unlock": false,
	},
	"banned": {
		"name": "Banned Ruggy",
		"vehicle": "Server Rack Kart",
		"bio": "Teary-eyed crypto outlaw wrapped in red 'BANNED WALLETS' LED signs. Blisteringly fast, twitchy to control.",
		"trait_id": "fragile_speed",
		"trait_text": "Blacklisted — highest top speed, punishing handling.",
		"stats": {"speed": 10, "accel": 6, "handling": 4, "weight": 5},
		"fur_color": Color(0.42, 0.28, 0.18),
		"accent_color": Color(0.95, 0.10, 0.20),
		"kart_color": Color(0.08, 0.08, 0.12),
		"unlock": false,
	},
	"moon": {
		"name": "Moon Ruggy",
		"vehicle": "Lunar Hover Buggy",
		"bio": "Full astronaut suit, huge toothy grin, satellite dish kart. Floaty and forgiving — owns the air.",
		"trait_id": "air_master",
		"trait_text": "To The Moon — best jump height and mid-air control.",
		"stats": {"speed": 7, "accel": 6, "handling": 8, "weight": 4},
		"fur_color": Color(0.45, 0.30, 0.18),
		"accent_color": Color(0.30, 0.55, 1.0),
		"kart_color": Color(0.85, 0.88, 0.95),
		"unlock": true,
	},
	"golden": {
		"name": "Golden Ruggy",
		"vehicle": "Golden Rolls-Royce",
		"bio": "Metallic gold fur, pointing to the heavens, chopped golden Rolls convertible in a chandelier-lit palace. Pure whale.",
		"trait_id": "heavy_brawler",
		"trait_text": "Whale Status — heavy, shrugs off hits, brutal ramming.",
		"stats": {"speed": 7, "accel": 7, "handling": 5, "weight": 10},
		"fur_color": Color(0.95, 0.78, 0.25),
		"accent_color": Color(1.0, 0.90, 0.45),
		"kart_color": Color(0.92, 0.74, 0.20),
		"unlock": true,
	},
	"lotto": {
		"name": "Lotto Ruggy",
		"vehicle": "Slot Machine Kart",
		"bio": "Sparkly vest, red polka-dot bowtie, golden mic. Drives a rolling jackpot. Fortune favors the degenerate.",
		"trait_id": "lucky",
		"trait_text": "House Edge — meaningfully better item rolls.",
		"stats": {"speed": 6, "accel": 7, "handling": 7, "weight": 6},
		"fur_color": Color(0.46, 0.30, 0.17),
		"accent_color": Color(1.0, 0.20, 0.40),
		"kart_color": Color(0.85, 0.10, 0.30),
		"unlock": true,
	},
}

# Stable display order for carousels / grids.
const RACER_ORDER := ["lambo", "trench", "banned", "moon", "golden", "lotto"]

# ---------------------------------------------------------------------------
# TRACKS
# ---------------------------------------------------------------------------
# `scene` points at the playable track scene. `boost_label` themes the boost
# pads. `targets` are time-trial medal cutoffs in milliseconds (total race).

const TRACKS := {
	"pump_street": {
		"name": "Pump Street",
		"theme": "Sunset city highway, supercars, explosions, nitro pads.",
		"scene": "res://scenes/tracks/TestTrack.tscn", # swap for PumpStreet.tscn when built
		"boost_label": "PUMP PAD",
		"hazards": ["traffic", "explosions"],
		"targets": {"gold": 120000, "silver": 135000, "bronze": 150000},
		"unlock": true,
	},
	"banned_boulevard": {
		"name": "Banned Boulevard",
		"theme": "Neon cyberpunk highway, banned-wallet holograms, liquidity mud.",
		"scene": "res://scenes/tracks/TestTrack.tscn",
		"boost_label": "DEGEN DASH",
		"hazards": ["liquidity_mud", "server_racks"],
		"targets": {"gold": 125000, "silver": 140000, "bronze": 155000},
		"unlock": true,
	},
	"rug_war_zone": {
		"name": "Rug War Zone",
		"theme": "Muddy battlefield, barbed wire, trench jumps, random explosions, rain.",
		"scene": "res://scenes/tracks/TestTrack.tscn",
		"boost_label": "CHARGE!",
		"hazards": ["mud", "explosions", "barbed_wire"],
		"targets": {"gold": 130000, "silver": 145000, "bronze": 160000},
		"unlock": true,
	},
	"lunar_loop": {
		"name": "Lunar Loop",
		"theme": "Moon surface, low gravity, crater jumps, Earthrise, asteroids.",
		"scene": "res://scenes/tracks/TestTrack.tscn",
		"boost_label": "MOON BOOSTER",
		"hazards": ["asteroids", "low_gravity"],
		"targets": {"gold": 128000, "silver": 142000, "bronze": 158000},
		"unlock": false,
	},
	"golden_palace": {
		"name": "Golden Palace Circuit",
		"theme": "Opulent mansion + gardens, chandelier swings, grand-staircase jumps, marble drifts.",
		"scene": "res://scenes/tracks/TestTrack.tscn",
		"boost_label": "GOLDEN GAINS",
		"hazards": ["chandeliers", "marble_slip"],
		"targets": {"gold": 132000, "silver": 147000, "bronze": 162000},
		"unlock": false,
	},
	"jackpot_casino": {
		"name": "Jackpot Casino",
		"theme": "Casino floor + Vegas strip, roulette hazards, coin showers, slot obstacles.",
		"scene": "res://scenes/tracks/TestTrack.tscn",
		"boost_label": "JACKPOT JET",
		"hazards": ["roulette", "coin_shower"],
		"targets": {"gold": 135000, "silver": 150000, "bronze": 165000},
		"unlock": false,
	},
}

const TRACK_ORDER := ["pump_street", "banned_boulevard", "rug_war_zone", "lunar_loop", "golden_palace", "jackpot_casino"]

# ---------------------------------------------------------------------------
# CUPS (Grand Prix) — 4 tracks each
# ---------------------------------------------------------------------------

const CUPS := {
	"degen_cup": {
		"name": "Degen Cup",
		"tracks": ["pump_street", "banned_boulevard", "rug_war_zone", "lunar_loop"],
		"reward_currency": 500,
		"unlock_on_win": {"racers": ["golden"], "tracks": ["golden_palace"]},
	},
	"whale_cup": {
		"name": "Whale Cup",
		"tracks": ["golden_palace", "jackpot_casino", "lunar_loop", "pump_street"],
		"reward_currency": 1000,
		"unlock_on_win": {"racers": ["lotto"], "tracks": ["jackpot_casino"]},
	},
}

# Grand-prix scoring by finishing position (index 0 = 1st).
const GP_POINTS := [15, 12, 10, 8, 6, 4, 2, 1]

# ---------------------------------------------------------------------------
# CUSTOM 3D MODELS (optional, drop-in)
# ---------------------------------------------------------------------------
# Put a model file (FBX/GLB/GLTF + textures) in each folder below and it auto-
# loads onto that racer, replacing the placeholder box. ModelMount.gd measures
# and scales it to `size` (metres, largest dimension), then applies the tweaks.
# Leave a folder empty/absent to keep the placeholder.
#
# TUNING: after you see it in-game, adjust `size`, `scale`, `rot_y` (turn to
# face forward = -Z), and `offset` (Vector3, metres). These are the only knobs
# you should ever need. The character `offset` lifts/seats the driver.

const MODELS := {
	# rot_y turns the model to face forward (the kart drives toward -Z). If a
	# model faces LEFT, 90 fixes it; if that makes it face RIGHT, use -90 (=270);
	# 180 = full flip. Tweak per model until it points where the kart drives.
	"lambo": {
		"vehicle":   {"dir": "res://assets/models/lambo/vehicle",   "size": 3.0, "scale": 1.0, "rot_y": 90.0,  "offset": Vector3(0, 0, 0)},
		"character": {"dir": "res://assets/models/lambo/character", "size": 1.3, "scale": 1.0, "rot_y": 90.0,  "offset": Vector3(0, 0.5, -0.1)},
	},
	"trench": {
		"vehicle":   {"dir": "res://assets/models/trench/vehicle",   "size": 3.0, "scale": 1.0, "rot_y": 90.0,  "offset": Vector3(0, 0, 0)},
		# Rigged Mixamo character: use fixed_scale (native size) instead of auto-
		# fit, which mis-measures skinned meshes. If still too big/small, change
		# fixed_scale (try 0.6 / 1.4); use offset.y to seat him in the jeep.
		"character": {"dir": "res://assets/models/trench/character", "fixed_scale": 1.3, "rot_y": 0.0, "offset": Vector3(0, 0.85, 0.35)},
	},
}

func get_models(id: String) -> Dictionary:
	return MODELS.get(id, {})

# ---------------------------------------------------------------------------
# Accessors
# ---------------------------------------------------------------------------

func get_racer(id: String) -> Dictionary:
	return RACERS.get(id, RACERS["lambo"])

func get_track(id: String) -> Dictionary:
	return TRACKS.get(id, TRACKS["pump_street"])

func get_cup(id: String) -> Dictionary:
	return CUPS.get(id, CUPS["degen_cup"])

## Medal string for a total race time on a track ("gold"/"silver"/"bronze"/"none").
func medal_for_time(track_id: String, total_ms: int) -> String:
	var t: Dictionary = get_track(track_id).get("targets", {})
	if total_ms <= int(t.get("gold", 0)):
		return "gold"
	if total_ms <= int(t.get("silver", 0)):
		return "silver"
	if total_ms <= int(t.get("bronze", 0)):
		return "bronze"
	return "none"
