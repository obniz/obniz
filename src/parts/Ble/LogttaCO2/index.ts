/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */

import Obniz from "../../../obniz";
import bleRemotePeripheral from "../../../obniz/libs/embeds/ble/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface Logtta_CO2Options {}

export default class Logtta_CO2 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Logtta_CO2",
    };
  }

  private static get_uuid(uuid: string): string {
    return `31f3${uuid}-bd1c-46b1-91e4-f57abcf7d449`;
  }

  public onNotify?: (co2: number) => void;
  public keys: string[];
  public requiredKeys: string[];
  public periperal: bleRemotePeripheral | null;
  public obniz!: Obniz;
  public params: any;

  constructor() {
    this.keys = [];
    this.requiredKeys = [];
    this.periperal = null;
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
  }

  public async findWait(): Promise<any> {
    const target: any = {
      localName: "CO2 Sensor",
    };

    await this.obniz.ble!.initWait();
    this.periperal = await this.obniz.ble!.scan.startOneWait(target);

    return this.periperal;
  }

  public async findListWait(): Promise<bleRemotePeripheral[]> {
    const target: any = {
      localName: "TH Sensor",
    };

    await this.obniz.ble!.initWait();

    return await this.obniz.ble!.scan.startAllWait(target);
  }

  public async directConnectWait(address: string): Promise<boolean> {
    try {
      this.periperal = await this.obniz.ble!.scan.directConnectWait(address, "public");
    } catch (e) {
      return false;
    }
    return true;
  }

  public async connectWait(): Promise<boolean> {
    if (!this.periperal) {
      await this.findWait();
    }
    if (!this.periperal) {
      throw new Error("Logtta CO2 not found");
    }
    if (!this.periperal.connected) {
      try {
        await this.periperal.connectWait();
      } catch (e) {
        return false;
      }
    }
    return true;
  }

  public async disconnectWait() {
    if (this.periperal && this.periperal.connected) {
      await this.periperal.disconnectWait();
    }
  }

  public async getWait(): Promise<number> {
    if (!(await this.connectWait())) {
      return -1;
    }

    const c = this.periperal!.getService(Logtta_CO2.get_uuid("AB20")).getCharacteristic(Logtta_CO2.get_uuid("AB21"));
    const data: number[] = await c.readWait();
    return data[0] * 256 + data[1];
  }

  public async startNotifyWait() {
    if (!(await this.connectWait())) {
      return;
    }

    const c = this.periperal!.getService(Logtta_CO2.get_uuid("AB20")).getCharacteristic(Logtta_CO2.get_uuid("AB21"));

    await c.registerNotifyWait((data: number[]) => {
      if (this.onNotify) {
        this.onNotify(data[0] * 256 + data[1]);
      }
    });
  }
}
