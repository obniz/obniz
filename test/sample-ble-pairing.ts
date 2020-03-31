import Obniz from "../dist/src/obniz/index";
import BleRemoteCharacteristic from "../src/obniz/libs/embeds/bleHci/bleRemoteCharacteristic";
import BleRemotePeripheral from "../src/obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../src/obniz/ObnizPartsInterface";
import REX_BTPM25V from "../src/parts/Ble/REX_BTPM25V";

console.log("start");
const stick = new Obniz.M5StickC("14436407");

export interface RS_BTIREX2Options {}

// not working
export default class RS_BTIREX2 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "RS_BTIREX2",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    if (peripheral.localName && peripheral.localName.startsWith("btir")) {
      return true;
    }
    return false;
  }

  public keys: string[] = [];
  public requiredKeys: string[] = [];
  public params: any;
  public onbuttonpressed: ((pressed: boolean) => void) | null = null;
  public _peripheral: BleRemotePeripheral | null = null;

  private _uuids = {
    service: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
    rxChar: "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
    txChar: "6e400003-b5a3-f393-e0a9-e50e24dcca9e",
  };
  private _rxCharacteristic: BleRemoteCharacteristic | null = null;
  private _txCharacteristic: BleRemoteCharacteristic | null = null;

  constructor(peripheral: BleRemotePeripheral | null) {
    if (peripheral && !RS_BTIREX2.isDevice(peripheral)) {
      throw new Error("peripheral is not RS_BTIREX2");
    }
    this._peripheral = peripheral;
  }

  // @ts-ignore
  public wired(obniz: Obniz): void {}

  public async connectWait() {
    if (!this._peripheral) {
      throw new Error("RS_BTIREX2 is not find.");
    }
    this._peripheral.ondisconnect = () => {
      console.log("disconnect");
    };
    await this._peripheral.connectWait();

    this._rxCharacteristic = this._peripheral.getService(this._uuids.service)!.getCharacteristic(this._uuids.rxChar);
    this._txCharacteristic = this._peripheral.getService(this._uuids.service)!.getCharacteristic(this._uuids.txChar);
  }

  public async disconnectWait() {
    await this._peripheral?.disconnectWait();
  }

  public _sendAndReceiveWait(payload: number[], crc: number = 0xb6): Promise<number[]> {
    if (!this._rxCharacteristic || !this._txCharacteristic) {
      throw new Error("device is not connected");
    }
    const data: number[] = new Array(payload.length + 4);
    data[0] = 0xaa;
    data[1] = 0;
    data[2] = payload.length;
    for (let index = 0; index < payload.length; index++) {
      data[3 + index] = payload[index];
    }
    data[payload.length + 3] = crc;
    const tx = this._txCharacteristic;
    const p: Promise<number[]> = new Promise((resolve) => {
      tx.registerNotify((resultData: number[]) => {
        console.error("CRC " + crc);
        resolve(resultData);
      });
    });
    console.log(data);
    this._rxCharacteristic.write(data);
    return p;
  }
}

stick.onconnect = async () => {
  console.log("obniz connected");
  await stick.ble.initWait();
  // stick.debugprint = true;

  let isFirst = true;
  stick.ble.scan.start(null, { duplicate: true, duration: null });
  stick.ble.scan.onfind = async (p: BleRemotePeripheral) => {
    if (RS_BTIREX2.isDevice(p) && isFirst) {
      isFirst = false;
      console.log("find");
      const device = new RS_BTIREX2(p);
      await device.connectWait();
      console.log("connected");
      await wait(100);

      const keys = await device._peripheral!.pairing();
      console.log("keys :", keys);
      await wait(100);
      await device.disconnectWait();
      console.log("disconnected");

      await wait(1000);
      await device.connectWait();
      console.log("connected");
      await wait(100);
      await device._peripheral!.pairing(keys);
      // for (let i = 0; i <= 0xff; i++) {
      // console.log(i);
      const p1 = device._sendAndReceiveWait([0x1f], 0);
      // const p2 = wait(1000);
      // await Promise.race([p1, p2]);
      // }
    }
  };
};

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
