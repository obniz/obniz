
import * as fs from 'fs';
import * as path from 'path';

import Obniz from "../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

const luaFilePath = path.join(__dirname, 'script.lua');
const luaBuffer = fs.readFileSync(luaFilePath);

console.log("connecting");
obniz.onconnect = async () => {
  console.log("connected");

  obniz.setClock(); // or obniz.pingWait(). But ping will return pong. it is not neccesary for just setting time.

  // WARNING: This is not needed every time. just onece.
  obniz.storage!.savePluginLua(luaBuffer);
  obniz.plugin!.reloadLua();

  console.log("Lua reloaded. Please enter self check mode from console.");
  obniz.reboot();
};