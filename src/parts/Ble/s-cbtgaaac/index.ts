/**
 * @packageDocumentation
 * @module Parts.SCBTGAAAC
 */

import Obniz from "../../../obniz";
import BleRemotePeripheral from "../../../obniz/libs/embeds/ble/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface SCBTGAAACOptions {}

export default class SCBTGAAAC implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "S-CBTGAAAC",
    };
  }

  public onNotification?: (deviceId: string) => void;

  public keys: string[];
  public requiredKeys: string[];
  public obniz!: Obniz;
  public params: any;

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
      const data: any = this.searchTypeVal(peripheral.advertise_data_rows, 0xff);
      if (!data || data[0] !== 0x31 || data[1] !== 0x07 || data[2] !== 0x02 || data[3] !== 0x15 || data.length !== 25) {
        return;
      }
      const uuidData: any = data.slice(4, 20);
      let uuid: any = "";
      for (let i = 0; i < uuidData.length; i++) {
        uuid = uuid + ("00" + uuidData[i].toString(16)).slice(-2);
        if (i === 4 - 1 || i === 4 + 2 - 1 || i === 4 + 2 * 2 - 1 || i === 4 + 2 * 3 - 1) {
          uuid += "-";
        }
      }

      const major: any = (data[20] << 8) + data[21];
      const minor: any = (data[22] << 8) + data[23];
      const power: any = data[24];
      if (uuid === "5d490d6c-7eb9-474e-8160-45bde999119a" && major === 3) {
        if (this.onNotification) {
          this.onNotification(`03-${minor}`);
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
  private searchTypeVal(advertise_data_rows: any, type: number) {
    for (let i = 0; i < advertise_data_rows.length; i++) {
      if (advertise_data_rows[i][0] === type) {
        const results: any = [].concat(advertise_data_rows[i]);
        results.shift();
        return results;
      }
    }
    return undefined;
  }
}
