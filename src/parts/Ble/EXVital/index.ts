/**
 * @packageDocumentation
 * @module Parts.EXVital
 */
/* eslint rulesdir/non-ascii: 0 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';

export interface EXVital_Options {}

export interface EXVital_Data {
  major: number;
  minor: number;
  power: number;
  diastolic_pressure: number;
  systolic_pressure: number;
  arm_temp: number;
  body_temp: number;
  heart_rate: number;
  // blood_oxygen: number;
  // fall: boolean;
  battery: number;
  steps: number;
}

/** EXVital management class EXVitalを管理するクラス */
export default class EXVital extends ObnizPartsBleInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: 'EXVital',
    };
  }

  public static readonly partsName = 'EXVital';

  public static readonly availableBleMode = 'Beacon';

  protected advData = this._peripheral?.adv_data;

  protected static DefaultAdvData = [
    0x02,
    0x01,
    -1,
    0x18,
    0xff,
    0xf5, // Manufacturer vendor code
    0x03, // Manufacturer vendor code
    0x04, // Format: sensor
    0x02, // Header: Tonly Sensor
    0x00, // Version
    -1, // Major number
    -1, // Major number
    -1, // Minor number
    -1, // Minor number
    -1, // Measured power
    -1, // Diastolic pressure
    -1, // Systolic pressure
    -1, // Arm temp
    -1, // Arm temp
    -1, // Body temp
    -1, // Body temp
    -1, // Heart rate
    -1, // Blood oxygen (unimplemented)
    -1, // Fall (unimplemented)
    -1, // Battery
    -1, // Battery
    -1, // Steps
    -1, // Steps
  ];

  /**
   * (with instantiation) Get a data from the beacon
   *
   * (インスタンス化する場合) ビーコンからデータを取得
   *
   * @returns received data from the beacon ビーコンから受け取ったデータ
   *
   * `contents 中身`
   * - major: iBeacon major
   * - minor: iBeacon minor
   * - power: iBeacon power
   * - diastolic_pressure: diastolic pressure 最低血圧
   * - systolic_pressure: systolic pressure 最高血圧
   * - arm_temp: arm temp 腕温度
   * - body_temp: body temp 体温
   * - heart_rate: heart rate 心拍数
   * - battery: battery voltage バッテリー電圧
   * - steps: number of steps 歩数
   */
  public getData(): EXVital_Data {
    if (!this.advData) throw new Error('advData is null');
    return {
      major: unsigned16(this.advData.slice(11, 13)),
      minor: unsigned16(this.advData.slice(13, 15)),
      power: this.advData[14],
      diastolic_pressure: this.advData[15],
      systolic_pressure: this.advData[16],
      arm_temp: unsigned16(this.advData.slice(17, 19)) * 0.1,
      body_temp: unsigned16(this.advData.slice(19, 21)) * 0.1,
      heart_rate: this.advData[21],
      // blood_oxygen: this.advData[22],
      // fall: this.advData[23] > 0,
      battery: unsigned16(this.advData.slice(24, 26)) * 0.001,
      steps: unsigned16(this.advData.slice(26, 28)),
    };
  }

  /**
   * (without instantiation) Get a data from the beacon
   *
   * (インスタンス化しない場合) ビーコンからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the beacon ビーコンから受け取ったデータ
   *
   * `contents 中身`
   * - major: iBeacon major
   * - minor: iBeacon minor
   * - power: iBeacon power
   * - diastolic_pressure: diastolic pressure 最低血圧
   * - systolic_pressure: systolic pressure 最高血圧
   * - arm_temp: arm temp 腕温度
   * - body_temp: body temp 体温
   * - heart_rate: heart rate 心拍数
   * - battery: battery voltage バッテリー電圧
   * - steps: number of steps 歩数
   */
  public static getData(peripheral: BleRemotePeripheral): EXVital_Data | null {
    if (!EXVital.isDevice(peripheral)) {
      return null;
    }
    const dev = new EXVital(peripheral);
    return dev.getData();
  }

  constructor(peripheral: BleRemotePeripheral) {
    super();
    this._peripheral = peripheral;
  }

  /**
   * verify that the received peripheral is from the EXVital
   *
   * 受け取ったperipheralがEXVitalのものかどうか確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the EXVital
   *
   * EXVitalかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return (
      this.DefaultAdvData.filter(
        (d, i) => d !== -1 && d !== peripheral.adv_data[i]
      ).length === 0 &&
      this.DefaultAdvData.length === peripheral.adv_data.length
    );
  }
}

const unsigned16 = (value: number[]): number => {
  return (value[0] << 8) | value[1];
};
