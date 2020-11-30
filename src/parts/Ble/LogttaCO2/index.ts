/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */

import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";
import BleBatteryService from "../abstract/services/batteryService";
import BleGenericAccess from "../abstract/services/genericAccess";
export interface Logtta_CO2Options {}

export interface Logtta_CO2_Adv_Data {
  co2: number;
  battery: number;
  interval: number;
  address: string;
}

export default class Logtta_CO2 implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: "Logtta_CO2",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    return peripheral.localName === "CO2 Sensor";
  }

  public static isAdvDevice(peripheral: BleRemotePeripheral) {
    if (peripheral.adv_data.length !== 31) {
      return false;
    }
    const data = peripheral.adv_data;
    if (Logtta_CO2.getName(data) !== "CO2 Sensor") {
      return false;
    }
    return true;
  }

  public static getData(peripheral: BleRemotePeripheral): Logtta_CO2_Adv_Data | null {
    if (peripheral.adv_data.length !== 31) {
      return null;
    }
    const data: number[] = peripheral.adv_data;
    if (Logtta_CO2.getName(data) !== "CO2 Sensor") {
      return null;
    }
    const alert: number = data[15];
    const interval: number = (data[13] << 8) | data[14];
    const advData: Logtta_CO2_Adv_Data = {
      battery: data[12],
      co2: (data[8] << 8) | data[9],
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
    return `31f3${uuid}-bd1c-46b1-91e4-f57abcf7d449`;
  }

  public onNotify?: (co2: number) => void;
  public _peripheral: BleRemotePeripheral | null;
  public ondisconnect?: (reason: any) => void;
  public genericAccess?: BleGenericAccess;
  public batteryService?: BleBatteryService;

  constructor(peripheral: BleRemotePeripheral | null) {
    if (!peripheral || !Logtta_CO2.isDevice(peripheral)) {
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

      const service1800 = this._peripheral.getService("1800");
      if (service1800) {
        this.genericAccess = new BleGenericAccess(service1800);
      }
      const service180F = this._peripheral.getService("180F");
      if (service180F) {
        this.batteryService = new BleBatteryService(service180F);
      }
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
    const c = this._peripheral!.getService(Logtta_CO2.get_uuid("AB20"))!.getCharacteristic(Logtta_CO2.get_uuid("AB30"));
    await c!.writeWait(data);
  }

  // 有効にしたあと、切断するとビーコンが発信される
  public async setBeaconMode(enable: boolean) {
    if (!(this._peripheral && this._peripheral.connected)) {
      return;
    }

    const c = this._peripheral!.getService(Logtta_CO2.get_uuid("AB20"))!.getCharacteristic(Logtta_CO2.get_uuid("AB2D"));
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
