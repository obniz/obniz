/**
 * @packageDocumentation
 * @module Parts.iBS
 */
import { BleRemotePeripheral } from '../../../obniz';
import { ObnizBleBeaconStructCheck, ObnizBleBeaconStructNormal, ObnizPartsBle, ObnizPartsBleMode } from '../../../obniz/ObnizPartsBleInterface';
declare const magic: {
    1: number[];
    1.1: number[];
    2: number[];
    3: number[];
    4: number[];
};
declare type PresetConfigName = 'battery' | 'button' | 'moving' | 'event' | 'fall' | 'acceleration' | 'temperature' | 'humidity';
export declare class BaseIBS<S> extends ObnizPartsBle<S> {
    static readonly AvailableBleMode: ObnizPartsBleMode;
    protected static readonly Address: undefined;
    protected static readonly LocalName: undefined;
    protected static readonly CompanyID: number[];
    protected static getUniqueData(series: keyof typeof magic, subtype: number, addLength?: number, scanResponse?: boolean): {
        [key in 'magic' | 'subtype']: ObnizBleBeaconStructCheck;
    };
    protected static readonly Config: {
        [key in PresetConfigName]: ObnizBleBeaconStructNormal<unknown, never>;
    };
    /**
     * @deprecated
     */
    static getData(peripheral: BleRemotePeripheral): unknown | null;
}
export declare class BaseIBS01<S> extends BaseIBS<S> {
    protected static readonly CompanyID: number[];
}
export default BaseIBS;
