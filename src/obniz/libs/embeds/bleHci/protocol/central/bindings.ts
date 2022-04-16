/**
 * @packageDocumentation
 *
 * @ignore
 */
// var debug = require('debug')('bindings');

import EventEmitter from 'eventemitter3';

import {
  ObnizBleHciStateError,
  ObnizBleUnknownPeripheralError,
} from '../../../../../ObnizError';
import BleCharacteristic from '../../bleCharacteristic';
import {
  BleDeviceAddress,
  BleDeviceAddressType,
  BleDeviceAddressWithColon,
  BleDiscoveryAdvertisement,
  Handle,
  UUID,
} from '../../bleTypes';
import Hci, { HciState } from '../hci';
import { HandleIndex } from '../peripheral/gatt';
import AclStream from './acl-stream';
import Gap from './gap';
import GattCentral from './gatt';
import Signaling from './signaling';
import { SmpEncryptOptions } from './smp';

type NobleBindingsEventType =
  // notify from peripheral
  | 'discover' // for onfind
  | 'disconnect'
  | 'stateChange'
  | 'notification'
  | 'handleNotify';

/**
 * @ignore
 */
class NobleBindings extends EventEmitter<NobleBindingsEventType> {
  private _state: HciState | null;
  private _handles: Record<BleDeviceAddress, number>;
  private _addresses: Record<number, BleDeviceAddress>;
  private _gatts: Record<BleDeviceAddress, GattCentral>;
  private _aclStreams: Record<BleDeviceAddress, AclStream>;
  private _signalings: Record<BleDeviceAddress, Signaling>;
  private _hci: Hci;
  private _gap: Gap;
  private _scanServiceUuids: UUID[] | null = null;
  private _connectPromises: Promise<unknown>[];

  constructor(hciProtocol: Hci) {
    super();
    this._hci = hciProtocol;
    this._gap = new Gap(this._hci);

    this._state = null;

    this._handles = {};
    this._addresses = {};
    this._gatts = {};
    this._aclStreams = {};
    this._signalings = {};
    this._connectPromises = [];

    this._hci.on('stateChange', this.onStateChange.bind(this));
    this._hci.on('disconnComplete', this.onDisconnComplete.bind(this));
    // this._hci.on('aclDataPkt', this.onAclDataPkt.bind(this));

    this._gap.on('discover', this.onDiscover.bind(this));
  }

  /**
   * @ignore
   * @private
   */
  public _reset(): void {
    this._state = null;

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

  public async startScanningWait(
    serviceUuids: UUID[],
    allowDuplicates: boolean,
    activeScan: boolean
  ): Promise<void> {
    this._scanServiceUuids = serviceUuids ?? null;

    await this._gap.startScanningWait(allowDuplicates, activeScan);
  }

  public async stopScanningWait(): Promise<void> {
    await this._gap.stopScanningWait();
  }

  /**
   * Connect to BLE device
   *
   * @param peripheralDeviceAddress ex: 0123456789ab
   * @param peripheralAddressType public | random | rpa_public | rpa_random
   * @param mtu bytes
   * @param onConnectCallback
   */
  public async connectWait(
    address: BleDeviceAddress,
    addressType: BleDeviceAddressType,
    mtu: number | null,
    onConnectCallback?: () => void
  ): Promise<void> {
    if (!address) {
      throw new ObnizBleUnknownPeripheralError(address);
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
          (result: {
            status: number;
            handle: number;
            role: number;
            addressType: BleDeviceAddressType;
            address: BleDeviceAddress;
            interval: number;
            latency: number;
            supervisionTimeout: number;
            masterClockAccuracy: number;
          }) => {
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

        return await this._gatts[address].exchangeMtuWait(mtu);
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

  public disconnect(address: BleDeviceAddress): void {
    this._hci.disconnect(this._handles[address]);
  }

  public async updateRssiWait(address: BleDeviceAddress): Promise<number> {
    const rssi = await this._hci.readRssiWait(this._handles[address]);
    return rssi;
  }

  public onStateChange(state: HciState): void {
    if (this._state === state) {
      return;
    }
    this._state = state;

    this.emit('stateChange', state);
  }

  public onDiscover(
    status: 0,
    addressWithColon: BleDeviceAddressWithColon,
    addressType: BleDeviceAddressType,
    connectable: boolean,
    advertisement: BleDiscoveryAdvertisement,
    rssi: number
  ): void {
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
      const address = addressWithColon.split(':').join('');

      this.emit(
        'discover',
        address,
        addressType,
        connectable,
        advertisement,
        rssi
      );
    }
  }

  public onLeConnComplete(
    status: number,
    handle: number,
    role: number,
    addressType: BleDeviceAddressType,
    addressWithColon: BleDeviceAddressWithColon,
    interval: number,
    latency: number,
    supervisionTimeout: number,
    masterClockAccuracy: number
  ): void {
    if (role !== 0) {
      // not master, ignore
      return;
    }

    if (status !== 0) {
      throw new ObnizBleHciStateError(status);
    }
    const address = addressWithColon.split(':').join('').toLowerCase();

    const aclStream = new AclStream(
      this._hci,
      handle,
      this._hci.addressType,
      this._hci.address,
      addressType,
      addressWithColon
    );
    aclStream.debugHandler = (text: any) => {
      this.debug(text);
    };
    const gatt = new GattCentral(addressWithColon, aclStream);
    const signaling = new Signaling(handle, aclStream);

    this._gatts[address] = gatt;
    this._signalings[address] = signaling;
    this._aclStreams[address] = aclStream;
    this._handles[address] = handle;
    this._addresses[handle] = address;

    this._gatts[address].on('notification', this.onNotification.bind(this));
    this._gatts[address].on('handleNotify', this.onHandleNotify.bind(this));

    this._signalings[address].on(
      'connectionParameterUpdateRequest',
      this.onConnectionParameterUpdateWait.bind(this)
    );

    // public onMtu(address: any, mtu?: any) {}
  }

  public onDisconnComplete(handle: number, reason: number): void {
    const address = this._addresses[handle];

    if (address) {
      const error = new ObnizBleHciStateError(reason, {
        peripheralAddress: address,
      });
      this._gatts[address].onEnd(error);
      this._gatts[address].removeAllListeners();
      this._signalings[address].removeAllListeners();

      delete this._gatts[address];
      delete this._signalings[address];
      delete this._aclStreams[address];
      delete this._handles[address];
      delete this._addresses[handle];

      this.emit('disconnect', address, error); // TODO: handle reason?
    } else {
      // maybe disconnect as peripheral
      // console.warn(
      //   'noble warning: unknown handle ' + handle + ' disconnected!'
      // );
    }
  }

  /** not used */
  public onAclDataPkt(handle: number, cid: number, data: Buffer): void {
    const address = this._addresses[handle];
    const aclStream = this._aclStreams[address];

    if (aclStream) {
      aclStream.push(cid, data);
    }
  }

  public async discoverServicesWait(
    address: BleDeviceAddress,
    uuids?: UUID[]
  ): Promise<UUID[]> {
    const gatt = this.getGatt(address);

    const services = await gatt.discoverServicesWait(uuids || []);
    return services;
  }

  /** not used */
  public async discoverIncludedServicesWait(
    address: string,
    serviceUuid: UUID,
    serviceUuids: UUID[]
  ): Promise<UUID[] | undefined> {
    const gatt = this.getGatt(address);

    const services = gatt.discoverIncludedServicesWait(
      serviceUuid,
      serviceUuids || []
    );
    return services;
  }

  public async discoverCharacteristicsWait(
    address: BleDeviceAddress,
    serviceUuid: UUID,
    characteristicUuids?: UUID[]
  ): Promise<BleCharacteristic[]> {
    const gatt = this.getGatt(address);
    const chars = await gatt.discoverCharacteristicsWait(
      serviceUuid,
      characteristicUuids || []
    );
    return chars;
  }

  public async readWait(
    address: BleDeviceAddress,
    serviceUuid: UUID,
    characteristicUuid: UUID
  ): Promise<Buffer> {
    const gatt = this.getGatt(address);
    const data = await gatt.readWait(serviceUuid, characteristicUuid);
    return data;
  }

  public async writeWait(
    address: BleDeviceAddress,
    serviceUuid: UUID,
    characteristicUuid: UUID,
    data: Buffer,
    withoutResponse: boolean
  ): Promise<void> {
    const gatt = this.getGatt(address);
    await gatt.writeWait(
      serviceUuid,
      characteristicUuid,
      data,
      withoutResponse
    );
  }

  /** not used */
  public async broadcastWait(
    address: BleDeviceAddress,
    serviceUuid: UUID,
    characteristicUuid: UUID,
    broadcast: boolean
  ): Promise<void> {
    const gatt = this.getGatt(address);
    await gatt.broadcastWait(serviceUuid, characteristicUuid, broadcast);
  }

  public async notifyWait(
    address: BleDeviceAddress,
    serviceUuid: UUID,
    characteristicUuid: UUID,
    notify: boolean
  ): Promise<void> {
    const gatt = this.getGatt(address);
    await gatt.notifyWait(serviceUuid, characteristicUuid, notify);
  }

  public onNotification(
    addressWithColon: BleDeviceAddressWithColon,
    serviceUuid: UUID,
    characteristicUuid: UUID,
    data: Buffer
  ): void {
    const address = addressWithColon.split(':').join('').toLowerCase();

    this.emit(
      'notification',
      address,
      serviceUuid,
      characteristicUuid,
      data,
      true,
      true
    );
  }

  public async discoverDescriptorsWait(
    address: BleDeviceAddress,
    serviceUuid: UUID,
    characteristicUuid: UUID
  ): Promise<UUID[]> {
    const gatt = this.getGatt(address);
    return await gatt.discoverDescriptorsWait(serviceUuid, characteristicUuid);
  }

  public async readValueWait(
    address: BleDeviceAddress,
    serviceUuid: UUID,
    characteristicUuid: UUID,
    descriptorUuid: UUID
  ): Promise<Buffer> {
    const gatt = this.getGatt(address);
    return await gatt.readValueWait(
      serviceUuid,
      characteristicUuid,
      descriptorUuid
    );
  }

  public async writeValueWait(
    address: BleDeviceAddress,
    serviceUuid: UUID,
    characteristicUuid: UUID,
    descriptorUuid: UUID,
    data: Buffer
  ): Promise<void> {
    const gatt = this.getGatt(address);
    await gatt.writeValueWait(
      serviceUuid,
      characteristicUuid,
      descriptorUuid,
      data
    );
  }

  /** not used */
  public async readHandleWait(
    address: BleDeviceAddress,
    attHandle: HandleIndex
  ): Promise<Buffer> {
    const gatt = this.getGatt(address);
    const data = await gatt.readHandleWait(attHandle);
    return data;
  }

  /** not used */
  public async writeHandleWait(
    address: BleDeviceAddress,
    attHandle: HandleIndex,
    data: Buffer,
    withoutResponse: boolean
  ): Promise<void> {
    const gatt = this.getGatt(address);
    await gatt.writeHandleWait(attHandle, data, withoutResponse);
  }

  public onHandleNotify(
    addressWithColon: BleDeviceAddress,
    handle: HandleIndex,
    data: Buffer
  ): void {
    const address = addressWithColon.split(':').join('').toLowerCase();

    this.emit('handleNotify', address, handle, data);
  }

  public onConnectionParameterUpdateWait(
    handle: Handle,
    minInterval: number,
    maxInterval: number,
    latency: number,
    supervisionTimeout: number
  ): void {
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

  public async pairingWait(
    address: BleDeviceAddress,
    options?: SmpEncryptOptions
  ): Promise<string> {
    options = options || {};
    const gatt = this.getGatt(address);
    const result = await gatt.encryptWait(options);
    return result;
  }

  public setPairingOption(
    address: BleDeviceAddress,
    options: SmpEncryptOptions
  ): void {
    options = options || {};
    const gatt = this.getGatt(address);
    gatt.setEncryptOption(options);
  }

  private getGatt(address: BleDeviceAddress): GattCentral {
    const gatt = this._gatts[address];

    if (!gatt) {
      throw new ObnizBleUnknownPeripheralError(address);
    }
    return gatt;
  }

  private debug(text: string) {
    this.debugHandler(`${text}`);
  }
}

export default NobleBindings;
