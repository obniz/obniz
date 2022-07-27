/* eslint rulesdir/non-ascii: 0 */

import {
  ObnizPartsBle,
  ObnizPartsBleConnectable,
} from '../../../../obniz/ObnizPartsBleAbstract';
import { BleRemoteCharacteristic } from '../../../../obniz';
import BleRemotePeripheral from '../../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { MeshJs } from '../../MESH_js/MeshJs';

export abstract class MESH<S> extends ObnizPartsBleConnectable<null, S> {
  // Event Handler
  public onBatteryNotify: ((battery: number) => void) | null = null;
  public onStatusButtonNotify: (() => void) | null = null;
  public onResponseWrite: ((response: boolean) => void) | null = null;

  // Constant Values
  public static AvailableBleMode = 'Connectable' as const;
  private static readonly LOCAL_NAME_LENGTH_ = 17 as const;

  protected static PREFIX = 'MESH-100';
  protected _mesh: MeshJs = new MeshJs();

  private indicateCharacteristic_: BleRemoteCharacteristic | null = null;
  private notifyCharacteristic_: BleRemoteCharacteristic | null = null;
  private writeCharacteristic_: BleRemoteCharacteristic | null = null;
  private writeWOResponseCharacteristic_: BleRemoteCharacteristic | null = null;

  /**
   *
   * @param peripheral
   * @returns
   */
  public static isMESHblock(peripheral: BleRemotePeripheral): boolean {
    const _name: string | null = peripheral.localName;
    if (!_name) {
      return false;
    }
    if (_name.length !== MESH.LOCAL_NAME_LENGTH_) {
      return false;
    }
    return this._isMESHblock(_name);
  }

  /**
   *
   * @param peripheral
   * @param sirialnumber
   * @returns
   */
  public static sameSirialNumberBlock(
    peripheral: BleRemotePeripheral,
    sirialnumber: string
  ): boolean {
    if (!this.isMESHblock(peripheral)) {
      return false;
    }
    return peripheral.localName?.indexOf(sirialnumber) !== -1;
  }

  /**
   * Connect to the services of a MESH
   */
  public async connectWait(): Promise<void> {
    this.prepareConnect();

    await this.peripheral.connectWait();

    this.indicateCharacteristic_ = this.getCharacteristic_(
      this._mesh.UUIDS.CHARACTERISTICS.INDICATE
    );

    this.notifyCharacteristic_ = this.getCharacteristic_(
      this._mesh.UUIDS.CHARACTERISTICS.NOTIFY
    );

    this.writeCharacteristic_ = this.getCharacteristic_(
      this._mesh.UUIDS.CHARACTERISTICS.WRITE
    );

    this.writeWOResponseCharacteristic_ = this.getCharacteristic_(
      this._mesh.UUIDS.CHARACTERISTICS.WRITE_WO_RESPONSE
    );

    if (!this.indicateCharacteristic_) {
      return;
    }
    this.indicateCharacteristic_.registerNotify((data) => {
      this._mesh.indicate(data);
    });

    if (!this.notifyCharacteristic_) {
      return;
    }
    await this.notifyCharacteristic_.registerNotifyWait((data) => {
      this._mesh.notify(data);
    });

    console.log('connect');

    await this.writeWait(this._mesh.featureCommand);
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH.PREFIX) === 0;
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
    if (!this.writeCharacteristic_) {
      return;
    }
    await this.writeCharacteristic_.writeWait(data, true).then((resp) => {
      if (typeof this.onResponseWrite !== 'function') {
        return;
      }
      this.onResponseWrite(resp);
    });
  }

  protected writeWOResponse(data: number[]) {
    if (!this.writeWOResponseCharacteristic_) {
      return;
    }
    this.writeWOResponseCharacteristic_.writeWait(data, true);
  }

  private getCharacteristic_(uuid: string) {
    return this.peripheral
      .getService(this._mesh.UUIDS.SERVICE_ID)!
      .getCharacteristic(uuid);
  }
}
