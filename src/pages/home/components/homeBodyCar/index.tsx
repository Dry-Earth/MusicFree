import { CarNavContext, type CarStackEntry } from "@/core/router/carNavContext";
import { ROUTE_PATH } from "@/core/router";
import useHardwareBack from "@/hooks/useHardwareBack";
import rpx from "@/utils/rpx";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import CarRail from "./rail";
import type { CarCategory } from "@/core/router/carNavContext";
import CarContentStack from "./stack";
import CarPlayer from "./player";

let entrySeed = 0;
function createEntry(route: string, params?: any): CarStackEntry {
    entrySeed += 1;
    return {
        key: `${route}-${entrySeed}`,
        route,
        params,
    };
}

function createPanel(category: CarCategory): CarStackEntry {
    return createEntry("car-panel", { category });
}

export default function HomeBodyCar() {
    const { width } = useWindowDimensions();
    const [category, setCategory] = useState<CarCategory>("music");
    const [stack, setStack] = useState<CarStackEntry[]>([
        createPanel("music"),
    ]);
    const [direction, setDirection] = useState<"forward" | "back">("forward");
    const stackRef = useRef(stack);
    stackRef.current = stack;

    const push = useCallback((route: string, params?: any) => {
        setDirection("forward");
        setStack(prev => [...prev, createEntry(route, params)]);
    }, []);

    const pop = useCallback(() => {
        if (stackRef.current.length <= 1) {
            return;
        }
        setDirection("back");
        setStack(prev => prev.slice(0, -1));
    }, []);

    const selectCategory = useCallback((nextCategory: CarCategory) => {
        setCategory(nextCategory);
        setDirection("forward");
        setStack([createPanel(nextCategory)]);
    }, []);

    const canPop = stack.length > 1;
    const currentParams = stack[stack.length - 1]?.params;

    useHardwareBack(() => {
        if (stackRef.current.length > 1) {
            pop();
            return true;
        }
        return false;
    }, [pop]);

    const navValue = useMemo(
        () => ({
            stack,
            category,
            currentParams,
            canPop,
            push,
            pop,
            selectCategory,
        }),
        [stack, category, currentParams, canPop, push, pop, selectCategory],
    );

    const contentWidth = canPop
        ? Math.min(rpx(380), width * 0.46)
        : Math.min(rpx(300), width * 0.38);

    return (
        <CarNavContext.Provider value={navValue}>
            <View style={styles.wrapper}>
                <CarRail
                    category={category}
                    onSelectCategory={selectCategory}
                    canPop={canPop}
                    onBack={pop}
                    onOpenPermission={() => push(ROUTE_PATH.PERMISSIONS)}
                />
                <Animated.View
                    layout={LinearTransition.duration(180)}
                    style={[styles.content, { width: contentWidth }]}>
                    <CarContentStack stack={stack} direction={direction} />
                </Animated.View>
                <View style={styles.player}>
                    <CarPlayer />
                </View>
            </View>
        </CarNavContext.Provider>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        flex: 1,
        flexDirection: "row",
    },
    content: {
        flexGrow: 0,
        flexShrink: 0,
        height: "100%",
    },
    player: {
        flex: 1,
        paddingLeft: rpx(4),
        paddingRight: rpx(12),
        paddingBottom: rpx(12),
    },
});
