"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonBinaryConverter_1 = __importDefault(require("./jsonBinaryConverter"));
const WSCommand_1 = __importDefault(require("./WSCommand"));
const WSCommandBleHci_1 = __importDefault(require("./WSCommandBleHci"));
class WSCommandBle extends WSCommand_1.default {
    constructor() {
        super();
        this.module = 11;
        this.uuidLength = 16 + 2;
        this._CommandSetAdvData = 0;
        this._CommandSetScanRespData = 1;
        this._CommandStartAdv = 2;
        this._CommandStopAdv = 3;
        this._CommandScan = 4;
        this._CommandStartScan = 4;
        this._CommandStopScan = 5;
        this._CommandScanResults = 6;
        this._CommandConnect = 7;
        this._CommandServices = 8;
        this._CommandCharacteristics = 9;
        this._CommandWriteCharacteristics = 10;
        this._CommandReadCharacteristics = 11;
        this._CommandRegisterNotifyCharacteristic = 12;
        this._CommandUnregisterNotifyCharacteristic = 13;
        this._CommandDescriptors = 14;
        this._CommandWriteDescriptor = 15;
        this._CommandReadDescriptor = 16;
        this._CommandNotifyCharacteristic = 17;
        this._CommandSetDeviceName = 19;
        this._CommandServerStartPeripheral = 20;
        this._CommandServerNotifyConnect = 21;
        this._CommandServerAddService = 22;
        this._CommandServerAddCharacteristic = 23;
        this._CommandServerAddDescriptor = 24;
        this._CommandServerWriteCharavteristicValue = 25;
        this._CommandServerReadCharavteristicValue = 26;
        this._CommandServerNotifyWriteCharavteristicValue = 27;
        this._CommandServerNotifyReadCharavteristicValue = 28;
        this._CommandServerWriteDescriptorValue = 29;
        this._CommandServerReadDescriptorValue = 30;
        this._CommandServerNotifyWriteDescriptorValue = 31;
        this._CommandServerNotifyReadDescriptorValue = 32;
        this._CommandServerNotifyCharavteristic = 33;
        this._CommandServerStartStopService = 34;
        this._CommandSecuritySetAuth = 35;
        this._CommandSecuritySetEncryptionLevel = 36;
        this._CommandSecuritySetEnableKeyTypes = 37;
        this._CommandSecuritySetKeyMaxSize = 38;
        this._CommandSecuritySetIOCapability = 39;
        this._CommandSecurityClearBondingDevices = 40;
        this._CommandScanResultsDevice = {
            breder: 0x01,
            ble: 0x02,
            dumo: 0x03,
        };
        /// BLE device address type
        this._CommandScanResultsDeviceAddress = {
            public: 0x00,
            random: 0x01,
            rpa_public: 0x02,
            rpa_random: 0x03,
        };
        this._CommandScanResultsEvet = {
            inquiry_result: 0 /*!< Inquiry result for a peer device. */,
            inquiry_complete: 1 /*!< Inquiry complete. */,
            discovery_result: 2 /*!< Discovery result for a peer device. */,
            discovery_ble_result: 3 /*!< Discovery result for BLE GATT based service on a peer device. */,
            discovery_cmoplete: 4 /*!< Discovery complete. */,
            discovery_di_cmoplete: 5 /*!< Discovery complete. */,
            cancelled: 6 /*!< Search cancelled */,
        };
        this._CommandScanResultsBleEvent = {
            connectable_advertisemnt: 0x00 /*!< Connectable undirected advertising (ADV_IND) */,
            connectable_directed_advertisemnt: 0x01 /*!< Connectable directed advertising (ADV_DIRECT_IND) */,
            scannable_advertising: 0x02 /*!< Scannable undirected advertising (ADV_SCAN_IND) */,
            non_connectable_advertising: 0x03 /*!< Non connectable undirected advertising (ADV_NONCONN_IND) */,
            scan_response: 0x04 /*!< Scan Response (SCAN_RSP) */,
        };
        this._CommandCharacteristicsProperties = {
            broadcast: 0x01,
            read: 0x02,
            write_without_response: 0x04,
            write: 0x08,
            notify: 0x10,
            indicate: 0x20,
            auth: 0x40,
            extended_properties: 0x80,
        };
        this._commandResults = {
            success: 0,
            failed: 1,
        };
        this._securityAuthValues = {
            0x01: "bonding",
            0x04: "mitm",
            0x08: "secure_connection",
        };
        this._securityEncryotionLevels = {
            none: 0x01,
            encryption: 0x02,
            mitm: 0x03,
        };
        this._securityKeyTypes = {
            0x01: "ltk",
            0x02: "irk",
            0x04: "csrk",
        };
        this.hciCommand = new WSCommandBleHci_1.default(this);
    }
    /* CENTRAL   */
    centralScanStart(params) {
        const schema = [
            { path: "scan.duration", length: 4, type: "int", default: 30 },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandStartScan, buf);
    }
    centralScanStop(params) {
        this.sendCommand(this._CommandStopScan, null);
    }
    centralConnect(params) {
        const schema = [
            {
                path: "connect.address",
                length: 6,
                type: "hex",
                required: true,
                endianness: "little",
            },
            { path: null, length: 1, type: "char", default: false },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandConnect, buf);
    }
    centralDisconnect(params) {
        const schema = [
            {
                path: "disconnect.address",
                length: 6,
                type: "hex",
                required: true,
                endianness: "little",
            },
            { path: null, length: 1, type: "char", default: true },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandConnect, buf);
    }
    centralServiceGet(params) {
        const schema = [
            {
                path: "get_services.address",
                length: 6,
                type: "hex",
                required: true,
                endianness: "little",
            },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandServices, buf);
    }
    centralCharacteristicGet(params) {
        const schema = [
            {
                path: "get_characteristics.address",
                length: 6,
                type: "hex",
                required: true,
                endianness: "little",
            },
            {
                path: "get_characteristics.service_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandCharacteristics, buf);
    }
    centralCharacteristicRead(params) {
        const schema = [
            {
                path: "read_characteristic.address",
                length: 6,
                type: "hex",
                required: true,
                endianness: "little",
            },
            {
                path: "read_characteristic.service_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "read_characteristic.characteristic_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandReadCharacteristics, buf);
    }
    centralCharacteristicWrite(params) {
        const schema = [
            {
                path: "write_characteristic.address",
                length: 6,
                type: "hex",
                required: true,
                endianness: "little",
            },
            {
                path: "write_characteristic.service_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "write_characteristic.characteristic_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "write_characteristic.needResponse",
                length: 1,
                type: "char",
                default: 1,
            },
            { path: "write_characteristic.data", length: null, type: "dataArray" },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandWriteCharacteristics, buf);
    }
    centralCharacteristicRegisterNotify(params) {
        const schema = [
            {
                path: "register_notify_characteristic.address",
                length: 6,
                type: "hex",
                required: true,
                endianness: "little",
            },
            {
                path: "register_notify_characteristic.service_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "register_notify_characteristic.characteristic_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandRegisterNotifyCharacteristic, buf);
    }
    centralCharacteristicUnregisterNotify(params) {
        const schema = [
            {
                path: "unregister_notify_characteristic.address",
                length: 6,
                type: "hex",
                required: true,
                endianness: "little",
            },
            {
                path: "unregister_notify_characteristic.service_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "unregister_notify_characteristic.characteristic_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandUnregisterNotifyCharacteristic, buf);
    }
    centralDescriptorGet(params) {
        const schema = [
            {
                path: "get_descriptors.address",
                length: 6,
                type: "hex",
                required: true,
                endianness: "little",
            },
            {
                path: "get_descriptors.service_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "get_descriptors.characteristic_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandDescriptors, buf);
    }
    centralDescriptorRead(params) {
        const schema = [
            {
                path: "read_descriptor.address",
                length: 6,
                type: "hex",
                required: true,
                endianness: "little",
            },
            {
                path: "read_descriptor.service_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "read_descriptor.characteristic_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "read_descriptor.descriptor_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandReadDescriptor, buf);
    }
    centralDescriptorWrite(params) {
        const schema = [
            {
                path: "write_descriptor.address",
                length: 6,
                type: "hex",
                required: true,
                endianness: "little",
            },
            {
                path: "write_descriptor.service_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "write_descriptor.characteristic_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "write_descriptor.descriptor_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "write_descriptor.needResponse",
                length: 1,
                type: "char",
                default: 1,
            },
            { path: "write_descriptor.data", length: null, type: "dataArray" },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandWriteDescriptor, buf);
    }
    /* PERIPHERAL   */
    peripheralAdvertisementStart(params) {
        this.sendCommand(this._CommandSetAdvData, new Uint8Array(params.advertisement.adv_data));
        if (params.advertisement.scan_resp) {
            this.sendCommand(this._CommandSetScanRespData, new Uint8Array(params.advertisement.scan_resp));
        }
        this.sendCommand(this._CommandStartAdv, null);
    }
    peripheralAdvertisementStop(params) {
        this.sendCommand(this._CommandStopAdv, null);
    }
    peripheralServiceStart(params) {
        const val = params.peripheral;
        const propFlags = {
            0x01: "broadcast",
            0x02: "read",
            0x04: "write_without_response",
            0x08: "write",
            0x10: "notify",
            0x20: "indiate",
            0x40: "auth",
            0x80: "ext_prop",
        };
        const permissionFlags = {
            0x001: "read",
            0x002: "read_encrypted",
            0x004: "read_encrypted_mitm",
            0x010: "write",
            0x020: "write_encrypted",
            0x040: "write_encrypted_mitm",
            0x080: "write_signed",
            0x100: "write_signed_mitm",
        };
        const schema = {
            service: {
                command: this._CommandServerAddService,
                schema: [{ path: "uuid", length: 18, type: "uuid", required: true }],
            },
            characteristic: {
                command: this._CommandServerAddCharacteristic,
                schema: [
                    { path: "service_uuid", length: 18, type: "uuid", required: true },
                    { path: "uuid", length: 18, type: "uuid", required: true },
                    {
                        path: "permissions",
                        length: 2,
                        type: "flag",
                        default: ["write", "read"],
                        flags: permissionFlags,
                    },
                    {
                        path: "properties",
                        length: 1,
                        type: "flag",
                        default: ["write", "read"],
                        flags: propFlags,
                    },
                    { path: "data", type: "dataArray" },
                ],
            },
            descriptor: {
                command: this._CommandServerAddDescriptor,
                schema: [
                    { path: "service_uuid", length: 18, type: "uuid", required: true },
                    {
                        path: "characteristic_uuid",
                        length: 18,
                        type: "uuid",
                        required: true,
                    },
                    { path: "uuid", length: 18, type: "uuid", required: true },
                    {
                        path: "permissions",
                        length: 2,
                        type: "flag",
                        default: ["write", "read"],
                        flags: permissionFlags,
                    },
                    { path: "data", type: "dataArray" },
                ],
            },
            startService: {
                command: this._CommandServerStartStopService,
                schema: [
                    { path: "uuid", length: 18, type: "uuid", required: true },
                    { path: null, length: 1, type: "char", default: 0 },
                ],
            },
        };
        const sendBufs = [];
        const startServiceBufs = [];
        let buf;
        for (const serviceIndex in val.services) {
            const service = val.services[serviceIndex];
            buf = jsonBinaryConverter_1.default.createSendBuffer(schema.service.schema, service);
            if (buf.length === 0) {
                return;
            }
            sendBufs.push({ command: schema.service.command, buffer: buf });
            buf = jsonBinaryConverter_1.default.createSendBuffer(schema.startService.schema, service);
            startServiceBufs.push({
                command: schema.startService.command,
                buffer: buf,
            });
            for (const charaIndex in service.characteristics) {
                const chara = service.characteristics[charaIndex];
                chara.service_uuid = service.uuid;
                buf = jsonBinaryConverter_1.default.createSendBuffer(schema.characteristic.schema, chara);
                if (buf.length === 0) {
                    return;
                }
                sendBufs.push({
                    command: schema.characteristic.command,
                    buffer: buf,
                });
                for (const descIndex in chara.descriptors) {
                    const desc = chara.descriptors[descIndex];
                    desc.service_uuid = service.uuid;
                    desc.characteristic_uuid = chara.uuid;
                    buf = jsonBinaryConverter_1.default.createSendBuffer(schema.descriptor.schema, desc);
                    if (buf.length === 0) {
                        return;
                    }
                    sendBufs.push({ command: schema.descriptor.command, buffer: buf });
                }
            }
        }
        for (const index in sendBufs) {
            this.sendCommand(sendBufs[index].command, sendBufs[index].buffer);
        }
        for (const index in startServiceBufs) {
            this.sendCommand(startServiceBufs[index].command, startServiceBufs[index].buffer);
        }
    }
    peripheralServiceStop(params) {
        const schema = [
            {
                path: "peripheral.stop_service.service_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            { path: null, length: 1, type: "char", default: 1 },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandServerStartStopService, buf);
    }
    peripheralServiceStopAll() {
        this.sendCommand(this._CommandServerStartPeripheral, new Uint8Array([1]));
    }
    peripheralCharacteristicRead(params) {
        const schema = [
            {
                path: "peripheral.read_characteristic.service_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "peripheral.read_characteristic.characteristic_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandServerReadCharavteristicValue, buf);
    }
    peripheralCharacteristicWrite(params) {
        const schema = [
            {
                path: "peripheral.write_characteristic.service_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "peripheral.write_characteristic.characteristic_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            { path: "peripheral.write_characteristic.data", type: "dataArray" },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandServerWriteCharavteristicValue, buf);
    }
    peripheralCharacteristicNotify(params) {
        const schema = [
            {
                path: "peripheral.notify_characteristic.service_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "peripheral.notify_characteristic.characteristic_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandServerNotifyCharavteristic, buf);
    }
    peripheralDescriptorRead(params) {
        const schema = [
            {
                path: "peripheral.read_descriptor.service_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "peripheral.read_descriptor.characteristic_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "peripheral.read_descriptor.descriptor_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandServerReadDescriptorValue, buf);
    }
    peripheralDescriptorWrite(params) {
        const schema = [
            {
                path: "peripheral.write_descriptor.service_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "peripheral.write_descriptor.characteristic_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            {
                path: "peripheral.write_descriptor.descriptor_uuid",
                length: 18,
                type: "uuid",
                required: true,
            },
            { path: "peripheral.write_descriptor.data", type: "dataArray" },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandServerWriteDescriptorValue, buf);
    }
    securityAuth(params) {
        const schema = [
            {
                path: "security.auth",
                type: "flag",
                length: 1,
                required: true,
                flags: this._securityAuthValues,
            },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandSecuritySetAuth, buf);
    }
    securityIndicateLevel(params) {
        const schema = [
            {
                path: "security.indicate_security_level",
                type: "char",
                length: 1,
                required: true,
            },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandSecuritySetEncryptionLevel, buf);
    }
    securityKeyType(params) {
        const schema = [
            {
                path: "security.key.type",
                type: "flag",
                length: 1,
                required: true,
                flags: this._securityKeyTypes,
            },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandSecuritySetEnableKeyTypes, buf);
    }
    securityKeySize(params) {
        const schema = [
            {
                path: "security.key.max_size",
                type: "char",
                length: 1,
                required: true,
            },
        ];
        const buf = jsonBinaryConverter_1.default.createSendBuffer(schema, params);
        this.sendCommand(this._CommandSecuritySetKeyMaxSize, buf);
    }
    clearBondingDevicesList(params) {
        const buf = new Uint8Array([]); // noting to send
        this.sendCommand(this._CommandSecurityClearBondingDevices, buf);
    }
    parseFromJson(json) {
        const module = json.ble;
        if (module === undefined) {
            return;
        }
        const schemaData = [
            {
                uri: "/request/ble/central/scan_start",
                onValid: this.centralScanStart,
            },
            { uri: "/request/ble/central/scan_stop", onValid: this.centralScanStop },
            { uri: "/request/ble/central/connect", onValid: this.centralConnect },
            {
                uri: "/request/ble/central/disconnect",
                onValid: this.centralDisconnect,
            },
            {
                uri: "/request/ble/central/service_get",
                onValid: this.centralServiceGet,
            },
            {
                uri: "/request/ble/central/characteristic_get",
                onValid: this.centralCharacteristicGet,
            },
            {
                uri: "/request/ble/central/characteristic_read",
                onValid: this.centralCharacteristicRead,
            },
            {
                uri: "/request/ble/central/characteristic_write",
                onValid: this.centralCharacteristicWrite,
            },
            {
                uri: "/request/ble/central/characteristic_register_notify",
                onValid: this.centralCharacteristicRegisterNotify,
            },
            {
                uri: "/request/ble/central/characteristic_unregister_notify",
                onValid: this.centralCharacteristicUnregisterNotify,
            },
            {
                uri: "/request/ble/central/descriptor_get",
                onValid: this.centralDescriptorGet,
            },
            {
                uri: "/request/ble/central/descriptor_read",
                onValid: this.centralDescriptorRead,
            },
            {
                uri: "/request/ble/central/descriptor_write",
                onValid: this.centralDescriptorWrite,
            },
            {
                uri: "/request/ble/peripheral/advertisement_start",
                onValid: this.peripheralAdvertisementStart,
            },
            {
                uri: "/request/ble/peripheral/advertisement_stop",
                onValid: this.peripheralAdvertisementStop,
            },
            {
                uri: "/request/ble/peripheral/service_start",
                onValid: this.peripheralServiceStart,
            },
            {
                uri: "/request/ble/peripheral/service_stop",
                onValid: this.peripheralServiceStop,
            },
            {
                uri: "/request/ble/peripheral/service_stop_all",
                onValid: this.peripheralServiceStopAll,
            },
            {
                uri: "/request/ble/peripheral/characteristic_read",
                onValid: this.peripheralCharacteristicRead,
            },
            {
                uri: "/request/ble/peripheral/characteristic_write",
                onValid: this.peripheralCharacteristicWrite,
            },
            {
                uri: "/request/ble/peripheral/characteristic_notify",
                onValid: this.peripheralCharacteristicNotify,
            },
            {
                uri: "/request/ble/peripheral/descriptor_read",
                onValid: this.peripheralDescriptorRead,
            },
            {
                uri: "/request/ble/peripheral/descriptor_write",
                onValid: this.peripheralDescriptorWrite,
            },
            {
                uri: "/request/ble/security/auth",
                onValid: this.securityAuth,
            },
            {
                uri: "/request/ble/security/indicate_security_level",
                onValid: this.securityIndicateLevel,
            },
            {
                uri: "/request/ble/security/key_type",
                onValid: this.securityKeyType,
            },
            {
                uri: "/request/ble/security/key_max_size",
                onValid: this.securityKeySize,
            },
            {
                uri: "/request/ble/security/devices_clear",
                onValid: this.clearBondingDevicesList,
            },
        ];
        schemaData.push(...this.hciCommand.schemaData());
        const res = this.validateCommandSchema(schemaData, module, "ble");
        if (res.valid === 0) {
            if (res.invalidButLike.length > 0) {
                throw new Error(res.invalidButLike[0].message);
            }
            else {
                throw new this.WSCommandNotFoundError(`[ble]unknown command`);
            }
        }
    }
    notifyFromBinary(objToSend, func, payload) {
        const funcList = {};
        funcList[this._CommandScanResults] = this.notifyFromBinaryScanResponse.bind(this);
        funcList[this._CommandConnect] = this.notifyFromBinaryConnect.bind(this);
        funcList[this._CommandServices] = this.notifyFromBinaryServices.bind(this);
        funcList[this._CommandCharacteristics] = this.notifyFromBinaryChacateristics.bind(this);
        funcList[this._CommandWriteCharacteristics] = this.notifyFromBinaryWriteChacateristics.bind(this);
        funcList[this._CommandReadCharacteristics] = this.notifyFromBinaryReadChacateristics.bind(this);
        funcList[this._CommandRegisterNotifyCharacteristic] = this.notifyFromBinaryRegisterNotifyChacateristic.bind(this);
        funcList[this._CommandUnregisterNotifyCharacteristic] = this.notifyFromBinaryUnregisterNotifyChacateristic.bind(this);
        funcList[this._CommandNotifyCharacteristic] = this.notifyFromBinaryNotifyChacateristic.bind(this);
        funcList[this._CommandDescriptors] = this.notifyFromBinaryDescriptors.bind(this);
        funcList[this._CommandWriteDescriptor] = this.notifyFromBinaryWriteDescriptor.bind(this);
        funcList[this._CommandReadDescriptor] = this.notifyFromBinaryReadDescriptor.bind(this);
        funcList[this._CommandServerNotifyConnect] = this.notifyFromBinaryServerConnectionState.bind(this);
        funcList[this._CommandServerReadCharavteristicValue] = this.notifyFromBinaryServerReadCharavteristicValue.bind(this);
        funcList[this._CommandServerWriteCharavteristicValue] = this.notifyFromBinaryServerWriteCharavteristicValue.bind(this);
        funcList[this._CommandServerNotifyReadCharavteristicValue] = this.notifyFromBinaryServerNotifyReadCharavteristicValue.bind(this);
        funcList[this._CommandServerNotifyWriteCharavteristicValue] = this.notifyFromBinaryServerNotifyWriteCharavteristicValue.bind(this);
        funcList[this._CommandServerReadDescriptorValue] = this.notifyFromBinaryServerReadDescriptorValue.bind(this);
        funcList[this._CommandServerWriteDescriptorValue] = this.notifyFromBinaryServerWriteDescriptorValue.bind(this);
        funcList[this._CommandServerNotifyReadDescriptorValue] = this.notifyFromBinaryServerNotifyReadDescriptorValue.bind(this);
        funcList[this._CommandServerNotifyWriteDescriptorValue] = this.notifyFromBinaryServerNotifyWriteDescriptorValue.bind(this);
        funcList[this.COMMAND_FUNC_ID_ERROR] = this.notifyFromBinaryError.bind(this);
        Object.assign(funcList, this.hciCommand.notifyFunctionList());
        if (funcList[func]) {
            funcList[func](objToSend, payload);
        }
    }
    notifyFromBinaryScanResponse(objToSend, payload) {
        if (payload.byteLength > 1) {
            const schema = [
                {
                    name: "event_type",
                    type: "enum",
                    length: 1,
                    enum: this._CommandScanResultsEvet,
                },
                { name: "address", type: "hex", length: 6, endianness: "little" },
                {
                    name: "device_type",
                    type: "enum",
                    length: 1,
                    enum: this._CommandScanResultsDevice,
                },
                {
                    name: "address_type",
                    type: "enum",
                    length: 1,
                    enum: this._CommandScanResultsDeviceAddress,
                },
                {
                    name: "ble_event_type",
                    type: "enum",
                    length: 1,
                    enum: this._CommandScanResultsBleEvent,
                },
                { name: "rssi", type: "signed number", length: 4 },
                { name: "adv_data", type: "dataArray", length: 31 * 2 },
                { name: "flag", type: "number", length: 4 },
                { name: "num_response", type: "number", length: 4 },
                { name: "advertise_length", type: "number", length: 1 },
                { name: "scan_response_length", type: "number", length: 1 },
            ];
            const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
            results.scan_resp = results.adv_data.slice(results.advertise_length, results.advertise_length + results.scan_response_length);
            results.adv_data = results.adv_data.slice(0, results.advertise_length);
            delete results.num_response;
            delete results.advertise_length;
            delete results.scan_response_length;
            delete results.advertise_data;
            if (results.event_type === "inquiry_result") {
                delete results.event_type;
                this._addRowForPath(objToSend, "ble.scan_result", results);
            }
            else if (results.event_type === "inquiry_complete") {
                this._addRowForPath(objToSend, "ble.scan_result_finish", true);
            }
        }
    }
    notifyFromBinaryConnect(objToSend, payload) {
        if (payload.length === 7) {
            const schema = [
                { name: "address", type: "hex", length: 6, endianness: "little" },
                {
                    name: "status",
                    type: "enum",
                    length: 1,
                    enum: { connected: 0, disconnected: 1 },
                },
            ];
            const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
            this._addRowForPath(objToSend, "ble.status_update", results);
        }
    }
    notifyFromBinaryServices(objToSend, payload) {
        const schema = [
            { name: "address", type: "hex", length: 6, endianness: "little" },
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        if (results.service_uuid !== null) {
            this._addRowForPath(objToSend, "ble.get_service_result", results);
        }
        else {
            delete results.service_uuid;
            this._addRowForPath(objToSend, "ble.get_service_result_finish", results);
        }
    }
    notifyFromBinaryChacateristics(objToSend, payload) {
        const schema = [
            { name: "address", type: "hex", length: 6, endianness: "little" },
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
            {
                name: "properties",
                type: "enum",
                length: 1,
                enum: this._CommandCharacteristicsProperties,
                flags: true,
            },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        if (results.characteristic_uuid !== null) {
            this._addRowForPath(objToSend, "ble.get_characteristic_result", results);
        }
        else {
            delete results.characteristic_uuid;
            delete results.properties;
            this._addRowForPath(objToSend, "ble.get_characteristic_result_finish", results);
        }
    }
    notifyFromBinaryReadChacateristics(objToSend, payload) {
        const schema = [
            { name: "address", type: "hex", length: 6, endianness: "little" },
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
            { name: "result", type: "int", length: 1 },
            { name: "data", type: "dataArray", length: null },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        results.result =
            results.result === this._commandResults.success ? "success" : "failed";
        this._addRowForPath(objToSend, "ble.read_characteristic_result", results);
    }
    notifyFromBinaryWriteChacateristics(objToSend, payload) {
        const schema = [
            { name: "address", type: "hex", length: 6, endianness: "little" },
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
            { name: "result", type: "int", length: 1 },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        results.result =
            results.result === this._commandResults.success ? "success" : "failed";
        this._addRowForPath(objToSend, "ble.write_characteristic_result", results);
    }
    notifyFromBinaryRegisterNotifyChacateristic(objToSend, payload) {
        const schema = [
            { name: "address", type: "hex", length: 6, endianness: "little" },
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
            { name: "result", type: "int", length: 1 },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        results.result =
            results.result === this._commandResults.success ? "success" : "failed";
        this._addRowForPath(objToSend, "ble.register_notify_characteristic_result", results);
    }
    notifyFromBinaryUnregisterNotifyChacateristic(objToSend, payload) {
        const schema = [
            { name: "address", type: "hex", length: 6, endianness: "little" },
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
            { name: "result", type: "int", length: 1 },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        results.result =
            results.result === this._commandResults.success ? "success" : "failed";
        this._addRowForPath(objToSend, "ble.unregister_notify_characteristic_result", results);
    }
    notifyFromBinaryNotifyChacateristic(objToSend, payload) {
        const schema = [
            { name: "address", type: "hex", length: 6, endianness: "little" },
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
            { name: "is_notify", type: "int", length: 1 },
            { name: "data", type: "dataArray", length: null },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        results.is_notify = results.is_notify === 1;
        this._addRowForPath(objToSend, "ble.notify_characteristic", results);
    }
    notifyFromBinaryDescriptors(objToSend, payload) {
        const schema = [
            { name: "address", type: "hex", length: 6, endianness: "little" },
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
            { name: "descriptor_uuid", type: "uuid", length: this.uuidLength },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        if (results.descriptor_uuid !== null) {
            this._addRowForPath(objToSend, "ble.get_descriptor_result", results);
        }
        else {
            delete results.descriptor_uuid;
            this._addRowForPath(objToSend, "ble.get_descriptor_result_finish", results);
        }
    }
    notifyFromBinaryReadDescriptor(objToSend, payload) {
        const schema = [
            { name: "address", type: "hex", length: 6, endianness: "little" },
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
            { name: "descriptor_uuid", type: "uuid", length: this.uuidLength },
            { name: "result", type: "int", length: 1 },
            { name: "data", type: "dataArray", length: null },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        results.result =
            results.result === this._commandResults.success ? "success" : "failed";
        this._addRowForPath(objToSend, "ble.read_descriptor_result", results);
    }
    notifyFromBinaryWriteDescriptor(objToSend, payload) {
        const schema = [
            { name: "address", type: "hex", length: 6, endianness: "little" },
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
            { name: "descriptor_uuid", type: "uuid", length: this.uuidLength },
            { name: "result", type: "int", length: 1 },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        results.result =
            results.result === this._commandResults.success ? "success" : "failed";
        this._addRowForPath(objToSend, "ble.write_descriptor_result", results);
    }
    notifyFromBinaryServerConnectionState(objToSend, payload) {
        const schema = [
            { name: "address", type: "hex", length: 6, endianness: "little" },
            {
                name: "status",
                type: "enum",
                length: 1,
                enum: { connected: 1, disconnected: 0 },
            },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        this._addRowForPath(objToSend, "ble.peripheral.connection_status", results);
    }
    notifyFromBinaryServerWriteCharavteristicValue(objToSend, payload) {
        const schema = [
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
            { name: "result", type: "int", length: 1 },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        results.result =
            results.result === this._commandResults.success ? "success" : "failed";
        this._addRowForPath(objToSend, "ble.peripheral.write_characteristic_result", results);
    }
    notifyFromBinaryServerReadCharavteristicValue(objToSend, payload) {
        const schema = [
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
            { name: "data", type: "dataArray", length: null },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        results.result = "success"; // always success
        this._addRowForPath(objToSend, "ble.peripheral.read_characteristic_result", results);
    }
    notifyFromBinaryServerNotifyReadCharavteristicValue(objToSend, payload) {
        const schema = [
            { name: "address", type: "hex", length: 6, endianness: "little" },
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        this._addRowForPath(objToSend, "ble.peripheral.notify_read_characteristic", results);
    }
    notifyFromBinaryServerNotifyWriteCharavteristicValue(objToSend, payload) {
        const schema = [
            { name: "address", type: "hex", length: 6, endianness: "little" },
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
            { name: "data", type: "dataArray", length: null },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        this._addRowForPath(objToSend, "ble.peripheral.notify_write_characteristic", results);
    }
    notifyFromBinaryServerReadDescriptorValue(objToSend, payload) {
        const schema = [
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
            { name: "descriptor_uuid", type: "uuid", length: this.uuidLength },
            { name: "data", type: "dataArray", length: null },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        results.result = "success"; // always success
        this._addRowForPath(objToSend, "ble.peripheral.read_descriptor_result", results);
    }
    notifyFromBinaryServerWriteDescriptorValue(objToSend, payload) {
        const schema = [
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
            { name: "descriptor_uuid", type: "uuid", length: this.uuidLength },
            { name: "result", type: "int", length: 1 },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        results.result =
            results.result === this._commandResults.success ? "success" : "failed";
        this._addRowForPath(objToSend, "ble.peripheral.write_descriptor_result", results);
    }
    notifyFromBinaryServerNotifyReadDescriptorValue(objToSend, payload) {
        const schema = [
            { name: "address", type: "hex", length: 6, endianness: "little" },
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
            { name: "descriptor_uuid", type: "uuid", length: this.uuidLength },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        this._addRowForPath(objToSend, "ble.peripheral.notify_read_descriptor", results);
    }
    notifyFromBinaryServerNotifyWriteDescriptorValue(objToSend, payload) {
        const schema = [
            { name: "address", type: "hex", length: 6, endianness: "little" },
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
            { name: "descriptor_uuid", type: "uuid", length: this.uuidLength },
            { name: "data", type: "dataArray", length: null },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        this._addRowForPath(objToSend, "ble.peripheral.notify_write_descriptor", results);
    }
    notifyFromBinaryError(objToSend, payload) {
        const schema = [
            { name: "module_error_code", type: "char", length: 1 },
            { name: "error_code", type: "char", length: 1 },
            { name: "function_code", type: "char", length: 1 },
            { name: "address", type: "hex", length: 6, endianness: "little" },
            { name: "service_uuid", type: "uuid", length: this.uuidLength },
            { name: "characteristic_uuid", type: "uuid", length: this.uuidLength },
            { name: "descriptor_uuid", type: "uuid", length: this.uuidLength },
        ];
        const results = jsonBinaryConverter_1.default.convertFromBinaryToJson(schema, payload);
        const errorMessage = {
            0x00: "no error",
            0x01: "device not connected",
            0x02: "service not found",
            0x03: "charavteristic not found",
            0x04: "descriptor not found",
            0x05: "no permission",
            0x06: "device not found",
            0x07: "ble is busy",
            0x08: "service already running",
            0x09: "security param are already set",
            0xff: "error",
        };
        const functionMessage = {
            0: "on setting advertisement data",
            1: "on setting scan response data",
            2: "on starting advertisement",
            3: "on stopping advertisement",
            4: "on starting scan",
            5: "on stoping scan",
            6: "",
            7: "on connecting device",
            8: "on getting services",
            9: "on getting characteristic",
            10: "on writing characteristic",
            11: "on reading characteristic",
            14: "on getting descriptor",
            15: "on writing descriptor",
            16: "on reading descriptor",
            20: "on start pheripheral",
            21: "on notify connect",
            22: "on adding service",
            23: "on adding characteristic",
            24: "on adding descriptor",
            25: "on writing characteristic",
            26: "on reading characteristic",
            27: "on writing characteristic from remote",
            28: "on reading characteristic from remote",
            29: "on writing descriptor",
            30: "on reading descriptor",
            31: "on writing descriptor from remote",
            32: "on reading descriptor from remote",
            33: "on notify characteristic",
            34: "on start/stop service",
            35: "on set security auth param",
            36: "on set security encryption level param",
            37: "on set security key type param",
            38: "on set security key size param",
            39: "on set security io capability",
            40: "on clear bonding devices list",
        };
        results.message =
            errorMessage[results.error_code] +
                " " +
                functionMessage[results.function_code];
        this.envelopError(objToSend, "ble", results);
    }
    _addRowForPath(sendObj, path, row) {
        const keys = path.split(".");
        let target = sendObj;
        for (let index = 0; index < keys.length - 1; index++) {
            target[keys[index]] = target[keys[index]] || {};
            target = target[keys[index]];
        }
        target[keys[keys.length - 1]] = row;
    }
}
exports.default = WSCommandBle;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL3dzY29tbWFuZC9XU0NvbW1hbmRCbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnRkFBd0Q7QUFDeEQsNERBQW9DO0FBQ3BDLHdFQUFnRDtBQUVoRCxNQUFNLFlBQWEsU0FBUSxtQkFBUztJQTREbEM7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWpCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUV6QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLDRCQUE0QixHQUFHLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsMkJBQTJCLEdBQUcsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxvQ0FBb0MsR0FBRyxFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLHNDQUFzQyxHQUFHLEVBQUUsQ0FBQztRQUNqRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsNEJBQTRCLEdBQUcsRUFBRSxDQUFDO1FBRXZDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLDZCQUE2QixHQUFHLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsMkJBQTJCLEdBQUcsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLCtCQUErQixHQUFHLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsMkJBQTJCLEdBQUcsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxzQ0FBc0MsR0FBRyxFQUFFLENBQUM7UUFDakQsSUFBSSxDQUFDLHFDQUFxQyxHQUFHLEVBQUUsQ0FBQztRQUNoRCxJQUFJLENBQUMsNENBQTRDLEdBQUcsRUFBRSxDQUFDO1FBQ3ZELElBQUksQ0FBQywyQ0FBMkMsR0FBRyxFQUFFLENBQUM7UUFDdEQsSUFBSSxDQUFDLGtDQUFrQyxHQUFHLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsaUNBQWlDLEdBQUcsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyx3Q0FBd0MsR0FBRyxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLHVDQUF1QyxHQUFHLEVBQUUsQ0FBQztRQUNsRCxJQUFJLENBQUMsa0NBQWtDLEdBQUcsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyw4QkFBOEIsR0FBRyxFQUFFLENBQUM7UUFFekMsSUFBSSxDQUFDLHVCQUF1QixHQUFHLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsa0NBQWtDLEdBQUcsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxpQ0FBaUMsR0FBRyxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLDZCQUE2QixHQUFHLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsK0JBQStCLEdBQUcsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxtQ0FBbUMsR0FBRyxFQUFFLENBQUM7UUFFOUMsSUFBSSxDQUFDLHlCQUF5QixHQUFHO1lBQy9CLE1BQU0sRUFBRSxJQUFJO1lBQ1osR0FBRyxFQUFFLElBQUk7WUFDVCxJQUFJLEVBQUUsSUFBSTtTQUNYLENBQUM7UUFFRiwyQkFBMkI7UUFDM0IsSUFBSSxDQUFDLGdDQUFnQyxHQUFHO1lBQ3RDLE1BQU0sRUFBRSxJQUFJO1lBQ1osTUFBTSxFQUFFLElBQUk7WUFDWixVQUFVLEVBQUUsSUFBSTtZQUNoQixVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFDO1FBRUYsSUFBSSxDQUFDLHVCQUF1QixHQUFHO1lBQzdCLGNBQWMsRUFBRSxDQUFDLENBQUMseUNBQXlDO1lBQzNELGdCQUFnQixFQUFFLENBQUMsQ0FBQyx5QkFBeUI7WUFDN0MsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLDJDQUEyQztZQUMvRCxvQkFBb0IsRUFBRSxDQUFDLENBQUMscUVBQXFFO1lBQzdGLGtCQUFrQixFQUFFLENBQUMsQ0FBQywyQkFBMkI7WUFDakQscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLDJCQUEyQjtZQUNwRCxTQUFTLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QjtTQUN0QyxDQUFDO1FBRUYsSUFBSSxDQUFDLDJCQUEyQixHQUFHO1lBQ2pDLHdCQUF3QixFQUFFLElBQUksQ0FBQyxvREFBb0Q7WUFDbkYsaUNBQWlDLEVBQUUsSUFBSSxDQUFDLHlEQUF5RDtZQUNqRyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsdURBQXVEO1lBQ25GLDJCQUEyQixFQUFFLElBQUksQ0FBQyxnRUFBZ0U7WUFDbEcsYUFBYSxFQUFFLElBQUksQ0FBQyxnQ0FBZ0M7U0FDckQsQ0FBQztRQUVGLElBQUksQ0FBQyxpQ0FBaUMsR0FBRztZQUN2QyxTQUFTLEVBQUUsSUFBSTtZQUNmLElBQUksRUFBRSxJQUFJO1lBQ1Ysc0JBQXNCLEVBQUUsSUFBSTtZQUM1QixLQUFLLEVBQUUsSUFBSTtZQUNYLE1BQU0sRUFBRSxJQUFJO1lBQ1osUUFBUSxFQUFFLElBQUk7WUFDZCxJQUFJLEVBQUUsSUFBSTtZQUNWLG1CQUFtQixFQUFFLElBQUk7U0FDMUIsQ0FBQztRQUVGLElBQUksQ0FBQyxlQUFlLEdBQUc7WUFDckIsT0FBTyxFQUFFLENBQUM7WUFDVixNQUFNLEVBQUUsQ0FBQztTQUNWLENBQUM7UUFFRixJQUFJLENBQUMsbUJBQW1CLEdBQUc7WUFDekIsSUFBSSxFQUFFLFNBQVM7WUFDZixJQUFJLEVBQUUsTUFBTTtZQUNaLElBQUksRUFBRSxtQkFBbUI7U0FDMUIsQ0FBQztRQUNGLElBQUksQ0FBQyx5QkFBeUIsR0FBRztZQUMvQixJQUFJLEVBQUUsSUFBSTtZQUNWLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLElBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQztRQUVGLElBQUksQ0FBQyxpQkFBaUIsR0FBRztZQUN2QixJQUFJLEVBQUUsS0FBSztZQUNYLElBQUksRUFBRSxLQUFLO1lBQ1gsSUFBSSxFQUFFLE1BQU07U0FDYixDQUFDO1FBRUYsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHlCQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELGVBQWU7SUFFUixnQkFBZ0IsQ0FBQyxNQUFXO1FBQ2pDLE1BQU0sTUFBTSxHQUFRO1lBQ2xCLEVBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBQztTQUM3RCxDQUFDO1FBQ0YsTUFBTSxHQUFHLEdBQVEsNkJBQW1CLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFTSxlQUFlLENBQUMsTUFBVztRQUNoQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0sY0FBYyxDQUFDLE1BQVc7UUFDL0IsTUFBTSxNQUFNLEdBQVE7WUFDbEI7Z0JBQ0UsSUFBSSxFQUFFLGlCQUFpQjtnQkFDdkIsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsVUFBVSxFQUFFLFFBQVE7YUFDckI7WUFDRCxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUM7U0FDdEQsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUFRLDZCQUFtQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVNLGlCQUFpQixDQUFDLE1BQVc7UUFDbEMsTUFBTSxNQUFNLEdBQVE7WUFDbEI7Z0JBQ0UsSUFBSSxFQUFFLG9CQUFvQjtnQkFDMUIsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsVUFBVSxFQUFFLFFBQVE7YUFDckI7WUFDRCxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUM7U0FDckQsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUFRLDZCQUFtQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVNLGlCQUFpQixDQUFDLE1BQVc7UUFDbEMsTUFBTSxNQUFNLEdBQVE7WUFDbEI7Z0JBQ0UsSUFBSSxFQUFFLHNCQUFzQjtnQkFDNUIsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsVUFBVSxFQUFFLFFBQVE7YUFDckI7U0FDRixDQUFDO1FBQ0YsTUFBTSxHQUFHLEdBQVEsNkJBQW1CLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTSx3QkFBd0IsQ0FBQyxNQUFXO1FBQ3pDLE1BQU0sTUFBTSxHQUFRO1lBQ2xCO2dCQUNFLElBQUksRUFBRSw2QkFBNkI7Z0JBQ25DLE1BQU0sRUFBRSxDQUFDO2dCQUNULElBQUksRUFBRSxLQUFLO2dCQUNYLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFVBQVUsRUFBRSxRQUFRO2FBQ3JCO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLGtDQUFrQztnQkFDeEMsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLElBQUk7YUFDZjtTQUNGLENBQUM7UUFDRixNQUFNLEdBQUcsR0FBUSw2QkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVNLHlCQUF5QixDQUFDLE1BQVc7UUFDMUMsTUFBTSxNQUFNLEdBQVE7WUFDbEI7Z0JBQ0UsSUFBSSxFQUFFLDZCQUE2QjtnQkFDbkMsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsVUFBVSxFQUFFLFFBQVE7YUFDckI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsa0NBQWtDO2dCQUN4QyxNQUFNLEVBQUUsRUFBRTtnQkFDVixJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLHlDQUF5QztnQkFDL0MsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLElBQUk7YUFDZjtTQUNGLENBQUM7UUFDRixNQUFNLEdBQUcsR0FBUSw2QkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVNLDBCQUEwQixDQUFDLE1BQVc7UUFDM0MsTUFBTSxNQUFNLEdBQVE7WUFDbEI7Z0JBQ0UsSUFBSSxFQUFFLDhCQUE4QjtnQkFDcEMsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsVUFBVSxFQUFFLFFBQVE7YUFDckI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsbUNBQW1DO2dCQUN6QyxNQUFNLEVBQUUsRUFBRTtnQkFDVixJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLDBDQUEwQztnQkFDaEQsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLElBQUksRUFBRSxtQ0FBbUM7Z0JBQ3pDLE1BQU0sRUFBRSxDQUFDO2dCQUNULElBQUksRUFBRSxNQUFNO2dCQUNaLE9BQU8sRUFBRSxDQUFDO2FBQ1g7WUFDRCxFQUFDLElBQUksRUFBRSwyQkFBMkIsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUM7U0FDckUsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUFRLDZCQUFtQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRU0sbUNBQW1DLENBQUMsTUFBVztRQUNwRCxNQUFNLE1BQU0sR0FBUTtZQUNsQjtnQkFDRSxJQUFJLEVBQUUsd0NBQXdDO2dCQUM5QyxNQUFNLEVBQUUsQ0FBQztnQkFDVCxJQUFJLEVBQUUsS0FBSztnQkFDWCxRQUFRLEVBQUUsSUFBSTtnQkFDZCxVQUFVLEVBQUUsUUFBUTthQUNyQjtZQUNEO2dCQUNFLElBQUksRUFBRSw2Q0FBNkM7Z0JBQ25ELE1BQU0sRUFBRSxFQUFFO2dCQUNWLElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxJQUFJLEVBQUUsb0RBQW9EO2dCQUMxRCxNQUFNLEVBQUUsRUFBRTtnQkFDVixJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsSUFBSTthQUNmO1NBQ0YsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUFRLDZCQUFtQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRU0scUNBQXFDLENBQUMsTUFBVztRQUN0RCxNQUFNLE1BQU0sR0FBUTtZQUNsQjtnQkFDRSxJQUFJLEVBQUUsMENBQTBDO2dCQUNoRCxNQUFNLEVBQUUsQ0FBQztnQkFDVCxJQUFJLEVBQUUsS0FBSztnQkFDWCxRQUFRLEVBQUUsSUFBSTtnQkFDZCxVQUFVLEVBQUUsUUFBUTthQUNyQjtZQUNEO2dCQUNFLElBQUksRUFBRSwrQ0FBK0M7Z0JBQ3JELE1BQU0sRUFBRSxFQUFFO2dCQUNWLElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxJQUFJLEVBQUUsc0RBQXNEO2dCQUM1RCxNQUFNLEVBQUUsRUFBRTtnQkFDVixJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsSUFBSTthQUNmO1NBQ0YsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUFRLDZCQUFtQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRU0sb0JBQW9CLENBQUMsTUFBVztRQUNyQyxNQUFNLE1BQU0sR0FBUTtZQUNsQjtnQkFDRSxJQUFJLEVBQUUseUJBQXlCO2dCQUMvQixNQUFNLEVBQUUsQ0FBQztnQkFDVCxJQUFJLEVBQUUsS0FBSztnQkFDWCxRQUFRLEVBQUUsSUFBSTtnQkFDZCxVQUFVLEVBQUUsUUFBUTthQUNyQjtZQUNEO2dCQUNFLElBQUksRUFBRSw4QkFBOEI7Z0JBQ3BDLE1BQU0sRUFBRSxFQUFFO2dCQUNWLElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxJQUFJLEVBQUUscUNBQXFDO2dCQUMzQyxNQUFNLEVBQUUsRUFBRTtnQkFDVixJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsSUFBSTthQUNmO1NBQ0YsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUFRLDZCQUFtQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRU0scUJBQXFCLENBQUMsTUFBVztRQUN0QyxNQUFNLE1BQU0sR0FBUTtZQUNsQjtnQkFDRSxJQUFJLEVBQUUseUJBQXlCO2dCQUMvQixNQUFNLEVBQUUsQ0FBQztnQkFDVCxJQUFJLEVBQUUsS0FBSztnQkFDWCxRQUFRLEVBQUUsSUFBSTtnQkFDZCxVQUFVLEVBQUUsUUFBUTthQUNyQjtZQUNEO2dCQUNFLElBQUksRUFBRSw4QkFBOEI7Z0JBQ3BDLE1BQU0sRUFBRSxFQUFFO2dCQUNWLElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxJQUFJLEVBQUUscUNBQXFDO2dCQUMzQyxNQUFNLEVBQUUsRUFBRTtnQkFDVixJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLGlDQUFpQztnQkFDdkMsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLElBQUk7YUFDZjtTQUNGLENBQUM7UUFDRixNQUFNLEdBQUcsR0FBUSw2QkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVNLHNCQUFzQixDQUFDLE1BQVc7UUFDdkMsTUFBTSxNQUFNLEdBQVE7WUFDbEI7Z0JBQ0UsSUFBSSxFQUFFLDBCQUEwQjtnQkFDaEMsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsVUFBVSxFQUFFLFFBQVE7YUFDckI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsK0JBQStCO2dCQUNyQyxNQUFNLEVBQUUsRUFBRTtnQkFDVixJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLHNDQUFzQztnQkFDNUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLElBQUksRUFBRSxrQ0FBa0M7Z0JBQ3hDLE1BQU0sRUFBRSxFQUFFO2dCQUNWLElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxJQUFJLEVBQUUsK0JBQStCO2dCQUNyQyxNQUFNLEVBQUUsQ0FBQztnQkFDVCxJQUFJLEVBQUUsTUFBTTtnQkFDWixPQUFPLEVBQUUsQ0FBQzthQUNYO1lBQ0QsRUFBQyxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFDO1NBQ2pFLENBQUM7UUFDRixNQUFNLEdBQUcsR0FBUSw2QkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELGtCQUFrQjtJQUVYLDRCQUE0QixDQUFDLE1BQVc7UUFDN0MsSUFBSSxDQUFDLFdBQVcsQ0FDZCxJQUFJLENBQUMsa0JBQWtCLEVBQ3ZCLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQzlDLENBQUM7UUFFRixJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxXQUFXLENBQ2QsSUFBSSxDQUFDLHVCQUF1QixFQUM1QixJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUMvQyxDQUFDO1NBQ0g7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0sMkJBQTJCLENBQUMsTUFBVztRQUM1QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVNLHNCQUFzQixDQUFDLE1BQVc7UUFDdkMsTUFBTSxHQUFHLEdBQVEsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxNQUFNLFNBQVMsR0FBUTtZQUNyQixJQUFJLEVBQUUsV0FBVztZQUNqQixJQUFJLEVBQUUsTUFBTTtZQUNaLElBQUksRUFBRSx3QkFBd0I7WUFDOUIsSUFBSSxFQUFFLE9BQU87WUFDYixJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxTQUFTO1lBQ2YsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsVUFBVTtTQUNqQixDQUFDO1FBRUYsTUFBTSxlQUFlLEdBQVE7WUFDM0IsS0FBSyxFQUFFLE1BQU07WUFDYixLQUFLLEVBQUUsZ0JBQWdCO1lBQ3ZCLEtBQUssRUFBRSxxQkFBcUI7WUFDNUIsS0FBSyxFQUFFLE9BQU87WUFDZCxLQUFLLEVBQUUsaUJBQWlCO1lBQ3hCLEtBQUssRUFBRSxzQkFBc0I7WUFDN0IsS0FBSyxFQUFFLGNBQWM7WUFDckIsS0FBSyxFQUFFLG1CQUFtQjtTQUMzQixDQUFDO1FBQ0YsTUFBTSxNQUFNLEdBQVE7WUFDbEIsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxJQUFJLENBQUMsd0JBQXdCO2dCQUN0QyxNQUFNLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQzthQUNuRTtZQUNELGNBQWMsRUFBRTtnQkFDZCxPQUFPLEVBQUUsSUFBSSxDQUFDLCtCQUErQjtnQkFDN0MsTUFBTSxFQUFFO29CQUNOLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztvQkFDaEUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO29CQUN4RDt3QkFDRSxJQUFJLEVBQUUsYUFBYTt3QkFDbkIsTUFBTSxFQUFFLENBQUM7d0JBQ1QsSUFBSSxFQUFFLE1BQU07d0JBQ1osT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQzt3QkFDMUIsS0FBSyxFQUFFLGVBQWU7cUJBQ3ZCO29CQUNEO3dCQUNFLElBQUksRUFBRSxZQUFZO3dCQUNsQixNQUFNLEVBQUUsQ0FBQzt3QkFDVCxJQUFJLEVBQUUsTUFBTTt3QkFDWixPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO3dCQUMxQixLQUFLLEVBQUUsU0FBUztxQkFDakI7b0JBQ0QsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUM7aUJBQ2xDO2FBQ0Y7WUFDRCxVQUFVLEVBQUU7Z0JBQ1YsT0FBTyxFQUFFLElBQUksQ0FBQywyQkFBMkI7Z0JBQ3pDLE1BQU0sRUFBRTtvQkFDTixFQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7b0JBQ2hFO3dCQUNFLElBQUksRUFBRSxxQkFBcUI7d0JBQzNCLE1BQU0sRUFBRSxFQUFFO3dCQUNWLElBQUksRUFBRSxNQUFNO3dCQUNaLFFBQVEsRUFBRSxJQUFJO3FCQUNmO29CQUNELEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztvQkFDeEQ7d0JBQ0UsSUFBSSxFQUFFLGFBQWE7d0JBQ25CLE1BQU0sRUFBRSxDQUFDO3dCQUNULElBQUksRUFBRSxNQUFNO3dCQUNaLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7d0JBQzFCLEtBQUssRUFBRSxlQUFlO3FCQUN2QjtvQkFDRCxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBQztpQkFDbEM7YUFDRjtZQUNELFlBQVksRUFBRTtnQkFDWixPQUFPLEVBQUUsSUFBSSxDQUFDLDhCQUE4QjtnQkFDNUMsTUFBTSxFQUFFO29CQUNOLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztvQkFDeEQsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFDO2lCQUNsRDthQUNGO1NBQ0YsQ0FBQztRQUVGLE1BQU0sUUFBUSxHQUFRLEVBQUUsQ0FBQztRQUN6QixNQUFNLGdCQUFnQixHQUFRLEVBQUUsQ0FBQztRQUNqQyxJQUFJLEdBQVEsQ0FBQztRQUNiLEtBQUssTUFBTSxZQUFZLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRTtZQUN2QyxNQUFNLE9BQU8sR0FBUSxHQUFHLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2hELEdBQUcsR0FBRyw2QkFBbUIsQ0FBQyxnQkFBZ0IsQ0FDeEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQ3JCLE9BQU8sQ0FDUixDQUFDO1lBQ0YsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDcEIsT0FBTzthQUNSO1lBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztZQUU5RCxHQUFHLEdBQUcsNkJBQW1CLENBQUMsZ0JBQWdCLENBQ3hDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUMxQixPQUFPLENBQ1IsQ0FBQztZQUNGLGdCQUFnQixDQUFDLElBQUksQ0FBQztnQkFDcEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTztnQkFDcEMsTUFBTSxFQUFFLEdBQUc7YUFDWixDQUFDLENBQUM7WUFFSCxLQUFLLE1BQU0sVUFBVSxJQUFJLE9BQU8sQ0FBQyxlQUFlLEVBQUU7Z0JBQ2hELE1BQU0sS0FBSyxHQUFRLE9BQU8sQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3ZELEtBQUssQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDbEMsR0FBRyxHQUFHLDZCQUFtQixDQUFDLGdCQUFnQixDQUN4QyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFDNUIsS0FBSyxDQUNOLENBQUM7Z0JBQ0YsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtvQkFDcEIsT0FBTztpQkFDUjtnQkFDRCxRQUFRLENBQUMsSUFBSSxDQUFDO29CQUNaLE9BQU8sRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU87b0JBQ3RDLE1BQU0sRUFBRSxHQUFHO2lCQUNaLENBQUMsQ0FBQztnQkFFSCxLQUFLLE1BQU0sU0FBUyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUU7b0JBQ3pDLE1BQU0sSUFBSSxHQUFRLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQy9DLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztvQkFDakMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7b0JBQ3RDLEdBQUcsR0FBRyw2QkFBbUIsQ0FBQyxnQkFBZ0IsQ0FDeEMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQ3hCLElBQUksQ0FDTCxDQUFDO29CQUNGLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7d0JBQ3BCLE9BQU87cUJBQ1I7b0JBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztpQkFDbEU7YUFDRjtTQUNGO1FBQ0QsS0FBSyxNQUFNLEtBQUssSUFBSSxRQUFRLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNuRTtRQUNELEtBQUssTUFBTSxLQUFLLElBQUksZ0JBQWdCLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFdBQVcsQ0FDZCxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLEVBQy9CLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FDL0IsQ0FBQztTQUNIO0lBQ0gsQ0FBQztJQUVNLHFCQUFxQixDQUFDLE1BQVc7UUFDdEMsTUFBTSxNQUFNLEdBQVE7WUFDbEI7Z0JBQ0UsSUFBSSxFQUFFLHNDQUFzQztnQkFDNUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNELEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQztTQUNsRCxDQUFDO1FBQ0YsTUFBTSxHQUFHLEdBQVEsNkJBQW1CLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFTSx3QkFBd0I7UUFDN0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVNLDRCQUE0QixDQUFDLE1BQVc7UUFDN0MsTUFBTSxNQUFNLEdBQVE7WUFDbEI7Z0JBQ0UsSUFBSSxFQUFFLDZDQUE2QztnQkFDbkQsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLElBQUksRUFBRSxvREFBb0Q7Z0JBQzFELE1BQU0sRUFBRSxFQUFFO2dCQUNWLElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7U0FDRixDQUFDO1FBQ0YsTUFBTSxHQUFHLEdBQVEsNkJBQW1CLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFTSw2QkFBNkIsQ0FBQyxNQUFXO1FBQzlDLE1BQU0sTUFBTSxHQUFRO1lBQ2xCO2dCQUNFLElBQUksRUFBRSw4Q0FBOEM7Z0JBQ3BELE1BQU0sRUFBRSxFQUFFO2dCQUNWLElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxJQUFJLEVBQUUscURBQXFEO2dCQUMzRCxNQUFNLEVBQUUsRUFBRTtnQkFDVixJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0QsRUFBQyxJQUFJLEVBQUUsc0NBQXNDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBQztTQUNsRSxDQUFDO1FBQ0YsTUFBTSxHQUFHLEdBQVEsNkJBQW1CLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFTSw4QkFBOEIsQ0FBQyxNQUFXO1FBQy9DLE1BQU0sTUFBTSxHQUFRO1lBQ2xCO2dCQUNFLElBQUksRUFBRSwrQ0FBK0M7Z0JBQ3JELE1BQU0sRUFBRSxFQUFFO2dCQUNWLElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxJQUFJLEVBQUUsc0RBQXNEO2dCQUM1RCxNQUFNLEVBQUUsRUFBRTtnQkFDVixJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsSUFBSTthQUNmO1NBQ0YsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUFRLDZCQUFtQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRU0sd0JBQXdCLENBQUMsTUFBVztRQUN6QyxNQUFNLE1BQU0sR0FBUTtZQUNsQjtnQkFDRSxJQUFJLEVBQUUseUNBQXlDO2dCQUMvQyxNQUFNLEVBQUUsRUFBRTtnQkFDVixJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLGdEQUFnRDtnQkFDdEQsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLElBQUksRUFBRSw0Q0FBNEM7Z0JBQ2xELE1BQU0sRUFBRSxFQUFFO2dCQUNWLElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7U0FDRixDQUFDO1FBQ0YsTUFBTSxHQUFHLEdBQVEsNkJBQW1CLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFTSx5QkFBeUIsQ0FBQyxNQUFXO1FBQzFDLE1BQU0sTUFBTSxHQUFRO1lBQ2xCO2dCQUNFLElBQUksRUFBRSwwQ0FBMEM7Z0JBQ2hELE1BQU0sRUFBRSxFQUFFO2dCQUNWLElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRDtnQkFDRSxJQUFJLEVBQUUsaURBQWlEO2dCQUN2RCxNQUFNLEVBQUUsRUFBRTtnQkFDVixJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLDZDQUE2QztnQkFDbkQsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNELEVBQUMsSUFBSSxFQUFFLGtDQUFrQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUM7U0FDOUQsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUFRLDZCQUFtQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRU0sWUFBWSxDQUFDLE1BQVc7UUFDN0IsTUFBTSxNQUFNLEdBQVE7WUFDbEI7Z0JBQ0UsSUFBSSxFQUFFLGVBQWU7Z0JBQ3JCLElBQUksRUFBRSxNQUFNO2dCQUNaLE1BQU0sRUFBRSxDQUFDO2dCQUNULFFBQVEsRUFBRSxJQUFJO2dCQUNkLEtBQUssRUFBRSxJQUFJLENBQUMsbUJBQW1CO2FBQ2hDO1NBQ0YsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUFRLDZCQUFtQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRU0scUJBQXFCLENBQUMsTUFBVztRQUN0QyxNQUFNLE1BQU0sR0FBUTtZQUNsQjtnQkFDRSxJQUFJLEVBQUUsa0NBQWtDO2dCQUN4QyxJQUFJLEVBQUUsTUFBTTtnQkFDWixNQUFNLEVBQUUsQ0FBQztnQkFDVCxRQUFRLEVBQUUsSUFBSTthQUNmO1NBQ0YsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUFRLDZCQUFtQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRU0sZUFBZSxDQUFDLE1BQVc7UUFDaEMsTUFBTSxNQUFNLEdBQVE7WUFDbEI7Z0JBQ0UsSUFBSSxFQUFFLG1CQUFtQjtnQkFDekIsSUFBSSxFQUFFLE1BQU07Z0JBQ1osTUFBTSxFQUFFLENBQUM7Z0JBQ1QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsS0FBSyxFQUFFLElBQUksQ0FBQyxpQkFBaUI7YUFDOUI7U0FDRixDQUFDO1FBQ0YsTUFBTSxHQUFHLEdBQVEsNkJBQW1CLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFTSxlQUFlLENBQUMsTUFBVztRQUNoQyxNQUFNLE1BQU0sR0FBUTtZQUNsQjtnQkFDRSxJQUFJLEVBQUUsdUJBQXVCO2dCQUM3QixJQUFJLEVBQUUsTUFBTTtnQkFDWixNQUFNLEVBQUUsQ0FBQztnQkFDVCxRQUFRLEVBQUUsSUFBSTthQUNmO1NBQ0YsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUFRLDZCQUFtQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRU0sdUJBQXVCLENBQUMsTUFBVztRQUN4QyxNQUFNLEdBQUcsR0FBUSxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtRQUN0RCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRU0sYUFBYSxDQUFDLElBQVM7UUFDNUIsTUFBTSxNQUFNLEdBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUM3QixJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDeEIsT0FBTztTQUNSO1FBQ0QsTUFBTSxVQUFVLEdBQVE7WUFDdEI7Z0JBQ0UsR0FBRyxFQUFFLGlDQUFpQztnQkFDdEMsT0FBTyxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7YUFDL0I7WUFDRCxFQUFDLEdBQUcsRUFBRSxnQ0FBZ0MsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBQztZQUN0RSxFQUFDLEdBQUcsRUFBRSw4QkFBOEIsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBQztZQUNuRTtnQkFDRSxHQUFHLEVBQUUsaUNBQWlDO2dCQUN0QyxPQUFPLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjthQUNoQztZQUNEO2dCQUNFLEdBQUcsRUFBRSxrQ0FBa0M7Z0JBQ3ZDLE9BQU8sRUFBRSxJQUFJLENBQUMsaUJBQWlCO2FBQ2hDO1lBQ0Q7Z0JBQ0UsR0FBRyxFQUFFLHlDQUF5QztnQkFDOUMsT0FBTyxFQUFFLElBQUksQ0FBQyx3QkFBd0I7YUFDdkM7WUFDRDtnQkFDRSxHQUFHLEVBQUUsMENBQTBDO2dCQUMvQyxPQUFPLEVBQUUsSUFBSSxDQUFDLHlCQUF5QjthQUN4QztZQUNEO2dCQUNFLEdBQUcsRUFBRSwyQ0FBMkM7Z0JBQ2hELE9BQU8sRUFBRSxJQUFJLENBQUMsMEJBQTBCO2FBQ3pDO1lBQ0Q7Z0JBQ0UsR0FBRyxFQUFFLHFEQUFxRDtnQkFDMUQsT0FBTyxFQUFFLElBQUksQ0FBQyxtQ0FBbUM7YUFDbEQ7WUFDRDtnQkFDRSxHQUFHLEVBQUUsdURBQXVEO2dCQUM1RCxPQUFPLEVBQUUsSUFBSSxDQUFDLHFDQUFxQzthQUNwRDtZQUNEO2dCQUNFLEdBQUcsRUFBRSxxQ0FBcUM7Z0JBQzFDLE9BQU8sRUFBRSxJQUFJLENBQUMsb0JBQW9CO2FBQ25DO1lBQ0Q7Z0JBQ0UsR0FBRyxFQUFFLHNDQUFzQztnQkFDM0MsT0FBTyxFQUFFLElBQUksQ0FBQyxxQkFBcUI7YUFDcEM7WUFDRDtnQkFDRSxHQUFHLEVBQUUsdUNBQXVDO2dCQUM1QyxPQUFPLEVBQUUsSUFBSSxDQUFDLHNCQUFzQjthQUNyQztZQUNEO2dCQUNFLEdBQUcsRUFBRSw2Q0FBNkM7Z0JBQ2xELE9BQU8sRUFBRSxJQUFJLENBQUMsNEJBQTRCO2FBQzNDO1lBQ0Q7Z0JBQ0UsR0FBRyxFQUFFLDRDQUE0QztnQkFDakQsT0FBTyxFQUFFLElBQUksQ0FBQywyQkFBMkI7YUFDMUM7WUFDRDtnQkFDRSxHQUFHLEVBQUUsdUNBQXVDO2dCQUM1QyxPQUFPLEVBQUUsSUFBSSxDQUFDLHNCQUFzQjthQUNyQztZQUNEO2dCQUNFLEdBQUcsRUFBRSxzQ0FBc0M7Z0JBQzNDLE9BQU8sRUFBRSxJQUFJLENBQUMscUJBQXFCO2FBQ3BDO1lBQ0Q7Z0JBQ0UsR0FBRyxFQUFFLDBDQUEwQztnQkFDL0MsT0FBTyxFQUFFLElBQUksQ0FBQyx3QkFBd0I7YUFDdkM7WUFDRDtnQkFDRSxHQUFHLEVBQUUsNkNBQTZDO2dCQUNsRCxPQUFPLEVBQUUsSUFBSSxDQUFDLDRCQUE0QjthQUMzQztZQUNEO2dCQUNFLEdBQUcsRUFBRSw4Q0FBOEM7Z0JBQ25ELE9BQU8sRUFBRSxJQUFJLENBQUMsNkJBQTZCO2FBQzVDO1lBQ0Q7Z0JBQ0UsR0FBRyxFQUFFLCtDQUErQztnQkFDcEQsT0FBTyxFQUFFLElBQUksQ0FBQyw4QkFBOEI7YUFDN0M7WUFDRDtnQkFDRSxHQUFHLEVBQUUseUNBQXlDO2dCQUM5QyxPQUFPLEVBQUUsSUFBSSxDQUFDLHdCQUF3QjthQUN2QztZQUNEO2dCQUNFLEdBQUcsRUFBRSwwQ0FBMEM7Z0JBQy9DLE9BQU8sRUFBRSxJQUFJLENBQUMseUJBQXlCO2FBQ3hDO1lBQ0Q7Z0JBQ0UsR0FBRyxFQUFFLDRCQUE0QjtnQkFDakMsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZO2FBQzNCO1lBQ0Q7Z0JBQ0UsR0FBRyxFQUFFLCtDQUErQztnQkFDcEQsT0FBTyxFQUFFLElBQUksQ0FBQyxxQkFBcUI7YUFDcEM7WUFDRDtnQkFDRSxHQUFHLEVBQUUsZ0NBQWdDO2dCQUNyQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWU7YUFDOUI7WUFDRDtnQkFDRSxHQUFHLEVBQUUsb0NBQW9DO2dCQUN6QyxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWU7YUFDOUI7WUFDRDtnQkFDRSxHQUFHLEVBQUUscUNBQXFDO2dCQUMxQyxPQUFPLEVBQUUsSUFBSSxDQUFDLHVCQUF1QjthQUN0QztTQUNGLENBQUM7UUFFRixVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sR0FBRyxHQUFRLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZFLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDbkIsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUNoRDtpQkFBTTtnQkFDTCxNQUFNLElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLHNCQUFzQixDQUFDLENBQUM7YUFDL0Q7U0FDRjtJQUNILENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxTQUFjLEVBQUUsSUFBUyxFQUFFLE9BQVk7UUFDN0QsTUFBTSxRQUFRLEdBQVEsRUFBRSxDQUFDO1FBQ3pCLFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUN6RSxJQUFJLENBQ0wsQ0FBQztRQUNGLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6RSxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRSxRQUFRLENBQ04sSUFBSSxDQUFDLHVCQUF1QixDQUMzQixHQUFHLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsUUFBUSxDQUNOLElBQUksQ0FBQyw0QkFBNEIsQ0FDaEMsR0FBRyxJQUFJLENBQUMsbUNBQW1DLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFELFFBQVEsQ0FDTixJQUFJLENBQUMsMkJBQTJCLENBQy9CLEdBQUcsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6RCxRQUFRLENBQ04sSUFBSSxDQUFDLG9DQUFvQyxDQUN4QyxHQUFHLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEUsUUFBUSxDQUNOLElBQUksQ0FBQyxzQ0FBc0MsQ0FDMUMsR0FBRyxJQUFJLENBQUMsNkNBQTZDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BFLFFBQVEsQ0FDTixJQUFJLENBQUMsNEJBQTRCLENBQ2hDLEdBQUcsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRCxRQUFRLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FDeEUsSUFBSSxDQUNMLENBQUM7UUFDRixRQUFRLENBQ04sSUFBSSxDQUFDLHVCQUF1QixDQUMzQixHQUFHLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEQsUUFBUSxDQUNOLElBQUksQ0FBQyxzQkFBc0IsQ0FDMUIsR0FBRyxJQUFJLENBQUMsOEJBQThCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJELFFBQVEsQ0FDTixJQUFJLENBQUMsMkJBQTJCLENBQy9CLEdBQUcsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1RCxRQUFRLENBQ04sSUFBSSxDQUFDLHFDQUFxQyxDQUN6QyxHQUFHLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEUsUUFBUSxDQUNOLElBQUksQ0FBQyxzQ0FBc0MsQ0FDMUMsR0FBRyxJQUFJLENBQUMsOENBQThDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JFLFFBQVEsQ0FDTixJQUFJLENBQUMsMkNBQTJDLENBQy9DLEdBQUcsSUFBSSxDQUFDLG1EQUFtRCxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRSxRQUFRLENBQ04sSUFBSSxDQUFDLDRDQUE0QyxDQUNoRCxHQUFHLElBQUksQ0FBQyxvREFBb0QsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0UsUUFBUSxDQUNOLElBQUksQ0FBQyxpQ0FBaUMsQ0FDckMsR0FBRyxJQUFJLENBQUMseUNBQXlDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hFLFFBQVEsQ0FDTixJQUFJLENBQUMsa0NBQWtDLENBQ3RDLEdBQUcsSUFBSSxDQUFDLDBDQUEwQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRSxRQUFRLENBQ04sSUFBSSxDQUFDLHVDQUF1QyxDQUMzQyxHQUFHLElBQUksQ0FBQywrQ0FBK0MsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEUsUUFBUSxDQUNOLElBQUksQ0FBQyx3Q0FBd0MsQ0FDNUMsR0FBRyxJQUFJLENBQUMsZ0RBQWdELENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZFLFFBQVEsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUNwRSxJQUFJLENBQ0wsQ0FBQztRQUVGLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO1FBRTlELElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2xCLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDcEM7SUFDSCxDQUFDO0lBRU0sNEJBQTRCLENBQUMsU0FBYyxFQUFFLE9BQWE7UUFDL0QsSUFBSSxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRTtZQUMxQixNQUFNLE1BQU0sR0FBUTtnQkFDbEI7b0JBQ0UsSUFBSSxFQUFFLFlBQVk7b0JBQ2xCLElBQUksRUFBRSxNQUFNO29CQUNaLE1BQU0sRUFBRSxDQUFDO29CQUNULElBQUksRUFBRSxJQUFJLENBQUMsdUJBQXVCO2lCQUNuQztnQkFDRCxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUM7Z0JBQy9EO29CQUNFLElBQUksRUFBRSxhQUFhO29CQUNuQixJQUFJLEVBQUUsTUFBTTtvQkFDWixNQUFNLEVBQUUsQ0FBQztvQkFDVCxJQUFJLEVBQUUsSUFBSSxDQUFDLHlCQUF5QjtpQkFDckM7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLGNBQWM7b0JBQ3BCLElBQUksRUFBRSxNQUFNO29CQUNaLE1BQU0sRUFBRSxDQUFDO29CQUNULElBQUksRUFBRSxJQUFJLENBQUMsZ0NBQWdDO2lCQUM1QztnQkFDRDtvQkFDRSxJQUFJLEVBQUUsZ0JBQWdCO29CQUN0QixJQUFJLEVBQUUsTUFBTTtvQkFDWixNQUFNLEVBQUUsQ0FBQztvQkFDVCxJQUFJLEVBQUUsSUFBSSxDQUFDLDJCQUEyQjtpQkFDdkM7Z0JBQ0QsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztnQkFDaEQsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUM7Z0JBQ3JELEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUM7Z0JBQ3pDLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUM7Z0JBQ2pELEVBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztnQkFDckQsRUFBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO2FBQzFELENBQUM7WUFFRixNQUFNLE9BQU8sR0FBUSw2QkFBbUIsQ0FBQyx1QkFBdUIsQ0FDOUQsTUFBTSxFQUNOLE9BQU8sQ0FDUixDQUFDO1lBRUYsT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FDeEMsT0FBTyxDQUFDLGdCQUFnQixFQUN4QixPQUFPLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUN4RCxDQUFDO1lBQ0YsT0FBTyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFdkUsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDO1lBQzVCLE9BQU8sT0FBTyxDQUFDLGdCQUFnQixDQUFDO1lBQ2hDLE9BQU8sT0FBTyxDQUFDLG9CQUFvQixDQUFDO1lBQ3BDLE9BQU8sT0FBTyxDQUFDLGNBQWMsQ0FBQztZQUU5QixJQUFJLE9BQU8sQ0FBQyxVQUFVLEtBQUssZ0JBQWdCLEVBQUU7Z0JBQzNDLE9BQU8sT0FBTyxDQUFDLFVBQVUsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDNUQ7aUJBQU0sSUFBSSxPQUFPLENBQUMsVUFBVSxLQUFLLGtCQUFrQixFQUFFO2dCQUNwRCxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSx3QkFBd0IsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNoRTtTQUNGO0lBQ0gsQ0FBQztJQUVNLHVCQUF1QixDQUFDLFNBQWMsRUFBRSxPQUFhO1FBQzFELElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDeEIsTUFBTSxNQUFNLEdBQVE7Z0JBQ2xCLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQztnQkFDL0Q7b0JBQ0UsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsSUFBSSxFQUFFLE1BQU07b0JBQ1osTUFBTSxFQUFFLENBQUM7b0JBQ1QsSUFBSSxFQUFFLEVBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFDO2lCQUN0QzthQUNGLENBQUM7WUFFRixNQUFNLE9BQU8sR0FBUSw2QkFBbUIsQ0FBQyx1QkFBdUIsQ0FDOUQsTUFBTSxFQUNOLE9BQU8sQ0FDUixDQUFDO1lBQ0YsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDOUQ7SUFDSCxDQUFDO0lBRU0sd0JBQXdCLENBQUMsU0FBYyxFQUFFLE9BQWE7UUFDM0QsTUFBTSxNQUFNLEdBQVE7WUFDbEIsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFDO1lBQy9ELEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO1NBQzlELENBQUM7UUFFRixNQUFNLE9BQU8sR0FBUSw2QkFBbUIsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFbEYsSUFBSSxPQUFPLENBQUMsWUFBWSxLQUFLLElBQUksRUFBRTtZQUNqQyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSx3QkFBd0IsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUNuRTthQUFNO1lBQ0wsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDO1lBQzVCLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLCtCQUErQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzFFO0lBQ0gsQ0FBQztJQUVNLDhCQUE4QixDQUFDLFNBQWMsRUFBRSxPQUFhO1FBQ2pFLE1BQU0sTUFBTSxHQUFRO1lBQ2xCLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQztZQUMvRCxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBQztZQUM3RCxFQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO1lBQ3BFO2dCQUNFLElBQUksRUFBRSxZQUFZO2dCQUNsQixJQUFJLEVBQUUsTUFBTTtnQkFDWixNQUFNLEVBQUUsQ0FBQztnQkFDVCxJQUFJLEVBQUUsSUFBSSxDQUFDLGlDQUFpQztnQkFDNUMsS0FBSyxFQUFFLElBQUk7YUFDWjtTQUNGLENBQUM7UUFFRixNQUFNLE9BQU8sR0FBUSw2QkFBbUIsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFbEYsSUFBSSxPQUFPLENBQUMsbUJBQW1CLEtBQUssSUFBSSxFQUFFO1lBQ3hDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLCtCQUErQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzFFO2FBQU07WUFDTCxPQUFPLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztZQUNuQyxPQUFPLE9BQU8sQ0FBQyxVQUFVLENBQUM7WUFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FDakIsU0FBUyxFQUNULHNDQUFzQyxFQUN0QyxPQUFPLENBQ1IsQ0FBQztTQUNIO0lBQ0gsQ0FBQztJQUVNLGtDQUFrQyxDQUFDLFNBQWMsRUFBRSxPQUFhO1FBQ3JFLE1BQU0sTUFBTSxHQUFRO1lBQ2xCLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQztZQUMvRCxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBQztZQUM3RCxFQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO1lBQ3BFLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUM7WUFDeEMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQztTQUNoRCxDQUFDO1FBRUYsTUFBTSxPQUFPLEdBQVEsNkJBQW1CLENBQUMsdUJBQXVCLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xGLE9BQU8sQ0FBQyxNQUFNO1lBQ1osT0FBTyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDekUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsZ0NBQWdDLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVNLG1DQUFtQyxDQUFDLFNBQWMsRUFBRSxPQUFhO1FBQ3RFLE1BQU0sTUFBTSxHQUFRO1lBQ2xCLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQztZQUMvRCxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBQztZQUM3RCxFQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO1lBQ3BFLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUM7U0FDekMsQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFRLDZCQUFtQixDQUFDLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRixPQUFPLENBQUMsTUFBTTtZQUNaLE9BQU8sQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQ3pFLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLGlDQUFpQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFTSwyQ0FBMkMsQ0FBQyxTQUFjLEVBQUUsT0FBYTtRQUM5RSxNQUFNLE1BQU0sR0FBUTtZQUNsQixFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUM7WUFDL0QsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUM7WUFDN0QsRUFBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBQztZQUNwRSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1NBQ3pDLENBQUM7UUFFRixNQUFNLE9BQU8sR0FBUSw2QkFBbUIsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEYsT0FBTyxDQUFDLE1BQU07WUFDWixPQUFPLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUN6RSxJQUFJLENBQUMsY0FBYyxDQUNqQixTQUFTLEVBQ1QsMkNBQTJDLEVBQzNDLE9BQU8sQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUVNLDZDQUE2QyxDQUFDLFNBQWMsRUFBRSxPQUFhO1FBQ2hGLE1BQU0sTUFBTSxHQUFRO1lBQ2xCLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQztZQUMvRCxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBQztZQUM3RCxFQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO1lBQ3BFLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUM7U0FDekMsQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFRLDZCQUFtQixDQUFDLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRixPQUFPLENBQUMsTUFBTTtZQUNaLE9BQU8sQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQ3pFLElBQUksQ0FBQyxjQUFjLENBQ2pCLFNBQVMsRUFDVCw2Q0FBNkMsRUFDN0MsT0FBTyxDQUNSLENBQUM7SUFDSixDQUFDO0lBRU0sbUNBQW1DLENBQUMsU0FBYyxFQUFFLE9BQWE7UUFDdEUsTUFBTSxNQUFNLEdBQVE7WUFDbEIsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFDO1lBQy9ELEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO1lBQzdELEVBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUM7WUFDcEUsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztZQUMzQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO1NBQ2hELENBQUM7UUFFRixNQUFNLE9BQU8sR0FBUSw2QkFBbUIsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEYsT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxLQUFLLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSwyQkFBMkIsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRU0sMkJBQTJCLENBQUMsU0FBYyxFQUFFLE9BQWE7UUFDOUQsTUFBTSxNQUFNLEdBQVE7WUFDbEIsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFDO1lBQy9ELEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO1lBQzdELEVBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUM7WUFDcEUsRUFBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBQztTQUNqRSxDQUFDO1FBRUYsTUFBTSxPQUFPLEdBQVEsNkJBQW1CLENBQUMsdUJBQXVCLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRWxGLElBQUksT0FBTyxDQUFDLGVBQWUsS0FBSyxJQUFJLEVBQUU7WUFDcEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsMkJBQTJCLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDdEU7YUFBTTtZQUNMLE9BQU8sT0FBTyxDQUFDLGVBQWUsQ0FBQztZQUMvQixJQUFJLENBQUMsY0FBYyxDQUNqQixTQUFTLEVBQ1Qsa0NBQWtDLEVBQ2xDLE9BQU8sQ0FDUixDQUFDO1NBQ0g7SUFDSCxDQUFDO0lBRU0sOEJBQThCLENBQUMsU0FBYyxFQUFFLE9BQWE7UUFDakUsTUFBTSxNQUFNLEdBQVE7WUFDbEIsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFDO1lBQy9ELEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO1lBQzdELEVBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUM7WUFDcEUsRUFBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBQztZQUNoRSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3hDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUM7U0FDaEQsQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFRLDZCQUFtQixDQUFDLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRixPQUFPLENBQUMsTUFBTTtZQUNaLE9BQU8sQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQ3pFLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLDRCQUE0QixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFTSwrQkFBK0IsQ0FBQyxTQUFjLEVBQUUsT0FBYTtRQUNsRSxNQUFNLE1BQU0sR0FBUTtZQUNsQixFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUM7WUFDL0QsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUM7WUFDN0QsRUFBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBQztZQUNwRSxFQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO1lBQ2hFLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUM7U0FDekMsQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFRLDZCQUFtQixDQUFDLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRixPQUFPLENBQUMsTUFBTTtZQUNaLE9BQU8sQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQ3pFLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLDZCQUE2QixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFTSxxQ0FBcUMsQ0FBQyxTQUFjLEVBQUUsT0FBYTtRQUN4RSxNQUFNLE1BQU0sR0FBUTtZQUNsQixFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUM7WUFDL0Q7Z0JBQ0UsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsSUFBSSxFQUFFLE1BQU07Z0JBQ1osTUFBTSxFQUFFLENBQUM7Z0JBQ1QsSUFBSSxFQUFFLEVBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFDO2FBQ3RDO1NBQ0YsQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFRLDZCQUFtQixDQUFDLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRixJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxrQ0FBa0MsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRU0sOENBQThDLENBQUMsU0FBYyxFQUFFLE9BQWE7UUFDakYsTUFBTSxNQUFNLEdBQVE7WUFDbEIsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUM7WUFDN0QsRUFBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBQztZQUNwRSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1NBQ3pDLENBQUM7UUFFRixNQUFNLE9BQU8sR0FBUSw2QkFBbUIsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEYsT0FBTyxDQUFDLE1BQU07WUFDWixPQUFPLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUN6RSxJQUFJLENBQUMsY0FBYyxDQUNqQixTQUFTLEVBQ1QsNENBQTRDLEVBQzVDLE9BQU8sQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUVNLDZDQUE2QyxDQUFDLFNBQWMsRUFBRSxPQUFhO1FBQ2hGLE1BQU0sTUFBTSxHQUFRO1lBQ2xCLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO1lBQzdELEVBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUM7WUFDcEUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQztTQUNoRCxDQUFDO1FBRUYsTUFBTSxPQUFPLEdBQVEsNkJBQW1CLENBQUMsdUJBQXVCLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xGLE9BQU8sQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsaUJBQWlCO1FBQzdDLElBQUksQ0FBQyxjQUFjLENBQ2pCLFNBQVMsRUFDVCwyQ0FBMkMsRUFDM0MsT0FBTyxDQUNSLENBQUM7SUFDSixDQUFDO0lBRU0sbURBQW1ELENBQUMsU0FBYyxFQUFFLE9BQWE7UUFDdEYsTUFBTSxNQUFNLEdBQVE7WUFDbEIsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFDO1lBQy9ELEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO1lBQzdELEVBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUM7U0FDckUsQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFRLDZCQUFtQixDQUFDLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRixJQUFJLENBQUMsY0FBYyxDQUNqQixTQUFTLEVBQ1QsMkNBQTJDLEVBQzNDLE9BQU8sQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUVNLG9EQUFvRCxDQUFDLFNBQWMsRUFBRSxPQUFhO1FBQ3ZGLE1BQU0sTUFBTSxHQUFRO1lBQ2xCLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQztZQUMvRCxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBQztZQUM3RCxFQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO1lBQ3BFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUM7U0FDaEQsQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFRLDZCQUFtQixDQUFDLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRixJQUFJLENBQUMsY0FBYyxDQUNqQixTQUFTLEVBQ1QsNENBQTRDLEVBQzVDLE9BQU8sQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUVNLHlDQUF5QyxDQUFDLFNBQWMsRUFBRSxPQUFhO1FBQzVFLE1BQU0sTUFBTSxHQUFRO1lBQ2xCLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO1lBQzdELEVBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUM7WUFDcEUsRUFBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBQztZQUNoRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO1NBQ2hELENBQUM7UUFFRixNQUFNLE9BQU8sR0FBUSw2QkFBbUIsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEYsT0FBTyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxpQkFBaUI7UUFDN0MsSUFBSSxDQUFDLGNBQWMsQ0FDakIsU0FBUyxFQUNULHVDQUF1QyxFQUN2QyxPQUFPLENBQ1IsQ0FBQztJQUNKLENBQUM7SUFFTSwwQ0FBMEMsQ0FBQyxTQUFjLEVBQUUsT0FBYTtRQUM3RSxNQUFNLE1BQU0sR0FBUTtZQUNsQixFQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBQztZQUM3RCxFQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO1lBQ3BFLEVBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUM7WUFDaEUsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztTQUN6QyxDQUFDO1FBRUYsTUFBTSxPQUFPLEdBQVEsNkJBQW1CLENBQUMsdUJBQXVCLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xGLE9BQU8sQ0FBQyxNQUFNO1lBQ1osT0FBTyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDekUsSUFBSSxDQUFDLGNBQWMsQ0FDakIsU0FBUyxFQUNULHdDQUF3QyxFQUN4QyxPQUFPLENBQ1IsQ0FBQztJQUNKLENBQUM7SUFFTSwrQ0FBK0MsQ0FBQyxTQUFjLEVBQUUsT0FBYTtRQUNsRixNQUFNLE1BQU0sR0FBUTtZQUNsQixFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUM7WUFDL0QsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUM7WUFDN0QsRUFBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBQztZQUNwRSxFQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO1NBQ2pFLENBQUM7UUFFRixNQUFNLE9BQU8sR0FBUSw2QkFBbUIsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEYsSUFBSSxDQUFDLGNBQWMsQ0FDakIsU0FBUyxFQUNULHVDQUF1QyxFQUN2QyxPQUFPLENBQ1IsQ0FBQztJQUNKLENBQUM7SUFFTSxnREFBZ0QsQ0FBQyxTQUFjLEVBQUUsT0FBYTtRQUNuRixNQUFNLE1BQU0sR0FBUTtZQUNsQixFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUM7WUFDL0QsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUM7WUFDN0QsRUFBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBQztZQUNwRSxFQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO1lBQ2hFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUM7U0FDaEQsQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFRLDZCQUFtQixDQUFDLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRixJQUFJLENBQUMsY0FBYyxDQUNqQixTQUFTLEVBQ1Qsd0NBQXdDLEVBQ3hDLE9BQU8sQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUVNLHFCQUFxQixDQUFDLFNBQWMsRUFBRSxPQUFhO1FBQ3hELE1BQU0sTUFBTSxHQUFRO1lBQ2xCLEVBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztZQUNwRCxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQzdDLEVBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUM7WUFDaEQsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFDO1lBQy9ELEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO1lBQzdELEVBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUM7WUFDcEUsRUFBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBQztTQUNqRSxDQUFDO1FBRUYsTUFBTSxPQUFPLEdBQVEsNkJBQW1CLENBQUMsdUJBQXVCLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRWxGLE1BQU0sWUFBWSxHQUFRO1lBQ3hCLElBQUksRUFBRSxVQUFVO1lBQ2hCLElBQUksRUFBRSxzQkFBc0I7WUFDNUIsSUFBSSxFQUFFLG1CQUFtQjtZQUN6QixJQUFJLEVBQUUsMEJBQTBCO1lBQ2hDLElBQUksRUFBRSxzQkFBc0I7WUFDNUIsSUFBSSxFQUFFLGVBQWU7WUFDckIsSUFBSSxFQUFFLGtCQUFrQjtZQUN4QixJQUFJLEVBQUUsYUFBYTtZQUNuQixJQUFJLEVBQUUseUJBQXlCO1lBQy9CLElBQUksRUFBRSxnQ0FBZ0M7WUFDdEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFDO1FBRUYsTUFBTSxlQUFlLEdBQVE7WUFDM0IsQ0FBQyxFQUFFLCtCQUErQjtZQUNsQyxDQUFDLEVBQUUsK0JBQStCO1lBQ2xDLENBQUMsRUFBRSwyQkFBMkI7WUFDOUIsQ0FBQyxFQUFFLDJCQUEyQjtZQUM5QixDQUFDLEVBQUUsa0JBQWtCO1lBQ3JCLENBQUMsRUFBRSxpQkFBaUI7WUFDcEIsQ0FBQyxFQUFFLEVBQUU7WUFDTCxDQUFDLEVBQUUsc0JBQXNCO1lBQ3pCLENBQUMsRUFBRSxxQkFBcUI7WUFDeEIsQ0FBQyxFQUFFLDJCQUEyQjtZQUM5QixFQUFFLEVBQUUsMkJBQTJCO1lBQy9CLEVBQUUsRUFBRSwyQkFBMkI7WUFDL0IsRUFBRSxFQUFFLHVCQUF1QjtZQUMzQixFQUFFLEVBQUUsdUJBQXVCO1lBQzNCLEVBQUUsRUFBRSx1QkFBdUI7WUFDM0IsRUFBRSxFQUFFLHNCQUFzQjtZQUMxQixFQUFFLEVBQUUsbUJBQW1CO1lBQ3ZCLEVBQUUsRUFBRSxtQkFBbUI7WUFDdkIsRUFBRSxFQUFFLDBCQUEwQjtZQUM5QixFQUFFLEVBQUUsc0JBQXNCO1lBQzFCLEVBQUUsRUFBRSwyQkFBMkI7WUFDL0IsRUFBRSxFQUFFLDJCQUEyQjtZQUMvQixFQUFFLEVBQUUsdUNBQXVDO1lBQzNDLEVBQUUsRUFBRSx1Q0FBdUM7WUFDM0MsRUFBRSxFQUFFLHVCQUF1QjtZQUMzQixFQUFFLEVBQUUsdUJBQXVCO1lBQzNCLEVBQUUsRUFBRSxtQ0FBbUM7WUFDdkMsRUFBRSxFQUFFLG1DQUFtQztZQUN2QyxFQUFFLEVBQUUsMEJBQTBCO1lBQzlCLEVBQUUsRUFBRSx1QkFBdUI7WUFDM0IsRUFBRSxFQUFFLDRCQUE0QjtZQUNoQyxFQUFFLEVBQUUsd0NBQXdDO1lBQzVDLEVBQUUsRUFBRSxnQ0FBZ0M7WUFDcEMsRUFBRSxFQUFFLGdDQUFnQztZQUNwQyxFQUFFLEVBQUUsK0JBQStCO1lBQ25DLEVBQUUsRUFBRSwrQkFBK0I7U0FDcEMsQ0FBQztRQUVGLE9BQU8sQ0FBQyxPQUFPO1lBQ2IsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7Z0JBQ2hDLEdBQUc7Z0JBQ0gsZUFBZSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUV6QyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVNLGNBQWMsQ0FBQyxPQUFZLEVBQUUsSUFBUyxFQUFFLEdBQVE7UUFDckQsTUFBTSxJQUFJLEdBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQyxJQUFJLE1BQU0sR0FBUSxPQUFPLENBQUM7UUFDMUIsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3BELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hELE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDOUI7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDdEMsQ0FBQztDQUNGO0FBRUQsa0JBQWUsWUFBWSxDQUFDIiwiZmlsZSI6InNyYy9vYm5pei9saWJzL3dzY29tbWFuZC9XU0NvbW1hbmRCbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSnNvbkJpbmFyeUNvbnZlcnRlciBmcm9tIFwiLi9qc29uQmluYXJ5Q29udmVydGVyXCI7XG5pbXBvcnQgV1NDb21tYW5kIGZyb20gXCIuL1dTQ29tbWFuZFwiO1xuaW1wb3J0IFdTQ29tbWFuZEJsZUhjaSBmcm9tIFwiLi9XU0NvbW1hbmRCbGVIY2lcIjtcblxuY2xhc3MgV1NDb21tYW5kQmxlIGV4dGVuZHMgV1NDb21tYW5kIHtcbiAgcHVibGljIG1vZHVsZTogYW55O1xuICBwdWJsaWMgdXVpZExlbmd0aDogYW55O1xuICBwdWJsaWMgX0NvbW1hbmRTZXRBZHZEYXRhOiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZFNldFNjYW5SZXNwRGF0YTogYW55O1xuICBwdWJsaWMgX0NvbW1hbmRTdGFydEFkdjogYW55O1xuICBwdWJsaWMgX0NvbW1hbmRTdG9wQWR2OiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZFNjYW46IGFueTtcbiAgcHVibGljIF9Db21tYW5kU3RhcnRTY2FuOiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZFN0b3BTY2FuOiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZFNjYW5SZXN1bHRzOiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZENvbm5lY3Q6IGFueTtcbiAgcHVibGljIF9Db21tYW5kU2VydmljZXM6IGFueTtcbiAgcHVibGljIF9Db21tYW5kQ2hhcmFjdGVyaXN0aWNzOiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZFdyaXRlQ2hhcmFjdGVyaXN0aWNzOiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZFJlYWRDaGFyYWN0ZXJpc3RpY3M6IGFueTtcbiAgcHVibGljIF9Db21tYW5kUmVnaXN0ZXJOb3RpZnlDaGFyYWN0ZXJpc3RpYzogYW55O1xuICBwdWJsaWMgX0NvbW1hbmRVbnJlZ2lzdGVyTm90aWZ5Q2hhcmFjdGVyaXN0aWM6IGFueTtcbiAgcHVibGljIF9Db21tYW5kRGVzY3JpcHRvcnM6IGFueTtcbiAgcHVibGljIF9Db21tYW5kV3JpdGVEZXNjcmlwdG9yOiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZFJlYWREZXNjcmlwdG9yOiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZE5vdGlmeUNoYXJhY3RlcmlzdGljOiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZFNldERldmljZU5hbWU6IGFueTtcbiAgcHVibGljIF9Db21tYW5kU2VydmVyU3RhcnRQZXJpcGhlcmFsOiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZFNlcnZlck5vdGlmeUNvbm5lY3Q6IGFueTtcbiAgcHVibGljIF9Db21tYW5kU2VydmVyQWRkU2VydmljZTogYW55O1xuICBwdWJsaWMgX0NvbW1hbmRTZXJ2ZXJBZGRDaGFyYWN0ZXJpc3RpYzogYW55O1xuICBwdWJsaWMgX0NvbW1hbmRTZXJ2ZXJBZGREZXNjcmlwdG9yOiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZFNlcnZlcldyaXRlQ2hhcmF2dGVyaXN0aWNWYWx1ZTogYW55O1xuICBwdWJsaWMgX0NvbW1hbmRTZXJ2ZXJSZWFkQ2hhcmF2dGVyaXN0aWNWYWx1ZTogYW55O1xuICBwdWJsaWMgX0NvbW1hbmRTZXJ2ZXJOb3RpZnlXcml0ZUNoYXJhdnRlcmlzdGljVmFsdWU6IGFueTtcbiAgcHVibGljIF9Db21tYW5kU2VydmVyTm90aWZ5UmVhZENoYXJhdnRlcmlzdGljVmFsdWU6IGFueTtcbiAgcHVibGljIF9Db21tYW5kU2VydmVyV3JpdGVEZXNjcmlwdG9yVmFsdWU6IGFueTtcbiAgcHVibGljIF9Db21tYW5kU2VydmVyUmVhZERlc2NyaXB0b3JWYWx1ZTogYW55O1xuICBwdWJsaWMgX0NvbW1hbmRTZXJ2ZXJOb3RpZnlXcml0ZURlc2NyaXB0b3JWYWx1ZTogYW55O1xuICBwdWJsaWMgX0NvbW1hbmRTZXJ2ZXJOb3RpZnlSZWFkRGVzY3JpcHRvclZhbHVlOiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZFNlcnZlck5vdGlmeUNoYXJhdnRlcmlzdGljOiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZFNlcnZlclN0YXJ0U3RvcFNlcnZpY2U6IGFueTtcbiAgcHVibGljIF9Db21tYW5kU2VjdXJpdHlTZXRBdXRoOiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZFNlY3VyaXR5U2V0RW5jcnlwdGlvbkxldmVsOiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZFNlY3VyaXR5U2V0RW5hYmxlS2V5VHlwZXM6IGFueTtcbiAgcHVibGljIF9Db21tYW5kU2VjdXJpdHlTZXRLZXlNYXhTaXplOiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZFNlY3VyaXR5U2V0SU9DYXBhYmlsaXR5OiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZFNlY3VyaXR5Q2xlYXJCb25kaW5nRGV2aWNlczogYW55O1xuICBwdWJsaWMgX0NvbW1hbmRTY2FuUmVzdWx0c0RldmljZTogYW55O1xuICBwdWJsaWMgX0NvbW1hbmRTY2FuUmVzdWx0c0RldmljZUFkZHJlc3M6IGFueTtcbiAgcHVibGljIF9Db21tYW5kU2NhblJlc3VsdHNFdmV0OiBhbnk7XG4gIHB1YmxpYyBfQ29tbWFuZFNjYW5SZXN1bHRzQmxlRXZlbnQ6IGFueTtcbiAgcHVibGljIF9Db21tYW5kQ2hhcmFjdGVyaXN0aWNzUHJvcGVydGllczogYW55O1xuICBwdWJsaWMgX2NvbW1hbmRSZXN1bHRzOiBhbnk7XG4gIHB1YmxpYyBfc2VjdXJpdHlBdXRoVmFsdWVzOiBhbnk7XG4gIHB1YmxpYyBfc2VjdXJpdHlFbmNyeW90aW9uTGV2ZWxzOiBhbnk7XG4gIHB1YmxpYyBfc2VjdXJpdHlLZXlUeXBlczogYW55O1xuICBwdWJsaWMgaGNpQ29tbWFuZDogYW55O1xuICBwdWJsaWMgc2VuZENvbW1hbmQ6IGFueTtcbiAgcHVibGljIHZhbGlkYXRlQ29tbWFuZFNjaGVtYTogYW55O1xuICBwdWJsaWMgV1NDb21tYW5kTm90Rm91bmRFcnJvcjogYW55O1xuICBwdWJsaWMgQ09NTUFORF9GVU5DX0lEX0VSUk9SOiBhbnk7XG4gIHB1YmxpYyBlbnZlbG9wRXJyb3I6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubW9kdWxlID0gMTE7XG5cbiAgICB0aGlzLnV1aWRMZW5ndGggPSAxNiArIDI7XG5cbiAgICB0aGlzLl9Db21tYW5kU2V0QWR2RGF0YSA9IDA7XG4gICAgdGhpcy5fQ29tbWFuZFNldFNjYW5SZXNwRGF0YSA9IDE7XG4gICAgdGhpcy5fQ29tbWFuZFN0YXJ0QWR2ID0gMjtcbiAgICB0aGlzLl9Db21tYW5kU3RvcEFkdiA9IDM7XG4gICAgdGhpcy5fQ29tbWFuZFNjYW4gPSA0O1xuICAgIHRoaXMuX0NvbW1hbmRTdGFydFNjYW4gPSA0O1xuICAgIHRoaXMuX0NvbW1hbmRTdG9wU2NhbiA9IDU7XG4gICAgdGhpcy5fQ29tbWFuZFNjYW5SZXN1bHRzID0gNjtcbiAgICB0aGlzLl9Db21tYW5kQ29ubmVjdCA9IDc7XG4gICAgdGhpcy5fQ29tbWFuZFNlcnZpY2VzID0gODtcbiAgICB0aGlzLl9Db21tYW5kQ2hhcmFjdGVyaXN0aWNzID0gOTtcbiAgICB0aGlzLl9Db21tYW5kV3JpdGVDaGFyYWN0ZXJpc3RpY3MgPSAxMDtcbiAgICB0aGlzLl9Db21tYW5kUmVhZENoYXJhY3RlcmlzdGljcyA9IDExO1xuICAgIHRoaXMuX0NvbW1hbmRSZWdpc3Rlck5vdGlmeUNoYXJhY3RlcmlzdGljID0gMTI7XG4gICAgdGhpcy5fQ29tbWFuZFVucmVnaXN0ZXJOb3RpZnlDaGFyYWN0ZXJpc3RpYyA9IDEzO1xuICAgIHRoaXMuX0NvbW1hbmREZXNjcmlwdG9ycyA9IDE0O1xuICAgIHRoaXMuX0NvbW1hbmRXcml0ZURlc2NyaXB0b3IgPSAxNTtcbiAgICB0aGlzLl9Db21tYW5kUmVhZERlc2NyaXB0b3IgPSAxNjtcbiAgICB0aGlzLl9Db21tYW5kTm90aWZ5Q2hhcmFjdGVyaXN0aWMgPSAxNztcblxuICAgIHRoaXMuX0NvbW1hbmRTZXREZXZpY2VOYW1lID0gMTk7XG4gICAgdGhpcy5fQ29tbWFuZFNlcnZlclN0YXJ0UGVyaXBoZXJhbCA9IDIwO1xuICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJOb3RpZnlDb25uZWN0ID0gMjE7XG4gICAgdGhpcy5fQ29tbWFuZFNlcnZlckFkZFNlcnZpY2UgPSAyMjtcbiAgICB0aGlzLl9Db21tYW5kU2VydmVyQWRkQ2hhcmFjdGVyaXN0aWMgPSAyMztcbiAgICB0aGlzLl9Db21tYW5kU2VydmVyQWRkRGVzY3JpcHRvciA9IDI0O1xuICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJXcml0ZUNoYXJhdnRlcmlzdGljVmFsdWUgPSAyNTtcbiAgICB0aGlzLl9Db21tYW5kU2VydmVyUmVhZENoYXJhdnRlcmlzdGljVmFsdWUgPSAyNjtcbiAgICB0aGlzLl9Db21tYW5kU2VydmVyTm90aWZ5V3JpdGVDaGFyYXZ0ZXJpc3RpY1ZhbHVlID0gMjc7XG4gICAgdGhpcy5fQ29tbWFuZFNlcnZlck5vdGlmeVJlYWRDaGFyYXZ0ZXJpc3RpY1ZhbHVlID0gMjg7XG4gICAgdGhpcy5fQ29tbWFuZFNlcnZlcldyaXRlRGVzY3JpcHRvclZhbHVlID0gMjk7XG4gICAgdGhpcy5fQ29tbWFuZFNlcnZlclJlYWREZXNjcmlwdG9yVmFsdWUgPSAzMDtcbiAgICB0aGlzLl9Db21tYW5kU2VydmVyTm90aWZ5V3JpdGVEZXNjcmlwdG9yVmFsdWUgPSAzMTtcbiAgICB0aGlzLl9Db21tYW5kU2VydmVyTm90aWZ5UmVhZERlc2NyaXB0b3JWYWx1ZSA9IDMyO1xuICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJOb3RpZnlDaGFyYXZ0ZXJpc3RpYyA9IDMzO1xuICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJTdGFydFN0b3BTZXJ2aWNlID0gMzQ7XG5cbiAgICB0aGlzLl9Db21tYW5kU2VjdXJpdHlTZXRBdXRoID0gMzU7XG4gICAgdGhpcy5fQ29tbWFuZFNlY3VyaXR5U2V0RW5jcnlwdGlvbkxldmVsID0gMzY7XG4gICAgdGhpcy5fQ29tbWFuZFNlY3VyaXR5U2V0RW5hYmxlS2V5VHlwZXMgPSAzNztcbiAgICB0aGlzLl9Db21tYW5kU2VjdXJpdHlTZXRLZXlNYXhTaXplID0gMzg7XG4gICAgdGhpcy5fQ29tbWFuZFNlY3VyaXR5U2V0SU9DYXBhYmlsaXR5ID0gMzk7XG4gICAgdGhpcy5fQ29tbWFuZFNlY3VyaXR5Q2xlYXJCb25kaW5nRGV2aWNlcyA9IDQwO1xuXG4gICAgdGhpcy5fQ29tbWFuZFNjYW5SZXN1bHRzRGV2aWNlID0ge1xuICAgICAgYnJlZGVyOiAweDAxLFxuICAgICAgYmxlOiAweDAyLFxuICAgICAgZHVtbzogMHgwMyxcbiAgICB9O1xuXG4gICAgLy8vIEJMRSBkZXZpY2UgYWRkcmVzcyB0eXBlXG4gICAgdGhpcy5fQ29tbWFuZFNjYW5SZXN1bHRzRGV2aWNlQWRkcmVzcyA9IHtcbiAgICAgIHB1YmxpYzogMHgwMCxcbiAgICAgIHJhbmRvbTogMHgwMSxcbiAgICAgIHJwYV9wdWJsaWM6IDB4MDIsXG4gICAgICBycGFfcmFuZG9tOiAweDAzLFxuICAgIH07XG5cbiAgICB0aGlzLl9Db21tYW5kU2NhblJlc3VsdHNFdmV0ID0ge1xuICAgICAgaW5xdWlyeV9yZXN1bHQ6IDAgLyohPCBJbnF1aXJ5IHJlc3VsdCBmb3IgYSBwZWVyIGRldmljZS4gKi8sXG4gICAgICBpbnF1aXJ5X2NvbXBsZXRlOiAxIC8qITwgSW5xdWlyeSBjb21wbGV0ZS4gKi8sXG4gICAgICBkaXNjb3ZlcnlfcmVzdWx0OiAyIC8qITwgRGlzY292ZXJ5IHJlc3VsdCBmb3IgYSBwZWVyIGRldmljZS4gKi8sXG4gICAgICBkaXNjb3ZlcnlfYmxlX3Jlc3VsdDogMyAvKiE8IERpc2NvdmVyeSByZXN1bHQgZm9yIEJMRSBHQVRUIGJhc2VkIHNlcnZpY2Ugb24gYSBwZWVyIGRldmljZS4gKi8sXG4gICAgICBkaXNjb3ZlcnlfY21vcGxldGU6IDQgLyohPCBEaXNjb3ZlcnkgY29tcGxldGUuICovLFxuICAgICAgZGlzY292ZXJ5X2RpX2Ntb3BsZXRlOiA1IC8qITwgRGlzY292ZXJ5IGNvbXBsZXRlLiAqLyxcbiAgICAgIGNhbmNlbGxlZDogNiAvKiE8IFNlYXJjaCBjYW5jZWxsZWQgKi8sXG4gICAgfTtcblxuICAgIHRoaXMuX0NvbW1hbmRTY2FuUmVzdWx0c0JsZUV2ZW50ID0ge1xuICAgICAgY29ubmVjdGFibGVfYWR2ZXJ0aXNlbW50OiAweDAwIC8qITwgQ29ubmVjdGFibGUgdW5kaXJlY3RlZCBhZHZlcnRpc2luZyAoQURWX0lORCkgKi8sXG4gICAgICBjb25uZWN0YWJsZV9kaXJlY3RlZF9hZHZlcnRpc2VtbnQ6IDB4MDEgLyohPCBDb25uZWN0YWJsZSBkaXJlY3RlZCBhZHZlcnRpc2luZyAoQURWX0RJUkVDVF9JTkQpICovLFxuICAgICAgc2Nhbm5hYmxlX2FkdmVydGlzaW5nOiAweDAyIC8qITwgU2Nhbm5hYmxlIHVuZGlyZWN0ZWQgYWR2ZXJ0aXNpbmcgKEFEVl9TQ0FOX0lORCkgKi8sXG4gICAgICBub25fY29ubmVjdGFibGVfYWR2ZXJ0aXNpbmc6IDB4MDMgLyohPCBOb24gY29ubmVjdGFibGUgdW5kaXJlY3RlZCBhZHZlcnRpc2luZyAoQURWX05PTkNPTk5fSU5EKSAqLyxcbiAgICAgIHNjYW5fcmVzcG9uc2U6IDB4MDQgLyohPCBTY2FuIFJlc3BvbnNlIChTQ0FOX1JTUCkgKi8sXG4gICAgfTtcblxuICAgIHRoaXMuX0NvbW1hbmRDaGFyYWN0ZXJpc3RpY3NQcm9wZXJ0aWVzID0ge1xuICAgICAgYnJvYWRjYXN0OiAweDAxLFxuICAgICAgcmVhZDogMHgwMixcbiAgICAgIHdyaXRlX3dpdGhvdXRfcmVzcG9uc2U6IDB4MDQsXG4gICAgICB3cml0ZTogMHgwOCxcbiAgICAgIG5vdGlmeTogMHgxMCxcbiAgICAgIGluZGljYXRlOiAweDIwLFxuICAgICAgYXV0aDogMHg0MCxcbiAgICAgIGV4dGVuZGVkX3Byb3BlcnRpZXM6IDB4ODAsXG4gICAgfTtcblxuICAgIHRoaXMuX2NvbW1hbmRSZXN1bHRzID0ge1xuICAgICAgc3VjY2VzczogMCxcbiAgICAgIGZhaWxlZDogMSxcbiAgICB9O1xuXG4gICAgdGhpcy5fc2VjdXJpdHlBdXRoVmFsdWVzID0ge1xuICAgICAgMHgwMTogXCJib25kaW5nXCIsXG4gICAgICAweDA0OiBcIm1pdG1cIixcbiAgICAgIDB4MDg6IFwic2VjdXJlX2Nvbm5lY3Rpb25cIixcbiAgICB9O1xuICAgIHRoaXMuX3NlY3VyaXR5RW5jcnlvdGlvbkxldmVscyA9IHtcbiAgICAgIG5vbmU6IDB4MDEsXG4gICAgICBlbmNyeXB0aW9uOiAweDAyLFxuICAgICAgbWl0bTogMHgwMyxcbiAgICB9O1xuXG4gICAgdGhpcy5fc2VjdXJpdHlLZXlUeXBlcyA9IHtcbiAgICAgIDB4MDE6IFwibHRrXCIsXG4gICAgICAweDAyOiBcImlya1wiLFxuICAgICAgMHgwNDogXCJjc3JrXCIsXG4gICAgfTtcblxuICAgIHRoaXMuaGNpQ29tbWFuZCA9IG5ldyBXU0NvbW1hbmRCbGVIY2kodGhpcyk7XG4gIH1cblxuICAvKiBDRU5UUkFMICAgKi9cblxuICBwdWJsaWMgY2VudHJhbFNjYW5TdGFydChwYXJhbXM6IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge3BhdGg6IFwic2Nhbi5kdXJhdGlvblwiLCBsZW5ndGg6IDQsIHR5cGU6IFwiaW50XCIsIGRlZmF1bHQ6IDMwfSxcbiAgICBdO1xuICAgIGNvbnN0IGJ1ZjogYW55ID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jcmVhdGVTZW5kQnVmZmVyKHNjaGVtYSwgcGFyYW1zKTtcbiAgICB0aGlzLnNlbmRDb21tYW5kKHRoaXMuX0NvbW1hbmRTdGFydFNjYW4sIGJ1Zik7XG4gIH1cblxuICBwdWJsaWMgY2VudHJhbFNjYW5TdG9wKHBhcmFtczogYW55KSB7XG4gICAgdGhpcy5zZW5kQ29tbWFuZCh0aGlzLl9Db21tYW5kU3RvcFNjYW4sIG51bGwpO1xuICB9XG5cbiAgcHVibGljIGNlbnRyYWxDb25uZWN0KHBhcmFtczogYW55KSB7XG4gICAgY29uc3Qgc2NoZW1hOiBhbnkgPSBbXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFwiY29ubmVjdC5hZGRyZXNzXCIsXG4gICAgICAgIGxlbmd0aDogNixcbiAgICAgICAgdHlwZTogXCJoZXhcIixcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIGVuZGlhbm5lc3M6IFwibGl0dGxlXCIsXG4gICAgICB9LFxuICAgICAge3BhdGg6IG51bGwsIGxlbmd0aDogMSwgdHlwZTogXCJjaGFyXCIsIGRlZmF1bHQ6IGZhbHNlfSwgLy8gY29uc3QgdmFsXG4gICAgXTtcbiAgICBjb25zdCBidWY6IGFueSA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihzY2hlbWEsIHBhcmFtcyk7XG4gICAgdGhpcy5zZW5kQ29tbWFuZCh0aGlzLl9Db21tYW5kQ29ubmVjdCwgYnVmKTtcbiAgfVxuXG4gIHB1YmxpYyBjZW50cmFsRGlzY29ubmVjdChwYXJhbXM6IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiBcImRpc2Nvbm5lY3QuYWRkcmVzc1wiLFxuICAgICAgICBsZW5ndGg6IDYsXG4gICAgICAgIHR5cGU6IFwiaGV4XCIsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBlbmRpYW5uZXNzOiBcImxpdHRsZVwiLFxuICAgICAgfSxcbiAgICAgIHtwYXRoOiBudWxsLCBsZW5ndGg6IDEsIHR5cGU6IFwiY2hhclwiLCBkZWZhdWx0OiB0cnVlfSwgLy8gY29uc3QgdmFsXG4gICAgXTtcbiAgICBjb25zdCBidWY6IGFueSA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihzY2hlbWEsIHBhcmFtcyk7XG4gICAgdGhpcy5zZW5kQ29tbWFuZCh0aGlzLl9Db21tYW5kQ29ubmVjdCwgYnVmKTtcbiAgfVxuXG4gIHB1YmxpYyBjZW50cmFsU2VydmljZUdldChwYXJhbXM6IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiBcImdldF9zZXJ2aWNlcy5hZGRyZXNzXCIsXG4gICAgICAgIGxlbmd0aDogNixcbiAgICAgICAgdHlwZTogXCJoZXhcIixcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIGVuZGlhbm5lc3M6IFwibGl0dGxlXCIsXG4gICAgICB9LFxuICAgIF07XG4gICAgY29uc3QgYnVmOiBhbnkgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZFNlcnZpY2VzLCBidWYpO1xuICB9XG5cbiAgcHVibGljIGNlbnRyYWxDaGFyYWN0ZXJpc3RpY0dldChwYXJhbXM6IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiBcImdldF9jaGFyYWN0ZXJpc3RpY3MuYWRkcmVzc1wiLFxuICAgICAgICBsZW5ndGg6IDYsXG4gICAgICAgIHR5cGU6IFwiaGV4XCIsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBlbmRpYW5uZXNzOiBcImxpdHRsZVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogXCJnZXRfY2hhcmFjdGVyaXN0aWNzLnNlcnZpY2VfdXVpZFwiLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiBcInV1aWRcIixcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIF07XG4gICAgY29uc3QgYnVmOiBhbnkgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZENoYXJhY3RlcmlzdGljcywgYnVmKTtcbiAgfVxuXG4gIHB1YmxpYyBjZW50cmFsQ2hhcmFjdGVyaXN0aWNSZWFkKHBhcmFtczogYW55KSB7XG4gICAgY29uc3Qgc2NoZW1hOiBhbnkgPSBbXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFwicmVhZF9jaGFyYWN0ZXJpc3RpYy5hZGRyZXNzXCIsXG4gICAgICAgIGxlbmd0aDogNixcbiAgICAgICAgdHlwZTogXCJoZXhcIixcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIGVuZGlhbm5lc3M6IFwibGl0dGxlXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiBcInJlYWRfY2hhcmFjdGVyaXN0aWMuc2VydmljZV91dWlkXCIsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6IFwidXVpZFwiLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFwicmVhZF9jaGFyYWN0ZXJpc3RpYy5jaGFyYWN0ZXJpc3RpY191dWlkXCIsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6IFwidXVpZFwiLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgXTtcbiAgICBjb25zdCBidWY6IGFueSA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihzY2hlbWEsIHBhcmFtcyk7XG4gICAgdGhpcy5zZW5kQ29tbWFuZCh0aGlzLl9Db21tYW5kUmVhZENoYXJhY3RlcmlzdGljcywgYnVmKTtcbiAgfVxuXG4gIHB1YmxpYyBjZW50cmFsQ2hhcmFjdGVyaXN0aWNXcml0ZShwYXJhbXM6IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiBcIndyaXRlX2NoYXJhY3RlcmlzdGljLmFkZHJlc3NcIixcbiAgICAgICAgbGVuZ3RoOiA2LFxuICAgICAgICB0eXBlOiBcImhleFwiLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgZW5kaWFubmVzczogXCJsaXR0bGVcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFwid3JpdGVfY2hhcmFjdGVyaXN0aWMuc2VydmljZV91dWlkXCIsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6IFwidXVpZFwiLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFwid3JpdGVfY2hhcmFjdGVyaXN0aWMuY2hhcmFjdGVyaXN0aWNfdXVpZFwiLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiBcInV1aWRcIixcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiBcIndyaXRlX2NoYXJhY3RlcmlzdGljLm5lZWRSZXNwb25zZVwiLFxuICAgICAgICBsZW5ndGg6IDEsXG4gICAgICAgIHR5cGU6IFwiY2hhclwiLFxuICAgICAgICBkZWZhdWx0OiAxLFxuICAgICAgfSxcbiAgICAgIHtwYXRoOiBcIndyaXRlX2NoYXJhY3RlcmlzdGljLmRhdGFcIiwgbGVuZ3RoOiBudWxsLCB0eXBlOiBcImRhdGFBcnJheVwifSxcbiAgICBdO1xuICAgIGNvbnN0IGJ1ZjogYW55ID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jcmVhdGVTZW5kQnVmZmVyKHNjaGVtYSwgcGFyYW1zKTtcbiAgICB0aGlzLnNlbmRDb21tYW5kKHRoaXMuX0NvbW1hbmRXcml0ZUNoYXJhY3RlcmlzdGljcywgYnVmKTtcbiAgfVxuXG4gIHB1YmxpYyBjZW50cmFsQ2hhcmFjdGVyaXN0aWNSZWdpc3Rlck5vdGlmeShwYXJhbXM6IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiBcInJlZ2lzdGVyX25vdGlmeV9jaGFyYWN0ZXJpc3RpYy5hZGRyZXNzXCIsXG4gICAgICAgIGxlbmd0aDogNixcbiAgICAgICAgdHlwZTogXCJoZXhcIixcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIGVuZGlhbm5lc3M6IFwibGl0dGxlXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiBcInJlZ2lzdGVyX25vdGlmeV9jaGFyYWN0ZXJpc3RpYy5zZXJ2aWNlX3V1aWRcIixcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogXCJ1dWlkXCIsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogXCJyZWdpc3Rlcl9ub3RpZnlfY2hhcmFjdGVyaXN0aWMuY2hhcmFjdGVyaXN0aWNfdXVpZFwiLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiBcInV1aWRcIixcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIF07XG4gICAgY29uc3QgYnVmOiBhbnkgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZFJlZ2lzdGVyTm90aWZ5Q2hhcmFjdGVyaXN0aWMsIGJ1Zik7XG4gIH1cblxuICBwdWJsaWMgY2VudHJhbENoYXJhY3RlcmlzdGljVW5yZWdpc3Rlck5vdGlmeShwYXJhbXM6IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiBcInVucmVnaXN0ZXJfbm90aWZ5X2NoYXJhY3RlcmlzdGljLmFkZHJlc3NcIixcbiAgICAgICAgbGVuZ3RoOiA2LFxuICAgICAgICB0eXBlOiBcImhleFwiLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgZW5kaWFubmVzczogXCJsaXR0bGVcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFwidW5yZWdpc3Rlcl9ub3RpZnlfY2hhcmFjdGVyaXN0aWMuc2VydmljZV91dWlkXCIsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6IFwidXVpZFwiLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFwidW5yZWdpc3Rlcl9ub3RpZnlfY2hhcmFjdGVyaXN0aWMuY2hhcmFjdGVyaXN0aWNfdXVpZFwiLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiBcInV1aWRcIixcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIF07XG4gICAgY29uc3QgYnVmOiBhbnkgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZFVucmVnaXN0ZXJOb3RpZnlDaGFyYWN0ZXJpc3RpYywgYnVmKTtcbiAgfVxuXG4gIHB1YmxpYyBjZW50cmFsRGVzY3JpcHRvckdldChwYXJhbXM6IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiBcImdldF9kZXNjcmlwdG9ycy5hZGRyZXNzXCIsXG4gICAgICAgIGxlbmd0aDogNixcbiAgICAgICAgdHlwZTogXCJoZXhcIixcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIGVuZGlhbm5lc3M6IFwibGl0dGxlXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiBcImdldF9kZXNjcmlwdG9ycy5zZXJ2aWNlX3V1aWRcIixcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogXCJ1dWlkXCIsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogXCJnZXRfZGVzY3JpcHRvcnMuY2hhcmFjdGVyaXN0aWNfdXVpZFwiLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiBcInV1aWRcIixcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIF07XG4gICAgY29uc3QgYnVmOiBhbnkgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZERlc2NyaXB0b3JzLCBidWYpO1xuICB9XG5cbiAgcHVibGljIGNlbnRyYWxEZXNjcmlwdG9yUmVhZChwYXJhbXM6IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiBcInJlYWRfZGVzY3JpcHRvci5hZGRyZXNzXCIsXG4gICAgICAgIGxlbmd0aDogNixcbiAgICAgICAgdHlwZTogXCJoZXhcIixcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIGVuZGlhbm5lc3M6IFwibGl0dGxlXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiBcInJlYWRfZGVzY3JpcHRvci5zZXJ2aWNlX3V1aWRcIixcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogXCJ1dWlkXCIsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogXCJyZWFkX2Rlc2NyaXB0b3IuY2hhcmFjdGVyaXN0aWNfdXVpZFwiLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiBcInV1aWRcIixcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiBcInJlYWRfZGVzY3JpcHRvci5kZXNjcmlwdG9yX3V1aWRcIixcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogXCJ1dWlkXCIsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICBdO1xuICAgIGNvbnN0IGJ1ZjogYW55ID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jcmVhdGVTZW5kQnVmZmVyKHNjaGVtYSwgcGFyYW1zKTtcbiAgICB0aGlzLnNlbmRDb21tYW5kKHRoaXMuX0NvbW1hbmRSZWFkRGVzY3JpcHRvciwgYnVmKTtcbiAgfVxuXG4gIHB1YmxpYyBjZW50cmFsRGVzY3JpcHRvcldyaXRlKHBhcmFtczogYW55KSB7XG4gICAgY29uc3Qgc2NoZW1hOiBhbnkgPSBbXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFwid3JpdGVfZGVzY3JpcHRvci5hZGRyZXNzXCIsXG4gICAgICAgIGxlbmd0aDogNixcbiAgICAgICAgdHlwZTogXCJoZXhcIixcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIGVuZGlhbm5lc3M6IFwibGl0dGxlXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiBcIndyaXRlX2Rlc2NyaXB0b3Iuc2VydmljZV91dWlkXCIsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6IFwidXVpZFwiLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFwid3JpdGVfZGVzY3JpcHRvci5jaGFyYWN0ZXJpc3RpY191dWlkXCIsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6IFwidXVpZFwiLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFwid3JpdGVfZGVzY3JpcHRvci5kZXNjcmlwdG9yX3V1aWRcIixcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogXCJ1dWlkXCIsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogXCJ3cml0ZV9kZXNjcmlwdG9yLm5lZWRSZXNwb25zZVwiLFxuICAgICAgICBsZW5ndGg6IDEsXG4gICAgICAgIHR5cGU6IFwiY2hhclwiLFxuICAgICAgICBkZWZhdWx0OiAxLFxuICAgICAgfSxcbiAgICAgIHtwYXRoOiBcIndyaXRlX2Rlc2NyaXB0b3IuZGF0YVwiLCBsZW5ndGg6IG51bGwsIHR5cGU6IFwiZGF0YUFycmF5XCJ9LFxuICAgIF07XG4gICAgY29uc3QgYnVmOiBhbnkgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZFdyaXRlRGVzY3JpcHRvciwgYnVmKTtcbiAgfVxuXG4gIC8qIFBFUklQSEVSQUwgICAqL1xuXG4gIHB1YmxpYyBwZXJpcGhlcmFsQWR2ZXJ0aXNlbWVudFN0YXJ0KHBhcmFtczogYW55KSB7XG4gICAgdGhpcy5zZW5kQ29tbWFuZChcbiAgICAgIHRoaXMuX0NvbW1hbmRTZXRBZHZEYXRhLFxuICAgICAgbmV3IFVpbnQ4QXJyYXkocGFyYW1zLmFkdmVydGlzZW1lbnQuYWR2X2RhdGEpLFxuICAgICk7XG5cbiAgICBpZiAocGFyYW1zLmFkdmVydGlzZW1lbnQuc2Nhbl9yZXNwKSB7XG4gICAgICB0aGlzLnNlbmRDb21tYW5kKFxuICAgICAgICB0aGlzLl9Db21tYW5kU2V0U2NhblJlc3BEYXRhLFxuICAgICAgICBuZXcgVWludDhBcnJheShwYXJhbXMuYWR2ZXJ0aXNlbWVudC5zY2FuX3Jlc3ApLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlbmRDb21tYW5kKHRoaXMuX0NvbW1hbmRTdGFydEFkdiwgbnVsbCk7XG4gIH1cblxuICBwdWJsaWMgcGVyaXBoZXJhbEFkdmVydGlzZW1lbnRTdG9wKHBhcmFtczogYW55KSB7XG4gICAgdGhpcy5zZW5kQ29tbWFuZCh0aGlzLl9Db21tYW5kU3RvcEFkdiwgbnVsbCk7XG4gIH1cblxuICBwdWJsaWMgcGVyaXBoZXJhbFNlcnZpY2VTdGFydChwYXJhbXM6IGFueSkge1xuICAgIGNvbnN0IHZhbDogYW55ID0gcGFyYW1zLnBlcmlwaGVyYWw7XG4gICAgY29uc3QgcHJvcEZsYWdzOiBhbnkgPSB7XG4gICAgICAweDAxOiBcImJyb2FkY2FzdFwiLFxuICAgICAgMHgwMjogXCJyZWFkXCIsXG4gICAgICAweDA0OiBcIndyaXRlX3dpdGhvdXRfcmVzcG9uc2VcIixcbiAgICAgIDB4MDg6IFwid3JpdGVcIixcbiAgICAgIDB4MTA6IFwibm90aWZ5XCIsXG4gICAgICAweDIwOiBcImluZGlhdGVcIixcbiAgICAgIDB4NDA6IFwiYXV0aFwiLFxuICAgICAgMHg4MDogXCJleHRfcHJvcFwiLFxuICAgIH07XG5cbiAgICBjb25zdCBwZXJtaXNzaW9uRmxhZ3M6IGFueSA9IHtcbiAgICAgIDB4MDAxOiBcInJlYWRcIixcbiAgICAgIDB4MDAyOiBcInJlYWRfZW5jcnlwdGVkXCIsXG4gICAgICAweDAwNDogXCJyZWFkX2VuY3J5cHRlZF9taXRtXCIsXG4gICAgICAweDAxMDogXCJ3cml0ZVwiLFxuICAgICAgMHgwMjA6IFwid3JpdGVfZW5jcnlwdGVkXCIsXG4gICAgICAweDA0MDogXCJ3cml0ZV9lbmNyeXB0ZWRfbWl0bVwiLFxuICAgICAgMHgwODA6IFwid3JpdGVfc2lnbmVkXCIsXG4gICAgICAweDEwMDogXCJ3cml0ZV9zaWduZWRfbWl0bVwiLFxuICAgIH07XG4gICAgY29uc3Qgc2NoZW1hOiBhbnkgPSB7XG4gICAgICBzZXJ2aWNlOiB7XG4gICAgICAgIGNvbW1hbmQ6IHRoaXMuX0NvbW1hbmRTZXJ2ZXJBZGRTZXJ2aWNlLFxuICAgICAgICBzY2hlbWE6IFt7cGF0aDogXCJ1dWlkXCIsIGxlbmd0aDogMTgsIHR5cGU6IFwidXVpZFwiLCByZXF1aXJlZDogdHJ1ZX1dLFxuICAgICAgfSxcbiAgICAgIGNoYXJhY3RlcmlzdGljOiB7XG4gICAgICAgIGNvbW1hbmQ6IHRoaXMuX0NvbW1hbmRTZXJ2ZXJBZGRDaGFyYWN0ZXJpc3RpYyxcbiAgICAgICAgc2NoZW1hOiBbXG4gICAgICAgICAge3BhdGg6IFwic2VydmljZV91dWlkXCIsIGxlbmd0aDogMTgsIHR5cGU6IFwidXVpZFwiLCByZXF1aXJlZDogdHJ1ZX0sXG4gICAgICAgICAge3BhdGg6IFwidXVpZFwiLCBsZW5ndGg6IDE4LCB0eXBlOiBcInV1aWRcIiwgcmVxdWlyZWQ6IHRydWV9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBhdGg6IFwicGVybWlzc2lvbnNcIixcbiAgICAgICAgICAgIGxlbmd0aDogMixcbiAgICAgICAgICAgIHR5cGU6IFwiZmxhZ1wiLFxuICAgICAgICAgICAgZGVmYXVsdDogW1wid3JpdGVcIiwgXCJyZWFkXCJdLFxuICAgICAgICAgICAgZmxhZ3M6IHBlcm1pc3Npb25GbGFncyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBhdGg6IFwicHJvcGVydGllc1wiLFxuICAgICAgICAgICAgbGVuZ3RoOiAxLFxuICAgICAgICAgICAgdHlwZTogXCJmbGFnXCIsXG4gICAgICAgICAgICBkZWZhdWx0OiBbXCJ3cml0ZVwiLCBcInJlYWRcIl0sXG4gICAgICAgICAgICBmbGFnczogcHJvcEZsYWdzLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge3BhdGg6IFwiZGF0YVwiLCB0eXBlOiBcImRhdGFBcnJheVwifSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBkZXNjcmlwdG9yOiB7XG4gICAgICAgIGNvbW1hbmQ6IHRoaXMuX0NvbW1hbmRTZXJ2ZXJBZGREZXNjcmlwdG9yLFxuICAgICAgICBzY2hlbWE6IFtcbiAgICAgICAgICB7cGF0aDogXCJzZXJ2aWNlX3V1aWRcIiwgbGVuZ3RoOiAxOCwgdHlwZTogXCJ1dWlkXCIsIHJlcXVpcmVkOiB0cnVlfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBwYXRoOiBcImNoYXJhY3RlcmlzdGljX3V1aWRcIixcbiAgICAgICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgICAgICB0eXBlOiBcInV1aWRcIixcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge3BhdGg6IFwidXVpZFwiLCBsZW5ndGg6IDE4LCB0eXBlOiBcInV1aWRcIiwgcmVxdWlyZWQ6IHRydWV9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBhdGg6IFwicGVybWlzc2lvbnNcIixcbiAgICAgICAgICAgIGxlbmd0aDogMixcbiAgICAgICAgICAgIHR5cGU6IFwiZmxhZ1wiLFxuICAgICAgICAgICAgZGVmYXVsdDogW1wid3JpdGVcIiwgXCJyZWFkXCJdLFxuICAgICAgICAgICAgZmxhZ3M6IHBlcm1pc3Npb25GbGFncyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtwYXRoOiBcImRhdGFcIiwgdHlwZTogXCJkYXRhQXJyYXlcIn0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgc3RhcnRTZXJ2aWNlOiB7XG4gICAgICAgIGNvbW1hbmQ6IHRoaXMuX0NvbW1hbmRTZXJ2ZXJTdGFydFN0b3BTZXJ2aWNlLFxuICAgICAgICBzY2hlbWE6IFtcbiAgICAgICAgICB7cGF0aDogXCJ1dWlkXCIsIGxlbmd0aDogMTgsIHR5cGU6IFwidXVpZFwiLCByZXF1aXJlZDogdHJ1ZX0sXG4gICAgICAgICAge3BhdGg6IG51bGwsIGxlbmd0aDogMSwgdHlwZTogXCJjaGFyXCIsIGRlZmF1bHQ6IDB9LCAvLyBjb25zdCB2YWxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IHNlbmRCdWZzOiBhbnkgPSBbXTtcbiAgICBjb25zdCBzdGFydFNlcnZpY2VCdWZzOiBhbnkgPSBbXTtcbiAgICBsZXQgYnVmOiBhbnk7XG4gICAgZm9yIChjb25zdCBzZXJ2aWNlSW5kZXggaW4gdmFsLnNlcnZpY2VzKSB7XG4gICAgICBjb25zdCBzZXJ2aWNlOiBhbnkgPSB2YWwuc2VydmljZXNbc2VydmljZUluZGV4XTtcbiAgICAgIGJ1ZiA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihcbiAgICAgICAgc2NoZW1hLnNlcnZpY2Uuc2NoZW1hLFxuICAgICAgICBzZXJ2aWNlLFxuICAgICAgKTtcbiAgICAgIGlmIChidWYubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlbmRCdWZzLnB1c2goe2NvbW1hbmQ6IHNjaGVtYS5zZXJ2aWNlLmNvbW1hbmQsIGJ1ZmZlcjogYnVmfSk7XG5cbiAgICAgIGJ1ZiA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihcbiAgICAgICAgc2NoZW1hLnN0YXJ0U2VydmljZS5zY2hlbWEsXG4gICAgICAgIHNlcnZpY2UsXG4gICAgICApO1xuICAgICAgc3RhcnRTZXJ2aWNlQnVmcy5wdXNoKHtcbiAgICAgICAgY29tbWFuZDogc2NoZW1hLnN0YXJ0U2VydmljZS5jb21tYW5kLFxuICAgICAgICBidWZmZXI6IGJ1ZixcbiAgICAgIH0pO1xuXG4gICAgICBmb3IgKGNvbnN0IGNoYXJhSW5kZXggaW4gc2VydmljZS5jaGFyYWN0ZXJpc3RpY3MpIHtcbiAgICAgICAgY29uc3QgY2hhcmE6IGFueSA9IHNlcnZpY2UuY2hhcmFjdGVyaXN0aWNzW2NoYXJhSW5kZXhdO1xuICAgICAgICBjaGFyYS5zZXJ2aWNlX3V1aWQgPSBzZXJ2aWNlLnV1aWQ7XG4gICAgICAgIGJ1ZiA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihcbiAgICAgICAgICBzY2hlbWEuY2hhcmFjdGVyaXN0aWMuc2NoZW1hLFxuICAgICAgICAgIGNoYXJhLFxuICAgICAgICApO1xuICAgICAgICBpZiAoYnVmLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZW5kQnVmcy5wdXNoKHtcbiAgICAgICAgICBjb21tYW5kOiBzY2hlbWEuY2hhcmFjdGVyaXN0aWMuY29tbWFuZCxcbiAgICAgICAgICBidWZmZXI6IGJ1ZixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBkZXNjSW5kZXggaW4gY2hhcmEuZGVzY3JpcHRvcnMpIHtcbiAgICAgICAgICBjb25zdCBkZXNjOiBhbnkgPSBjaGFyYS5kZXNjcmlwdG9yc1tkZXNjSW5kZXhdO1xuICAgICAgICAgIGRlc2Muc2VydmljZV91dWlkID0gc2VydmljZS51dWlkO1xuICAgICAgICAgIGRlc2MuY2hhcmFjdGVyaXN0aWNfdXVpZCA9IGNoYXJhLnV1aWQ7XG4gICAgICAgICAgYnVmID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jcmVhdGVTZW5kQnVmZmVyKFxuICAgICAgICAgICAgc2NoZW1hLmRlc2NyaXB0b3Iuc2NoZW1hLFxuICAgICAgICAgICAgZGVzYyxcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChidWYubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbmRCdWZzLnB1c2goe2NvbW1hbmQ6IHNjaGVtYS5kZXNjcmlwdG9yLmNvbW1hbmQsIGJ1ZmZlcjogYnVmfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBpbmRleCBpbiBzZW5kQnVmcykge1xuICAgICAgdGhpcy5zZW5kQ29tbWFuZChzZW5kQnVmc1tpbmRleF0uY29tbWFuZCwgc2VuZEJ1ZnNbaW5kZXhdLmJ1ZmZlcik7XG4gICAgfVxuICAgIGZvciAoY29uc3QgaW5kZXggaW4gc3RhcnRTZXJ2aWNlQnVmcykge1xuICAgICAgdGhpcy5zZW5kQ29tbWFuZChcbiAgICAgICAgc3RhcnRTZXJ2aWNlQnVmc1tpbmRleF0uY29tbWFuZCxcbiAgICAgICAgc3RhcnRTZXJ2aWNlQnVmc1tpbmRleF0uYnVmZmVyLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcGVyaXBoZXJhbFNlcnZpY2VTdG9wKHBhcmFtczogYW55KSB7XG4gICAgY29uc3Qgc2NoZW1hOiBhbnkgPSBbXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFwicGVyaXBoZXJhbC5zdG9wX3NlcnZpY2Uuc2VydmljZV91dWlkXCIsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6IFwidXVpZFwiLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7cGF0aDogbnVsbCwgbGVuZ3RoOiAxLCB0eXBlOiBcImNoYXJcIiwgZGVmYXVsdDogMX0sIC8vIGNvbnN0IHZhbFxuICAgIF07XG4gICAgY29uc3QgYnVmOiBhbnkgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZFNlcnZlclN0YXJ0U3RvcFNlcnZpY2UsIGJ1Zik7XG4gIH1cblxuICBwdWJsaWMgcGVyaXBoZXJhbFNlcnZpY2VTdG9wQWxsKCkge1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZFNlcnZlclN0YXJ0UGVyaXBoZXJhbCwgbmV3IFVpbnQ4QXJyYXkoWzFdKSk7XG4gIH1cblxuICBwdWJsaWMgcGVyaXBoZXJhbENoYXJhY3RlcmlzdGljUmVhZChwYXJhbXM6IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiBcInBlcmlwaGVyYWwucmVhZF9jaGFyYWN0ZXJpc3RpYy5zZXJ2aWNlX3V1aWRcIixcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogXCJ1dWlkXCIsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogXCJwZXJpcGhlcmFsLnJlYWRfY2hhcmFjdGVyaXN0aWMuY2hhcmFjdGVyaXN0aWNfdXVpZFwiLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiBcInV1aWRcIixcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIF07XG4gICAgY29uc3QgYnVmOiBhbnkgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZFNlcnZlclJlYWRDaGFyYXZ0ZXJpc3RpY1ZhbHVlLCBidWYpO1xuICB9XG5cbiAgcHVibGljIHBlcmlwaGVyYWxDaGFyYWN0ZXJpc3RpY1dyaXRlKHBhcmFtczogYW55KSB7XG4gICAgY29uc3Qgc2NoZW1hOiBhbnkgPSBbXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFwicGVyaXBoZXJhbC53cml0ZV9jaGFyYWN0ZXJpc3RpYy5zZXJ2aWNlX3V1aWRcIixcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogXCJ1dWlkXCIsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogXCJwZXJpcGhlcmFsLndyaXRlX2NoYXJhY3RlcmlzdGljLmNoYXJhY3RlcmlzdGljX3V1aWRcIixcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogXCJ1dWlkXCIsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtwYXRoOiBcInBlcmlwaGVyYWwud3JpdGVfY2hhcmFjdGVyaXN0aWMuZGF0YVwiLCB0eXBlOiBcImRhdGFBcnJheVwifSxcbiAgICBdO1xuICAgIGNvbnN0IGJ1ZjogYW55ID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jcmVhdGVTZW5kQnVmZmVyKHNjaGVtYSwgcGFyYW1zKTtcbiAgICB0aGlzLnNlbmRDb21tYW5kKHRoaXMuX0NvbW1hbmRTZXJ2ZXJXcml0ZUNoYXJhdnRlcmlzdGljVmFsdWUsIGJ1Zik7XG4gIH1cblxuICBwdWJsaWMgcGVyaXBoZXJhbENoYXJhY3RlcmlzdGljTm90aWZ5KHBhcmFtczogYW55KSB7XG4gICAgY29uc3Qgc2NoZW1hOiBhbnkgPSBbXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFwicGVyaXBoZXJhbC5ub3RpZnlfY2hhcmFjdGVyaXN0aWMuc2VydmljZV91dWlkXCIsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6IFwidXVpZFwiLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFwicGVyaXBoZXJhbC5ub3RpZnlfY2hhcmFjdGVyaXN0aWMuY2hhcmFjdGVyaXN0aWNfdXVpZFwiLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiBcInV1aWRcIixcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIF07XG4gICAgY29uc3QgYnVmOiBhbnkgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZFNlcnZlck5vdGlmeUNoYXJhdnRlcmlzdGljLCBidWYpO1xuICB9XG5cbiAgcHVibGljIHBlcmlwaGVyYWxEZXNjcmlwdG9yUmVhZChwYXJhbXM6IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiBcInBlcmlwaGVyYWwucmVhZF9kZXNjcmlwdG9yLnNlcnZpY2VfdXVpZFwiLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiBcInV1aWRcIixcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiBcInBlcmlwaGVyYWwucmVhZF9kZXNjcmlwdG9yLmNoYXJhY3RlcmlzdGljX3V1aWRcIixcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogXCJ1dWlkXCIsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogXCJwZXJpcGhlcmFsLnJlYWRfZGVzY3JpcHRvci5kZXNjcmlwdG9yX3V1aWRcIixcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogXCJ1dWlkXCIsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICBdO1xuICAgIGNvbnN0IGJ1ZjogYW55ID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jcmVhdGVTZW5kQnVmZmVyKHNjaGVtYSwgcGFyYW1zKTtcbiAgICB0aGlzLnNlbmRDb21tYW5kKHRoaXMuX0NvbW1hbmRTZXJ2ZXJSZWFkRGVzY3JpcHRvclZhbHVlLCBidWYpO1xuICB9XG5cbiAgcHVibGljIHBlcmlwaGVyYWxEZXNjcmlwdG9yV3JpdGUocGFyYW1zOiBhbnkpIHtcbiAgICBjb25zdCBzY2hlbWE6IGFueSA9IFtcbiAgICAgIHtcbiAgICAgICAgcGF0aDogXCJwZXJpcGhlcmFsLndyaXRlX2Rlc2NyaXB0b3Iuc2VydmljZV91dWlkXCIsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6IFwidXVpZFwiLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFwicGVyaXBoZXJhbC53cml0ZV9kZXNjcmlwdG9yLmNoYXJhY3RlcmlzdGljX3V1aWRcIixcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogXCJ1dWlkXCIsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogXCJwZXJpcGhlcmFsLndyaXRlX2Rlc2NyaXB0b3IuZGVzY3JpcHRvcl91dWlkXCIsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6IFwidXVpZFwiLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7cGF0aDogXCJwZXJpcGhlcmFsLndyaXRlX2Rlc2NyaXB0b3IuZGF0YVwiLCB0eXBlOiBcImRhdGFBcnJheVwifSxcbiAgICBdO1xuICAgIGNvbnN0IGJ1ZjogYW55ID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jcmVhdGVTZW5kQnVmZmVyKHNjaGVtYSwgcGFyYW1zKTtcbiAgICB0aGlzLnNlbmRDb21tYW5kKHRoaXMuX0NvbW1hbmRTZXJ2ZXJXcml0ZURlc2NyaXB0b3JWYWx1ZSwgYnVmKTtcbiAgfVxuXG4gIHB1YmxpYyBzZWN1cml0eUF1dGgocGFyYW1zOiBhbnkpIHtcbiAgICBjb25zdCBzY2hlbWE6IGFueSA9IFtcbiAgICAgIHtcbiAgICAgICAgcGF0aDogXCJzZWN1cml0eS5hdXRoXCIsXG4gICAgICAgIHR5cGU6IFwiZmxhZ1wiLFxuICAgICAgICBsZW5ndGg6IDEsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBmbGFnczogdGhpcy5fc2VjdXJpdHlBdXRoVmFsdWVzLFxuICAgICAgfSxcbiAgICBdO1xuICAgIGNvbnN0IGJ1ZjogYW55ID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jcmVhdGVTZW5kQnVmZmVyKHNjaGVtYSwgcGFyYW1zKTtcbiAgICB0aGlzLnNlbmRDb21tYW5kKHRoaXMuX0NvbW1hbmRTZWN1cml0eVNldEF1dGgsIGJ1Zik7XG4gIH1cblxuICBwdWJsaWMgc2VjdXJpdHlJbmRpY2F0ZUxldmVsKHBhcmFtczogYW55KSB7XG4gICAgY29uc3Qgc2NoZW1hOiBhbnkgPSBbXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFwic2VjdXJpdHkuaW5kaWNhdGVfc2VjdXJpdHlfbGV2ZWxcIixcbiAgICAgICAgdHlwZTogXCJjaGFyXCIsXG4gICAgICAgIGxlbmd0aDogMSxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIF07XG4gICAgY29uc3QgYnVmOiBhbnkgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZFNlY3VyaXR5U2V0RW5jcnlwdGlvbkxldmVsLCBidWYpO1xuICB9XG5cbiAgcHVibGljIHNlY3VyaXR5S2V5VHlwZShwYXJhbXM6IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiBcInNlY3VyaXR5LmtleS50eXBlXCIsXG4gICAgICAgIHR5cGU6IFwiZmxhZ1wiLFxuICAgICAgICBsZW5ndGg6IDEsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBmbGFnczogdGhpcy5fc2VjdXJpdHlLZXlUeXBlcyxcbiAgICAgIH0sXG4gICAgXTtcbiAgICBjb25zdCBidWY6IGFueSA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihzY2hlbWEsIHBhcmFtcyk7XG4gICAgdGhpcy5zZW5kQ29tbWFuZCh0aGlzLl9Db21tYW5kU2VjdXJpdHlTZXRFbmFibGVLZXlUeXBlcywgYnVmKTtcbiAgfVxuXG4gIHB1YmxpYyBzZWN1cml0eUtleVNpemUocGFyYW1zOiBhbnkpIHtcbiAgICBjb25zdCBzY2hlbWE6IGFueSA9IFtcbiAgICAgIHtcbiAgICAgICAgcGF0aDogXCJzZWN1cml0eS5rZXkubWF4X3NpemVcIixcbiAgICAgICAgdHlwZTogXCJjaGFyXCIsXG4gICAgICAgIGxlbmd0aDogMSxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIF07XG4gICAgY29uc3QgYnVmOiBhbnkgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZFNlY3VyaXR5U2V0S2V5TWF4U2l6ZSwgYnVmKTtcbiAgfVxuXG4gIHB1YmxpYyBjbGVhckJvbmRpbmdEZXZpY2VzTGlzdChwYXJhbXM6IGFueSkge1xuICAgIGNvbnN0IGJ1ZjogYW55ID0gbmV3IFVpbnQ4QXJyYXkoW10pOyAvLyBub3RpbmcgdG8gc2VuZFxuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZFNlY3VyaXR5Q2xlYXJCb25kaW5nRGV2aWNlcywgYnVmKTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZUZyb21Kc29uKGpzb246IGFueSkge1xuICAgIGNvbnN0IG1vZHVsZTogYW55ID0ganNvbi5ibGU7XG4gICAgaWYgKG1vZHVsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHNjaGVtYURhdGE6IGFueSA9IFtcbiAgICAgIHtcbiAgICAgICAgdXJpOiBcIi9yZXF1ZXN0L2JsZS9jZW50cmFsL3NjYW5fc3RhcnRcIixcbiAgICAgICAgb25WYWxpZDogdGhpcy5jZW50cmFsU2NhblN0YXJ0LFxuICAgICAgfSxcbiAgICAgIHt1cmk6IFwiL3JlcXVlc3QvYmxlL2NlbnRyYWwvc2Nhbl9zdG9wXCIsIG9uVmFsaWQ6IHRoaXMuY2VudHJhbFNjYW5TdG9wfSxcbiAgICAgIHt1cmk6IFwiL3JlcXVlc3QvYmxlL2NlbnRyYWwvY29ubmVjdFwiLCBvblZhbGlkOiB0aGlzLmNlbnRyYWxDb25uZWN0fSxcbiAgICAgIHtcbiAgICAgICAgdXJpOiBcIi9yZXF1ZXN0L2JsZS9jZW50cmFsL2Rpc2Nvbm5lY3RcIixcbiAgICAgICAgb25WYWxpZDogdGhpcy5jZW50cmFsRGlzY29ubmVjdCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogXCIvcmVxdWVzdC9ibGUvY2VudHJhbC9zZXJ2aWNlX2dldFwiLFxuICAgICAgICBvblZhbGlkOiB0aGlzLmNlbnRyYWxTZXJ2aWNlR2V0LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdXJpOiBcIi9yZXF1ZXN0L2JsZS9jZW50cmFsL2NoYXJhY3RlcmlzdGljX2dldFwiLFxuICAgICAgICBvblZhbGlkOiB0aGlzLmNlbnRyYWxDaGFyYWN0ZXJpc3RpY0dldCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogXCIvcmVxdWVzdC9ibGUvY2VudHJhbC9jaGFyYWN0ZXJpc3RpY19yZWFkXCIsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMuY2VudHJhbENoYXJhY3RlcmlzdGljUmVhZCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogXCIvcmVxdWVzdC9ibGUvY2VudHJhbC9jaGFyYWN0ZXJpc3RpY193cml0ZVwiLFxuICAgICAgICBvblZhbGlkOiB0aGlzLmNlbnRyYWxDaGFyYWN0ZXJpc3RpY1dyaXRlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdXJpOiBcIi9yZXF1ZXN0L2JsZS9jZW50cmFsL2NoYXJhY3RlcmlzdGljX3JlZ2lzdGVyX25vdGlmeVwiLFxuICAgICAgICBvblZhbGlkOiB0aGlzLmNlbnRyYWxDaGFyYWN0ZXJpc3RpY1JlZ2lzdGVyTm90aWZ5LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdXJpOiBcIi9yZXF1ZXN0L2JsZS9jZW50cmFsL2NoYXJhY3RlcmlzdGljX3VucmVnaXN0ZXJfbm90aWZ5XCIsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMuY2VudHJhbENoYXJhY3RlcmlzdGljVW5yZWdpc3Rlck5vdGlmeSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogXCIvcmVxdWVzdC9ibGUvY2VudHJhbC9kZXNjcmlwdG9yX2dldFwiLFxuICAgICAgICBvblZhbGlkOiB0aGlzLmNlbnRyYWxEZXNjcmlwdG9yR2V0LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdXJpOiBcIi9yZXF1ZXN0L2JsZS9jZW50cmFsL2Rlc2NyaXB0b3JfcmVhZFwiLFxuICAgICAgICBvblZhbGlkOiB0aGlzLmNlbnRyYWxEZXNjcmlwdG9yUmVhZCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogXCIvcmVxdWVzdC9ibGUvY2VudHJhbC9kZXNjcmlwdG9yX3dyaXRlXCIsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMuY2VudHJhbERlc2NyaXB0b3JXcml0ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogXCIvcmVxdWVzdC9ibGUvcGVyaXBoZXJhbC9hZHZlcnRpc2VtZW50X3N0YXJ0XCIsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMucGVyaXBoZXJhbEFkdmVydGlzZW1lbnRTdGFydCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogXCIvcmVxdWVzdC9ibGUvcGVyaXBoZXJhbC9hZHZlcnRpc2VtZW50X3N0b3BcIixcbiAgICAgICAgb25WYWxpZDogdGhpcy5wZXJpcGhlcmFsQWR2ZXJ0aXNlbWVudFN0b3AsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB1cmk6IFwiL3JlcXVlc3QvYmxlL3BlcmlwaGVyYWwvc2VydmljZV9zdGFydFwiLFxuICAgICAgICBvblZhbGlkOiB0aGlzLnBlcmlwaGVyYWxTZXJ2aWNlU3RhcnQsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB1cmk6IFwiL3JlcXVlc3QvYmxlL3BlcmlwaGVyYWwvc2VydmljZV9zdG9wXCIsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMucGVyaXBoZXJhbFNlcnZpY2VTdG9wLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdXJpOiBcIi9yZXF1ZXN0L2JsZS9wZXJpcGhlcmFsL3NlcnZpY2Vfc3RvcF9hbGxcIixcbiAgICAgICAgb25WYWxpZDogdGhpcy5wZXJpcGhlcmFsU2VydmljZVN0b3BBbGwsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB1cmk6IFwiL3JlcXVlc3QvYmxlL3BlcmlwaGVyYWwvY2hhcmFjdGVyaXN0aWNfcmVhZFwiLFxuICAgICAgICBvblZhbGlkOiB0aGlzLnBlcmlwaGVyYWxDaGFyYWN0ZXJpc3RpY1JlYWQsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB1cmk6IFwiL3JlcXVlc3QvYmxlL3BlcmlwaGVyYWwvY2hhcmFjdGVyaXN0aWNfd3JpdGVcIixcbiAgICAgICAgb25WYWxpZDogdGhpcy5wZXJpcGhlcmFsQ2hhcmFjdGVyaXN0aWNXcml0ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogXCIvcmVxdWVzdC9ibGUvcGVyaXBoZXJhbC9jaGFyYWN0ZXJpc3RpY19ub3RpZnlcIixcbiAgICAgICAgb25WYWxpZDogdGhpcy5wZXJpcGhlcmFsQ2hhcmFjdGVyaXN0aWNOb3RpZnksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB1cmk6IFwiL3JlcXVlc3QvYmxlL3BlcmlwaGVyYWwvZGVzY3JpcHRvcl9yZWFkXCIsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMucGVyaXBoZXJhbERlc2NyaXB0b3JSZWFkLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdXJpOiBcIi9yZXF1ZXN0L2JsZS9wZXJpcGhlcmFsL2Rlc2NyaXB0b3Jfd3JpdGVcIixcbiAgICAgICAgb25WYWxpZDogdGhpcy5wZXJpcGhlcmFsRGVzY3JpcHRvcldyaXRlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdXJpOiBcIi9yZXF1ZXN0L2JsZS9zZWN1cml0eS9hdXRoXCIsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMuc2VjdXJpdHlBdXRoLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdXJpOiBcIi9yZXF1ZXN0L2JsZS9zZWN1cml0eS9pbmRpY2F0ZV9zZWN1cml0eV9sZXZlbFwiLFxuICAgICAgICBvblZhbGlkOiB0aGlzLnNlY3VyaXR5SW5kaWNhdGVMZXZlbCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogXCIvcmVxdWVzdC9ibGUvc2VjdXJpdHkva2V5X3R5cGVcIixcbiAgICAgICAgb25WYWxpZDogdGhpcy5zZWN1cml0eUtleVR5cGUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB1cmk6IFwiL3JlcXVlc3QvYmxlL3NlY3VyaXR5L2tleV9tYXhfc2l6ZVwiLFxuICAgICAgICBvblZhbGlkOiB0aGlzLnNlY3VyaXR5S2V5U2l6ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogXCIvcmVxdWVzdC9ibGUvc2VjdXJpdHkvZGV2aWNlc19jbGVhclwiLFxuICAgICAgICBvblZhbGlkOiB0aGlzLmNsZWFyQm9uZGluZ0RldmljZXNMaXN0LFxuICAgICAgfSxcbiAgICBdO1xuXG4gICAgc2NoZW1hRGF0YS5wdXNoKC4uLnRoaXMuaGNpQ29tbWFuZC5zY2hlbWFEYXRhKCkpO1xuICAgIGNvbnN0IHJlczogYW55ID0gdGhpcy52YWxpZGF0ZUNvbW1hbmRTY2hlbWEoc2NoZW1hRGF0YSwgbW9kdWxlLCBcImJsZVwiKTtcbiAgICBpZiAocmVzLnZhbGlkID09PSAwKSB7XG4gICAgICBpZiAocmVzLmludmFsaWRCdXRMaWtlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlcy5pbnZhbGlkQnV0TGlrZVswXS5tZXNzYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyB0aGlzLldTQ29tbWFuZE5vdEZvdW5kRXJyb3IoYFtibGVddW5rbm93biBjb21tYW5kYCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5vdGlmeUZyb21CaW5hcnkob2JqVG9TZW5kOiBhbnksIGZ1bmM6IGFueSwgcGF5bG9hZDogYW55KSB7XG4gICAgY29uc3QgZnVuY0xpc3Q6IGFueSA9IHt9O1xuICAgIGZ1bmNMaXN0W3RoaXMuX0NvbW1hbmRTY2FuUmVzdWx0c10gPSB0aGlzLm5vdGlmeUZyb21CaW5hcnlTY2FuUmVzcG9uc2UuYmluZChcbiAgICAgIHRoaXMsXG4gICAgKTtcbiAgICBmdW5jTGlzdFt0aGlzLl9Db21tYW5kQ29ubmVjdF0gPSB0aGlzLm5vdGlmeUZyb21CaW5hcnlDb25uZWN0LmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbdGhpcy5fQ29tbWFuZFNlcnZpY2VzXSA9IHRoaXMubm90aWZ5RnJvbUJpbmFyeVNlcnZpY2VzLmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbXG4gICAgICB0aGlzLl9Db21tYW5kQ2hhcmFjdGVyaXN0aWNzXG4gICAgICBdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5Q2hhY2F0ZXJpc3RpY3MuYmluZCh0aGlzKTtcbiAgICBmdW5jTGlzdFtcbiAgICAgIHRoaXMuX0NvbW1hbmRXcml0ZUNoYXJhY3RlcmlzdGljc1xuICAgICAgXSA9IHRoaXMubm90aWZ5RnJvbUJpbmFyeVdyaXRlQ2hhY2F0ZXJpc3RpY3MuYmluZCh0aGlzKTtcbiAgICBmdW5jTGlzdFtcbiAgICAgIHRoaXMuX0NvbW1hbmRSZWFkQ2hhcmFjdGVyaXN0aWNzXG4gICAgICBdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5UmVhZENoYWNhdGVyaXN0aWNzLmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbXG4gICAgICB0aGlzLl9Db21tYW5kUmVnaXN0ZXJOb3RpZnlDaGFyYWN0ZXJpc3RpY1xuICAgICAgXSA9IHRoaXMubm90aWZ5RnJvbUJpbmFyeVJlZ2lzdGVyTm90aWZ5Q2hhY2F0ZXJpc3RpYy5iaW5kKHRoaXMpO1xuICAgIGZ1bmNMaXN0W1xuICAgICAgdGhpcy5fQ29tbWFuZFVucmVnaXN0ZXJOb3RpZnlDaGFyYWN0ZXJpc3RpY1xuICAgICAgXSA9IHRoaXMubm90aWZ5RnJvbUJpbmFyeVVucmVnaXN0ZXJOb3RpZnlDaGFjYXRlcmlzdGljLmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbXG4gICAgICB0aGlzLl9Db21tYW5kTm90aWZ5Q2hhcmFjdGVyaXN0aWNcbiAgICAgIF0gPSB0aGlzLm5vdGlmeUZyb21CaW5hcnlOb3RpZnlDaGFjYXRlcmlzdGljLmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbdGhpcy5fQ29tbWFuZERlc2NyaXB0b3JzXSA9IHRoaXMubm90aWZ5RnJvbUJpbmFyeURlc2NyaXB0b3JzLmJpbmQoXG4gICAgICB0aGlzLFxuICAgICk7XG4gICAgZnVuY0xpc3RbXG4gICAgICB0aGlzLl9Db21tYW5kV3JpdGVEZXNjcmlwdG9yXG4gICAgICBdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5V3JpdGVEZXNjcmlwdG9yLmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbXG4gICAgICB0aGlzLl9Db21tYW5kUmVhZERlc2NyaXB0b3JcbiAgICAgIF0gPSB0aGlzLm5vdGlmeUZyb21CaW5hcnlSZWFkRGVzY3JpcHRvci5iaW5kKHRoaXMpO1xuXG4gICAgZnVuY0xpc3RbXG4gICAgICB0aGlzLl9Db21tYW5kU2VydmVyTm90aWZ5Q29ubmVjdFxuICAgICAgXSA9IHRoaXMubm90aWZ5RnJvbUJpbmFyeVNlcnZlckNvbm5lY3Rpb25TdGF0ZS5iaW5kKHRoaXMpO1xuICAgIGZ1bmNMaXN0W1xuICAgICAgdGhpcy5fQ29tbWFuZFNlcnZlclJlYWRDaGFyYXZ0ZXJpc3RpY1ZhbHVlXG4gICAgICBdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5U2VydmVyUmVhZENoYXJhdnRlcmlzdGljVmFsdWUuYmluZCh0aGlzKTtcbiAgICBmdW5jTGlzdFtcbiAgICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJXcml0ZUNoYXJhdnRlcmlzdGljVmFsdWVcbiAgICAgIF0gPSB0aGlzLm5vdGlmeUZyb21CaW5hcnlTZXJ2ZXJXcml0ZUNoYXJhdnRlcmlzdGljVmFsdWUuYmluZCh0aGlzKTtcbiAgICBmdW5jTGlzdFtcbiAgICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJOb3RpZnlSZWFkQ2hhcmF2dGVyaXN0aWNWYWx1ZVxuICAgICAgXSA9IHRoaXMubm90aWZ5RnJvbUJpbmFyeVNlcnZlck5vdGlmeVJlYWRDaGFyYXZ0ZXJpc3RpY1ZhbHVlLmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbXG4gICAgICB0aGlzLl9Db21tYW5kU2VydmVyTm90aWZ5V3JpdGVDaGFyYXZ0ZXJpc3RpY1ZhbHVlXG4gICAgICBdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5U2VydmVyTm90aWZ5V3JpdGVDaGFyYXZ0ZXJpc3RpY1ZhbHVlLmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbXG4gICAgICB0aGlzLl9Db21tYW5kU2VydmVyUmVhZERlc2NyaXB0b3JWYWx1ZVxuICAgICAgXSA9IHRoaXMubm90aWZ5RnJvbUJpbmFyeVNlcnZlclJlYWREZXNjcmlwdG9yVmFsdWUuYmluZCh0aGlzKTtcbiAgICBmdW5jTGlzdFtcbiAgICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJXcml0ZURlc2NyaXB0b3JWYWx1ZVxuICAgICAgXSA9IHRoaXMubm90aWZ5RnJvbUJpbmFyeVNlcnZlcldyaXRlRGVzY3JpcHRvclZhbHVlLmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbXG4gICAgICB0aGlzLl9Db21tYW5kU2VydmVyTm90aWZ5UmVhZERlc2NyaXB0b3JWYWx1ZVxuICAgICAgXSA9IHRoaXMubm90aWZ5RnJvbUJpbmFyeVNlcnZlck5vdGlmeVJlYWREZXNjcmlwdG9yVmFsdWUuYmluZCh0aGlzKTtcbiAgICBmdW5jTGlzdFtcbiAgICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJOb3RpZnlXcml0ZURlc2NyaXB0b3JWYWx1ZVxuICAgICAgXSA9IHRoaXMubm90aWZ5RnJvbUJpbmFyeVNlcnZlck5vdGlmeVdyaXRlRGVzY3JpcHRvclZhbHVlLmJpbmQodGhpcyk7XG5cbiAgICBmdW5jTGlzdFt0aGlzLkNPTU1BTkRfRlVOQ19JRF9FUlJPUl0gPSB0aGlzLm5vdGlmeUZyb21CaW5hcnlFcnJvci5iaW5kKFxuICAgICAgdGhpcyxcbiAgICApO1xuXG4gICAgT2JqZWN0LmFzc2lnbihmdW5jTGlzdCwgdGhpcy5oY2lDb21tYW5kLm5vdGlmeUZ1bmN0aW9uTGlzdCgpKTtcblxuICAgIGlmIChmdW5jTGlzdFtmdW5jXSkge1xuICAgICAgZnVuY0xpc3RbZnVuY10ob2JqVG9TZW5kLCBwYXlsb2FkKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5RnJvbUJpbmFyeVNjYW5SZXNwb25zZShvYmpUb1NlbmQ6IGFueSwgcGF5bG9hZD86IGFueSkge1xuICAgIGlmIChwYXlsb2FkLmJ5dGVMZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBzY2hlbWE6IGFueSA9IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IFwiZXZlbnRfdHlwZVwiLFxuICAgICAgICAgIHR5cGU6IFwiZW51bVwiLFxuICAgICAgICAgIGxlbmd0aDogMSxcbiAgICAgICAgICBlbnVtOiB0aGlzLl9Db21tYW5kU2NhblJlc3VsdHNFdmV0LFxuICAgICAgICB9LFxuICAgICAgICB7bmFtZTogXCJhZGRyZXNzXCIsIHR5cGU6IFwiaGV4XCIsIGxlbmd0aDogNiwgZW5kaWFubmVzczogXCJsaXR0bGVcIn0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiBcImRldmljZV90eXBlXCIsXG4gICAgICAgICAgdHlwZTogXCJlbnVtXCIsXG4gICAgICAgICAgbGVuZ3RoOiAxLFxuICAgICAgICAgIGVudW06IHRoaXMuX0NvbW1hbmRTY2FuUmVzdWx0c0RldmljZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IFwiYWRkcmVzc190eXBlXCIsXG4gICAgICAgICAgdHlwZTogXCJlbnVtXCIsXG4gICAgICAgICAgbGVuZ3RoOiAxLFxuICAgICAgICAgIGVudW06IHRoaXMuX0NvbW1hbmRTY2FuUmVzdWx0c0RldmljZUFkZHJlc3MsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiBcImJsZV9ldmVudF90eXBlXCIsXG4gICAgICAgICAgdHlwZTogXCJlbnVtXCIsXG4gICAgICAgICAgbGVuZ3RoOiAxLFxuICAgICAgICAgIGVudW06IHRoaXMuX0NvbW1hbmRTY2FuUmVzdWx0c0JsZUV2ZW50LFxuICAgICAgICB9LFxuICAgICAgICB7bmFtZTogXCJyc3NpXCIsIHR5cGU6IFwic2lnbmVkIG51bWJlclwiLCBsZW5ndGg6IDR9LFxuICAgICAgICB7bmFtZTogXCJhZHZfZGF0YVwiLCB0eXBlOiBcImRhdGFBcnJheVwiLCBsZW5ndGg6IDMxICogMn0sXG4gICAgICAgIHtuYW1lOiBcImZsYWdcIiwgdHlwZTogXCJudW1iZXJcIiwgbGVuZ3RoOiA0fSxcbiAgICAgICAge25hbWU6IFwibnVtX3Jlc3BvbnNlXCIsIHR5cGU6IFwibnVtYmVyXCIsIGxlbmd0aDogNH0sXG4gICAgICAgIHtuYW1lOiBcImFkdmVydGlzZV9sZW5ndGhcIiwgdHlwZTogXCJudW1iZXJcIiwgbGVuZ3RoOiAxfSxcbiAgICAgICAge25hbWU6IFwic2Nhbl9yZXNwb25zZV9sZW5ndGhcIiwgdHlwZTogXCJudW1iZXJcIiwgbGVuZ3RoOiAxfSxcbiAgICAgIF07XG5cbiAgICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oXG4gICAgICAgIHNjaGVtYSxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgICk7XG5cbiAgICAgIHJlc3VsdHMuc2Nhbl9yZXNwID0gcmVzdWx0cy5hZHZfZGF0YS5zbGljZShcbiAgICAgICAgcmVzdWx0cy5hZHZlcnRpc2VfbGVuZ3RoLFxuICAgICAgICByZXN1bHRzLmFkdmVydGlzZV9sZW5ndGggKyByZXN1bHRzLnNjYW5fcmVzcG9uc2VfbGVuZ3RoLFxuICAgICAgKTtcbiAgICAgIHJlc3VsdHMuYWR2X2RhdGEgPSByZXN1bHRzLmFkdl9kYXRhLnNsaWNlKDAsIHJlc3VsdHMuYWR2ZXJ0aXNlX2xlbmd0aCk7XG5cbiAgICAgIGRlbGV0ZSByZXN1bHRzLm51bV9yZXNwb25zZTtcbiAgICAgIGRlbGV0ZSByZXN1bHRzLmFkdmVydGlzZV9sZW5ndGg7XG4gICAgICBkZWxldGUgcmVzdWx0cy5zY2FuX3Jlc3BvbnNlX2xlbmd0aDtcbiAgICAgIGRlbGV0ZSByZXN1bHRzLmFkdmVydGlzZV9kYXRhO1xuXG4gICAgICBpZiAocmVzdWx0cy5ldmVudF90eXBlID09PSBcImlucXVpcnlfcmVzdWx0XCIpIHtcbiAgICAgICAgZGVsZXRlIHJlc3VsdHMuZXZlbnRfdHlwZTtcbiAgICAgICAgdGhpcy5fYWRkUm93Rm9yUGF0aChvYmpUb1NlbmQsIFwiYmxlLnNjYW5fcmVzdWx0XCIsIHJlc3VsdHMpO1xuICAgICAgfSBlbHNlIGlmIChyZXN1bHRzLmV2ZW50X3R5cGUgPT09IFwiaW5xdWlyeV9jb21wbGV0ZVwiKSB7XG4gICAgICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgob2JqVG9TZW5kLCBcImJsZS5zY2FuX3Jlc3VsdF9maW5pc2hcIiwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5vdGlmeUZyb21CaW5hcnlDb25uZWN0KG9ialRvU2VuZDogYW55LCBwYXlsb2FkPzogYW55KSB7XG4gICAgaWYgKHBheWxvYWQubGVuZ3RoID09PSA3KSB7XG4gICAgICBjb25zdCBzY2hlbWE6IGFueSA9IFtcbiAgICAgICAge25hbWU6IFwiYWRkcmVzc1wiLCB0eXBlOiBcImhleFwiLCBsZW5ndGg6IDYsIGVuZGlhbm5lc3M6IFwibGl0dGxlXCJ9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJzdGF0dXNcIixcbiAgICAgICAgICB0eXBlOiBcImVudW1cIixcbiAgICAgICAgICBsZW5ndGg6IDEsXG4gICAgICAgICAgZW51bToge2Nvbm5lY3RlZDogMCwgZGlzY29ubmVjdGVkOiAxfSxcbiAgICAgICAgfSxcbiAgICAgIF07XG5cbiAgICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oXG4gICAgICAgIHNjaGVtYSxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgICk7XG4gICAgICB0aGlzLl9hZGRSb3dGb3JQYXRoKG9ialRvU2VuZCwgXCJibGUuc3RhdHVzX3VwZGF0ZVwiLCByZXN1bHRzKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5RnJvbUJpbmFyeVNlcnZpY2VzKG9ialRvU2VuZDogYW55LCBwYXlsb2FkPzogYW55KSB7XG4gICAgY29uc3Qgc2NoZW1hOiBhbnkgPSBbXG4gICAgICB7bmFtZTogXCJhZGRyZXNzXCIsIHR5cGU6IFwiaGV4XCIsIGxlbmd0aDogNiwgZW5kaWFubmVzczogXCJsaXR0bGVcIn0sXG4gICAgICB7bmFtZTogXCJzZXJ2aWNlX3V1aWRcIiwgdHlwZTogXCJ1dWlkXCIsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RofSxcbiAgICBdO1xuXG4gICAgY29uc3QgcmVzdWx0czogYW55ID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuXG4gICAgaWYgKHJlc3VsdHMuc2VydmljZV91dWlkICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9hZGRSb3dGb3JQYXRoKG9ialRvU2VuZCwgXCJibGUuZ2V0X3NlcnZpY2VfcmVzdWx0XCIsIHJlc3VsdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgcmVzdWx0cy5zZXJ2aWNlX3V1aWQ7XG4gICAgICB0aGlzLl9hZGRSb3dGb3JQYXRoKG9ialRvU2VuZCwgXCJibGUuZ2V0X3NlcnZpY2VfcmVzdWx0X2ZpbmlzaFwiLCByZXN1bHRzKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5RnJvbUJpbmFyeUNoYWNhdGVyaXN0aWNzKG9ialRvU2VuZDogYW55LCBwYXlsb2FkPzogYW55KSB7XG4gICAgY29uc3Qgc2NoZW1hOiBhbnkgPSBbXG4gICAgICB7bmFtZTogXCJhZGRyZXNzXCIsIHR5cGU6IFwiaGV4XCIsIGxlbmd0aDogNiwgZW5kaWFubmVzczogXCJsaXR0bGVcIn0sXG4gICAgICB7bmFtZTogXCJzZXJ2aWNlX3V1aWRcIiwgdHlwZTogXCJ1dWlkXCIsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RofSxcbiAgICAgIHtuYW1lOiBcImNoYXJhY3RlcmlzdGljX3V1aWRcIiwgdHlwZTogXCJ1dWlkXCIsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RofSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJwcm9wZXJ0aWVzXCIsXG4gICAgICAgIHR5cGU6IFwiZW51bVwiLFxuICAgICAgICBsZW5ndGg6IDEsXG4gICAgICAgIGVudW06IHRoaXMuX0NvbW1hbmRDaGFyYWN0ZXJpc3RpY3NQcm9wZXJ0aWVzLFxuICAgICAgICBmbGFnczogdHJ1ZSxcbiAgICAgIH0sXG4gICAgXTtcblxuICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oc2NoZW1hLCBwYXlsb2FkKTtcblxuICAgIGlmIChyZXN1bHRzLmNoYXJhY3RlcmlzdGljX3V1aWQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgob2JqVG9TZW5kLCBcImJsZS5nZXRfY2hhcmFjdGVyaXN0aWNfcmVzdWx0XCIsIHJlc3VsdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgcmVzdWx0cy5jaGFyYWN0ZXJpc3RpY191dWlkO1xuICAgICAgZGVsZXRlIHJlc3VsdHMucHJvcGVydGllcztcbiAgICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgoXG4gICAgICAgIG9ialRvU2VuZCxcbiAgICAgICAgXCJibGUuZ2V0X2NoYXJhY3RlcmlzdGljX3Jlc3VsdF9maW5pc2hcIixcbiAgICAgICAgcmVzdWx0cyxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5vdGlmeUZyb21CaW5hcnlSZWFkQ2hhY2F0ZXJpc3RpY3Mob2JqVG9TZW5kOiBhbnksIHBheWxvYWQ/OiBhbnkpIHtcbiAgICBjb25zdCBzY2hlbWE6IGFueSA9IFtcbiAgICAgIHtuYW1lOiBcImFkZHJlc3NcIiwgdHlwZTogXCJoZXhcIiwgbGVuZ3RoOiA2LCBlbmRpYW5uZXNzOiBcImxpdHRsZVwifSxcbiAgICAgIHtuYW1lOiBcInNlcnZpY2VfdXVpZFwiLCB0eXBlOiBcInV1aWRcIiwgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGh9LFxuICAgICAge25hbWU6IFwiY2hhcmFjdGVyaXN0aWNfdXVpZFwiLCB0eXBlOiBcInV1aWRcIiwgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGh9LFxuICAgICAge25hbWU6IFwicmVzdWx0XCIsIHR5cGU6IFwiaW50XCIsIGxlbmd0aDogMX0sXG4gICAgICB7bmFtZTogXCJkYXRhXCIsIHR5cGU6IFwiZGF0YUFycmF5XCIsIGxlbmd0aDogbnVsbH0sXG4gICAgXTtcblxuICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oc2NoZW1hLCBwYXlsb2FkKTtcbiAgICByZXN1bHRzLnJlc3VsdCA9XG4gICAgICByZXN1bHRzLnJlc3VsdCA9PT0gdGhpcy5fY29tbWFuZFJlc3VsdHMuc3VjY2VzcyA/IFwic3VjY2Vzc1wiIDogXCJmYWlsZWRcIjtcbiAgICB0aGlzLl9hZGRSb3dGb3JQYXRoKG9ialRvU2VuZCwgXCJibGUucmVhZF9jaGFyYWN0ZXJpc3RpY19yZXN1bHRcIiwgcmVzdWx0cyk7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5RnJvbUJpbmFyeVdyaXRlQ2hhY2F0ZXJpc3RpY3Mob2JqVG9TZW5kOiBhbnksIHBheWxvYWQ/OiBhbnkpIHtcbiAgICBjb25zdCBzY2hlbWE6IGFueSA9IFtcbiAgICAgIHtuYW1lOiBcImFkZHJlc3NcIiwgdHlwZTogXCJoZXhcIiwgbGVuZ3RoOiA2LCBlbmRpYW5uZXNzOiBcImxpdHRsZVwifSxcbiAgICAgIHtuYW1lOiBcInNlcnZpY2VfdXVpZFwiLCB0eXBlOiBcInV1aWRcIiwgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGh9LFxuICAgICAge25hbWU6IFwiY2hhcmFjdGVyaXN0aWNfdXVpZFwiLCB0eXBlOiBcInV1aWRcIiwgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGh9LFxuICAgICAge25hbWU6IFwicmVzdWx0XCIsIHR5cGU6IFwiaW50XCIsIGxlbmd0aDogMX0sXG4gICAgXTtcblxuICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oc2NoZW1hLCBwYXlsb2FkKTtcbiAgICByZXN1bHRzLnJlc3VsdCA9XG4gICAgICByZXN1bHRzLnJlc3VsdCA9PT0gdGhpcy5fY29tbWFuZFJlc3VsdHMuc3VjY2VzcyA/IFwic3VjY2Vzc1wiIDogXCJmYWlsZWRcIjtcbiAgICB0aGlzLl9hZGRSb3dGb3JQYXRoKG9ialRvU2VuZCwgXCJibGUud3JpdGVfY2hhcmFjdGVyaXN0aWNfcmVzdWx0XCIsIHJlc3VsdHMpO1xuICB9XG5cbiAgcHVibGljIG5vdGlmeUZyb21CaW5hcnlSZWdpc3Rlck5vdGlmeUNoYWNhdGVyaXN0aWMob2JqVG9TZW5kOiBhbnksIHBheWxvYWQ/OiBhbnkpIHtcbiAgICBjb25zdCBzY2hlbWE6IGFueSA9IFtcbiAgICAgIHtuYW1lOiBcImFkZHJlc3NcIiwgdHlwZTogXCJoZXhcIiwgbGVuZ3RoOiA2LCBlbmRpYW5uZXNzOiBcImxpdHRsZVwifSxcbiAgICAgIHtuYW1lOiBcInNlcnZpY2VfdXVpZFwiLCB0eXBlOiBcInV1aWRcIiwgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGh9LFxuICAgICAge25hbWU6IFwiY2hhcmFjdGVyaXN0aWNfdXVpZFwiLCB0eXBlOiBcInV1aWRcIiwgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGh9LFxuICAgICAge25hbWU6IFwicmVzdWx0XCIsIHR5cGU6IFwiaW50XCIsIGxlbmd0aDogMX0sXG4gICAgXTtcblxuICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oc2NoZW1hLCBwYXlsb2FkKTtcbiAgICByZXN1bHRzLnJlc3VsdCA9XG4gICAgICByZXN1bHRzLnJlc3VsdCA9PT0gdGhpcy5fY29tbWFuZFJlc3VsdHMuc3VjY2VzcyA/IFwic3VjY2Vzc1wiIDogXCJmYWlsZWRcIjtcbiAgICB0aGlzLl9hZGRSb3dGb3JQYXRoKFxuICAgICAgb2JqVG9TZW5kLFxuICAgICAgXCJibGUucmVnaXN0ZXJfbm90aWZ5X2NoYXJhY3RlcmlzdGljX3Jlc3VsdFwiLFxuICAgICAgcmVzdWx0cyxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIG5vdGlmeUZyb21CaW5hcnlVbnJlZ2lzdGVyTm90aWZ5Q2hhY2F0ZXJpc3RpYyhvYmpUb1NlbmQ6IGFueSwgcGF5bG9hZD86IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge25hbWU6IFwiYWRkcmVzc1wiLCB0eXBlOiBcImhleFwiLCBsZW5ndGg6IDYsIGVuZGlhbm5lc3M6IFwibGl0dGxlXCJ9LFxuICAgICAge25hbWU6IFwic2VydmljZV91dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJjaGFyYWN0ZXJpc3RpY191dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJyZXN1bHRcIiwgdHlwZTogXCJpbnRcIiwgbGVuZ3RoOiAxfSxcbiAgICBdO1xuXG4gICAgY29uc3QgcmVzdWx0czogYW55ID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuICAgIHJlc3VsdHMucmVzdWx0ID1cbiAgICAgIHJlc3VsdHMucmVzdWx0ID09PSB0aGlzLl9jb21tYW5kUmVzdWx0cy5zdWNjZXNzID8gXCJzdWNjZXNzXCIgOiBcImZhaWxlZFwiO1xuICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgoXG4gICAgICBvYmpUb1NlbmQsXG4gICAgICBcImJsZS51bnJlZ2lzdGVyX25vdGlmeV9jaGFyYWN0ZXJpc3RpY19yZXN1bHRcIixcbiAgICAgIHJlc3VsdHMsXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBub3RpZnlGcm9tQmluYXJ5Tm90aWZ5Q2hhY2F0ZXJpc3RpYyhvYmpUb1NlbmQ6IGFueSwgcGF5bG9hZD86IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge25hbWU6IFwiYWRkcmVzc1wiLCB0eXBlOiBcImhleFwiLCBsZW5ndGg6IDYsIGVuZGlhbm5lc3M6IFwibGl0dGxlXCJ9LFxuICAgICAge25hbWU6IFwic2VydmljZV91dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJjaGFyYWN0ZXJpc3RpY191dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJpc19ub3RpZnlcIiwgdHlwZTogXCJpbnRcIiwgbGVuZ3RoOiAxfSxcbiAgICAgIHtuYW1lOiBcImRhdGFcIiwgdHlwZTogXCJkYXRhQXJyYXlcIiwgbGVuZ3RoOiBudWxsfSxcbiAgICBdO1xuXG4gICAgY29uc3QgcmVzdWx0czogYW55ID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuICAgIHJlc3VsdHMuaXNfbm90aWZ5ID0gcmVzdWx0cy5pc19ub3RpZnkgPT09IDE7XG4gICAgdGhpcy5fYWRkUm93Rm9yUGF0aChvYmpUb1NlbmQsIFwiYmxlLm5vdGlmeV9jaGFyYWN0ZXJpc3RpY1wiLCByZXN1bHRzKTtcbiAgfVxuXG4gIHB1YmxpYyBub3RpZnlGcm9tQmluYXJ5RGVzY3JpcHRvcnMob2JqVG9TZW5kOiBhbnksIHBheWxvYWQ/OiBhbnkpIHtcbiAgICBjb25zdCBzY2hlbWE6IGFueSA9IFtcbiAgICAgIHtuYW1lOiBcImFkZHJlc3NcIiwgdHlwZTogXCJoZXhcIiwgbGVuZ3RoOiA2LCBlbmRpYW5uZXNzOiBcImxpdHRsZVwifSxcbiAgICAgIHtuYW1lOiBcInNlcnZpY2VfdXVpZFwiLCB0eXBlOiBcInV1aWRcIiwgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGh9LFxuICAgICAge25hbWU6IFwiY2hhcmFjdGVyaXN0aWNfdXVpZFwiLCB0eXBlOiBcInV1aWRcIiwgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGh9LFxuICAgICAge25hbWU6IFwiZGVzY3JpcHRvcl91dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgXTtcblxuICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oc2NoZW1hLCBwYXlsb2FkKTtcblxuICAgIGlmIChyZXN1bHRzLmRlc2NyaXB0b3JfdXVpZCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fYWRkUm93Rm9yUGF0aChvYmpUb1NlbmQsIFwiYmxlLmdldF9kZXNjcmlwdG9yX3Jlc3VsdFwiLCByZXN1bHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHJlc3VsdHMuZGVzY3JpcHRvcl91dWlkO1xuICAgICAgdGhpcy5fYWRkUm93Rm9yUGF0aChcbiAgICAgICAgb2JqVG9TZW5kLFxuICAgICAgICBcImJsZS5nZXRfZGVzY3JpcHRvcl9yZXN1bHRfZmluaXNoXCIsXG4gICAgICAgIHJlc3VsdHMsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBub3RpZnlGcm9tQmluYXJ5UmVhZERlc2NyaXB0b3Iob2JqVG9TZW5kOiBhbnksIHBheWxvYWQ/OiBhbnkpIHtcbiAgICBjb25zdCBzY2hlbWE6IGFueSA9IFtcbiAgICAgIHtuYW1lOiBcImFkZHJlc3NcIiwgdHlwZTogXCJoZXhcIiwgbGVuZ3RoOiA2LCBlbmRpYW5uZXNzOiBcImxpdHRsZVwifSxcbiAgICAgIHtuYW1lOiBcInNlcnZpY2VfdXVpZFwiLCB0eXBlOiBcInV1aWRcIiwgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGh9LFxuICAgICAge25hbWU6IFwiY2hhcmFjdGVyaXN0aWNfdXVpZFwiLCB0eXBlOiBcInV1aWRcIiwgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGh9LFxuICAgICAge25hbWU6IFwiZGVzY3JpcHRvcl91dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJyZXN1bHRcIiwgdHlwZTogXCJpbnRcIiwgbGVuZ3RoOiAxfSxcbiAgICAgIHtuYW1lOiBcImRhdGFcIiwgdHlwZTogXCJkYXRhQXJyYXlcIiwgbGVuZ3RoOiBudWxsfSxcbiAgICBdO1xuXG4gICAgY29uc3QgcmVzdWx0czogYW55ID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuICAgIHJlc3VsdHMucmVzdWx0ID1cbiAgICAgIHJlc3VsdHMucmVzdWx0ID09PSB0aGlzLl9jb21tYW5kUmVzdWx0cy5zdWNjZXNzID8gXCJzdWNjZXNzXCIgOiBcImZhaWxlZFwiO1xuICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgob2JqVG9TZW5kLCBcImJsZS5yZWFkX2Rlc2NyaXB0b3JfcmVzdWx0XCIsIHJlc3VsdHMpO1xuICB9XG5cbiAgcHVibGljIG5vdGlmeUZyb21CaW5hcnlXcml0ZURlc2NyaXB0b3Iob2JqVG9TZW5kOiBhbnksIHBheWxvYWQ/OiBhbnkpIHtcbiAgICBjb25zdCBzY2hlbWE6IGFueSA9IFtcbiAgICAgIHtuYW1lOiBcImFkZHJlc3NcIiwgdHlwZTogXCJoZXhcIiwgbGVuZ3RoOiA2LCBlbmRpYW5uZXNzOiBcImxpdHRsZVwifSxcbiAgICAgIHtuYW1lOiBcInNlcnZpY2VfdXVpZFwiLCB0eXBlOiBcInV1aWRcIiwgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGh9LFxuICAgICAge25hbWU6IFwiY2hhcmFjdGVyaXN0aWNfdXVpZFwiLCB0eXBlOiBcInV1aWRcIiwgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGh9LFxuICAgICAge25hbWU6IFwiZGVzY3JpcHRvcl91dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJyZXN1bHRcIiwgdHlwZTogXCJpbnRcIiwgbGVuZ3RoOiAxfSxcbiAgICBdO1xuXG4gICAgY29uc3QgcmVzdWx0czogYW55ID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuICAgIHJlc3VsdHMucmVzdWx0ID1cbiAgICAgIHJlc3VsdHMucmVzdWx0ID09PSB0aGlzLl9jb21tYW5kUmVzdWx0cy5zdWNjZXNzID8gXCJzdWNjZXNzXCIgOiBcImZhaWxlZFwiO1xuICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgob2JqVG9TZW5kLCBcImJsZS53cml0ZV9kZXNjcmlwdG9yX3Jlc3VsdFwiLCByZXN1bHRzKTtcbiAgfVxuXG4gIHB1YmxpYyBub3RpZnlGcm9tQmluYXJ5U2VydmVyQ29ubmVjdGlvblN0YXRlKG9ialRvU2VuZDogYW55LCBwYXlsb2FkPzogYW55KSB7XG4gICAgY29uc3Qgc2NoZW1hOiBhbnkgPSBbXG4gICAgICB7bmFtZTogXCJhZGRyZXNzXCIsIHR5cGU6IFwiaGV4XCIsIGxlbmd0aDogNiwgZW5kaWFubmVzczogXCJsaXR0bGVcIn0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwic3RhdHVzXCIsXG4gICAgICAgIHR5cGU6IFwiZW51bVwiLFxuICAgICAgICBsZW5ndGg6IDEsXG4gICAgICAgIGVudW06IHtjb25uZWN0ZWQ6IDEsIGRpc2Nvbm5lY3RlZDogMH0sXG4gICAgICB9LFxuICAgIF07XG5cbiAgICBjb25zdCByZXN1bHRzOiBhbnkgPSBKc29uQmluYXJ5Q29udmVydGVyLmNvbnZlcnRGcm9tQmluYXJ5VG9Kc29uKHNjaGVtYSwgcGF5bG9hZCk7XG4gICAgdGhpcy5fYWRkUm93Rm9yUGF0aChvYmpUb1NlbmQsIFwiYmxlLnBlcmlwaGVyYWwuY29ubmVjdGlvbl9zdGF0dXNcIiwgcmVzdWx0cyk7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5RnJvbUJpbmFyeVNlcnZlcldyaXRlQ2hhcmF2dGVyaXN0aWNWYWx1ZShvYmpUb1NlbmQ6IGFueSwgcGF5bG9hZD86IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge25hbWU6IFwic2VydmljZV91dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJjaGFyYWN0ZXJpc3RpY191dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJyZXN1bHRcIiwgdHlwZTogXCJpbnRcIiwgbGVuZ3RoOiAxfSxcbiAgICBdO1xuXG4gICAgY29uc3QgcmVzdWx0czogYW55ID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuICAgIHJlc3VsdHMucmVzdWx0ID1cbiAgICAgIHJlc3VsdHMucmVzdWx0ID09PSB0aGlzLl9jb21tYW5kUmVzdWx0cy5zdWNjZXNzID8gXCJzdWNjZXNzXCIgOiBcImZhaWxlZFwiO1xuICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgoXG4gICAgICBvYmpUb1NlbmQsXG4gICAgICBcImJsZS5wZXJpcGhlcmFsLndyaXRlX2NoYXJhY3RlcmlzdGljX3Jlc3VsdFwiLFxuICAgICAgcmVzdWx0cyxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIG5vdGlmeUZyb21CaW5hcnlTZXJ2ZXJSZWFkQ2hhcmF2dGVyaXN0aWNWYWx1ZShvYmpUb1NlbmQ6IGFueSwgcGF5bG9hZD86IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge25hbWU6IFwic2VydmljZV91dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJjaGFyYWN0ZXJpc3RpY191dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJkYXRhXCIsIHR5cGU6IFwiZGF0YUFycmF5XCIsIGxlbmd0aDogbnVsbH0sXG4gICAgXTtcblxuICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oc2NoZW1hLCBwYXlsb2FkKTtcbiAgICByZXN1bHRzLnJlc3VsdCA9IFwic3VjY2Vzc1wiOyAvLyBhbHdheXMgc3VjY2Vzc1xuICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgoXG4gICAgICBvYmpUb1NlbmQsXG4gICAgICBcImJsZS5wZXJpcGhlcmFsLnJlYWRfY2hhcmFjdGVyaXN0aWNfcmVzdWx0XCIsXG4gICAgICByZXN1bHRzLFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5RnJvbUJpbmFyeVNlcnZlck5vdGlmeVJlYWRDaGFyYXZ0ZXJpc3RpY1ZhbHVlKG9ialRvU2VuZDogYW55LCBwYXlsb2FkPzogYW55KSB7XG4gICAgY29uc3Qgc2NoZW1hOiBhbnkgPSBbXG4gICAgICB7bmFtZTogXCJhZGRyZXNzXCIsIHR5cGU6IFwiaGV4XCIsIGxlbmd0aDogNiwgZW5kaWFubmVzczogXCJsaXR0bGVcIn0sXG4gICAgICB7bmFtZTogXCJzZXJ2aWNlX3V1aWRcIiwgdHlwZTogXCJ1dWlkXCIsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RofSxcbiAgICAgIHtuYW1lOiBcImNoYXJhY3RlcmlzdGljX3V1aWRcIiwgdHlwZTogXCJ1dWlkXCIsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RofSxcbiAgICBdO1xuXG4gICAgY29uc3QgcmVzdWx0czogYW55ID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgoXG4gICAgICBvYmpUb1NlbmQsXG4gICAgICBcImJsZS5wZXJpcGhlcmFsLm5vdGlmeV9yZWFkX2NoYXJhY3RlcmlzdGljXCIsXG4gICAgICByZXN1bHRzLFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5RnJvbUJpbmFyeVNlcnZlck5vdGlmeVdyaXRlQ2hhcmF2dGVyaXN0aWNWYWx1ZShvYmpUb1NlbmQ6IGFueSwgcGF5bG9hZD86IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge25hbWU6IFwiYWRkcmVzc1wiLCB0eXBlOiBcImhleFwiLCBsZW5ndGg6IDYsIGVuZGlhbm5lc3M6IFwibGl0dGxlXCJ9LFxuICAgICAge25hbWU6IFwic2VydmljZV91dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJjaGFyYWN0ZXJpc3RpY191dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJkYXRhXCIsIHR5cGU6IFwiZGF0YUFycmF5XCIsIGxlbmd0aDogbnVsbH0sXG4gICAgXTtcblxuICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oc2NoZW1hLCBwYXlsb2FkKTtcbiAgICB0aGlzLl9hZGRSb3dGb3JQYXRoKFxuICAgICAgb2JqVG9TZW5kLFxuICAgICAgXCJibGUucGVyaXBoZXJhbC5ub3RpZnlfd3JpdGVfY2hhcmFjdGVyaXN0aWNcIixcbiAgICAgIHJlc3VsdHMsXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBub3RpZnlGcm9tQmluYXJ5U2VydmVyUmVhZERlc2NyaXB0b3JWYWx1ZShvYmpUb1NlbmQ6IGFueSwgcGF5bG9hZD86IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge25hbWU6IFwic2VydmljZV91dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJjaGFyYWN0ZXJpc3RpY191dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJkZXNjcmlwdG9yX3V1aWRcIiwgdHlwZTogXCJ1dWlkXCIsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RofSxcbiAgICAgIHtuYW1lOiBcImRhdGFcIiwgdHlwZTogXCJkYXRhQXJyYXlcIiwgbGVuZ3RoOiBudWxsfSxcbiAgICBdO1xuXG4gICAgY29uc3QgcmVzdWx0czogYW55ID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuICAgIHJlc3VsdHMucmVzdWx0ID0gXCJzdWNjZXNzXCI7IC8vIGFsd2F5cyBzdWNjZXNzXG4gICAgdGhpcy5fYWRkUm93Rm9yUGF0aChcbiAgICAgIG9ialRvU2VuZCxcbiAgICAgIFwiYmxlLnBlcmlwaGVyYWwucmVhZF9kZXNjcmlwdG9yX3Jlc3VsdFwiLFxuICAgICAgcmVzdWx0cyxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIG5vdGlmeUZyb21CaW5hcnlTZXJ2ZXJXcml0ZURlc2NyaXB0b3JWYWx1ZShvYmpUb1NlbmQ6IGFueSwgcGF5bG9hZD86IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge25hbWU6IFwic2VydmljZV91dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJjaGFyYWN0ZXJpc3RpY191dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJkZXNjcmlwdG9yX3V1aWRcIiwgdHlwZTogXCJ1dWlkXCIsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RofSxcbiAgICAgIHtuYW1lOiBcInJlc3VsdFwiLCB0eXBlOiBcImludFwiLCBsZW5ndGg6IDF9LFxuICAgIF07XG5cbiAgICBjb25zdCByZXN1bHRzOiBhbnkgPSBKc29uQmluYXJ5Q29udmVydGVyLmNvbnZlcnRGcm9tQmluYXJ5VG9Kc29uKHNjaGVtYSwgcGF5bG9hZCk7XG4gICAgcmVzdWx0cy5yZXN1bHQgPVxuICAgICAgcmVzdWx0cy5yZXN1bHQgPT09IHRoaXMuX2NvbW1hbmRSZXN1bHRzLnN1Y2Nlc3MgPyBcInN1Y2Nlc3NcIiA6IFwiZmFpbGVkXCI7XG4gICAgdGhpcy5fYWRkUm93Rm9yUGF0aChcbiAgICAgIG9ialRvU2VuZCxcbiAgICAgIFwiYmxlLnBlcmlwaGVyYWwud3JpdGVfZGVzY3JpcHRvcl9yZXN1bHRcIixcbiAgICAgIHJlc3VsdHMsXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBub3RpZnlGcm9tQmluYXJ5U2VydmVyTm90aWZ5UmVhZERlc2NyaXB0b3JWYWx1ZShvYmpUb1NlbmQ6IGFueSwgcGF5bG9hZD86IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge25hbWU6IFwiYWRkcmVzc1wiLCB0eXBlOiBcImhleFwiLCBsZW5ndGg6IDYsIGVuZGlhbm5lc3M6IFwibGl0dGxlXCJ9LFxuICAgICAge25hbWU6IFwic2VydmljZV91dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJjaGFyYWN0ZXJpc3RpY191dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJkZXNjcmlwdG9yX3V1aWRcIiwgdHlwZTogXCJ1dWlkXCIsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RofSxcbiAgICBdO1xuXG4gICAgY29uc3QgcmVzdWx0czogYW55ID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgoXG4gICAgICBvYmpUb1NlbmQsXG4gICAgICBcImJsZS5wZXJpcGhlcmFsLm5vdGlmeV9yZWFkX2Rlc2NyaXB0b3JcIixcbiAgICAgIHJlc3VsdHMsXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBub3RpZnlGcm9tQmluYXJ5U2VydmVyTm90aWZ5V3JpdGVEZXNjcmlwdG9yVmFsdWUob2JqVG9TZW5kOiBhbnksIHBheWxvYWQ/OiBhbnkpIHtcbiAgICBjb25zdCBzY2hlbWE6IGFueSA9IFtcbiAgICAgIHtuYW1lOiBcImFkZHJlc3NcIiwgdHlwZTogXCJoZXhcIiwgbGVuZ3RoOiA2LCBlbmRpYW5uZXNzOiBcImxpdHRsZVwifSxcbiAgICAgIHtuYW1lOiBcInNlcnZpY2VfdXVpZFwiLCB0eXBlOiBcInV1aWRcIiwgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGh9LFxuICAgICAge25hbWU6IFwiY2hhcmFjdGVyaXN0aWNfdXVpZFwiLCB0eXBlOiBcInV1aWRcIiwgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGh9LFxuICAgICAge25hbWU6IFwiZGVzY3JpcHRvcl91dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgICB7bmFtZTogXCJkYXRhXCIsIHR5cGU6IFwiZGF0YUFycmF5XCIsIGxlbmd0aDogbnVsbH0sXG4gICAgXTtcblxuICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oc2NoZW1hLCBwYXlsb2FkKTtcbiAgICB0aGlzLl9hZGRSb3dGb3JQYXRoKFxuICAgICAgb2JqVG9TZW5kLFxuICAgICAgXCJibGUucGVyaXBoZXJhbC5ub3RpZnlfd3JpdGVfZGVzY3JpcHRvclwiLFxuICAgICAgcmVzdWx0cyxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIG5vdGlmeUZyb21CaW5hcnlFcnJvcihvYmpUb1NlbmQ6IGFueSwgcGF5bG9hZD86IGFueSkge1xuICAgIGNvbnN0IHNjaGVtYTogYW55ID0gW1xuICAgICAge25hbWU6IFwibW9kdWxlX2Vycm9yX2NvZGVcIiwgdHlwZTogXCJjaGFyXCIsIGxlbmd0aDogMX0sXG4gICAgICB7bmFtZTogXCJlcnJvcl9jb2RlXCIsIHR5cGU6IFwiY2hhclwiLCBsZW5ndGg6IDF9LFxuICAgICAge25hbWU6IFwiZnVuY3Rpb25fY29kZVwiLCB0eXBlOiBcImNoYXJcIiwgbGVuZ3RoOiAxfSxcbiAgICAgIHtuYW1lOiBcImFkZHJlc3NcIiwgdHlwZTogXCJoZXhcIiwgbGVuZ3RoOiA2LCBlbmRpYW5uZXNzOiBcImxpdHRsZVwifSxcbiAgICAgIHtuYW1lOiBcInNlcnZpY2VfdXVpZFwiLCB0eXBlOiBcInV1aWRcIiwgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGh9LFxuICAgICAge25hbWU6IFwiY2hhcmFjdGVyaXN0aWNfdXVpZFwiLCB0eXBlOiBcInV1aWRcIiwgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGh9LFxuICAgICAge25hbWU6IFwiZGVzY3JpcHRvcl91dWlkXCIsIHR5cGU6IFwidXVpZFwiLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aH0sXG4gICAgXTtcblxuICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oc2NoZW1hLCBwYXlsb2FkKTtcblxuICAgIGNvbnN0IGVycm9yTWVzc2FnZTogYW55ID0ge1xuICAgICAgMHgwMDogXCJubyBlcnJvclwiLFxuICAgICAgMHgwMTogXCJkZXZpY2Ugbm90IGNvbm5lY3RlZFwiLFxuICAgICAgMHgwMjogXCJzZXJ2aWNlIG5vdCBmb3VuZFwiLFxuICAgICAgMHgwMzogXCJjaGFyYXZ0ZXJpc3RpYyBub3QgZm91bmRcIixcbiAgICAgIDB4MDQ6IFwiZGVzY3JpcHRvciBub3QgZm91bmRcIixcbiAgICAgIDB4MDU6IFwibm8gcGVybWlzc2lvblwiLFxuICAgICAgMHgwNjogXCJkZXZpY2Ugbm90IGZvdW5kXCIsXG4gICAgICAweDA3OiBcImJsZSBpcyBidXN5XCIsXG4gICAgICAweDA4OiBcInNlcnZpY2UgYWxyZWFkeSBydW5uaW5nXCIsXG4gICAgICAweDA5OiBcInNlY3VyaXR5IHBhcmFtIGFyZSBhbHJlYWR5IHNldFwiLFxuICAgICAgMHhmZjogXCJlcnJvclwiLFxuICAgIH07XG5cbiAgICBjb25zdCBmdW5jdGlvbk1lc3NhZ2U6IGFueSA9IHtcbiAgICAgIDA6IFwib24gc2V0dGluZyBhZHZlcnRpc2VtZW50IGRhdGFcIixcbiAgICAgIDE6IFwib24gc2V0dGluZyBzY2FuIHJlc3BvbnNlIGRhdGFcIixcbiAgICAgIDI6IFwib24gc3RhcnRpbmcgYWR2ZXJ0aXNlbWVudFwiLFxuICAgICAgMzogXCJvbiBzdG9wcGluZyBhZHZlcnRpc2VtZW50XCIsXG4gICAgICA0OiBcIm9uIHN0YXJ0aW5nIHNjYW5cIixcbiAgICAgIDU6IFwib24gc3RvcGluZyBzY2FuXCIsXG4gICAgICA2OiBcIlwiLFxuICAgICAgNzogXCJvbiBjb25uZWN0aW5nIGRldmljZVwiLFxuICAgICAgODogXCJvbiBnZXR0aW5nIHNlcnZpY2VzXCIsXG4gICAgICA5OiBcIm9uIGdldHRpbmcgY2hhcmFjdGVyaXN0aWNcIixcbiAgICAgIDEwOiBcIm9uIHdyaXRpbmcgY2hhcmFjdGVyaXN0aWNcIixcbiAgICAgIDExOiBcIm9uIHJlYWRpbmcgY2hhcmFjdGVyaXN0aWNcIixcbiAgICAgIDE0OiBcIm9uIGdldHRpbmcgZGVzY3JpcHRvclwiLFxuICAgICAgMTU6IFwib24gd3JpdGluZyBkZXNjcmlwdG9yXCIsXG4gICAgICAxNjogXCJvbiByZWFkaW5nIGRlc2NyaXB0b3JcIixcbiAgICAgIDIwOiBcIm9uIHN0YXJ0IHBoZXJpcGhlcmFsXCIsXG4gICAgICAyMTogXCJvbiBub3RpZnkgY29ubmVjdFwiLFxuICAgICAgMjI6IFwib24gYWRkaW5nIHNlcnZpY2VcIixcbiAgICAgIDIzOiBcIm9uIGFkZGluZyBjaGFyYWN0ZXJpc3RpY1wiLFxuICAgICAgMjQ6IFwib24gYWRkaW5nIGRlc2NyaXB0b3JcIixcbiAgICAgIDI1OiBcIm9uIHdyaXRpbmcgY2hhcmFjdGVyaXN0aWNcIixcbiAgICAgIDI2OiBcIm9uIHJlYWRpbmcgY2hhcmFjdGVyaXN0aWNcIixcbiAgICAgIDI3OiBcIm9uIHdyaXRpbmcgY2hhcmFjdGVyaXN0aWMgZnJvbSByZW1vdGVcIixcbiAgICAgIDI4OiBcIm9uIHJlYWRpbmcgY2hhcmFjdGVyaXN0aWMgZnJvbSByZW1vdGVcIixcbiAgICAgIDI5OiBcIm9uIHdyaXRpbmcgZGVzY3JpcHRvclwiLFxuICAgICAgMzA6IFwib24gcmVhZGluZyBkZXNjcmlwdG9yXCIsXG4gICAgICAzMTogXCJvbiB3cml0aW5nIGRlc2NyaXB0b3IgZnJvbSByZW1vdGVcIixcbiAgICAgIDMyOiBcIm9uIHJlYWRpbmcgZGVzY3JpcHRvciBmcm9tIHJlbW90ZVwiLFxuICAgICAgMzM6IFwib24gbm90aWZ5IGNoYXJhY3RlcmlzdGljXCIsXG4gICAgICAzNDogXCJvbiBzdGFydC9zdG9wIHNlcnZpY2VcIixcbiAgICAgIDM1OiBcIm9uIHNldCBzZWN1cml0eSBhdXRoIHBhcmFtXCIsXG4gICAgICAzNjogXCJvbiBzZXQgc2VjdXJpdHkgZW5jcnlwdGlvbiBsZXZlbCBwYXJhbVwiLFxuICAgICAgMzc6IFwib24gc2V0IHNlY3VyaXR5IGtleSB0eXBlIHBhcmFtXCIsXG4gICAgICAzODogXCJvbiBzZXQgc2VjdXJpdHkga2V5IHNpemUgcGFyYW1cIixcbiAgICAgIDM5OiBcIm9uIHNldCBzZWN1cml0eSBpbyBjYXBhYmlsaXR5XCIsXG4gICAgICA0MDogXCJvbiBjbGVhciBib25kaW5nIGRldmljZXMgbGlzdFwiLFxuICAgIH07XG5cbiAgICByZXN1bHRzLm1lc3NhZ2UgPVxuICAgICAgZXJyb3JNZXNzYWdlW3Jlc3VsdHMuZXJyb3JfY29kZV0gK1xuICAgICAgXCIgXCIgK1xuICAgICAgZnVuY3Rpb25NZXNzYWdlW3Jlc3VsdHMuZnVuY3Rpb25fY29kZV07XG5cbiAgICB0aGlzLmVudmVsb3BFcnJvcihvYmpUb1NlbmQsIFwiYmxlXCIsIHJlc3VsdHMpO1xuICB9XG5cbiAgcHVibGljIF9hZGRSb3dGb3JQYXRoKHNlbmRPYmo6IGFueSwgcGF0aDogYW55LCByb3c6IGFueSkge1xuICAgIGNvbnN0IGtleXM6IGFueSA9IHBhdGguc3BsaXQoXCIuXCIpO1xuICAgIGxldCB0YXJnZXQ6IGFueSA9IHNlbmRPYmo7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGtleXMubGVuZ3RoIC0gMTsgaW5kZXgrKykge1xuICAgICAgdGFyZ2V0W2tleXNbaW5kZXhdXSA9IHRhcmdldFtrZXlzW2luZGV4XV0gfHwge307XG4gICAgICB0YXJnZXQgPSB0YXJnZXRba2V5c1tpbmRleF1dO1xuICAgIH1cbiAgICB0YXJnZXRba2V5c1trZXlzLmxlbmd0aCAtIDFdXSA9IHJvdztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXU0NvbW1hbmRCbGU7XG4iXX0=
