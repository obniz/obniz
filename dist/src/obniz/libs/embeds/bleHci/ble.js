"use strict";
/**
 * Obniz BLE are switches automatically. <br/>
 * obnizOS ver >= 3.0.0  : [[ObnizCore.Components.Ble.Hci | Hci]] <br/>
 * obnizOS ver < 3.0.0   : Not Supported <br/>
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hci_1 = __importDefault(require("./hci"));
const bindings_1 = __importDefault(require("./protocol/central/bindings"));
const hci_2 = __importDefault(require("./protocol/hci"));
const bindings_2 = __importDefault(require("./protocol/peripheral/bindings"));
const semver_1 = __importDefault(require("semver"));
const ObnizError_1 = require("../../../ObnizError");
const ComponentAbstact_1 = require("../../ComponentAbstact");
const bleAdvertisement_1 = __importDefault(require("./bleAdvertisement"));
const bleCharacteristic_1 = __importDefault(require("./bleCharacteristic"));
const bleDescriptor_1 = __importDefault(require("./bleDescriptor"));
const blePeripheral_1 = __importDefault(require("./blePeripheral"));
const bleRemotePeripheral_1 = __importDefault(require("./bleRemotePeripheral"));
const bleScan_1 = __importDefault(require("./bleScan"));
const bleService_1 = __importDefault(require("./bleService"));
/**
 * Use a obniz device as a BLE device.
 * Peripheral and Central mode are supported
 */
class ObnizBLE extends ComponentAbstact_1.ComponentAbstract {
    constructor(obniz) {
        super(obniz);
        this.remotePeripherals = [];
        /**
         * @ignore
         */
        this._initialized = false;
        this.debugHandler = () => { };
        this.hci = new hci_1.default(obniz);
        this.service = bleService_1.default;
        this.characteristic = bleCharacteristic_1.default;
        this.descriptor = bleDescriptor_1.default;
        this.on("/response/ble/hci/read", (obj) => {
            if (obj.hci) {
                this.hci.notified(obj.hci);
            }
        });
        this.on("/response/ble/error", (obj) => {
            if (obj.error) {
                const error = obj.error;
                let msg = "BLE error: " + error.message;
                msg += " (";
                msg += "error_code: " + error.error_code;
                msg += ", ";
                msg += "module_error_code: " + error.module_error_code;
                msg += ", ";
                msg += "function_code: " + error.function_code;
                msg += ", ";
                msg += "address: " + error.address;
                msg += ", ";
                msg += "service_uuid: " + error.service_uuid;
                msg += ", ";
                msg += "characteristic_uuid: " + error.characteristic_uuid;
                msg += ", ";
                msg += "descriptor_uuid: " + error.descriptor_uuid;
                msg += ")";
                this.Obniz.error({ alert: "error", message: msg });
            }
        });
        this._reset();
    }
    // public security!: BleSecurity;
    /**
     * Initialized status.
     *
     * ```javascript
     * // Javascript Example
     * obniz.ble.isInitialized; // => false
     * await obniz.ble.initWait();
     * obniz.ble.isInitialized; // => true
     * ```
     */
    get isInitialized() {
        return this._initialized;
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
     * This throws if device is not supported device.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * ```
     */
    async initWait() {
        if (!this._initialized) {
            const MinHCIAvailableOS = "3.0.0";
            if (semver_1.default.lt(this.Obniz.firmware_ver, MinHCIAvailableOS)) {
                throw new ObnizError_1.ObnizBleUnSupportedOSVersionError(this.Obniz.firmware_ver, MinHCIAvailableOS);
            }
            // force initialize on obnizOS < 3.2.0
            if (semver_1.default.lt(this.Obniz.firmware_ver, "3.2.0")) {
                this.hci.init();
                this.hci.end(); // disable once
                this.hci.init();
            }
            try {
                await this.hciProtocol.initWait();
            }
            catch (e) {
                if (e instanceof ObnizError_1.ObnizBleUnsupportedHciError) {
                    this.Obniz.reboot();
                }
                throw e;
            }
            this._initialized = true;
        }
    }
    /**
     * Reset Target Device and current SDK status without rebooting. If error occured while reset, then target device will reboot.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.resetWait();
     * ```
     */
    async resetWait() {
        try {
            if (this._initialized) {
                this._reset();
                await this.hciProtocol.resetWait();
                this._initialized = true;
            }
        }
        catch (e) {
            if (e instanceof ObnizError_1.ObnizBleUnsupportedHciError) {
                this.Obniz.reboot();
            }
            throw e;
        }
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        // reset state at first
        this._initialized = false;
        this._initializeWarning = true;
        // clear all found peripherals.
        for (const p of this.remotePeripherals) {
            if (p.connected) {
                p.notifyFromServer("statusupdate", { status: "disconnected", reason: new ObnizError_1.ObnizOfflineError() });
            }
        }
        this.remotePeripherals = [];
        // instantiate
        if (!this.peripheral) {
            this.peripheral = new blePeripheral_1.default(this);
        }
        if (!this.scan) {
            this.scan = new bleScan_1.default(this);
        }
        else {
            this.scan.notifyFromServer("obnizClose", {});
        }
        if (!this.advertisement) {
            this.advertisement = new bleAdvertisement_1.default(this);
        }
        // reset all submodules.
        this.peripheral._reset();
        this.scan._reset();
        this.advertisement._reset();
        // clear scanning
        this.hci._reset();
        if (!this.hciProtocol) {
            this.hciProtocol = new hci_2.default(this.hci);
            this.hciProtocol.debugHandler = (text) => {
                this.debug(`BLE-HCI: ${text}`);
            };
        }
        else {
            this.hciProtocol._reset();
        }
        if (!this.centralBindings) {
            this.centralBindings = new bindings_1.default(this.hciProtocol);
            this.centralBindings.debugHandler = (text) => {
                this.debug(`BLE: ${text}`);
            };
            this.centralBindings.on("stateChange", this.onStateChange.bind(this));
            this.centralBindings.on("discover", this.onDiscover.bind(this));
            this.centralBindings.on("disconnect", this.onDisconnect.bind(this));
            this.centralBindings.on("notification", this.onNotification.bind(this));
        }
        else {
            this.centralBindings._reset();
        }
        if (!this.peripheralBindings) {
            this.peripheralBindings = new bindings_2.default(this.hciProtocol);
            this.peripheralBindings.on("stateChange", this.onPeripheralStateChange.bind(this));
            this.peripheralBindings.on("accept", this.onPeripheralAccept.bind(this));
            this.peripheralBindings.on("mtuChange", this.onPeripheralMtuChange.bind(this));
            this.peripheralBindings.on("disconnect", this.onPeripheralDisconnect.bind(this));
        }
        else {
            this.peripheralBindings._reset();
        }
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
        this.centralBindings.addPeripheralData(uuid, addressType);
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
    schemaBasePath() {
        return "ble";
    }
    onStateChange() { }
    findPeripheral(address) {
        for (const key in this.remotePeripherals) {
            if (this.remotePeripherals[key].address === address) {
                return this.remotePeripherals[key];
            }
        }
        return null;
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
            ble_event_type: connectable ? "connectable_advertisemnt" : "non_connectable_advertising",
            rssi,
            adv_data: advertisement.advertisementRaw,
            scan_resp: advertisement.scanResponseRaw,
        };
        val.setParams(peripheralData);
        this.scan.notifyFromServer("onfind", val);
    }
    onDisconnect(peripheralUuid, reason) {
        const peripheral = this.findPeripheral(peripheralUuid);
        peripheral.notifyFromServer("statusupdate", { status: "disconnected", reason });
    }
    //
    // protected onServicesDiscover(peripheralUuid: any, serviceUuids?: any) {
    //   const peripheral: any = this.findPeripheral(peripheralUuid);
    //   for (const serviceUuid of serviceUuids) {
    //     peripheral.notifyFromServer("discover", { service_uuid: serviceUuid });
    //   }
    //   peripheral.notifyFromServer("discoverfinished", {});
    // }
    // protected onIncludedServicesDiscover(peripheralUuid: any, serviceUuid?: any, includedServiceUuids?: any) {}
    // protected onCharacteristicsDiscover(peripheralUuid: any, serviceUuid?: any, characteristics?: any) {
    //   const peripheral: any = this.findPeripheral(peripheralUuid);
    //   const service: any = peripheral.findService({ service_uuid: serviceUuid });
    //   for (const char of characteristics) {
    //     const obj: any = {
    //       properties: char.properties.map((e: any) => BleHelper.toSnakeCase(e)),
    //       characteristic_uuid: char.uuid,
    //     };
    //     service.notifyFromServer("discover", obj);
    //   }
    //   service.notifyFromServer("discoverfinished", {});
    // }
    onNotification(peripheralUuid, serviceUuid, characteristicUuid, data, isNotification, isSuccess) {
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
    }
    onPeripheralStateChange(state) {
        // console.error("onPeripheralStateChange")
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
    onPeripheralDisconnect(clientAddress, reason) {
        this.peripheral.currentConnectedDeviceAddress = null;
        if (this.peripheral.onconnectionupdates) {
            this.peripheral.onconnectionupdates({
                address: clientAddress,
                status: "disconnected",
                reason,
            });
        }
    }
    debug(text) {
        this.debugHandler(text);
    }
}
exports.default = ObnizBLE;
