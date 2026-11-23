import { useAppConfig } from "@/core/appConfig";
import { isCarUi } from "@/utils/device";

export type CarModeSetting = "auto" | "on" | "off";

export function resolveCarMode(setting?: CarModeSetting | null) {
    if (setting === "on") {
        return true;
    }
    if (setting === "off") {
        return false;
    }
    return isCarUi;
}

/** 是否启用「车机模式」布局（横屏主页、大按钮、常亮等） */
export default function useCarMode() {
    const setting = useAppConfig("basic.carMode") as CarModeSetting | undefined;
    return resolveCarMode(setting);
}
