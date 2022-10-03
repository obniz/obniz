/**
 * @packageDocumentation
 * @module Parts.SCBTGABBI
 */
/* eslint rulesdir/non-ascii: 0 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface SCBTGABBIOptions {}

/** SCBTGABBI management class SCBTGABBI */
export default class SCBTGABBI implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'SCBTGABBI',
    };
  }

  /**
   * Verify that the received peripheral is from the SCBTGABBI
   *
   * 受け取ったPeripheralがSCBTGABBIのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the SCBTGABBI
   *
   * SCBTGABBIかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return SCBTGABBI.getData(peripheral) !== null;
  }

  /**
   * Get leakage data from the SCBTGABBI
   *
   * Get advertisement sent out by generating power at the leak
   *
   * SCBTGABBIから漏水データを取得する
   *
   * 漏水で発電することによって発信されたadvertisementを取得します
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns device name デバイス名
   */
  public static getData(peripheral: BleRemotePeripheral): string | null {
    if (!peripheral.advertise_data_rows) {
      return null;
    }
    const data = SCBTGABBI.searchTypeVal(peripheral.advertise_data_rows, 0xff);
    if (
      !data ||
      data[0] !== 0x31 ||
      data[1] !== 0x07 ||
      data[2] !== 0x02 ||
      data[3] !== 0x15 ||
      data.length !== 25
    ) {
      return null;
    }
    const uuidData = data.slice(4, 20);
    let uuid = '';
    for (let i = 0; i < uuidData.length; i++) {
      uuid = uuid + ('00' + uuidData[i].toString(16)).slice(-2);
      if (
        i === 4 - 1 ||
        i === 4 + 2 - 1 ||
        i === 4 + 2 * 2 - 1 ||
        i === 4 + 2 * 3 - 1
      ) {
        uuid += '-';
      }
    }

    const major = (data[20] << 8) + data[21];
    const minor = (data[22] << 8) + data[23];
    const power = data[24];
    if (uuid === '5d490d6c-7eb9-474e-8160-45bde999119a' && major === 4) {
      return `04-${('00000' + minor).slice(-5)}`;
    }
    return null;
  }

  private static searchTypeVal(advertise_data_rows: number[][], type: number) {
    for (let i = 0; i < advertise_data_rows.length; i++) {
      if (advertise_data_rows[i][0] === type) {
        const results = [...advertise_data_rows[i]];
        results.shift();
        return results;
      }
    }
    return undefined;
  }

  public _peripheral: null | BleRemotePeripheral = null;
}
