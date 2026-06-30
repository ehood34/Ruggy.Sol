# 🏎️ Ruggy Racers

A chaotic, meme/crypto/degen-culture **Mario Kart-style 3D arcade racer** built in
**Godot 4.3+ (GDScript)**, starring **Ruggy** — a fluffy brown gremlin with big
eyes, a snout, and sharp teeth.

This repository contains a **complete, runnable project foundation**: the full
code architecture, a self-assembling test track that is fun to drive
immediately, all six racers/tracks defined as data, the item system, AI, every
menu, and all five game modes (including a full Speedrun/Time-Trial mode with
ghosts). Art and audio are intentionally placeholder hooks — the code is wired so
you drop in models/textures/sounds without touching gameplay logic.

> **The driving is the point.** The kart controller (`KartController.gd`) is tuned
> for that "on rails but slidey" arcade feel: snappy throttle, weighty
> powerslides, a 3-tier mini-turbo (blue → orange → purple), ramp launches with
> real mid-air control, and per-racer personality. Press Play and drive.

---

## ▶️ How to run

1. Install **Godot 4.3 or newer** (standard build, GDScript — no C# needed).
2. Open Godot → **Import** → select `RuggyRacers/project.godot`.
3. Press **F5** (Play). The boot splash leads to the main menu.
4. Quick Race → pick a Ruggy → pick a track → **START RACE**.

No external assets are required to run — the test track builds itself in code.

### Controls

| Action | Keyboard | Gamepad |
|---|---|---|
| Accelerate | W / Up | RT (R2) |
| Brake / Reverse | S / Down | LT (L2) |
| Steer | A / D or ← / → | Left stick |
| Drift (hold) | Space / Shift | A (✕) |
| Use Item | L | X (□) |
| Look Back | C | Y (△) |
| Pause | Esc | Start |
| Restart (debug) | R | — |

**Drifting:** while moving fast, hold Drift + steer to powerslide. A charge meter
fills (HUD bottom-center): release at **blue**, **orange**, or **purple** for an
increasingly big boost. Chain drifts through corners to fly.

---

## 🗂️ Project structure

```
RuggyRacers/
├── project.godot              # autoloads, input map, physics/render config
├── icon.svg
├── scripts/
│   ├── autoload/              # global singletons
│   │   ├── SaveManager.gd     # JSON save: settings, unlocks, best times, ghosts
│   │   ├── RacerDB.gd         # data for 6 racers, 6 tracks, 2 cups (single source of truth)
│   │   ├── GameManager.gd     # race intent + scene flow + progression
│   │   └── AudioManager.gd    # SFX/music hub (placeholder hooks + soundtrack notes)
│   ├── kart/
│   │   ├── KartController.gd   # ⭐ core physics: drive, drift, mini-turbo, air, boost
│   │   ├── KartStats.gd        # per-racer tuning from RacerDB's 1..10 stats
│   │   └── ItemSystem.gd       # 10 items, position-weighted rolls, luck, specials
│   ├── race/
│   │   ├── RaceManager.gd      # spawns field, countdown, laps, positions, items, results
│   │   ├── AIController.gd     # waypoint-following AI with fair rubber-banding
│   │   ├── Checkpoint.gd / ItemBox.gd / BoostPad.gd / GhostPlayer.gd
│   │   └── props/              # RugShell.gd, Hazard.gd (banana/bomb/fake box)
│   ├── tracks/
│   │   └── TrackBuilder.gd     # procedurally builds the playable test circuit
│   └── ui/                     # self-building menus + HUD + theme helpers
├── scenes/
│   ├── karts/Kart.tscn         # the kart (body, fur head, wheels, rays, camera, sparks)
│   ├── tracks/TestTrack.tscn   # playable race scene (RaceManager root + builder + HUD)
│   ├── props/                  # ItemBox, BoostPad, RugShell, Banana, HoneypotBomb, FakeItemBox
│   └── ui/                     # Boot, MainMenu, CharacterSelect, TrackSelect, Results, Garage, Options, RaceHUD, PauseMenu
└── assets/                     # drop audio/, fonts/, textures/ here (empty placeholders)
```

---

## 🎮 The roster (data in `RacerDB.gd`)

| Racer | Vehicle | Trait | Feel |
|---|---|---|---|
| **Lambo Ruggy** | Yellow Lamborghini | All-Rounder | Balanced, no weaknesses |
| **Trench Ruggy** | Battle Jeep | Warpath | High accel, aggressive, strong hits |
| **Banned Ruggy** | Server Rack Kart | Blacklisted | Top speed monster, twitchy grip |
| **Moon Ruggy** | Lunar Hover Buggy | To The Moon | Best jump + mid-air control, floaty |
| **Golden Ruggy** | Golden Rolls-Royce | Whale Status | Heavy tank, brutal ramming |
| **Lotto Ruggy** | Slot Machine Kart | House Edge | Noticeably better item luck |

Stats (Speed / Acceleration / Handling / Weight) are 1–10 and are converted into
real physics values by `KartStats.from_racer()`, plus a signature trait modifier
so each one actually plays differently.

## 🏁 The tracks (data in `RacerDB.gd`)

`pump_street`, `banned_boulevard`, `rug_war_zone`, `lunar_loop`,
`golden_palace`, `jackpot_casino` — each with a theme, boost-pad label, hazard
list, and Time-Trial medal targets. **All six currently point at
`TestTrack.tscn`** so everything is playable today; build bespoke scenes and
repoint the `scene` field per track (see "Authoring a real track").

## 🎁 Items (`ItemSystem.gd`)

Hype Pump (boost), Rug Pull Shell, Liquidity Banana, Diamond Hands Star,
Market Crash (lightning), Honeypot Bomb, Fake Item Box, Golden Ticket,
**Barrage** (Trench special, multi-projectile), **777 Jackpot** (Lotto special,
random high-value chaos). Rolls are **position-weighted** like Mario Kart —
leaders get peels, stragglers get stars — and Lotto's `luck` skews the table.

---

## 🛠️ How the test track works (and how to make your own)

`TestTrack.tscn`'s **root node has `RaceManager.gd`**. A child `TrackBuilder`
node generates the whole circuit in code at load: ground, neon oval walls,
checkpoints, the AI racing line, the start grid, item-box rows, boost pads, and
jump ramps. This is why the game is playable with zero art.

### The track contract (what RaceManager expects as children of its root)

- **`Grid`** — a `Node3D` with `Marker3D` children = start positions (front→back).
- **`Checkpoints`** — `Node3D` whose ordered children run `Checkpoint.gd` with
  `checkpoint_index` 0..N. Index 0 is the start/finish (`is_finish = true`). A lap
  counts only when crossing index 0 right after the last index (no start-line cheese).
- **`AIWaypoints`** — a `Path3D` (preferred) following the racing line, **or**
  `Marker3D` nodes in group `ai_waypoints`.
- Optional anywhere: `ItemBox.tscn`, `BoostPad.tscn`, ramps, hazards.

### Authoring a bespoke track (with real art)

1. Duplicate `TestTrack.tscn`, rename it (e.g. `PumpStreet.tscn`).
2. **Delete the `TrackBuilder` child.**
3. Model/lay out your track geometry as `StaticBody3D` meshes (collision layer 1).
4. Add the `Grid`, `Checkpoints`, and `AIWaypoints` nodes by hand following the
   contract above. Place `ItemBox`/`BoostPad` instances and ramps.
5. Keep the `WorldEnvironment`, light, `RaceHUD`, and `PauseMenu` nodes.
6. In `RacerDB.gd`, set that track's `scene` to your new `.tscn`.

Tune the procedural layout (`RX`, `RZ`, `TRACK_WIDTH`, feature placement) in
`TrackBuilder.gd` to prototype new shapes instantly before committing to art.

---

## 🎨 Theming with the concept art

One base kart model + Ruggy model is meant to be reskinned per racer. Right now
`KartController.apply_theme()` tints placeholder meshes (`BodyMesh`, `FurMesh`)
from each racer's colors in `RacerDB.gd`. To use real art:

- Model **one base Ruggy** (low-poly/stylized: big eyes, snout, sharp teeth) and
  the six vehicles, matching the reference renders:
  - **Banned** — teary-eyed outlaw, server-rack kart wrapped in red "BANNED
    WALLETS" LED signs, dark neon track.
  - **Moon** — toothy grin, white astronaut suit + helmet, hovering moon buggy
    with satellite dish, blue/purple neon, lunar surface, Earth in sky.
  - **Golden** — metallic gold fur, triumphant pointing-up pose, chopped golden
    Rolls-Royce convertible with exposed engine, opulent chandelier palace.
  - **Lambo** — business suit + red tie, stack of $100s, bright yellow
    Lamborghini, sunset highway with explosions (the "main" cover style).
  - **Trench** — angry sharp-teeth scowl, military helmet, torn camo, rusty
    battle jeep with mounted (cosmetic) machine gun, rainy muddy warzone.
  - **Lotto** — huge grin, sparkly vest + red polka-dot bowtie, golden mic,
    slot-machine kart with 777s/cherries/coins, casino/game-show lighting.
- Per racer, swap in a vehicle scene + material instead of the placeholder tint.
  The cleanest hook: replace the `Model` subtree of `Kart.tscn` per racer (e.g. a
  `kart_scene` path in `RacerDB`) and have the spawner instance it.

### Character-select 3D preview

`CharacterSelect.gd` currently shows a color-tinted portrait panel. For real 3D:
add a `SubViewport` + `Camera3D` rendering the selected racer's character/kart
scene on a turntable, and display it via a `TextureRect` using the viewport's
texture.

---

## 🕹️ Game modes (all implemented in the flow)

- **Grand Prix** — pick a Cup (4 tracks), points by placement (15/12/10/8/…),
  "Next Race" chains through the cup, cup win grants currency + unlocks
  (see `RacerDB.CUPS.unlock_on_win`).
- **Quick Race** — any track, 0–7 AI, 3/5/7 laps, Chill→Brutal difficulty.
- **Local Vs (split-screen)** — `GameManager.player_racers` already supports up to
  4 humans; see "Split-screen setup" below to finish the viewport wiring.
- **Tournament** — reuses the GP point flow (extend `RaceManager` for brackets).
- **Speedrun / Time Trial** — laps with **ghost replay** of your best run, lap
  splits, **Gold/Silver/Bronze medals** vs per-track targets, Practice toggle
  (items on/off), and a post-run summary. Best times + ghosts persist via
  `SaveManager` (`user://` JSON + `user://ghost_<track>.json`).

### Split-screen setup (to finish)

`GameManager.configure_local_vs()` accepts an array of racers. To render N
players: create a `SplitScreen.tscn` with N `SubViewportContainer`/`SubViewport`
nodes, instance one `RaceHUD` per viewport, set each player kart's
`Camera3D.current` inside its own viewport, and call `_gather_input("_p2")` etc.
(add `accelerate_p2`, `steer_left_p2`, … actions in `project.godot`). The kart,
item, and physics systems are already per-instance and need no changes.

---

## 🔊 Audio

`AudioManager.gd` is a complete routing hub with **named placeholder hooks** for
every SFX and music track (see the `SFX`/`MUSIC` dictionaries) and a soundtrack
mood guide per track. Drop `.ogg` files in `assets/audio/`, set the paths in
those dictionaries, and calls like `AudioManager.play_sfx("hype_pump")` start
working — no other code changes. Optional: create an audio **Bus Layout** with
`Music` and `SFX` buses; if absent everything routes to `Master`.

Suggested voice lines (TTS placeholders fine): "PUMP IT!", "RUG PULL!",
"TO THE MOON!", "MARKET CRASH!", "JACKPOT!".

---

## 💾 Save data

`SaveManager.gd` writes one JSON file to `user://ruggy_racers_save.json`
(settings, unlocks, currency, GP progress, time-trial records, stats) and ghost
files per track. Old saves auto-merge new default keys, so adding fields never
breaks existing saves. **Options → Reset All Progress** wipes it.

---

## 🧩 Extending things

- **New racer:** add an entry to `RacerDB.RACERS` (+ to `RACER_ORDER`) and a
  trait case in `KartStats.from_racer()`. Menus, select screen, and spawner pick
  it up automatically.
- **New item:** add to `ItemSystem.ITEMS` with position weights and a case in
  `_activate()`. Cross-kart effects go through `RaceManager` for fairness.
- **New track:** add to `RacerDB.TRACKS` (+ `TRACK_ORDER`) and build the scene per
  the contract.
- **Tuning feel:** `KartController` constants (`MT_*`, `GRAVITY`, grip) and
  `KartStats` ranges. Everything is commented.

---

## ✅ What's done vs. next steps

**Done & runnable:** core kart physics + drift/mini-turbo + ramps/air control,
self-building playable circuit, item system (all 10) + projectiles/hazards,
waypoint AI with rubber-banding, lap/position/checkpoint logic, full menu flow,
HUD (speedo, position, laps, item slot, boost meter, mini-map, countdown),
results/podium, Garage, Options, save system, and full Speedrun mode with ghosts
and medals.

**Placeholder / next:** real 3D Ruggy + vehicle models and track art, authored
audio, particle/screen-shake "juice" passes, the bespoke versions of the six
themed tracks, the split-screen viewport scene, and SubViewport character
previews. All are wired to drop in without reworking gameplay code.

Now go drift. 🟦🟧🟪
