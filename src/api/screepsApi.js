import winston from 'winston';
import 'winston-daily-rotate-file';

import getScreepsApi from "./initScreepsApi.js";
import { sleep, mergeDeep } from '../helper.js';

const transport = new winston.transports.DailyRotateFile({
    level: 'info',
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

const logger = winston.createLogger({
    transports: [
        transport
    ]
});

function getSeason(getLastSeason) {
    const today = new Date();

    if (getLastSeason) {
        today.setMonth(today.getMonth() - 1);
    }

    if (today.getMonth() < 10) {
        return `${today.getFullYear()}-0${today.getMonth() + 1}`;
    }
    return `${today.getFullYear()}-${today.getMonth()}`;
}
function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

export default class ScreepsApi {
    static settings;

    static async mapStats(shard, rooms) {
        const batchSize = 25 * 1000; // You can adjust this value based on your needs
        const roomChunks = chunkArray(rooms, batchSize);

        let results = {};

        const api = await getScreepsApi();
        for (const chunk of roomChunks) {
            await sleep(1000); // Add a delay between batches

            try {
                const mapStats = await api.raw.game.mapStats(chunk, "owner0", shard);
                if (!mapStats.ok) throw new Error(JSON.stringify(mapStats));

                mergeDeep(results, mapStats)
            } catch (error) {
                if (error.message) {
                    console.info(`${error.message}`);
                }
                console.error(`${error.stack}`);
            }
        }

        return results; // Wrap the results in an object if necessary
    }

    static async gclLeaderboard() {
        try {
            const gcls = {};

            let offset = 0;
            const season = getSeason();
            const mode = "world";
            let hasUsersLeft = true;

            const api = await getScreepsApi();
            while (hasUsersLeft) {
                const leaderboard = await api.raw.leaderboard.list(
                    20,
                    mode,
                    offset,
                    season
                );
                if (!leaderboard.ok) throw new Error(JSON.stringify(leaderboard));

                const users = Object.keys(leaderboard.users);
                for (let u = 0; u < users.length; u++) {
                    const user = leaderboard.users[users[u]];
                    gcls[user.username] = user.gcl;
                }

                if (users.length === 0) hasUsersLeft = false;
                offset += 20;
                await sleep(1000);
            }

            return gcls;
        } catch (error) {
            logger.error(error);
            return {};
        }
    }

    static async powerLeaderboard() {
        try {
            const powers = {};

            let globalTries = 0;
            let offset = 0;
            const season = getSeason();
            const mode = "power";
            let hasUsersLeft = true;

            const api = await getScreepsApi();
            while (hasUsersLeft) {
                const leaderboard = await api.raw.leaderboard.list(
                    20,
                    mode,
                    offset,
                    season
                );
                if (!leaderboard.ok) throw new Error(JSON.stringify(leaderboard));
                offset += 20;

                const list = Object.keys(leaderboard.list);
                for (let l = 0; l < list.length; l++) {
                    const rank = leaderboard.list[list[l]];
                    const user = leaderboard.users[rank.user];
                    powers[user.username] = rank.score;
                }

                if (list.length === 0) {
                    if (globalTries > 1) {
                        hasUsersLeft = false;
                    }

                    if (offset === 0) {
                        globalTries += 1;
                        season = getSeason(true);
                        offset = 0;
                    } else {
                        hasUsersLeft = false;
                    }
                }
                await sleep(1000);
            }

            return powers;
        } catch (error) {
            logger.error(error);
            return {};
        }
    }

    static async worldSize(shard) {
        if (this.settings.worldSize) {
            const width = this.settings.worldSize.sectorWidth * 10 + 1;
            const height = this.settings.worldSize.sectorHeight * 10 + 1;
            return { width, height };
        }

        await sleep(1000);
        try {
            const api = await getScreepsApi();
            const size = await api.raw.game.worldSize(shard);
            if (!size.ok) throw new Error(JSON.stringify(size));
            return size;
        } catch (error) {
            logger.error(error);
            return undefined;
        }
    }
}