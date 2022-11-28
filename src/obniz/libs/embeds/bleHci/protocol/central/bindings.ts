/**
 * @packageDocumentation
 *
 * @ignore
 */
// var debug = require('debug')('bindings');

import EventEmitter from 'eventemitter3';

import {
  ObnizBleHciStateError,
  ObnizBleInvalidParameterError,
  ObnizBleUnknownPeripheralError,
} from '../../../../../ObnizError';
import BleHelper from '../../bleHelper';
import {
  BleDeviceAddress,
  BleDeviceAddressType,
  Handle,
  UUID,
} from '../../bleTypes';
import { Hci, HciState } from '../hci';
import { HandleIndex } from '../peripheral/gatt';
import { AclStream } from './acl-stream';
import { Gap } from './gap';
import { GattCentral } from './gatt';
import { Signaling } from './signaling';
import { SmpEncryptOptions } from './smp';

type NobleBindingsEventType =
  // notify from peripheral
  | 'discover' // for onfind
  | 'disconnect'
  | 'stateChange'
  | 'notification'
  | 'handleNotify'
  | 'updatePhy';

/**
 * @ignore
 */
export class NobleBindings extends EventEmitter<NobleBindingsEventType> {
  public _connectable: { [key: string]: boolean };

  private _state: HciState | null;
  private _addresses: { [uuid: string]: BleDeviceAddress };
  private _addresseTypes: { [uuid: string]: BleDeviceAddressType };
  private _handles: any;
  private _gatts: { [handle: string]: GattCentral };
  private _aclStreams: { [key: string]: AclStream };
  private _signalings: any;
  private _hci: Hci;
  private _gap: Gap;
  private _scanServiceUuids: UUID[] | null = null;
  private _connectPromises: Promise<any>[];

  constructor(hciProtocol: any) {
    super();
    this._hci = hciProtocol;
    this._gap = new Gap(this._hci);

    this._state = null;

    this._addresses = {};
    this._addresseTypes = {};
    this._connectable = {};

    this._handles = {};
    this._gatts = {};
    this._aclStreams = {};
    this._signalings = {};
    this._connectPromises = [];

    this._hci.on('stateChange', this.onStateChange.bind(this));
    this._hci.on('disconnComplete', this.onDisconnComplete.bind(this));
    this._hci.on('aclDataPkt', this.onAclDataPkt.bind(this));
    this._hci.on('updatePhy', this.onPhy.bind(this));

    this._gap.on('discover', this.onDiscover.bind(this));
  }

  /**
   * @ignore
   * @private
   */
  public _reset() {
    this._state = null;

    this._addresses = {};
    this._addresseTypes = {};
    this._connectable = {};

    this._handles = {};
    this._gatts = {};
    this._aclStreams = {};
    this._signalings = {};
    this._gap._reset();

    // TODO: It must be canceled.
    this._connectPromises = [];
  }

  public debugHandler: any = () => {
    // do nothing.
  };

  public addPeripheralData(uuid: UUID, addressType: BleDeviceAddressType) {
    if (!this._addresses[uuid]) {
      const address: any = BleHelper.addColon(uuid);
      this._addresses[uuid] = address;
      this._addresseTypes[uuid] = addressType;
      this._connectable[uuid] = true;
    }
  }

  public async startExtendedScanningWait(
    serviceUuids: UUID[],
    allowDuplicates: boolean,
    activeScan: boolean,
    usePhy1m: boolean,
    usePhyCoded: boolean
  ) {
    if (!usePhy1m && !usePhyCoded) {
      throw new ObnizBleInvalidParameterError(
        'Please make either true',
        `usePhy1M:${usePhy1m} usePhyCoded:${usePhyCoded}`
      );
    }
    this._scanServiceUuids = serviceUuids ?? null;

    await this._gap.startExtendedScanningWait(
      allowDuplicates,
      activeScan,
      usePhy1m,
      usePhyCoded
    );
  }

  public async startScanningWait(
    serviceUuids: UUID[],
    allowDuplicates: boolean,
    activeScan: boolean
  ) {
    this._scanServiceUuids = serviceUuids ?? null;

    await this._gap.startScanningWait(allowDuplicates, activeScan);
  }

  public async stopScanningWait() {
    await this._gap.stopScanningWait();
  }

  public async stopExtendedScanningWait() {
    await this._gap.stopExtendedScanningWait();
  }

  public async connectWait(
    peripheralUuid: BleDeviceAddress,
    mtu: number | null,
    onConnectCallback?: any
  ) {
    const address = this._addresses[peripheralUuid];
    const addressType: any = this._addresseTypes[peripheralUuid];
    if (!address) {
      throw new ObnizBleUnknownPeripheralError(peripheralUuid);
    }

    // Block parall connection ongoing for ESP32 bug.
    const doPromise = Promise.all(this._connectPromises)
      .catch((error) => {
        // nothing
      })
      .then(async () => {
        const conResult = await this._hci.createLeConnWait(
          address,
          addressType,
          90 * 1000,
          (result: any) => {
            // on connect success
            this.onLeConnComplete(
              result.status,
              result.handle,
              result.role,
              result.addressType,
              result.address,
              result.interval,
              result.latency,
              result.supervisionTimeout,
              result.masterClockAccuracy
            );
            if (onConnectCallback && typeof onConnectCallback === 'function') {
              onConnectCallback();
            }
          }
        ); // connection timeout for 90 secs.

        return await this._gatts[conResult.handle].exchangeMtuWait(mtu);
      })
      .then(
        () => {
          this._connectPromises = this._connectPromises.filter(
            (e) => e === doPromise
          );
          return Promise.resolve();
        },
        (error) => {
          this._connectPromises = this._connectPromises.filter(
            (e) => e === doPromise
          );
          return Promise.reject(error);
        }
      );
    this._connectPromises.push(doPromise);
    return doPromise;
  }

  public async setDefaultPhyWait(
    usePhy1m: boolean,
    usePhy2m: boolean,
    usePhyCoded: boolean
  ) {
    if (!usePhy1m && !usePhyCoded && !usePhy2m) {
      throw new ObnizBleInvalidParameterError(
        'Please make either true',
        `usePhy1M:${usePhy1m} usePhy2M:${usePhy2m} usePhyCoded:${usePhyCoded}`
      );
    }
    const booleanToNumber = (flg: boolean): number => (flg ? 1 : 0);
    const setPhy =
      booleanToNumber(usePhy1m) +
      booleanToNumber(usePhy2m) * 2 +
      booleanToNumber(usePhyCoded) * 4;
    await this._hci.leSetDefaultPhyCommandWait(0, setPhy, setPhy);
  }

  public async readPhyWait(address: string) {
    return await this._hci.leReadPhyCommandWait(this._handles[address]);
  }

  public async setPhyWait(
    address: string,
    usePhy1m: boolean,
    usePhy2m: boolean,
    usePhyCoded: boolean,
    useCodedModeS8: boolean,
    useCodedModeS2: boolean
  ) {
    if (!usePhy1m && !usePhyCoded && !usePhy2m) {
      throw new ObnizBleInvalidParameterError(
        'Please make either true',
        `usePhy1M:${usePhy1m} usePhy2M:${usePhy2m} usePhyCoded:${usePhyCoded}`
      );
    }
    if (usePhyCoded && !useCodedModeS8 && !useCodedModeS2) {
      throw new ObnizBleInvalidParameterError(
        'Please make either true',
        `useCodedModeS8:${useCodedModeS8} useCodedModeS2:${useCodedModeS2}`
      );
    }
    const booleanToNumber = (flg: boolean): number => (flg ? 1 : 0);
    const setPhy =
      booleanToNumber(usePhy1m) +
      booleanToNumber(usePhy2m) * 2 +
      booleanToNumber(usePhyCoded) * 4;
    await this._hci.leSetPhyCommandWait(
      this._handles[address],
      0,
      setPhy,
      setPhy,
      booleanToNumber(useCodedModeS8) * 2 + booleanToNumber(useCodedModeS2)
    );
  }

  public onPhy(handler: number, txPhy: number, rxPhy: number) {
    this.emit('updatePhy', handler, txPhy, rxPhy);
  }

  public async connectExtendedWait(
    peripheralUuid: BleDeviceAddress,
    mtu: number | null,
    onConnectCallback?: any,
    usePhy1m = true,
    usePhy2m = true,
    usePhyCoded = true
  ) {
    if (!usePhy1m && !usePhyCoded && !usePhy2m) {
      throw new ObnizBleInvalidParameterError(
        'Please make either true',
        `usePhy1M:${usePhy1m} usePhy2M:${usePhy2m} usePhyCoded:${usePhyCoded}`
      );
    }
    const address = this._addresses[peripheralUuid];
    const addressType: any = this._addresseTypes[peripheralUuid];
    if (!address) {
      throw new ObnizBleUnknownPeripheralError(peripheralUuid);
    }

    // Block parall connection ongoing for ESP32 bug.
    const doPromise = Promise.all(this._connectPromises)
      .catch((error) => {
        // nothing
      })
      .then(async () => {
        const conResult = await this._hci.createLeExtendedConnWait(
          address,
          addressType,
          90 * 1000,
          (result: any) => {
            // on connect success
            this.onLeConnComplete(
              result.status,
              result.handle,
              result.role,
              result.addressType,
              result.address,
              result.interval,
              result.latency,
              result.supervisionTimeout,
              result.masterClockAccuracy
            );
            if (onConnectCallback && typeof onConnectCallback === 'function') {
              onConnectCallback();
            }
          },
          usePhy1m,
          usePhy2m,
          usePhyCoded
        ); // connection timeout for 90 secs.

        return await this._gatts[conResult.handle].exchangeMtuWait(mtu);
      })
      .then(
        () => {
          this._connectPromises = this._connectPromises.filter(
            (e) => e === doPromise
          );
          return Promise.resolve();
        },
        (error) => {
          this._connectPromises = this._connectPromises.filter(
            (e) => e === doPromise
          );
          return Promise.reject(error);
        }
      );
    this._connectPromises.push(doPromise);
    return doPromise;
  }

  public disconnect(peripheralUuid: any) {
    this._hci.disconnect(this._handles[peripheralUuid]);
  }

  public async updateRssiWait(peripheralUuid: UUID) {
    const rssi = await this._hci.readRssiWait(this._handles[peripheralUuid]);
    return rssi;
  }

  public onStateChange(state: HciState) {
    if (this._state === state) {
      return;
    }
    this._state = state;

    this.emit('stateChange', state);
  }

  public onDiscover(
    status: any,
    address: any,
    addressType: any,
    connectable: any,
    advertisement: any,
    rssi: number
  ) {
    if (this._scanServiceUuids === null) {
      // scan not started ?
      return;
    }

    let serviceUuids = advertisement.serviceUuids || [];
    const serviceData = advertisement.serviceData || [];
    let hasScanServiceUuids = this._scanServiceUuids.length === 0;

    if (!hasScanServiceUuids) {
      serviceUuids = serviceUuids.slice();

      for (const i in serviceData) {
        serviceUuids.push(serviceData[i].uuid);
      }

      for (const i in serviceUuids) {
        hasScanServiceUuids =
          this._scanServiceUuids.indexOf(serviceUuids[i]) !== -1;

        if (hasScanServiceUuids) {
          break;
        }
      }
    }

    if (hasScanServiceUuids) {
      const uuid: any = address.split(':').join('');
      this._addresses[uuid] = address;
      this._addresseTypes[uuid] = addressType;
      this._connectable[uuid] = connectable;

      this.emit(
        'discover',
        uuid,
        address,
        addressType,
        connectable,
        advertisement,
        rssi
      );
    }
  }

  public onLeConnComplete(
    status: any,
    handle: any,
    role: any,
    addressType: any,
    address: BleDeviceAddress,
    interval: any,
    latency: any,
    supervisionTimeout: any,
    masterClockAccuracy: any
  ) {
    if (role !== 0) {
      // not master, ignore
      return;
    }

    if (status !== 0) {
      throw new ObnizBleHciStateError(status);
    }
    const uuid = address!.split(':').join('').toLowerCase();

    const aclStream: AclStream = new AclStream(
      this._hci,
      handle,
      this._hci.addressType,
      this._hci.address,
      addressType,
      address
    );
    aclStream.debugHandler = (text: any) => {
      this.debug(text);
    };
    const gatt = new GattCentral(address!, aclStream);
    const signaling: any = new Signaling(handle, aclStream);

    this._gatts[uuid] = this._gatts[handle] = gatt;
    this._signalings[uuid] = this._signalings[handle] = signaling;
    this._aclStreams[handle] = aclStream;
    this._handles[uuid] = handle;
    this._handles[handle] = uuid;

    this._gatts[handle].on('notification', this.onNotification.bind(this));
    this._gatts[handle].on('handleNotify', this.onHandleNotify.bind(this));

    this._signalings[handle].on(
      'connectionParameterUpdateRequest',
      this.onConnectionParameterUpdateWait.bind(this)
    );

    // public onMtu(address: any, mtu?: any) {}
  }

  public onDisconnComplete(handle: any, reason: number) {
    const uuid = this._handles[handle];

    if (uuid) {
      const error = new ObnizBleHciStateError(reason, {
        peripheralAddress: uuid,
      });
      this._gatts[handle].onEnd(error);
      this._gatts[handle].removeAllListeners();
      this._signalings[handle].removeAllListeners();

      delete this._gatts[uuid];
      delete this._gatts[handle];
      delete this._signalings[uuid];
      delete this._signalings[handle];
      delete this._aclStreams[handle];
      delete this._handles[uuid];
      delete this._handles[handle];

      this.emit('disconnect', uuid, error); // TODO: handle reason?
    } else {
      // maybe disconnect as peripheral
      // console.warn(
      //   'noble warning: unknown handle ' + handle + ' disconnected!'
      // );
    }
  }

  public onAclDataPkt(handle: any, cid?: any, data?: any) {
    const aclStream: AclStream = this._aclStreams[handle];

    if (aclStream) {
      aclStream.push(cid, data);
    }
  }

  public async discoverServicesWait(peripheralUuid: any, uuids?: any) {
    const gatt: GattCentral = this.getGatt(peripheralUuid);

    const services = await gatt.discoverServicesWait(uuids || []);
    return services;
  }

  public async discoverIncludedServicesWait(
    peripheralUuid: BleDeviceAddress,
    serviceUuid: UUID,
    serviceUuids: UUID[]
  ) {
    const gatt: GattCentral = this.getGatt(peripheralUuid);

    const services = gatt.discoverIncludedServicesWait(
      serviceUuid,
      serviceUuids || []
    );
    return services;
  }

  public async discoverCharacteristicsWait(
    peripheralUuid: BleDeviceAddress,
    serviceUuid: UUID,
    characteristicUuids?: UUID[]
  ) {
    const gatt: GattCentral = this.getGatt(peripheralUuid);
    const chars = await gatt.discoverCharacteristicsWait(
      serviceUuid,
      characteristicUuids || []
    );
    return chars;
  }

  public async readWait(
    peripheralUuid: BleDeviceAddress,
    serviceUuid: UUID,
    characteristicUuid: UUID
  ): Promise<Buffer> {
    const gatt: GattCentral = this.getGatt(peripheralUuid);
    const data = await gatt.readWait(serviceUuid, characteristicUuid);
    return data;
  }

  public async writeWait(
    peripheralUuid: BleDeviceAddress,
    serviceUuid: UUID,
    characteristicUuid: UUID,
    data: Buffer,
    withoutResponse: boolean
  ): Promise<void> {
    const gatt: GattCentral = this.getGatt(peripheralUuid);
    await gatt.writeWait(
      serviceUuid,
      characteristicUuid,
      data,
      withoutResponse
    );
  }

  public async broadcastWait(
    peripheralUuid: BleDeviceAddress,
    serviceUuid: UUID,
    characteristicUuid: UUID,
    broadcast: boolean
  ): Promise<void> {
    const gatt: GattCentral = this.getGatt(peripheralUuid);
    await gatt.broadcastWait(serviceUuid, characteristicUuid, broadcast);
  }

  public async notifyWait(
    peripheralUuid: BleDeviceAddress,
    serviceUuid: UUID,
    characteristicUuid: UUID,
    notify: boolean
  ) {
    const gatt: GattCentral = this.getGatt(peripheralUuid);
    await gatt.notifyWait(serviceUuid, characteristicUuid, notify);
  }

  public onNotification(
    address: BleDeviceAddress,
    serviceUuid?: UUID,
    characteristicUuid?: UUID,
    data?: Buffer
  ) {
    const uuid: any = address.split(':').join('').toLowerCase();

    this.emit(
      'notification',
      uuid,
      serviceUuid,
      characteristicUuid,
      data,
      true,
      true
    );
  }

  public async discoverDescriptorsWait(
    peripheralUuid: BleDeviceAddress,
    serviceUuid: UUID,
    characteristicUuid: UUID
  ): Promise<UUID[]> {
    const gatt: GattCentral = this.getGatt(peripheralUuid);
    return await gatt.discoverDescriptorsWait(serviceUuid, characteristicUuid);
  }

  public async readValueWait(
    peripheralUuid: BleDeviceAddress,
    serviceUuid: UUID,
    characteristicUuid: UUID,
    descriptorUuid: UUID
  ): Promise<Buffer> {
    const gatt: GattCentral = this.getGatt(peripheralUuid);
    return await gatt.readValueWait(
      serviceUuid,
      characteristicUuid,
      descriptorUuid
    );
  }

  public async writeValueWait(
    peripheralUuid: BleDeviceAddress,
    serviceUuid: UUID,
    characteristicUuid: UUID,
    descriptorUuid: UUID,
    data: Buffer
  ) {
    const gatt: GattCentral = this.getGatt(peripheralUuid);
    await gatt.writeValueWait(
      serviceUuid,
      characteristicUuid,
      descriptorUuid,
      data
    );
  }

  public async readHandleWait(
    peripheralUuid: BleDeviceAddress,
    attHandle: HandleIndex
  ): Promise<Buffer> {
    const gatt: GattCentral = this.getGatt(peripheralUuid);
    const data = await gatt.readHandleWait(attHandle);
    return data;
  }

  public async writeHandleWait(
    peripheralUuid: BleDeviceAddress,
    attHandle: HandleIndex,
    data: Buffer,
    withoutResponse: boolean
  ): Promise<void> {
    const gatt: GattCentral = this.getGatt(peripheralUuid);
    await gatt.writeHandleWait(attHandle, data, withoutResponse);
  }

  public onHandleNotify(
    address: BleDeviceAddress,
    handle?: HandleIndex,
    data?: Buffer
  ) {
    const uuid: any = address.split(':').join('').toLowerCase();

    this.emit('handleNotify', uuid, handle, data);
  }

  public onConnectionParameterUpdateWait(
    handle: Handle,
    minInterval: number,
    maxInterval: number,
    latency: number,
    supervisionTimeout: number
  ) {
    this._hci
      .connUpdateLeWait(
        handle,
        minInterval,
        maxInterval,
        latency,
        supervisionTimeout
      )
      .then(() => {
        // do nothing.
      })
      .catch((e) => {
        // TODO:
        // This must passed to Obniz class.
        // console.error(e);
      });
    // this.onLeConnUpdateComplete(); is nop
  }

  public async isPairingFinishedWait(peripheralUuid: BleDeviceAddress) {
    const gatt: GattCentral = this.getGatt(peripheralUuid);
    const result = gatt.hasEncryptKeys();
    return result;
  }

  public async getPairingKeysWait(peripheralUuid: BleDeviceAddress) {
    const gatt: GattCentral = this.getGatt(peripheralUuid);
    const result = gatt.getEncryptKeys();
    return result;
  }

  public async pairingWait(
    peripheralUuid: BleDeviceAddress,
    options?: SmpEncryptOptions
  ): Promise<string> {
    options = options || {};
    const gatt: GattCentral = this.getGatt(peripheralUuid);
    const result = await gatt.encryptWait(options);
    return result;
  }

  public setPairingOption(
    peripheralUuid: BleDeviceAddress,
    options: SmpEncryptOptions
  ) {
    options = options || {};
    const gatt: GattCentral = this.getGatt(peripheralUuid);
    gatt.setEncryptOption(options);
  }

  private getGatt(peripheralUuid: BleDeviceAddress): GattCentral {
    const handle = this._handles[peripheralUuid];
    const gatt: GattCentral = this._gatts[handle];

    if (!gatt) {
      throw new ObnizBleUnknownPeripheralError(peripheralUuid);
    }
    return gatt;
  }

  private debug(text: string) {
    this.debugHandler(`${text}`);
  }
}
