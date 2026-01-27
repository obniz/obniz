
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

  // WARNING: This is not needed every time. just onece.
  obniz.storage!.savePluginLua(luaBuffer);
  obniz.plugin!.reloadLua();
  console.log("Lua reloaded");

  obniz.plugin!.onFrameStart = (frame_id, length) => {
    console.log(`frame start id=${frame_id} length=${length}`);
  }
  obniz.plugin!.onFrameEnd = () => {
    console.log(`frame ended`);
  }
  obniz.plugin!.onreceive = (data) => {
    console.log(`received=${Buffer.from(data).toString()}`);
  };
  const date = new Date().toString();
  obniz.plugin!.send(date);
  console.log(`Sent "${date}"`);
};

/**
 * Example Output
 * 
 * connecting
 * connected
 * Lua reloaded
 * Sent "Wed Oct 01 2025 23:51:27 GMT+0900 (JST)"
 * received=pong
 * frame start id=1 length=6
 * received=fra
 * received=med
 * frame ended
 */