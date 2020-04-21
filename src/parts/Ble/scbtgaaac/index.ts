/**
 * @packageDocumentation
 * @module Parts.SCBTGAAAC
 */

import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";

export interface SCBTGAAACOptions {}

export default class SCBTGAAAC implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: "SCBTGAAAC",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return SCBTGAAAC.getData(peripheral) !== null;
  }

  public static getData(peripheral: BleRemotePeripheral): string | null {
    const data: any = SCBTGAAAC.searchTypeVal(peripheral.advertise_data_rows, 0xff);
    if (!data || data[0] !== 0x31 || data[1] !== 0x07 || data[2] !== 0x02 || data[3] !== 0x15 || data.length !== 25) {
      return null;
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
      return `03-${minor}`;
    }
    return null;
  }

  private static searchTypeVal(advertise_data_rows: any, type: number) {
    for (let i = 0; i < advertise_data_rows.length; i++) {
      if (advertise_data_rows[i][0] === type) {
        const results: any = [].concat(advertise_data_rows[i]);
        results.shift();
        return results;
      }
    }
    return undefined;
  }

  public _peripheral: null | BleRemotePeripheral = null;

  constructor() {}
}
