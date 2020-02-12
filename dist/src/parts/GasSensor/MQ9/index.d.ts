/**
 * @packageDocumentation
 * @module Parts.MQ9
 */
import MQGas, { MQGasSensorOptions } from "../MQGas";
export interface MQ9Options extends MQGasSensorOptions {
}
export default class MQ9 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
