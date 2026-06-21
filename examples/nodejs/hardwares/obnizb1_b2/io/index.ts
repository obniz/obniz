
import * as fs from 'fs';

import Obniz from "../../../../../dist/src/obniz"

const obnizId = process.env.OBNIZ_ID;
if (!obnizId) {
  throw new Error('OBNIZ_ID is not set');
}
const obniz = new Obniz(obnizId);

const luaScript = fs.readFileSync('./script.lua', { encoding: 'utf-8' });

console.log("connecting");
obniz.onconnect = async () => {
  console.log("connected");

  // WARNING: This is not needed every time. just onece.
  obniz.plugin?.execLua(luaScript);
  console.log("Lua was transferred");
};