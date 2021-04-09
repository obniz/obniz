/**
 * @packageDocumentation
 * @module Parts.iBS01H
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS01HOptions {
}
export interface IBS01H_Data {
    battery: number;
    button: boolean;
    hall_sensor: boolean;
}
export default class IBS01H implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static getData(peripheral: BleRemotePeripheral): IBS01H_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
    constructor();
}
