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
import { BaseIBS } from '../iBS';

export interface IBS04IOptions {}

export interface IBS04I_Data extends IBeacon {
  battery: number;
  button: boolean;
  user: number;
}

export default class IBS04I extends BaseIBS<IBS04I_Data> {
  public static readonly PartsName: PartsType = 'iBS04i';

  protected static readonly CompanyID = iBeaconCompanyID;

  protected static readonly CompanyID_ScanResponse = BaseIBS.CompanyID;

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS04I_Data> = {
    battery: {
      ...BaseIBS.Config.battery,
      scanResponse: true,
    },
    button: {
      ...BaseIBS.Config.button,
      scanResponse: true,
    },
    reserved: {
      index: 5,
      length: 4,
      type: 'check',
      data: [0xff, 0xff, 0xff, 0xff],
      scanResponse: true,
    },
    user: {
      index: 9,
      length: 2,
      type: 'unsignedNumLE',
      scanResponse: true,
    },
    ...BaseIBS.getUniqueData(4, 0x18, 0, true),
    ...iBeaconData,
  };

  protected static = IBS04I as typeof ObnizPartsBle;
}
