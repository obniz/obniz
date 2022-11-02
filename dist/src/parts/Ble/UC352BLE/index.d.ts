import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
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
    pairingWait(): Promise<string | null>;
    getDataWait(pairingKeys: string): Promise<UC352BLEResult>;
    constructor(peripheral: BleRemotePeripheral);
}
