/**
 * @packageDocumentation
 * @module Parts.MQ2
 */
import MQGas, { MQGasSensorOptions } from "../MQGas";
export interface MQ2Options extends MQGasSensorOptions {
}
export default class MQ2 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
