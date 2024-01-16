import "dotenv/config"
import ScreepsAPI from "../src/index.js";

const mmoScreepsApi = process.env.SCREEPS_TOKEN;
const privateScreepsApi = {
    protocol: process.env.PRIVATE_SERVER_PROTOCOL,
    hostname: process.env.PRIVATE_SERVER_HOST,
    port: process.env.PRIVATE_SERVER_PORT,
    path: "/",
    username: process.env.PRIVATE_SERVER_USERNAME,
    password: process.env.PRIVATE_SERVER_PASSWORD
};

jest.setTimeout(0);

describe('Screeps API', () => {
    describe('should get all roomNames', () => {
        it("mmo", async () => {
            const api = new ScreepsAPI(mmoScreepsApi);
            const roomNames = await api.getRoomNames();
            expect(roomNames.length).toBeGreaterThan(0);
        })
        it("private", async () => {
            const api = new ScreepsAPI(privateScreepsApi);
            const roomNames = await api.getRoomNames();
            expect(roomNames.length).toBeGreaterThan(0);
        })
        it('should have correct room count', async () => {
            const api = new ScreepsAPI(mmoScreepsApi);
            const worldSize = await api.getWorldSize();
            const expectedRooms = worldSize.width * worldSize.height;

            const roomNames = await api.getRoomNames();
            expect(expectedRooms).toBe(roomNames.length);
        })
        it('should adjust room count correctly', async () => {
            const customWorldSize = { sectorWidth: 2, sectorHeight: 1, directions: [['E', "N"]] };
            const api = new ScreepsAPI(privateScreepsApi, { worldSize: customWorldSize });
            const worldSize = await api.getWorldSize();
            const expectedRooms = worldSize.width * worldSize.height;

            const roomNames = await api.getRoomNames();
            expect(expectedRooms).toBe(roomNames.length);
        })
    })
    describe('should get all users', () => {
        beforeEach(() => {
            jest.setTimeout(0);
        })
        it("mmo", async () => {
            const api = new ScreepsAPI(mmoScreepsApi);
            const users = await api.getAllUsers();
            expect(users.length).toBeGreaterThan(0);
        }, 100 * 10000)
        it("private", async () => {
            const api = new ScreepsAPI(privateScreepsApi);
            const users = await api.getAllUsers();
            expect(users.length).toBeGreaterThan(0);
        }, 100 * 10000)
    })
})