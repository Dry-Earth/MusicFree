import Icon, { IIconName } from "@/components/base/icon.tsx";
import { ImgAsset } from "@/constants/assetsConst";
import { useI18N } from "@/core/i18n";
import rpx from "@/utils/rpx";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

import type { CarCategory } from "@/core/router/carNavContext";

interface ICarRailProps {
    category: CarCategory;
    onSelectCategory: (category: CarCategory) => void;
    canPop: boolean;
    onBack: () => void;
    onOpenPermission: () => void;
}

const railItems: Array<{
    key: CarCategory;
    icon: IIconName;
    labelKey: string;
}> = [
    { key: "music", icon: "musical-note", labelKey: "home.musicMenu" },
    { key: "settings", icon: "cog-8-tooth", labelKey: "common.setting" },
];

export default function CarRail(props: ICarRailProps) {
    const { category, onSelectCategory, canPop, onBack, onOpenPermission } =
        props;
    const navigation = useNavigation<any>();
    const { t } = useI18N();

    const renderIcon = (
        icon: IIconName,
        active: boolean,
        onPress: () => void,
        label: string,
    ) => (
        <Pressable
            key={label}
            accessibilityLabel={label}
            onPress={onPress}
            style={styles.iconButton}>
            <View style={[styles.iconWrap, active ? styles.iconWrapActive : null]}>
                <Icon
                    name={icon}
                    size={active ? rpx(54) : rpx(40)}
                    color={active ? "#fff" : "rgba(255,255,255,0.55)"}
                />
            </View>
        </Pressable>
    );

    return (
        <View style={styles.wrapper}>
            <Image source={ImgAsset.logoTransparent} style={styles.logo} />

            <View style={styles.items}>
                {railItems.map(item =>
                    renderIcon(
                        item.icon,
                        category === item.key,
                        () => onSelectCategory(item.key),
                        t(item.labelKey as any),
                    ),
                )}
                {renderIcon(
                    "shield-keyhole-outline",
                    false,
                    onOpenPermission,
                    t("sidebar.permissionManagement"),
                )}
                {renderIcon(
                    "bars-3",
                    false,
                    () => navigation.openDrawer(),
                    t("home.openSidebar.a11y"),
                )}
            </View>

            <View style={styles.bottom}>
                {canPop ? (
                    <Pressable
                        accessibilityLabel={t("common.back")}
                        onPress={onBack}
                        style={styles.iconButton}>
                        <View style={styles.iconWrap}>
                            <Icon
                                name="arrow-long-left"
                                size={rpx(40)}
                                color="rgba(255,255,255,0.8)"
                            />
                        </View>
                    </Pressable>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: rpx(72),
        flexGrow: 0,
        flexShrink: 0,
        height: "100%",
        alignItems: "center",
        paddingTop: rpx(20),
        paddingBottom: rpx(16),
        backgroundColor: "rgba(10,10,14,0.38)",
        borderTopRightRadius: rpx(18),
        borderBottomRightRadius: rpx(18),
    },
    logo: {
        width: rpx(44),
        height: rpx(44),
        borderRadius: rpx(10),
        marginBottom: rpx(28),
        opacity: 0.9,
    },
    items: {
        flex: 1,
        alignItems: "center",
    },
    iconButton: {
        marginVertical: rpx(8),
    },
    iconWrap: {
        width: rpx(64),
        height: rpx(64),
        borderRadius: rpx(16),
        alignItems: "center",
        justifyContent: "center",
    },
    iconWrapActive: {
        backgroundColor: "rgba(255,255,255,0.14)",
    },
    bottom: {
        alignItems: "center",
    },
});
