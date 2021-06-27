/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */

import { IBeacon } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  iBeaconCompanyID,
  iBeaconData,
  ObnizBleBeaconStruct,
} from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../iBS';

export interface iBS04iOptions {}

export interface iBS04i_Data extends IBeacon {
  battery: number;
  button: boolean;
}

export default class iBS04i extends BaseiBS<iBS04i_Data> {
  public static readonly PartsName = 'iBS04i';

  public static readonly CompanyID = iBeaconCompanyID;

  public static readonly CompanyID_ScanResponse = BaseiBS.CompanyID;

  public static readonly BeaconDataLength = 0x1a;

  public static readonly BeaconDataLength_ScanResponse =
    BaseiBS.BeaconDataLength;

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS04i_Data> = {
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

  protected readonly staticClass = iBS04i;
}
