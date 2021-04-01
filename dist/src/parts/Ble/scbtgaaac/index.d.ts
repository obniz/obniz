/**
 * @packageDocumentation
 * @module Parts.SCBTGAAAC
 */
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";
export interface SCBTGAAACOptions {
}
export default class SCBTGAAAC implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static getData(peripheral: BleRemotePeripheral): string | null;
    private static searchTypeVal;
    _peripheral: null | BleRemotePeripheral;
    constructor();
}
