import FastImage from "@/components/base/fastImage";
import Icon from "@/components/base/icon.tsx";
import ThemeText from "@/components/base/themeText";
import { ImgAsset } from "@/constants/assetsConst";
import { useCurrentMusic } from "@/core/trackPlayer";
import { showPanel } from "@/components/panels/usePanel";
import Background from "@/pages/musicDetail/components/background";
import Bottom from "@/pages/musicDetail/components/bottom";
import Lyric from "@/pages/musicDetail/components/content/lyric";
import { useI18N } from "@/core/i18n";
import rpx from "@/utils/rpx";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";

interface ICarPlayerProps {
    fullscreen: boolean;
    onToggleFullscreen: () => void;
    onPlayerTap: () => void;
}

export default function CarPlayer(props: ICarPlayerProps) {
    const { fullscreen, onToggleFullscreen, onPlayerTap } = props;
    const musicItem = useCurrentMusic();
    const { t } = useI18N();
    const pagerRef = useRef<PagerView>(null);
    const [page, setPage] = useState(0);
    const lastTapRef = useRef(0);
    const singleTapTimerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        return () => {
            if (singleTapTimerRef.current) {
                clearTimeout(singleTapTimerRef.current);
            }
        };
    }, []);

    const handlePlayerPress = () => {
        const now = Date.now();
        if (now - lastTapRef.current < 280) {
            if (singleTapTimerRef.current) {
                clearTimeout(singleTapTimerRef.current);
                singleTapTimerRef.current = undefined;
            }
            lastTapRef.current = 0;
            onToggleFullscreen();
            return;
        }
        lastTapRef.current = now;
        singleTapTimerRef.current = setTimeout(() => {
            lastTapRef.current = 0;
            onPlayerTap();
        }, 280);
    };

    return (
        <Pressable style={styles.wrapper} onPress={handlePlayerPress}>
            <Background lowCost />

            <View style={styles.header}>
                <View style={styles.headerText}>
                    <ThemeText
                        color="#fff"
                        fontSize="title"
                        fontWeight="semibold"
                        numberOfLines={1}>
                        {musicItem?.title ?? "MusicFree 车机版"}
                    </ThemeText>
                    <ThemeText
                        color="rgba(255,255,255,0.65)"
                        fontSize="subTitle"
                        numberOfLines={1}>
                        {musicItem?.artist ?? ""}
                    </ThemeText>
                </View>
            </View>

            {musicItem ? (
                <>
                    {fullscreen ? (
                        <View style={styles.split}>
                            <View style={styles.splitCover}>
                                <FastImage
                                    style={styles.splitArtwork}
                                    resizeMode="contain"
                                    source={musicItem.artwork}
                                    placeholderSource={ImgAsset.albumDefault}
                                />
                            </View>
                            <View style={styles.splitLyric}>
                                <Lyric />
                            </View>
                        </View>
                    ) : (
                        <>
                            <PagerView
                                ref={pagerRef}
                                style={styles.pager}
                                initialPage={0}
                                onPageSelected={event =>
                                    setPage(event.nativeEvent.position)
                                }
                                onPageScroll={event => {
                                    const { position, offset } =
                                        event.nativeEvent;
                                    if (
                                        position === 1 &&
                                        offset > 0.15 &&
                                        page !== 1
                                    ) {
                                        setPage(1);
                                    }
                                }}>
                                <View key="cover" style={styles.page}>
                                    <View style={styles.coverContainer}>
                                        <FastImage
                                            style={styles.cover}
                                            source={musicItem.artwork}
                                            placeholderSource={
                                                ImgAsset.albumDefault
                                            }
                                        />
                                    </View>
                                </View>
                                <View key="lyric" style={styles.page}>
                                    {page === 1 ? (
                                        <Lyric
                                            onTurnPageClick={() => {
                                                pagerRef.current?.setPage(0);
                                            }}
                                        />
                                    ) : null}
                                </View>
                            </PagerView>

                            <View style={styles.dots}>
                                {[0, 1].map(index => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.dot,
                                            page === index
                                                ? styles.dotActive
                                                : null,
                                        ]}
                                    />
                                ))}
                            </View>
                        </>
                    )}

                    <Pressable
                        style={styles.controls}
                        onPress={() => {
                            /* 拦截点击，避免双击播放键触发全屏 */
                        }}>
                        <Bottom />
                    </Pressable>
                </>
            ) : (
                <View style={styles.empty}>
                    <Icon
                        name="musical-note"
                        size={rpx(96)}
                        color="rgba(255,255,255,0.35)"
                    />
                    <ThemeText
                        color="rgba(255,255,255,0.7)"
                        fontSize="subTitle"
                        style={styles.emptyText}>
                        {t("carSettings.noMusic")}
                    </ThemeText>
                    <View style={styles.emptyActions}>
                        <ThemeText
                            color="#fff"
                            fontSize="content"
                            onPress={() => showPanel("PlayList")}>
                            {t("carSettings.openPlaylist")}
                        </ThemeText>
                    </View>
                </View>
            )}

            <Pressable
                accessibilityLabel="全屏"
                onPress={onToggleFullscreen}
                style={styles.fullscreenButton}>
                <Icon
                    name={
                        fullscreen ? "arrow-long-left" : "arrows-left-right"
                    }
                    size={rpx(32)}
                    color="#fff"
                />
            </Pressable>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        height: "100%",
        borderRadius: rpx(18),
        overflow: "hidden",
        backgroundColor: "#101114",
    },
    header: {
        height: rpx(96),
        paddingHorizontal: rpx(32),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerText: {
        flex: 1,
        marginRight: rpx(24),
    },
    split: {
        flex: 1,
        flexDirection: "row",
    },
    splitCover: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: rpx(24),
    },
    splitArtwork: {
        width: "100%",
        height: "100%",
    },
    splitLyric: {
        flex: 1,
    },
    pager: {
        flex: 1,
    },
    page: {
        flex: 1,
    },
    coverContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: rpx(24),
    },
    cover: {
        width: "70%",
        aspectRatio: 1,
        borderRadius: rpx(18),
    },
    dots: {
        height: rpx(32),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    dot: {
        width: rpx(12),
        height: rpx(12),
        borderRadius: rpx(6),
        marginHorizontal: rpx(8),
        backgroundColor: "rgba(255,255,255,0.3)",
    },
    dotActive: {
        backgroundColor: "#fff",
    },
    controls: {
        paddingLeft: rpx(72),
        paddingRight: rpx(16),
    },
    fullscreenButton: {
        position: "absolute",
        left: rpx(20),
        bottom: rpx(22),
        width: rpx(48),
        height: rpx(48),
        borderRadius: rpx(24),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.35)",
        zIndex: 10,
    },
    empty: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        marginTop: rpx(24),
    },
    emptyActions: {
        flexDirection: "row",
        marginTop: rpx(32),
    },
    emptyAction: {
        marginLeft: rpx(48),
    },
});
