/**
 * @packageDocumentation
 * @module Parts.MQ5
 */
import MQGas, { MQGasSensorOptions } from "../MQGas";
export interface MQ5Options extends MQGasSensorOptions {
}
export default class MQ5 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
