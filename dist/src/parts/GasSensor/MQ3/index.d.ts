/**
 * @packageDocumentation
 * @module Parts.MQ3
 */
import MQGas, { MQGasSensorOptions } from '../MQGas';
export declare type MQ3Options = MQGasSensorOptions;
export default class MQ3 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
