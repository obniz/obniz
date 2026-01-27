
import Obniz from "../../../../"
import { W5500Parts } from "../../../../dist/src/parts/Ethernet/W5500";

if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const kilo = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

const localNetworkConfig: W5500Parts.Config = {
  gatewayIP: "192.168.0.1",
  subnetMask: "255.255.255.0",
  macAddress: "C8:2B:96:AE:10:63",
  localIP: '192.168.0.2',
};

let w5500: any;
let w5500Ready: any;

kilo.onconnect = async () => {
  console.log(`connected to ${kilo.id} ${kilo.hw}`)

  w5500 = kilo.wired('W5500', { reset: 11, mosi: 20, miso: 21, clk: 19, cs: 10 });
  await w5500.initWait(localNetworkConfig);
  console.log(`w5500 initWait finished`);

  await w5500.waitLinkUpWait();
  console.log(`w5500 network joined`);

  const socket = w5500.getNewSocket();
  await socket.initWait({
    protocol: 'UDP',
    sourcePort: 54321,
    destIP: '61.205.120.130', // ntp.nict.jp
    destPort: 123, // NTP
  });

  socket.setInterruptHandler('ReceiveData', async (sock: any, data: any) => {
    console.log(`ソケット${sock.id}[受信2]`, data);
    await w5500.finalizeWait();
    console.log('終了');
  });
  w5500Ready = true;


  const unix = new Date().getTime() / 1000;
  const data = [
    0b00011011, 0, 6, 32, 0, 0, 0, 0,
    0, 0, 0, 0,
    61, 205, 120, 130,
    (unix & 0xFF000000) >> (8 * 3), (unix & 0xFF0000) >> (8 * 2), (unix & 0xFF00) >> (8 * 1), unix & 0xFF,
    0, 0, 0, 0,
    (unix & 0xFF000000) >> (8 * 3), (unix & 0xFF0000) >> (8 * 2), (unix & 0xFF00) >> (8 * 1), unix & 0xFF,
    0, 0, 0, 0,
    (unix & 0xFF000000) >> (8 * 3), (unix & 0xFF0000) >> (8 * 2), (unix & 0xFF00) >> (8 * 1), unix & 0xFF,
    0, 0, 0, 0,
    (unix & 0xFF000000) >> (8 * 3), (unix & 0xFF0000) >> (8 * 2), (unix & 0xFF00) >> (8 * 1), unix & 0xFF,
    0, 0, 0, 0,
  ];
  await socket.sendDataWait(data);
  console.log(`ソケット${socket.id}[送信]`, data);

};

kilo.onloop = async () => {
  if (!w5500Ready) {
    return;
  }
  await w5500.checkInterruptWait();
}
