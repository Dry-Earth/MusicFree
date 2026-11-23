import Icon from "@/components/base/icon.tsx";
import ListItem from "@/components/base/listItem";
import ThemeText from "@/components/base/themeText";
import { showDialog } from "@/components/dialogs/useDialog";
import { useI18N } from "@/core/i18n";
import { ROUTE_PATH, useNavigate } from "@/core/router";
import type { CarCategory } from "@/core/router/carNavContext";
import useColors from "@/hooks/useColors";
import rpx from "@/utils/rpx";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

interface ICarPanelProps {
    category: CarCategory;
}

export default function CarPanel({ category }: ICarPanelProps) {
    const navigate = useNavigate();
    const colors = useColors();
    const { t, getLanguage, getSupportedLanguages, setLanguage } = useI18N();

    const musicItems = [
        {
            icon: "magnifying-glass",
            title: t("common.search"),
            onPress: () => navigate(ROUTE_PATH.SEARCH_PAGE),
        },
        {
            icon: "fire",
            title: t("home.recommendSheet"),
            onPress: () => navigate(ROUTE_PATH.RECOMMEND_SHEETS),
        },
        {
            icon: "trophy",
            title: t("home.topList"),
            onPress: () => navigate(ROUTE_PATH.TOP_LIST),
        },
        {
            icon: "clock-outline",
            title: t("home.playHistory"),
            onPress: () => navigate(ROUTE_PATH.HISTORY),
        },
        {
            icon: "folder-music-outline",
            title: t("home.localMusic"),
            onPress: () => navigate(ROUTE_PATH.LOCAL),
        },
        {
            icon: "playlist",
            title: t("home.myPlaylists"),
            onPress: () => navigate(ROUTE_PATH.MY_SHEETS),
        },
    ] as const;

    const settingItems = [
        {
            icon: "identification",
            title: t("sidebar.carSettings"),
            onPress: () => navigate(ROUTE_PATH.SETTING, { type: "car" }),
        },
        {
            icon: "cog-8-tooth",
            title: t("sidebar.basicSettings"),
            onPress: () => navigate(ROUTE_PATH.SETTING, { type: "basic" }),
        },
        {
            icon: "javascript",
            title: t("sidebar.pluginManagement"),
            onPress: () => navigate(ROUTE_PATH.SETTING, { type: "plugin" }),
        },
        {
            icon: "t-shirt-outline",
            title: t("sidebar.themeSettings"),
            onPress: () => navigate(ROUTE_PATH.SETTING, { type: "theme" }),
        },
        {
            icon: "shield-keyhole-outline",
            title: t("sidebar.permissionManagement"),
            onPress: () => navigate(ROUTE_PATH.PERMISSIONS),
        },
        {
            icon: "circle-stack",
            title: t("sidebar.backupAndResume"),
            onPress: () => navigate(ROUTE_PATH.SETTING, { type: "backup" }),
        },
        {
            icon: "language",
            title: t("sidebar.languageSettings"),
            onPress: () => {
                showDialog("RadioDialog", {
                    content: getSupportedLanguages().map(item => ({
                        title: item.name,
                        value: item.locale,
                        label: item.name,
                    })),
                    title: t("sidebar.languageSettings"),
                    onOk(value) {
                        setLanguage(value as string);
                    },
                    defaultSelected: getLanguage().locale,
                });
            },
        },
        {
            icon: "information-circle",
            title: t("common.about"),
            onPress: () => navigate(ROUTE_PATH.SETTING, { type: "about" }),
        },
    ] as const;

    const items = category === "music" ? musicItems : settingItems;

    return (
        <View style={[styles.wrapper, { backgroundColor: colors.card }]}>
            <ThemeText fontSize="title" fontWeight="bold" style={styles.title}>
                {category === "music"
                    ? t("home.musicMenu")
                    : t("common.setting")}
            </ThemeText>

            {category === "music" ? (
                <Pressable
                    style={[
                        styles.searchBar,
                        { backgroundColor: colors.placeholder },
                    ]}
                    onPress={() => navigate(ROUTE_PATH.SEARCH_PAGE)}>
                    <Icon
                        name="magnifying-glass"
                        size={rpx(30)}
                        color={colors.textSecondary}
                    />
                    <ThemeText
                        fontColor="textSecondary"
                        fontSize="description"
                        style={styles.searchText}>
                        {t("home.clickToSearch")}
                    </ThemeText>
                </Pressable>
            ) : null}

            <ScrollView
                style={styles.list}
                showsVerticalScrollIndicator={false}>
                {items.map(item => (
                    <ListItem
                        key={item.title}
                        withHorizontalPadding
                        heightType="smallest"
                        onPress={item.onPress}>
                        <ListItem.ListItemIcon
                            icon={item.icon}
                            width={rpx(44)}
                        />
                        <ListItem.Content title={item.title} />
                    </ListItem>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        borderRadius: rpx(18),
        overflow: "hidden",
        marginRight: rpx(12),
    },
    title: {
        paddingHorizontal: rpx(24),
        height: rpx(76),
        textAlignVertical: "center",
    },
    searchBar: {
        marginHorizontal: rpx(20),
        marginBottom: rpx(8),
        height: rpx(64),
        borderRadius: rpx(32),
        paddingHorizontal: rpx(20),
        flexDirection: "row",
        alignItems: "center",
    },
    searchText: {
        marginLeft: rpx(12),
    },
    list: {
        flex: 1,
    },
});
