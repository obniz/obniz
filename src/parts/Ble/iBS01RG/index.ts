//
//   const accelArray: IBS01RG_Acceleration_Data[] = [];
//   for (let i = 0; i < 3; i++) {
//     accelArray.push({
//       x: IBS01RG.signed16FromBinary(advertise[0][7 + i * 6], advertise[0][8 + i * 6]),
//       y: IBS01RG.signed16FromBinary(advertise[0][9 + i * 6], advertise[0][10 + i * 6]),
//       z: IBS01RG.signed16FromBinary(advertise[0][11 + i * 6], advertise[0][12 + i * 6]),
//     });
//   }
//   console.log((advertise[0][6] & 0x0f) * 0xff);
//   console.log((advertise[0][6] & 0x30) >> 4);
//   const data: IBS01RG_Data = {
//     battery: (advertise[0][5] + (advertise[0][6] & 0x0f) * 256) * 0.01,
//     active: Boolean((advertise[0][6] & 0x10) >> 4),
//     button: Boolean((advertise[0][6] & 0x20) >> 5),
//     acceleration: accelArray,
//     address: peripheral.address,
//   };
//   // console.log(`battery ${data.battery}V event ${data.event});
//   if (this.onNotification) {
//     this.onNotification(data);
//   }
//
//   if (this.onChangeButton) {
//     const button: boolean = Boolean((advertise[0][6] & 0x20) >> 5);
//     if (button !== this.oldButtonFlg) {
//       this.onChangeButton(button, peripheral.address);
//       this.oldButtonFlg = button;
//     }
//   }
//
//   if (this.onChangeActive) {
//     const actived: boolean = Boolean((advertise[0][6] & 0x10) >> 4);
//     if (actived !== this.oldActiveFlg) {
//       this.onChangeActive(actived, peripheral.address);
//       this.oldActiveFlg = actived;
//     }
//   }
// };

/**
 * @packageDocumentation
 * @module Parts.iBS01RG
 */
/* eslint rulesdir/non-ascii: 0 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface IBS01RGOptions {}

/**
 * acceleration data from IBS01RG
 *
 * IBS01RGからの加速度データ
 */
export interface IBS01RG_Acceleration_Data {
  /** acceleration (X-axis) 加速度(X軸) */
  x: number;
  /** acceleration (Y-axis) 加速度(Y軸) */
  y: number;
  /** acceleration (Z-axis) 加速度(Z軸) */
  z: number;
}

/**
 * advertisement data from IBS01RG
 *
 * IBS01RGからのadvertisementデータ
 */
export interface IBS01RG_Data {
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /** active or inactive アクティブか非アクティブか */
  active: boolean;
  /**
   * button state ボタンの状態
   *
   * true: pressed 押された状態 / false: not pressed 押されていない状態
   */
  button: boolean;
  /** acceleration (X, Y, Z axis) 加速度 (X, Y, Z軸)*/
  acceleration: IBS01RG_Acceleration_Data[];
}

/** iBS01RG management class iBS01RGを管理するクラス */
export default class IBS01RG implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'iBS01RG',
    };
  }

  /**
   * Verify that the received peripheral is from the iBS01RG
   *
   * 受け取ったPeripheralがiBS01RGのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the iBS01RG
   *
   * iBS01RGかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    if (this.deviceAdv.length > peripheral.adv_data.length) {
      return false;
    }
    for (let index = 0; index < this.deviceAdv.length; index++) {
      if (this.deviceAdv[index] === -1) {
        continue;
      }
      if (peripheral.adv_data[index] === this.deviceAdv[index]) {
        continue;
      }
      return false;
    }
    return true;
  }

  /**
   * Get a data from the iBS01RG
   *
   * iBS01RGからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the iBS01RG iBS01RGから受け取ったデータ
   */
  public static getData(peripheral: BleRemotePeripheral): IBS01RG_Data | null {
    if (!IBS01RG.isDevice(peripheral)) {
      return null;
    }
    const accelArray: IBS01RG_Acceleration_Data[] = [];
    for (let i = 0; i < 3; i++) {
      accelArray.push({
        x: ObnizPartsBleInterface.signed16FromBinary(
          peripheral.adv_data[12 + i * 6],
          peripheral.adv_data[11 + i * 6]
        ),
        y: ObnizPartsBleInterface.signed16FromBinary(
          peripheral.adv_data[14 + i * 6],
          peripheral.adv_data[13 + i * 6]
        ),
        z: ObnizPartsBleInterface.signed16FromBinary(
          peripheral.adv_data[16 + i * 6],
          peripheral.adv_data[15 + i * 6]
        ),
      });
    }
    const data: IBS01RG_Data = {
      battery:
        (peripheral.adv_data[9] + (peripheral.adv_data[10] & 0x0f) * 256) *
        0.01,
      active: Boolean((peripheral.adv_data[10] & 0x10) >> 4),
      button: Boolean((peripheral.adv_data[10] & 0x20) >> 5),
      acceleration: accelArray,
    };
    return data;
  }

  private static deviceAdv: number[] = [
    0x02,
    0x01,
    0x06,
    0x19,
    0xff,
    0x59, // Manufacturer vendor code
    0x00, // Manufacturer vendor code
    0x81, // Magic code
    0xbc, // Magic code
    -1, // Battery
    -1, // Battery
    -1, // x
    -1, // x
    -1, // y
    -1, // y
    -1, // z
    -1, // z
  ];

  public _peripheral: BleRemotePeripheral | null = null;
}
