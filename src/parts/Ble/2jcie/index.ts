/**
 * @packageDocumentation
 * @module Parts.OMRON_2JCIE
 */

import Obniz from '../../../obniz';
import bleRemoteCharacteristic from '../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import JsonBinaryConverter from '../../../obniz/libs/wscommand/jsonBinaryConverter';
import ObnizPartsBleInterface from '../../../obniz/ObnizPartsBleInterface';
import ObnizPartsInterface, {
  ObnizPartsInfo,
} from '../../../obniz/ObnizPartsInterface';

export interface OMRON_2JCIEOptions {}

export interface OMRON_2JCIE_Data {
  row_number: number;
  temperature: number;
  relative_humidity: number;
  light: number;
  uv_index: number;
  barometric_pressure: number;
  sound_noise: number;
  discomfort_index: number;
  heatstroke_risk_factor: number;
  battery_voltage: number;
}

export interface OMRON_2JCIE_USBSenData {
  seqence_number: number;
  temperature: number;
  relative_humidity: number;
  light: number;
  barometric_pressure: number;
  sound_noise: number;
  etvoc: number;
  eco2: number;
}

export interface OMRON_2JCIE_USBCalData {
  sequence_number: number;
  discomfort_index: number;
  heatstroke_risk_factor: number;
  vibration_information: number;
  si_value: number;
  pga: number;
  seismic_intensity: number;
  acceleration_x: number;
  acceleration_y: number;
  acceleration_z: number;
}

export interface OMRON_2JCIE_AdvData {
  temperature: number;
  relative_humidity: number;
  light: number;
  uv_index: number;
  barometric_pressure: number;
  sound_noise: number;
  acceleration_x: number;
  acceleration_y: number;
  acceleration_z: number;
  battery: number;
}

export interface OMRON_2JCIE_AdvSensorData {
  temperature: number;
  relative_humidity: number;
  light: number;
  barometric_pressure: number;
  sound_noise: number;
  etvoc: number;
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
   * verify that the received peripheral is from the 2JCIE Environmental Sensor series of OMRON
   * 
   * 受け取ったperipheralがOMRON 環境センサ 2JCIEシリーズのものかどうか確認する
   * 
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   * 
   * @returns Whether it is the 2JCIE Environmental Sensor series of OMRON
   * 
   * OMRON 環境センサ 2JCIEシリーズかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral) {
    return (
      (peripheral.localName && peripheral.localName.indexOf('Env') >= 0) ||
      (peripheral.localName && peripheral.localName.indexOf('IM') >= 0) ||
      (peripheral.localName && peripheral.localName.indexOf('Rbt') >= 0)
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
   * - temperature: temperature(degC) 温度(degC)
   * - relative_humidity: humidity(%RH) 湿度(%RH)
   * - light: illuminance(lx) 照度(lx)
   * - uv_index: ultraviolet ray intensity　紫外線強度
   * - barometric_pressure: barometric pressure(hPa) 気圧(hPa)
   * - sound_noise: noise(dB) 騒音(dB)
   * - acceleration_x: x acceleration 加速度x
   * - acceleration_y: y acceleration 加速度y
   * - acceleration_z: z acceleration 加速度z
   * - battery: battery voltage(V) バッテリー電圧(V)
   * 
   * `2JCIE-BU01(USB connection USB接続) localName: Rbt`
   * - temperature: temperature(degC) 温度(degC)
   * - relative_humidity: humidity(%RH) 湿度(%RH)
   * - light: illuminance(lx) 照度(lx)
   * - barometric_pressure: barometric pressure(hPa) 気圧(hPa)
   * - sound_noise: noise(dB) 騒音(dB)
   * - etvoc: eTVOC(ppb)
   * - eco2: equivalent CO2(ppm) 等価CO2濃度(ppm)
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
        relative_humidity:
          ObnizPartsBleInterface.signed16FromBinary(
            adv_data[11],
            adv_data[10]
          ) * 0.01,
        light:
          ObnizPartsBleInterface.signed16FromBinary(
            adv_data[13],
            adv_data[12]
          ) * 1,
        uv_index:
          ObnizPartsBleInterface.signed16FromBinary(
            adv_data[15],
            adv_data[14]
          ) * 0.01,
        barometric_pressure:
          ObnizPartsBleInterface.signed16FromBinary(
            adv_data[17],
            adv_data[16]
          ) * 0.1,
        sound_noise:
          ObnizPartsBleInterface.signed16FromBinary(
            adv_data[19],
            adv_data[18]
          ) * 0.01,
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
        relative_humidity:
          ObnizPartsBleInterface.signed16FromBinary(
            adv_data[12],
            adv_data[11]
          ) * 0.01,
        light:
          ObnizPartsBleInterface.signed16FromBinary(
            adv_data[14],
            adv_data[13]
          ) * 1,
        barometric_pressure:
          ObnizPartsBleInterface.signed32FromBinary(
            adv_data[18],
            adv_data[17],
            adv_data[16],
            adv_data[15]
          ) * 0.001,
        sound_noise:
          ObnizPartsBleInterface.signed16FromBinary(
            adv_data[20],
            adv_data[19]
          ) * 0.01,
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

  public omron_uuid(uuid: string, type: string): string | any {
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

  public signedNumberFromBinary(data: number[]) {
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

  public unsignedNumberFromBinary(data: number[]) {
    // little endian
    let val: number = data[data.length - 1];
    for (let i = data.length - 2; i >= 0; i--) {
      val = val * 256 + data[i];
    }
    return val;
  }

  /**
   * @deprecated Please use {@linkcode getLatestDataWait}
   * 
   * {@linkcode getLatestDataWait} の使用を推奨
   */
  public async getLatestDataBAGWait(): Promise<OMRON_2JCIE_Data> {
    return this.getLatestDataWait();
  }

  /**
   * @deprecated Please use {@linkcode getLatestDataWait}
   * 
   * {@linkcode getLatestDataWait} の使用を推奨
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
   * `example response 返り値例`
   * ```
   * {
   *   row_number: 0,
   *   temperature: 22.91,   //degC
   *   relative_humidity: 46.46, //%RH
   *   light: 75, //lx
   *   uv_index: 0.02, 
   *   barometric_pressure: 1010.4000000000001, // hPa
   *   sound_noise: 39.42, //dB
   *   discomfort_index: 68.75,
   *   heatstroke_risk_factor: 19,  //degC
   *   battery_voltage: 30.12  // V
   * }
   * ```
   */
  public async getLatestDataWait(): Promise<OMRON_2JCIE_Data> {
    await this.connectWait();

    const c = this._peripheral!.getService(
      this.omron_uuid('3000', 'BAG')
    )!.getCharacteristic(this.omron_uuid('3001', 'BAG'))!;
    const data: number[] = await c.readWait();
    const json: any = {
      row_number: data[0],
      temperature: this.signedNumberFromBinary(data.slice(1, 3)) * 0.01,
      relative_humidity: this.signedNumberFromBinary(data.slice(3, 5)) * 0.01,
      light: this.signedNumberFromBinary(data.slice(5, 7)) * 1,
      uv_index: this.signedNumberFromBinary(data.slice(7, 9)) * 0.01,
      barometric_pressure: this.signedNumberFromBinary(data.slice(9, 11)) * 0.1,
      sound_noise: this.signedNumberFromBinary(data.slice(11, 13)) * 0.01,
      discomfort_index: this.signedNumberFromBinary(data.slice(13, 15)) * 0.01,
      heatstroke_risk_factor:
        this.signedNumberFromBinary(data.slice(15, 17)) * 0.01,
      battery_voltage:
        this.unsignedNumberFromBinary(data.slice(17, 19)) * 0.001,
    };

    return json;
  }

  /**
   * @deprecated Please use {@linkcode getLatestSensorDataUSBWait}
   * 
   * {@linkcode getLatestSensorDataUSBWait} の使用を推奨
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
   * 
   * `example response 返り値例`
   * ```
   * {
   *   sequence_number: 0,
   *   temperature: 22.91,   //degC
   *   relative_humidity: 46.46, //%RH
   *   light: 75, //lx
   *   barometric_pressure: 1010.4000000000001, // hPa
   *   sound_noise: 39.42, //dB
   *   etvoc: 1463,	//ppb
   *   eco2: 2353	//ppm
   * }
   * ```
   */
  public async getLatestSensorDataUSBWait(): Promise<OMRON_2JCIE_USBSenData> {
    await this.connectWait();

    const c = this._peripheral!.getService(
      this.omron_uuid('5010', 'USB')
    )!.getCharacteristic(this.omron_uuid('5012', 'USB'))!;
    const data: number[] = await c.readWait();
    const json: any = {
      seqence_number: data[0],
      temperature: this.signedNumberFromBinary(data.slice(1, 3)) * 0.01,
      relative_humidity: this.signedNumberFromBinary(data.slice(3, 5)) * 0.01,
      light: this.signedNumberFromBinary(data.slice(5, 7)) * 1,
      barometric_pressure:
        this.signedNumberFromBinary(data.slice(7, 11)) * 0.001,
      sound_noise: this.signedNumberFromBinary(data.slice(11, 13)) * 0.01,
      etvoc: this.signedNumberFromBinary(data.slice(13, 15)) * 1,
      eco2: this.signedNumberFromBinary(data.slice(15, 17)) * 1,
    };

    return json;
  }

  /**
   * @deprecated Please use {@linkcode getLatestCalculationDataUSBWait}
   * 
   * {@linkcode getLatestCalculationDataUSBWait} の使用を推奨
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
   * 
   * `example response 返り値例`
   * ```
   * {
   *   sequence_number: 0,
   *   discomfort_index: 68.78,
   *   heatstroke_risk_factor: 18.29, //degC
   *   vibration_information: "NONE",
   *   si_value: 0, //kine
   *   pga: 0, //gal
   *   seismic_intensity: 0,
   *   acceleration_x: 185	//gal
   *   acceleration_y: -9915	//gal
   *   acceleration_z: -191	//gal
   * }
   * ```
   */
  public async getLatestCalculationDataUSBWait(): Promise<OMRON_2JCIE_USBCalData> {
    await this.connectWait();

    const c = this._peripheral!.getService(
      this.omron_uuid('5010', 'USB')
    )!.getCharacteristic(this.omron_uuid('5013', 'USB'))!;
    const data: number[] = await c.readWait();
    const json: any = {
      sequence_number: data[0],
      discomfort_index: this.signedNumberFromBinary(data.slice(1, 3)) * 0.01,
      heatstroke_risk_factor:
        this.signedNumberFromBinary(data.slice(3, 5)) * 0.01,
      vibration_information: this.vibrationState[data[5]],
      si_value: this.unsignedNumberFromBinary(data.slice(6, 8)) * 0.1,
      pga: this.unsignedNumberFromBinary(data.slice(8, 10)) * 0.1,
      seismic_intensity:
        this.unsignedNumberFromBinary(data.slice(10, 12)) * 0.001,
      acceleration_x: this.signedNumberFromBinary(data.slice(12, 14)) * 1,
      acceleration_y: this.signedNumberFromBinary(data.slice(14, 16)) * 1,
      acceleration_z: this.signedNumberFromBinary(data.slice(16, 18)) * 1,
    };

    return json;
  }
}
