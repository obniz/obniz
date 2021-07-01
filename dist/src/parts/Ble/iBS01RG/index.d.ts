/**
 * @packageDocumentation
 * @module Parts.iBS01RG
 */
import { Triaxial } from '../../../obniz/ObnizParts';
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS01 } from '../utils/abstracts/iBS';
export interface iBS01RGOptions {
}
export interface iBS01RG_Data {
    battery: number;
    active: boolean;
    button: boolean;
    acceleration: Triaxial[];
}
export default class iBS01RG extends BaseiBS01<iBS01RG_Data> {
    static readonly PartsName = "iBS01RG";
    static readonly BeaconDataLength = 25;
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01RG_Data>;
    protected readonly staticClass: typeof iBS01RG;
}
