/// <reference types="node" />
import events from "events";
declare class BlenoBindings extends events.EventEmitter {
    _state: any;
    _advertising: any;
    _hci: any;
    _gap: any;
    _gatt: any;
    _address: any;
    _handle: any;
    _aclStream: any;
    emit: any;
    constructor(hciProtocol: any);
    startAdvertising(name: any, serviceUuids: any): void;
    startAdvertisingIBeacon(data: any): void;
    startAdvertisingWithEIRData(advertisementData: any, scanData: any): void;
    stopAdvertising(): void;
    setServices(services: any): void;
    disconnect(): void;
    updateRssi(): void;
    init(): void;
    onStateChange(state: any): void;
    onAddressChange(address: any): void;
    onReadLocalVersion(hciVer: any, hciRev?: any, lmpVer?: any, manufacturer?: any, lmpSubVer?: any): void;
    onAdvertisingStart(error: any): void;
    onAdvertisingStop(): void;
    onLeConnComplete(status: any, handle?: any, role?: any, addressType?: any, address?: any, interval?: any, latency?: any, supervisionTimeout?: any, masterClockAccuracy?: any): void;
    onLeConnUpdateComplete(handle: any, interval?: any, latency?: any, supervisionTimeout?: any): void;
    onDisconnComplete(handle: any, reason?: any): void;
    onEncryptChange(handle: any, encrypt?: any): void;
    onLeLtkNegReply(handle: any): void;
    onMtuChange(mtu: any): void;
    onRssiRead(handle: any, rssi?: any): void;
    onAclDataPkt(handle: any, cid?: any, data?: any): void;
}
export default BlenoBindings;
