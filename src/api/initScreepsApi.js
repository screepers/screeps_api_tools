import "dotenv/config";
import { ScreepsAPI } from "screeps-api";

let api;

let loginInfo = undefined;

export let isPrivateServer = false;
export let isSeasonal = false;

export function setLoginInfo(info, settings) {
    loginInfo = info;
    if (settings.isSeasonal) {
        isSeasonal = true;
    }
}

export async function authenticateAPI() {
    if (typeof loginInfo === 'string') {
        api = new ScreepsAPI({
            token: loginInfo,
            protocol: "https",
            hostname: "screeps.com",
            port: 443,
            path: !isSeasonal ? "/season" : "/"
        })
        isPrivateServer = false;
    }
    else {
        isPrivateServer = true;
        api = new ScreepsAPI(loginInfo);
        await api.auth(loginInfo.username, loginInfo.password);
    }
}

export default async function getAPI(forceReAuth = false) {
    if (!api || forceReAuth) {
        await authenticateAPI()
    }
    return api;
}

