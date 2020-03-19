import Obniz from "../../../obniz";
import BleRemoteCharacteristic from "../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import BleRemoteService from "../../../obniz/libs/embeds/bleHci/bleRemoteService";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface ENERTALKOptions {}

export default class ENERTALK implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "ENERTALK",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    if (peripheral.localName && peripheral.localName.startsWith("ensensor_")) {
      return true;
    }
    return false;
  }

  public keys: string[] = [];
  public requiredKeys: string[] = [];
  public params: any;
  public onbuttonpressed: ((pressed: boolean) => void) | null = null;

  private _uuids = {
    service: "3526797e-448b-4bbb-9145-c5083e0e09dc",
    temperatureChar: "2A6E",
    humidityChar: "2A6F",
    illuminanceChar: "74c3fe9d-25b2-4903-8dcd-680e5ef0a6b3",
    accelerometerChar: "71ef0979-0e2c-4a55-8d3c-78083869fae6",
  };
  private _peripheral: BleRemotePeripheral | null = null;
  private _service: BleRemoteService | null = null;
  private _temperatureChar: BleRemoteCharacteristic | null = null;
  private _humidityChar: BleRemoteCharacteristic | null = null;
  private _illuminanceChar: BleRemoteCharacteristic | null = null;
  private _accelerometerChar: BleRemoteCharacteristic | null = null;

  constructor(peripheral: BleRemotePeripheral | null) {
    if (peripheral && !ENERTALK.isDevice(peripheral)) {
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
    this._service = this._peripheral.getService(this._uuids.service)!;
    this._temperatureChar = this._service.getCharacteristic(this._uuids.temperatureChar);
    this._humidityChar = this._service.getCharacteristic(this._uuids.humidityChar);
    this._illuminanceChar = this._service.getCharacteristic(this._uuids.illuminanceChar);
    this._accelerometerChar = this._service.getCharacteristic(this._uuids.accelerometerChar);
  }

  public async getTemperature() {
    if (!this._temperatureChar) {
      throw new Error("device is not connected");
    }
    const tempData = await this._temperatureChar.readWait();
    const buf = Buffer.from(tempData);
    const temp = buf.readInt16BE(0) / 100;
    return temp;
  }

  public async getHumidity() {
    if (!this._humidityChar) {
      throw new Error("device is not connected");
    }

    const humidityData = await this._humidityChar.readWait();
    const humidity = humidityData[0];
    return humidity;
  }

  public async getIlluminance() {
    if (!this._illuminanceChar) {
      throw new Error("device is not connected");
    }
    const illuminanceData = await this._illuminanceChar.readWait();
    const buf = Buffer.from(illuminanceData);
    const illuminance = buf.readInt16BE(0);

    return illuminance;
  }

  public async getAccelerometer() {
    if (!this._accelerometerChar) {
      throw new Error("device is not connected");
    }

    const accelerometerData = await this._accelerometerChar.readWait();
    const buf = Buffer.from(accelerometerData);
    const x = buf.readInt16BE(0) / 1000;
    const y = buf.readInt16BE(2) / 1000;
    const z = buf.readInt16BE(4) / 1000;

    return { x, y, z };
  }
}
