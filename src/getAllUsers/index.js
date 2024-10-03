
import { getShardNames } from '../helper.js';
import { GetRoomNames } from '../getMapSize/index.js';
import ScreepsApi from '../api/screepsApi.js';
import { includeAllRooms } from "../api/initScreepsApi.js";

async function getAllUsersPerShard(mapStats) {
    const { stats, users } = mapStats;
    const roomsByUsername = {};
    const roomNameKeys = Object.keys(stats);
    for (let r = 0; r < roomNameKeys.length; r++) {
        const room = roomNameKeys[r];
        const stat = stats[room];
        const { own } = stat;
        if (own) {
            const { username, _id } = users[own.user];
            if (!roomsByUsername[username]) {
                roomsByUsername[username] = { id: _id, owned: [], reserved: [], unknown: [] };
            }
            if (!includeAllRooms) {
                if (own.level > 0) {
                    roomsByUsername[username].owned.push(room);
                } else {
                    roomsByUsername[username].reserved.push(room);
                }
            }
        }

        if (includeAllRooms) {
            if (!roomsByUsername["Unknown"]) {
                roomsByUsername["Unknown"] = { id: "Unknown", owned: [], reserved: [], unknown: [] };
            }
            roomsByUsername["Unknown"].unknown.push(room);
        }
    };

    delete roomsByUsername.Invader;

    return roomsByUsername;
}

export default async function getAllUsers() {
    const shards = getShardNames();
    const users = [];

    const gcls = await ScreepsApi.gclLeaderboard();
    const powers = await ScreepsApi.powerLeaderboard();
    const seasonal = await ScreepsApi.seasonalLeaderboard();

    for (let s = 0; s < shards.length; s++) {
        const shard = shards[s];
        const rooms = await GetRoomNames(shard);
        const mapStats = await ScreepsApi.mapStats(shard, rooms);
        const usersPerShard = await getAllUsersPerShard(mapStats);

        const usernames = Object.keys(usersPerShard);
        for (let u = 0; u < usernames.length; u += 1) {
            const username = usernames[u];
            const userData = usersPerShard[username];

            let index = users.findIndex(user => user.username === username);
            if (index === -1) {
                users.push({
                    username,
                    shards: {},
                    id: userData.id,
                    gcl: gcls[username],
                    power: powers[username],
                    seasonal: seasonal[username],
                });
                index = users.length - 1;
            }
            users[index].shards[shard] = {
                owned: userData.owned,
                reserved: userData.reserved,
                unknown: userData.unknown,
            };
        }
    }

    return users;
}

export async function getUsernames() {
    const users = await getAllUsers();
    return users.map(user => user.username);
}

export async function getAllLeaderboard() {
    const gcls = await ScreepsApi.gclLeaderboard();
    const powers = await ScreepsApi.powerLeaderboard();
    const seasonal = await ScreepsApi.seasonalLeaderboard();

    return { gcl: gcls, power: powers, seasonal: seasonal };
}