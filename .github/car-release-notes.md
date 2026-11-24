# MusicFree 车机版

基于 [MusicFree](https://github.com/maotoumao/MusicFree)（作者：猫头猫 / maotoumao）修改，遵循 AGPL-3.0。感谢上游作者和所有插件作者。

## 下载说明

- `app-universal-release.apk`：通用包，推荐
- `app-arm64-v8a-release.apk`：64 位 ARM 车机
- `app-armeabi-v7a-release.apk`：32 位 ARM 车机

## 本版内容

- BYD DiLink / Android 车机识别与车机模式
- 基于 400014 稳定版修改，保留固定播放器和原有尺寸体验
- 车机主页两栏：左侧文字+图标菜单 + 右侧固定播放器铺满高度
- 点击菜单后左栏收起为纯图标，中间栏直接显示页面（无滑入动画）
- 中间栏宽度自适应，播放器同步收窄；支持播放器全屏切换
- 顶部全宽搜索栏移除，搜索入口在左侧菜单
- 显示大小（60%~150%，重启生效）和字体大小（70%~150%，立即生效）可调
- 精简侧边栏和设置菜单，车机选项集中到「车机设置」
- 首次进入车机模式弹窗询问开机自启动
- 关于页只保留出处、致谢和版本信息
- 存储、通知、前台播放、电池优化适配
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
