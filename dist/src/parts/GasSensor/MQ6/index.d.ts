/**
 * @packageDocumentation
 * @module Parts.MQ6
 */
import MQGas, { MQGasSensorOptions } from '../MQGas';
export declare type MQ6Options = MQGasSensorOptions;
export default class MQ6 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
