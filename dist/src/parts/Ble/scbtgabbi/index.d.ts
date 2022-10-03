/**
 * @packageDocumentation
 * @module Parts.SCBTGABBI
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface SCBTGABBIOptions {
}
/** SCBTGABBI management class SCBTGABBI */
export default class SCBTGABBI implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the SCBTGABBI
     *
     * 受け取ったPeripheralがSCBTGABBIのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the SCBTGABBI
     *
     * SCBTGABBIかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get leakage data from the SCBTGABBI
     *
     * Get advertisement sent out by generating power at the leak
     *
     * SCBTGABBIから漏水データを取得する
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
