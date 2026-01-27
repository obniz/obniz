/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import Obniz from '../../index';
import { ComponentAbstract } from '../ComponentAbstact';
interface PeripheralCANBusOptions {
    /**
     * Canbus Modes
     */
    mode: 'normal' | 'noack' | 'listen';
    /**
     * TX pin no
     */
    tx: number;
    /**
     * RX pin no
     */
    rx: number;
    /**
     * speed of bus in kbps
     */
    kbps: number;
    /**
     * CAN Bus accept match code after mask.
     */
    filter_code: number;
    /**
     * CAN Bus accept filter mask. 0 means accept all
     */
    filter_mask: number;
}
interface CANBusSendModes {
    /**
     * Extended format. Default false.
     */
    extended: boolean;
    /**
     * Message is remote frame
     */
    rtr: boolean;
    /**
     * Message is Single Shot
     */
    single_shot: boolean;
    /**
     * Message is Self Reception
     */
    self_reception: boolean;
}
/**
 * CAN Bus
 *
 * @category Peripherals
 */
export declare class PeripheralCANBus extends ComponentAbstract {
    /**
     * @ignore
     */
    used: boolean;
    private id;
    private params;
    /**
     * It is called when data is received.
     * Data is array of bytes.
     *
     * ```javascript
     * // Javascript Example
     * obniz.canbus0.start({mode:"normal", tx :0, rx:1, kbps:100, filter_code: 0, filter_mask: 0});
     * obniz.canbus0.onreceive = function(extended, rtr, id, data) {
     *   console.log(data);
     * }
     * ```
     *
     */
    onreceive?: (extended: boolean, rtr: boolean, id: number, data: number[]) => void;
    constructor(obniz: Obniz, id: number);
    /**
     * Start CAN Bus
     *
     *
     *
     * ```javascript
     * // Javascript Example
     * obniz.canbus0.start({mode:"normal", tx :0, rx:1, kbps:100, filter_code: 0, filter_mask: 0});
     * ```
     *
     * @param params CAN Bus parameters
     */
    start(params: PeripheralCANBusOptions): void;
    /**
     * It only sends data to canbus and does not receive it.
     *
     * ```javascript
     * // Javascript Example
     * obniz.canbus0.start({mode:"normal", tx :0, rx:1, kbps:100, filter_code: 0, filter_mask: 0});
     * obniz.canbus0.send({}, 0x700, [0x12, 0x98]);
     * ```
     *
     * @param data Max length is 1024 bytes.
     */
    send(modes: CANBusSendModes, id: number, data: number[]): void;
    /**
     * @ignore
     */
    isUsed(): boolean;
    /**
     * It ends canbus
     *
     * ```javascript
     * // Javascript Example
     * obniz.canbus0.start({mode:"normal", tx :0, rx:1, kbps:100, filter_code: 0, filter_mask: 0});
     * obniz.canbus0.end();
     * ```
     *
     */
    end(): void;
    /**
     * @ignore
     * @private
     */
    schemaBasePath(): string;
    /**
     * @ignore
     * @private
     */
    protected _reset(): void;
}
export {};
