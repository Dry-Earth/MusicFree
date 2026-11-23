import {
    NativeEventEmitter,
    NativeModules,
    Platform,
    type EmitterSubscription,
} from "react-native";

const { MusicControlModule } = NativeModules;

// MusicControlModule 仅在 Android 原生侧实现，iOS / 其他平台需要做空实现保护
const eventEmitter =
    Platform.OS === "android" && MusicControlModule
        ? new NativeEventEmitter(MusicControlModule)
        : null;

export interface ControlEvent {
    action: string;
    payload?: string;
}

export const MusicControl = {
    addListener: (callback: (event: ControlEvent) => void): EmitterSubscription | null => {
        return eventEmitter?.addListener("MusicControlEvent", callback) ?? null;
    },

    sendEvent: (action: string, payload?: string): Promise<string> => {
        if (!MusicControlModule) {
            return Promise.reject(new Error("MusicControlModule is not available"));
        }
        return MusicControlModule.sendControlEvent(action, payload || "");
    },
};

export type MusicControlAction =
    | "play"
    | "pause"
    | "toggle"
    | "next"
    | "previous"
    | "search"
    | "play-song";
