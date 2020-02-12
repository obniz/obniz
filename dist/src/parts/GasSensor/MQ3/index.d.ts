/**
 * @packageDocumentation
 * @module Parts.MQ3
 */
import MQGas, { MQGasSensorOptions } from "../MQGas";
export interface MQ3Options extends MQGasSensorOptions {
}
export default class MQ3 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
