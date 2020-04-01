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
        this.onAclStreamEncryptBinded = this.onAclStreamEncrypt.bind(this);
        this.onAclStreamEncryptFailBinded = this.onAclStreamEncryptFail.bind(this);
        this.onAclStreamEndBinded = this.onAclStreamEnd.bind(this);
        this._aclStream.on("data", this.onAclStreamDataBinded);
        this._aclStream.on("encrypt", this.onAclStreamEncryptBinded);
        this._aclStream.on("encryptFail", this.onAclStreamEncryptFailBinded);
        this._aclStream.on("end", this.onAclStreamEndBinded);
    }
    onAclStreamData(cid, data) {
        if (cid !== ATT.CID) {
            return;
        }
        if (this._currentCommand && data.toString("hex") === this._currentCommand.buffer.toString("hex")) {
            debug(this._address + ": echo ... echo ... echo ...");
        }
        else if (data[0] % 2 === 0) {
            if (process.env.NOBLE_MULTI_ROLE) {
                debug(this._address + ": multi-role flag in use, ignoring command meant for peripheral role.");
            }
            else {
                const requestType = data[0];
                debug(this._address + ": replying with REQ_NOT_SUPP to 0x" + requestType.toString(16));
                this.writeAtt(this.errorResponse(requestType, 0x0000, ATT.ECODE_REQ_NOT_SUPP));
            }
        }
        else if (data[0] === ATT.OP_HANDLE_NOTIFY || data[0] === ATT.OP_HANDLE_IND) {
            const valueHandle = data.readUInt16LE(1);
            const valueData = data.slice(3);
            this.emit("handleNotify", this._address, valueHandle, valueData);
            if (data[0] === ATT.OP_HANDLE_IND) {
                this._queueCommand(this.handleConfirmation(), null, () => {
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
        else if (!this._currentCommand) {
            debug(this._address + ": uh oh, no current command");
        }
        else {
            if (data[0] === ATT.OP_ERROR &&
                (data[4] === ATT.ECODE_AUTHENTICATION ||
                    data[4] === ATT.ECODE_AUTHORIZATION ||
                    data[4] === ATT.ECODE_INSUFF_ENC) &&
                this._security !== "medium") {
                this._aclStream.encrypt();
                return;
            }
            debug(this._address + ": read: " + data.toString("hex"));
            this._currentCommand.callback(data);
            this._currentCommand = null;
            this._runQueueCommand();
        }
    }
    onAclStreamEncrypt(encrypt) {
        if (encrypt) {
            this._security = "medium";
            if (this._currentCommand.type === "encrypt") {
                if (this._currentCommand.callback) {
                    this._currentCommand.callback({
                        stk: this._aclStream._smp._stk,
                        preq: this._aclStream._smp._preq,
                        pres: this._aclStream._smp._pres,
                        tk: this._aclStream._smp._tk,
                        r: this._aclStream._smp._r,
                        pcnf: this._aclStream._smp._pcnf,
                    });
                }
                this._currentCommand = null;
                this._runQueueCommand();
            }
            else {
                this.writeAtt(this._currentCommand.buffer);
            }
        }
    }
    encrypt(callback, keys) {
        this._commandQueue.push({
            type: "encrypt",
            keys,
            callback,
        });
        this._runQueueCommand();
    }
    onAclStreamEncryptFail() { }
    onAclStreamEnd() {
        this._aclStream.removeListener("data", this.onAclStreamDataBinded);
        this._aclStream.removeListener("encrypt", this.onAclStreamEncryptBinded);
        this._aclStream.removeListener("encryptFail", this.onAclStreamEncryptFailBinded);
        this._aclStream.removeListener("end", this.onAclStreamEndBinded);
    }
    writeAtt(data) {
        debug(this._address + ": write: " + data.toString("hex"));
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
    async exchangeMtuWait(mtu) {
        const data = await this._execCommand(this.mtuRequest(mtu));
        const opcode = data[0];
        if (opcode === ATT.OP_MTU_RESP) {
            const newMtu = data.readUInt16LE(1);
            debug(this._address + ": new MTU is " + newMtu);
            this._mtu = newMtu;
        }
        this.emit("mtu", this._address, this._mtu);
        return this._mtu;
    }
    async discoverServicesWait(uuids) {
        const services = [];
        let startHandle = 0x0001;
        while (1) {
            const data = await this._execCommand(this.readByGroupRequest(startHandle, 0xffff, GATT.PRIM_SVC_UUID));
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
                this.emit("servicesDiscover", this._address, serviceUuids);
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
            const data = await this._execCommand(this.readByTypeRequest(startHandle, service.endHandle, GATT.INCLUDE_UUID));
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
                this.emit("includedServicesDiscover", this._address, service.uuid, includedServiceUuids);
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
            const data = await this._execCommand(this.readByTypeRequest(startHandle, service.endHandle, GATT.CHARAC_UUID));
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
                this.emit("characteristicsDiscover", this._address, serviceUuid, characteristicsDiscovered);
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
                data = await this._execCommand(this.readRequest(characteristic.valueHandle));
            }
            else {
                data = await this._execCommand(this.readBlobRequest(characteristic.valueHandle, readData.length));
            }
            const opcode = data[0];
            if (opcode === ATT.OP_READ_RESP || opcode === ATT.OP_READ_BLOB_RESP) {
                readData = Buffer.from(readData.toString("hex") + data.slice(1).toString("hex"), "hex");
                if (data.length === this._mtu) {
                    continue;
                }
                else {
                    this.emit("read", this._address, serviceUuid, characteristicUuid, readData, true);
                    return readData;
                }
            }
            else if (opcode === ATT.OP_ERROR) {
                throw new ObnizError_1.ObnizBleOpError();
            }
            else {
                this.emit("read", this._address, serviceUuid, characteristicUuid, readData, true);
                return readData;
            }
        }
    }
    async writeWait(serviceUuid, characteristicUuid, data, withoutResponse) {
        const characteristic = this.getCharacteristic(serviceUuid, characteristicUuid);
        if (withoutResponse) {
            await this._execNoRespCommand(this.writeRequest(characteristic.valueHandle, data, true));
        }
        else if (data.length + 3 > this._mtu) {
            await this.longWriteWait(serviceUuid, characteristicUuid, data, withoutResponse);
        }
        else {
            const _data = await this._execCommand(this.writeRequest(characteristic.valueHandle, data, false));
            const opcode = _data[0];
            if (opcode !== ATT.OP_WRITE_RESP) {
            }
        }
        this.emit("write", this._address, serviceUuid, characteristicUuid);
    }
    async broadcastWait(serviceUuid, characteristicUuid, broadcast) {
        const characteristic = this.getCharacteristic(serviceUuid, characteristicUuid);
        const data = await this._execCommand(this.readByTypeRequest(characteristic.startHandle, characteristic.endHandle, GATT.SERVER_CHARAC_CFG_UUID));
        const opcode = data[0];
        if (opcode === ATT.OP_READ_BY_TYPE_RESP) {
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
            const _data = await this._execCommand(this.writeRequest(handle, valueBuffer, false));
            const _opcode = _data[0];
            if (_opcode === ATT.OP_WRITE_RESP) {
                this.emit("broadcast", this._address, serviceUuid, characteristicUuid, broadcast);
                return;
            }
        }
        throw new ObnizError_1.ObnizBleOpError();
    }
    async notifyWait(serviceUuid, characteristicUuid, notify) {
        const characteristic = this.getCharacteristic(serviceUuid, characteristicUuid);
        const data = await this._execCommand(this.readByTypeRequest(characteristic.startHandle, characteristic.endHandle, GATT.CLIENT_CHARAC_CFG_UUID));
        const opcode = data[0];
        if (opcode === ATT.OP_READ_BY_TYPE_RESP) {
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
            const _data = await this._execCommand(this.writeRequest(handle, valueBuffer, false));
            const _opcode = _data[0];
            debug("set notify write results: " + (_opcode === ATT.OP_WRITE_RESP));
            if (opcode === ATT.OP_WRITE_RESP) {
                this.emit("notify", this._address, serviceUuid, characteristicUuid, notify);
                return _opcode === ATT.OP_WRITE_RESP;
            }
        }
        throw new ObnizError_1.ObnizBleOpError();
    }
    async discoverDescriptorsWait(serviceUuid, characteristicUuid) {
        const characteristic = this.getCharacteristic(serviceUuid, characteristicUuid);
        const descriptors = [];
        this._descriptors[serviceUuid][characteristicUuid] = {};
        let startHandle = characteristic.valueHandle + 1;
        while (1) {
            const data = await this._execCommand(this.findInfoRequest(startHandle, characteristic.endHandle));
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
                this.emit("descriptorsDiscover", this._address, serviceUuid, characteristicUuid, descriptorUuids);
                return descriptorUuids;
            }
            startHandle = descriptors[descriptors.length - 1].handle + 1;
        }
    }
    async readValueWait(serviceUuid, characteristicUuid, descriptorUuid) {
        const descriptor = this.getDescriptor(serviceUuid, characteristicUuid, descriptorUuid);
        const data = await this._execCommand(this.readRequest(descriptor.handle));
        const opcode = data[0];
        if (opcode === ATT.OP_READ_RESP || opcode === ATT.OP_ERROR) {
            this.emit("valueRead", this._address, serviceUuid, characteristicUuid, descriptorUuid, data.slice(1), opcode === ATT.OP_READ_RESP);
            return data.slice(1);
        }
        throw new ObnizError_1.ObnizBleOpError();
    }
    async writeValueWait(serviceUuid, characteristicUuid, descriptorUuid, data) {
        const descriptor = this.getDescriptor(serviceUuid, characteristicUuid, descriptorUuid);
        const _data = await this._execCommand(this.writeRequest(descriptor.handle, data, false));
        const opcode = _data[0];
        if (opcode === ATT.OP_WRITE_RESP || opcode === ATT.OP_ERROR) {
            this.emit("valueWrite", this._address, serviceUuid, characteristicUuid, descriptorUuid, opcode === ATT.OP_WRITE_RESP);
            return;
        }
        throw new ObnizError_1.ObnizBleOpError();
    }
    async readHandle(handle) {
        const data = await this._execCommand(this.readRequest(handle));
        const opcode = data[0];
        if (opcode === ATT.OP_READ_RESP) {
            this.emit("handleRead", this._address, handle, data.slice(1));
            return data.slice(1);
        }
        throw new ObnizError_1.ObnizBleOpError();
    }
    async writeHandleWait(handle, data, withoutResponse) {
        if (withoutResponse) {
            await this._execNoRespCommand(this.writeRequest(handle, data, true));
            this.emit("handleWrite", this._address, handle);
        }
        else {
            const _data = await this._execCommand(this.writeRequest(handle, data, false));
            const opcode = _data[0];
            if (opcode === ATT.OP_WRITE_RESP) {
                this.emit("handleWrite", this._address, handle);
            }
        }
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
            const _resp = await this._execCommand(this.prepareWriteRequest(characteristic.valueHandle, offset, chunk));
            const _opcode = _resp[0];
            if (_opcode !== ATT.OP_PREPARE_WRITE_RESP) {
                throw new Error(": unexpected reply opcode " + _opcode + " (expecting ATT.OP_PREPARE_WRITE_RESP)");
            }
            else {
                const expected_length = chunk.length + 5;
                if (_resp.length !== expected_length) {
                    /* the response should contain the data packet echoed back to the caller */
                    throw new Error(`unexpected prepareWriteResponse length ${_resp.length} (expecting ${expected_length})`);
                }
            }
            offset = end;
        }
        /* queue the execute command with a callback to emit the write signal when done */
        const resp = await this._execCommand(this.executeWriteRequest(characteristic.valueHandle));
        const opcode = resp[0];
        if (opcode === ATT.OP_EXECUTE_WRITE_RESP && !withoutResponse) {
            return;
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
                if (this._currentCommand.type === "encrypt") {
                    this._aclStream.encrypt(this._currentCommand.keys);
                }
                else {
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
    }
    _execCommand(buffer) {
        const doPromise = Promise.all(this._commandPromises)
            .then(() => {
            return new Promise((resolve) => {
                this._queueCommand(buffer, resolve);
            });
        })
            .finally(() => {
            this._commandPromises = this._commandPromises.filter((e) => e === doPromise);
        });
        this._commandPromises.push(doPromise);
        return doPromise;
    }
    _execNoRespCommand(buffer) {
        return new Promise((resolve) => {
            this._queueCommand(buffer, null, resolve);
        });
    }
}
exports.default = Gatt;

//# sourceMappingURL=gatt.js.map
