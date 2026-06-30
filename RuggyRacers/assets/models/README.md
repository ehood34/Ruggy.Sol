# Custom 3D Models — drop-in guide

Put your model files in these folders and they load onto the racer automatically
(no scene editing). The game scans each folder for the first `.fbx` / `.glb` /
`.gltf` file, scales it to fit, and replaces the placeholder box.

## Where each file goes

Unzip the **contents** of each model zip (the `.fbx` **and** its texture
images — usually a `textures/` folder or loose `.png`/`.jpg`) into the matching
folder:

```
assets/models/
├── lambo/
│   ├── vehicle/     ← Yellow Lamborghini  (Meshy_AI_Yellow_Lamborghini_…)
│   └── character/   ← Rug Monster / Ruggy (Meshy_AI_Rug_Monster_3D_Charac_…)
└── trench/
    ├── vehicle/     ← War Jeep Go Kart    (Meshy_AI_War_Jeep_Go_Kart_…)
    └── character/   ← Monster Soldier     (Meshy_AI_Monster_Soldier_T_Pos_…)
```

Keep the `.fbx` and its textures **together in the same folder** so materials
load. (If the zip has a nested folder, you can drop that whole folder in — the
scanner searches recursively isn't needed; just make sure the `.fbx` sits
directly in the `vehicle`/`character` folder.)

## After you add them

1. Open the project in Godot — it will **import** the FBX files (first time can
   take a moment). If Godot asks anything about FBX import, accept defaults.
2. Press Play and pick **Lambo Ruggy** or **Trench Ruggy**. Your models appear.

## Tuning (only if something looks off)

All knobs live in `scripts/autoload/RacerDB.gd` under `const MODELS`. Per model:

- `size`  — target size in metres (largest dimension). Bigger = larger kart.
- `scale` — extra multiplier on top of `size` (fine adjust).
- `rot_y` — spin to face forward. The kart drives toward **−Z**; if your model
  faces backward/sideways, set `rot_y` to 90 / 180 / 270.
- `offset`— `Vector3(x, y, z)` nudge in metres. Use the character `y` to seat
  the driver on the vehicle; `z` to move them forward/back.

Tell me what looks wrong ("car is sideways", "Ruggy floats above the seat") and
I'll set the exact numbers — or tweak them yourself and re-run.

## Animations (rigged characters, e.g. Mixamo)

If a character model is a **rigged GLB/FBX with an animation** (like a Mixamo
"driving" clip), it **auto-plays and loops** in-race — no setup needed.

**Honk-on-hit:** export a second clip (e.g. a honk/wave/recoil) from Mixamo and
put that file in the **same `character/` folder** with **`honk` in its filename**
(e.g. `trench_honk.glb`). The game treats the non-honk file as the model and
merges the honk file's animation in as `"honk"`, then plays it automatically
when the kart is hit by an item or slams a wall, returning to the drive loop
after. Both clips must be exports of the **same rig** so the bones line up.

**Avoid drifting:** in Mixamo, tick **"In Place"** when downloading driving/idle
clips. Otherwise the clip's root motion walks the character off its seat. (The
game also tries to anchor root motion, but "In Place" is the clean fix.)

## Performance note

These Meshy exports are high-poly with large textures. On a low-end machine they
may run slowly. If the framerate drops, reduce them in Blender (Decimate
modifier + resize textures to 1024px) or re-export from Meshy at lower quality.
