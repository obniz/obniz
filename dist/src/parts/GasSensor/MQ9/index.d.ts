/**
 * @packageDocumentation
 * @module Parts.MQ9
 */
import MQGas, { MQGasSensorOptions } from '../MQGas';
export declare type MQ9Options = MQGasSensorOptions;
export default class MQ9 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
