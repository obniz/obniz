/**
 * @packageDocumentation
 * @module Parts.MQ5
 */
import MQGas, { MQGasSensorOptions } from '../MQGas';
export declare type MQ5Options = MQGasSensorOptions;
export default class MQ5 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
