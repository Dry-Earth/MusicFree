import React, { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";

import NavBar from "./components/navBar";
import MusicBar from "@/components/musicBar";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeDrawer from "./components/drawer";
import { SafeAreaView } from "react-native-safe-area-context";
import StatusBar from "@/components/base/statusBar";
import HorizontalSafeAreaView from "@/components/base/horizontalSafeAreaView.tsx";
import globalStyle from "@/constants/globalStyle";
import Theme from "@/core/theme";
import { useAppConfig } from "@/core/appConfig";
import HomeBody from "./components/homeBody";
import HomeBodyHorizontal from "./components/homeBodyHorizontal";
import useOrientation from "@/hooks/useOrientation";
import useCarMode from "@/hooks/useCarMode";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

const CAR_DRAWER_MAX_WIDTH = 420;

function Home() {
    const orientation = useOrientation();
    const carMode = useCarMode();
    const keepScreenOn = useAppConfig("basic.keepScreenOn");

    // 车机模式：播放时保持屏幕常亮（默认关闭，可在设置中打开）
    useEffect(() => {
        if (!(carMode && keepScreenOn)) {
            return;
        }
        activateKeepAwakeAsync("musicfree-car-mode").catch(() => {});
        return () => {
            deactivateKeepAwake("musicfree-car-mode").catch(() => {});
        };
    }, [carMode, keepScreenOn]);

    return (
        <SafeAreaView edges={["top", "bottom"]} style={styles.appWrapper}>
            <HomeStatusBar />
            <HorizontalSafeAreaView style={globalStyle.flex1}>
                <>
                    <NavBar />
                    {orientation === "vertical" ? (
                        <HomeBody />
                    ) : (
                        <HomeBodyHorizontal />
                    )}
                </>
            </HorizontalSafeAreaView>
            <MusicBar />
        </SafeAreaView>
    );
}

function HomeStatusBar() {
    const theme = Theme.useTheme();

    return (
        <StatusBar
            backgroundColor="transparent"
            barStyle={theme.dark ? undefined : "dark-content"}
        />
    );
}

// function Body() {
//     const orientation = useOrientation();
//     return (
//         <ScrollView
//             style={[
//                 styles.appWrapper,
//                 orientation === 'horizontal' ? styles.flexRow : null,
//             ]}>
//             <Operations orientation={orientation} />
//         </ScrollView>
//     );
// }

const LeftDrawer = createDrawerNavigator();
export default function App() {
    const carMode = useCarMode();
    const windowWidth = Dimensions.get("window").width;
    // 80% 宽度在 1920px 车机上会占满半个屏幕，这里限制最大宽度
    const drawerWidth = carMode
        ? Math.min(windowWidth * 0.8, CAR_DRAWER_MAX_WIDTH)
        : windowWidth * 0.8;

    return (
        <LeftDrawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    width: drawerWidth,
                },
            }}
            initialRouteName="HOME-MAIN"
            drawerContent={props => <HomeDrawer {...props} />}>
            <LeftDrawer.Screen name="HOME-MAIN" component={Home} />
        </LeftDrawer.Navigator>
    );
}

const styles = StyleSheet.create({
    appWrapper: {
        flexDirection: "column",
        flex: 1,
    },
    flexRow: {
        flexDirection: "row",
    },
});
