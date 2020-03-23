/**
 * @packageDocumentation
 * @module Parts.Logtta_AD
 */

import Obniz from "../../../obniz";
import bleRemotePeripheral from "../../../obniz/libs/embeds/ble/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface Logtta_ADOptions {}

export interface Logtta_AD_Data {
  ampere: number;
  volt: number;
  count: number;
}
export default class Logtta_AD implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Logtta_AD",
    };
  }

  private static get_uuid(uuid: string): string {
    return `4e43${uuid}-6687-4f3c-a1c3-1c327583f29d`;
  }

  public onNotify?: (data: Logtta_AD_Data) => void;
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
      localName: "Analog",
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
      throw new Error("Logtta AD not found");
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

  public async getAllWait(): Promise<Logtta_AD_Data> {
    if (!(await this.connectWait())) {
      return { ampere: -1, volt: -1, count: -1 };
    }

    const c = this.periperal!.getService(Logtta_AD.get_uuid("AE20")).getCharacteristic(Logtta_AD.get_uuid("AE21"));
    const data: number[] = await c.readWait();
    return {
      ampere: (((data[0] << 8) | data[1]) * 916) / 16,
      volt: (((data[0] << 8) | data[1]) * 916) / 4,
      count: (data[2] << 8) | data[3],
    };
  }

  public async getAmpereWait(): Promise<number> {
    return (await this.getAllWait()).ampere;
  }

  public async getVoltWait(): Promise<number> {
    return (await this.getAllWait()).volt;
  }

  public async getCountWait(): Promise<number> {
    return (await this.getAllWait()).count;
  }

  public async startNotifyWait() {
    if (!(await this.connectWait())) {
      return;
    }

    const c = this.periperal!.getService(Logtta_AD.get_uuid("AE20")).getCharacteristic(Logtta_AD.get_uuid("AE21"));

    await c.registerNotifyWait((data: number[]) => {
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
