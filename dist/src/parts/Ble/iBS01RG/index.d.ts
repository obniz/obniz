/**
 * @packageDocumentation
 * @module Parts.iBS01RG
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType, Triaxial } from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS01 } from '../iBS';
export interface iBS01RGOptions {
}
export interface iBS01RG_Data {
    battery: number;
    active: boolean;
    button: boolean;
    acceleration: Triaxial[];
}
export default class iBS01RG extends BaseiBS01<iBS01RG_Data> {
    static readonly PartsName: PartsType;
    protected static readonly BeaconDataLength = 25;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01RG_Data>;
    protected readonly static: typeof ObnizPartsBle;
}
