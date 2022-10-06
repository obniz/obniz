/**
 * @packageDocumentation
 * @module Parts.SCBTGAAAC
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface SCBTGAAACOptions {
}
/** SCBTGAAAC management class SCBTGAAACを管理するクラス */
export default class SCBTGAAAC implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the SCBTGAAAC
     *
     * 受け取ったPeripheralがSCBTGAAACのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the SCBTGAAAC
     *
     * SCBTGAAACかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get leakage data from the SCBTGAAAC
     *
     * Get advertisement sent out by generating power at the leak
     *
     * SCBTGAAACから漏水データを取得する
     *
     * 漏水で発電することによって発信されたadvertisementを取得します
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns device name デバイス名
     */
    static getData(peripheral: BleRemotePeripheral): string | null;
    private static searchTypeVal;
    _peripheral: null | BleRemotePeripheral;
}
