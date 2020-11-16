"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// let debug = require('debug')('att');
const debug = () => { };
/* eslint-disable no-unused-vars */
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const ObnizError_1 = require("../../../../../ObnizError");
/**
 * @ignore
 */
var ATT;
(function (ATT) {
    ATT.OP_ERROR = 0x01;
    ATT.OP_MTU_REQ = 0x02;
    ATT.OP_MTU_RESP = 0x03;
    ATT.OP_FIND_INFO_REQ = 0x04;
    ATT.OP_FIND_INFO_RESP = 0x05;
    ATT.OP_READ_BY_TYPE_REQ = 0x08;
    ATT.OP_READ_BY_TYPE_RESP = 0x09;
    ATT.OP_READ_REQ = 0x0a;
    ATT.OP_READ_RESP = 0x0b;
    ATT.OP_READ_BLOB_REQ = 0x0c;
    ATT.OP_READ_BLOB_RESP = 0x0d;
    ATT.OP_READ_BY_GROUP_REQ = 0x10;
    ATT.OP_READ_BY_GROUP_RESP = 0x11;
    ATT.OP_WRITE_REQ = 0x12;
    ATT.OP_WRITE_RESP = 0x13;
    ATT.OP_PREPARE_WRITE_REQ = 0x16;
    ATT.OP_PREPARE_WRITE_RESP = 0x17;
    ATT.OP_EXECUTE_WRITE_REQ = 0x18;
    ATT.OP_EXECUTE_WRITE_RESP = 0x19;
    ATT.OP_HANDLE_NOTIFY = 0x1b;
    ATT.OP_HANDLE_IND = 0x1d;
    ATT.OP_HANDLE_CNF = 0x1e;
    ATT.OP_WRITE_CMD = 0x52;
    ATT.ECODE_SUCCESS = 0x00;
    ATT.ECODE_INVALID_HANDLE = 0x01;
    ATT.ECODE_READ_NOT_PERM = 0x02;
    ATT.ECODE_WRITE_NOT_PERM = 0x03;
    ATT.ECODE_INVALID_PDU = 0x04;
    ATT.ECODE_AUTHENTICATION = 0x05;
    ATT.ECODE_REQ_NOT_SUPP = 0x06;
    ATT.ECODE_INVALID_OFFSET = 0x07;
    ATT.ECODE_AUTHORIZATION = 0x08;
    ATT.ECODE_PREP_QUEUE_FULL = 0x09;
    ATT.ECODE_ATTR_NOT_FOUND = 0x0a;
    ATT.ECODE_ATTR_NOT_LONG = 0x0b;
    ATT.ECODE_INSUFF_ENCR_KEY_SIZE = 0x0c;
    ATT.ECODE_INVAL_ATTR_VALUE_LEN = 0x0d;
    ATT.ECODE_UNLIKELY = 0x0e;
    ATT.ECODE_INSUFF_ENC = 0x0f;
    ATT.ECODE_UNSUPP_GRP_TYPE = 0x10;
    ATT.ECODE_INSUFF_RESOURCES = 0x11;
    ATT.CID = 0x0004;
})(ATT || (ATT = {}));
const ATT_OP_READABLES = {
    0x01: "OP_ERROR",
    0x02: "OP_MTU_REQ",
    0x03: "OP_MTU_RESP",
    0x04: "OP_FIND_INFO_REQ",
    0x05: "OP_FIND_INFO_RESP",
    0x08: "OP_READ_BY_TYPE_REQ",
    0x09: "OP_READ_BY_TYPE_RESP",
    0x0a: "OP_READ_REQ",
    0x0b: "OP_READ_RESP",
    0x0c: "OP_READ_BLOB_REQ",
    0x0d: "OP_READ_BLOB_RESP",
    0x10: "OP_READ_BY_GROUP_REQ",
    0x11: "OP_READ_BY_GROUP_RESP",
    0x12: "OP_WRITE_REQ",
    0x13: "OP_WRITE_RESP",
    0x16: "OP_PREPARE_WRITE_REQ",
    0x17: "OP_PREPARE_WRITE_RESP",
    0x18: "OP_EXECUTE_WRITE_REQ",
    0x19: "OP_EXECUTE_WRITE_RESP",
    0x1b: "OP_HANDLE_NOTIFY",
    0x1d: "OP_HANDLE_IND",
    0x1e: "OP_HANDLE_CNF",
    0x52: "OP_WRITE_CMD",
};
const ATT_ECODE_READABLES = {
    0x00: "ECODE_SUCCESS",
    0x01: "ECODE_INVALID_HANDLE",
    0x02: "ECODE_READ_NOT_PERM",
    0x03: "ECODE_WRITE_NOT_PERM",
    0x04: "ECODE_INVALID_PDU",
    0x05: "ECODE_AUTHENTICATION",
    0x06: "ECODE_REQ_NOT_SUPP",
    0x07: "ECODE_INVALID_OFFSET",
    0x08: "ECODE_AUTHORIZATION",
    0x09: "ECODE_PREP_QUEUE_FULL",
    0x0a: "ECODE_ATTR_NOT_FOUND",
    0x0b: "ECODE_ATTR_NOT_LONG",
    0x0c: "ECODE_INSUFF_ENCR_KEY_SIZE",
    0x0d: "ECODE_INVAL_ATTR_VALUE_LEN",
    0x0e: "ECODE_UNLIKELY",
    0x0f: "ECODE_INSUFF_ENC",
    0x10: "ECODE_UNSUPP_GRP_TYPE",
    0x11: "ECODE_INSUFF_RESOURCES",
};
/**
 * @ignore
 */
var GATT;
(function (GATT) {
    GATT.PRIM_SVC_UUID = 0x2800;
    GATT.INCLUDE_UUID = 0x2802;
    GATT.CHARAC_UUID = 0x2803;
    GATT.CLIENT_CHARAC_CFG_UUID = 0x2902;
    GATT.SERVER_CHARAC_CFG_UUID = 0x2903;
})(GATT || (GATT = {}));
/**
 * @ignore
 */
class Gatt extends eventemitter3_1.default {
    constructor(address, aclStream) {
        super();
        this._address = address;
        this._aclStream = aclStream;
        this._services = {};
        this._characteristics = {};
        this._descriptors = {};
        this._currentCommand = null;
        this._commandQueue = [];
        this._commandPromises = [];
        this._mtu = 23;
        this._security = "low";
        this.onAclStreamDataBinded = this.onAclStreamData.bind(this);
        this.onAclStreamEndBinded = this.onAclStreamEnd.bind(this);
        this._aclStream.on("data", this.onAclStreamDataBinded);
        this._aclStream.on("end", this.onAclStreamEndBinded);
    }
    async encryptWait(options) {
        const result = await this._serialPromiseQueueWait(async () => {
            const encrypt = await this._aclStream.encryptWait(options);
            if (encrypt === 0) {
                throw new Error("Encript failed");
            }
            this._security = "medium";
            return this._aclStream._smp.getKeys();
        });
        return result;
    }
    setEncryptOption(options) {
        this._aclStream.setEncryptOption(options);
    }
    onEnd(reason) {
        this.emit("end", reason);
    }
    async exchangeMtuWait(mtu) {
        const data = await this._execCommandWait(this.mtuRequest(mtu), ATT.OP_MTU_RESP);
        const opcode = data[0];
        const newMtu = data.readUInt16LE(1);
        debug(this._address + ": new MTU is " + newMtu);
        this._mtu = newMtu;
        return this._mtu;
    }
    async discoverServicesWait(uuids) {
        const services = [];
        let startHandle = 0x0001;
        while (1) {
            const data = await this._execCommandWait(this.readByGroupRequest(startHandle, 0xffff, GATT.PRIM_SVC_UUID), [
                ATT.OP_READ_BY_GROUP_RESP,
                ATT.OP_ERROR,
            ]);
            const opcode = data[0];
            let i = 0;
            if (opcode === ATT.OP_READ_BY_GROUP_RESP) {
                const type = data[1];
                const num = (data.length - 2) / type;
                for (i = 0; i < num; i++) {
                    services.push({
                        startHandle: data.readUInt16LE(2 + i * type + 0),
                        endHandle: data.readUInt16LE(2 + i * type + 2),
                        uuid: type === 6
                            ? data.readUInt16LE(2 + i * type + 4).toString(16)
                            : data
                                .slice(2 + i * type + 4)
                                .slice(0, 16)
                                .toString("hex")
                                .match(/.{1,2}/g)
                                .reverse()
                                .join(""),
                    });
                }
            }
            if (opcode !== ATT.OP_READ_BY_GROUP_RESP || services[services.length - 1].endHandle === 0xffff) {
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
    }
    async discoverIncludedServicesWait(serviceUuid, uuids) {
        const service = this.getService(serviceUuid);
        const includedServices = [];
        let startHandle = service.startHandle;
        while (1) {
            const data = await this._execCommandWait(this.readByTypeRequest(startHandle, service.endHandle, GATT.INCLUDE_UUID), [ATT.OP_READ_BY_TYPE_RESP, ATT.OP_ERROR]);
            const opcode = data[0];
            let i = 0;
            if (opcode === ATT.OP_READ_BY_TYPE_RESP) {
                const type = data[1];
                const num = (data.length - 2) / type;
                for (i = 0; i < num; i++) {
                    includedServices.push({
                        endHandle: data.readUInt16LE(2 + i * type + 0),
                        startHandle: data.readUInt16LE(2 + i * type + 2),
                        uuid: type === 8
                            ? data.readUInt16LE(2 + i * type + 6).toString(16)
                            : data
                                .slice(2 + i * type + 6)
                                .slice(0, 16)
                                .toString("hex")
                                .match(/.{1,2}/g)
                                .reverse()
                                .join(""),
                    });
                }
            }
            if (opcode !== ATT.OP_READ_BY_TYPE_RESP ||
                includedServices[includedServices.length - 1].endHandle === service.endHandle) {
                const includedServiceUuids = [];
                for (i = 0; i < includedServices.length; i++) {
                    if (uuids.length === 0 || uuids.indexOf(includedServices[i].uuid) !== -1) {
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
        this._characteristics[serviceUuid] = this._characteristics[serviceUuid] || {};
        this._descriptors[serviceUuid] = this._descriptors[serviceUuid] || {};
        let startHandle = service.startHandle;
        while (1) {
            const data = await this._execCommandWait(this.readByTypeRequest(startHandle, service.endHandle, GATT.CHARAC_UUID), [ATT.OP_READ_BY_TYPE_RESP, ATT.OP_ERROR]);
            const opcode = data[0];
            let i = 0;
            if (opcode === ATT.OP_READ_BY_TYPE_RESP) {
                const type = data[1];
                const num = (data.length - 2) / type;
                for (i = 0; i < num; i++) {
                    characteristics.push({
                        startHandle: data.readUInt16LE(2 + i * type + 0),
                        properties: data.readUInt8(2 + i * type + 2),
                        valueHandle: data.readUInt16LE(2 + i * type + 3),
                        uuid: type === 7
                            ? data.readUInt16LE(2 + i * type + 5).toString(16)
                            : data
                                .slice(2 + i * type + 5)
                                .slice(0, 16)
                                .toString("hex")
                                .match(/.{1,2}/g)
                                .reverse()
                                .join(""),
                    });
                }
            }
            if (opcode !== ATT.OP_READ_BY_TYPE_RESP ||
                characteristics[characteristics.length - 1].valueHandle === service.endHandle) {
                const characteristicsDiscovered = [];
                for (i = 0; i < characteristics.length; i++) {
                    const properties = characteristics[i].properties;
                    const characteristic = {
                        properties: [],
                        uuid: characteristics[i].uuid,
                    };
                    if (i !== 0) {
                        characteristics[i - 1].endHandle = characteristics[i].startHandle - 1;
                    }
                    if (i === characteristics.length - 1) {
                        characteristics[i].endHandle = service.endHandle;
                    }
                    this._characteristics[serviceUuid][characteristics[i].uuid] = characteristics[i];
                    if (properties & 0x01) {
                        characteristic.properties.push("broadcast");
                    }
                    if (properties & 0x02) {
                        characteristic.properties.push("read");
                    }
                    if (properties & 0x04) {
                        characteristic.properties.push("writeWithoutResponse");
                    }
                    if (properties & 0x08) {
                        characteristic.properties.push("write");
                    }
                    if (properties & 0x10) {
                        characteristic.properties.push("notify");
                    }
                    if (properties & 0x20) {
                        characteristic.properties.push("indicate");
                    }
                    if (properties & 0x40) {
                        characteristic.properties.push("authenticatedSignedWrites");
                    }
                    if (properties & 0x80) {
                        characteristic.properties.push("extendedProperties");
                    }
                    if (characteristicUuids.length === 0 || characteristicUuids.indexOf(characteristic.uuid) !== -1) {
                        characteristicsDiscovered.push(characteristic);
                    }
                }
                return characteristicsDiscovered;
            }
            startHandle = characteristics[characteristics.length - 1].valueHandle + 1;
        }
    }
    async readWait(serviceUuid, characteristicUuid) {
        const characteristic = this.getCharacteristic(serviceUuid, characteristicUuid);
        let readData = Buffer.alloc(0);
        while (1) {
            let data;
            if (readData.length === 0) {
                data = await this._execCommandWait(this.readRequest(characteristic.valueHandle), ATT.OP_READ_RESP);
            }
            else {
                data = await this._execCommandWait(this.readBlobRequest(characteristic.valueHandle, readData.length), ATT.OP_READ_BLOB_RESP);
            }
            const opcode = data[0];
            readData = Buffer.from(readData.toString("hex") + data.slice(1).toString("hex"), "hex");
            if (data.length === this._mtu) {
                continue;
            }
            else {
                return readData;
            }
        }
        return readData;
    }
    async writeWait(serviceUuid, characteristicUuid, data, withoutResponse) {
        const characteristic = this.getCharacteristic(serviceUuid, characteristicUuid);
        if (withoutResponse) {
            await this._execNoRespCommandWait(this.writeRequest(characteristic.valueHandle, data, true));
        }
        else if (data.length + 3 > this._mtu) {
            await this.longWriteWait(serviceUuid, characteristicUuid, data, withoutResponse);
        }
        else {
            await this._execCommandWait(this.writeRequest(characteristic.valueHandle, data, false), ATT.OP_WRITE_RESP);
        }
    }
    async broadcastWait(serviceUuid, characteristicUuid, broadcast) {
        const characteristic = this.getCharacteristic(serviceUuid, characteristicUuid);
        const data = await this._execCommandWait(this.readByTypeRequest(characteristic.startHandle, characteristic.endHandle, GATT.SERVER_CHARAC_CFG_UUID), ATT.OP_READ_BY_TYPE_RESP);
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
        const _data = await this._execCommandWait(this.writeRequest(handle, valueBuffer, false), ATT.OP_WRITE_RESP);
    }
    async notifyWait(serviceUuid, characteristicUuid, notify) {
        const characteristic = this.getCharacteristic(serviceUuid, characteristicUuid);
        const data = await this._execCommandWait(this.readByTypeRequest(characteristic.startHandle, characteristic.endHandle, GATT.CLIENT_CHARAC_CFG_UUID), ATT.OP_READ_BY_TYPE_RESP);
        const opcode = data[0];
        // let type = data[1];
        const handle = data.readUInt16LE(2);
        let value = data.readUInt16LE(4);
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
        const _data = await this._execCommandWait(this.writeRequest(handle, valueBuffer, false), ATT.OP_WRITE_RESP);
        const _opcode = _data[0];
        debug("set notify write results: " + (_opcode === ATT.OP_WRITE_RESP));
    }
    async discoverDescriptorsWait(serviceUuid, characteristicUuid) {
        const characteristic = this.getCharacteristic(serviceUuid, characteristicUuid);
        const descriptors = [];
        this._descriptors[serviceUuid][characteristicUuid] = {};
        let startHandle = characteristic.valueHandle + 1;
        while (1) {
            const data = await this._execCommandWait(this.findInfoRequest(startHandle, characteristic.endHandle), [
                ATT.OP_FIND_INFO_RESP,
                ATT.OP_ERROR,
            ]);
            const opcode = data[0];
            let i = 0;
            if (opcode === ATT.OP_FIND_INFO_RESP) {
                const num = data[1];
                for (i = 0; i < num; i++) {
                    descriptors.push({
                        handle: data.readUInt16LE(2 + i * 4 + 0),
                        uuid: data.readUInt16LE(2 + i * 4 + 2).toString(16),
                    });
                }
            }
            if (opcode !== ATT.OP_FIND_INFO_RESP || descriptors[descriptors.length - 1].handle === characteristic.endHandle) {
                const descriptorUuids = [];
                for (i = 0; i < descriptors.length; i++) {
                    descriptorUuids.push(descriptors[i].uuid);
                    this._descriptors[serviceUuid][characteristicUuid][descriptors[i].uuid] = descriptors[i];
                }
                return descriptorUuids;
            }
            startHandle = descriptors[descriptors.length - 1].handle + 1;
        }
    }
    async readValueWait(serviceUuid, characteristicUuid, descriptorUuid) {
        const descriptor = this.getDescriptor(serviceUuid, characteristicUuid, descriptorUuid);
        const data = await this._execCommandWait(this.readRequest(descriptor.handle), ATT.OP_READ_RESP);
        return data.slice(1);
    }
    async writeValueWait(serviceUuid, characteristicUuid, descriptorUuid, data) {
        const descriptor = this.getDescriptor(serviceUuid, characteristicUuid, descriptorUuid);
        await this._execCommandWait(this.writeRequest(descriptor.handle, data, false), ATT.OP_WRITE_RESP);
    }
    async readHandleWait(handle) {
        const data = await this._execCommandWait(this.readRequest(handle), ATT.OP_READ_RESP);
        return data.slice(1);
    }
    async writeHandleWait(handle, data, withoutResponse) {
        if (withoutResponse) {
            await this._execNoRespCommandWait(this.writeRequest(handle, data, true));
        }
        else {
            await this._execCommandWait(this.writeRequest(handle, data, false), ATT.OP_WRITE_RESP);
        }
    }
    onAclStreamData(cid, data) {
        if (cid !== ATT.CID) {
            return;
        }
        // notify / indicate
        if (data[0] === ATT.OP_HANDLE_NOTIFY || data[0] === ATT.OP_HANDLE_IND) {
            const valueHandle = data.readUInt16LE(1);
            const valueData = data.slice(3);
            this.emit("handleNotify", this._address, valueHandle, valueData);
            if (data[0] === ATT.OP_HANDLE_IND) {
                // background
                this._execNoRespCommandWait(this.handleConfirmation()).then(() => {
                    this.emit("handleConfirmation", this._address, valueHandle);
                });
            }
            for (const serviceUuid in this._services) {
                for (const characteristicUuid in this._characteristics[serviceUuid]) {
                    if (this._characteristics[serviceUuid][characteristicUuid].valueHandle === valueHandle) {
                        this.emit("notification", this._address, serviceUuid, characteristicUuid, valueData);
                    }
                }
            }
        }
    }
    onAclStreamEnd() {
        this._aclStream.removeListener("data", this.onAclStreamDataBinded);
        this._aclStream.removeListener("end", this.onAclStreamEndBinded);
    }
    writeAtt(data) {
        const opCode = data[0];
        const handle = data.length > 3 ? data.readUInt16LE(1) : "none";
        debug(`ATT: opCode=${opCode}(${ATT_OP_READABLES[opCode]}) handle=${handle} address=` +
            this._address +
            ": write: " +
            data.toString("hex"));
        this._aclStream.write(ATT.CID, data);
    }
    errorResponse(opcode, handle, status) {
        const buf = Buffer.alloc(5);
        buf.writeUInt8(ATT.OP_ERROR, 0);
        buf.writeUInt8(opcode, 1);
        buf.writeUInt16LE(handle, 2);
        buf.writeUInt8(status, 4);
        return buf;
    }
    mtuRequest(mtu) {
        const buf = Buffer.alloc(3);
        buf.writeUInt8(ATT.OP_MTU_REQ, 0);
        buf.writeUInt16LE(mtu, 1);
        return buf;
    }
    readByGroupRequest(startHandle, endHandle, groupUuid) {
        const buf = Buffer.alloc(7);
        buf.writeUInt8(ATT.OP_READ_BY_GROUP_REQ, 0);
        buf.writeUInt16LE(startHandle, 1);
        buf.writeUInt16LE(endHandle, 3);
        buf.writeUInt16LE(groupUuid, 5);
        return buf;
    }
    readByTypeRequest(startHandle, endHandle, groupUuid) {
        const buf = Buffer.alloc(7);
        buf.writeUInt8(ATT.OP_READ_BY_TYPE_REQ, 0);
        buf.writeUInt16LE(startHandle, 1);
        buf.writeUInt16LE(endHandle, 3);
        buf.writeUInt16LE(groupUuid, 5);
        return buf;
    }
    readRequest(handle) {
        const buf = Buffer.alloc(3);
        buf.writeUInt8(ATT.OP_READ_REQ, 0);
        buf.writeUInt16LE(handle, 1);
        return buf;
    }
    readBlobRequest(handle, offset) {
        const buf = Buffer.alloc(5);
        buf.writeUInt8(ATT.OP_READ_BLOB_REQ, 0);
        buf.writeUInt16LE(handle, 1);
        buf.writeUInt16LE(offset, 3);
        return buf;
    }
    findInfoRequest(startHandle, endHandle) {
        const buf = Buffer.alloc(5);
        buf.writeUInt8(ATT.OP_FIND_INFO_REQ, 0);
        buf.writeUInt16LE(startHandle, 1);
        buf.writeUInt16LE(endHandle, 3);
        return buf;
    }
    writeRequest(handle, data, withoutResponse) {
        const buf = Buffer.alloc(3 + data.length);
        buf.writeUInt8(withoutResponse ? ATT.OP_WRITE_CMD : ATT.OP_WRITE_REQ, 0);
        buf.writeUInt16LE(handle, 1);
        for (let i = 0; i < data.length; i++) {
            buf.writeUInt8(data.readUInt8(i), i + 3);
        }
        return buf;
    }
    prepareWriteRequest(handle, offset, data) {
        const buf = Buffer.alloc(5 + data.length);
        buf.writeUInt8(ATT.OP_PREPARE_WRITE_REQ, 0);
        buf.writeUInt16LE(handle, 1);
        buf.writeUInt16LE(offset, 3);
        for (let i = 0; i < data.length; i++) {
            buf.writeUInt8(data.readUInt8(i), i + 5);
        }
        return buf;
    }
    executeWriteRequest(handle, cancelPreparedWrites) {
        const buf = Buffer.alloc(2);
        buf.writeUInt8(ATT.OP_EXECUTE_WRITE_REQ, 0);
        buf.writeUInt8(cancelPreparedWrites ? 0 : 1, 1);
        return buf;
    }
    handleConfirmation() {
        const buf = Buffer.alloc(1);
        buf.writeUInt8(ATT.OP_HANDLE_CNF, 0);
        return buf;
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
            const _resp = await this._execCommandWait(this.prepareWriteRequest(characteristic.valueHandle, offset, chunk), ATT.OP_PREPARE_WRITE_RESP);
            const expected_length = chunk.length + 5;
            if (_resp.length !== expected_length) {
                /* the response should contain the data packet echoed back to the caller */
                throw new Error(`unexpected prepareWriteResponse length ${_resp.length} (expecting ${expected_length})`);
            }
            offset = end;
        }
        if (withoutResponse) {
            await this._execNoRespCommandWait(this.executeWriteRequest(characteristic.valueHandle));
        }
        else {
            await this._execCommandWait(this.executeWriteRequest(characteristic.valueHandle), ATT.OP_EXECUTE_WRITE_RESP);
        }
        throw new ObnizError_1.ObnizBleOpError();
    }
    getService(serviceUuid) {
        if (!this._services[serviceUuid]) {
            throw new ObnizError_1.ObnizBleUnknownServiceError(this._address, serviceUuid);
        }
        return this._services[serviceUuid];
    }
    getCharacteristic(serviceUuid, characteristicUuid) {
        if (!this._characteristics[serviceUuid] || !this._characteristics[serviceUuid][characteristicUuid]) {
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
                this.off("end", disconnectReject);
            }
        };
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
            return Promise.reject(error);
        });
        const disconnectPromise = new Promise((resolve, reject) => {
            disconnectReject = (reason) => {
                onfinish();
                reject(reason);
            };
            this.on("end", disconnectReject);
        });
        const resultPromise = Promise.race([doPromise, disconnectPromise]);
        this._commandPromises.push(resultPromise);
        return resultPromise;
    }
    _execCommandWait(buffer, waitOpcode) {
        const waitOpcodes = Array.isArray(waitOpcode) ? waitOpcode : [waitOpcode];
        let errorHandle = true;
        if (!waitOpcodes.includes(ATT.OP_ERROR)) {
            waitOpcodes.push(ATT.OP_ERROR);
            errorHandle = false;
        }
        return this._serialPromiseQueueWait(async () => {
            while (1) {
                this.writeAtt(buffer);
                const promises = [];
                for (const code of waitOpcodes) {
                    promises.push(this._aclStream.readWait(ATT.CID, code));
                }
                debug(`ATT: wait for opcode=${waitOpcodes}`);
                const data = await Promise.race(promises);
                const opCode = data.readUInt8(0);
                debug(`ATT: received opCode=${opCode}(${ATT_OP_READABLES[opCode]})`);
                if (opCode === ATT.OP_ERROR) {
                    const errCode = data[4];
                    if ((errCode === ATT.ECODE_AUTHENTICATION ||
                        errCode === ATT.ECODE_AUTHORIZATION ||
                        errCode === ATT.ECODE_INSUFF_ENC) &&
                        this._security !== "medium") {
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
                    throw new ObnizError_1.ObnizBleAttError(errCode, `errorCode=${errCode}(${ATT_ECODE_READABLES[errCode]}) for request_opcode=${requestOpCode}(${ATT_OP_READABLES[requestOpCode]}) atributeHandle=${attributeHandle} `);
                }
                return data;
            }
        }).catch((reason) => {
            throw reason;
        });
    }
    _execNoRespCommandWait(buffer) {
        return this._serialPromiseQueueWait(async () => {
            this.writeAtt(buffer);
        });
    }
}
exports.default = Gatt;
