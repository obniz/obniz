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
const bleSecurity_1 = __importDefault(require("./bleSecurity"));
const bleService_1 = __importDefault(require("./bleService"));
/**
 * Use a obniz device as a BLE device.
 * Peripheral and Central mode are supported
 */
class ObnizBLE extends ComponentAbstact_1.ComponentAbstract {
    constructor(obniz) {
        super(obniz);
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
        obniz.on("close", () => {
            this._reset();
        });
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
            this._initialized = true;
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
        }
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        if (this.peripheral && this.peripheral.currentConnectedDeviceAddress) {
            const address = this.peripheral.currentConnectedDeviceAddress;
            this.peripheral.currentConnectedDeviceAddress = null;
            setTimeout(() => {
                if (this.peripheral.onconnectionupdates) {
                    this.peripheral.onconnectionupdates({
                        address,
                        status: "disconnected",
                        reason: new ObnizError_1.ObnizOfflineError(),
                    });
                }
            }, 0);
        }
        if (this.remotePeripherals) {
            for (const p of this.remotePeripherals) {
                if (p.connected) {
                    p.notifyFromServer("statusupdate", { status: "disconnected", reason: new ObnizError_1.ObnizOfflineError() });
                }
            }
        }
        if (this.scan && this.scan.state !== "stopped") {
            this.scan.notifyFromServer("obnizClose", {});
        }
        this.hci._reset();
        this.hciProtocol = new hci_2.default(this.hci);
        this.hciProtocol.debugHandler = (text) => {
            this.debug(`BLE-HCI: ${text}`);
        };
        this.centralBindings = new bindings_1.default(this.hciProtocol);
        this.peripheralBindings = new bindings_2.default(this.hciProtocol);
        this.centralBindings.init();
        this.peripheralBindings.init();
        this.centralBindings.debugHandler = (text) => {
            this.debug(`BLE: ${text}`);
        };
        this._initialized = false;
        this._initializeWarning = true;
        this.remotePeripherals = [];
        this.peripheral = new blePeripheral_1.default(this);
        this.advertisement = new bleAdvertisement_1.default(this);
        this.scan = new bleScan_1.default(this);
        this.security = new bleSecurity_1.default(this);
        this._bind();
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
    _bind() {
        this.centralBindings.on("stateChange", this.onStateChange.bind(this));
        this.centralBindings.on("discover", this.onDiscover.bind(this));
        this.centralBindings.on("disconnect", this.onDisconnect.bind(this));
        this.centralBindings.on("notification", this.onNotification.bind(this));
        this.peripheralBindings.on("stateChange", this.onPeripheralStateChange.bind(this));
        this.peripheralBindings.on("accept", this.onPeripheralAccept.bind(this));
        this.peripheralBindings.on("mtuChange", this.onPeripheralMtuChange.bind(this));
        this.peripheralBindings.on("disconnect", this.onPeripheralDisconnect.bind(this));
    }
    debug(text) {
        this.debugHandler(text);
    }
}
exports.default = ObnizBLE;

//# sourceMappingURL=ble.js.map
