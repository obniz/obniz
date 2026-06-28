
import * as fs from 'fs';
import * as path from 'path';

import Obniz from '../../../../';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`);
}

// This example fetches public websites directly from the device, so no local
// server is required - just run it and watch the device's os.log() output.
const luaScript = fs.readFileSync(path.join(__dirname, 'script.lua'), 'utf8');

const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

console.log('connecting');
obniz.onconnect = async () => {
  console.log('connected');

  // Run the Lua instantly. Unlike savePluginLua/reloadLua this does not use
  // storage, so it also works on obniz Board.
  obniz.plugin!.execLua(luaScript);
};
