import { NativeModule, NativeModules } from "react-native";

export interface IDeviceInfo {
    brand: string;
    manufacturer: string;
    model: string;
    device: string;
    product: string;
    uiMode: "car" | "desk" | "television" | "appliance" | "watch" | "normal";
    sdkInt: number;
    smallestScreenWidthDp: number;
    isAutomotive: boolean;
    isLeanback: boolean;
    isTelevision: boolean;
    isByd: boolean;
    isLegacyStorage: boolean;
}

interface INativeUtils extends NativeModule {
    exitApp: () => void;
    checkStoragePermission: () => Promise<boolean>;
    requestStoragePermission: () => void;
    getWindowDimensions: () => { width: number; height: number }; // Fix bug: https://github.com/facebook/react-native/issues/47080
    getDeviceInfo: () => IDeviceInfo;
    isIgnoringBatteryOptimizations: () => Promise<boolean>;
    requestIgnoreBatteryOptimizations: () => void;
    openAppDetailsSettings: () => void;
    setAutoStartOnBoot: (enabled: boolean) => void;
    isAutoStartOnBootEnabled: () => Promise<boolean>;
    openDefaultAppsSettings: () => void;
    setUiScale: (scale: number) => void;
    getUiScale: () => number;
}

const NativeUtils = NativeModules.NativeUtils;

export default NativeUtils as INativeUtils;
