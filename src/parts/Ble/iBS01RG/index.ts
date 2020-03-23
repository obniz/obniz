/**
 * @packageDocumentation
 * @module Parts.iBS01RG
 */

import Obniz from "../../../obniz";
import BleRemotePeripheral from "../../../obniz/libs/embeds/ble/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface IBS01RGOptions {}

export interface IBS01RG_Acceleration_Data {
  x: number;
  y: number;
  z: number;
}

export interface IBS01RG_Data {
  battery: number;
  active: boolean;
  button: boolean;
  address: string;
  acceleration: IBS01RG_Acceleration_Data[];
}

export default class IBS01RG implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "iBS01RG",
    };
  }

  private static signed16FromBinary(val1: number, val2: number): number {
    let val: number = val1 + val2 * 256;
    if ((val & 0x8000) !== 0) {
      val = val - 0x10000;
    }
    return val;
  }

  public onNotification?: (data: IBS01RG_Data) => void;
  public onChangeButton?: (pressed: boolean, address: string) => void;
  public onChangeActive?: (actived: boolean, address: string) => void;

  public keys: string[];
  public requiredKeys: string[];
  public obniz!: Obniz;
  public params: any;

  private oldButtonFlg: boolean;
  private oldActiveFlg: boolean;

  private deviceAdv: number[] = [
    0xff,
    0x59, // Manufacturer vendor code
    0x00, // Manufacturer vendor code
    0x81, // Magic code
    0xbc, // Magic code
    -1, // Battery
    -1, // Battery
    -1, // Event
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
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
    this.oldActiveFlg = false;
    this.oldButtonFlg = false;
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

      const accelArray: IBS01RG_Acceleration_Data[] = [];
      for (let i = 0; i < 3; i++) {
        accelArray.push({
          x: IBS01RG.signed16FromBinary(advertise[0][7 + i * 6], advertise[0][8 + i * 6]),
          y: IBS01RG.signed16FromBinary(advertise[0][9 + i * 6], advertise[0][10 + i * 6]),
          z: IBS01RG.signed16FromBinary(advertise[0][11 + i * 6], advertise[0][12 + i * 6]),
        });
      }
      console.log((advertise[0][6] & 0x0f) * 0xff);
      console.log((advertise[0][6] & 0x30) >> 4);
      const data: IBS01RG_Data = {
        battery: (advertise[0][5] + (advertise[0][6] & 0x0f) * 256) * 0.01,
        active: Boolean((advertise[0][6] & 0x10) >> 4),
        button: Boolean((advertise[0][6] & 0x20) >> 5),
        acceleration: accelArray,
        address: peripheral.address,
      };
      // console.log(`battery ${data.battery}V event ${data.event});
      if (this.onNotification) {
        this.onNotification(data);
      }

      if (this.onChangeButton) {
        const button: boolean = Boolean((advertise[0][6] & 0x20) >> 5);
        if (button !== this.oldButtonFlg) {
          this.onChangeButton(button, peripheral.address);
          this.oldButtonFlg = button;
        }
      }

      if (this.onChangeActive) {
        const actived: boolean = Boolean((advertise[0][6] & 0x10) >> 4);
        if (actived !== this.oldActiveFlg) {
          this.onChangeActive(actived, peripheral.address);
          this.oldActiveFlg = actived;
        }
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
