

import Obniz from "../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

console.log("connecting");

obniz.onconnect = async () => {
  console.log("connected");
  await obniz.ble!.initWait();

  obniz.ble!.scan.onfind = async function (peripheral: any) {
    console.log(`${peripheral.address}, ${peripheral.rssi}, ${peripheral.localName}, ${peripheral.adv_data ? Buffer.from(peripheral.adv_data).toString('hex') : ''}, ${peripheral.scan_rsp ? Buffer.from(peripheral.scan_rsp).toString('hex') : ''}`)
    if (peripheral.iBeacon) {
      console.log(`  iBeacon: uuid=${peripheral.iBeacon.uuid}, major=${peripheral.iBeacon.major}, minor=${peripheral.iBeacon.minor}, txPower=${peripheral.iBeacon.txPower}`);
    }
  };

  // when want to filter iBeacon. use target as 1st arg of startWait.
  const iBeaconFilter = [0x4c, 0x00, 0x02, 0x15];
  const target = {
    binary: [iBeaconFilter],
  };

  await obniz.ble!.scan.startWait(null, {
    activeScan: true,
    filterOnDevice: true,
    duplicate: true,
    duration: null,
    usePhy1m: true,
    usePhyCoded: true,
  });
  console.log("scan started");
}

