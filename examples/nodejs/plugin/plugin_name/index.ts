
import * as fs from 'fs';
import * as path from 'path';

import Obniz from "../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { access_token: process.env.ACCESS_TOKEN });

const luaFilePath = path.join(__dirname, 'script.lua');
const luaBuffer = fs.readFileSync(luaFilePath);

console.log("connecting");
obniz.onconnect = async () => {
  console.log("connected");

  console.log(obniz.plugin_name);

  if (obniz.plugin_name !== 'my_plugin') {
    console.log("Must Load Plugin");
    obniz.storage!.savePluginLua(luaBuffer);
    obniz.plugin!.reloadLua();
  } else {
    console.log("No Need to Load Plugin");
  }
};