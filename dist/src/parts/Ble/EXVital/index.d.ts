/**
 * @packageDocumentation
 * @module Parts.EXVital
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface EXVital_Options {
}
export interface EXVital_Data {
    major: number;
    minor: number;
    power: number;
    diastolic_pressure: number;
    systolic_pressure: number;
    arm_temp: number;
    body_temp: number;
    heart_rate: number;
    battery: number;
    steps: number;
}
export default class EXVital extends ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    static readonly partsName = "EXVital";
    static readonly availableBleMode = "Beacon";
    protected static DefaultAdvData: number[];
    getData(): EXVital_Data;
    static getData(peripheral: BleRemotePeripheral): EXVital_Data | null;
    constructor(peripheral: BleRemotePeripheral);
    static isDevice(peripheral: BleRemotePeripheral): boolean;
}
