import { routes } from "@/core/router/routes";
import type { CarStackEntry } from "@/core/router/carNavContext";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated, { SlideInLeft, SlideInRight } from "react-native-reanimated";

interface ICarContentStackProps {
    stack: CarStackEntry[];
    direction: "forward" | "back";
}

export default function CarContentStack(props: ICarContentStackProps) {
    const { stack, direction } = props;
    const top = stack[stack.length - 1];

    // 延迟到 render 时再读 routes，避免 routes/home 的循环依赖在模块初始化时触发 TDZ
    const Component = useMemo(
        () =>
            top
                ? routes.find(route => route.path === top.route)?.component
                : undefined,
        [top],
    );

    if (!top) {
        return null;
    }

    const entering =
        direction === "back"
            ? SlideInLeft.duration(220)
            : SlideInRight.duration(220);

    return (
        <Animated.View key={top.key} entering={entering} style={styles.wrapper}>
            {Component ? <Component /> : null}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        height: "100%",
        overflow: "hidden",
    },
});
