import ListItem from "@/components/base/listItem";
import ThemeText from "@/components/base/themeText";
import { useI18N } from "@/core/i18n";
import { ROUTE_PATH, useNavigate } from "@/core/router";
import rpx from "@/utils/rpx";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { IIconName } from "@/components/base/icon.tsx";

interface IMenuItem {
    icon: IIconName;
    title: string;
    onPress: () => void;
}

export default function CarMenu() {
    const navigate = useNavigate();
    const navigation = useNavigation<any>();
    const { t } = useI18N();

    const musicMenu: IMenuItem[] = [
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
    ];

    const settingMenu: IMenuItem[] = [
        {
            icon: "identification",
            title: t("sidebar.carSettings"),
            onPress: () =>
                navigate(ROUTE_PATH.SETTING, {
                    type: "car",
                }),
        },
        {
            icon: "shield-keyhole-outline",
            title: t("sidebar.permissionManagement"),
            onPress: () => navigate(ROUTE_PATH.PERMISSIONS),
        },
        {
            icon: "bars-3",
            title: t("home.openSidebar.a11y"),
            onPress: () => navigation.openDrawer(),
        },
    ];

    const renderGroup = (title: string, items: IMenuItem[]) => (
        <View style={styles.group}>
            <ThemeText
                fontSize="description"
                fontColor="textSecondary"
                style={styles.groupTitle}>
                {title}
            </ThemeText>
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
        </View>
    );

    return (
        <ScrollView
            style={styles.wrapper}
            showsVerticalScrollIndicator={false}>
            {renderGroup(t("home.musicMenu"), musicMenu)}
            {renderGroup(t("common.setting"), settingMenu)}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: rpx(300),
        flexGrow: 0,
        flexShrink: 0,
        height: "100%",
    },
    group: {
        marginTop: rpx(24),
    },
    groupTitle: {
        paddingHorizontal: rpx(24),
        height: rpx(48),
        textAlignVertical: "center",
    },
});
