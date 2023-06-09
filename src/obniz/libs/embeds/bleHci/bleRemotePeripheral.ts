/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */

import EventEmitter from 'eventemitter3';
import { ObnizTimeoutError } from '../../../ObnizError';
import { ObnizBLE } from './ble';
import BleHelper from './bleHelper';
import { BleRemoteCharacteristic } from './bleRemoteCharacteristic';
import { BleRemoteService } from './bleRemoteService';
import {
  BleDeviceAddress,
  BleDeviceAddressType,
  BleDeviceType,
  BleEventType,
  UUID,
} from './bleTypes';
import { SmpEncryptOptions } from './protocol/central/smp';
import { retry } from '../../utils/retry';
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

  connectionParameterUpdateAccept?: boolean;
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
export class BleRemotePeripheral {
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
  get services(): BleRemoteService[] {
    return this._services;
  }

  /**
   * BLE address
   */
  public address: BleDeviceAddress;

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
  public connected: boolean;

  /**
   * This returns connection completion time with a connected state.
   *
   * If not connected, returns null.
   */
  public connected_at: Date | null;

  /**
   *
   */
  public device_type: BleDeviceType | null;

  /**
   *
   */
  public address_type: BleDeviceAddressType | null;

  /**
   *
   */
  public ble_event_type: BleEventType | null;

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
  public rssi: number | null;

  public primary_phy: HciPhy | null;

  public secondary_phy: HciPhy | null;

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
  public adv_data!: number[];

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
  public scan_resp: number[] | null;

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
  public localName: string | null;

  public manufacturerSpecificData: number[] | null;

  public manufacturerSpecificDataInScanResponse: number[] | null;
  public service_data: { uuid: number; data: number[] }[] | null;
  /**
   * Ad Type: 0x16 (16bit UUID)
   */
  public serviceData: number[] | null;

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
  public iBeacon: IBeacon | null;

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
  public onconnect?: () => void;

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
  public ondisconnect?: (reason?: any) => void;

  /**
   * Raw data of advertisement
   *
   * @deprecated
   */
  public advertise_data_rows!: number[][] | null;

  protected advertisingDataRows: { [key: number]: number[] } = {};

  protected scanResponseDataRows: { [key: number]: number[] } = {};

  /**
   * @ignore
   */
  public ondiscoverservice?: (child: BleRemoteCharacteristic) => void;

  /**
   * @ignore
   */
  public ondiscoverservicefinished?: (children: BleRemoteService[]) => void;

  /**
   * This gets called with an error message when some kind of error occurs.
   */
  public onerror?: (err: Error) => void;

  /**
   * @ignore
   */
  public obnizBle: ObnizBLE;

  /**
   * @ignore
   */
  public _connectSetting: BleConnectSetting = {};

  /**
   * Indicating this peripheral is found by scan or set from software.
   *
   * @ignore
   */
  public discoverdOnRemote: boolean | undefined = undefined;

  protected keys = [
    'device_type',
    'address_type',
    'ble_event_type',
    'rssi',
    'adv_data',
    'scan_resp',
    'service_data',
    'primary_phy',
    'secondary_phy',
  ];

  protected _services: BleRemoteService[];
  protected emitter: EventEmitter;
  private _extended = false;

  constructor(obnizBle: ObnizBLE, address: BleDeviceAddress) {
    this.obnizBle = obnizBle;
    this.address = address;
    this.connected = false;
    this.connected_at = null;

    this.device_type = null;
    this.address_type = null;
    this.ble_event_type = null;
    this.rssi = null;
    this.primary_phy = null;
    this.secondary_phy = null;
    // this.adv_data = null;
    this.scan_resp = null;
    this.localName = null;
    this.manufacturerSpecificData = null;
    this.manufacturerSpecificDataInScanResponse = null;
    this.serviceData = null;
    this.iBeacon = null;

    this._services = [];
    this.emitter = new EventEmitter();
    this.service_data = null;
  }

  /**
   * @ignore
   * @return {String} json value
   */
  public toString() {
    return JSON.stringify({
      address: this.address,
      addressType: this.address_type,
      advertisement: this.adv_data,
      scanResponse: this.scan_resp,
      rssi: this.rssi,
    });
  }

  /**
   * @ignore
   * @param dic
   */
  public setParams(dic: any) {
    this.advertise_data_rows = null;
    for (const key in dic) {
      // eslint-disable-next-line no-prototype-builtins
      if (dic.hasOwnProperty(key) && this.keys.includes(key)) {
        (this as any)[key] = dic[key];
      }
    }
    this.analyseAdvertisement();
  }

  /**
   * @ignore
   * @param extendedMode
   */
  public setExtendFlg(extendedMode: boolean) {
    this._extended = extendedMode;
  }

  /**
   * @deprecated As of release 3.5.0, replaced by {@link #connectWait()}
   */
  public connect(setting?: BleConnectSetting) {
    // noinspection JSIgnoredPromiseFromCall
    this.connectWait(setting); // background
  }

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
  public async connectWait(setting?: BleConnectSetting): Promise<void> {
    if (this.connected && setting?.forceConnect === false) return;
    this._connectSetting = setting || {};
    this._connectSetting.autoDiscovery =
      this._connectSetting.autoDiscovery !== false;
    this._connectSetting.mtuRequest =
      this._connectSetting.mtuRequest === undefined
        ? 256
        : this._connectSetting.mtuRequest;
    if (this._connectSetting.usePyh1m === undefined) {
      this._connectSetting.usePyh1m = true;
    }
    if (this._connectSetting.usePyh2m === undefined) {
      this._connectSetting.usePyh2m = true;
    }
    if (this._connectSetting.usePyhCoded === undefined) {
      this._connectSetting.usePyhCoded = true;
    }
    await this.obnizBle.scan.endWait();

    // for only typescript type
    const mtuRequest = this._connectSetting.mtuRequest;

    await retry(
      this._connectSetting.retry ?? 1,
      async () => {
        try {
          if (this._extended) {
            await this.obnizBle.centralBindings.connectExtendedWait(
              this.address,
              mtuRequest,
              () => {
                if (this._connectSetting.pairingOption) {
                  this.setPairingOption(this._connectSetting.pairingOption);
                }
              },
              this._connectSetting.usePyh1m,
              this._connectSetting.usePyh2m,
              this._connectSetting.usePyhCoded
            );
          } else {
            await this.obnizBle.centralBindings.connectWait(
              this.address,
              mtuRequest,
              () => {
                if (this._connectSetting.pairingOption) {
                  this.setPairingOption(this._connectSetting.pairingOption);
                }
              }
            );
          }
        } catch (e) {
          if (e instanceof ObnizTimeoutError) {
            await this.obnizBle.resetWait();
            throw new Error(
              `Connection to device(address=${this.address}) was timedout. ble have been reseted`
            );
          }
          throw e;
        }
        this.connected = true;
        this.connected_at = new Date();
        try {
          if (this._connectSetting.connectionParameterUpdateAccept === false) {
            this.obnizBle.centralBindings._signalings[
              this.address
            ].connectionParameterUpdateAccept = false;
          }
          if (
            this._connectSetting.waitUntilPairing &&
            !(await this.isPairingFinishedWait())
          ) {
            // console.log('waitUntilPairing');
            await this.pairingWait(this._connectSetting.pairingOption);
            // console.log('waitUntilPairing finished');
          }
          if (this._connectSetting.autoDiscovery) {
            await this.discoverAllHandlesWait();
          }
        } catch (e) {
          try {
            await this.disconnectWait();
          } catch (e2) {
            // nothing
          }
          throw e;
        }
      },
      async (err) => {
        // console.log('connection fail, retry', err);
      }
    );
    this.obnizBle.Obniz._runUserCreatedFunction(this.onconnect);
    this.emitter.emit('connect');
  }

  /**
   * @deprecated replaced by {@link #disconnectWait()}
   */
  public disconnect() {
    // noinspection JSIgnoredPromiseFromCall
    this.disconnectWait(); // background
  }

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
  public disconnectWait(): Promise<void> {
    return new Promise((resolve: any, reject: any) => {
      if (!this.connected) {
        resolve();
        return;
      }
      const cuttingFailedError = new Error(
        `cutting connection to peripheral name=${this.localName} address=${this.address} was failed`
      );
      this.emitter.once('statusupdate', (params: any) => {
        clearTimeout(timeoutTimer);
        if (params.status === 'disconnected') {
          resolve(true); // for compatibility
        } else {
          reject(cuttingFailedError);
        }
      });
      const timeoutError = new ObnizTimeoutError(
        `cutting connection to peripheral name=${this.localName} address=${this.address} was failed`
      );
      const timeoutTimer = setTimeout(() => {
        reject(timeoutError);
      }, 90 * 1000);

      this.obnizBle.centralBindings.disconnect(this.address);
    });
  }

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
  public async readPhyWait() {
    const phyToStr = (phy: number) => {
      switch (phy) {
        case 1:
          return '1m';
        case 2:
          return '2m';
        case 3:
          return 'coded';
        default:
          throw new Error('decode Phy Error');
      }
    };
    const data = await this.obnizBle.centralBindings.readPhyWait(this.address);
    if (data.status === 0) {
      return { txPhy: phyToStr(data.txPhy), rxPhy: phyToStr(data.rxPhy) };
    }
  }

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
  public async setPhyWait(
    usePhy1m: boolean,
    usePhy2m: boolean,
    usePhyCoded: boolean,
    useCodedModeS8: boolean,
    useCodedModeS2: boolean
  ) {
    await this.obnizBle.centralBindings.setPhyWait(
      this.address,
      usePhy1m,
      usePhy2m,
      usePhyCoded,
      useCodedModeS8,
      useCodedModeS2
    );
  }

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
  public getService(uuid: UUID): BleRemoteService | null {
    uuid = BleHelper.uuidFilter(uuid);
    for (const key in this._services) {
      if (this._services[key].uuid === uuid) {
        return this._services[key];
      }
    }
    return null;
  }

  /**
   * @ignore
   * @param param
   */
  public findService(param: any) {
    const serviceUuid = BleHelper.uuidFilter(param.service_uuid);
    return this.getService(serviceUuid);
  }

  /**
   * @ignore
   * @param param
   */
  public findCharacteristic(param: any) {
    const serviceUuid = BleHelper.uuidFilter(param.service_uuid);
    const characteristicUuid = BleHelper.uuidFilter(param.characteristic_uuid);
    const s = this.getService(serviceUuid);
    if (s) {
      return s.getCharacteristic(characteristicUuid);
    }
    return null;
  }

  /**
   * @ignore
   * @param param
   */
  public findDescriptor(param: any) {
    const descriptorUuid = BleHelper.uuidFilter(param.descriptor_uuid);
    const c = this.findCharacteristic(param);
    if (c) {
      return c.getDescriptor(descriptorUuid);
    }
    return null;
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
   *      }
   *      peripheral.connectWait({autoDiscovery:false});
   *     }
   * }
   * await obniz.ble.scan.startWait();
   * ```
   */
  public async discoverAllServicesWait(): Promise<BleRemoteService[]> {
    const serviceUuids = await this.obnizBle.centralBindings.discoverServicesWait(
      this.address
    );
    for (const uuid of serviceUuids) {
      let child = this.getService(uuid);
      if (!child) {
        const newService = new BleRemoteService({ uuid });
        newService.parent = this;
        this._services.push(newService);
        child = newService;
      }
      child.discoverdOnRemote = true;

      this.obnizBle.Obniz._runUserCreatedFunction(
        this.ondiscoverservice,
        child
      );
    }

    const children: BleRemoteService[] = this._services.filter(
      (elm: BleRemoteService) => {
        return elm.discoverdOnRemote;
      }
    );

    this.obnizBle.Obniz._runUserCreatedFunction(
      this.ondiscoverservicefinished,
      children
    );
    return children;
  }

  /**
   * @ignore
   */
  public async discoverAllHandlesWait() {
    const ArrayFlat: any = (array: any, depth: any) => {
      const flattend: any = [];
      const flat = (_array: any, _depth: any) => {
        for (const el of _array) {
          if (Array.isArray(el) && _depth > 0) {
            flat(el, _depth - 1);
          } else {
            flattend.push(el);
          }
        }
      };
      flat(array, Math.floor(depth) || 1);
      return flattend;
    };
    const services = await this.discoverAllServicesWait();
    const charsNest = await Promise.all(
      services.map((s: BleRemoteService) => s.discoverAllCharacteristicsWait())
    );
    const chars = ArrayFlat(charsNest);
    const descriptorsNest = await Promise.all(
      chars.map((c: BleRemoteCharacteristic) => c.discoverAllDescriptorsWait())
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const descriptors = ArrayFlat(descriptorsNest);
  }

  /**
   * @ignore
   * @param notifyName
   * @param params
   */
  public notifyFromServer(notifyName: string, params: any) {
    this.emitter.emit(notifyName, params);
    switch (notifyName) {
      case 'statusupdate': {
        if (params.status === 'disconnected') {
          const pre = this.connected;
          this.connected = false;
          this.connected_at = null;
          if (pre) {
            this.obnizBle.Obniz._runUserCreatedFunction(
              this.ondisconnect,
              params.reason
            );
            this.emitter.emit('disconnect', params.reason);
          }
        }
        break;
      }
    }
  }

  /**
   * @ignore
   */
  public advertisementServiceUuids(): UUID[] {
    const results: UUID[] = [];
    this._addServiceUuids(results, this.searchTypeVal(0x02), 16);
    this._addServiceUuids(results, this.searchTypeVal(0x03), 16);
    this._addServiceUuids(results, this.searchTypeVal(0x04), 32);
    this._addServiceUuids(results, this.searchTypeVal(0x05), 32);
    this._addServiceUuids(results, this.searchTypeVal(0x06), 128);
    this._addServiceUuids(results, this.searchTypeVal(0x07), 128);
    return results;
  }

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
  public async pairingWait(options?: BlePairingOptions): Promise<string> {
    const result = await this.obnizBle.centralBindings.pairingWait(
      this.address,
      options
    );
    return result;
  }

  public async getPairingKeysWait(): Promise<string | null> {
    const result = await this.obnizBle.centralBindings.getPairingKeysWait(
      this.address
    );
    return result;
  }

  public async isPairingFinishedWait(): Promise<boolean> {
    const result = await this.obnizBle.centralBindings.isPairingFinishedWait(
      this.address
    );
    return result;
  }

  public setPairingOption(options: BlePairingOptions) {
    this.obnizBle.centralBindings.setPairingOption(this.address, options);
  }

  protected analyseAdvertisement(): void {
    if (this.advertise_data_rows) return;

    this.advertise_data_rows = [];
    if (this.adv_data) {
      for (let i = 0; i < this.adv_data.length; i++) {
        const length = this.adv_data[i];
        const arr = new Array<number>(length);
        for (let j = 0; j < length; j++) {
          arr[j] = this.adv_data[i + j + 1];
        }
        this.advertise_data_rows.push(arr);
        this.advertisingDataRows[this.adv_data[i + 1]] = this.adv_data.slice(
          i + 2,
          i + length + 1
        );
        i = i + length;
      }
    }
    if (this.scan_resp) {
      for (let i = 0; i < this.scan_resp.length; i++) {
        const length = this.scan_resp[i];
        const arr = new Array<number>(length);
        for (let j = 0; j < length; j++) {
          arr[j] = this.scan_resp[i + j + 1];
        }
        this.advertise_data_rows.push(arr);
        this.scanResponseDataRows[this.scan_resp[i + 1]] = this.scan_resp.slice(
          i + 2,
          i + length + 1
        );
        i = i + length;
      }
    }
    this.setLocalName();
    this.setManufacturerSpecificData();
    this.setServiceData();
    this.setIBeacon();
  }

  protected searchTypeVal(
    type: number,
    fromScanResponseData = false
  ): number[] | undefined {
    this.analyseAdvertisement();
    if (this.advertisingDataRows[type] && !fromScanResponseData)
      return this.advertisingDataRows[type];
    else if (this.scanResponseDataRows[type])
      return this.scanResponseDataRows[type];
    else return undefined;
  }

  protected setLocalName(): void {
    const data = this.searchTypeVal(0x09) ?? this.searchTypeVal(0x08);
    this.localName = data ? String.fromCharCode.apply(null, data) : null;
  }

  protected setManufacturerSpecificData(): void {
    this.manufacturerSpecificData = this.searchTypeVal(0xff) ?? null;
    this.manufacturerSpecificDataInScanResponse =
      this.searchTypeVal(0xff, true) ?? null;
  }

  protected setServiceData(): void {
    this.serviceData = this.searchTypeVal(0x16) ?? null;
  }

  protected setIBeacon(): void {
    const data = this.manufacturerSpecificData;
    if (
      !data ||
      data[0] !== 0x4c ||
      data[1] !== 0x00 ||
      data[2] !== 0x02 ||
      data[3] !== 0x15 ||
      data.length !== 25
    ) {
      this.iBeacon = null;
      return;
    }
    const uuidData = data.slice(4, 20);
    let uuid = '';
    for (let i = 0; i < uuidData.length; i++) {
      uuid = uuid + ('00' + uuidData[i].toString(16)).slice(-2);
      if (
        i === 4 - 1 ||
        i === 4 + 2 - 1 ||
        i === 4 + 2 * 2 - 1 ||
        i === 4 + 2 * 3 - 1
      ) {
        uuid += '-';
      }
    }

    const major = (data[20] << 8) + data[21];
    const minor = (data[22] << 8) + data[23];
    const power = Buffer.from([data[24]]).readInt8(0);

    this.iBeacon = {
      uuid,
      major,
      minor,
      power,
      rssi: this.rssi!,
    };
  }

  protected _addServiceUuids(results: UUID[], data: any, bit: any) {
    if (!data) {
      return;
    }
    const uuidLength = bit / 8;
    for (let i = 0; i < data.length; i = i + uuidLength) {
      const one = data.slice(i, i + uuidLength);
      results.push(ObnizBLE._dataArray2uuidHex(one, true));
    }
  }
}
