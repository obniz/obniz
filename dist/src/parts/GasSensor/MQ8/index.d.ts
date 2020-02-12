/**
 * @packageDocumentation
 * @module Parts.MQ8
 */
import MQGas, { MQGasSensorOptions } from "../MQGas";
export interface MQ8Options extends MQGasSensorOptions {
}
export default class MQ8 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
