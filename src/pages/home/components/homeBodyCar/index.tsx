import { CarNavContext, type CarStackEntry } from "@/core/router/carNavContext";
import { ROUTE_PATH } from "@/core/router";
import useHardwareBack from "@/hooks/useHardwareBack";
import rpx from "@/utils/rpx";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import CarMenu from "./menu";
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

const contentRatioMap: Record<string, number> = {
    [ROUTE_PATH.SEARCH_PAGE]: 0.46,
    [ROUTE_PATH.LOCAL]: 0.44,
    [ROUTE_PATH.MY_SHEETS]: 0.46,
    [ROUTE_PATH.SETTING]: 0.4,
    [ROUTE_PATH.PERMISSIONS]: 0.4,
    [ROUTE_PATH.HISTORY]: 0.42,
    [ROUTE_PATH.RECOMMEND_SHEETS]: 0.44,
    [ROUTE_PATH.TOP_LIST]: 0.42,
};

export default function HomeBodyCar() {
    const { width } = useWindowDimensions();
    const [collapsed, setCollapsed] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [stack, setStack] = useState<CarStackEntry[]>([]);
    const stackRef = useRef(stack);
    stackRef.current = stack;

    const push = useCallback((route: string, params?: any) => {
        setStack(prev => [...prev, createEntry(route, params)]);
    }, []);

    const pop = useCallback(() => {
        if (stackRef.current.length <= 1) {
            setStack([]);
            setCollapsed(false);
            return;
        }
        setStack(prev => prev.slice(0, -1));
    }, []);

    const openRoute = useCallback(
        (route: string, params?: any, keepExpanded = false) => {
            if (!keepExpanded) {
                setMoreOpen(false);
            }
            setCollapsed(!keepExpanded);
            setStack([createEntry(route, params)]);
        },
        [],
    );

    const openMore = useCallback(() => {
        setMoreOpen(true);
        setCollapsed(false);
    }, []);

    const closeMore = useCallback(() => {
        setMoreOpen(false);
        setCollapsed(false);
    }, []);

    const handlePlayerTap = useCallback(() => {
        if (!collapsed || moreOpen) {
            setMoreOpen(false);
            setCollapsed(true);
        }
    }, [collapsed, moreOpen]);

    const canPop = stack.length > 0;
    const currentParams = stack[stack.length - 1]?.params;
    const topRoute = stack[stack.length - 1]?.route;
    const activeRoute = stack[0]?.route;

    useHardwareBack(() => {
        if (fullscreen) {
            setFullscreen(false);
            return true;
        }
        if (stackRef.current.length > 0) {
            pop();
            return true;
        }
        if (moreOpen) {
            closeMore();
            return true;
        }
        return false;
    }, [fullscreen, pop, moreOpen, closeMore]);

    const navValue = useMemo(
        () => ({
            stack,
            currentParams,
            canPop,
            push,
            pop,
        }),
        [stack, currentParams, canPop, push, pop],
    );

    const ratio =
        stack.length > 1
            ? 0.48
            : (contentRatioMap[topRoute ?? ""] ?? 0.42);
    const contentWidth = Math.min(
        width * 0.52,
        Math.max(rpx(320), width * ratio),
    );

    return (
        <CarNavContext.Provider value={navValue}>
            <View style={styles.wrapper}>
                {!fullscreen ? (
                    <CarMenu
                        collapsed={collapsed}
                        moreOpen={moreOpen}
                        activeRoute={activeRoute}
                        canPop={canPop}
                        onBack={pop}
                        onOpenMore={openMore}
                        onCloseMore={closeMore}
                        onSelect={openRoute}
                    />
                ) : null}

                {!fullscreen && stack.length > 0 ? (
                    <View style={[styles.content, { width: contentWidth }]}>
                        <CarContentStack stack={stack} />
                    </View>
                ) : null}

                <View style={styles.player}>
                    <CarPlayer
                        fullscreen={fullscreen}
                        onToggleFullscreen={() =>
                            setFullscreen(value => !value)
                        }
                        onPlayerTap={handlePlayerTap}
                    />
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
        paddingLeft: rpx(16),
        paddingRight: rpx(16),
        paddingBottom: rpx(12),
    },
});
