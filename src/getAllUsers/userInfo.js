import ScreepsApi from '../initScreepsApi.js';
import { sleep } from '../helper.js';

function getSeason(getLastSeason) {
    const today = new Date();

    if (getLastSeason) {
        today.setMonth(today.getMonth() - 1);
    }

    // add a zero in front of numbers<10
    if (today.getMonth() < 10) {
        return `${today.getFullYear()}-0${today.getMonth() + 1}`;
    }
    return `${today.getFullYear()}-${today.getMonth()}`;
}

export async function GetGclOfUsers() {
    try {
        const gcls = {};

        let offset = 0;
        const season = getSeason();
        const mode = "world";
        let hasUsersLeft = true;

        while (hasUsersLeft) {
            const leaderboard = await ScreepsApi().raw.leaderboard.list(
                20,
                mode,
                offset,
                season
            );
            if (!leaderboard.ok) throw new Error(JSON.stringify(leaderboard));

            const users = Object.values(leaderboard.users);
            users.forEach((user) => {
                gcls[user.username] = user.gcl;
            });

            if (users.length === 0) hasUsersLeft = false;
            offset += 20;
            await sleep(500);
        }

        return gcls;
    } catch (error) {
        return {};
    }
}

export async function GetPowerOfUsers() {
    try {
        const powers = {};

        let globalTries = 0;
        let offset = 0;
        const season = getSeason();
        const mode = "power";
        let hasUsersLeft = true;

        while (hasUsersLeft) {
            const leaderboard = await ScreepsApi().raw.leaderboard.list(
                20,
                mode,
                offset,
                season
            );
            if (!leaderboard.ok) throw new Error(JSON.stringify(leaderboard));
            offset += 20;

            const list = Object.values(leaderboard.list);
            list.forEach((rank) => {
                const user = leaderboard.users[rank.user];
                powers[user.username] = rank.score;
            });

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
            await sleep(500);
        }

        return powers;
    } catch (error) {
        return {};
    }
}
