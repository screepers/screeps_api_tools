import 'dotenv/config'
import ScreepsApi from "../src/index.js";

const token = process.env.SCREEPS_TOKEN;

async function test() {
    const screepsApi = new ScreepsApi(token);
    const users = await screepsApi.getAllUsers();

    const privateScreepsApi = new ScreepsApi({
        protocol: process.env.PRIVATE_SERVER_PROTOCOL,
        hostname: process.env.PRIVATE_SERVER_HOST,
        port: process.env.PRIVATE_SERVER_PORT,
        path: "/",
        username: process.env.PRIVATE_SERVER_USERNAME,
        password: process.env.PRIVATE_SERVER_PASSWORD
    });
    const privateUsers = await privateScreepsApi.getAllUsers();
    console.log(users !== undefined, privateUsers !== undefined)
}
test()