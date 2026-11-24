import { atom, getDefaultStore, useAtomValue } from "jotai";

/** 字体缩放系数：只影响 ThemeText 的 fontSize，不影响整体布局 */
export const fontScaleAtom = atom(0.8);

export function useFontScale() {
    return useAtomValue(fontScaleAtom);
}

export function setFontScale(scale: number) {
    getDefaultStore().set(fontScaleAtom, scale);
}

export function getFontScale() {
    return getDefaultStore().get(fontScaleAtom);
}
