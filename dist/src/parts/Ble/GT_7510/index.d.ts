/**
 * @packageDocumentation
 * @module Parts.GT_7510
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface GT_7510Options {
}
export interface GT_7510Result {
    /**
     * Blood glucose level(mg/dL) 血糖値(mg/dL)
     */
    glucose: number;
    /**
     * 計測日時 (年/月/日 時:分)
     */
    date: string;
    /**
     * blood glucose range, 血糖値範囲 (通常、高値、低値)
     */
    range: string;
    /**
     * measurement timing, 測定タイミング
     */
    timing: string;
}
export default class GT_7510 implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    _peripheral: BleRemotePeripheral;
    onNotify?: (co2: number) => void;
    ondisconnect?: (reason: any) => void;
    private key;
    constructor(peripheral: BleRemotePeripheral);
    static isDevice(peripheral: BleRemotePeripheral): boolean | "" | null;
    isPairingMode(): boolean;
    pairingWait(passkeyCallback: () => Promise<number>, option?: {
        name?: string;
    }): Promise<string>;
    connectWait(key: string): Promise<void>;
    getDataWait(key: string): Promise<GT_7510Result[]>;
    private digestMessageWait;
    private toHex;
    private analyzeData;
}
