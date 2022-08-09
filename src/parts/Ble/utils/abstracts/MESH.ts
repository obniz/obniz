/* eslint rulesdir/non-ascii: 0 */

import {
  ObnizPartsBle,
  ObnizPartsBleConnectable,
} from '../../../../obniz/ObnizPartsBleAbstract';
import { BleRemoteCharacteristic } from '../../../../obniz';
import BleRemotePeripheral from '../../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { Base } from '../../MESH_js/block/Base';

export abstract class MESH<S> extends ObnizPartsBleConnectable<null, S> {
  // Event Handler
  public onBatteryLevel: ((battery: number) => void) | null = null;
  public onStatusButtonPressed: (() => void) | null = null;
  public onWriteResponse: ((response: boolean) => void) | null = null;

  // Constant Values
  public static AvailableBleMode = 'Connectable' as const;
  private static readonly LOCAL_NAME_LENGTH_ = 17 as const;

  protected static PREFIX = 'MESH-100';
  protected meshBlock: Base = new Base();
  protected requestId = new MeshRequestId();

  private indicateCharacteristic_: BleRemoteCharacteristic | null = null;
  private notifyCharacteristic_: BleRemoteCharacteristic | null = null;
  private writeCharacteristic_: BleRemoteCharacteristic | null = null;
  private writeWOResponseCharacteristic_: BleRemoteCharacteristic | null = null;

  /**
   * Check MESH block
   *
   * @param peripheral
   * @param opt_serialnumber
   * @returns
   */
  public static isMESHblock(
    peripheral: BleRemotePeripheral,
    opt_serialnumber = ''
  ): boolean {
    const _name: string | null = peripheral.localName;
    if (!_name) {
      return false;
    }
    if (_name.length !== MESH.LOCAL_NAME_LENGTH_) {
      return false;
    }
    if (opt_serialnumber !== '' && _name.indexOf(opt_serialnumber) === -1) {
      return false;
    }
    return this._isMESHblock(_name);
  }

  /**
   * Connect to the services of MESH
   *
   * @returns
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

    this.meshBlock.checkVersion();
  }

  /**
   * Control statusbar LED
   *
   * @param power
   * @param red
   * @param green
   * @param blue
   */
  public setStatusbarLed(
    power: boolean,
    red: boolean,
    green: boolean,
    blue: boolean
  ): void {
    const command = this.meshBlock.parseStatusbarLedCommand(
      power,
      red,
      green,
      blue
    );
    this.writeWOResponse(command);
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH.PREFIX) === 0;
  }

  protected prepareConnect(): void {
    this.meshBlock.onBatteryLevel = (battery: number) => {
      if (typeof this.onBatteryLevel !== 'function') {
        return;
      }
      this.onBatteryLevel(battery);
    };
    this.meshBlock.onStatusButtonPressed = () => {
      if (typeof this.onStatusButtonPressed !== 'function') {
        return;
      }
      this.onStatusButtonPressed();
    };
  }

  protected async writeWait(data: number[]): Promise<void> {
    if (!this.writeCharacteristic_) {
      return;
    }
    await this.writeCharacteristic_.writeWait(data, true).then((resp) => {
      if (typeof this.onWriteResponse !== 'function') {
        return;
      }
      this.onWriteResponse(resp);
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

export class MeshRequestId {
  private readonly MAX_ID_: number = 255 as const;
  private readonly DEFAULT_ID_: number = 0 as const;

  private pool_: number[] = [];
  private currentId_: number = this.DEFAULT_ID_;
  // private receivedId_: number = this.DEFAULT_ID_;

  /**
   * defaultId
   *
   * @returns
   */
  public defaultId(): number {
    return this.DEFAULT_ID_;
  }

  /**
   * next
   *
   * @returns
   */
  public next(): number {
    this.currentId_ = (this.currentId_ % this.MAX_ID_) + 1;
    return this.currentId_;
  }

  /**
   * isDefaultId
   *
   * @param id
   * @returns
   */
  public isDefaultId(id: number): boolean {
    return id === this.DEFAULT_ID_;
  }

  /**
   * isReceived
   *
   * @param id
   * @returns
   */
  public isReceived(id: number): boolean {
    const _index = this.pool_.findIndex((element) => element === id);
    if (_index === -1) {
      return false;
    }
    this.pool_.splice(_index, 1);
    return true;
    // return id === this.receivedId_;
  }

  /**
   * received
   *
   * @param id
   */
  public received(id: number): void {
    this.pool_.push(id);
    // this.receivedId_ = id;
  }
}
