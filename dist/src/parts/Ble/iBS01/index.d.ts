/**
 * @packageDocumentation
 * @module Parts.iBS01
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS01Options {
}
export interface IBS01_Data {
    battery: number;
    button: boolean;
    /**
     * @deprecated use iBS01H library
     */
    moving: boolean;
    /**
     * @deprecated use iBS01H or iBS01G library
     */
    hall_sensor: boolean;
    /**
     * @deprecated use iBS01G library
     */
    fall: boolean;
}
export default class IBS01 implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral, strictCheck?: boolean): boolean;
    static getData(peripheral: BleRemotePeripheral, strictCheck?: boolean): IBS01_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
}
