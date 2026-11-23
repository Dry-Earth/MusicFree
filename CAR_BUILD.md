# MusicFree 安卓车机版（BYD DiLink 适配）

本分支在原版 MusicFree 的基础上做了车机化改造，重点适配 **比亚迪 DiLink（Android 9/10/11/12）** 等非 Android Automotive 的国产车机。

> 车机不是手机：常见限制包括无法申请「所有文件访问」、没有 Google 服务、系统会强杀后台、没有通知权限弹窗、屏幕分辨率/DPI 差异大。下面的改动都围绕这些限制展开。

## 一、已做的适配

### 1. 车机识别与车机模式

- 新增 `basic.carMode` 配置：`auto`（默认，自动识别）/ `on` / `off`。
- 自动识别依据：
  - Android `uiMode == car`；
  - 厂商/品牌/型号包含 `BYD`、`DiLink`、`比亚迪`、`Denza`、`腾势`；
  - 横屏且最小边 ≥ 600dp 的大屏设备。
- 开启后（横屏）：
  - 车机主页：左侧为音乐/设置菜单，右侧固定为播放器；
  - 右侧播放器左右滑动切换「封面 / 歌词」，底部保留播放控制；
  - BYD 旋转屏转到竖屏时自动使用单栏布局；
  - 车机设置中可调「显示大小」（80%~120%，重启生效）和「字体大小」（85%~120%，立即生效）；
  - 侧边栏最大宽度限制为 420dp，避免在 1920px 车机上占满半屏；
  - 可选「保持屏幕常亮」「开机自启动」（首次进入车机模式会弹窗询问）；
  - 提供「打开系统默认应用设置」入口和 BYD 默认音乐设置提示。

设置入口：`侧边栏 → 车机设置`。

另外做了菜单精简：

- 车机相关选项集中到「车机设置」；
- 基本设置移除插件、桌面歌词、开发者等与车机无关的区块；
- 侧边栏移除「定时关闭」「检查更新」「返回桌面」等重复入口；
- 关于页只保留上游出处、致谢、版本和检查更新。

### 2. 横竖屏与窗口

- 不锁定屏幕方向，BYD 旋转屏可跟随系统旋转。
- Activity 开启 `resizeableActivity`，支持车机分屏/小窗。
- `configChanges` 增加 `density`，减少车机切换 DPI 时 Activity 重建。
- 同时注册 `LAUNCHER`、`APP_MUSIC`、`LEANBACK_LAUNCHER`，兼容普通车机桌面、音乐分类和部分 TV/车机桌面。

### 3. 权限适配（重点）

| 权限 | 车机适配方式 |
| --- | --- |
| 存储 | `targetSdk 29` + `requestLegacyExternalStorage`，绕开 Android 10/11 车机无法申请「所有文件访问」的问题；Android 13+ 额外声明 `READ_MEDIA_AUDIO` |
| 通知 | Android 13+ 启动时申请 `POST_NOTIFICATIONS`；车机没有弹窗时静默失败，不影响播放 |
| 前台服务 | 保留 `FOREGROUND_SERVICE` + `FOREGROUND_SERVICE_MEDIA_PLAYBACK` + `WAKE_LOCK`，锁车/切后台继续播放 |
| 电池优化 | 新增权限页入口，可跳转「忽略电池优化」白名单，避免 DiLink 杀后台 |
| 悬浮歌词 | 保留 `SYSTEM_ALERT_WINDOW`，但车机没有悬浮窗设置页时自动回退到应用详情页，不再崩溃 |
| 开机自启动 | 新增 `RECEIVE_BOOT_COMPLETED` + `BootReceiver`，设置中可开关；是否生效取决于 BYD 是否允许后台启动 Activity |
| 默认音乐 | 新增「打开系统默认应用设置」入口；BYD 的默认音乐通常在「小迪设置 → 音乐」中，第三方 App 无法自行设为默认 |

权限页新增：通知权限、电池优化白名单、打开应用设置，并显示 BYD/车机提示。

如果车机拒绝存储权限：

- 在线播放、下载、缓存仍然可用（保存在应用专属目录 `Android/data/fun.upup.musicfree.custom/files/`）；
- 本地音乐页/文件选择器会自动回退到应用专属目录，并显示「去授权」按钮；
- 可把 U 盘音乐先复制到该目录，再在应用内选择。

### 4. 音频、语音与方控

- 导航播报时默认「压低音量」而不是直接暂停（`alwaysPauseOnInterruption = false`；车机未手动设置时默认 `lowerVolume`，手机保持 `pause`）。
- 方向盘媒体键通过系统 MediaSession 生效（播放/暂停/上一首/下一首）。
- 新增标准语音接口支持：
  - `android.media.action.MEDIA_PLAY_FROM_SEARCH`：语音搜索词会依次在已启用插件中搜索，并播放第一个结果；
  - `android.media.action.MEDIA_PLAY_FROM_URI`：语音“播放这个音频”会导入并播放对应 URI。
  - 如果 BYD 小迪使用这两个标准接口，就可以直接语音点歌；如果它走私有协议，需要抓 `adb logcat` 后做专门适配。
- 没有硬塞 AAOS 的 `MediaBrowserService`：BYD DiLink 不是 Android Automotive，且 RNTP 没有公开 MediaSession token；额外创建一个假会话会抢走媒体按键，反而可能让小迪的播放/暂停失效。等确认小迪使用浏览器服务后再加。
- 额外保留广播控制接口，方便 Tasker、车机语音助手或自己写的方控 App 调用：

```bash
adb shell am broadcast -a fun.upup.musicfree.custom.CONTROL --es action toggle
adb shell am broadcast -a fun.upup.musicfree.custom.CONTROL --es action next
adb shell am broadcast -a fun.upup.musicfree.custom.CONTROL --es action previous
adb shell am broadcast -a fun.upup.musicfree.custom.CONTROL --es action play
adb shell am broadcast -a fun.upup.musicfree.custom.CONTROL --es action pause
```

`action=play-song` 时可通过 `--es payload '{"platform":"...","id":"..."}'` 指定歌曲。

### 5. 更新、构建与签名

- 更新检查地址已切换到本仓库（`Dry-Earth/MusicFree`），避免车机版被官方版更新覆盖。
- 应用显示名称改为「MusicFree 车机版」，便于和手机版区分。
- 每次 push 到 `master` 会自动构建，并更新 GitHub Release（tag：`v0.6.2-car.1`），APK 可直接从 Releases 页面下载。

- 默认只打包 `arm64-v8a`、`armeabi-v7a`，减小车机安装包体积。
- 没有 `android/keystore.properties` 时自动回退到仓库内的 `debug.keystore` 签名，保证 `assembleRelease` 开箱可构建。
- 已生成正式签名 keystore，并配置到本仓库 Actions Secrets：
  - `RELEASE_KEYSTORE_BASE64`
  - `RELEASE_STORE_PASSWORD`
  - `RELEASE_KEY_ALIAS`
  - `RELEASE_KEY_PASSWORD`
- keystore 备份位置：`~/Documents/Default Project/musicfree-car-signing/`（不要提交到仓库！）。密码在同目录 `credentials.txt`，请自行备份到安全位置。
- `versionCode` 提升到 `400014`。
- 从 debug 签名切换到正式签名后，车机上必须先卸载旧 debug 版再安装，否则会提示签名不一致。

## 二、构建 APK

最省事的方式：把代码推到 GitHub，在 Actions 中手动运行「构建车机版 APK」，构建完成后下载 `musicfree-car-<sha>` 产物。没有配置签名 secrets 时会自动使用 debug 签名。

本地构建环境要求：

- JDK 17
- Node.js ≥ 18
- Android SDK：`platforms;android-35`、`build-tools;35.0.0`
- NDK `26.1.10909125`（Reanimated 等原生模块需要）

```bash
# 1. 安装依赖
npm ci

# 2. 构建
cd android
./gradlew assembleRelease

# 3. 产物
# android/app/build/outputs/apk/release/app-universal-release.apk
# 以及按 ABI 拆分的 app-arm64-v8a-release.apk、app-armeabi-v7a-release.apk
```

模拟器调试：

```bash
./gradlew assembleDebug -PcarAbis=x86_64 -PreactNativeArchitectures=x86_64
```

### 正式签名（推荐）

在 `android/keystore.properties` 中配置（该文件已被 `.gitignore` 忽略）：

```properties
RELEASE_STORE_FILE=../car-release.keystore
RELEASE_STORE_PASSWORD=你的密码
RELEASE_KEY_ALIAS=musicfree-car
RELEASE_KEY_PASSWORD=你的密码
```

生成 keystore：

```bash
keytool -genkeypair -v \
  -keystore android/car-release.keystore \
  -alias musicfree-car \
  -keyalg RSA -keysize 2048 -validity 36500
```

> 请务必备份 keystore。以后升级 APK 必须使用同一签名，否则车机只能卸载重装（会丢数据）。

## 三、安装到 BYD 车机

1. 将 APK 拷贝到 U 盘（FAT32/exFAT）。
2. 车机插入 U 盘，用自带文件管理器打开 APK 安装。
3. 如果提示「未知来源」，在系统设置中允许文件管理器安装应用。
4. 首次启动后进入 `侧边栏 → 权限管理`：
   - 授予存储权限（能授予就授予；不能授予也不影响在线播放）；
   - Android 13+ 授予通知权限；
   - 点击「后台运行」加入电池优化白名单；
   - 到 BYD 系统设置中把 MusicFree 车机版加入「自启动 / 后台运行白名单」。
5. 如果之前装过官方版/其他签名版本，需先卸载旧版（签名不同无法覆盖安装）。卸载前可在 `侧边栏 → 备份与恢复` 导出配置。

## 四、常见问题

**Q：安装时提示“应用未安装 / 签名不一致”？**
A：旧版本不是用当前签名构建的。先卸载旧版，或用同一 keystore 重新签名。

**Q：车机没有“所有文件访问”开关？**
A：正常。本版本使用传统存储权限；Android 10 车机在首次启动时会弹运行时权限。若系统直接拒绝，下载会落到应用专属目录，在线播放不受影响。

**Q：锁车后音乐停止？**
A：DiLink 的后台策略因车型/系统版本而异。请把应用加入自启动和后台白名单，并在权限页开启电池优化白名单。部分车型还需在开发者选项里关闭「不保留活动」。

**Q：方向盘按键没反应？**
A：先确认系统媒体卡片能控制播放。部分 BYD 车型把方控事件发给系统自带播放器，需要用 Tasker/方控 App 通过上面的广播接口转发。

**Q：界面还是手机比例？**
A：全局缩放按设备自动识别（BYD 厂商型号 / 车机 UI 模式 / 横屏大屏）。`车机模式 → 强制开启` 只影响布局、侧边栏宽度和播放栏大按钮，不会在未知设备上强制放大字体；如识别失败，可把型号发到 issue 补充识别规则。

## 五、回滚

所有车机相关改动都集中在：

- `android/app/src/main/AndroidManifest.xml`
- `android/app/build.gradle`、`android/build.gradle`、`android/gradle.properties`
- `android/app/src/main/java/fun/upup/musicfree/utils/UtilsModule.kt`
- `android/app/src/main/java/fun/upup/musicfree/lyricUtil/LyricUtilModule.kt`
- `src/utils/device.ts`、`src/hooks/useCarMode.ts`、`src/utils/rpx.ts`
- `src/pages/home/index.tsx`、`src/components/musicBar/index.tsx`
- `src/pages/permissions/index.tsx`、`src/pages/fileSelector/index.tsx`
- 设置页与 i18n

如需回到原版行为，把 `android/build.gradle` 的 `targetSdkVersion` 改回 `30`，并移除 `basic.carMode` 相关 UI 即可。
