import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';
import Obniz from '../../../obniz';
import BleRemotePeripheral = Obniz.BleRemotePeripheral;

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

  /**
   * Pair with the device
   *
   * デバイスとペアリング 裏のボタンを押しながら起動してペアリングする必要あり
   *
   * @returns pairing key ペアリングキー
   */
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

  /**
   * Get Weight Data from Device
   *
   * デバイスから計測データをとる
   *
   * @returns 受け取ったデータ
   */
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
      const _result: UC352BLEResult = {};
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
