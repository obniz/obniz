/**
 * @packageDocumentation
 * @module Parts.iBS
 */
import { ObnizBleBeaconStructCheck, ObnizBleBeaconStructNormal, ObnizPartsBle, ObnizPartsBleMode } from '../../../obniz/ObnizPartsBleInterface';
declare const magic: {
    1: number[];
    1.1: number[];
    2: number[];
    3: number[];
    4: number[];
};
declare type PresetConfigName = 'battery' | 'button' | 'moving' | 'event' | 'fall' | 'acceleration' | 'temperature' | 'humidity' | 'user';
export declare class BaseiBS<S> extends ObnizPartsBle<S> {
    static readonly AvailableBleMode: ObnizPartsBleMode;
    protected static readonly CompanyID: number[];
    protected static getUniqueData(series: keyof typeof magic, subtype: number, addLength?: number, scanResponse?: boolean): {
        [key in 'magic' | 'subtype']: ObnizBleBeaconStructCheck;
    };
    protected static readonly Config: {
        [key in PresetConfigName]: ObnizBleBeaconStructNormal<unknown, never>;
    };
}
export declare class BaseiBS01<S> extends BaseiBS<S> {
    protected static readonly CompanyID: number[];
}
export default BaseiBS;
