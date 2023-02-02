/**
 * @packageDocumentation
 * @module Parts.Talia
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface TaliaOptions {
}
export interface Talia_Data {
    address: string;
    primary_count: number;
    secondary_count: number;
    flow_enter: number;
    flow_exit: number;
}
export default class Talia implements ObnizPartsBleInterface {
    _peripheral: BleRemotePeripheral | null;
    static info(): ObnizPartsBleInfo;
    /**
     * UIDフレームとTLMフレームの2種類のadがあり、UIDフレームからしかTaliaかどうか判断できない。
     * TLMフレームの判断はクライアント側でdevice addressをキャッシュして行う。
     */
    static isDeviceFromUid(peripheral: BleRemotePeripheral): boolean;
    /**
     * TLMフレームからデータを取得する。
     * getMode()で先にUIDかTLMか判断した方が良い。
     */
    static getData(peripheral: BleRemotePeripheral): Talia_Data | null;
    /**
     * adのモード(UID or TLM)を返す。
     */
    static getMode(peripheral: BleRemotePeripheral): string | undefined;
}
