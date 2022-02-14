/**
 * @packageDocumentation
 * @module Parts.iBS
 */
import { ObnizBleBeaconStructCheck, ObnizBleBeaconStructNormal, ObnizPartsBle } from '../../../../obniz/ObnizPartsBleAbstract';
import { ObnizPartsDataPropertyKey } from "../../../../obniz/ObnizPartsDataPropertyBase";
declare const magic: {
    1: number[];
    1.1: number[];
    2: number[];
    3: number[];
    4: number[];
    5: number[];
};
declare type PresetConfigName = 'battery' | 'button' | 'moving' | 'event' | 'fall' | 'acceleration' | 'temperature' | 'humidity' | 'count' | 'user';
/** abstract class common to the iBS series iBSシリーズ共通の抽象クラス */
export declare abstract class BaseiBS<reqKey extends ObnizPartsDataPropertyKey, optionalKey extends ObnizPartsDataPropertyKey = never> extends ObnizPartsBle<reqKey, optionalKey> {
    static readonly AvailableBleMode = "Beacon";
    static readonly BeaconDataLength: number;
    static readonly CompanyID: number[];
    protected static getUniqueData(series: keyof typeof magic, subtype: number, addLength?: number, scanResponse?: boolean): {
        [key in 'magic' | 'subtype']: ObnizBleBeaconStructCheck;
    };
    static readonly Config: {
        [key in PresetConfigName]: ObnizBleBeaconStructNormal<unknown, never>;
    };
}
/** abstract class for iBS iBS01のための抽象クラス */
export declare abstract class BaseiBS01<reqKey extends ObnizPartsDataPropertyKey, optionalKey extends ObnizPartsDataPropertyKey = never> extends BaseiBS<reqKey, optionalKey> {
    static readonly CompanyID: number[];
}
export default BaseiBS;
