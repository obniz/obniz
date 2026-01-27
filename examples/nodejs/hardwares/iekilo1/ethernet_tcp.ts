
import Obniz from "../../../../"
import { W5500Parts } from "../../../../dist/src/parts/Ethernet/W5500";

if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const kilo = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

const localNetwork = {
  ip: "192.168.0.2",
  port: 4001,
};

const localNetworkConfig: W5500Parts.Config = {
  gatewayIP: "192.168.0.1",
  subnetMask: "255.255.255.0",
  macAddress: "C8:2B:96:AE:10:63",
  localIP: localNetwork.ip,
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
    protocol: 'TCPClient',
    sourcePort: 54321,
    destIP: '192.168.0.58', // example.com
    destPort: 8080, // HTTP
    rxBufferSize: 4, // 4KB
    stringMode: true, // 受信データを文字列として扱う
  });

  socket.setInterruptHandler('ReceiveData', async (sock: any, data: any) => {
    console.log(`ソケット${sock.id}[受信2]`, data);
    await w5500.finalizeWait();
    console.log('終了');
  });
  w5500Ready = true;


  socket.setInterruptHandler('ConnectSuccess', async (sock: any) => {
    const data = 'GET / HTTP/1.1\n' +
      'Host: localhost\n' +
      'Connection: keep-alive\n' +
      'Pragma: no-cache\n' +
      'Cache-Control: no-cache\n' +
      'Accept: text/html\n' +
      'Accept-Language: ja,en-US;q=0.9,en;q=0.8\n\n'
    await socket.sendDataWait(data);
  });

};

kilo.onloop = async () => {
  if (!w5500Ready) {
    return;
  }
  await w5500.checkInterruptWait();
}
