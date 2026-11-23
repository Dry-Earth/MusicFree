# MusicFree 车机版

基于 [MusicFree](https://github.com/maotoumao/MusicFree)（作者：猫头猫 / maotoumao）修改，遵循 AGPL-3.0。感谢上游作者和所有插件作者。

## 下载说明

- `app-universal-release.apk`：通用包，推荐
- `app-arm64-v8a-release.apk`：64 位 ARM 车机
- `app-armeabi-v7a-release.apk`：32 位 ARM 车机

## 本版内容

- BYD DiLink / Android 车机识别与车机模式
- 横屏双栏、放大 UI、播放栏上一首/下一首大按钮
- 存储、通知、前台播放、电池优化、开机自启动适配
- 导航播报压低音量
- 标准语音点歌接口 `MEDIA_PLAY_FROM_SEARCH` / `MEDIA_PLAY_FROM_URI`
- 方控广播控制接口
- 正式签名

## 安装前注意

本 APK 使用独立正式签名。如果车机上装过官方版、其他签名版或旧 debug 测试版，请先卸载再安装。

安装后建议到 `侧边栏 → 权限管理` 授予存储/通知/电池优化，并在 BYD 系统设置中加入自启动和后台白名单。

## 已知限制

- 小迪的“播放某首歌”是否可用，取决于它是否使用标准 `MEDIA_PLAY_FROM_SEARCH` 接口；私有协议需要抓车机 logcat 后适配。
- Android 没有统一默认音乐播放器设置；部分 DiLink 版本需在“小迪设置 → 音乐”中手动选择，App 无法强制设为默认。

## 致谢

- [maotoumao/MusicFree](https://github.com/maotoumao/MusicFree)
- 上游作者：猫头猫（maotoumao）
- 所有 MusicFree 插件作者
