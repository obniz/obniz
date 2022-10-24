/**
 * @packageDocumentation
 * @module Parts.MQ2
 */
import MQGas, { MQGasSensorOptions } from '../MQGas';
export declare type MQ2Options = MQGasSensorOptions;
export default class MQ2 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
