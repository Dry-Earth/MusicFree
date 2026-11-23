# MusicFree for Android Head Units

> A fork of [MusicFree](https://github.com/maotoumao/MusicFree) by **maotoumao**, adapted for Android car head units, especially **BYD DiLink**.
>
> The upstream project is licensed under **AGPL-3.0**. This fork keeps the same license. Many thanks to the upstream author and all plugin authors.

## Download

- **Latest release**: <https://github.com/Dry-Earth/MusicFree/releases/latest>
- Build artifacts are also available in [GitHub Actions](https://github.com/Dry-Earth/MusicFree/actions).

Typical release assets:

- `app-universal-release.apk` (recommended)
- `app-arm64-v8a-release.apk`
- `app-armeabi-v7a-release.apk`

> This fork uses its own release signing key. Uninstall any official/other-signed/debug build before installing, otherwise Android will report a signature mismatch.

## Car adaptations

- Auto-detects BYD / DiLink / automotive UI / large landscape screens
- Persistent three-pane car home: icon rail + secondary menu/content + fixed player
- Deep pages (playlists, albums, plugin details) slide in from the right inside the middle pane while the player stays visible
- Swipe between cover and lyrics
- Adjustable display size (80%~120%, restart required) and font size (85%~120%, immediate)
- Car mode: landscape layout and media controls, auto-enlargement can be disabled
- Narrower drawer and search bar for 12-inch and 1920px-wide head units
- Legacy storage mode (`targetSdk 29 + requestLegacyExternalStorage`) for DiLink units that cannot grant "All files access"
- Notification permission, foreground playback service, battery optimization whitelist
- Optional start on boot, with a first-run prompt in car mode
- Simplified drawers/settings; car options are grouped under "Car settings"
- Concise about page with upstream attribution and version info
- Ducks music volume for navigation prompts instead of pausing
- Standard voice intents: `MEDIA_PLAY_FROM_SEARCH` / `MEDIA_PLAY_FROM_URI`
- Steering-wheel/broadcast control API for Tasker or custom integrations
- Optional keep-screen-on

See [CAR_BUILD.md](./CAR_BUILD.md) for build, signing and BYD installation details (Chinese).

## Voice assistant and default music

- Play/pause/next/previous via the voice assistant usually works through the standard Android MediaSession while MusicFree is the active media session.
- "Play <song>" only works if the assistant sends the standard `MEDIA_PLAY_FROM_SEARCH` intent. BYD's private protocol requires capturing `adb logcat` on the car and adding a dedicated receiver.
- There is no system-wide "default music player" on Android. Some DiLink versions expose a music app choice under "XiaoDi Settings → Music". A third-party app cannot force itself to be the default, and debug-signed builds may not appear in the list.

## Permissions

Storage, notifications (Android 13+), foreground media playback, battery optimization whitelist, optional overlay for desktop lyrics, and optional boot autostart.

If storage permission is denied, downloads and cache remain available in the app-specific directory:

`Android/data/fun.upup.musicfree.custom/files/`

## Build

```bash
npm ci
cd android
./gradlew assembleRelease
```

## Credits

- Upstream: [maotoumao/MusicFree](https://github.com/maotoumao/MusicFree)
- Upstream author: 猫头猫 (maotoumao)
- All MusicFree plugin authors
- Everyone who tested and reported issues on real head units

## License

Based on MusicFree, licensed under [AGPL-3.0](./LICENSE).
