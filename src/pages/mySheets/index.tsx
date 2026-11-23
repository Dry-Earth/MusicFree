import AppBar from "@/components/base/appBar";
import StatusBar from "@/components/base/statusBar";
import VerticalSafeAreaView from "@/components/base/verticalSafeAreaView";
import globalStyle from "@/constants/globalStyle";
import { useI18N } from "@/core/i18n";
import Sheets from "@/pages/home/components/homeBody/sheets";
import React from "react";
import { View } from "react-native";

export default function MySheets() {
    const { t } = useI18N();
    return (
        <VerticalSafeAreaView style={globalStyle.fwflex1}>
            <StatusBar />
            <AppBar>{t("home.myPlaylists")}</AppBar>
            <View style={globalStyle.fwflex1}>
                <Sheets />
            </View>
        </VerticalSafeAreaView>
    );
}
