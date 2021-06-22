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

export interface iBS04IOptions {}

export interface iBS04I_Data extends IBeacon {
  battery: number;
  button: boolean;
}

export default class iBS04I extends BaseiBS<iBS04I_Data> {
  public static readonly PartsName: PartsType = 'iBS04i';

  protected static readonly CompanyID = iBeaconCompanyID;

  protected static readonly CompanyID_ScanResponse = BaseiBS.CompanyID;

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS04I_Data> = {
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

  protected readonly static = iBS04I as typeof ObnizPartsBle;
}
