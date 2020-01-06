// Type definitions for bleHciBle
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace ObnizBLE.prototype {
  // ObnizBLE.prototype.directConnect.!ret

  /**
   *
   */
  interface DirectConnectRet {

    /**
     *
     */
    discoverdOnRemote: boolean;
  }
}
declare namespace ObnizBLE {
  // ObnizBLE.remotePeripherals.<i>

  /**
   *
   */
  interface RemotePeripheralsI {

    /**
     *
     */
    discoverdOnRemote: boolean;
  }
}

/**
 *
 */
declare interface ObnizBLE {

  /**
   *
   */
  _initialized: boolean;

  /**
   *
   */
  _initializeWarning: boolean;

  /**
   *
   */
  remotePeripherals: ObnizBLE.RemotePeripheralsI[];

  /**
   *
   * @param Obniz
   */
  new(Obniz: any): ObnizBLE;

  /**
   *
   */
  initWait(): void;

  /**
   *
   */
  warningIfNotInitialize(): void;

  /**
   *
   * @param obj
   */
  notified(obj: /* ObnizBLE.prototype.+ObnizBLE */ any): void;

  /**
   *
   */
  _reset(): void;

  /**
   *
   * @param uuid
   * @param addressType
   * @return
   */
  directConnect(uuid: any, addressType: any): ObnizBLE.prototype.DirectConnectRet;

  /**
   *
   * @param uuid
   * @param addressType
   * @return
   */
  directConnectWait(uuid: any, addressType: any): /* ObnizBLE.remotePeripherals.<i> */ any;

  /**
   *
   * @param address
   * @return
   */
  findPeripheral(address: any): /* !this.remotePeripherals.<i> */ any;

  /**
   *
   */
  onStateChange(): void;

  /**
   *
   */
  onAddressChange(): void;

  /**
   *
   */
  onScanStart(): void;

  /**
   *
   */
  onScanStop(): void;

  /**
   *
   * @param uuid
   * @param address
   * @param addressType
   * @param connectable
   * @param advertisement
   * @param rssi
   */
  onDiscover(uuid: any, address: any, addressType: any, connectable: any, advertisement: any, rssi: any): void;

  /**
   *
   * @param peripheralUuid
   * @param error
   */
  onConnect(peripheralUuid: any, error: any): void;

  /**
   *
   * @param peripheralUuid
   */
  onDisconnect(peripheralUuid: any): void;

  /**
   *
   */
  onRssiUpdate(): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuids
   */
  onServicesDiscover(peripheralUuid: any, serviceUuids: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param includedServiceUuids
   */
  onIncludedServicesDiscover(peripheralUuid: any, serviceUuid: any, includedServiceUuids: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param characteristics
   */
  onCharacteristicsDiscover(peripheralUuid: any, serviceUuid: any, characteristics: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param characteristicUuid
   * @param data
   * @param isNotification
   * @param isSuccess
   */
  onRead(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, data: any, isNotification: any, isSuccess: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param characteristicUuid
   * @param isSuccess
   */
  onWrite(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, isSuccess: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param characteristicUuid
   * @param state
   */
  onBroadcast(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, state: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param characteristicUuid
   * @param state
   */
  onNotify(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, state: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param characteristicUuid
   * @param descriptors
   */
  onDescriptorsDiscover(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, descriptors: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param characteristicUuid
   * @param descriptorUuid
   * @param data
   * @param isSuccess
   */
  onValueRead(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, descriptorUuid: any, data: any, isSuccess: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param characteristicUuid
   * @param descriptorUuid
   * @param isSuccess
   */
  onValueWrite(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, descriptorUuid: any, isSuccess: any): void;

  /**
   *
   * @param peripheralUuid
   * @param handle
   * @param data
   */
  onHandleRead(peripheralUuid: any, handle: any, data: any): void;

  /**
   *
   * @param peripheralUuid
   * @param handle
   */
  onHandleWrite(peripheralUuid: any, handle: any): void;

  /**
   *
   * @param peripheralUuid
   * @param handle
   * @param data
   */
  onHandleNotify(peripheralUuid: any, handle: any, data: any): void;

  /**
   *
   * @param state
   */
  onPeripheralStateChange(state: any): void;

  /**
   *
   * @param address
   */
  onPeripheralAddressChange(address: any): void;

  /**
   *
   * @param platform
   */
  onPeripheralPlatform(platform: any): void;

  /**
   *
   * @param error
   */
  onPeripheralAdvertisingStart(error: any): void;

  /**
   *
   */
  onPeripheralAdvertisingStop(): void;

  /**
   *
   * @param error
   */
  onPeripheralServicesSet(error: any): void;

  /**
   *
   * @param clientAddress
   */
  onPeripheralAccept(clientAddress: any): void;

  /**
   *
   * @param mtu
   */
  onPeripheralMtuChange(mtu: any): void;

  /**
   *
   * @param clientAddress
   */
  onPeripheralDisconnect(clientAddress: any): void;

  /**
   *
   * @param rssi
   */
  onPeripheralRssiUpdate(rssi: any): void;

  /**
   *
   */
  _bind(): void;

  /**
   *
   * @param data
   * @param reverse
   * @return
   */
  _dataArray2uuidHex(data: any, reverse: any): string;
}

declare module "bleHciBle" {

  export default bleHciBle;    // es6 style module export
}
