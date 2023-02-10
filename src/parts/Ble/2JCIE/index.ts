/**
 * @packageDocumentation
 * @module Parts.OMRON_2JCIE
 */
/* eslint rulesdir/non-ascii: 0 */

import Obniz from '../../../obniz';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface } from '../../../obniz/ObnizPartsBleInterface';
import {
  ObnizPartsInterface,
  ObnizPartsInfo,
} from '../../../obniz/ObnizPartsInterface';

import roundTo from 'round-to';

export interface OMRON_2JCIEOptions {}

/**
 * the latest data from the 2JCIE-BL01(BAG type)
 *
 * 2JCIE-BL01(バッグ形状)の最新のデータ
 */
export interface OMRON_2JCIE_Data {
  /**
   * Row number 行番号
   * - With Data Recording データ保存有: Range 範囲 0~12
   *
   * - Without Data Recording データ保存なし: Range 範囲 0~255
   */
  row_number: number;
  /**
   * Temperature 気温
   *
   * (Unit 単位: 0.01 degC)
   */
  temperature: number;
  /**
   * Relative Humidity 相対湿度
   *
   * (Unit 単位: 0.01 %RH)
   */
  relative_humidity: number;
  /**
   * Light 照度
   *
   * (Unit 単位: 1 lx)
   */
  light: number;
  /**
   * UV Index
   *
   * (Unit 単位: 0.01)
   */
  uv_index: number;
  /**
   * Barometric Pressure 気圧
   *
   * (Unit 単位: 0.1 hPa)
   */
  barometric_pressure: number;
  /**
   * Sound noise 騒音
   *
   * (Unit 単位: 0.01 dB)
   */
  sound_noise: number;
  /**
   * Discomfort Index 不快指数
   *
   * (Unit 単位: 0.01)
   */
  discomfort_index: number;
  /**
   * Heatstroke risk factor 熱中症危険度
   *
   * (Unit 単位: 0.01 degC)
   */
  heatstroke_risk_factor: number;
  /**
   * Battery voltage 電池電圧
   *
   * (Unit 単位: 1 V)
   */
  battery_voltage: number;
}

/**
 * the latest data from the 2JCIE-BU01(USB connection)
 *
 * 2JCIE-BU01(USB接続)のセンサの最新のデータ
 */
export interface OMRON_2JCIE_USBSenData {
  /**
   * Sequence number 行番号
   *
   * Range 範囲: 0~255
   */
  sequence_number: number;
  /**
   * Temperature 気温
   *
   * Range 範囲: -40~120 (Unit 単位: 0.01 degC)
   */
  temperature: number;
  /**
   * Relative humidity 相対湿度
   *
   * Range 範囲: 0~100 (Unit 単位: 0.01 %RH)
   */
  relative_humidity: number;
  /**
   * Ambient light 照度
   *
   * Range 範囲: 0~30000 (Unit 単位: 1 lx)
   */
  light: number;
  /**
   * Barometric pressure
   *
   * Range 範囲: 300~1100 (Unit 単位: 0.001 hPa)
   */
  barometric_pressure: number;
  /**
   * Sound noise 騒音
   *
   * Range 範囲: 33~120 (Unit 単位: 0.01 dB)
   */
  sound_noise: number;
  /**
   * eTVOC (equivalent Total Volatile Organic Compound)
   *
   * Range 範囲: 0~32767 (Unit 単位: 1 ppb)
   */
  etvoc: number;
  /**
   * eCO2 (equivalent CO2) 等価CO2濃度
   *
   * Range 範囲: 400~32767 (Unit 単位: 1 ppm)
   */
  eco2: number;
}

/**
 * the latest index data and acceleration data from the 2JCIE-BU01(USB connection)
 *
 * 2JCIE-BU01(USB接続)のセンサの最新の指標データや加速度データ
 */
export interface OMRON_2JCIE_USBCalData {
  /**
   * Sequence number 行番号
   *
   * Range 範囲: 0~255
   */
  sequence_number: number;
  /**
   * Discomfort Index 不快指数
   *
   * Range 範囲: 0~100 (Unit 単位: 0.01)
   */
  discomfort_index: number;
  /**
   * Heatstroke risk factor 熱中症危険度
   *
   * Range 範囲: -40~125 (Unit 単位: 0.01 degC)
   */
  heatstroke_risk_factor: number;
  /**
   * Vibration information 振動情報
   *
   * - 0: NONE
   * - 1: during vibration (Earthquake judgment in progress)
   * - 2: during earthquake
   */
  vibration_information: number;
  /**
   * SI Value SI値
   *
   * Range 範囲: 0~6553.5 (Unit 単位: 0.1 kine)
   */
  si_value: number;
  /**
   * PGA (peak ground acceleration)
   *
   * Range 範囲: 0~6553.5 (Unit 単位: 0.1 gal)
   */
  pga: number;
  /**
   * Seismic intensity 震度相当値
   *
   * Range 範囲: 0~65.535 (Unit 単位: 0.001)
   */
  seismic_intensity: number;
  /**
   * Acceleration (X-axis) 加速度(X軸)
   *
   * Range 範囲: -2000~2000 (Unit 単位: 0.1 gal)
   */
  acceleration_x: number;
  /**
   * Acceleration (Y-axis) 加速度(Y軸)
   *
   * Range 範囲: -2000~2000 (Unit 単位: 0.1 gal)
   */
  acceleration_y: number;
  /**
   * Acceleration (Z-axis) 加速度(Z軸)
   *
   * Range 範囲: -2000~2000 (Unit 単位: 0.1 gal)
   */
  acceleration_z: number;
}

/**
 * data from advertisement mode of the 2JCIE-BL01(BAG type)
 *
 * advertisementモードの2JCIE-BL01(バッグ形状)からのデータ
 */
export interface OMRON_2JCIE_AdvData {
  /**
   * Temperature 気温
   *
   * (Unit 単位: 0.01 degC)
   */
  temperature: number;
  /**
   * Relative Humidity 相対湿度
   *
   * (Unit 単位: 0.01 %RH)
   */
  relative_humidity: number;
  /**
   * Light 照度
   *
   * (Unit 単位: 1 lx)
   */
  light: number;
  /**
   * UV Index
   *
   * (Unit 単位: 0.01)
   */
  uv_index: number;
  /**
   * Barometric Pressure 気圧
   *
   * (Unit 単位: 0.1 hPa)
   */
  barometric_pressure: number;
  /**
   * Sound noise 騒音
   *
   * (Unit 単位: 0.01 dB)
   */
  sound_noise: number;
  /**
   * Acceleration (X-axis) 加速度(X軸)
   *
   * (Unit 単位: 0.1 gal)
   */
  acceleration_x: number;
  /**
   * Acceleration (Y-axis) 加速度(Y軸)
   *
   * (Unit 単位: 0.1 gal)
   */
  acceleration_y: number;
  /**
   * Acceleration (Z-axis) 加速度(Z軸)
   *
   * (Unit 単位: 0.1 gal)
   */
  acceleration_z: number;
  /**
   * Battery voltage 電池電圧
   *
   * (Unit 単位: 1 V)
   */
  battery: number;
}

/**
 * data from advertisement mode of the 2JCIE-BU01(USB connection)
 *
 * advertisementモードの2JCIE-BU01(USB接続)からのデータ
 */
export interface OMRON_2JCIE_AdvSensorData {
  /**
   * Temperature 気温
   *
   * Range 範囲: -40~120 (Unit 単位: 0.01 degC)
   */
  temperature: number;
  /**
   * Relative humidity 相対湿度
   *
   * Range 範囲: 0~100 (Unit 単位: 0.01 %RH)
   */
  relative_humidity: number;
  /**
   * Ambient light 照度
   *
   * Range 範囲: 0~30000 (Unit 単位: 1 lx)
   */
  light: number;
  /**
   * Barometric pressure
   *
   * Range 範囲: 300~1100 (Unit 単位: 0.001 hPa)
   */
  barometric_pressure: number;
  /**
   * Sound noise 騒音
   *
   * Range 範囲: 33~120 (Unit 単位: 0.01 dB)
   */
  sound_noise: number;
  /**
   * eTCOC (equivalent Total Volatile Organic Compound)
   *
   * Range 範囲: 0~32767 (Unit 単位: 1 ppb)
   */
  etvoc: number;
  /**
   * eCO2 (equivalent CO2) 等価CO2濃度
   *
   * Range 範囲: 400~32767 (Unit 単位: 1 ppm)
   */
  eco2: number;
}

/** 2JCIE management class 2JCIEを管理するクラス */
export default class OMRON_2JCIE implements ObnizPartsBleInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: '2JCIE',
    };
  }

  /**
   * Verify that the received peripheral is from the 2JCIE Environmental Sensor series of OMRON
   *
   * 受け取ったperipheralがOMRON 環境センサ 2JCIEシリーズのものかどうか確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the 2JCIE Environmental Sensor series of OMRON
   *
   * OMRON 環境センサ 2JCIEシリーズかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    if (peripheral.localName === null) return false;

    return (
      peripheral.localName.indexOf('Env') >= 0 ||
      peripheral.localName.indexOf('IM') >= 0 ||
      peripheral.localName.indexOf('Rbt') >= 0
    );
  }

  /**
   * Get a data from advertisement mode of the 2JCIE Environmental Sensor series of OMRON
   *
   * advertisementモードのOMRON 環境センサ 2JCIEシリーズからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the sensor センサから受け取ったデータ
   *
   * `2JCIE-BL01(BAG type バッグ形状) localName: IM`
   *
   * → {@linkplain OMRON_2JCIE_AdvData}
   *
   *
   * `2JCIE-BU01(USB connection USB接続) localName: Rbt`
   *
   * → {@linkplain OMRON_2JCIE_AdvSensorData}
   */
  public static getData(
    peripheral: BleRemotePeripheral
  ): OMRON_2JCIE_AdvData | OMRON_2JCIE_AdvSensorData | null {
    const adv_data = peripheral.adv_data;
    if (peripheral.localName && peripheral.localName.indexOf('IM') >= 0) {
      return {
        temperature:
          ObnizPartsBleInterface.signed16FromBinary(adv_data[9], adv_data[8]) *
          0.01,
        relative_humidity: roundTo(
          ObnizPartsBleInterface.signed16FromBinary(
            adv_data[11],
            adv_data[10]
          ) * 0.01,
          2
        ),
        light:
          ObnizPartsBleInterface.signed16FromBinary(
            adv_data[13],
            adv_data[12]
          ) * 1,
        uv_index: roundTo(
          ObnizPartsBleInterface.signed16FromBinary(
            adv_data[15],
            adv_data[14]
          ) * 0.01,
          2
        ),
        barometric_pressure: roundTo(
          ObnizPartsBleInterface.signed16FromBinary(
            adv_data[17],
            adv_data[16]
          ) * 0.1,
          1
        ),
        sound_noise: roundTo(
          ObnizPartsBleInterface.signed16FromBinary(
            adv_data[19],
            adv_data[18]
          ) * 0.01,
          2
        ),
        acceleration_x: ObnizPartsBleInterface.signed16FromBinary(
          adv_data[21],
          adv_data[20]
        ),
        acceleration_y: ObnizPartsBleInterface.signed16FromBinary(
          adv_data[23],
          adv_data[22]
        ),
        acceleration_z: ObnizPartsBleInterface.signed16FromBinary(
          adv_data[25],
          adv_data[24]
        ),
        battery: (adv_data[26] + 100) / 100,
      };
    } else if (
      peripheral.localName &&
      peripheral.localName.indexOf('Rbt') >= 0 &&
      adv_data[6] === 0x02 &&
      adv_data[6] === 0x02 &&
      adv_data[7] === 0x01
    ) {
      return {
        temperature:
          ObnizPartsBleInterface.signed16FromBinary(adv_data[10], adv_data[9]) *
          0.01,
        relative_humidity: roundTo(
          ObnizPartsBleInterface.signed16FromBinary(
            adv_data[12],
            adv_data[11]
          ) * 0.01,
          2
        ),
        light:
          ObnizPartsBleInterface.signed16FromBinary(
            adv_data[14],
            adv_data[13]
          ) * 1,
        barometric_pressure: roundTo(
          ObnizPartsBleInterface.signed32FromBinary(
            adv_data[18],
            adv_data[17],
            adv_data[16],
            adv_data[15]
          ) * 0.001,
          3
        ),
        sound_noise: roundTo(
          ObnizPartsBleInterface.signed16FromBinary(
            adv_data[20],
            adv_data[19]
          ) * 0.01,
          2
        ),
        etvoc: ObnizPartsBleInterface.signed16FromBinary(
          adv_data[22],
          adv_data[21]
        ),
        eco2: ObnizPartsBleInterface.signed16FromBinary(
          adv_data[24],
          adv_data[23]
        ),
      };
    }
    return null;
  }

  public _peripheral: BleRemotePeripheral | null = null;
  public obniz!: Obniz;
  public params: any;
  public ondisconnect?: (reason: any) => void;

  private vibrationState: { [index: number]: string } = {
    0x00: 'NONE',
    0x01: 'during vibration (Earthquake judgment in progress)',
    0x02: 'during earthquake',
  };

  constructor(peripheral: BleRemotePeripheral | null) {
    if (peripheral && !OMRON_2JCIE.isDevice(peripheral)) {
      throw new Error('peripheral is not OMRON_2JCIE');
    }
    this._peripheral = peripheral;
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
  }

  /**
   * Search for the 2JCIE Environmental Sensor series of OMRON
   *
   * OMRON 環境センサ 2JCIEシリーズを検索
   *
   * @returns if found: Instance of BleRemotePeripheral / if not found: null
   *
   * 見つかった場合: BleRemotePeripheralのインスタンス / 見つからなかった場合: null
   */
  public async findWait(): Promise<any> {
    const target: any = {
      localName: ['Env', 'Rbt'],
    };

    await this.obniz.ble!.initWait();
    this._peripheral = await this.obniz.ble!.scan.startOneWait(target);

    return this._peripheral;
  }

  private omron_uuid(uuid: string, type: string): string | any {
    if (type === 'BAG') {
      return `0C4C${uuid}-7700-46F4-AA96D5E974E32A54`;
    } else if (type === 'USB') {
      return `AB70${uuid}-0A3A-11E8-BA89-0ED5F89F718B`;
    } else {
      return undefined;
    }
  }

  /**
   * (Search for the device and) connect the sensor
   *
   * Throw an error if the device is not found
   *
   * (デバイスを検索し、)センサへ接続
   *
   * デバイスが見つからなかった場合はエラーをthrow
   *
   * `supported types&modes 対応形状&モード`
   * - 2JCIE-BL01(BAG type バッグ形状) localName: Env
   * - 2JCIE-BU01(USB connection USB接続) localName: Rbt
   */
  public async connectWait() {
    if (!this._peripheral) {
      await this.findWait();
    }
    if (!this._peripheral) {
      throw new Error('2JCIE not found');
    }
    if (!this._peripheral.connected) {
      this._peripheral.ondisconnect = (reason: any) => {
        if (typeof this.ondisconnect === 'function') {
          this.ondisconnect(reason);
        }
      };
      await this._peripheral.connectWait();
    }
  }

  /**
   * Disconnect from the sensor
   *
   * センサから切断
   */
  public async disconnectWait() {
    if (this._peripheral && this._peripheral.connected) {
      await this._peripheral.disconnectWait();
    }
  }

  private signedNumberFromBinary(data: number[]) {
    // little endian
    let val: number = data[data.length - 1] & 0x7f;
    for (let i = data.length - 2; i >= 0; i--) {
      val = val * 256 + data[i];
    }
    if ((data[data.length - 1] & 0x80) !== 0) {
      val = val - Math.pow(2, data.length * 8 - 1);
    }
    return val;
  }

  private unsignedNumberFromBinary(data: number[]) {
    // little endian
    let val: number = data[data.length - 1];
    for (let i = data.length - 2; i >= 0; i--) {
      val = val * 256 + data[i];
    }
    return val;
  }

  /**
   * @deprecated Please use {@linkplain getLatestDataWait}
   *
   * {@linkplain getLatestDataWait} の使用を推奨
   */
  public async getLatestDataBAGWait(): Promise<OMRON_2JCIE_Data> {
    return this.getLatestDataWait();
  }

  /**
   * @deprecated Please use {@linkplain getLatestDataWait}
   *
   * {@linkplain getLatestDataWait} の使用を推奨
   */
  public getLatestData(): Promise<OMRON_2JCIE_Data> {
    return this.getLatestDataWait();
  }

  /**
   * Get the latest data from the 2JCIE-BL01(BAG type) sensor
   *
   * 2JCIE-BL01(バッグ形状)のセンサの最新のデータを取得
   *
   * @returns received data from the sensor センサから受け取ったデータ
   *
   */
  public async getLatestDataWait(): Promise<OMRON_2JCIE_Data> {
    await this.connectWait();

    const c = this._peripheral!.getService(
      this.omron_uuid('3000', 'BAG')
    )!.getCharacteristic(this.omron_uuid('3001', 'BAG'))!;
    const data: number[] = await c.readWait();
    const json: any = {
      row_number: data[0],
      temperature: roundTo(
        this.signedNumberFromBinary(data.slice(1, 3)) * 0.01,
        2
      ),
      relative_humidity: roundTo(
        this.signedNumberFromBinary(data.slice(3, 5)) * 0.01,
        2
      ),
      light: this.signedNumberFromBinary(data.slice(5, 7)) * 1,
      uv_index: roundTo(
        this.signedNumberFromBinary(data.slice(7, 9)) * 0.01,
        2
      ),
      barometric_pressure: roundTo(
        this.signedNumberFromBinary(data.slice(9, 11)) * 0.1,
        1
      ),
      sound_noise: roundTo(
        this.signedNumberFromBinary(data.slice(11, 13)) * 0.01,
        2
      ),
      discomfort_index: roundTo(
        this.signedNumberFromBinary(data.slice(13, 15)) * 0.01,
        2
      ),
      heatstroke_risk_factor: roundTo(
        this.signedNumberFromBinary(data.slice(15, 17)) * 0.01,
        2
      ),
      battery_voltage: roundTo(
        this.unsignedNumberFromBinary(data.slice(17, 19)) * 0.001,
        3
      ),
    };

    return json;
  }

  /**
   * @deprecated Please use {@linkplain getLatestSensorDataUSBWait}
   *
   * {@linkplain getLatestSensorDataUSBWait} の使用を推奨
   */
  public getLatestSensorDataUSB(): Promise<OMRON_2JCIE_USBSenData> {
    return this.getLatestSensorDataUSBWait();
  }

  /**
   * Get the latest data from the 2JCIE-BU01(USB connection) sensor
   *
   * 2JCIE-BU01(USB接続)のセンサの最新のデータを取得
   *
   * @returns received data from the sensor センサから受け取ったデータ
   */
  public async getLatestSensorDataUSBWait(): Promise<OMRON_2JCIE_USBSenData> {
    await this.connectWait();

    const c = this._peripheral!.getService(
      this.omron_uuid('5010', 'USB')
    )!.getCharacteristic(this.omron_uuid('5012', 'USB'))!;
    const data: number[] = await c.readWait();
    const json: any = {
      sequence_number: data[0],
      temperature: roundTo(
        this.signedNumberFromBinary(data.slice(1, 3)) * 0.01,
        2
      ),
      relative_humidity: roundTo(
        this.signedNumberFromBinary(data.slice(3, 5)) * 0.01,
        2
      ),
      light: this.signedNumberFromBinary(data.slice(5, 7)) * 1,
      barometric_pressure: roundTo(
        this.signedNumberFromBinary(data.slice(7, 11)) * 0.001,
        3
      ),
      sound_noise: roundTo(
        this.signedNumberFromBinary(data.slice(11, 13)) * 0.01,
        2
      ),
      etvoc: this.signedNumberFromBinary(data.slice(13, 15)) * 1,
      eco2: this.signedNumberFromBinary(data.slice(15, 17)) * 1,
    };

    return json;
  }

  /**
   * @deprecated Please use {@linkplain getLatestCalculationDataUSBWait}
   *
   * {@linkplain getLatestCalculationDataUSBWait} の使用を推奨
   */
  public getLatestCalculationDataUSB(): Promise<OMRON_2JCIE_USBCalData> {
    return this.getLatestCalculationDataUSBWait();
  }

  /**
   * Get the latest index data and acceleration data from the 2JCIE-BU01(USB connection) sensor
   *
   * 2JCIE-BU01(USB接続)のセンサの最新の指標データや加速度データを取得
   *
   * @returns received data from the sensor センサから受け取ったデータ
   */
  public async getLatestCalculationDataUSBWait(): Promise<OMRON_2JCIE_USBCalData> {
    await this.connectWait();

    const c = this._peripheral!.getService(
      this.omron_uuid('5010', 'USB')
    )!.getCharacteristic(this.omron_uuid('5013', 'USB'))!;
    const data: number[] = await c.readWait();
    const json: any = {
      sequence_number: data[0],
      discomfort_index: roundTo(
        this.signedNumberFromBinary(data.slice(1, 3)) * 0.01,
        2
      ),
      heatstroke_risk_factor: roundTo(
        this.signedNumberFromBinary(data.slice(3, 5)) * 0.01,
        2
      ),
      vibration_information: this.vibrationState[data[5]],
      si_value: roundTo(
        this.unsignedNumberFromBinary(data.slice(6, 8)) * 0.1,
        1
      ),
      pga: roundTo(this.unsignedNumberFromBinary(data.slice(8, 10)) * 0.1, 1),
      seismic_intensity: roundTo(
        this.unsignedNumberFromBinary(data.slice(10, 12)) * 0.001,
        3
      ),
      acceleration_x: this.signedNumberFromBinary(data.slice(12, 14)) * 1,
      acceleration_y: this.signedNumberFromBinary(data.slice(14, 16)) * 1,
      acceleration_z: this.signedNumberFromBinary(data.slice(16, 18)) * 1,
    };

    return json;
  }
}
