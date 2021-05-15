/**
 * @packageDocumentation
 * @module Parts.M5StickC_ToF
 */
import Obniz from '../../../obniz';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import VL53L0X from '../../DistanceSensor/VL53L0X';
export declare type M5StickC_ToFOptions = VL53L0X;
export default class M5StickC_ToF extends VL53L0X {
    static info(): ObnizPartsInfo;
    wired(obniz: Obniz): void;
}
