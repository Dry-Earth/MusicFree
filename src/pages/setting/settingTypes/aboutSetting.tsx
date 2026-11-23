import Divider from "@/components/base/divider";
import LinkText from "@/components/base/linkText";
import ListItem from "@/components/base/listItem";
import ThemeText from "@/components/base/themeText";
import { ImgAsset } from "@/constants/assetsConst";
import useCheckUpdate from "@/hooks/useCheckUpdate.ts";
import rpx from "@/utils/rpx";
import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import DeviceInfo from "react-native-device-info";

export default function AboutSetting() {
    const checkAndShowResult = useCheckUpdate(false);

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
                <ThemeText fontSize="subTitle" fontWeight="bold">
                    关于本版本
                </ThemeText>
                <ThemeText style={styles.paragraph}>
                    这是一个面向 Android 车机、特别是比亚迪 DiLink
                    的修改版，增加了车机主页、显示/字体缩放、权限适配、语音点歌接口等。
                </ThemeText>
                <ThemeText style={styles.paragraph}>
                    车机版维护：Dry-Earth。仅为个人自用与车友交流，请勿用于商业用途。
                </ThemeText>
            </View>

            <View style={styles.card}>
                <ThemeText fontSize="subTitle" fontWeight="bold">
                    出处与致谢
                </ThemeText>
                <ThemeText style={styles.paragraph}>
                    本项目基于{" "}
                    <ThemeText fontWeight="bold">MusicFree</ThemeText> 修改，
                    原作者：
                    <ThemeText fontWeight="bold">猫头猫（maotoumao）</ThemeText>
                    。
                </ThemeText>
                <ThemeText style={styles.paragraph}>
                    上游仓库：{" "}
                    <LinkText linkTo="https://github.com/maotoumao/MusicFree">
                        github.com/maotoumao/MusicFree
                    </LinkText>
                </ThemeText>
                <ThemeText style={styles.paragraph}>
                    车机版仓库：{" "}
                    <LinkText linkTo="https://github.com/Dry-Earth/MusicFree">
                        github.com/Dry-Earth/MusicFree
                    </LinkText>
                </ThemeText>
                <ThemeText style={styles.paragraph}>
                    感谢猫头猫的开源工作，也感谢所有 MusicFree 插件作者和参与测试的车友。
                </ThemeText>
                <ThemeText
                    fontSize="description"
                    fontColor="textSecondary"
                    style={styles.paragraph}>
                    本项目遵循 AGPL-3.0 协议。
                </ThemeText>
            </View>

            <Divider style={styles.divider} />

            <ListItem
                withHorizontalPadding
                heightType="small"
                onPress={() => checkAndShowResult(true)}>
                <ListItem.ListItemIcon icon="arrow-path" width={rpx(48)} />
                <ListItem.Content title="检查更新" />
            </ListItem>
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
    divider: {
        marginVertical: rpx(24),
    },
});
