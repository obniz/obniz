/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */
import BleHelper from "./bleHelper";
import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";
import BleRemoteDescriptor from "./bleRemoteDescriptor";
/**
 * Deprecated class.
 * Please update obnizOS >= 3.0.0 and use [[ObnizCore.Components.Ble.Hci]]
 * @category Use as Central
 */
export default class BleRemoteCharacteristic extends BleRemoteAttributeAbstract {
  public properties: any;
  public children: any;
  public addChild: any;
  public getChild: any;
  public Obniz: any;
  public service: any;
  public uuid: any;
  public emitter: any;
  public discoverChildrenWait: any;

  constructor(params: any) {
    super(params);

    this.properties = params.properties || [];
    if (!Array.isArray(this.properties)) {
      this.properties = [this.properties];
    }
  }

  get parentName(): string | null {
    return "service";
  }

  get childrenClass(): any {
    return BleRemoteDescriptor;
  }

  get childrenName(): string | null {
    return "descriptors";
  }

  get descriptors() {
    return this.children;
  }

  public addDescriptor(params: any) {
    return this.addChild(params);
  }

  //
  // getCharacteristic(params) {
  //   return this.getChild(params)
  // }

  public getDescriptor(uuid: any) {
    return this.getChild(uuid);
  }

  public async registerNotify(callback: any) {
    this.onnotify = callback;
    const cccd: any = this.getDescriptor("2902");
    await cccd.writeWait([0x01, 0x00]);

    const obj: any = {
      ble: {
        register_notify_characteristic: {
          address: this.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.uuid),
        },
      },
    };
    this.service.peripheral.Obniz.send(obj);
  }

  public registerNotifyWait(callback: any) {
    return new Promise((resolve: any) => {
      this.emitter.once("onregisternotify", () => {
        resolve();
      });
      this.registerNotify(callback);
    });
  }

  public unregisterNotify() {
    this.onnotify = () => {};
    const obj: any = {
      ble: {
        unregister_notify_characteristic: {
          address: this.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.uuid),
        },
      },
    };
    this.service.peripheral.Obniz.send(obj);
  }

  public unregisterNotifyWait() {
    return new Promise((resolve: any) => {
      this.emitter.once("onunregisternotify", () => {
        resolve();
      });
      this.unregisterNotify();
    });
  }

  public read() {
    const obj: any = {
      ble: {
        read_characteristic: {
          address: this.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.uuid),
        },
      },
    };
    this.service.peripheral.Obniz.send(obj);
  }

  public write(array: any, needResponse: any) {
    if (needResponse === undefined) {
      needResponse = true;
    }
    const obj: any = {
      ble: {
        write_characteristic: {
          address: this.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.uuid),
          data: array,
          needResponse,
        },
      },
    };
    this.service.peripheral.Obniz.send(obj);
  }

  public discoverChildren() {
    const obj: any = {
      ble: {
        get_descriptors: {
          address: this.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.uuid),
        },
      },
    };
    this.service.peripheral.Obniz.send(obj);
  }

  public discoverAllDescriptors() {
    return this.discoverChildren();
  }

  public discoverAllDescriptorsWait() {
    return this.discoverChildrenWait();
  }

  public toJSON() {
    const obj: any = super.toJSON();

    if (this.properties.length > 0) {
      obj.properties = this.properties;
    }
    return obj;
  }

  public canBroadcast() {
    return this.properties.includes("broadcast");
  }

  public canNotify() {
    return this.properties.includes("notify");
  }

  public canRead() {
    return this.properties.includes("read");
  }

  public canWrite() {
    return this.properties.includes("write");
  }

  public canWriteWithoutResponse() {
    return this.properties.includes("write_without_response");
  }

  public canIndicate() {
    return this.properties.includes("indicate");
  }

  public ondiscover(descriptor: any) {
    this.ondiscoverdescriptor(descriptor);
  }

  public ondiscoverfinished(descriptors: any) {
    this.ondiscoverdescriptorfinished(descriptors);
  }

  public ondiscoverdescriptor(descriptors: any) {}

  public ondiscoverdescriptorfinished(descriptors: any[]) {}

  public onregisternotify() {}

  public onunregisternotify() {}

  public onnotify(data: any) {}

  public notifyFromServer(notifyName: any, params: any) {
    super.notifyFromServer(notifyName, params);
    switch (notifyName) {
      case "onregisternotify": {
        this.onregisternotify();
        break;
      }
      case "onunregisternotify": {
        this.onunregisternotify();
        break;
      }
      case "onnotify": {
        this.onnotify(params.data || undefined);
        break;
      }
    }
  }
}
