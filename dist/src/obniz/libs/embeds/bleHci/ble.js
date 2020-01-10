"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleHelper_1 = __importDefault(require("./bleHelper"));
const hci_1 = __importDefault(require("./hci"));
const bindings_1 = __importDefault(require("./protocol/central/bindings"));
const hci_2 = __importDefault(require("./protocol/hci"));
const bindings_2 = __importDefault(require("./protocol/peripheral/bindings"));
const bleAdvertisement_1 = __importDefault(require("./bleAdvertisement"));
const bleCharacteristic_1 = __importDefault(require("./bleCharacteristic"));
const bleDescriptor_1 = __importDefault(require("./bleDescriptor"));
const blePeripheral_1 = __importDefault(require("./blePeripheral"));
const bleRemotePeripheral_1 = __importDefault(require("./bleRemotePeripheral"));
const bleScan_1 = __importDefault(require("./bleScan"));
const bleSecurity_1 = __importDefault(require("./bleSecurity"));
const bleService_1 = __importDefault(require("./bleService"));
class ObnizBLE {
    constructor(Obniz) {
        this.Obniz = Obniz;
        this.hci = new hci_1.default(Obniz);
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
        this.scanTarget = null;
        this.advertisement = new bleAdvertisement_1.default(this);
        this.scan = new bleScan_1.default(this);
        this.security = new bleSecurity_1.default(this);
        this._bind();
        this._reset();
    }
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
    initWait() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._initialized) {
                this._initialized = true;
                yield this.hciProtocol.initWait();
            }
        });
    }
    warningIfNotInitialize() {
        if (!this._initialized && this._initializeWarning) {
            this._initializeWarning = true;
            this.Obniz.warning({
                alert: "warning",
                message: `BLE is not initialized. Please call 'await obniz.ble.initWait()'`,
            });
        }
    }
    notified(obj) {
        if (obj.hci) {
            this.hci.notified(obj.hci);
        }
    }
    _reset() {
    }
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
    directConnectWait(uuid, addressType) {
        return __awaiter(this, void 0, void 0, function* () {
            const peripheral = this.directConnect(uuid, addressType);
            yield peripheral.connectWait();
            return peripheral;
        });
    }
    findPeripheral(address) {
        for (const key in this.remotePeripherals) {
            if (this.remotePeripherals[key].address === address) {
                return this.remotePeripherals[key];
            }
        }
        return null;
    }
    onStateChange() {
    }
    onAddressChange() {
    }
    onScanStart() {
    }
    onScanStop() {
        this.scan.notifyFromServer("onfinish");
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
    onConnect(peripheralUuid, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const peripheral = this.findPeripheral(peripheralUuid);
            if (!error) {
                yield peripheral.discoverAllHandlesWait();
            }
            peripheral.notifyFromServer("statusupdate", {
                status: error ? "disconnected" : "connected",
            });
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
        this.peripheral.onconnectionupdates({
            address: clientAddress,
            status: "connected",
        });
    }
    onPeripheralMtuChange(mtu) {
        // console.error("onPeripheralMtuChange")
    }
    onPeripheralDisconnect(clientAddress) {
        this.peripheral.currentConnectedDeviceAddress = null;
        this.peripheral.onconnectionupdates({
            address: clientAddress,
            status: "disconnected",
        });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNERBQW9DO0FBQ3BDLGdEQUFnQztBQUNoQywyRUFBMEQ7QUFDMUQseURBQXlDO0FBQ3pDLDhFQUFnRTtBQUVoRSwwRUFBa0Q7QUFDbEQsNEVBQW9EO0FBQ3BELG9FQUE0QztBQUM1QyxvRUFBNEM7QUFDNUMsZ0ZBQXdEO0FBQ3hELHdEQUFnQztBQUNoQyxnRUFBd0M7QUFDeEMsOERBQXNDO0FBRXRDLE1BQU0sUUFBUTtJQTJDWixZQUFZLEtBQVU7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLGFBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksYUFBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksa0JBQWUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRW5FLDBDQUEwQztRQUMxQyx1REFBdUQ7UUFDdkQsNkRBQTZEO1FBRTdELElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxDQUFDO1FBRS9CLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7UUFFL0IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztRQUU1QixJQUFJLENBQUMsT0FBTyxHQUFHLG9CQUFVLENBQUM7UUFDMUIsSUFBSSxDQUFDLGNBQWMsR0FBRywyQkFB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QUMsSUFBSSxDQUFDLENBQzdDLENBQUM7UUFDRixJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUN4QixpQkFBaUIsRUFDakIsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDNUMsQ0FBQztRQUNGLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQ3hCLGFBQWEsRUFDYixJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUN4QyxDQUFDO1FBQ0YsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQ3hCLFdBQVcsRUFDWCxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUN0QyxDQUFDO1FBQ0YsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FDeEIsWUFBWSxFQUNaLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ3ZDLENBQUM7UUFFRixJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUN4QixZQUFZLEVBQ1osSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDdkMsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELGtCQUFlLFFBQVEsQ0FBQyIsImZpbGUiOiJzcmMvb2JuaXovbGlicy9lbWJlZHMvYmxlSGNpL2JsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCbGVIZWxwZXIgZnJvbSBcIi4vYmxlSGVscGVyXCI7XG5pbXBvcnQgT2JuaXpCTEVIY2kgZnJvbSBcIi4vaGNpXCI7XG5pbXBvcnQgQ2VudHJhbEJpbmRpbmdzIGZyb20gXCIuL3Byb3RvY29sL2NlbnRyYWwvYmluZGluZ3NcIjtcbmltcG9ydCBIY2lQcm90b2NvbCBmcm9tIFwiLi9wcm90b2NvbC9oY2lcIjtcbmltcG9ydCBQZXJpcGhlcmFsQmluZGluZ3MgZnJvbSBcIi4vcHJvdG9jb2wvcGVyaXBoZXJhbC9iaW5kaW5nc1wiO1xuXG5pbXBvcnQgQmxlQWR2ZXJ0aXNlbWVudCBmcm9tIFwiLi9ibGVBZHZlcnRpc2VtZW50XCI7XG5pbXBvcnQgQmxlQ2hhcmFjdGVyaXN0aWMgZnJvbSBcIi4vYmxlQ2hhcmFjdGVyaXN0aWNcIjtcbmltcG9ydCBCbGVEZXNjcmlwdG9yIGZyb20gXCIuL2JsZURlc2NyaXB0b3JcIjtcbmltcG9ydCBCbGVQZXJpcGhlcmFsIGZyb20gXCIuL2JsZVBlcmlwaGVyYWxcIjtcbmltcG9ydCBCbGVSZW1vdGVQZXJpcGhlcmFsIGZyb20gXCIuL2JsZVJlbW90ZVBlcmlwaGVyYWxcIjtcbmltcG9ydCBCbGVTY2FuIGZyb20gXCIuL2JsZVNjYW5cIjtcbmltcG9ydCBCbGVTZWN1cml0eSBmcm9tIFwiLi9ibGVTZWN1cml0eVwiO1xuaW1wb3J0IEJsZVNlcnZpY2UgZnJvbSBcIi4vYmxlU2VydmljZVwiO1xuXG5jbGFzcyBPYm5pekJMRSB7XG5cbiAgcHVibGljIHN0YXRpYyBfZGF0YUFycmF5MnV1aWRIZXgoZGF0YTogYW55LCByZXZlcnNlOiBhbnkpIHtcbiAgICBsZXQgdXVpZDogYW55ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB1dWlkLnB1c2goKFwiMDBcIiArIGRhdGFbaV0udG9TdHJpbmcoMTYpLnRvTG93ZXJDYXNlKCkpLnNsaWNlKC0yKSk7XG4gICAgfVxuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICB1dWlkID0gdXVpZC5yZXZlcnNlKCk7XG4gICAgfVxuICAgIGxldCBzdHI6IGFueSA9IHV1aWQuam9pbihcIlwiKTtcbiAgICBpZiAodXVpZC5sZW5ndGggPj0gMTYpIHtcbiAgICAgIHN0ciA9XG4gICAgICAgIHN0ci5zbGljZSgwLCA4KSArXG4gICAgICAgIFwiLVwiICtcbiAgICAgICAgc3RyLnNsaWNlKDgsIDEyKSArXG4gICAgICAgIFwiLVwiICtcbiAgICAgICAgc3RyLnNsaWNlKDEyLCAxNikgK1xuICAgICAgICBcIi1cIiArXG4gICAgICAgIHN0ci5zbGljZSgxNiwgMjApICtcbiAgICAgICAgXCItXCIgK1xuICAgICAgICBzdHIuc2xpY2UoMjApO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG5cbiAgcHVibGljIE9ibml6OiBhbnk7XG4gIHB1YmxpYyBoY2k6IGFueTtcbiAgcHVibGljIGhjaVByb3RvY29sOiBhbnk7XG4gIHB1YmxpYyBjZW50cmFsQmluZGluZ3M6IGFueTtcbiAgcHVibGljIHBlcmlwaGVyYWxCaW5kaW5nczogYW55O1xuICBwdWJsaWMgX2luaXRpYWxpemVkOiBhbnk7XG4gIHB1YmxpYyBfaW5pdGlhbGl6ZVdhcm5pbmc6IGFueTtcbiAgcHVibGljIHJlbW90ZVBlcmlwaGVyYWxzOiBhbnk7XG4gIHB1YmxpYyBzZXJ2aWNlOiBhbnk7XG4gIHB1YmxpYyBjaGFyYWN0ZXJpc3RpYzogYW55O1xuICBwdWJsaWMgZGVzY3JpcHRvcjogYW55O1xuICBwdWJsaWMgcGVyaXBoZXJhbDogYW55O1xuICBwdWJsaWMgc2NhblRhcmdldDogYW55O1xuICBwdWJsaWMgYWR2ZXJ0aXNlbWVudDogYW55O1xuICBwdWJsaWMgc2NhbjogYW55O1xuICBwdWJsaWMgc2VjdXJpdHk6IGFueTtcblxuICBjb25zdHJ1Y3RvcihPYm5pejogYW55KSB7XG4gICAgdGhpcy5PYm5peiA9IE9ibml6O1xuICAgIHRoaXMuaGNpID0gbmV3IE9ibml6QkxFSGNpKE9ibml6KTtcbiAgICB0aGlzLmhjaVByb3RvY29sID0gbmV3IEhjaVByb3RvY29sKHRoaXMuaGNpKTtcblxuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzID0gbmV3IENlbnRyYWxCaW5kaW5ncyh0aGlzLmhjaVByb3RvY29sKTtcbiAgICB0aGlzLnBlcmlwaGVyYWxCaW5kaW5ncyA9IG5ldyBQZXJpcGhlcmFsQmluZGluZ3ModGhpcy5oY2lQcm90b2NvbCk7XG5cbiAgICAvLyBsZXQgZHVtbXkgPSB7d3JpdGUgOiAoKT0+e30sIG9uOigpPT57fX1cbiAgICAvLyB0aGlzLmNlbnRyYWxCaW5kaW5ncyA9IG5ldyBDZW50cmFsQmluZGluZ3MoIGR1bW15ICk7XG4gICAgLy8gdGhpcy5wZXJpcGhlcmFsQmluZGluZ3MgPSBuZXcgUGVyaXBoZXJhbEJpbmRpbmdzKCBkdW1teSApO1xuXG4gICAgdGhpcy5jZW50cmFsQmluZGluZ3MuaW5pdCgpO1xuICAgIHRoaXMucGVyaXBoZXJhbEJpbmRpbmdzLmluaXQoKTtcblxuICAgIHRoaXMuX2luaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdGhpcy5faW5pdGlhbGl6ZVdhcm5pbmcgPSB0cnVlO1xuXG4gICAgdGhpcy5yZW1vdGVQZXJpcGhlcmFscyA9IFtdO1xuXG4gICAgdGhpcy5zZXJ2aWNlID0gQmxlU2VydmljZTtcbiAgICB0aGlzLmNoYXJhY3RlcmlzdGljID0gQmxlQ2hhcmFjdGVyaXN0aWM7XG4gICAgdGhpcy5kZXNjcmlwdG9yID0gQmxlRGVzY3JpcHRvcjtcbiAgICB0aGlzLnBlcmlwaGVyYWwgPSBuZXcgQmxlUGVyaXBoZXJhbCh0aGlzKTtcblxuICAgIHRoaXMuc2NhblRhcmdldCA9IG51bGw7XG5cbiAgICB0aGlzLmFkdmVydGlzZW1lbnQgPSBuZXcgQmxlQWR2ZXJ0aXNlbWVudCh0aGlzKTtcbiAgICB0aGlzLnNjYW4gPSBuZXcgQmxlU2Nhbih0aGlzKTtcbiAgICB0aGlzLnNlY3VyaXR5ID0gbmV3IEJsZVNlY3VyaXR5KHRoaXMpO1xuXG4gICAgdGhpcy5fYmluZCgpO1xuICAgIHRoaXMuX3Jlc2V0KCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgaW5pdFdhaXQoKSB7XG4gICAgaWYgKCF0aGlzLl9pbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5faW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgYXdhaXQgdGhpcy5oY2lQcm90b2NvbC5pbml0V2FpdCgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB3YXJuaW5nSWZOb3RJbml0aWFsaXplKCkge1xuICAgIGlmICghdGhpcy5faW5pdGlhbGl6ZWQgJiYgdGhpcy5faW5pdGlhbGl6ZVdhcm5pbmcpIHtcbiAgICAgIHRoaXMuX2luaXRpYWxpemVXYXJuaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuT2JuaXoud2FybmluZyh7XG4gICAgICAgIGFsZXJ0OiBcIndhcm5pbmdcIixcbiAgICAgICAgbWVzc2FnZTogYEJMRSBpcyBub3QgaW5pdGlhbGl6ZWQuIFBsZWFzZSBjYWxsICdhd2FpdCBvYm5pei5ibGUuaW5pdFdhaXQoKSdgLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5vdGlmaWVkKG9iajogYW55KSB7XG4gICAgaWYgKG9iai5oY2kpIHtcbiAgICAgIHRoaXMuaGNpLm5vdGlmaWVkKG9iai5oY2kpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBfcmVzZXQoKSB7XG4gIH1cblxuICBwdWJsaWMgZGlyZWN0Q29ubmVjdCh1dWlkOiBhbnksIGFkZHJlc3NUeXBlOiBhbnkpIHtcbiAgICBsZXQgcGVyaXBoZXJhbDogYW55ID0gdGhpcy5maW5kUGVyaXBoZXJhbCh1dWlkKTtcbiAgICBpZiAoIXBlcmlwaGVyYWwpIHtcbiAgICAgIHBlcmlwaGVyYWwgPSBuZXcgQmxlUmVtb3RlUGVyaXBoZXJhbCh0aGlzLCB1dWlkKTtcbiAgICAgIHRoaXMucmVtb3RlUGVyaXBoZXJhbHMucHVzaChwZXJpcGhlcmFsKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmNlbnRyYWxCaW5kaW5ncy5fYWRkcmVzc2VzW3V1aWRdKSB7XG4gICAgICBjb25zdCBhZGRyZXNzOiBhbnkgPSB1dWlkLm1hdGNoKC8uezEsMn0vZykuam9pbihcIjpcIik7XG4gICAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5fYWRkcmVzc2VzW3V1aWRdID0gYWRkcmVzcztcbiAgICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLl9hZGRyZXNzZVR5cGVzW3V1aWRdID0gYWRkcmVzc1R5cGU7XG4gICAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5fY29ubmVjdGFibGVbdXVpZF0gPSB0cnVlO1xuICAgIH1cbiAgICBwZXJpcGhlcmFsLmNvbm5lY3QoKTtcbiAgICByZXR1cm4gcGVyaXBoZXJhbDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBkaXJlY3RDb25uZWN0V2FpdCh1dWlkOiBhbnksIGFkZHJlc3NUeXBlOiBhbnkpIHtcbiAgICBjb25zdCBwZXJpcGhlcmFsOiBhbnkgPSB0aGlzLmRpcmVjdENvbm5lY3QodXVpZCwgYWRkcmVzc1R5cGUpO1xuICAgIGF3YWl0IHBlcmlwaGVyYWwuY29ubmVjdFdhaXQoKTtcbiAgICByZXR1cm4gcGVyaXBoZXJhbDtcbiAgfVxuXG4gIHB1YmxpYyBmaW5kUGVyaXBoZXJhbChhZGRyZXNzOiBhbnkpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnJlbW90ZVBlcmlwaGVyYWxzKSB7XG4gICAgICBpZiAodGhpcy5yZW1vdGVQZXJpcGhlcmFsc1trZXldLmFkZHJlc3MgPT09IGFkZHJlc3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVtb3RlUGVyaXBoZXJhbHNba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwdWJsaWMgb25TdGF0ZUNoYW5nZSgpIHtcbiAgfVxuXG4gIHB1YmxpYyBvbkFkZHJlc3NDaGFuZ2UoKSB7XG4gIH1cblxuICBwdWJsaWMgb25TY2FuU3RhcnQoKSB7XG4gIH1cblxuICBwdWJsaWMgb25TY2FuU3RvcCgpIHtcbiAgICB0aGlzLnNjYW4ubm90aWZ5RnJvbVNlcnZlcihcIm9uZmluaXNoXCIpO1xuICB9XG5cbiAgcHVibGljIG9uRGlzY292ZXIodXVpZDogYW55LCBhZGRyZXNzPzogYW55LCBhZGRyZXNzVHlwZT86IGFueSwgY29ubmVjdGFibGU/OiBhbnksIGFkdmVydGlzZW1lbnQ/OiBhbnksIHJzc2k/OiBhbnkpIHtcbiAgICBsZXQgdmFsOiBhbnkgPSB0aGlzLmZpbmRQZXJpcGhlcmFsKHV1aWQpO1xuICAgIGlmICghdmFsKSB7XG4gICAgICB2YWwgPSBuZXcgQmxlUmVtb3RlUGVyaXBoZXJhbCh0aGlzLCB1dWlkKTtcbiAgICAgIHRoaXMucmVtb3RlUGVyaXBoZXJhbHMucHVzaCh2YWwpO1xuICAgIH1cbiAgICB2YWwuZGlzY292ZXJkT25SZW1vdGUgPSB0cnVlO1xuXG4gICAgY29uc3QgcGVyaXBoZXJhbERhdGE6IGFueSA9IHtcbiAgICAgIGRldmljZV90eXBlOiBcImJsZVwiLFxuICAgICAgYWRkcmVzc190eXBlOiBhZGRyZXNzVHlwZSxcbiAgICAgIGJsZV9ldmVudF90eXBlOiBjb25uZWN0YWJsZVxuICAgICAgICA/IFwiY29ubmVjdGFibGVfYWR2ZXJ0aXNlbW50XCJcbiAgICAgICAgOiBcIm5vbl9jb25uZWN0YWJsZV9hZHZlcnRpc2luZ1wiLFxuICAgICAgcnNzaSxcbiAgICAgIGFkdl9kYXRhOiBhZHZlcnRpc2VtZW50LmFkdmVydGlzZW1lbnRSYXcsXG4gICAgICBzY2FuX3Jlc3A6IGFkdmVydGlzZW1lbnQuc2NhblJlc3BvbnNlUmF3LFxuICAgIH07XG5cbiAgICB2YWwuc2V0UGFyYW1zKHBlcmlwaGVyYWxEYXRhKTtcbiAgICB2YWwuX2Fkdl9kYXRhX2ZpbHRlcmVkID0gYWR2ZXJ0aXNlbWVudDtcblxuICAgIHRoaXMuc2Nhbi5ub3RpZnlGcm9tU2VydmVyKFwib25maW5kXCIsIHZhbCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgb25Db25uZWN0KHBlcmlwaGVyYWxVdWlkOiBhbnksIGVycm9yPzogYW55KSB7XG4gICAgY29uc3QgcGVyaXBoZXJhbDogYW55ID0gdGhpcy5maW5kUGVyaXBoZXJhbChwZXJpcGhlcmFsVXVpZCk7XG4gICAgaWYgKCFlcnJvcikge1xuICAgICAgYXdhaXQgcGVyaXBoZXJhbC5kaXNjb3ZlckFsbEhhbmRsZXNXYWl0KCk7XG4gICAgfVxuICAgIHBlcmlwaGVyYWwubm90aWZ5RnJvbVNlcnZlcihcInN0YXR1c3VwZGF0ZVwiLCB7XG4gICAgICBzdGF0dXM6IGVycm9yID8gXCJkaXNjb25uZWN0ZWRcIiA6IFwiY29ubmVjdGVkXCIsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25EaXNjb25uZWN0KHBlcmlwaGVyYWxVdWlkOiBhbnkpIHtcbiAgICBjb25zdCBwZXJpcGhlcmFsOiBhbnkgPSB0aGlzLmZpbmRQZXJpcGhlcmFsKHBlcmlwaGVyYWxVdWlkKTtcbiAgICBwZXJpcGhlcmFsLm5vdGlmeUZyb21TZXJ2ZXIoXCJzdGF0dXN1cGRhdGVcIiwge3N0YXR1czogXCJkaXNjb25uZWN0ZWRcIn0pO1xuICB9XG5cbiAgcHVibGljIG9uUnNzaVVwZGF0ZSgpIHtcbiAgfVxuXG4gIHB1YmxpYyBvblNlcnZpY2VzRGlzY292ZXIocGVyaXBoZXJhbFV1aWQ6IGFueSwgc2VydmljZVV1aWRzPzogYW55KSB7XG4gICAgY29uc3QgcGVyaXBoZXJhbDogYW55ID0gdGhpcy5maW5kUGVyaXBoZXJhbChwZXJpcGhlcmFsVXVpZCk7XG4gICAgZm9yIChjb25zdCBzZXJ2aWNlVXVpZCBvZiBzZXJ2aWNlVXVpZHMpIHtcbiAgICAgIHBlcmlwaGVyYWwubm90aWZ5RnJvbVNlcnZlcihcImRpc2NvdmVyXCIsIHtzZXJ2aWNlX3V1aWQ6IHNlcnZpY2VVdWlkfSk7XG4gICAgfVxuICAgIHBlcmlwaGVyYWwubm90aWZ5RnJvbVNlcnZlcihcImRpc2NvdmVyZmluaXNoZWRcIiwge30pO1xuICB9XG5cbiAgcHVibGljIG9uSW5jbHVkZWRTZXJ2aWNlc0Rpc2NvdmVyKFxuICAgIHBlcmlwaGVyYWxVdWlkOiBhbnksXG4gICAgc2VydmljZVV1aWQ/OiBhbnksXG4gICAgaW5jbHVkZWRTZXJ2aWNlVXVpZHM/OiBhbnksXG4gICkge1xuICB9XG5cbiAgcHVibGljIG9uQ2hhcmFjdGVyaXN0aWNzRGlzY292ZXIocGVyaXBoZXJhbFV1aWQ6IGFueSwgc2VydmljZVV1aWQ/OiBhbnksIGNoYXJhY3RlcmlzdGljcz86IGFueSkge1xuICAgIGNvbnN0IHBlcmlwaGVyYWw6IGFueSA9IHRoaXMuZmluZFBlcmlwaGVyYWwocGVyaXBoZXJhbFV1aWQpO1xuICAgIGNvbnN0IHNlcnZpY2U6IGFueSA9IHBlcmlwaGVyYWwuZmluZFNlcnZpY2Uoe3NlcnZpY2VfdXVpZDogc2VydmljZVV1aWR9KTtcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcmFjdGVyaXN0aWNzKSB7XG4gICAgICBjb25zdCBvYmo6IGFueSA9IHtcbiAgICAgICAgcHJvcGVydGllczogY2hhci5wcm9wZXJ0aWVzLm1hcCgoZTogYW55KSA9PiBCbGVIZWxwZXIudG9TbmFrZUNhc2UoZSkpLFxuICAgICAgICBjaGFyYWN0ZXJpc3RpY191dWlkOiBjaGFyLnV1aWQsXG4gICAgICB9O1xuICAgICAgc2VydmljZS5ub3RpZnlGcm9tU2VydmVyKFwiZGlzY292ZXJcIiwgb2JqKTtcbiAgICB9XG4gICAgc2VydmljZS5ub3RpZnlGcm9tU2VydmVyKFwiZGlzY292ZXJmaW5pc2hlZFwiLCB7fSk7XG4gIH1cblxuICBwdWJsaWMgb25SZWFkKFxuICAgIHBlcmlwaGVyYWxVdWlkOiBhbnksXG4gICAgc2VydmljZVV1aWQ/OiBhbnksXG4gICAgY2hhcmFjdGVyaXN0aWNVdWlkPzogYW55LFxuICAgIGRhdGE/OiBhbnksXG4gICAgaXNOb3RpZmljYXRpb24/OiBhbnksXG4gICAgaXNTdWNjZXNzPzogYW55LFxuICApIHtcbiAgICBjb25zdCBwZXJpcGhlcmFsOiBhbnkgPSB0aGlzLmZpbmRQZXJpcGhlcmFsKHBlcmlwaGVyYWxVdWlkKTtcbiAgICBjb25zdCBjaGFyYWN0ZXJpc3RpYzogYW55ID0gcGVyaXBoZXJhbC5maW5kQ2hhcmFjdGVyaXN0aWMoe1xuICAgICAgc2VydmljZV91dWlkOiBzZXJ2aWNlVXVpZCxcbiAgICAgIGNoYXJhY3RlcmlzdGljX3V1aWQ6IGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICB9KTtcblxuICAgIGlmIChpc05vdGlmaWNhdGlvbikge1xuICAgICAgY29uc3Qgb2JqOiBhbnkgPSB7XG4gICAgICAgIGRhdGE6IEFycmF5LmZyb20oZGF0YSksXG4gICAgICB9O1xuICAgICAgY2hhcmFjdGVyaXN0aWMubm90aWZ5RnJvbVNlcnZlcihcIm9ubm90aWZ5XCIsIG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG9iajogYW55ID0ge1xuICAgICAgICByZXN1bHQ6IGlzU3VjY2VzcyA/IFwic3VjY2Vzc1wiIDogXCJmYWlsZWRcIixcbiAgICAgICAgZGF0YTogQXJyYXkuZnJvbShkYXRhKSxcbiAgICAgIH07XG4gICAgICBjaGFyYWN0ZXJpc3RpYy5ub3RpZnlGcm9tU2VydmVyKFwib25yZWFkXCIsIG9iaik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uV3JpdGUocGVyaXBoZXJhbFV1aWQ6IGFueSwgc2VydmljZVV1aWQ/OiBhbnksIGNoYXJhY3RlcmlzdGljVXVpZD86IGFueSwgaXNTdWNjZXNzPzogYW55KSB7XG4gICAgY29uc3QgcGVyaXBoZXJhbDogYW55ID0gdGhpcy5maW5kUGVyaXBoZXJhbChwZXJpcGhlcmFsVXVpZCk7XG4gICAgY29uc3QgY2hhcmFjdGVyaXN0aWM6IGFueSA9IHBlcmlwaGVyYWwuZmluZENoYXJhY3RlcmlzdGljKHtcbiAgICAgIHNlcnZpY2VfdXVpZDogc2VydmljZVV1aWQsXG4gICAgICBjaGFyYWN0ZXJpc3RpY191dWlkOiBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgfSk7XG4gICAgY2hhcmFjdGVyaXN0aWMubm90aWZ5RnJvbVNlcnZlcihcIm9ud3JpdGVcIiwge1xuICAgICAgcmVzdWx0OiBpc1N1Y2Nlc3MgPyBcInN1Y2Nlc3NcIiA6IFwiZmFpbGVkXCIsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25Ccm9hZGNhc3QocGVyaXBoZXJhbFV1aWQ6IGFueSwgc2VydmljZVV1aWQ/OiBhbnksIGNoYXJhY3RlcmlzdGljVXVpZD86IGFueSwgc3RhdGU/OiBhbnkpIHtcbiAgfVxuXG4gIHB1YmxpYyBvbk5vdGlmeShwZXJpcGhlcmFsVXVpZDogYW55LCBzZXJ2aWNlVXVpZD86IGFueSwgY2hhcmFjdGVyaXN0aWNVdWlkPzogYW55LCBzdGF0ZT86IGFueSkge1xuICAgIGNvbnN0IHBlcmlwaGVyYWw6IGFueSA9IHRoaXMuZmluZFBlcmlwaGVyYWwocGVyaXBoZXJhbFV1aWQpO1xuICAgIGNvbnN0IGNoYXI6IGFueSA9IHBlcmlwaGVyYWwuZmluZENoYXJhY3RlcmlzdGljKHtcbiAgICAgIHNlcnZpY2VfdXVpZDogc2VydmljZVV1aWQsXG4gICAgICBjaGFyYWN0ZXJpc3RpY191dWlkOiBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgfSk7XG5cbiAgICBpZiAoc3RhdGUpIHtcbiAgICAgIGNoYXIubm90aWZ5RnJvbVNlcnZlcihcIm9ucmVnaXN0ZXJub3RpZnlcIiwge30pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGFyLm5vdGlmeUZyb21TZXJ2ZXIoXCJvbnVucmVnaXN0ZXJub3RpZnlcIiwge30pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkRlc2NyaXB0b3JzRGlzY292ZXIoXG4gICAgcGVyaXBoZXJhbFV1aWQ6IGFueSxcbiAgICBzZXJ2aWNlVXVpZD86IGFueSxcbiAgICBjaGFyYWN0ZXJpc3RpY1V1aWQ/OiBhbnksXG4gICAgZGVzY3JpcHRvcnM/OiBhbnksXG4gICkge1xuICAgIGNvbnN0IHBlcmlwaGVyYWw6IGFueSA9IHRoaXMuZmluZFBlcmlwaGVyYWwocGVyaXBoZXJhbFV1aWQpO1xuICAgIGNvbnN0IGNoYXI6IGFueSA9IHBlcmlwaGVyYWwuZmluZENoYXJhY3RlcmlzdGljKHtcbiAgICAgIHNlcnZpY2VfdXVpZDogc2VydmljZVV1aWQsXG4gICAgICBjaGFyYWN0ZXJpc3RpY191dWlkOiBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgfSk7XG4gICAgZm9yIChjb25zdCBkZXNjciBvZiBkZXNjcmlwdG9ycykge1xuICAgICAgY29uc3Qgb2JqOiBhbnkgPSB7XG4gICAgICAgIGRlc2NyaXB0b3JfdXVpZDogZGVzY3IsXG4gICAgICB9O1xuICAgICAgY2hhci5ub3RpZnlGcm9tU2VydmVyKFwiZGlzY292ZXJcIiwgb2JqKTtcbiAgICB9XG4gICAgY2hhci5ub3RpZnlGcm9tU2VydmVyKFwiZGlzY292ZXJmaW5pc2hlZFwiLCB7fSk7XG4gIH1cblxuICBwdWJsaWMgb25WYWx1ZVJlYWQoXG4gICAgcGVyaXBoZXJhbFV1aWQ6IGFueSxcbiAgICBzZXJ2aWNlVXVpZD86IGFueSxcbiAgICBjaGFyYWN0ZXJpc3RpY1V1aWQ/OiBhbnksXG4gICAgZGVzY3JpcHRvclV1aWQ/OiBhbnksXG4gICAgZGF0YT86IGFueSxcbiAgICBpc1N1Y2Nlc3M/OiBhbnksXG4gICkge1xuICAgIGNvbnN0IHBlcmlwaGVyYWw6IGFueSA9IHRoaXMuZmluZFBlcmlwaGVyYWwocGVyaXBoZXJhbFV1aWQpO1xuICAgIGNvbnN0IGRlc2NyaXB0b3I6IGFueSA9IHBlcmlwaGVyYWwuZmluZERlc2NyaXB0b3Ioe1xuICAgICAgc2VydmljZV91dWlkOiBzZXJ2aWNlVXVpZCxcbiAgICAgIGNoYXJhY3RlcmlzdGljX3V1aWQ6IGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICAgIGRlc2NyaXB0b3JfdXVpZDogZGVzY3JpcHRvclV1aWQsXG4gICAgfSk7XG5cbiAgICBjb25zdCBvYmo6IGFueSA9IHtcbiAgICAgIHJlc3VsdDogaXNTdWNjZXNzID8gXCJzdWNjZXNzXCIgOiBcImZhaWxlZFwiLFxuICAgICAgZGF0YTogQXJyYXkuZnJvbShkYXRhKSxcbiAgICB9O1xuICAgIGRlc2NyaXB0b3Iubm90aWZ5RnJvbVNlcnZlcihcIm9ucmVhZFwiLCBvYmopO1xuICB9XG5cbiAgcHVibGljIG9uVmFsdWVXcml0ZShcbiAgICBwZXJpcGhlcmFsVXVpZDogYW55LFxuICAgIHNlcnZpY2VVdWlkPzogYW55LFxuICAgIGNoYXJhY3RlcmlzdGljVXVpZD86IGFueSxcbiAgICBkZXNjcmlwdG9yVXVpZD86IGFueSxcbiAgICBpc1N1Y2Nlc3M/OiBhbnksXG4gICkge1xuICAgIGNvbnN0IHBlcmlwaGVyYWw6IGFueSA9IHRoaXMuZmluZFBlcmlwaGVyYWwocGVyaXBoZXJhbFV1aWQpO1xuICAgIGNvbnN0IGRlc2NyaXB0b3I6IGFueSA9IHBlcmlwaGVyYWwuZmluZERlc2NyaXB0b3Ioe1xuICAgICAgc2VydmljZV91dWlkOiBzZXJ2aWNlVXVpZCxcbiAgICAgIGNoYXJhY3RlcmlzdGljX3V1aWQ6IGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICAgIGRlc2NyaXB0b3JfdXVpZDogZGVzY3JpcHRvclV1aWQsXG4gICAgfSk7XG5cbiAgICBjb25zdCBvYmo6IGFueSA9IHtcbiAgICAgIHJlc3VsdDogaXNTdWNjZXNzID8gXCJzdWNjZXNzXCIgOiBcImZhaWxlZFwiLFxuICAgIH07XG4gICAgZGVzY3JpcHRvci5ub3RpZnlGcm9tU2VydmVyKFwib253cml0ZVwiLCBvYmopO1xuICB9XG5cbiAgcHVibGljIG9uSGFuZGxlUmVhZChwZXJpcGhlcmFsVXVpZDogYW55LCBoYW5kbGU/OiBhbnksIGRhdGE/OiBhbnkpIHtcbiAgfVxuXG4gIHB1YmxpYyBvbkhhbmRsZVdyaXRlKHBlcmlwaGVyYWxVdWlkOiBhbnksIGhhbmRsZT86IGFueSkge1xuICB9XG5cbiAgcHVibGljIG9uSGFuZGxlTm90aWZ5KHBlcmlwaGVyYWxVdWlkOiBhbnksIGhhbmRsZT86IGFueSwgZGF0YT86IGFueSkge1xuICB9XG5cbiAgcHVibGljIG9uUGVyaXBoZXJhbFN0YXRlQ2hhbmdlKHN0YXRlOiBhbnkpIHtcbiAgICAvLyBjb25zb2xlLmVycm9yKFwib25QZXJpcGhlcmFsU3RhdGVDaGFuZ2VcIilcbiAgfVxuXG4gIHB1YmxpYyBvblBlcmlwaGVyYWxBZGRyZXNzQ2hhbmdlKGFkZHJlc3M6IGFueSkge1xuICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJvblBlcmlwaGVyYWxBZGRyZXNzQ2hhbmdlXCIpXG4gIH1cblxuICBwdWJsaWMgb25QZXJpcGhlcmFsUGxhdGZvcm0ocGxhdGZvcm06IGFueSkge1xuICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJvblBlcmlwaGVyYWxQbGF0Zm9ybVwiKVxuICB9XG5cbiAgcHVibGljIG9uUGVyaXBoZXJhbEFkdmVydGlzaW5nU3RhcnQoZXJyb3I6IGFueSkge1xuICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJvblBlcmlwaGVyYWxBZHZlcnRpc2luZ1N0YXJ0XCIpXG4gIH1cblxuICBwdWJsaWMgb25QZXJpcGhlcmFsQWR2ZXJ0aXNpbmdTdG9wKCkge1xuICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJvblBlcmlwaGVyYWxBZHZlcnRpc2luZ1N0b3BcIilcbiAgfVxuXG4gIHB1YmxpYyBvblBlcmlwaGVyYWxTZXJ2aWNlc1NldChlcnJvcjogYW55KSB7XG4gICAgLy8gY29uc29sZS5lcnJvcihcIm9uUGVyaXBoZXJhbFNlcnZpY2VzU2V0XCIpXG4gIH1cblxuICBwdWJsaWMgb25QZXJpcGhlcmFsQWNjZXB0KGNsaWVudEFkZHJlc3M6IGFueSkge1xuICAgIHRoaXMucGVyaXBoZXJhbC5jdXJyZW50Q29ubmVjdGVkRGV2aWNlQWRkcmVzcyA9IGNsaWVudEFkZHJlc3M7XG4gICAgdGhpcy5wZXJpcGhlcmFsLm9uY29ubmVjdGlvbnVwZGF0ZXMoe1xuICAgICAgYWRkcmVzczogY2xpZW50QWRkcmVzcyxcbiAgICAgIHN0YXR1czogXCJjb25uZWN0ZWRcIixcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvblBlcmlwaGVyYWxNdHVDaGFuZ2UobXR1OiBhbnkpIHtcbiAgICAvLyBjb25zb2xlLmVycm9yKFwib25QZXJpcGhlcmFsTXR1Q2hhbmdlXCIpXG4gIH1cblxuICBwdWJsaWMgb25QZXJpcGhlcmFsRGlzY29ubmVjdChjbGllbnRBZGRyZXNzOiBhbnkpIHtcbiAgICB0aGlzLnBlcmlwaGVyYWwuY3VycmVudENvbm5lY3RlZERldmljZUFkZHJlc3MgPSBudWxsO1xuICAgIHRoaXMucGVyaXBoZXJhbC5vbmNvbm5lY3Rpb251cGRhdGVzKHtcbiAgICAgIGFkZHJlc3M6IGNsaWVudEFkZHJlc3MsXG4gICAgICBzdGF0dXM6IFwiZGlzY29ubmVjdGVkXCIsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25QZXJpcGhlcmFsUnNzaVVwZGF0ZShyc3NpOiBhbnkpIHtcbiAgICAvLyBjb25zb2xlLmVycm9yKFwib25QZXJpcGhlcmFsUnNzaVVwZGF0ZVwiKVxuICB9XG5cbiAgcHVibGljIF9iaW5kKCkge1xuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLm9uKFwic3RhdGVDaGFuZ2VcIiwgdGhpcy5vblN0YXRlQ2hhbmdlLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5jZW50cmFsQmluZGluZ3Mub24oXCJhZGRyZXNzQ2hhbmdlXCIsIHRoaXMub25BZGRyZXNzQ2hhbmdlLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5jZW50cmFsQmluZGluZ3Mub24oXCJzY2FuU3RhcnRcIiwgdGhpcy5vblNjYW5TdGFydC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5vbihcInNjYW5TdG9wXCIsIHRoaXMub25TY2FuU3RvcC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5vbihcImRpc2NvdmVyXCIsIHRoaXMub25EaXNjb3Zlci5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5vbihcImNvbm5lY3RcIiwgdGhpcy5vbkNvbm5lY3QuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5jZW50cmFsQmluZGluZ3Mub24oXCJkaXNjb25uZWN0XCIsIHRoaXMub25EaXNjb25uZWN0LmJpbmQodGhpcykpO1xuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLm9uKFwicnNzaVVwZGF0ZVwiLCB0aGlzLm9uUnNzaVVwZGF0ZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5vbihcbiAgICAgIFwic2VydmljZXNEaXNjb3ZlclwiLFxuICAgICAgdGhpcy5vblNlcnZpY2VzRGlzY292ZXIuYmluZCh0aGlzKSxcbiAgICApO1xuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLm9uKFxuICAgICAgXCJpbmNsdWRlZFNlcnZpY2VzRGlzY292ZXJcIixcbiAgICAgIHRoaXMub25JbmNsdWRlZFNlcnZpY2VzRGlzY292ZXIuYmluZCh0aGlzKSxcbiAgICApO1xuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLm9uKFxuICAgICAgXCJjaGFyYWN0ZXJpc3RpY3NEaXNjb3ZlclwiLFxuICAgICAgdGhpcy5vbkNoYXJhY3RlcmlzdGljc0Rpc2NvdmVyLmJpbmQodGhpcyksXG4gICAgKTtcblxuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLm9uKFwicmVhZFwiLCB0aGlzLm9uUmVhZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5vbihcIndyaXRlXCIsIHRoaXMub25Xcml0ZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5vbihcImJyb2FkY2FzdFwiLCB0aGlzLm9uQnJvYWRjYXN0LmJpbmQodGhpcykpO1xuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLm9uKFwibm90aWZ5XCIsIHRoaXMub25Ob3RpZnkuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5jZW50cmFsQmluZGluZ3Mub24oXG4gICAgICBcImRlc2NyaXB0b3JzRGlzY292ZXJcIixcbiAgICAgIHRoaXMub25EZXNjcmlwdG9yc0Rpc2NvdmVyLmJpbmQodGhpcyksXG4gICAgKTtcbiAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5vbihcInZhbHVlUmVhZFwiLCB0aGlzLm9uVmFsdWVSZWFkLmJpbmQodGhpcykpO1xuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLm9uKFwidmFsdWVXcml0ZVwiLCB0aGlzLm9uVmFsdWVXcml0ZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5vbihcImhhbmRsZVJlYWRcIiwgdGhpcy5vbkhhbmRsZVJlYWQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5jZW50cmFsQmluZGluZ3Mub24oXCJoYW5kbGVXcml0ZVwiLCB0aGlzLm9uSGFuZGxlV3JpdGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5jZW50cmFsQmluZGluZ3Mub24oXCJoYW5kbGVOb3RpZnlcIiwgdGhpcy5vbkhhbmRsZU5vdGlmeS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMucGVyaXBoZXJhbEJpbmRpbmdzLm9uKFxuICAgICAgXCJzdGF0ZUNoYW5nZVwiLFxuICAgICAgdGhpcy5vblBlcmlwaGVyYWxTdGF0ZUNoYW5nZS5iaW5kKHRoaXMpLFxuICAgICk7XG4gICAgdGhpcy5wZXJpcGhlcmFsQmluZGluZ3Mub24oXG4gICAgICBcImFkZHJlc3NDaGFuZ2VcIixcbiAgICAgIHRoaXMub25QZXJpcGhlcmFsQWRkcmVzc0NoYW5nZS5iaW5kKHRoaXMpLFxuICAgICk7XG4gICAgdGhpcy5wZXJpcGhlcmFsQmluZGluZ3Mub24oXG4gICAgICBcInBsYXRmb3JtXCIsXG4gICAgICB0aGlzLm9uUGVyaXBoZXJhbFBsYXRmb3JtLmJpbmQodGhpcyksXG4gICAgKTtcbiAgICB0aGlzLnBlcmlwaGVyYWxCaW5kaW5ncy5vbihcbiAgICAgIFwiYWR2ZXJ0aXNpbmdTdGFydFwiLFxuICAgICAgdGhpcy5vblBlcmlwaGVyYWxBZHZlcnRpc2luZ1N0YXJ0LmJpbmQodGhpcyksXG4gICAgKTtcbiAgICB0aGlzLnBlcmlwaGVyYWxCaW5kaW5ncy5vbihcbiAgICAgIFwiYWR2ZXJ0aXNpbmdTdG9wXCIsXG4gICAgICB0aGlzLm9uUGVyaXBoZXJhbEFkdmVydGlzaW5nU3RvcC5iaW5kKHRoaXMpLFxuICAgICk7XG4gICAgdGhpcy5wZXJpcGhlcmFsQmluZGluZ3Mub24oXG4gICAgICBcInNlcnZpY2VzU2V0XCIsXG4gICAgICB0aGlzLm9uUGVyaXBoZXJhbFNlcnZpY2VzU2V0LmJpbmQodGhpcyksXG4gICAgKTtcbiAgICB0aGlzLnBlcmlwaGVyYWxCaW5kaW5ncy5vbihcImFjY2VwdFwiLCB0aGlzLm9uUGVyaXBoZXJhbEFjY2VwdC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnBlcmlwaGVyYWxCaW5kaW5ncy5vbihcbiAgICAgIFwibXR1Q2hhbmdlXCIsXG4gICAgICB0aGlzLm9uUGVyaXBoZXJhbE10dUNoYW5nZS5iaW5kKHRoaXMpLFxuICAgICk7XG4gICAgdGhpcy5wZXJpcGhlcmFsQmluZGluZ3Mub24oXG4gICAgICBcImRpc2Nvbm5lY3RcIixcbiAgICAgIHRoaXMub25QZXJpcGhlcmFsRGlzY29ubmVjdC5iaW5kKHRoaXMpLFxuICAgICk7XG5cbiAgICB0aGlzLnBlcmlwaGVyYWxCaW5kaW5ncy5vbihcbiAgICAgIFwicnNzaVVwZGF0ZVwiLFxuICAgICAgdGhpcy5vblBlcmlwaGVyYWxSc3NpVXBkYXRlLmJpbmQodGhpcyksXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBPYm5pekJMRTtcbiJdfQ==
