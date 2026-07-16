
import * as fs from 'fs';
import * as net from 'net';
import * as os from 'os';
import * as path from 'path';

import Obniz from '../../../../';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`);
}

// Port the local MQTT broker listens on (1883 is the standard MQTT port).
const SERVER_PORT = Number(process.env.SERVER_PORT) || 1883;

// Topics: the device publishes to UP and subscribes to DOWN.
const TOPIC_UP = 'obniz/up'; // device -> broker
const TOPIC_DOWN = 'obniz/down'; // broker -> device

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

// --- Minimal MQTT 3.1.1 broker ---------------------------------------------
// Supports just enough for one client: CONNECT/CONNACK, SUBSCRIBE/SUBACK,
// PUBLISH (QoS 0, both directions) and PINGREQ/PINGRESP. No external deps.

// MQTT remaining-length is a base-128 varint.
function encodeRemainingLength(len: number): Buffer {
  const out: number[] = [];
  do {
    let b = len % 128;
    len = Math.floor(len / 128);
    if (len > 0) {
      b |= 0x80;
    }
    out.push(b);
  } while (len > 0);
  return Buffer.from(out);
}

function decodeRemainingLength(
  buf: Buffer,
  offset: number
): { value: number; bytes: number } | null {
  let multiplier = 1;
  let value = 0;
  let bytes = 0;
  for (;;) {
    if (offset + bytes >= buf.length) {
      return null; // not enough bytes yet
    }
    const b = buf[offset + bytes];
    value += (b & 0x7f) * multiplier;
    bytes += 1;
    if ((b & 0x80) === 0) {
      break;
    }
    multiplier *= 128;
    if (bytes >= 4) {
      return null; // malformed
    }
  }
  return { value, bytes };
}

// Build a PUBLISH packet (QoS 0): no packet identifier.
function buildPublish(topic: string, payload: string): Buffer {
  const t = Buffer.from(topic);
  const varHeader = Buffer.concat([
    Buffer.from([t.length >> 8, t.length & 0xff]),
    t,
    Buffer.from(payload),
  ]);
  return Buffer.concat([
    Buffer.from([0x30]),
    encodeRemainingLength(varHeader.length),
    varHeader,
  ]);
}

const server = net.createServer((socket) => {
  const peer = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`[broker] connection from ${peer}`);
  let rxbuf = Buffer.alloc(0);
  let timer: NodeJS.Timeout | undefined;
  let tick = 0;

  socket.on('data', (chunk) => {
    rxbuf = Buffer.concat([rxbuf, chunk]);

    // Extract every complete packet currently buffered.
    for (;;) {
      if (rxbuf.length < 2) {
        break;
      }
      const type = rxbuf[0] >> 4;
      const rl = decodeRemainingLength(rxbuf, 1);
      if (!rl) {
        break; // length field incomplete
      }
      const total = 1 + rl.bytes + rl.value;
      if (rxbuf.length < total) {
        break; // full packet not arrived yet
      }
      const packet = rxbuf.slice(0, total);
      rxbuf = rxbuf.slice(total);
      const vh = 1 + rl.bytes; // start of variable header

      if (type === 1) {
        // CONNECT -> CONNACK (session present 0, return code 0 = accepted)
        console.log('[broker] CONNECT -> CONNACK');
        socket.write(Buffer.from([0x20, 0x02, 0x00, 0x00]));
      } else if (type === 8) {
        // SUBSCRIBE -> SUBACK
        const packetId = (packet[vh] << 8) | packet[vh + 1];
        const topicLen = (packet[vh + 2] << 8) | packet[vh + 3];
        const topic = packet.slice(vh + 4, vh + 4 + topicLen).toString();
        console.log(`[broker] SUBSCRIBE "${topic}" -> SUBACK`);
        socket.write(
          Buffer.from([0x90, 0x03, packetId >> 8, packetId & 0xff, 0x00])
        );

        // Once the client subscribed, push a downlink message every 3 seconds.
        timer = setInterval(() => {
          tick += 1;
          const payload = `hello from broker #${tick}`;
          console.log(`[broker] publish ${TOPIC_DOWN}: ${payload}`);
          socket.write(buildPublish(TOPIC_DOWN, payload));
        }, 3000);
      } else if (type === 3) {
        // PUBLISH from the device (QoS 0)
        const topicLen = (packet[vh] << 8) | packet[vh + 1];
        const topic = packet.slice(vh + 2, vh + 2 + topicLen).toString();
        const payload = packet.slice(vh + 2 + topicLen).toString();
        console.log(`[broker] recv ${topic}: ${payload}`);
      } else if (type === 12) {
        // PINGREQ -> PINGRESP
        socket.write(Buffer.from([0xd0, 0x00]));
      } else if (type === 14) {
        // DISCONNECT
        console.log('[broker] DISCONNECT');
        socket.end();
      }
    }
  });

  socket.on('close', () => {
    if (timer) {
      clearInterval(timer);
    }
    console.log(`[broker] closed ${peer}`);
  });
  socket.on('error', (e) => console.log(`[broker] socket error: ${e.message}`));
});
server.listen(SERVER_PORT, () => {
  console.log(`[broker] MQTT listening on ${SERVER_HOST}:${SERVER_PORT}`);
});

// --- obniz -----------------------------------------------------------------
const luaTemplate = fs.readFileSync(path.join(__dirname, 'script.lua'), 'utf8');
// Inject the detected broker address into the Lua script.
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
