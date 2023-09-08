
import { sleep, getShardNames } from '../helper.js';
import getRoomNames from '../getMapSize/index.js';
import ScreepsApi from '../initScreepsApi.js';
import { GetGclOfUsers, GetPowerOfUsers } from './userInfo.js';

export async function GetMapStats(shard, rooms) {
    await sleep(500);

    try {
        const mapStats = await ScreepsApi().raw.game.mapStats(rooms, "owner0", shard);
        if (!mapStats.ok) throw new Error(JSON.stringify(mapStats));
        return mapStats;
    } catch (error) {
        return undefined;
    }
}

async function getAllUsersPerShard(mapStats) {
    const { stats, users } = mapStats;
    const roomsByUsername = {};
    Object.entries(stats).forEach(([room, stat]) => {
        const { own } = stat;
        if (own) {
            const { username, _id } = users[own.user];
            if (!roomsByUsername[username]) {
                roomsByUsername[username] = { id: _id, owned: [], reserved: [] };
            }
            if (own.level > 0) {
                roomsByUsername[username].owned.push(room);
            } else {
                roomsByUsername[username].reserved.push(room);
            }
        }
    });

    delete roomsByUsername.Invader;

    return roomsByUsername;
}

export default async function getAllUsers() {
    const shards = getShardNames();
    const users = [];

    const gcls = await GetGclOfUsers();
    const powers = await GetPowerOfUsers();

    for (let s = 0; s < shards.length; s++) {
        const shard = shards[s];
        const rooms = await getRoomNames(shard);
        const mapStats = await GetMapStats(shard, rooms);
        const usersPerShard = await getAllUsersPerShard(mapStats);

        const usernames = Object.keys(usersPerShard);
        for (let u = 0; u < usernames.length; u += 1) {
            const username = usernames[u];
            const userData = usersPerShard[username];

            users.push({
                username,
                shards: {},
                id: userData.id,
                gcl: gcls[username],
                power: powers[username],
            });

            users[users.length - 1].shards[shard] = {
                owned: userData.owned,
                reserved: userData.reserved,
            };
        }
    }

    return users;
}

export async function getUsernames() {
    const users = await getAllUsers();
    return users.map(user => user.username);
}