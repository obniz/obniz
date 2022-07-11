/* eslint rulesdir/non-ascii: 0 */

import {
  ObnizPartsBle,
  ObnizPartsBleConnectable,
} from '../../../../obniz/ObnizPartsBleAbstract';
import { BleRemoteCharacteristic } from '../../../../obniz';
import BleRemotePeripheral from '../../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { MESH_js } from '../../MESH_js';

export abstract class MESH<S> extends ObnizPartsBleConnectable<null, S> {
  // event handler
  public onBatteryNotify: ((battery: number) => void) | null = null;
  public onStatusButtonNotify: (() => void) | null = null;
  public onResponseWrite: ((response: boolean) => void) | null = null;

  public static AvailableBleMode = 'Connectable' as const;

  protected static _LocalName = 'MESH-100';
  protected _mesh: MESH_js = new MESH_js();

  private _indicateCharacteristic: BleRemoteCharacteristic | null = null;
  private _notifyCharacteristic: BleRemoteCharacteristic | null = null;
  private _writeCharacteristic: BleRemoteCharacteristic | null = null;
  private _writeWOResponseCharacteristic: BleRemoteCharacteristic | null = null;

  private static readonly LOCAL_NAME_LENGTH = 17;

  public static isMESHblock(peripheral: BleRemotePeripheral): boolean {
    if (!peripheral.localName) {
      return false;
    }
    if (peripheral.localName.length !== MESH.LOCAL_NAME_LENGTH) {
      return false;
    }
    return this._isMESHblock(peripheral.localName);
  }

  /**
   * Connect to the services of a MESH
   */
  public async connectWait(): Promise<void> {
    this.prepareConnect();

    await this.peripheral.connectWait();

    this._indicateCharacteristic = this._getCharacteristic(
      this._mesh.UUIDS.characteristics.Indicate
    );

    this._notifyCharacteristic = this._getCharacteristic(
      this._mesh.UUIDS.characteristics.Notify
    );

    this._writeCharacteristic = this._getCharacteristic(
      this._mesh.UUIDS.characteristics.Write
    );

    this._writeWOResponseCharacteristic = this._getCharacteristic(
      this._mesh.UUIDS.characteristics.WriteWOResponse
    );

    if (!this._indicateCharacteristic) {
      return;
    }
    this._indicateCharacteristic.registerNotify((data) => {
      this._mesh.indicate(data);
    });

    if (!this._notifyCharacteristic) {
      return;
    }
    await this._notifyCharacteristic.registerNotifyWait((data) => {
      this._mesh.notify(data);
    });

    console.log('connect');

    await this._writeFeatureWait();
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH._LocalName) === 0;
  }

  protected prepareConnect(): void {
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

  protected async writeWait(data: number[]): Promise<void> {
    if (!this._writeCharacteristic) {
      return;
    }
    await this._writeCharacteristic.writeWait(data, true).then((resp) => {
      if (typeof this.onResponseWrite !== 'function') {
        return;
      }
      this.onResponseWrite(resp);
    });
  }

  protected writeWOResponse(data: number[]) {
    if (!this._writeWOResponseCharacteristic) {
      return;
    }
    this._writeWOResponseCharacteristic.writeWait(data, true);
  }

  private _getCharacteristic(uuid: string) {
    return this.peripheral
      .getService(this._mesh.UUIDS.serviceId)!
      .getCharacteristic(uuid);
  }

  private async _writeFeatureWait(): Promise<void> {
    await this.writeWait(this._mesh.feature);
  }
}
