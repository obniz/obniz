import MQGas, { MQGasSensorOptions } from "../MQGas";
/**
 * @category Parts
 */
export interface MQ135Options extends MQGasSensorOptions {
}
/**
 * @category Parts
 */
export default class MQ135 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
