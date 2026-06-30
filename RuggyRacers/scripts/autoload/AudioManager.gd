extends Node
## AudioManager (autoload singleton)
##
## Central audio hub. ALL sound goes through here so volume settings and
## ducking work everywhere. Audio files are intentionally NOT bundled — every
## entry below is a placeholder hook with a clear comment for the sound artist.
##
## SOUNDTRACK SUGGESTIONS (chaotic / meme-friendly):
##   - Menu:    upbeat phonk / hyperpop with a trap beat, ~140 BPM.
##   - Pump Street: synthwave-trap, big sunset-drive energy.
##   - Lunar Loop:  spacey synth + 808s, half-time, floaty.
##   - Rug War Zone: aggressive war-drums dubstep.
##   - Jackpot Casino: jackpot bells + funky house, slot-machine SFX layered in.
##   - Golden Palace: triumphant orchestral-trap, "made it" vibe.
##
## How to extend:
##   - Drop an .ogg into assets/audio, then map its key in SFX/MUSIC below.
##   - Call AudioManager.play_sfx("hype_pump") from anywhere.

# Map of logical sound name -> resource path. Empty string = not yet authored;
# play_sfx() no-ops gracefully so the game runs silently until assets land.
const SFX := {
	"ui_move":        "", # assets/audio/ui_move.ogg
	"ui_confirm":     "",
	"ui_back":        "",
	"countdown_beep": "", # 3-2-1 tick
	"countdown_go":   "", # GO! horn
	"item_pickup":    "",
	"item_get":       "", # roulette stop
	"hype_pump":      "", # mushroom whoosh + "PUMP IT!"
	"rug_shell":      "", # shell fire + "RUG PULL!"
	"banana_drop":    "",
	"hit":            "", # spinout impact
	"star_loop":      "", # invincibility music loop
	"lightning":      "", # "MARKET CRASH!"
	"jackpot":        "", # "JACKPOT!" bells
	"to_the_moon":    "", # boost pad voice line
	"drift_charge":   "",
	"drift_release":  "", # mini-turbo pop
	"lap_complete":   "",
	"final_lap":      "", # tempo-up jingle
	"finish":         "",
	"crowd_cheer":    "",
}

const MUSIC := {
	"menu":          "",
	"pump_street":   "",
	"banned_boulevard": "",
	"rug_war_zone":  "",
	"lunar_loop":    "",
	"golden_palace": "",
	"jackpot_casino":"",
	"results":       "",
}

# Pool of one-shot SFX players so overlapping sounds don't cut each other off.
const SFX_VOICES := 16
var _sfx_players: Array[AudioStreamPlayer] = []
var _sfx_next := 0
var _music_player: AudioStreamPlayer
var _loaded: Dictionary = {} # path -> AudioStream cache

func _ready() -> void:
	# Ensure the audio buses we reference exist; if the project has no custom
	# bus layout we fall back to Master so nothing errors.
	for i in SFX_VOICES:
		var p := AudioStreamPlayer.new()
		p.bus = _bus_or_master("SFX")
		add_child(p)
		_sfx_players.append(p)
	_music_player = AudioStreamPlayer.new()
	_music_player.bus = _bus_or_master("Music")
	add_child(_music_player)
	apply_volume_settings()

func _bus_or_master(bus_name: String) -> String:
	return bus_name if AudioServer.get_bus_index(bus_name) != -1 else "Master"

## Re-reads volume settings from SaveManager and applies them to buses.
func apply_volume_settings() -> void:
	_set_bus_volume("Master", float(SaveManager.get_setting("master_volume", 1.0)))
	_set_bus_volume("Music", float(SaveManager.get_setting("music_volume", 0.8)))
	_set_bus_volume("SFX", float(SaveManager.get_setting("sfx_volume", 1.0)))

func _set_bus_volume(bus_name: String, linear: float) -> void:
	var idx := AudioServer.get_bus_index(bus_name)
	if idx == -1:
		return
	AudioServer.set_bus_volume_db(idx, linear_to_db(clampf(linear, 0.0001, 1.0)))

# ---------------------------------------------------------------------------
# Playback
# ---------------------------------------------------------------------------

## Plays a one-shot SFX by key. `pitch` lets callers vary impacts so repeated
## hits don't sound robotic. Silently no-ops if the asset isn't authored yet.
func play_sfx(key: String, pitch: float = 1.0, volume_db: float = 0.0) -> void:
	var path: String = SFX.get(key, "")
	var stream := _get_stream(path)
	if stream == null:
		return
	var p := _sfx_players[_sfx_next]
	_sfx_next = (_sfx_next + 1) % SFX_VOICES
	p.stream = stream
	p.pitch_scale = pitch
	p.volume_db = volume_db
	p.play()

## Crossfade-friendly music swap. Currently a hard swap; extend with a Tween
## on volume_db for a smooth fade when assets exist.
func play_music(key: String) -> void:
	var path: String = MUSIC.get(key, "")
	var stream := _get_stream(path)
	if stream == null:
		_music_player.stop()
		return
	if _music_player.stream == stream and _music_player.playing:
		return
	_music_player.stream = stream
	_music_player.play()

func stop_music() -> void:
	_music_player.stop()

func _get_stream(path: String) -> AudioStream:
	if path == "" or not ResourceLoader.exists(path):
		return null
	if not _loaded.has(path):
		_loaded[path] = load(path)
	return _loaded[path]
