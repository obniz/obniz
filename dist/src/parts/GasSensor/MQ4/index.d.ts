/**
 * @packageDocumentation
 * @module Parts.MQ4
 */
import MQGas, { MQGasSensorOptions } from "../MQGas";
/**
 * @category Parts
 */
export interface MQ4Options extends MQGasSensorOptions {
}
/**
 * @category Parts
 */
export default class MQ4 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
