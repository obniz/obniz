/**
 * @packageDocumentation
 * @module Parts.iBS01RG
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType, Triaxial } from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS01 } from '../iBS';
export interface IBS01RGOptions {
}
export interface IBS01RG_Data {
    battery: number;
    active: boolean;
    button: boolean;
    acceleration: Triaxial[];
}
export default class IBS01RG extends BaseIBS01<IBS01RG_Data> {
    static readonly PartsName: PartsType;
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS01RG_Data>;
    protected static: typeof ObnizPartsBle;
}
