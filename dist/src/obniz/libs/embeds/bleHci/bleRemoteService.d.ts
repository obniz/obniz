import { BleRemoteAttributeAbstract } from './bleRemoteAttributeAbstract';
import { BleRemoteCharacteristic } from './bleRemoteCharacteristic';
import { BleRemotePeripheral } from './bleRemotePeripheral';
import { UUID } from './bleTypes';
/**
 * @category Use as Central
 */
export declare class BleRemoteService extends BleRemoteAttributeAbstract<BleRemotePeripheral, BleRemoteCharacteristic> {
    /**
     * Peripheral instance
     */
    peripheral: BleRemotePeripheral;
    constructor(obj: any);
    /**
     * @ignore
     */
    get parentName(): "peripheral";
    /**
     * @ignore
     */
    get childrenClass(): any;
    /**
     * @ignore
     */
    get childrenName(): "characteristics";
    /**
     * It contains characteristics in a service.
     * It was discovered when connection automatically.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *     uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     *  if(!peripheral) {
     *     console.log('no such peripheral')
     *     return;
     * }
     * try {
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   var service = peripheral.getService("1800")
     *   for (var c of service.characteristics) {
     *     console.log(c.uuid)
     *   }
     * } catch(e) {
     *   console.error(e);
     * }
     * ```
     */
    get characteristics(): BleRemoteCharacteristic[];
    /**
     * @ignore
     * @param param
     */
    addCharacteristic(param: {
        uuid: UUID;
    } | BleRemoteCharacteristic): BleRemoteCharacteristic;
    /**
     * It returns a characteristic which having specified uuid in a service.
     * Return value is null when not matched.
     *
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
     *    console.log('no such peripheral')
     *     return;
     * }
     * try {
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   var service = peripheral.getService("1800")
     *   var c = service.getCharacteristic("fff0")
     *   console.log(c.uuid)
     * } catch(e) {
     *   console.error(e);
     * }
     * ```
     *
     * @param uuid
     */
    getCharacteristic(uuid: UUID): BleRemoteCharacteristic | null;
    /**
     * @ignore
     * @deprecated  replaced by {@link #discoverAllCharacteristicsWait()}
     */
    discoverAllCharacteristics(): void;
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
     *          let characteristics = service.getCharacteristic("ff00")
     *      }
     *      peripheral.connect({autoDiscovery:false});
     *     }
     * }
     * await obniz.ble.scan.startWait();
     * ```
     */
    discoverAllCharacteristicsWait(): Promise<BleRemoteCharacteristic[]>;
    /**
     * @ignore
     * @param characteristic
     */
    ondiscover(characteristic: BleRemoteCharacteristic): void;
    /**
     * @ignore
     * @param characteristics
     */
    ondiscoverfinished(characteristics: BleRemoteCharacteristic): void;
    /**
     * @ignore
     * @param characteristic
     */
    ondiscovercharacteristic(characteristic: BleRemoteCharacteristic): void;
    /**
     * @ignore
     * @param characteristics
     */
    ondiscovercharacteristicfinished(characteristics: BleRemoteCharacteristic[]): void;
    /**
     * @ignore
     */
    readWait(): Promise<number[]>;
    /**
     * @ignore
     */
    writeWait(): Promise<boolean>;
}
