import { isPrivateServer } from "./initScreepsApi.js";

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getShardNames() {
    return !isPrivateServer ? ['shard0', 'shard1', 'shard2', 'shard3'] : [undefined]
}