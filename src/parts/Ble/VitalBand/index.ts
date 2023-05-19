/**
 * @packageDocumentation
 * @module Parts.VitalBand
 */
/* eslint rulesdir/non-ascii: 0 */

import {
  ObnizBleBeaconStruct,
  ObnizBleBeaconStructNormal,
  ObnizPartsBle,
} from '../../../obniz/ObnizPartsBleAbstract';

export interface VitalBandOptions {}

type PresetConfigName =
  | 'SN'
  | 'heart_rate'
  | 'body_temp'
  | 'blood_pleasure_high'
  | 'blood_pleasure_low'
  | 'Sp02'
  | 'battery'
  | 'steps';

export interface VitalBand_Data {
  SN: number; // Serial Number (BigEndian 3byte)
  heart_rate: number; // 心拍数 (BigEndian 1byte)
  body_temp: number; // 体温 (LittleEndian 2byte)
  blood_pleasure_high: number; // 血圧-高 (BigEndian 1byte)
  blood_pleasure_low: number; // 血圧-低 (BigEndian 1byte)
  Sp02: number; // saturation of percutaneous oxygen 経皮的酸素飽和度 (BigEndian 1byte)
  battery: number; // バッテリー (BigEndian 1byte)
  steps: number; // 歩数 (LittleEndian 3byte)
}

export default class VitalBand extends ObnizPartsBle<VitalBand_Data> {
  public static readonly AvailableBleMode = 'Beacon';
  public static readonly PartsName = 'VitalBand';
  public static readonly CompanyID = [0xff, 0xff];
  protected readonly staticClass = VitalBand;

  public static readonly Config: {
    [key in PresetConfigName]: ObnizBleBeaconStructNormal<unknown, never>;
  } = {
    SN: {
      type: 'numBE',
      index: 0,
      length: 3,
    },
    heart_rate: {
      type: 'numBE',
      index: 3,
    },
    body_temp: {
      type: 'numLE',
      index: 4,
      length: 2,
      multiple: 0.01,
      round: 2,
    },
    blood_pleasure_high: {
      type: 'numBE',
      index: 6,
    },
    blood_pleasure_low: {
      type: 'numBE',
      index: 7,
    },
    Sp02: {
      type: 'numBE',
      index: 8,
    },
    battery: {
      type: 'numBE',
      index: 9,
    },
    steps: {
      type: 'numLE',
      index: 10,
      length: 3,
    },
  };

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<VitalBand_Data> = {
    SN: VitalBand.Config.SN,
    heart_rate: VitalBand.Config.heart_rate,
    body_temp: VitalBand.Config.body_temp,
    blood_pleasure_high: VitalBand.Config.blood_pleasure_high,
    blood_pleasure_low: VitalBand.Config.blood_pleasure_low,
    Sp02: VitalBand.Config.Sp02,
    battery: VitalBand.Config.battery,
    steps: VitalBand.Config.steps,
  };
}
