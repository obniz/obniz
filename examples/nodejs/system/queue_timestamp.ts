
import Obniz from "../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });


console.log("connecting");
obniz.onconnect = async () => {
  console.log("connected");

  obniz.setClock(); // set current time to obniz
  obniz.setQueueMode({
    timestamp: 'unix_milliseconds', // It will add 8bytes. or unix_seconds for 4 bytes. milliseconds alwasy 000.
    interval: 0
  });

  await obniz.ble!.initWait();
  obniz.ble!.scan.onfind = (peripheral) => {
    console.log(obniz.deviceTimestamp);
    console.log(peripheral.address);
  }
  await obniz.ble!.scan.startWait(null, { duration: null, duplicate: true });
};

/**
 * seconds will log like below.
 * 
 * 1759245801000
4755b057e4f3
1759245801000
c37e0c246759
1759245802000
e711a024b182
 */