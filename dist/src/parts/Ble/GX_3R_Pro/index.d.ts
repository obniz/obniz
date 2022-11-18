/// <reference types="node" />
/// <reference types="node" />
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface } from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface GX_3R_Pro_Options {
}
export interface GX_3R_Pro_Gas_Data {
    displayName: string;
    gasName: string;
    fullScale: string;
    digit: string;
    unit: string;
    value: number;
}
export interface GX_3R_Pro_Data {
    battery: number;
    gas: GX_3R_Pro_Gas_Data[];
}
/** GX_3R_Pro management class GX_3R_Proを管理するクラス */
export default class GX_3R_Pro extends ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    _peripheral: BleRemotePeripheral;
    static readonly partsName = "GX_3R_Pro";
    static readonly availableBleMode = "Connectable";
    private code;
    private event;
    private serialExecutor;
    private gasCharRx?;
    private gasCharTx?;
    private settingCharRx?;
    private settingCharTx?;
    constructor(peripheral: BleRemotePeripheral);
    /**
     * Verify that the received peripheral is from the GX_3R_Pro
     *
     * 受け取ったperipheralがGX_3R_Proのものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the GX_3R_Pro
     *
     * GX_3R_Proかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    connectWait(): Promise<void>;
    sendCommandWait(command: string, subCommand: string, data: number[]): Promise<{
        address: string;
        channel: string;
        command: string;
        subCommand: string;
        data: any;
        dataString: string;
    } | null>;
    calcChecksum(buf: number[]): Buffer;
    parseCommand(data: number[]): {
        address: string;
        channel: string;
        command: string;
        subCommand: string;
        data: any;
        dataString: string;
    } | null;
    private getGasSettingsWait;
    getDataWait(): Promise<GX_3R_Pro_Data | null>;
}
