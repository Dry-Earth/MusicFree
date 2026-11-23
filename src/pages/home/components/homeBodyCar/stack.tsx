import { routes } from "@/core/router/routes";
import type { CarStackEntry } from "@/core/router/carNavContext";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated, {
    FadeIn,
    SlideInLeft,
    SlideInRight,
} from "react-native-reanimated";
import CarPanel from "./panel";
import type { CarCategory } from "@/core/router/carNavContext";

interface ICarContentStackProps {
    stack: CarStackEntry[];
    direction: "forward" | "back";
}

export default function CarContentStack(props: ICarContentStackProps) {
    const { stack, direction } = props;
    const top = stack[stack.length - 1];
    const isPanel = top.route === "car-panel";
    // 延迟到 render 时再读 routes，避免 routes/home 的循环依赖在模块初始化时触发 TDZ
    const Component = useMemo(
        () =>
            isPanel
                ? null
                : routes.find(route => route.path === top.route)?.component,
        [isPanel, top.route],
    );

    const entering = isPanel
        ? FadeIn.duration(160)
        : direction === "back"
            ? SlideInLeft.duration(220)
            : SlideInRight.duration(220);

    return (
        <Animated.View key={top.key} entering={entering} style={styles.wrapper}>
            {isPanel ? (
                <CarPanel
                    category={(top.params?.category ?? "music") as CarCategory}
                />
            ) : Component ? (
                <Component />
            ) : null}
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
