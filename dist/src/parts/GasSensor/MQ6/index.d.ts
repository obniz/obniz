/**
 * @packageDocumentation
 * @module Parts.MQ6
 */
import MQGas, { MQGasSensorOptions } from "../MQGas";
export interface MQ6Options extends MQGasSensorOptions {
}
export default class MQ6 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
