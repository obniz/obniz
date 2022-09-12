/**
 * @packageDocumentation
 * @module Parts.MINEW
 */
/* eslint rulesdir/non-ascii: 0 */
import {
  ObnizPartsBle,
  ObnizPartsBleMode,
  ObnizPartsBleCompare,
  ObnizBleBeaconStruct,
} from '../../../../obniz/ObnizPartsBleAbstract';

export interface MINEW_Base_Data {
  /**
   * Battery level (0~100%)
   * バッテリー残量 (0~100%)
   */
  // TODO: restore
  // battery: number;
}

/** abstract class common to the MINEW devices MINEWデバイス共通の抽象クラス */
export default abstract class MINEW<
  S extends MINEW_Base_Data
> extends ObnizPartsBle<S> {
  /**
   * Only beacon mode support at the moment
   * 現時点ではビーコンモードのみサポート
   */
  public static readonly AvailableBleMode:
    | ObnizPartsBleMode
    | ObnizPartsBleMode[] = 'Beacon';

  public static readonly ServiceUuids: ObnizPartsBleCompare<string> = 'ffe1';

  public static readonly ServiceDataUUID: ObnizPartsBleCompare<
    [number, number]
  > = [0xe1, 0xff];

  protected static getServiceDataStruct = <T>(
    macAddressIndex: number,
    versionNumber: number,
    additonalData: ObnizBleBeaconStruct<Omit<T, keyof MINEW_Base_Data>>
  ): ObnizPartsBleCompare<ObnizBleBeaconStruct<T>> => ({
    // TODO: delete underscore
    frameType_: {
      index: 0,
      type: 'check',
      data: 0xa1,
    },
    // TODO: delete underscore
    versionNumber_: {
      index: 1,
      type: 'check',
      data: versionNumber,
    },
    // TODO: only 'battery'
    [Object.keys(additonalData).includes('batteryLevel')
      ? 'batteryLevel'
      : 'battery']: {
      index: 2,
      type: 'unsignedNumBE',
    },
    // TODO: delete underscore
    macAddress_: {
      index: macAddressIndex,
      length: 6,
      type: 'check',
    },
    ...additonalData,
  });
}
