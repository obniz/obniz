/**
 * Obniz BLE are switches automatically. <br/>
 * obnizOS ver >= 3.0.0  : [[ObnizCore.Components.Ble.Hci | Hci]] <br/>
 * obnizOS ver < 3.0.0   : Not Supported <br/>
 *
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import ObnizBLEHci from './hci';
import CentralBindings from './protocol/central/bindings';
import HciProtocol from './protocol/hci';
import PeripheralBindings from './protocol/peripheral/bindings';
import Obniz from '../../../index';
import { ObnizBleHciStateError } from '../../../ObnizError';
import { ComponentAbstract } from '../../ComponentAbstact';
import BleAdvertisement from './bleAdvertisement';
import BleCharacteristic from './bleCharacteristic';
import BleDescriptor from './bleDescriptor';
import BlePeripheral from './blePeripheral';
import BleRemotePeripheral from './bleRemotePeripheral';
import BleScan from './bleScan';
import BleService from './bleService';
import { BleDeviceAddress, BleDeviceAddressType, UUID } from './bleTypes';
/**
 * Use a obniz device as a BLE device.
 * Peripheral and Central mode are supported
 */
export default class ObnizBLE extends ComponentAbstract {
    /**
     * Initialized status.
     *
     * ```javascript
     * // Javascript Example
     * obniz.ble.isInitialized; // => false
     * await obniz.ble.initWait();
     * obniz.ble.isInitialized; // => true
     * ```
     */
    get isInitialized(): boolean;
    /**
     * @ignore
     *
     * @param data
     * @param reverse
     * @private
     */
    static _dataArray2uuidHex(data: number[], reverse: boolean): UUID;
    hci: ObnizBLEHci;
    peripheral: BlePeripheral;
    scan: BleScan;
    /**
     * @ignore
     */
    centralBindings: CentralBindings;
    /**
     * @ignore
     */
    peripheralBindings: PeripheralBindings;
    service: typeof BleService;
    characteristic: typeof BleCharacteristic;
    descriptor: typeof BleDescriptor;
    /**
     * @ignore
     */
    advertisement: BleAdvertisement;
    protected hciProtocol: HciProtocol;
    protected _initializeWarning: boolean;
    protected remotePeripherals: BleRemotePeripheral[];
    /**
     * @ignore
     */
    private _initialized;
    constructor(obniz: Obniz);
    notifyFromObniz(json: any): void;
    debugHandler: (text: string) => void;
    /**
     * Initialize BLE module. You need call this first everything before.
     * This throws if device is not supported device.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * ```
     */
    initWait(): Promise<void>;
    /**
     * Reset Target Device and current SDK status without rebooting. If error occured while reset, then target device will reboot.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.resetWait();
     * ```
     */
    resetWait(): Promise<void>;
    /**
     * @ignore
     * @private
     */
    _reset(): void;
    /**
     * Connect to peripheral without scanning.
     * Returns a peripheral instance, but the advertisement information such as localName is null because it has not been scanned.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var peripheral = obniz.ble.directConnect("e4b9efb29218","random");
     * peripheral.onconnect = ()=>{
     *   console.log("connected");
     * }
     * ```
     *
     * @param address peripheral device address
     * @param addressType "random" or "public"
     *
     * @deprecated replaced by {@link #directConnectWait()}
     */
    directConnect(address: BleDeviceAddress, addressType: BleDeviceAddressType): BleRemotePeripheral | null;
    /**
     * Connect to peripheral without scanning, and wait to finish connecting.
     *
     * It throws when connection establish failed.
     * Returns a peripheral instance, but the advertisement information such as localName is null because it has not been scanned.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * try {
     *   var peripheral = await obniz.ble.directConnectWait("e4b9efb29218","random");
     *   console.log("connected");
     * } catch(e) {
     *   console.log("can't connect");
     * }
     * ```
     *
     * @param address peripheral device address
     * @param addressType "random" or "public"
     */
    directConnectWait(address: BleDeviceAddress, addressType: BleDeviceAddressType): Promise<BleRemotePeripheral>;
    /**
     * Return connected peripherals.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * let target = {
     *   localName: "Blank"
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * if(peripheral) {
     *   try {
     *     await peripheral.connectWait();
     *   } catch(e) {
     *     console.error(e);
     *   }
     * }
     * console.log(obniz.ble.getConnectedPeripherals());
     * ```
     *
     * @returns connected peripherals
     */
    getConnectedPeripherals(): BleRemotePeripheral[];
    /**
     * @ignore
     */
    warningIfNotInitialize(): void;
    schemaBasePath(): string;
    protected onStateChange(): void;
    protected findPeripheral(address: BleDeviceAddress): BleRemotePeripheral | null;
    protected onDiscover(uuid: any, address?: any, addressType?: any, connectable?: any, advertisement?: any, rssi?: any): void;
    protected onDisconnect(peripheralUuid: any, reason: ObnizBleHciStateError): void;
    protected onNotification(peripheralUuid: any, serviceUuid?: any, characteristicUuid?: any, data?: any, isNotification?: any, isSuccess?: any): void;
    protected onPeripheralStateChange(state: any): void;
    protected onPeripheralAccept(clientAddress: any): void;
    protected onPeripheralMtuChange(mtu: any): void;
    protected onPeripheralDisconnect(clientAddress: any, reason: any): void;
    private debug;
}
