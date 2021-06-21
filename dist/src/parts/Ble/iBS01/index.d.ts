/**
 * @packageDocumentation
 * @module Parts.iBS01
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS01 } from '../iBS';
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
/**
 * @deprecated
 * Recommend use iBS01G, iBS01H, iBS01T
 * Use only if you are using an old iBS01 series sensor
 */
export default class IBS01 extends BaseIBS01<IBS01_Data> {
    static readonly PartsName: PartsType;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS01_Data>;
    protected static: typeof ObnizPartsBle;
}
