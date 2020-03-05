"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleHelper_1 = __importDefault(require("./bleHelper"));
const hci_1 = __importDefault(require("./hci"));
const bindings_1 = __importDefault(require("./protocol/central/bindings"));
const hci_2 = __importDefault(require("./protocol/hci"));
const bindings_2 = __importDefault(require("./protocol/peripheral/bindings"));
const semver_1 = __importDefault(require("semver"));
const bleAdvertisement_1 = __importDefault(require("./bleAdvertisement"));
const bleCharacteristic_1 = __importDefault(require("./bleCharacteristic"));
const bleDescriptor_1 = __importDefault(require("./bleDescriptor"));
const blePeripheral_1 = __importDefault(require("./blePeripheral"));
const bleRemotePeripheral_1 = __importDefault(require("./bleRemotePeripheral"));
const bleScan_1 = __importDefault(require("./bleScan"));
const bleSecurity_1 = __importDefault(require("./bleSecurity"));
const bleService_1 = __importDefault(require("./bleService"));
/**
 * Use a obniz device as a BLE device.
 * Peripheral and Central mode are supported
 */
class ObnizBLE {
    constructor(obniz) {
        this.Obniz = obniz;
        this.hci = new hci_1.default(obniz);
        this.hciProtocol = new hci_2.default(this.hci);
        this.centralBindings = new bindings_1.default(this.hciProtocol);
        this.peripheralBindings = new bindings_2.default(this.hciProtocol);
        // let dummy = {write : ()=>{}, on:()=>{}}
        // this.centralBindings = new CentralBindings( dummy );
        // this.peripheralBindings = new PeripheralBindings( dummy );
        this.centralBindings.init();
        this.peripheralBindings.init();
        this._initialized = false;
        this._initializeWarning = true;
        this.remotePeripherals = [];
        this.service = bleService_1.default;
        this.characteristic = bleCharacteristic_1.default;
        this.descriptor = bleDescriptor_1.default;
        this.peripheral = new blePeripheral_1.default(this);
        this.advertisement = new bleAdvertisement_1.default(this);
        this.scan = new bleScan_1.default(this);
        this.security = new bleSecurity_1.default(this);
        this._bind();
        this._reset();
    }
    /**
     * @ignore
     *
     * @param data
     * @param reverse
     * @private
     */
    static _dataArray2uuidHex(data, reverse) {
        let uuid = [];
        for (let i = 0; i < data.length; i++) {
            uuid.push(("00" + data[i].toString(16).toLowerCase()).slice(-2));
        }
        if (reverse) {
            uuid = uuid.reverse();
        }
        let str = uuid.join("");
        if (uuid.length >= 16) {
            str =
                str.slice(0, 8) +
                    "-" +
                    str.slice(8, 12) +
                    "-" +
                    str.slice(12, 16) +
                    "-" +
                    str.slice(16, 20) +
                    "-" +
                    str.slice(20);
        }
        return str;
    }
    /**
     * Initialize BLE module. You need call this first everything before.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * ```
     */
    async initWait() {
        if (!this._initialized) {
            this._initialized = true;
            // force initialize on obnizOS < 3.2.0
            if (semver_1.default.lt(this.Obniz.firmware_ver, "3.2.0")) {
                this.hci.init();
                this.hci.end(); // disable once
                this.hci.init();
            }
            await this.hciProtocol.initWait();
        }
    }
    /**
     * @ignore
     * @param obj
     */
    notified(obj) {
        if (obj.hci) {
            this.hci.notified(obj.hci);
        }
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
    }
    /**
     * Connect to peripheral without scanning.
     * Returns a peripheral instance, but the advertisement information such as localName is null because it has not been scanned.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var peripheral = obniz.ble.directConnect("e4b9efb29218","random");
     * peripheral.onconnect = ()=>{
     *   console.log("connected");
     * }
     * ```
     *
     * @param uuid peripheral device address
     * @param addressType "random" or "public"
     */
    directConnect(uuid, addressType) {
        let peripheral = this.findPeripheral(uuid);
        if (!peripheral) {
            peripheral = new bleRemotePeripheral_1.default(this, uuid);
            this.remotePeripherals.push(peripheral);
        }
        if (!this.centralBindings._addresses[uuid]) {
            const address = uuid.match(/.{1,2}/g).join(":");
            this.centralBindings._addresses[uuid] = address;
            this.centralBindings._addresseTypes[uuid] = addressType;
            this.centralBindings._connectable[uuid] = true;
        }
        peripheral.connect();
        return peripheral;
    }
    /**
     * Connect to peripheral without scanning, and wait to finish connecting.
     *
     * It throws when connection establish failed.
     * Returns a peripheral instance, but the advertisement information such as localName is null because it has not been scanned.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * try {
     *   var peripheral = await obniz.ble.directConnectWait("e4b9efb29218","random");
     *   console.log("connected");
     * } catch(e) {
     *   console.log("can't connect");
     * }
     * ```
     *
     * @param address peripheral device address
     * @param addressType "random" or "public"
     */
    async directConnectWait(address, addressType) {
        const peripheral = this.directConnect(address, addressType);
        await peripheral.connectWait();
        return peripheral;
    }
    /**
     * @ignore
     */
    warningIfNotInitialize() {
        if (!this._initialized && this._initializeWarning) {
            this._initializeWarning = true;
            this.Obniz.warning({
                alert: "warning",
                message: `BLE is not initialized. Please call 'await obniz.ble.initWait()'`,
            });
        }
    }
    onStateChange() {
    }
    findPeripheral(address) {
        for (const key in this.remotePeripherals) {
            if (this.remotePeripherals[key].address === address) {
                return this.remotePeripherals[key];
            }
        }
        return null;
    }
    onAddressChange() {
    }
    onScanStart() {
    }
    onScanStop() {
        this.scan.notifyFromServer("onfinish", null);
    }
    onDiscover(uuid, address, addressType, connectable, advertisement, rssi) {
        let val = this.findPeripheral(uuid);
        if (!val) {
            val = new bleRemotePeripheral_1.default(this, uuid);
            this.remotePeripherals.push(val);
        }
        val.discoverdOnRemote = true;
        const peripheralData = {
            device_type: "ble",
            address_type: addressType,
            ble_event_type: connectable
                ? "connectable_advertisemnt"
                : "non_connectable_advertising",
            rssi,
            adv_data: advertisement.advertisementRaw,
            scan_resp: advertisement.scanResponseRaw,
        };
        val.setParams(peripheralData);
        val._adv_data_filtered = advertisement;
        this.scan.notifyFromServer("onfind", val);
    }
    async onConnect(peripheralUuid, error) {
        const peripheral = this.findPeripheral(peripheralUuid);
        if (!error) {
            await peripheral.discoverAllHandlesWait();
        }
        peripheral.notifyFromServer("statusupdate", {
            status: error ? "disconnected" : "connected",
        });
    }
    onDisconnect(peripheralUuid) {
        const peripheral = this.findPeripheral(peripheralUuid);
        peripheral.notifyFromServer("statusupdate", { status: "disconnected" });
    }
    onRssiUpdate() {
    }
    onServicesDiscover(peripheralUuid, serviceUuids) {
        const peripheral = this.findPeripheral(peripheralUuid);
        for (const serviceUuid of serviceUuids) {
            peripheral.notifyFromServer("discover", { service_uuid: serviceUuid });
        }
        peripheral.notifyFromServer("discoverfinished", {});
    }
    onIncludedServicesDiscover(peripheralUuid, serviceUuid, includedServiceUuids) {
    }
    onCharacteristicsDiscover(peripheralUuid, serviceUuid, characteristics) {
        const peripheral = this.findPeripheral(peripheralUuid);
        const service = peripheral.findService({ service_uuid: serviceUuid });
        for (const char of characteristics) {
            const obj = {
                properties: char.properties.map((e) => bleHelper_1.default.toSnakeCase(e)),
                characteristic_uuid: char.uuid,
            };
            service.notifyFromServer("discover", obj);
        }
        service.notifyFromServer("discoverfinished", {});
    }
    onRead(peripheralUuid, serviceUuid, characteristicUuid, data, isNotification, isSuccess) {
        const peripheral = this.findPeripheral(peripheralUuid);
        const characteristic = peripheral.findCharacteristic({
            service_uuid: serviceUuid,
            characteristic_uuid: characteristicUuid,
        });
        if (isNotification) {
            const obj = {
                data: Array.from(data),
            };
            characteristic.notifyFromServer("onnotify", obj);
        }
        else {
            const obj = {
                result: isSuccess ? "success" : "failed",
                data: Array.from(data),
            };
            characteristic.notifyFromServer("onread", obj);
        }
    }
    onWrite(peripheralUuid, serviceUuid, characteristicUuid, isSuccess) {
        const peripheral = this.findPeripheral(peripheralUuid);
        const characteristic = peripheral.findCharacteristic({
            service_uuid: serviceUuid,
            characteristic_uuid: characteristicUuid,
        });
        characteristic.notifyFromServer("onwrite", {
            result: isSuccess ? "success" : "failed",
        });
    }
    onBroadcast(peripheralUuid, serviceUuid, characteristicUuid, state) {
    }
    onNotify(peripheralUuid, serviceUuid, characteristicUuid, state) {
        const peripheral = this.findPeripheral(peripheralUuid);
        const char = peripheral.findCharacteristic({
            service_uuid: serviceUuid,
            characteristic_uuid: characteristicUuid,
        });
        if (state) {
            char.notifyFromServer("onregisternotify", {});
        }
        else {
            char.notifyFromServer("onunregisternotify", {});
        }
    }
    onDescriptorsDiscover(peripheralUuid, serviceUuid, characteristicUuid, descriptors) {
        const peripheral = this.findPeripheral(peripheralUuid);
        const char = peripheral.findCharacteristic({
            service_uuid: serviceUuid,
            characteristic_uuid: characteristicUuid,
        });
        for (const descr of descriptors) {
            const obj = {
                descriptor_uuid: descr,
            };
            char.notifyFromServer("discover", obj);
        }
        char.notifyFromServer("discoverfinished", {});
    }
    onValueRead(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid, data, isSuccess) {
        const peripheral = this.findPeripheral(peripheralUuid);
        const descriptor = peripheral.findDescriptor({
            service_uuid: serviceUuid,
            characteristic_uuid: characteristicUuid,
            descriptor_uuid: descriptorUuid,
        });
        const obj = {
            result: isSuccess ? "success" : "failed",
            data: Array.from(data),
        };
        descriptor.notifyFromServer("onread", obj);
    }
    onValueWrite(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid, isSuccess) {
        const peripheral = this.findPeripheral(peripheralUuid);
        const descriptor = peripheral.findDescriptor({
            service_uuid: serviceUuid,
            characteristic_uuid: characteristicUuid,
            descriptor_uuid: descriptorUuid,
        });
        const obj = {
            result: isSuccess ? "success" : "failed",
        };
        descriptor.notifyFromServer("onwrite", obj);
    }
    onHandleRead(peripheralUuid, handle, data) {
    }
    onHandleWrite(peripheralUuid, handle) {
    }
    onHandleNotify(peripheralUuid, handle, data) {
    }
    onPeripheralStateChange(state) {
        // console.error("onPeripheralStateChange")
    }
    onPeripheralAddressChange(address) {
        // console.error("onPeripheralAddressChange")
    }
    onPeripheralPlatform(platform) {
        // console.error("onPeripheralPlatform")
    }
    onPeripheralAdvertisingStart(error) {
        // console.error("onPeripheralAdvertisingStart")
    }
    onPeripheralAdvertisingStop() {
        // console.error("onPeripheralAdvertisingStop")
    }
    onPeripheralServicesSet(error) {
        // console.error("onPeripheralServicesSet")
    }
    onPeripheralAccept(clientAddress) {
        this.peripheral.currentConnectedDeviceAddress = clientAddress;
        if (this.peripheral.onconnectionupdates) {
            this.peripheral.onconnectionupdates({
                address: clientAddress,
                status: "connected",
            });
        }
    }
    onPeripheralMtuChange(mtu) {
        // console.error("onPeripheralMtuChange")
    }
    onPeripheralDisconnect(clientAddress) {
        this.peripheral.currentConnectedDeviceAddress = null;
        if (this.peripheral.onconnectionupdates) {
            this.peripheral.onconnectionupdates({
                address: clientAddress,
                status: "disconnected",
            });
        }
    }
    onPeripheralRssiUpdate(rssi) {
        // console.error("onPeripheralRssiUpdate")
    }
    _bind() {
        this.centralBindings.on("stateChange", this.onStateChange.bind(this));
        this.centralBindings.on("addressChange", this.onAddressChange.bind(this));
        this.centralBindings.on("scanStart", this.onScanStart.bind(this));
        this.centralBindings.on("scanStop", this.onScanStop.bind(this));
        this.centralBindings.on("discover", this.onDiscover.bind(this));
        this.centralBindings.on("connect", this.onConnect.bind(this));
        this.centralBindings.on("disconnect", this.onDisconnect.bind(this));
        this.centralBindings.on("rssiUpdate", this.onRssiUpdate.bind(this));
        this.centralBindings.on("servicesDiscover", this.onServicesDiscover.bind(this));
        this.centralBindings.on("includedServicesDiscover", this.onIncludedServicesDiscover.bind(this));
        this.centralBindings.on("characteristicsDiscover", this.onCharacteristicsDiscover.bind(this));
        this.centralBindings.on("read", this.onRead.bind(this));
        this.centralBindings.on("write", this.onWrite.bind(this));
        this.centralBindings.on("broadcast", this.onBroadcast.bind(this));
        this.centralBindings.on("notify", this.onNotify.bind(this));
        this.centralBindings.on("descriptorsDiscover", this.onDescriptorsDiscover.bind(this));
        this.centralBindings.on("valueRead", this.onValueRead.bind(this));
        this.centralBindings.on("valueWrite", this.onValueWrite.bind(this));
        this.centralBindings.on("handleRead", this.onHandleRead.bind(this));
        this.centralBindings.on("handleWrite", this.onHandleWrite.bind(this));
        this.centralBindings.on("handleNotify", this.onHandleNotify.bind(this));
        this.peripheralBindings.on("stateChange", this.onPeripheralStateChange.bind(this));
        this.peripheralBindings.on("addressChange", this.onPeripheralAddressChange.bind(this));
        this.peripheralBindings.on("platform", this.onPeripheralPlatform.bind(this));
        this.peripheralBindings.on("advertisingStart", this.onPeripheralAdvertisingStart.bind(this));
        this.peripheralBindings.on("advertisingStop", this.onPeripheralAdvertisingStop.bind(this));
        this.peripheralBindings.on("servicesSet", this.onPeripheralServicesSet.bind(this));
        this.peripheralBindings.on("accept", this.onPeripheralAccept.bind(this));
        this.peripheralBindings.on("mtuChange", this.onPeripheralMtuChange.bind(this));
        this.peripheralBindings.on("disconnect", this.onPeripheralDisconnect.bind(this));
        this.peripheralBindings.on("rssiUpdate", this.onPeripheralRssiUpdate.bind(this));
    }
}
exports.default = ObnizBLE;

//# sourceMappingURL=ble.js.map
