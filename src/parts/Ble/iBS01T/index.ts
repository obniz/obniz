/**
 * @packageDocumentation
 * @module Parts.iBS01T
 */

import Obniz from "../../../obniz";
import BleRemotePeripheral from "../../../obniz/libs/embeds/ble/bleRemotePeripheral";
import bleRemotePeripheral from "../../../obniz/libs/embeds/ble/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface IBS01TOptions {}

export interface IBS01T_Data {
  event: number;
  battery: number;
  temperature: number;
  humidity: number;
  address: string;
}

export default class IBS01T implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "iBS01T",
    };
  }

  public onNotification?: (data: IBS01T_Data) => void;

  public keys: string[];
  public requiredKeys: string[];
  public periperal: bleRemotePeripheral | null;
  public obniz!: Obniz;
  public params: any;

  private deviceAdv: number[] = [
    0xff,
    0x59, // Manufacturer vendor code
    0x00, // Manufacturer vendor code
    0x80, // Magic code
    0xbc, // Magic code
    -1, // Battery
    -1, // Battery
    -1, // Event
    -1, // Temprature
    -1, // Temprature
    -1, // Humidity
    -1, // Humidity
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
  ];
  private repeat_flg: boolean = false;

  private ble_setting = {
    duplicate: true,
  };

  constructor() {
    this.keys = [];
    this.requiredKeys = [];
    this.periperal = null;
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
  }

  public scan(address: string = "") {
    this.obniz.ble!.scan.onfind = (peripheral: BleRemotePeripheral) => {
      const advertise = peripheral.advertise_data_rows.filter((adv: number[]) => {
        let find = false;
        if (this.deviceAdv.length > adv.length) {
          return find;
        }
        for (let index = 0; index < this.deviceAdv.length; index++) {
          if (this.deviceAdv[index] === -1) {
            continue;
          }
          if (adv[index] === this.deviceAdv[index]) {
            find = true;
            continue;
          }
          find = false;
          break;
        }
        return find;
      });
      //    console.log(advertise);
      if (advertise.length === 0) {
        return;
      }

      if (
        advertise[0][8] === 0xff &&
        advertise[0][9] === 0xff &&
        advertise[0][10] === 0xff &&
        advertise[0][11] === 0xff
      ) {
        // error iBS01T
        return;
      }

      const data: IBS01T_Data = {
        battery: (advertise[0][5] + advertise[0][6] * 0xff) * 0.01,
        event: advertise[0][7],
        temperature: this.signed16FromBinary(advertise[0][8], advertise[0][9]) * 0.01,
        humidity: this.signed16FromBinary(advertise[0][10], advertise[0][11]),
        address: peripheral.address,
      };
      // console.log(`battery ${data.battery}V event ${data.event} temperature ${data.temperature} humidity ${data.humidity}`);
      if (this.onNotification) {
        this.onNotification(data);
      }
    };

    this.obniz.ble!.scan.onfinish = () => {
      if (this.repeat_flg) {
        this.obniz.ble!.scan.start(null, this.ble_setting);
      }
    };

    this.obniz.ble!.initWait();
    if (address && address.length >= 12) {
      this.obniz.ble!.scan.start({ deviceAddress: address }, this.ble_setting);
    } else {
      this.obniz.ble!.scan.start(null, this.ble_setting);
    }
    this.repeat_flg = true;
  }

  public end() {
    this.repeat_flg = false;
    this.obniz.ble!.scan.end();
  }

  private signed16FromBinary(val1: number, val2: number): number {
    let val: number = val1 + val2 * 0xff;
    if ((val & 0x8000) !== 0) {
      val = val - 0x10000;
    }
    return val;
  }
}
