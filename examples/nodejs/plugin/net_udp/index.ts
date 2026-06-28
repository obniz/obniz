
import * as dgram from 'dgram';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import Obniz from '../../../../';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`);
}

// Port the local UDP echo server listens on.
const SERVER_PORT = Number(process.env.SERVER_PORT) || 9000;

// Pick the first non-internal IPv4 address so the obniz device on the same
// network can reach this machine. Override with SERVER_HOST if auto-detection
// picks the wrong interface (e.g. when several are up).
function detectLanIp(): string {
  if (process.env.SERVER_HOST) {
    return process.env.SERVER_HOST;
  }
  for (const addrs of Object.values(os.networkInterfaces())) {
    for (const addr of addrs ?? []) {
      if (addr.family === 'IPv4' && !addr.internal) {
        return addr.address;
      }
    }
  }
  throw new Error('Could not detect a LAN IPv4 address. Set SERVER_HOST.');
}

const SERVER_HOST = detectLanIp();

// --- Local UDP echo server -------------------------------------------------
// Echoes every datagram back to its sender so the Lua script can see a reply.
const server = dgram.createSocket('udp4');
server.on('message', (msg, rinfo) => {
  console.log(`[server] recv from ${rinfo.address}:${rinfo.port} -> ${msg.toString()}`);
  server.send(msg, rinfo.port, rinfo.address);
});
server.on('listening', () => {
  const a = server.address();
  console.log(`[server] UDP echo listening on ${a.address}:${a.port}`);
  console.log(`[server] device will send to ${SERVER_HOST}:${SERVER_PORT}`);
});
server.bind(SERVER_PORT);

// --- obniz -----------------------------------------------------------------
const luaTemplate = fs.readFileSync(path.join(__dirname, 'script.lua'), 'utf8');
// Inject the detected server address into the Lua script.
const luaScript = luaTemplate
  .replace(/__SERVER_HOST__/g, SERVER_HOST)
  .replace(/__SERVER_PORT__/g, String(SERVER_PORT));

const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

console.log('connecting');
obniz.onconnect = async () => {
  console.log('connected');

  // Run the Lua instantly. Unlike savePluginLua/reloadLua this does not use
  // storage, so it also works on obniz Board.
  obniz.plugin!.execLua(luaScript);
};
