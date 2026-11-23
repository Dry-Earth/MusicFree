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
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";

export default function CarPlayer() {
    const musicItem = useCurrentMusic();
    const { t } = useI18N();
    const pagerRef = useRef<PagerView>(null);
    const [page, setPage] = useState(0);

    return (
        <View style={styles.wrapper}>
            <Background />

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
                    <PagerView
                        ref={pagerRef}
                        style={styles.pager}
                        initialPage={0}
                        onPageSelected={event =>
                            setPage(event.nativeEvent.position)
                        }>
                        <View key="cover" style={styles.page}>
                            <View style={styles.coverContainer}>
                                <FastImage
                                    style={styles.cover}
                                    source={musicItem.artwork}
                                    placeholderSource={ImgAsset.albumDefault}
                                />
                            </View>
                        </View>
                        <View key="lyric" style={styles.page}>
                            <Lyric
                                onTurnPageClick={() => {
                                    pagerRef.current?.setPage(0);
                                }}
                            />
                        </View>
                    </PagerView>

                    <View style={styles.dots}>
                        {[0, 1].map(index => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    page === index ? styles.dotActive : null,
                                ]}
                            />
                        ))}
                    </View>

                    <View style={styles.controls}>
                        <Bottom />
                    </View>
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
        </View>
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
        paddingHorizontal: rpx(16),
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
