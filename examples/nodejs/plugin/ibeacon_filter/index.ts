

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

  // WARNING: This is not needed every time. just onece.
  obniz.storage!.savePluginLua(luaBuffer);
  obniz.plugin!.reloadLua();

  await obniz.ble!.initWait();
};

obniz.onloop = async () => {
  if (!obniz.ble?.isInitialized) {
    return;
  }
  await new Promise(async (resolve, reject) => {
    obniz.ble!.scan.onfind = async function (peripheral: any) {
      console.log(`${peripheral.address} ${peripheral.rssi} ${Buffer.from(peripheral.adv_data).toString('hex')}`)
      if (peripheral.iBeacon) {
        console.log(peripheral.iBeacon);
      }
    };

    obniz.ble!.scan.onfinish = async function (peripherals: any, error: any) {
      if (error) {
        reject(error);
        return;
      }
      resolve(peripherals);
    };

    await obniz.ble!.scan.startWait(null, {
      duplicate: true,
      duration: 60
    });

    console.log("scannning...");
  });
}