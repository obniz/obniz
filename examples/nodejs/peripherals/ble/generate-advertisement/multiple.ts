
import Obniz from "../../../../../"
if (typeof process.env.OBNIZ_IDS !== "string") {
  throw new Error(`Please set export OBNIZ_IDS=your_obniz_id`)
}

const ids = process.env.OBNIZ_IDS.split(",");
const obnizes = ids.map(id => new Obniz(id, { local_connect: false }));

console.log("connecting");
obnizes.forEach(obniz => {
  obniz.onconnect = onconnect
});

async function onconnect(obniz: Obniz) {

  console.log(`${obniz.id}[${obniz.metadata?.description || ''}] connected`);

  await obniz.ble?.initWait();
  // obniz.ble?.advertisement.setAdvData({
  //   serviceUuids: ["1234"]
  // });

  obniz.ble?.advertisement.setAdvData({
    localName: `obniz BLE ${obniz.id}`,
  });

  obniz.ble?.advertisement.start();
};