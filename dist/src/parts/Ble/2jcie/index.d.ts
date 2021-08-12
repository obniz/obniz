/**
 * @packageDocumentation
 * @module Parts.OMRON_2JCIE
 */
import Obniz from '../../../obniz';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface OMRON_2JCIEOptions {
}
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
    sequence_number: number;
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
    static info(): ObnizPartsInfo;
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
    static isDevice(peripheral: BleRemotePeripheral): boolean | "" | null;
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
     * - uv_index: ultraviolet ray intensity 紫外線強度
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
    getLatestCalculationDataUSBWait(): Promise<OMRON_2JCIE_USBCalData>;
}
