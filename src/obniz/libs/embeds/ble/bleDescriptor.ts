/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */
import BleAttributeAbstract from "./bleAttributeAbstract";
import BleHelper from "./bleHelper";
/**
 * @category Use as Peripheral
 */
export default class BleDescriptor extends BleAttributeAbstract {
  public permissions: any;
  public characteristic: any;
  public uuid: any;

  constructor(obj: any) {
    super(obj);

    this.permissions = obj.permissions || [];
    if (!Array.isArray(this.permissions)) {
      this.permissions = [this.permissions];
    }
  }

  get parentName(): string | null {
    return "characteristic";
  }

  public addPermission(param: any) {
    if (!this.permissions.includes(param)) {
      this.permissions.push(param);
    }
  }

  public removePermission(param: any) {
    this.permissions = this.permissions.filter ((elm: any ) => {
      return elm !== param;
    });
  }

  public toJSON() {
    const obj: any = super.toJSON();

    if (this.permissions.length > 0) {
      obj.permissions = this.permissions;
    }
    return obj;
  }

  public write(dataArray: any) {
    this.characteristic.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          write_descriptor: {
            service_uuid: BleHelper.uuidFilter(
              this.characteristic.service.uuid,
            ),
            characteristic_uuid: BleHelper.uuidFilter(this.characteristic.uuid),
            descriptor_uuid: this.uuid,
            data: dataArray,
          },
        },
      },
    });
  }

  public read() {
    this.characteristic.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          read_descriptor: {
            service_uuid: BleHelper.uuidFilter(
              this.characteristic.service.uuid,
            ),
            characteristic_uuid: BleHelper.uuidFilter(this.characteristic.uuid),
            descriptor_uuid: this.uuid,
          },
        },
      },
    });
  }
}
