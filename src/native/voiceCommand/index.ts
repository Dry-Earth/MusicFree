import {
    NativeEventEmitter,
    NativeModule,
    NativeModules,
    Platform,
    type EmitterSubscription,
} from "react-native";

export interface IVoiceCommand {
    type: "search" | "uri";
    query?: string;
    uri?: string;
}

interface IVoiceCommandModule extends NativeModule {
    markReady: () => void;
    getPendingCommand: () => IVoiceCommand | null;
}

const NativeVoiceCommand = NativeModules.VoiceCommand as
    | IVoiceCommandModule
    | undefined;

const eventEmitter =
    Platform.OS === "android" && NativeVoiceCommand
        ? new NativeEventEmitter(NativeVoiceCommand)
        : null;

export const VoiceCommand = {
    addListener: (
        callback: (command: IVoiceCommand) => void,
    ): EmitterSubscription | null => {
        return (
            eventEmitter?.addListener("VoiceCommandEvent", callback) ?? null
        );
    },

    /** JS 监听注册完成后调用，告诉原生可以直发事件 */
    markReady: () => {
        NativeVoiceCommand?.markReady?.();
    },

    /** 冷启动时取出原生缓存的语音指令 */
    getPendingCommand: (): IVoiceCommand | null => {
        return NativeVoiceCommand?.getPendingCommand?.() ?? null;
    },
};
