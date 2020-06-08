/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import { ObnizDeprecatedFunctionError } from "../../../ObnizError";
import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";
import BleRemoteDescriptor from "./bleRemoteDescriptor";
import BleRemoteService from "./bleRemoteService";
import BleRemoteValueAttributeAbstract from "./bleRemoteValueAttributeAbstract";
import { BleAttributePropery, UUID } from "./bleTypes";

/**
 * @category Use as Central
 */
export default class BleRemoteCharacteristic extends BleRemoteValueAttributeAbstract<
  BleRemoteService,
  BleRemoteDescriptor
> {
  /**
   * @ignore
   */
  get parentName(): string | null {
    return "service";
  }

  /**
   * @ignore
   */
  get childrenClass(): any {
    return BleRemoteDescriptor;
  }

  /**
   * @ignore
   *
   */
  get childrenName(): string | null {
    return "descriptors";
  }

  /**
   * It contains descriptors in a characteristic.
   * It was discovered when connection automatically.
   *
   * ```javascript
   * // Javascript Example
   *
   * await obniz.ble.initWait();
   * var target = {
   *    uuids: ["fff0"],
   * };
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * if(!peripheral) {
   *    console.log('no such peripheral')
   *    return;
   * }
   * try {
   *   await peripheral.connectWait();
   *   console.log("connected");
   *   var service = peripheral.getService("1800")
   *   var c = service.getCharacteristic("fff0")
   *   for (var d of c.descriptors) {
   *     console.log(d.uuid)
   *  }
   * } catch(e) {
   *   console.error(e);
   * }
   * ```
   */
  get descriptors() {
    return this.children;
  }

  /**
   * It is an array of properties of a characteristics. It contains some of belows.
   *
   * ```javascript
   * console.log(characteristics.properties); // => ['read', 'write', 'notify']
   * ```
   *
   * See how works at https://www.bluetooth.com/ja-jp/specifications/bluetooth-core-specification/
   *
   */
  public properties: BleAttributePropery[];

  /**
   * Service instance
   */
  public service!: BleRemoteService;

  /**
   * Callback function will be called when [[registerNotify]] finished.
   *
   * This doesn't call when notify arrived. It call when 'reiterate' finished.
   *
   *
   */
  public onregisternotify?: () => void;

  /**
   * @ignore
   */
  public ondiscoverdescriptor?: (descriptor: any) => void;

  /**
   * @ignore
   */
  public ondiscoverdescriptorfinished?: (descriptors: any) => void;

  /**
   * Callback function will be called when [[unregisterNotify]] finished.
   */
  public onunregisternotify?: () => void;

  /**
   * @ignore
   */
  public onnotify?: (data: any) => void;

  constructor(params: any) {
    super(params);

    this.properties = params.properties || [];
    if (!Array.isArray(this.properties)) {
      this.properties = [this.properties];
    }
  }

  /**
   * @ignore
   * @param params
   */
  public addDescriptor(params: { uuid: UUID } | BleRemoteDescriptor): BleRemoteDescriptor {
    return this.addChild(params);
  }

  /**
   * It returns a descriptors which having specified uuid in a characteristic.
   * Return value is null when not matched.
   *
   * Case is ignored. So aa00 and AA00 are the same.
   *
   * ```javascript
   * // Javascript Example
   *
   * await obniz.ble.initWait();
   * var target = {
   *  uuids: ["fff0"],
   * };
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * if(!peripheral) {
   *   console.log('no such peripheral')
   *   return;
   * }
   * try {
   *  await peripheral.connectWait();
   *  console.log("connected");
   *  var service = peripheral.getService("1800")
   *  var c = service.getCharacteristic("fff0")
   *  var d = c.getDescriptor("fff0")
   *  console.log(d.uuid)
   * } catch(e) {
   *   console.error(e);
   * }
   * ```
   * @param uuid
   */
  public getDescriptor(uuid: UUID): BleRemoteDescriptor | null {
    return this.getChild(uuid);
  }

  /**
   * This sets a callback function to receive notify when it comes from periperal.
   * To receive notify, you need to register on CCCD Descriptor(0x2902).
   *
   * More infomation of BLE/CCCD is available at [bluetooth.com](https://www.bluetooth.com/specifications/gatt/descriptors/).
   *
   * ```javascript
   * await obniz.ble.initWait();
   * var target = {
   *  localName: "obniz-notify"
   * };
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * await peripheral.connectWait();
   * let char = peripheral.getService('fff0').getCharacteristic( 'fff1');
   *
   * char.onregisternotify = function() {
   *   console.log("register finshed")
   * }
   *
   * char.registerNotify( function(data){
   *   console.log("notify with data " + data.join(','));
   * });
   * ```
   *
   * @param callback
   */
  public registerNotify(callback: (data: any) => void) {
    this.registerNotifyWait(callback); // background
  }

  /**
   * This sets a notify callback function and wait to finish register.
   *
   * ```javascript
   *
   * await obniz.ble.initWait();
   * var target = {
   *   localName: "obniz-notify"
   * };
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * await peripheral.connectWait();
   * let char = peripheral.getService('fff0').getCharacteristic( 'fff1');
   *
   * await char.registerNotifyWait( function(data){
   *   console.log("notify with data " + data.join(','));
   * });
   * ```
   *
   * @param callback
   *
   */
  public async registerNotifyWait(callback: (data: any) => void): Promise<void> {
    this.onnotify = callback;
    await this.service.peripheral.obnizBle.centralBindings.notifyWait(
      this.service.peripheral.address,
      this.service.uuid,
      this.uuid,
      true,
    );
    if (this.onregisternotify) {
      this.onregisternotify();
    }
  }

  /**
   * unregistrate a callback which is registrated by [[registerNotify]] or [[registerNotifyWait]].
   *
   *
   * ```javascript
   *
   * await obniz.ble.initWait();
   * var target = {
   *  localName: "obniz-notify"
   * };
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * await peripheral.connectWait();
   * let char = peripheral.getService('fff0').getCharacteristic( 'fff1');
   *
   * char.onregisternotify = function() {
   *  console.log("register finshed")
   *  char.unregisterNotify();
   * }
   *
   * char.onunregisternotify = function() {
   *   console.log("unregistrated")
   * }
   *
   * char.registerNotify( function(data){
   *   console.log("notify with data " + data.join(','));
   * });
   *
   * ```
   */
  public unregisterNotify() {
    this.unregisterNotifyWait(); // background
  }

  /**
   * Unregistrate a callback which is registrated by [[registerNotify]] or [[registerNotifyWait]].
   * And wait until done.
   *
   * ```javascript
   *
   *
   * await obniz.ble.initWait();
   * var target = {
   *  localName: "obniz-notify"
   * };
   *
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * await peripheral.connectWait();
   * let char = peripheral.getService('fff0').getCharacteristic( 'fff1');
   *
   * await char.registerNotifyWait( function(data){
   *   console.log("notify with data " + data.join(','));
   * });
   * await char.unregisterNotifyWait();
   * console.log("unregistrated")
   * ```
   *
   */
  public async unregisterNotifyWait(): Promise<void> {
    this.onnotify = () => {};

    await this.service.peripheral.obnizBle.centralBindings.notifyWait(
      this.service.peripheral.address,
      this.service.uuid,
      this.uuid,
      false,
    );
    this._runUserCreatedFunction(this.onunregisternotify);
  }

  /**
   * Use readWait() instead from 3.5.0
   * @deprecated
   */
  public read() {
    throw new ObnizDeprecatedFunctionError("read", "readWait");
  }

  /**
   * Use writeWait() instead from 3.5.0
   * @deprecated
   */
  public write(array: number[], needResponse?: boolean) {
    throw new ObnizDeprecatedFunctionError("read", "readWait");
  }

  /**
   * This writes dataArray to the characteristic.
   * It throws an error when failed.
   *
   * ```javascript
   * // Javascript Example
   *
   *  await obniz.ble.initWait();
   *   var target = {
   *    uuids: ["fff0"],
   * };
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * if(peripheral){
   *   await peripheral.connectWait();
   *   console.log("connected");
   *   await obniz.wait(1000);
   *
   *   var dataArray = [0x02, 0xFF];
   *   await peripheral.getService("FF00").getCharacteristic("FF01").writeWait(dataArray);
   *   console.log("write success");
   * }
   * ```
   *
   * @param data
   * @param needResponse
   */
  public async writeWait(data: any, needResponse?: any): Promise<boolean> {
    if (needResponse === undefined) {
      needResponse = true;
    }
    await this.service.peripheral.obnizBle.centralBindings.writeWait(
      this.service.peripheral.address,
      this.service.uuid,
      this.uuid,
      Buffer.from(data),
      !needResponse,
    );
    this._runUserCreatedFunction(this.onwrite, "success");
    return true;
  }

  /**
   * It reads data from the characteristic.
   *
   * Even you wrote string or number, it returns binary array.
   * The returned value appears in the callback function (onread). If reading succeeds an Array with data will be returned.
   * It throws an error when failed.
   *
   * ```javascript
   * // Javascript Example
   * await obniz.ble.initWait();
   * var target = {
   *  uuids: ["fff0"],
   * };
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * if(peripheral){
   *   await peripheral.connectWait();
   *   console.log("connected");
   *   await obniz.wait(1000);
   *
   *   var dataArray = await peripheral.getService("FF00").getCharacteristic("FF01").readWait();
   *   console.log(dataArray);
   * }
   * ```
   */
  public async readWait(): Promise<number[]> {
    const buf = await this.service.peripheral.obnizBle.centralBindings.readWait(
      this.service.peripheral.address,
      this.service.uuid,
      this.uuid,
    );
    const data = Array.from(buf);

    this._runUserCreatedFunction(this.onread, data);
    return data;
  }

  /**
   * Discover services.
   *
   * If connect setting param 'autoDiscovery' is true(default),
   * services are automatically disvocer on connection established.
   *
   *
   * ```javascript
   * // Javascript Example
   * await obniz.ble.initWait({});
   * obniz.ble.scan.onfind = function(peripheral){
   * if(peripheral.localName == "my peripheral"){
   *      peripheral.onconnect = async function(){
   *          console.log("success");
   *          await peripheral.discoverAllServicesWait(); //manually discover
   *          let service = peripheral.getService("1800");
   *          await service.discoverAllCharacteristicsWait(); //manually discover
   *          let characteristics = service.getCharacteristic("ff00");
   *          await characteristics.discoverAllDescriptorsWait(); //manually discover
   *          let descriptor = characteristics.getDescriptor("fff1");
   *      }
   *      peripheral.connect({autoDiscovery:false});
   *     }
   * }
   * await obniz.ble.scan.startWait();
   * ```
   */
  public async discoverAllDescriptorsWait(): Promise<BleRemoteDescriptor[]> {
    const descriptors = await this.service.peripheral.obnizBle.centralBindings.discoverDescriptorsWait(
      this.service.peripheral.address,
      this.service.uuid,
      this.uuid,
    );

    for (const descr of descriptors) {
      const uuid: any = descr;
      let child: any = this.getChild(uuid);
      if (!child) {
        child = this.addChild({ uuid });
      }
      child.discoverdOnRemote = true;
      this.ondiscover(child);
    }

    return this.descriptors.filter((elm: any) => {
      return elm.discoverdOnRemote;
    });
  }

  /**
   * @ignore
   */
  public toJSON() {
    const obj: any = super.toJSON();

    if (this.properties.length > 0) {
      obj.properties = this.properties;
    }
    return obj;
  }

  /**
   * This characteristics can broadcast or not.
   */
  public canBroadcast(): boolean {
    return this.properties.includes("broadcast");
  }

  /**
   * This characteristics can notify or not.
   */
  public canNotify(): boolean {
    return this.properties.includes("notify");
  }

  /**
   * This characteristics can read or not.
   */
  public canRead(): boolean {
    return this.properties.includes("read");
  }

  /**
   * This characteristics can write or not.
   */
  public canWrite(): boolean {
    return this.properties.includes("write");
  }

  /**
   * This characteristics can 'write without response' or not.
   */
  public canWriteWithoutResponse(): boolean {
    return this.properties.includes("write_without_response");
  }

  /**
   * This characteristics can indicate or not.
   */
  public canIndicate(): boolean {
    return this.properties.includes("indicate");
  }

  /**
   * @ignore
   * @param descriptor
   */
  public ondiscover(descriptor: any) {
    this._runUserCreatedFunction(this.ondiscoverdescriptor, descriptor);
  }

  /**
   * @ignore
   * @param descriptors
   */
  public ondiscoverfinished(descriptors: any) {
    this._runUserCreatedFunction(this.ondiscoverdescriptorfinished, descriptors);
  }

  /**
   * @ignore
   * @param notifyName
   * @param params
   */
  public notifyFromServer(notifyName: any, params: any) {
    super.notifyFromServer(notifyName, params);
    switch (notifyName) {
      case "onnotify": {
        this._runUserCreatedFunction(this.onnotify, params.data || undefined);

        break;
      }
    }
  }
}
