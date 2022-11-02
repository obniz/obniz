import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';
import Obniz from '../../../obniz';
import BleRemotePeripheral = Obniz.BleRemotePeripheral;
import { BleRemoteService, BleRemoteCharacteristic } from '../../../obniz';
import { HN_300T2Result } from '../HN_300T2';

export interface UC352BLEOptions {}

export interface UC352BLEResult {
  /**
   * weight(kg) 体重(kg)
   */
  weight?: number;
}

export default class UC352BLE implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'UC352BLE',
    };
  }

  public _peripheral: BleRemotePeripheral | null;
  public ondisconnect?: (reason: any) => void;

  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    if (!peripheral.localName) return false;
    return peripheral.localName.startsWith('A&D_UC-352BLE');
  }

  public async pairingWait(): Promise<string | null> {
    if (!this._peripheral) {
      throw new Error('UC352BLE not found');
    }
    this._peripheral.ondisconnect = (reason: any) => {
      if (typeof this.ondisconnect === 'function') {
        this.ondisconnect(reason);
      }
    };
    let key: string | null = null;
    await this._peripheral.connectWait({
      pairingOption: {
        onPairedCallback: (pairingKey) => {
          key = pairingKey;
        },
      },
    });
    return key;
  }

  public async getDataWait(pairingKeys: string) {
    if (!this._peripheral) {
      throw new Error('UC352BLE not found');
    }

    let result: UC352BLEResult = {};

    await this._peripheral.connectWait({
      pairingOption: { keys: pairingKeys },
      waitUntilPairing: true,
    });

    const service = this._peripheral!.getService('181D');
    const chara = await service?.getCharacteristic('2A9D');

    const waitDisconnect = new Promise<UC352BLEResult>((resolve, reject) => {
      if (!this._peripheral) return;
      this._peripheral.ondisconnect = (reason: any) => {
        resolve(result);
      };
    });

    await chara?.registerNotifyWait((data) => {
      const _result: HN_300T2Result = {};
      _result.weight = ((data[2] << 8) | data[1]) * 0.005;
      result = _result;
    });

    return await waitDisconnect;
  }

  constructor(peripheral: BleRemotePeripheral) {
    if (!peripheral || !UC352BLE.isDevice(peripheral)) {
      throw new Error('peripheral is not UC352BLE');
    }
    this._peripheral = peripheral;
  }
}
