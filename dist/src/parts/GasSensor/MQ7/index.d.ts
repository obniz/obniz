import MQGas, { MQGasSensorOptions } from "../MQGas";
/**
 * @category Parts
 */
export interface MQ7Options extends MQGasSensorOptions {
}
/**
 * @category Parts
 */
export default class MQ7 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
