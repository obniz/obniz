import MQGas, { MQGasSensorOptions } from "../MQGas";
/**
 * @category Parts
 */
export interface MQ9Options extends MQGasSensorOptions {
}
/**
 * @category Parts
 */
export default class MQ9 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
