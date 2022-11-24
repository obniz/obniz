/**
 * @packageDocumentation
 * @module Parts.OMRON_2JCIE
 */
import Obniz from '../../../obniz';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface } from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface OMRON_2JCIEOptions {
}
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
    static info(): ObnizPartsInfo;
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
    static isDevice(peripheral: BleRemotePeripheral): boolean;
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
    static getData(peripheral: BleRemotePeripheral): OMRON_2JCIE_AdvData | OMRON_2JCIE_AdvSensorData | null;
    _peripheral: BleRemotePeripheral | null;
    obniz: Obniz;
    params: any;
    ondisconnect?: (reason: any) => void;
    private vibrationState;
    constructor(peripheral: BleRemotePeripheral | null);
    wired(obniz: Obniz): void;
    /**
     * Search for the 2JCIE Environmental Sensor series of OMRON
     *
     * OMRON 環境センサ 2JCIEシリーズを検索
     *
     * @returns if found: Instance of BleRemotePeripheral / if not found: null
     *
     * 見つかった場合: BleRemotePeripheralのインスタンス / 見つからなかった場合: null
     */
    findWait(): Promise<any>;
    private omron_uuid;
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
    connectWait(): Promise<void>;
    /**
     * Disconnect from the sensor
     *
     * センサから切断
     */
    disconnectWait(): Promise<void>;
    private signedNumberFromBinary;
    private unsignedNumberFromBinary;
    /**
     * @deprecated Please use {@linkplain getLatestDataWait}
     *
     * {@linkplain getLatestDataWait} の使用を推奨
     */
    getLatestDataBAGWait(): Promise<OMRON_2JCIE_Data>;
    /**
     * @deprecated Please use {@linkplain getLatestDataWait}
     *
     * {@linkplain getLatestDataWait} の使用を推奨
     */
    getLatestData(): Promise<OMRON_2JCIE_Data>;
    /**
     * Get the latest data from the 2JCIE-BL01(BAG type) sensor
     *
     * 2JCIE-BL01(バッグ形状)のセンサの最新のデータを取得
     *
     * @returns received data from the sensor センサから受け取ったデータ
     *
     */
    getLatestDataWait(): Promise<OMRON_2JCIE_Data>;
    /**
     * @deprecated Please use {@linkplain getLatestSensorDataUSBWait}
     *
     * {@linkplain getLatestSensorDataUSBWait} の使用を推奨
     */
    getLatestSensorDataUSB(): Promise<OMRON_2JCIE_USBSenData>;
    /**
     * Get the latest data from the 2JCIE-BU01(USB connection) sensor
     *
     * 2JCIE-BU01(USB接続)のセンサの最新のデータを取得
     *
     * @returns received data from the sensor センサから受け取ったデータ
     */
    getLatestSensorDataUSBWait(): Promise<OMRON_2JCIE_USBSenData>;
    /**
     * @deprecated Please use {@linkplain getLatestCalculationDataUSBWait}
     *
     * {@linkplain getLatestCalculationDataUSBWait} の使用を推奨
     */
    getLatestCalculationDataUSB(): Promise<OMRON_2JCIE_USBCalData>;
    /**
     * Get the latest index data and acceleration data from the 2JCIE-BU01(USB connection) sensor
     *
     * 2JCIE-BU01(USB接続)のセンサの最新の指標データや加速度データを取得
     *
     * @returns received data from the sensor センサから受け取ったデータ
     */
    getLatestCalculationDataUSBWait(): Promise<OMRON_2JCIE_USBCalData>;
}
