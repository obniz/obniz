
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

  if (obniz.storage) {
    // WARNING: This is not needed every time. just onece.
    obniz.storage!.savePluginLua(luaBuffer);
    obniz.plugin!.reloadLua();
  } else {
    // this is for obniz Board Series which doesn't have storage plugin. execLua can be used without storage.
    // Of-course, this can be used for storage plugin as well.
    obniz.onloop = async () => {
      const result = await obniz.plugin!.callWait(`
        return "AD1: " .. ad.get(1) .. "v"
      `);
      console.log(result);
    }
  }
};