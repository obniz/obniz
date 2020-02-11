import MQGas, { MQGasSensorOptions } from "../MQGas";
/**
 * @category Parts
 */
export interface MQ6Options extends MQGasSensorOptions {
}
/**
 * @category Parts
 */
export default class MQ6 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
