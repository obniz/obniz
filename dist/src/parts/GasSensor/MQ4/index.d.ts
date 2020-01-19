import MQGas, { MQGasSensorOptions } from "../MQGas";
export interface MQ4Options extends MQGasSensorOptions {
}
export default class MQ4 extends MQGas {
    static info(): {
        name: string;
    };
    constructor();
}
