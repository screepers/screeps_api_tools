import 'dotenv/config'
import ScreepsApi from "../src/index.js";

const token = process.env.SCREEPS_TOKEN;
const screepsApi = new ScreepsApi(token);

screepsApi.getAllUsers().then((users) => {
    console.log(users);
});