import { Dimensions, Platform } from "react-native";
import NativeUtils, { type IDeviceInfo } from "@/native/utils";

/**
 * 车机/大屏识别。
 *
 * 说明：
 * - BYD DiLink 并不是 Android Automotive OS，很多车型（DiLink 3.0/4.0）
 *   只是深度定制的 Android 10/11 平板系统，因此不能依赖
 *   PackageManager.FEATURE_AUTOMOTIVE 判断。
 * - 这里综合「车机 UI 模式 / 厂商型号 / 横屏大屏」三个条件做自动识别。
 * - 所有判断在模块加载时同步完成，供 rpx、导航布局等早期模块使用。
 */

function readNativeDeviceInfo(): Partial<IDeviceInfo> {
    try {
        if (Platform.OS === "android" && NativeUtils?.getDeviceInfo) {
            return NativeUtils.getDeviceInfo() ?? {};
        }
    } catch {
        // 原生模块尚未就绪时忽略，使用 Platform.constants 兜底
    }
    return {};
}

const platformConstants: Record<string, any> =
    (Platform.constants as Record<string, any>) ?? {};

const nativeInfo = readNativeDeviceInfo();

const brand = String(nativeInfo.brand ?? platformConstants.Brand ?? "");
const manufacturer = String(
    nativeInfo.manufacturer ?? platformConstants.Manufacturer ?? "",
);
const model = String(nativeInfo.model ?? platformConstants.Model ?? "");
const uiMode = String(nativeInfo.uiMode ?? platformConstants.uiMode ?? "");

const deviceText = `${brand} ${manufacturer} ${model}`.toLowerCase();

const windowSize = Dimensions.get("window");
const minWindowEdgeDp = Math.min(windowSize.width, windowSize.height);
const isLandscape = windowSize.width > windowSize.height;

export const deviceBrand = brand;
export const deviceManufacturer = manufacturer;
export const deviceModel = model;

/** 是否为比亚迪车机 */
export const isBydDevice =
    nativeInfo.isByd === true ||
    deviceText.includes("byd") ||
    deviceText.includes("dilink") ||
    deviceText.includes("比亚迪") ||
    deviceText.includes("denza") ||
    deviceText.includes("腾势");

/** Android 车机 UI 模式（Android Automotive / 部分定制车机） */
export const isAutomotiveUi = uiMode === "car" || nativeInfo.isAutomotive === true;

/** Android TV / Leanback */
export const isTelevisionUi =
    uiMode === "television" || nativeInfo.isTelevision === true;

/** 横屏且最小边 >= 600dp，通常是车机/平板大屏 */
export const isLargeLandscape = isLandscape && minWindowEdgeDp >= 600;

/** 是否是真正的车机（用于展示车机权限提示） */
export const isCarHeadUnit = isAutomotiveUi || isBydDevice;

/**
 * 是否默认使用车机布局（车机 / TV / 横屏大屏）
 * 注意：这只是「默认值」，用户可在 设置-基本设置-车机模式 中强制开/关。
 */
export const isCarUi =
    isCarHeadUnit ||
    isTelevisionUi ||
    isLargeLandscape;

export const deviceInfo = {
    ...nativeInfo,
    brand,
    manufacturer,
    model,
    uiMode,
};
