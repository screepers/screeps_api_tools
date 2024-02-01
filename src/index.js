import winston from 'winston';
import 'winston-daily-rotate-file';

import getAPI, { setLoginInfo } from "./api/initScreepsApi.js";
import ScreepsApi from "./api/screepsApi.js"

import getAllUsers, { getUsernames } from "./getAllUsers/index.js";
import GetWorldSize, { GetRoomNames } from './getMapSize/index.js'


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
export default class AdvancedScreepsApi {
    constructor(loginInfo, settings = {}) {
        setLoginInfo(loginInfo, settings);
        ScreepsApi.settings = settings;
    }

    async getRoomNames(shard) {
        try {
            await getAPI(true)
            return await GetRoomNames(shard);
        } catch (error) {
            logger.error(error);
            return undefined;
        }
    }

    async getWorldSize(shard) {
        try {
            await getAPI(true)
            return await GetWorldSize(shard);
        } catch (error) {
            logger.error(error);
            return undefined;
        }
    }

    async getAllUsers() {
        try {
            await getAPI(true)
            return getAllUsers();
        } catch (error) {
            logger.error(error);
            return undefined;
        }
    }

    async getUsernames() {
        try {
            await getAPI(true)
            return await getUsernames();
        } catch (error) {
            logger.error(error);
            return undefined;
        }
    }
}