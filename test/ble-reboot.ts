import Obniz from "../dist/src/obniz/index";
import BleRemotePeripheral from "../src/obniz/libs/embeds/bleHci/bleRemotePeripheral";

const obniz = new Obniz("54371148");
obniz.debugprint =true;
let rebooted = false;

obniz.onconnect = async () => {
  obniz.ble = obniz.ble!;
  try {
    console.log("onconnect");
    await obniz.ble.initWait();
    obniz.ble.scan.onfind = (peripheral: BleRemotePeripheral) => {
      console.log(peripheral.localName);
    };

    obniz.ble.scan.onfinish = async (p: BleRemotePeripheral[], e?: Error) => {
      if (e) {
        console.log("scan finish with error " + e);
      } else {
        console.log("scan timeout!");
        try {
          await obniz.ble!.scan.startWait(null, { duration: 15 });
          console.log("scan start");
        } catch (e) {
          console.log(e);
          throw e;
        }
      }
    };

    await obniz.ble.scan.startWait(null, { duration: 1 });
    console.log("scan start");
    if (!rebooted) {
      rebooted = true;
      obniz.reboot();
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};
