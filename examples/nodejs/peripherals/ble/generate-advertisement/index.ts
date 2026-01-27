
import Obniz from "../../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

console.log("connecting");
obniz.onconnect = async () => {
  console.log("connected");

  await obniz.ble?.initWait();
  obniz.ble?.advertisement.setAdvData({
    serviceUuids: ["1234"]
  });

  obniz.ble?.advertisement.setScanRespData({
    localName : "obniz BLE",
  });

  obniz.ble?.advertisement.start();
};
