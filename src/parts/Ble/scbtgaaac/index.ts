/**
 * @packageDocumentation
 * @module Parts.SCBTGAAAC
 */
/* eslint rulesdir/non-ascii: 0 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
} from '../../../obniz/ObnizPartsBleAbstract';

export interface SCBTGAAAC_Options {}

export type SCBTGAAAC_Data = string;

/** SCBTGAAAC management class SCBTGAAACを管理するクラス */
export default class SCBTGAAAC extends ObnizPartsBle<SCBTGAAAC_Data> {
  public static readonly PartsName = 'SCBTGAAAC';

  public static readonly AvailableBleMode = 'Beacon';

  public static readonly BeaconDataLength = 0x1a;

  public static readonly CompanyID = [0x31, 0x07];

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<{
    minor: number;
  }> = {
    magic: {
      index: 0,
      type: 'check',
      data: 0x02,
    },
    data_length: {
      index: 1,
      type: 'check',
      data: 0x15,
    },
    uuid: {
      index: 2,
      length: 16,
      type: 'check',
      data: [
        0x5d,
        0x49,
        0x0d,
        0x6c,
        0x7e,
        0xb9,
        0x47,
        0x4e,
        0x81,
        0x60,
        0x45,
        0xbd,
        0xe9,
        0x99,
        0x11,
        0x9a,
      ],
    },
    major: {
      index: 18,
      length: 2,
      type: 'check',
      data: [0x00, 0x03],
    },
    minor: {
      index: 20,
      length: 2,
      type: 'unsignedNumBE',
    },
    power: {
      index: 22,
      type: 'check',
      data: 0xc3,
    },
  };

  public /* override */ getData() {
    const data = (super.getData() as unknown) as { minor: number };
    return `03-${('00000' + data.minor).slice(-5)}`;
  }

  protected readonly staticClass = SCBTGAAAC;
}
