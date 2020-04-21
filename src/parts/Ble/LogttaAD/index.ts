/**
 * @packageDocumentation
 * @module Parts.Logtta_AD
 */

import Obniz from "../../../obniz";
import bleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";

export interface Logtta_ADOptions {}

export interface Logtta_AD_Data {
  ampere: number;
  volt: number;
  count: number;
}
export default class Logtta_AD implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: "Logtta_AD",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    return peripheral.localName === "Analog";
  }

  private static get_uuid(uuid: string): string {
    return `4e43${uuid}-6687-4f3c-a1c3-1c327583f29d`;
  }

  public onNotify?: (data: Logtta_AD_Data) => void;
  public _peripheral: null | BleRemotePeripheral;
  public ondisconnect?: (reason: any) => void;

  constructor(peripheral: BleRemotePeripheral | null) {
    if (peripheral && !Logtta_AD.isDevice(peripheral)) {
      throw new Error("peripheral is not logtta AD");
    }
    this._peripheral = peripheral;
  }

  public async connectWait() {
    if (!this._peripheral) {
      throw new Error("Logtta AD not found");
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

  public async getAllWait(): Promise<Logtta_AD_Data | null> {
    if (!(this._peripheral && this._peripheral.connected)) {
      return null;
    }

    const c = this._peripheral!.getService(Logtta_AD.get_uuid("AE20"))!.getCharacteristic(Logtta_AD.get_uuid("AE21"));
    const data: number[] = await c!.readWait();
    return {
      ampere: (((data[0] << 8) | data[1]) * 916) / 16,
      volt: (((data[0] << 8) | data[1]) * 916) / 4,
      count: (data[2] << 8) | data[3],
    };
  }

  public async getAmpereWait(): Promise<number> {
    return (await this.getAllWait())!.ampere;
  }

  public async getVoltWait(): Promise<number> {
    return (await this.getAllWait())!.volt;
  }

  public async getCountWait(): Promise<number> {
    return (await this.getAllWait())!.count;
  }

  public async startNotifyWait() {
    if (!(this._peripheral && this._peripheral.connected)) {
      return;
    }

    const c = this._peripheral!.getService(Logtta_AD.get_uuid("AE20"))!.getCharacteristic(Logtta_AD.get_uuid("AE21"));

    await c!.registerNotifyWait((data: number[]) => {
      if (this.onNotify) {
        this.onNotify({
          ampere: (16 / 916) * ((data[0] << 8) | data[1]),
          volt: (4 / 916) * ((data[0] << 8) | data[1]),
          count: (data[2] << 8) | data[3],
        });
      }
    });
  }
}
