import { BleRemoteDescriptor } from './bleRemoteDescriptor';
import { BleRemoteService } from './bleRemoteService';
import { BleRemoteValueAttributeAbstract } from './bleRemoteValueAttributeAbstract';
import { BleAttributePropery, UUID } from './bleTypes';
/**
 * @category Use as Central
 */
export declare class BleRemoteCharacteristic extends BleRemoteValueAttributeAbstract<BleRemoteService, BleRemoteDescriptor> {
    /**
     * @ignore
     */
    get parentName(): "service";
    /**
     * @ignore
     */
    get childrenClass(): any;
    /**
     * @ignore
     *
     */
    get childrenName(): "descriptors";
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
    get descriptors(): BleRemoteDescriptor[];
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
    properties: BleAttributePropery[];
    /**
     * Service instance
     */
    service: BleRemoteService;
    /**
     * Callback function will be called when [[registerNotify]] finished.
     *
     * This doesn't call when notify arrived. It call when 'reiterate' finished.
     *
     *
     */
    onregisternotify?: () => void;
    /**
     * @ignore
     */
    ondiscoverdescriptor?: (descriptor: any) => void;
    /**
     * @ignore
     */
    ondiscoverdescriptorfinished?: (descriptors: any) => void;
    /**
     * Callback function will be called when [[unregisterNotify]] finished.
     */
    onunregisternotify?: () => void;
    /**
     * @ignore
     */
    onnotify?: (data: any) => void;
    constructor(params: any);
    /**
     * @ignore
     * @param params
     */
    addDescriptor(params: {
        uuid: UUID;
    } | BleRemoteDescriptor): BleRemoteDescriptor;
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
     *
     * @param uuid
     */
    getDescriptor(uuid: UUID): BleRemoteDescriptor | null;
    /**
     * This sets a callback function to receive notify when it comes from periperal.
     * To receive notify, you need to register on CCCD Descriptor(0x2902).
     *
     * More information of BLE/CCCD is available at [bluetooth.com](https://www.bluetooth.com/specifications/gatt/descriptors/).
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
     * @deprecated  replaced by {@link #registerNotifyWait()}
     */
    registerNotify(callback: (data: any) => void): void;
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
    registerNotifyWait(callback: (data: any) => void): Promise<void>;
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
     *  console.log("register finished")
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
     *
     * @deprecated  replaced by {@link #unregisterNotifyWait()}
     */
    unregisterNotify(): void;
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
     * let char = peripheral.getService('fff0').getCharacteristic('fff1');
     *
     * await char.registerNotifyWait(function(data){
     *   console.log("notify with data " + data.join(','));
     * });
     * await char.unregisterNotifyWait();
     * console.log("unregistrated")
     * ```
     *
     */
    unregisterNotifyWait(): Promise<void>;
    /**
     * Wait for notification and return data when it arrives.
     *
     * ```javascript
     *
     * await obniz.ble.initWait();
     * var target = {
     *   localName: "obniz-notify"
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * await peripheral.connectWait();
     * let char = peripheral.getService('fff0').getCharacteristic('fff1');
     *
     * let data = await c.getNotifyWait();
     * console.log("notify with data " + data.join(','));
     * ```
     *
     * @returns data from notification of the device
     */
    getNotifyWait(): Promise<any>;
    /**
     * Use readWait() instead from 3.5.0
     *
     * @deprecated
     */
    read(): void;
    /**
     * Use writeWait() instead from 3.5.0
     *
     * @deprecated
     */
    write(array: number[], needResponse?: boolean): void;
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
    writeWait(data: any, needResponse?: any): Promise<boolean>;
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
    readWait(): Promise<number[]>;
    /**
     * Discover services.
     *
     * If connect setting param 'autoDiscovery' is true(default),
     * services are automatically discover on connection established.
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
    discoverAllDescriptorsWait(): Promise<BleRemoteDescriptor[]>;
    /**
     * @ignore
     */
    toJSON(): any;
    /**
     * This characteristics can broadcast or not.
     */
    canBroadcast(): boolean;
    /**
     * This characteristics can notify or not.
     */
    canNotify(): boolean;
    /**
     * This characteristics can read or not.
     */
    canRead(): boolean;
    /**
     * This characteristics can write or not.
     */
    canWrite(): boolean;
    /**
     * This characteristics can 'write without response' or not.
     */
    canWriteWithoutResponse(): boolean;
    /**
     * This characteristics can indicate or not.
     */
    canIndicate(): boolean;
    /**
     * @ignore
     * @param descriptor
     */
    ondiscover(descriptor: any): void;
    /**
     * @ignore
     * @param descriptors
     */
    ondiscoverfinished(descriptors: any): void;
    /**
     * @ignore
     * @param notifyName
     * @param params
     */
    notifyFromServer(notifyName: any, params: any): void;
}
