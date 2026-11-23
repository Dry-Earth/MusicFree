# MusicFree 车机版

> 基于 [MusicFree](https://github.com/maotoumao/MusicFree)（作者：猫头猫 / maotoumao）修改，针对 Android 车机、特别是比亚迪 DiLink 做适配。
>
> 原项目采用 **AGPL-3.0** 协议，本仓库同样遵循 AGPL-3.0。感谢上游作者的开源工作，也感谢所有插件作者。

## 下载

- **最新车机版 Release**：<https://github.com/Dry-Earth/MusicFree/releases/latest>
- 也可以在 [GitHub Actions](https://github.com/Dry-Earth/MusicFree/actions) 中下载每次构建的 APK 产物。

Release 里通常包含：

- `app-universal-release.apk`（通用，推荐）
- `app-arm64-v8a-release.apk`
- `app-armeabi-v7a-release.apk`

> 本车机版使用独立正式签名。如果之前装过官方版、其他签名版或 debug 测试版，需要先卸载再安装，否则会提示签名不一致。

## 车机适配内容

- 自动识别 BYD / DiLink / Android 车机 UI / 横屏大屏
- 车机模式：横屏双栏、UI 放大、播放栏增加上一首/下一首大按钮
- 侧边栏最大宽度限制，适配 1920px 宽车机
- 存储权限适配：`targetSdk 29 + requestLegacyExternalStorage`，兼容无法申请「所有文件访问」的 DiLink
- 通知权限、前台播放服务、电池优化白名单
- 可选开机自启动
- 导航播报时默认压低音量，而不是暂停音乐
- 标准语音点歌接口：`MEDIA_PLAY_FROM_SEARCH` / `MEDIA_PLAY_FROM_URI`
- 方控/广播控制接口，方便 Tasker 或自建方控调用
- 保持屏幕常亮（可选）

详细构建、安装和权限说明见 [CAR_BUILD.md](./CAR_BUILD.md)。

## 语音助手与默认音乐

需要说明的是，车机适配不是“破解”比亚迪系统：

- 小迪说「播放 / 暂停 / 上一首 / 下一首」：只要 MusicFree 正在播放、是当前媒体会话，通常可以通过标准 MediaSession 控制。
- 小迪说「播放周杰伦」：仅当小迪使用标准 `MEDIA_PLAY_FROM_SEARCH` 接口时可用；如果它走比亚迪私有协议，需要抓取车机 `adb logcat` 后单独适配。
- 设为默认音乐：Android 没有统一的默认音乐播放器设置，部分 DiLink 版本需要在「小迪设置 → 音乐」中手动选择。第三方 App 无法强制把自己设为默认，调试签名版本也可能不出现在系统可选列表中。

## 权限说明

| 权限 | 用途 |
| --- | --- |
| 存储 | 下载歌曲、缓存、导入本地音乐 |
| 通知 | 播放控制通知 / 车机媒体卡片（Android 13+） |
| 前台服务 / WAKE_LOCK | 后台和锁车后继续播放 |
| 电池优化白名单 | 避免车机系统杀掉播放服务 |
| 悬浮窗 | 桌面歌词（可选，部分车机不支持） |
| 开机自启动 | 可选，是否生效取决于车机后台启动策略 |

如果车机拒绝存储权限，在线播放、下载和缓存仍然可用，文件会保存在应用专属目录：

`Android/data/fun.upup.musicfree.custom/files/`

## 构建

```bash
npm ci
cd android
./gradlew assembleRelease
```

更完整的签名、Secrets、模拟器调试和 BYD 安装说明见 [CAR_BUILD.md](./CAR_BUILD.md)。

## 致谢

- 上游项目：[maotoumao/MusicFree](https://github.com/maotoumao/MusicFree)
- 上游作者：猫头猫（maotoumao）
- 所有 MusicFree 插件作者
- 所有参与测试和反馈的车友

## License

本项目基于 MusicFree 修改，遵循 [AGPL-3.0](./LICENSE)。
