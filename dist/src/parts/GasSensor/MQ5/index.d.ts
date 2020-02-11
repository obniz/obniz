import MQGas, { MQGasSensorOptions } from "../MQGas";
/**
 * @category Parts
 */
export interface MQ5Options extends MQGasSensorOptions {
}
/**
 * @category Parts
 */
export default class MQ5 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
