/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";
import BleRemoteDescriptor from "./bleRemoteDescriptor";
import BleRemoteService from "./bleRemoteService";
/**
 * @category Use as Central
 */
export default class BleRemoteCharacteristic extends BleRemoteAttributeAbstract<BleRemoteService, BleRemoteDescriptor> {
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

  public getDescriptor(uuid: any) {
    return this.getChild(uuid);
  }

  public registerNotify(callback: any) {
    this.onnotify = callback;
    this.service.peripheral.obnizBle.centralBindings.notify(
      this.service.peripheral.address,
      this.service.uuid,
      this.uuid,
      true,
    );
  }

  public registerNotifyWait(callback: any) {
    return new Promise ((resolve: any ) => {
      this.emitter.once("onregisternotify", () => {
        resolve();
      });
      this.registerNotify(callback);
    });
  }

  public unregisterNotify() {
    this.onnotify = () => {
    };

    this.service.peripheral.obnizBle.centralBindings.notify(
      this.service.peripheral.address,
      this.service.uuid,
      this.uuid,
      false,
    );
  }

  public unregisterNotifyWait() {
    return new Promise ((resolve: any ) => {
      this.emitter.once("onunregisternotify", () => {
        resolve();
      });
      this.unregisterNotify();
    });
  }

  public read() {
    this.service.peripheral.obnizBle.centralBindings.read(
      this.service.peripheral.address,
      this.service.uuid,
      this.uuid,
    );
  }

  public write(array: any, needResponse: any) {
    if (needResponse === undefined) {
      needResponse = true;
    }
    this.service.peripheral.obnizBle.centralBindings.write(
      this.service.peripheral.address,
      this.service.uuid,
      this.uuid,
      Buffer.from(array),
      !needResponse,
    );
  }

  public discoverChildren() {
    this.service.peripheral.obnizBle.centralBindings.discoverDescriptors(
      this.service.peripheral.address,
      this.service.uuid,
      this.uuid,
    );
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

  public ondiscoverdescriptor(descriptor: any) {
  }

  public ondiscoverdescriptorfinished(descriptors: any) {
  }

  public onregisternotify() {
  }

  public onunregisternotify() {
  }

  public onnotify(data: any) {
  }

  /**
   * @ignore
   * @param notifyName
   * @param params
   */
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
