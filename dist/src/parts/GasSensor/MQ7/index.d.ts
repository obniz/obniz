/**
 * @packageDocumentation
 * @module Parts.MQ7
 */
import MQGas, { MQGasSensorOptions } from '../MQGas';
export declare type MQ7Options = MQGasSensorOptions;
export default class MQ7 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
