import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import Obniz from '../../../obniz';
import BleRemotePeripheral = Obniz.BleRemotePeripheral;
export interface UC352BLEOptions {
}
export interface UC352BLEResult {
    /**
     * weight(kg) 体重(kg)
     */
    weight?: number;
}
export default class UC352BLE implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Pair with the device
     *
     * デバイスとペアリング 裏のボタンを押しながら起動してペアリングする必要あり
     *
     * @returns pairing key ペアリングキー
     */
    pairingWait(): Promise<string | null>;
    /**
     * Get Weight Data from Device
     *
     * デバイスから計測データをとる
     *
     * @returns 受け取ったデータ
     */
    getDataWait(pairingKeys: string): Promise<UC352BLEResult>;
    constructor(peripheral: BleRemotePeripheral);
}
