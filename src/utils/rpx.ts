import { Dimensions } from "react-native";
import { isCarUi } from "@/utils/device";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const minWindowEdge = Math.min(windowHeight, windowWidth);
const maxWindowEdge = Math.max(windowHeight, windowWidth);

/**
 * 车机/大屏 UI 整体放大系数。
 * 车机通常在 1~1.5 米外观看，按手机比例缩放会偏小。
 *
 * 说明：这里只按设备自动识别结果缩放，不读取配置，
 * 避免在 bootstrap 创建目录之前初始化 MMKV。
 * 「车机模式」的强制开启/关闭仍会影响布局、侧边栏宽度和播放栏按钮。
 */
const CAR_UI_SCALE = 1.15;
const uiScale = isCarUi ? CAR_UI_SCALE : 1;

export default function (rpx: number) {
    return (rpx / 750) * minWindowEdge * uiScale;
}

export function vh(pct: number) {
    return (pct / 100) * Dimensions.get("window").height;
}

export function vw(pct: number) {
    return (pct / 100) * Dimensions.get("window").width;
}

export function vmin(pct: number) {
    return (pct / 100) * minWindowEdge;
}

export function vmax(pct: number) {
    return (pct / 100) * maxWindowEdge;
}

export function sh(pct: number) {
    return (pct / 100) * Dimensions.get("screen").height;
}

export function sw(pct: number) {
    return (pct / 100) * Dimensions.get("screen").width;
}
