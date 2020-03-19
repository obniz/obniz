import Obniz from "../../../obniz";
import BleRemoteCharacteristic from "../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface REX_BTPM25VOptions {}

export default class REX_BTPM25V implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "REX_BTPM25V",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    if (peripheral.localName !== "PM25V") {
      return false;
    }
    return true;
  }

  public keys: string[] = [];
  public requiredKeys: string[] = [];
  public params: any;
  public onbuttonpressed: ((pressed: boolean) => void) | null = null;

  private _uuids = {
    service: "00001523-1212-EFDE-1523-785FEABCD123",
    buttonChar: "000000A1-1212-EFDE-1523-785FEABCD123",
    continuousMeasurementChar: "000000A5-1212-EFDE-1523-785FEABCD123",
    oneShotMeasurementChar: "000000A8-1212-EFDE-1523-785FEABCD123",
    ledChar: "000000A9-1212-EFDE-1523-785FEABCD123",
  };
  private _peripheral: BleRemotePeripheral | null = null;
  private _oneShotMeasurementCharacteristic: BleRemoteCharacteristic | null = null;
  private _continuousMeasurementCharacteristic: BleRemoteCharacteristic | null = null;
  private _ledCharacteristic: BleRemoteCharacteristic | null = null;
  private _buttonCharacteristic: BleRemoteCharacteristic | null = null;

  constructor(peripheral: BleRemotePeripheral | null) {
    if (peripheral && !REX_BTPM25V.isDevice(peripheral)) {
      throw new Error("peripheral is not RS_Seek3");
    }
    this._peripheral = peripheral;
  }

  // @ts-ignore
  public wired(obniz: Obniz): void {}

  public async connectWait() {
    if (!this._peripheral) {
      throw new Error("RS_Seek3 is not find.");
    }
    await this._peripheral.connectWait();
    this._oneShotMeasurementCharacteristic = this._peripheral
      .getService(this._uuids.service)!
      .getCharacteristic(this._uuids.oneShotMeasurementChar);
    this._continuousMeasurementCharacteristic = this._peripheral
      .getService(this._uuids.service)!
      .getCharacteristic(this._uuids.continuousMeasurementChar);
    this._ledCharacteristic = this._peripheral.getService(this._uuids.service)!.getCharacteristic(this._uuids.ledChar);
    this._buttonCharacteristic = this._peripheral
      .getService(this._uuids.service)!
      .getCharacteristic(this._uuids.buttonChar);

    if (this._buttonCharacteristic) {
      this._buttonCharacteristic.registerNotify((data: number[]) => {
        if (typeof this.onbuttonpressed === "function") {
          this.onbuttonpressed(data[0] === 1);
        }
      });
    }
  }

  public async measureOneShotWait() {
    if (!this._oneShotMeasurementCharacteristic) {
      throw new Error("device is not connected");
    }
    const sendData = new Array(20);
    sendData[0] = 0x01;
    const data = await this._sendAndReceiveWait(this._oneShotMeasurementCharacteristic, sendData);
    return this._analyzeResult(data);
  }

  public async getLedMode() {
    if (!this._ledCharacteristic) {
      throw new Error("device is not connected");
    }
    const data = this._sendAndReceiveWait(this._ledCharacteristic, [0xff, 0x00]);
  }

  private _sendAndReceiveWait(char: BleRemoteCharacteristic, data: number[]): Promise<number[]> {
    return new Promise((resolve) => {
      char.registerNotify(resolve);
      char.write(data);
    });
  }

  private _analyzeResult(data: number[]) {
    const buf = Buffer.from(data);
    const [minutes, hour, day, month, year] = buf.slice(0, 5);
    const pm2_5 = buf.readInt16LE(5);
    const pm10 = buf.readInt16LE(7);
    const pressure = buf.readInt16LE(9);
    const temperature = buf.readInt8(11);
    const humidity = buf.readInt8(12);
    const lux = buf.readUInt16LE(13);
    const dummy = buf.slice(15, 19);
    const mode = buf.readInt8(19);

    return {
      minutes,
      hour,
      day,
      month,
      year,
      pm2_5,
      pm10,
      pressure,
      temperature,
      humidity,
      lux,
      mode,
    };
  }
}
