import rpx from "@/utils/rpx";
import React from "react";
import { StyleSheet, View } from "react-native";
import CarMenu from "./menu";
import CarPlayer from "./player";

export default function HomeBodyCar() {
    return (
        <View style={styles.wrapper}>
            <CarMenu />
            <View style={styles.player}>
                <CarPlayer />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        flex: 1,
        flexDirection: "row",
    },
    player: {
        flex: 1,
        paddingLeft: rpx(16),
        paddingRight: rpx(16),
        paddingBottom: rpx(12),
    },
});
