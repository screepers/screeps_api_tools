import { sleep } from '../helper.js';
import ScreepsApi from '../initScreepsApi.js';

async function GetWorldSize(shard) {
    await sleep(500);

    try {
        const size = await ScreepsApi().raw.game.worldSize(shard);
        if (!size.ok) throw new Error(JSON.stringify(size));
        return size;
    } catch (error) {
        return 0;
    }
}

export default async function GetRoomNames(shard) {
    const roomNames = [];
    const size = await GetWorldSize(shard);
    await sleep(500);

    for (let x = 0; x < size.width; x += 1) {
        for (let y = 0; y < size.height; y += 1) {
            roomNames.push(`E${x}N${y}`);
            roomNames.push(`W${x}N${y}`);
            roomNames.push(`E${x}S${y}`);
            roomNames.push(`W${x}S${y}`);
        }
    }

    return roomNames;
}