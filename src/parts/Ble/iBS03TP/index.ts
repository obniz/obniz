/**
 * @packageDocumentation
 * @module Parts.iBS03TP
 */

import Obniz from "../../../obniz";
import BleRemotePeripheral from "../../../obniz/libs/embeds/ble/bleRemotePeripheral";
import bleRemotePeripheral from "../../../obniz/libs/embeds/ble/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import { IBS04I_Data } from "../iBS04i";

export interface IBS03TPOptions {}

export interface IBS03TP_Data {
  event: number;
  battery: number;
  temp: number;
  probe_temp: number;
}

export default class IBS03TP implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "iBS03TP",
    };
  }

  public onNotification?: (data: IBS03TP_Data) => void;

  public keys: string[];
  public requiredKeys: string[];
  public periperal: bleRemotePeripheral | null;
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
    this.periperal = null;
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
  }

  public scan() {
    this.obniz.ble!.scan.onfind = (peripheral: BleRemotePeripheral) => {
      if (peripheral.address === "806fb0c8a2cb") {
        console.log(peripheral);
      }
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
      const type = advertise[0][14];
      if (type !== 23) {
        // iBS03TP以外
        return;
      }
      const data: IBS03TP_Data = {
        battery: (advertise[0][5] + advertise[0][6] * 0xff) * 0.01,
        event: advertise[0][7],
        temp: this.signedNumberFromBinary(advertise[0][8], advertise[0][9]) * 0.01,
        probe_temp: this.signedNumberFromBinary(advertise[0][10], advertise[0][11]) * 0.01,
      };

      // console.log(
      //   `battery ${data.battery}V event ${data.event} uuid ${data.uuid} major ${data.major} minor ${data.minor} rssi ${data.rssi}`,
      // );
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
    this.obniz.ble!.scan.start(null, this.ble_setting);
    this.repeat_flg = true;
  }

  public end() {
    this.repeat_flg = false;
    this.obniz.ble!.scan.end();
  }

  private signedNumberFromBinary(val1: number, val2: number): number {
    let val: number = (val2 & 0x7f) * 256 + val1;
    if ((val2 & 0x80) !== 0) {
      val = val - Math.pow(2, 15);
    }
    return val;
  }
}
