import Icon, { IIconName } from "@/components/base/icon.tsx";
import ThemeText from "@/components/base/themeText";
import { useI18N } from "@/core/i18n";
import { ROUTE_PATH } from "@/core/router";
import useColors from "@/hooks/useColors";
import rpx from "@/utils/rpx";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

interface IMenuItem {
    key: string;
    icon: IIconName;
    title: string;
    route?: string;
    params?: any;
    onPress?: () => void;
}

interface ICarMenuProps {
    collapsed: boolean;
    activeRoute?: string;
    canPop: boolean;
    onBack: () => void;
    onSelect: (route: string, params?: any) => void;
}

export default function CarMenu(props: ICarMenuProps) {
    const { collapsed, activeRoute, canPop, onBack, onSelect } = props;
    const navigation = useNavigation<any>();
    const colors = useColors();
    const { t } = useI18N();

    const musicMenu: IMenuItem[] = [
        {
            key: ROUTE_PATH.SEARCH_PAGE,
            icon: "magnifying-glass",
            title: t("common.search"),
            route: ROUTE_PATH.SEARCH_PAGE,
        },
        {
            key: ROUTE_PATH.RECOMMEND_SHEETS,
            icon: "fire",
            title: t("home.recommendSheet"),
            route: ROUTE_PATH.RECOMMEND_SHEETS,
        },
        {
            key: ROUTE_PATH.TOP_LIST,
            icon: "trophy",
            title: t("home.topList"),
            route: ROUTE_PATH.TOP_LIST,
        },
        {
            key: ROUTE_PATH.HISTORY,
            icon: "clock-outline",
            title: t("home.playHistory"),
            route: ROUTE_PATH.HISTORY,
        },
        {
            key: ROUTE_PATH.LOCAL,
            icon: "folder-music-outline",
            title: t("home.localMusic"),
            route: ROUTE_PATH.LOCAL,
        },
        {
            key: ROUTE_PATH.MY_SHEETS,
            icon: "playlist",
            title: t("home.myPlaylists"),
            route: ROUTE_PATH.MY_SHEETS,
        },
    ];

    const settingMenu: IMenuItem[] = [
        {
            key: "car-setting",
            icon: "identification",
            title: t("sidebar.carSettings"),
            route: ROUTE_PATH.SETTING,
            params: { type: "car" },
        },
        {
            key: ROUTE_PATH.PERMISSIONS,
            icon: "shield-keyhole-outline",
            title: t("sidebar.permissionManagement"),
            route: ROUTE_PATH.PERMISSIONS,
        },
        {
            key: "more",
            icon: "bars-3",
            title: t("home.openSidebar.a11y"),
            onPress: () => navigation.openDrawer(),
        },
    ];

    const handleItem = (item: IMenuItem) => {
        if (item.onPress) {
            item.onPress();
            return;
        }
        if (item.route) {
            onSelect(item.route, item.params);
        }
    };

    const isActive = (item: IMenuItem) => {
        if (!activeRoute) {
            return false;
        }
        if (item.key === "car-setting") {
            return activeRoute === ROUTE_PATH.SETTING;
        }
        return activeRoute === item.key;
    };

    const renderItem = (item: IMenuItem) => {
        const active = isActive(item);
        const color = active ? colors.primary : colors.text;

        if (collapsed) {
            return (
                <Pressable
                    key={item.key}
                    accessibilityLabel={item.title}
                    onPress={() => handleItem(item)}
                    style={styles.collapsedItem}>
                    <Icon name={item.icon} size={rpx(40)} color={color} />
                    {active ? (
                        <View
                            style={[
                                styles.activeBar,
                                { backgroundColor: colors.primary },
                            ]}
                        />
                    ) : null}
                </Pressable>
            );
        }

        return (
            <Pressable
                key={item.key}
                accessibilityLabel={item.title}
                onPress={() => handleItem(item)}
                style={styles.expandedItem}>
                <Icon name={item.icon} size={rpx(38)} color={color} />
                <ThemeText
                    fontSize="content"
                    color={active ? colors.primary : undefined}
                    style={styles.expandedText}
                    numberOfLines={1}>
                    {item.title}
                </ThemeText>
                {active ? (
                    <View
                        style={[
                            styles.activeBar,
                            { backgroundColor: colors.primary },
                        ]}
                    />
                ) : null}
            </Pressable>
        );
    };

    return (
        <ScrollView
            style={[styles.wrapper, collapsed ? styles.wrapperCollapsed : null]}
            showsVerticalScrollIndicator={false}>
            {collapsed && canPop ? (
                <Pressable
                    accessibilityLabel={t("common.back")}
                    onPress={onBack}
                    style={styles.collapsedItem}>
                    <Icon
                        name="arrow-long-left"
                        size={rpx(36)}
                        color={colors.text}
                    />
                </Pressable>
            ) : null}
            {!collapsed ? (
                <ThemeText
                    fontSize="description"
                    fontColor="textSecondary"
                    style={styles.groupTitle}>
                    {t("home.musicMenu")}
                </ThemeText>
            ) : null}
            {musicMenu.map(renderItem)}

            {!collapsed ? (
                <ThemeText
                    fontSize="description"
                    fontColor="textSecondary"
                    style={styles.groupTitle}>
                    {t("common.setting")}
                </ThemeText>
            ) : (
                <View style={styles.groupGap} />
            )}
            {settingMenu.map(renderItem)}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: rpx(280),
        flexGrow: 0,
        flexShrink: 0,
        height: "100%",
    },
    wrapperCollapsed: {
        width: rpx(80),
    },
    groupTitle: {
        paddingHorizontal: rpx(24),
        height: rpx(52),
        textAlignVertical: "center",
    },
    expandedItem: {
        height: rpx(72),
        paddingHorizontal: rpx(24),
        flexDirection: "row",
        alignItems: "center",
    },
    expandedText: {
        marginLeft: rpx(16),
        flex: 1,
    },
    collapsedItem: {
        height: rpx(64),
        alignItems: "center",
        justifyContent: "center",
    },
    activeBar: {
        position: "absolute",
        left: 0,
        width: rpx(4),
        height: rpx(26),
        borderRadius: rpx(2),
    },
    groupGap: {
        height: rpx(12),
    },
});
