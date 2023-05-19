"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GattCentral = void 0;
const att_1 = require("../common/att");
const gatt_1 = require("../common/gatt");
const gatt_2 = require("../peripheral/gatt");
// let debug = require('debug')('att');
const debug = () => {
    // do nothing.
};
/* eslint-disable no-unused-vars */
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const ObnizError_1 = require("../../../../../ObnizError");
const bleHelper_1 = __importDefault(require("../../bleHelper"));
/**
 * @ignore
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
var GATT;
(function (GATT) {
    GATT.PRIM_SVC_UUID = 0x2800;
    GATT.SECONDARY_SVC_UUID = 0x2801;
    GATT.INCLUDE_UUID = 0x2802;
    GATT.CHARAC_UUID = 0x2803;
    GATT.CLIENT_CHARAC_CFG_UUID = 0x2902;
    GATT.SERVER_CHARAC_CFG_UUID = 0x2903;
})(GATT || (GATT = {}));
/**
 * @ignore
 */
class GattCentral extends eventemitter3_1.default {
    constructor(address, aclStream) {
        super();
        this._services = {};
        this._characteristics = {};
        this._descriptors = {};
        this._remoteMtuRequest = null;
        this._address = address;
        this._aclStream = aclStream;
        this._services = {};
        this._characteristics = {};
        this._descriptors = {};
        this._currentCommand = null;
        this._commandQueue = [];
        this._commandPromises = [];
        this._mtu = 23;
        this._security = 'low';
        this.onAclStreamDataBinded = this.onAclStreamData.bind(this);
        this.onAclStreamEndBinded = this.onAclStreamEnd.bind(this);
        this._aclStream.on('data', this.onAclStreamDataBinded);
        this._aclStream.on('end', this.onAclStreamEndBinded);
        this._gattCommon = new gatt_1.GattCommon();
        this._gattPeripheral = new gatt_2.GattPeripheral();
        this._gattPeripheral.send = (data) => {
            this._execNoRespCommandWait(data).catch((e) => {
                // nothing to do
                console.error('_execNoRespCommandWait error', e);
            });
        };
    }
    hasEncryptKeys() {
        return this._aclStream._smp.hasKeys();
    }
    getEncryptKeys() {
        if (!this.hasEncryptKeys()) {
            return null;
        }
        return this._aclStream._smp.getKeys();
    }
    async encryptWait(options) {
        const result = await this._serialPromiseQueueWait(async () => {
            await this._aclStream.encryptWait(options);
            this._security = 'medium';
            return this._aclStream._smp.getKeys();
        });
        return result;
    }
    setEncryptOption(options) {
        this._aclStream.setEncryptOption(options);
    }
    onEnd(reason) {
        this.emit('end', reason);
    }
    async exchangeMtuWait(mtu) {
        this._aclStream
            .readWait(att_1.ATT.CID, att_1.ATT.OP_MTU_REQ)
            .catch((e) => {
            if (e instanceof ObnizError_1.ObnizTimeoutError) {
                return null;
            }
            throw e;
        })
            .then((mtuRequestData) => {
            // console.error('mtu request received');
            if (!mtuRequestData) {
                // throw timeout error and catched above
                return;
            }
            const requestMtu = mtuRequestData.readUInt16LE(1);
            // console.log(
            //   this._address + ': receive OP_MTU_REQ. new MTU is ' + requestMtu
            // );
            this._mtu = requestMtu;
            return this._execNoRespCommandWait(this._gattCommon.mtuResponse(this._mtu));
        })
            .catch((e) => {
            // ignore timeout error
            console.error(e);
        });
        if (mtu === null) {
            debug(this._address + ': no exchange MTU : ' + this._mtu);
        }
        else {
            const data = await this._execCommandWait(this._gattCommon.mtuRequest(mtu), att_1.ATT.OP_MTU_RESP);
            const opcode = data[0];
            const newMtu = data.readUInt16LE(1);
            debug(this._address + ': new MTU is ' + newMtu);
            this._mtu = newMtu;
        }
        return this._mtu;
    }
    async discoverServicesWait(uuids) {
        const pServices = await this.discoverPrimaryServicesWait(uuids);
        const sServices = await this.discoverSecondaryServicesWait(uuids);
        return [...pServices, ...sServices];
    }
    async discoverPrimaryServicesWait(uuids) {
        const services = [];
        let startHandle = 0x0001;
        while (1) {
            const data = await this._execCommandWait(this._gattCommon.readByGroupRequest(startHandle, 0xffff, GATT.PRIM_SVC_UUID), [att_1.ATT.OP_READ_BY_GROUP_RESP, att_1.ATT.OP_ERROR]);
            const opcode = data[0];
            let i = 0;
            if (opcode === att_1.ATT.OP_READ_BY_GROUP_RESP) {
                const type = data[1];
                const num = (data.length - 2) / type;
                for (i = 0; i < num; i++) {
                    services.push({
                        startHandle: data.readUInt16LE(2 + i * type + 0),
                        endHandle: data.readUInt16LE(2 + i * type + 2),
                        uuid: type === 6
                            ? data.readUInt16LE(2 + i * type + 4).toString(16)
                            : bleHelper_1.default.buffer2reversedHex(data.slice(2 + i * type + 4).slice(0, 16)),
                    });
                }
            }
            if (opcode !== att_1.ATT.OP_READ_BY_GROUP_RESP ||
                services[services.length - 1].endHandle === 0xffff) {
                const serviceUuids = [];
                for (i = 0; i < services.length; i++) {
                    if (uuids.length === 0 || uuids.indexOf(services[i].uuid) !== -1) {
                        serviceUuids.push(services[i].uuid);
                    }
                    this._services[services[i].uuid] = services[i];
                }
                return serviceUuids;
            }
            startHandle = services[services.length - 1].endHandle + 1;
        }
        throw new ObnizError_1.ObnizBleGattHandleError('unreachable code');
    }
    async discoverSecondaryServicesWait(uuids) {
        const services = [];
        let startHandle = 0x0001;
        while (1) {
            const data = await this._execCommandWait(this._gattCommon.readByGroupRequest(startHandle, 0xffff, GATT.SECONDARY_SVC_UUID), [att_1.ATT.OP_READ_BY_GROUP_RESP, att_1.ATT.OP_ERROR]);
            const opcode = data[0];
            let i = 0;
            if (opcode === att_1.ATT.OP_READ_BY_GROUP_RESP) {
                const type = data[1];
                const num = (data.length - 2) / type;
                for (i = 0; i < num; i++) {
                    services.push({
                        startHandle: data.readUInt16LE(2 + i * type + 0),
                        endHandle: data.readUInt16LE(2 + i * type + 2),
                        uuid: type === 6
                            ? data.readUInt16LE(2 + i * type + 4).toString(16)
                            : bleHelper_1.default.buffer2reversedHex(data.slice(2 + i * type + 4).slice(0, 16)),
                    });
                }
            }
            if (opcode !== att_1.ATT.OP_READ_BY_GROUP_RESP ||
                services[services.length - 1].endHandle === 0xffff) {
                const serviceUuids = [];
                for (i = 0; i < services.length; i++) {
                    if (uuids.length === 0 || uuids.indexOf(services[i].uuid) !== -1) {
                        serviceUuids.push(services[i].uuid);
                    }
                    this._services[services[i].uuid] = services[i];
                }
                return serviceUuids;
            }
            startHandle = services[services.length - 1].endHandle + 1;
        }
        throw new ObnizError_1.ObnizBleGattHandleError('unreachable code');
    }
    async discoverIncludedServicesWait(serviceUuid, uuids) {
        const service = this.getService(serviceUuid);
        const includedServices = [];
        let startHandle = service.startHandle;
        while (1) {
            const data = await this._execCommandWait(this._gattCommon.readByTypeRequest(startHandle, service.endHandle, GATT.INCLUDE_UUID), [att_1.ATT.OP_READ_BY_TYPE_RESP, att_1.ATT.OP_ERROR]);
            const opcode = data[0];
            let i = 0;
            if (opcode === att_1.ATT.OP_READ_BY_TYPE_RESP) {
                const type = data[1];
                const num = (data.length - 2) / type;
                for (i = 0; i < num; i++) {
                    includedServices.push({
                        endHandle: data.readUInt16LE(2 + i * type + 0),
                        startHandle: data.readUInt16LE(2 + i * type + 2),
                        uuid: type === 8
                            ? data.readUInt16LE(2 + i * type + 6).toString(16)
                            : bleHelper_1.default.buffer2reversedHex(data.slice(2 + i * type + 6).slice(0, 16)),
                    });
                }
            }
            if (opcode !== att_1.ATT.OP_READ_BY_TYPE_RESP ||
                includedServices[includedServices.length - 1].endHandle ===
                    service.endHandle) {
                const includedServiceUuids = [];
                for (i = 0; i < includedServices.length; i++) {
                    if (uuids.length === 0 ||
                        uuids.indexOf(includedServices[i].uuid) !== -1) {
                        includedServiceUuids.push(includedServices[i].uuid);
                    }
                }
                return includedServiceUuids;
            }
            startHandle = includedServices[includedServices.length - 1].endHandle + 1;
        }
    }
    async discoverCharacteristicsWait(serviceUuid, characteristicUuids) {
        const service = this.getService(serviceUuid);
        const characteristics = [];
        this._characteristics[serviceUuid] =
            this._characteristics[serviceUuid] || {};
        this._descriptors[serviceUuid] = this._descriptors[serviceUuid] || {};
        let startHandle = service.startHandle;
        while (1) {
            const data = await this._execCommandWait(this._gattCommon.readByTypeRequest(startHandle, service.endHandle, GATT.CHARAC_UUID), [att_1.ATT.OP_READ_BY_TYPE_RESP, att_1.ATT.OP_ERROR]);
            const opcode = data[0];
            let i = 0;
            if (opcode === att_1.ATT.OP_READ_BY_TYPE_RESP) {
                const type = data[1];
                const num = (data.length - 2) / type;
                for (i = 0; i < num; i++) {
                    characteristics.push({
                        startHandle: data.readUInt16LE(2 + i * type + 0),
                        endHandle: 0,
                        properties: data.readUInt8(2 + i * type + 2),
                        valueHandle: data.readUInt16LE(2 + i * type + 3),
                        uuid: type === 7
                            ? data.readUInt16LE(2 + i * type + 5).toString(16)
                            : bleHelper_1.default.buffer2reversedHex(data.slice(2 + i * type + 5).slice(0, 16)),
                    });
                }
            }
            if (opcode !== att_1.ATT.OP_READ_BY_TYPE_RESP ||
                characteristics[characteristics.length - 1].valueHandle ===
                    service.endHandle) {
                const characteristicsDiscovered = [];
                for (i = 0; i < characteristics.length; i++) {
                    const properties = characteristics[i].properties;
                    const characteristic = {
                        properties: [],
                        uuid: characteristics[i].uuid,
                    };
                    if (i !== 0) {
                        characteristics[i - 1].endHandle =
                            characteristics[i].startHandle - 1;
                    }
                    if (i === characteristics.length - 1) {
                        characteristics[i].endHandle = service.endHandle;
                    }
                    this._characteristics[serviceUuid][characteristics[i].uuid] =
                        characteristics[i];
                    if (properties & 0x01) {
                        characteristic.properties.push('broadcast');
                    }
                    if (properties & 0x02) {
                        characteristic.properties.push('read');
                    }
                    if (properties & 0x04) {
                        characteristic.properties.push('writeWithoutResponse');
                    }
                    if (properties & 0x08) {
                        characteristic.properties.push('write');
                    }
                    if (properties & 0x10) {
                        characteristic.properties.push('notify');
                    }
                    if (properties & 0x20) {
                        characteristic.properties.push('indicate');
                    }
                    if (properties & 0x40) {
                        characteristic.properties.push('authenticatedSignedWrites');
                    }
                    if (properties & 0x80) {
                        characteristic.properties.push('extendedProperties');
                    }
                    if (characteristicUuids.length === 0 ||
                        characteristicUuids.indexOf(characteristic.uuid) !== -1) {
                        characteristicsDiscovered.push(characteristic);
                    }
                }
                return characteristicsDiscovered;
            }
            startHandle = characteristics[characteristics.length - 1].valueHandle + 1;
        }
        throw new ObnizError_1.ObnizBleGattHandleError('no reachable code');
    }
    async readWait(serviceUuid, characteristicUuid) {
        const characteristic = this.getCharacteristic(serviceUuid, characteristicUuid);
        let readData = Buffer.alloc(0);
        while (1) {
            let data;
            if (readData.length === 0) {
                data = await this._execCommandWait(this._gattCommon.readRequest(characteristic.valueHandle), att_1.ATT.OP_READ_RESP);
            }
            else {
                data = await this._execCommandWait(this._gattCommon.readBlobRequest(characteristic.valueHandle, readData.length), att_1.ATT.OP_READ_BLOB_RESP);
            }
            const opcode = data[0];
            readData = Buffer.from(readData.toString('hex') + data.slice(1).toString('hex'), 'hex');
            if (data.length === this._mtu) {
                // do nothing.
            }
            else {
                return readData;
            }
        }
        // never reach
        // eslint-disable-next-line no-unreachable
        return readData;
    }
    async writeWait(serviceUuid, characteristicUuid, data, withoutResponse) {
        const characteristic = this.getCharacteristic(serviceUuid, characteristicUuid);
        if (withoutResponse) {
            await this._execNoRespCommandWait(this._gattCommon.writeRequest(characteristic.valueHandle, data, true));
        }
        else if (data.length + 3 > this._mtu) {
            await this.longWriteWait(serviceUuid, characteristicUuid, data, withoutResponse);
        }
        else {
            await this._execCommandWait(this._gattCommon.writeRequest(characteristic.valueHandle, data, false), att_1.ATT.OP_WRITE_RESP);
        }
    }
    async broadcastWait(serviceUuid, characteristicUuid, broadcast) {
        const characteristic = this.getCharacteristic(serviceUuid, characteristicUuid);
        const data = await this._execCommandWait(this._gattCommon.readByTypeRequest(characteristic.startHandle, characteristic.endHandle, GATT.SERVER_CHARAC_CFG_UUID), att_1.ATT.OP_READ_BY_TYPE_RESP);
        const opcode = data[0];
        // let type = data[1];
        const handle = data.readUInt16LE(2);
        let value = data.readUInt16LE(4);
        if (broadcast) {
            value |= 0x0001;
        }
        else {
            value &= 0xfffe;
        }
        const valueBuffer = Buffer.alloc(2);
        valueBuffer.writeUInt16LE(value, 0);
        const _data = await this._execCommandWait(this._gattCommon.writeRequest(handle, valueBuffer, false), att_1.ATT.OP_WRITE_RESP);
    }
    async notifyWait(serviceUuid, characteristicUuid, notify) {
        try {
            const characteristic = this.getCharacteristic(serviceUuid, characteristicUuid);
            const descriptor = this.getDescriptor(serviceUuid, characteristicUuid, '2902');
            return await this.notifyByDescriptorWait(serviceUuid, characteristicUuid, notify);
        }
        catch (e) {
            debug(`failed to handle descriptor`);
        }
        return await this.notifyByHandleWait(serviceUuid, characteristicUuid, notify);
    }
    async notifyByDescriptorWait(serviceUuid, characteristicUuid, notify) {
        const characteristic = this.getCharacteristic(serviceUuid, characteristicUuid);
        let value = 0;
        const useNotify = characteristic.properties & 0x10;
        const useIndicate = characteristic.properties & 0x20;
        if (notify) {
            if (useNotify) {
                value |= 0x0001;
            }
            else if (useIndicate) {
                value |= 0x0002;
            }
        }
        else {
            if (useNotify) {
                value &= 0xfffe;
            }
            else if (useIndicate) {
                value &= 0xfffd;
            }
        }
        const valueBuffer = Buffer.alloc(2);
        valueBuffer.writeUInt16LE(value, 0);
        let _data = null;
        // if (handle) {
        //   _data = await this._execCommandWait(
        //     this._gattCommon.writeRequest(handle, valueBuffer, false),
        //     ATT.OP_WRITE_RESP
        //   );
        // } else {
        _data = await this.writeValueWait(serviceUuid, characteristicUuid, '2902', valueBuffer);
        // }
        const _opcode = _data && _data[0];
        debug('set notify write results: ' + (_opcode === att_1.ATT.OP_WRITE_RESP));
    }
    async notifyByHandleWait(serviceUuid, characteristicUuid, notify) {
        const characteristic = this.getCharacteristic(serviceUuid, characteristicUuid);
        // const descriptor: any = this.getDescriptor(serviceUuid, characteristicUuid, "2902");
        let value = null;
        let handle = null;
        try {
            value = await this.readValueWait(serviceUuid, characteristicUuid, '2902');
        }
        catch (e) {
            // retry
            const data = await this._execCommandWait(this._gattCommon.readByTypeRequest(characteristic.startHandle, characteristic.endHandle, GATT.CLIENT_CHARAC_CFG_UUID), att_1.ATT.OP_READ_BY_TYPE_RESP);
            const opcode = data[0];
            // let type = data[1];
            handle = data.readUInt16LE(2);
            value = data.readUInt16LE(4);
        }
        const useNotify = characteristic.properties & 0x10;
        const useIndicate = characteristic.properties & 0x20;
        if (notify) {
            if (useNotify) {
                value |= 0x0001;
            }
            else if (useIndicate) {
                value |= 0x0002;
            }
        }
        else {
            if (useNotify) {
                value &= 0xfffe;
            }
            else if (useIndicate) {
                value &= 0xfffd;
            }
        }
        const valueBuffer = Buffer.alloc(2);
        valueBuffer.writeUInt16LE(value, 0);
        let _data = null;
        if (handle) {
            _data = await this._execCommandWait(this._gattCommon.writeRequest(handle, valueBuffer, false), att_1.ATT.OP_WRITE_RESP);
        }
        else {
            _data = await this.writeValueWait(serviceUuid, characteristicUuid, '2902', valueBuffer);
        }
        const _opcode = _data && _data[0];
        debug('set notify write results: ' + (_opcode === att_1.ATT.OP_WRITE_RESP));
    }
    async discoverDescriptorsWait(serviceUuid, characteristicUuid) {
        const characteristic = this.getCharacteristic(serviceUuid, characteristicUuid);
        const descriptors = [];
        this._descriptors[serviceUuid][characteristicUuid] = {};
        let startHandle = characteristic.valueHandle + 1;
        while (1) {
            const data = await this._execCommandWait(this._gattCommon.findInfoRequest(startHandle, characteristic.endHandle), [att_1.ATT.OP_FIND_INFO_RESP, att_1.ATT.OP_ERROR]);
            const opcode = data[0];
            let i = 0;
            if (opcode === att_1.ATT.OP_FIND_INFO_RESP) {
                const num = data[1];
                for (i = 0; i < num; i++) {
                    descriptors.push({
                        handle: data.readUInt16LE(2 + i * 4 + 0),
                        uuid: data.readUInt16LE(2 + i * 4 + 2).toString(16),
                    });
                }
            }
            if (opcode !== att_1.ATT.OP_FIND_INFO_RESP ||
                descriptors[descriptors.length - 1].handle === characteristic.endHandle) {
                const descriptorUuids = [];
                for (i = 0; i < descriptors.length; i++) {
                    descriptorUuids.push(descriptors[i].uuid);
                    this._descriptors[serviceUuid][characteristicUuid][descriptors[i].uuid] = descriptors[i];
                }
                return descriptorUuids;
            }
            startHandle = descriptors[descriptors.length - 1].handle + 1;
        }
        // never reach
        // eslint-disable-next-line no-unreachable
        return [];
    }
    async readValueWait(serviceUuid, characteristicUuid, descriptorUuid) {
        const descriptor = this.getDescriptor(serviceUuid, characteristicUuid, descriptorUuid);
        const data = await this._execCommandWait(this._gattCommon.readRequest(descriptor.handle), att_1.ATT.OP_READ_RESP);
        return data.slice(1);
    }
    async writeValueWait(serviceUuid, characteristicUuid, descriptorUuid, data) {
        const descriptor = this.getDescriptor(serviceUuid, characteristicUuid, descriptorUuid);
        return await this._execCommandWait(this._gattCommon.writeRequest(descriptor.handle, data, false), att_1.ATT.OP_WRITE_RESP);
    }
    async readHandleWait(handle) {
        const data = await this._execCommandWait(this._gattCommon.readRequest(handle), att_1.ATT.OP_READ_RESP);
        return data.slice(1);
    }
    async writeHandleWait(handle, data, withoutResponse) {
        if (withoutResponse) {
            await this._execNoRespCommandWait(this._gattCommon.writeRequest(handle, data, true));
        }
        else {
            await this._execCommandWait(this._gattCommon.writeRequest(handle, data, false), att_1.ATT.OP_WRITE_RESP);
        }
    }
    onAclStreamData(cid, data) {
        if (cid !== att_1.ATT.CID) {
            return;
        }
        const requestType = data[0];
        // notify / indicate
        if (requestType === att_1.ATT.OP_HANDLE_NOTIFY ||
            requestType === att_1.ATT.OP_HANDLE_IND) {
            const valueHandle = data.readUInt16LE(1);
            const valueData = data.slice(3);
            this.emit('handleNotify', this._address, valueHandle, valueData);
            if (data[0] === att_1.ATT.OP_HANDLE_IND) {
                // background
                this._execNoRespCommandWait(this._gattCommon.handleConfirmation())
                    .then(() => {
                    this.emit('handleConfirmation', this._address, valueHandle);
                })
                    .catch((e) => {
                    console.warn(e);
                });
            }
            for (const serviceUuid in this._services) {
                for (const characteristicUuid in this._characteristics[serviceUuid]) {
                    if (this._characteristics[serviceUuid][characteristicUuid]
                        .valueHandle === valueHandle) {
                        this.emit('notification', this._address, serviceUuid, characteristicUuid, valueData);
                    }
                }
            }
        }
        else if (requestType === att_1.ATT.OP_FIND_INFO_REQ ||
            requestType === att_1.ATT.OP_FIND_BY_TYPE_REQ ||
            requestType === att_1.ATT.OP_READ_BY_TYPE_REQ ||
            requestType === att_1.ATT.OP_READ_REQ ||
            requestType === att_1.ATT.OP_READ_BLOB_REQ ||
            requestType === att_1.ATT.OP_READ_BY_GROUP_REQ ||
            requestType === att_1.ATT.OP_WRITE_REQ ||
            requestType === att_1.ATT.OP_WRITE_CMD ||
            requestType === att_1.ATT.OP_PREPARE_WRITE_REQ ||
            requestType === att_1.ATT.OP_EXECUTE_WRITE_REQ ||
            requestType === att_1.ATT.OP_HANDLE_CNF ||
            requestType === att_1.ATT.OP_READ_MULTI_REQ ||
            requestType === att_1.ATT.OP_SIGNED_WRITE_CMD) {
            // console.error('_gattPeripheral.handleRequest', requestType);
            this._gattPeripheral.handleRequest(data);
        }
    }
    onAclStreamEnd() {
        this._aclStream.removeListener('data', this.onAclStreamDataBinded);
        this._aclStream.removeListener('end', this.onAclStreamEndBinded);
    }
    writeAtt(data) {
        const opCode = data[0];
        const handle = data.length > 3 ? data.readUInt16LE(1) : 'none';
        debug(`ATT: opCode=${opCode}(${att_1.ATT_OP_READABLES[opCode]}) handle=${handle} address=` +
            this._address +
            ': write: ' +
            data.toString('hex'));
        this._aclStream.write(att_1.ATT.CID, data);
    }
    /* Perform a "long write" as described Bluetooth Spec section 4.9.4 "Write Long Characteristic Values" */
    async longWriteWait(serviceUuid, characteristicUuid, data, withoutResponse) {
        const characteristic = this.getCharacteristic(serviceUuid, characteristicUuid);
        const limit = this._mtu - 5;
        /* split into prepare-write chunks and queue them */
        let offset = 0;
        while (offset < data.length) {
            const end = offset + limit;
            const chunk = data.slice(offset, end);
            const _resp = await this._execCommandWait(this._gattCommon.prepareWriteRequest(characteristic.valueHandle, offset, chunk), att_1.ATT.OP_PREPARE_WRITE_RESP);
            const expected_length = chunk.length + 5;
            if (_resp.length !== expected_length) {
                /* the response should contain the data packet echoed back to the caller */
                throw new Error(`unexpected prepareWriteResponse length ${_resp.length} (expecting ${expected_length})`);
            }
            offset = end;
        }
        if (withoutResponse) {
            await this._execNoRespCommandWait(this._gattCommon.executeWriteRequest(characteristic.valueHandle));
        }
        else {
            await this._execCommandWait(this._gattCommon.executeWriteRequest(characteristic.valueHandle), att_1.ATT.OP_EXECUTE_WRITE_RESP);
        }
    }
    getService(serviceUuid) {
        if (!this._services[serviceUuid]) {
            throw new ObnizError_1.ObnizBleUnknownServiceError(this._address, serviceUuid);
        }
        return this._services[serviceUuid];
    }
    getCharacteristic(serviceUuid, characteristicUuid) {
        if (!this._characteristics[serviceUuid] ||
            !this._characteristics[serviceUuid][characteristicUuid]) {
            throw new ObnizError_1.ObnizBleUnknownCharacteristicError(this._address, serviceUuid, characteristicUuid);
        }
        return this._characteristics[serviceUuid][characteristicUuid];
    }
    getDescriptor(serviceUuid, characteristicUuid, descriptorUuid) {
        if (!this._descriptors[serviceUuid] ||
            !this._descriptors[serviceUuid][characteristicUuid] ||
            !this._descriptors[serviceUuid][characteristicUuid][descriptorUuid]) {
            throw new ObnizError_1.ObnizBleUnknownDescriptorError(this._address, serviceUuid, characteristicUuid, descriptorUuid);
        }
        return this._descriptors[serviceUuid][characteristicUuid][descriptorUuid];
    }
    _queueCommand(buffer, callback, writeCallback) {
        this._commandQueue.push({
            buffer,
            callback,
            writeCallback,
        });
        this._runQueueCommand();
    }
    _runQueueCommand() {
        if (this._currentCommand === null) {
            while (this._commandQueue.length) {
                this._currentCommand = this._commandQueue.shift();
                this.writeAtt(this._currentCommand.buffer);
                if (this._currentCommand.callback) {
                    break;
                }
                else if (this._currentCommand.writeCallback) {
                    this._currentCommand.writeCallback();
                    this._currentCommand = null;
                }
            }
        }
    }
    _serialPromiseQueueWait(func) {
        const onfinish = () => {
            this._commandPromises = this._commandPromises.filter((e) => e !== resultPromise);
            if (disconnectReject) {
                this.off('end', disconnectReject);
            }
        };
        const errorForStacktrace = new Error('stacktrace');
        let disconnectReject = null;
        const doPromise = Promise.all(this._commandPromises)
            .catch((error) => {
            // nothing
        })
            .then(() => {
            return func();
        })
            .catch((reason) => {
            throw reason;
        })
            .then((result) => {
            onfinish();
            return Promise.resolve(result);
        }, (error) => {
            onfinish();
            error.cause = errorForStacktrace;
            return Promise.reject(error);
        });
        const disconnectPromise = new Promise((resolve, reject) => {
            disconnectReject = (reason) => {
                onfinish();
                reason.cause = errorForStacktrace;
                reject(reason);
            };
            this.on('end', disconnectReject);
        });
        const resultPromise = Promise.race([doPromise, disconnectPromise]);
        this._commandPromises.push(resultPromise);
        return resultPromise;
    }
    _execCommandWait(buffer, waitOpcode) {
        const waitOpcodes = Array.isArray(waitOpcode)
            ? waitOpcode
            : [waitOpcode];
        let errorHandle = true;
        if (!waitOpcodes.includes(att_1.ATT.OP_ERROR)) {
            waitOpcodes.push(att_1.ATT.OP_ERROR);
            errorHandle = false;
        }
        return this._serialPromiseQueueWait(async () => {
            while (1) {
                this.writeAtt(buffer);
                const promises = [];
                for (const code of waitOpcodes) {
                    promises.push(this._aclStream.readWait(att_1.ATT.CID, code));
                }
                debug(`ATT: wait for opcode=${waitOpcodes}`);
                const data = await Promise.race(promises);
                const opCode = data.readUInt8(0);
                debug(`ATT: received opCode=${opCode}(${att_1.ATT_OP_READABLES[opCode]})`);
                if (opCode === att_1.ATT.OP_ERROR) {
                    const errCode = data[4];
                    if ((errCode === att_1.ATT.ECODE_AUTHENTICATION ||
                        errCode === att_1.ATT.ECODE_AUTHORIZATION ||
                        errCode === att_1.ATT.ECODE_INSUFF_ENC) &&
                        this._security !== 'medium') {
                        // retry after encrypt
                        debug(`ATT: going to encrypt and try it later.`);
                        await this._aclStream.encryptWait();
                        continue;
                    }
                    if (errorHandle) {
                        return data;
                    }
                    const requestOpCode = data.readUInt8(1);
                    const attributeHandle = data.readUInt16LE(2);
                    throw new ObnizError_1.ObnizBleAttError(errCode, `errorCode=${errCode}(${att_1.ATT_ECODE_READABLES[errCode]}) for request_opcode=${requestOpCode}(${att_1.ATT_OP_READABLES[requestOpCode]}) atributeHandle=${attributeHandle} `);
                }
                return data;
            }
            // unreachable here
            // eslint-disable-next-line no-unreachable
            return Buffer.from([]);
        });
    }
    _execNoRespCommandWait(buffer) {
        return this._serialPromiseQueueWait(async () => {
            this.writeAtt(buffer);
        });
    }
}
exports.GattCentral = GattCentral;
