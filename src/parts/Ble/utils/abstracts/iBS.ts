/**
 * @packageDocumentation
 * @module Parts.iBS
 */
/* eslint rulesdir/non-ascii: 0 */

import {
  ObnizBleBeaconStructCheck,
  ObnizBleBeaconStructNormal,
  ObnizPartsBle,
} from '../../../../obniz/ObnizPartsBleAbstract';

const magic = {
  1: [0x80, 0xbc],
  1.1: [0x81, 0xbc],
  2: [0x82, 0xbc],
  3: [0x83, 0xbc],
  4: [0x83, 0xbc],
  5: [0x83, 0xbc],
};

// battery:     [9, 11, false, 0.01]
// button:      [11, 0b0001]
// moving:      [11, 0b0010]
// hall_sensor: [11, 0b0100]
// reed:        [11, 0b0100]
// event:       [11, 0b0100]
// fall:        [11, 0b1000]
// accel:       [11, 29, true, 1] 6*3 ???
// temperature: [12, 14, true, 0.01]
// humidity:    [14, 16, true, 1]

type PresetConfigName =
  | 'battery'
  | 'button'
  | 'moving'
  | 'event'
  | 'fall'
  | 'acceleration'
  | 'temperature'
  | 'humidity'
  | 'count'
  | 'user';

/** abstract class common to the iBS series iBSシリーズ共通の抽象クラス */
export abstract class BaseiBS<S> extends ObnizPartsBle<S> {
  public static readonly AvailableBleMode = 'Beacon';

  public static readonly BeaconDataLength: number = 0x12;

  public static readonly CompanyID = [0x0d, 0x00];

  protected static getUniqueData(
    series: keyof typeof magic,
    subtype: number,
    addLength?: number,
    scanResponse?: boolean
  ): { [key in 'magic' | 'subtype']: ObnizBleBeaconStructCheck } {
    return {
      magic: {
        index: 0,
        length: 2,
        type: 'check',
        data: magic[series],
        scanResponse,
      },
      subtype: {
        index: 11 + (addLength ?? 0),
        type: 'check',
        data: subtype,
        scanResponse,
      },
    };
  }

  public static readonly Config: {
    [key in PresetConfigName]: ObnizBleBeaconStructNormal<unknown, never>;
  } = {
    battery: {
      index: 2,
      length: 2,
      type: 'unsignedNumLE',
      multiple: 0.01,
      round: 2,
    },
    button: {
      index: 4,
      type: 'bool0001',
    },
    moving: {
      index: 4,
      type: 'bool0010',
    },
    /** HallSensor / Reed / Event */
    event: {
      index: 4,
      type: 'bool0100',
    },
    fall: {
      index: 4,
      type: 'bool1000',
    },
    acceleration: {
      index: 4,
      length: 18,
      type: 'xyz',
    },
    temperature: {
      index: 5,
      length: 2,
      type: 'numLE',
      multiple: 0.01,
      round: 2,
    },
    humidity: {
      index: 7,
      length: 2,
      type: 'numLE',
    },
    count: {
      index: 7,
      length: 2,
      type: 'unsignedNumLE',
    },
    user: {
      index: 9,
      length: 2,
      type: 'unsignedNumLE',
    },
  };
}

/** abstract class for iBS iBS01のための抽象クラス */
export abstract class BaseiBS01<S> extends BaseiBS<S> {
  public static readonly CompanyID = [0x59, 0x00];
}

export default BaseiBS;
