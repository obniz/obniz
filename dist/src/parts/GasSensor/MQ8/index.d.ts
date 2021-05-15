/**
 * @packageDocumentation
 * @module Parts.MQ8
 */
import MQGas, { MQGasSensorOptions } from '../MQGas';
export declare type MQ8Options = MQGasSensorOptions;
export default class MQ8 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
