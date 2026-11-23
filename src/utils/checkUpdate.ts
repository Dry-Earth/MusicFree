import axios from "axios";
import { compare } from "compare-versions";
import DeviceInfo from "react-native-device-info";

// 车机版从本仓库检查更新，避免被官方版更新覆盖（签名/功能不同）
const updateList = [
    "https://raw.githubusercontent.com/Dry-Earth/MusicFree/master/release/version.json",
    "https://cdn.jsdelivr.net/gh/Dry-Earth/MusicFree@master/release/version.json",
];

interface IUpdateInfo {
    needUpdate: boolean;
    data: {
        version: string;
        changeLog: string[];
        download: string[];
    };
}

export default async function checkUpdate(): Promise<IUpdateInfo | undefined> {
    const currentVersion = DeviceInfo.getVersion();
    for (let i = 0; i < updateList.length; ++i) {
        try {
            const rawInfo = (await axios.get(updateList[i])).data;
            if (compare(rawInfo.version, currentVersion, ">")) {
                return {
                    needUpdate: true,
                    data: rawInfo,
                };
            }
        } catch {}
    }
}
