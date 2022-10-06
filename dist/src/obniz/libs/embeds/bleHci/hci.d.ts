/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
/// <reference types="node" />
/// <reference types="node" />
import { ObnizDevice } from '../../../ObnizDevice';
export declare type EventHandler = (...args: any) => any;
export declare class ObnizBLEHci {
    Obniz: ObnizDevice;
    timeout: number;
    hciProtocolOnSocketData: any;
    protected _eventHandlerQueue: {
        [key: string]: EventHandler[];
    };
    /**
     * @ignore
     * @private
     */
    _extended: boolean;
    private defaultExtended;
    constructor(Obniz: ObnizDevice, extended: boolean);
    /**
     * @ignore
     * @private
     */
    _reset(keepExtended: boolean): void;
    /**
     * Initialize BLE HCI module
     */
    init(): void;
    /**
     * Deinitalize BLE HCI module
     */
    end(): void;
    /**
     * write HCI command to HCI module
     *
     * @param hciCommand
     */
    write(hciCommand: number[]): void;
    /**
     * @ignore
     * @param obj
     */
    notified(obj: any): void;
    /**
     * Callback on HCI command received.
     *
     * @param data
     */
    onread(data: any): void;
    /**
     * @ignore
     * @private
     * @param promise
     * @param option
     * @param option.timeout Timeout number in seconds. If not specified. default timeout is applied. If null specified, never timeout.
     * @param option.waitingFor Readable description of command for waiting. Printed when Error or timeout occured.
     */
    timeoutPromiseWrapper<T>(promise: Promise<T>, _option: {
        timeout?: number | null;
        waitingFor: string;
        onTimeout?: () => Promise<void>;
    }): Promise<T>;
    readWait(binaryFilter: number[], option: {
        timeout?: number | null;
        waitingFor: string;
        onTimeout?: () => Promise<void>;
    }): Promise<Buffer>;
    protected onceQueue(binaryFilter: number[], func: EventHandler): void;
    protected validate(str: string, json: any): boolean;
    protected encodeBinaryFilter(binary: number[]): string;
    protected decodeBinaryFilter(str: string): number[];
}
