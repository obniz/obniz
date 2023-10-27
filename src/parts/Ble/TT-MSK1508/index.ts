/**
 * @packageDocumentation
 * @module Parts.TT_MSK1508
 */
/* eslint rulesdir/non-ascii: 0 */

import { crc16 } from 'easy-crc';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';
import { BleAdvBinaryAnalyzer } from '../utils/advertisement/advertismentAnalyzer';

export interface TT_MSK1508Options {}

export interface TT_MSK1508Data {
  patientId: number;
  operatingMode: typeof TT_MSK1508['OperatingMode'][keyof typeof TT_MSK1508['OperatingMode']];
  flowRateStatus: typeof TT_MSK1508['FlowRateStatus'][keyof typeof TT_MSK1508['FlowRateStatus']];
  batteryStatus: typeof TT_MSK1508['FlowRateStatus'][keyof typeof TT_MSK1508['FlowRateStatus']];
  model: typeof TT_MSK1508['Model'][keyof typeof TT_MSK1508['Model']];
  totalDoseVolume: number;
  totalDoseTime: number;
  infusionType: typeof TT_MSK1508['InfusionType'][keyof typeof TT_MSK1508['InfusionType']];
  flow: number;
  sensorId: number;
  errors: typeof TT_MSK1508['Errors'][keyof typeof TT_MSK1508['Errors']][];
  battery: number;
}

/** TT-MSK1508 management class TT-MSK1508を管理するクラス */
export default class TT_MSK1508 implements ObnizPartsBleInterface {
  public static OperatingMode = {
    0: 'initial',
    1: 'checking',
    2: 'dosing',
  };
  public static FlowRateStatus = {
    0: 'standard',
    1: 'low',
    2: 'high',
    3: 'none',
  };
  public static BatteryStatus = {
    0: 'standard',
    1: 'low',
  };
  public static Model = {
    0: 'drip_navigation_sensor',
    1: 'auto_cremme',
  };
  public static InfusionType = {
    0: '20drops/m',
  };
  public static Errors = [
    'drip_detection_error',
    'device_internal_error',
  ] as const;

  public static info(): ObnizPartsBleInfo {
    return {
      name: 'TT_MSK1508',
    };
  }

  /**
   * Verify that the received peripheral is from the TT-MSK1508
   *
   * 受け取ったPeripheralがTT-MSK1508のものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the TT-MSK1508
   *
   * TT-MSK1508かどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return TT_MSK1508._deviceAdvAnalyzer.validate(peripheral.adv_data);
  }

  /**
   * Get a data from the TT-MSK1508
   *
   * TT-MSK1508からデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the TT-MSK1508 TT-MSK1508から受け取ったデータ
   */
  public static getData(
    peripheral: BleRemotePeripheral
  ): TT_MSK1508Data | null {
    if (!TT_MSK1508.isDevice(peripheral)) {
      return null;
    }

    const manufacturerId = TT_MSK1508._deviceAdvAnalyzer.getData(
      peripheral.adv_data,
      'originalData',
      'manufacturerId'
    );
    const sendData = TT_MSK1508._deviceAdvAnalyzer.getData(
      peripheral.adv_data,
      'originalData',
      'sendData'
    );
    const receivedRawCrc = TT_MSK1508._deviceAdvAnalyzer.getData(
      peripheral.adv_data,
      'originalData',
      'crc16'
    );
    if (!manufacturerId || !sendData || !receivedRawCrc) {
      return null;
    }

    let patientId = 0;
    patientId += ((sendData[5] >> 0) & 0b1111) * 1;
    patientId += ((sendData[5] >> 4) & 0b1111) * 10;
    patientId += ((sendData[4] >> 0) & 0b1111) * 100;
    patientId += ((sendData[4] >> 4) & 0b1111) * 1000;
    patientId += ((sendData[3] >> 0) & 0b1111) * 10000;
    patientId += ((sendData[3] >> 4) & 0b1111) * 100000;
    patientId += ((sendData[2] >> 0) & 0b1111) * 1000000;
    patientId += ((sendData[2] >> 4) & 0b1111) * 10000000;
    patientId += ((sendData[1] >> 0) & 0b1111) * 100000000;
    patientId += ((sendData[1] >> 4) & 0b1111) * 1000000000;
    patientId += ((sendData[0] >> 0) & 0b1111) * 10000000000;
    patientId += ((sendData[0] >> 4) & 0b1111) * 100000000000;

    const operatingMode = sendData[6] & 0x03;
    const flowRateStatus = (sendData[6] >>> 2) & 0x03;
    const batteryStatus = (sendData[6] >>> 4) & 0x01;
    const model = (sendData[6] >>> 6) & 0x03;
    const totalDoseVolume = Buffer.from(sendData.slice(7, 9)).readUInt16LE(0);
    const totalDoseTime = Buffer.from(sendData.slice(9, 11)).readUInt16LE(0);
    const infusionType = sendData[11] & 0xc0;
    const flow = ((sendData[11] >> 2) & 0x3f) * 5;
    let sensorId = 0;
    sensorId += ((sendData[13] >> 0) & 0b1111) * 1;
    sensorId += ((sendData[13] >> 4) & 0b1111) * 10;
    sensorId += ((sendData[12] >> 0) & 0b1111) * 100;
    sensorId += ((sendData[12] >> 4) & 0b1111) * 1000;
    sensorId += ((sendData[14] >> 4) & 0b1111) * 10000;

    const errors: typeof TT_MSK1508.Errors[number][] = [];
    const error = sendData[14] & 0x03;
    if (error & 0x1) errors.push('drip_detection_error');
    if ((error >>> 1) & 0x1) errors.push('device_internal_error');

    // extra id
    const extraId = (sendData[14] >> 4) & 0b1111;

    const battery = sendData[15];

    const crcBeforeCalcData = Buffer.from([...manufacturerId, ...sendData]);
    const crc = crc16('X-25', crcBeforeCalcData);
    const receivedCrc = Buffer.from(receivedRawCrc).readUInt16LE(0);

    if (crc !== receivedCrc) return null;

    return {
      patientId,
      operatingMode: this.OperatingMode[operatingMode as 0 | 1 | 2],
      flowRateStatus: this.FlowRateStatus[flowRateStatus as 0 | 1 | 2 | 3],
      batteryStatus: this.BatteryStatus[batteryStatus as 0 | 1],
      model: this.Model[model as 0 | 1],
      totalDoseVolume,
      totalDoseTime,
      infusionType: this.InfusionType[infusionType as 0],
      flow,
      sensorId,
      errors,
      battery,
    };
  }

  private static _deviceAdvAnalyzer = new BleAdvBinaryAnalyzer()
    .groupStart('flag')
    .addTarget('length', [0x02])
    .addTarget('adType', [0x01])
    .addTarget('data', [0x06])
    .groupEnd()

    .groupStart('originalData')
    .addTarget('length', [0x1a])
    .addTarget('adType', [0xff])
    .addTarget('companyId', [0x00, 0x4c])
    .addTarget('beaconType', [0x02, 0x15])
    .addTarget('manufacturerId', [0x76, 0x37])
    .addTargetByLength('sendData', 16)
    .addTargetByLength('crc16', 2)
    .addTarget('txPower', [0x00])
    .groupEnd();

  public _peripheral: BleRemotePeripheral | null = null;
}
