import React, { useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { ImgAsset } from "@/constants/assetsConst";
import { useCurrentMusic } from "@/core/trackPlayer";

interface IBackgroundProps {
    /** 不绘制黑色底，只保留模糊封面，用于车机固定播放器 */
    transparent?: boolean;
}

export default function Background(props: IBackgroundProps) {
    const { transparent } = props;
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
            {transparent ? null : <View style={style.background} />}
            <Image
                style={[style.blur, transparent ? style.blurTransparent : null]}
                blurRadius={50}
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
    blurTransparent: {
        opacity: 0.3,
    },
});
