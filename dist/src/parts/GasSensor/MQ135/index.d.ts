/**
 * @packageDocumentation
 * @module Parts.MQ135
 */
import MQGas, { MQGasSensorOptions } from '../MQGas';
export declare type MQ135Options = MQGasSensorOptions;
export default class MQ135 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
