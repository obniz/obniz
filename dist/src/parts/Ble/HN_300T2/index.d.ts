/**
 * @packageDocumentation
 * @module Parts.HN_300T2
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface HN_300T2Options {
}
export interface HN_300T2Result {
    /**
     * weight(kg) 体重(kg)
     */
    weight?: number;
    /** timestamp タイムスタンプ */
    date?: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
    };
}
export default class HN_300T2 implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    _peripheral: BleRemotePeripheral;
    private _timezoneOffset;
    onNotify?: (co2: number) => void;
    ondisconnect?: (reason: any) => void;
    constructor(peripheral: BleRemotePeripheral, timezoneOffset: number);
    static isDevice(peripheral: BleRemotePeripheral): boolean | "" | null;
    isPairingMode(): boolean;
    pairingWait(): Promise<string>;
    getDataWait(pairingKeys: string): Promise<HN_300T2Result[]>;
    private _analyseWeightMesureData;
    private writeCurrentTimeWait;
}
