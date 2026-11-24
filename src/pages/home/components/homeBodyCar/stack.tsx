import { routes } from "@/core/router/routes";
import type { CarStackEntry } from "@/core/router/carNavContext";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

interface ICarContentStackProps {
    stack: CarStackEntry[];
}

export default function CarContentStack(props: ICarContentStackProps) {
    const { stack } = props;
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

    return (
        <View style={styles.wrapper}>
            {Component ? <Component /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        height: "100%",
        overflow: "hidden",
    },
});
