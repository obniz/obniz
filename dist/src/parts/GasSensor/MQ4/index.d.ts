/**
 * @packageDocumentation
 * @module Parts.MQ4
 */
import MQGas, { MQGasSensorOptions } from '../MQGas';
export declare type MQ4Options = MQGasSensorOptions;
export default class MQ4 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
