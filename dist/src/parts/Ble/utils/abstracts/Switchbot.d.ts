/**
 * @packageDocumentation
 * @module Parts.Switchbot
 */
import { BleConnectSetting, BleRemotePeripheral } from '../../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface } from '../../../../obniz/ObnizPartsBleInterface';
import { BleRemoteCommandSequence } from '../../../../obniz/libs/embeds/bleHci/bleRemoteCommandSequence';
export declare class Switchbot implements ObnizPartsBleInterface {
    static getServiceDataPayload(peripheral: BleRemotePeripheral, deviceType: number | number[], serviceDataPayloadLength: number): null | number[];
    static isSwitchbotDevice(peripheral: BleRemotePeripheral, deviceType: number | number[], serviceDataPayloadLength: number): boolean;
    _peripheral: BleRemotePeripheral;
    ondisconnect?: (reason: any) => void;
    protected _commandSequence?: BleRemoteCommandSequence;
    constructor(peripheral: BleRemotePeripheral);
    connectWait(setting?: Pick<BleConnectSetting, 'retry' | 'forceConnect'>): Promise<void>;
    protected _createCommand(command: number, payload: number[]): number[];
}
