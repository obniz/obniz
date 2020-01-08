"use strict";
// var debug = require('debug')('gatt');
const debug = () => { };
let events = require('events');
/* eslint-disable no-unused-vars */
let ATT_OP_ERROR = 0x01;
let ATT_OP_MTU_REQ = 0x02;
let ATT_OP_MTU_RESP = 0x03;
let ATT_OP_FIND_INFO_REQ = 0x04;
let ATT_OP_FIND_INFO_RESP = 0x05;
let ATT_OP_FIND_BY_TYPE_REQ = 0x06;
let ATT_OP_FIND_BY_TYPE_RESP = 0x07;
let ATT_OP_READ_BY_TYPE_REQ = 0x08;
let ATT_OP_READ_BY_TYPE_RESP = 0x09;
let ATT_OP_READ_REQ = 0x0a;
let ATT_OP_READ_RESP = 0x0b;
let ATT_OP_READ_BLOB_REQ = 0x0c;
let ATT_OP_READ_BLOB_RESP = 0x0d;
let ATT_OP_READ_MULTI_REQ = 0x0e;
let ATT_OP_READ_MULTI_RESP = 0x0f;
let ATT_OP_READ_BY_GROUP_REQ = 0x10;
let ATT_OP_READ_BY_GROUP_RESP = 0x11;
let ATT_OP_WRITE_REQ = 0x12;
let ATT_OP_WRITE_RESP = 0x13;
let ATT_OP_WRITE_CMD = 0x52;
let ATT_OP_PREP_WRITE_REQ = 0x16;
let ATT_OP_PREP_WRITE_RESP = 0x17;
let ATT_OP_EXEC_WRITE_REQ = 0x18;
let ATT_OP_EXEC_WRITE_RESP = 0x19;
let ATT_OP_HANDLE_NOTIFY = 0x1b;
let ATT_OP_HANDLE_IND = 0x1d;
let ATT_OP_HANDLE_CNF = 0x1e;
let ATT_OP_SIGNED_WRITE_CMD = 0xd2;
let GATT_PRIM_SVC_UUID = 0x2800;
let GATT_INCLUDE_UUID = 0x2802;
let GATT_CHARAC_UUID = 0x2803;
let GATT_CLIENT_CHARAC_CFG_UUID = 0x2902;
let GATT_SERVER_CHARAC_CFG_UUID = 0x2903;
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
/* eslint-enable no-unused-vars */
let ATT_CID = 0x0004;
class Gatt extends events.EventEmitter {
    constructor() {
        super();
        this.maxMtu = 256;
        this._mtu = 23;
        this._preparedWriteRequest = null;
        this.setServices([]);
        this.onAclStreamDataBinded = this.onAclStreamData.bind(this);
        this.onAclStreamEndBinded = this.onAclStreamEnd.bind(this);
    }
    setServices(services) {
        // var deviceName = process.env.BLENO_DEVICE_NAME || os.hostname();
        // base services and characteristics
        let allServices = [
        // {
        //   uuid: '1800',
        //   characteristics: [
        //     {
        //       uuid: '2a00',
        //       properties: ['read'],
        //       secure: [],
        //       value: Buffer.from(deviceName),
        //       descriptors: []
        //     },
        //     {
        //       uuid: '2a01',
        //       properties: ['read'],
        //       secure: [],
        //       value: Buffer.from([0x80, 0x00]),
        //       descriptors: []
        //     }
        //   ]
        // },
        // {
        //   uuid: '1801',
        //   characteristics: [
        //     {
        //       uuid: '2a05',
        //       properties: ['indicate'],
        //       secure: [],
        //       value: Buffer.from([0x00, 0x00, 0x00, 0x00]),
        //       descriptors: []
        //     }
        //   ]
        // }
        ].concat(services);
        this._handles = [];
        let handle = 0;
        let i;
        let j;
        for (i = 0; i < allServices.length; i++) {
            let service = allServices[i];
            handle++;
            let serviceHandle = handle;
            this._handles[serviceHandle] = {
                type: 'service',
                uuid: service.uuid,
                attribute: service,
                startHandle: serviceHandle,
            };
            for (j = 0; j < service.characteristics.length; j++) {
                let characteristic = service.characteristics[j];
                let properties = 0;
                let secure = 0;
                if (characteristic.properties.indexOf('read') !== -1) {
                    properties |= 0x02;
                    if (characteristic.secure.indexOf('read') !== -1) {
                        secure |= 0x02;
                    }
                }
                if (characteristic.properties.indexOf('writeWithoutResponse') !== -1) {
                    properties |= 0x04;
                    if (characteristic.secure.indexOf('writeWithoutResponse') !== -1) {
                        secure |= 0x04;
                    }
                }
                if (characteristic.properties.indexOf('write') !== -1) {
                    properties |= 0x08;
                    if (characteristic.secure.indexOf('write') !== -1) {
                        secure |= 0x08;
                    }
                }
                if (characteristic.properties.indexOf('notify') !== -1) {
                    properties |= 0x10;
                    if (characteristic.secure.indexOf('notify') !== -1) {
                        secure |= 0x10;
                    }
                }
                if (characteristic.properties.indexOf('indicate') !== -1) {
                    properties |= 0x20;
                    if (characteristic.secure.indexOf('indicate') !== -1) {
                        secure |= 0x20;
                    }
                }
                handle++;
                let characteristicHandle = handle;
                handle++;
                let characteristicValueHandle = handle;
                this._handles[characteristicHandle] = {
                    type: 'characteristic',
                    uuid: characteristic.uuid,
                    properties: properties,
                    secure: secure,
                    attribute: characteristic,
                    startHandle: characteristicHandle,
                    valueHandle: characteristicValueHandle,
                };
                this._handles[characteristicValueHandle] = {
                    type: 'characteristicValue',
                    handle: characteristicValueHandle,
                    value: characteristic.value,
                };
                let hasCCCD = characteristic.descriptors.find(e => e.uuid === '2902');
                if (hasCCCD || properties & 0x30) {
                    // notify or indicate
                    // add client characteristic configuration descriptor
                    handle++;
                    let clientCharacteristicConfigurationDescriptorHandle = handle;
                    this._handles[clientCharacteristicConfigurationDescriptorHandle] = {
                        type: 'descriptor',
                        handle: clientCharacteristicConfigurationDescriptorHandle,
                        uuid: '2902',
                        attribute: characteristic,
                        properties: 0x02 | 0x04 | 0x08,
                        secure: secure & 0x10 ? 0x02 | 0x04 | 0x08 : 0,
                        value: Buffer.from([0x00, 0x00]),
                    };
                }
                for (let k = 0; k < characteristic.descriptors.length; k++) {
                    let descriptor = characteristic.descriptors[k];
                    if (descriptor.uuid === '2902') {
                        continue;
                    }
                    handle++;
                    let descriptorHandle = handle;
                    this._handles[descriptorHandle] = {
                        type: 'descriptor',
                        handle: descriptorHandle,
                        uuid: descriptor.uuid,
                        attribute: descriptor,
                        properties: 0x02,
                        secure: 0x00,
                        value: descriptor.value,
                    };
                }
            }
            this._handles[serviceHandle].endHandle = handle;
        }
        let debugHandles = [];
        for (i = 0; i < this._handles.length; i++) {
            handle = this._handles[i];
            debugHandles[i] = {};
            for (j in handle) {
                if (Buffer.isBuffer(handle[j])) {
                    debugHandles[i][j] = handle[j]
                        ? "Buffer('" + handle[j].toString('hex') + "', 'hex')"
                        : null;
                }
                else if (j !== 'attribute') {
                    debugHandles[i][j] = handle[j];
                }
            }
        }
        debug('handles = ' + JSON.stringify(debugHandles, null, 2));
    }
    setAclStream(aclStream) {
        this._mtu = 23;
        this._preparedWriteRequest = null;
        this._aclStream = aclStream;
        this._aclStream.on('data', this.onAclStreamDataBinded);
        this._aclStream.on('end', this.onAclStreamEndBinded);
    }
    onAclStreamData(cid, data) {
        if (cid !== ATT_CID) {
            return;
        }
        this.handleRequest(data);
    }
    onAclStreamEnd() {
        this._aclStream.removeListener('data', this.onAclStreamDataBinded);
        this._aclStream.removeListener('end', this.onAclStreamEndBinded);
        for (let i = 0; i < this._handles.length; i++) {
            if (this._handles[i] &&
                this._handles[i].type === 'descriptor' &&
                this._handles[i].uuid === '2902' &&
                this._handles[i].value.readUInt16LE(0) !== 0) {
                this._handles[i].value = Buffer.from([0x00, 0x00]);
                if (this._handles[i].attribute && this._handles[i].attribute.emit) {
                    this._handles[i].attribute.emit('unsubscribe');
                }
            }
        }
    }
    send(data) {
        debug('send: ' + data.toString('hex'));
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
    handleRequest(request) {
        debug('handing request: ' + request.toString('hex'));
        let requestType = request[0];
        let response = null;
        switch (requestType) {
            case ATT_OP_MTU_REQ:
                response = this.handleMtuRequest(request);
                break;
            case ATT_OP_FIND_INFO_REQ:
                response = this.handleFindInfoRequest(request);
                break;
            case ATT_OP_FIND_BY_TYPE_REQ:
                response = this.handleFindByTypeRequest(request);
                break;
            case ATT_OP_READ_BY_TYPE_REQ:
                response = this.handleReadByTypeRequest(request);
                break;
            case ATT_OP_READ_REQ:
            case ATT_OP_READ_BLOB_REQ:
                response = this.handleReadOrReadBlobRequest(request);
                break;
            case ATT_OP_READ_BY_GROUP_REQ:
                response = this.handleReadByGroupRequest(request);
                break;
            case ATT_OP_WRITE_REQ:
            case ATT_OP_WRITE_CMD:
                response = this.handleWriteRequestOrCommand(request);
                break;
            case ATT_OP_PREP_WRITE_REQ:
                response = this.handlePrepareWriteRequest(request);
                break;
            case ATT_OP_EXEC_WRITE_REQ:
                response = this.handleExecuteWriteRequest(request);
                break;
            case ATT_OP_HANDLE_CNF:
                response = this.handleConfirmation(request);
                break;
            default:
            case ATT_OP_READ_MULTI_REQ:
            case ATT_OP_SIGNED_WRITE_CMD:
                response = this.errorResponse(requestType, 0x0000, ATT_ECODE_REQ_NOT_SUPP);
                break;
        }
        if (response) {
            debug('response: ' + response.toString('hex'));
            this.send(response);
        }
    }
    handleMtuRequest(request) {
        let mtu = request.readUInt16LE(1);
        if (mtu < 23) {
            mtu = 23;
        }
        else if (mtu > this.maxMtu) {
            mtu = this.maxMtu;
        }
        this._mtu = mtu;
        this.emit('mtuChange', this._mtu);
        let response = Buffer.alloc(3);
        response.writeUInt8(ATT_OP_MTU_RESP, 0);
        response.writeUInt16LE(mtu, 1);
        return response;
    }
    handleFindInfoRequest(request) {
        let response = null;
        let startHandle = request.readUInt16LE(1);
        let endHandle = request.readUInt16LE(3);
        let infos = [];
        let uuid = null;
        let i;
        for (i = startHandle; i <= endHandle; i++) {
            let handle = this._handles[i];
            if (!handle) {
                break;
            }
            uuid = null;
            if ('service' === handle.type) {
                uuid = '2800';
            }
            else if ('includedService' === handle.type) {
                uuid = '2802';
            }
            else if ('characteristic' === handle.type) {
                uuid = '2803';
            }
            else if ('characteristicValue' === handle.type) {
                uuid = this._handles[i - 1].uuid;
            }
            else if ('descriptor' === handle.type) {
                uuid = handle.uuid;
            }
            if (uuid) {
                infos.push({
                    handle: i,
                    uuid: uuid,
                });
            }
        }
        if (infos.length) {
            let uuidSize = infos[0].uuid.length / 2;
            let numInfo = 1;
            for (i = 1; i < infos.length; i++) {
                if (infos[0].uuid.length !== infos[i].uuid.length) {
                    break;
                }
                numInfo++;
            }
            let lengthPerInfo = uuidSize === 2 ? 4 : 18;
            let maxInfo = Math.floor((this._mtu - 2) / lengthPerInfo);
            numInfo = Math.min(numInfo, maxInfo);
            response = Buffer.alloc(2 + numInfo * lengthPerInfo);
            response[0] = ATT_OP_FIND_INFO_RESP;
            response[1] = uuidSize === 2 ? 0x01 : 0x2;
            for (i = 0; i < numInfo; i++) {
                let info = infos[i];
                response.writeUInt16LE(info.handle, 2 + i * lengthPerInfo);
                uuid = Buffer.from(info.uuid
                    .match(/.{1,2}/g)
                    .reverse()
                    .join(''), 'hex');
                for (let j = 0; j < uuid.length; j++) {
                    response[2 + i * lengthPerInfo + 2 + j] = uuid[j];
                }
            }
        }
        else {
            response = this.errorResponse(ATT_OP_FIND_INFO_REQ, startHandle, ATT_ECODE_ATTR_NOT_FOUND);
        }
        return response;
    }
    handleFindByTypeRequest(request) {
        let response = null;
        let startHandle = request.readUInt16LE(1);
        let endHandle = request.readUInt16LE(3);
        let uuid = request
            .slice(5, 7)
            .toString('hex')
            .match(/.{1,2}/g)
            .reverse()
            .join('');
        let value = request
            .slice(7)
            .toString('hex')
            .match(/.{1,2}/g)
            .reverse()
            .join('');
        let handles = [];
        let handle;
        for (let i = startHandle; i <= endHandle; i++) {
            handle = this._handles[i];
            if (!handle) {
                break;
            }
            if ('2800' === uuid &&
                handle.type === 'service' &&
                handle.uuid === value) {
                handles.push({
                    start: handle.startHandle,
                    end: handle.endHandle,
                });
            }
        }
        if (handles.length) {
            let lengthPerHandle = 4;
            let numHandles = handles.length;
            let maxHandles = Math.floor((this._mtu - 1) / lengthPerHandle);
            numHandles = Math.min(numHandles, maxHandles);
            response = Buffer.alloc(1 + numHandles * lengthPerHandle);
            response[0] = ATT_OP_FIND_BY_TYPE_RESP;
            for (let i = 0; i < numHandles; i++) {
                handle = handles[i];
                response.writeUInt16LE(handle.start, 1 + i * lengthPerHandle);
                response.writeUInt16LE(handle.end, 1 + i * lengthPerHandle + 2);
            }
        }
        else {
            response = this.errorResponse(ATT_OP_FIND_BY_TYPE_REQ, startHandle, ATT_ECODE_ATTR_NOT_FOUND);
        }
        return response;
    }
    handleReadByGroupRequest(request) {
        let response = null;
        let startHandle = request.readUInt16LE(1);
        let endHandle = request.readUInt16LE(3);
        let uuid = request
            .slice(5)
            .toString('hex')
            .match(/.{1,2}/g)
            .reverse()
            .join('');
        debug('read by group: startHandle = 0x' +
            startHandle.toString(16) +
            ', endHandle = 0x' +
            endHandle.toString(16) +
            ', uuid = 0x' +
            uuid.toString(16));
        if ('2800' === uuid || '2802' === uuid) {
            let services = [];
            let type = '2800' === uuid ? 'service' : 'includedService';
            let i;
            for (i = startHandle; i <= endHandle; i++) {
                let handle = this._handles[i];
                if (!handle) {
                    break;
                }
                if (handle.type === type) {
                    services.push(handle);
                }
            }
            if (services.length) {
                let uuidSize = services[0].uuid.length / 2;
                let numServices = 1;
                for (i = 1; i < services.length; i++) {
                    if (services[0].uuid.length !== services[i].uuid.length) {
                        break;
                    }
                    numServices++;
                }
                let lengthPerService = uuidSize === 2 ? 6 : 20;
                let maxServices = Math.floor((this._mtu - 2) / lengthPerService);
                numServices = Math.min(numServices, maxServices);
                response = Buffer.alloc(2 + numServices * lengthPerService);
                response[0] = ATT_OP_READ_BY_GROUP_RESP;
                response[1] = lengthPerService;
                for (i = 0; i < numServices; i++) {
                    let service = services[i];
                    response.writeUInt16LE(service.startHandle, 2 + i * lengthPerService);
                    response.writeUInt16LE(service.endHandle, 2 + i * lengthPerService + 2);
                    let serviceUuid = Buffer.from(service.uuid
                        .match(/.{1,2}/g)
                        .reverse()
                        .join(''), 'hex');
                    for (let j = 0; j < serviceUuid.length; j++) {
                        response[2 + i * lengthPerService + 4 + j] = serviceUuid[j];
                    }
                }
            }
            else {
                response = this.errorResponse(ATT_OP_READ_BY_GROUP_REQ, startHandle, ATT_ECODE_ATTR_NOT_FOUND);
            }
        }
        else {
            response = this.errorResponse(ATT_OP_READ_BY_GROUP_REQ, startHandle, ATT_ECODE_UNSUPP_GRP_TYPE);
        }
        return response;
    }
    handleReadByTypeRequest(request) {
        let response = null;
        let requestType = request[0];
        let startHandle = request.readUInt16LE(1);
        let endHandle = request.readUInt16LE(3);
        let uuid = request
            .slice(5)
            .toString('hex')
            .match(/.{1,2}/g)
            .reverse()
            .join('');
        let i;
        let handle;
        debug('read by type: startHandle = 0x' +
            startHandle.toString(16) +
            ', endHandle = 0x' +
            endHandle.toString(16) +
            ', uuid = 0x' +
            uuid.toString(16));
        if ('2803' === uuid) {
            let characteristics = [];
            for (i = startHandle; i <= endHandle; i++) {
                handle = this._handles[i];
                if (!handle) {
                    break;
                }
                if (handle.type === 'characteristic') {
                    characteristics.push(handle);
                }
            }
            if (characteristics.length) {
                let uuidSize = characteristics[0].uuid.length / 2;
                let numCharacteristics = 1;
                for (i = 1; i < characteristics.length; i++) {
                    if (characteristics[0].uuid.length !== characteristics[i].uuid.length) {
                        break;
                    }
                    numCharacteristics++;
                }
                let lengthPerCharacteristic = uuidSize === 2 ? 7 : 21;
                let maxCharacteristics = Math.floor((this._mtu - 2) / lengthPerCharacteristic);
                numCharacteristics = Math.min(numCharacteristics, maxCharacteristics);
                response = Buffer.alloc(2 + numCharacteristics * lengthPerCharacteristic);
                response[0] = ATT_OP_READ_BY_TYPE_RESP;
                response[1] = lengthPerCharacteristic;
                for (i = 0; i < numCharacteristics; i++) {
                    let characteristic = characteristics[i];
                    response.writeUInt16LE(characteristic.startHandle, 2 + i * lengthPerCharacteristic);
                    response.writeUInt8(characteristic.properties, 2 + i * lengthPerCharacteristic + 2);
                    response.writeUInt16LE(characteristic.valueHandle, 2 + i * lengthPerCharacteristic + 3);
                    let characteristicUuid = Buffer.from(characteristic.uuid
                        .match(/.{1,2}/g)
                        .reverse()
                        .join(''), 'hex');
                    for (let j = 0; j < characteristicUuid.length; j++) {
                        response[2 + i * lengthPerCharacteristic + 5 + j] =
                            characteristicUuid[j];
                    }
                }
            }
            else {
                response = this.errorResponse(ATT_OP_READ_BY_TYPE_REQ, startHandle, ATT_ECODE_ATTR_NOT_FOUND);
            }
        }
        else {
            let handleAttribute = null;
            let valueHandle = null;
            let secure = false;
            for (i = startHandle; i <= endHandle; i++) {
                handle = this._handles[i];
                if (!handle) {
                    break;
                }
                if (handle.type === 'characteristic' && handle.uuid === uuid) {
                    handleAttribute = handle.attribute;
                    valueHandle = handle.valueHandle;
                    secure = handle.secure & 0x02;
                    break;
                }
                else if (handle.type === 'descriptor' && handle.uuid === uuid) {
                    valueHandle = i;
                    secure = handle.secure & 0x02;
                    break;
                }
            }
            if (secure && !this._aclStream.encrypted) {
                response = this.errorResponse(ATT_OP_READ_BY_TYPE_REQ, startHandle, ATT_ECODE_AUTHENTICATION);
            }
            else if (valueHandle) {
                let callback = function (valueHandle) {
                    return function (result, data) {
                        let callbackResponse = null;
                        if (ATT_ECODE_SUCCESS === result) {
                            let dataLength = Math.min(data.length, this._mtu - 4);
                            callbackResponse = Buffer.alloc(4 + dataLength);
                            callbackResponse[0] = ATT_OP_READ_BY_TYPE_RESP;
                            callbackResponse[1] = dataLength + 2;
                            callbackResponse.writeUInt16LE(valueHandle, 2);
                            for (i = 0; i < dataLength; i++) {
                                callbackResponse[4 + i] = data[i];
                            }
                        }
                        else {
                            callbackResponse = this.errorResponse(requestType, valueHandle, result);
                        }
                        debug('read by type response: ' + callbackResponse.toString('hex'));
                        this.send(callbackResponse);
                    }.bind(this);
                }.bind(this)(valueHandle);
                let data = this._handles[valueHandle].value;
                if (data) {
                    callback(ATT_ECODE_SUCCESS, data);
                }
                else if (handleAttribute) {
                    handleAttribute.emit('readRequest', 0, callback);
                }
                else {
                    callback(ATT_ECODE_UNLIKELY);
                }
            }
            else {
                response = this.errorResponse(ATT_OP_READ_BY_TYPE_REQ, startHandle, ATT_ECODE_ATTR_NOT_FOUND);
            }
        }
        return response;
    }
    handleReadOrReadBlobRequest(request) {
        let response = null;
        let requestType = request[0];
        let valueHandle = request.readUInt16LE(1);
        let offset = requestType === ATT_OP_READ_BLOB_REQ ? request.readUInt16LE(3) : 0;
        let handle = this._handles[valueHandle];
        let i;
        if (handle) {
            let result = null;
            let data = null;
            let handleType = handle.type;
            let callback = function (requestType, valueHandle) {
                return function (result, data) {
                    let callbackResponse = null;
                    if (ATT_ECODE_SUCCESS === result) {
                        let dataLength = Math.min(data.length, this._mtu - 1);
                        callbackResponse = Buffer.alloc(1 + dataLength);
                        callbackResponse[0] =
                            requestType === ATT_OP_READ_BLOB_REQ
                                ? ATT_OP_READ_BLOB_RESP
                                : ATT_OP_READ_RESP;
                        for (i = 0; i < dataLength; i++) {
                            callbackResponse[1 + i] = data[i];
                        }
                    }
                    else {
                        callbackResponse = this.errorResponse(requestType, valueHandle, result);
                    }
                    debug('read response: ' + callbackResponse.toString('hex'));
                    this.send(callbackResponse);
                }.bind(this);
            }.bind(this)(requestType, valueHandle);
            if (handleType === 'service' || handleType === 'includedService') {
                result = ATT_ECODE_SUCCESS;
                data = Buffer.from(handle.uuid
                    .match(/.{1,2}/g)
                    .reverse()
                    .join(''), 'hex');
            }
            else if (handleType === 'characteristic') {
                let uuid = Buffer.from(handle.uuid
                    .match(/.{1,2}/g)
                    .reverse()
                    .join(''), 'hex');
                result = ATT_ECODE_SUCCESS;
                data = Buffer.alloc(3 + uuid.length);
                data.writeUInt8(handle.properties, 0);
                data.writeUInt16LE(handle.valueHandle, 1);
                for (i = 0; i < uuid.length; i++) {
                    data[i + 3] = uuid[i];
                }
            }
            else if (handleType === 'characteristicValue' ||
                handleType === 'descriptor') {
                let handleProperties = handle.properties;
                let handleSecure = handle.secure;
                let handleAttribute = handle.attribute;
                if (handleType === 'characteristicValue') {
                    handleProperties = this._handles[valueHandle - 1].properties;
                    handleSecure = this._handles[valueHandle - 1].secure;
                    handleAttribute = this._handles[valueHandle - 1].attribute;
                }
                if (handleProperties & 0x02) {
                    if (handleSecure & 0x02 && !this._aclStream.encrypted) {
                        result = ATT_ECODE_AUTHENTICATION;
                    }
                    else {
                        data = handle.value;
                        if (data) {
                            result = ATT_ECODE_SUCCESS;
                        }
                        else {
                            handleAttribute.emit('readRequest', offset, callback);
                        }
                    }
                }
                else {
                    result = ATT_ECODE_READ_NOT_PERM; // non-readable
                }
            }
            if (data && typeof data === 'string') {
                data = Buffer.alloc(data);
            }
            if (result === ATT_ECODE_SUCCESS && data && offset) {
                if (data.length < offset) {
                    result = ATT_ECODE_INVALID_OFFSET;
                    data = null;
                }
                else {
                    data = data.slice(offset);
                }
            }
            if (result !== null) {
                callback(result, data);
            }
        }
        else {
            response = this.errorResponse(requestType, valueHandle, ATT_ECODE_INVALID_HANDLE);
        }
        return response;
    }
    handleWriteRequestOrCommand(request) {
        let response = null;
        let requestType = request[0];
        let withoutResponse = requestType === ATT_OP_WRITE_CMD;
        let valueHandle = request.readUInt16LE(1);
        let data = request.slice(3);
        let offset = 0;
        let handle = this._handles[valueHandle];
        if (handle) {
            if (handle.type === 'characteristicValue') {
                handle = this._handles[valueHandle - 1];
            }
            let handleProperties = handle.properties;
            let handleSecure = handle.secure;
            if (handleProperties &&
                (withoutResponse ? handleProperties & 0x04 : handleProperties & 0x08)) {
                let callback = function (requestType, valueHandle, withoutResponse) {
                    return function (result) {
                        if (!withoutResponse) {
                            let callbackResponse = null;
                            if (ATT_ECODE_SUCCESS === result) {
                                callbackResponse = Buffer.from([ATT_OP_WRITE_RESP]);
                            }
                            else {
                                callbackResponse = this.errorResponse(requestType, valueHandle, result);
                            }
                            debug('write response: ' + callbackResponse.toString('hex'));
                            this.send(callbackResponse);
                        }
                    }.bind(this);
                }.bind(this)(requestType, valueHandle, withoutResponse);
                if (handleSecure & (withoutResponse ? 0x04 : 0x08) &&
                    !this._aclStream.encrypted) {
                    response = this.errorResponse(requestType, valueHandle, ATT_ECODE_AUTHENTICATION);
                }
                else if (handle.type === 'descriptor' || handle.uuid === '2902') {
                    let result = null;
                    if (data.length !== 2) {
                        result = ATT_ECODE_INVAL_ATTR_VALUE_LEN;
                    }
                    else {
                        let value = data.readUInt16LE(0);
                        let handleAttribute = handle.attribute;
                        handle.value = data;
                        if (value & 0x0003) {
                            let updateValueCallback = function (valueHandle, attribute) {
                                return function (data) {
                                    let dataLength = Math.min(data.length, this._mtu - 3);
                                    let useNotify = attribute.properties.indexOf('notify') !== -1;
                                    let useIndicate = attribute.properties.indexOf('indicate') !== -1;
                                    let i;
                                    if (useNotify) {
                                        let notifyMessage = Buffer.alloc(3 + dataLength);
                                        notifyMessage.writeUInt8(ATT_OP_HANDLE_NOTIFY, 0);
                                        notifyMessage.writeUInt16LE(valueHandle, 1);
                                        for (i = 0; i < dataLength; i++) {
                                            notifyMessage[3 + i] = data[i];
                                        }
                                        debug('notify message: ' + notifyMessage.toString('hex'));
                                        this.send(notifyMessage);
                                        attribute.emit('notify');
                                    }
                                    else if (useIndicate) {
                                        let indicateMessage = Buffer.alloc(3 + dataLength);
                                        indicateMessage.writeUInt8(ATT_OP_HANDLE_IND, 0);
                                        indicateMessage.writeUInt16LE(valueHandle, 1);
                                        for (i = 0; i < dataLength; i++) {
                                            indicateMessage[3 + i] = data[i];
                                        }
                                        this._lastIndicatedAttribute = attribute;
                                        debug('indicate message: ' + indicateMessage.toString('hex'));
                                        this.send(indicateMessage);
                                    }
                                }.bind(this);
                            }.bind(this)(valueHandle - 1, handleAttribute);
                            if (handleAttribute.emit) {
                                handleAttribute.emit('subscribe', this._mtu - 3, updateValueCallback);
                            }
                        }
                        else {
                            handleAttribute.emit('unsubscribe');
                        }
                        result = ATT_ECODE_SUCCESS;
                    }
                    callback(result);
                }
                else {
                    handle.attribute.emit('writeRequest', data, offset, withoutResponse, callback);
                }
            }
            else {
                response = this.errorResponse(requestType, valueHandle, ATT_ECODE_WRITE_NOT_PERM);
            }
        }
        else {
            response = this.errorResponse(requestType, valueHandle, ATT_ECODE_INVALID_HANDLE);
        }
        return response;
    }
    handlePrepareWriteRequest(request) {
        let response = null;
        let requestType = request[0];
        let valueHandle = request.readUInt16LE(1);
        let offset = request.readUInt16LE(3);
        let data = request.slice(5);
        let handle = this._handles[valueHandle];
        if (handle) {
            if (handle.type === 'characteristicValue') {
                handle = this._handles[valueHandle - 1];
                let handleProperties = handle.properties;
                let handleSecure = handle.secure;
                if (handleProperties && handleProperties & 0x08) {
                    if (handleSecure & 0x08 && !this._aclStream.encrypted) {
                        response = this.errorResponse(requestType, valueHandle, ATT_ECODE_AUTHENTICATION);
                    }
                    else if (this._preparedWriteRequest) {
                        if (this._preparedWriteRequest.handle !== handle) {
                            response = this.errorResponse(requestType, valueHandle, ATT_ECODE_UNLIKELY);
                        }
                        else if (offset ===
                            this._preparedWriteRequest.offset +
                                this._preparedWriteRequest.data.length) {
                            this._preparedWriteRequest.data = Buffer.concat([
                                this._preparedWriteRequest.data,
                                data,
                            ]);
                            response = Buffer.alloc(request.length);
                            request.copy(response);
                            response[0] = ATT_OP_PREP_WRITE_RESP;
                        }
                        else {
                            response = this.errorResponse(requestType, valueHandle, ATT_ECODE_INVALID_OFFSET);
                        }
                    }
                    else {
                        this._preparedWriteRequest = {
                            handle: handle,
                            valueHandle: valueHandle,
                            offset: offset,
                            data: data,
                        };
                        response = Buffer.alloc(request.length);
                        request.copy(response);
                        response[0] = ATT_OP_PREP_WRITE_RESP;
                    }
                }
                else {
                    response = this.errorResponse(requestType, valueHandle, ATT_ECODE_WRITE_NOT_PERM);
                }
            }
            else {
                response = this.errorResponse(requestType, valueHandle, ATT_ECODE_ATTR_NOT_LONG);
            }
        }
        else {
            response = this.errorResponse(requestType, valueHandle, ATT_ECODE_INVALID_HANDLE);
        }
        return response;
    }
    handleExecuteWriteRequest(request) {
        let response = null;
        let requestType = request[0];
        let flag = request[1];
        if (this._preparedWriteRequest) {
            if (flag === 0x00) {
                response = Buffer.from([ATT_OP_EXEC_WRITE_RESP]);
            }
            else if (flag === 0x01) {
                let callback = function (requestType, valueHandle) {
                    return function (result) {
                        let callbackResponse = null;
                        if (ATT_ECODE_SUCCESS === result) {
                            callbackResponse = Buffer.from([ATT_OP_EXEC_WRITE_RESP]);
                        }
                        else {
                            callbackResponse = this.errorResponse(requestType, valueHandle, result);
                        }
                        debug('execute write response: ' + callbackResponse.toString('hex'));
                        this.send(callbackResponse);
                    }.bind(this);
                }.bind(this)(requestType, this._preparedWriteRequest.valueHandle);
                this._preparedWriteRequest.handle.attribute.emit('writeRequest', this._preparedWriteRequest.data, this._preparedWriteRequest.offset, false, callback);
            }
            else {
                response = this.errorResponse(requestType, 0x0000, ATT_ECODE_UNLIKELY);
            }
            this._preparedWriteRequest = null;
        }
        else {
            response = this.errorResponse(requestType, 0x0000, ATT_ECODE_UNLIKELY);
        }
        return response;
    }
    handleConfirmation(request) {
        if (this._lastIndicatedAttribute) {
            if (this._lastIndicatedAttribute.emit) {
                this._lastIndicatedAttribute.emit('indicate');
            }
            this._lastIndicatedAttribute = null;
        }
    }
}
module.exports = Gatt;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvcHJvdG9jb2wvcGVyaXBoZXJhbC9nYXR0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx3Q0FBd0M7QUFDeEMsTUFBTSxLQUFLLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0FBRXZCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUUvQixtQ0FBbUM7QUFDbkMsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQztBQUMxQixJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDM0IsSUFBSSxvQkFBb0IsR0FBRyxJQUFJLENBQUM7QUFDaEMsSUFBSSxxQkFBcUIsR0FBRyxJQUFJLENBQUM7QUFDakMsSUFBSSx1QkFBdUIsR0FBRyxJQUFJLENBQUM7QUFDbkMsSUFBSSx3QkFBd0IsR0FBRyxJQUFJLENBQUM7QUFDcEMsSUFBSSx1QkFBdUIsR0FBRyxJQUFJLENBQUM7QUFDbkMsSUFBSSx3QkFBd0IsR0FBRyxJQUFJLENBQUM7QUFDcEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBQzNCLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzVCLElBQUksb0JBQW9CLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLElBQUkscUJBQXFCLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLElBQUkscUJBQXFCLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLElBQUksc0JBQXNCLEdBQUcsSUFBSSxDQUFDO0FBQ2xDLElBQUksd0JBQXdCLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLElBQUkseUJBQXlCLEdBQUcsSUFBSSxDQUFDO0FBQ3JDLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzVCLElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzVCLElBQUkscUJBQXFCLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLElBQUksc0JBQXNCLEdBQUcsSUFBSSxDQUFDO0FBQ2xDLElBQUkscUJBQXFCLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLElBQUksc0JBQXNCLEdBQUcsSUFBSSxDQUFDO0FBQ2xDLElBQUksb0JBQW9CLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLElBQUksdUJBQXVCLEdBQUcsSUFBSSxDQUFDO0FBRW5DLElBQUksa0JBQWtCLEdBQUcsTUFBTSxDQUFDO0FBQ2hDLElBQUksaUJBQWlCLEdBQUcsTUFBTSxDQUFDO0FBQy9CLElBQUksZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO0FBRTlCLElBQUksMkJBQTJCLEdBQUcsTUFBTSxDQUFDO0FBQ3pDLElBQUksMkJBQTJCLEdBQUcsTUFBTSxDQUFDO0FBRXpDLElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLElBQUksd0JBQXdCLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLElBQUksdUJBQXVCLEdBQUcsSUFBSSxDQUFDO0FBQ25DLElBQUksd0JBQXdCLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLElBQUkscUJBQXFCLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLElBQUksd0JBQXdCLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLElBQUksc0JBQXNCLEdBQUcsSUFBSSxDQUFDO0FBQ2xDLElBQUksd0JBQXdCLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLElBQUksdUJBQXVCLEdBQUcsSUFBSSxDQUFDO0FBQ25DLElBQUkseUJBQXlCLEdBQUcsSUFBSSxDQUFDO0FBQ3JDLElBQUksd0JBQXdCLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLElBQUksdUJBQXVCLEdBQUcsSUFBSSxDQUFDO0FBQ25DLElBQUksOEJBQThCLEdBQUcsSUFBSSxDQUFDO0FBQzFDLElBQUksOEJBQThCLEdBQUcsSUFBSSxDQUFDO0FBQzFDLElBQUksa0JBQWtCLEdBQUcsSUFBSSxD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Iiwic291cmNlc0NvbnRlbnQiOlsiLy8gdmFyIGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnZ2F0dCcpO1xuY29uc3QgZGVidWcgPSAoKSA9PiB7fTtcblxubGV0IGV2ZW50cyA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xubGV0IEFUVF9PUF9FUlJPUiA9IDB4MDE7XG5sZXQgQVRUX09QX01UVV9SRVEgPSAweDAyO1xubGV0IEFUVF9PUF9NVFVfUkVTUCA9IDB4MDM7XG5sZXQgQVRUX09QX0ZJTkRfSU5GT19SRVEgPSAweDA0O1xubGV0IEFUVF9PUF9GSU5EX0lORk9fUkVTUCA9IDB4MDU7XG5sZXQgQVRUX09QX0ZJTkRfQllfVFlQRV9SRVEgPSAweDA2O1xubGV0IEFUVF9PUF9GSU5EX0JZX1RZUEVfUkVTUCA9IDB4MDc7XG5sZXQgQVRUX09QX1JFQURfQllfVFlQRV9SRVEgPSAweDA4O1xubGV0IEFUVF9PUF9SRUFEX0JZX1RZUEVfUkVTUCA9IDB4MDk7XG5sZXQgQVRUX09QX1JFQURfUkVRID0gMHgwYTtcbmxldCBBVFRfT1BfUkVBRF9SRVNQID0gMHgwYjtcbmxldCBBVFRfT1BfUkVBRF9CTE9CX1JFUSA9IDB4MGM7XG5sZXQgQVRUX09QX1JFQURfQkxPQl9SRVNQID0gMHgwZDtcbmxldCBBVFRfT1BfUkVBRF9NVUxUSV9SRVEgPSAweDBlO1xubGV0IEFUVF9PUF9SRUFEX01VTFRJX1JFU1AgPSAweDBmO1xubGV0IEFUVF9PUF9SRUFEX0JZX0dST1VQX1JFUSA9IDB4MTA7XG5sZXQgQVRUX09QX1JFQURfQllfR1JPVVBfUkVTUCA9IDB4MTE7XG5sZXQgQVRUX09QX1dSSVRFX1JFUSA9IDB4MTI7XG5sZXQgQVRUX09QX1dSSVRFX1JFU1AgPSAweDEzO1xubGV0IEFUVF9PUF9XUklURV9DTUQgPSAweDUyO1xubGV0IEFUVF9PUF9QUkVQX1dSSVRFX1JFUSA9IDB4MTY7XG5sZXQgQVRUX09QX1BSRVBfV1JJVEVfUkVTUCA9IDB4MTc7XG5sZXQgQVRUX09QX0VYRUNfV1JJVEVfUkVRID0gMHgxODtcbmxldCBBVFRfT1BfRVhFQ19XUklURV9SRVNQID0gMHgxOTtcbmxldCBBVFRfT1BfSEFORExFX05PVElGWSA9IDB4MWI7XG5sZXQgQVRUX09QX0hBTkRMRV9JTkQgPSAweDFkO1xubGV0IEFUVF9PUF9IQU5ETEVfQ05GID0gMHgxZTtcbmxldCBBVFRfT1BfU0lHTkVEX1dSSVRFX0NNRCA9IDB4ZDI7XG5cbmxldCBHQVRUX1BSSU1fU1ZDX1VVSUQgPSAweDI4MDA7XG5sZXQgR0FUVF9JTkNMVURFX1VVSUQgPSAweDI4MDI7XG5sZXQgR0FUVF9DSEFSQUNfVVVJRCA9IDB4MjgwMztcblxubGV0IEdBVFRfQ0xJRU5UX0NIQVJBQ19DRkdfVVVJRCA9IDB4MjkwMjtcbmxldCBHQVRUX1NFUlZFUl9DSEFSQUNfQ0ZHX1VVSUQgPSAweDI5MDM7XG5cbmxldCBBVFRfRUNPREVfU1VDQ0VTUyA9IDB4MDA7XG5sZXQgQVRUX0VDT0RFX0lOVkFMSURfSEFORExFID0gMHgwMTtcbmxldCBBVFRfRUNPREVfUkVBRF9OT1RfUEVSTSA9IDB4MDI7XG5sZXQgQVRUX0VDT0RFX1dSSVRFX05PVF9QRVJNID0gMHgwMztcbmxldCBBVFRfRUNPREVfSU5WQUxJRF9QRFUgPSAweDA0O1xubGV0IEFUVF9FQ09ERV9BVVRIRU5USUNBVElPTiA9IDB4MDU7XG5sZXQgQVRUX0VDT0RFX1JFUV9OT1RfU1VQUCA9IDB4MDY7XG5sZXQgQVRUX0VDT0RFX0lOVkFMSURfT0ZGU0VUID0gMHgwNztcbmxldCBBVFRfRUNPREVfQVVUSE9SSVpBVElPTiA9IDB4MDg7XG5sZXQgQVRUX0VDT0RFX1BSRVBfUVVFVUVfRlVMTCA9IDB4MDk7XG5sZXQgQVRUX0VDT0RFX0FUVFJfTk9UX0ZPVU5EID0gMHgwYTtcbmxldCBBVFRfRUNPREVfQVRUUl9OT1RfTE9ORyA9IDB4MGI7XG5sZXQgQVRUX0VDT0RFX0lOU1VGRl9FTkNSX0tFWV9TSVpFID0gMHgwYztcbmxldCBBVFRfRUNPREVfSU5WQUxfQVRUUl9WQUxVRV9MRU4gPSAweDBkO1xubGV0IEFUVF9FQ09ERV9VTkxJS0VMWSA9IDB4MGU7XG5sZXQgQVRUX0VDT0RFX0lOU1VGRl9FTkMgPSAweDBmO1xubGV0IEFUVF9FQ09ERV9VTlNVUFBfR1JQX1RZUEUgPSAweDEwO1xubGV0IEFUVF9FQ09ERV9JTlNVRkZfUkVTT1VSQ0VTID0gMHgxMTtcblxuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xubGV0IEFUVF9DSUQgPSAweDAwMDQ7XG5cbmNsYXNzIEdhdHQgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm1heE10dSA9IDI1NjtcbiAgICB0aGlzLl9tdHUgPSAyMztcbiAgICB0aGlzLl9wcmVwYXJlZFdyaXRlUmVxdWVzdCA9IG51bGw7XG5cbiAgICB0aGlzLnNldFNlcnZpY2VzKFtdKTtcblxuICAgIHRoaXMub25BY2xTdHJlYW1EYXRhQmluZGVkID0gdGhpcy5vbkFjbFN0cmVhbURhdGEuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uQWNsU3RyZWFtRW5kQmluZGVkID0gdGhpcy5vbkFjbFN0cmVhbUVuZC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgc2V0U2VydmljZXMoc2VydmljZXMpIHtcbiAgICAvLyB2YXIgZGV2aWNlTmFtZSA9IHByb2Nlc3MuZW52LkJMRU5PX0RFVklDRV9OQU1FIHx8IG9zLmhvc3RuYW1lKCk7XG5cbiAgICAvLyBiYXNlIHNlcnZpY2VzIGFuZCBjaGFyYWN0ZXJpc3RpY3NcbiAgICBsZXQgYWxsU2VydmljZXMgPSBbXG4gICAgICAvLyB7XG4gICAgICAvLyAgIHV1aWQ6ICcxODAwJyxcbiAgICAgIC8vICAgY2hhcmFjdGVyaXN0aWNzOiBbXG4gICAgICAvLyAgICAge1xuICAgICAgLy8gICAgICAgdXVpZDogJzJhMDAnLFxuICAgICAgLy8gICAgICAgcHJvcGVydGllczogWydyZWFkJ10sXG4gICAgICAvLyAgICAgICBzZWN1cmU6IFtdLFxuICAgICAgLy8gICAgICAgdmFsdWU6IEJ1ZmZlci5mcm9tKGRldmljZU5hbWUpLFxuICAgICAgLy8gICAgICAgZGVzY3JpcHRvcnM6IFtdXG4gICAgICAvLyAgICAgfSxcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICB1dWlkOiAnMmEwMScsXG4gICAgICAvLyAgICAgICBwcm9wZXJ0aWVzOiBbJ3JlYWQnXSxcbiAgICAgIC8vICAgICAgIHNlY3VyZTogW10sXG4gICAgICAvLyAgICAgICB2YWx1ZTogQnVmZmVyLmZyb20oWzB4ODAsIDB4MDBdKSxcbiAgICAgIC8vICAgICAgIGRlc2NyaXB0b3JzOiBbXVxuICAgICAgLy8gICAgIH1cbiAgICAgIC8vICAgXVxuICAgICAgLy8gfSxcbiAgICAgIC8vIHtcbiAgICAgIC8vICAgdXVpZDogJzE4MDEnLFxuICAgICAgLy8gICBjaGFyYWN0ZXJpc3RpY3M6IFtcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICB1dWlkOiAnMmEwNScsXG4gICAgICAvLyAgICAgICBwcm9wZXJ0aWVzOiBbJ2luZGljYXRlJ10sXG4gICAgICAvLyAgICAgICBzZWN1cmU6IFtdLFxuICAgICAgLy8gICAgICAgdmFsdWU6IEJ1ZmZlci5mcm9tKFsweDAwLCAweDAwLCAweDAwLCAweDAwXSksXG4gICAgICAvLyAgICAgICBkZXNjcmlwdG9yczogW11cbiAgICAgIC8vICAgICB9XG4gICAgICAvLyAgIF1cbiAgICAgIC8vIH1cbiAgICBdLmNvbmNhdChzZXJ2aWNlcyk7XG5cbiAgICB0aGlzLl9oYW5kbGVzID0gW107XG5cbiAgICBsZXQgaGFuZGxlID0gMDtcbiAgICBsZXQgaTtcbiAgICBsZXQgajtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBhbGxTZXJ2aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHNlcnZpY2UgPSBhbGxTZXJ2aWNlc1tpXTtcblxuICAgICAgaGFuZGxlKys7XG4gICAgICBsZXQgc2VydmljZUhhbmRsZSA9IGhhbmRsZTtcblxuICAgICAgdGhpcy5faGFuZGxlc1tzZXJ2aWNlSGFuZGxlXSA9IHtcbiAgICAgICAgdHlwZTogJ3NlcnZpY2UnLFxuICAgICAgICB1dWlkOiBzZXJ2aWNlLnV1aWQsXG4gICAgICAgIGF0dHJpYnV0ZTogc2VydmljZSxcbiAgICAgICAgc3RhcnRIYW5kbGU6IHNlcnZpY2VIYW5kbGUsXG4gICAgICAgIC8vIGVuZEhhbmRsZSBmaWxsZWQgaW4gYmVsb3dcbiAgICAgIH07XG5cbiAgICAgIGZvciAoaiA9IDA7IGogPCBzZXJ2aWNlLmNoYXJhY3RlcmlzdGljcy5sZW5ndGg7IGorKykge1xuICAgICAgICBsZXQgY2hhcmFjdGVyaXN0aWMgPSBzZXJ2aWNlLmNoYXJhY3RlcmlzdGljc1tqXTtcblxuICAgICAgICBsZXQgcHJvcGVydGllcyA9IDA7XG4gICAgICAgIGxldCBzZWN1cmUgPSAwO1xuXG4gICAgICAgIGlmIChjaGFyYWN0ZXJpc3RpYy5wcm9wZXJ0aWVzLmluZGV4T2YoJ3JlYWQnKSAhPT0gLTEpIHtcbiAgICAgICAgICBwcm9wZXJ0aWVzIHw9IDB4MDI7XG5cbiAgICAgICAgICBpZiAoY2hhcmFjdGVyaXN0aWMuc2VjdXJlLmluZGV4T2YoJ3JlYWQnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHNlY3VyZSB8PSAweDAyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaGFyYWN0ZXJpc3RpYy5wcm9wZXJ0aWVzLmluZGV4T2YoJ3dyaXRlV2l0aG91dFJlc3BvbnNlJykgIT09IC0xKSB7XG4gICAgICAgICAgcHJvcGVydGllcyB8PSAweDA0O1xuXG4gICAgICAgICAgaWYgKGNoYXJhY3RlcmlzdGljLnNlY3VyZS5pbmRleE9mKCd3cml0ZVdpdGhvdXRSZXNwb25zZScpICE9PSAtMSkge1xuICAgICAgICAgICAgc2VjdXJlIHw9IDB4MDQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoYXJhY3RlcmlzdGljLnByb3BlcnRpZXMuaW5kZXhPZignd3JpdGUnKSAhPT0gLTEpIHtcbiAgICAgICAgICBwcm9wZXJ0aWVzIHw9IDB4MDg7XG5cbiAgICAgICAgICBpZiAoY2hhcmFjdGVyaXN0aWMuc2VjdXJlLmluZGV4T2YoJ3dyaXRlJykgIT09IC0xKSB7XG4gICAgICAgICAgICBzZWN1cmUgfD0gMHgwODtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hhcmFjdGVyaXN0aWMucHJvcGVydGllcy5pbmRleE9mKCdub3RpZnknKSAhPT0gLTEpIHtcbiAgICAgICAgICBwcm9wZXJ0aWVzIHw9IDB4MTA7XG5cbiAgICAgICAgICBpZiAoY2hhcmFjdGVyaXN0aWMuc2VjdXJlLmluZGV4T2YoJ25vdGlmeScpICE9PSAtMSkge1xuICAgICAgICAgICAgc2VjdXJlIHw9IDB4MTA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoYXJhY3RlcmlzdGljLnByb3BlcnRpZXMuaW5kZXhPZignaW5kaWNhdGUnKSAhPT0gLTEpIHtcbiAgICAgICAgICBwcm9wZXJ0aWVzIHw9IDB4MjA7XG5cbiAgICAgICAgICBpZiAoY2hhcmFjdGVyaXN0aWMuc2VjdXJlLmluZGV4T2YoJ2luZGljYXRlJykgIT09IC0xKSB7XG4gICAgICAgICAgICBzZWN1cmUgfD0gMHgyMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBoYW5kbGUrKztcbiAgICAgICAgbGV0IGNoYXJhY3RlcmlzdGljSGFuZGxlID0gaGFuZGxlO1xuXG4gICAgICAgIGhhbmRsZSsrO1xuICAgICAgICBsZXQgY2hhcmFjdGVyaXN0aWNWYWx1ZUhhbmRsZSA9IGhhbmRsZTtcblxuICAgICAgICB0aGlzLl9oYW5kbGVzW2NoYXJhY3RlcmlzdGljSGFuZGxlXSA9IHtcbiAgICAgICAgICB0eXBlOiAnY2hhcmFjdGVyaXN0aWMnLFxuICAgICAgICAgIHV1aWQ6IGNoYXJhY3RlcmlzdGljLnV1aWQsXG4gICAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllcyxcbiAgICAgICAgICBzZWN1cmU6IHNlY3VyZSxcbiAgICAgICAgICBhdHRyaWJ1dGU6IGNoYXJhY3RlcmlzdGljLFxuICAgICAgICAgIHN0YXJ0SGFuZGxlOiBjaGFyYWN0ZXJpc3RpY0hhbmRsZSxcbiAgICAgICAgICB2YWx1ZUhhbmRsZTogY2hhcmFjdGVyaXN0aWNWYWx1ZUhhbmRsZSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9oYW5kbGVzW2NoYXJhY3RlcmlzdGljVmFsdWVIYW5kbGVdID0ge1xuICAgICAgICAgIHR5cGU6ICdjaGFyYWN0ZXJpc3RpY1ZhbHVlJyxcbiAgICAgICAgICBoYW5kbGU6IGNoYXJhY3RlcmlzdGljVmFsdWVIYW5kbGUsXG4gICAgICAgICAgdmFsdWU6IGNoYXJhY3RlcmlzdGljLnZhbHVlLFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBoYXNDQ0NEID0gY2hhcmFjdGVyaXN0aWMuZGVzY3JpcHRvcnMuZmluZChlID0+IGUudXVpZCA9PT0gJzI5MDInKTtcbiAgICAgICAgaWYgKGhhc0NDQ0QgfHwgcHJvcGVydGllcyAmIDB4MzApIHtcbiAgICAgICAgICAvLyBub3RpZnkgb3IgaW5kaWNhdGVcbiAgICAgICAgICAvLyBhZGQgY2xpZW50IGNoYXJhY3RlcmlzdGljIGNvbmZpZ3VyYXRpb24gZGVzY3JpcHRvclxuXG4gICAgICAgICAgaGFuZGxlKys7XG4gICAgICAgICAgbGV0IGNsaWVudENoYXJhY3RlcmlzdGljQ29uZmlndXJhdGlvbkRlc2NyaXB0b3JIYW5kbGUgPSBoYW5kbGU7XG4gICAgICAgICAgdGhpcy5faGFuZGxlc1tjbGllbnRDaGFyYWN0ZXJpc3RpY0NvbmZpZ3VyYXRpb25EZXNjcmlwdG9ySGFuZGxlXSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdkZXNjcmlwdG9yJyxcbiAgICAgICAgICAgIGhhbmRsZTogY2xpZW50Q2hhcmFjdGVyaXN0aWNDb25maWd1cmF0aW9uRGVzY3JpcHRvckhhbmRsZSxcbiAgICAgICAgICAgIHV1aWQ6ICcyOTAyJyxcbiAgICAgICAgICAgIGF0dHJpYnV0ZTogY2hhcmFjdGVyaXN0aWMsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiAweDAyIHwgMHgwNCB8IDB4MDgsIC8vIHJlYWQvd3JpdGVcbiAgICAgICAgICAgIHNlY3VyZTogc2VjdXJlICYgMHgxMCA/IDB4MDIgfCAweDA0IHwgMHgwOCA6IDAsXG4gICAgICAgICAgICB2YWx1ZTogQnVmZmVyLmZyb20oWzB4MDAsIDB4MDBdKSxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBjaGFyYWN0ZXJpc3RpYy5kZXNjcmlwdG9ycy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgIGxldCBkZXNjcmlwdG9yID0gY2hhcmFjdGVyaXN0aWMuZGVzY3JpcHRvcnNba107XG4gICAgICAgICAgaWYgKGRlc2NyaXB0b3IudXVpZCA9PT0gJzI5MDInKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaGFuZGxlKys7XG4gICAgICAgICAgbGV0IGRlc2NyaXB0b3JIYW5kbGUgPSBoYW5kbGU7XG5cbiAgICAgICAgICB0aGlzLl9oYW5kbGVzW2Rlc2NyaXB0b3JIYW5kbGVdID0ge1xuICAgICAgICAgICAgdHlwZTogJ2Rlc2NyaXB0b3InLFxuICAgICAgICAgICAgaGFuZGxlOiBkZXNjcmlwdG9ySGFuZGxlLFxuICAgICAgICAgICAgdXVpZDogZGVzY3JpcHRvci51dWlkLFxuICAgICAgICAgICAgYXR0cmlidXRlOiBkZXNjcmlwdG9yLFxuICAgICAgICAgICAgcHJvcGVydGllczogMHgwMiwgLy8gcmVhZCBvbmx5XG4gICAgICAgICAgICBzZWN1cmU6IDB4MDAsXG4gICAgICAgICAgICB2YWx1ZTogZGVzY3JpcHRvci52YWx1ZSxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2hhbmRsZXNbc2VydmljZUhhbmRsZV0uZW5kSGFuZGxlID0gaGFuZGxlO1xuICAgIH1cblxuICAgIGxldCBkZWJ1Z0hhbmRsZXMgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5faGFuZGxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaGFuZGxlID0gdGhpcy5faGFuZGxlc1tpXTtcblxuICAgICAgZGVidWdIYW5kbGVzW2ldID0ge307XG4gICAgICBmb3IgKGogaW4gaGFuZGxlKSB7XG4gICAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoaGFuZGxlW2pdKSkge1xuICAgICAgICAgIGRlYnVnSGFuZGxlc1tpXVtqXSA9IGhhbmRsZVtqXVxuICAgICAgICAgICAgPyBcIkJ1ZmZlcignXCIgKyBoYW5kbGVbal0udG9TdHJpbmcoJ2hleCcpICsgXCInLCAnaGV4JylcIlxuICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICB9IGVsc2UgaWYgKGogIT09ICdhdHRyaWJ1dGUnKSB7XG4gICAgICAgICAgZGVidWdIYW5kbGVzW2ldW2pdID0gaGFuZGxlW2pdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGVidWcoJ2hhbmRsZXMgPSAnICsgSlNPTi5zdHJpbmdpZnkoZGVidWdIYW5kbGVzLCBudWxsLCAyKSk7XG4gIH1cblxuICBzZXRBY2xTdHJlYW0oYWNsU3RyZWFtKSB7XG4gICAgdGhpcy5fbXR1ID0gMjM7XG4gICAgdGhpcy5fcHJlcGFyZWRXcml0ZVJlcXVlc3QgPSBudWxsO1xuXG4gICAgdGhpcy5fYWNsU3RyZWFtID0gYWNsU3RyZWFtO1xuXG4gICAgdGhpcy5fYWNsU3RyZWFtLm9uKCdkYXRhJywgdGhpcy5vbkFjbFN0cmVhbURhdGFCaW5kZWQpO1xuICAgIHRoaXMuX2FjbFN0cmVhbS5vbignZW5kJywgdGhpcy5vbkFjbFN0cmVhbUVuZEJpbmRlZCk7XG4gIH1cblxuICBvbkFjbFN0cmVhbURhdGEoY2lkLCBkYXRhKSB7XG4gICAgaWYgKGNpZCAhPT0gQVRUX0NJRCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlUmVxdWVzdChkYXRhKTtcbiAgfVxuXG4gIG9uQWNsU3RyZWFtRW5kKCkge1xuICAgIHRoaXMuX2FjbFN0cmVhbS5yZW1vdmVMaXN0ZW5lcignZGF0YScsIHRoaXMub25BY2xTdHJlYW1EYXRhQmluZGVkKTtcbiAgICB0aGlzLl9hY2xTdHJlYW0ucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIHRoaXMub25BY2xTdHJlYW1FbmRCaW5kZWQpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9oYW5kbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuX2hhbmRsZXNbaV0gJiZcbiAgICAgICAgdGhpcy5faGFuZGxlc1tpXS50eXBlID09PSAnZGVzY3JpcHRvcicgJiZcbiAgICAgICAgdGhpcy5faGFuZGxlc1tpXS51dWlkID09PSAnMjkwMicgJiZcbiAgICAgICAgdGhpcy5faGFuZGxlc1tpXS52YWx1ZS5yZWFkVUludDE2TEUoMCkgIT09IDBcbiAgICAgICkge1xuICAgICAgICB0aGlzLl9oYW5kbGVzW2ldLnZhbHVlID0gQnVmZmVyLmZyb20oWzB4MDAsIDB4MDBdKTtcblxuICAgICAgICBpZiAodGhpcy5faGFuZGxlc1tpXS5hdHRyaWJ1dGUgJiYgdGhpcy5faGFuZGxlc1tpXS5hdHRyaWJ1dGUuZW1pdCkge1xuICAgICAgICAgIHRoaXMuX2hhbmRsZXNbaV0uYXR0cmlidXRlLmVtaXQoJ3Vuc3Vic2NyaWJlJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZW5kKGRhdGEpIHtcbiAgICBkZWJ1Zygnc2VuZDogJyArIGRhdGEudG9TdHJpbmcoJ2hleCcpKTtcbiAgICB0aGlzLl9hY2xTdHJlYW0ud3JpdGUoQVRUX0NJRCwgZGF0YSk7XG4gIH1cblxuICBlcnJvclJlc3BvbnNlKG9wY29kZSwgaGFuZGxlLCBzdGF0dXMpIHtcbiAgICBsZXQgYnVmID0gQnVmZmVyLmFsbG9jKDUpO1xuXG4gICAgYnVmLndyaXRlVUludDgoQVRUX09QX0VSUk9SLCAwKTtcbiAgICBidWYud3JpdGVVSW50OChvcGNvZGUsIDEpO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKGhhbmRsZSwgMik7XG4gICAgYnVmLndyaXRlVUludDgoc3RhdHVzLCA0KTtcblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICBoYW5kbGVSZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICBkZWJ1ZygnaGFuZGluZyByZXF1ZXN0OiAnICsgcmVxdWVzdC50b1N0cmluZygnaGV4JykpO1xuXG4gICAgbGV0IHJlcXVlc3RUeXBlID0gcmVxdWVzdFswXTtcbiAgICBsZXQgcmVzcG9uc2UgPSBudWxsO1xuXG4gICAgc3dpdGNoIChyZXF1ZXN0VHlwZSkge1xuICAgICAgY2FzZSBBVFRfT1BfTVRVX1JFUTpcbiAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmhhbmRsZU10dVJlcXVlc3QocmVxdWVzdCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIEFUVF9PUF9GSU5EX0lORk9fUkVROlxuICAgICAgICByZXNwb25zZSA9IHRoaXMuaGFuZGxlRmluZEluZm9SZXF1ZXN0KHJlcXVlc3QpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBBVFRfT1BfRklORF9CWV9UWVBFX1JFUTpcbiAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmhhbmRsZUZpbmRCeVR5cGVSZXF1ZXN0KHJlcXVlc3QpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBBVFRfT1BfUkVBRF9CWV9UWVBFX1JFUTpcbiAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmhhbmRsZVJlYWRCeVR5cGVSZXF1ZXN0KHJlcXVlc3QpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBBVFRfT1BfUkVBRF9SRVE6XG4gICAgICBjYXNlIEFUVF9PUF9SRUFEX0JMT0JfUkVROlxuICAgICAgICByZXNwb25zZSA9IHRoaXMuaGFuZGxlUmVhZE9yUmVhZEJsb2JSZXF1ZXN0KHJlcXVlc3QpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBBVFRfT1BfUkVBRF9CWV9HUk9VUF9SRVE6XG4gICAgICAgIHJlc3BvbnNlID0gdGhpcy5oYW5kbGVSZWFkQnlHcm91cFJlcXVlc3QocmVxdWVzdCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIEFUVF9PUF9XUklURV9SRVE6XG4gICAgICBjYXNlIEFUVF9PUF9XUklURV9DTUQ6XG4gICAgICAgIHJlc3BvbnNlID0gdGhpcy5oYW5kbGVXcml0ZVJlcXVlc3RPckNvbW1hbmQocmVxdWVzdCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIEFUVF9PUF9QUkVQX1dSSVRFX1JFUTpcbiAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmhhbmRsZVByZXBhcmVXcml0ZVJlcXVlc3QocmVxdWVzdCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIEFUVF9PUF9FWEVDX1dSSVRFX1JFUTpcbiAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmhhbmRsZUV4ZWN1dGVXcml0ZVJlcXVlc3QocmVxdWVzdCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIEFUVF9PUF9IQU5ETEVfQ05GOlxuICAgICAgICByZXNwb25zZSA9IHRoaXMuaGFuZGxlQ29uZmlybWF0aW9uKHJlcXVlc3QpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgIGNhc2UgQVRUX09QX1JFQURfTVVMVElfUkVROlxuICAgICAgY2FzZSBBVFRfT1BfU0lHTkVEX1dSSVRFX0NNRDpcbiAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgICAgcmVxdWVzdFR5cGUsXG4gICAgICAgICAgMHgwMDAwLFxuICAgICAgICAgIEFUVF9FQ09ERV9SRVFfTk9UX1NVUFBcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICBkZWJ1ZygncmVzcG9uc2U6ICcgKyByZXNwb25zZS50b1N0cmluZygnaGV4JykpO1xuXG4gICAgICB0aGlzLnNlbmQocmVzcG9uc2UpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU10dVJlcXVlc3QocmVxdWVzdCkge1xuICAgIGxldCBtdHUgPSByZXF1ZXN0LnJlYWRVSW50MTZMRSgxKTtcblxuICAgIGlmIChtdHUgPCAyMykge1xuICAgICAgbXR1ID0gMjM7XG4gICAgfSBlbHNlIGlmIChtdHUgPiB0aGlzLm1heE10dSkge1xuICAgICAgbXR1ID0gdGhpcy5tYXhNdHU7XG4gICAgfVxuXG4gICAgdGhpcy5fbXR1ID0gbXR1O1xuXG4gICAgdGhpcy5lbWl0KCdtdHVDaGFuZ2UnLCB0aGlzLl9tdHUpO1xuXG4gICAgbGV0IHJlc3BvbnNlID0gQnVmZmVyLmFsbG9jKDMpO1xuXG4gICAgcmVzcG9uc2Uud3JpdGVVSW50OChBVFRfT1BfTVRVX1JFU1AsIDApO1xuICAgIHJlc3BvbnNlLndyaXRlVUludDE2TEUobXR1LCAxKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxuXG4gIGhhbmRsZUZpbmRJbmZvUmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgbGV0IHJlc3BvbnNlID0gbnVsbDtcblxuICAgIGxldCBzdGFydEhhbmRsZSA9IHJlcXVlc3QucmVhZFVJbnQxNkxFKDEpO1xuICAgIGxldCBlbmRIYW5kbGUgPSByZXF1ZXN0LnJlYWRVSW50MTZMRSgzKTtcblxuICAgIGxldCBpbmZvcyA9IFtdO1xuICAgIGxldCB1dWlkID0gbnVsbDtcbiAgICBsZXQgaTtcblxuICAgIGZvciAoaSA9IHN0YXJ0SGFuZGxlOyBpIDw9IGVuZEhhbmRsZTsgaSsrKSB7XG4gICAgICBsZXQgaGFuZGxlID0gdGhpcy5faGFuZGxlc1tpXTtcblxuICAgICAgaWYgKCFoYW5kbGUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHV1aWQgPSBudWxsO1xuXG4gICAgICBpZiAoJ3NlcnZpY2UnID09PSBoYW5kbGUudHlwZSkge1xuICAgICAgICB1dWlkID0gJzI4MDAnO1xuICAgICAgfSBlbHNlIGlmICgnaW5jbHVkZWRTZXJ2aWNlJyA9PT0gaGFuZGxlLnR5cGUpIHtcbiAgICAgICAgdXVpZCA9ICcyODAyJztcbiAgICAgIH0gZWxzZSBpZiAoJ2NoYXJhY3RlcmlzdGljJyA9PT0gaGFuZGxlLnR5cGUpIHtcbiAgICAgICAgdXVpZCA9ICcyODAzJztcbiAgICAgIH0gZWxzZSBpZiAoJ2NoYXJhY3RlcmlzdGljVmFsdWUnID09PSBoYW5kbGUudHlwZSkge1xuICAgICAgICB1dWlkID0gdGhpcy5faGFuZGxlc1tpIC0gMV0udXVpZDtcbiAgICAgIH0gZWxzZSBpZiAoJ2Rlc2NyaXB0b3InID09PSBoYW5kbGUudHlwZSkge1xuICAgICAgICB1dWlkID0gaGFuZGxlLnV1aWQ7XG4gICAgICB9XG5cbiAgICAgIGlmICh1dWlkKSB7XG4gICAgICAgIGluZm9zLnB1c2goe1xuICAgICAgICAgIGhhbmRsZTogaSxcbiAgICAgICAgICB1dWlkOiB1dWlkLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaW5mb3MubGVuZ3RoKSB7XG4gICAgICBsZXQgdXVpZFNpemUgPSBpbmZvc1swXS51dWlkLmxlbmd0aCAvIDI7XG4gICAgICBsZXQgbnVtSW5mbyA9IDE7XG5cbiAgICAgIGZvciAoaSA9IDE7IGkgPCBpbmZvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaW5mb3NbMF0udXVpZC5sZW5ndGggIT09IGluZm9zW2ldLnV1aWQubGVuZ3RoKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbnVtSW5mbysrO1xuICAgICAgfVxuXG4gICAgICBsZXQgbGVuZ3RoUGVySW5mbyA9IHV1aWRTaXplID09PSAyID8gNCA6IDE4O1xuICAgICAgbGV0IG1heEluZm8gPSBNYXRoLmZsb29yKCh0aGlzLl9tdHUgLSAyKSAvIGxlbmd0aFBlckluZm8pO1xuICAgICAgbnVtSW5mbyA9IE1hdGgubWluKG51bUluZm8sIG1heEluZm8pO1xuXG4gICAgICByZXNwb25zZSA9IEJ1ZmZlci5hbGxvYygyICsgbnVtSW5mbyAqIGxlbmd0aFBlckluZm8pO1xuXG4gICAgICByZXNwb25zZVswXSA9IEFUVF9PUF9GSU5EX0lORk9fUkVTUDtcbiAgICAgIHJlc3BvbnNlWzFdID0gdXVpZFNpemUgPT09IDIgPyAweDAxIDogMHgyO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtSW5mbzsgaSsrKSB7XG4gICAgICAgIGxldCBpbmZvID0gaW5mb3NbaV07XG5cbiAgICAgICAgcmVzcG9uc2Uud3JpdGVVSW50MTZMRShpbmZvLmhhbmRsZSwgMiArIGkgKiBsZW5ndGhQZXJJbmZvKTtcblxuICAgICAgICB1dWlkID0gQnVmZmVyLmZyb20oXG4gICAgICAgICAgaW5mby51dWlkXG4gICAgICAgICAgICAubWF0Y2goLy57MSwyfS9nKVxuICAgICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgICAgLmpvaW4oJycpLFxuICAgICAgICAgICdoZXgnXG4gICAgICAgICk7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdXVpZC5sZW5ndGg7IGorKykge1xuICAgICAgICAgIHJlc3BvbnNlWzIgKyBpICogbGVuZ3RoUGVySW5mbyArIDIgKyBqXSA9IHV1aWRbal07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgIEFUVF9PUF9GSU5EX0lORk9fUkVRLFxuICAgICAgICBzdGFydEhhbmRsZSxcbiAgICAgICAgQVRUX0VDT0RFX0FUVFJfTk9UX0ZPVU5EXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxuXG4gIGhhbmRsZUZpbmRCeVR5cGVSZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICBsZXQgcmVzcG9uc2UgPSBudWxsO1xuXG4gICAgbGV0IHN0YXJ0SGFuZGxlID0gcmVxdWVzdC5yZWFkVUludDE2TEUoMSk7XG4gICAgbGV0IGVuZEhhbmRsZSA9IHJlcXVlc3QucmVhZFVJbnQxNkxFKDMpO1xuICAgIGxldCB1dWlkID0gcmVxdWVzdFxuICAgICAgLnNsaWNlKDUsIDcpXG4gICAgICAudG9TdHJpbmcoJ2hleCcpXG4gICAgICAubWF0Y2goLy57MSwyfS9nKVxuICAgICAgLnJldmVyc2UoKVxuICAgICAgLmpvaW4oJycpO1xuICAgIGxldCB2YWx1ZSA9IHJlcXVlc3RcbiAgICAgIC5zbGljZSg3KVxuICAgICAgLnRvU3RyaW5nKCdoZXgnKVxuICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC5qb2luKCcnKTtcblxuICAgIGxldCBoYW5kbGVzID0gW107XG4gICAgbGV0IGhhbmRsZTtcblxuICAgIGZvciAobGV0IGkgPSBzdGFydEhhbmRsZTsgaSA8PSBlbmRIYW5kbGU7IGkrKykge1xuICAgICAgaGFuZGxlID0gdGhpcy5faGFuZGxlc1tpXTtcblxuICAgICAgaWYgKCFoYW5kbGUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgJzI4MDAnID09PSB1dWlkICYmXG4gICAgICAgIGhhbmRsZS50eXBlID09PSAnc2VydmljZScgJiZcbiAgICAgICAgaGFuZGxlLnV1aWQgPT09IHZhbHVlXG4gICAgICApIHtcbiAgICAgICAgaGFuZGxlcy5wdXNoKHtcbiAgICAgICAgICBzdGFydDogaGFuZGxlLnN0YXJ0SGFuZGxlLFxuICAgICAgICAgIGVuZDogaGFuZGxlLmVuZEhhbmRsZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhbmRsZXMubGVuZ3RoKSB7XG4gICAgICBsZXQgbGVuZ3RoUGVySGFuZGxlID0gNDtcbiAgICAgIGxldCBudW1IYW5kbGVzID0gaGFuZGxlcy5sZW5ndGg7XG4gICAgICBsZXQgbWF4SGFuZGxlcyA9IE1hdGguZmxvb3IoKHRoaXMuX210dSAtIDEpIC8gbGVuZ3RoUGVySGFuZGxlKTtcblxuICAgICAgbnVtSGFuZGxlcyA9IE1hdGgubWluKG51bUhhbmRsZXMsIG1heEhhbmRsZXMpO1xuXG4gICAgICByZXNwb25zZSA9IEJ1ZmZlci5hbGxvYygxICsgbnVtSGFuZGxlcyAqIGxlbmd0aFBlckhhbmRsZSk7XG5cbiAgICAgIHJlc3BvbnNlWzBdID0gQVRUX09QX0ZJTkRfQllfVFlQRV9SRVNQO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUhhbmRsZXM7IGkrKykge1xuICAgICAgICBoYW5kbGUgPSBoYW5kbGVzW2ldO1xuXG4gICAgICAgIHJlc3BvbnNlLndyaXRlVUludDE2TEUoaGFuZGxlLnN0YXJ0LCAxICsgaSAqIGxlbmd0aFBlckhhbmRsZSk7XG4gICAgICAgIHJlc3BvbnNlLndyaXRlVUludDE2TEUoaGFuZGxlLmVuZCwgMSArIGkgKiBsZW5ndGhQZXJIYW5kbGUgKyAyKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgIEFUVF9PUF9GSU5EX0JZX1RZUEVfUkVRLFxuICAgICAgICBzdGFydEhhbmRsZSxcbiAgICAgICAgQVRUX0VDT0RFX0FUVFJfTk9UX0ZPVU5EXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxuXG4gIGhhbmRsZVJlYWRCeUdyb3VwUmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgbGV0IHJlc3BvbnNlID0gbnVsbDtcblxuICAgIGxldCBzdGFydEhhbmRsZSA9IHJlcXVlc3QucmVhZFVJbnQxNkxFKDEpO1xuICAgIGxldCBlbmRIYW5kbGUgPSByZXF1ZXN0LnJlYWRVSW50MTZMRSgzKTtcbiAgICBsZXQgdXVpZCA9IHJlcXVlc3RcbiAgICAgIC5zbGljZSg1KVxuICAgICAgLnRvU3RyaW5nKCdoZXgnKVxuICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC5qb2luKCcnKTtcblxuICAgIGRlYnVnKFxuICAgICAgJ3JlYWQgYnkgZ3JvdXA6IHN0YXJ0SGFuZGxlID0gMHgnICtcbiAgICAgICAgc3RhcnRIYW5kbGUudG9TdHJpbmcoMTYpICtcbiAgICAgICAgJywgZW5kSGFuZGxlID0gMHgnICtcbiAgICAgICAgZW5kSGFuZGxlLnRvU3RyaW5nKDE2KSArXG4gICAgICAgICcsIHV1aWQgPSAweCcgK1xuICAgICAgICB1dWlkLnRvU3RyaW5nKDE2KVxuICAgICk7XG5cbiAgICBpZiAoJzI4MDAnID09PSB1dWlkIHx8ICcyODAyJyA9PT0gdXVpZCkge1xuICAgICAgbGV0IHNlcnZpY2VzID0gW107XG4gICAgICBsZXQgdHlwZSA9ICcyODAwJyA9PT0gdXVpZCA/ICdzZXJ2aWNlJyA6ICdpbmNsdWRlZFNlcnZpY2UnO1xuICAgICAgbGV0IGk7XG5cbiAgICAgIGZvciAoaSA9IHN0YXJ0SGFuZGxlOyBpIDw9IGVuZEhhbmRsZTsgaSsrKSB7XG4gICAgICAgIGxldCBoYW5kbGUgPSB0aGlzLl9oYW5kbGVzW2ldO1xuXG4gICAgICAgIGlmICghaGFuZGxlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFuZGxlLnR5cGUgPT09IHR5cGUpIHtcbiAgICAgICAgICBzZXJ2aWNlcy5wdXNoKGhhbmRsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNlcnZpY2VzLmxlbmd0aCkge1xuICAgICAgICBsZXQgdXVpZFNpemUgPSBzZXJ2aWNlc1swXS51dWlkLmxlbmd0aCAvIDI7XG4gICAgICAgIGxldCBudW1TZXJ2aWNlcyA9IDE7XG5cbiAgICAgICAgZm9yIChpID0gMTsgaSA8IHNlcnZpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHNlcnZpY2VzWzBdLnV1aWQubGVuZ3RoICE9PSBzZXJ2aWNlc1tpXS51dWlkLmxlbmd0aCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIG51bVNlcnZpY2VzKys7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbGVuZ3RoUGVyU2VydmljZSA9IHV1aWRTaXplID09PSAyID8gNiA6IDIwO1xuICAgICAgICBsZXQgbWF4U2VydmljZXMgPSBNYXRoLmZsb29yKCh0aGlzLl9tdHUgLSAyKSAvIGxlbmd0aFBlclNlcnZpY2UpO1xuICAgICAgICBudW1TZXJ2aWNlcyA9IE1hdGgubWluKG51bVNlcnZpY2VzLCBtYXhTZXJ2aWNlcyk7XG5cbiAgICAgICAgcmVzcG9uc2UgPSBCdWZmZXIuYWxsb2MoMiArIG51bVNlcnZpY2VzICogbGVuZ3RoUGVyU2VydmljZSk7XG5cbiAgICAgICAgcmVzcG9uc2VbMF0gPSBBVFRfT1BfUkVBRF9CWV9HUk9VUF9SRVNQO1xuICAgICAgICByZXNwb25zZVsxXSA9IGxlbmd0aFBlclNlcnZpY2U7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG51bVNlcnZpY2VzOyBpKyspIHtcbiAgICAgICAgICBsZXQgc2VydmljZSA9IHNlcnZpY2VzW2ldO1xuXG4gICAgICAgICAgcmVzcG9uc2Uud3JpdGVVSW50MTZMRShzZXJ2aWNlLnN0YXJ0SGFuZGxlLCAyICsgaSAqIGxlbmd0aFBlclNlcnZpY2UpO1xuICAgICAgICAgIHJlc3BvbnNlLndyaXRlVUludDE2TEUoXG4gICAgICAgICAgICBzZXJ2aWNlLmVuZEhhbmRsZSxcbiAgICAgICAgICAgIDIgKyBpICogbGVuZ3RoUGVyU2VydmljZSArIDJcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgbGV0IHNlcnZpY2VVdWlkID0gQnVmZmVyLmZyb20oXG4gICAgICAgICAgICBzZXJ2aWNlLnV1aWRcbiAgICAgICAgICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgICAgICAuam9pbignJyksXG4gICAgICAgICAgICAnaGV4J1xuICAgICAgICAgICk7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZXJ2aWNlVXVpZC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgcmVzcG9uc2VbMiArIGkgKiBsZW5ndGhQZXJTZXJ2aWNlICsgNCArIGpdID0gc2VydmljZVV1aWRbal07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNwb25zZSA9IHRoaXMuZXJyb3JSZXNwb25zZShcbiAgICAgICAgICBBVFRfT1BfUkVBRF9CWV9HUk9VUF9SRVEsXG4gICAgICAgICAgc3RhcnRIYW5kbGUsXG4gICAgICAgICAgQVRUX0VDT0RFX0FUVFJfTk9UX0ZPVU5EXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3BvbnNlID0gdGhpcy5lcnJvclJlc3BvbnNlKFxuICAgICAgICBBVFRfT1BfUkVBRF9CWV9HUk9VUF9SRVEsXG4gICAgICAgIHN0YXJ0SGFuZGxlLFxuICAgICAgICBBVFRfRUNPREVfVU5TVVBQX0dSUF9UWVBFXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxuXG4gIGhhbmRsZVJlYWRCeVR5cGVSZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICBsZXQgcmVzcG9uc2UgPSBudWxsO1xuICAgIGxldCByZXF1ZXN0VHlwZSA9IHJlcXVlc3RbMF07XG5cbiAgICBsZXQgc3RhcnRIYW5kbGUgPSByZXF1ZXN0LnJlYWRVSW50MTZMRSgxKTtcbiAgICBsZXQgZW5kSGFuZGxlID0gcmVxdWVzdC5yZWFkVUludDE2TEUoMyk7XG4gICAgbGV0IHV1aWQgPSByZXF1ZXN0XG4gICAgICAuc2xpY2UoNSlcbiAgICAgIC50b1N0cmluZygnaGV4JylcbiAgICAgIC5tYXRjaCgvLnsxLDJ9L2cpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAuam9pbignJyk7XG4gICAgbGV0IGk7XG4gICAgbGV0IGhhbmRsZTtcblxuICAgIGRlYnVnKFxuICAgICAgJ3JlYWQgYnkgdHlwZTogc3RhcnRIYW5kbGUgPSAweCcgK1xuICAgICAgICBzdGFydEhhbmRsZS50b1N0cmluZygxNikgK1xuICAgICAgICAnLCBlbmRIYW5kbGUgPSAweCcgK1xuICAgICAgICBlbmRIYW5kbGUudG9TdHJpbmcoMTYpICtcbiAgICAgICAgJywgdXVpZCA9IDB4JyArXG4gICAgICAgIHV1aWQudG9TdHJpbmcoMTYpXG4gICAgKTtcblxuICAgIGlmICgnMjgwMycgPT09IHV1aWQpIHtcbiAgICAgIGxldCBjaGFyYWN0ZXJpc3RpY3MgPSBbXTtcblxuICAgICAgZm9yIChpID0gc3RhcnRIYW5kbGU7IGkgPD0gZW5kSGFuZGxlOyBpKyspIHtcbiAgICAgICAgaGFuZGxlID0gdGhpcy5faGFuZGxlc1tpXTtcblxuICAgICAgICBpZiAoIWhhbmRsZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhbmRsZS50eXBlID09PSAnY2hhcmFjdGVyaXN0aWMnKSB7XG4gICAgICAgICAgY2hhcmFjdGVyaXN0aWNzLnB1c2goaGFuZGxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY2hhcmFjdGVyaXN0aWNzLmxlbmd0aCkge1xuICAgICAgICBsZXQgdXVpZFNpemUgPSBjaGFyYWN0ZXJpc3RpY3NbMF0udXVpZC5sZW5ndGggLyAyO1xuICAgICAgICBsZXQgbnVtQ2hhcmFjdGVyaXN0aWNzID0gMTtcblxuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgY2hhcmFjdGVyaXN0aWNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNzWzBdLnV1aWQubGVuZ3RoICE9PSBjaGFyYWN0ZXJpc3RpY3NbaV0udXVpZC5sZW5ndGhcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBudW1DaGFyYWN0ZXJpc3RpY3MrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBsZW5ndGhQZXJDaGFyYWN0ZXJpc3RpYyA9IHV1aWRTaXplID09PSAyID8gNyA6IDIxO1xuICAgICAgICBsZXQgbWF4Q2hhcmFjdGVyaXN0aWNzID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAodGhpcy5fbXR1IC0gMikgLyBsZW5ndGhQZXJDaGFyYWN0ZXJpc3RpY1xuICAgICAgICApO1xuICAgICAgICBudW1DaGFyYWN0ZXJpc3RpY3MgPSBNYXRoLm1pbihudW1DaGFyYWN0ZXJpc3RpY3MsIG1heENoYXJhY3RlcmlzdGljcyk7XG5cbiAgICAgICAgcmVzcG9uc2UgPSBCdWZmZXIuYWxsb2MoXG4gICAgICAgICAgMiArIG51bUNoYXJhY3RlcmlzdGljcyAqIGxlbmd0aFBlckNoYXJhY3RlcmlzdGljXG4gICAgICAgICk7XG5cbiAgICAgICAgcmVzcG9uc2VbMF0gPSBBVFRfT1BfUkVBRF9CWV9UWVBFX1JFU1A7XG4gICAgICAgIHJlc3BvbnNlWzFdID0gbGVuZ3RoUGVyQ2hhcmFjdGVyaXN0aWM7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG51bUNoYXJhY3RlcmlzdGljczsgaSsrKSB7XG4gICAgICAgICAgbGV0IGNoYXJhY3RlcmlzdGljID0gY2hhcmFjdGVyaXN0aWNzW2ldO1xuXG4gICAgICAgICAgcmVzcG9uc2Uud3JpdGVVSW50MTZMRShcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljLnN0YXJ0SGFuZGxlLFxuICAgICAgICAgICAgMiArIGkgKiBsZW5ndGhQZXJDaGFyYWN0ZXJpc3RpY1xuICAgICAgICAgICk7XG4gICAgICAgICAgcmVzcG9uc2Uud3JpdGVVSW50OChcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljLnByb3BlcnRpZXMsXG4gICAgICAgICAgICAyICsgaSAqIGxlbmd0aFBlckNoYXJhY3RlcmlzdGljICsgMlxuICAgICAgICAgICk7XG4gICAgICAgICAgcmVzcG9uc2Uud3JpdGVVSW50MTZMRShcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljLnZhbHVlSGFuZGxlLFxuICAgICAgICAgICAgMiArIGkgKiBsZW5ndGhQZXJDaGFyYWN0ZXJpc3RpYyArIDNcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgbGV0IGNoYXJhY3RlcmlzdGljVXVpZCA9IEJ1ZmZlci5mcm9tKFxuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWMudXVpZFxuICAgICAgICAgICAgICAubWF0Y2goLy57MSwyfS9nKVxuICAgICAgICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgICAgICAgIC5qb2luKCcnKSxcbiAgICAgICAgICAgICdoZXgnXG4gICAgICAgICAgKTtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNoYXJhY3RlcmlzdGljVXVpZC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgcmVzcG9uc2VbMiArIGkgKiBsZW5ndGhQZXJDaGFyYWN0ZXJpc3RpYyArIDUgKyBqXSA9XG4gICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljVXVpZFtqXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3BvbnNlID0gdGhpcy5lcnJvclJlc3BvbnNlKFxuICAgICAgICAgIEFUVF9PUF9SRUFEX0JZX1RZUEVfUkVRLFxuICAgICAgICAgIHN0YXJ0SGFuZGxlLFxuICAgICAgICAgIEFUVF9FQ09ERV9BVFRSX05PVF9GT1VORFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaGFuZGxlQXR0cmlidXRlID0gbnVsbDtcbiAgICAgIGxldCB2YWx1ZUhhbmRsZSA9IG51bGw7XG4gICAgICBsZXQgc2VjdXJlID0gZmFsc2U7XG5cbiAgICAgIGZvciAoaSA9IHN0YXJ0SGFuZGxlOyBpIDw9IGVuZEhhbmRsZTsgaSsrKSB7XG4gICAgICAgIGhhbmRsZSA9IHRoaXMuX2hhbmRsZXNbaV07XG5cbiAgICAgICAgaWYgKCFoYW5kbGUpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYW5kbGUudHlwZSA9PT0gJ2NoYXJhY3RlcmlzdGljJyAmJiBoYW5kbGUudXVpZCA9PT0gdXVpZCkge1xuICAgICAgICAgIGhhbmRsZUF0dHJpYnV0ZSA9IGhhbmRsZS5hdHRyaWJ1dGU7XG4gICAgICAgICAgdmFsdWVIYW5kbGUgPSBoYW5kbGUudmFsdWVIYW5kbGU7XG4gICAgICAgICAgc2VjdXJlID0gaGFuZGxlLnNlY3VyZSAmIDB4MDI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSBpZiAoaGFuZGxlLnR5cGUgPT09ICdkZXNjcmlwdG9yJyAmJiBoYW5kbGUudXVpZCA9PT0gdXVpZCkge1xuICAgICAgICAgIHZhbHVlSGFuZGxlID0gaTtcbiAgICAgICAgICBzZWN1cmUgPSBoYW5kbGUuc2VjdXJlICYgMHgwMjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc2VjdXJlICYmICF0aGlzLl9hY2xTdHJlYW0uZW5jcnlwdGVkKSB7XG4gICAgICAgIHJlc3BvbnNlID0gdGhpcy5lcnJvclJlc3BvbnNlKFxuICAgICAgICAgIEFUVF9PUF9SRUFEX0JZX1RZUEVfUkVRLFxuICAgICAgICAgIHN0YXJ0SGFuZGxlLFxuICAgICAgICAgIEFUVF9FQ09ERV9BVVRIRU5USUNBVElPTlxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZUhhbmRsZSkge1xuICAgICAgICBsZXQgY2FsbGJhY2sgPSBmdW5jdGlvbih2YWx1ZUhhbmRsZSkge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihyZXN1bHQsIGRhdGEpIHtcbiAgICAgICAgICAgIGxldCBjYWxsYmFja1Jlc3BvbnNlID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKEFUVF9FQ09ERV9TVUNDRVNTID09PSByZXN1bHQpIHtcbiAgICAgICAgICAgICAgbGV0IGRhdGFMZW5ndGggPSBNYXRoLm1pbihkYXRhLmxlbmd0aCwgdGhpcy5fbXR1IC0gNCk7XG4gICAgICAgICAgICAgIGNhbGxiYWNrUmVzcG9uc2UgPSBCdWZmZXIuYWxsb2MoNCArIGRhdGFMZW5ndGgpO1xuXG4gICAgICAgICAgICAgIGNhbGxiYWNrUmVzcG9uc2VbMF0gPSBBVFRfT1BfUkVBRF9CWV9UWVBFX1JFU1A7XG4gICAgICAgICAgICAgIGNhbGxiYWNrUmVzcG9uc2VbMV0gPSBkYXRhTGVuZ3RoICsgMjtcbiAgICAgICAgICAgICAgY2FsbGJhY2tSZXNwb25zZS53cml0ZVVJbnQxNkxFKHZhbHVlSGFuZGxlLCAyKTtcbiAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGRhdGFMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrUmVzcG9uc2VbNCArIGldID0gZGF0YVtpXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2tSZXNwb25zZSA9IHRoaXMuZXJyb3JSZXNwb25zZShcbiAgICAgICAgICAgICAgICByZXF1ZXN0VHlwZSxcbiAgICAgICAgICAgICAgICB2YWx1ZUhhbmRsZSxcbiAgICAgICAgICAgICAgICByZXN1bHRcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGVidWcoJ3JlYWQgYnkgdHlwZSByZXNwb25zZTogJyArIGNhbGxiYWNrUmVzcG9uc2UudG9TdHJpbmcoJ2hleCcpKTtcblxuICAgICAgICAgICAgdGhpcy5zZW5kKGNhbGxiYWNrUmVzcG9uc2UpO1xuICAgICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKHZhbHVlSGFuZGxlKTtcblxuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuX2hhbmRsZXNbdmFsdWVIYW5kbGVdLnZhbHVlO1xuXG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgY2FsbGJhY2soQVRUX0VDT0RFX1NVQ0NFU1MsIGRhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKGhhbmRsZUF0dHJpYnV0ZSkge1xuICAgICAgICAgIGhhbmRsZUF0dHJpYnV0ZS5lbWl0KCdyZWFkUmVxdWVzdCcsIDAsIGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhBVFRfRUNPREVfVU5MSUtFTFkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNwb25zZSA9IHRoaXMuZXJyb3JSZXNwb25zZShcbiAgICAgICAgICBBVFRfT1BfUkVBRF9CWV9UWVBFX1JFUSxcbiAgICAgICAgICBzdGFydEhhbmRsZSxcbiAgICAgICAgICBBVFRfRUNPREVfQVRUUl9OT1RfRk9VTkRcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH1cblxuICBoYW5kbGVSZWFkT3JSZWFkQmxvYlJlcXVlc3QocmVxdWVzdCkge1xuICAgIGxldCByZXNwb25zZSA9IG51bGw7XG5cbiAgICBsZXQgcmVxdWVzdFR5cGUgPSByZXF1ZXN0WzBdO1xuICAgIGxldCB2YWx1ZUhhbmRsZSA9IHJlcXVlc3QucmVhZFVJbnQxNkxFKDEpO1xuICAgIGxldCBvZmZzZXQgPVxuICAgICAgcmVxdWVzdFR5cGUgPT09IEFUVF9PUF9SRUFEX0JMT0JfUkVRID8gcmVxdWVzdC5yZWFkVUludDE2TEUoMykgOiAwO1xuXG4gICAgbGV0IGhhbmRsZSA9IHRoaXMuX2hhbmRsZXNbdmFsdWVIYW5kbGVdO1xuICAgIGxldCBpO1xuXG4gICAgaWYgKGhhbmRsZSkge1xuICAgICAgbGV0IHJlc3VsdCA9IG51bGw7XG4gICAgICBsZXQgZGF0YSA9IG51bGw7XG4gICAgICBsZXQgaGFuZGxlVHlwZSA9IGhhbmRsZS50eXBlO1xuXG4gICAgICBsZXQgY2FsbGJhY2sgPSBmdW5jdGlvbihyZXF1ZXN0VHlwZSwgdmFsdWVIYW5kbGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHJlc3VsdCwgZGF0YSkge1xuICAgICAgICAgIGxldCBjYWxsYmFja1Jlc3BvbnNlID0gbnVsbDtcblxuICAgICAgICAgIGlmIChBVFRfRUNPREVfU1VDQ0VTUyA9PT0gcmVzdWx0KSB7XG4gICAgICAgICAgICBsZXQgZGF0YUxlbmd0aCA9IE1hdGgubWluKGRhdGEubGVuZ3RoLCB0aGlzLl9tdHUgLSAxKTtcbiAgICAgICAgICAgIGNhbGxiYWNrUmVzcG9uc2UgPSBCdWZmZXIuYWxsb2MoMSArIGRhdGFMZW5ndGgpO1xuXG4gICAgICAgICAgICBjYWxsYmFja1Jlc3BvbnNlWzBdID1cbiAgICAgICAgICAgICAgcmVxdWVzdFR5cGUgPT09IEFUVF9PUF9SRUFEX0JMT0JfUkVRXG4gICAgICAgICAgICAgICAgPyBBVFRfT1BfUkVBRF9CTE9CX1JFU1BcbiAgICAgICAgICAgICAgICA6IEFUVF9PUF9SRUFEX1JFU1A7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YUxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrUmVzcG9uc2VbMSArIGldID0gZGF0YVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2tSZXNwb25zZSA9IHRoaXMuZXJyb3JSZXNwb25zZShcbiAgICAgICAgICAgICAgcmVxdWVzdFR5cGUsXG4gICAgICAgICAgICAgIHZhbHVlSGFuZGxlLFxuICAgICAgICAgICAgICByZXN1bHRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGVidWcoJ3JlYWQgcmVzcG9uc2U6ICcgKyBjYWxsYmFja1Jlc3BvbnNlLnRvU3RyaW5nKCdoZXgnKSk7XG5cbiAgICAgICAgICB0aGlzLnNlbmQoY2FsbGJhY2tSZXNwb25zZSk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgIH0uYmluZCh0aGlzKShyZXF1ZXN0VHlwZSwgdmFsdWVIYW5kbGUpO1xuXG4gICAgICBpZiAoaGFuZGxlVHlwZSA9PT0gJ3NlcnZpY2UnIHx8IGhhbmRsZVR5cGUgPT09ICdpbmNsdWRlZFNlcnZpY2UnKSB7XG4gICAgICAgIHJlc3VsdCA9IEFUVF9FQ09ERV9TVUNDRVNTO1xuICAgICAgICBkYXRhID0gQnVmZmVyLmZyb20oXG4gICAgICAgICAgaGFuZGxlLnV1aWRcbiAgICAgICAgICAgIC5tYXRjaCgvLnsxLDJ9L2cpXG4gICAgICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgICAgICAuam9pbignJyksXG4gICAgICAgICAgJ2hleCdcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoaGFuZGxlVHlwZSA9PT0gJ2NoYXJhY3RlcmlzdGljJykge1xuICAgICAgICBsZXQgdXVpZCA9IEJ1ZmZlci5mcm9tKFxuICAgICAgICAgIGhhbmRsZS51dWlkXG4gICAgICAgICAgICAubWF0Y2goLy57MSwyfS9nKVxuICAgICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgICAgLmpvaW4oJycpLFxuICAgICAgICAgICdoZXgnXG4gICAgICAgICk7XG5cbiAgICAgICAgcmVzdWx0ID0gQVRUX0VDT0RFX1NVQ0NFU1M7XG4gICAgICAgIGRhdGEgPSBCdWZmZXIuYWxsb2MoMyArIHV1aWQubGVuZ3RoKTtcbiAgICAgICAgZGF0YS53cml0ZVVJbnQ4KGhhbmRsZS5wcm9wZXJ0aWVzLCAwKTtcbiAgICAgICAgZGF0YS53cml0ZVVJbnQxNkxFKGhhbmRsZS52YWx1ZUhhbmRsZSwgMSk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHV1aWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBkYXRhW2kgKyAzXSA9IHV1aWRbaV07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGhhbmRsZVR5cGUgPT09ICdjaGFyYWN0ZXJpc3RpY1ZhbHVlJyB8fFxuICAgICAgICBoYW5kbGVUeXBlID09PSAnZGVzY3JpcHRvcidcbiAgICAgICkge1xuICAgICAgICBsZXQgaGFuZGxlUHJvcGVydGllcyA9IGhhbmRsZS5wcm9wZXJ0aWVzO1xuICAgICAgICBsZXQgaGFuZGxlU2VjdXJlID0gaGFuZGxlLnNlY3VyZTtcbiAgICAgICAgbGV0IGhhbmRsZUF0dHJpYnV0ZSA9IGhhbmRsZS5hdHRyaWJ1dGU7XG4gICAgICAgIGlmIChoYW5kbGVUeXBlID09PSAnY2hhcmFjdGVyaXN0aWNWYWx1ZScpIHtcbiAgICAgICAgICBoYW5kbGVQcm9wZXJ0aWVzID0gdGhpcy5faGFuZGxlc1t2YWx1ZUhhbmRsZSAtIDFdLnByb3BlcnRpZXM7XG4gICAgICAgICAgaGFuZGxlU2VjdXJlID0gdGhpcy5faGFuZGxlc1t2YWx1ZUhhbmRsZSAtIDFdLnNlY3VyZTtcbiAgICAgICAgICBoYW5kbGVBdHRyaWJ1dGUgPSB0aGlzLl9oYW5kbGVzW3ZhbHVlSGFuZGxlIC0gMV0uYXR0cmlidXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhbmRsZVByb3BlcnRpZXMgJiAweDAyKSB7XG4gICAgICAgICAgaWYgKGhhbmRsZVNlY3VyZSAmIDB4MDIgJiYgIXRoaXMuX2FjbFN0cmVhbS5lbmNyeXB0ZWQpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IEFUVF9FQ09ERV9BVVRIRU5USUNBVElPTjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YSA9IGhhbmRsZS52YWx1ZTtcblxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gQVRUX0VDT0RFX1NVQ0NFU1M7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBoYW5kbGVBdHRyaWJ1dGUuZW1pdCgncmVhZFJlcXVlc3QnLCBvZmZzZXQsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0ID0gQVRUX0VDT0RFX1JFQURfTk9UX1BFUk07IC8vIG5vbi1yZWFkYWJsZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChkYXRhICYmIHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICBkYXRhID0gQnVmZmVyLmFsbG9jKGRhdGEpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzdWx0ID09PSBBVFRfRUNPREVfU1VDQ0VTUyAmJiBkYXRhICYmIG9mZnNldCkge1xuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPCBvZmZzZXQpIHtcbiAgICAgICAgICByZXN1bHQgPSBBVFRfRUNPREVfSU5WQUxJRF9PRkZTRVQ7XG4gICAgICAgICAgZGF0YSA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGF0YSA9IGRhdGEuc2xpY2Uob2Zmc2V0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgIGNhbGxiYWNrKHJlc3VsdCwgZGF0YSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3BvbnNlID0gdGhpcy5lcnJvclJlc3BvbnNlKFxuICAgICAgICByZXF1ZXN0VHlwZSxcbiAgICAgICAgdmFsdWVIYW5kbGUsXG4gICAgICAgIEFUVF9FQ09ERV9JTlZBTElEX0hBTkRMRVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH1cblxuICBoYW5kbGVXcml0ZVJlcXVlc3RPckNvbW1hbmQocmVxdWVzdCkge1xuICAgIGxldCByZXNwb25zZSA9IG51bGw7XG5cbiAgICBsZXQgcmVxdWVzdFR5cGUgPSByZXF1ZXN0WzBdO1xuICAgIGxldCB3aXRob3V0UmVzcG9uc2UgPSByZXF1ZXN0VHlwZSA9PT0gQVRUX09QX1dSSVRFX0NNRDtcbiAgICBsZXQgdmFsdWVIYW5kbGUgPSByZXF1ZXN0LnJlYWRVSW50MTZMRSgxKTtcbiAgICBsZXQgZGF0YSA9IHJlcXVlc3Quc2xpY2UoMyk7XG4gICAgbGV0IG9mZnNldCA9IDA7XG5cbiAgICBsZXQgaGFuZGxlID0gdGhpcy5faGFuZGxlc1t2YWx1ZUhhbmRsZV07XG5cbiAgICBpZiAoaGFuZGxlKSB7XG4gICAgICBpZiAoaGFuZGxlLnR5cGUgPT09ICdjaGFyYWN0ZXJpc3RpY1ZhbHVlJykge1xuICAgICAgICBoYW5kbGUgPSB0aGlzLl9oYW5kbGVzW3ZhbHVlSGFuZGxlIC0gMV07XG4gICAgICB9XG5cbiAgICAgIGxldCBoYW5kbGVQcm9wZXJ0aWVzID0gaGFuZGxlLnByb3BlcnRpZXM7XG4gICAgICBsZXQgaGFuZGxlU2VjdXJlID0gaGFuZGxlLnNlY3VyZTtcblxuICAgICAgaWYgKFxuICAgICAgICBoYW5kbGVQcm9wZXJ0aWVzICYmXG4gICAgICAgICh3aXRob3V0UmVzcG9uc2UgPyBoYW5kbGVQcm9wZXJ0aWVzICYgMHgwNCA6IGhhbmRsZVByb3BlcnRpZXMgJiAweDA4KVxuICAgICAgKSB7XG4gICAgICAgIGxldCBjYWxsYmFjayA9IGZ1bmN0aW9uKHJlcXVlc3RUeXBlLCB2YWx1ZUhhbmRsZSwgd2l0aG91dFJlc3BvbnNlKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKCF3aXRob3V0UmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgbGV0IGNhbGxiYWNrUmVzcG9uc2UgPSBudWxsO1xuXG4gICAgICAgICAgICAgIGlmIChBVFRfRUNPREVfU1VDQ0VTUyA9PT0gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tSZXNwb25zZSA9IEJ1ZmZlci5mcm9tKFtBVFRfT1BfV1JJVEVfUkVTUF0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrUmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgICAgICAgICAgICByZXF1ZXN0VHlwZSxcbiAgICAgICAgICAgICAgICAgIHZhbHVlSGFuZGxlLFxuICAgICAgICAgICAgICAgICAgcmVzdWx0XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGRlYnVnKCd3cml0ZSByZXNwb25zZTogJyArIGNhbGxiYWNrUmVzcG9uc2UudG9TdHJpbmcoJ2hleCcpKTtcblxuICAgICAgICAgICAgICB0aGlzLnNlbmQoY2FsbGJhY2tSZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICB9LmJpbmQodGhpcykocmVxdWVzdFR5cGUsIHZhbHVlSGFuZGxlLCB3aXRob3V0UmVzcG9uc2UpO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBoYW5kbGVTZWN1cmUgJiAod2l0aG91dFJlc3BvbnNlID8gMHgwNCA6IDB4MDgpICYmXG4gICAgICAgICAgIXRoaXMuX2FjbFN0cmVhbS5lbmNyeXB0ZWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgICAgICByZXF1ZXN0VHlwZSxcbiAgICAgICAgICAgIHZhbHVlSGFuZGxlLFxuICAgICAgICAgICAgQVRUX0VDT0RFX0FVVEhFTlRJQ0FUSU9OXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChoYW5kbGUudHlwZSA9PT0gJ2Rlc2NyaXB0b3InIHx8IGhhbmRsZS51dWlkID09PSAnMjkwMicpIHtcbiAgICAgICAgICBsZXQgcmVzdWx0ID0gbnVsbDtcblxuICAgICAgICAgIGlmIChkYXRhLmxlbmd0aCAhPT0gMikge1xuICAgICAgICAgICAgcmVzdWx0ID0gQVRUX0VDT0RFX0lOVkFMX0FUVFJfVkFMVUVfTEVOO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBkYXRhLnJlYWRVSW50MTZMRSgwKTtcbiAgICAgICAgICAgIGxldCBoYW5kbGVBdHRyaWJ1dGUgPSBoYW5kbGUuYXR0cmlidXRlO1xuXG4gICAgICAgICAgICBoYW5kbGUudmFsdWUgPSBkYXRhO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgJiAweDAwMDMpIHtcbiAgICAgICAgICAgICAgbGV0IHVwZGF0ZVZhbHVlQ2FsbGJhY2sgPSBmdW5jdGlvbih2YWx1ZUhhbmRsZSwgYXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgIGxldCBkYXRhTGVuZ3RoID0gTWF0aC5taW4oZGF0YS5sZW5ndGgsIHRoaXMuX210dSAtIDMpO1xuICAgICAgICAgICAgICAgICAgbGV0IHVzZU5vdGlmeSA9IGF0dHJpYnV0ZS5wcm9wZXJ0aWVzLmluZGV4T2YoJ25vdGlmeScpICE9PSAtMTtcbiAgICAgICAgICAgICAgICAgIGxldCB1c2VJbmRpY2F0ZSA9XG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5wcm9wZXJ0aWVzLmluZGV4T2YoJ2luZGljYXRlJykgIT09IC0xO1xuICAgICAgICAgICAgICAgICAgbGV0IGk7XG5cbiAgICAgICAgICAgICAgICAgIGlmICh1c2VOb3RpZnkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vdGlmeU1lc3NhZ2UgPSBCdWZmZXIuYWxsb2MoMyArIGRhdGFMZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgICAgIG5vdGlmeU1lc3NhZ2Uud3JpdGVVSW50OChBVFRfT1BfSEFORExFX05PVElGWSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIG5vdGlmeU1lc3NhZ2Uud3JpdGVVSW50MTZMRSh2YWx1ZUhhbmRsZSwgMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGRhdGFMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgIG5vdGlmeU1lc3NhZ2VbMyArIGldID0gZGF0YVtpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKCdub3RpZnkgbWVzc2FnZTogJyArIG5vdGlmeU1lc3NhZ2UudG9TdHJpbmcoJ2hleCcpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kKG5vdGlmeU1lc3NhZ2UpO1xuXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5lbWl0KCdub3RpZnknKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodXNlSW5kaWNhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZGljYXRlTWVzc2FnZSA9IEJ1ZmZlci5hbGxvYygzICsgZGF0YUxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaW5kaWNhdGVNZXNzYWdlLndyaXRlVUludDgoQVRUX09QX0hBTkRMRV9JTkQsIDApO1xuICAgICAgICAgICAgICAgICAgICBpbmRpY2F0ZU1lc3NhZ2Uud3JpdGVVSW50MTZMRSh2YWx1ZUhhbmRsZSwgMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGRhdGFMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgIGluZGljYXRlTWVzc2FnZVszICsgaV0gPSBkYXRhW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGFzdEluZGljYXRlZEF0dHJpYnV0ZSA9IGF0dHJpYnV0ZTtcblxuICAgICAgICAgICAgICAgICAgICBkZWJ1ZyhcbiAgICAgICAgICAgICAgICAgICAgICAnaW5kaWNhdGUgbWVzc2FnZTogJyArIGluZGljYXRlTWVzc2FnZS50b1N0cmluZygnaGV4JylcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kKGluZGljYXRlTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICB9LmJpbmQodGhpcykodmFsdWVIYW5kbGUgLSAxLCBoYW5kbGVBdHRyaWJ1dGUpO1xuXG4gICAgICAgICAgICAgIGlmIChoYW5kbGVBdHRyaWJ1dGUuZW1pdCkge1xuICAgICAgICAgICAgICAgIGhhbmRsZUF0dHJpYnV0ZS5lbWl0KFxuICAgICAgICAgICAgICAgICAgJ3N1YnNjcmliZScsXG4gICAgICAgICAgICAgICAgICB0aGlzLl9tdHUgLSAzLFxuICAgICAgICAgICAgICAgICAgdXBkYXRlVmFsdWVDYWxsYmFja1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGhhbmRsZUF0dHJpYnV0ZS5lbWl0KCd1bnN1YnNjcmliZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXN1bHQgPSBBVFRfRUNPREVfU1VDQ0VTUztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjYWxsYmFjayhyZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhhbmRsZS5hdHRyaWJ1dGUuZW1pdChcbiAgICAgICAgICAgICd3cml0ZVJlcXVlc3QnLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIG9mZnNldCxcbiAgICAgICAgICAgIHdpdGhvdXRSZXNwb25zZSxcbiAgICAgICAgICAgIGNhbGxiYWNrXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgICAgcmVxdWVzdFR5cGUsXG4gICAgICAgICAgdmFsdWVIYW5kbGUsXG4gICAgICAgICAgQVRUX0VDT0RFX1dSSVRFX05PVF9QRVJNXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3BvbnNlID0gdGhpcy5lcnJvclJlc3BvbnNlKFxuICAgICAgICByZXF1ZXN0VHlwZSxcbiAgICAgICAgdmFsdWVIYW5kbGUsXG4gICAgICAgIEFUVF9FQ09ERV9JTlZBTElEX0hBTkRMRVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH1cblxuICBoYW5kbGVQcmVwYXJlV3JpdGVSZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICBsZXQgcmVzcG9uc2UgPSBudWxsO1xuXG4gICAgbGV0IHJlcXVlc3RUeXBlID0gcmVxdWVzdFswXTtcbiAgICBsZXQgdmFsdWVIYW5kbGUgPSByZXF1ZXN0LnJlYWRVSW50MTZMRSgxKTtcbiAgICBsZXQgb2Zmc2V0ID0gcmVxdWVzdC5yZWFkVUludDE2TEUoMyk7XG4gICAgbGV0IGRhdGEgPSByZXF1ZXN0LnNsaWNlKDUpO1xuXG4gICAgbGV0IGhhbmRsZSA9IHRoaXMuX2hhbmRsZXNbdmFsdWVIYW5kbGVdO1xuXG4gICAgaWYgKGhhbmRsZSkge1xuICAgICAgaWYgKGhhbmRsZS50eXBlID09PSAnY2hhcmFjdGVyaXN0aWNWYWx1ZScpIHtcbiAgICAgICAgaGFuZGxlID0gdGhpcy5faGFuZGxlc1t2YWx1ZUhhbmRsZSAtIDFdO1xuXG4gICAgICAgIGxldCBoYW5kbGVQcm9wZXJ0aWVzID0gaGFuZGxlLnByb3BlcnRpZXM7XG4gICAgICAgIGxldCBoYW5kbGVTZWN1cmUgPSBoYW5kbGUuc2VjdXJlO1xuXG4gICAgICAgIGlmIChoYW5kbGVQcm9wZXJ0aWVzICYmIGhhbmRsZVByb3BlcnRpZXMgJiAweDA4KSB7XG4gICAgICAgICAgaWYgKGhhbmRsZVNlY3VyZSAmIDB4MDggJiYgIXRoaXMuX2FjbFN0cmVhbS5lbmNyeXB0ZWQpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0gdGhpcy5lcnJvclJlc3BvbnNlKFxuICAgICAgICAgICAgICByZXF1ZXN0VHlwZSxcbiAgICAgICAgICAgICAgdmFsdWVIYW5kbGUsXG4gICAgICAgICAgICAgIEFUVF9FQ09ERV9BVVRIRU5USUNBVElPTlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3ByZXBhcmVkV3JpdGVSZXF1ZXN0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcHJlcGFyZWRXcml0ZVJlcXVlc3QuaGFuZGxlICE9PSBoYW5kbGUpIHtcbiAgICAgICAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgICAgICAgICAgcmVxdWVzdFR5cGUsXG4gICAgICAgICAgICAgICAgdmFsdWVIYW5kbGUsXG4gICAgICAgICAgICAgICAgQVRUX0VDT0RFX1VOTElLRUxZXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICBvZmZzZXQgPT09XG4gICAgICAgICAgICAgIHRoaXMuX3ByZXBhcmVkV3JpdGVSZXF1ZXN0Lm9mZnNldCArXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlcGFyZWRXcml0ZVJlcXVlc3QuZGF0YS5sZW5ndGhcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICB0aGlzLl9wcmVwYXJlZFdyaXRlUmVxdWVzdC5kYXRhID0gQnVmZmVyLmNvbmNhdChbXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlcGFyZWRXcml0ZVJlcXVlc3QuZGF0YSxcbiAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgICByZXNwb25zZSA9IEJ1ZmZlci5hbGxvYyhyZXF1ZXN0Lmxlbmd0aCk7XG4gICAgICAgICAgICAgIHJlcXVlc3QuY29weShyZXNwb25zZSk7XG4gICAgICAgICAgICAgIHJlc3BvbnNlWzBdID0gQVRUX09QX1BSRVBfV1JJVEVfUkVTUDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3BvbnNlID0gdGhpcy5lcnJvclJlc3BvbnNlKFxuICAgICAgICAgICAgICAgIHJlcXVlc3RUeXBlLFxuICAgICAgICAgICAgICAgIHZhbHVlSGFuZGxlLFxuICAgICAgICAgICAgICAgIEFUVF9FQ09ERV9JTlZBTElEX09GRlNFVFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wcmVwYXJlZFdyaXRlUmVxdWVzdCA9IHtcbiAgICAgICAgICAgICAgaGFuZGxlOiBoYW5kbGUsXG4gICAgICAgICAgICAgIHZhbHVlSGFuZGxlOiB2YWx1ZUhhbmRsZSxcbiAgICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXQsXG4gICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXNwb25zZSA9IEJ1ZmZlci5hbGxvYyhyZXF1ZXN0Lmxlbmd0aCk7XG4gICAgICAgICAgICByZXF1ZXN0LmNvcHkocmVzcG9uc2UpO1xuICAgICAgICAgICAgcmVzcG9uc2VbMF0gPSBBVFRfT1BfUFJFUF9XUklURV9SRVNQO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNwb25zZSA9IHRoaXMuZXJyb3JSZXNwb25zZShcbiAgICAgICAgICAgIHJlcXVlc3RUeXBlLFxuICAgICAgICAgICAgdmFsdWVIYW5kbGUsXG4gICAgICAgICAgICBBVFRfRUNPREVfV1JJVEVfTk9UX1BFUk1cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNwb25zZSA9IHRoaXMuZXJyb3JSZXNwb25zZShcbiAgICAgICAgICByZXF1ZXN0VHlwZSxcbiAgICAgICAgICB2YWx1ZUhhbmRsZSxcbiAgICAgICAgICBBVFRfRUNPREVfQVRUUl9OT1RfTE9OR1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXNwb25zZSA9IHRoaXMuZXJyb3JSZXNwb25zZShcbiAgICAgICAgcmVxdWVzdFR5cGUsXG4gICAgICAgIHZhbHVlSGFuZGxlLFxuICAgICAgICBBVFRfRUNPREVfSU5WQUxJRF9IQU5ETEVcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9XG5cbiAgaGFuZGxlRXhlY3V0ZVdyaXRlUmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgbGV0IHJlc3BvbnNlID0gbnVsbDtcblxuICAgIGxldCByZXF1ZXN0VHlwZSA9IHJlcXVlc3RbMF07XG4gICAgbGV0IGZsYWcgPSByZXF1ZXN0WzFdO1xuXG4gICAgaWYgKHRoaXMuX3ByZXBhcmVkV3JpdGVSZXF1ZXN0KSB7XG4gICAgICBpZiAoZmxhZyA9PT0gMHgwMCkge1xuICAgICAgICByZXNwb25zZSA9IEJ1ZmZlci5mcm9tKFtBVFRfT1BfRVhFQ19XUklURV9SRVNQXSk7XG4gICAgICB9IGVsc2UgaWYgKGZsYWcgPT09IDB4MDEpIHtcbiAgICAgICAgbGV0IGNhbGxiYWNrID0gZnVuY3Rpb24ocmVxdWVzdFR5cGUsIHZhbHVlSGFuZGxlKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgbGV0IGNhbGxiYWNrUmVzcG9uc2UgPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAoQVRUX0VDT0RFX1NVQ0NFU1MgPT09IHJlc3VsdCkge1xuICAgICAgICAgICAgICBjYWxsYmFja1Jlc3BvbnNlID0gQnVmZmVyLmZyb20oW0FUVF9PUF9FWEVDX1dSSVRFX1JFU1BdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrUmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgICAgICAgICAgcmVxdWVzdFR5cGUsXG4gICAgICAgICAgICAgICAgdmFsdWVIYW5kbGUsXG4gICAgICAgICAgICAgICAgcmVzdWx0XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRlYnVnKFxuICAgICAgICAgICAgICAnZXhlY3V0ZSB3cml0ZSByZXNwb25zZTogJyArIGNhbGxiYWNrUmVzcG9uc2UudG9TdHJpbmcoJ2hleCcpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLnNlbmQoY2FsbGJhY2tSZXNwb25zZSk7XG4gICAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICB9LmJpbmQodGhpcykocmVxdWVzdFR5cGUsIHRoaXMuX3ByZXBhcmVkV3JpdGVSZXF1ZXN0LnZhbHVlSGFuZGxlKTtcblxuICAgICAgICB0aGlzLl9wcmVwYXJlZFdyaXRlUmVxdWVzdC5oYW5kbGUuYXR0cmlidXRlLmVtaXQoXG4gICAgICAgICAgJ3dyaXRlUmVxdWVzdCcsXG4gICAgICAgICAgdGhpcy5fcHJlcGFyZWRXcml0ZVJlcXVlc3QuZGF0YSxcbiAgICAgICAgICB0aGlzLl9wcmVwYXJlZFdyaXRlUmVxdWVzdC5vZmZzZXQsXG4gICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3BvbnNlID0gdGhpcy5lcnJvclJlc3BvbnNlKHJlcXVlc3RUeXBlLCAweDAwMDAsIEFUVF9FQ09ERV9VTkxJS0VMWSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3ByZXBhcmVkV3JpdGVSZXF1ZXN0ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UocmVxdWVzdFR5cGUsIDB4MDAwMCwgQVRUX0VDT0RFX1VOTElLRUxZKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH1cblxuICBoYW5kbGVDb25maXJtYXRpb24ocmVxdWVzdCkge1xuICAgIGlmICh0aGlzLl9sYXN0SW5kaWNhdGVkQXR0cmlidXRlKSB7XG4gICAgICBpZiAodGhpcy5fbGFzdEluZGljYXRlZEF0dHJpYnV0ZS5lbWl0KSB7XG4gICAgICAgIHRoaXMuX2xhc3RJbmRpY2F0ZWRBdHRyaWJ1dGUuZW1pdCgnaW5kaWNhdGUnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbGFzdEluZGljYXRlZEF0dHJpYnV0ZSA9IG51bGw7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2F0dDtcbiJdfQ==
