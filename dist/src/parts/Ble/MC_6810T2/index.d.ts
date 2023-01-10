import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import Obniz from '../../../obniz';
import BleRemotePeripheral = Obniz.BleRemotePeripheral;
export interface MC_6810T2Options {
}
export interface MC_6810T2Result {
    temperature?: number;
    date?: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
    };
}
export default class MC_6810T2 implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    _peripheral: BleRemotePeripheral;
    ondisconnect?: (reason: any) => void;
    _timezoneOffset: number;
    constructor(peripheral: BleRemotePeripheral, timezoneOffset: number);
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    isPairingMode(): number;
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
    getDataWait(pairingKeys: string): Promise<MC_6810T2Result>;
    private writeCurrentTimeWait;
    private _analyseData;
}
