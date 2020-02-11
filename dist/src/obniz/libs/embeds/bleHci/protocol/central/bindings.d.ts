/// <reference types="node" />
import events from "events";
/**
 * @ignore
 */
declare class NobleBindings extends events.EventEmitter {
    _state: any;
    _addresses: any;
    _addresseTypes: any;
    _connectable: any;
    _pendingConnectionUuid: any;
    _connectionQueue: any;
    _handles: any;
    _gatts: any;
    _aclStreams: any;
    _signalings: any;
    _hci: any;
    _gap: any;
    _scanServiceUuids: any;
    constructor(hciProtocol: any);
    startScanning(serviceUuids: any, allowDuplicates: any): void;
    stopScanning(): void;
    connect(peripheralUuid: any): void;
    disconnect(peripheralUuid: any): void;
    updateRssi(peripheralUuid: any): void;
    init(): void;
    onStateChange(state: any): void;
    onAddressChange(address: any): void;
    onScanStart(filterDuplicates: any): void;
    onScanStop(): void;
    onDiscover(status: any, address?: any, addressType?: any, connectable?: any, advertisement?: any, rssi?: any): void;
    onLeConnComplete(status: any, handle?: any, role?: any, addressType?: any, address?: any, interval?: any, latency?: any, supervisionTimeout?: any, masterClockAccuracy?: any): void;
    onLeConnUpdateComplete(handle: any, interval?: any, latency?: any, supervisionTimeout?: any): void;
    onDisconnComplete(handle: any, reason?: any): void;
    onEncryptChange(handle: any, encrypt?: any): void;
    onMtu(address: any, mtu?: any): void;
    onRssiRead(handle: any, rssi?: any): void;
    onAclDataPkt(handle: any, cid?: any, data?: any): void;
    discoverServices(peripheralUuid: any, uuids: any): void;
    onServicesDiscovered(address: any, serviceUuids?: any): void;
    discoverIncludedServices(peripheralUuid: any, serviceUuid: any, serviceUuids: any): void;
    onIncludedServicesDiscovered(address: any, serviceUuid?: any, includedServiceUuids?: any): void;
    discoverCharacteristics(peripheralUuid: any, serviceUuid: any, characteristicUuids: any): void;
    onCharacteristicsDiscovered(address: any, serviceUuid?: any, characteristics?: any): void;
    read(peripheralUuid: any, serviceUuid: any, characteristicUuid: any): void;
    onRead(address: any, serviceUuid?: any, characteristicUuid?: any, data?: any, isSuccess?: any): void;
    write(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, data: any, withoutResponse: any): void;
    onWrite(address: any, serviceUuid?: any, characteristicUuid?: any, isSuccess?: any): void;
    broadcast(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, broadcast: any): void;
    onBroadcast(address: any, serviceUuid?: any, characteristicUuid?: any, state?: any): void;
    notify(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, notify: any): void;
    onNotify(address: any, serviceUuid?: any, characteristicUuid?: any, state?: any): void;
    onNotification(address: any, serviceUuid?: any, characteristicUuid?: any, data?: any): void;
    discoverDescriptors(peripheralUuid: any, serviceUuid: any, characteristicUuid: any): void;
    onDescriptorsDiscovered(address: any, serviceUuid?: any, characteristicUuid?: any, descriptorUuids?: any): void;
    readValue(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, descriptorUuid: any): void;
    onValueRead(address: any, serviceUuid?: any, characteristicUuid?: any, descriptorUuid?: any, data?: any, isSuccess?: any): void;
    writeValue(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, descriptorUuid: any, data: any): void;
    onValueWrite(address: any, serviceUuid?: any, characteristicUuid?: any, descriptorUuid?: any, isSuccess?: any): void;
    readHandle(peripheralUuid: any, attHandle: any): void;
    onHandleRead(address: any, handle?: any, data?: any): void;
    writeHandle(peripheralUuid: any, attHandle: any, data: any, withoutResponse: any): void;
    onHandleWrite(address: any, handle?: any): void;
    onHandleNotify(address: any, handle?: any, data?: any): void;
    onConnectionParameterUpdateRequest(handle: any, minInterval?: any, maxInterval?: any, latency?: any, supervisionTimeout?: any): void;
}
export default NobleBindings;
