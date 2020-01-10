"use strict";
// var debug = require('debug')('bindings');
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
const AclStream = require("./acl-stream");
const Gatt = require("./gatt");
const Gap = require("./gap");
const Signaling = require("./signaling");
const Hci = require("../hci");
class NobleBindings extends events.EventEmitter {
    constructor(hciProtocol) {
        super();
        this._state = null;
        this._addresses = {};
        this._addresseTypes = {};
        this._connectable = {};
        this._pendingConnectionUuid = null;
        this._connectionQueue = [];
        this._handles = {};
        this._gatts = {};
        this._aclStreams = {};
        this._signalings = {};
        this._hci = hciProtocol;
        this._gap = new Gap(this._hci);
    }
    startScanning(serviceUuids, allowDuplicates) {
        this._scanServiceUuids = serviceUuids || [];
        this._gap.startScanning(allowDuplicates);
    }
    stopScanning() {
        this._gap.stopScanning();
    }
    connect(peripheralUuid) {
        const address = this._addresses[peripheralUuid];
        const addressType = this._addresseTypes[peripheralUuid];
        if (!this._pendingConnectionUuid) {
            this._pendingConnectionUuid = peripheralUuid;
            this._hci.createLeConn(address, addressType);
        }
        else {
            this._connectionQueue.push(peripheralUuid);
        }
    }
    disconnect(peripheralUuid) {
        this._hci.disconnect(this._handles[peripheralUuid]);
    }
    updateRssi(peripheralUuid) {
        this._hci.readRssi(this._handles[peripheralUuid]);
    }
    init() {
        this._gap.on("scanStart", this.onScanStart.bind(this));
        this._gap.on("scanStop", this.onScanStop.bind(this));
        this._gap.on("discover", this.onDiscover.bind(this));
        this._hci.on("stateChange", this.onStateChange.bind(this));
        this._hci.on("addressChange", this.onAddressChange.bind(this));
        this._hci.on("leConnComplete", this.onLeConnComplete.bind(this));
        this._hci.on("leConnUpdateComplete", this.onLeConnUpdateComplete.bind(this));
        this._hci.on("rssiRead", this.onRssiRead.bind(this));
        this._hci.on("disconnComplete", this.onDisconnComplete.bind(this));
        this._hci.on("encryptChange", this.onEncryptChange.bind(this));
        this._hci.on("aclDataPkt", this.onAclDataPkt.bind(this));
    }
    onStateChange(state) {
        if (this._state === state) {
            return;
        }
        this._state = state;
        if (state === "unauthorized") {
            console.log("noble warning: adapter state unauthorized, please run as root or with sudo");
            console.log("               or see README for information on running without root/sudo:");
            console.log("               https://github.com/sandeepmistry/noble#running-on-linux");
        }
        else if (state === "unsupported") {
            console.log("noble warning: adapter does not support Bluetooth Low Energy (BLE, Bluetooth Smart).");
            console.log("               Try to run with environment variable:");
            console.log("               [sudo] NOBLE_HCI_DEVICE_ID=x node ...");
        }
        this.emit("stateChange", state);
    }
    onAddressChange(address) {
        this.emit("addressChange", address);
    }
    onScanStart(filterDuplicates) {
        this.emit("scanStart", filterDuplicates);
    }
    onScanStop() {
        this.emit("scanStop");
    }
    onDiscover(status, address, addressType, connectable, advertisement, rssi) {
        if (this._scanServiceUuids === undefined) {
            return;
        }
        let serviceUuids = advertisement.serviceUuids || [];
        const serviceData = advertisement.serviceData || [];
        let hasScanServiceUuids = this._scanServiceUuids.length === 0;
        if (!hasScanServiceUuids) {
            let i;
            serviceUuids = serviceUuids.slice();
            for (i in serviceData) {
                serviceUuids.push(serviceData[i].uuid);
            }
            for (i in serviceUuids) {
                hasScanServiceUuids =
                    this._scanServiceUuids.indexOf(serviceUuids[i]) !== -1;
                if (hasScanServiceUuids) {
                    break;
                }
            }
        }
        if (hasScanServiceUuids) {
            const uuid = address.split(":").join("");
            this._addresses[uuid] = address;
            this._addresseTypes[uuid] = addressType;
            this._connectable[uuid] = connectable;
            this.emit("discover", uuid, address, addressType, connectable, advertisement, rssi);
        }
    }
    onLeConnComplete(status, handle, role, addressType, address, interval, latency, supervisionTimeout, masterClockAccuracy) {
        if (role !== 0) {
            // not master, ignore
            return;
        }
        let uuid = null;
        let error = null;
        if (status === 0) {
            uuid = address
                .split(":")
                .join("")
                .toLowerCase();
            const aclStream = new AclStream(this._hci, handle, this._hci.addressType, this._hci.address, addressType, address);
            const gatt = new Gatt(address, aclStream);
            const signaling = new Signaling(handle, aclStream);
            this._gatts[uuid] = this._gatts[handle] = gatt;
            this._signalings[uuid] = this._signalings[handle] = signaling;
            this._aclStreams[handle] = aclStream;
            this._handles[uuid] = handle;
            this._handles[handle] = uuid;
            this._gatts[handle].on("mtu", this.onMtu.bind(this));
            this._gatts[handle].on("servicesDiscover", this.onServicesDiscovered.bind(this));
            this._gatts[handle].on("includedServicesDiscover", this.onIncludedServicesDiscovered.bind(this));
            this._gatts[handle].on("characteristicsDiscover", this.onCharacteristicsDiscovered.bind(this));
            this._gatts[handle].on("read", this.onRead.bind(this));
            this._gatts[handle].on("write", this.onWrite.bind(this));
            this._gatts[handle].on("broadcast", this.onBroadcast.bind(this));
            this._gatts[handle].on("notify", this.onNotify.bind(this));
            this._gatts[handle].on("notification", this.onNotification.bind(this));
            this._gatts[handle].on("descriptorsDiscover", this.onDescriptorsDiscovered.bind(this));
            this._gatts[handle].on("valueRead", this.onValueRead.bind(this));
            this._gatts[handle].on("valueWrite", this.onValueWrite.bind(this));
            this._gatts[handle].on("handleRead", this.onHandleRead.bind(this));
            this._gatts[handle].on("handleWrite", this.onHandleWrite.bind(this));
            this._gatts[handle].on("handleNotify", this.onHandleNotify.bind(this));
            this._signalings[handle].on("connectionParameterUpdateRequest", this.onConnectionParameterUpdateRequest.bind(this));
            this._gatts[handle].exchangeMtu(256);
        }
        else {
            uuid = this._pendingConnectionUuid;
            let statusMessage = Hci.STATUS_MAPPER[status] || "HCI Error: Unknown";
            const errorCode = " (0x" + status.toString(16) + ")";
            statusMessage = statusMessage + errorCode;
            error = new Error(statusMessage);
        }
        this.emit("connect", uuid, error);
        if (this._connectionQueue.length > 0) {
            const peripheralUuid = this._connectionQueue.shift();
            address = this._addresses[peripheralUuid];
            addressType = this._addresseTypes[peripheralUuid];
            this._pendingConnectionUuid = peripheralUuid;
            this._hci.createLeConn(address, addressType);
        }
        else {
            this._pendingConnectionUuid = null;
        }
    }
    onLeConnUpdateComplete(handle, interval, latency, supervisionTimeout) {
        // no-op
    }
    onDisconnComplete(handle, reason) {
        const uuid = this._handles[handle];
        if (uuid) {
            this._aclStreams[handle].push(null, null);
            this._gatts[handle].removeAllListeners();
            this._signalings[handle].removeAllListeners();
            delete this._gatts[uuid];
            delete this._gatts[handle];
            delete this._signalings[uuid];
            delete this._signalings[handle];
            delete this._aclStreams[handle];
            delete this._handles[uuid];
            delete this._handles[handle];
            this.emit("disconnect", uuid); // TODO: handle reason?
        }
        else {
            // maybe disconnect as peripheral
            // console.warn(
            //   'noble warning: unknown handle ' + handle + ' disconnected!'
            // );
        }
    }
    onEncryptChange(handle, encrypt) {
        const aclStream = this._aclStreams[handle];
        if (aclStream) {
            aclStream.pushEncrypt(encrypt);
        }
    }
    onMtu(address, mtu) {
    }
    onRssiRead(handle, rssi) {
        this.emit("rssiUpdate", this._handles[handle], rssi);
    }
    onAclDataPkt(handle, cid, data) {
        const aclStream = this._aclStreams[handle];
        if (aclStream) {
            aclStream.push(cid, data);
        }
    }
    discoverServices(peripheralUuid, uuids) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.discoverServices(uuids || []);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onServicesDiscovered(address, serviceUuids) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("servicesDiscover", uuid, serviceUuids);
    }
    discoverIncludedServices(peripheralUuid, serviceUuid, serviceUuids) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.discoverIncludedServices(serviceUuid, serviceUuids || []);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onIncludedServicesDiscovered(address, serviceUuid, includedServiceUuids) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("includedServicesDiscover", uuid, serviceUuid, includedServiceUuids);
    }
    discoverCharacteristics(peripheralUuid, serviceUuid, characteristicUuids) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.discoverCharacteristics(serviceUuid, characteristicUuids || []);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onCharacteristicsDiscovered(address, serviceUuid, characteristics) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("characteristicsDiscover", uuid, serviceUuid, characteristics);
    }
    read(peripheralUuid, serviceUuid, characteristicUuid) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.read(serviceUuid, characteristicUuid);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onRead(address, serviceUuid, characteristicUuid, data, isSuccess) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("read", uuid, serviceUuid, characteristicUuid, data, false, isSuccess);
    }
    write(peripheralUuid, serviceUuid, characteristicUuid, data, withoutResponse) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.write(serviceUuid, characteristicUuid, data, withoutResponse);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onWrite(address, serviceUuid, characteristicUuid, isSuccess) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("write", uuid, serviceUuid, characteristicUuid, isSuccess);
    }
    broadcast(peripheralUuid, serviceUuid, characteristicUuid, broadcast) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.broadcast(serviceUuid, characteristicUuid, broadcast);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onBroadcast(address, serviceUuid, characteristicUuid, state) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("broadcast", uuid, serviceUuid, characteristicUuid, state);
    }
    notify(peripheralUuid, serviceUuid, characteristicUuid, notify) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.notify(serviceUuid, characteristicUuid, notify);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onNotify(address, serviceUuid, characteristicUuid, state) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("notify", uuid, serviceUuid, characteristicUuid, state);
    }
    onNotification(address, serviceUuid, characteristicUuid, data) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("read", uuid, serviceUuid, characteristicUuid, data, true, true);
    }
    discoverDescriptors(peripheralUuid, serviceUuid, characteristicUuid) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.discoverDescriptors(serviceUuid, characteristicUuid);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onDescriptorsDiscovered(address, serviceUuid, characteristicUuid, descriptorUuids) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("descriptorsDiscover", uuid, serviceUuid, characteristicUuid, descriptorUuids);
    }
    readValue(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.readValue(serviceUuid, characteristicUuid, descriptorUuid);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onValueRead(address, serviceUuid, characteristicUuid, descriptorUuid, data, isSuccess) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("valueRead", uuid, serviceUuid, characteristicUuid, descriptorUuid, data, isSuccess);
    }
    writeValue(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid, data) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.writeValue(serviceUuid, characteristicUuid, descriptorUuid, data);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onValueWrite(address, serviceUuid, characteristicUuid, descriptorUuid, isSuccess) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("valueWrite", uuid, serviceUuid, characteristicUuid, descriptorUuid, isSuccess);
    }
    readHandle(peripheralUuid, attHandle) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.readHandle(attHandle);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onHandleRead(address, handle, data) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("handleRead", uuid, handle, data);
    }
    writeHandle(peripheralUuid, attHandle, data, withoutResponse) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.writeHandle(attHandle, data, withoutResponse);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onHandleWrite(address, handle) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("handleWrite", uuid, handle);
    }
    onHandleNotify(address, handle, data) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("handleNotify", uuid, handle, data);
    }
    onConnectionParameterUpdateRequest(handle, minInterval, maxInterval, latency, supervisionTimeout) {
        this._hci.connUpdateLe(handle, minInterval, maxInterval, latency, supervisionTimeout);
    }
}
exports.default = NobleBindings;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvcHJvdG9jb2wvY2VudHJhbC9iaW5kaW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNENBQTRDOztBQUU1QyxNQUFNLE1BQU0sR0FBUSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFdEMsTUFBTSxTQUFTLEdBQVEsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQy9DLE1BQU0sSUFBSSxHQUFRLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwQyxNQUFNLEdBQUcsR0FBUSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbEMsTUFBTSxTQUFTLEdBQVEsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sR0FBRyxHQUFRLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUVuQyxNQUFNLGFBQWMsU0FBUSxNQUFNLENBQUMsWUFBWTtJQWdCN0MsWUFBWSxXQUFnQjtRQUMxQixLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBRW5CLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBRXZCLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUM7UUFDbkMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUUzQixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUV0QixJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQztRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFH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LENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQ3BCLHFCQUFxQixFQUNyQixJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUN4QyxDQUFDO1lBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMs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Q0FBQyxDQUFDO1NBQ3BEO2FBQU07WUFDTCxPQUFPLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxHQUFHLGNBQWMsQ0FBQyxDQUFDO1NBQ3JFO0lBQ0gsQ0FBQztJQUVNLGFBQWEsQ0FBQyxPQUFZLEVBQUUsTUFBWTtRQUM3QyxNQUFNLElBQUksR0FBUSxPQUFPO2FBQ3RCLEtBQUssQ0FBQyxHQUFHLENBQUM7YUFDVixJQUFJLENBQUMsRUFBRSxDQUFDO2FBQ1IsV0FBVyxFQUFFLENBQUM7UUFFakIsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFTSxjQUFjLENBQUMsT0FBWSxFQUFFLE1BQVksRUFBRSxJQUFVO1FBQzFELE1BQU0sSUFBSSxHQUFRLE9BQU87YUFDdEIsS0FBSyxDQUFDLEdBQUcsQ0FBQzthQUNWLElBQUksQ0FBQyxFQUFFLENBQUM7YUFDUixXQUFXLEVBQUUsQ0FBQztRQUVqQixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFTSxrQ0FBa0MsQ0FDdkMsTUFBVyxFQUNYLFdBQWlCLEVBQ2pCLFdBQWlCLEVBQ2pCLE9BQWEsRUFDYixrQkFBd0I7UUFFeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQ3BCLE1BQU0sRUFDTixXQUFXLEVBQ1gsV0FBVyxFQUNYLE9BQU8sRUFDUCxrQkFBa0IsQ0FDbkIsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELGtCQUFlLGFBQWEsQ0FBQyIsImZpbGUiOiJzcmMvb2JuaXovbGlicy9lbWJlZHMvYmxlSGNpL3Byb3RvY29sL2NlbnRyYWwvYmluZGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB2YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdiaW5kaW5ncycpO1xuXG5jb25zdCBldmVudHM6IGFueSA9IHJlcXVpcmUoXCJldmVudHNcIik7XG5cbmNvbnN0IEFjbFN0cmVhbTogYW55ID0gcmVxdWlyZShcIi4vYWNsLXN0cmVhbVwiKTtcbmNvbnN0IEdhdHQ6IGFueSA9IHJlcXVpcmUoXCIuL2dhdHRcIik7XG5jb25zdCBHYXA6IGFueSA9IHJlcXVpcmUoXCIuL2dhcFwiKTtcbmNvbnN0IFNpZ25hbGluZzogYW55ID0gcmVxdWlyZShcIi4vc2lnbmFsaW5nXCIpO1xuY29uc3QgSGNpOiBhbnkgPSByZXF1aXJlKFwiLi4vaGNpXCIpO1xuXG5jbGFzcyBOb2JsZUJpbmRpbmdzIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIHB1YmxpYyBfc3RhdGU6IGFueTtcbiAgcHVibGljIF9hZGRyZXNzZXM6IGFueTtcbiAgcHVibGljIF9hZGRyZXNzZVR5cGVzOiBhbnk7XG4gIHB1YmxpYyBfY29ubmVjdGFibGU6IGFueTtcbiAgcHVibGljIF9wZW5kaW5nQ29ubmVjdGlvblV1aWQ6IGFueTtcbiAgcHVibGljIF9jb25uZWN0aW9uUXVldWU6IGFueTtcbiAgcHVibGljIF9oYW5kbGVzOiBhbnk7XG4gIHB1YmxpYyBfZ2F0dHM6IGFueTtcbiAgcHVibGljIF9hY2xTdHJlYW1zOiBhbnk7XG4gIHB1YmxpYyBfc2lnbmFsaW5nczogYW55O1xuICBwdWJsaWMgX2hjaTogYW55O1xuICBwdWJsaWMgX2dhcDogYW55O1xuICBwdWJsaWMgX3NjYW5TZXJ2aWNlVXVpZHM6IGFueTtcbiAgcHVibGljIGVtaXQ6IGFueTtcblxuICBjb25zdHJ1Y3RvcihoY2lQcm90b2NvbDogYW55KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9zdGF0ZSA9IG51bGw7XG5cbiAgICB0aGlzLl9hZGRyZXNzZXMgPSB7fTtcbiAgICB0aGlzLl9hZGRyZXNzZVR5cGVzID0ge307XG4gICAgdGhpcy5fY29ubmVjdGFibGUgPSB7fTtcblxuICAgIHRoaXMuX3BlbmRpbmdDb25uZWN0aW9uVXVpZCA9IG51bGw7XG4gICAgdGhpcy5fY29ubmVjdGlvblF1ZXVlID0gW107XG5cbiAgICB0aGlzLl9oYW5kbGVzID0ge307XG4gICAgdGhpcy5fZ2F0dHMgPSB7fTtcbiAgICB0aGlzLl9hY2xTdHJlYW1zID0ge307XG4gICAgdGhpcy5fc2lnbmFsaW5ncyA9IHt9O1xuXG4gICAgdGhpcy5faGNpID0gaGNpUHJvdG9jb2w7XG4gICAgdGhpcy5fZ2FwID0gbmV3IEdhcCh0aGlzLl9oY2kpO1xuICB9XG5cbiAgcHVibGljIHN0YXJ0U2Nhbm5pbmcoc2VydmljZVV1aWRzOiBhbnksIGFsbG93RHVwbGljYXRlczogYW55KSB7XG4gICAgdGhpcy5fc2NhblNlcnZpY2VVdWlkcyA9IHNlcnZpY2VVdWlkcyB8fCBbXTtcblxuICAgIHRoaXMuX2dhcC5zdGFydFNjYW5uaW5nKGFsbG93RHVwbGljYXRlcyk7XG4gIH1cblxuICBwdWJsaWMgc3RvcFNjYW5uaW5nKCkge1xuICAgIHRoaXMuX2dhcC5zdG9wU2Nhbm5pbmcoKTtcbiAgfVxuXG4gIHB1YmxpYyBjb25uZWN0KHBlcmlwaGVyYWxVdWlkOiBhbnkpIHtcbiAgICBjb25zdCBhZGRyZXNzOiBhbnkgPSB0aGlzLl9hZGRyZXNzZXNbcGVyaXBoZXJhbFV1aWRdO1xuICAgIGNvbnN0IGFkZHJlc3NUeXBlOiBhbnkgPSB0aGlzLl9hZGRyZXNzZVR5cGVzW3BlcmlwaGVyYWxVdWlkXTtcblxuICAgIGlmICghdGhpcy5fcGVuZGluZ0Nvbm5lY3Rpb25VdWlkKSB7XG4gICAgICB0aGlzLl9wZW5kaW5nQ29ubmVjdGlvblV1aWQgPSBwZXJpcGhlcmFsVXVpZDtcblxuICAgICAgdGhpcy5faGNpLmNyZWF0ZUxlQ29ubihhZGRyZXNzLCBhZGRyZXNzVHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2Nvbm5lY3Rpb25RdWV1ZS5wdXNoKHBlcmlwaGVyYWxVdWlkKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZGlzY29ubmVjdChwZXJpcGhlcmFsVXVpZDogYW55KSB7XG4gICAgdGhpcy5faGNpLmRpc2Nvbm5lY3QodGhpcy5faGFuZGxlc1twZXJpcGhlcmFsVXVpZF0pO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZVJzc2kocGVyaXBoZXJhbFV1aWQ6IGFueSkge1xuICAgIHRoaXMuX2hjaS5yZWFkUnNzaSh0aGlzLl9oYW5kbGVzW3BlcmlwaGVyYWxVdWlkXSk7XG4gIH1cblxuICBwdWJsaWMgaW5pdCgpIHtcbiAgICB0aGlzLl9nYXAub24oXCJzY2FuU3RhcnRcIiwgdGhpcy5vblNjYW5TdGFydC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9nYXAub24oXCJzY2FuU3RvcFwiLCB0aGlzLm9uU2NhblN0b3AuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fZ2FwLm9uKFwiZGlzY292ZXJcIiwgdGhpcy5vbkRpc2NvdmVyLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5faGNpLm9uKFwic3RhdGVDaGFuZ2VcIiwgdGhpcy5vblN0YXRlQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX2hjaS5vbihcImFkZHJlc3NDaGFuZ2VcIiwgdGhpcy5vbkFkZHJlc3NDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5faGNpLm9uKFwibGVDb25uQ29tcGxldGVcIiwgdGhpcy5vbkxlQ29ubkNvbXBsZXRlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX2hjaS5vbihcbiAgICAgIFwibGVDb25uVXBkYXRlQ29tcGxldGVcIixcbiAgICAgIHRoaXMub25MZUNvbm5VcGRhdGVDb21wbGV0ZS5iaW5kKHRoaXMpLFxuICAgICk7XG4gICAgdGhpcy5faGNpLm9uKFwicnNzaVJlYWRcIiwgdGhpcy5vblJzc2lSZWFkLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX2hjaS5vbihcImRpc2Nvbm5Db21wbGV0ZVwiLCB0aGlzLm9uRGlzY29ubkNvbXBsZXRlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX2hjaS5vbihcImVuY3J5cHRDaGFuZ2VcIiwgdGhpcy5vbkVuY3J5cHRDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5faGNpLm9uKFwiYWNsRGF0YVBrdFwiLCB0aGlzLm9uQWNsRGF0YVBrdC5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIHB1YmxpYyBvblN0YXRlQ2hhbmdlKHN0YXRlOiBhbnkpIHtcbiAgICBpZiAodGhpcy5fc3RhdGUgPT09IHN0YXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG5cbiAgICBpZiAoc3RhdGUgPT09IFwidW5hdXRob3JpemVkXCIpIHtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBcIm5vYmxlIHdhcm5pbmc6IGFkYXB0ZXIgc3RhdGUgdW5hdXRob3JpemVkLCBwbGVhc2UgcnVuIGFzIHJvb3Qgb3Igd2l0aCBzdWRvXCIsXG4gICAgICApO1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIFwiICAgICAgICAgICAgICAgb3Igc2VlIFJFQURNRSBmb3IgaW5mb3JtYXRpb24gb24gcnVubmluZyB3aXRob3V0IHJvb3Qvc3VkbzpcIixcbiAgICAgICk7XG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgXCIgICAgICAgICAgICAgICBodHRwczovL2dpdGh1Yi5jb20vc2FuZGVlcG1pc3RyeS9ub2JsZSNydW5uaW5nLW9uLWxpbnV4XCIsXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IFwidW5zdXBwb3J0ZWRcIikge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIFwibm9ibGUgd2FybmluZzogYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IEJsdWV0b290aCBMb3cgRW5lcmd5IChCTEUsIEJsdWV0b290aCBTbWFydCkuXCIsXG4gICAgICApO1xuICAgICAgY29uc29sZS5sb2coXCIgICAgICAgICAgICAgICBUcnkgdG8gcnVuIHdpdGggZW52aXJvbm1lbnQgdmFyaWFibGU6XCIpO1xuICAgICAgY29uc29sZS5sb2coXCIgICAgICAgICAgICAgICBbc3Vkb10gTk9CTEVfSENJX0RFVklDRV9JRD14IG5vZGUgLi4uXCIpO1xuICAgIH1cblxuICAgIHRoaXMuZW1pdChcInN0YXRlQ2hhbmdlXCIsIHN0YXRlKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkFkZHJlc3NDaGFuZ2UoYWRkcmVzczogYW55KSB7XG4gICAgdGhpcy5lbWl0KFwiYWRkcmVzc0NoYW5nZVwiLCBhZGRyZXNzKTtcbiAgfVxuXG4gIHB1YmxpYyBvblNjYW5TdGFydChmaWx0ZXJEdXBsaWNhdGVzOiBhbnkpIHtcbiAgICB0aGlzLmVtaXQoXCJzY2FuU3RhcnRcIiwgZmlsdGVyRHVwbGljYXRlcyk7XG4gIH1cblxuICBwdWJsaWMgb25TY2FuU3RvcCgpIHtcbiAgICB0aGlzLmVtaXQoXCJzY2FuU3RvcFwiKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkRpc2NvdmVyKHN0YXR1czogYW55LCBhZGRyZXNzPzogYW55LCBhZGRyZXNzVHlwZT86IGFueSwgY29ubmVjdGFibGU/OiBhbnksIGFkdmVydGlzZW1lbnQ/OiBhbnksIHJzc2k/OiBhbnkpIHtcbiAgICBpZiAodGhpcy5fc2NhblNlcnZpY2VVdWlkcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHNlcnZpY2VVdWlkczogYW55ID0gYWR2ZXJ0aXNlbWVudC5zZXJ2aWNlVXVpZHMgfHwgW107XG4gICAgY29uc3Qgc2VydmljZURhdGE6IGFueSA9IGFkdmVydGlzZW1lbnQuc2VydmljZURhdGEgfHwgW107XG4gICAgbGV0IGhhc1NjYW5TZXJ2aWNlVXVpZHM6IGFueSA9IHRoaXMuX3NjYW5TZXJ2aWNlVXVpZHMubGVuZ3RoID09PSAwO1xuXG4gICAgaWYgKCFoYXNTY2FuU2VydmljZVV1aWRzKSB7XG4gICAgICBsZXQgaTogYW55O1xuXG4gICAgICBzZXJ2aWNlVXVpZHMgPSBzZXJ2aWNlVXVpZHMuc2xpY2UoKTtcblxuICAgICAgZm9yIChpIGluIHNlcnZpY2VEYXRhKSB7XG4gICAgICAgIHNlcnZpY2VVdWlkcy5wdXNoKHNlcnZpY2VEYXRhW2ldLnV1aWQpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGkgaW4gc2VydmljZVV1aWRzKSB7XG4gICAgICAgIGhhc1NjYW5TZXJ2aWNlVXVpZHMgPVxuICAgICAgICAgIHRoaXMuX3NjYW5TZXJ2aWNlVXVpZHMuaW5kZXhPZihzZXJ2aWNlVXVpZHNbaV0pICE9PSAtMTtcblxuICAgICAgICBpZiAoaGFzU2NhblNlcnZpY2VVdWlkcykge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhc1NjYW5TZXJ2aWNlVXVpZHMpIHtcbiAgICAgIGNvbnN0IHV1aWQ6IGFueSA9IGFkZHJlc3Muc3BsaXQoXCI6XCIpLmpvaW4oXCJcIik7XG4gICAgICB0aGlzLl9hZGRyZXNzZXNbdXVpZF0gPSBhZGRyZXNzO1xuICAgICAgdGhpcy5fYWRkcmVzc2VUeXBlc1t1dWlkXSA9IGFkZHJlc3NUeXBlO1xuICAgICAgdGhpcy5fY29ubmVjdGFibGVbdXVpZF0gPSBjb25uZWN0YWJsZTtcblxuICAgICAgdGhpcy5lbWl0KFxuICAgICAgICBcImRpc2NvdmVyXCIsXG4gICAgICAgIHV1aWQsXG4gICAgICAgIGFkZHJlc3MsXG4gICAgICAgIGFkZHJlc3NUeXBlLFxuICAgICAgICBjb25uZWN0YWJsZSxcbiAgICAgICAgYWR2ZXJ0aXNlbWVudCxcbiAgICAgICAgcnNzaSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uTGVDb25uQ29tcGxldGUoXG4gICAgc3RhdHVzOiBhbnksXG4gICAgaGFuZGxlPzogYW55LFxuICAgIHJvbGU/OiBhbnksXG4gICAgYWRkcmVzc1R5cGU/OiBhbnksXG4gICAgYWRkcmVzcz86IGFueSxcbiAgICBpbnRlcnZhbD86IGFueSxcbiAgICBsYXRlbmN5PzogYW55LFxuICAgIHN1cGVydmlzaW9uVGltZW91dD86IGFueSxcbiAgICBtYXN0ZXJDbG9ja0FjY3VyYWN5PzogYW55LFxuICApIHtcbiAgICBpZiAocm9sZSAhPT0gMCkge1xuICAgICAgLy8gbm90IG1hc3RlciwgaWdub3JlXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHV1aWQ6IGFueSA9IG51bGw7XG5cbiAgICBsZXQgZXJyb3I6IGFueSA9IG51bGw7XG5cbiAgICBpZiAoc3RhdHVzID09PSAwKSB7XG4gICAgICB1dWlkID0gYWRkcmVzc1xuICAgICAgICAuc3BsaXQoXCI6XCIpXG4gICAgICAgIC5qb2luKFwiXCIpXG4gICAgICAgIC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBjb25zdCBhY2xTdHJlYW06IGFueSA9IG5ldyBBY2xTdHJlYW0oXG4gICAgICAgIHRoaXMuX2hjaSxcbiAgICAgICAgaGFuZGxlLFxuICAgICAgICB0aGlzLl9oY2kuYWRkcmVzc1R5cGUsXG4gICAgICAgIHRoaXMuX2hjaS5hZGRyZXNzLFxuICAgICAgICBhZGRyZXNzVHlwZSxcbiAgICAgICAgYWRkcmVzcyxcbiAgICAgICk7XG4gICAgICBjb25zdCBnYXR0OiBhbnkgPSBuZXcgR2F0dChhZGRyZXNzLCBhY2xTdHJlYW0pO1xuICAgICAgY29uc3Qgc2lnbmFsaW5nOiBhbnkgPSBuZXcgU2lnbmFsaW5nKGhhbmRsZSwgYWNsU3RyZWFtKTtcblxuICAgICAgdGhpcy5fZ2F0dHNbdXVpZF0gPSB0aGlzLl9nYXR0c1toYW5kbGVdID0gZ2F0dDtcbiAgICAgIHRoaXMuX3NpZ25hbGluZ3NbdXVpZF0gPSB0aGlzLl9zaWduYWxpbmdzW2hhbmRsZV0gPSBzaWduYWxpbmc7XG4gICAgICB0aGlzLl9hY2xTdHJlYW1zW2hhbmRsZV0gPSBhY2xTdHJlYW07XG4gICAgICB0aGlzLl9oYW5kbGVzW3V1aWRdID0gaGFuZGxlO1xuICAgICAgdGhpcy5faGFuZGxlc1toYW5kbGVdID0gdXVpZDtcblxuICAgICAgdGhpcy5fZ2F0dHNbaGFuZGxlXS5vbihcIm10dVwiLCB0aGlzLm9uTXR1LmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5fZ2F0dHNbaGFuZGxlXS5vbihcbiAgICAgICAgXCJzZXJ2aWNlc0Rpc2NvdmVyXCIsXG4gICAgICAgIHRoaXMub25TZXJ2aWNlc0Rpc2NvdmVyZWQuYmluZCh0aGlzKSxcbiAgICAgICk7XG4gICAgICB0aGlzLl9nYXR0c1toYW5kbGVdLm9uKFxuICAgICAgICBcImluY2x1ZGVkU2VydmljZXNEaXNjb3ZlclwiLFxuICAgICAgICB0aGlzLm9uSW5jbHVkZWRTZXJ2aWNlc0Rpc2NvdmVyZWQuYmluZCh0aGlzKSxcbiAgICAgICk7XG4gICAgICB0aGlzLl9nYXR0c1toYW5kbGVdLm9uKFxuICAgICAgICBcImNoYXJhY3RlcmlzdGljc0Rpc2NvdmVyXCIsXG4gICAgICAgIHRoaXMub25DaGFyYWN0ZXJpc3RpY3NEaXNjb3ZlcmVkLmJpbmQodGhpcyksXG4gICAgICApO1xuICAgICAgdGhpcy5fZ2F0dHNbaGFuZGxlXS5vbihcInJlYWRcIiwgdGhpcy5vblJlYWQuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLl9nYXR0c1toYW5kbGVdLm9uKFwid3JpdGVcIiwgdGhpcy5vbldyaXRlLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5fZ2F0dHNbaGFuZGxlXS5vbihcImJyb2FkY2FzdFwiLCB0aGlzLm9uQnJvYWRjYXN0LmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5fZ2F0dHNbaGFuZGxlXS5vbihcIm5vdGlmeVwiLCB0aGlzLm9uTm90aWZ5LmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5fZ2F0dHNbaGFuZGxlXS5vbihcIm5vdGlmaWNhdGlvblwiLCB0aGlzLm9uTm90aWZpY2F0aW9uLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5fZ2F0dHNbaGFuZGxlXS5vbihcbiAgICAgICAgXCJkZXNjcmlwdG9yc0Rpc2NvdmVyXCIsXG4gICAgICAgIHRoaXMub25EZXNjcmlwdG9yc0Rpc2NvdmVyZWQuYmluZCh0aGlzKSxcbiAgICAgICk7XG4gICAgICB0aGlzLl9nYXR0c1toYW5kbGVdLm9uKFwidmFsdWVSZWFkXCIsIHRoaXMub25WYWx1ZVJlYWQuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLl9nYXR0c1toYW5kbGVdLm9uKFwidmFsdWVXcml0ZVwiLCB0aGlzLm9uVmFsdWVXcml0ZS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuX2dhdHRzW2hhbmRsZV0ub24oXCJoYW5kbGVSZWFkXCIsIHRoaXMub25IYW5kbGVSZWFkLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5fZ2F0dHNbaGFuZGxlXS5vbihcImhhbmRsZVdyaXRlXCIsIHRoaXMub25IYW5kbGVXcml0ZS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuX2dhdHRzW2hhbmRsZV0ub24oXCJoYW5kbGVOb3RpZnlcIiwgdGhpcy5vbkhhbmRsZU5vdGlmeS5iaW5kKHRoaXMpKTtcblxuICAgICAgdGhpcy5fc2lnbmFsaW5nc1toYW5kbGVdLm9uKFxuICAgICAgICBcImNvbm5lY3Rpb25QYXJhbWV0ZXJVcGRhdGVSZXF1ZXN0XCIsXG4gICAgICAgIHRoaXMub25Db25uZWN0aW9uUGFyYW1ldGVyVXBkYXRlUmVxdWVzdC5iaW5kKHRoaXMpLFxuICAgICAgKTtcblxuICAgICAgdGhpcy5fZ2F0dHNbaGFuZGxlXS5leGNoYW5nZU10dSgyNTYpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1dWlkID0gdGhpcy5fcGVuZGluZ0Nvbm5lY3Rpb25VdWlkO1xuICAgICAgbGV0IHN0YXR1c01lc3NhZ2U6IGFueSA9IEhjaS5TVEFUVVNfTUFQUEVSW3N0YXR1c10gfHwgXCJIQ0kgRXJyb3I6IFVua25vd25cIjtcbiAgICAgIGNvbnN0IGVycm9yQ29kZTogYW55ID0gXCIgKDB4XCIgKyBzdGF0dXMudG9TdHJpbmcoMTYpICsgXCIpXCI7XG4gICAgICBzdGF0dXNNZXNzYWdlID0gc3RhdHVzTWVzc2FnZSArIGVycm9yQ29kZTtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKHN0YXR1c01lc3NhZ2UpO1xuICAgIH1cblxuICAgIHRoaXMuZW1pdChcImNvbm5lY3RcIiwgdXVpZCwgZXJyb3IpO1xuXG4gICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25RdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBwZXJpcGhlcmFsVXVpZDogYW55ID0gdGhpcy5fY29ubmVjdGlvblF1ZXVlLnNoaWZ0KCk7XG5cbiAgICAgIGFkZHJlc3MgPSB0aGlzLl9hZGRyZXNzZXNbcGVyaXBoZXJhbFV1aWRdO1xuICAgICAgYWRkcmVzc1R5cGUgPSB0aGlzLl9hZGRyZXNzZVR5cGVzW3BlcmlwaGVyYWxVdWlkXTtcblxuICAgICAgdGhpcy5fcGVuZGluZ0Nvbm5lY3Rpb25VdWlkID0gcGVyaXBoZXJhbFV1aWQ7XG5cbiAgICAgIHRoaXMuX2hjaS5jcmVhdGVMZUNvbm4oYWRkcmVzcywgYWRkcmVzc1R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9wZW5kaW5nQ29ubmVjdGlvblV1aWQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkxlQ29ublVwZGF0ZUNvbXBsZXRlKGhhbmRsZTogYW55LCBpbnRlcnZhbD86IGFueSwgbGF0ZW5jeT86IGFueSwgc3VwZXJ2aXNpb25UaW1lb3V0PzogYW55KSB7XG4gICAgLy8gbm8tb3BcbiAgfVxuXG4gIHB1YmxpYyBvbkRpc2Nvbm5Db21wbGV0ZShoYW5kbGU6IGFueSwgcmVhc29uPzogYW55KSB7XG4gICAgY29uc3QgdXVpZDogYW55ID0gdGhpcy5faGFuZGxlc1toYW5kbGVdO1xuXG4gICAgaWYgKHV1aWQpIHtcbiAgICAgIHRoaXMuX2FjbFN0cmVhbXNbaGFuZGxlXS5wdXNoKG51bGwsIG51bGwpO1xuICAgICAgdGhpcy5fZ2F0dHNbaGFuZGxlXS5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICAgIHRoaXMuX3NpZ25hbGluZ3NbaGFuZGxlXS5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcblxuICAgICAgZGVsZXRlIHRoaXMuX2dhdHRzW3V1aWRdO1xuICAgICAgZGVsZXRlIHRoaXMuX2dhdHRzW2hhbmRsZV07XG4gICAgICBkZWxldGUgdGhpcy5fc2lnbmFsaW5nc1t1dWlkXTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9zaWduYWxpbmdzW2hhbmRsZV07XG4gICAgICBkZWxldGUgdGhpcy5fYWNsU3RyZWFtc1toYW5kbGVdO1xuICAgICAgZGVsZXRlIHRoaXMuX2hhbmRsZXNbdXVpZF07XG4gICAgICBkZWxldGUgdGhpcy5faGFuZGxlc1toYW5kbGVdO1xuXG4gICAgICB0aGlzLmVtaXQoXCJkaXNjb25uZWN0XCIsIHV1aWQpOyAvLyBUT0RPOiBoYW5kbGUgcmVhc29uP1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBtYXliZSBkaXNjb25uZWN0IGFzIHBlcmlwaGVyYWxcbiAgICAgIC8vIGNvbnNvbGUud2FybihcbiAgICAgIC8vICAgJ25vYmxlIHdhcm5pbmc6IHVua25vd24gaGFuZGxlICcgKyBoYW5kbGUgKyAnIGRpc2Nvbm5lY3RlZCEnXG4gICAgICAvLyApO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkVuY3J5cHRDaGFuZ2UoaGFuZGxlOiBhbnksIGVuY3J5cHQ/OiBhbnkpIHtcbiAgICBjb25zdCBhY2xTdHJlYW06IGFueSA9IHRoaXMuX2FjbFN0cmVhbXNbaGFuZGxlXTtcblxuICAgIGlmIChhY2xTdHJlYW0pIHtcbiAgICAgIGFjbFN0cmVhbS5wdXNoRW5jcnlwdChlbmNyeXB0KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25NdHUoYWRkcmVzczogYW55LCBtdHU/OiBhbnkpIHtcbiAgfVxuXG4gIHB1YmxpYyBvblJzc2lSZWFkKGhhbmRsZTogYW55LCByc3NpPzogYW55KSB7XG4gICAgdGhpcy5lbWl0KFwicnNzaVVwZGF0ZVwiLCB0aGlzLl9oYW5kbGVzW2hhbmRsZV0sIHJzc2kpO1xuICB9XG5cbiAgcHVibGljIG9uQWNsRGF0YVBrdChoYW5kbGU6IGFueSwgY2lkPzogYW55LCBkYXRhPzogYW55KSB7XG4gICAgY29uc3QgYWNsU3RyZWFtOiBhbnkgPSB0aGlzLl9hY2xTdHJlYW1zW2hhbmRsZV07XG5cbiAgICBpZiAoYWNsU3RyZWFtKSB7XG4gICAgICBhY2xTdHJlYW0ucHVzaChjaWQsIGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBkaXNjb3ZlclNlcnZpY2VzKHBlcmlwaGVyYWxVdWlkOiBhbnksIHV1aWRzOiBhbnkpIHtcbiAgICBjb25zdCBoYW5kbGU6IGFueSA9IHRoaXMuX2hhbmRsZXNbcGVyaXBoZXJhbFV1aWRdO1xuICAgIGNvbnN0IGdhdHQ6IGFueSA9IHRoaXMuX2dhdHRzW2hhbmRsZV07XG5cbiAgICBpZiAoZ2F0dCkge1xuICAgICAgZ2F0dC5kaXNjb3ZlclNlcnZpY2VzKHV1aWRzIHx8IFtdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwibm9ibGUgd2FybmluZzogdW5rbm93biBwZXJpcGhlcmFsIFwiICsgcGVyaXBoZXJhbFV1aWQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvblNlcnZpY2VzRGlzY292ZXJlZChhZGRyZXNzOiBhbnksIHNlcnZpY2VVdWlkcz86IGFueSkge1xuICAgIGNvbnN0IHV1aWQ6IGFueSA9IGFkZHJlc3NcbiAgICAgIC5zcGxpdChcIjpcIilcbiAgICAgIC5qb2luKFwiXCIpXG4gICAgICAudG9Mb3dlckNhc2UoKTtcblxuICAgIHRoaXMuZW1pdChcInNlcnZpY2VzRGlzY292ZXJcIiwgdXVpZCwgc2VydmljZVV1aWRzKTtcbiAgfVxuXG4gIHB1YmxpYyBkaXNjb3ZlckluY2x1ZGVkU2VydmljZXMocGVyaXBoZXJhbFV1aWQ6IGFueSwgc2VydmljZVV1aWQ6IGFueSwgc2VydmljZVV1aWRzOiBhbnkpIHtcbiAgICBjb25zdCBoYW5kbGU6IGFueSA9IHRoaXMuX2hhbmRsZXNbcGVyaXBoZXJhbFV1aWRdO1xuICAgIGNvbnN0IGdhdHQ6IGFueSA9IHRoaXMuX2dhdHRzW2hhbmRsZV07XG5cbiAgICBpZiAoZ2F0dCkge1xuICAgICAgZ2F0dC5kaXNjb3ZlckluY2x1ZGVkU2VydmljZXMoc2VydmljZVV1aWQsIHNlcnZpY2VVdWlkcyB8fCBbXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcIm5vYmxlIHdhcm5pbmc6IHVua25vd24gcGVyaXBoZXJhbCBcIiArIHBlcmlwaGVyYWxVdWlkKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25JbmNsdWRlZFNlcnZpY2VzRGlzY292ZXJlZChhZGRyZXNzOiBhbnksIHNlcnZpY2VVdWlkPzogYW55LCBpbmNsdWRlZFNlcnZpY2VVdWlkcz86IGFueSkge1xuICAgIGNvbnN0IHV1aWQ6IGFueSA9IGFkZHJlc3NcbiAgICAgIC5zcGxpdChcIjpcIilcbiAgICAgIC5qb2luKFwiXCIpXG4gICAgICAudG9Mb3dlckNhc2UoKTtcblxuICAgIHRoaXMuZW1pdChcbiAgICAgIFwiaW5jbHVkZWRTZXJ2aWNlc0Rpc2NvdmVyXCIsXG4gICAgICB1dWlkLFxuICAgICAgc2VydmljZVV1aWQsXG4gICAgICBpbmNsdWRlZFNlcnZpY2VVdWlkcyxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGRpc2NvdmVyQ2hhcmFjdGVyaXN0aWNzKHBlcmlwaGVyYWxVdWlkOiBhbnksIHNlcnZpY2VVdWlkOiBhbnksIGNoYXJhY3RlcmlzdGljVXVpZHM6IGFueSkge1xuICAgIGNvbnN0IGhhbmRsZTogYW55ID0gdGhpcy5faGFuZGxlc1twZXJpcGhlcmFsVXVpZF07XG4gICAgY29uc3QgZ2F0dDogYW55ID0gdGhpcy5fZ2F0dHNbaGFuZGxlXTtcblxuICAgIGlmIChnYXR0KSB7XG4gICAgICBnYXR0LmRpc2NvdmVyQ2hhcmFjdGVyaXN0aWNzKHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY1V1aWRzIHx8IFtdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwibm9ibGUgd2FybmluZzogdW5rbm93biBwZXJpcGhlcmFsIFwiICsgcGVyaXBoZXJhbFV1aWQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkNoYXJhY3RlcmlzdGljc0Rpc2NvdmVyZWQoYWRkcmVzczogYW55LCBzZXJ2aWNlVXVpZD86IGFueSwgY2hhcmFjdGVyaXN0aWNzPzogYW55KSB7XG4gICAgY29uc3QgdXVpZDogYW55ID0gYWRkcmVzc1xuICAgICAgLnNwbGl0KFwiOlwiKVxuICAgICAgLmpvaW4oXCJcIilcbiAgICAgIC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgdGhpcy5lbWl0KFwiY2hhcmFjdGVyaXN0aWNzRGlzY292ZXJcIiwgdXVpZCwgc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljcyk7XG4gIH1cblxuICBwdWJsaWMgcmVhZChwZXJpcGhlcmFsVXVpZDogYW55LCBzZXJ2aWNlVXVpZDogYW55LCBjaGFyYWN0ZXJpc3RpY1V1aWQ6IGFueSkge1xuICAgIGNvbnN0IGhhbmRsZTogYW55ID0gdGhpcy5faGFuZGxlc1twZXJpcGhlcmFsVXVpZF07XG4gICAgY29uc3QgZ2F0dDogYW55ID0gdGhpcy5fZ2F0dHNbaGFuZGxlXTtcblxuICAgIGlmIChnYXR0KSB7XG4gICAgICBnYXR0LnJlYWQoc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcIm5vYmxlIHdhcm5pbmc6IHVua25vd24gcGVyaXBoZXJhbCBcIiArIHBlcmlwaGVyYWxVdWlkKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25SZWFkKGFkZHJlc3M6IGFueSwgc2VydmljZVV1aWQ/OiBhbnksIGNoYXJhY3RlcmlzdGljVXVpZD86IGFueSwgZGF0YT86IGFueSwgaXNTdWNjZXNzPzogYW55KSB7XG4gICAgY29uc3QgdXVpZDogYW55ID0gYWRkcmVzc1xuICAgICAgLnNwbGl0KFwiOlwiKVxuICAgICAgLmpvaW4oXCJcIilcbiAgICAgIC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgdGhpcy5lbWl0KFxuICAgICAgXCJyZWFkXCIsXG4gICAgICB1dWlkLFxuICAgICAgc2VydmljZVV1aWQsXG4gICAgICBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgICBkYXRhLFxuICAgICAgZmFsc2UsXG4gICAgICBpc1N1Y2Nlc3MsXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyB3cml0ZShcbiAgICBwZXJpcGhlcmFsVXVpZDogYW55LFxuICAgIHNlcnZpY2VVdWlkOiBhbnksXG4gICAgY2hhcmFjdGVyaXN0aWNVdWlkOiBhbnksXG4gICAgZGF0YTogYW55LFxuICAgIHdpdGhvdXRSZXNwb25zZTogYW55LFxuICApIHtcbiAgICBjb25zdCBoYW5kbGU6IGFueSA9IHRoaXMuX2hhbmRsZXNbcGVyaXBoZXJhbFV1aWRdO1xuICAgIGNvbnN0IGdhdHQ6IGFueSA9IHRoaXMuX2dhdHRzW2hhbmRsZV07XG5cbiAgICBpZiAoZ2F0dCkge1xuICAgICAgZ2F0dC53cml0ZShzZXJ2aWNlVXVpZCwgY2hhcmFjdGVyaXN0aWNVdWlkLCBkYXRhLCB3aXRob3V0UmVzcG9uc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJub2JsZSB3YXJuaW5nOiB1bmtub3duIHBlcmlwaGVyYWwgXCIgKyBwZXJpcGhlcmFsVXVpZCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uV3JpdGUoYWRkcmVzczogYW55LCBzZXJ2aWNlVXVpZD86IGFueSwgY2hhcmFjdGVyaXN0aWNVdWlkPzogYW55LCBpc1N1Y2Nlc3M/OiBhbnkpIHtcbiAgICBjb25zdCB1dWlkOiBhbnkgPSBhZGRyZXNzXG4gICAgICAuc3BsaXQoXCI6XCIpXG4gICAgICAuam9pbihcIlwiKVxuICAgICAgLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB0aGlzLmVtaXQoXCJ3cml0ZVwiLCB1dWlkLCBzZXJ2aWNlVXVpZCwgY2hhcmFjdGVyaXN0aWNVdWlkLCBpc1N1Y2Nlc3MpO1xuICB9XG5cbiAgcHVibGljIGJyb2FkY2FzdChwZXJpcGhlcmFsVXVpZDogYW55LCBzZXJ2aWNlVXVpZDogYW55LCBjaGFyYWN0ZXJpc3RpY1V1aWQ6IGFueSwgYnJvYWRjYXN0OiBhbnkpIHtcbiAgICBjb25zdCBoYW5kbGU6IGFueSA9IHRoaXMuX2hhbmRsZXNbcGVyaXBoZXJhbFV1aWRdO1xuICAgIGNvbnN0IGdhdHQ6IGFueSA9IHRoaXMuX2dhdHRzW2hhbmRsZV07XG5cbiAgICBpZiAoZ2F0dCkge1xuICAgICAgZ2F0dC5icm9hZGNhc3Qoc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCwgYnJvYWRjYXN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwibm9ibGUgd2FybmluZzogdW5rbm93biBwZXJpcGhlcmFsIFwiICsgcGVyaXBoZXJhbFV1aWQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkJyb2FkY2FzdChhZGRyZXNzOiBhbnksIHNlcnZpY2VVdWlkPzogYW55LCBjaGFyYWN0ZXJpc3RpY1V1aWQ/OiBhbnksIHN0YXRlPzogYW55KSB7XG4gICAgY29uc3QgdXVpZDogYW55ID0gYWRkcmVzc1xuICAgICAgLnNwbGl0KFwiOlwiKVxuICAgICAgLmpvaW4oXCJcIilcbiAgICAgIC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgdGhpcy5lbWl0KFwiYnJvYWRjYXN0XCIsIHV1aWQsIHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY1V1aWQsIHN0YXRlKTtcbiAgfVxuXG4gIHB1YmxpYyBub3RpZnkocGVyaXBoZXJhbFV1aWQ6IGFueSwgc2VydmljZVV1aWQ6IGFueSwgY2hhcmFjdGVyaXN0aWNVdWlkOiBhbnksIG5vdGlmeTogYW55KSB7XG4gICAgY29uc3QgaGFuZGxlOiBhbnkgPSB0aGlzLl9oYW5kbGVzW3BlcmlwaGVyYWxVdWlkXTtcbiAgICBjb25zdCBnYXR0OiBhbnkgPSB0aGlzLl9nYXR0c1toYW5kbGVdO1xuXG4gICAgaWYgKGdhdHQpIHtcbiAgICAgIGdhdHQubm90aWZ5KHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY1V1aWQsIG5vdGlmeSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcIm5vYmxlIHdhcm5pbmc6IHVua25vd24gcGVyaXBoZXJhbCBcIiArIHBlcmlwaGVyYWxVdWlkKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25Ob3RpZnkoYWRkcmVzczogYW55LCBzZXJ2aWNlVXVpZD86IGFueSwgY2hhcmFjdGVyaXN0aWNVdWlkPzogYW55LCBzdGF0ZT86IGFueSkge1xuICAgIGNvbnN0IHV1aWQ6IGFueSA9IGFkZHJlc3NcbiAgICAgIC5zcGxpdChcIjpcIilcbiAgICAgIC5qb2luKFwiXCIpXG4gICAgICAudG9Mb3dlckNhc2UoKTtcblxuICAgIHRoaXMuZW1pdChcIm5vdGlmeVwiLCB1dWlkLCBzZXJ2aWNlVXVpZCwgY2hhcmFjdGVyaXN0aWNVdWlkLCBzdGF0ZSk7XG4gIH1cblxuICBwdWJsaWMgb25Ob3RpZmljYXRpb24oYWRkcmVzczogYW55LCBzZXJ2aWNlVXVpZD86IGFueSwgY2hhcmFjdGVyaXN0aWNVdWlkPzogYW55LCBkYXRhPzogYW55KSB7XG4gICAgY29uc3QgdXVpZDogYW55ID0gYWRkcmVzc1xuICAgICAgLnNwbGl0KFwiOlwiKVxuICAgICAgLmpvaW4oXCJcIilcbiAgICAgIC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgdGhpcy5lbWl0KFwicmVhZFwiLCB1dWlkLCBzZXJ2aWNlVXVpZCwgY2hhcmFjdGVyaXN0aWNVdWlkLCBkYXRhLCB0cnVlLCB0cnVlKTtcbiAgfVxuXG4gIHB1YmxpYyBkaXNjb3ZlckRlc2NyaXB0b3JzKHBlcmlwaGVyYWxVdWlkOiBhbnksIHNlcnZpY2VVdWlkOiBhbnksIGNoYXJhY3RlcmlzdGljVXVpZDogYW55KSB7XG4gICAgY29uc3QgaGFuZGxlOiBhbnkgPSB0aGlzLl9oYW5kbGVzW3BlcmlwaGVyYWxVdWlkXTtcbiAgICBjb25zdCBnYXR0OiBhbnkgPSB0aGlzLl9nYXR0c1toYW5kbGVdO1xuXG4gICAgaWYgKGdhdHQpIHtcbiAgICAgIGdhdHQuZGlzY292ZXJEZXNjcmlwdG9ycyhzZXJ2aWNlVXVpZCwgY2hhcmFjdGVyaXN0aWNVdWlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwibm9ibGUgd2FybmluZzogdW5rbm93biBwZXJpcGhlcmFsIFwiICsgcGVyaXBoZXJhbFV1aWQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkRlc2NyaXB0b3JzRGlzY292ZXJlZChcbiAgICBhZGRyZXNzOiBhbnksXG4gICAgc2VydmljZVV1aWQ/OiBhbnksXG4gICAgY2hhcmFjdGVyaXN0aWNVdWlkPzogYW55LFxuICAgIGRlc2NyaXB0b3JVdWlkcz86IGFueSxcbiAgKSB7XG4gICAgY29uc3QgdXVpZDogYW55ID0gYWRkcmVzc1xuICAgICAgLnNwbGl0KFwiOlwiKVxuICAgICAgLmpvaW4oXCJcIilcbiAgICAgIC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgdGhpcy5lbWl0KFxuICAgICAgXCJkZXNjcmlwdG9yc0Rpc2NvdmVyXCIsXG4gICAgICB1dWlkLFxuICAgICAgc2VydmljZVV1aWQsXG4gICAgICBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgICBkZXNjcmlwdG9yVXVpZHMsXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkVmFsdWUocGVyaXBoZXJhbFV1aWQ6IGFueSwgc2VydmljZVV1aWQ6IGFueSwgY2hhcmFjdGVyaXN0aWNVdWlkOiBhbnksIGRlc2NyaXB0b3JVdWlkOiBhbnkpIHtcbiAgICBjb25zdCBoYW5kbGU6IGFueSA9IHRoaXMuX2hhbmRsZXNbcGVyaXBoZXJhbFV1aWRdO1xuICAgIGNvbnN0IGdhdHQ6IGFueSA9IHRoaXMuX2dhdHRzW2hhbmRsZV07XG5cbiAgICBpZiAoZ2F0dCkge1xuICAgICAgZ2F0dC5yZWFkVmFsdWUoc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCwgZGVzY3JpcHRvclV1aWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJub2JsZSB3YXJuaW5nOiB1bmtub3duIHBlcmlwaGVyYWwgXCIgKyBwZXJpcGhlcmFsVXVpZCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uVmFsdWVSZWFkKFxuICAgIGFkZHJlc3M6IGFueSxcbiAgICBzZXJ2aWNlVXVpZD86IGFueSxcbiAgICBjaGFyYWN0ZXJpc3RpY1V1aWQ/OiBhbnksXG4gICAgZGVzY3JpcHRvclV1aWQ/OiBhbnksXG4gICAgZGF0YT86IGFueSxcbiAgICBpc1N1Y2Nlc3M/OiBhbnksXG4gICkge1xuICAgIGNvbnN0IHV1aWQ6IGFueSA9IGFkZHJlc3NcbiAgICAgIC5zcGxpdChcIjpcIilcbiAgICAgIC5qb2luKFwiXCIpXG4gICAgICAudG9Mb3dlckNhc2UoKTtcblxuICAgIHRoaXMuZW1pdChcbiAgICAgIFwidmFsdWVSZWFkXCIsXG4gICAgICB1dWlkLFxuICAgICAgc2VydmljZVV1aWQsXG4gICAgICBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgICBkZXNjcmlwdG9yVXVpZCxcbiAgICAgIGRhdGEsXG4gICAgICBpc1N1Y2Nlc3MsXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyB3cml0ZVZhbHVlKFxuICAgIHBlcmlwaGVyYWxVdWlkOiBhbnksXG4gICAgc2VydmljZVV1aWQ6IGFueSxcbiAgICBjaGFyYWN0ZXJpc3RpY1V1aWQ6IGFueSxcbiAgICBkZXNjcmlwdG9yVXVpZDogYW55LFxuICAgIGRhdGE6IGFueSxcbiAgKSB7XG4gICAgY29uc3QgaGFuZGxlOiBhbnkgPSB0aGlzLl9oYW5kbGVzW3BlcmlwaGVyYWxVdWlkXTtcbiAgICBjb25zdCBnYXR0OiBhbnkgPSB0aGlzLl9nYXR0c1toYW5kbGVdO1xuXG4gICAgaWYgKGdhdHQpIHtcbiAgICAgIGdhdHQud3JpdGVWYWx1ZShzZXJ2aWNlVXVpZCwgY2hhcmFjdGVyaXN0aWNVdWlkLCBkZXNjcmlwdG9yVXVpZCwgZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcIm5vYmxlIHdhcm5pbmc6IHVua25vd24gcGVyaXBoZXJhbCBcIiArIHBlcmlwaGVyYWxVdWlkKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25WYWx1ZVdyaXRlKFxuICAgIGFkZHJlc3M6IGFueSxcbiAgICBzZXJ2aWNlVXVpZD86IGFueSxcbiAgICBjaGFyYWN0ZXJpc3RpY1V1aWQ/OiBhbnksXG4gICAgZGVzY3JpcHRvclV1aWQ/OiBhbnksXG4gICAgaXNTdWNjZXNzPzogYW55LFxuICApIHtcbiAgICBjb25zdCB1dWlkOiBhbnkgPSBhZGRyZXNzXG4gICAgICAuc3BsaXQoXCI6XCIpXG4gICAgICAuam9pbihcIlwiKVxuICAgICAgLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB0aGlzLmVtaXQoXG4gICAgICBcInZhbHVlV3JpdGVcIixcbiAgICAgIHV1aWQsXG4gICAgICBzZXJ2aWNlVXVpZCxcbiAgICAgIGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICAgIGRlc2NyaXB0b3JVdWlkLFxuICAgICAgaXNTdWNjZXNzLFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgcmVhZEhhbmRsZShwZXJpcGhlcmFsVXVpZDogYW55LCBhdHRIYW5kbGU6IGFueSkge1xuICAgIGNvbnN0IGhhbmRsZTogYW55ID0gdGhpcy5faGFuZGxlc1twZXJpcGhlcmFsVXVpZF07XG4gICAgY29uc3QgZ2F0dDogYW55ID0gdGhpcy5fZ2F0dHNbaGFuZGxlXTtcblxuICAgIGlmIChnYXR0KSB7XG4gICAgICBnYXR0LnJlYWRIYW5kbGUoYXR0SGFuZGxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwibm9ibGUgd2FybmluZzogdW5rbm93biBwZXJpcGhlcmFsIFwiICsgcGVyaXBoZXJhbFV1aWQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkhhbmRsZVJlYWQoYWRkcmVzczogYW55LCBoYW5kbGU/OiBhbnksIGRhdGE/OiBhbnkpIHtcbiAgICBjb25zdCB1dWlkOiBhbnkgPSBhZGRyZXNzXG4gICAgICAuc3BsaXQoXCI6XCIpXG4gICAgICAuam9pbihcIlwiKVxuICAgICAgLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB0aGlzLmVtaXQoXCJoYW5kbGVSZWFkXCIsIHV1aWQsIGhhbmRsZSwgZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgd3JpdGVIYW5kbGUocGVyaXBoZXJhbFV1aWQ6IGFueSwgYXR0SGFuZGxlOiBhbnksIGRhdGE6IGFueSwgd2l0aG91dFJlc3BvbnNlOiBhbnkpIHtcbiAgICBjb25zdCBoYW5kbGU6IGFueSA9IHRoaXMuX2hhbmRsZXNbcGVyaXBoZXJhbFV1aWRdO1xuICAgIGNvbnN0IGdhdHQ6IGFueSA9IHRoaXMuX2dhdHRzW2hhbmRsZV07XG5cbiAgICBpZiAoZ2F0dCkge1xuICAgICAgZ2F0dC53cml0ZUhhbmRsZShhdHRIYW5kbGUsIGRhdGEsIHdpdGhvdXRSZXNwb25zZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcIm5vYmxlIHdhcm5pbmc6IHVua25vd24gcGVyaXBoZXJhbCBcIiArIHBlcmlwaGVyYWxVdWlkKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25IYW5kbGVXcml0ZShhZGRyZXNzOiBhbnksIGhhbmRsZT86IGFueSkge1xuICAgIGNvbnN0IHV1aWQ6IGFueSA9IGFkZHJlc3NcbiAgICAgIC5zcGxpdChcIjpcIilcbiAgICAgIC5qb2luKFwiXCIpXG4gICAgICAudG9Mb3dlckNhc2UoKTtcblxuICAgIHRoaXMuZW1pdChcImhhbmRsZVdyaXRlXCIsIHV1aWQsIGhhbmRsZSk7XG4gIH1cblxuICBwdWJsaWMgb25IYW5kbGVOb3RpZnkoYWRkcmVzczogYW55LCBoYW5kbGU/OiBhbnksIGRhdGE/OiBhbnkpIHtcbiAgICBjb25zdCB1dWlkOiBhbnkgPSBhZGRyZXNzXG4gICAgICAuc3BsaXQoXCI6XCIpXG4gICAgICAuam9pbihcIlwiKVxuICAgICAgLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB0aGlzLmVtaXQoXCJoYW5kbGVOb3RpZnlcIiwgdXVpZCwgaGFuZGxlLCBkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkNvbm5lY3Rpb25QYXJhbWV0ZXJVcGRhdGVSZXF1ZXN0KFxuICAgIGhhbmRsZTogYW55LFxuICAgIG1pbkludGVydmFsPzogYW55LFxuICAgIG1heEludGVydmFsPzogYW55LFxuICAgIGxhdGVuY3k/OiBhbnksXG4gICAgc3VwZXJ2aXNpb25UaW1lb3V0PzogYW55LFxuICApIHtcbiAgICB0aGlzLl9oY2kuY29ublVwZGF0ZUxlKFxuICAgICAgaGFuZGxlLFxuICAgICAgbWluSW50ZXJ2YWwsXG4gICAgICBtYXhJbnRlcnZhbCxcbiAgICAgIGxhdGVuY3ksXG4gICAgICBzdXBlcnZpc2lvblRpbWVvdXQsXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBOb2JsZUJpbmRpbmdzO1xuIl19
