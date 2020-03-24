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
export default class Logtta_TH implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: "Logtta_TH",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    return peripheral.localName === "TH Sensor";
  }

  private static get_uuid(uuid: string): string {
    return `f7ee${uuid}-276e-4165-aa69-7e3de7fc627e`;
  }

  public onNotify?: (data: Logtta_TH_Data) => void;
  public _peripheral: null | BleRemotePeripheral;

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
}
