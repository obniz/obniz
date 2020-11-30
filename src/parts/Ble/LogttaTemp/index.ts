/**
 * @packageDocumentation
 * @module Parts.Logtta_TH
 */

import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";

export interface Logtta_THOptions {}

export interface Logtta_TH_Data {
  temperature: number;
  humidity: number;
}

export interface Logtta_TH_Adv_Data {
  temperature: number;
  humidity: number;
  battery: number;
  interval: number;
  address: string;
}

export default class Logtta_TH implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: "Logtta_TH",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    return peripheral.localName === "TH Sensor";
  }

  public static isAdvDevice(peripheral: BleRemotePeripheral) {
    if (peripheral.adv_data.length !== 31) {
      return false;
    }
    const data = peripheral.adv_data;
    if (Logtta_TH.getName(data) !== "TH Sensor") {
      return false;
    }
    return true;
  }

  public static getData(peripheral: BleRemotePeripheral): Logtta_TH_Adv_Data | null {
    if (peripheral.adv_data.length !== 31) {
      return null;
    }
    const data: number[] = peripheral.adv_data;
    if (Logtta_TH.getName(data) !== "TH Sensor") {
      return null;
    }
    const alert: number = data[15];
    const interval: number = (data[13] << 8) | data[14];
    const advData: Logtta_TH_Adv_Data = {
      battery: data[12],
      temperature: (((data[8] << 8) | data[9]) / 65536) * 175.72 - 46.85,
      humidity: (((data[10] << 8) | data[11]) / 65536) * 125 - 6,
      interval,
      address: peripheral.address,
    };
    return advData;
  }

  private static getName(data: number[]) {
    let name: string = "";
    for (let i = 16; i < data.length; i++) {
      if (data[i] === 0) {
        break;
      }
      name += String.fromCharCode(data[i]);
    }
    return name;
  }

  private static get_uuid(uuid: string): string {
    return `f7ee${uuid}-276e-4165-aa69-7e3de7fc627e`;
  }

  public onNotify?: (data: Logtta_TH_Data) => void;
  public _peripheral: null | BleRemotePeripheral;
  public ondisconnect?: (reason: any) => void;

  constructor(peripheral: BleRemotePeripheral | null) {
    if (peripheral && !Logtta_TH.isDevice(peripheral)) {
      throw new Error("peripheral is not logtta TH");
    }
    this._peripheral = peripheral;
  }

  public async connectWait() {
    if (!this._peripheral) {
      throw new Error("Logtta TH not found");
    }
    if (!this._peripheral.connected) {
      this._peripheral.ondisconnect = (reason: any) => {
        if (typeof this.ondisconnect === "function") {
          this.ondisconnect(reason);
        }
      };
      await this._peripheral.connectWait();
    }
  }

  public async disconnectWait() {
    if (this._peripheral && this._peripheral.connected) {
      await this._peripheral.disconnectWait();
    }
  }

  public async getAllWait(): Promise<Logtta_TH_Data | null> {
    if (!(this._peripheral && this._peripheral.connected)) {
      return null;
    }

    const c = this._peripheral!.getService(Logtta_TH.get_uuid("AA20"))!.getCharacteristic(Logtta_TH.get_uuid("AA21"));
    const data: number[] = await c!.readWait();
    return {
      temperature: (((data[0] << 8) | data[1]) / 65536) * 175.72 - 46.85,
      humidity: (((data[2] << 8) | data[3]) / 65536) * 125 - 6,
    };
  }

  public async getTemperatureWait(): Promise<number> {
    return (await this.getAllWait())!.temperature;
  }

  public async getHumidityWait(): Promise<number> {
    return (await this.getAllWait())!.humidity;
  }

  public async startNotifyWait() {
    if (!(this._peripheral && this._peripheral.connected)) {
      return;
    }

    const c = this._peripheral!.getService(Logtta_TH.get_uuid("AA20"))!.getCharacteristic(Logtta_TH.get_uuid("AA21"));

    await c!.registerNotifyWait((data: number[]) => {
      if (this.onNotify) {
        this.onNotify({
          temperature: (((data[0] << 8) | data[1]) / 65536) * 175.72 - 46.85,
          humidity: (((data[2] << 8) | data[3]) / 65536) * 125 - 6,
        });
      }
    });
  }

  public async authPinCodeWait(code: string) {
    if (!(this._peripheral && this._peripheral.connected)) {
      return;
    }

    if (code.length !== 4) {
      throw new Error("Invalid length auth code");
    }

    const data: [number] = [0];
    for (let i = 0; i < code.length; i += 2) {
      data.push((this.checkNumber(code.charAt(i)) << 4) | this.checkNumber(code.charAt(i + 1)));
    }
    const c = this._peripheral!.getService(Logtta_TH.get_uuid("AA20"))!.getCharacteristic(Logtta_TH.get_uuid("AA30"));
    await c!.writeWait(data);
  }

  // 有効にしたあと、切断するとビーコンが発信される
  public async setBeaconMode(enable: boolean) {
    if (!(this._peripheral && this._peripheral.connected)) {
      return;
    }

    const c = this._peripheral!.getService(Logtta_TH.get_uuid("AA20"))!.getCharacteristic(Logtta_TH.get_uuid("AA2D"));
    if (enable) {
      await c!.writeWait([1]);
    } else {
      await c!.writeWait([0]);
    }
  }

  private checkNumber(data: string) {
    if (data >= "0" && data <= "9") {
      return parseInt(data, 10);
    } else {
      throw new Error(`authorization code can only be entered from 0-9.input word : ${data}`);
    }
  }
}
