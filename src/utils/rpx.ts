import { Dimensions } from "react-native";
import NativeUtils from "@/native/utils";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const minWindowEdge = Math.min(windowHeight, windowWidth);
const maxWindowEdge = Math.max(windowHeight, windowWidth);

/**
 * 全局显示大小（rpx 系数）。
 * 在车机设置里调整，重启应用后生效；默认 1.0，不再强制放大。
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
