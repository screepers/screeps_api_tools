import "dotenv/config";
import { ScreepsAPI } from "screeps-api";

let api;

export default function getApi() {
    return api;
};

export function initScreepsApi(token) {
    api = new ScreepsAPI({
        token,
        protocol: "https",
        hostname: "screeps.com",
        port: 443,
        path: "/"
    });
}
