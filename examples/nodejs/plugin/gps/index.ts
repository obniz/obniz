
import * as fs from 'fs';
import * as path from 'path';

import Obniz from "../../../../"

const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

const luaFilePath = path.join('./gps.lua');
const luaBuffer = fs.readFileSync(luaFilePath);

console.log("connecting");
obniz.onconnect = async () => {
    console.log("connected");

    obniz.plugin!.onreceive = (data) => {
        console.log(`received=${Buffer.from(data).toString()}`);
    };

    // WARNING: This is not needed every time. just onece.
    obniz.storage!.savePluginLua(luaBuffer);
    obniz.plugin!.reloadLua();
    console.log("Lua reloaded");
};