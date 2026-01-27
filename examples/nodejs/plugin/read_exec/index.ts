

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
  obniz.plugin!.execLua(luaBuffer.toString('utf8')); // will print "3" on obnizOS console(need console enabled)
};