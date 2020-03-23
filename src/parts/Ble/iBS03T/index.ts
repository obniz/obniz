/**
 * @packageDocumentation
 * @module Parts.iBS03T
 */

import Obniz from "../../../obniz";
import BleRemotePeripheral from "../../../obniz/libs/embeds/ble/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface IBS03TOptions {}

export interface IBS03T_Data {
  event: number;
  battery: number;
  temperature: number;
  address: string;
}

export default class IBS03T implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "iBS03T",
    };
  }

  private static signed16FromBinary(val1: number, val2: number): number {
    let val: number = val1 + val2 * 256;
    if ((val & 0x8000) !== 0) {
      val = val - 0x10000;
    }
    return val;
  }

  public onNotification?: (data: IBS03T_Data) => void;

  public keys: string[];
  public requiredKeys: string[];
  public obniz!: Obniz;
  public params: any;

  private deviceAdv: number[] = [
    0xff,
    0x0d, // Manufacturer vendor code
    0x00, // Manufacturer vendor code
    0x83, // Magic code
    0xbc, // Magic code
    -1, // Battery
    -1, // Battery
    -1, // Event
    -1, // Temprature
    -1, // Temprature
    -1, // probe Temprature
    -1, // probe Temprature
    0x00, // user
    -1, // user
    -1, // subType
    -1, // reserved
    0x00, // reserved
    0x00, // reserved
  ];
  private repeat_flg: boolean = false;

  private ble_setting = {
    duplicate: true,
  };

  constructor() {
    this.keys = [];
    this.requiredKeys = [];
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
      if (advertise.length === 0) {
        return;
      }
      const type = advertise[0][14];
      if (type !== 0x15) {
        // iBS03T以外
        return;
      }
      const data: IBS03T_Data = {
        battery: (advertise[0][5] + advertise[0][6] * 256) * 0.01,
        event: advertise[0][7],
        temperature: IBS03T.signed16FromBinary(advertise[0][8], advertise[0][9]) * 0.01,
        address: peripheral.address,
      };
      // console.log(`battery ${data.battery}V event ${data.event} temperature ${data.temperature} `);
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
}
