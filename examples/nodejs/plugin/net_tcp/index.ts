
import * as fs from 'fs';
import * as net from 'net';
import * as os from 'os';
import * as path from 'path';

import Obniz from '../../../../';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`);
}

// Port the local TCP server listens on.
const SERVER_PORT = Number(process.env.SERVER_PORT) || 9001;

// Pick the first non-internal IPv4 address so the obniz device on the same
// network can reach this machine. Override with SERVER_HOST if needed.
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

// --- Local TCP server ------------------------------------------------------
// Keeps each connection open and echoes every message back with a reply, so
// the device and the server exchange data continuously over one connection.
const server = net.createServer((socket) => {
  const peer = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`[server] connection from ${peer}`);
  let replies = 0;
  socket.on('data', (chunk) => {
    const msg = chunk.toString().trim();
    console.log(`[server] recv from ${peer}: ${msg}`);
    replies += 1;
    socket.write(`pong ${replies} (you said: ${msg})\n`);
  });
  socket.on('close', () => console.log(`[server] closed ${peer}`));
  socket.on('error', (e) => console.log(`[server] socket error: ${e.message}`));
});
server.listen(SERVER_PORT, () => {
  console.log(`[server] TCP listening on ${SERVER_HOST}:${SERVER_PORT}`);
});

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
