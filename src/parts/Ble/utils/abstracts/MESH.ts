/* eslint rulesdir/non-ascii: 0 */

import {
  ObnizPartsBle,
  ObnizPartsBleConnectable,
} from '../../../../obniz/ObnizPartsBleAbstract';
import { BleRemoteCharacteristic } from '../../../../obniz';
import BleRemotePeripheral from '../../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { MESH_js } from '../../MESH_js';

export abstract class MESH<S> extends ObnizPartsBleConnectable<null, S> {
  protected static _LocalName = 'MESH-100';
  protected _mesh: MESH_js = new MESH_js();

  protected _UUIDS = {
    serviceId: '72C90001-57A9-4D40-B746-534E22EC9F9E',
    characteristicIndicate: '72c90005-57a9-4d40-b746-534e22ec9f9e',
    characteristicNotify: '72c90003-57a9-4d40-b746-534e22ec9f9e',
    characteristicWrite: '72c90004-57a9-4d40-b746-534e22ec9f9e',
    characteristicWriteWO: '72c90002-57a9-4d40-b746-534e22ec9f9e',
  };

  protected _indicateCharacteristic: BleRemoteCharacteristic | null = null;
  protected _notifyCharacteristic: BleRemoteCharacteristic | null = null;
  protected _writeCharacteristic: BleRemoteCharacteristic | null = null;
  protected _writeWOCharacteristic: BleRemoteCharacteristic | null = null;

  // event handler
  public onBatteryNotify: ((battery: number) => void) | null = null;
  public onStatusButtonNotify: (() => void) | null = null;

  public static isMESHblock(peripheral: BleRemotePeripheral) {
    if (!peripheral.localName) {
      return false;
    }
    return this._isMESHblock(peripheral.localName);
  }

  protected static _isMESHblock(name: string) {
    return name.indexOf(MESH._LocalName) !== -1;
  }

  /**
   * Connect to the services of a device
   *
   * デバイスのサービスに接続
   */
  public async connectWait(): Promise<void> {
    // await super.connectWait();
    this.prepareConnect();

    await this.peripheral.connectWait();

    this._indicateCharacteristic = this._getCharacteristic(
      this._UUIDS.characteristicIndicate
    );

    this._notifyCharacteristic = this._getCharacteristic(
      this._UUIDS.characteristicNotify
    );

    this._writeCharacteristic = this._getCharacteristic(
      this._UUIDS.characteristicWrite
    );

    this._writeWOCharacteristic = this._getCharacteristic(
      this._UUIDS.characteristicWriteWO
    );

    if (!this._indicateCharacteristic) {
      return;
    }
    await this._indicateCharacteristic.registerNotify((data) => {
      console.log('data : ' + data);
    });

    await this._notifyCharacteristic?.registerNotifyWait((data) => {
      this._notify(data);
    });

    console.log('connect');

    await this.wirteFeatureWait();
  }

  protected _notify(data: any) {
    console.log('Notify : ' + data);
  }

  protected prepareConnect() {
    this._mesh.onBattery = (battery: number) => {
      if (typeof this.onBatteryNotify !== 'function') {
        return;
      }
      this.onBatteryNotify(battery);
    };
    this._mesh.onStatusButtonPressed = () => {
      if (typeof this.onStatusButtonNotify !== 'function') {
        return;
      }
      this.onStatusButtonNotify();
    };
  }

  private _getCharacteristic(uuid: string) {
    return this.peripheral
      .getService(this._UUIDS.serviceId)!
      .getCharacteristic(uuid);
  }

  public async wirteFeatureWait(): Promise<void> {
    try {
      if (!this._writeCharacteristic) {
        return;
      }
      if (this._writeCharacteristic === null) {
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
    await this._writeCharacteristic
      .writeWait(this._mesh.feature(), true)
      .then((resp) => {
        console.log('response: ' + resp);
      });
  }

  // public setBatteryNotify(func: (val: number) => void) {
  //   console.log(typeof this.onBatteryNotify + '::: before');
  //   this.onBatteryNotify = (val) => {
  //     func(val);
  //   };
  //   console.log(typeof this.onBatteryNotify + '::: after');
  // }
}
