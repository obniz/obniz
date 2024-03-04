/**
 * @packageDocumentation
 * @module Parts.Switchbot_PlugMini
 */
import { BinaryAnalyzer } from 'binary-analyzer';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import { Switchbot } from '../utils/abstracts/Switchbot';
export interface Switchbot_PlugMiniOptions {
}
/**
 * advertisement data from Switchbot_PlugMini
 *
 * Switchbot_PlugMiniからのadvertisementデータ
 */
export interface Switchbot_PlugMini_Data {
    sequenceNumber: number;
    powerState: 'on' | 'off' | null;
    hasDelay: boolean;
    hasTimer: boolean;
    alreadySyncTime: boolean;
    wifiRssi: number;
    overload: boolean;
    power: number;
}
/** Switchbot_PlugMini management class Switchbot_PlugMiniを管理するクラス */
export default class Switchbot_PlugMini extends Switchbot {
    static info(): ObnizPartsBleInfo;
    static readonly parser: BinaryAnalyzer<{
        manufacture: {
            byte12_13: {
                overload: boolean;
                power: number;
            };
        } & {
            wifiRssi: number;
        } & {
            byte10: {
                hasDelay: boolean;
                hasTimer: boolean;
                alreadySyncTime: boolean;
            };
        } & {
            powerState: "off" | "on" | null;
        } & {
            sequenceNumber: number;
        } & {
            macAddress: number[];
        } & {
            companyId: number[];
        } & {
            type: number[];
        } & {
            length: number[];
        };
    } & {
        flag: number[];
    }>;
    static getPayload(peripheral: BleRemotePeripheral): ({
        manufacture: {
            byte12_13: {
                overload: boolean;
                power: number;
            };
        } & {
            wifiRssi: number;
        } & {
            byte10: {
                hasDelay: boolean;
                hasTimer: boolean;
                alreadySyncTime: boolean;
            };
        } & {
            powerState: "off" | "on" | null;
        } & {
            sequenceNumber: number;
        } & {
            macAddress: number[];
        } & {
            companyId: number[];
        } & {
            type: number[];
        } & {
            length: number[];
        };
    } & {
        flag: number[];
    }) | null;
    /**
     * Verify that the received peripheral is from the Switchbot_PlugMini
     *
     * 受け取ったPeripheralがSwitchbot_PlugMiniのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Switchbot_PlugMini
     *
     * Switchbot_PlugMiniかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the Switchbot_PlugMini
     *
     * Switchbot_PlugMiniからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Switchbot_PlugMini Switchbot_PlugMiniから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): Switchbot_PlugMini_Data | null;
}
