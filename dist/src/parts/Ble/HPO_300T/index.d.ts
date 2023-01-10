import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import Obniz from '../../../obniz';
import BleRemotePeripheral = Obniz.BleRemotePeripheral;
export interface HPO_300TOptions {
}
export interface HPO_300TResult {
    /**
     * weight(kg) 体重(kg)
     */
    spo2?: number;
    pulseRate?: number;
    date?: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
    };
}
export default class HPO_300T implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    _peripheral: BleRemotePeripheral;
    ondisconnect?: (reason: any) => void;
    _timezoneOffset: number;
    constructor(peripheral: BleRemotePeripheral, timezoneOffset: number);
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    isPairingMode(): boolean;
    /**
     * Pair with the device
     *
     * デバイスとペアリング 電源ボタンを長押しする
     *
     * @returns pairing key ペアリングキー
     */
    pairingWait(): Promise<string | null>;
    /**
     * Get SpO2, PulseRate Data from Device
     *
     * デバイスから計測データをとる
     *
     * @returns 受け取ったデータ
     */
    getDataWait(pairingKeys: string): Promise<HPO_300TResult>;
    private writeCurrentTimeWait;
    private _analyseData;
}
