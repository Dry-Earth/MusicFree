import LinkText from "@/components/base/linkText";
import ThemeText from "@/components/base/themeText";
import { ImgAsset } from "@/constants/assetsConst";
import rpx from "@/utils/rpx";
import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import DeviceInfo from "react-native-device-info";

export default function AboutSetting() {
    return (
        <ScrollView
            style={styles.wrapper}
            contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <Image source={ImgAsset.logo} style={styles.logo} />
                <ThemeText fontSize="title" fontWeight="bold">
                    MusicFree 车机版
                </ThemeText>
                <ThemeText
                    fontSize="description"
                    fontColor="textSecondary"
                    style={styles.version}>
                    v{DeviceInfo.getVersion()} ({DeviceInfo.getBuildNumber()})
                </ThemeText>
            </View>

            <View style={styles.card}>
                <ThemeText style={styles.paragraph}>
                    本项目基于{" "}
                    <ThemeText fontWeight="bold">MusicFree</ThemeText> 修改。
                </ThemeText>
                <ThemeText style={styles.paragraph}>
                    原作者：
                    <ThemeText fontWeight="bold">猫头猫（maotoumao）</ThemeText>
                </ThemeText>
                <ThemeText style={styles.paragraph}>
                    上游项目：{" "}
                    <LinkText linkTo="https://github.com/maotoumao/MusicFree">
                        github.com/maotoumao/MusicFree
                    </LinkText>
                </ThemeText>
                <ThemeText
                    fontSize="description"
                    fontColor="textSecondary"
                    style={styles.paragraph}>
                    遵循 AGPL-3.0 协议。
                </ThemeText>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: rpx(24),
        paddingTop: rpx(48),
        paddingBottom: rpx(96),
    },
    header: {
        alignItems: "center",
        marginBottom: rpx(36),
    },
    logo: {
        width: rpx(160),
        height: rpx(160),
        borderRadius: rpx(32),
        marginBottom: rpx(24),
    },
    version: {
        marginTop: rpx(12),
    },
    card: {
        marginTop: rpx(24),
        padding: rpx(28),
        borderRadius: rpx(18),
        backgroundColor: "rgba(128, 128, 128, 0.12)",
    },
    paragraph: {
        marginTop: rpx(16),
        lineHeight: rpx(42),
    },
});
