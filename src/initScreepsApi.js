import "dotenv/config";
import { ScreepsAPI } from "screeps-api";

let api;

export default function getApi() {
    return api;
}

export let isPrivateServer = false;

export async function initScreepsApi(loginInfo) {
    if (typeof loginInfo === 'string') api = new ScreepsAPI({
        token: loginInfo,
        protocol: "https",
        hostname: "screeps.com",
        port: 443,
        path: "/"
    })
    else {
        isPrivateServer = true;
        api = new ScreepsAPI(loginInfo);
        await api.auth(loginInfo.username, loginInfo.password);
    }
}
