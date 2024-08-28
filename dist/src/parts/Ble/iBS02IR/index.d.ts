/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */
import { ObnizPartsBleMode } from '../../../obniz/ObnizPartsBleAbstract';
import { iBS02IR_Data } from './base';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface } from '../../../obniz/ObnizPartsBleInterface';
/** iBS02IR management class iBS02IRを管理するクラス */
export default class iBS02IR extends ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static isDeviceWithMode(peripheral: BleRemotePeripheral, mode: ObnizPartsBleMode): boolean;
    static getData(peripheral: BleRemotePeripheral): iBS02IR_Data | null;
    static getManufacturer(peripheral: BleRemotePeripheral): 'ranger' | 'ingics' | null;
}
