/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
import { iBS02IR_Data } from './base';
/** iBS02IR management class iBS02IRを管理するクラス */
export default class iBS02IR_Ingics extends BaseiBS<iBS02IR_Data> {
    static readonly PartsName = "iBS02IR_Ingics";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS02IR_Data>;
    protected readonly staticClass: typeof iBS02IR_Ingics;
}
