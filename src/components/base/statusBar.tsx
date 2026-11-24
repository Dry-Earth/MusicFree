import React from "react";
import { StatusBar, StatusBarProps, View } from "react-native";
import useColors from "@/hooks/useColors";
import { useCarNav } from "@/core/router/carNavContext";

interface IStatusBarProps extends StatusBarProps {}

export default function (props: IStatusBarProps) {
    const colors = useColors();
    const carNav = useCarNav();
    const { backgroundColor, barStyle } = props;

    // 车机模式全局隐藏状态栏，中间栏页面不要额外画一条状态栏背景
    if (carNav) {
        return null;
    }

    return (
        <>
            <StatusBar
                backgroundColor={"rgba(0,0,0,0)"}
                barStyle={barStyle ?? "light-content"}
            />
            <View
                style={{
                    zIndex: 10000,
                    position: "absolute",
                    top: 0,
                    backgroundColor:
                        backgroundColor ?? colors.appBar ?? colors.primary,
                    width: "100%",
                    height: StatusBar.currentHeight,
                }}
            />
        </>
    );
}
