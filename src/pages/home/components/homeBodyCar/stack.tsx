import { routes } from "@/core/router/routes";
import type { CarStackEntry } from "@/core/router/carNavContext";
import React from "react";
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

const routeMap = new Map<string, (typeof routes)[number]["component"]>(
    routes.map(route => [route.path, route.component]),
);

export default function CarContentStack(props: ICarContentStackProps) {
    const { stack, direction } = props;
    const top = stack[stack.length - 1];
    const isPanel = top.route === "car-panel";
    const Component = isPanel ? null : routeMap.get(top.route);

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
