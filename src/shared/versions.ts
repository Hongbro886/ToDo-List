import type { ExtensionFactoryApi } from "../types/host";

// 获取构建时注入的当前插件版本号
declare const __EXT_VERSION__: string;
const CURRENT_VERSION = __EXT_VERSION__;

export async function checkForUpdates(){
    
}