
import Obniz from "../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });
// obniz.debugprint = true;

console.log("connecting");
obniz.onconnect = async () => {
  console.log("connected");

  obniz.setClock(); // set current time to obniz
  obniz.setQueueMode({
    timestamp: 'none',
    interval: 0 // No Delay and No Timestamp.
  });

  await obniz.ble!.initWait();
  obniz.ble!.scan.onfind = (peripheral) => {
    console.log(obniz.deviceTimestamp);
    console.log(peripheral.address);
  }
  await obniz.ble!.scan.startWait(null, { duration: null, duplicate: true });

  obniz.setQueueMode({
    timestamp: 'unix_seconds',
    interval: 10 * 1000 // every 10 seconds or until buffer acceptable data will be stored with timestamp.
  });
};