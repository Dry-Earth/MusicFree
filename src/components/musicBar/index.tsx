import React, { useEffect, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import rpx from "@/utils/rpx";
import { CircularProgressBase } from "react-native-circular-progress-indicator";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { showPanel } from "../panels/usePanel";
import useColors from "@/hooks/useColors";
import IconButton from "../base/iconButton";
import TrackPlayer, { useCurrentMusic, useMusicState, useProgress } from "@/core/trackPlayer";
import { musicIsPaused } from "@/utils/trackUtils";
import MusicInfo from "./musicInfo";
import Icon from "@/components/base/icon.tsx";
import useCarMode from "@/hooks/useCarMode";
import { useCarNav } from "@/core/router/carNavContext";

function CircularPlayBtn() {
    const progress = useProgress();
    const musicState = useMusicState();
    const colors = useColors();
    const carMode = useCarMode();

    const isPaused = musicIsPaused(musicState);

    return (
        <CircularProgressBase
            activeStrokeWidth={rpx(4)}
            inActiveStrokeWidth={rpx(2)}
            inActiveStrokeOpacity={0.2}
            value={
                progress?.duration
                    ? (100 * progress.position) / progress.duration
                    : 0
            }
            duration={100}
            radius={rpx(carMode ? 46 : 36)}
            activeStrokeColor={colors.musicBarText}
            inActiveStrokeColor={colors.textSecondary}>
            <IconButton
                accessibilityLabel={"播放或暂停歌曲"}
                name={isPaused ? "play" : "pause"}
                sizeType={"normal"}
                hitSlop={{
                    top: 10,
                    left: 10,
                    right: 10,
                    bottom: 10,
                }}
                color={colors.musicBarText}
                onPress={async () => {
                    if (isPaused) {
                        await TrackPlayer.play();
                    } else {
                        await TrackPlayer.pause();
                    }
                }}
            />
        </CircularProgressBase>
    );
}
function MusicBar() {
    const carNav = useCarNav();
    const musicItem = useCurrentMusic();
    const carMode = useCarMode();

    const [showKeyboard, setKeyboardStatus] = useState(false);

    const colors = useColors();
    const safeAreaInsets = useSafeAreaInsets();

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardStatus(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardStatus(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    // 车机中间栏内右侧已有固定播放器，不再渲染底部 MusicBar
    if (carNav) {
        return null;
    }

    return (
        <>
            {musicItem && !showKeyboard && (
                <View
                    style={[
                        style.wrapper,
                        carMode ? style.wrapperCar : null,
                        {
                            backgroundColor: colors.musicBar,
                            paddingRight: safeAreaInsets.right + rpx(24),
                        },
                    ]}
                    accessible
                    accessibilityLabel={`歌曲: ${musicItem.title} 歌手: ${musicItem.artist}`}
                    // onPress={() => {
                    //     navigate(ROUTE_PATH.MUSIC_DETAIL);
                    // }}
                >
                    <MusicInfo musicItem={musicItem} />
                    <View style={[style.actionGroup, carMode ? style.actionGroupCar : null]}>
                        {carMode ? (
                            <Icon
                                accessible
                                accessibilityLabel="上一首"
                                name="skip-left"
                                size={rpx(64)}
                                onPress={() => {
                                    TrackPlayer.skipToPrevious();
                                }}
                                color={colors.musicBarText}
                                style={[style.actionIcon, style.actionIconCar]}
                            />
                        ) : null}
                        <CircularPlayBtn />
                        {carMode ? (
                            <Icon
                                accessible
                                accessibilityLabel="下一首"
                                name="skip-right"
                                size={rpx(64)}
                                onPress={() => {
                                    TrackPlayer.skipToNext();
                                }}
                                color={colors.musicBarText}
                                style={[style.actionIcon, style.actionIconCar]}
                            />
                        ) : null}
                        <Icon
                            accessible
                            accessibilityLabel="播放列表"
                            name="playlist"
                            size={rpx(carMode ? 64 : 56)}
                            onPress={() => {
                                showPanel("PlayList");
                            }}
                            color={colors.musicBarText}
                            style={[style.actionIcon, carMode ? style.actionIconCar : null]}
                        />
                    </View>
                </View>
            )}
        </>
    );
}

export default MusicBar;

const style = StyleSheet.create({
    wrapper: {
        width: "100%",
        height: rpx(132),
        flexDirection: "row",
        alignItems: "center",
        paddingRight: rpx(24),
    },
    wrapperCar: {
        height: rpx(168),
    },
    actionGroup: {
        width: rpx(200),
        justifyContent: "flex-end",
        flexDirection: "row",
        alignItems: "center",
    },
    actionGroupCar: {
        width: undefined,
        minWidth: rpx(300),
        flexShrink: 0,
    },
    actionIcon: {
        marginLeft: rpx(36),
    },
    actionIconCar: {
        marginLeft: rpx(44),
    },
});
