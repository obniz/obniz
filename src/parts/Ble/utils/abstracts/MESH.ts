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
  public onBatteryLevelNotify: ((battery: number) => void) | null = null;
  public onStatusButtonNotify: (() => void) | null = null;
  public onResponseWriteNotify: ((response: boolean) => void) | null = null;

  // Constant Values
  public static AvailableBleMode = 'Connectable' as const;
  private static readonly LOCAL_NAME_LENGTH_ = 17 as const;

  protected static PREFIX = 'MESH-100';
  protected meshBlock: MeshJs = new MeshJs();

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
   * @param serialnumber
   * @returns
   */
  public static sameSerialNumberBlock(
    peripheral: BleRemotePeripheral,
    serialnumber: string
  ): boolean {
    if (!this.isMESHblock(peripheral)) {
      return false;
    }
    return peripheral.localName?.indexOf(serialnumber) !== -1;
  }

  /**
   * Connect to the services of a MESH
   */
  public async connectWait(): Promise<void> {
    this.prepareConnect();

    await this.peripheral.connectWait();

    this.indicateCharacteristic_ = this.getCharacteristic_(
      this.meshBlock.UUIDS.CHARACTERISTICS.INDICATE
    );

    this.notifyCharacteristic_ = this.getCharacteristic_(
      this.meshBlock.UUIDS.CHARACTERISTICS.NOTIFY
    );

    this.writeCharacteristic_ = this.getCharacteristic_(
      this.meshBlock.UUIDS.CHARACTERISTICS.WRITE
    );

    this.writeWOResponseCharacteristic_ = this.getCharacteristic_(
      this.meshBlock.UUIDS.CHARACTERISTICS.WRITE_WO_RESPONSE
    );

    if (!this.indicateCharacteristic_) {
      return;
    }
    this.indicateCharacteristic_.registerNotify((data) => {
      this.meshBlock.indicate(data);
    });

    if (!this.notifyCharacteristic_) {
      return;
    }
    await this.notifyCharacteristic_.registerNotifyWait((data) => {
      this.meshBlock.notify(data);
    });

    await this.writeWait(this.meshBlock.featureCommand);
  }

  /**
   * getInfoWait()
   *
   * @const
   * @returns
   */
  public async getInfoWait() {
    this.checkConnected();
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
    };
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH.PREFIX) === 0;
  }

  protected prepareConnect(): void {
    this.meshBlock.onBatteryLevelNotify = (battery: number) => {
      if (typeof this.onBatteryLevelNotify !== 'function') {
        return;
      }
      this.onBatteryLevelNotify(battery);
    };
    this.meshBlock.onStatusButtonPressedNotify = () => {
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
      if (typeof this.onResponseWriteNotify !== 'function') {
        return;
      }
      this.onResponseWriteNotify(resp);
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
      .getService(this.meshBlock.UUIDS.SERVICE_ID)!
      .getCharacteristic(uuid);
  }
}
