import AppBar from "@/components/base/appBar";
import ListItem from "@/components/base/listItem";
import StatusBar from "@/components/base/statusBar";
import ThemeSwitch from "@/components/base/switch";
import ThemeText from "@/components/base/themeText";
import VerticalSafeAreaView from "@/components/base/verticalSafeAreaView";
import globalStyle from "@/constants/globalStyle";
import { useI18N } from "@/core/i18n";
import LyricUtil from "@/native/lyricUtil";
import NativeUtils from "@/native/utils";
import { isBydDevice, isCarHeadUnit } from "@/utils/device";
import rpx from "@/utils/rpx";
import React, { useEffect, useRef, useState } from "react";
import { AppState, Platform, ScrollView, StyleSheet, View } from "react-native";
import { PERMISSIONS, check, request } from "react-native-permissions";

type IPermissionTypes =
    | "floatingWindow"
    | "fileStorage"
    | "notification"
    | "battery";

export default function Permissions() {
    const appState = useRef(AppState.currentState);
    const [permissions, setPermissions] = useState<
        Record<IPermissionTypes, boolean>
    >({
        floatingWindow: false,
        fileStorage: false,
        notification: true,
        battery: true,
    });
    const { t } = useI18N();

    async function checkPermission(type?: IPermissionTypes) {
        let newPermission = {
            ...permissions,
        };
        if (!type || type === "floatingWindow") {
            if (Platform.OS === "android") {
                const hasPermission = await LyricUtil.checkSystemAlertPermission().catch(
                    () => false,
                );
                newPermission.floatingWindow = hasPermission;
            }
        }
        if (!type || type === "fileStorage") {
            if (Platform.OS === "android") {
                const hasPermission = await NativeUtils.checkStoragePermission().catch(
                    () => false,
                );
                newPermission.fileStorage = hasPermission;
            }
        }
        if (!type || type === "notification") {
            if (Platform.OS === "android" && Platform.Version >= 33) {
                try {
                    const status = await check(
                        PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
                    );
                    newPermission.notification = status === "granted";
                } catch {
                    newPermission.notification = false;
                }
            } else {
                newPermission.notification = true;
            }
        }
        if (!type || type === "battery") {
            if (Platform.OS === "android") {
                newPermission.battery =
                    await NativeUtils.isIgnoringBatteryOptimizations().catch(
                        () => false,
                    );
            }
        }

        setPermissions(newPermission);
    }

    useEffect(() => {
        checkPermission();
        const subscription = AppState.addEventListener(
            "change",
            nextAppState => {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === "active"
                ) {
                    checkPermission();
                }

                appState.current = nextAppState;
            },
        );

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <VerticalSafeAreaView style={globalStyle.fwflex1}>
            <StatusBar />
            <AppBar>{t("permissionSetting.title")}</AppBar>
            <ThemeText style={styles.description}>
                {t("permissionSetting.description")}
            </ThemeText>
            {isCarHeadUnit ? (
                <View style={styles.carTip}>
                    <ThemeText fontSize="subTitle" fontWeight="bold">
                        {t("permissionSetting.carTip")}
                    </ThemeText>
                    {isBydDevice ? (
                        <ThemeText style={styles.carTipText}>
                            {t("permissionSetting.bydTip")}
                        </ThemeText>
                    ) : null}
                    <ThemeText style={styles.carTipText}>
                        {t("permissionSetting.storageFallback")}
                    </ThemeText>
                </View>
            ) : null}
            <ScrollView
                style={globalStyle.fwflex1}
                contentContainerStyle={styles.scrollContent}>
                <ListItem
                    withHorizontalPadding
                    heightType="big"
                    onPress={() => {
                        LyricUtil.requestSystemAlertPermission();
                    }}>
                    <ListItem.Content
                        title={t("permissionSetting.floatWindowPermission")}
                        description={t(
                            "permissionSetting.floatWindowPermissionDescription",
                        )}
                    />
                    <ThemeSwitch value={permissions.floatingWindow} />
                </ListItem>
                <ListItem
                    withHorizontalPadding
                    heightType="big"
                    onPress={() => {
                        NativeUtils.requestStoragePermission();
                    }}>
                    <ListItem.Content
                        title={t("permissionSetting.fileReadWritePermission")}
                        description={t(
                            "permissionSetting.fileReadWritePermissionDescription",
                        )}
                    />
                    <ThemeSwitch value={permissions.fileStorage} />
                </ListItem>
                {Platform.OS === "android" &&
                Number(Platform.Version) >= 33 ? (
                        <ListItem
                            withHorizontalPadding
                            heightType="big"
                            onPress={() => {
                                request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
                                    .then(() => checkPermission("notification"))
                                    .catch(() => checkPermission("notification"));
                            }}>
                            <ListItem.Content
                                title={t("permissionSetting.notificationPermission")}
                                description={t(
                                    "permissionSetting.notificationPermissionDescription",
                                )}
                            />
                            <ThemeSwitch value={permissions.notification} />
                        </ListItem>
                    ) : null}
                {Platform.OS === "android" ? (
                    <ListItem
                        withHorizontalPadding
                        heightType="big"
                        onPress={() => {
                            NativeUtils.requestIgnoreBatteryOptimizations();
                        }}>
                        <ListItem.Content
                            title={t("permissionSetting.batteryOptimization")}
                            description={t(
                                "permissionSetting.batteryOptimizationDescription",
                            )}
                        />
                        <ThemeSwitch value={permissions.battery} />
                    </ListItem>
                ) : null}
                {Platform.OS === "android" ? (
                    <ListItem
                        withHorizontalPadding
                        heightType="big"
                        onPress={() => {
                            NativeUtils.openAppDetailsSettings();
                        }}>
                        <ListItem.Content
                            title={t("permissionSetting.openAppSettings")}
                            description={t(
                                "permissionSetting.openAppSettingsDescription",
                            )}
                        />
                    </ListItem>
                ) : null}
            </ScrollView>
        </VerticalSafeAreaView>
    );
}

const styles = StyleSheet.create({
    description: {
        width: "100%",
        paddingHorizontal: rpx(24),
        marginVertical: rpx(36),
    },
    carTip: {
        marginHorizontal: rpx(24),
        marginBottom: rpx(24),
        padding: rpx(24),
        borderRadius: rpx(16),
        backgroundColor: "rgba(128, 128, 128, 0.12)",
    },
    carTipText: {
        marginTop: rpx(12),
        lineHeight: rpx(34),
    },
    scrollContent: {
        paddingBottom: rpx(24),
    },
});
