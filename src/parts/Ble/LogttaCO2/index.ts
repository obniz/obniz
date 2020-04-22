/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */

import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";

export interface Logtta_CO2Options {}

export default class Logtta_CO2 implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: "Logtta_CO2",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    return peripheral.localName === "CO2 Sensor";
  }

  private static get_uuid(uuid: string): string {
    return `31f3${uuid}-bd1c-46b1-91e4-f57abcf7d449`;
  }

  public onNotify?: (co2: number) => void;
  public _peripheral: BleRemotePeripheral | null;
  public ondisconnect?: (reason: any) => void;

  constructor(peripheral: BleRemotePeripheral | null) {
    if (peripheral && !Logtta_CO2.isDevice(peripheral)) {
      throw new Error("peripheral is not Logtta CO2");
    }
    this._peripheral = peripheral;
  }

  public async connectWait() {
    if (!this._peripheral) {
      throw new Error("Logtta CO2 not found");
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

  public async getWait(): Promise<number | null> {
    if (!(this._peripheral && this._peripheral.connected)) {
      return null;
    }

    const c = this._peripheral!.getService(Logtta_CO2.get_uuid("AB20"))!.getCharacteristic(Logtta_CO2.get_uuid("AB21"));
    const data: number[] = await c!.readWait();
    return data[0] * 256 + data[1];
  }

  public async startNotifyWait() {
    if (!(this._peripheral && this._peripheral.connected)) {
      return;
    }

    const c = this._peripheral!.getService(Logtta_CO2.get_uuid("AB20"))!.getCharacteristic(Logtta_CO2.get_uuid("AB21"));

    await c!.registerNotifyWait((data: number[]) => {
      if (this.onNotify) {
        this.onNotify(data[0] * 256 + data[1]);
      }
    });
  }
}
