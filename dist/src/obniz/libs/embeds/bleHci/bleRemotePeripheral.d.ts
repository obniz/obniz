/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import EventEmitter from 'eventemitter3';
import { ObnizBLE } from './ble';
import { BleRemoteCharacteristic } from './bleRemoteCharacteristic';
import { BleRemoteService } from './bleRemoteService';
import { BleDeviceAddress, BleDeviceAddressType, BleDeviceType, BleEventType, UUID } from './bleTypes';
import { SmpEncryptOptions } from './protocol/central/smp';
import { HciPhy } from './protocol/hci';
/**
 * The return values are shown below.
 *
 * ```json
 * {
 *   uuid : "907e1d1d-d85d-497f-9e93-4c813a459cae", //hex string
 *   major : 1000, //number
 *   minor : 100, //number
 *   power : 300, //number
 *   rssi : -22, //number
 * }
 * ```
 */
export interface IBeacon {
    /**
     * hex string
     */
    uuid: UUID;
    major: number;
    minor: number;
    power: number;
    rssi: number;
}
/**
 * connect setting
 */
export interface BleConnectSetting {
    /**
     * Auto discovery on connection established.
     *
     * true : auto discover services/characteristics/descriptors on connection established.
     * false : don't discover automatically. Please manually.
     *
     * Default is true;
     *
     * If set false, you should manually discover services/characteristics/descriptors;
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait({});
     * obniz.ble.scan.onfind = function(peripheral){
     *   if(peripheral.localName == "my peripheral"){
     *      await peripheral.connectWait({autoDiscovery:false});
     *      console.log("success");
     *      await peripheral.discoverAllServicesWait(); //manually discover
     *      let service = peripheral.getService("1800");
     *
     *   }
     * }
     * await obniz.ble.scan.startWait();
     * ```
     *
     */
    autoDiscovery?: boolean;
    waitUntilPairing?: boolean;
    /**
     * Pairing Option
     *
     * keys: Key acquired when pairing previously.
     * onPairedCallback: A function that contains keys called when pairing is successful.
     */
    pairingOption?: BlePairingOptions;
    /**
     * Force Connect
     *
     * If you want to try to connect even when the connected flag is true.
     *
     * Default: true
     */
    forceConnect?: boolean;
    /**
     * Request mtu value.
     *
     * If you want to try exchange specific mtu value, set this value.
     * If set null, skip mtu exchange sequence.
     *
     * Default : 256
     */
    mtuRequest?: null | number;
    /**
     * PHY used for connection
     *
     * It was May connect using that PHY
     *
     * Default : true
     */
    usePyh1m?: boolean;
    /**
     * PHY used for connection
     *
     * It was May connect using that PHY
     *
     * Default : true
     */
    usePyh2m?: boolean;
    /**
     * PHY used for connection
     *
     * It was May connect using that PHY
     *
     * Default : true
     */
    usePyhCoded?: boolean;
    retry?: number;
}
/**
 * Pairing options
 */
export interface BlePairingOptions extends SmpEncryptOptions {
    /**
     * Use pairing keys
     *
     *
     * ```javascript
     * // Javascript Example
     *
     * const keys = "xxxxx";
     * await obniz.ble.initWait({});
     * obniz.ble.scan.onfind = function(peripheral){
     *   if(peripheral.localName == "my peripheral"){
     *     await peripheral.connectWait({keys});// pairing with stored keys.
     *   }
     * }
     * await obniz.ble.scan.startWait();
     * ```
     */
    keys?: string;
    /**
     * Callback function that call on pairing passkey required.
     *
     *
     * ```javascript
     * // Javascript Example
     *
     * const keys = "xxxxx";
     * await obniz.ble.initWait({});
     * obniz.ble.scan.onfind = function(peripheral){
     *   if(peripheral.localName == "my peripheral"){
     *     await peripheral.connectWait({ passkeyCallback: async () => {
     *      return 123456;
     *     }});
     *   }
     * }
     * await obniz.ble.scan.startWait();
     * ```
     *
     */
    passkeyCallback?: () => Promise<number>;
}
/**
 * @category Use as Central
 */
export declare class BleRemotePeripheral {
    /**
     * It contains all discovered services in a peripheral as an array.
     * It is discovered when connection automatically.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *   uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * if(!peripheral) {
     *     console.log('no such peripheral')
     *     return;
     * }
     * try {
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   for (var service of peripheral.services) {
     *       console.log(service.uuid)
     *   }
     * } catch(e) {
     *   console.error(e);
     * }
     * ```
     *
     */
    get services(): BleRemoteService[];
    /**
     * BLE address
     */
    address: BleDeviceAddress;
    /**
     * This returns connection state as boolean.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * var target = {
     *     uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     *
     * console.log(peripheral.connected) // => false
     * ```
     *
     */
    connected: boolean;
    /**
     * This returns connection completion time with a connected state.
     *
     * If not connected, returns null.
     */
    connected_at: Date | null;
    /**
     *
     */
    device_type: BleDeviceType | null;
    /**
     *
     */
    address_type: BleDeviceAddressType | null;
    /**
     *
     */
    ble_event_type: BleEventType | null;
    /**
     * This returns RSSI(dbm) as number.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * obniz.ble.scan.onfind = async (peripheral) => {
     *  console.log(peripheral.localName, peripheral.rssi); // null, -80
     * };
     *
     * await obniz.ble.scan.startWait();
     * ```
     */
    rssi: number | null;
    primary_phy: HciPhy | null;
    secondary_phy: HciPhy | null;
    /**
     * This returns raw advertise data.
     *
     * ```javascript
     *
     * // Javascript Example
     *  await obniz.ble.initWait();
     *  var target = {
     *   uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     *
     * console.log(peripheral.adv_data)
     * ```
     *
     */
    adv_data: number[];
    /**
     * This returns raw scan response data.
     *
     * ```javascript
     *
     * // Javascript Example
     *  await obniz.ble.initWait();
     *  var target = {
     *   uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     *
     * console.log(peripheral.adv_data)
     * console.log(peripheral.scan_resp)
     * ```
     *
     */
    scan_resp: number[] | null;
    /**
     * This returns local name if the peripheral has it.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *  uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     *
     * console.log(peripheral.localName)
     * ```
     */
    localName: string | null;
    manufacturerSpecificData: number[] | null;
    manufacturerSpecificDataInScanResponse: number[] | null;
    service_data: {
        uuid: number;
        data: number[];
    }[] | null;
    /**
     * Ad Type: 0x16 (16bit UUID)
     */
    serviceData: number[] | null;
    /**
     * This returns iBeacon data if the peripheral has it. If none, it will return null.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * var target = {
     *  uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     *
     * console.log(peripheral.iBeacon)
     * ```
     */
    iBeacon: IBeacon | null;
    /**
     * This function is called when connection succeeds.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * obniz.ble.scan.onfind = function(peripheral){
     *   if(peripheral.localName == "my peripheral"){
     *     peripheral.onconnect = function(){
     *       console.log("success");
     *     }
     *      await peripheral.connectWait();
     *    }
     * }
     * await obniz.ble.scan.startWait();
     *
     * ```
     */
    onconnect?: () => void;
    /**
     * This function is called when a connected peripheral is disconnected or first connection establish was failed.
     *
     * ```javascript
     * // Javascript Example
     *  await obniz.ble.initWait();
     *  obniz.ble.scan.onfind = function(peripheral){
     *   if(peripheral.localName == "my peripheral"){
     *       peripheral.onconnect = function(){
     *           console.log("success");
     *       }
     *       peripheral.ondisconnect = function(reason){
     *           console.log("closed", reason);
     *       }
     *       peripheral.connect();
     *   }
     * }
     * await obniz.ble.scan.startWait();
     * ```
     */
    ondisconnect?: (reason?: any) => void;
    /**
     * Raw data of advertisement
     *
     * @deprecated
     */
    advertise_data_rows: number[][] | null;
    protected advertisingDataRows: {
        [key: number]: number[];
    };
    protected scanResponseDataRows: {
        [key: number]: number[];
    };
    /**
     * @ignore
     */
    ondiscoverservice?: (child: BleRemoteCharacteristic) => void;
    /**
     * @ignore
     */
    ondiscoverservicefinished?: (children: BleRemoteService[]) => void;
    /**
     * This gets called with an error message when some kind of error occurs.
     */
    onerror?: (err: Error) => void;
    /**
     * @ignore
     */
    obnizBle: ObnizBLE;
    /**
     * @ignore
     */
    _connectSetting: BleConnectSetting;
    /**
     * Indicating this peripheral is found by scan or set from software.
     *
     * @ignore
     */
    discoverdOnRemote: boolean | undefined;
    protected keys: string[];
    protected _services: BleRemoteService[];
    protected emitter: EventEmitter;
    private _extended;
    constructor(obnizBle: ObnizBLE, address: BleDeviceAddress);
    /**
     * @ignore
     * @return {String} json value
     */
    toString(): string;
    /**
     * @ignore
     * @param dic
     */
    setParams(dic: any): void;
    /**
     * @ignore
     * @param extendedMode
     */
    setExtendFlg(extendedMode: boolean): void;
    /**
     * @deprecated As of release 3.5.0, replaced by {@link #connectWait()}
     */
    connect(setting?: BleConnectSetting): void;
    /**
     * This connects obniz to the peripheral.
     * If ble scanning is undergoing, scan will be terminated immidiately.
     *
     * It throws when connection establish failed.
     *
     * when connection established, all service/characteristics/desriptors will be discovered automatically.
     * This function will wait until all discovery done.
     *
     * About Failures
     * Connection fails some reasons. You can find reason from thrown error.
     * Also obniz provide 90 seconds timeout for connection establish.
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
     * } catch(e) {
     *   console.log("can't connect");
     * }
     * ```
     *
     * There are options for connection
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
     *   await peripheral.connectWait({
     *
     *   });
     *   console.log("connected");
     * } catch(e) {
     *   console.log("can't connect");
     * }
     * ```
     *
     */
    connectWait(setting?: BleConnectSetting): Promise<void>;
    /**
     * @deprecated replaced by {@link #disconnectWait()}
     */
    disconnect(): void;
    /**
     * This disconnects obniz from peripheral.
     *
     * It throws when failed
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
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   await peripheral.disconnectWait();
     *   console.log("disconnected");
     * } catch(e) {
     *    console.log("can't connect / can't disconnect");
     * }
     * ```
     */
    disconnectWait(): Promise<void>;
    /**
     * Check the PHY used in the connection
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *   uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * if(!peripheral) {
     *   console.log('no such peripheral')
     *   return;
     * }
     * try {
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   const phy = await peripheral.readPhyWait()
     *   console.log(phy)
     * } catch(e) {
     *   console.error(e);
     * }
     * ```
     *
     */
    readPhyWait(): Promise<{
        txPhy: string;
        rxPhy: string;
    } | undefined>;
    /**
     * Check the PHY used in the connection.
     * Request to change the current PHY
     *
     * It will be changed if it corresponds to the PHY set by the other party.
     *
     * Changes can be seen on onUpdatePhy
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * obniz.ble.onUpdatePhy = ((txPhy, rxPhy) => {
     *  console.log("txPhy "+txPhy+" rxPhy "+rxPhy);
     * });
     * var target = {
     *   uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * if(!peripheral) {
     *   console.log('no such peripheral')
     *   return;
     * }
     * try {
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   await peripheral.setPhyWait(false,false,true,true,true);//Request Only PHY Coded
     * } catch(e) {
     *   console.error(e);
     * }
     * ```
     *
     */
    setPhyWait(usePhy1m: boolean, usePhy2m: boolean, usePhyCoded: boolean, useCodedModeS8: boolean, useCodedModeS2: boolean): Promise<void>;
    /**
     * It returns a service which having specified uuid in [[services]].
     * Case is ignored. So aa00 and AA00 are the same.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *   uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * if(!peripheral) {
     *   console.log('no such peripheral')
     *   return;
     * }
     * try {
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   var service = peripheral.getService("1800")
     *   if (!service) {
     *     console.log("service not found")
     *     return;
     *   }
     *   console.log(service.uuid)
     * } catch(e) {
     *   console.error(e);
     * }
     * ```
     *
     * @param uuid
     */
    getService(uuid: UUID): BleRemoteService | null;
    /**
     * @ignore
     * @param param
     */
    findService(param: any): BleRemoteService | null;
    /**
     * @ignore
     * @param param
     */
    findCharacteristic(param: any): BleRemoteCharacteristic | null;
    /**
     * @ignore
     * @param param
     */
    findDescriptor(param: any): import("./bleRemoteDescriptor").BleRemoteDescriptor | null;
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
     *      }
     *      peripheral.connectWait({autoDiscovery:false});
     *     }
     * }
     * await obniz.ble.scan.startWait();
     * ```
     */
    discoverAllServicesWait(): Promise<BleRemoteService[]>;
    /**
     * @ignore
     */
    discoverAllHandlesWait(): Promise<void>;
    /**
     * @ignore
     * @param notifyName
     * @param params
     */
    notifyFromServer(notifyName: string, params: any): void;
    /**
     * @ignore
     */
    advertisementServiceUuids(): UUID[];
    /**
     * Start pairing.
     * This function return `keys` which you can use next time pairing with same device.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait({});
     * obniz.ble.scan.onfind = function(peripheral){
     * if(peripheral.localName == "my peripheral"){
     *      peripheral.onconnect = async function(){
     *          console.log("success");
     *          const keys = await peripheral.pairingWait();
     *
     *          // Please store `keys` if you want to bond.
     *      }
     *      await peripheral.connectWait();
     *     }
     * }
     * await obniz.ble.scan.startWait();
     * ```
     *
     *
     *
     * If you have already keys, please use options.keys
     *
     * ```javascript
     * // Javascript Example
     *
     * const keys = "xxxxx";
     * await obniz.ble.initWait({});
     * obniz.ble.scan.onfind = function(peripheral){
     * if(peripheral.localName == "my peripheral"){
     *      peripheral.onconnect = async function(){
     *          console.log("success");
     *          await peripheral.pairingWait({keys});  // pairing with stored keys.
     *
     *      }
     *      await peripheral.connectWait();
     *     }
     * }
     * await obniz.ble.scan.startWait();
     * ```
     *
     * Go to [[BlePairingOptions]] to see more option.
     *
     * @param options BlePairingOptions
     */
    pairingWait(options?: BlePairingOptions): Promise<string>;
    getPairingKeysWait(): Promise<string | null>;
    isPairingFinishedWait(): Promise<boolean>;
    setPairingOption(options: BlePairingOptions): void;
    protected analyseAdvertisement(): void;
    protected searchTypeVal(type: number, fromScanResponseData?: boolean): number[] | undefined;
    protected setLocalName(): void;
    protected setManufacturerSpecificData(): void;
    protected setServiceData(): void;
    protected setIBeacon(): void;
    protected _addServiceUuids(results: UUID[], data: any, bit: any): void;
}
