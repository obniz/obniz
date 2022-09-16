/**
 * @packageDocumentation
 * @module Parts.MINEW
 */
import { ObnizPartsBle, ObnizPartsBleMode, ObnizPartsBleCompare, ObnizBleBeaconStruct } from '../../../../obniz/ObnizPartsBleAbstract';
export interface MINEW_Base_Data {
}
/** abstract class common to the MINEW devices MINEWデバイス共通の抽象クラス */
export default abstract class MINEW<S extends MINEW_Base_Data> extends ObnizPartsBle<S> {
    /**
     * Only beacon mode support at the moment
     * 現時点ではビーコンモードのみサポート
     */
    static readonly AvailableBleMode: ObnizPartsBleMode | ObnizPartsBleMode[];
    static readonly ServiceUuids: ObnizPartsBleCompare<string>;
    static readonly ServiceDataUUID: ObnizPartsBleCompare<[
        number,
        number
    ]>;
    protected static getServiceDataStruct: <T>(macAddressIndex: number, versionNumber: number, additonalData: ObnizBleBeaconStruct<Omit<T, never>>) => ObnizPartsBleCompare<ObnizBleBeaconStruct<T>>;
}
