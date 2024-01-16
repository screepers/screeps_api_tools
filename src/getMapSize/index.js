import { sleep } from '../helper.js';
import ScreepsApi from '../api/screepsApi.js';
import { isPrivateServer } from '../api/initScreepsApi.js';

export default async function GetWorldSize(shard) {
    return await ScreepsApi.worldSize(shard);
}

export async function GetRoomNames(shard) {
    const roomNames = [];
    const size = await ScreepsApi.worldSize(shard);
    await sleep(1000);

    let width = size.width / 2;
    let height = size.height / 2;
    if (isPrivateServer) {
        width = size.width
        height = size.height
    }
    const worldSize = ScreepsApi.settings.worldSize;
    for (let x = 0; x < width; x += 1) {
        for (let y = 0; y < height; y += 1) {
            if (worldSize && worldSize.directions) {
                for (const direction of worldSize.directions) {
                    roomNames.push(`${direction[0]}${x}${direction[1]}${y}`);
                }
            }
            else {
                roomNames.push(`E${x}N${y}`);
                roomNames.push(`W${x}N${y}`);
                roomNames.push(`E${x}S${y}`);
                roomNames.push(`W${x}S${y}`);
            }
        }
    }

    return roomNames;
}