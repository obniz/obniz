"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// let debug = require('debug')('att');
const debug = () => {
};
/* eslint-disable no-unused-vars */
const events = require("events");
const ATT_OP_ERROR = 0x01;
const ATT_OP_MTU_REQ = 0x02;
const ATT_OP_MTU_RESP = 0x03;
const ATT_OP_FIND_INFO_REQ = 0x04;
const ATT_OP_FIND_INFO_RESP = 0x05;
const ATT_OP_READ_BY_TYPE_REQ = 0x08;
const ATT_OP_READ_BY_TYPE_RESP = 0x09;
const ATT_OP_READ_REQ = 0x0a;
const ATT_OP_READ_RESP = 0x0b;
const ATT_OP_READ_BLOB_REQ = 0x0c;
const ATT_OP_READ_BLOB_RESP = 0x0d;
const ATT_OP_READ_BY_GROUP_REQ = 0x10;
const ATT_OP_READ_BY_GROUP_RESP = 0x11;
const ATT_OP_WRITE_REQ = 0x12;
const ATT_OP_WRITE_RESP = 0x13;
const ATT_OP_PREPARE_WRITE_REQ = 0x16;
const ATT_OP_PREPARE_WRITE_RESP = 0x17;
const ATT_OP_EXECUTE_WRITE_REQ = 0x18;
const ATT_OP_EXECUTE_WRITE_RESP = 0x19;
const ATT_OP_HANDLE_NOTIFY = 0x1b;
const ATT_OP_HANDLE_IND = 0x1d;
const ATT_OP_HANDLE_CNF = 0x1e;
const ATT_OP_WRITE_CMD = 0x52;
const ATT_ECODE_SUCCESS = 0x00;
const ATT_ECODE_INVALID_HANDLE = 0x01;
const ATT_ECODE_READ_NOT_PERM = 0x02;
const ATT_ECODE_WRITE_NOT_PERM = 0x03;
const ATT_ECODE_INVALID_PDU = 0x04;
const ATT_ECODE_AUTHENTICATION = 0x05;
const ATT_ECODE_REQ_NOT_SUPP = 0x06;
const ATT_ECODE_INVALID_OFFSET = 0x07;
const ATT_ECODE_AUTHORIZATION = 0x08;
const ATT_ECODE_PREP_QUEUE_FULL = 0x09;
const ATT_ECODE_ATTR_NOT_FOUND = 0x0a;
const ATT_ECODE_ATTR_NOT_LONG = 0x0b;
const ATT_ECODE_INSUFF_ENCR_KEY_SIZE = 0x0c;
const ATT_ECODE_INVAL_ATTR_VALUE_LEN = 0x0d;
const ATT_ECODE_UNLIKELY = 0x0e;
const ATT_ECODE_INSUFF_ENC = 0x0f;
const ATT_ECODE_UNSUPP_GRP_TYPE = 0x10;
const ATT_ECODE_INSUFF_RESOURCES = 0x11;
const GATT_PRIM_SVC_UUID = 0x2800;
const GATT_INCLUDE_UUID = 0x2802;
const GATT_CHARAC_UUID = 0x2803;
const GATT_CLIENT_CHARAC_CFG_UUID = 0x2902;
const GATT_SERVER_CHARAC_CFG_UUID = 0x2903;
const ATT_CID = 0x0004;
/* eslint-enable no-unused-vars */
class Gatt extends events.EventEmitter {
    constructor(address, aclStream) {
        super();
        this._address = address;
        this._aclStream = aclStream;
        this._services = {};
        this._characteristics = {};
        this._descriptors = {};
        this._currentCommand = null;
        this._commandQueue = [];
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
        if (cid !== ATT_CID) {
            return;
        }
        if (this._currentCommand &&
            data.toString("hex") === this._currentCommand.buffer.toString("hex")) {
            debug(this._address + ": echo ... echo ... echo ...");
        }
        else if (data[0] % 2 === 0) {
            if (process.env.NOBLE_MULTI_ROLE) {
                debug(this._address +
                    ": multi-role flag in use, ignoring command meant for peripheral role.");
            }
            else {
                const requestType = data[0];
                debug(this._address +
                    ": replying with REQ_NOT_SUPP to 0x" +
                    requestType.toString(16));
                this.writeAtt(this.errorResponse(requestType, 0x0000, ATT_ECODE_REQ_NOT_SUPP));
            }
        }
        else if (data[0] === ATT_OP_HANDLE_NOTIFY ||
            data[0] === ATT_OP_HANDLE_IND) {
            const valueHandle = data.readUInt16LE(1);
            const valueData = data.slice(3);
            this.emit("handleNotify", this._address, valueHandle, valueData);
            if (data[0] === ATT_OP_HANDLE_IND) {
                this._queueCommand(this.handleConfirmation(), null, () => {
                    this.emit("handleConfirmation", this._address, valueHandle);
                });
            }
            for (const serviceUuid in this._services) {
                for (const characteristicUuid in this._characteristics[serviceUuid]) {
                    if (this._characteristics[serviceUuid][characteristicUuid]
                        .valueHandle === valueHandle) {
                        this.emit("notification", this._address, serviceUuid, characteristicUuid, valueData);
                    }
                }
            }
        }
        else if (!this._currentCommand) {
            debug(this._address + ": uh oh, no current command");
        }
        else {
            if (data[0] === ATT_OP_ERROR &&
                (data[4] === ATT_ECODE_AUTHENTICATION ||
                    data[4] === ATT_ECODE_AUTHORIZATION ||
                    data[4] === ATT_ECODE_INSUFF_ENC) &&
                this._security !== "medium") {
                this._aclStream.encrypt();
                return;
            }
            debug(this._address + ": read: " + data.toString("hex"));
            this._currentCommand.callback(data);
            this._currentCommand = null;
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
    onAclStreamEncrypt(encrypt) {
        if (encrypt) {
            this._security = "medium";
            this.writeAtt(this._currentCommand.buffer);
        }
    }
    onAclStreamEncryptFail() {
    }
    onAclStreamEnd() {
        this._aclStream.removeListener("data", this.onAclStreamDataBinded);
        this._aclStream.removeListener("encrypt", this.onAclStreamEncryptBinded);
        this._aclStream.removeListener("encryptFail", this.onAclStreamEncryptFailBinded);
        this._aclStream.removeListener("end", this.onAclStreamEndBinded);
    }
    writeAtt(data) {
        debug(this._address + ": write: " + data.toString("hex"));
        this._aclStream.write(ATT_CID, data);
    }
    errorResponse(opcode, handle, status) {
        const buf = Buffer.alloc(5);
        buf.writeUInt8(ATT_OP_ERROR, 0);
        buf.writeUInt8(opcode, 1);
        buf.writeUInt16LE(handle, 2);
        buf.writeUInt8(status, 4);
        return buf;
    }
    _queueCommand(buffer, callback, writeCallback) {
        this._commandQueue.push({
            buffer,
            callback,
            writeCallback,
        });
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
    mtuRequest(mtu) {
        const buf = Buffer.alloc(3);
        buf.writeUInt8(ATT_OP_MTU_REQ, 0);
        buf.writeUInt16LE(mtu, 1);
        return buf;
    }
    readByGroupRequest(startHandle, endHandle, groupUuid) {
        const buf = Buffer.alloc(7);
        buf.writeUInt8(ATT_OP_READ_BY_GROUP_REQ, 0);
        buf.writeUInt16LE(startHandle, 1);
        buf.writeUInt16LE(endHandle, 3);
        buf.writeUInt16LE(groupUuid, 5);
        return buf;
    }
    readByTypeRequest(startHandle, endHandle, groupUuid) {
        const buf = Buffer.alloc(7);
        buf.writeUInt8(ATT_OP_READ_BY_TYPE_REQ, 0);
        buf.writeUInt16LE(startHandle, 1);
        buf.writeUInt16LE(endHandle, 3);
        buf.writeUInt16LE(groupUuid, 5);
        return buf;
    }
    readRequest(handle) {
        const buf = Buffer.alloc(3);
        buf.writeUInt8(ATT_OP_READ_REQ, 0);
        buf.writeUInt16LE(handle, 1);
        return buf;
    }
    readBlobRequest(handle, offset) {
        const buf = Buffer.alloc(5);
        buf.writeUInt8(ATT_OP_READ_BLOB_REQ, 0);
        buf.writeUInt16LE(handle, 1);
        buf.writeUInt16LE(offset, 3);
        return buf;
    }
    findInfoRequest(startHandle, endHandle) {
        const buf = Buffer.alloc(5);
        buf.writeUInt8(ATT_OP_FIND_INFO_REQ, 0);
        buf.writeUInt16LE(startHandle, 1);
        buf.writeUInt16LE(endHandle, 3);
        return buf;
    }
    writeRequest(handle, data, withoutResponse) {
        const buf = Buffer.alloc(3 + data.length);
        buf.writeUInt8(withoutResponse ? ATT_OP_WRITE_CMD : ATT_OP_WRITE_REQ, 0);
        buf.writeUInt16LE(handle, 1);
        for (let i = 0; i < data.length; i++) {
            buf.writeUInt8(data.readUInt8(i), i + 3);
        }
        return buf;
    }
    prepareWriteRequest(handle, offset, data) {
        const buf = Buffer.alloc(5 + data.length);
        buf.writeUInt8(ATT_OP_PREPARE_WRITE_REQ, 0);
        buf.writeUInt16LE(handle, 1);
        buf.writeUInt16LE(offset, 3);
        for (let i = 0; i < data.length; i++) {
            buf.writeUInt8(data.readUInt8(i), i + 5);
        }
        return buf;
    }
    executeWriteRequest(handle, cancelPreparedWrites) {
        const buf = Buffer.alloc(2);
        buf.writeUInt8(ATT_OP_EXECUTE_WRITE_REQ, 0);
        buf.writeUInt8(cancelPreparedWrites ? 0 : 1, 1);
        return buf;
    }
    handleConfirmation() {
        const buf = Buffer.alloc(1);
        buf.writeUInt8(ATT_OP_HANDLE_CNF, 0);
        return buf;
    }
    exchangeMtu(mtu) {
        this._queueCommand(this.mtuRequest(mtu), (data) => {
            const opcode = data[0];
            if (opcode === ATT_OP_MTU_RESP) {
                const newMtu = data.readUInt16LE(1);
                debug(this._address + ": new MTU is " + newMtu);
                this._mtu = newMtu;
            }
            this.emit("mtu", this._address, this._mtu);
        });
    }
    discoverServices(uuids) {
        const services = [];
        const callback = (data) => {
            const opcode = data[0];
            let i = 0;
            if (opcode === ATT_OP_READ_BY_GROUP_RESP) {
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
            if (opcode !== ATT_OP_READ_BY_GROUP_RESP ||
                services[services.length - 1].endHandle === 0xffff) {
                const serviceUuids = [];
                for (i = 0; i < services.length; i++) {
                    if (uuids.length === 0 || uuids.indexOf(services[i].uuid) !== -1) {
                        serviceUuids.push(services[i].uuid);
                    }
                    this._services[services[i].uuid] = services[i];
                }
                this.emit("servicesDiscover", this._address, serviceUuids);
            }
            else {
                this._queueCommand(this.readByGroupRequest(services[services.length - 1].endHandle + 1, 0xffff, GATT_PRIM_SVC_UUID), callback);
            }
        };
        this._queueCommand(this.readByGroupRequest(0x0001, 0xffff, GATT_PRIM_SVC_UUID), callback);
    }
    discoverIncludedServices(serviceUuid, uuids) {
        const service = this._services[serviceUuid];
        const includedServices = [];
        const callback = (data) => {
            const opcode = data[0];
            let i = 0;
            if (opcode === ATT_OP_READ_BY_TYPE_RESP) {
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
            if (opcode !== ATT_OP_READ_BY_TYPE_RESP ||
                includedServices[includedServices.length - 1].endHandle ===
                    service.endHandle) {
                const includedServiceUuids = [];
                for (i = 0; i < includedServices.length; i++) {
                    if (uuids.length === 0 ||
                        uuids.indexOf(includedServices[i].uuid) !== -1) {
                        includedServiceUuids.push(includedServices[i].uuid);
                    }
                }
                this.emit("includedServicesDiscover", this._address, service.uuid, includedServiceUuids);
            }
            else {
                this._queueCommand(this.readByTypeRequest(includedServices[includedServices.length - 1].endHandle + 1, service.endHandle, GATT_INCLUDE_UUID), callback);
            }
        };
        this._queueCommand(this.readByTypeRequest(service.startHandle, service.endHandle, GATT_INCLUDE_UUID), callback);
    }
    discoverCharacteristics(serviceUuid, characteristicUuids) {
        const service = this._services[serviceUuid];
        const characteristics = [];
        this._characteristics[serviceUuid] =
            this._characteristics[serviceUuid] || {};
        this._descriptors[serviceUuid] = this._descriptors[serviceUuid] || {};
        const callback = (data) => {
            const opcode = data[0];
            let i = 0;
            if (opcode === ATT_OP_READ_BY_TYPE_RESP) {
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
            if (opcode !== ATT_OP_READ_BY_TYPE_RESP ||
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
                    if (characteristicUuids.length === 0 ||
                        characteristicUuids.indexOf(characteristic.uuid) !== -1) {
                        characteristicsDiscovered.push(characteristic);
                    }
                }
                this.emit("characteristicsDiscover", this._address, serviceUuid, characteristicsDiscovered);
            }
            else {
                this._queueCommand(this.readByTypeRequest(characteristics[characteristics.length - 1].valueHandle + 1, service.endHandle, GATT_CHARAC_UUID), callback);
            }
        };
        this._queueCommand(this.readByTypeRequest(service.startHandle, service.endHandle, GATT_CHARAC_UUID), callback);
    }
    read(serviceUuid, characteristicUuid) {
        if (!this._characteristics[serviceUuid] ||
            !this._characteristics[serviceUuid][characteristicUuid]) {
            this.emit("read", this._address, serviceUuid, characteristicUuid, Buffer.alloc(0), false);
            return;
        }
        const characteristic = this._characteristics[serviceUuid][characteristicUuid];
        let readData = Buffer.alloc(0);
        const callback = (data) => {
            const opcode = data[0];
            if (opcode === ATT_OP_READ_RESP || opcode === ATT_OP_READ_BLOB_RESP) {
                readData = Buffer.from(readData.toString("hex") + data.slice(1).toString("hex"), "hex");
                if (data.length === this._mtu) {
                    this._queueCommand(this.readBlobRequest(characteristic.valueHandle, readData.length), callback);
                }
                else {
                    this.emit("read", this._address, serviceUuid, characteristicUuid, readData, true);
                }
            }
            else if (opcode === ATT_OP_ERROR) {
                this.emit("read", this._address, serviceUuid, characteristicUuid, Buffer.alloc(0), false);
            }
            else {
                this.emit("read", this._address, serviceUuid, characteristicUuid, readData, true);
            }
        };
        this._queueCommand(this.readRequest(characteristic.valueHandle), callback);
    }
    write(serviceUuid, characteristicUuid, data, withoutResponse) {
        if (!this._characteristics[serviceUuid] ||
            !this._characteristics[serviceUuid][characteristicUuid]) {
            this.emit("write", this._address, serviceUuid, characteristicUuid, false);
            return;
        }
        const characteristic = this._characteristics[serviceUuid][characteristicUuid];
        if (withoutResponse) {
            this._queueCommand(this.writeRequest(characteristic.valueHandle, data, true), null, () => {
                this.emit("write", this._address, serviceUuid, characteristicUuid);
            });
        }
        else if (data.length + 3 > this._mtu) {
            return this.longWrite(serviceUuid, characteristicUuid, data, withoutResponse);
        }
        else {
            this._queueCommand(this.writeRequest(characteristic.valueHandle, data, false), (_data) => {
                const opcode = _data[0];
                if (opcode === ATT_OP_WRITE_RESP || opcode === ATT_OP_ERROR) {
                    this.emit("write", this._address, serviceUuid, characteristicUuid, opcode === ATT_OP_WRITE_RESP);
                }
            });
        }
    }
    /* Perform a "long write" as described Bluetooth Spec section 4.9.4 "Write Long Characteristic Values" */
    longWrite(serviceUuid, characteristicUuid, data, withoutResponse) {
        const characteristic = this._characteristics[serviceUuid][characteristicUuid];
        const limit = this._mtu - 5;
        const prepareWriteCallback = (data_chunk) => {
            return (resp) => {
                const opcode = resp[0];
                if (opcode !== ATT_OP_PREPARE_WRITE_RESP) {
                    debug(this._address +
                        ": unexpected reply opcode %d (expecting ATT_OP_PREPARE_WRITE_RESP)", opcode);
                }
                else {
                    const expected_length = data_chunk.length + 5;
                    if (resp.length !== expected_length) {
                        /* the response should contain the data packet echoed back to the caller */
                        debug(this._address +
                            ": unexpected prepareWriteResponse length %d (expecting %d)", resp.length, expected_length);
                    }
                }
            };
        };
        /* split into prepare-write chunks and queue them */
        let offset = 0;
        while (offset < data.length) {
            const end = offset + limit;
            const chunk = data.slice(offset, end);
            this._queueCommand(this.prepareWriteRequest(characteristic.valueHandle, offset, chunk), prepareWriteCallback(chunk));
            offset = end;
        }
        /* queue the execute command with a callback to emit the write signal when done */
        this._queueCommand(this.executeWriteRequest(characteristic.valueHandle), (resp) => {
            const opcode = resp[0];
            if (opcode === ATT_OP_EXECUTE_WRITE_RESP && !withoutResponse) {
                this.emit("write", this._address, serviceUuid, characteristicUuid);
            }
        });
    }
    broadcast(serviceUuid, characteristicUuid, broadcast) {
        const characteristic = this._characteristics[serviceUuid][characteristicUuid];
        this._queueCommand(this.readByTypeRequest(characteristic.startHandle, characteristic.endHandle, GATT_SERVER_CHARAC_CFG_UUID), (data) => {
            const opcode = data[0];
            if (opcode === ATT_OP_READ_BY_TYPE_RESP) {
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
                this._queueCommand(this.writeRequest(handle, valueBuffer, false), (_data) => {
                    const _opcode = _data[0];
                    if (_opcode === ATT_OP_WRITE_RESP) {
                        this.emit("broadcast", this._address, serviceUuid, characteristicUuid, broadcast);
                    }
                });
            }
        });
    }
    notify(serviceUuid, characteristicUuid, notify) {
        const characteristic = this._characteristics[serviceUuid][characteristicUuid];
        this._queueCommand(this.readByTypeRequest(characteristic.startHandle, characteristic.endHandle, GATT_CLIENT_CHARAC_CFG_UUID), (data) => {
            const opcode = data[0];
            if (opcode === ATT_OP_READ_BY_TYPE_RESP) {
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
                this._queueCommand(this.writeRequest(handle, valueBuffer, false), (_data) => {
                    const _opcode = _data[0];
                    debug("set notify write results: " + (_opcode === ATT_OP_WRITE_RESP));
                    // if (opcode === ATT_OP_WRITE_RESP) {
                    this.emit("notify", this._address, serviceUuid, characteristicUuid, notify);
                    // }
                });
            }
        });
    }
    discoverDescriptors(serviceUuid, characteristicUuid) {
        const characteristic = this._characteristics[serviceUuid][characteristicUuid];
        const descriptors = [];
        this._descriptors[serviceUuid][characteristicUuid] = {};
        const callback = (data) => {
            const opcode = data[0];
            let i = 0;
            if (opcode === ATT_OP_FIND_INFO_RESP) {
                const num = data[1];
                for (i = 0; i < num; i++) {
                    descriptors.push({
                        handle: data.readUInt16LE(2 + i * 4 + 0),
                        uuid: data.readUInt16LE(2 + i * 4 + 2).toString(16),
                    });
                }
            }
            if (opcode !== ATT_OP_FIND_INFO_RESP ||
                descriptors[descriptors.length - 1].handle === characteristic.endHandle) {
                const descriptorUuids = [];
                for (i = 0; i < descriptors.length; i++) {
                    descriptorUuids.push(descriptors[i].uuid);
                    this._descriptors[serviceUuid][characteristicUuid][descriptors[i].uuid] = descriptors[i];
                }
                this.emit("descriptorsDiscover", this._address, serviceUuid, characteristicUuid, descriptorUuids);
            }
            else {
                this._queueCommand(this.findInfoRequest(descriptors[descriptors.length - 1].handle + 1, characteristic.endHandle), callback);
            }
        };
        this._queueCommand(this.findInfoRequest(characteristic.valueHandle + 1, characteristic.endHandle), callback);
    }
    readValue(serviceUuid, characteristicUuid, descriptorUuid) {
        if (!this._descriptors[serviceUuid] ||
            !this._descriptors[serviceUuid][characteristicUuid] ||
            !this._descriptors[serviceUuid][characteristicUuid][descriptorUuid]) {
            this.emit("valueRead", this._address, serviceUuid, characteristicUuid, descriptorUuid, Buffer.alloc(0), false);
            return;
        }
        const descriptor = this._descriptors[serviceUuid][characteristicUuid][descriptorUuid];
        this._queueCommand(this.readRequest(descriptor.handle), (data) => {
            const opcode = data[0];
            if (opcode === ATT_OP_READ_RESP || opcode === ATT_OP_ERROR) {
                this.emit("valueRead", this._address, serviceUuid, characteristicUuid, descriptorUuid, data.slice(1), opcode === ATT_OP_READ_RESP);
            }
        });
    }
    writeValue(serviceUuid, characteristicUuid, descriptorUuid, data) {
        if (!this._descriptors[serviceUuid] ||
            !this._descriptors[serviceUuid][characteristicUuid] ||
            !this._descriptors[serviceUuid][characteristicUuid][descriptorUuid]) {
            this.emit("valueWrite", this._address, serviceUuid, characteristicUuid, descriptorUuid, false);
            return;
        }
        const descriptor = this._descriptors[serviceUuid][characteristicUuid][descriptorUuid];
        this._queueCommand(this.writeRequest(descriptor.handle, data, false), (_data) => {
            const opcode = _data[0];
            if (opcode === ATT_OP_WRITE_RESP || opcode === ATT_OP_ERROR) {
                this.emit("valueWrite", this._address, serviceUuid, characteristicUuid, descriptorUuid, opcode === ATT_OP_WRITE_RESP);
            }
        });
    }
    readHandle(handle) {
        this._queueCommand(this.readRequest(handle), (data) => {
            const opcode = data[0];
            if (opcode === ATT_OP_READ_RESP) {
                this.emit("handleRead", this._address, handle, data.slice(1));
            }
        });
    }
    writeHandle(handle, data, withoutResponse) {
        if (withoutResponse) {
            this._queueCommand(this.writeRequest(handle, data, true), null, () => {
                this.emit("handleWrite", this._address, handle);
            });
        }
        else {
            this._queueCommand(this.writeRequest(handle, data, false), (_data) => {
                const opcode = _data[0];
                if (opcode === ATT_OP_WRITE_RESP) {
                    this.emit("handleWrite", this._address, handle);
                }
            });
        }
    }
}
exports.default = Gatt;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvcHJvdG9jb2wvY2VudHJhbC9nYXR0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQXVDO0FBQ3ZDLE1BQU0sS0FBSyxHQUFRLEdBQUcsRUFBRTtBQUN4QixDQUFDLENBQUM7QUFFRixtQ0FBbUM7QUFFbkMsTUFBTSxNQUFNLEdBQVEsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRXRDLE1BQU0sWUFBWSxHQUFRLElBQUksQ0FBQztBQUMvQixNQUFNLGNBQWMsR0FBUSxJQUFJLENBQUM7QUFDakMsTUFBTSxlQUFlLEdBQVEsSUFBSSxDQUFDO0FBQ2xDLE1BQU0sb0JBQW9CLEdBQVEsSUFBSSxDQUFDO0FBQ3ZDLE1BQU0scUJBQXFCLEdBQVEsSUFBSSxDQUFDO0FBQ3hDLE1BQU0sdUJBQXVCLEdBQVEsSUFBSSxDQUFDO0FBQzFDLE1BQU0sd0JBQXdCLEdBQVEsSUFBSSxDQUFDO0FBQzNDLE1BQU0sZUFBZSxHQUFRLElBQUksQ0FBQztBQUNsQyxNQUFNLGdCQUFnQixHQUFRLElBQUksQ0FBQztBQUNuQyxNQUFNLG9CQUFvQixHQUFRLElBQUksQ0FBQztBQUN2QyxNQUFNLHFCQUFxQixHQUFRLElBQUksQ0FBQztBQUN4QyxNQUFNLHdCQUF3QixHQUFRLElBQUksQ0FBQztBQUMzQyxNQUFNLHlCQUF5QixHQUFRLElBQUksQ0FBQztBQUM1QyxNQUFNLGdCQUFnQixHQUFRLElBQUksQ0FBQztBQUNuQyxNQUFNLGlCQUFpQixHQUFRLElBQUksQ0FBQztBQUNwQyxNQUFNLHdCQUF3QixHQUFRLElBQUksQ0FBQztBQUMzQyxNQUFNLHlCQUF5QixHQUFRLElBQUksQ0FBQztBQUM1QyxNQUFNLHdCQUF3QixHQUFRLElBQUksQ0FBQztBQUMzQyxNQUFNLHlCQUF5QixHQUFRLElBQUksQ0FBQztBQUM1QyxNQUFNLG9CQUFvQixHQUFRLElBQUksQ0FBQztBQUN2QyxNQUFNLGlCQUFpQixHQUFR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Q0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUNGLENBQUM7U0FDSDthQUFNO1lBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FDaEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUN0QyxDQUFDLEtBQVUsRUFBRyxFQUFFO2dCQUNkLE1BQU0sTUFBTSxHQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFN0IsSUFBSSxNQUFNLEtBQUssaUJBQWlCLEVBQUU7b0JBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7aUJBQ2pEO1lBQ0gsQ0FBQyxDQUNGLENBQUM7U0FDSDtJQUNILENBQUM7Q0FDRjtBQUVELGtCQUFlLElBQUksQ0FBQyIsImZpbGUiOiJzcmMvb2JuaXovbGlicy9lbWJlZHMvYmxlSGNpL3Byb3RvY29sL2NlbnRyYWwvZ2F0dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGxldCBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2F0dCcpO1xuY29uc3QgZGVidWc6IGFueSA9ICgpID0+IHtcbn07XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5cbmNvbnN0IGV2ZW50czogYW55ID0gcmVxdWlyZShcImV2ZW50c1wiKTtcblxuY29uc3QgQVRUX09QX0VSUk9SOiBhbnkgPSAweDAxO1xuY29uc3QgQVRUX09QX01UVV9SRVE6IGFueSA9IDB4MDI7XG5jb25zdCBBVFRfT1BfTVRVX1JFU1A6IGFueSA9IDB4MDM7XG5jb25zdCBBVFRfT1BfRklORF9JTkZPX1JFUTogYW55ID0gMHgwNDtcbmNvbnN0IEFUVF9PUF9GSU5EX0lORk9fUkVTUDogYW55ID0gMHgwNTtcbmNvbnN0IEFUVF9PUF9SRUFEX0JZX1RZUEVfUkVROiBhbnkgPSAweDA4O1xuY29uc3QgQVRUX09QX1JFQURfQllfVFlQRV9SRVNQOiBhbnkgPSAweDA5O1xuY29uc3QgQVRUX09QX1JFQURfUkVROiBhbnkgPSAweDBhO1xuY29uc3QgQVRUX09QX1JFQURfUkVTUDogYW55ID0gMHgwYjtcbmNvbnN0IEFUVF9PUF9SRUFEX0JMT0JfUkVROiBhbnkgPSAweDBjO1xuY29uc3QgQVRUX09QX1JFQURfQkxPQl9SRVNQOiBhbnkgPSAweDBkO1xuY29uc3QgQVRUX09QX1JFQURfQllfR1JPVVBfUkVROiBhbnkgPSAweDEwO1xuY29uc3QgQVRUX09QX1JFQURfQllfR1JPVVBfUkVTUDogYW55ID0gMHgxMTtcbmNvbnN0IEFUVF9PUF9XUklURV9SRVE6IGFueSA9IDB4MTI7XG5jb25zdCBBVFRfT1BfV1JJVEVfUkVTUDogYW55ID0gMHgxMztcbmNvbnN0IEFUVF9PUF9QUkVQQVJFX1dSSVRFX1JFUTogYW55ID0gMHgxNjtcbmNvbnN0IEFUVF9PUF9QUkVQQVJFX1dSSVRFX1JFU1A6IGFueSA9IDB4MTc7XG5jb25zdCBBVFRfT1BfRVhFQ1VURV9XUklURV9SRVE6IGFueSA9IDB4MTg7XG5jb25zdCBBVFRfT1BfRVhFQ1VURV9XUklURV9SRVNQOiBhbnkgPSAweDE5O1xuY29uc3QgQVRUX09QX0hBTkRMRV9OT1RJRlk6IGFueSA9IDB4MWI7XG5jb25zdCBBVFRfT1BfSEFORExFX0lORDogYW55ID0gMHgxZDtcbmNvbnN0IEFUVF9PUF9IQU5ETEVfQ05GOiBhbnkgPSAweDFlO1xuY29uc3QgQVRUX09QX1dSSVRFX0NNRDogYW55ID0gMHg1MjtcblxuY29uc3QgQVRUX0VDT0RFX1NVQ0NFU1M6IGFueSA9IDB4MDA7XG5jb25zdCBBVFRfRUNPREVfSU5WQUxJRF9IQU5ETEU6IGFueSA9IDB4MDE7XG5jb25zdCBBVFRfRUNPREVfUkVBRF9OT1RfUEVSTTogYW55ID0gMHgwMjtcbmNvbnN0IEFUVF9FQ09ERV9XUklURV9OT1RfUEVSTTogYW55ID0gMHgwMztcbmNvbnN0IEFUVF9FQ09ERV9JTlZBTElEX1BEVTogYW55ID0gMHgwNDtcbmNvbnN0IEFUVF9FQ09ERV9BVVRIRU5USUNBVElPTjogYW55ID0gMHgwNTtcbmNvbnN0IEFUVF9FQ09ERV9SRVFfTk9UX1NVUFA6IGFueSA9IDB4MDY7XG5jb25zdCBBVFRfRUNPREVfSU5WQUxJRF9PRkZTRVQ6IGFueSA9IDB4MDc7XG5jb25zdCBBVFRfRUNPREVfQVVUSE9SSVpBVElPTjogYW55ID0gMHgwODtcbmNvbnN0IEFUVF9FQ09ERV9QUkVQX1FVRVVFX0ZVTEw6IGFueSA9IDB4MDk7XG5jb25zdCBBVFRfRUNPREVfQVRUUl9OT1RfRk9VTkQ6IGFueSA9IDB4MGE7XG5jb25zdCBBVFRfRUNPREVfQVRUUl9OT1RfTE9ORzogYW55ID0gMHgwYjtcbmNvbnN0IEFUVF9FQ09ERV9JTlNVRkZfRU5DUl9LRVlfU0laRTogYW55ID0gMHgwYztcbmNvbnN0IEFUVF9FQ09ERV9JTlZBTF9BVFRSX1ZBTFVFX0xFTjogYW55ID0gMHgwZDtcbmNvbnN0IEFUVF9FQ09ERV9VTkxJS0VMWTogYW55ID0gMHgwZTtcbmNvbnN0IEFUVF9FQ09ERV9JTlNVRkZfRU5DOiBhbnkgPSAweDBmO1xuY29uc3QgQVRUX0VDT0RFX1VOU1VQUF9HUlBfVFlQRTogYW55ID0gMHgxMDtcbmNvbnN0IEFUVF9FQ09ERV9JTlNVRkZfUkVTT1VSQ0VTOiBhbnkgPSAweDExO1xuXG5jb25zdCBHQVRUX1BSSU1fU1ZDX1VVSUQ6IGFueSA9IDB4MjgwMDtcbmNvbnN0IEdBVFRfSU5DTFVERV9VVUlEOiBhbnkgPSAweDI4MDI7XG5jb25zdCBHQVRUX0NIQVJBQ19VVUlEOiBhbnkgPSAweDI4MDM7XG5cbmNvbnN0IEdBVFRfQ0xJRU5UX0NIQVJBQ19DRkdfVVVJRDogYW55ID0gMHgyOTAyO1xuY29uc3QgR0FUVF9TRVJWRVJfQ0hBUkFDX0NGR19VVUlEOiBhbnkgPSAweDI5MDM7XG5cbmNvbnN0IEFUVF9DSUQ6IGFueSA9IDB4MDAwNDtcblxuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuY2xhc3MgR2F0dCBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICBwdWJsaWMgX2FkZHJlc3M6IGFueTtcbiAgcHVibGljIF9hY2xTdHJlYW06IGFueTtcbiAgcHVibGljIF9zZXJ2aWNlczogYW55O1xuICBwdWJsaWMgX2NoYXJhY3RlcmlzdGljczogYW55O1xuICBwdWJsaWMgX2Rlc2NyaXB0b3JzOiBhbnk7XG4gIHB1YmxpYyBfY3VycmVudENvbW1hbmQ6IGFueTtcbiAgcHVibGljIF9jb21tYW5kUXVldWU6IGFueTtcbiAgcHVibGljIF9tdHU6IGFueTtcbiAgcHVibGljIF9zZWN1cml0eTogYW55O1xuICBwdWJsaWMgb25BY2xTdHJlYW1EYXRhQmluZGVkOiBhbnk7XG4gIHB1YmxpYyBvbkFjbFN0cmVhbUVuY3J5cHRCaW5kZWQ6IGFueTtcbiAgcHVibGljIG9uQWNsU3RyZWFtRW5jcnlwdEZhaWxCaW5kZWQ6IGFueTtcbiAgcHVibGljIG9uQWNsU3RyZWFtRW5kQmluZGVkOiBhbnk7XG4gIHB1YmxpYyBlbWl0OiBhbnk7XG5cbiAgY29uc3RydWN0b3IoYWRkcmVzczogYW55LCBhY2xTdHJlYW06IGFueSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fYWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgdGhpcy5fYWNsU3RyZWFtID0gYWNsU3RyZWFtO1xuXG4gICAgdGhpcy5fc2VydmljZXMgPSB7fTtcbiAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3MgPSB7fTtcbiAgICB0aGlzLl9kZXNjcmlwdG9ycyA9IHt9O1xuXG4gICAgdGhpcy5fY3VycmVudENvbW1hbmQgPSBudWxsO1xuICAgIHRoaXMuX2NvbW1hbmRRdWV1ZSA9IFtdO1xuXG4gICAgdGhpcy5fbXR1ID0gMjM7XG4gICAgdGhpcy5fc2VjdXJpdHkgPSBcImxvd1wiO1xuXG4gICAgdGhpcy5vbkFjbFN0cmVhbURhdGFCaW5kZWQgPSB0aGlzLm9uQWNsU3RyZWFtRGF0YS5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25BY2xTdHJlYW1FbmNyeXB0QmluZGVkID0gdGhpcy5vbkFjbFN0cmVhbUVuY3J5cHQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uQWNsU3RyZWFtRW5jcnlwdEZhaWxCaW5kZWQgPSB0aGlzLm9uQWNsU3RyZWFtRW5jcnlwdEZhaWwuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uQWNsU3RyZWFtRW5kQmluZGVkID0gdGhpcy5vbkFjbFN0cmVhbUVuZC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fYWNsU3RyZWFtLm9uKFwiZGF0YVwiLCB0aGlzLm9uQWNsU3RyZWFtRGF0YUJpbmRlZCk7XG4gICAgdGhpcy5fYWNsU3RyZWFtLm9uKFwiZW5jcnlwdFwiLCB0aGlzLm9uQWNsU3RyZWFtRW5jcnlwdEJpbmRlZCk7XG4gICAgdGhpcy5fYWNsU3RyZWFtLm9uKFwiZW5jcnlwdEZhaWxcIiwgdGhpcy5vbkFjbFN0cmVhbUVuY3J5cHRGYWlsQmluZGVkKTtcbiAgICB0aGlzLl9hY2xTdHJlYW0ub24oXCJlbmRcIiwgdGhpcy5vbkFjbFN0cmVhbUVuZEJpbmRlZCk7XG4gIH1cblxuICBwdWJsaWMgb25BY2xTdHJlYW1EYXRhKGNpZDogYW55LCBkYXRhPzogYW55KSB7XG4gICAgaWYgKGNpZCAhPT0gQVRUX0NJRCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHRoaXMuX2N1cnJlbnRDb21tYW5kICYmXG4gICAgICBkYXRhLnRvU3RyaW5nKFwiaGV4XCIpID09PSB0aGlzLl9jdXJyZW50Q29tbWFuZC5idWZmZXIudG9TdHJpbmcoXCJoZXhcIilcbiAgICApIHtcbiAgICAgIGRlYnVnKHRoaXMuX2FkZHJlc3MgKyBcIjogZWNobyAuLi4gZWNobyAuLi4gZWNobyAuLi5cIik7XG4gICAgfSBlbHNlIGlmIChkYXRhWzBdICUgMiA9PT0gMCkge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PQkxFX01VTFRJX1JPTEUpIHtcbiAgICAgICAgZGVidWcoXG4gICAgICAgICAgdGhpcy5fYWRkcmVzcyArXG4gICAgICAgICAgXCI6IG11bHRpLXJvbGUgZmxhZyBpbiB1c2UsIGlnbm9yaW5nIGNvbW1hbmQgbWVhbnQgZm9yIHBlcmlwaGVyYWwgcm9sZS5cIixcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHJlcXVlc3RUeXBlOiBhbnkgPSBkYXRhWzBdO1xuICAgICAgICBkZWJ1ZyhcbiAgICAgICAgICB0aGlzLl9hZGRyZXNzICtcbiAgICAgICAgICBcIjogcmVwbHlpbmcgd2l0aCBSRVFfTk9UX1NVUFAgdG8gMHhcIiArXG4gICAgICAgICAgcmVxdWVzdFR5cGUudG9TdHJpbmcoMTYpLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLndyaXRlQXR0KFxuICAgICAgICAgIHRoaXMuZXJyb3JSZXNwb25zZShyZXF1ZXN0VHlwZSwgMHgwMDAwLCBBVFRfRUNPREVfUkVRX05PVF9TVVBQKSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgZGF0YVswXSA9PT0gQVRUX09QX0hBTkRMRV9OT1RJRlkgfHxcbiAgICAgIGRhdGFbMF0gPT09IEFUVF9PUF9IQU5ETEVfSU5EXG4gICAgKSB7XG4gICAgICBjb25zdCB2YWx1ZUhhbmRsZTogYW55ID0gZGF0YS5yZWFkVUludDE2TEUoMSk7XG4gICAgICBjb25zdCB2YWx1ZURhdGE6IGFueSA9IGRhdGEuc2xpY2UoMyk7XG5cbiAgICAgIHRoaXMuZW1pdChcImhhbmRsZU5vdGlmeVwiLCB0aGlzLl9hZGRyZXNzLCB2YWx1ZUhhbmRsZSwgdmFsdWVEYXRhKTtcblxuICAgICAgaWYgKGRhdGFbMF0gPT09IEFUVF9PUF9IQU5ETEVfSU5EKSB7XG4gICAgICAgIHRoaXMuX3F1ZXVlQ29tbWFuZChcbiAgICAgICAgICB0aGlzLmhhbmRsZUNvbmZpcm1hdGlvbigpLFxuICAgICAgICAgIG51bGwsXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0KFwiaGFuZGxlQ29uZmlybWF0aW9uXCIsIHRoaXMuX2FkZHJlc3MsIHZhbHVlSGFuZGxlKTtcbiAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGNvbnN0IHNlcnZpY2VVdWlkIGluIHRoaXMuX3NlcnZpY2VzKSB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhcmFjdGVyaXN0aWNVdWlkIGluIHRoaXMuX2NoYXJhY3RlcmlzdGljc1tzZXJ2aWNlVXVpZF0pIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3Nbc2VydmljZVV1aWRdW2NoYXJhY3RlcmlzdGljVXVpZF1cbiAgICAgICAgICAgICAgLnZhbHVlSGFuZGxlID09PSB2YWx1ZUhhbmRsZVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAgICAgICBcIm5vdGlmaWNhdGlvblwiLFxuICAgICAgICAgICAgICB0aGlzLl9hZGRyZXNzLFxuICAgICAgICAgICAgICBzZXJ2aWNlVXVpZCxcbiAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNVdWlkLFxuICAgICAgICAgICAgICB2YWx1ZURhdGEsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIXRoaXMuX2N1cnJlbnRDb21tYW5kKSB7XG4gICAgICBkZWJ1Zyh0aGlzLl9hZGRyZXNzICsgXCI6IHVoIG9oLCBubyBjdXJyZW50IGNvbW1hbmRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChcbiAgICAgICAgZGF0YVswXSA9PT0gQVRUX09QX0VSUk9SICYmXG4gICAgICAgIChkYXRhWzRdID09PSBBVFRfRUNPREVfQVVUSEVOVElDQVRJT04gfHxcbiAgICAgICAgICBkYXRhWzRdID09PSBBVFRfRUNPREVfQVVUSE9SSVpBVElPTiB8fFxuICAgICAgICAgIGRhdGFbNF0gPT09IEFUVF9FQ09ERV9JTlNVRkZfRU5DKSAmJlxuICAgICAgICB0aGlzLl9zZWN1cml0eSAhPT0gXCJtZWRpdW1cIlxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuX2FjbFN0cmVhbS5lbmNyeXB0KCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZGVidWcodGhpcy5fYWRkcmVzcyArIFwiOiByZWFkOiBcIiArIGRhdGEudG9TdHJpbmcoXCJoZXhcIikpO1xuXG4gICAgICB0aGlzLl9jdXJyZW50Q29tbWFuZC5jYWxsYmFjayhkYXRhKTtcblxuICAgICAgdGhpcy5fY3VycmVudENvbW1hbmQgPSBudWxsO1xuXG4gICAgICB3aGlsZSAodGhpcy5fY29tbWFuZFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50Q29tbWFuZCA9IHRoaXMuX2NvbW1hbmRRdWV1ZS5zaGlmdCgpO1xuXG4gICAgICAgIHRoaXMud3JpdGVBdHQodGhpcy5fY3VycmVudENvbW1hbmQuYnVmZmVyKTtcblxuICAgICAgICBpZiAodGhpcy5fY3VycmVudENvbW1hbmQuY2FsbGJhY2spIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9jdXJyZW50Q29tbWFuZC53cml0ZUNhbGxiYWNrKSB7XG4gICAgICAgICAgdGhpcy5fY3VycmVudENvbW1hbmQud3JpdGVDYWxsYmFjaygpO1xuXG4gICAgICAgICAgdGhpcy5fY3VycmVudENvbW1hbmQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uQWNsU3RyZWFtRW5jcnlwdChlbmNyeXB0OiBhbnkpIHtcbiAgICBpZiAoZW5jcnlwdCkge1xuICAgICAgdGhpcy5fc2VjdXJpdHkgPSBcIm1lZGl1bVwiO1xuXG4gICAgICB0aGlzLndyaXRlQXR0KHRoaXMuX2N1cnJlbnRDb21tYW5kLmJ1ZmZlcik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uQWNsU3RyZWFtRW5jcnlwdEZhaWwoKSB7XG4gIH1cblxuICBwdWJsaWMgb25BY2xTdHJlYW1FbmQoKSB7XG4gICAgdGhpcy5fYWNsU3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZGF0YVwiLCB0aGlzLm9uQWNsU3RyZWFtRGF0YUJpbmRlZCk7XG4gICAgdGhpcy5fYWNsU3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZW5jcnlwdFwiLCB0aGlzLm9uQWNsU3RyZWFtRW5jcnlwdEJpbmRlZCk7XG4gICAgdGhpcy5fYWNsU3RyZWFtLnJlbW92ZUxpc3RlbmVyKFxuICAgICAgXCJlbmNyeXB0RmFpbFwiLFxuICAgICAgdGhpcy5vbkFjbFN0cmVhbUVuY3J5cHRGYWlsQmluZGVkLFxuICAgICk7XG4gICAgdGhpcy5fYWNsU3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZW5kXCIsIHRoaXMub25BY2xTdHJlYW1FbmRCaW5kZWQpO1xuICB9XG5cbiAgcHVibGljIHdyaXRlQXR0KGRhdGE6IGFueSkge1xuICAgIGRlYnVnKHRoaXMuX2FkZHJlc3MgKyBcIjogd3JpdGU6IFwiICsgZGF0YS50b1N0cmluZyhcImhleFwiKSk7XG5cbiAgICB0aGlzLl9hY2xTdHJlYW0ud3JpdGUoQVRUX0NJRCwgZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgZXJyb3JSZXNwb25zZShvcGNvZGU6IGFueSwgaGFuZGxlOiBhbnksIHN0YXR1czogYW55KSB7XG4gICAgY29uc3QgYnVmOiBhbnkgPSBCdWZmZXIuYWxsb2MoNSk7XG5cbiAgICBidWYud3JpdGVVSW50OChBVFRfT1BfRVJST1IsIDApO1xuICAgIGJ1Zi53cml0ZVVJbnQ4KG9wY29kZSwgMSk7XG4gICAgYnVmLndyaXRlVUludDE2TEUoaGFuZGxlLCAyKTtcbiAgICBidWYud3JpdGVVSW50OChzdGF0dXMsIDQpO1xuXG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuXG4gIHB1YmxpYyBfcXVldWVDb21tYW5kKGJ1ZmZlcjogYW55LCBjYWxsYmFjazogYW55LCB3cml0ZUNhbGxiYWNrPzogYW55KSB7XG4gICAgdGhpcy5fY29tbWFuZFF1ZXVlLnB1c2goe1xuICAgICAgYnVmZmVyLFxuICAgICAgY2FsbGJhY2ssXG4gICAgICB3cml0ZUNhbGxiYWNrLFxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX2N1cnJlbnRDb21tYW5kID09PSBudWxsKSB7XG4gICAgICB3aGlsZSAodGhpcy5fY29tbWFuZFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50Q29tbWFuZCA9IHRoaXMuX2NvbW1hbmRRdWV1ZS5zaGlmdCgpO1xuXG4gICAgICAgIHRoaXMud3JpdGVBdHQodGhpcy5fY3VycmVudENvbW1hbmQuYnVmZmVyKTtcblxuICAgICAgICBpZiAodGhpcy5fY3VycmVudENvbW1hbmQuY2FsbGJhY2spIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9jdXJyZW50Q29tbWFuZC53cml0ZUNhbGxiYWNrKSB7XG4gICAgICAgICAgdGhpcy5fY3VycmVudENvbW1hbmQud3JpdGVDYWxsYmFjaygpO1xuXG4gICAgICAgICAgdGhpcy5fY3VycmVudENvbW1hbmQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG10dVJlcXVlc3QobXR1OiBhbnkpIHtcbiAgICBjb25zdCBidWY6IGFueSA9IEJ1ZmZlci5hbGxvYygzKTtcblxuICAgIGJ1Zi53cml0ZVVJbnQ4KEFUVF9PUF9NVFVfUkVRLCAwKTtcbiAgICBidWYud3JpdGVVSW50MTZMRShtdHUsIDEpO1xuXG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuXG4gIHB1YmxpYyByZWFkQnlHcm91cFJlcXVlc3Qoc3RhcnRIYW5kbGU6IGFueSwgZW5kSGFuZGxlOiBhbnksIGdyb3VwVXVpZDogYW55KSB7XG4gICAgY29uc3QgYnVmOiBhbnkgPSBCdWZmZXIuYWxsb2MoNyk7XG5cbiAgICBidWYud3JpdGVVSW50OChBVFRfT1BfUkVBRF9CWV9HUk9VUF9SRVEsIDApO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKHN0YXJ0SGFuZGxlLCAxKTtcbiAgICBidWYud3JpdGVVSW50MTZMRShlbmRIYW5kbGUsIDMpO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKGdyb3VwVXVpZCwgNSk7XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgcHVibGljIHJlYWRCeVR5cGVSZXF1ZXN0KHN0YXJ0SGFuZGxlOiBhbnksIGVuZEhhbmRsZTogYW55LCBncm91cFV1aWQ6IGFueSkge1xuICAgIGNvbnN0IGJ1ZjogYW55ID0gQnVmZmVyLmFsbG9jKDcpO1xuXG4gICAgYnVmLndyaXRlVUludDgoQVRUX09QX1JFQURfQllfVFlQRV9SRVEsIDApO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKHN0YXJ0SGFuZGxlLCAxKTtcbiAgICBidWYud3JpdGVVSW50MTZMRShlbmRIYW5kbGUsIDMpO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKGdyb3VwVXVpZCwgNSk7XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgcHVibGljIHJlYWRSZXF1ZXN0KGhhbmRsZTogYW55KSB7XG4gICAgY29uc3QgYnVmOiBhbnkgPSBCdWZmZXIuYWxsb2MoMyk7XG5cbiAgICBidWYud3JpdGVVSW50OChBVFRfT1BfUkVBRF9SRVEsIDApO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKGhhbmRsZSwgMSk7XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgcHVibGljIHJlYWRCbG9iUmVxdWVzdChoYW5kbGU6IGFueSwgb2Zmc2V0OiBhbnkpIHtcbiAgICBjb25zdCBidWY6IGFueSA9IEJ1ZmZlci5hbGxvYyg1KTtcblxuICAgIGJ1Zi53cml0ZVVJbnQ4KEFUVF9PUF9SRUFEX0JMT0JfUkVRLCAwKTtcbiAgICBidWYud3JpdGVVSW50MTZMRShoYW5kbGUsIDEpO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKG9mZnNldCwgMyk7XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgcHVibGljIGZpbmRJbmZvUmVxdWVzdChzdGFydEhhbmRsZTogYW55LCBlbmRIYW5kbGU6IGFueSkge1xuICAgIGNvbnN0IGJ1ZjogYW55ID0gQnVmZmVyLmFsbG9jKDUpO1xuXG4gICAgYnVmLndyaXRlVUludDgoQVRUX09QX0ZJTkRfSU5GT19SRVEsIDApO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKHN0YXJ0SGFuZGxlLCAxKTtcbiAgICBidWYud3JpdGVVSW50MTZMRShlbmRIYW5kbGUsIDMpO1xuXG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuXG4gIHB1YmxpYyB3cml0ZVJlcXVlc3QoaGFuZGxlOiBhbnksIGRhdGE6IGFueSwgd2l0aG91dFJlc3BvbnNlOiBhbnkpIHtcbiAgICBjb25zdCBidWY6IGFueSA9IEJ1ZmZlci5hbGxvYygzICsgZGF0YS5sZW5ndGgpO1xuXG4gICAgYnVmLndyaXRlVUludDgod2l0aG91dFJlc3BvbnNlID8gQVRUX09QX1dSSVRFX0NNRCA6IEFUVF9PUF9XUklURV9SRVEsIDApO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKGhhbmRsZSwgMSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1Zi53cml0ZVVJbnQ4KGRhdGEucmVhZFVJbnQ4KGkpLCBpICsgMyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuXG4gIHB1YmxpYyBwcmVwYXJlV3JpdGVSZXF1ZXN0KGhhbmRsZTogYW55LCBvZmZzZXQ6IGFueSwgZGF0YTogYW55KSB7XG4gICAgY29uc3QgYnVmOiBhbnkgPSBCdWZmZXIuYWxsb2MoNSArIGRhdGEubGVuZ3RoKTtcblxuICAgIGJ1Zi53cml0ZVVJbnQ4KEFUVF9PUF9QUkVQQVJFX1dSSVRFX1JFUSwgMCk7XG4gICAgYnVmLndyaXRlVUludDE2TEUoaGFuZGxlLCAxKTtcbiAgICBidWYud3JpdGVVSW50MTZMRShvZmZzZXQsIDMpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBidWYud3JpdGVVSW50OChkYXRhLnJlYWRVSW50OChpKSwgaSArIDUpO1xuICAgIH1cblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICBwdWJsaWMgZXhlY3V0ZVdyaXRlUmVxdWVzdChoYW5kbGU6IGFueSwgY2FuY2VsUHJlcGFyZWRXcml0ZXM/OiBhbnkpIHtcbiAgICBjb25zdCBidWY6IGFueSA9IEJ1ZmZlci5hbGxvYygyKTtcblxuICAgIGJ1Zi53cml0ZVVJbnQ4KEFUVF9PUF9FWEVDVVRFX1dSSVRFX1JFUSwgMCk7XG4gICAgYnVmLndyaXRlVUludDgoY2FuY2VsUHJlcGFyZWRXcml0ZXMgPyAwIDogMSwgMSk7XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgcHVibGljIGhhbmRsZUNvbmZpcm1hdGlvbigpIHtcbiAgICBjb25zdCBidWY6IGFueSA9IEJ1ZmZlci5hbGxvYygxKTtcblxuICAgIGJ1Zi53cml0ZVVJbnQ4KEFUVF9PUF9IQU5ETEVfQ05GLCAwKTtcblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICBwdWJsaWMgZXhjaGFuZ2VNdHUobXR1OiBhbnkpIHtcbiAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICB0aGlzLm10dVJlcXVlc3QobXR1KSxcbiAgICAgIChkYXRhOiBhbnkgKSA9PiB7XG4gICAgICAgIGNvbnN0IG9wY29kZTogYW55ID0gZGF0YVswXTtcblxuICAgICAgICBpZiAob3Bjb2RlID09PSBBVFRfT1BfTVRVX1JFU1ApIHtcbiAgICAgICAgICBjb25zdCBuZXdNdHU6IGFueSA9IGRhdGEucmVhZFVJbnQxNkxFKDEpO1xuXG4gICAgICAgICAgZGVidWcodGhpcy5fYWRkcmVzcyArIFwiOiBuZXcgTVRVIGlzIFwiICsgbmV3TXR1KTtcblxuICAgICAgICAgIHRoaXMuX210dSA9IG5ld010dTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZW1pdChcIm10dVwiLCB0aGlzLl9hZGRyZXNzLCB0aGlzLl9tdHUpO1xuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGRpc2NvdmVyU2VydmljZXModXVpZHM6IGFueSkge1xuICAgIGNvbnN0IHNlcnZpY2VzOiBhbnkgPSBbXTtcblxuICAgIGNvbnN0IGNhbGxiYWNrOiBhbnkgPSAoZGF0YTogYW55ICkgPT4ge1xuICAgICAgY29uc3Qgb3Bjb2RlOiBhbnkgPSBkYXRhWzBdO1xuICAgICAgbGV0IGk6IGFueSA9IDA7XG5cbiAgICAgIGlmIChvcGNvZGUgPT09IEFUVF9PUF9SRUFEX0JZX0dST1VQX1JFU1ApIHtcbiAgICAgICAgY29uc3QgdHlwZTogYW55ID0gZGF0YVsxXTtcbiAgICAgICAgY29uc3QgbnVtOiBhbnkgPSAoZGF0YS5sZW5ndGggLSAyKSAvIHR5cGU7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG51bTsgaSsrKSB7XG4gICAgICAgICAgc2VydmljZXMucHVzaCh7XG4gICAgICAgICAgICBzdGFydEhhbmRsZTogZGF0YS5yZWFkVUludDE2TEUoMiArIGkgKiB0eXBlICsgMCksXG4gICAgICAgICAgICBlbmRIYW5kbGU6IGRhdGEucmVhZFVJbnQxNkxFKDIgKyBpICogdHlwZSArIDIpLFxuICAgICAgICAgICAgdXVpZDpcbiAgICAgICAgICAgICAgdHlwZSA9PT0gNlxuICAgICAgICAgICAgICAgID8gZGF0YS5yZWFkVUludDE2TEUoMiArIGkgKiB0eXBlICsgNCkudG9TdHJpbmcoMTYpXG4gICAgICAgICAgICAgICAgOiBkYXRhXG4gICAgICAgICAgICAgICAgICAuc2xpY2UoMiArIGkgKiB0eXBlICsgNClcbiAgICAgICAgICAgICAgICAgIC5zbGljZSgwLCAxNilcbiAgICAgICAgICAgICAgICAgIC50b1N0cmluZyhcImhleFwiKVxuICAgICAgICAgICAgICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgICAgICAgICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgICAgICAgICAgIC5qb2luKFwiXCIpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgb3Bjb2RlICE9PSBBVFRfT1BfUkVBRF9CWV9HUk9VUF9SRVNQIHx8XG4gICAgICAgIHNlcnZpY2VzW3NlcnZpY2VzLmxlbmd0aCAtIDFdLmVuZEhhbmRsZSA9PT0gMHhmZmZmXG4gICAgICApIHtcbiAgICAgICAgY29uc3Qgc2VydmljZVV1aWRzOiBhbnkgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHNlcnZpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHV1aWRzLmxlbmd0aCA9PT0gMCB8fCB1dWlkcy5pbmRleE9mKHNlcnZpY2VzW2ldLnV1aWQpICE9PSAtMSkge1xuICAgICAgICAgICAgc2VydmljZVV1aWRzLnB1c2goc2VydmljZXNbaV0udXVpZCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fc2VydmljZXNbc2VydmljZXNbaV0udXVpZF0gPSBzZXJ2aWNlc1tpXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVtaXQoXCJzZXJ2aWNlc0Rpc2NvdmVyXCIsIHRoaXMuX2FkZHJlc3MsIHNlcnZpY2VVdWlkcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICAgICAgdGhpcy5yZWFkQnlHcm91cFJlcXVlc3QoXG4gICAgICAgICAgICBzZXJ2aWNlc1tzZXJ2aWNlcy5sZW5ndGggLSAxXS5lbmRIYW5kbGUgKyAxLFxuICAgICAgICAgICAgMHhmZmZmLFxuICAgICAgICAgICAgR0FUVF9QUklNX1NWQ19VVUlELFxuICAgICAgICAgICksXG4gICAgICAgICAgY2FsbGJhY2ssXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuX3F1ZXVlQ29tbWFuZChcbiAgICAgIHRoaXMucmVhZEJ5R3JvdXBSZXF1ZXN0KDB4MDAwMSwgMHhmZmZmLCBHQVRUX1BSSU1fU1ZDX1VVSUQpLFxuICAgICAgY2FsbGJhY2ssXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBkaXNjb3ZlckluY2x1ZGVkU2VydmljZXMoc2VydmljZVV1aWQ6IGFueSwgdXVpZHM6IGFueSkge1xuICAgIGNvbnN0IHNlcnZpY2U6IGFueSA9IHRoaXMuX3NlcnZpY2VzW3NlcnZpY2VVdWlkXTtcbiAgICBjb25zdCBpbmNsdWRlZFNlcnZpY2VzOiBhbnkgPSBbXTtcblxuICAgIGNvbnN0IGNhbGxiYWNrOiBhbnkgPSAoZGF0YTogYW55ICkgPT4ge1xuICAgICAgY29uc3Qgb3Bjb2RlOiBhbnkgPSBkYXRhWzBdO1xuICAgICAgbGV0IGk6IGFueSA9IDA7XG5cbiAgICAgIGlmIChvcGNvZGUgPT09IEFUVF9PUF9SRUFEX0JZX1RZUEVfUkVTUCkge1xuICAgICAgICBjb25zdCB0eXBlOiBhbnkgPSBkYXRhWzFdO1xuICAgICAgICBjb25zdCBudW06IGFueSA9IChkYXRhLmxlbmd0aCAtIDIpIC8gdHlwZTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcbiAgICAgICAgICBpbmNsdWRlZFNlcnZpY2VzLnB1c2goe1xuICAgICAgICAgICAgZW5kSGFuZGxlOiBkYXRhLnJlYWRVSW50MTZMRSgyICsgaSAqIHR5cGUgKyAwKSxcbiAgICAgICAgICAgIHN0YXJ0SGFuZGxlOiBkYXRhLnJlYWRVSW50MTZMRSgyICsgaSAqIHR5cGUgKyAyKSxcbiAgICAgICAgICAgIHV1aWQ6XG4gICAgICAgICAgICAgIHR5cGUgPT09IDhcbiAgICAgICAgICAgICAgICA/IGRhdGEucmVhZFVJbnQxNkxFKDIgKyBpICogdHlwZSArIDYpLnRvU3RyaW5nKDE2KVxuICAgICAgICAgICAgICAgIDogZGF0YVxuICAgICAgICAgICAgICAgICAgLnNsaWNlKDIgKyBpICogdHlwZSArIDYpXG4gICAgICAgICAgICAgICAgICAuc2xpY2UoMCwgMTYpXG4gICAgICAgICAgICAgICAgICAudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgICAgICAgICAgICAgIC5tYXRjaCgvLnsxLDJ9L2cpXG4gICAgICAgICAgICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgICAgICAgICAgICAuam9pbihcIlwiKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIG9wY29kZSAhPT0gQVRUX09QX1JFQURfQllfVFlQRV9SRVNQIHx8XG4gICAgICAgIGluY2x1ZGVkU2VydmljZXNbaW5jbHVkZWRTZXJ2aWNlcy5sZW5ndGggLSAxXS5lbmRIYW5kbGUgPT09XG4gICAgICAgIHNlcnZpY2UuZW5kSGFuZGxlXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgaW5jbHVkZWRTZXJ2aWNlVXVpZHM6IGFueSA9IFtdO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBpbmNsdWRlZFNlcnZpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdXVpZHMubGVuZ3RoID09PSAwIHx8XG4gICAgICAgICAgICB1dWlkcy5pbmRleE9mKGluY2x1ZGVkU2VydmljZXNbaV0udXVpZCkgIT09IC0xXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBpbmNsdWRlZFNlcnZpY2VVdWlkcy5wdXNoKGluY2x1ZGVkU2VydmljZXNbaV0udXVpZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAgIFwiaW5jbHVkZWRTZXJ2aWNlc0Rpc2NvdmVyXCIsXG4gICAgICAgICAgdGhpcy5fYWRkcmVzcyxcbiAgICAgICAgICBzZXJ2aWNlLnV1aWQsXG4gICAgICAgICAgaW5jbHVkZWRTZXJ2aWNlVXVpZHMsXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICAgICAgdGhpcy5yZWFkQnlUeXBlUmVxdWVzdChcbiAgICAgICAgICAgIGluY2x1ZGVkU2VydmljZXNbaW5jbHVkZWRTZXJ2aWNlcy5sZW5ndGggLSAxXS5lbmRIYW5kbGUgKyAxLFxuICAgICAgICAgICAgc2VydmljZS5lbmRIYW5kbGUsXG4gICAgICAgICAgICBHQVRUX0lOQ0xVREVfVVVJRCxcbiAgICAgICAgICApLFxuICAgICAgICAgIGNhbGxiYWNrLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICB0aGlzLnJlYWRCeVR5cGVSZXF1ZXN0KFxuICAgICAgICBzZXJ2aWNlLnN0YXJ0SGFuZGxlLFxuICAgICAgICBzZXJ2aWNlLmVuZEhhbmRsZSxcbiAgICAgICAgR0FUVF9JTkNMVURFX1VVSUQsXG4gICAgICApLFxuICAgICAgY2FsbGJhY2ssXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBkaXNjb3ZlckNoYXJhY3RlcmlzdGljcyhzZXJ2aWNlVXVpZDogYW55LCBjaGFyYWN0ZXJpc3RpY1V1aWRzOiBhbnkpIHtcbiAgICBjb25zdCBzZXJ2aWNlOiBhbnkgPSB0aGlzLl9zZXJ2aWNlc1tzZXJ2aWNlVXVpZF07XG4gICAgY29uc3QgY2hhcmFjdGVyaXN0aWNzOiBhbnkgPSBbXTtcblxuICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1tzZXJ2aWNlVXVpZF0gPVxuICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzW3NlcnZpY2VVdWlkXSB8fCB7fTtcbiAgICB0aGlzLl9kZXNjcmlwdG9yc1tzZXJ2aWNlVXVpZF0gPSB0aGlzLl9kZXNjcmlwdG9yc1tzZXJ2aWNlVXVpZF0gfHwge307XG5cbiAgICBjb25zdCBjYWxsYmFjazogYW55ID0gKGRhdGE6IGFueSApID0+IHtcbiAgICAgIGNvbnN0IG9wY29kZTogYW55ID0gZGF0YVswXTtcbiAgICAgIGxldCBpOiBhbnkgPSAwO1xuXG4gICAgICBpZiAob3Bjb2RlID09PSBBVFRfT1BfUkVBRF9CWV9UWVBFX1JFU1ApIHtcbiAgICAgICAgY29uc3QgdHlwZTogYW55ID0gZGF0YVsxXTtcbiAgICAgICAgY29uc3QgbnVtOiBhbnkgPSAoZGF0YS5sZW5ndGggLSAyKSAvIHR5cGU7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG51bTsgaSsrKSB7XG4gICAgICAgICAgY2hhcmFjdGVyaXN0aWNzLnB1c2goe1xuICAgICAgICAgICAgc3RhcnRIYW5kbGU6IGRhdGEucmVhZFVJbnQxNkxFKDIgKyBpICogdHlwZSArIDApLFxuICAgICAgICAgICAgcHJvcGVydGllczogZGF0YS5yZWFkVUludDgoMiArIGkgKiB0eXBlICsgMiksXG4gICAgICAgICAgICB2YWx1ZUhhbmRsZTogZGF0YS5yZWFkVUludDE2TEUoMiArIGkgKiB0eXBlICsgMyksXG4gICAgICAgICAgICB1dWlkOlxuICAgICAgICAgICAgICB0eXBlID09PSA3XG4gICAgICAgICAgICAgICAgPyBkYXRhLnJlYWRVSW50MTZMRSgyICsgaSAqIHR5cGUgKyA1KS50b1N0cmluZygxNilcbiAgICAgICAgICAgICAgICA6IGRhdGFcbiAgICAgICAgICAgICAgICAgIC5zbGljZSgyICsgaSAqIHR5cGUgKyA1KVxuICAgICAgICAgICAgICAgICAgLnNsaWNlKDAsIDE2KVxuICAgICAgICAgICAgICAgICAgLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICAgICAgICAgICAgICAubWF0Y2goLy57MSwyfS9nKVxuICAgICAgICAgICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgICAgICAgICAgLmpvaW4oXCJcIiksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICBvcGNvZGUgIT09IEFUVF9PUF9SRUFEX0JZX1RZUEVfUkVTUCB8fFxuICAgICAgICBjaGFyYWN0ZXJpc3RpY3NbY2hhcmFjdGVyaXN0aWNzLmxlbmd0aCAtIDFdLnZhbHVlSGFuZGxlID09PVxuICAgICAgICBzZXJ2aWNlLmVuZEhhbmRsZVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGNoYXJhY3RlcmlzdGljc0Rpc2NvdmVyZWQ6IGFueSA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2hhcmFjdGVyaXN0aWNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgcHJvcGVydGllczogYW55ID0gY2hhcmFjdGVyaXN0aWNzW2ldLnByb3BlcnRpZXM7XG5cbiAgICAgICAgICBjb25zdCBjaGFyYWN0ZXJpc3RpYzogYW55ID0ge1xuICAgICAgICAgICAgcHJvcGVydGllczogW10sXG4gICAgICAgICAgICB1dWlkOiBjaGFyYWN0ZXJpc3RpY3NbaV0udXVpZCxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKGkgIT09IDApIHtcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljc1tpIC0gMV0uZW5kSGFuZGxlID1cbiAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNzW2ldLnN0YXJ0SGFuZGxlIC0gMTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaSA9PT0gY2hhcmFjdGVyaXN0aWNzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljc1tpXS5lbmRIYW5kbGUgPSBzZXJ2aWNlLmVuZEhhbmRsZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3Nbc2VydmljZVV1aWRdW2NoYXJhY3RlcmlzdGljc1tpXS51dWlkXSA9XG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3NbaV07XG5cbiAgICAgICAgICBpZiAocHJvcGVydGllcyAmIDB4MDEpIHtcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljLnByb3BlcnRpZXMucHVzaChcImJyb2FkY2FzdFwiKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocHJvcGVydGllcyAmIDB4MDIpIHtcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljLnByb3BlcnRpZXMucHVzaChcInJlYWRcIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHByb3BlcnRpZXMgJiAweDA0KSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpYy5wcm9wZXJ0aWVzLnB1c2goXCJ3cml0ZVdpdGhvdXRSZXNwb25zZVwiKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocHJvcGVydGllcyAmIDB4MDgpIHtcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljLnByb3BlcnRpZXMucHVzaChcIndyaXRlXCIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChwcm9wZXJ0aWVzICYgMHgxMCkge1xuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWMucHJvcGVydGllcy5wdXNoKFwibm90aWZ5XCIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChwcm9wZXJ0aWVzICYgMHgyMCkge1xuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWMucHJvcGVydGllcy5wdXNoKFwiaW5kaWNhdGVcIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHByb3BlcnRpZXMgJiAweDQwKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpYy5wcm9wZXJ0aWVzLnB1c2goXCJhdXRoZW50aWNhdGVkU2lnbmVkV3JpdGVzXCIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChwcm9wZXJ0aWVzICYgMHg4MCkge1xuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWMucHJvcGVydGllcy5wdXNoKFwiZXh0ZW5kZWRQcm9wZXJ0aWVzXCIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljVXVpZHMubGVuZ3RoID09PSAwIHx8XG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY1V1aWRzLmluZGV4T2YoY2hhcmFjdGVyaXN0aWMudXVpZCkgIT09IC0xXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3NEaXNjb3ZlcmVkLnB1c2goY2hhcmFjdGVyaXN0aWMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgICBcImNoYXJhY3RlcmlzdGljc0Rpc2NvdmVyXCIsXG4gICAgICAgICAgdGhpcy5fYWRkcmVzcyxcbiAgICAgICAgICBzZXJ2aWNlVXVpZCxcbiAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3NEaXNjb3ZlcmVkLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcXVldWVDb21tYW5kKFxuICAgICAgICAgIHRoaXMucmVhZEJ5VHlwZVJlcXVlc3QoXG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3NbY2hhcmFjdGVyaXN0aWNzLmxlbmd0aCAtIDFdLnZhbHVlSGFuZGxlICsgMSxcbiAgICAgICAgICAgIHNlcnZpY2UuZW5kSGFuZGxlLFxuICAgICAgICAgICAgR0FUVF9DSEFSQUNfVVVJRCxcbiAgICAgICAgICApLFxuICAgICAgICAgIGNhbGxiYWNrLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICB0aGlzLnJlYWRCeVR5cGVSZXF1ZXN0KFxuICAgICAgICBzZXJ2aWNlLnN0YXJ0SGFuZGxlLFxuICAgICAgICBzZXJ2aWNlLmVuZEhhbmRsZSxcbiAgICAgICAgR0FUVF9DSEFSQUNfVVVJRCxcbiAgICAgICksXG4gICAgICBjYWxsYmFjayxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIHJlYWQoc2VydmljZVV1aWQ6IGFueSwgY2hhcmFjdGVyaXN0aWNVdWlkOiBhbnkpIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5fY2hhcmFjdGVyaXN0aWNzW3NlcnZpY2VVdWlkXSB8fFxuICAgICAgIXRoaXMuX2NoYXJhY3RlcmlzdGljc1tzZXJ2aWNlVXVpZF1bY2hhcmFjdGVyaXN0aWNVdWlkXVxuICAgICkge1xuICAgICAgdGhpcy5lbWl0KFxuICAgICAgICBcInJlYWRcIixcbiAgICAgICAgdGhpcy5fYWRkcmVzcyxcbiAgICAgICAgc2VydmljZVV1aWQsXG4gICAgICAgIGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICAgICAgQnVmZmVyLmFsbG9jKDApLFxuICAgICAgICBmYWxzZSxcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY2hhcmFjdGVyaXN0aWM6IGFueSA9IHRoaXMuX2NoYXJhY3RlcmlzdGljc1tzZXJ2aWNlVXVpZF1bY2hhcmFjdGVyaXN0aWNVdWlkXTtcblxuICAgIGxldCByZWFkRGF0YTogYW55ID0gQnVmZmVyLmFsbG9jKDApO1xuXG4gICAgY29uc3QgY2FsbGJhY2s6IGFueSA9IChkYXRhOiBhbnkgKSA9PiB7XG4gICAgICBjb25zdCBvcGNvZGU6IGFueSA9IGRhdGFbMF07XG5cbiAgICAgIGlmIChvcGNvZGUgPT09IEFUVF9PUF9SRUFEX1JFU1AgfHwgb3Bjb2RlID09PSBBVFRfT1BfUkVBRF9CTE9CX1JFU1ApIHtcbiAgICAgICAgcmVhZERhdGEgPSBCdWZmZXIuZnJvbShcbiAgICAgICAgICByZWFkRGF0YS50b1N0cmluZyhcImhleFwiKSArIGRhdGEuc2xpY2UoMSkudG9TdHJpbmcoXCJoZXhcIiksXG4gICAgICAgICAgXCJoZXhcIixcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IHRoaXMuX210dSkge1xuICAgICAgICAgIHRoaXMuX3F1ZXVlQ29tbWFuZChcbiAgICAgICAgICAgIHRoaXMucmVhZEJsb2JSZXF1ZXN0KGNoYXJhY3RlcmlzdGljLnZhbHVlSGFuZGxlLCByZWFkRGF0YS5sZW5ndGgpLFxuICAgICAgICAgICAgY2FsbGJhY2ssXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVtaXQoXG4gICAgICAgICAgICBcInJlYWRcIixcbiAgICAgICAgICAgIHRoaXMuX2FkZHJlc3MsXG4gICAgICAgICAgICBzZXJ2aWNlVXVpZCxcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICAgICAgICAgIHJlYWREYXRhLFxuICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG9wY29kZSA9PT0gQVRUX09QX0VSUk9SKSB7XG4gICAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgICBcInJlYWRcIixcbiAgICAgICAgICB0aGlzLl9hZGRyZXNzLFxuICAgICAgICAgIHNlcnZpY2VVdWlkLFxuICAgICAgICAgIGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICAgICAgICBCdWZmZXIuYWxsb2MoMCksXG4gICAgICAgICAgZmFsc2UsXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVtaXQoXG4gICAgICAgICAgXCJyZWFkXCIsXG4gICAgICAgICAgdGhpcy5fYWRkcmVzcyxcbiAgICAgICAgICBzZXJ2aWNlVXVpZCxcbiAgICAgICAgICBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgICAgICAgcmVhZERhdGEsXG4gICAgICAgICAgdHJ1ZSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5fcXVldWVDb21tYW5kKHRoaXMucmVhZFJlcXVlc3QoY2hhcmFjdGVyaXN0aWMudmFsdWVIYW5kbGUpLCBjYWxsYmFjayk7XG4gIH1cblxuICBwdWJsaWMgd3JpdGUoc2VydmljZVV1aWQ6IGFueSwgY2hhcmFjdGVyaXN0aWNVdWlkOiBhbnksIGRhdGE6IGFueSwgd2l0aG91dFJlc3BvbnNlOiBhbnkpIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5fY2hhcmFjdGVyaXN0aWNzW3NlcnZpY2VVdWlkXSB8fFxuICAgICAgIXRoaXMuX2NoYXJhY3RlcmlzdGljc1tzZXJ2aWNlVXVpZF1bY2hhcmFjdGVyaXN0aWNVdWlkXVxuICAgICkge1xuICAgICAgdGhpcy5lbWl0KFwid3JpdGVcIiwgdGhpcy5fYWRkcmVzcywgc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCwgZmFsc2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNoYXJhY3RlcmlzdGljOiBhbnkgPSB0aGlzLl9jaGFyYWN0ZXJpc3RpY3Nbc2VydmljZVV1aWRdW2NoYXJhY3RlcmlzdGljVXVpZF07XG4gICAgaWYgKHdpdGhvdXRSZXNwb25zZSkge1xuICAgICAgdGhpcy5fcXVldWVDb21tYW5kKFxuICAgICAgICB0aGlzLndyaXRlUmVxdWVzdChjaGFyYWN0ZXJpc3RpYy52YWx1ZUhhbmRsZSwgZGF0YSwgdHJ1ZSksXG4gICAgICAgIG51bGwsXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICB0aGlzLmVtaXQoXCJ3cml0ZVwiLCB0aGlzLl9hZGRyZXNzLCBzZXJ2aWNlVXVpZCwgY2hhcmFjdGVyaXN0aWNVdWlkKTtcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChkYXRhLmxlbmd0aCArIDMgPiB0aGlzLl9tdHUpIHtcbiAgICAgIHJldHVybiB0aGlzLmxvbmdXcml0ZShcbiAgICAgICAgc2VydmljZVV1aWQsXG4gICAgICAgIGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgd2l0aG91dFJlc3BvbnNlLFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcXVldWVDb21tYW5kKFxuICAgICAgICB0aGlzLndyaXRlUmVxdWVzdChjaGFyYWN0ZXJpc3RpYy52YWx1ZUhhbmRsZSwgZGF0YSwgZmFsc2UpLFxuICAgICAgICAoX2RhdGE6IGFueSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG9wY29kZTogYW55ID0gX2RhdGFbMF07XG5cbiAgICAgICAgICBpZiAob3Bjb2RlID09PSBBVFRfT1BfV1JJVEVfUkVTUCB8fCBvcGNvZGUgPT09IEFUVF9PUF9FUlJPUikge1xuICAgICAgICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAgICAgICBcIndyaXRlXCIsXG4gICAgICAgICAgICAgIHRoaXMuX2FkZHJlc3MsXG4gICAgICAgICAgICAgIHNlcnZpY2VVdWlkLFxuICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgICAgICAgICAgIG9wY29kZSA9PT0gQVRUX09QX1dSSVRFX1JFU1AsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyogUGVyZm9ybSBhIFwibG9uZyB3cml0ZVwiIGFzIGRlc2NyaWJlZCBCbHVldG9vdGggU3BlYyBzZWN0aW9uIDQuOS40IFwiV3JpdGUgTG9uZyBDaGFyYWN0ZXJpc3RpYyBWYWx1ZXNcIiAqL1xuICBwdWJsaWMgbG9uZ1dyaXRlKHNlcnZpY2VVdWlkOiBhbnksIGNoYXJhY3RlcmlzdGljVXVpZDogYW55LCBkYXRhOiBhbnksIHdpdGhvdXRSZXNwb25zZTogYW55KSB7XG4gICAgY29uc3QgY2hhcmFjdGVyaXN0aWM6IGFueSA9IHRoaXMuX2NoYXJhY3RlcmlzdGljc1tzZXJ2aWNlVXVpZF1bY2hhcmFjdGVyaXN0aWNVdWlkXTtcbiAgICBjb25zdCBsaW1pdDogYW55ID0gdGhpcy5fbXR1IC0gNTtcblxuICAgIGNvbnN0IHByZXBhcmVXcml0ZUNhbGxiYWNrOiBhbnkgPSAoZGF0YV9jaHVuazogYW55ICkgPT4ge1xuICAgICAgcmV0dXJuIChyZXNwOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3Qgb3Bjb2RlOiBhbnkgPSByZXNwWzBdO1xuXG4gICAgICAgIGlmIChvcGNvZGUgIT09IEFUVF9PUF9QUkVQQVJFX1dSSVRFX1JFU1ApIHtcbiAgICAgICAgICBkZWJ1ZyhcbiAgICAgICAgICAgIHRoaXMuX2FkZHJlc3MgK1xuICAgICAgICAgICAgXCI6IHVuZXhwZWN0ZWQgcmVwbHkgb3Bjb2RlICVkIChleHBlY3RpbmcgQVRUX09QX1BSRVBBUkVfV1JJVEVfUkVTUClcIixcbiAgICAgICAgICAgIG9wY29kZSxcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGV4cGVjdGVkX2xlbmd0aDogYW55ID0gZGF0YV9jaHVuay5sZW5ndGggKyA1O1xuXG4gICAgICAgICAgaWYgKHJlc3AubGVuZ3RoICE9PSBleHBlY3RlZF9sZW5ndGgpIHtcbiAgICAgICAgICAgIC8qIHRoZSByZXNwb25zZSBzaG91bGQgY29udGFpbiB0aGUgZGF0YSBwYWNrZXQgZWNob2VkIGJhY2sgdG8gdGhlIGNhbGxlciAqL1xuICAgICAgICAgICAgZGVidWcoXG4gICAgICAgICAgICAgIHRoaXMuX2FkZHJlc3MgK1xuICAgICAgICAgICAgICBcIjogdW5leHBlY3RlZCBwcmVwYXJlV3JpdGVSZXNwb25zZSBsZW5ndGggJWQgKGV4cGVjdGluZyAlZClcIixcbiAgICAgICAgICAgICAgcmVzcC5sZW5ndGgsXG4gICAgICAgICAgICAgIGV4cGVjdGVkX2xlbmd0aCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH07XG5cbiAgICAvKiBzcGxpdCBpbnRvIHByZXBhcmUtd3JpdGUgY2h1bmtzIGFuZCBxdWV1ZSB0aGVtICovXG4gICAgbGV0IG9mZnNldDogYW55ID0gMDtcblxuICAgIHdoaWxlIChvZmZzZXQgPCBkYXRhLmxlbmd0aCkge1xuICAgICAgY29uc3QgZW5kOiBhbnkgPSBvZmZzZXQgKyBsaW1pdDtcbiAgICAgIGNvbnN0IGNodW5rOiBhbnkgPSBkYXRhLnNsaWNlKG9mZnNldCwgZW5kKTtcbiAgICAgIHRoaXMuX3F1ZXVlQ29tbWFuZChcbiAgICAgICAgdGhpcy5wcmVwYXJlV3JpdGVSZXF1ZXN0KGNoYXJhY3RlcmlzdGljLnZhbHVlSGFuZGxlLCBvZmZzZXQsIGNodW5rKSxcbiAgICAgICAgcHJlcGFyZVdyaXRlQ2FsbGJhY2soY2h1bmspLFxuICAgICAgKTtcbiAgICAgIG9mZnNldCA9IGVuZDtcbiAgICB9XG5cbiAgICAvKiBxdWV1ZSB0aGUgZXhlY3V0ZSBjb21tYW5kIHdpdGggYSBjYWxsYmFjayB0byBlbWl0IHRoZSB3cml0ZSBzaWduYWwgd2hlbiBkb25lICovXG4gICAgdGhpcy5fcXVldWVDb21tYW5kKFxuICAgICAgdGhpcy5leGVjdXRlV3JpdGVSZXF1ZXN0KGNoYXJhY3RlcmlzdGljLnZhbHVlSGFuZGxlKSxcbiAgICAgIChyZXNwOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3Qgb3Bjb2RlOiBhbnkgPSByZXNwWzBdO1xuXG4gICAgICAgIGlmIChvcGNvZGUgPT09IEFUVF9PUF9FWEVDVVRFX1dSSVRFX1JFU1AgJiYgIXdpdGhvdXRSZXNwb25zZSkge1xuICAgICAgICAgIHRoaXMuZW1pdChcIndyaXRlXCIsIHRoaXMuX2FkZHJlc3MsIHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY1V1aWQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgYnJvYWRjYXN0KHNlcnZpY2VVdWlkOiBhbnksIGNoYXJhY3RlcmlzdGljVXVpZDogYW55LCBicm9hZGNhc3Q6IGFueSkge1xuICAgIGNvbnN0IGNoYXJhY3RlcmlzdGljOiBhbnkgPSB0aGlzLl9jaGFyYWN0ZXJpc3RpY3Nbc2VydmljZVV1aWRdW2NoYXJhY3RlcmlzdGljVXVpZF07XG5cbiAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICB0aGlzLnJlYWRCeVR5cGVSZXF1ZXN0KFxuICAgICAgICBjaGFyYWN0ZXJpc3RpYy5zdGFydEhhbmRsZSxcbiAgICAgICAgY2hhcmFjdGVyaXN0aWMuZW5kSGFuZGxlLFxuICAgICAgICBHQVRUX1NFUlZFUl9DSEFSQUNfQ0ZHX1VVSUQsXG4gICAgICApLFxuICAgICAgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCBvcGNvZGU6IGFueSA9IGRhdGFbMF07XG4gICAgICAgIGlmIChvcGNvZGUgPT09IEFUVF9PUF9SRUFEX0JZX1RZUEVfUkVTUCkge1xuICAgICAgICAgIC8vIGxldCB0eXBlID0gZGF0YVsxXTtcbiAgICAgICAgICBjb25zdCBoYW5kbGU6IGFueSA9IGRhdGEucmVhZFVJbnQxNkxFKDIpO1xuICAgICAgICAgIGxldCB2YWx1ZTogYW55ID0gZGF0YS5yZWFkVUludDE2TEUoNCk7XG5cbiAgICAgICAgICBpZiAoYnJvYWRjYXN0KSB7XG4gICAgICAgICAgICB2YWx1ZSB8PSAweDAwMDE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlICY9IDB4ZmZmZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCB2YWx1ZUJ1ZmZlcjogYW55ID0gQnVmZmVyLmFsbG9jKDIpO1xuICAgICAgICAgIHZhbHVlQnVmZmVyLndyaXRlVUludDE2TEUodmFsdWUsIDApO1xuXG4gICAgICAgICAgdGhpcy5fcXVldWVDb21tYW5kKFxuICAgICAgICAgICAgdGhpcy53cml0ZVJlcXVlc3QoaGFuZGxlLCB2YWx1ZUJ1ZmZlciwgZmFsc2UpLFxuICAgICAgICAgICAgKF9kYXRhOiBhbnkgKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IF9vcGNvZGU6IGFueSA9IF9kYXRhWzBdO1xuXG4gICAgICAgICAgICAgIGlmIChfb3Bjb2RlID09PSBBVFRfT1BfV1JJVEVfUkVTUCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgICAgICAgICAgIFwiYnJvYWRjYXN0XCIsXG4gICAgICAgICAgICAgICAgICB0aGlzLl9hZGRyZXNzLFxuICAgICAgICAgICAgICAgICAgc2VydmljZVV1aWQsXG4gICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgICAgICAgICAgICAgICBicm9hZGNhc3QsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5KHNlcnZpY2VVdWlkOiBhbnksIGNoYXJhY3RlcmlzdGljVXVpZDogYW55LCBub3RpZnk6IGFueSkge1xuICAgIGNvbnN0IGNoYXJhY3RlcmlzdGljOiBhbnkgPSB0aGlzLl9jaGFyYWN0ZXJpc3RpY3Nbc2VydmljZVV1aWRdW2NoYXJhY3RlcmlzdGljVXVpZF07XG5cbiAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICB0aGlzLnJlYWRCeVR5cGVSZXF1ZXN0KFxuICAgICAgICBjaGFyYWN0ZXJpc3RpYy5zdGFydEhhbmRsZSxcbiAgICAgICAgY2hhcmFjdGVyaXN0aWMuZW5kSGFuZGxlLFxuICAgICAgICBHQVRUX0NMSUVOVF9DSEFSQUNfQ0ZHX1VVSUQsXG4gICAgICApLFxuICAgICAgKGRhdGE6IGFueSApID0+IHtcbiAgICAgICAgY29uc3Qgb3Bjb2RlOiBhbnkgPSBkYXRhWzBdO1xuICAgICAgICBpZiAob3Bjb2RlID09PSBBVFRfT1BfUkVBRF9CWV9UWVBFX1JFU1ApIHtcbiAgICAgICAgICAvLyBsZXQgdHlwZSA9IGRhdGFbMV07XG4gICAgICAgICAgY29uc3QgaGFuZGxlOiBhbnkgPSBkYXRhLnJlYWRVSW50MTZMRSgyKTtcbiAgICAgICAgICBsZXQgdmFsdWU6IGFueSA9IGRhdGEucmVhZFVJbnQxNkxFKDQpO1xuXG4gICAgICAgICAgY29uc3QgdXNlTm90aWZ5OiBhbnkgPSBjaGFyYWN0ZXJpc3RpYy5wcm9wZXJ0aWVzICYgMHgxMDtcbiAgICAgICAgICBjb25zdCB1c2VJbmRpY2F0ZTogYW55ID0gY2hhcmFjdGVyaXN0aWMucHJvcGVydGllcyAmIDB4MjA7XG5cbiAgICAgICAgICBpZiAobm90aWZ5KSB7XG4gICAgICAgICAgICBpZiAodXNlTm90aWZ5KSB7XG4gICAgICAgICAgICAgIHZhbHVlIHw9IDB4MDAwMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodXNlSW5kaWNhdGUpIHtcbiAgICAgICAgICAgICAgdmFsdWUgfD0gMHgwMDAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodXNlTm90aWZ5KSB7XG4gICAgICAgICAgICAgIHZhbHVlICY9IDB4ZmZmZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodXNlSW5kaWNhdGUpIHtcbiAgICAgICAgICAgICAgdmFsdWUgJj0gMHhmZmZkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHZhbHVlQnVmZmVyOiBhbnkgPSBCdWZmZXIuYWxsb2MoMik7XG4gICAgICAgICAgdmFsdWVCdWZmZXIud3JpdGVVSW50MTZMRSh2YWx1ZSwgMCk7XG5cbiAgICAgICAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICAgICAgICB0aGlzLndyaXRlUmVxdWVzdChoYW5kbGUsIHZhbHVlQnVmZmVyLCBmYWxzZSksXG4gICAgICAgICAgICAoX2RhdGE6IGFueSApID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgX29wY29kZTogYW55ID0gX2RhdGFbMF07XG4gICAgICAgICAgICAgIGRlYnVnKFxuICAgICAgICAgICAgICAgIFwic2V0IG5vdGlmeSB3cml0ZSByZXN1bHRzOiBcIiArIChfb3Bjb2RlID09PSBBVFRfT1BfV1JJVEVfUkVTUCksXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIC8vIGlmIChvcGNvZGUgPT09IEFUVF9PUF9XUklURV9SRVNQKSB7XG4gICAgICAgICAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgICAgICAgICBcIm5vdGlmeVwiLFxuICAgICAgICAgICAgICAgIHRoaXMuX2FkZHJlc3MsXG4gICAgICAgICAgICAgICAgc2VydmljZVV1aWQsXG4gICAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNVdWlkLFxuICAgICAgICAgICAgICAgIG5vdGlmeSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgZGlzY292ZXJEZXNjcmlwdG9ycyhzZXJ2aWNlVXVpZDogYW55LCBjaGFyYWN0ZXJpc3RpY1V1aWQ6IGFueSkge1xuICAgIGNvbnN0IGNoYXJhY3RlcmlzdGljOiBhbnkgPSB0aGlzLl9jaGFyYWN0ZXJpc3RpY3Nbc2VydmljZVV1aWRdW2NoYXJhY3RlcmlzdGljVXVpZF07XG4gICAgY29uc3QgZGVzY3JpcHRvcnM6IGFueSA9IFtdO1xuXG4gICAgdGhpcy5fZGVzY3JpcHRvcnNbc2VydmljZVV1aWRdW2NoYXJhY3RlcmlzdGljVXVpZF0gPSB7fTtcblxuICAgIGNvbnN0IGNhbGxiYWNrOiBhbnkgPSAoZGF0YTogYW55KSA9PiB7XG4gICAgICBjb25zdCBvcGNvZGU6IGFueSA9IGRhdGFbMF07XG4gICAgICBsZXQgaTogYW55ID0gMDtcblxuICAgICAgaWYgKG9wY29kZSA9PT0gQVRUX09QX0ZJTkRfSU5GT19SRVNQKSB7XG4gICAgICAgIGNvbnN0IG51bTogYW55ID0gZGF0YVsxXTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcbiAgICAgICAgICBkZXNjcmlwdG9ycy5wdXNoKHtcbiAgICAgICAgICAgIGhhbmRsZTogZGF0YS5yZWFkVUludDE2TEUoMiArIGkgKiA0ICsgMCksXG4gICAgICAgICAgICB1dWlkOiBkYXRhLnJlYWRVSW50MTZMRSgyICsgaSAqIDQgKyAyKS50b1N0cmluZygxNiksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICBvcGNvZGUgIT09IEFUVF9PUF9GSU5EX0lORk9fUkVTUCB8fFxuICAgICAgICBkZXNjcmlwdG9yc1tkZXNjcmlwdG9ycy5sZW5ndGggLSAxXS5oYW5kbGUgPT09IGNoYXJhY3RlcmlzdGljLmVuZEhhbmRsZVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGRlc2NyaXB0b3JVdWlkczogYW55ID0gW107XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBkZXNjcmlwdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGRlc2NyaXB0b3JVdWlkcy5wdXNoKGRlc2NyaXB0b3JzW2ldLnV1aWQpO1xuXG4gICAgICAgICAgdGhpcy5fZGVzY3JpcHRvcnNbc2VydmljZVV1aWRdW2NoYXJhY3RlcmlzdGljVXVpZF1bXG4gICAgICAgICAgICBkZXNjcmlwdG9yc1tpXS51dWlkXG4gICAgICAgICAgICBdID0gZGVzY3JpcHRvcnNbaV07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVtaXQoXG4gICAgICAgICAgXCJkZXNjcmlwdG9yc0Rpc2NvdmVyXCIsXG4gICAgICAgICAgdGhpcy5fYWRkcmVzcyxcbiAgICAgICAgICBzZXJ2aWNlVXVpZCxcbiAgICAgICAgICBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgICAgICAgZGVzY3JpcHRvclV1aWRzLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcXVldWVDb21tYW5kKFxuICAgICAgICAgIHRoaXMuZmluZEluZm9SZXF1ZXN0KFxuICAgICAgICAgICAgZGVzY3JpcHRvcnNbZGVzY3JpcHRvcnMubGVuZ3RoIC0gMV0uaGFuZGxlICsgMSxcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljLmVuZEhhbmRsZSxcbiAgICAgICAgICApLFxuICAgICAgICAgIGNhbGxiYWNrLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICB0aGlzLmZpbmRJbmZvUmVxdWVzdChcbiAgICAgICAgY2hhcmFjdGVyaXN0aWMudmFsdWVIYW5kbGUgKyAxLFxuICAgICAgICBjaGFyYWN0ZXJpc3RpYy5lbmRIYW5kbGUsXG4gICAgICApLFxuICAgICAgY2FsbGJhY2ssXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkVmFsdWUoc2VydmljZVV1aWQ6IGFueSwgY2hhcmFjdGVyaXN0aWNVdWlkOiBhbnksIGRlc2NyaXB0b3JVdWlkOiBhbnkpIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5fZGVzY3JpcHRvcnNbc2VydmljZVV1aWRdIHx8XG4gICAgICAhdGhpcy5fZGVzY3JpcHRvcnNbc2VydmljZVV1aWRdW2NoYXJhY3RlcmlzdGljVXVpZF0gfHxcbiAgICAgICF0aGlzLl9kZXNjcmlwdG9yc1tzZXJ2aWNlVXVpZF1bY2hhcmFjdGVyaXN0aWNVdWlkXVtkZXNjcmlwdG9yVXVpZF1cbiAgICApIHtcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgXCJ2YWx1ZVJlYWRcIixcbiAgICAgICAgdGhpcy5fYWRkcmVzcyxcbiAgICAgICAgc2VydmljZVV1aWQsXG4gICAgICAgIGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICAgICAgZGVzY3JpcHRvclV1aWQsXG4gICAgICAgIEJ1ZmZlci5hbGxvYygwKSxcbiAgICAgICAgZmFsc2UsXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGRlc2NyaXB0b3I6IGFueSA9IHRoaXMuX2Rlc2NyaXB0b3JzW3NlcnZpY2VVdWlkXVtjaGFyYWN0ZXJpc3RpY1V1aWRdW1xuICAgICAgZGVzY3JpcHRvclV1aWRcbiAgICAgIF07XG5cbiAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICB0aGlzLnJlYWRSZXF1ZXN0KGRlc2NyaXB0b3IuaGFuZGxlKSxcbiAgICAgIChkYXRhOiBhbnkgKSA9PiB7XG4gICAgICAgIGNvbnN0IG9wY29kZTogYW55ID0gZGF0YVswXTtcblxuICAgICAgICBpZiAob3Bjb2RlID09PSBBVFRfT1BfUkVBRF9SRVNQIHx8IG9wY29kZSA9PT0gQVRUX09QX0VSUk9SKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAgICAgXCJ2YWx1ZVJlYWRcIixcbiAgICAgICAgICAgIHRoaXMuX2FkZHJlc3MsXG4gICAgICAgICAgICBzZXJ2aWNlVXVpZCxcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICAgICAgICAgIGRlc2NyaXB0b3JVdWlkLFxuICAgICAgICAgICAgZGF0YS5zbGljZSgxKSxcbiAgICAgICAgICAgIG9wY29kZSA9PT0gQVRUX09QX1JFQURfUkVTUCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgd3JpdGVWYWx1ZShzZXJ2aWNlVXVpZDogYW55LCBjaGFyYWN0ZXJpc3RpY1V1aWQ6IGFueSwgZGVzY3JpcHRvclV1aWQ6IGFueSwgZGF0YTogYW55KSB7XG4gICAgaWYgKFxuICAgICAgIXRoaXMuX2Rlc2NyaXB0b3JzW3NlcnZpY2VVdWlkXSB8fFxuICAgICAgIXRoaXMuX2Rlc2NyaXB0b3JzW3NlcnZpY2VVdWlkXVtjaGFyYWN0ZXJpc3RpY1V1aWRdIHx8XG4gICAgICAhdGhpcy5fZGVzY3JpcHRvcnNbc2VydmljZVV1aWRdW2NoYXJhY3RlcmlzdGljVXVpZF1bZGVzY3JpcHRvclV1aWRdXG4gICAgKSB7XG4gICAgICB0aGlzLmVtaXQoXG4gICAgICAgIFwidmFsdWVXcml0ZVwiLFxuICAgICAgICB0aGlzLl9hZGRyZXNzLFxuICAgICAgICBzZXJ2aWNlVXVpZCxcbiAgICAgICAgY2hhcmFjdGVyaXN0aWNVdWlkLFxuICAgICAgICBkZXNjcmlwdG9yVXVpZCxcbiAgICAgICAgZmFsc2UsXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGRlc2NyaXB0b3I6IGFueSA9IHRoaXMuX2Rlc2NyaXB0b3JzW3NlcnZpY2VVdWlkXVtjaGFyYWN0ZXJpc3RpY1V1aWRdW1xuICAgICAgZGVzY3JpcHRvclV1aWRcbiAgICAgIF07XG5cbiAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICB0aGlzLndyaXRlUmVxdWVzdChkZXNjcmlwdG9yLmhhbmRsZSwgZGF0YSwgZmFsc2UpLFxuICAgICAgKF9kYXRhOiBhbnkgKSA9PiB7XG4gICAgICAgIGNvbnN0IG9wY29kZTogYW55ID0gX2RhdGFbMF07XG5cbiAgICAgICAgaWYgKG9wY29kZSA9PT0gQVRUX09QX1dSSVRFX1JFU1AgfHwgb3Bjb2RlID09PSBBVFRfT1BfRVJST1IpIHtcbiAgICAgICAgICB0aGlzLmVtaXQoXG4gICAgICAgICAgICBcInZhbHVlV3JpdGVcIixcbiAgICAgICAgICAgIHRoaXMuX2FkZHJlc3MsXG4gICAgICAgICAgICBzZXJ2aWNlVXVpZCxcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICAgICAgICAgIGRlc2NyaXB0b3JVdWlkLFxuICAgICAgICAgICAgb3Bjb2RlID09PSBBVFRfT1BfV1JJVEVfUkVTUCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgcmVhZEhhbmRsZShoYW5kbGU6IGFueSkge1xuICAgIHRoaXMuX3F1ZXVlQ29tbWFuZChcbiAgICAgIHRoaXMucmVhZFJlcXVlc3QoaGFuZGxlKSxcbiAgICAgIChkYXRhOiBhbnkgKSA9PiB7XG4gICAgICAgIGNvbnN0IG9wY29kZTogYW55ID0gZGF0YVswXTtcblxuICAgICAgICBpZiAob3Bjb2RlID09PSBBVFRfT1BfUkVBRF9SRVNQKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KFwiaGFuZGxlUmVhZFwiLCB0aGlzLl9hZGRyZXNzLCBoYW5kbGUsIGRhdGEuc2xpY2UoMSkpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgd3JpdGVIYW5kbGUoaGFuZGxlOiBhbnksIGRhdGE6IGFueSwgd2l0aG91dFJlc3BvbnNlOiBhbnkpIHtcbiAgICBpZiAod2l0aG91dFJlc3BvbnNlKSB7XG4gICAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICAgIHRoaXMud3JpdGVSZXF1ZXN0KGhhbmRsZSwgZGF0YSwgdHJ1ZSksXG4gICAgICAgIG51bGwsXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICB0aGlzLmVtaXQoXCJoYW5kbGVXcml0ZVwiLCB0aGlzLl9hZGRyZXNzLCBoYW5kbGUpO1xuICAgICAgICB9LFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcXVldWVDb21tYW5kKFxuICAgICAgICB0aGlzLndyaXRlUmVxdWVzdChoYW5kbGUsIGRhdGEsIGZhbHNlKSxcbiAgICAgICAgKF9kYXRhOiBhbnkgKSA9PiB7XG4gICAgICAgICAgY29uc3Qgb3Bjb2RlOiBhbnkgPSBfZGF0YVswXTtcblxuICAgICAgICAgIGlmIChvcGNvZGUgPT09IEFUVF9PUF9XUklURV9SRVNQKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoXCJoYW5kbGVXcml0ZVwiLCB0aGlzLl9hZGRyZXNzLCBoYW5kbGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhdHQ7XG4iXX0=
