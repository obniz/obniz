/**
 * @packageDocumentation
 * @module Parts.Keyestudio_TrafficLight
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import LED from '../../Light/LED';
export declare type TrafficLightType = 'green' | 'yellow' | 'red';
export interface Keyestudio_TrafficLightOptions {
    gnd?: number;
    green: number;
    yellow: number;
    red: number;
}
export default class Keyestudio_TrafficLight implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    green: LED;
    yellow: LED;
    red: LED;
    protected obniz: Obniz;
    private state;
    constructor();
    wired(obniz: Obniz): void;
    single(led: TrafficLightType): void;
    next(): void;
}
