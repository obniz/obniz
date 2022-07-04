/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
import { ObnizPartsBleMode } from '../../../obniz/ObnizPartsBleAbstract';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { MESH } from '../utils/abstracts/MESH';
export interface MESH_100THOptions {
}
/**
 * advertisement data from MESH_100TH
 *
 * MESH_100THからのadvertisementデータ
 */
export interface MESH_100TH_Data {
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /** temperature 温度 (Unit 単位: 0.01 degC)*/
    temperature: number;
    /** humidity 相対湿度 (Unit 単位: 1% RH) */
    humidity: number;
}
/** MESH_100TH management class MESH_100THを管理するクラス */
export default class MESH_100TH extends MESH<MESH_100TH_Data> {
    static readonly PartsName = "MESH_100TH";
    localName: string;
    static AvailableBleMode: "Connectable";
    protected readonly staticClass: typeof MESH_100TH;
    /**
     * adからこのデバイスであること判定する
     */
    static isDeviceWithMode(peripheral: BleRemotePeripheral, mode: ObnizPartsBleMode): boolean;
    /** 例） Event handler for button ボタンのイベントハンドラー */
    onButtonPressed: ((pressed: boolean) => void) | null;
    getDataWait(): Promise<{
        battery: number;
        temperature: number;
        humidity: number;
    }>;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
    lightup(red: number, green: number, blue: number, time: number, cycle_on: number, cycle_off: number, pattern: number): void;
}
