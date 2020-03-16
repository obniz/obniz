/**
 * @packageDocumentation
 * @module Parts.Logtta_TH
 */

import Obniz from "../../../obniz";
import bleRemotePeripheral from "../../../obniz/libs/embeds/ble/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface Logtta_THOptions {}

export interface Logtta_TH_Data {
  temperature: number;
  humidity: number;
}
export default class Logtta_TH implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Logtta_TH",
    };
  }

  private static get_uuid(uuid: string): string {
    return `f7ee${uuid}-276e-4165-aa69-7e3de7fc627e`;
  }

  public onNotify?: (data: Logtta_TH_Data) => void;
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
      localName: "TH Sensor",
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
      throw new Error("Logtta TH not found");
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

  public async getAllWait(): Promise<Logtta_TH_Data> {
    if (!(await this.connectWait())) {
      return { temperature: -1, humidity: -1 };
    }

    const c = this.periperal!.getService(Logtta_TH.get_uuid("AA20")).getCharacteristic(Logtta_TH.get_uuid("AA21"));
    const data: number[] = await c.readWait();
    return {
      temperature: (((data[0] << 8) | data[1]) / 65536) * 175.72 - 46.85,
      humidity: (((data[2] << 8) | data[3]) / 65536) * 125 - 6,
    };
  }

  public async getTemperatureWait(): Promise<number> {
    return (await this.getAllWait()).temperature;
  }

  public async getHumidityWait(): Promise<number> {
    return (await this.getAllWait()).humidity;
  }

  public async startNotifyWait() {
    if (!(await this.connectWait())) {
      return;
    }

    const c = this.periperal!.getService(Logtta_TH.get_uuid("AA20")).getCharacteristic(Logtta_TH.get_uuid("AA21"));

    await c.registerNotifyWait((data: number[]) => {
      if (this.onNotify) {
        console.log("data arrive", data);
        this.onNotify({
          temperature: (((data[0] << 8) | data[1]) / 65536) * 175.72 - 46.85,
          humidity: (((data[2] << 8) | data[3]) / 65536) * 125 - 6,
        });
      }
    });
  }
}
