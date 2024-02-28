import { BleRemoteCharacteristic } from './bleRemoteCharacteristic';
export declare class BleRemoteCommandSequence {
    private _toTargetCharacteristic;
    private _fromTargetCharacteristic;
    private _commandCallback;
    private _setupFinishd;
    private _transactionLimit;
    constructor(_toTargetCharacteristic: BleRemoteCharacteristic, _fromTargetCharacteristic: BleRemoteCharacteristic);
    setupWait(): Promise<void>;
    transactionWait(data: number[], timeout?: number): Promise<number[]>;
}
