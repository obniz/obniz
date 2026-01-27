

import * as fs from 'fs';
import * as path from 'path';

import Obniz from "../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID);

const luaFilePath = path.join(__dirname, 'script.lua');
const luaBuffer = fs.readFileSync(luaFilePath);

console.log("connecting");
obniz.onconnect = async () => {
  console.log("connected");

  // WARNING: This is not needed every time. just onece.
  obniz.storage!.savePluginLua(luaBuffer);
  obniz.plugin!.reloadLua();

  obniz.io1!.output(true); // It Will keep while offline. But not for starting up. just become offline after online.
};