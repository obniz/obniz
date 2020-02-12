/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import emitter = require("eventemitter3");
import ObnizBLE from "./ble";
import BlePeripheral from "./blePeripheral";
import { UUID } from "./bleTypes";
export interface BleScanTarget {
    uuids?: UUID[];
    localName?: string;
}
export interface BleScanSetting {
    duration?: number;
    duplicate?: boolean;
}
/**
 * @category Use as Central
 */
export default class BleScan {
    scanTarget: BleScanTarget;
    scanSettings: BleScanSetting;
    obnizBle: ObnizBLE;
    emitter: emitter;
    scanedPeripherals: BlePeripheral[];
    private _timeoutTimer?;
    constructor(obnizBle: ObnizBLE);
    start(target?: BleScanTarget, settings?: BleScanSetting): void;
    startOneWait(target: BleScanTarget, settings: BleScanSetting): Promise<BlePeripheral>;
    startAllWait(target: BleScanTarget, settings: BleScanSetting): Promise<BlePeripheral[]>;
    end(): void;
    isTarget(peripheral: any): boolean;
    onfinish(data: any): void;
    onfind(params: any): void;
    notifyFromServer(notifyName: string, params: any): void;
    clearTimeoutTimer(): void;
}
