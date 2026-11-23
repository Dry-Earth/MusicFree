import ListItem from "@/components/base/listItem";
import ThemeSwitch from "@/components/base/switch";
import ThemeText from "@/components/base/themeText";
import { showDialog } from "@/components/dialogs/useDialog";
import Config, { useAppConfig } from "@/core/appConfig";
import { useI18N } from "@/core/i18n";
import { ROUTE_PATH, useNavigate } from "@/core/router";
import { setFontScale } from "@/core/uiScale";
import NativeUtils from "@/native/utils";
import { deviceBrand, deviceModel, isBydDevice } from "@/utils/device";
import rpx from "@/utils/rpx";
import Toast from "@/utils/toast";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

interface ISettingRow {
    title: string;
    description?: string;
    right?: React.ReactNode;
    onPress?: () => void;
}

function createSwitch(
    title: string,
    description: string,
    value: boolean,
    onToggle: (value: boolean) => void,
): ISettingRow {
    const onPress = () => onToggle(!value);
    return {
        title,
        description,
        onPress,
        right: <ThemeSwitch value={value} onValueChange={onPress} />,
    };
}

function createRadio<T extends string | number>(
    title: string,
    description: string,
    candidates: T[],
    value: T,
    valueMap: Record<string | number, string>,
    onChange: (value: T) => void,
): ISettingRow {
    return {
        title,
        description,
        right: (
            <ThemeText fontSize="subTitle" style={styles.rightText}>
                {valueMap[value] ?? String(value)}
            </ThemeText>
        ),
        onPress() {
            showDialog("RadioDialog", {
                title,
                content: candidates.map(item => ({
                    label: valueMap[item] ?? String(item),
                    value: item,
                })),
                defaultSelected: value,
                onOk(selected) {
                    onChange(selected as T);
                },
            });
        },
    };
}

export default function CarSetting() {
    const carMode = useAppConfig("basic.carMode");
    const keepScreenOn = useAppConfig("basic.keepScreenOn");
    const autoStartOnBoot = useAppConfig("basic.autoStartOnBoot");
    const uiScale = useAppConfig("basic.uiScale");
    const fontScale = useAppConfig("basic.fontScale");

    const navigate = useNavigate();
    const { t } = useI18N();

    const percentMap = (values: number[]) =>
        values.reduce<Record<number, string>>((acc, value) => {
            acc[value] = `${Math.round(value * 100)}%`;
            return acc;
        }, {});

    const displayScales = [0.8, 0.9, 1, 1.1, 1.2];
    const fontScales = [0.85, 0.9, 1, 1.1, 1.2];

    const displaySection: ISettingRow[] = [
        createRadio(
            t("carSettings.carMode"),
            t("carSettings.carModeDescription"),
            ["auto", "on", "off"],
            (carMode ?? "auto") as "auto" | "on" | "off",
            {
                auto: t("basicSettings.carMode.auto"),
                on: t("basicSettings.carMode.on"),
                off: t("basicSettings.carMode.off"),
            },
            value => Config.setConfig("basic.carMode", value),
        ),
        createRadio(
            t("carSettings.displayScale"),
            t("carSettings.displayScaleDescription"),
            displayScales,
            uiScale ?? 1,
            percentMap(displayScales),
            value => {
                Config.setConfig("basic.uiScale", value);
                NativeUtils?.setUiScale?.(value);
                Toast.success(t("carSettings.restartHint"));
            },
        ),
        createRadio(
            t("carSettings.fontScale"),
            t("carSettings.fontScaleDescription"),
            fontScales,
            fontScale ?? 1,
            percentMap(fontScales),
            value => {
                Config.setConfig("basic.fontScale", value);
                setFontScale(value);
            },
        ),
        createSwitch(
            t("basicSettings.keepScreenOn"),
            t("carSettings.keepScreenOnDescription"),
            keepScreenOn ?? false,
            value => Config.setConfig("basic.keepScreenOn", value),
        ),
    ];

    const systemSection: ISettingRow[] = [
        createSwitch(
            t("basicSettings.autoStartOnBoot"),
            t("carSettings.autoStartDescription"),
            autoStartOnBoot ?? false,
            value => {
                Config.setConfig("basic.autoStartOnBoot", value);
                NativeUtils?.setAutoStartOnBoot?.(value);
                if (value) {
                    Toast.success(t("carSettings.autoStartHint"));
                }
            },
        ),
        {
            title: t("basicSettings.openDefaultAppsSettings"),
            description: t("basicSettings.defaultMusicHint"),
            onPress: () => NativeUtils?.openDefaultAppsSettings?.(),
        },
        {
            title: t("carSettings.permissionManagement"),
            description: t("carSettings.permissionDescription"),
            onPress: () => navigate(ROUTE_PATH.PERMISSIONS),
        },
        {
            title: t("carSettings.resetScale"),
            description: t("carSettings.resetScaleDescription"),
            onPress: () => {
                Config.setConfig("basic.uiScale", 1);
                Config.setConfig("basic.fontScale", 1);
                NativeUtils?.setUiScale?.(1);
                setFontScale(1);
                Toast.success(t("carSettings.restartHint"));
            },
        },
    ];

    const renderSection = (title: string, rows: ISettingRow[]) => (
        <View style={styles.section}>
            <ThemeText
                fontSize="subTitle"
                fontColor="textSecondary"
                fontWeight="bold"
                style={styles.sectionTitle}>
                {title}
            </ThemeText>
            {rows.map((row, index) => (
                <ListItem
                    key={`${title}-${index}`}
                    withHorizontalPadding
                    heightType="small"
                    onPress={row.onPress}>
                    <View style={styles.rowContent}>
                        <ListItem.Content
                            title={row.title}
                            description={row.description}
                        />
                    </View>
                    {row.right}
                </ListItem>
            ))}
        </View>
    );

    return (
        <ScrollView
            style={styles.wrapper}
            contentContainerStyle={styles.contentContainer}>
            <View style={styles.deviceCard}>
                <ThemeText fontWeight="bold">
                    {isBydDevice
                        ? t("carSettings.bydDetected")
                        : t("carSettings.otherDevice")}
                </ThemeText>
                <ThemeText
                    fontSize="description"
                    fontColor="textSecondary"
                    style={styles.deviceInfo}>
                    {[deviceBrand, deviceModel].filter(Boolean).join(" ")}
                </ThemeText>
            </View>
            {renderSection(t("carSettings.displaySection"), displaySection)}
            {renderSection(t("carSettings.systemSection"), systemSection)}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        flex: 1,
    },
    contentContainer: {
        paddingBottom: rpx(48),
    },
    section: {
        marginTop: rpx(16),
    },
    sectionTitle: {
        paddingHorizontal: rpx(24),
        height: rpx(64),
        textAlignVertical: "center",
    },
    rowContent: {
        flex: 1,
    },
    rightText: {
        textAlignVertical: "center",
        maxWidth: rpx(360),
    },
    deviceCard: {
        marginHorizontal: rpx(24),
        marginTop: rpx(24),
        padding: rpx(24),
        borderRadius: rpx(16),
        backgroundColor: "rgba(128, 128, 128, 0.12)",
    },
    deviceInfo: {
        marginTop: rpx(8),
    },
});
