import { Dimensions } from "react-native";
import NativeUtils from "@/native/utils";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const minWindowEdge = Math.min(windowHeight, windowWidth);
const maxWindowEdge = Math.max(windowHeight, windowWidth);

/**
 * 全局显示大小（rpx 系数）。
 * 关键：不再按屏幕最短边无限等比放大。车机/平板统一封顶到 0.82，
 * 避免 12 寸车机出现“老人机”大图标；手机仍然按原比例缩小。
 * 用户可在车机设置里 80%~120% 微调，重启后生效。
 */
function readUiScale() {
    try {
        const scale = NativeUtils?.getUiScale?.();
        if (typeof scale === "number" && scale >= 0.6 && scale <= 1.5) {
            return scale;
        }
    } catch {
        // 原生模块未就绪时使用默认值
    }
    return 1;
}

const uiScale = readUiScale();
const baseScale = Math.min(minWindowEdge / 750, 0.82);

export default function (rpx: number) {
    return rpx * baseScale * uiScale;
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
