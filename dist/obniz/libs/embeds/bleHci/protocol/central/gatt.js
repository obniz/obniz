"use strict";
// let debug = require('debug')('att');
const debug = () => { };
/* eslint-disable no-unused-vars */
let events = require('events');
let ATT_OP_ERROR = 0x01;
let ATT_OP_MTU_REQ = 0x02;
let ATT_OP_MTU_RESP = 0x03;
let ATT_OP_FIND_INFO_REQ = 0x04;
let ATT_OP_FIND_INFO_RESP = 0x05;
let ATT_OP_READ_BY_TYPE_REQ = 0x08;
let ATT_OP_READ_BY_TYPE_RESP = 0x09;
let ATT_OP_READ_REQ = 0x0a;
let ATT_OP_READ_RESP = 0x0b;
let ATT_OP_READ_BLOB_REQ = 0x0c;
let ATT_OP_READ_BLOB_RESP = 0x0d;
let ATT_OP_READ_BY_GROUP_REQ = 0x10;
let ATT_OP_READ_BY_GROUP_RESP = 0x11;
let ATT_OP_WRITE_REQ = 0x12;
let ATT_OP_WRITE_RESP = 0x13;
let ATT_OP_PREPARE_WRITE_REQ = 0x16;
let ATT_OP_PREPARE_WRITE_RESP = 0x17;
let ATT_OP_EXECUTE_WRITE_REQ = 0x18;
let ATT_OP_EXECUTE_WRITE_RESP = 0x19;
let ATT_OP_HANDLE_NOTIFY = 0x1b;
let ATT_OP_HANDLE_IND = 0x1d;
let ATT_OP_HANDLE_CNF = 0x1e;
let ATT_OP_WRITE_CMD = 0x52;
let ATT_ECODE_SUCCESS = 0x00;
let ATT_ECODE_INVALID_HANDLE = 0x01;
let ATT_ECODE_READ_NOT_PERM = 0x02;
let ATT_ECODE_WRITE_NOT_PERM = 0x03;
let ATT_ECODE_INVALID_PDU = 0x04;
let ATT_ECODE_AUTHENTICATION = 0x05;
let ATT_ECODE_REQ_NOT_SUPP = 0x06;
let ATT_ECODE_INVALID_OFFSET = 0x07;
let ATT_ECODE_AUTHORIZATION = 0x08;
let ATT_ECODE_PREP_QUEUE_FULL = 0x09;
let ATT_ECODE_ATTR_NOT_FOUND = 0x0a;
let ATT_ECODE_ATTR_NOT_LONG = 0x0b;
let ATT_ECODE_INSUFF_ENCR_KEY_SIZE = 0x0c;
let ATT_ECODE_INVAL_ATTR_VALUE_LEN = 0x0d;
let ATT_ECODE_UNLIKELY = 0x0e;
let ATT_ECODE_INSUFF_ENC = 0x0f;
let ATT_ECODE_UNSUPP_GRP_TYPE = 0x10;
let ATT_ECODE_INSUFF_RESOURCES = 0x11;
let GATT_PRIM_SVC_UUID = 0x2800;
let GATT_INCLUDE_UUID = 0x2802;
let GATT_CHARAC_UUID = 0x2803;
let GATT_CLIENT_CHARAC_CFG_UUID = 0x2902;
let GATT_SERVER_CHARAC_CFG_UUID = 0x2903;
let ATT_CID = 0x0004;
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
        this._security = 'low';
        this.onAclStreamDataBinded = this.onAclStreamData.bind(this);
        this.onAclStreamEncryptBinded = this.onAclStreamEncrypt.bind(this);
        this.onAclStreamEncryptFailBinded = this.onAclStreamEncryptFail.bind(this);
        this.onAclStreamEndBinded = this.onAclStreamEnd.bind(this);
        this._aclStream.on('data', this.onAclStreamDataBinded);
        this._aclStream.on('encrypt', this.onAclStreamEncryptBinded);
        this._aclStream.on('encryptFail', this.onAclStreamEncryptFailBinded);
        this._aclStream.on('end', this.onAclStreamEndBinded);
    }
    onAclStreamData(cid, data) {
        if (cid !== ATT_CID) {
            return;
        }
        if (this._currentCommand &&
            data.toString('hex') === this._currentCommand.buffer.toString('hex')) {
            debug(this._address + ': echo ... echo ... echo ...');
        }
        else if (data[0] % 2 === 0) {
            if (process.env.NOBLE_MULTI_ROLE) {
                debug(this._address +
                    ': multi-role flag in use, ignoring command meant for peripheral role.');
            }
            else {
                let requestType = data[0];
                debug(this._address +
                    ': replying with REQ_NOT_SUPP to 0x' +
                    requestType.toString(16));
                this.writeAtt(this.errorResponse(requestType, 0x0000, ATT_ECODE_REQ_NOT_SUPP));
            }
        }
        else if (data[0] === ATT_OP_HANDLE_NOTIFY ||
            data[0] === ATT_OP_HANDLE_IND) {
            let valueHandle = data.readUInt16LE(1);
            let valueData = data.slice(3);
            this.emit('handleNotify', this._address, valueHandle, valueData);
            if (data[0] === ATT_OP_HANDLE_IND) {
                this._queueCommand(this.handleConfirmation(), null, function () {
                    this.emit('handleConfirmation', this._address, valueHandle);
                }.bind(this));
            }
            for (let serviceUuid in this._services) {
                for (let characteristicUuid in this._characteristics[serviceUuid]) {
                    if (this._characteristics[serviceUuid][characteristicUuid]
                        .valueHandle === valueHandle) {
                        this.emit('notification', this._address, serviceUuid, characteristicUuid, valueData);
                    }
                }
            }
        }
        else if (!this._currentCommand) {
            debug(this._address + ': uh oh, no current command');
        }
        else {
            if (data[0] === ATT_OP_ERROR &&
                (data[4] === ATT_ECODE_AUTHENTICATION ||
                    data[4] === ATT_ECODE_AUTHORIZATION ||
                    data[4] === ATT_ECODE_INSUFF_ENC) &&
                this._security !== 'medium') {
                this._aclStream.encrypt();
                return;
            }
            debug(this._address + ': read: ' + data.toString('hex'));
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
            this._security = 'medium';
            this.writeAtt(this._currentCommand.buffer);
        }
    }
    onAclStreamEncryptFail() { }
    onAclStreamEnd() {
        this._aclStream.removeListener('data', this.onAclStreamDataBinded);
        this._aclStream.removeListener('encrypt', this.onAclStreamEncryptBinded);
        this._aclStream.removeListener('encryptFail', this.onAclStreamEncryptFailBinded);
        this._aclStream.removeListener('end', this.onAclStreamEndBinded);
    }
    writeAtt(data) {
        debug(this._address + ': write: ' + data.toString('hex'));
        this._aclStream.write(ATT_CID, data);
    }
    errorResponse(opcode, handle, status) {
        let buf = Buffer.alloc(5);
        buf.writeUInt8(ATT_OP_ERROR, 0);
        buf.writeUInt8(opcode, 1);
        buf.writeUInt16LE(handle, 2);
        buf.writeUInt8(status, 4);
        return buf;
    }
    _queueCommand(buffer, callback, writeCallback) {
        this._commandQueue.push({
            buffer: buffer,
            callback: callback,
            writeCallback: writeCallback,
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
        let buf = Buffer.alloc(3);
        buf.writeUInt8(ATT_OP_MTU_REQ, 0);
        buf.writeUInt16LE(mtu, 1);
        return buf;
    }
    readByGroupRequest(startHandle, endHandle, groupUuid) {
        let buf = Buffer.alloc(7);
        buf.writeUInt8(ATT_OP_READ_BY_GROUP_REQ, 0);
        buf.writeUInt16LE(startHandle, 1);
        buf.writeUInt16LE(endHandle, 3);
        buf.writeUInt16LE(groupUuid, 5);
        return buf;
    }
    readByTypeRequest(startHandle, endHandle, groupUuid) {
        let buf = Buffer.alloc(7);
        buf.writeUInt8(ATT_OP_READ_BY_TYPE_REQ, 0);
        buf.writeUInt16LE(startHandle, 1);
        buf.writeUInt16LE(endHandle, 3);
        buf.writeUInt16LE(groupUuid, 5);
        return buf;
    }
    readRequest(handle) {
        let buf = Buffer.alloc(3);
        buf.writeUInt8(ATT_OP_READ_REQ, 0);
        buf.writeUInt16LE(handle, 1);
        return buf;
    }
    readBlobRequest(handle, offset) {
        let buf = Buffer.alloc(5);
        buf.writeUInt8(ATT_OP_READ_BLOB_REQ, 0);
        buf.writeUInt16LE(handle, 1);
        buf.writeUInt16LE(offset, 3);
        return buf;
    }
    findInfoRequest(startHandle, endHandle) {
        let buf = Buffer.alloc(5);
        buf.writeUInt8(ATT_OP_FIND_INFO_REQ, 0);
        buf.writeUInt16LE(startHandle, 1);
        buf.writeUInt16LE(endHandle, 3);
        return buf;
    }
    writeRequest(handle, data, withoutResponse) {
        let buf = Buffer.alloc(3 + data.length);
        buf.writeUInt8(withoutResponse ? ATT_OP_WRITE_CMD : ATT_OP_WRITE_REQ, 0);
        buf.writeUInt16LE(handle, 1);
        for (let i = 0; i < data.length; i++) {
            buf.writeUInt8(data.readUInt8(i), i + 3);
        }
        return buf;
    }
    prepareWriteRequest(handle, offset, data) {
        let buf = Buffer.alloc(5 + data.length);
        buf.writeUInt8(ATT_OP_PREPARE_WRITE_REQ, 0);
        buf.writeUInt16LE(handle, 1);
        buf.writeUInt16LE(offset, 3);
        for (let i = 0; i < data.length; i++) {
            buf.writeUInt8(data.readUInt8(i), i + 5);
        }
        return buf;
    }
    executeWriteRequest(handle, cancelPreparedWrites) {
        let buf = Buffer.alloc(2);
        buf.writeUInt8(ATT_OP_EXECUTE_WRITE_REQ, 0);
        buf.writeUInt8(cancelPreparedWrites ? 0 : 1, 1);
        return buf;
    }
    handleConfirmation() {
        let buf = Buffer.alloc(1);
        buf.writeUInt8(ATT_OP_HANDLE_CNF, 0);
        return buf;
    }
    exchangeMtu(mtu) {
        this._queueCommand(this.mtuRequest(mtu), function (data) {
            let opcode = data[0];
            if (opcode === ATT_OP_MTU_RESP) {
                let newMtu = data.readUInt16LE(1);
                debug(this._address + ': new MTU is ' + newMtu);
                this._mtu = newMtu;
            }
            this.emit('mtu', this._address, this._mtu);
        }.bind(this));
    }
    discoverServices(uuids) {
        let services = [];
        let callback = function (data) {
            let opcode = data[0];
            let i = 0;
            if (opcode === ATT_OP_READ_BY_GROUP_RESP) {
                let type = data[1];
                let num = (data.length - 2) / type;
                for (i = 0; i < num; i++) {
                    services.push({
                        startHandle: data.readUInt16LE(2 + i * type + 0),
                        endHandle: data.readUInt16LE(2 + i * type + 2),
                        uuid: type == 6
                            ? data.readUInt16LE(2 + i * type + 4).toString(16)
                            : data
                                .slice(2 + i * type + 4)
                                .slice(0, 16)
                                .toString('hex')
                                .match(/.{1,2}/g)
                                .reverse()
                                .join(''),
                    });
                }
            }
            if (opcode !== ATT_OP_READ_BY_GROUP_RESP ||
                services[services.length - 1].endHandle === 0xffff) {
                let serviceUuids = [];
                for (i = 0; i < services.length; i++) {
                    if (uuids.length === 0 || uuids.indexOf(services[i].uuid) !== -1) {
                        serviceUuids.push(services[i].uuid);
                    }
                    this._services[services[i].uuid] = services[i];
                }
                this.emit('servicesDiscover', this._address, serviceUuids);
            }
            else {
                this._queueCommand(this.readByGroupRequest(services[services.length - 1].endHandle + 1, 0xffff, GATT_PRIM_SVC_UUID), callback);
            }
        }.bind(this);
        this._queueCommand(this.readByGroupRequest(0x0001, 0xffff, GATT_PRIM_SVC_UUID), callback);
    }
    discoverIncludedServices(serviceUuid, uuids) {
        let service = this._services[serviceUuid];
        let includedServices = [];
        let callback = function (data) {
            let opcode = data[0];
            let i = 0;
            if (opcode === ATT_OP_READ_BY_TYPE_RESP) {
                let type = data[1];
                let num = (data.length - 2) / type;
                for (i = 0; i < num; i++) {
                    includedServices.push({
                        endHandle: data.readUInt16LE(2 + i * type + 0),
                        startHandle: data.readUInt16LE(2 + i * type + 2),
                        uuid: type == 8
                            ? data.readUInt16LE(2 + i * type + 6).toString(16)
                            : data
                                .slice(2 + i * type + 6)
                                .slice(0, 16)
                                .toString('hex')
                                .match(/.{1,2}/g)
                                .reverse()
                                .join(''),
                    });
                }
            }
            if (opcode !== ATT_OP_READ_BY_TYPE_RESP ||
                includedServices[includedServices.length - 1].endHandle ===
                    service.endHandle) {
                let includedServiceUuids = [];
                for (i = 0; i < includedServices.length; i++) {
                    if (uuids.length === 0 ||
                        uuids.indexOf(includedServices[i].uuid) !== -1) {
                        includedServiceUuids.push(includedServices[i].uuid);
                    }
                }
                this.emit('includedServicesDiscover', this._address, service.uuid, includedServiceUuids);
            }
            else {
                this._queueCommand(this.readByTypeRequest(includedServices[includedServices.length - 1].endHandle + 1, service.endHandle, GATT_INCLUDE_UUID), callback);
            }
        }.bind(this);
        this._queueCommand(this.readByTypeRequest(service.startHandle, service.endHandle, GATT_INCLUDE_UUID), callback);
    }
    discoverCharacteristics(serviceUuid, characteristicUuids) {
        let service = this._services[serviceUuid];
        let characteristics = [];
        this._characteristics[serviceUuid] =
            this._characteristics[serviceUuid] || {};
        this._descriptors[serviceUuid] = this._descriptors[serviceUuid] || {};
        let callback = function (data) {
            let opcode = data[0];
            let i = 0;
            if (opcode === ATT_OP_READ_BY_TYPE_RESP) {
                let type = data[1];
                let num = (data.length - 2) / type;
                for (i = 0; i < num; i++) {
                    characteristics.push({
                        startHandle: data.readUInt16LE(2 + i * type + 0),
                        properties: data.readUInt8(2 + i * type + 2),
                        valueHandle: data.readUInt16LE(2 + i * type + 3),
                        uuid: type == 7
                            ? data.readUInt16LE(2 + i * type + 5).toString(16)
                            : data
                                .slice(2 + i * type + 5)
                                .slice(0, 16)
                                .toString('hex')
                                .match(/.{1,2}/g)
                                .reverse()
                                .join(''),
                    });
                }
            }
            if (opcode !== ATT_OP_READ_BY_TYPE_RESP ||
                characteristics[characteristics.length - 1].valueHandle ===
                    service.endHandle) {
                let characteristicsDiscovered = [];
                for (i = 0; i < characteristics.length; i++) {
                    let properties = characteristics[i].properties;
                    let characteristic = {
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
                this.emit('characteristicsDiscover', this._address, serviceUuid, characteristicsDiscovered);
            }
            else {
                this._queueCommand(this.readByTypeRequest(characteristics[characteristics.length - 1].valueHandle + 1, service.endHandle, GATT_CHARAC_UUID), callback);
            }
        }.bind(this);
        this._queueCommand(this.readByTypeRequest(service.startHandle, service.endHandle, GATT_CHARAC_UUID), callback);
    }
    read(serviceUuid, characteristicUuid) {
        if (!this._characteristics[serviceUuid] ||
            !this._characteristics[serviceUuid][characteristicUuid]) {
            this.emit('read', this._address, serviceUuid, characteristicUuid, Buffer.alloc(0), false);
            return;
        }
        let characteristic = this._characteristics[serviceUuid][characteristicUuid];
        let readData = Buffer.alloc(0);
        let callback = function (data) {
            let opcode = data[0];
            if (opcode === ATT_OP_READ_RESP || opcode === ATT_OP_READ_BLOB_RESP) {
                readData = Buffer.from(readData.toString('hex') + data.slice(1).toString('hex'), 'hex');
                if (data.length === this._mtu) {
                    this._queueCommand(this.readBlobRequest(characteristic.valueHandle, readData.length), callback);
                }
                else {
                    this.emit('read', this._address, serviceUuid, characteristicUuid, readData, true);
                }
            }
            else if (opcode === ATT_OP_ERROR) {
                this.emit('read', this._address, serviceUuid, characteristicUuid, Buffer.alloc(0), false);
            }
            else {
                this.emit('read', this._address, serviceUuid, characteristicUuid, readData, true);
            }
        }.bind(this);
        this._queueCommand(this.readRequest(characteristic.valueHandle), callback);
    }
    write(serviceUuid, characteristicUuid, data, withoutResponse) {
        if (!this._characteristics[serviceUuid] ||
            !this._characteristics[serviceUuid][characteristicUuid]) {
            this.emit('write', this._address, serviceUuid, characteristicUuid, false);
            return;
        }
        let characteristic = this._characteristics[serviceUuid][characteristicUuid];
        if (withoutResponse) {
            this._queueCommand(this.writeRequest(characteristic.valueHandle, data, true), null, function () {
                this.emit('write', this._address, serviceUuid, characteristicUuid);
            }.bind(this));
        }
        else if (data.length + 3 > this._mtu) {
            return this.longWrite(serviceUuid, characteristicUuid, data, withoutResponse);
        }
        else {
            this._queueCommand(this.writeRequest(characteristic.valueHandle, data, false), function (data) {
                let opcode = data[0];
                if (opcode === ATT_OP_WRITE_RESP || opcode === ATT_OP_ERROR) {
                    this.emit('write', this._address, serviceUuid, characteristicUuid, opcode === ATT_OP_WRITE_RESP);
                }
            }.bind(this));
        }
    }
    /* Perform a "long write" as described Bluetooth Spec section 4.9.4 "Write Long Characteristic Values" */
    longWrite(serviceUuid, characteristicUuid, data, withoutResponse) {
        let characteristic = this._characteristics[serviceUuid][characteristicUuid];
        let limit = this._mtu - 5;
        let prepareWriteCallback = function (data_chunk) {
            return function (resp) {
                let opcode = resp[0];
                if (opcode != ATT_OP_PREPARE_WRITE_RESP) {
                    debug(this._address +
                        ': unexpected reply opcode %d (expecting ATT_OP_PREPARE_WRITE_RESP)', opcode);
                }
                else {
                    let expected_length = data_chunk.length + 5;
                    if (resp.length !== expected_length) {
                        /* the response should contain the data packet echoed back to the caller */
                        debug(this._address +
                            ': unexpected prepareWriteResponse length %d (expecting %d)', resp.length, expected_length);
                    }
                }
            }.bind(this);
        }.bind(this);
        /* split into prepare-write chunks and queue them */
        let offset = 0;
        while (offset < data.length) {
            let end = offset + limit;
            let chunk = data.slice(offset, end);
            this._queueCommand(this.prepareWriteRequest(characteristic.valueHandle, offset, chunk), prepareWriteCallback(chunk));
            offset = end;
        }
        /* queue the execute command with a callback to emit the write signal when done */
        this._queueCommand(this.executeWriteRequest(characteristic.valueHandle), function (resp) {
            let opcode = resp[0];
            if (opcode === ATT_OP_EXECUTE_WRITE_RESP && !withoutResponse) {
                this.emit('write', this._address, serviceUuid, characteristicUuid);
            }
        }.bind(this));
    }
    broadcast(serviceUuid, characteristicUuid, broadcast) {
        let characteristic = this._characteristics[serviceUuid][characteristicUuid];
        this._queueCommand(this.readByTypeRequest(characteristic.startHandle, characteristic.endHandle, GATT_SERVER_CHARAC_CFG_UUID), function (data) {
            let opcode = data[0];
            if (opcode === ATT_OP_READ_BY_TYPE_RESP) {
                // let type = data[1];
                let handle = data.readUInt16LE(2);
                let value = data.readUInt16LE(4);
                if (broadcast) {
                    value |= 0x0001;
                }
                else {
                    value &= 0xfffe;
                }
                let valueBuffer = Buffer.alloc(2);
                valueBuffer.writeUInt16LE(value, 0);
                this._queueCommand(this.writeRequest(handle, valueBuffer, false), function (data) {
                    let opcode = data[0];
                    if (opcode === ATT_OP_WRITE_RESP) {
                        this.emit('broadcast', this._address, serviceUuid, characteristicUuid, broadcast);
                    }
                }.bind(this));
            }
        }.bind(this));
    }
    notify(serviceUuid, characteristicUuid, notify) {
        let characteristic = this._characteristics[serviceUuid][characteristicUuid];
        this._queueCommand(this.readByTypeRequest(characteristic.startHandle, characteristic.endHandle, GATT_CLIENT_CHARAC_CFG_UUID), function (data) {
            let opcode = data[0];
            if (opcode === ATT_OP_READ_BY_TYPE_RESP) {
                // let type = data[1];
                let handle = data.readUInt16LE(2);
                let value = data.readUInt16LE(4);
                let useNotify = characteristic.properties & 0x10;
                let useIndicate = characteristic.properties & 0x20;
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
                let valueBuffer = Buffer.alloc(2);
                valueBuffer.writeUInt16LE(value, 0);
                this._queueCommand(this.writeRequest(handle, valueBuffer, false), function (data) {
                    let opcode = data[0];
                    debug('set notify write results: ' + (opcode === ATT_OP_WRITE_RESP));
                    // if (opcode === ATT_OP_WRITE_RESP) {
                    this.emit('notify', this._address, serviceUuid, characteristicUuid, notify);
                    // }
                }.bind(this));
            }
        }.bind(this));
    }
    discoverDescriptors(serviceUuid, characteristicUuid) {
        let characteristic = this._characteristics[serviceUuid][characteristicUuid];
        let descriptors = [];
        this._descriptors[serviceUuid][characteristicUuid] = {};
        let callback = function (data) {
            let opcode = data[0];
            let i = 0;
            if (opcode === ATT_OP_FIND_INFO_RESP) {
                let num = data[1];
                for (i = 0; i < num; i++) {
                    descriptors.push({
                        handle: data.readUInt16LE(2 + i * 4 + 0),
                        uuid: data.readUInt16LE(2 + i * 4 + 2).toString(16),
                    });
                }
            }
            if (opcode !== ATT_OP_FIND_INFO_RESP ||
                descriptors[descriptors.length - 1].handle === characteristic.endHandle) {
                let descriptorUuids = [];
                for (i = 0; i < descriptors.length; i++) {
                    descriptorUuids.push(descriptors[i].uuid);
                    this._descriptors[serviceUuid][characteristicUuid][descriptors[i].uuid] = descriptors[i];
                }
                this.emit('descriptorsDiscover', this._address, serviceUuid, characteristicUuid, descriptorUuids);
            }
            else {
                this._queueCommand(this.findInfoRequest(descriptors[descriptors.length - 1].handle + 1, characteristic.endHandle), callback);
            }
        }.bind(this);
        this._queueCommand(this.findInfoRequest(characteristic.valueHandle + 1, characteristic.endHandle), callback);
    }
    readValue(serviceUuid, characteristicUuid, descriptorUuid) {
        if (!this._descriptors[serviceUuid] ||
            !this._descriptors[serviceUuid][characteristicUuid] ||
            !this._descriptors[serviceUuid][characteristicUuid][descriptorUuid]) {
            this.emit('valueRead', this._address, serviceUuid, characteristicUuid, descriptorUuid, Buffer.alloc(0), false);
            return;
        }
        let descriptor = this._descriptors[serviceUuid][characteristicUuid][descriptorUuid];
        this._queueCommand(this.readRequest(descriptor.handle), function (data) {
            let opcode = data[0];
            if (opcode === ATT_OP_READ_RESP || opcode === ATT_OP_ERROR) {
                this.emit('valueRead', this._address, serviceUuid, characteristicUuid, descriptorUuid, data.slice(1), opcode === ATT_OP_READ_RESP);
            }
        }.bind(this));
    }
    writeValue(serviceUuid, characteristicUuid, descriptorUuid, data) {
        if (!this._descriptors[serviceUuid] ||
            !this._descriptors[serviceUuid][characteristicUuid] ||
            !this._descriptors[serviceUuid][characteristicUuid][descriptorUuid]) {
            this.emit('valueWrite', this._address, serviceUuid, characteristicUuid, descriptorUuid, false);
            return;
        }
        let descriptor = this._descriptors[serviceUuid][characteristicUuid][descriptorUuid];
        this._queueCommand(this.writeRequest(descriptor.handle, data, false), function (data) {
            let opcode = data[0];
            if (opcode === ATT_OP_WRITE_RESP || opcode === ATT_OP_ERROR) {
                this.emit('valueWrite', this._address, serviceUuid, characteristicUuid, descriptorUuid, opcode === ATT_OP_WRITE_RESP);
            }
        }.bind(this));
    }
    readHandle(handle) {
        this._queueCommand(this.readRequest(handle), function (data) {
            let opcode = data[0];
            if (opcode === ATT_OP_READ_RESP) {
                this.emit('handleRead', this._address, handle, data.slice(1));
            }
        }.bind(this));
    }
    writeHandle(handle, data, withoutResponse) {
        if (withoutResponse) {
            this._queueCommand(this.writeRequest(handle, data, true), null, function () {
                this.emit('handleWrite', this._address, handle);
            }.bind(this));
        }
        else {
            this._queueCommand(this.writeRequest(handle, data, false), function (data) {
                let opcode = data[0];
                if (opcode === ATT_OP_WRITE_RESP) {
                    this.emit('handleWrite', this._address, handle);
                }
            }.bind(this));
        }
    }
}
module.exports = Gatt;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvcHJvdG9jb2wvY2VudHJhbC9nYXR0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsTUFBTSxLQUFLLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0FBRXZCLG1DQUFtQztBQUVuQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFL0IsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQztBQUMxQixJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDM0IsSUFBSSxvQkFBb0IsR0FBRyxJQUFJLENBQUM7QUFDaEMsSUFBSSxxQkFBcUIsR0FBRyxJQUFJLENBQUM7QUFDakMsSUFBSSx1QkFBdUIsR0FBRyxJQUFJLENBQUM7QUFDbkMsSUFBSSx3QkFBd0IsR0FBRyxJQUFJLENBQUM7QUFDcEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBQzNCLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzVCLElBQUksb0JBQW9CLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLElBQUkscUJBQXFCLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLElBQUksd0JBQXdCLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLElBQUkseUJBQXlCLEdBQUcsSUFBSSxDQUFDO0FBQ3JDLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzVCLElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLElBQUksd0JBQXdCLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLElBQUkseUJBQXlCLEdBQUcsSUFBSSxDQUFDO0FBQ3JDLElBQUksd0JBQXdCLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLElBQUkseUJBQXlCLEdBQUcsSUFBSSxDQUFDO0FBQ3JDLElBQUksb0JBQW9CLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLElBQUksaUJBQWlCLEdBQUcs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QUUsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMvRDtRQUNILENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ2IsQ0FBQztJQUNKLENBQUM7SUFFRCxXQUFXLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxlQUFlO1FBQ3ZDLElBQUksZUFBZSxFQUFFO1lBQ25CLElBQUksQ0FBQyxhQUFhLENBQ2hCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFDckMsSUFBSSxFQUNKO2dCQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDYixDQUFDO1NBQ0g7YUFBTTtZQUNMLElBQUksQ0FBQyxhQUFhLENBQ2hCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsRUFDdEMsVUFBUyxJQUFJO2dCQUNYLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFckIsSUFBSSxNQUFNLEtBQUssaUJBQWlCLEVBQUU7b0JBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7aUJBQ2pEO1lBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDYixDQUFDO1NBQ0g7SUFDSCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyIsImZpbGUiOiJvYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvcHJvdG9jb2wvY2VudHJhbC9nYXR0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbGV0IGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnYXR0Jyk7XG5jb25zdCBkZWJ1ZyA9ICgpID0+IHt9O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG5sZXQgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5cbmxldCBBVFRfT1BfRVJST1IgPSAweDAxO1xubGV0IEFUVF9PUF9NVFVfUkVRID0gMHgwMjtcbmxldCBBVFRfT1BfTVRVX1JFU1AgPSAweDAzO1xubGV0IEFUVF9PUF9GSU5EX0lORk9fUkVRID0gMHgwNDtcbmxldCBBVFRfT1BfRklORF9JTkZPX1JFU1AgPSAweDA1O1xubGV0IEFUVF9PUF9SRUFEX0JZX1RZUEVfUkVRID0gMHgwODtcbmxldCBBVFRfT1BfUkVBRF9CWV9UWVBFX1JFU1AgPSAweDA5O1xubGV0IEFUVF9PUF9SRUFEX1JFUSA9IDB4MGE7XG5sZXQgQVRUX09QX1JFQURfUkVTUCA9IDB4MGI7XG5sZXQgQVRUX09QX1JFQURfQkxPQl9SRVEgPSAweDBjO1xubGV0IEFUVF9PUF9SRUFEX0JMT0JfUkVTUCA9IDB4MGQ7XG5sZXQgQVRUX09QX1JFQURfQllfR1JPVVBfUkVRID0gMHgxMDtcbmxldCBBVFRfT1BfUkVBRF9CWV9HUk9VUF9SRVNQID0gMHgxMTtcbmxldCBBVFRfT1BfV1JJVEVfUkVRID0gMHgxMjtcbmxldCBBVFRfT1BfV1JJVEVfUkVTUCA9IDB4MTM7XG5sZXQgQVRUX09QX1BSRVBBUkVfV1JJVEVfUkVRID0gMHgxNjtcbmxldCBBVFRfT1BfUFJFUEFSRV9XUklURV9SRVNQID0gMHgxNztcbmxldCBBVFRfT1BfRVhFQ1VURV9XUklURV9SRVEgPSAweDE4O1xubGV0IEFUVF9PUF9FWEVDVVRFX1dSSVRFX1JFU1AgPSAweDE5O1xubGV0IEFUVF9PUF9IQU5ETEVfTk9USUZZID0gMHgxYjtcbmxldCBBVFRfT1BfSEFORExFX0lORCA9IDB4MWQ7XG5sZXQgQVRUX09QX0hBTkRMRV9DTkYgPSAweDFlO1xubGV0IEFUVF9PUF9XUklURV9DTUQgPSAweDUyO1xuXG5sZXQgQVRUX0VDT0RFX1NVQ0NFU1MgPSAweDAwO1xubGV0IEFUVF9FQ09ERV9JTlZBTElEX0hBTkRMRSA9IDB4MDE7XG5sZXQgQVRUX0VDT0RFX1JFQURfTk9UX1BFUk0gPSAweDAyO1xubGV0IEFUVF9FQ09ERV9XUklURV9OT1RfUEVSTSA9IDB4MDM7XG5sZXQgQVRUX0VDT0RFX0lOVkFMSURfUERVID0gMHgwNDtcbmxldCBBVFRfRUNPREVfQVVUSEVOVElDQVRJT04gPSAweDA1O1xubGV0IEFUVF9FQ09ERV9SRVFfTk9UX1NVUFAgPSAweDA2O1xubGV0IEFUVF9FQ09ERV9JTlZBTElEX09GRlNFVCA9IDB4MDc7XG5sZXQgQVRUX0VDT0RFX0FVVEhPUklaQVRJT04gPSAweDA4O1xubGV0IEFUVF9FQ09ERV9QUkVQX1FVRVVFX0ZVTEwgPSAweDA5O1xubGV0IEFUVF9FQ09ERV9BVFRSX05PVF9GT1VORCA9IDB4MGE7XG5sZXQgQVRUX0VDT0RFX0FUVFJfTk9UX0xPTkcgPSAweDBiO1xubGV0IEFUVF9FQ09ERV9JTlNVRkZfRU5DUl9LRVlfU0laRSA9IDB4MGM7XG5sZXQgQVRUX0VDT0RFX0lOVkFMX0FUVFJfVkFMVUVfTEVOID0gMHgwZDtcbmxldCBBVFRfRUNPREVfVU5MSUtFTFkgPSAweDBlO1xubGV0IEFUVF9FQ09ERV9JTlNVRkZfRU5DID0gMHgwZjtcbmxldCBBVFRfRUNPREVfVU5TVVBQX0dSUF9UWVBFID0gMHgxMDtcbmxldCBBVFRfRUNPREVfSU5TVUZGX1JFU09VUkNFUyA9IDB4MTE7XG5cbmxldCBHQVRUX1BSSU1fU1ZDX1VVSUQgPSAweDI4MDA7XG5sZXQgR0FUVF9JTkNMVURFX1VVSUQgPSAweDI4MDI7XG5sZXQgR0FUVF9DSEFSQUNfVVVJRCA9IDB4MjgwMztcblxubGV0IEdBVFRfQ0xJRU5UX0NIQVJBQ19DRkdfVVVJRCA9IDB4MjkwMjtcbmxldCBHQVRUX1NFUlZFUl9DSEFSQUNfQ0ZHX1VVSUQgPSAweDI5MDM7XG5cbmxldCBBVFRfQ0lEID0gMHgwMDA0O1xuXG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG5jbGFzcyBHYXR0IGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGFkZHJlc3MsIGFjbFN0cmVhbSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fYWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgdGhpcy5fYWNsU3RyZWFtID0gYWNsU3RyZWFtO1xuXG4gICAgdGhpcy5fc2VydmljZXMgPSB7fTtcbiAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3MgPSB7fTtcbiAgICB0aGlzLl9kZXNjcmlwdG9ycyA9IHt9O1xuXG4gICAgdGhpcy5fY3VycmVudENvbW1hbmQgPSBudWxsO1xuICAgIHRoaXMuX2NvbW1hbmRRdWV1ZSA9IFtdO1xuXG4gICAgdGhpcy5fbXR1ID0gMjM7XG4gICAgdGhpcy5fc2VjdXJpdHkgPSAnbG93JztcblxuICAgIHRoaXMub25BY2xTdHJlYW1EYXRhQmluZGVkID0gdGhpcy5vbkFjbFN0cmVhbURhdGEuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uQWNsU3RyZWFtRW5jcnlwdEJpbmRlZCA9IHRoaXMub25BY2xTdHJlYW1FbmNyeXB0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbkFjbFN0cmVhbUVuY3J5cHRGYWlsQmluZGVkID0gdGhpcy5vbkFjbFN0cmVhbUVuY3J5cHRGYWlsLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbkFjbFN0cmVhbUVuZEJpbmRlZCA9IHRoaXMub25BY2xTdHJlYW1FbmQuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX2FjbFN0cmVhbS5vbignZGF0YScsIHRoaXMub25BY2xTdHJlYW1EYXRhQmluZGVkKTtcbiAgICB0aGlzLl9hY2xTdHJlYW0ub24oJ2VuY3J5cHQnLCB0aGlzLm9uQWNsU3RyZWFtRW5jcnlwdEJpbmRlZCk7XG4gICAgdGhpcy5fYWNsU3RyZWFtLm9uKCdlbmNyeXB0RmFpbCcsIHRoaXMub25BY2xTdHJlYW1FbmNyeXB0RmFpbEJpbmRlZCk7XG4gICAgdGhpcy5fYWNsU3RyZWFtLm9uKCdlbmQnLCB0aGlzLm9uQWNsU3RyZWFtRW5kQmluZGVkKTtcbiAgfVxuXG4gIG9uQWNsU3RyZWFtRGF0YShjaWQsIGRhdGEpIHtcbiAgICBpZiAoY2lkICE9PSBBVFRfQ0lEKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgdGhpcy5fY3VycmVudENvbW1hbmQgJiZcbiAgICAgIGRhdGEudG9TdHJpbmcoJ2hleCcpID09PSB0aGlzLl9jdXJyZW50Q29tbWFuZC5idWZmZXIudG9TdHJpbmcoJ2hleCcpXG4gICAgKSB7XG4gICAgICBkZWJ1Zyh0aGlzLl9hZGRyZXNzICsgJzogZWNobyAuLi4gZWNobyAuLi4gZWNobyAuLi4nKTtcbiAgICB9IGVsc2UgaWYgKGRhdGFbMF0gJSAyID09PSAwKSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9CTEVfTVVMVElfUk9MRSkge1xuICAgICAgICBkZWJ1ZyhcbiAgICAgICAgICB0aGlzLl9hZGRyZXNzICtcbiAgICAgICAgICAgICc6IG11bHRpLXJvbGUgZmxhZyBpbiB1c2UsIGlnbm9yaW5nIGNvbW1hbmQgbWVhbnQgZm9yIHBlcmlwaGVyYWwgcm9sZS4nXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcmVxdWVzdFR5cGUgPSBkYXRhWzBdO1xuICAgICAgICBkZWJ1ZyhcbiAgICAgICAgICB0aGlzLl9hZGRyZXNzICtcbiAgICAgICAgICAgICc6IHJlcGx5aW5nIHdpdGggUkVRX05PVF9TVVBQIHRvIDB4JyArXG4gICAgICAgICAgICByZXF1ZXN0VHlwZS50b1N0cmluZygxNilcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy53cml0ZUF0dChcbiAgICAgICAgICB0aGlzLmVycm9yUmVzcG9uc2UocmVxdWVzdFR5cGUsIDB4MDAwMCwgQVRUX0VDT0RFX1JFUV9OT1RfU1VQUClcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgZGF0YVswXSA9PT0gQVRUX09QX0hBTkRMRV9OT1RJRlkgfHxcbiAgICAgIGRhdGFbMF0gPT09IEFUVF9PUF9IQU5ETEVfSU5EXG4gICAgKSB7XG4gICAgICBsZXQgdmFsdWVIYW5kbGUgPSBkYXRhLnJlYWRVSW50MTZMRSgxKTtcbiAgICAgIGxldCB2YWx1ZURhdGEgPSBkYXRhLnNsaWNlKDMpO1xuXG4gICAgICB0aGlzLmVtaXQoJ2hhbmRsZU5vdGlmeScsIHRoaXMuX2FkZHJlc3MsIHZhbHVlSGFuZGxlLCB2YWx1ZURhdGEpO1xuXG4gICAgICBpZiAoZGF0YVswXSA9PT0gQVRUX09QX0hBTkRMRV9JTkQpIHtcbiAgICAgICAgdGhpcy5fcXVldWVDb21tYW5kKFxuICAgICAgICAgIHRoaXMuaGFuZGxlQ29uZmlybWF0aW9uKCksXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnaGFuZGxlQ29uZmlybWF0aW9uJywgdGhpcy5fYWRkcmVzcywgdmFsdWVIYW5kbGUpO1xuICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBzZXJ2aWNlVXVpZCBpbiB0aGlzLl9zZXJ2aWNlcykge1xuICAgICAgICBmb3IgKGxldCBjaGFyYWN0ZXJpc3RpY1V1aWQgaW4gdGhpcy5fY2hhcmFjdGVyaXN0aWNzW3NlcnZpY2VVdWlkXSkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1tzZXJ2aWNlVXVpZF1bY2hhcmFjdGVyaXN0aWNVdWlkXVxuICAgICAgICAgICAgICAudmFsdWVIYW5kbGUgPT09IHZhbHVlSGFuZGxlXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoXG4gICAgICAgICAgICAgICdub3RpZmljYXRpb24nLFxuICAgICAgICAgICAgICB0aGlzLl9hZGRyZXNzLFxuICAgICAgICAgICAgICBzZXJ2aWNlVXVpZCxcbiAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNVdWlkLFxuICAgICAgICAgICAgICB2YWx1ZURhdGFcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghdGhpcy5fY3VycmVudENvbW1hbmQpIHtcbiAgICAgIGRlYnVnKHRoaXMuX2FkZHJlc3MgKyAnOiB1aCBvaCwgbm8gY3VycmVudCBjb21tYW5kJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChcbiAgICAgICAgZGF0YVswXSA9PT0gQVRUX09QX0VSUk9SICYmXG4gICAgICAgIChkYXRhWzRdID09PSBBVFRfRUNPREVfQVVUSEVOVElDQVRJT04gfHxcbiAgICAgICAgICBkYXRhWzRdID09PSBBVFRfRUNPREVfQVVUSE9SSVpBVElPTiB8fFxuICAgICAgICAgIGRhdGFbNF0gPT09IEFUVF9FQ09ERV9JTlNVRkZfRU5DKSAmJlxuICAgICAgICB0aGlzLl9zZWN1cml0eSAhPT0gJ21lZGl1bSdcbiAgICAgICkge1xuICAgICAgICB0aGlzLl9hY2xTdHJlYW0uZW5jcnlwdCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGRlYnVnKHRoaXMuX2FkZHJlc3MgKyAnOiByZWFkOiAnICsgZGF0YS50b1N0cmluZygnaGV4JykpO1xuXG4gICAgICB0aGlzLl9jdXJyZW50Q29tbWFuZC5jYWxsYmFjayhkYXRhKTtcblxuICAgICAgdGhpcy5fY3VycmVudENvbW1hbmQgPSBudWxsO1xuXG4gICAgICB3aGlsZSAodGhpcy5fY29tbWFuZFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50Q29tbWFuZCA9IHRoaXMuX2NvbW1hbmRRdWV1ZS5zaGlmdCgpO1xuXG4gICAgICAgIHRoaXMud3JpdGVBdHQodGhpcy5fY3VycmVudENvbW1hbmQuYnVmZmVyKTtcblxuICAgICAgICBpZiAodGhpcy5fY3VycmVudENvbW1hbmQuY2FsbGJhY2spIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9jdXJyZW50Q29tbWFuZC53cml0ZUNhbGxiYWNrKSB7XG4gICAgICAgICAgdGhpcy5fY3VycmVudENvbW1hbmQud3JpdGVDYWxsYmFjaygpO1xuXG4gICAgICAgICAgdGhpcy5fY3VycmVudENvbW1hbmQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25BY2xTdHJlYW1FbmNyeXB0KGVuY3J5cHQpIHtcbiAgICBpZiAoZW5jcnlwdCkge1xuICAgICAgdGhpcy5fc2VjdXJpdHkgPSAnbWVkaXVtJztcblxuICAgICAgdGhpcy53cml0ZUF0dCh0aGlzLl9jdXJyZW50Q29tbWFuZC5idWZmZXIpO1xuICAgIH1cbiAgfVxuXG4gIG9uQWNsU3RyZWFtRW5jcnlwdEZhaWwoKSB7fVxuXG4gIG9uQWNsU3RyZWFtRW5kKCkge1xuICAgIHRoaXMuX2FjbFN0cmVhbS5yZW1vdmVMaXN0ZW5lcignZGF0YScsIHRoaXMub25BY2xTdHJlYW1EYXRhQmluZGVkKTtcbiAgICB0aGlzLl9hY2xTdHJlYW0ucmVtb3ZlTGlzdGVuZXIoJ2VuY3J5cHQnLCB0aGlzLm9uQWNsU3RyZWFtRW5jcnlwdEJpbmRlZCk7XG4gICAgdGhpcy5fYWNsU3RyZWFtLnJlbW92ZUxpc3RlbmVyKFxuICAgICAgJ2VuY3J5cHRGYWlsJyxcbiAgICAgIHRoaXMub25BY2xTdHJlYW1FbmNyeXB0RmFpbEJpbmRlZFxuICAgICk7XG4gICAgdGhpcy5fYWNsU3RyZWFtLnJlbW92ZUxpc3RlbmVyKCdlbmQnLCB0aGlzLm9uQWNsU3RyZWFtRW5kQmluZGVkKTtcbiAgfVxuXG4gIHdyaXRlQXR0KGRhdGEpIHtcbiAgICBkZWJ1Zyh0aGlzLl9hZGRyZXNzICsgJzogd3JpdGU6ICcgKyBkYXRhLnRvU3RyaW5nKCdoZXgnKSk7XG5cbiAgICB0aGlzLl9hY2xTdHJlYW0ud3JpdGUoQVRUX0NJRCwgZGF0YSk7XG4gIH1cblxuICBlcnJvclJlc3BvbnNlKG9wY29kZSwgaGFuZGxlLCBzdGF0dXMpIHtcbiAgICBsZXQgYnVmID0gQnVmZmVyLmFsbG9jKDUpO1xuXG4gICAgYnVmLndyaXRlVUludDgoQVRUX09QX0VSUk9SLCAwKTtcbiAgICBidWYud3JpdGVVSW50OChvcGNvZGUsIDEpO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKGhhbmRsZSwgMik7XG4gICAgYnVmLndyaXRlVUludDgoc3RhdHVzLCA0KTtcblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICBfcXVldWVDb21tYW5kKGJ1ZmZlciwgY2FsbGJhY2ssIHdyaXRlQ2FsbGJhY2spIHtcbiAgICB0aGlzLl9jb21tYW5kUXVldWUucHVzaCh7XG4gICAgICBidWZmZXI6IGJ1ZmZlcixcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICAgIHdyaXRlQ2FsbGJhY2s6IHdyaXRlQ2FsbGJhY2ssXG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fY3VycmVudENvbW1hbmQgPT09IG51bGwpIHtcbiAgICAgIHdoaWxlICh0aGlzLl9jb21tYW5kUXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRDb21tYW5kID0gdGhpcy5fY29tbWFuZFF1ZXVlLnNoaWZ0KCk7XG5cbiAgICAgICAgdGhpcy53cml0ZUF0dCh0aGlzLl9jdXJyZW50Q29tbWFuZC5idWZmZXIpO1xuXG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50Q29tbWFuZC5jYWxsYmFjaykge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2N1cnJlbnRDb21tYW5kLndyaXRlQ2FsbGJhY2spIHtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50Q29tbWFuZC53cml0ZUNhbGxiYWNrKCk7XG5cbiAgICAgICAgICB0aGlzLl9jdXJyZW50Q29tbWFuZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBtdHVSZXF1ZXN0KG10dSkge1xuICAgIGxldCBidWYgPSBCdWZmZXIuYWxsb2MoMyk7XG5cbiAgICBidWYud3JpdGVVSW50OChBVFRfT1BfTVRVX1JFUSwgMCk7XG4gICAgYnVmLndyaXRlVUludDE2TEUobXR1LCAxKTtcblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICByZWFkQnlHcm91cFJlcXVlc3Qoc3RhcnRIYW5kbGUsIGVuZEhhbmRsZSwgZ3JvdXBVdWlkKSB7XG4gICAgbGV0IGJ1ZiA9IEJ1ZmZlci5hbGxvYyg3KTtcblxuICAgIGJ1Zi53cml0ZVVJbnQ4KEFUVF9PUF9SRUFEX0JZX0dST1VQX1JFUSwgMCk7XG4gICAgYnVmLndyaXRlVUludDE2TEUoc3RhcnRIYW5kbGUsIDEpO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKGVuZEhhbmRsZSwgMyk7XG4gICAgYnVmLndyaXRlVUludDE2TEUoZ3JvdXBVdWlkLCA1KTtcblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICByZWFkQnlUeXBlUmVxdWVzdChzdGFydEhhbmRsZSwgZW5kSGFuZGxlLCBncm91cFV1aWQpIHtcbiAgICBsZXQgYnVmID0gQnVmZmVyLmFsbG9jKDcpO1xuXG4gICAgYnVmLndyaXRlVUludDgoQVRUX09QX1JFQURfQllfVFlQRV9SRVEsIDApO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKHN0YXJ0SGFuZGxlLCAxKTtcbiAgICBidWYud3JpdGVVSW50MTZMRShlbmRIYW5kbGUsIDMpO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKGdyb3VwVXVpZCwgNSk7XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgcmVhZFJlcXVlc3QoaGFuZGxlKSB7XG4gICAgbGV0IGJ1ZiA9IEJ1ZmZlci5hbGxvYygzKTtcblxuICAgIGJ1Zi53cml0ZVVJbnQ4KEFUVF9PUF9SRUFEX1JFUSwgMCk7XG4gICAgYnVmLndyaXRlVUludDE2TEUoaGFuZGxlLCAxKTtcblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICByZWFkQmxvYlJlcXVlc3QoaGFuZGxlLCBvZmZzZXQpIHtcbiAgICBsZXQgYnVmID0gQnVmZmVyLmFsbG9jKDUpO1xuXG4gICAgYnVmLndyaXRlVUludDgoQVRUX09QX1JFQURfQkxPQl9SRVEsIDApO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKGhhbmRsZSwgMSk7XG4gICAgYnVmLndyaXRlVUludDE2TEUob2Zmc2V0LCAzKTtcblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICBmaW5kSW5mb1JlcXVlc3Qoc3RhcnRIYW5kbGUsIGVuZEhhbmRsZSkge1xuICAgIGxldCBidWYgPSBCdWZmZXIuYWxsb2MoNSk7XG5cbiAgICBidWYud3JpdGVVSW50OChBVFRfT1BfRklORF9JTkZPX1JFUSwgMCk7XG4gICAgYnVmLndyaXRlVUludDE2TEUoc3RhcnRIYW5kbGUsIDEpO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKGVuZEhhbmRsZSwgMyk7XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgd3JpdGVSZXF1ZXN0KGhhbmRsZSwgZGF0YSwgd2l0aG91dFJlc3BvbnNlKSB7XG4gICAgbGV0IGJ1ZiA9IEJ1ZmZlci5hbGxvYygzICsgZGF0YS5sZW5ndGgpO1xuXG4gICAgYnVmLndyaXRlVUludDgod2l0aG91dFJlc3BvbnNlID8gQVRUX09QX1dSSVRFX0NNRCA6IEFUVF9PUF9XUklURV9SRVEsIDApO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKGhhbmRsZSwgMSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1Zi53cml0ZVVJbnQ4KGRhdGEucmVhZFVJbnQ4KGkpLCBpICsgMyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuXG4gIHByZXBhcmVXcml0ZVJlcXVlc3QoaGFuZGxlLCBvZmZzZXQsIGRhdGEpIHtcbiAgICBsZXQgYnVmID0gQnVmZmVyLmFsbG9jKDUgKyBkYXRhLmxlbmd0aCk7XG5cbiAgICBidWYud3JpdGVVSW50OChBVFRfT1BfUFJFUEFSRV9XUklURV9SRVEsIDApO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKGhhbmRsZSwgMSk7XG4gICAgYnVmLndyaXRlVUludDE2TEUob2Zmc2V0LCAzKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgYnVmLndyaXRlVUludDgoZGF0YS5yZWFkVUludDgoaSksIGkgKyA1KTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgZXhlY3V0ZVdyaXRlUmVxdWVzdChoYW5kbGUsIGNhbmNlbFByZXBhcmVkV3JpdGVzKSB7XG4gICAgbGV0IGJ1ZiA9IEJ1ZmZlci5hbGxvYygyKTtcblxuICAgIGJ1Zi53cml0ZVVJbnQ4KEFUVF9PUF9FWEVDVVRFX1dSSVRFX1JFUSwgMCk7XG4gICAgYnVmLndyaXRlVUludDgoY2FuY2VsUHJlcGFyZWRXcml0ZXMgPyAwIDogMSwgMSk7XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgaGFuZGxlQ29uZmlybWF0aW9uKCkge1xuICAgIGxldCBidWYgPSBCdWZmZXIuYWxsb2MoMSk7XG5cbiAgICBidWYud3JpdGVVSW50OChBVFRfT1BfSEFORExFX0NORiwgMCk7XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgZXhjaGFuZ2VNdHUobXR1KSB7XG4gICAgdGhpcy5fcXVldWVDb21tYW5kKFxuICAgICAgdGhpcy5tdHVSZXF1ZXN0KG10dSksXG4gICAgICBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGxldCBvcGNvZGUgPSBkYXRhWzBdO1xuXG4gICAgICAgIGlmIChvcGNvZGUgPT09IEFUVF9PUF9NVFVfUkVTUCkge1xuICAgICAgICAgIGxldCBuZXdNdHUgPSBkYXRhLnJlYWRVSW50MTZMRSgxKTtcblxuICAgICAgICAgIGRlYnVnKHRoaXMuX2FkZHJlc3MgKyAnOiBuZXcgTVRVIGlzICcgKyBuZXdNdHUpO1xuXG4gICAgICAgICAgdGhpcy5fbXR1ID0gbmV3TXR1O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbWl0KCdtdHUnLCB0aGlzLl9hZGRyZXNzLCB0aGlzLl9tdHUpO1xuICAgICAgfS5iaW5kKHRoaXMpXG4gICAgKTtcbiAgfVxuXG4gIGRpc2NvdmVyU2VydmljZXModXVpZHMpIHtcbiAgICBsZXQgc2VydmljZXMgPSBbXTtcblxuICAgIGxldCBjYWxsYmFjayA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGxldCBvcGNvZGUgPSBkYXRhWzBdO1xuICAgICAgbGV0IGkgPSAwO1xuXG4gICAgICBpZiAob3Bjb2RlID09PSBBVFRfT1BfUkVBRF9CWV9HUk9VUF9SRVNQKSB7XG4gICAgICAgIGxldCB0eXBlID0gZGF0YVsxXTtcbiAgICAgICAgbGV0IG51bSA9IChkYXRhLmxlbmd0aCAtIDIpIC8gdHlwZTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcbiAgICAgICAgICBzZXJ2aWNlcy5wdXNoKHtcbiAgICAgICAgICAgIHN0YXJ0SGFuZGxlOiBkYXRhLnJlYWRVSW50MTZMRSgyICsgaSAqIHR5cGUgKyAwKSxcbiAgICAgICAgICAgIGVuZEhhbmRsZTogZGF0YS5yZWFkVUludDE2TEUoMiArIGkgKiB0eXBlICsgMiksXG4gICAgICAgICAgICB1dWlkOlxuICAgICAgICAgICAgICB0eXBlID09IDZcbiAgICAgICAgICAgICAgICA/IGRhdGEucmVhZFVJbnQxNkxFKDIgKyBpICogdHlwZSArIDQpLnRvU3RyaW5nKDE2KVxuICAgICAgICAgICAgICAgIDogZGF0YVxuICAgICAgICAgICAgICAgICAgICAuc2xpY2UoMiArIGkgKiB0eXBlICsgNClcbiAgICAgICAgICAgICAgICAgICAgLnNsaWNlKDAsIDE2KVxuICAgICAgICAgICAgICAgICAgICAudG9TdHJpbmcoJ2hleCcpXG4gICAgICAgICAgICAgICAgICAgIC5tYXRjaCgvLnsxLDJ9L2cpXG4gICAgICAgICAgICAgICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgICAgICAgICAgICAgLmpvaW4oJycpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgb3Bjb2RlICE9PSBBVFRfT1BfUkVBRF9CWV9HUk9VUF9SRVNQIHx8XG4gICAgICAgIHNlcnZpY2VzW3NlcnZpY2VzLmxlbmd0aCAtIDFdLmVuZEhhbmRsZSA9PT0gMHhmZmZmXG4gICAgICApIHtcbiAgICAgICAgbGV0IHNlcnZpY2VVdWlkcyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc2VydmljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAodXVpZHMubGVuZ3RoID09PSAwIHx8IHV1aWRzLmluZGV4T2Yoc2VydmljZXNbaV0udXVpZCkgIT09IC0xKSB7XG4gICAgICAgICAgICBzZXJ2aWNlVXVpZHMucHVzaChzZXJ2aWNlc1tpXS51dWlkKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9zZXJ2aWNlc1tzZXJ2aWNlc1tpXS51dWlkXSA9IHNlcnZpY2VzW2ldO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdCgnc2VydmljZXNEaXNjb3ZlcicsIHRoaXMuX2FkZHJlc3MsIHNlcnZpY2VVdWlkcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICAgICAgdGhpcy5yZWFkQnlHcm91cFJlcXVlc3QoXG4gICAgICAgICAgICBzZXJ2aWNlc1tzZXJ2aWNlcy5sZW5ndGggLSAxXS5lbmRIYW5kbGUgKyAxLFxuICAgICAgICAgICAgMHhmZmZmLFxuICAgICAgICAgICAgR0FUVF9QUklNX1NWQ19VVUlEXG4gICAgICAgICAgKSxcbiAgICAgICAgICBjYWxsYmFja1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX3F1ZXVlQ29tbWFuZChcbiAgICAgIHRoaXMucmVhZEJ5R3JvdXBSZXF1ZXN0KDB4MDAwMSwgMHhmZmZmLCBHQVRUX1BSSU1fU1ZDX1VVSUQpLFxuICAgICAgY2FsbGJhY2tcbiAgICApO1xuICB9XG5cbiAgZGlzY292ZXJJbmNsdWRlZFNlcnZpY2VzKHNlcnZpY2VVdWlkLCB1dWlkcykge1xuICAgIGxldCBzZXJ2aWNlID0gdGhpcy5fc2VydmljZXNbc2VydmljZVV1aWRdO1xuICAgIGxldCBpbmNsdWRlZFNlcnZpY2VzID0gW107XG5cbiAgICBsZXQgY2FsbGJhY2sgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBsZXQgb3Bjb2RlID0gZGF0YVswXTtcbiAgICAgIGxldCBpID0gMDtcblxuICAgICAgaWYgKG9wY29kZSA9PT0gQVRUX09QX1JFQURfQllfVFlQRV9SRVNQKSB7XG4gICAgICAgIGxldCB0eXBlID0gZGF0YVsxXTtcbiAgICAgICAgbGV0IG51bSA9IChkYXRhLmxlbmd0aCAtIDIpIC8gdHlwZTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcbiAgICAgICAgICBpbmNsdWRlZFNlcnZpY2VzLnB1c2goe1xuICAgICAgICAgICAgZW5kSGFuZGxlOiBkYXRhLnJlYWRVSW50MTZMRSgyICsgaSAqIHR5cGUgKyAwKSxcbiAgICAgICAgICAgIHN0YXJ0SGFuZGxlOiBkYXRhLnJlYWRVSW50MTZMRSgyICsgaSAqIHR5cGUgKyAyKSxcbiAgICAgICAgICAgIHV1aWQ6XG4gICAgICAgICAgICAgIHR5cGUgPT0gOFxuICAgICAgICAgICAgICAgID8gZGF0YS5yZWFkVUludDE2TEUoMiArIGkgKiB0eXBlICsgNikudG9TdHJpbmcoMTYpXG4gICAgICAgICAgICAgICAgOiBkYXRhXG4gICAgICAgICAgICAgICAgICAgIC5zbGljZSgyICsgaSAqIHR5cGUgKyA2KVxuICAgICAgICAgICAgICAgICAgICAuc2xpY2UoMCwgMTYpXG4gICAgICAgICAgICAgICAgICAgIC50b1N0cmluZygnaGV4JylcbiAgICAgICAgICAgICAgICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgICAgICAgICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgICAgICAgICAgICAuam9pbignJyksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICBvcGNvZGUgIT09IEFUVF9PUF9SRUFEX0JZX1RZUEVfUkVTUCB8fFxuICAgICAgICBpbmNsdWRlZFNlcnZpY2VzW2luY2x1ZGVkU2VydmljZXMubGVuZ3RoIC0gMV0uZW5kSGFuZGxlID09PVxuICAgICAgICAgIHNlcnZpY2UuZW5kSGFuZGxlXG4gICAgICApIHtcbiAgICAgICAgbGV0IGluY2x1ZGVkU2VydmljZVV1aWRzID0gW107XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGluY2x1ZGVkU2VydmljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB1dWlkcy5sZW5ndGggPT09IDAgfHxcbiAgICAgICAgICAgIHV1aWRzLmluZGV4T2YoaW5jbHVkZWRTZXJ2aWNlc1tpXS51dWlkKSAhPT0gLTFcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGluY2x1ZGVkU2VydmljZVV1aWRzLnB1c2goaW5jbHVkZWRTZXJ2aWNlc1tpXS51dWlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVtaXQoXG4gICAgICAgICAgJ2luY2x1ZGVkU2VydmljZXNEaXNjb3ZlcicsXG4gICAgICAgICAgdGhpcy5fYWRkcmVzcyxcbiAgICAgICAgICBzZXJ2aWNlLnV1aWQsXG4gICAgICAgICAgaW5jbHVkZWRTZXJ2aWNlVXVpZHNcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3F1ZXVlQ29tbWFuZChcbiAgICAgICAgICB0aGlzLnJlYWRCeVR5cGVSZXF1ZXN0KFxuICAgICAgICAgICAgaW5jbHVkZWRTZXJ2aWNlc1tpbmNsdWRlZFNlcnZpY2VzLmxlbmd0aCAtIDFdLmVuZEhhbmRsZSArIDEsXG4gICAgICAgICAgICBzZXJ2aWNlLmVuZEhhbmRsZSxcbiAgICAgICAgICAgIEdBVFRfSU5DTFVERV9VVUlEXG4gICAgICAgICAgKSxcbiAgICAgICAgICBjYWxsYmFja1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX3F1ZXVlQ29tbWFuZChcbiAgICAgIHRoaXMucmVhZEJ5VHlwZVJlcXVlc3QoXG4gICAgICAgIHNlcnZpY2Uuc3RhcnRIYW5kbGUsXG4gICAgICAgIHNlcnZpY2UuZW5kSGFuZGxlLFxuICAgICAgICBHQVRUX0lOQ0xVREVfVVVJRFxuICAgICAgKSxcbiAgICAgIGNhbGxiYWNrXG4gICAgKTtcbiAgfVxuXG4gIGRpc2NvdmVyQ2hhcmFjdGVyaXN0aWNzKHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY1V1aWRzKSB7XG4gICAgbGV0IHNlcnZpY2UgPSB0aGlzLl9zZXJ2aWNlc1tzZXJ2aWNlVXVpZF07XG4gICAgbGV0IGNoYXJhY3RlcmlzdGljcyA9IFtdO1xuXG4gICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzW3NlcnZpY2VVdWlkXSA9XG4gICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3Nbc2VydmljZVV1aWRdIHx8IHt9O1xuICAgIHRoaXMuX2Rlc2NyaXB0b3JzW3NlcnZpY2VVdWlkXSA9IHRoaXMuX2Rlc2NyaXB0b3JzW3NlcnZpY2VVdWlkXSB8fCB7fTtcblxuICAgIGxldCBjYWxsYmFjayA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGxldCBvcGNvZGUgPSBkYXRhWzBdO1xuICAgICAgbGV0IGkgPSAwO1xuXG4gICAgICBpZiAob3Bjb2RlID09PSBBVFRfT1BfUkVBRF9CWV9UWVBFX1JFU1ApIHtcbiAgICAgICAgbGV0IHR5cGUgPSBkYXRhWzFdO1xuICAgICAgICBsZXQgbnVtID0gKGRhdGEubGVuZ3RoIC0gMikgLyB0eXBlO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBudW07IGkrKykge1xuICAgICAgICAgIGNoYXJhY3RlcmlzdGljcy5wdXNoKHtcbiAgICAgICAgICAgIHN0YXJ0SGFuZGxlOiBkYXRhLnJlYWRVSW50MTZMRSgyICsgaSAqIHR5cGUgKyAwKSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IGRhdGEucmVhZFVJbnQ4KDIgKyBpICogdHlwZSArIDIpLFxuICAgICAgICAgICAgdmFsdWVIYW5kbGU6IGRhdGEucmVhZFVJbnQxNkxFKDIgKyBpICogdHlwZSArIDMpLFxuICAgICAgICAgICAgdXVpZDpcbiAgICAgICAgICAgICAgdHlwZSA9PSA3XG4gICAgICAgICAgICAgICAgPyBkYXRhLnJlYWRVSW50MTZMRSgyICsgaSAqIHR5cGUgKyA1KS50b1N0cmluZygxNilcbiAgICAgICAgICAgICAgICA6IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgLnNsaWNlKDIgKyBpICogdHlwZSArIDUpXG4gICAgICAgICAgICAgICAgICAgIC5zbGljZSgwLCAxNilcbiAgICAgICAgICAgICAgICAgICAgLnRvU3RyaW5nKCdoZXgnKVxuICAgICAgICAgICAgICAgICAgICAubWF0Y2goLy57MSwyfS9nKVxuICAgICAgICAgICAgICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKCcnKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIG9wY29kZSAhPT0gQVRUX09QX1JFQURfQllfVFlQRV9SRVNQIHx8XG4gICAgICAgIGNoYXJhY3RlcmlzdGljc1tjaGFyYWN0ZXJpc3RpY3MubGVuZ3RoIC0gMV0udmFsdWVIYW5kbGUgPT09XG4gICAgICAgICAgc2VydmljZS5lbmRIYW5kbGVcbiAgICAgICkge1xuICAgICAgICBsZXQgY2hhcmFjdGVyaXN0aWNzRGlzY292ZXJlZCA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2hhcmFjdGVyaXN0aWNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBjaGFyYWN0ZXJpc3RpY3NbaV0ucHJvcGVydGllcztcblxuICAgICAgICAgIGxldCBjaGFyYWN0ZXJpc3RpYyA9IHtcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IFtdLFxuICAgICAgICAgICAgdXVpZDogY2hhcmFjdGVyaXN0aWNzW2ldLnV1aWQsXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmIChpICE9PSAwKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3NbaSAtIDFdLmVuZEhhbmRsZSA9XG4gICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljc1tpXS5zdGFydEhhbmRsZSAtIDE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGkgPT09IGNoYXJhY3RlcmlzdGljcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3NbaV0uZW5kSGFuZGxlID0gc2VydmljZS5lbmRIYW5kbGU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzW3NlcnZpY2VVdWlkXVtjaGFyYWN0ZXJpc3RpY3NbaV0udXVpZF0gPVxuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNzW2ldO1xuXG4gICAgICAgICAgaWYgKHByb3BlcnRpZXMgJiAweDAxKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpYy5wcm9wZXJ0aWVzLnB1c2goJ2Jyb2FkY2FzdCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChwcm9wZXJ0aWVzICYgMHgwMikge1xuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWMucHJvcGVydGllcy5wdXNoKCdyZWFkJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHByb3BlcnRpZXMgJiAweDA0KSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpYy5wcm9wZXJ0aWVzLnB1c2goJ3dyaXRlV2l0aG91dFJlc3BvbnNlJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHByb3BlcnRpZXMgJiAweDA4KSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpYy5wcm9wZXJ0aWVzLnB1c2goJ3dyaXRlJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHByb3BlcnRpZXMgJiAweDEwKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpYy5wcm9wZXJ0aWVzLnB1c2goJ25vdGlmeScpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChwcm9wZXJ0aWVzICYgMHgyMCkge1xuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWMucHJvcGVydGllcy5wdXNoKCdpbmRpY2F0ZScpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChwcm9wZXJ0aWVzICYgMHg0MCkge1xuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWMucHJvcGVydGllcy5wdXNoKCdhdXRoZW50aWNhdGVkU2lnbmVkV3JpdGVzJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHByb3BlcnRpZXMgJiAweDgwKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpYy5wcm9wZXJ0aWVzLnB1c2goJ2V4dGVuZGVkUHJvcGVydGllcycpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljVXVpZHMubGVuZ3RoID09PSAwIHx8XG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY1V1aWRzLmluZGV4T2YoY2hhcmFjdGVyaXN0aWMudXVpZCkgIT09IC0xXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3NEaXNjb3ZlcmVkLnB1c2goY2hhcmFjdGVyaXN0aWMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgICAnY2hhcmFjdGVyaXN0aWNzRGlzY292ZXInLFxuICAgICAgICAgIHRoaXMuX2FkZHJlc3MsXG4gICAgICAgICAgc2VydmljZVV1aWQsXG4gICAgICAgICAgY2hhcmFjdGVyaXN0aWNzRGlzY292ZXJlZFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcXVldWVDb21tYW5kKFxuICAgICAgICAgIHRoaXMucmVhZEJ5VHlwZVJlcXVlc3QoXG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3NbY2hhcmFjdGVyaXN0aWNzLmxlbmd0aCAtIDFdLnZhbHVlSGFuZGxlICsgMSxcbiAgICAgICAgICAgIHNlcnZpY2UuZW5kSGFuZGxlLFxuICAgICAgICAgICAgR0FUVF9DSEFSQUNfVVVJRFxuICAgICAgICAgICksXG4gICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICB0aGlzLnJlYWRCeVR5cGVSZXF1ZXN0KFxuICAgICAgICBzZXJ2aWNlLnN0YXJ0SGFuZGxlLFxuICAgICAgICBzZXJ2aWNlLmVuZEhhbmRsZSxcbiAgICAgICAgR0FUVF9DSEFSQUNfVVVJRFxuICAgICAgKSxcbiAgICAgIGNhbGxiYWNrXG4gICAgKTtcbiAgfVxuXG4gIHJlYWQoc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCkge1xuICAgIGlmIChcbiAgICAgICF0aGlzLl9jaGFyYWN0ZXJpc3RpY3Nbc2VydmljZVV1aWRdIHx8XG4gICAgICAhdGhpcy5fY2hhcmFjdGVyaXN0aWNzW3NlcnZpY2VVdWlkXVtjaGFyYWN0ZXJpc3RpY1V1aWRdXG4gICAgKSB7XG4gICAgICB0aGlzLmVtaXQoXG4gICAgICAgICdyZWFkJyxcbiAgICAgICAgdGhpcy5fYWRkcmVzcyxcbiAgICAgICAgc2VydmljZVV1aWQsXG4gICAgICAgIGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICAgICAgQnVmZmVyLmFsbG9jKDApLFxuICAgICAgICBmYWxzZVxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY2hhcmFjdGVyaXN0aWMgPSB0aGlzLl9jaGFyYWN0ZXJpc3RpY3Nbc2VydmljZVV1aWRdW2NoYXJhY3RlcmlzdGljVXVpZF07XG5cbiAgICBsZXQgcmVhZERhdGEgPSBCdWZmZXIuYWxsb2MoMCk7XG5cbiAgICBsZXQgY2FsbGJhY2sgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBsZXQgb3Bjb2RlID0gZGF0YVswXTtcblxuICAgICAgaWYgKG9wY29kZSA9PT0gQVRUX09QX1JFQURfUkVTUCB8fCBvcGNvZGUgPT09IEFUVF9PUF9SRUFEX0JMT0JfUkVTUCkge1xuICAgICAgICByZWFkRGF0YSA9IEJ1ZmZlci5mcm9tKFxuICAgICAgICAgIHJlYWREYXRhLnRvU3RyaW5nKCdoZXgnKSArIGRhdGEuc2xpY2UoMSkudG9TdHJpbmcoJ2hleCcpLFxuICAgICAgICAgICdoZXgnXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID09PSB0aGlzLl9tdHUpIHtcbiAgICAgICAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICAgICAgICB0aGlzLnJlYWRCbG9iUmVxdWVzdChjaGFyYWN0ZXJpc3RpYy52YWx1ZUhhbmRsZSwgcmVhZERhdGEubGVuZ3RoKSxcbiAgICAgICAgICAgIGNhbGxiYWNrXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVtaXQoXG4gICAgICAgICAgICAncmVhZCcsXG4gICAgICAgICAgICB0aGlzLl9hZGRyZXNzLFxuICAgICAgICAgICAgc2VydmljZVV1aWQsXG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgICAgICAgICByZWFkRGF0YSxcbiAgICAgICAgICAgIHRydWVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG9wY29kZSA9PT0gQVRUX09QX0VSUk9SKSB7XG4gICAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgICAncmVhZCcsXG4gICAgICAgICAgdGhpcy5fYWRkcmVzcyxcbiAgICAgICAgICBzZXJ2aWNlVXVpZCxcbiAgICAgICAgICBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgICAgICAgQnVmZmVyLmFsbG9jKDApLFxuICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVtaXQoXG4gICAgICAgICAgJ3JlYWQnLFxuICAgICAgICAgIHRoaXMuX2FkZHJlc3MsXG4gICAgICAgICAgc2VydmljZVV1aWQsXG4gICAgICAgICAgY2hhcmFjdGVyaXN0aWNVdWlkLFxuICAgICAgICAgIHJlYWREYXRhLFxuICAgICAgICAgIHRydWVcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9xdWV1ZUNvbW1hbmQodGhpcy5yZWFkUmVxdWVzdChjaGFyYWN0ZXJpc3RpYy52YWx1ZUhhbmRsZSksIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHdyaXRlKHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY1V1aWQsIGRhdGEsIHdpdGhvdXRSZXNwb25zZSkge1xuICAgIGlmIChcbiAgICAgICF0aGlzLl9jaGFyYWN0ZXJpc3RpY3Nbc2VydmljZVV1aWRdIHx8XG4gICAgICAhdGhpcy5fY2hhcmFjdGVyaXN0aWNzW3NlcnZpY2VVdWlkXVtjaGFyYWN0ZXJpc3RpY1V1aWRdXG4gICAgKSB7XG4gICAgICB0aGlzLmVtaXQoJ3dyaXRlJywgdGhpcy5fYWRkcmVzcywgc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCwgZmFsc2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBjaGFyYWN0ZXJpc3RpYyA9IHRoaXMuX2NoYXJhY3RlcmlzdGljc1tzZXJ2aWNlVXVpZF1bY2hhcmFjdGVyaXN0aWNVdWlkXTtcbiAgICBpZiAod2l0aG91dFJlc3BvbnNlKSB7XG4gICAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICAgIHRoaXMud3JpdGVSZXF1ZXN0KGNoYXJhY3RlcmlzdGljLnZhbHVlSGFuZGxlLCBkYXRhLCB0cnVlKSxcbiAgICAgICAgbnVsbCxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCd3cml0ZScsIHRoaXMuX2FkZHJlc3MsIHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY1V1aWQpO1xuICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChkYXRhLmxlbmd0aCArIDMgPiB0aGlzLl9tdHUpIHtcbiAgICAgIHJldHVybiB0aGlzLmxvbmdXcml0ZShcbiAgICAgICAgc2VydmljZVV1aWQsXG4gICAgICAgIGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgd2l0aG91dFJlc3BvbnNlXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICAgIHRoaXMud3JpdGVSZXF1ZXN0KGNoYXJhY3RlcmlzdGljLnZhbHVlSGFuZGxlLCBkYXRhLCBmYWxzZSksXG4gICAgICAgIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICBsZXQgb3Bjb2RlID0gZGF0YVswXTtcblxuICAgICAgICAgIGlmIChvcGNvZGUgPT09IEFUVF9PUF9XUklURV9SRVNQIHx8IG9wY29kZSA9PT0gQVRUX09QX0VSUk9SKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoXG4gICAgICAgICAgICAgICd3cml0ZScsXG4gICAgICAgICAgICAgIHRoaXMuX2FkZHJlc3MsXG4gICAgICAgICAgICAgIHNlcnZpY2VVdWlkLFxuICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgICAgICAgICAgIG9wY29kZSA9PT0gQVRUX09QX1dSSVRFX1JFU1BcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyogUGVyZm9ybSBhIFwibG9uZyB3cml0ZVwiIGFzIGRlc2NyaWJlZCBCbHVldG9vdGggU3BlYyBzZWN0aW9uIDQuOS40IFwiV3JpdGUgTG9uZyBDaGFyYWN0ZXJpc3RpYyBWYWx1ZXNcIiAqL1xuICBsb25nV3JpdGUoc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCwgZGF0YSwgd2l0aG91dFJlc3BvbnNlKSB7XG4gICAgbGV0IGNoYXJhY3RlcmlzdGljID0gdGhpcy5fY2hhcmFjdGVyaXN0aWNzW3NlcnZpY2VVdWlkXVtjaGFyYWN0ZXJpc3RpY1V1aWRdO1xuICAgIGxldCBsaW1pdCA9IHRoaXMuX210dSAtIDU7XG5cbiAgICBsZXQgcHJlcGFyZVdyaXRlQ2FsbGJhY2sgPSBmdW5jdGlvbihkYXRhX2NodW5rKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24ocmVzcCkge1xuICAgICAgICBsZXQgb3Bjb2RlID0gcmVzcFswXTtcblxuICAgICAgICBpZiAob3Bjb2RlICE9IEFUVF9PUF9QUkVQQVJFX1dSSVRFX1JFU1ApIHtcbiAgICAgICAgICBkZWJ1ZyhcbiAgICAgICAgICAgIHRoaXMuX2FkZHJlc3MgK1xuICAgICAgICAgICAgICAnOiB1bmV4cGVjdGVkIHJlcGx5IG9wY29kZSAlZCAoZXhwZWN0aW5nIEFUVF9PUF9QUkVQQVJFX1dSSVRFX1JFU1ApJyxcbiAgICAgICAgICAgIG9wY29kZVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IGV4cGVjdGVkX2xlbmd0aCA9IGRhdGFfY2h1bmsubGVuZ3RoICsgNTtcblxuICAgICAgICAgIGlmIChyZXNwLmxlbmd0aCAhPT0gZXhwZWN0ZWRfbGVuZ3RoKSB7XG4gICAgICAgICAgICAvKiB0aGUgcmVzcG9uc2Ugc2hvdWxkIGNvbnRhaW4gdGhlIGRhdGEgcGFja2V0IGVjaG9lZCBiYWNrIHRvIHRoZSBjYWxsZXIgKi9cbiAgICAgICAgICAgIGRlYnVnKFxuICAgICAgICAgICAgICB0aGlzLl9hZGRyZXNzICtcbiAgICAgICAgICAgICAgICAnOiB1bmV4cGVjdGVkIHByZXBhcmVXcml0ZVJlc3BvbnNlIGxlbmd0aCAlZCAoZXhwZWN0aW5nICVkKScsXG4gICAgICAgICAgICAgIHJlc3AubGVuZ3RoLFxuICAgICAgICAgICAgICBleHBlY3RlZF9sZW5ndGhcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcyk7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgLyogc3BsaXQgaW50byBwcmVwYXJlLXdyaXRlIGNodW5rcyBhbmQgcXVldWUgdGhlbSAqL1xuICAgIGxldCBvZmZzZXQgPSAwO1xuXG4gICAgd2hpbGUgKG9mZnNldCA8IGRhdGEubGVuZ3RoKSB7XG4gICAgICBsZXQgZW5kID0gb2Zmc2V0ICsgbGltaXQ7XG4gICAgICBsZXQgY2h1bmsgPSBkYXRhLnNsaWNlKG9mZnNldCwgZW5kKTtcbiAgICAgIHRoaXMuX3F1ZXVlQ29tbWFuZChcbiAgICAgICAgdGhpcy5wcmVwYXJlV3JpdGVSZXF1ZXN0KGNoYXJhY3RlcmlzdGljLnZhbHVlSGFuZGxlLCBvZmZzZXQsIGNodW5rKSxcbiAgICAgICAgcHJlcGFyZVdyaXRlQ2FsbGJhY2soY2h1bmspXG4gICAgICApO1xuICAgICAgb2Zmc2V0ID0gZW5kO1xuICAgIH1cblxuICAgIC8qIHF1ZXVlIHRoZSBleGVjdXRlIGNvbW1hbmQgd2l0aCBhIGNhbGxiYWNrIHRvIGVtaXQgdGhlIHdyaXRlIHNpZ25hbCB3aGVuIGRvbmUgKi9cbiAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICB0aGlzLmV4ZWN1dGVXcml0ZVJlcXVlc3QoY2hhcmFjdGVyaXN0aWMudmFsdWVIYW5kbGUpLFxuICAgICAgZnVuY3Rpb24ocmVzcCkge1xuICAgICAgICBsZXQgb3Bjb2RlID0gcmVzcFswXTtcblxuICAgICAgICBpZiAob3Bjb2RlID09PSBBVFRfT1BfRVhFQ1VURV9XUklURV9SRVNQICYmICF3aXRob3V0UmVzcG9uc2UpIHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ3dyaXRlJywgdGhpcy5fYWRkcmVzcywgc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCk7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKVxuICAgICk7XG4gIH1cblxuICBicm9hZGNhc3Qoc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCwgYnJvYWRjYXN0KSB7XG4gICAgbGV0IGNoYXJhY3RlcmlzdGljID0gdGhpcy5fY2hhcmFjdGVyaXN0aWNzW3NlcnZpY2VVdWlkXVtjaGFyYWN0ZXJpc3RpY1V1aWRdO1xuXG4gICAgdGhpcy5fcXVldWVDb21tYW5kKFxuICAgICAgdGhpcy5yZWFkQnlUeXBlUmVxdWVzdChcbiAgICAgICAgY2hhcmFjdGVyaXN0aWMuc3RhcnRIYW5kbGUsXG4gICAgICAgIGNoYXJhY3RlcmlzdGljLmVuZEhhbmRsZSxcbiAgICAgICAgR0FUVF9TRVJWRVJfQ0hBUkFDX0NGR19VVUlEXG4gICAgICApLFxuICAgICAgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBsZXQgb3Bjb2RlID0gZGF0YVswXTtcbiAgICAgICAgaWYgKG9wY29kZSA9PT0gQVRUX09QX1JFQURfQllfVFlQRV9SRVNQKSB7XG4gICAgICAgICAgLy8gbGV0IHR5cGUgPSBkYXRhWzFdO1xuICAgICAgICAgIGxldCBoYW5kbGUgPSBkYXRhLnJlYWRVSW50MTZMRSgyKTtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBkYXRhLnJlYWRVSW50MTZMRSg0KTtcblxuICAgICAgICAgIGlmIChicm9hZGNhc3QpIHtcbiAgICAgICAgICAgIHZhbHVlIHw9IDB4MDAwMTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgJj0gMHhmZmZlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCB2YWx1ZUJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygyKTtcbiAgICAgICAgICB2YWx1ZUJ1ZmZlci53cml0ZVVJbnQxNkxFKHZhbHVlLCAwKTtcblxuICAgICAgICAgIHRoaXMuX3F1ZXVlQ29tbWFuZChcbiAgICAgICAgICAgIHRoaXMud3JpdGVSZXF1ZXN0KGhhbmRsZSwgdmFsdWVCdWZmZXIsIGZhbHNlKSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgbGV0IG9wY29kZSA9IGRhdGFbMF07XG5cbiAgICAgICAgICAgICAgaWYgKG9wY29kZSA9PT0gQVRUX09QX1dSSVRFX1JFU1ApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXG4gICAgICAgICAgICAgICAgICAnYnJvYWRjYXN0JyxcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZHJlc3MsXG4gICAgICAgICAgICAgICAgICBzZXJ2aWNlVXVpZCxcbiAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICAgICAgICAgICAgICAgIGJyb2FkY2FzdFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKVxuICAgICk7XG4gIH1cblxuICBub3RpZnkoc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCwgbm90aWZ5KSB7XG4gICAgbGV0IGNoYXJhY3RlcmlzdGljID0gdGhpcy5fY2hhcmFjdGVyaXN0aWNzW3NlcnZpY2VVdWlkXVtjaGFyYWN0ZXJpc3RpY1V1aWRdO1xuXG4gICAgdGhpcy5fcXVldWVDb21tYW5kKFxuICAgICAgdGhpcy5yZWFkQnlUeXBlUmVxdWVzdChcbiAgICAgICAgY2hhcmFjdGVyaXN0aWMuc3RhcnRIYW5kbGUsXG4gICAgICAgIGNoYXJhY3RlcmlzdGljLmVuZEhhbmRsZSxcbiAgICAgICAgR0FUVF9DTElFTlRfQ0hBUkFDX0NGR19VVUlEXG4gICAgICApLFxuICAgICAgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBsZXQgb3Bjb2RlID0gZGF0YVswXTtcbiAgICAgICAgaWYgKG9wY29kZSA9PT0gQVRUX09QX1JFQURfQllfVFlQRV9SRVNQKSB7XG4gICAgICAgICAgLy8gbGV0IHR5cGUgPSBkYXRhWzFdO1xuICAgICAgICAgIGxldCBoYW5kbGUgPSBkYXRhLnJlYWRVSW50MTZMRSgyKTtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBkYXRhLnJlYWRVSW50MTZMRSg0KTtcblxuICAgICAgICAgIGxldCB1c2VOb3RpZnkgPSBjaGFyYWN0ZXJpc3RpYy5wcm9wZXJ0aWVzICYgMHgxMDtcbiAgICAgICAgICBsZXQgdXNlSW5kaWNhdGUgPSBjaGFyYWN0ZXJpc3RpYy5wcm9wZXJ0aWVzICYgMHgyMDtcblxuICAgICAgICAgIGlmIChub3RpZnkpIHtcbiAgICAgICAgICAgIGlmICh1c2VOb3RpZnkpIHtcbiAgICAgICAgICAgICAgdmFsdWUgfD0gMHgwMDAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh1c2VJbmRpY2F0ZSkge1xuICAgICAgICAgICAgICB2YWx1ZSB8PSAweDAwMDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh1c2VOb3RpZnkpIHtcbiAgICAgICAgICAgICAgdmFsdWUgJj0gMHhmZmZlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh1c2VJbmRpY2F0ZSkge1xuICAgICAgICAgICAgICB2YWx1ZSAmPSAweGZmZmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IHZhbHVlQnVmZmVyID0gQnVmZmVyLmFsbG9jKDIpO1xuICAgICAgICAgIHZhbHVlQnVmZmVyLndyaXRlVUludDE2TEUodmFsdWUsIDApO1xuXG4gICAgICAgICAgdGhpcy5fcXVldWVDb21tYW5kKFxuICAgICAgICAgICAgdGhpcy53cml0ZVJlcXVlc3QoaGFuZGxlLCB2YWx1ZUJ1ZmZlciwgZmFsc2UpLFxuICAgICAgICAgICAgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICBsZXQgb3Bjb2RlID0gZGF0YVswXTtcbiAgICAgICAgICAgICAgZGVidWcoXG4gICAgICAgICAgICAgICAgJ3NldCBub3RpZnkgd3JpdGUgcmVzdWx0czogJyArIChvcGNvZGUgPT09IEFUVF9PUF9XUklURV9SRVNQKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAvLyBpZiAob3Bjb2RlID09PSBBVFRfT1BfV1JJVEVfUkVTUCkge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoXG4gICAgICAgICAgICAgICAgJ25vdGlmeScsXG4gICAgICAgICAgICAgICAgdGhpcy5fYWRkcmVzcyxcbiAgICAgICAgICAgICAgICBzZXJ2aWNlVXVpZCxcbiAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgICAgICAgICAgICAgbm90aWZ5XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKVxuICAgICk7XG4gIH1cblxuICBkaXNjb3ZlckRlc2NyaXB0b3JzKHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY1V1aWQpIHtcbiAgICBsZXQgY2hhcmFjdGVyaXN0aWMgPSB0aGlzLl9jaGFyYWN0ZXJpc3RpY3Nbc2VydmljZVV1aWRdW2NoYXJhY3RlcmlzdGljVXVpZF07XG4gICAgbGV0IGRlc2NyaXB0b3JzID0gW107XG5cbiAgICB0aGlzLl9kZXNjcmlwdG9yc1tzZXJ2aWNlVXVpZF1bY2hhcmFjdGVyaXN0aWNVdWlkXSA9IHt9O1xuXG4gICAgbGV0IGNhbGxiYWNrID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgbGV0IG9wY29kZSA9IGRhdGFbMF07XG4gICAgICBsZXQgaSA9IDA7XG5cbiAgICAgIGlmIChvcGNvZGUgPT09IEFUVF9PUF9GSU5EX0lORk9fUkVTUCkge1xuICAgICAgICBsZXQgbnVtID0gZGF0YVsxXTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcbiAgICAgICAgICBkZXNjcmlwdG9ycy5wdXNoKHtcbiAgICAgICAgICAgIGhhbmRsZTogZGF0YS5yZWFkVUludDE2TEUoMiArIGkgKiA0ICsgMCksXG4gICAgICAgICAgICB1dWlkOiBkYXRhLnJlYWRVSW50MTZMRSgyICsgaSAqIDQgKyAyKS50b1N0cmluZygxNiksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICBvcGNvZGUgIT09IEFUVF9PUF9GSU5EX0lORk9fUkVTUCB8fFxuICAgICAgICBkZXNjcmlwdG9yc1tkZXNjcmlwdG9ycy5sZW5ndGggLSAxXS5oYW5kbGUgPT09IGNoYXJhY3RlcmlzdGljLmVuZEhhbmRsZVxuICAgICAgKSB7XG4gICAgICAgIGxldCBkZXNjcmlwdG9yVXVpZHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGRlc2NyaXB0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZGVzY3JpcHRvclV1aWRzLnB1c2goZGVzY3JpcHRvcnNbaV0udXVpZCk7XG5cbiAgICAgICAgICB0aGlzLl9kZXNjcmlwdG9yc1tzZXJ2aWNlVXVpZF1bY2hhcmFjdGVyaXN0aWNVdWlkXVtcbiAgICAgICAgICAgIGRlc2NyaXB0b3JzW2ldLnV1aWRcbiAgICAgICAgICBdID0gZGVzY3JpcHRvcnNbaV07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVtaXQoXG4gICAgICAgICAgJ2Rlc2NyaXB0b3JzRGlzY292ZXInLFxuICAgICAgICAgIHRoaXMuX2FkZHJlc3MsXG4gICAgICAgICAgc2VydmljZVV1aWQsXG4gICAgICAgICAgY2hhcmFjdGVyaXN0aWNVdWlkLFxuICAgICAgICAgIGRlc2NyaXB0b3JVdWlkc1xuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcXVldWVDb21tYW5kKFxuICAgICAgICAgIHRoaXMuZmluZEluZm9SZXF1ZXN0KFxuICAgICAgICAgICAgZGVzY3JpcHRvcnNbZGVzY3JpcHRvcnMubGVuZ3RoIC0gMV0uaGFuZGxlICsgMSxcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljLmVuZEhhbmRsZVxuICAgICAgICAgICksXG4gICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICB0aGlzLmZpbmRJbmZvUmVxdWVzdChcbiAgICAgICAgY2hhcmFjdGVyaXN0aWMudmFsdWVIYW5kbGUgKyAxLFxuICAgICAgICBjaGFyYWN0ZXJpc3RpYy5lbmRIYW5kbGVcbiAgICAgICksXG4gICAgICBjYWxsYmFja1xuICAgICk7XG4gIH1cblxuICByZWFkVmFsdWUoc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCwgZGVzY3JpcHRvclV1aWQpIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5fZGVzY3JpcHRvcnNbc2VydmljZVV1aWRdIHx8XG4gICAgICAhdGhpcy5fZGVzY3JpcHRvcnNbc2VydmljZVV1aWRdW2NoYXJhY3RlcmlzdGljVXVpZF0gfHxcbiAgICAgICF0aGlzLl9kZXNjcmlwdG9yc1tzZXJ2aWNlVXVpZF1bY2hhcmFjdGVyaXN0aWNVdWlkXVtkZXNjcmlwdG9yVXVpZF1cbiAgICApIHtcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgJ3ZhbHVlUmVhZCcsXG4gICAgICAgIHRoaXMuX2FkZHJlc3MsXG4gICAgICAgIHNlcnZpY2VVdWlkLFxuICAgICAgICBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgICAgIGRlc2NyaXB0b3JVdWlkLFxuICAgICAgICBCdWZmZXIuYWxsb2MoMCksXG4gICAgICAgIGZhbHNlXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBkZXNjcmlwdG9yID0gdGhpcy5fZGVzY3JpcHRvcnNbc2VydmljZVV1aWRdW2NoYXJhY3RlcmlzdGljVXVpZF1bXG4gICAgICBkZXNjcmlwdG9yVXVpZFxuICAgIF07XG5cbiAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICB0aGlzLnJlYWRSZXF1ZXN0KGRlc2NyaXB0b3IuaGFuZGxlKSxcbiAgICAgIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgbGV0IG9wY29kZSA9IGRhdGFbMF07XG5cbiAgICAgICAgaWYgKG9wY29kZSA9PT0gQVRUX09QX1JFQURfUkVTUCB8fCBvcGNvZGUgPT09IEFUVF9PUF9FUlJPUikge1xuICAgICAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgICAgICd2YWx1ZVJlYWQnLFxuICAgICAgICAgICAgdGhpcy5fYWRkcmVzcyxcbiAgICAgICAgICAgIHNlcnZpY2VVdWlkLFxuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNVdWlkLFxuICAgICAgICAgICAgZGVzY3JpcHRvclV1aWQsXG4gICAgICAgICAgICBkYXRhLnNsaWNlKDEpLFxuICAgICAgICAgICAgb3Bjb2RlID09PSBBVFRfT1BfUkVBRF9SRVNQXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpXG4gICAgKTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUoc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCwgZGVzY3JpcHRvclV1aWQsIGRhdGEpIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5fZGVzY3JpcHRvcnNbc2VydmljZVV1aWRdIHx8XG4gICAgICAhdGhpcy5fZGVzY3JpcHRvcnNbc2VydmljZVV1aWRdW2NoYXJhY3RlcmlzdGljVXVpZF0gfHxcbiAgICAgICF0aGlzLl9kZXNjcmlwdG9yc1tzZXJ2aWNlVXVpZF1bY2hhcmFjdGVyaXN0aWNVdWlkXVtkZXNjcmlwdG9yVXVpZF1cbiAgICApIHtcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgJ3ZhbHVlV3JpdGUnLFxuICAgICAgICB0aGlzLl9hZGRyZXNzLFxuICAgICAgICBzZXJ2aWNlVXVpZCxcbiAgICAgICAgY2hhcmFjdGVyaXN0aWNVdWlkLFxuICAgICAgICBkZXNjcmlwdG9yVXVpZCxcbiAgICAgICAgZmFsc2VcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGRlc2NyaXB0b3IgPSB0aGlzLl9kZXNjcmlwdG9yc1tzZXJ2aWNlVXVpZF1bY2hhcmFjdGVyaXN0aWNVdWlkXVtcbiAgICAgIGRlc2NyaXB0b3JVdWlkXG4gICAgXTtcblxuICAgIHRoaXMuX3F1ZXVlQ29tbWFuZChcbiAgICAgIHRoaXMud3JpdGVSZXF1ZXN0KGRlc2NyaXB0b3IuaGFuZGxlLCBkYXRhLCBmYWxzZSksXG4gICAgICBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGxldCBvcGNvZGUgPSBkYXRhWzBdO1xuXG4gICAgICAgIGlmIChvcGNvZGUgPT09IEFUVF9PUF9XUklURV9SRVNQIHx8IG9wY29kZSA9PT0gQVRUX09QX0VSUk9SKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAgICAgJ3ZhbHVlV3JpdGUnLFxuICAgICAgICAgICAgdGhpcy5fYWRkcmVzcyxcbiAgICAgICAgICAgIHNlcnZpY2VVdWlkLFxuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNVdWlkLFxuICAgICAgICAgICAgZGVzY3JpcHRvclV1aWQsXG4gICAgICAgICAgICBvcGNvZGUgPT09IEFUVF9PUF9XUklURV9SRVNQXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpXG4gICAgKTtcbiAgfVxuXG4gIHJlYWRIYW5kbGUoaGFuZGxlKSB7XG4gICAgdGhpcy5fcXVldWVDb21tYW5kKFxuICAgICAgdGhpcy5yZWFkUmVxdWVzdChoYW5kbGUpLFxuICAgICAgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBsZXQgb3Bjb2RlID0gZGF0YVswXTtcblxuICAgICAgICBpZiAob3Bjb2RlID09PSBBVFRfT1BfUkVBRF9SRVNQKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdoYW5kbGVSZWFkJywgdGhpcy5fYWRkcmVzcywgaGFuZGxlLCBkYXRhLnNsaWNlKDEpKTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpXG4gICAgKTtcbiAgfVxuXG4gIHdyaXRlSGFuZGxlKGhhbmRsZSwgZGF0YSwgd2l0aG91dFJlc3BvbnNlKSB7XG4gICAgaWYgKHdpdGhvdXRSZXNwb25zZSkge1xuICAgICAgdGhpcy5fcXVldWVDb21tYW5kKFxuICAgICAgICB0aGlzLndyaXRlUmVxdWVzdChoYW5kbGUsIGRhdGEsIHRydWUpLFxuICAgICAgICBudWxsLFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ2hhbmRsZVdyaXRlJywgdGhpcy5fYWRkcmVzcywgaGFuZGxlKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9xdWV1ZUNvbW1hbmQoXG4gICAgICAgIHRoaXMud3JpdGVSZXF1ZXN0KGhhbmRsZSwgZGF0YSwgZmFsc2UpLFxuICAgICAgICBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgbGV0IG9wY29kZSA9IGRhdGFbMF07XG5cbiAgICAgICAgICBpZiAob3Bjb2RlID09PSBBVFRfT1BfV1JJVEVfUkVTUCkge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdoYW5kbGVXcml0ZScsIHRoaXMuX2FkZHJlc3MsIGhhbmRsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2F0dDtcbiJdfQ==
