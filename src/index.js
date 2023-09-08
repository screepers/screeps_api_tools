import { initScreepsApi } from "./initScreepsApi.js";

import GetRoomNames from "./getMapSize/index.js";
import getAllUsers, { getUsernames } from "./getAllUsers/index.js";

export default class ScreepsApi {
    constructor(token) {
        initScreepsApi(token);
    }

    getRoomNames(shard) {
        return GetRoomNames(shard);
    }

    getWorldSize(shard) {
        return GetWorldSize(shard);
    }

    getAllUsers() {
        return getAllUsers();
    }

    getUsernames() {
        return getUsernames();
    }
}