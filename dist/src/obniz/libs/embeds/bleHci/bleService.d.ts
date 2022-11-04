/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import { BleCharacteristic } from './bleCharacteristic';
import { BleLocalAttributeAbstract } from './bleLocalAttributeAbstract';
import { BlePeripheral } from './blePeripheral';
import { BleAdvertisementData, BleCharacteristicDefine, BleServiceDefine, UUID } from './bleTypes';
/**
 * @category Use as Peripheral
 */
export declare class BleService extends BleLocalAttributeAbstract<null, BleCharacteristic> {
    /**
     * Peripheral instance.
     *
     * This is same as obniz.ble.peripheral
     */
    peripheral: BlePeripheral;
    constructor(obj: BleServiceDefine);
    /**
     * Add new Characteristic
     *
     * @param child
     */
    addCharacteristic(child: BleCharacteristicDefine | BleCharacteristic): BleCharacteristic;
    /**
     * Get Characteristic
     *
     * @param uuid
     */
    getCharacteristic(uuid: UUID): BleCharacteristic | null;
    /**
     * @ignore
     */
    get parentName(): "peripheral";
    /**
     * @ignore
     */
    get childrenName(): "characteristics";
    /**
     * @ignore
     */
    get childrenClass(): any;
    get characteristics(): BleCharacteristic[];
    /**
     * advertisment object for [[BleAdvertisement.setAdvData]]
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * var service = new obniz.ble.service({ uuid : "1234" });
     * var characteristic = new obniz.ble.characteristic({ uuid : "7777", data: [1, 2, 3]});
     * service.addCharacteristic(characteristic);
     * obniz.ble.peripheral.addService(service);
     *
     * obniz.ble.advertisement.setAdvData(service.advData);
     * obniz.ble.advertisement.setScanRespData({
     *    localName : "obniz BLE",
     * });
     * obniz.ble.advertisement.start();
     * ```
     */
    get advData(): BleAdvertisementData;
    /**
     * Terminate created service
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * var service = new obniz.ble.service({ uuid : "1234" });
     * var characteristic = new obniz.ble.characteristic({ uuid : "7777", data: [1, 2, 3]});
     * service.addCharacteristic(characteristic);
     * obniz.ble.peripheral.addService(service);
     *
     * service.end();
     * ```
     */
    end(): void;
    /**
     * @ignore
     * @param notifyName
     * @param params
     */
    notify(notifyName: any, params: any): void;
}
