
import * as http from 'http';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import Obniz from '../../../../dist/src/obniz';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`);
}

// Port the local HTTP server listens on.
const SERVER_PORT = Number(process.env.SERVER_PORT) || 9002;

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

// --- Local HTTP server -----------------------------------------------------
// Receives the io1 AD value the device POSTs to /ad every 3 seconds and logs
// it. Returns the parsed value back as JSON.
const server = http.createServer((req, res) => {
  const chunks: Buffer[] = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => {
    const body = Buffer.concat(chunks).toString();

    if (req.method === 'POST' && req.url === '/ad') {
      let voltage: number | undefined;
      try {
        voltage = JSON.parse(body).voltage;
      } catch {
        // keep voltage undefined on malformed JSON
      }
      console.log(
        `[server] POST /ad io1 = ${
          typeof voltage === 'number' ? voltage.toFixed(3) + 'V' : '?'
        }  (raw: ${body})`
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, voltage }));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('not found\n');
    }
  });
});
server.listen(SERVER_PORT, () => {
  console.log(`[server] HTTP listening on http://${SERVER_HOST}:${SERVER_PORT}`);
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
