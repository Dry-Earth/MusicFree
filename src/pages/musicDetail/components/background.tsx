import React, { useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { ImgAsset } from "@/constants/assetsConst";
import { useCurrentMusic } from "@/core/trackPlayer";

interface IBackgroundProps {
    /** 车机播放器使用低开销模糊，降低全屏大图的 GPU 压力 */
    lowCost?: boolean;
}

export default function Background(props: IBackgroundProps) {
    const { lowCost } = props;
    const musicItem = useCurrentMusic();

    const artworkSource = useMemo(() => {
        if (!musicItem?.artwork) {
            return ImgAsset.albumDefault;
        }

        if(typeof musicItem.artwork === "string") {
            return {
                uri: musicItem.artwork,
            };
        }
        return musicItem.artwork;

    }, [musicItem?.artwork]);

    return (
        <>
            <View style={style.background} />
            <Image
                style={[style.blur, lowCost ? style.blurLowCost : null]}
                blurRadius={lowCost ? 14 : 50}
                fadeDuration={0}
                resizeMode="cover"
                source={artworkSource}
            />
        </>
    );
}

const style = StyleSheet.create({
    background: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#000",
    },
    blur: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.5,
    },
    blurLowCost: {
        opacity: 0.32,
    },
});
