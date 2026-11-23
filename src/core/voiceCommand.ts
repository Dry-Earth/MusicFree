import { localPluginHash } from "@/constants/commonConst";
import i18n from "@/core/i18n";
import PluginManager from "@/core/pluginManager";
import TrackPlayer from "@/core/trackPlayer";
import { VoiceCommand, type IVoiceCommand } from "@/native/voiceCommand";
import { errorLog } from "@/utils/log";
import Toast from "@/utils/toast";

/** 语音“播放某首歌/某个歌手”：搜索所有已启用插件，播放第一个结果 */
export async function playFromSearch(query?: string) {
    const keyword = query?.trim();
    if (!keyword) {
        return;
    }

    const plugins = PluginManager.getSearchablePlugins("music");
    if (!plugins.length) {
        Toast.warn(i18n.t("toast.voiceNoPlugin"));
        return;
    }

    for (const plugin of plugins) {
        try {
            const result = await plugin.methods?.search?.(
                keyword,
                1,
                "music",
            );
            const musicList = (result?.data ?? []).filter(
                (item: any) => item?.id && item?.platform,
            ) as IMusic.IMusicItem[];
            if (musicList.length) {
                await TrackPlayer.playWithReplacePlayList(
                    musicList[0],
                    musicList,
                );
                Toast.success(
                    i18n.t("toast.voicePlaying", {
                        name:
                            musicList[0].title ||
                            musicList[0].artist ||
                            keyword,
                    }),
                );
                return;
            }
        } catch (e) {
            errorLog("语音搜索失败", e);
        }
    }

    Toast.warn(i18n.t("toast.voiceNoResult", { query: keyword }));
}

/** 语音“播放这个音频文件/URI” */
export async function playFromUri(uri?: string) {
    if (!uri) {
        return;
    }
    try {
        const musicItem = await PluginManager.getByHash(
            localPluginHash,
        )?.instance?.importMusicItem?.(uri);
        if (musicItem) {
            await TrackPlayer.play(musicItem);
            Toast.success(
                i18n.t("toast.voicePlaying", {
                    name: musicItem.title || uri,
                }),
            );
        } else {
            Toast.warn(i18n.t("toast.voiceNoResult", { query: uri }));
        }
    } catch (e) {
        errorLog("语音播放 URI 失败", e);
        Toast.warn(i18n.t("toast.voiceNoResult", { query: uri }));
    }
}

export function handleVoiceCommand(command: IVoiceCommand) {
    if (command.type === "search") {
        playFromSearch(command.query);
    } else if (command.type === "uri") {
        playFromUri(command.uri);
    }
}

/** bootstrap 完成后调用：注册监听并处理冷启动缓存的指令 */
export function setupVoiceCommand() {
    VoiceCommand.addListener(handleVoiceCommand);
    VoiceCommand.markReady();
    const pending = VoiceCommand.getPendingCommand();
    if (pending) {
        handleVoiceCommand(pending);
    }
}
