// Type definitions for bleHciProtocolCentralBindings
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace NobleBindings.prototype {
  // NobleBindings.prototype.startScanning.!0
  type StartScanning0 = any[];
}
declare namespace NobleBindings.prototype {
  // NobleBindings.prototype.discoverServices.!1
  type DiscoverServices1 = any[];
}
declare namespace NobleBindings.prototype {
  // NobleBindings.prototype.discoverIncludedServices.!2
  type DiscoverIncludedServices2 = any[];
}
declare namespace NobleBindings.prototype {
  // NobleBindings.prototype.discoverCharacteristics.!2
  type DiscoverCharacteristics2 = any[];
}

/**
 *
 */
declare interface NobleBindings {

  /**
   *
   * @param hciProtocol
   */
  new(hciProtocol: any): NobleBindings;

  /**
   *
   * @param serviceUuids
   * @param allowDuplicates
   */
  startScanning(serviceUuids: NobleBindings.prototype.StartScanning0, allowDuplicates: any): void;

  /**
   *
   */
  stopScanning(): void;

  /**
   *
   * @param peripheralUuid
   */
  connect(peripheralUuid: any): void;

  /**
   *
   * @param peripheralUuid
   */
  disconnect(peripheralUuid: any): void;

  /**
   *
   * @param peripheralUuid
   */
  updateRssi(peripheralUuid: any): void;

  /**
   *
   */
  init(): void;

  /**
   *
   * @param state
   */
  onStateChange(state: any): void;

  /**
   *
   * @param address
   */
  onAddressChange(address: any): void;

  /**
   *
   * @param filterDuplicates
   */
  onScanStart(filterDuplicates: any): void;

  /**
   *
   */
  onScanStop(): void;

  /**
   *
   * @param status
   * @param address
   * @param addressType
   * @param connectable
   * @param advertisement
   * @param rssi
   */
  onDiscover(status: any, address: any, addressType: any, connectable: any, advertisement: any, rssi: any): void;

  /**
   *
   * @param status
   * @param handle
   * @param role
   * @param addressType
   * @param address
   * @param interval
   * @param latency
   * @param supervisionTimeout
   * @param masterClockAccuracy
   */
  onLeConnComplete(status: any, handle: any, role: any, addressType: any, address: any, interval: any, latency: any, supervisionTimeout: any, masterClockAccuracy: any): void;

  /**
   *
   * @param handle
   * @param interval
   * @param latency
   * @param supervisionTimeout
   */
  onLeConnUpdateComplete(handle: any, interval: any, latency: any, supervisionTimeout: any): void;

  /**
   *
   * @param handle
   * @param reason
   */
  onDisconnComplete(handle: any, reason: any): void;

  /**
   *
   * @param handle
   * @param encrypt
   */
  onEncryptChange(handle: any, encrypt: any): void;

  /**
   *
   * @param address
   * @param mtu
   */
  onMtu(address: any, mtu: any): void;

  /**
   *
   * @param handle
   * @param rssi
   */
  onRssiRead(handle: any, rssi: any): void;

  /**
   *
   * @param handle
   * @param cid
   * @param data
   */
  onAclDataPkt(handle: any, cid: any, data: any): void;

  /**
   *
   * @param peripheralUuid
   * @param uuids
   */
  discoverServices(peripheralUuid: any, uuids: NobleBindings.prototype.DiscoverServices1): void;

  /**
   *
   * @param address
   * @param serviceUuids
   */
  onServicesDiscovered(address: any, serviceUuids: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param serviceUuids
   */
  discoverIncludedServices(peripheralUuid: any, serviceUuid: any, serviceUuids: NobleBindings.prototype.DiscoverIncludedServices2): void;

  /**
   *
   * @param address
   * @param serviceUuid
   * @param includedServiceUuids
   */
  onIncludedServicesDiscovered(address: any, serviceUuid: any, includedServiceUuids: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param characteristicUuids
   */
  discoverCharacteristics(peripheralUuid: any, serviceUuid: any, characteristicUuids: NobleBindings.prototype.DiscoverCharacteristics2): void;

  /**
   *
   * @param address
   * @param serviceUuid
   * @param characteristics
   */
  onCharacteristicsDiscovered(address: any, serviceUuid: any, characteristics: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param characteristicUuid
   */
  read(peripheralUuid: any, serviceUuid: any, characteristicUuid: any): void;

  /**
   *
   * @param address
   * @param serviceUuid
   * @param characteristicUuid
   * @param data
   * @param isSuccess
   */
  onRead(address: any, serviceUuid: any, characteristicUuid: any, data: any, isSuccess: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param characteristicUuid
   * @param data
   * @param withoutResponse
   */
  write(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, data: any, withoutResponse: any): void;

  /**
   *
   * @param address
   * @param serviceUuid
   * @param characteristicUuid
   * @param isSuccess
   */
  onWrite(address: any, serviceUuid: any, characteristicUuid: any, isSuccess: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param characteristicUuid
   * @param broadcast
   */
  broadcast(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, broadcast: any): void;

  /**
   *
   * @param address
   * @param serviceUuid
   * @param characteristicUuid
   * @param state
   */
  onBroadcast(address: any, serviceUuid: any, characteristicUuid: any, state: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param characteristicUuid
   * @param notify
   */
  notify(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, notify: any): void;

  /**
   *
   * @param address
   * @param serviceUuid
   * @param characteristicUuid
   * @param state
   */
  onNotify(address: any, serviceUuid: any, characteristicUuid: any, state: any): void;

  /**
   *
   * @param address
   * @param serviceUuid
   * @param characteristicUuid
   * @param data
   */
  onNotification(address: any, serviceUuid: any, characteristicUuid: any, data: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param characteristicUuid
   */
  discoverDescriptors(peripheralUuid: any, serviceUuid: any, characteristicUuid: any): void;

  /**
   *
   * @param address
   * @param serviceUuid
   * @param characteristicUuid
   * @param descriptorUuids
   */
  onDescriptorsDiscovered(address: any, serviceUuid: any, characteristicUuid: any, descriptorUuids: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param characteristicUuid
   * @param descriptorUuid
   */
  readValue(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, descriptorUuid: any): void;

  /**
   *
   * @param address
   * @param serviceUuid
   * @param characteristicUuid
   * @param descriptorUuid
   * @param data
   * @param isSuccess
   */
  onValueRead(address: any, serviceUuid: any, characteristicUuid: any, descriptorUuid: any, data: any, isSuccess: any): void;

  /**
   *
   * @param peripheralUuid
   * @param serviceUuid
   * @param characteristicUuid
   * @param descriptorUuid
   * @param data
   */
  writeValue(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, descriptorUuid: any, data: any): void;

  /**
   *
   * @param address
   * @param serviceUuid
   * @param characteristicUuid
   * @param descriptorUuid
   * @param isSuccess
   */
  onValueWrite(address: any, serviceUuid: any, characteristicUuid: any, descriptorUuid: any, isSuccess: any): void;

  /**
   *
   * @param peripheralUuid
   * @param attHandle
   */
  readHandle(peripheralUuid: any, attHandle: any): void;

  /**
   *
   * @param address
   * @param handle
   * @param data
   */
  onHandleRead(address: any, handle: any, data: any): void;

  /**
   *
   * @param peripheralUuid
   * @param attHandle
   * @param data
   * @param withoutResponse
   */
  writeHandle(peripheralUuid: any, attHandle: any, data: any, withoutResponse: any): void;

  /**
   *
   * @param address
   * @param handle
   */
  onHandleWrite(address: any, handle: any): void;

  /**
   *
   * @param address
   * @param handle
   * @param data
   */
  onHandleNotify(address: any, handle: any, data: any): void;

  /**
   *
   * @param handle
   * @param minInterval
   * @param maxInterval
   * @param latency
   * @param supervisionTimeout
   */
  onConnectionParameterUpdateRequest(handle: any, minInterval: any, maxInterval: any, latency: any, supervisionTimeout: any): void;
}

declare module "bleHciProtocolCentralBindings" {

  export default bleHciProtocolCentralBindings;    // es6 style module export
}
