/**
 * @packageDocumentation
 * @module Parts.MH_Z19B
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface MH_Z19BOptions {
    vcc?: number;
    gnd?: number;
    sensor_tx: number;
    sensor_rx: number;
}
export default class MH_Z19B implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    displayName: any;
    displayIoNames: any;
    params: any;
    vcc: number;
    gnd: number;
    my_tx: any;
    my_rx: any;
    protected obniz: Obniz;
    private rxbuf;
    private modes;
    private rangeType;
    private uart;
    constructor();
    wired(obniz: Obniz): void;
    heatWait(seconds?: number): Promise<void>;
    getWait(): Promise<number>;
    calibrateZero(): void;
    calibrateSpan(ppm?: number): void;
    setAutoCalibration(autoCalibration?: boolean): void;
    setDetectionRange(range: number): void;
    private checkSum;
    private makeRequestCmd;
    private requestReadConcentraiton;
    private getCO2Concentration;
    private checkResponseData;
}
