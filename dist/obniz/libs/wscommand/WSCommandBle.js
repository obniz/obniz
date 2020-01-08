"use strict";
const JsonBinaryConverter = require('./jsonBinaryConverter');
const WSCommand = require('./WSCommand.js').default;
const WSCommandBleHci = require('./WSCommandBleHci');
class WSCommandBle extends WSCommand {
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
            0x01: 'bonding',
            0x04: 'mitm',
            0x08: 'secure_connection',
        };
        this._securityEncryotionLevels = {
            none: 0x01,
            encryption: 0x02,
            mitm: 0x03,
        };
        this._securityKeyTypes = {
            0x01: 'ltk',
            0x02: 'irk',
            0x04: 'csrk',
        };
        this.hciCommand = new WSCommandBleHci(this);
    }
    /* CENTRAL   */
    centralScanStart(params) {
        let schema = [
            { path: 'scan.duration', length: 4, type: 'int', default: 30 },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandStartScan, buf);
    }
    centralScanStop(params) {
        this.sendCommand(this._CommandStopScan, null);
    }
    centralConnect(params) {
        let schema = [
            {
                path: 'connect.address',
                length: 6,
                type: 'hex',
                required: true,
                endianness: 'little',
            },
            { path: null, length: 1, type: 'char', default: false },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandConnect, buf);
    }
    centralDisconnect(params) {
        let schema = [
            {
                path: 'disconnect.address',
                length: 6,
                type: 'hex',
                required: true,
                endianness: 'little',
            },
            { path: null, length: 1, type: 'char', default: true },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandConnect, buf);
    }
    centralServiceGet(params) {
        let schema = [
            {
                path: 'get_services.address',
                length: 6,
                type: 'hex',
                required: true,
                endianness: 'little',
            },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandServices, buf);
    }
    centralCharacteristicGet(params) {
        let schema = [
            {
                path: 'get_characteristics.address',
                length: 6,
                type: 'hex',
                required: true,
                endianness: 'little',
            },
            {
                path: 'get_characteristics.service_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandCharacteristics, buf);
    }
    centralCharacteristicRead(params) {
        let schema = [
            {
                path: 'read_characteristic.address',
                length: 6,
                type: 'hex',
                required: true,
                endianness: 'little',
            },
            {
                path: 'read_characteristic.service_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'read_characteristic.characteristic_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandReadCharacteristics, buf);
    }
    centralCharacteristicWrite(params) {
        let schema = [
            {
                path: 'write_characteristic.address',
                length: 6,
                type: 'hex',
                required: true,
                endianness: 'little',
            },
            {
                path: 'write_characteristic.service_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'write_characteristic.characteristic_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'write_characteristic.needResponse',
                length: 1,
                type: 'char',
                default: 1,
            },
            { path: 'write_characteristic.data', length: null, type: 'dataArray' },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandWriteCharacteristics, buf);
    }
    centralCharacteristicRegisterNotify(params) {
        let schema = [
            {
                path: 'register_notify_characteristic.address',
                length: 6,
                type: 'hex',
                required: true,
                endianness: 'little',
            },
            {
                path: 'register_notify_characteristic.service_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'register_notify_characteristic.characteristic_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandRegisterNotifyCharacteristic, buf);
    }
    centralCharacteristicUnregisterNotify(params) {
        let schema = [
            {
                path: 'unregister_notify_characteristic.address',
                length: 6,
                type: 'hex',
                required: true,
                endianness: 'little',
            },
            {
                path: 'unregister_notify_characteristic.service_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'unregister_notify_characteristic.characteristic_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandUnregisterNotifyCharacteristic, buf);
    }
    centralDescriptorGet(params) {
        let schema = [
            {
                path: 'get_descriptors.address',
                length: 6,
                type: 'hex',
                required: true,
                endianness: 'little',
            },
            {
                path: 'get_descriptors.service_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'get_descriptors.characteristic_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandDescriptors, buf);
    }
    centralDescriptorRead(params) {
        let schema = [
            {
                path: 'read_descriptor.address',
                length: 6,
                type: 'hex',
                required: true,
                endianness: 'little',
            },
            {
                path: 'read_descriptor.service_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'read_descriptor.characteristic_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'read_descriptor.descriptor_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandReadDescriptor, buf);
    }
    centralDescriptorWrite(params) {
        let schema = [
            {
                path: 'write_descriptor.address',
                length: 6,
                type: 'hex',
                required: true,
                endianness: 'little',
            },
            {
                path: 'write_descriptor.service_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'write_descriptor.characteristic_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'write_descriptor.descriptor_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'write_descriptor.needResponse',
                length: 1,
                type: 'char',
                default: 1,
            },
            { path: 'write_descriptor.data', length: null, type: 'dataArray' },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
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
        let val = params.peripheral;
        let propFlags = {
            0x01: 'broadcast',
            0x02: 'read',
            0x04: 'write_without_response',
            0x08: 'write',
            0x10: 'notify',
            0x20: 'indiate',
            0x40: 'auth',
            0x80: 'ext_prop',
        };
        let permissionFlags = {
            0x001: 'read',
            0x002: 'read_encrypted',
            0x004: 'read_encrypted_mitm',
            0x010: 'write',
            0x020: 'write_encrypted',
            0x040: 'write_encrypted_mitm',
            0x080: 'write_signed',
            0x100: 'write_signed_mitm',
        };
        let schema = {
            service: {
                command: this._CommandServerAddService,
                schema: [{ path: 'uuid', length: 18, type: 'uuid', required: true }],
            },
            characteristic: {
                command: this._CommandServerAddCharacteristic,
                schema: [
                    { path: 'service_uuid', length: 18, type: 'uuid', required: true },
                    { path: 'uuid', length: 18, type: 'uuid', required: true },
                    {
                        path: 'permissions',
                        length: 2,
                        type: 'flag',
                        default: ['write', 'read'],
                        flags: permissionFlags,
                    },
                    {
                        path: 'properties',
                        length: 1,
                        type: 'flag',
                        default: ['write', 'read'],
                        flags: propFlags,
                    },
                    { path: 'data', type: 'dataArray' },
                ],
            },
            descriptor: {
                command: this._CommandServerAddDescriptor,
                schema: [
                    { path: 'service_uuid', length: 18, type: 'uuid', required: true },
                    {
                        path: 'characteristic_uuid',
                        length: 18,
                        type: 'uuid',
                        required: true,
                    },
                    { path: 'uuid', length: 18, type: 'uuid', required: true },
                    {
                        path: 'permissions',
                        length: 2,
                        type: 'flag',
                        default: ['write', 'read'],
                        flags: permissionFlags,
                    },
                    { path: 'data', type: 'dataArray' },
                ],
            },
            startService: {
                command: this._CommandServerStartStopService,
                schema: [
                    { path: 'uuid', length: 18, type: 'uuid', required: true },
                    { path: null, length: 1, type: 'char', default: 0 },
                ],
            },
        };
        let sendBufs = [];
        let startServiceBufs = [];
        let buf;
        for (let serviceIndex in val.services) {
            let service = val.services[serviceIndex];
            buf = JsonBinaryConverter.createSendBuffer(schema.service.schema, service);
            if (buf.length === 0) {
                return;
            }
            sendBufs.push({ command: schema.service.command, buffer: buf });
            buf = JsonBinaryConverter.createSendBuffer(schema.startService.schema, service);
            startServiceBufs.push({
                command: schema.startService.command,
                buffer: buf,
            });
            for (let charaIndex in service.characteristics) {
                let chara = service.characteristics[charaIndex];
                chara.service_uuid = service.uuid;
                buf = JsonBinaryConverter.createSendBuffer(schema.characteristic.schema, chara);
                if (buf.length === 0) {
                    return;
                }
                sendBufs.push({
                    command: schema.characteristic.command,
                    buffer: buf,
                });
                for (let descIndex in chara.descriptors) {
                    let desc = chara.descriptors[descIndex];
                    desc.service_uuid = service.uuid;
                    desc.characteristic_uuid = chara.uuid;
                    buf = JsonBinaryConverter.createSendBuffer(schema.descriptor.schema, desc);
                    if (buf.length === 0) {
                        return;
                    }
                    sendBufs.push({ command: schema.descriptor.command, buffer: buf });
                }
            }
        }
        for (let index in sendBufs) {
            this.sendCommand(sendBufs[index].command, sendBufs[index].buffer);
        }
        for (let index in startServiceBufs) {
            this.sendCommand(startServiceBufs[index].command, startServiceBufs[index].buffer);
        }
    }
    peripheralServiceStop(params) {
        let schema = [
            {
                path: 'peripheral.stop_service.service_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            { path: null, length: 1, type: 'char', default: 1 },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandServerStartStopService, buf);
    }
    peripheralServiceStopAll() {
        this.sendCommand(this._CommandServerStartPeripheral, new Uint8Array([1]));
    }
    peripheralCharacteristicRead(params) {
        let schema = [
            {
                path: 'peripheral.read_characteristic.service_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'peripheral.read_characteristic.characteristic_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandServerReadCharavteristicValue, buf);
    }
    peripheralCharacteristicWrite(params) {
        let schema = [
            {
                path: 'peripheral.write_characteristic.service_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'peripheral.write_characteristic.characteristic_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            { path: 'peripheral.write_characteristic.data', type: 'dataArray' },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandServerWriteCharavteristicValue, buf);
    }
    peripheralCharacteristicNotify(params) {
        let schema = [
            {
                path: 'peripheral.notify_characteristic.service_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'peripheral.notify_characteristic.characteristic_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandServerNotifyCharavteristic, buf);
    }
    peripheralDescriptorRead(params) {
        let schema = [
            {
                path: 'peripheral.read_descriptor.service_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'peripheral.read_descriptor.characteristic_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'peripheral.read_descriptor.descriptor_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandServerReadDescriptorValue, buf);
    }
    peripheralDescriptorWrite(params) {
        let schema = [
            {
                path: 'peripheral.write_descriptor.service_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'peripheral.write_descriptor.characteristic_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            {
                path: 'peripheral.write_descriptor.descriptor_uuid',
                length: 18,
                type: 'uuid',
                required: true,
            },
            { path: 'peripheral.write_descriptor.data', type: 'dataArray' },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandServerWriteDescriptorValue, buf);
    }
    securityAuth(params) {
        let schema = [
            {
                path: 'security.auth',
                type: 'flag',
                length: 1,
                required: true,
                flags: this._securityAuthValues,
            },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandSecuritySetAuth, buf);
    }
    securityIndicateLevel(params) {
        let schema = [
            {
                path: 'security.indicate_security_level',
                type: 'char',
                length: 1,
                required: true,
            },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandSecuritySetEncryptionLevel, buf);
    }
    securityKeyType(params) {
        let schema = [
            {
                path: 'security.key.type',
                type: 'flag',
                length: 1,
                required: true,
                flags: this._securityKeyTypes,
            },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandSecuritySetEnableKeyTypes, buf);
    }
    securityKeySize(params) {
        let schema = [
            {
                path: 'security.key.max_size',
                type: 'char',
                length: 1,
                required: true,
            },
        ];
        let buf = JsonBinaryConverter.createSendBuffer(schema, params);
        this.sendCommand(this._CommandSecuritySetKeyMaxSize, buf);
    }
    clearBondingDevicesList(params) {
        let buf = new Uint8Array([]); //noting to send
        this.sendCommand(this._CommandSecurityClearBondingDevices, buf);
    }
    parseFromJson(json) {
        let module = json.ble;
        if (module === undefined) {
            return;
        }
        let schemaData = [
            {
                uri: '/request/ble/central/scan_start',
                onValid: this.centralScanStart,
            },
            { uri: '/request/ble/central/scan_stop', onValid: this.centralScanStop },
            { uri: '/request/ble/central/connect', onValid: this.centralConnect },
            {
                uri: '/request/ble/central/disconnect',
                onValid: this.centralDisconnect,
            },
            {
                uri: '/request/ble/central/service_get',
                onValid: this.centralServiceGet,
            },
            {
                uri: '/request/ble/central/characteristic_get',
                onValid: this.centralCharacteristicGet,
            },
            {
                uri: '/request/ble/central/characteristic_read',
                onValid: this.centralCharacteristicRead,
            },
            {
                uri: '/request/ble/central/characteristic_write',
                onValid: this.centralCharacteristicWrite,
            },
            {
                uri: '/request/ble/central/characteristic_register_notify',
                onValid: this.centralCharacteristicRegisterNotify,
            },
            {
                uri: '/request/ble/central/characteristic_unregister_notify',
                onValid: this.centralCharacteristicUnregisterNotify,
            },
            {
                uri: '/request/ble/central/descriptor_get',
                onValid: this.centralDescriptorGet,
            },
            {
                uri: '/request/ble/central/descriptor_read',
                onValid: this.centralDescriptorRead,
            },
            {
                uri: '/request/ble/central/descriptor_write',
                onValid: this.centralDescriptorWrite,
            },
            {
                uri: '/request/ble/peripheral/advertisement_start',
                onValid: this.peripheralAdvertisementStart,
            },
            {
                uri: '/request/ble/peripheral/advertisement_stop',
                onValid: this.peripheralAdvertisementStop,
            },
            {
                uri: '/request/ble/peripheral/service_start',
                onValid: this.peripheralServiceStart,
            },
            {
                uri: '/request/ble/peripheral/service_stop',
                onValid: this.peripheralServiceStop,
            },
            {
                uri: '/request/ble/peripheral/service_stop_all',
                onValid: this.peripheralServiceStopAll,
            },
            {
                uri: '/request/ble/peripheral/characteristic_read',
                onValid: this.peripheralCharacteristicRead,
            },
            {
                uri: '/request/ble/peripheral/characteristic_write',
                onValid: this.peripheralCharacteristicWrite,
            },
            {
                uri: '/request/ble/peripheral/characteristic_notify',
                onValid: this.peripheralCharacteristicNotify,
            },
            {
                uri: '/request/ble/peripheral/descriptor_read',
                onValid: this.peripheralDescriptorRead,
            },
            {
                uri: '/request/ble/peripheral/descriptor_write',
                onValid: this.peripheralDescriptorWrite,
            },
            {
                uri: '/request/ble/security/auth',
                onValid: this.securityAuth,
            },
            {
                uri: '/request/ble/security/indicate_security_level',
                onValid: this.securityIndicateLevel,
            },
            {
                uri: '/request/ble/security/key_type',
                onValid: this.securityKeyType,
            },
            {
                uri: '/request/ble/security/key_max_size',
                onValid: this.securityKeySize,
            },
            {
                uri: '/request/ble/security/devices_clear',
                onValid: this.clearBondingDevicesList,
            },
        ];
        schemaData.push(...this.hciCommand.schemaData());
        let res = this.validateCommandSchema(schemaData, module, 'ble');
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
        let funcList = {};
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
            let schema = [
                {
                    name: 'event_type',
                    type: 'enum',
                    length: 1,
                    enum: this._CommandScanResultsEvet,
                },
                { name: 'address', type: 'hex', length: 6, endianness: 'little' },
                {
                    name: 'device_type',
                    type: 'enum',
                    length: 1,
                    enum: this._CommandScanResultsDevice,
                },
                {
                    name: 'address_type',
                    type: 'enum',
                    length: 1,
                    enum: this._CommandScanResultsDeviceAddress,
                },
                {
                    name: 'ble_event_type',
                    type: 'enum',
                    length: 1,
                    enum: this._CommandScanResultsBleEvent,
                },
                { name: 'rssi', type: 'signed number', length: 4 },
                { name: 'adv_data', type: 'dataArray', length: 31 * 2 },
                { name: 'flag', type: 'number', length: 4 },
                { name: 'num_response', type: 'number', length: 4 },
                { name: 'advertise_length', type: 'number', length: 1 },
                { name: 'scan_response_length', type: 'number', length: 1 },
            ];
            let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
            results.scan_resp = results.adv_data.slice(results.advertise_length, results.advertise_length + results.scan_response_length);
            results.adv_data = results.adv_data.slice(0, results.advertise_length);
            delete results.num_response;
            delete results.advertise_length;
            delete results.scan_response_length;
            delete results.advertise_data;
            if (results.event_type === 'inquiry_result') {
                delete results.event_type;
                this._addRowForPath(objToSend, 'ble.scan_result', results);
            }
            else if (results.event_type === 'inquiry_complete') {
                this._addRowForPath(objToSend, 'ble.scan_result_finish', true);
            }
        }
    }
    notifyFromBinaryConnect(objToSend, payload) {
        if (payload.length === 7) {
            let schema = [
                { name: 'address', type: 'hex', length: 6, endianness: 'little' },
                {
                    name: 'status',
                    type: 'enum',
                    length: 1,
                    enum: { connected: 0, disconnected: 1 },
                },
            ];
            let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
            this._addRowForPath(objToSend, 'ble.status_update', results);
        }
    }
    notifyFromBinaryServices(objToSend, payload) {
        let schema = [
            { name: 'address', type: 'hex', length: 6, endianness: 'little' },
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        if (results.service_uuid !== null) {
            this._addRowForPath(objToSend, 'ble.get_service_result', results);
        }
        else {
            delete results.service_uuid;
            this._addRowForPath(objToSend, 'ble.get_service_result_finish', results);
        }
    }
    notifyFromBinaryChacateristics(objToSend, payload) {
        let schema = [
            { name: 'address', type: 'hex', length: 6, endianness: 'little' },
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
            {
                name: 'properties',
                type: 'enum',
                length: 1,
                enum: this._CommandCharacteristicsProperties,
                flags: true,
            },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        if (results.characteristic_uuid !== null) {
            this._addRowForPath(objToSend, 'ble.get_characteristic_result', results);
        }
        else {
            delete results.characteristic_uuid;
            delete results.properties;
            this._addRowForPath(objToSend, 'ble.get_characteristic_result_finish', results);
        }
    }
    notifyFromBinaryReadChacateristics(objToSend, payload) {
        let schema = [
            { name: 'address', type: 'hex', length: 6, endianness: 'little' },
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'result', type: 'int', length: 1 },
            { name: 'data', type: 'dataArray', length: null },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        results.result =
            results.result === this._commandResults.success ? 'success' : 'failed';
        this._addRowForPath(objToSend, 'ble.read_characteristic_result', results);
    }
    notifyFromBinaryWriteChacateristics(objToSend, payload) {
        let schema = [
            { name: 'address', type: 'hex', length: 6, endianness: 'little' },
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'result', type: 'int', length: 1 },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        results.result =
            results.result === this._commandResults.success ? 'success' : 'failed';
        this._addRowForPath(objToSend, 'ble.write_characteristic_result', results);
    }
    notifyFromBinaryRegisterNotifyChacateristic(objToSend, payload) {
        let schema = [
            { name: 'address', type: 'hex', length: 6, endianness: 'little' },
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'result', type: 'int', length: 1 },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        results.result =
            results.result === this._commandResults.success ? 'success' : 'failed';
        this._addRowForPath(objToSend, 'ble.register_notify_characteristic_result', results);
    }
    notifyFromBinaryUnregisterNotifyChacateristic(objToSend, payload) {
        let schema = [
            { name: 'address', type: 'hex', length: 6, endianness: 'little' },
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'result', type: 'int', length: 1 },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        results.result =
            results.result === this._commandResults.success ? 'success' : 'failed';
        this._addRowForPath(objToSend, 'ble.unregister_notify_characteristic_result', results);
    }
    notifyFromBinaryNotifyChacateristic(objToSend, payload) {
        let schema = [
            { name: 'address', type: 'hex', length: 6, endianness: 'little' },
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'is_notify', type: 'int', length: 1 },
            { name: 'data', type: 'dataArray', length: null },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        results.is_notify = results.is_notify === 1;
        this._addRowForPath(objToSend, 'ble.notify_characteristic', results);
    }
    notifyFromBinaryDescriptors(objToSend, payload) {
        let schema = [
            { name: 'address', type: 'hex', length: 6, endianness: 'little' },
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        if (results.descriptor_uuid !== null) {
            this._addRowForPath(objToSend, 'ble.get_descriptor_result', results);
        }
        else {
            delete results.descriptor_uuid;
            this._addRowForPath(objToSend, 'ble.get_descriptor_result_finish', results);
        }
    }
    notifyFromBinaryReadDescriptor(objToSend, payload) {
        let schema = [
            { name: 'address', type: 'hex', length: 6, endianness: 'little' },
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'result', type: 'int', length: 1 },
            { name: 'data', type: 'dataArray', length: null },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        results.result =
            results.result === this._commandResults.success ? 'success' : 'failed';
        this._addRowForPath(objToSend, 'ble.read_descriptor_result', results);
    }
    notifyFromBinaryWriteDescriptor(objToSend, payload) {
        let schema = [
            { name: 'address', type: 'hex', length: 6, endianness: 'little' },
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'result', type: 'int', length: 1 },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        results.result =
            results.result === this._commandResults.success ? 'success' : 'failed';
        this._addRowForPath(objToSend, 'ble.write_descriptor_result', results);
    }
    notifyFromBinaryServerConnectionState(objToSend, payload) {
        let schema = [
            { name: 'address', type: 'hex', length: 6, endianness: 'little' },
            {
                name: 'status',
                type: 'enum',
                length: 1,
                enum: { connected: 1, disconnected: 0 },
            },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        this._addRowForPath(objToSend, 'ble.peripheral.connection_status', results);
    }
    notifyFromBinaryServerWriteCharavteristicValue(objToSend, payload) {
        let schema = [
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'result', type: 'int', length: 1 },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        results.result =
            results.result === this._commandResults.success ? 'success' : 'failed';
        this._addRowForPath(objToSend, 'ble.peripheral.write_characteristic_result', results);
    }
    notifyFromBinaryServerReadCharavteristicValue(objToSend, payload) {
        let schema = [
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'data', type: 'dataArray', length: null },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        results.result = 'success'; //always success
        this._addRowForPath(objToSend, 'ble.peripheral.read_characteristic_result', results);
    }
    notifyFromBinaryServerNotifyReadCharavteristicValue(objToSend, payload) {
        let schema = [
            { name: 'address', type: 'hex', length: 6, endianness: 'little' },
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        this._addRowForPath(objToSend, 'ble.peripheral.notify_read_characteristic', results);
    }
    notifyFromBinaryServerNotifyWriteCharavteristicValue(objToSend, payload) {
        let schema = [
            { name: 'address', type: 'hex', length: 6, endianness: 'little' },
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'data', type: 'dataArray', length: null },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        this._addRowForPath(objToSend, 'ble.peripheral.notify_write_characteristic', results);
    }
    notifyFromBinaryServerReadDescriptorValue(objToSend, payload) {
        let schema = [
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'data', type: 'dataArray', length: null },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        results.result = 'success'; //always success
        this._addRowForPath(objToSend, 'ble.peripheral.read_descriptor_result', results);
    }
    notifyFromBinaryServerWriteDescriptorValue(objToSend, payload) {
        let schema = [
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'result', type: 'int', length: 1 },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        results.result =
            results.result === this._commandResults.success ? 'success' : 'failed';
        this._addRowForPath(objToSend, 'ble.peripheral.write_descriptor_result', results);
    }
    notifyFromBinaryServerNotifyReadDescriptorValue(objToSend, payload) {
        let schema = [
            { name: 'address', type: 'hex', length: 6, endianness: 'little' },
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        this._addRowForPath(objToSend, 'ble.peripheral.notify_read_descriptor', results);
    }
    notifyFromBinaryServerNotifyWriteDescriptorValue(objToSend, payload) {
        let schema = [
            { name: 'address', type: 'hex', length: 6, endianness: 'little' },
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'data', type: 'dataArray', length: null },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        this._addRowForPath(objToSend, 'ble.peripheral.notify_write_descriptor', results);
    }
    notifyFromBinaryError(objToSend, payload) {
        let schema = [
            { name: 'module_error_code', type: 'char', length: 1 },
            { name: 'error_code', type: 'char', length: 1 },
            { name: 'function_code', type: 'char', length: 1 },
            { name: 'address', type: 'hex', length: 6, endianness: 'little' },
            { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
            { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
        ];
        let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
        let errorMessage = {
            0x00: 'no error',
            0x01: 'device not connected',
            0x02: 'service not found',
            0x03: 'charavteristic not found',
            0x04: 'descriptor not found',
            0x05: 'no permission',
            0x06: 'device not found',
            0x07: 'ble is busy',
            0x08: 'service already running',
            0x09: 'security param are already set',
            0xff: 'error',
        };
        let functionMessage = {
            0: 'on setting advertisement data',
            1: 'on setting scan response data',
            2: 'on starting advertisement',
            3: 'on stopping advertisement',
            4: 'on starting scan',
            5: 'on stoping scan',
            6: '',
            7: 'on connecting device',
            8: 'on getting services',
            9: 'on getting characteristic',
            10: 'on writing characteristic',
            11: 'on reading characteristic',
            14: 'on getting descriptor',
            15: 'on writing descriptor',
            16: 'on reading descriptor',
            20: 'on start pheripheral',
            21: 'on notify connect',
            22: 'on adding service',
            23: 'on adding characteristic',
            24: 'on adding descriptor',
            25: 'on writing characteristic',
            26: 'on reading characteristic',
            27: 'on writing characteristic from remote',
            28: 'on reading characteristic from remote',
            29: 'on writing descriptor',
            30: 'on reading descriptor',
            31: 'on writing descriptor from remote',
            32: 'on reading descriptor from remote',
            33: 'on notify characteristic',
            34: 'on start/stop service',
            35: 'on set security auth param',
            36: 'on set security encryption level param',
            37: 'on set security key type param',
            38: 'on set security key size param',
            39: 'on set security io capability',
            40: 'on clear bonding devices list',
        };
        results.message =
            errorMessage[results.error_code] +
                ' ' +
                functionMessage[results.function_code];
        this.envelopError(objToSend, 'ble', results);
    }
    _addRowForPath(sendObj, path, row) {
        let keys = path.split('.');
        let target = sendObj;
        for (let index = 0; index < keys.length - 1; index++) {
            target[keys[index]] = target[keys[index]] || {};
            target = target[keys[index]];
        }
        target[keys[keys.length - 1]] = row;
    }
}
module.exports = WSCommandBle;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL3dzY29tbWFuZC9XU0NvbW1hbmRCbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDN0QsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDO0FBQ3BELE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBRXJELE1BQU0sWUFBYSxTQUFRLFNBQVM7SUFDbEM7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWpCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUV6QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLDRCQUE0QixHQUFHLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsMkJBQTJCLEdBQUcsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxvQ0FBb0MsR0FBRyxF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QyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoRCxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3RDLENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDIiwiZmlsZSI6Im9ibml6L2xpYnMvd3Njb21tYW5kL1dTQ29tbWFuZEJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEpzb25CaW5hcnlDb252ZXJ0ZXIgPSByZXF1aXJlKCcuL2pzb25CaW5hcnlDb252ZXJ0ZXInKTtcbmNvbnN0IFdTQ29tbWFuZCA9IHJlcXVpcmUoJy4vV1NDb21tYW5kLmpzJykuZGVmYXVsdDtcbmNvbnN0IFdTQ29tbWFuZEJsZUhjaSA9IHJlcXVpcmUoJy4vV1NDb21tYW5kQmxlSGNpJyk7XG5cbmNsYXNzIFdTQ29tbWFuZEJsZSBleHRlbmRzIFdTQ29tbWFuZCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5tb2R1bGUgPSAxMTtcblxuICAgIHRoaXMudXVpZExlbmd0aCA9IDE2ICsgMjtcblxuICAgIHRoaXMuX0NvbW1hbmRTZXRBZHZEYXRhID0gMDtcbiAgICB0aGlzLl9Db21tYW5kU2V0U2NhblJlc3BEYXRhID0gMTtcbiAgICB0aGlzLl9Db21tYW5kU3RhcnRBZHYgPSAyO1xuICAgIHRoaXMuX0NvbW1hbmRTdG9wQWR2ID0gMztcbiAgICB0aGlzLl9Db21tYW5kU2NhbiA9IDQ7XG4gICAgdGhpcy5fQ29tbWFuZFN0YXJ0U2NhbiA9IDQ7XG4gICAgdGhpcy5fQ29tbWFuZFN0b3BTY2FuID0gNTtcbiAgICB0aGlzLl9Db21tYW5kU2NhblJlc3VsdHMgPSA2O1xuICAgIHRoaXMuX0NvbW1hbmRDb25uZWN0ID0gNztcbiAgICB0aGlzLl9Db21tYW5kU2VydmljZXMgPSA4O1xuICAgIHRoaXMuX0NvbW1hbmRDaGFyYWN0ZXJpc3RpY3MgPSA5O1xuICAgIHRoaXMuX0NvbW1hbmRXcml0ZUNoYXJhY3RlcmlzdGljcyA9IDEwO1xuICAgIHRoaXMuX0NvbW1hbmRSZWFkQ2hhcmFjdGVyaXN0aWNzID0gMTE7XG4gICAgdGhpcy5fQ29tbWFuZFJlZ2lzdGVyTm90aWZ5Q2hhcmFjdGVyaXN0aWMgPSAxMjtcbiAgICB0aGlzLl9Db21tYW5kVW5yZWdpc3Rlck5vdGlmeUNoYXJhY3RlcmlzdGljID0gMTM7XG4gICAgdGhpcy5fQ29tbWFuZERlc2NyaXB0b3JzID0gMTQ7XG4gICAgdGhpcy5fQ29tbWFuZFdyaXRlRGVzY3JpcHRvciA9IDE1O1xuICAgIHRoaXMuX0NvbW1hbmRSZWFkRGVzY3JpcHRvciA9IDE2O1xuICAgIHRoaXMuX0NvbW1hbmROb3RpZnlDaGFyYWN0ZXJpc3RpYyA9IDE3O1xuXG4gICAgdGhpcy5fQ29tbWFuZFNldERldmljZU5hbWUgPSAxOTtcbiAgICB0aGlzLl9Db21tYW5kU2VydmVyU3RhcnRQZXJpcGhlcmFsID0gMjA7XG4gICAgdGhpcy5fQ29tbWFuZFNlcnZlck5vdGlmeUNvbm5lY3QgPSAyMTtcbiAgICB0aGlzLl9Db21tYW5kU2VydmVyQWRkU2VydmljZSA9IDIyO1xuICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJBZGRDaGFyYWN0ZXJpc3RpYyA9IDIzO1xuICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJBZGREZXNjcmlwdG9yID0gMjQ7XG4gICAgdGhpcy5fQ29tbWFuZFNlcnZlcldyaXRlQ2hhcmF2dGVyaXN0aWNWYWx1ZSA9IDI1O1xuICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJSZWFkQ2hhcmF2dGVyaXN0aWNWYWx1ZSA9IDI2O1xuICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJOb3RpZnlXcml0ZUNoYXJhdnRlcmlzdGljVmFsdWUgPSAyNztcbiAgICB0aGlzLl9Db21tYW5kU2VydmVyTm90aWZ5UmVhZENoYXJhdnRlcmlzdGljVmFsdWUgPSAyODtcbiAgICB0aGlzLl9Db21tYW5kU2VydmVyV3JpdGVEZXNjcmlwdG9yVmFsdWUgPSAyOTtcbiAgICB0aGlzLl9Db21tYW5kU2VydmVyUmVhZERlc2NyaXB0b3JWYWx1ZSA9IDMwO1xuICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJOb3RpZnlXcml0ZURlc2NyaXB0b3JWYWx1ZSA9IDMxO1xuICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJOb3RpZnlSZWFkRGVzY3JpcHRvclZhbHVlID0gMzI7XG4gICAgdGhpcy5fQ29tbWFuZFNlcnZlck5vdGlmeUNoYXJhdnRlcmlzdGljID0gMzM7XG4gICAgdGhpcy5fQ29tbWFuZFNlcnZlclN0YXJ0U3RvcFNlcnZpY2UgPSAzNDtcblxuICAgIHRoaXMuX0NvbW1hbmRTZWN1cml0eVNldEF1dGggPSAzNTtcbiAgICB0aGlzLl9Db21tYW5kU2VjdXJpdHlTZXRFbmNyeXB0aW9uTGV2ZWwgPSAzNjtcbiAgICB0aGlzLl9Db21tYW5kU2VjdXJpdHlTZXRFbmFibGVLZXlUeXBlcyA9IDM3O1xuICAgIHRoaXMuX0NvbW1hbmRTZWN1cml0eVNldEtleU1heFNpemUgPSAzODtcbiAgICB0aGlzLl9Db21tYW5kU2VjdXJpdHlTZXRJT0NhcGFiaWxpdHkgPSAzOTtcbiAgICB0aGlzLl9Db21tYW5kU2VjdXJpdHlDbGVhckJvbmRpbmdEZXZpY2VzID0gNDA7XG5cbiAgICB0aGlzLl9Db21tYW5kU2NhblJlc3VsdHNEZXZpY2UgPSB7XG4gICAgICBicmVkZXI6IDB4MDEsXG4gICAgICBibGU6IDB4MDIsXG4gICAgICBkdW1vOiAweDAzLFxuICAgIH07XG5cbiAgICAvLy8gQkxFIGRldmljZSBhZGRyZXNzIHR5cGVcbiAgICB0aGlzLl9Db21tYW5kU2NhblJlc3VsdHNEZXZpY2VBZGRyZXNzID0ge1xuICAgICAgcHVibGljOiAweDAwLFxuICAgICAgcmFuZG9tOiAweDAxLFxuICAgICAgcnBhX3B1YmxpYzogMHgwMixcbiAgICAgIHJwYV9yYW5kb206IDB4MDMsXG4gICAgfTtcblxuICAgIHRoaXMuX0NvbW1hbmRTY2FuUmVzdWx0c0V2ZXQgPSB7XG4gICAgICBpbnF1aXJ5X3Jlc3VsdDogMCAvKiE8IElucXVpcnkgcmVzdWx0IGZvciBhIHBlZXIgZGV2aWNlLiAqLyxcbiAgICAgIGlucXVpcnlfY29tcGxldGU6IDEgLyohPCBJbnF1aXJ5IGNvbXBsZXRlLiAqLyxcbiAgICAgIGRpc2NvdmVyeV9yZXN1bHQ6IDIgLyohPCBEaXNjb3ZlcnkgcmVzdWx0IGZvciBhIHBlZXIgZGV2aWNlLiAqLyxcbiAgICAgIGRpc2NvdmVyeV9ibGVfcmVzdWx0OiAzIC8qITwgRGlzY292ZXJ5IHJlc3VsdCBmb3IgQkxFIEdBVFQgYmFzZWQgc2VydmljZSBvbiBhIHBlZXIgZGV2aWNlLiAqLyxcbiAgICAgIGRpc2NvdmVyeV9jbW9wbGV0ZTogNCAvKiE8IERpc2NvdmVyeSBjb21wbGV0ZS4gKi8sXG4gICAgICBkaXNjb3ZlcnlfZGlfY21vcGxldGU6IDUgLyohPCBEaXNjb3ZlcnkgY29tcGxldGUuICovLFxuICAgICAgY2FuY2VsbGVkOiA2IC8qITwgU2VhcmNoIGNhbmNlbGxlZCAqLyxcbiAgICB9O1xuXG4gICAgdGhpcy5fQ29tbWFuZFNjYW5SZXN1bHRzQmxlRXZlbnQgPSB7XG4gICAgICBjb25uZWN0YWJsZV9hZHZlcnRpc2VtbnQ6IDB4MDAgLyohPCBDb25uZWN0YWJsZSB1bmRpcmVjdGVkIGFkdmVydGlzaW5nIChBRFZfSU5EKSAqLyxcbiAgICAgIGNvbm5lY3RhYmxlX2RpcmVjdGVkX2FkdmVydGlzZW1udDogMHgwMSAvKiE8IENvbm5lY3RhYmxlIGRpcmVjdGVkIGFkdmVydGlzaW5nIChBRFZfRElSRUNUX0lORCkgKi8sXG4gICAgICBzY2FubmFibGVfYWR2ZXJ0aXNpbmc6IDB4MDIgLyohPCBTY2FubmFibGUgdW5kaXJlY3RlZCBhZHZlcnRpc2luZyAoQURWX1NDQU5fSU5EKSAqLyxcbiAgICAgIG5vbl9jb25uZWN0YWJsZV9hZHZlcnRpc2luZzogMHgwMyAvKiE8IE5vbiBjb25uZWN0YWJsZSB1bmRpcmVjdGVkIGFkdmVydGlzaW5nIChBRFZfTk9OQ09OTl9JTkQpICovLFxuICAgICAgc2Nhbl9yZXNwb25zZTogMHgwNCAvKiE8IFNjYW4gUmVzcG9uc2UgKFNDQU5fUlNQKSAqLyxcbiAgICB9O1xuXG4gICAgdGhpcy5fQ29tbWFuZENoYXJhY3RlcmlzdGljc1Byb3BlcnRpZXMgPSB7XG4gICAgICBicm9hZGNhc3Q6IDB4MDEsXG4gICAgICByZWFkOiAweDAyLFxuICAgICAgd3JpdGVfd2l0aG91dF9yZXNwb25zZTogMHgwNCxcbiAgICAgIHdyaXRlOiAweDA4LFxuICAgICAgbm90aWZ5OiAweDEwLFxuICAgICAgaW5kaWNhdGU6IDB4MjAsXG4gICAgICBhdXRoOiAweDQwLFxuICAgICAgZXh0ZW5kZWRfcHJvcGVydGllczogMHg4MCxcbiAgICB9O1xuXG4gICAgdGhpcy5fY29tbWFuZFJlc3VsdHMgPSB7XG4gICAgICBzdWNjZXNzOiAwLFxuICAgICAgZmFpbGVkOiAxLFxuICAgIH07XG5cbiAgICB0aGlzLl9zZWN1cml0eUF1dGhWYWx1ZXMgPSB7XG4gICAgICAweDAxOiAnYm9uZGluZycsXG4gICAgICAweDA0OiAnbWl0bScsXG4gICAgICAweDA4OiAnc2VjdXJlX2Nvbm5lY3Rpb24nLFxuICAgIH07XG4gICAgdGhpcy5fc2VjdXJpdHlFbmNyeW90aW9uTGV2ZWxzID0ge1xuICAgICAgbm9uZTogMHgwMSxcbiAgICAgIGVuY3J5cHRpb246IDB4MDIsXG4gICAgICBtaXRtOiAweDAzLFxuICAgIH07XG5cbiAgICB0aGlzLl9zZWN1cml0eUtleVR5cGVzID0ge1xuICAgICAgMHgwMTogJ2x0aycsXG4gICAgICAweDAyOiAnaXJrJyxcbiAgICAgIDB4MDQ6ICdjc3JrJyxcbiAgICB9O1xuXG4gICAgdGhpcy5oY2lDb21tYW5kID0gbmV3IFdTQ29tbWFuZEJsZUhjaSh0aGlzKTtcbiAgfVxuXG4gIC8qIENFTlRSQUwgICAqL1xuXG4gIGNlbnRyYWxTY2FuU3RhcnQocGFyYW1zKSB7XG4gICAgbGV0IHNjaGVtYSA9IFtcbiAgICAgIHsgcGF0aDogJ3NjYW4uZHVyYXRpb24nLCBsZW5ndGg6IDQsIHR5cGU6ICdpbnQnLCBkZWZhdWx0OiAzMCB9LFxuICAgIF07XG4gICAgbGV0IGJ1ZiA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihzY2hlbWEsIHBhcmFtcyk7XG4gICAgdGhpcy5zZW5kQ29tbWFuZCh0aGlzLl9Db21tYW5kU3RhcnRTY2FuLCBidWYpO1xuICB9XG5cbiAgY2VudHJhbFNjYW5TdG9wKHBhcmFtcykge1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZFN0b3BTY2FuLCBudWxsKTtcbiAgfVxuXG4gIGNlbnRyYWxDb25uZWN0KHBhcmFtcykge1xuICAgIGxldCBzY2hlbWEgPSBbXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdjb25uZWN0LmFkZHJlc3MnLFxuICAgICAgICBsZW5ndGg6IDYsXG4gICAgICAgIHR5cGU6ICdoZXgnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgZW5kaWFubmVzczogJ2xpdHRsZScsXG4gICAgICB9LFxuICAgICAgeyBwYXRoOiBudWxsLCBsZW5ndGg6IDEsIHR5cGU6ICdjaGFyJywgZGVmYXVsdDogZmFsc2UgfSwgLy9jb25zdCB2YWxcbiAgICBdO1xuICAgIGxldCBidWYgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZENvbm5lY3QsIGJ1Zik7XG4gIH1cblxuICBjZW50cmFsRGlzY29ubmVjdChwYXJhbXMpIHtcbiAgICBsZXQgc2NoZW1hID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiAnZGlzY29ubmVjdC5hZGRyZXNzJyxcbiAgICAgICAgbGVuZ3RoOiA2LFxuICAgICAgICB0eXBlOiAnaGV4JyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIGVuZGlhbm5lc3M6ICdsaXR0bGUnLFxuICAgICAgfSxcbiAgICAgIHsgcGF0aDogbnVsbCwgbGVuZ3RoOiAxLCB0eXBlOiAnY2hhcicsIGRlZmF1bHQ6IHRydWUgfSwgLy9jb25zdCB2YWxcbiAgICBdO1xuICAgIGxldCBidWYgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZENvbm5lY3QsIGJ1Zik7XG4gIH1cblxuICBjZW50cmFsU2VydmljZUdldChwYXJhbXMpIHtcbiAgICBsZXQgc2NoZW1hID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiAnZ2V0X3NlcnZpY2VzLmFkZHJlc3MnLFxuICAgICAgICBsZW5ndGg6IDYsXG4gICAgICAgIHR5cGU6ICdoZXgnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgZW5kaWFubmVzczogJ2xpdHRsZScsXG4gICAgICB9LFxuICAgIF07XG4gICAgbGV0IGJ1ZiA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihzY2hlbWEsIHBhcmFtcyk7XG4gICAgdGhpcy5zZW5kQ29tbWFuZCh0aGlzLl9Db21tYW5kU2VydmljZXMsIGJ1Zik7XG4gIH1cblxuICBjZW50cmFsQ2hhcmFjdGVyaXN0aWNHZXQocGFyYW1zKSB7XG4gICAgbGV0IHNjaGVtYSA9IFtcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ2dldF9jaGFyYWN0ZXJpc3RpY3MuYWRkcmVzcycsXG4gICAgICAgIGxlbmd0aDogNixcbiAgICAgICAgdHlwZTogJ2hleCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBlbmRpYW5uZXNzOiAnbGl0dGxlJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdnZXRfY2hhcmFjdGVyaXN0aWNzLnNlcnZpY2VfdXVpZCcsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6ICd1dWlkJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIF07XG4gICAgbGV0IGJ1ZiA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihzY2hlbWEsIHBhcmFtcyk7XG4gICAgdGhpcy5zZW5kQ29tbWFuZCh0aGlzLl9Db21tYW5kQ2hhcmFjdGVyaXN0aWNzLCBidWYpO1xuICB9XG5cbiAgY2VudHJhbENoYXJhY3RlcmlzdGljUmVhZChwYXJhbXMpIHtcbiAgICBsZXQgc2NoZW1hID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiAncmVhZF9jaGFyYWN0ZXJpc3RpYy5hZGRyZXNzJyxcbiAgICAgICAgbGVuZ3RoOiA2LFxuICAgICAgICB0eXBlOiAnaGV4JyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIGVuZGlhbm5lc3M6ICdsaXR0bGUnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3JlYWRfY2hhcmFjdGVyaXN0aWMuc2VydmljZV91dWlkJyxcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogJ3V1aWQnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdyZWFkX2NoYXJhY3RlcmlzdGljLmNoYXJhY3RlcmlzdGljX3V1aWQnLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiAndXVpZCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICBdO1xuICAgIGxldCBidWYgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZFJlYWRDaGFyYWN0ZXJpc3RpY3MsIGJ1Zik7XG4gIH1cblxuICBjZW50cmFsQ2hhcmFjdGVyaXN0aWNXcml0ZShwYXJhbXMpIHtcbiAgICBsZXQgc2NoZW1hID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiAnd3JpdGVfY2hhcmFjdGVyaXN0aWMuYWRkcmVzcycsXG4gICAgICAgIGxlbmd0aDogNixcbiAgICAgICAgdHlwZTogJ2hleCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBlbmRpYW5uZXNzOiAnbGl0dGxlJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICd3cml0ZV9jaGFyYWN0ZXJpc3RpYy5zZXJ2aWNlX3V1aWQnLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiAndXVpZCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3dyaXRlX2NoYXJhY3RlcmlzdGljLmNoYXJhY3RlcmlzdGljX3V1aWQnLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiAndXVpZCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3dyaXRlX2NoYXJhY3RlcmlzdGljLm5lZWRSZXNwb25zZScsXG4gICAgICAgIGxlbmd0aDogMSxcbiAgICAgICAgdHlwZTogJ2NoYXInLFxuICAgICAgICBkZWZhdWx0OiAxLFxuICAgICAgfSxcbiAgICAgIHsgcGF0aDogJ3dyaXRlX2NoYXJhY3RlcmlzdGljLmRhdGEnLCBsZW5ndGg6IG51bGwsIHR5cGU6ICdkYXRhQXJyYXknIH0sXG4gICAgXTtcbiAgICBsZXQgYnVmID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jcmVhdGVTZW5kQnVmZmVyKHNjaGVtYSwgcGFyYW1zKTtcbiAgICB0aGlzLnNlbmRDb21tYW5kKHRoaXMuX0NvbW1hbmRXcml0ZUNoYXJhY3RlcmlzdGljcywgYnVmKTtcbiAgfVxuXG4gIGNlbnRyYWxDaGFyYWN0ZXJpc3RpY1JlZ2lzdGVyTm90aWZ5KHBhcmFtcykge1xuICAgIGxldCBzY2hlbWEgPSBbXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdyZWdpc3Rlcl9ub3RpZnlfY2hhcmFjdGVyaXN0aWMuYWRkcmVzcycsXG4gICAgICAgIGxlbmd0aDogNixcbiAgICAgICAgdHlwZTogJ2hleCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBlbmRpYW5uZXNzOiAnbGl0dGxlJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdyZWdpc3Rlcl9ub3RpZnlfY2hhcmFjdGVyaXN0aWMuc2VydmljZV91dWlkJyxcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogJ3V1aWQnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdyZWdpc3Rlcl9ub3RpZnlfY2hhcmFjdGVyaXN0aWMuY2hhcmFjdGVyaXN0aWNfdXVpZCcsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6ICd1dWlkJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIF07XG4gICAgbGV0IGJ1ZiA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihzY2hlbWEsIHBhcmFtcyk7XG4gICAgdGhpcy5zZW5kQ29tbWFuZCh0aGlzLl9Db21tYW5kUmVnaXN0ZXJOb3RpZnlDaGFyYWN0ZXJpc3RpYywgYnVmKTtcbiAgfVxuXG4gIGNlbnRyYWxDaGFyYWN0ZXJpc3RpY1VucmVnaXN0ZXJOb3RpZnkocGFyYW1zKSB7XG4gICAgbGV0IHNjaGVtYSA9IFtcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3VucmVnaXN0ZXJfbm90aWZ5X2NoYXJhY3RlcmlzdGljLmFkZHJlc3MnLFxuICAgICAgICBsZW5ndGg6IDYsXG4gICAgICAgIHR5cGU6ICdoZXgnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgZW5kaWFubmVzczogJ2xpdHRsZScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAndW5yZWdpc3Rlcl9ub3RpZnlfY2hhcmFjdGVyaXN0aWMuc2VydmljZV91dWlkJyxcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogJ3V1aWQnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICd1bnJlZ2lzdGVyX25vdGlmeV9jaGFyYWN0ZXJpc3RpYy5jaGFyYWN0ZXJpc3RpY191dWlkJyxcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogJ3V1aWQnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgXTtcbiAgICBsZXQgYnVmID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jcmVhdGVTZW5kQnVmZmVyKHNjaGVtYSwgcGFyYW1zKTtcbiAgICB0aGlzLnNlbmRDb21tYW5kKHRoaXMuX0NvbW1hbmRVbnJlZ2lzdGVyTm90aWZ5Q2hhcmFjdGVyaXN0aWMsIGJ1Zik7XG4gIH1cblxuICBjZW50cmFsRGVzY3JpcHRvckdldChwYXJhbXMpIHtcbiAgICBsZXQgc2NoZW1hID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiAnZ2V0X2Rlc2NyaXB0b3JzLmFkZHJlc3MnLFxuICAgICAgICBsZW5ndGg6IDYsXG4gICAgICAgIHR5cGU6ICdoZXgnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgZW5kaWFubmVzczogJ2xpdHRsZScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAnZ2V0X2Rlc2NyaXB0b3JzLnNlcnZpY2VfdXVpZCcsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6ICd1dWlkJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAnZ2V0X2Rlc2NyaXB0b3JzLmNoYXJhY3RlcmlzdGljX3V1aWQnLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiAndXVpZCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICBdO1xuICAgIGxldCBidWYgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZERlc2NyaXB0b3JzLCBidWYpO1xuICB9XG5cbiAgY2VudHJhbERlc2NyaXB0b3JSZWFkKHBhcmFtcykge1xuICAgIGxldCBzY2hlbWEgPSBbXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdyZWFkX2Rlc2NyaXB0b3IuYWRkcmVzcycsXG4gICAgICAgIGxlbmd0aDogNixcbiAgICAgICAgdHlwZTogJ2hleCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBlbmRpYW5uZXNzOiAnbGl0dGxlJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdyZWFkX2Rlc2NyaXB0b3Iuc2VydmljZV91dWlkJyxcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogJ3V1aWQnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdyZWFkX2Rlc2NyaXB0b3IuY2hhcmFjdGVyaXN0aWNfdXVpZCcsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6ICd1dWlkJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAncmVhZF9kZXNjcmlwdG9yLmRlc2NyaXB0b3JfdXVpZCcsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6ICd1dWlkJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIF07XG4gICAgbGV0IGJ1ZiA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihzY2hlbWEsIHBhcmFtcyk7XG4gICAgdGhpcy5zZW5kQ29tbWFuZCh0aGlzLl9Db21tYW5kUmVhZERlc2NyaXB0b3IsIGJ1Zik7XG4gIH1cblxuICBjZW50cmFsRGVzY3JpcHRvcldyaXRlKHBhcmFtcykge1xuICAgIGxldCBzY2hlbWEgPSBbXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICd3cml0ZV9kZXNjcmlwdG9yLmFkZHJlc3MnLFxuICAgICAgICBsZW5ndGg6IDYsXG4gICAgICAgIHR5cGU6ICdoZXgnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgZW5kaWFubmVzczogJ2xpdHRsZScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAnd3JpdGVfZGVzY3JpcHRvci5zZXJ2aWNlX3V1aWQnLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiAndXVpZCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3dyaXRlX2Rlc2NyaXB0b3IuY2hhcmFjdGVyaXN0aWNfdXVpZCcsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6ICd1dWlkJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAnd3JpdGVfZGVzY3JpcHRvci5kZXNjcmlwdG9yX3V1aWQnLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiAndXVpZCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3dyaXRlX2Rlc2NyaXB0b3IubmVlZFJlc3BvbnNlJyxcbiAgICAgICAgbGVuZ3RoOiAxLFxuICAgICAgICB0eXBlOiAnY2hhcicsXG4gICAgICAgIGRlZmF1bHQ6IDEsXG4gICAgICB9LFxuICAgICAgeyBwYXRoOiAnd3JpdGVfZGVzY3JpcHRvci5kYXRhJywgbGVuZ3RoOiBudWxsLCB0eXBlOiAnZGF0YUFycmF5JyB9LFxuICAgIF07XG4gICAgbGV0IGJ1ZiA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihzY2hlbWEsIHBhcmFtcyk7XG4gICAgdGhpcy5zZW5kQ29tbWFuZCh0aGlzLl9Db21tYW5kV3JpdGVEZXNjcmlwdG9yLCBidWYpO1xuICB9XG5cbiAgLyogUEVSSVBIRVJBTCAgICovXG5cbiAgcGVyaXBoZXJhbEFkdmVydGlzZW1lbnRTdGFydChwYXJhbXMpIHtcbiAgICB0aGlzLnNlbmRDb21tYW5kKFxuICAgICAgdGhpcy5fQ29tbWFuZFNldEFkdkRhdGEsXG4gICAgICBuZXcgVWludDhBcnJheShwYXJhbXMuYWR2ZXJ0aXNlbWVudC5hZHZfZGF0YSlcbiAgICApO1xuXG4gICAgaWYgKHBhcmFtcy5hZHZlcnRpc2VtZW50LnNjYW5fcmVzcCkge1xuICAgICAgdGhpcy5zZW5kQ29tbWFuZChcbiAgICAgICAgdGhpcy5fQ29tbWFuZFNldFNjYW5SZXNwRGF0YSxcbiAgICAgICAgbmV3IFVpbnQ4QXJyYXkocGFyYW1zLmFkdmVydGlzZW1lbnQuc2Nhbl9yZXNwKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlbmRDb21tYW5kKHRoaXMuX0NvbW1hbmRTdGFydEFkdiwgbnVsbCk7XG4gIH1cblxuICBwZXJpcGhlcmFsQWR2ZXJ0aXNlbWVudFN0b3AocGFyYW1zKSB7XG4gICAgdGhpcy5zZW5kQ29tbWFuZCh0aGlzLl9Db21tYW5kU3RvcEFkdiwgbnVsbCk7XG4gIH1cblxuICBwZXJpcGhlcmFsU2VydmljZVN0YXJ0KHBhcmFtcykge1xuICAgIGxldCB2YWwgPSBwYXJhbXMucGVyaXBoZXJhbDtcbiAgICBsZXQgcHJvcEZsYWdzID0ge1xuICAgICAgMHgwMTogJ2Jyb2FkY2FzdCcsXG4gICAgICAweDAyOiAncmVhZCcsXG4gICAgICAweDA0OiAnd3JpdGVfd2l0aG91dF9yZXNwb25zZScsXG4gICAgICAweDA4OiAnd3JpdGUnLFxuICAgICAgMHgxMDogJ25vdGlmeScsXG4gICAgICAweDIwOiAnaW5kaWF0ZScsXG4gICAgICAweDQwOiAnYXV0aCcsXG4gICAgICAweDgwOiAnZXh0X3Byb3AnLFxuICAgIH07XG5cbiAgICBsZXQgcGVybWlzc2lvbkZsYWdzID0ge1xuICAgICAgMHgwMDE6ICdyZWFkJyxcbiAgICAgIDB4MDAyOiAncmVhZF9lbmNyeXB0ZWQnLFxuICAgICAgMHgwMDQ6ICdyZWFkX2VuY3J5cHRlZF9taXRtJyxcbiAgICAgIDB4MDEwOiAnd3JpdGUnLFxuICAgICAgMHgwMjA6ICd3cml0ZV9lbmNyeXB0ZWQnLFxuICAgICAgMHgwNDA6ICd3cml0ZV9lbmNyeXB0ZWRfbWl0bScsXG4gICAgICAweDA4MDogJ3dyaXRlX3NpZ25lZCcsXG4gICAgICAweDEwMDogJ3dyaXRlX3NpZ25lZF9taXRtJyxcbiAgICB9O1xuICAgIGxldCBzY2hlbWEgPSB7XG4gICAgICBzZXJ2aWNlOiB7XG4gICAgICAgIGNvbW1hbmQ6IHRoaXMuX0NvbW1hbmRTZXJ2ZXJBZGRTZXJ2aWNlLFxuICAgICAgICBzY2hlbWE6IFt7IHBhdGg6ICd1dWlkJywgbGVuZ3RoOiAxOCwgdHlwZTogJ3V1aWQnLCByZXF1aXJlZDogdHJ1ZSB9XSxcbiAgICAgIH0sXG4gICAgICBjaGFyYWN0ZXJpc3RpYzoge1xuICAgICAgICBjb21tYW5kOiB0aGlzLl9Db21tYW5kU2VydmVyQWRkQ2hhcmFjdGVyaXN0aWMsXG4gICAgICAgIHNjaGVtYTogW1xuICAgICAgICAgIHsgcGF0aDogJ3NlcnZpY2VfdXVpZCcsIGxlbmd0aDogMTgsIHR5cGU6ICd1dWlkJywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgICAgICAgICB7IHBhdGg6ICd1dWlkJywgbGVuZ3RoOiAxOCwgdHlwZTogJ3V1aWQnLCByZXF1aXJlZDogdHJ1ZSB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBhdGg6ICdwZXJtaXNzaW9ucycsXG4gICAgICAgICAgICBsZW5ndGg6IDIsXG4gICAgICAgICAgICB0eXBlOiAnZmxhZycsXG4gICAgICAgICAgICBkZWZhdWx0OiBbJ3dyaXRlJywgJ3JlYWQnXSxcbiAgICAgICAgICAgIGZsYWdzOiBwZXJtaXNzaW9uRmxhZ3MsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBwYXRoOiAncHJvcGVydGllcycsXG4gICAgICAgICAgICBsZW5ndGg6IDEsXG4gICAgICAgICAgICB0eXBlOiAnZmxhZycsXG4gICAgICAgICAgICBkZWZhdWx0OiBbJ3dyaXRlJywgJ3JlYWQnXSxcbiAgICAgICAgICAgIGZsYWdzOiBwcm9wRmxhZ3MsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHBhdGg6ICdkYXRhJywgdHlwZTogJ2RhdGFBcnJheScgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBkZXNjcmlwdG9yOiB7XG4gICAgICAgIGNvbW1hbmQ6IHRoaXMuX0NvbW1hbmRTZXJ2ZXJBZGREZXNjcmlwdG9yLFxuICAgICAgICBzY2hlbWE6IFtcbiAgICAgICAgICB7IHBhdGg6ICdzZXJ2aWNlX3V1aWQnLCBsZW5ndGg6IDE4LCB0eXBlOiAndXVpZCcsIHJlcXVpcmVkOiB0cnVlIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgcGF0aDogJ2NoYXJhY3RlcmlzdGljX3V1aWQnLFxuICAgICAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgICAgIHR5cGU6ICd1dWlkJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyBwYXRoOiAndXVpZCcsIGxlbmd0aDogMTgsIHR5cGU6ICd1dWlkJywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBwYXRoOiAncGVybWlzc2lvbnMnLFxuICAgICAgICAgICAgbGVuZ3RoOiAyLFxuICAgICAgICAgICAgdHlwZTogJ2ZsYWcnLFxuICAgICAgICAgICAgZGVmYXVsdDogWyd3cml0ZScsICdyZWFkJ10sXG4gICAgICAgICAgICBmbGFnczogcGVybWlzc2lvbkZsYWdzLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyBwYXRoOiAnZGF0YScsIHR5cGU6ICdkYXRhQXJyYXknIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgc3RhcnRTZXJ2aWNlOiB7XG4gICAgICAgIGNvbW1hbmQ6IHRoaXMuX0NvbW1hbmRTZXJ2ZXJTdGFydFN0b3BTZXJ2aWNlLFxuICAgICAgICBzY2hlbWE6IFtcbiAgICAgICAgICB7IHBhdGg6ICd1dWlkJywgbGVuZ3RoOiAxOCwgdHlwZTogJ3V1aWQnLCByZXF1aXJlZDogdHJ1ZSB9LFxuICAgICAgICAgIHsgcGF0aDogbnVsbCwgbGVuZ3RoOiAxLCB0eXBlOiAnY2hhcicsIGRlZmF1bHQ6IDAgfSwgLy9jb25zdCB2YWxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGxldCBzZW5kQnVmcyA9IFtdO1xuICAgIGxldCBzdGFydFNlcnZpY2VCdWZzID0gW107XG4gICAgbGV0IGJ1ZjtcbiAgICBmb3IgKGxldCBzZXJ2aWNlSW5kZXggaW4gdmFsLnNlcnZpY2VzKSB7XG4gICAgICBsZXQgc2VydmljZSA9IHZhbC5zZXJ2aWNlc1tzZXJ2aWNlSW5kZXhdO1xuICAgICAgYnVmID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jcmVhdGVTZW5kQnVmZmVyKFxuICAgICAgICBzY2hlbWEuc2VydmljZS5zY2hlbWEsXG4gICAgICAgIHNlcnZpY2VcbiAgICAgICk7XG4gICAgICBpZiAoYnVmLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZW5kQnVmcy5wdXNoKHsgY29tbWFuZDogc2NoZW1hLnNlcnZpY2UuY29tbWFuZCwgYnVmZmVyOiBidWYgfSk7XG5cbiAgICAgIGJ1ZiA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihcbiAgICAgICAgc2NoZW1hLnN0YXJ0U2VydmljZS5zY2hlbWEsXG4gICAgICAgIHNlcnZpY2VcbiAgICAgICk7XG4gICAgICBzdGFydFNlcnZpY2VCdWZzLnB1c2goe1xuICAgICAgICBjb21tYW5kOiBzY2hlbWEuc3RhcnRTZXJ2aWNlLmNvbW1hbmQsXG4gICAgICAgIGJ1ZmZlcjogYnVmLFxuICAgICAgfSk7XG5cbiAgICAgIGZvciAobGV0IGNoYXJhSW5kZXggaW4gc2VydmljZS5jaGFyYWN0ZXJpc3RpY3MpIHtcbiAgICAgICAgbGV0IGNoYXJhID0gc2VydmljZS5jaGFyYWN0ZXJpc3RpY3NbY2hhcmFJbmRleF07XG4gICAgICAgIGNoYXJhLnNlcnZpY2VfdXVpZCA9IHNlcnZpY2UudXVpZDtcbiAgICAgICAgYnVmID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jcmVhdGVTZW5kQnVmZmVyKFxuICAgICAgICAgIHNjaGVtYS5jaGFyYWN0ZXJpc3RpYy5zY2hlbWEsXG4gICAgICAgICAgY2hhcmFcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGJ1Zi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc2VuZEJ1ZnMucHVzaCh7XG4gICAgICAgICAgY29tbWFuZDogc2NoZW1hLmNoYXJhY3RlcmlzdGljLmNvbW1hbmQsXG4gICAgICAgICAgYnVmZmVyOiBidWYsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvciAobGV0IGRlc2NJbmRleCBpbiBjaGFyYS5kZXNjcmlwdG9ycykge1xuICAgICAgICAgIGxldCBkZXNjID0gY2hhcmEuZGVzY3JpcHRvcnNbZGVzY0luZGV4XTtcbiAgICAgICAgICBkZXNjLnNlcnZpY2VfdXVpZCA9IHNlcnZpY2UudXVpZDtcbiAgICAgICAgICBkZXNjLmNoYXJhY3RlcmlzdGljX3V1aWQgPSBjaGFyYS51dWlkO1xuICAgICAgICAgIGJ1ZiA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihcbiAgICAgICAgICAgIHNjaGVtYS5kZXNjcmlwdG9yLnNjaGVtYSxcbiAgICAgICAgICAgIGRlc2NcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChidWYubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbmRCdWZzLnB1c2goeyBjb21tYW5kOiBzY2hlbWEuZGVzY3JpcHRvci5jb21tYW5kLCBidWZmZXI6IGJ1ZiB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBpbmRleCBpbiBzZW5kQnVmcykge1xuICAgICAgdGhpcy5zZW5kQ29tbWFuZChzZW5kQnVmc1tpbmRleF0uY29tbWFuZCwgc2VuZEJ1ZnNbaW5kZXhdLmJ1ZmZlcik7XG4gICAgfVxuICAgIGZvciAobGV0IGluZGV4IGluIHN0YXJ0U2VydmljZUJ1ZnMpIHtcbiAgICAgIHRoaXMuc2VuZENvbW1hbmQoXG4gICAgICAgIHN0YXJ0U2VydmljZUJ1ZnNbaW5kZXhdLmNvbW1hbmQsXG4gICAgICAgIHN0YXJ0U2VydmljZUJ1ZnNbaW5kZXhdLmJ1ZmZlclxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwZXJpcGhlcmFsU2VydmljZVN0b3AocGFyYW1zKSB7XG4gICAgbGV0IHNjaGVtYSA9IFtcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3BlcmlwaGVyYWwuc3RvcF9zZXJ2aWNlLnNlcnZpY2VfdXVpZCcsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6ICd1dWlkJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAgeyBwYXRoOiBudWxsLCBsZW5ndGg6IDEsIHR5cGU6ICdjaGFyJywgZGVmYXVsdDogMSB9LCAvL2NvbnN0IHZhbFxuICAgIF07XG4gICAgbGV0IGJ1ZiA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihzY2hlbWEsIHBhcmFtcyk7XG4gICAgdGhpcy5zZW5kQ29tbWFuZCh0aGlzLl9Db21tYW5kU2VydmVyU3RhcnRTdG9wU2VydmljZSwgYnVmKTtcbiAgfVxuXG4gIHBlcmlwaGVyYWxTZXJ2aWNlU3RvcEFsbCgpIHtcbiAgICB0aGlzLnNlbmRDb21tYW5kKHRoaXMuX0NvbW1hbmRTZXJ2ZXJTdGFydFBlcmlwaGVyYWwsIG5ldyBVaW50OEFycmF5KFsxXSkpO1xuICB9XG5cbiAgcGVyaXBoZXJhbENoYXJhY3RlcmlzdGljUmVhZChwYXJhbXMpIHtcbiAgICBsZXQgc2NoZW1hID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiAncGVyaXBoZXJhbC5yZWFkX2NoYXJhY3RlcmlzdGljLnNlcnZpY2VfdXVpZCcsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6ICd1dWlkJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAncGVyaXBoZXJhbC5yZWFkX2NoYXJhY3RlcmlzdGljLmNoYXJhY3RlcmlzdGljX3V1aWQnLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiAndXVpZCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICBdO1xuICAgIGxldCBidWYgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZFNlcnZlclJlYWRDaGFyYXZ0ZXJpc3RpY1ZhbHVlLCBidWYpO1xuICB9XG5cbiAgcGVyaXBoZXJhbENoYXJhY3RlcmlzdGljV3JpdGUocGFyYW1zKSB7XG4gICAgbGV0IHNjaGVtYSA9IFtcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3BlcmlwaGVyYWwud3JpdGVfY2hhcmFjdGVyaXN0aWMuc2VydmljZV91dWlkJyxcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogJ3V1aWQnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdwZXJpcGhlcmFsLndyaXRlX2NoYXJhY3RlcmlzdGljLmNoYXJhY3RlcmlzdGljX3V1aWQnLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiAndXVpZCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHsgcGF0aDogJ3BlcmlwaGVyYWwud3JpdGVfY2hhcmFjdGVyaXN0aWMuZGF0YScsIHR5cGU6ICdkYXRhQXJyYXknIH0sXG4gICAgXTtcbiAgICBsZXQgYnVmID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jcmVhdGVTZW5kQnVmZmVyKHNjaGVtYSwgcGFyYW1zKTtcbiAgICB0aGlzLnNlbmRDb21tYW5kKHRoaXMuX0NvbW1hbmRTZXJ2ZXJXcml0ZUNoYXJhdnRlcmlzdGljVmFsdWUsIGJ1Zik7XG4gIH1cblxuICBwZXJpcGhlcmFsQ2hhcmFjdGVyaXN0aWNOb3RpZnkocGFyYW1zKSB7XG4gICAgbGV0IHNjaGVtYSA9IFtcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3BlcmlwaGVyYWwubm90aWZ5X2NoYXJhY3RlcmlzdGljLnNlcnZpY2VfdXVpZCcsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6ICd1dWlkJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAncGVyaXBoZXJhbC5ub3RpZnlfY2hhcmFjdGVyaXN0aWMuY2hhcmFjdGVyaXN0aWNfdXVpZCcsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6ICd1dWlkJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIF07XG4gICAgbGV0IGJ1ZiA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihzY2hlbWEsIHBhcmFtcyk7XG4gICAgdGhpcy5zZW5kQ29tbWFuZCh0aGlzLl9Db21tYW5kU2VydmVyTm90aWZ5Q2hhcmF2dGVyaXN0aWMsIGJ1Zik7XG4gIH1cblxuICBwZXJpcGhlcmFsRGVzY3JpcHRvclJlYWQocGFyYW1zKSB7XG4gICAgbGV0IHNjaGVtYSA9IFtcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3BlcmlwaGVyYWwucmVhZF9kZXNjcmlwdG9yLnNlcnZpY2VfdXVpZCcsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6ICd1dWlkJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAncGVyaXBoZXJhbC5yZWFkX2Rlc2NyaXB0b3IuY2hhcmFjdGVyaXN0aWNfdXVpZCcsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6ICd1dWlkJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAncGVyaXBoZXJhbC5yZWFkX2Rlc2NyaXB0b3IuZGVzY3JpcHRvcl91dWlkJyxcbiAgICAgICAgbGVuZ3RoOiAxOCxcbiAgICAgICAgdHlwZTogJ3V1aWQnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgXTtcbiAgICBsZXQgYnVmID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jcmVhdGVTZW5kQnVmZmVyKHNjaGVtYSwgcGFyYW1zKTtcbiAgICB0aGlzLnNlbmRDb21tYW5kKHRoaXMuX0NvbW1hbmRTZXJ2ZXJSZWFkRGVzY3JpcHRvclZhbHVlLCBidWYpO1xuICB9XG5cbiAgcGVyaXBoZXJhbERlc2NyaXB0b3JXcml0ZShwYXJhbXMpIHtcbiAgICBsZXQgc2NoZW1hID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiAncGVyaXBoZXJhbC53cml0ZV9kZXNjcmlwdG9yLnNlcnZpY2VfdXVpZCcsXG4gICAgICAgIGxlbmd0aDogMTgsXG4gICAgICAgIHR5cGU6ICd1dWlkJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAncGVyaXBoZXJhbC53cml0ZV9kZXNjcmlwdG9yLmNoYXJhY3RlcmlzdGljX3V1aWQnLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiAndXVpZCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3BlcmlwaGVyYWwud3JpdGVfZGVzY3JpcHRvci5kZXNjcmlwdG9yX3V1aWQnLFxuICAgICAgICBsZW5ndGg6IDE4LFxuICAgICAgICB0eXBlOiAndXVpZCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHsgcGF0aDogJ3BlcmlwaGVyYWwud3JpdGVfZGVzY3JpcHRvci5kYXRhJywgdHlwZTogJ2RhdGFBcnJheScgfSxcbiAgICBdO1xuICAgIGxldCBidWYgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZFNlcnZlcldyaXRlRGVzY3JpcHRvclZhbHVlLCBidWYpO1xuICB9XG5cbiAgc2VjdXJpdHlBdXRoKHBhcmFtcykge1xuICAgIGxldCBzY2hlbWEgPSBbXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdzZWN1cml0eS5hdXRoJyxcbiAgICAgICAgdHlwZTogJ2ZsYWcnLFxuICAgICAgICBsZW5ndGg6IDEsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBmbGFnczogdGhpcy5fc2VjdXJpdHlBdXRoVmFsdWVzLFxuICAgICAgfSxcbiAgICBdO1xuICAgIGxldCBidWYgPSBKc29uQmluYXJ5Q29udmVydGVyLmNyZWF0ZVNlbmRCdWZmZXIoc2NoZW1hLCBwYXJhbXMpO1xuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZFNlY3VyaXR5U2V0QXV0aCwgYnVmKTtcbiAgfVxuXG4gIHNlY3VyaXR5SW5kaWNhdGVMZXZlbChwYXJhbXMpIHtcbiAgICBsZXQgc2NoZW1hID0gW1xuICAgICAge1xuICAgICAgICBwYXRoOiAnc2VjdXJpdHkuaW5kaWNhdGVfc2VjdXJpdHlfbGV2ZWwnLFxuICAgICAgICB0eXBlOiAnY2hhcicsXG4gICAgICAgIGxlbmd0aDogMSxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIF07XG4gICAgbGV0IGJ1ZiA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihzY2hlbWEsIHBhcmFtcyk7XG4gICAgdGhpcy5zZW5kQ29tbWFuZCh0aGlzLl9Db21tYW5kU2VjdXJpdHlTZXRFbmNyeXB0aW9uTGV2ZWwsIGJ1Zik7XG4gIH1cblxuICBzZWN1cml0eUtleVR5cGUocGFyYW1zKSB7XG4gICAgbGV0IHNjaGVtYSA9IFtcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3NlY3VyaXR5LmtleS50eXBlJyxcbiAgICAgICAgdHlwZTogJ2ZsYWcnLFxuICAgICAgICBsZW5ndGg6IDEsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBmbGFnczogdGhpcy5fc2VjdXJpdHlLZXlUeXBlcyxcbiAgICAgIH0sXG4gICAgXTtcbiAgICBsZXQgYnVmID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jcmVhdGVTZW5kQnVmZmVyKHNjaGVtYSwgcGFyYW1zKTtcbiAgICB0aGlzLnNlbmRDb21tYW5kKHRoaXMuX0NvbW1hbmRTZWN1cml0eVNldEVuYWJsZUtleVR5cGVzLCBidWYpO1xuICB9XG5cbiAgc2VjdXJpdHlLZXlTaXplKHBhcmFtcykge1xuICAgIGxldCBzY2hlbWEgPSBbXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdzZWN1cml0eS5rZXkubWF4X3NpemUnLFxuICAgICAgICB0eXBlOiAnY2hhcicsXG4gICAgICAgIGxlbmd0aDogMSxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIF07XG4gICAgbGV0IGJ1ZiA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY3JlYXRlU2VuZEJ1ZmZlcihzY2hlbWEsIHBhcmFtcyk7XG4gICAgdGhpcy5zZW5kQ29tbWFuZCh0aGlzLl9Db21tYW5kU2VjdXJpdHlTZXRLZXlNYXhTaXplLCBidWYpO1xuICB9XG5cbiAgY2xlYXJCb25kaW5nRGV2aWNlc0xpc3QocGFyYW1zKSB7XG4gICAgbGV0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KFtdKTsgLy9ub3RpbmcgdG8gc2VuZFxuICAgIHRoaXMuc2VuZENvbW1hbmQodGhpcy5fQ29tbWFuZFNlY3VyaXR5Q2xlYXJCb25kaW5nRGV2aWNlcywgYnVmKTtcbiAgfVxuXG4gIHBhcnNlRnJvbUpzb24oanNvbikge1xuICAgIGxldCBtb2R1bGUgPSBqc29uLmJsZTtcbiAgICBpZiAobW9kdWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHNjaGVtYURhdGEgPSBbXG4gICAgICB7XG4gICAgICAgIHVyaTogJy9yZXF1ZXN0L2JsZS9jZW50cmFsL3NjYW5fc3RhcnQnLFxuICAgICAgICBvblZhbGlkOiB0aGlzLmNlbnRyYWxTY2FuU3RhcnQsXG4gICAgICB9LFxuICAgICAgeyB1cmk6ICcvcmVxdWVzdC9ibGUvY2VudHJhbC9zY2FuX3N0b3AnLCBvblZhbGlkOiB0aGlzLmNlbnRyYWxTY2FuU3RvcCB9LFxuICAgICAgeyB1cmk6ICcvcmVxdWVzdC9ibGUvY2VudHJhbC9jb25uZWN0Jywgb25WYWxpZDogdGhpcy5jZW50cmFsQ29ubmVjdCB9LFxuICAgICAge1xuICAgICAgICB1cmk6ICcvcmVxdWVzdC9ibGUvY2VudHJhbC9kaXNjb25uZWN0JyxcbiAgICAgICAgb25WYWxpZDogdGhpcy5jZW50cmFsRGlzY29ubmVjdCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogJy9yZXF1ZXN0L2JsZS9jZW50cmFsL3NlcnZpY2VfZ2V0JyxcbiAgICAgICAgb25WYWxpZDogdGhpcy5jZW50cmFsU2VydmljZUdldCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogJy9yZXF1ZXN0L2JsZS9jZW50cmFsL2NoYXJhY3RlcmlzdGljX2dldCcsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMuY2VudHJhbENoYXJhY3RlcmlzdGljR2V0LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdXJpOiAnL3JlcXVlc3QvYmxlL2NlbnRyYWwvY2hhcmFjdGVyaXN0aWNfcmVhZCcsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMuY2VudHJhbENoYXJhY3RlcmlzdGljUmVhZCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogJy9yZXF1ZXN0L2JsZS9jZW50cmFsL2NoYXJhY3RlcmlzdGljX3dyaXRlJyxcbiAgICAgICAgb25WYWxpZDogdGhpcy5jZW50cmFsQ2hhcmFjdGVyaXN0aWNXcml0ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogJy9yZXF1ZXN0L2JsZS9jZW50cmFsL2NoYXJhY3RlcmlzdGljX3JlZ2lzdGVyX25vdGlmeScsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMuY2VudHJhbENoYXJhY3RlcmlzdGljUmVnaXN0ZXJOb3RpZnksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB1cmk6ICcvcmVxdWVzdC9ibGUvY2VudHJhbC9jaGFyYWN0ZXJpc3RpY191bnJlZ2lzdGVyX25vdGlmeScsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMuY2VudHJhbENoYXJhY3RlcmlzdGljVW5yZWdpc3Rlck5vdGlmeSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogJy9yZXF1ZXN0L2JsZS9jZW50cmFsL2Rlc2NyaXB0b3JfZ2V0JyxcbiAgICAgICAgb25WYWxpZDogdGhpcy5jZW50cmFsRGVzY3JpcHRvckdldCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogJy9yZXF1ZXN0L2JsZS9jZW50cmFsL2Rlc2NyaXB0b3JfcmVhZCcsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMuY2VudHJhbERlc2NyaXB0b3JSZWFkLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdXJpOiAnL3JlcXVlc3QvYmxlL2NlbnRyYWwvZGVzY3JpcHRvcl93cml0ZScsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMuY2VudHJhbERlc2NyaXB0b3JXcml0ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogJy9yZXF1ZXN0L2JsZS9wZXJpcGhlcmFsL2FkdmVydGlzZW1lbnRfc3RhcnQnLFxuICAgICAgICBvblZhbGlkOiB0aGlzLnBlcmlwaGVyYWxBZHZlcnRpc2VtZW50U3RhcnQsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB1cmk6ICcvcmVxdWVzdC9ibGUvcGVyaXBoZXJhbC9hZHZlcnRpc2VtZW50X3N0b3AnLFxuICAgICAgICBvblZhbGlkOiB0aGlzLnBlcmlwaGVyYWxBZHZlcnRpc2VtZW50U3RvcCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogJy9yZXF1ZXN0L2JsZS9wZXJpcGhlcmFsL3NlcnZpY2Vfc3RhcnQnLFxuICAgICAgICBvblZhbGlkOiB0aGlzLnBlcmlwaGVyYWxTZXJ2aWNlU3RhcnQsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB1cmk6ICcvcmVxdWVzdC9ibGUvcGVyaXBoZXJhbC9zZXJ2aWNlX3N0b3AnLFxuICAgICAgICBvblZhbGlkOiB0aGlzLnBlcmlwaGVyYWxTZXJ2aWNlU3RvcCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogJy9yZXF1ZXN0L2JsZS9wZXJpcGhlcmFsL3NlcnZpY2Vfc3RvcF9hbGwnLFxuICAgICAgICBvblZhbGlkOiB0aGlzLnBlcmlwaGVyYWxTZXJ2aWNlU3RvcEFsbCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogJy9yZXF1ZXN0L2JsZS9wZXJpcGhlcmFsL2NoYXJhY3RlcmlzdGljX3JlYWQnLFxuICAgICAgICBvblZhbGlkOiB0aGlzLnBlcmlwaGVyYWxDaGFyYWN0ZXJpc3RpY1JlYWQsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB1cmk6ICcvcmVxdWVzdC9ibGUvcGVyaXBoZXJhbC9jaGFyYWN0ZXJpc3RpY193cml0ZScsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMucGVyaXBoZXJhbENoYXJhY3RlcmlzdGljV3JpdGUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB1cmk6ICcvcmVxdWVzdC9ibGUvcGVyaXBoZXJhbC9jaGFyYWN0ZXJpc3RpY19ub3RpZnknLFxuICAgICAgICBvblZhbGlkOiB0aGlzLnBlcmlwaGVyYWxDaGFyYWN0ZXJpc3RpY05vdGlmeSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogJy9yZXF1ZXN0L2JsZS9wZXJpcGhlcmFsL2Rlc2NyaXB0b3JfcmVhZCcsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMucGVyaXBoZXJhbERlc2NyaXB0b3JSZWFkLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdXJpOiAnL3JlcXVlc3QvYmxlL3BlcmlwaGVyYWwvZGVzY3JpcHRvcl93cml0ZScsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMucGVyaXBoZXJhbERlc2NyaXB0b3JXcml0ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogJy9yZXF1ZXN0L2JsZS9zZWN1cml0eS9hdXRoJyxcbiAgICAgICAgb25WYWxpZDogdGhpcy5zZWN1cml0eUF1dGgsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB1cmk6ICcvcmVxdWVzdC9ibGUvc2VjdXJpdHkvaW5kaWNhdGVfc2VjdXJpdHlfbGV2ZWwnLFxuICAgICAgICBvblZhbGlkOiB0aGlzLnNlY3VyaXR5SW5kaWNhdGVMZXZlbCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVyaTogJy9yZXF1ZXN0L2JsZS9zZWN1cml0eS9rZXlfdHlwZScsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMuc2VjdXJpdHlLZXlUeXBlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdXJpOiAnL3JlcXVlc3QvYmxlL3NlY3VyaXR5L2tleV9tYXhfc2l6ZScsXG4gICAgICAgIG9uVmFsaWQ6IHRoaXMuc2VjdXJpdHlLZXlTaXplLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdXJpOiAnL3JlcXVlc3QvYmxlL3NlY3VyaXR5L2RldmljZXNfY2xlYXInLFxuICAgICAgICBvblZhbGlkOiB0aGlzLmNsZWFyQm9uZGluZ0RldmljZXNMaXN0LFxuICAgICAgfSxcbiAgICBdO1xuXG4gICAgc2NoZW1hRGF0YS5wdXNoKC4uLnRoaXMuaGNpQ29tbWFuZC5zY2hlbWFEYXRhKCkpO1xuICAgIGxldCByZXMgPSB0aGlzLnZhbGlkYXRlQ29tbWFuZFNjaGVtYShzY2hlbWFEYXRhLCBtb2R1bGUsICdibGUnKTtcbiAgICBpZiAocmVzLnZhbGlkID09PSAwKSB7XG4gICAgICBpZiAocmVzLmludmFsaWRCdXRMaWtlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlcy5pbnZhbGlkQnV0TGlrZVswXS5tZXNzYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyB0aGlzLldTQ29tbWFuZE5vdEZvdW5kRXJyb3IoYFtibGVddW5rbm93biBjb21tYW5kYCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5RnJvbUJpbmFyeShvYmpUb1NlbmQsIGZ1bmMsIHBheWxvYWQpIHtcbiAgICBsZXQgZnVuY0xpc3QgPSB7fTtcbiAgICBmdW5jTGlzdFt0aGlzLl9Db21tYW5kU2NhblJlc3VsdHNdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5U2NhblJlc3BvbnNlLmJpbmQoXG4gICAgICB0aGlzXG4gICAgKTtcbiAgICBmdW5jTGlzdFt0aGlzLl9Db21tYW5kQ29ubmVjdF0gPSB0aGlzLm5vdGlmeUZyb21CaW5hcnlDb25uZWN0LmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbdGhpcy5fQ29tbWFuZFNlcnZpY2VzXSA9IHRoaXMubm90aWZ5RnJvbUJpbmFyeVNlcnZpY2VzLmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbXG4gICAgICB0aGlzLl9Db21tYW5kQ2hhcmFjdGVyaXN0aWNzXG4gICAgXSA9IHRoaXMubm90aWZ5RnJvbUJpbmFyeUNoYWNhdGVyaXN0aWNzLmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbXG4gICAgICB0aGlzLl9Db21tYW5kV3JpdGVDaGFyYWN0ZXJpc3RpY3NcbiAgICBdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5V3JpdGVDaGFjYXRlcmlzdGljcy5iaW5kKHRoaXMpO1xuICAgIGZ1bmNMaXN0W1xuICAgICAgdGhpcy5fQ29tbWFuZFJlYWRDaGFyYWN0ZXJpc3RpY3NcbiAgICBdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5UmVhZENoYWNhdGVyaXN0aWNzLmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbXG4gICAgICB0aGlzLl9Db21tYW5kUmVnaXN0ZXJOb3RpZnlDaGFyYWN0ZXJpc3RpY1xuICAgIF0gPSB0aGlzLm5vdGlmeUZyb21CaW5hcnlSZWdpc3Rlck5vdGlmeUNoYWNhdGVyaXN0aWMuYmluZCh0aGlzKTtcbiAgICBmdW5jTGlzdFtcbiAgICAgIHRoaXMuX0NvbW1hbmRVbnJlZ2lzdGVyTm90aWZ5Q2hhcmFjdGVyaXN0aWNcbiAgICBdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5VW5yZWdpc3Rlck5vdGlmeUNoYWNhdGVyaXN0aWMuYmluZCh0aGlzKTtcbiAgICBmdW5jTGlzdFtcbiAgICAgIHRoaXMuX0NvbW1hbmROb3RpZnlDaGFyYWN0ZXJpc3RpY1xuICAgIF0gPSB0aGlzLm5vdGlmeUZyb21CaW5hcnlOb3RpZnlDaGFjYXRlcmlzdGljLmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbdGhpcy5fQ29tbWFuZERlc2NyaXB0b3JzXSA9IHRoaXMubm90aWZ5RnJvbUJpbmFyeURlc2NyaXB0b3JzLmJpbmQoXG4gICAgICB0aGlzXG4gICAgKTtcbiAgICBmdW5jTGlzdFtcbiAgICAgIHRoaXMuX0NvbW1hbmRXcml0ZURlc2NyaXB0b3JcbiAgICBdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5V3JpdGVEZXNjcmlwdG9yLmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbXG4gICAgICB0aGlzLl9Db21tYW5kUmVhZERlc2NyaXB0b3JcbiAgICBdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5UmVhZERlc2NyaXB0b3IuYmluZCh0aGlzKTtcblxuICAgIGZ1bmNMaXN0W1xuICAgICAgdGhpcy5fQ29tbWFuZFNlcnZlck5vdGlmeUNvbm5lY3RcbiAgICBdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5U2VydmVyQ29ubmVjdGlvblN0YXRlLmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbXG4gICAgICB0aGlzLl9Db21tYW5kU2VydmVyUmVhZENoYXJhdnRlcmlzdGljVmFsdWVcbiAgICBdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5U2VydmVyUmVhZENoYXJhdnRlcmlzdGljVmFsdWUuYmluZCh0aGlzKTtcbiAgICBmdW5jTGlzdFtcbiAgICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJXcml0ZUNoYXJhdnRlcmlzdGljVmFsdWVcbiAgICBdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5U2VydmVyV3JpdGVDaGFyYXZ0ZXJpc3RpY1ZhbHVlLmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbXG4gICAgICB0aGlzLl9Db21tYW5kU2VydmVyTm90aWZ5UmVhZENoYXJhdnRlcmlzdGljVmFsdWVcbiAgICBdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5U2VydmVyTm90aWZ5UmVhZENoYXJhdnRlcmlzdGljVmFsdWUuYmluZCh0aGlzKTtcbiAgICBmdW5jTGlzdFtcbiAgICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJOb3RpZnlXcml0ZUNoYXJhdnRlcmlzdGljVmFsdWVcbiAgICBdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5U2VydmVyTm90aWZ5V3JpdGVDaGFyYXZ0ZXJpc3RpY1ZhbHVlLmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbXG4gICAgICB0aGlzLl9Db21tYW5kU2VydmVyUmVhZERlc2NyaXB0b3JWYWx1ZVxuICAgIF0gPSB0aGlzLm5vdGlmeUZyb21CaW5hcnlTZXJ2ZXJSZWFkRGVzY3JpcHRvclZhbHVlLmJpbmQodGhpcyk7XG4gICAgZnVuY0xpc3RbXG4gICAgICB0aGlzLl9Db21tYW5kU2VydmVyV3JpdGVEZXNjcmlwdG9yVmFsdWVcbiAgICBdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5U2VydmVyV3JpdGVEZXNjcmlwdG9yVmFsdWUuYmluZCh0aGlzKTtcbiAgICBmdW5jTGlzdFtcbiAgICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJOb3RpZnlSZWFkRGVzY3JpcHRvclZhbHVlXG4gICAgXSA9IHRoaXMubm90aWZ5RnJvbUJpbmFyeVNlcnZlck5vdGlmeVJlYWREZXNjcmlwdG9yVmFsdWUuYmluZCh0aGlzKTtcbiAgICBmdW5jTGlzdFtcbiAgICAgIHRoaXMuX0NvbW1hbmRTZXJ2ZXJOb3RpZnlXcml0ZURlc2NyaXB0b3JWYWx1ZVxuICAgIF0gPSB0aGlzLm5vdGlmeUZyb21CaW5hcnlTZXJ2ZXJOb3RpZnlXcml0ZURlc2NyaXB0b3JWYWx1ZS5iaW5kKHRoaXMpO1xuXG4gICAgZnVuY0xpc3RbdGhpcy5DT01NQU5EX0ZVTkNfSURfRVJST1JdID0gdGhpcy5ub3RpZnlGcm9tQmluYXJ5RXJyb3IuYmluZChcbiAgICAgIHRoaXNcbiAgICApO1xuXG4gICAgT2JqZWN0LmFzc2lnbihmdW5jTGlzdCwgdGhpcy5oY2lDb21tYW5kLm5vdGlmeUZ1bmN0aW9uTGlzdCgpKTtcblxuICAgIGlmIChmdW5jTGlzdFtmdW5jXSkge1xuICAgICAgZnVuY0xpc3RbZnVuY10ob2JqVG9TZW5kLCBwYXlsb2FkKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnlGcm9tQmluYXJ5U2NhblJlc3BvbnNlKG9ialRvU2VuZCwgcGF5bG9hZCkge1xuICAgIGlmIChwYXlsb2FkLmJ5dGVMZW5ndGggPiAxKSB7XG4gICAgICBsZXQgc2NoZW1hID0gW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ2V2ZW50X3R5cGUnLFxuICAgICAgICAgIHR5cGU6ICdlbnVtJyxcbiAgICAgICAgICBsZW5ndGg6IDEsXG4gICAgICAgICAgZW51bTogdGhpcy5fQ29tbWFuZFNjYW5SZXN1bHRzRXZldCxcbiAgICAgICAgfSxcbiAgICAgICAgeyBuYW1lOiAnYWRkcmVzcycsIHR5cGU6ICdoZXgnLCBsZW5ndGg6IDYsIGVuZGlhbm5lc3M6ICdsaXR0bGUnIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnZGV2aWNlX3R5cGUnLFxuICAgICAgICAgIHR5cGU6ICdlbnVtJyxcbiAgICAgICAgICBsZW5ndGg6IDEsXG4gICAgICAgICAgZW51bTogdGhpcy5fQ29tbWFuZFNjYW5SZXN1bHRzRGV2aWNlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ2FkZHJlc3NfdHlwZScsXG4gICAgICAgICAgdHlwZTogJ2VudW0nLFxuICAgICAgICAgIGxlbmd0aDogMSxcbiAgICAgICAgICBlbnVtOiB0aGlzLl9Db21tYW5kU2NhblJlc3VsdHNEZXZpY2VBZGRyZXNzLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ2JsZV9ldmVudF90eXBlJyxcbiAgICAgICAgICB0eXBlOiAnZW51bScsXG4gICAgICAgICAgbGVuZ3RoOiAxLFxuICAgICAgICAgIGVudW06IHRoaXMuX0NvbW1hbmRTY2FuUmVzdWx0c0JsZUV2ZW50LFxuICAgICAgICB9LFxuICAgICAgICB7IG5hbWU6ICdyc3NpJywgdHlwZTogJ3NpZ25lZCBudW1iZXInLCBsZW5ndGg6IDQgfSxcbiAgICAgICAgeyBuYW1lOiAnYWR2X2RhdGEnLCB0eXBlOiAnZGF0YUFycmF5JywgbGVuZ3RoOiAzMSAqIDIgfSxcbiAgICAgICAgeyBuYW1lOiAnZmxhZycsIHR5cGU6ICdudW1iZXInLCBsZW5ndGg6IDQgfSxcbiAgICAgICAgeyBuYW1lOiAnbnVtX3Jlc3BvbnNlJywgdHlwZTogJ251bWJlcicsIGxlbmd0aDogNCB9LFxuICAgICAgICB7IG5hbWU6ICdhZHZlcnRpc2VfbGVuZ3RoJywgdHlwZTogJ251bWJlcicsIGxlbmd0aDogMSB9LFxuICAgICAgICB7IG5hbWU6ICdzY2FuX3Jlc3BvbnNlX2xlbmd0aCcsIHR5cGU6ICdudW1iZXInLCBsZW5ndGg6IDEgfSxcbiAgICAgIF07XG5cbiAgICAgIGxldCByZXN1bHRzID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihcbiAgICAgICAgc2NoZW1hLFxuICAgICAgICBwYXlsb2FkXG4gICAgICApO1xuXG4gICAgICByZXN1bHRzLnNjYW5fcmVzcCA9IHJlc3VsdHMuYWR2X2RhdGEuc2xpY2UoXG4gICAgICAgIHJlc3VsdHMuYWR2ZXJ0aXNlX2xlbmd0aCxcbiAgICAgICAgcmVzdWx0cy5hZHZlcnRpc2VfbGVuZ3RoICsgcmVzdWx0cy5zY2FuX3Jlc3BvbnNlX2xlbmd0aFxuICAgICAgKTtcbiAgICAgIHJlc3VsdHMuYWR2X2RhdGEgPSByZXN1bHRzLmFkdl9kYXRhLnNsaWNlKDAsIHJlc3VsdHMuYWR2ZXJ0aXNlX2xlbmd0aCk7XG5cbiAgICAgIGRlbGV0ZSByZXN1bHRzLm51bV9yZXNwb25zZTtcbiAgICAgIGRlbGV0ZSByZXN1bHRzLmFkdmVydGlzZV9sZW5ndGg7XG4gICAgICBkZWxldGUgcmVzdWx0cy5zY2FuX3Jlc3BvbnNlX2xlbmd0aDtcbiAgICAgIGRlbGV0ZSByZXN1bHRzLmFkdmVydGlzZV9kYXRhO1xuXG4gICAgICBpZiAocmVzdWx0cy5ldmVudF90eXBlID09PSAnaW5xdWlyeV9yZXN1bHQnKSB7XG4gICAgICAgIGRlbGV0ZSByZXN1bHRzLmV2ZW50X3R5cGU7XG4gICAgICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgob2JqVG9TZW5kLCAnYmxlLnNjYW5fcmVzdWx0JywgcmVzdWx0cyk7XG4gICAgICB9IGVsc2UgaWYgKHJlc3VsdHMuZXZlbnRfdHlwZSA9PT0gJ2lucXVpcnlfY29tcGxldGUnKSB7XG4gICAgICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgob2JqVG9TZW5kLCAnYmxlLnNjYW5fcmVzdWx0X2ZpbmlzaCcsIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUZyb21CaW5hcnlDb25uZWN0KG9ialRvU2VuZCwgcGF5bG9hZCkge1xuICAgIGlmIChwYXlsb2FkLmxlbmd0aCA9PT0gNykge1xuICAgICAgbGV0IHNjaGVtYSA9IFtcbiAgICAgICAgeyBuYW1lOiAnYWRkcmVzcycsIHR5cGU6ICdoZXgnLCBsZW5ndGg6IDYsIGVuZGlhbm5lc3M6ICdsaXR0bGUnIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnc3RhdHVzJyxcbiAgICAgICAgICB0eXBlOiAnZW51bScsXG4gICAgICAgICAgbGVuZ3RoOiAxLFxuICAgICAgICAgIGVudW06IHsgY29ubmVjdGVkOiAwLCBkaXNjb25uZWN0ZWQ6IDEgfSxcbiAgICAgICAgfSxcbiAgICAgIF07XG5cbiAgICAgIGxldCByZXN1bHRzID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihcbiAgICAgICAgc2NoZW1hLFxuICAgICAgICBwYXlsb2FkXG4gICAgICApO1xuICAgICAgdGhpcy5fYWRkUm93Rm9yUGF0aChvYmpUb1NlbmQsICdibGUuc3RhdHVzX3VwZGF0ZScsIHJlc3VsdHMpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUZyb21CaW5hcnlTZXJ2aWNlcyhvYmpUb1NlbmQsIHBheWxvYWQpIHtcbiAgICBsZXQgc2NoZW1hID0gW1xuICAgICAgeyBuYW1lOiAnYWRkcmVzcycsIHR5cGU6ICdoZXgnLCBsZW5ndGg6IDYsIGVuZGlhbm5lc3M6ICdsaXR0bGUnIH0sXG4gICAgICB7IG5hbWU6ICdzZXJ2aWNlX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgXTtcblxuICAgIGxldCByZXN1bHRzID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuXG4gICAgaWYgKHJlc3VsdHMuc2VydmljZV91dWlkICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9hZGRSb3dGb3JQYXRoKG9ialRvU2VuZCwgJ2JsZS5nZXRfc2VydmljZV9yZXN1bHQnLCByZXN1bHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHJlc3VsdHMuc2VydmljZV91dWlkO1xuICAgICAgdGhpcy5fYWRkUm93Rm9yUGF0aChvYmpUb1NlbmQsICdibGUuZ2V0X3NlcnZpY2VfcmVzdWx0X2ZpbmlzaCcsIHJlc3VsdHMpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUZyb21CaW5hcnlDaGFjYXRlcmlzdGljcyhvYmpUb1NlbmQsIHBheWxvYWQpIHtcbiAgICBsZXQgc2NoZW1hID0gW1xuICAgICAgeyBuYW1lOiAnYWRkcmVzcycsIHR5cGU6ICdoZXgnLCBsZW5ndGg6IDYsIGVuZGlhbm5lc3M6ICdsaXR0bGUnIH0sXG4gICAgICB7IG5hbWU6ICdzZXJ2aWNlX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgICB7IG5hbWU6ICdjaGFyYWN0ZXJpc3RpY191dWlkJywgdHlwZTogJ3V1aWQnLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aCB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAncHJvcGVydGllcycsXG4gICAgICAgIHR5cGU6ICdlbnVtJyxcbiAgICAgICAgbGVuZ3RoOiAxLFxuICAgICAgICBlbnVtOiB0aGlzLl9Db21tYW5kQ2hhcmFjdGVyaXN0aWNzUHJvcGVydGllcyxcbiAgICAgICAgZmxhZ3M6IHRydWUsXG4gICAgICB9LFxuICAgIF07XG5cbiAgICBsZXQgcmVzdWx0cyA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oc2NoZW1hLCBwYXlsb2FkKTtcblxuICAgIGlmIChyZXN1bHRzLmNoYXJhY3RlcmlzdGljX3V1aWQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgob2JqVG9TZW5kLCAnYmxlLmdldF9jaGFyYWN0ZXJpc3RpY19yZXN1bHQnLCByZXN1bHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHJlc3VsdHMuY2hhcmFjdGVyaXN0aWNfdXVpZDtcbiAgICAgIGRlbGV0ZSByZXN1bHRzLnByb3BlcnRpZXM7XG4gICAgICB0aGlzLl9hZGRSb3dGb3JQYXRoKFxuICAgICAgICBvYmpUb1NlbmQsXG4gICAgICAgICdibGUuZ2V0X2NoYXJhY3RlcmlzdGljX3Jlc3VsdF9maW5pc2gnLFxuICAgICAgICByZXN1bHRzXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUZyb21CaW5hcnlSZWFkQ2hhY2F0ZXJpc3RpY3Mob2JqVG9TZW5kLCBwYXlsb2FkKSB7XG4gICAgbGV0IHNjaGVtYSA9IFtcbiAgICAgIHsgbmFtZTogJ2FkZHJlc3MnLCB0eXBlOiAnaGV4JywgbGVuZ3RoOiA2LCBlbmRpYW5uZXNzOiAnbGl0dGxlJyB9LFxuICAgICAgeyBuYW1lOiAnc2VydmljZV91dWlkJywgdHlwZTogJ3V1aWQnLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aCB9LFxuICAgICAgeyBuYW1lOiAnY2hhcmFjdGVyaXN0aWNfdXVpZCcsIHR5cGU6ICd1dWlkJywgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGggfSxcbiAgICAgIHsgbmFtZTogJ3Jlc3VsdCcsIHR5cGU6ICdpbnQnLCBsZW5ndGg6IDEgfSxcbiAgICAgIHsgbmFtZTogJ2RhdGEnLCB0eXBlOiAnZGF0YUFycmF5JywgbGVuZ3RoOiBudWxsIH0sXG4gICAgXTtcblxuICAgIGxldCByZXN1bHRzID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuICAgIHJlc3VsdHMucmVzdWx0ID1cbiAgICAgIHJlc3VsdHMucmVzdWx0ID09PSB0aGlzLl9jb21tYW5kUmVzdWx0cy5zdWNjZXNzID8gJ3N1Y2Nlc3MnIDogJ2ZhaWxlZCc7XG4gICAgdGhpcy5fYWRkUm93Rm9yUGF0aChvYmpUb1NlbmQsICdibGUucmVhZF9jaGFyYWN0ZXJpc3RpY19yZXN1bHQnLCByZXN1bHRzKTtcbiAgfVxuXG4gIG5vdGlmeUZyb21CaW5hcnlXcml0ZUNoYWNhdGVyaXN0aWNzKG9ialRvU2VuZCwgcGF5bG9hZCkge1xuICAgIGxldCBzY2hlbWEgPSBbXG4gICAgICB7IG5hbWU6ICdhZGRyZXNzJywgdHlwZTogJ2hleCcsIGxlbmd0aDogNiwgZW5kaWFubmVzczogJ2xpdHRsZScgfSxcbiAgICAgIHsgbmFtZTogJ3NlcnZpY2VfdXVpZCcsIHR5cGU6ICd1dWlkJywgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGggfSxcbiAgICAgIHsgbmFtZTogJ2NoYXJhY3RlcmlzdGljX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgICB7IG5hbWU6ICdyZXN1bHQnLCB0eXBlOiAnaW50JywgbGVuZ3RoOiAxIH0sXG4gICAgXTtcblxuICAgIGxldCByZXN1bHRzID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuICAgIHJlc3VsdHMucmVzdWx0ID1cbiAgICAgIHJlc3VsdHMucmVzdWx0ID09PSB0aGlzLl9jb21tYW5kUmVzdWx0cy5zdWNjZXNzID8gJ3N1Y2Nlc3MnIDogJ2ZhaWxlZCc7XG4gICAgdGhpcy5fYWRkUm93Rm9yUGF0aChvYmpUb1NlbmQsICdibGUud3JpdGVfY2hhcmFjdGVyaXN0aWNfcmVzdWx0JywgcmVzdWx0cyk7XG4gIH1cblxuICBub3RpZnlGcm9tQmluYXJ5UmVnaXN0ZXJOb3RpZnlDaGFjYXRlcmlzdGljKG9ialRvU2VuZCwgcGF5bG9hZCkge1xuICAgIGxldCBzY2hlbWEgPSBbXG4gICAgICB7IG5hbWU6ICdhZGRyZXNzJywgdHlwZTogJ2hleCcsIGxlbmd0aDogNiwgZW5kaWFubmVzczogJ2xpdHRsZScgfSxcbiAgICAgIHsgbmFtZTogJ3NlcnZpY2VfdXVpZCcsIHR5cGU6ICd1dWlkJywgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGggfSxcbiAgICAgIHsgbmFtZTogJ2NoYXJhY3RlcmlzdGljX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgICB7IG5hbWU6ICdyZXN1bHQnLCB0eXBlOiAnaW50JywgbGVuZ3RoOiAxIH0sXG4gICAgXTtcblxuICAgIGxldCByZXN1bHRzID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuICAgIHJlc3VsdHMucmVzdWx0ID1cbiAgICAgIHJlc3VsdHMucmVzdWx0ID09PSB0aGlzLl9jb21tYW5kUmVzdWx0cy5zdWNjZXNzID8gJ3N1Y2Nlc3MnIDogJ2ZhaWxlZCc7XG4gICAgdGhpcy5fYWRkUm93Rm9yUGF0aChcbiAgICAgIG9ialRvU2VuZCxcbiAgICAgICdibGUucmVnaXN0ZXJfbm90aWZ5X2NoYXJhY3RlcmlzdGljX3Jlc3VsdCcsXG4gICAgICByZXN1bHRzXG4gICAgKTtcbiAgfVxuXG4gIG5vdGlmeUZyb21CaW5hcnlVbnJlZ2lzdGVyTm90aWZ5Q2hhY2F0ZXJpc3RpYyhvYmpUb1NlbmQsIHBheWxvYWQpIHtcbiAgICBsZXQgc2NoZW1hID0gW1xuICAgICAgeyBuYW1lOiAnYWRkcmVzcycsIHR5cGU6ICdoZXgnLCBsZW5ndGg6IDYsIGVuZGlhbm5lc3M6ICdsaXR0bGUnIH0sXG4gICAgICB7IG5hbWU6ICdzZXJ2aWNlX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgICB7IG5hbWU6ICdjaGFyYWN0ZXJpc3RpY191dWlkJywgdHlwZTogJ3V1aWQnLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aCB9LFxuICAgICAgeyBuYW1lOiAncmVzdWx0JywgdHlwZTogJ2ludCcsIGxlbmd0aDogMSB9LFxuICAgIF07XG5cbiAgICBsZXQgcmVzdWx0cyA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oc2NoZW1hLCBwYXlsb2FkKTtcbiAgICByZXN1bHRzLnJlc3VsdCA9XG4gICAgICByZXN1bHRzLnJlc3VsdCA9PT0gdGhpcy5fY29tbWFuZFJlc3VsdHMuc3VjY2VzcyA/ICdzdWNjZXNzJyA6ICdmYWlsZWQnO1xuICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgoXG4gICAgICBvYmpUb1NlbmQsXG4gICAgICAnYmxlLnVucmVnaXN0ZXJfbm90aWZ5X2NoYXJhY3RlcmlzdGljX3Jlc3VsdCcsXG4gICAgICByZXN1bHRzXG4gICAgKTtcbiAgfVxuXG4gIG5vdGlmeUZyb21CaW5hcnlOb3RpZnlDaGFjYXRlcmlzdGljKG9ialRvU2VuZCwgcGF5bG9hZCkge1xuICAgIGxldCBzY2hlbWEgPSBbXG4gICAgICB7IG5hbWU6ICdhZGRyZXNzJywgdHlwZTogJ2hleCcsIGxlbmd0aDogNiwgZW5kaWFubmVzczogJ2xpdHRsZScgfSxcbiAgICAgIHsgbmFtZTogJ3NlcnZpY2VfdXVpZCcsIHR5cGU6ICd1dWlkJywgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGggfSxcbiAgICAgIHsgbmFtZTogJ2NoYXJhY3RlcmlzdGljX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgICB7IG5hbWU6ICdpc19ub3RpZnknLCB0eXBlOiAnaW50JywgbGVuZ3RoOiAxIH0sXG4gICAgICB7IG5hbWU6ICdkYXRhJywgdHlwZTogJ2RhdGFBcnJheScsIGxlbmd0aDogbnVsbCB9LFxuICAgIF07XG5cbiAgICBsZXQgcmVzdWx0cyA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oc2NoZW1hLCBwYXlsb2FkKTtcbiAgICByZXN1bHRzLmlzX25vdGlmeSA9IHJlc3VsdHMuaXNfbm90aWZ5ID09PSAxO1xuICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgob2JqVG9TZW5kLCAnYmxlLm5vdGlmeV9jaGFyYWN0ZXJpc3RpYycsIHJlc3VsdHMpO1xuICB9XG5cbiAgbm90aWZ5RnJvbUJpbmFyeURlc2NyaXB0b3JzKG9ialRvU2VuZCwgcGF5bG9hZCkge1xuICAgIGxldCBzY2hlbWEgPSBbXG4gICAgICB7IG5hbWU6ICdhZGRyZXNzJywgdHlwZTogJ2hleCcsIGxlbmd0aDogNiwgZW5kaWFubmVzczogJ2xpdHRsZScgfSxcbiAgICAgIHsgbmFtZTogJ3NlcnZpY2VfdXVpZCcsIHR5cGU6ICd1dWlkJywgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGggfSxcbiAgICAgIHsgbmFtZTogJ2NoYXJhY3RlcmlzdGljX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgICB7IG5hbWU6ICdkZXNjcmlwdG9yX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgXTtcblxuICAgIGxldCByZXN1bHRzID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuXG4gICAgaWYgKHJlc3VsdHMuZGVzY3JpcHRvcl91dWlkICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9hZGRSb3dGb3JQYXRoKG9ialRvU2VuZCwgJ2JsZS5nZXRfZGVzY3JpcHRvcl9yZXN1bHQnLCByZXN1bHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHJlc3VsdHMuZGVzY3JpcHRvcl91dWlkO1xuICAgICAgdGhpcy5fYWRkUm93Rm9yUGF0aChcbiAgICAgICAgb2JqVG9TZW5kLFxuICAgICAgICAnYmxlLmdldF9kZXNjcmlwdG9yX3Jlc3VsdF9maW5pc2gnLFxuICAgICAgICByZXN1bHRzXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUZyb21CaW5hcnlSZWFkRGVzY3JpcHRvcihvYmpUb1NlbmQsIHBheWxvYWQpIHtcbiAgICBsZXQgc2NoZW1hID0gW1xuICAgICAgeyBuYW1lOiAnYWRkcmVzcycsIHR5cGU6ICdoZXgnLCBsZW5ndGg6IDYsIGVuZGlhbm5lc3M6ICdsaXR0bGUnIH0sXG4gICAgICB7IG5hbWU6ICdzZXJ2aWNlX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgICB7IG5hbWU6ICdjaGFyYWN0ZXJpc3RpY191dWlkJywgdHlwZTogJ3V1aWQnLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aCB9LFxuICAgICAgeyBuYW1lOiAnZGVzY3JpcHRvcl91dWlkJywgdHlwZTogJ3V1aWQnLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aCB9LFxuICAgICAgeyBuYW1lOiAncmVzdWx0JywgdHlwZTogJ2ludCcsIGxlbmd0aDogMSB9LFxuICAgICAgeyBuYW1lOiAnZGF0YScsIHR5cGU6ICdkYXRhQXJyYXknLCBsZW5ndGg6IG51bGwgfSxcbiAgICBdO1xuXG4gICAgbGV0IHJlc3VsdHMgPSBKc29uQmluYXJ5Q29udmVydGVyLmNvbnZlcnRGcm9tQmluYXJ5VG9Kc29uKHNjaGVtYSwgcGF5bG9hZCk7XG4gICAgcmVzdWx0cy5yZXN1bHQgPVxuICAgICAgcmVzdWx0cy5yZXN1bHQgPT09IHRoaXMuX2NvbW1hbmRSZXN1bHRzLnN1Y2Nlc3MgPyAnc3VjY2VzcycgOiAnZmFpbGVkJztcbiAgICB0aGlzLl9hZGRSb3dGb3JQYXRoKG9ialRvU2VuZCwgJ2JsZS5yZWFkX2Rlc2NyaXB0b3JfcmVzdWx0JywgcmVzdWx0cyk7XG4gIH1cblxuICBub3RpZnlGcm9tQmluYXJ5V3JpdGVEZXNjcmlwdG9yKG9ialRvU2VuZCwgcGF5bG9hZCkge1xuICAgIGxldCBzY2hlbWEgPSBbXG4gICAgICB7IG5hbWU6ICdhZGRyZXNzJywgdHlwZTogJ2hleCcsIGxlbmd0aDogNiwgZW5kaWFubmVzczogJ2xpdHRsZScgfSxcbiAgICAgIHsgbmFtZTogJ3NlcnZpY2VfdXVpZCcsIHR5cGU6ICd1dWlkJywgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGggfSxcbiAgICAgIHsgbmFtZTogJ2NoYXJhY3RlcmlzdGljX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgICB7IG5hbWU6ICdkZXNjcmlwdG9yX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgICB7IG5hbWU6ICdyZXN1bHQnLCB0eXBlOiAnaW50JywgbGVuZ3RoOiAxIH0sXG4gICAgXTtcblxuICAgIGxldCByZXN1bHRzID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuICAgIHJlc3VsdHMucmVzdWx0ID1cbiAgICAgIHJlc3VsdHMucmVzdWx0ID09PSB0aGlzLl9jb21tYW5kUmVzdWx0cy5zdWNjZXNzID8gJ3N1Y2Nlc3MnIDogJ2ZhaWxlZCc7XG4gICAgdGhpcy5fYWRkUm93Rm9yUGF0aChvYmpUb1NlbmQsICdibGUud3JpdGVfZGVzY3JpcHRvcl9yZXN1bHQnLCByZXN1bHRzKTtcbiAgfVxuXG4gIG5vdGlmeUZyb21CaW5hcnlTZXJ2ZXJDb25uZWN0aW9uU3RhdGUob2JqVG9TZW5kLCBwYXlsb2FkKSB7XG4gICAgbGV0IHNjaGVtYSA9IFtcbiAgICAgIHsgbmFtZTogJ2FkZHJlc3MnLCB0eXBlOiAnaGV4JywgbGVuZ3RoOiA2LCBlbmRpYW5uZXNzOiAnbGl0dGxlJyB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnc3RhdHVzJyxcbiAgICAgICAgdHlwZTogJ2VudW0nLFxuICAgICAgICBsZW5ndGg6IDEsXG4gICAgICAgIGVudW06IHsgY29ubmVjdGVkOiAxLCBkaXNjb25uZWN0ZWQ6IDAgfSxcbiAgICAgIH0sXG4gICAgXTtcblxuICAgIGxldCByZXN1bHRzID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgob2JqVG9TZW5kLCAnYmxlLnBlcmlwaGVyYWwuY29ubmVjdGlvbl9zdGF0dXMnLCByZXN1bHRzKTtcbiAgfVxuXG4gIG5vdGlmeUZyb21CaW5hcnlTZXJ2ZXJXcml0ZUNoYXJhdnRlcmlzdGljVmFsdWUob2JqVG9TZW5kLCBwYXlsb2FkKSB7XG4gICAgbGV0IHNjaGVtYSA9IFtcbiAgICAgIHsgbmFtZTogJ3NlcnZpY2VfdXVpZCcsIHR5cGU6ICd1dWlkJywgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGggfSxcbiAgICAgIHsgbmFtZTogJ2NoYXJhY3RlcmlzdGljX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgICB7IG5hbWU6ICdyZXN1bHQnLCB0eXBlOiAnaW50JywgbGVuZ3RoOiAxIH0sXG4gICAgXTtcblxuICAgIGxldCByZXN1bHRzID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuICAgIHJlc3VsdHMucmVzdWx0ID1cbiAgICAgIHJlc3VsdHMucmVzdWx0ID09PSB0aGlzLl9jb21tYW5kUmVzdWx0cy5zdWNjZXNzID8gJ3N1Y2Nlc3MnIDogJ2ZhaWxlZCc7XG4gICAgdGhpcy5fYWRkUm93Rm9yUGF0aChcbiAgICAgIG9ialRvU2VuZCxcbiAgICAgICdibGUucGVyaXBoZXJhbC53cml0ZV9jaGFyYWN0ZXJpc3RpY19yZXN1bHQnLFxuICAgICAgcmVzdWx0c1xuICAgICk7XG4gIH1cblxuICBub3RpZnlGcm9tQmluYXJ5U2VydmVyUmVhZENoYXJhdnRlcmlzdGljVmFsdWUob2JqVG9TZW5kLCBwYXlsb2FkKSB7XG4gICAgbGV0IHNjaGVtYSA9IFtcbiAgICAgIHsgbmFtZTogJ3NlcnZpY2VfdXVpZCcsIHR5cGU6ICd1dWlkJywgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGggfSxcbiAgICAgIHsgbmFtZTogJ2NoYXJhY3RlcmlzdGljX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgICB7IG5hbWU6ICdkYXRhJywgdHlwZTogJ2RhdGFBcnJheScsIGxlbmd0aDogbnVsbCB9LFxuICAgIF07XG5cbiAgICBsZXQgcmVzdWx0cyA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oc2NoZW1hLCBwYXlsb2FkKTtcbiAgICByZXN1bHRzLnJlc3VsdCA9ICdzdWNjZXNzJzsgLy9hbHdheXMgc3VjY2Vzc1xuICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgoXG4gICAgICBvYmpUb1NlbmQsXG4gICAgICAnYmxlLnBlcmlwaGVyYWwucmVhZF9jaGFyYWN0ZXJpc3RpY19yZXN1bHQnLFxuICAgICAgcmVzdWx0c1xuICAgICk7XG4gIH1cblxuICBub3RpZnlGcm9tQmluYXJ5U2VydmVyTm90aWZ5UmVhZENoYXJhdnRlcmlzdGljVmFsdWUob2JqVG9TZW5kLCBwYXlsb2FkKSB7XG4gICAgbGV0IHNjaGVtYSA9IFtcbiAgICAgIHsgbmFtZTogJ2FkZHJlc3MnLCB0eXBlOiAnaGV4JywgbGVuZ3RoOiA2LCBlbmRpYW5uZXNzOiAnbGl0dGxlJyB9LFxuICAgICAgeyBuYW1lOiAnc2VydmljZV91dWlkJywgdHlwZTogJ3V1aWQnLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aCB9LFxuICAgICAgeyBuYW1lOiAnY2hhcmFjdGVyaXN0aWNfdXVpZCcsIHR5cGU6ICd1dWlkJywgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGggfSxcbiAgICBdO1xuXG4gICAgbGV0IHJlc3VsdHMgPSBKc29uQmluYXJ5Q29udmVydGVyLmNvbnZlcnRGcm9tQmluYXJ5VG9Kc29uKHNjaGVtYSwgcGF5bG9hZCk7XG4gICAgdGhpcy5fYWRkUm93Rm9yUGF0aChcbiAgICAgIG9ialRvU2VuZCxcbiAgICAgICdibGUucGVyaXBoZXJhbC5ub3RpZnlfcmVhZF9jaGFyYWN0ZXJpc3RpYycsXG4gICAgICByZXN1bHRzXG4gICAgKTtcbiAgfVxuXG4gIG5vdGlmeUZyb21CaW5hcnlTZXJ2ZXJOb3RpZnlXcml0ZUNoYXJhdnRlcmlzdGljVmFsdWUob2JqVG9TZW5kLCBwYXlsb2FkKSB7XG4gICAgbGV0IHNjaGVtYSA9IFtcbiAgICAgIHsgbmFtZTogJ2FkZHJlc3MnLCB0eXBlOiAnaGV4JywgbGVuZ3RoOiA2LCBlbmRpYW5uZXNzOiAnbGl0dGxlJyB9LFxuICAgICAgeyBuYW1lOiAnc2VydmljZV91dWlkJywgdHlwZTogJ3V1aWQnLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aCB9LFxuICAgICAgeyBuYW1lOiAnY2hhcmFjdGVyaXN0aWNfdXVpZCcsIHR5cGU6ICd1dWlkJywgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGggfSxcbiAgICAgIHsgbmFtZTogJ2RhdGEnLCB0eXBlOiAnZGF0YUFycmF5JywgbGVuZ3RoOiBudWxsIH0sXG4gICAgXTtcblxuICAgIGxldCByZXN1bHRzID0gSnNvbkJpbmFyeUNvbnZlcnRlci5jb252ZXJ0RnJvbUJpbmFyeVRvSnNvbihzY2hlbWEsIHBheWxvYWQpO1xuICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgoXG4gICAgICBvYmpUb1NlbmQsXG4gICAgICAnYmxlLnBlcmlwaGVyYWwubm90aWZ5X3dyaXRlX2NoYXJhY3RlcmlzdGljJyxcbiAgICAgIHJlc3VsdHNcbiAgICApO1xuICB9XG5cbiAgbm90aWZ5RnJvbUJpbmFyeVNlcnZlclJlYWREZXNjcmlwdG9yVmFsdWUob2JqVG9TZW5kLCBwYXlsb2FkKSB7XG4gICAgbGV0IHNjaGVtYSA9IFtcbiAgICAgIHsgbmFtZTogJ3NlcnZpY2VfdXVpZCcsIHR5cGU6ICd1dWlkJywgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGggfSxcbiAgICAgIHsgbmFtZTogJ2NoYXJhY3RlcmlzdGljX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgICB7IG5hbWU6ICdkZXNjcmlwdG9yX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgICB7IG5hbWU6ICdkYXRhJywgdHlwZTogJ2RhdGFBcnJheScsIGxlbmd0aDogbnVsbCB9LFxuICAgIF07XG5cbiAgICBsZXQgcmVzdWx0cyA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oc2NoZW1hLCBwYXlsb2FkKTtcbiAgICByZXN1bHRzLnJlc3VsdCA9ICdzdWNjZXNzJzsgLy9hbHdheXMgc3VjY2Vzc1xuICAgIHRoaXMuX2FkZFJvd0ZvclBhdGgoXG4gICAgICBvYmpUb1NlbmQsXG4gICAgICAnYmxlLnBlcmlwaGVyYWwucmVhZF9kZXNjcmlwdG9yX3Jlc3VsdCcsXG4gICAgICByZXN1bHRzXG4gICAgKTtcbiAgfVxuXG4gIG5vdGlmeUZyb21CaW5hcnlTZXJ2ZXJXcml0ZURlc2NyaXB0b3JWYWx1ZShvYmpUb1NlbmQsIHBheWxvYWQpIHtcbiAgICBsZXQgc2NoZW1hID0gW1xuICAgICAgeyBuYW1lOiAnc2VydmljZV91dWlkJywgdHlwZTogJ3V1aWQnLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aCB9LFxuICAgICAgeyBuYW1lOiAnY2hhcmFjdGVyaXN0aWNfdXVpZCcsIHR5cGU6ICd1dWlkJywgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGggfSxcbiAgICAgIHsgbmFtZTogJ2Rlc2NyaXB0b3JfdXVpZCcsIHR5cGU6ICd1dWlkJywgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGggfSxcbiAgICAgIHsgbmFtZTogJ3Jlc3VsdCcsIHR5cGU6ICdpbnQnLCBsZW5ndGg6IDEgfSxcbiAgICBdO1xuXG4gICAgbGV0IHJlc3VsdHMgPSBKc29uQmluYXJ5Q29udmVydGVyLmNvbnZlcnRGcm9tQmluYXJ5VG9Kc29uKHNjaGVtYSwgcGF5bG9hZCk7XG4gICAgcmVzdWx0cy5yZXN1bHQgPVxuICAgICAgcmVzdWx0cy5yZXN1bHQgPT09IHRoaXMuX2NvbW1hbmRSZXN1bHRzLnN1Y2Nlc3MgPyAnc3VjY2VzcycgOiAnZmFpbGVkJztcbiAgICB0aGlzLl9hZGRSb3dGb3JQYXRoKFxuICAgICAgb2JqVG9TZW5kLFxuICAgICAgJ2JsZS5wZXJpcGhlcmFsLndyaXRlX2Rlc2NyaXB0b3JfcmVzdWx0JyxcbiAgICAgIHJlc3VsdHNcbiAgICApO1xuICB9XG5cbiAgbm90aWZ5RnJvbUJpbmFyeVNlcnZlck5vdGlmeVJlYWREZXNjcmlwdG9yVmFsdWUob2JqVG9TZW5kLCBwYXlsb2FkKSB7XG4gICAgbGV0IHNjaGVtYSA9IFtcbiAgICAgIHsgbmFtZTogJ2FkZHJlc3MnLCB0eXBlOiAnaGV4JywgbGVuZ3RoOiA2LCBlbmRpYW5uZXNzOiAnbGl0dGxlJyB9LFxuICAgICAgeyBuYW1lOiAnc2VydmljZV91dWlkJywgdHlwZTogJ3V1aWQnLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aCB9LFxuICAgICAgeyBuYW1lOiAnY2hhcmFjdGVyaXN0aWNfdXVpZCcsIHR5cGU6ICd1dWlkJywgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGggfSxcbiAgICAgIHsgbmFtZTogJ2Rlc2NyaXB0b3JfdXVpZCcsIHR5cGU6ICd1dWlkJywgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGggfSxcbiAgICBdO1xuXG4gICAgbGV0IHJlc3VsdHMgPSBKc29uQmluYXJ5Q29udmVydGVyLmNvbnZlcnRGcm9tQmluYXJ5VG9Kc29uKHNjaGVtYSwgcGF5bG9hZCk7XG4gICAgdGhpcy5fYWRkUm93Rm9yUGF0aChcbiAgICAgIG9ialRvU2VuZCxcbiAgICAgICdibGUucGVyaXBoZXJhbC5ub3RpZnlfcmVhZF9kZXNjcmlwdG9yJyxcbiAgICAgIHJlc3VsdHNcbiAgICApO1xuICB9XG5cbiAgbm90aWZ5RnJvbUJpbmFyeVNlcnZlck5vdGlmeVdyaXRlRGVzY3JpcHRvclZhbHVlKG9ialRvU2VuZCwgcGF5bG9hZCkge1xuICAgIGxldCBzY2hlbWEgPSBbXG4gICAgICB7IG5hbWU6ICdhZGRyZXNzJywgdHlwZTogJ2hleCcsIGxlbmd0aDogNiwgZW5kaWFubmVzczogJ2xpdHRsZScgfSxcbiAgICAgIHsgbmFtZTogJ3NlcnZpY2VfdXVpZCcsIHR5cGU6ICd1dWlkJywgbGVuZ3RoOiB0aGlzLnV1aWRMZW5ndGggfSxcbiAgICAgIHsgbmFtZTogJ2NoYXJhY3RlcmlzdGljX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgICB7IG5hbWU6ICdkZXNjcmlwdG9yX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgICB7IG5hbWU6ICdkYXRhJywgdHlwZTogJ2RhdGFBcnJheScsIGxlbmd0aDogbnVsbCB9LFxuICAgIF07XG5cbiAgICBsZXQgcmVzdWx0cyA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oc2NoZW1hLCBwYXlsb2FkKTtcbiAgICB0aGlzLl9hZGRSb3dGb3JQYXRoKFxuICAgICAgb2JqVG9TZW5kLFxuICAgICAgJ2JsZS5wZXJpcGhlcmFsLm5vdGlmeV93cml0ZV9kZXNjcmlwdG9yJyxcbiAgICAgIHJlc3VsdHNcbiAgICApO1xuICB9XG5cbiAgbm90aWZ5RnJvbUJpbmFyeUVycm9yKG9ialRvU2VuZCwgcGF5bG9hZCkge1xuICAgIGxldCBzY2hlbWEgPSBbXG4gICAgICB7IG5hbWU6ICdtb2R1bGVfZXJyb3JfY29kZScsIHR5cGU6ICdjaGFyJywgbGVuZ3RoOiAxIH0sXG4gICAgICB7IG5hbWU6ICdlcnJvcl9jb2RlJywgdHlwZTogJ2NoYXInLCBsZW5ndGg6IDEgfSxcbiAgICAgIHsgbmFtZTogJ2Z1bmN0aW9uX2NvZGUnLCB0eXBlOiAnY2hhcicsIGxlbmd0aDogMSB9LFxuICAgICAgeyBuYW1lOiAnYWRkcmVzcycsIHR5cGU6ICdoZXgnLCBsZW5ndGg6IDYsIGVuZGlhbm5lc3M6ICdsaXR0bGUnIH0sXG4gICAgICB7IG5hbWU6ICdzZXJ2aWNlX3V1aWQnLCB0eXBlOiAndXVpZCcsIGxlbmd0aDogdGhpcy51dWlkTGVuZ3RoIH0sXG4gICAgICB7IG5hbWU6ICdjaGFyYWN0ZXJpc3RpY191dWlkJywgdHlwZTogJ3V1aWQnLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aCB9LFxuICAgICAgeyBuYW1lOiAnZGVzY3JpcHRvcl91dWlkJywgdHlwZTogJ3V1aWQnLCBsZW5ndGg6IHRoaXMudXVpZExlbmd0aCB9LFxuICAgIF07XG5cbiAgICBsZXQgcmVzdWx0cyA9IEpzb25CaW5hcnlDb252ZXJ0ZXIuY29udmVydEZyb21CaW5hcnlUb0pzb24oc2NoZW1hLCBwYXlsb2FkKTtcblxuICAgIGxldCBlcnJvck1lc3NhZ2UgPSB7XG4gICAgICAweDAwOiAnbm8gZXJyb3InLFxuICAgICAgMHgwMTogJ2RldmljZSBub3QgY29ubmVjdGVkJyxcbiAgICAgIDB4MDI6ICdzZXJ2aWNlIG5vdCBmb3VuZCcsXG4gICAgICAweDAzOiAnY2hhcmF2dGVyaXN0aWMgbm90IGZvdW5kJyxcbiAgICAgIDB4MDQ6ICdkZXNjcmlwdG9yIG5vdCBmb3VuZCcsXG4gICAgICAweDA1OiAnbm8gcGVybWlzc2lvbicsXG4gICAgICAweDA2OiAnZGV2aWNlIG5vdCBmb3VuZCcsXG4gICAgICAweDA3OiAnYmxlIGlzIGJ1c3knLFxuICAgICAgMHgwODogJ3NlcnZpY2UgYWxyZWFkeSBydW5uaW5nJyxcbiAgICAgIDB4MDk6ICdzZWN1cml0eSBwYXJhbSBhcmUgYWxyZWFkeSBzZXQnLFxuICAgICAgMHhmZjogJ2Vycm9yJyxcbiAgICB9O1xuXG4gICAgbGV0IGZ1bmN0aW9uTWVzc2FnZSA9IHtcbiAgICAgIDA6ICdvbiBzZXR0aW5nIGFkdmVydGlzZW1lbnQgZGF0YScsXG4gICAgICAxOiAnb24gc2V0dGluZyBzY2FuIHJlc3BvbnNlIGRhdGEnLFxuICAgICAgMjogJ29uIHN0YXJ0aW5nIGFkdmVydGlzZW1lbnQnLFxuICAgICAgMzogJ29uIHN0b3BwaW5nIGFkdmVydGlzZW1lbnQnLFxuICAgICAgNDogJ29uIHN0YXJ0aW5nIHNjYW4nLFxuICAgICAgNTogJ29uIHN0b3Bpbmcgc2NhbicsXG4gICAgICA2OiAnJyxcbiAgICAgIDc6ICdvbiBjb25uZWN0aW5nIGRldmljZScsXG4gICAgICA4OiAnb24gZ2V0dGluZyBzZXJ2aWNlcycsXG4gICAgICA5OiAnb24gZ2V0dGluZyBjaGFyYWN0ZXJpc3RpYycsXG4gICAgICAxMDogJ29uIHdyaXRpbmcgY2hhcmFjdGVyaXN0aWMnLFxuICAgICAgMTE6ICdvbiByZWFkaW5nIGNoYXJhY3RlcmlzdGljJyxcbiAgICAgIDE0OiAnb24gZ2V0dGluZyBkZXNjcmlwdG9yJyxcbiAgICAgIDE1OiAnb24gd3JpdGluZyBkZXNjcmlwdG9yJyxcbiAgICAgIDE2OiAnb24gcmVhZGluZyBkZXNjcmlwdG9yJyxcbiAgICAgIDIwOiAnb24gc3RhcnQgcGhlcmlwaGVyYWwnLFxuICAgICAgMjE6ICdvbiBub3RpZnkgY29ubmVjdCcsXG4gICAgICAyMjogJ29uIGFkZGluZyBzZXJ2aWNlJyxcbiAgICAgIDIzOiAnb24gYWRkaW5nIGNoYXJhY3RlcmlzdGljJyxcbiAgICAgIDI0OiAnb24gYWRkaW5nIGRlc2NyaXB0b3InLFxuICAgICAgMjU6ICdvbiB3cml0aW5nIGNoYXJhY3RlcmlzdGljJyxcbiAgICAgIDI2OiAnb24gcmVhZGluZyBjaGFyYWN0ZXJpc3RpYycsXG4gICAgICAyNzogJ29uIHdyaXRpbmcgY2hhcmFjdGVyaXN0aWMgZnJvbSByZW1vdGUnLFxuICAgICAgMjg6ICdvbiByZWFkaW5nIGNoYXJhY3RlcmlzdGljIGZyb20gcmVtb3RlJyxcbiAgICAgIDI5OiAnb24gd3JpdGluZyBkZXNjcmlwdG9yJyxcbiAgICAgIDMwOiAnb24gcmVhZGluZyBkZXNjcmlwdG9yJyxcbiAgICAgIDMxOiAnb24gd3JpdGluZyBkZXNjcmlwdG9yIGZyb20gcmVtb3RlJyxcbiAgICAgIDMyOiAnb24gcmVhZGluZyBkZXNjcmlwdG9yIGZyb20gcmVtb3RlJyxcbiAgICAgIDMzOiAnb24gbm90aWZ5IGNoYXJhY3RlcmlzdGljJyxcbiAgICAgIDM0OiAnb24gc3RhcnQvc3RvcCBzZXJ2aWNlJyxcbiAgICAgIDM1OiAnb24gc2V0IHNlY3VyaXR5IGF1dGggcGFyYW0nLFxuICAgICAgMzY6ICdvbiBzZXQgc2VjdXJpdHkgZW5jcnlwdGlvbiBsZXZlbCBwYXJhbScsXG4gICAgICAzNzogJ29uIHNldCBzZWN1cml0eSBrZXkgdHlwZSBwYXJhbScsXG4gICAgICAzODogJ29uIHNldCBzZWN1cml0eSBrZXkgc2l6ZSBwYXJhbScsXG4gICAgICAzOTogJ29uIHNldCBzZWN1cml0eSBpbyBjYXBhYmlsaXR5JyxcbiAgICAgIDQwOiAnb24gY2xlYXIgYm9uZGluZyBkZXZpY2VzIGxpc3QnLFxuICAgIH07XG5cbiAgICByZXN1bHRzLm1lc3NhZ2UgPVxuICAgICAgZXJyb3JNZXNzYWdlW3Jlc3VsdHMuZXJyb3JfY29kZV0gK1xuICAgICAgJyAnICtcbiAgICAgIGZ1bmN0aW9uTWVzc2FnZVtyZXN1bHRzLmZ1bmN0aW9uX2NvZGVdO1xuXG4gICAgdGhpcy5lbnZlbG9wRXJyb3Iob2JqVG9TZW5kLCAnYmxlJywgcmVzdWx0cyk7XG4gIH1cblxuICBfYWRkUm93Rm9yUGF0aChzZW5kT2JqLCBwYXRoLCByb3cpIHtcbiAgICBsZXQga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBsZXQgdGFyZ2V0ID0gc2VuZE9iajtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwga2V5cy5sZW5ndGggLSAxOyBpbmRleCsrKSB7XG4gICAgICB0YXJnZXRba2V5c1tpbmRleF1dID0gdGFyZ2V0W2tleXNbaW5kZXhdXSB8fCB7fTtcbiAgICAgIHRhcmdldCA9IHRhcmdldFtrZXlzW2luZGV4XV07XG4gICAgfVxuICAgIHRhcmdldFtrZXlzW2tleXMubGVuZ3RoIC0gMV1dID0gcm93O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV1NDb21tYW5kQmxlO1xuIl19
