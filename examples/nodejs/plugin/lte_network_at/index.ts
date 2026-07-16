
import * as fs from 'fs';
import * as path from 'path';

import Obniz from "../../../../dist/src/obniz"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

const luaFilePath = path.join(__dirname, 'script.lua');
const luaBuffer = fs.readFileSync(luaFilePath);

console.log("connecting");
obniz.onconnect = async () => {
  console.log("connected");

  obniz.plugin!.onreceive = (data) => {
    console.log(`received=${Buffer.from(data).toString()}`);
  };

  obniz.storage!.savePluginLua(luaBuffer);
  obniz.plugin!.reloadLua();

  obniz.plugin!.send("AT+CNUM");
  obniz.plugin!.send("AT%XMONITOR");
};