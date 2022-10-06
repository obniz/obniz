/**
 * @packageDocumentation
 * @module Parts.MQGas
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface MQGasSensorOptions {
    gnd?: number;
    vcc?: number;
    do?: number;
    ao?: number;
}
export default class MQGasSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    onchangeanalog?: (voltage: number) => void;
    onexceedvoltage?: (voltage: number) => void;
    onchangedigital?: (voltage: number) => void;
    voltageLimit?: number;
    params: any;
    protected obniz: Obniz;
    private vcc;
    private gnd;
    private ad;
    private do;
    constructor();
    wired(obniz: Obniz): void;
    startHeating(): void;
    heatWait(seconds?: number): Promise<void>;
}
