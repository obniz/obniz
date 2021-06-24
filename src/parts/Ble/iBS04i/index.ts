/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */

import { IBeacon } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  iBeaconCompanyID,
  iBeaconData,
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS } from '../iBS';

export interface iBS04iOptions {}

export interface iBS04i_Data extends IBeacon {
  battery: number;
  button: boolean;
}

export default class iBS04i extends BaseiBS<iBS04i_Data> {
  public static readonly PartsName: PartsType = 'iBS04i';

  protected static readonly CompanyID = iBeaconCompanyID;

  protected static readonly CompanyID_ScanResponse = BaseiBS.CompanyID;

  protected static readonly BeaconDataLength = 0x1a;

  protected static readonly BeaconDataLength_ScanResponse = 0x12;

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS04i_Data> = {
    battery: {
      ...BaseiBS.Config.battery,
      scanResponse: true,
    },
    button: {
      ...BaseiBS.Config.button,
      scanResponse: true,
    },
    ...BaseiBS.getUniqueData(4, 0x18, 0, true),
    ...iBeaconData,
  };

  protected readonly static = iBS04i as typeof ObnizPartsBle;
}
