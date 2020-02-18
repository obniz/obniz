/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";
import BleRemoteDescriptor from "./bleRemoteDescriptor";
import BleRemoteService from "./bleRemoteService";
import BleRemoteValueAttributeAbstract from "./bleRemoteValueAttributeAbstract";
import {BleAttributePropery, UUID} from "./bleTypes";

/**
 * @category Use as Central
 */
export default class BleRemoteCharacteristic extends BleRemoteValueAttributeAbstract<BleRemoteService, BleRemoteDescriptor> {

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
  public onregisternotify?: (() => void);

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
    this.onnotify = callback;
    this.service.peripheral.obnizBle.centralBindings.notify(
      this.service.peripheral.address,
      this.service.uuid,
      this.uuid,
      true,
    );
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
  public registerNotifyWait(callback: (data: any) => void): Promise<void> {
    return new Promise((resolve: any) => {
      this.emitter.once("onregisternotify", () => {
        resolve();
      });
      this.registerNotify(callback);
    });
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
    this.onnotify = () => {
    };

    this.service.peripheral.obnizBle.centralBindings.notify(
      this.service.peripheral.address,
      this.service.uuid,
      this.uuid,
      false,
    );
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
  public unregisterNotifyWait(): Promise<void> {
    return new Promise((resolve: any) => {
      this.emitter.once("onunregisternotify", () => {
        resolve();
      });
      this.unregisterNotify();
    });
  }

  /**
   * It reads data from the characteristic.
   *
   * Even you wrote string or number, it returns binary array.
   * The returned value appears in the callback function [[onread]].
   *
   * ```javascript
   * // Javascript Example
   * obniz.ble.scan.onfind = function(peripheral){
   *   if(peripheral.localName == "my peripheral"){
   *
   *     peripheral.onconnect = function(){
   *       var characteristic = peripheral.getService("FF00").getCharacteristic("FF01");
   *       characteristic.read();
   *       characteristic.onread = function(dataArray){
   *         console.log("value : " + dataArray);
   *       }
   *     }
   *
   *     peripheral.connect();
   *   }
   * }
   * obniz.ble.startScan({duration : 10});
   * ```
   *
   *
   */
  public read() {
    this.service.peripheral.obnizBle.centralBindings.read(
      this.service.peripheral.address,
      this.service.uuid,
      this.uuid,
    );
  }

  /**
   * This writes dataArray to the characteristic.
   *
   * ```javascript
   * // Javascript Example
   *
   * await obniz.ble.initWait();
   * var target = {
   *   uuids: ["fff0"],
   * };
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * if(peripheral){
   *    await peripheral.connectWait();
   *    console.log("connected");
   *    await obniz.wait(1000);
   *
   *    var dataArray = [0x02, 0xFF];
   *    peripheral.getService("FF00").getCharacteristic("FF01").write(dataArray);
   * }
   * ```
   *
   * @param array
   * @param needResponse
   */
  public write(array: number[], needResponse: boolean) {
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
  public writeWait(data: any, needResponse?: any): Promise<void> {
    return super.writeWait(data, needResponse);
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
  public readWait(): Promise<number[]> {
    return super.readWait();
  }

  /**
   * @ignore
   */
  public discoverChildren() {
    this.service.peripheral.obnizBle.centralBindings.discoverDescriptors(
      this.service.peripheral.address,
      this.service.uuid,
      this.uuid,
    );
  }

  /**
   * @ignore
   */
  public discoverAllDescriptors() {
    return this.discoverChildren();
  }

  /**
   * @ignore
   *
   */
  public discoverAllDescriptorsWait() {
    return this.discoverChildrenWait();
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
    if (this.ondiscoverdescriptor) {
      this.ondiscoverdescriptor(descriptor);
    }
  }

  /**
   * @ignore
   * @param descriptors
   */
  public ondiscoverfinished(descriptors: any) {
    if (this.ondiscoverdescriptorfinished) {
      this.ondiscoverdescriptorfinished(descriptors);
    }
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
        if (this.onregisternotify) {
          this.onregisternotify();
        }
        break;
      }
      case "onunregisternotify": {
        if (this.onunregisternotify) {
          this.onunregisternotify();
        }
        break;
      }
      case "onnotify": {
        if (this.onnotify) {
          this.onnotify(params.data || undefined);
        }

        break;
      }
    }
  }
}
