"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// var debug = require('debug')('gatt');
const debug = () => {
};
const events = require("events");
/* eslint-disable no-unused-vars */
const ATT_OP_ERROR = 0x01;
const ATT_OP_MTU_REQ = 0x02;
const ATT_OP_MTU_RESP = 0x03;
const ATT_OP_FIND_INFO_REQ = 0x04;
const ATT_OP_FIND_INFO_RESP = 0x05;
const ATT_OP_FIND_BY_TYPE_REQ = 0x06;
const ATT_OP_FIND_BY_TYPE_RESP = 0x07;
const ATT_OP_READ_BY_TYPE_REQ = 0x08;
const ATT_OP_READ_BY_TYPE_RESP = 0x09;
const ATT_OP_READ_REQ = 0x0a;
const ATT_OP_READ_RESP = 0x0b;
const ATT_OP_READ_BLOB_REQ = 0x0c;
const ATT_OP_READ_BLOB_RESP = 0x0d;
const ATT_OP_READ_MULTI_REQ = 0x0e;
const ATT_OP_READ_MULTI_RESP = 0x0f;
const ATT_OP_READ_BY_GROUP_REQ = 0x10;
const ATT_OP_READ_BY_GROUP_RESP = 0x11;
const ATT_OP_WRITE_REQ = 0x12;
const ATT_OP_WRITE_RESP = 0x13;
const ATT_OP_WRITE_CMD = 0x52;
const ATT_OP_PREP_WRITE_REQ = 0x16;
const ATT_OP_PREP_WRITE_RESP = 0x17;
const ATT_OP_EXEC_WRITE_REQ = 0x18;
const ATT_OP_EXEC_WRITE_RESP = 0x19;
const ATT_OP_HANDLE_NOTIFY = 0x1b;
const ATT_OP_HANDLE_IND = 0x1d;
const ATT_OP_HANDLE_CNF = 0x1e;
const ATT_OP_SIGNED_WRITE_CMD = 0xd2;
const GATT_PRIM_SVC_UUID = 0x2800;
const GATT_INCLUDE_UUID = 0x2802;
const GATT_CHARAC_UUID = 0x2803;
const GATT_CLIENT_CHARAC_CFG_UUID = 0x2902;
const GATT_SERVER_CHARAC_CFG_UUID = 0x2903;
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
/* eslint-enable no-unused-vars */
const ATT_CID = 0x0004;
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
        const allServices = [
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
            const service = allServices[i];
            handle++;
            const serviceHandle = handle;
            this._handles[serviceHandle] = {
                type: "service",
                uuid: service.uuid,
                attribute: service,
                startHandle: serviceHandle,
            };
            for (j = 0; j < service.characteristics.length; j++) {
                const characteristic = service.characteristics[j];
                let properties = 0;
                let secure = 0;
                if (characteristic.properties.indexOf("read") !== -1) {
                    properties |= 0x02;
                    if (characteristic.secure.indexOf("read") !== -1) {
                        secure |= 0x02;
                    }
                }
                if (characteristic.properties.indexOf("writeWithoutResponse") !== -1) {
                    properties |= 0x04;
                    if (characteristic.secure.indexOf("writeWithoutResponse") !== -1) {
                        secure |= 0x04;
                    }
                }
                if (characteristic.properties.indexOf("write") !== -1) {
                    properties |= 0x08;
                    if (characteristic.secure.indexOf("write") !== -1) {
                        secure |= 0x08;
                    }
                }
                if (characteristic.properties.indexOf("notify") !== -1) {
                    properties |= 0x10;
                    if (characteristic.secure.indexOf("notify") !== -1) {
                        secure |= 0x10;
                    }
                }
                if (characteristic.properties.indexOf("indicate") !== -1) {
                    properties |= 0x20;
                    if (characteristic.secure.indexOf("indicate") !== -1) {
                        secure |= 0x20;
                    }
                }
                handle++;
                const characteristicHandle = handle;
                handle++;
                const characteristicValueHandle = handle;
                this._handles[characteristicHandle] = {
                    type: "characteristic",
                    uuid: characteristic.uuid,
                    properties,
                    secure,
                    attribute: characteristic,
                    startHandle: characteristicHandle,
                    valueHandle: characteristicValueHandle,
                };
                this._handles[characteristicValueHandle] = {
                    type: "characteristicValue",
                    handle: characteristicValueHandle,
                    value: characteristic.value,
                };
                const hasCCCD = characteristic.descriptors.find((e) => e.uuid === "2902");
                if (hasCCCD || properties & 0x30) {
                    // notify or indicate
                    // add client characteristic configuration descriptor
                    handle++;
                    const clientCharacteristicConfigurationDescriptorHandle = handle;
                    this._handles[clientCharacteristicConfigurationDescriptorHandle] = {
                        type: "descriptor",
                        handle: clientCharacteristicConfigurationDescriptorHandle,
                        uuid: "2902",
                        attribute: characteristic,
                        properties: 0x02 | 0x04 | 0x08,
                        secure: secure & 0x10 ? 0x02 | 0x04 | 0x08 : 0,
                        value: Buffer.from([0x00, 0x00]),
                    };
                }
                for (let k = 0; k < characteristic.descriptors.length; k++) {
                    const descriptor = characteristic.descriptors[k];
                    if (descriptor.uuid === "2902") {
                        continue;
                    }
                    handle++;
                    const descriptorHandle = handle;
                    this._handles[descriptorHandle] = {
                        type: "descriptor",
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
        const debugHandles = [];
        for (i = 0; i < this._handles.length; i++) {
            handle = this._handles[i];
            debugHandles[i] = {};
            for (j in handle) {
                if (Buffer.isBuffer(handle[j])) {
                    debugHandles[i][j] = handle[j]
                        ? "Buffer('" + handle[j].toString("hex") + "', 'hex')"
                        : null;
                }
                else if (j !== "attribute") {
                    debugHandles[i][j] = handle[j];
                }
            }
        }
        debug("handles = " + JSON.stringify(debugHandles, null, 2));
    }
    setAclStream(aclStream) {
        this._mtu = 23;
        this._preparedWriteRequest = null;
        this._aclStream = aclStream;
        this._aclStream.on("data", this.onAclStreamDataBinded);
        this._aclStream.on("end", this.onAclStreamEndBinded);
    }
    onAclStreamData(cid, data) {
        if (cid !== ATT_CID) {
            return;
        }
        this.handleRequest(data);
    }
    onAclStreamEnd() {
        this._aclStream.removeListener("data", this.onAclStreamDataBinded);
        this._aclStream.removeListener("end", this.onAclStreamEndBinded);
        for (let i = 0; i < this._handles.length; i++) {
            if (this._handles[i] &&
                this._handles[i].type === "descriptor" &&
                this._handles[i].uuid === "2902" &&
                this._handles[i].value.readUInt16LE(0) !== 0) {
                this._handles[i].value = Buffer.from([0x00, 0x00]);
                if (this._handles[i].attribute && this._handles[i].attribute.emit) {
                    this._handles[i].attribute.emit("unsubscribe");
                }
            }
        }
    }
    send(data) {
        debug("send: " + data.toString("hex"));
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
    handleRequest(request) {
        debug("handing request: " + request.toString("hex"));
        const requestType = request[0];
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
            debug("response: " + response.toString("hex"));
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
        this.emit("mtuChange", this._mtu);
        const response = Buffer.alloc(3);
        response.writeUInt8(ATT_OP_MTU_RESP, 0);
        response.writeUInt16LE(mtu, 1);
        return response;
    }
    handleFindInfoRequest(request) {
        let response = null;
        const startHandle = request.readUInt16LE(1);
        const endHandle = request.readUInt16LE(3);
        const infos = [];
        let uuid = null;
        let i;
        for (i = startHandle; i <= endHandle; i++) {
            const handle = this._handles[i];
            if (!handle) {
                break;
            }
            uuid = null;
            if ("service" === handle.type) {
                uuid = "2800";
            }
            else if ("includedService" === handle.type) {
                uuid = "2802";
            }
            else if ("characteristic" === handle.type) {
                uuid = "2803";
            }
            else if ("characteristicValue" === handle.type) {
                uuid = this._handles[i - 1].uuid;
            }
            else if ("descriptor" === handle.type) {
                uuid = handle.uuid;
            }
            if (uuid) {
                infos.push({
                    handle: i,
                    uuid,
                });
            }
        }
        if (infos.length) {
            const uuidSize = infos[0].uuid.length / 2;
            let numInfo = 1;
            for (i = 1; i < infos.length; i++) {
                if (infos[0].uuid.length !== infos[i].uuid.length) {
                    break;
                }
                numInfo++;
            }
            const lengthPerInfo = uuidSize === 2 ? 4 : 18;
            const maxInfo = Math.floor((this._mtu - 2) / lengthPerInfo);
            numInfo = Math.min(numInfo, maxInfo);
            response = Buffer.alloc(2 + numInfo * lengthPerInfo);
            response[0] = ATT_OP_FIND_INFO_RESP;
            response[1] = uuidSize === 2 ? 0x01 : 0x2;
            for (i = 0; i < numInfo; i++) {
                const info = infos[i];
                response.writeUInt16LE(info.handle, 2 + i * lengthPerInfo);
                uuid = Buffer.from(info.uuid
                    .match(/.{1,2}/g)
                    .reverse()
                    .join(""), "hex");
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
        const startHandle = request.readUInt16LE(1);
        const endHandle = request.readUInt16LE(3);
        const uuid = request
            .slice(5, 7)
            .toString("hex")
            .match(/.{1,2}/g)
            .reverse()
            .join("");
        const value = request
            .slice(7)
            .toString("hex")
            .match(/.{1,2}/g)
            .reverse()
            .join("");
        const handles = [];
        let handle;
        for (let i = startHandle; i <= endHandle; i++) {
            handle = this._handles[i];
            if (!handle) {
                break;
            }
            if ("2800" === uuid &&
                handle.type === "service" &&
                handle.uuid === value) {
                handles.push({
                    start: handle.startHandle,
                    end: handle.endHandle,
                });
            }
        }
        if (handles.length) {
            const lengthPerHandle = 4;
            let numHandles = handles.length;
            const maxHandles = Math.floor((this._mtu - 1) / lengthPerHandle);
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
        const startHandle = request.readUInt16LE(1);
        const endHandle = request.readUInt16LE(3);
        const uuid = request
            .slice(5)
            .toString("hex")
            .match(/.{1,2}/g)
            .reverse()
            .join("");
        debug("read by group: startHandle = 0x" +
            startHandle.toString(16) +
            ", endHandle = 0x" +
            endHandle.toString(16) +
            ", uuid = 0x" +
            uuid.toString(16));
        if ("2800" === uuid || "2802" === uuid) {
            const services = [];
            const type = "2800" === uuid ? "service" : "includedService";
            let i;
            for (i = startHandle; i <= endHandle; i++) {
                const handle = this._handles[i];
                if (!handle) {
                    break;
                }
                if (handle.type === type) {
                    services.push(handle);
                }
            }
            if (services.length) {
                const uuidSize = services[0].uuid.length / 2;
                let numServices = 1;
                for (i = 1; i < services.length; i++) {
                    if (services[0].uuid.length !== services[i].uuid.length) {
                        break;
                    }
                    numServices++;
                }
                const lengthPerService = uuidSize === 2 ? 6 : 20;
                const maxServices = Math.floor((this._mtu - 2) / lengthPerService);
                numServices = Math.min(numServices, maxServices);
                response = Buffer.alloc(2 + numServices * lengthPerService);
                response[0] = ATT_OP_READ_BY_GROUP_RESP;
                response[1] = lengthPerService;
                for (i = 0; i < numServices; i++) {
                    const service = services[i];
                    response.writeUInt16LE(service.startHandle, 2 + i * lengthPerService);
                    response.writeUInt16LE(service.endHandle, 2 + i * lengthPerService + 2);
                    const serviceUuid = Buffer.from(service.uuid
                        .match(/.{1,2}/g)
                        .reverse()
                        .join(""), "hex");
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
        const requestType = request[0];
        const startHandle = request.readUInt16LE(1);
        const endHandle = request.readUInt16LE(3);
        const uuid = request
            .slice(5)
            .toString("hex")
            .match(/.{1,2}/g)
            .reverse()
            .join("");
        let i;
        let handle;
        debug("read by type: startHandle = 0x" +
            startHandle.toString(16) +
            ", endHandle = 0x" +
            endHandle.toString(16) +
            ", uuid = 0x" +
            uuid.toString(16));
        if ("2803" === uuid) {
            const characteristics = [];
            for (i = startHandle; i <= endHandle; i++) {
                handle = this._handles[i];
                if (!handle) {
                    break;
                }
                if (handle.type === "characteristic") {
                    characteristics.push(handle);
                }
            }
            if (characteristics.length) {
                const uuidSize = characteristics[0].uuid.length / 2;
                let numCharacteristics = 1;
                for (i = 1; i < characteristics.length; i++) {
                    if (characteristics[0].uuid.length !== characteristics[i].uuid.length) {
                        break;
                    }
                    numCharacteristics++;
                }
                const lengthPerCharacteristic = uuidSize === 2 ? 7 : 21;
                const maxCharacteristics = Math.floor((this._mtu - 2) / lengthPerCharacteristic);
                numCharacteristics = Math.min(numCharacteristics, maxCharacteristics);
                response = Buffer.alloc(2 + numCharacteristics * lengthPerCharacteristic);
                response[0] = ATT_OP_READ_BY_TYPE_RESP;
                response[1] = lengthPerCharacteristic;
                for (i = 0; i < numCharacteristics; i++) {
                    const characteristic = characteristics[i];
                    response.writeUInt16LE(characteristic.startHandle, 2 + i * lengthPerCharacteristic);
                    response.writeUInt8(characteristic.properties, 2 + i * lengthPerCharacteristic + 2);
                    response.writeUInt16LE(characteristic.valueHandle, 2 + i * lengthPerCharacteristic + 3);
                    const characteristicUuid = Buffer.from(characteristic.uuid
                        .match(/.{1,2}/g)
                        .reverse()
                        .join(""), "hex");
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
                if (handle.type === "characteristic" && handle.uuid === uuid) {
                    handleAttribute = handle.attribute;
                    valueHandle = handle.valueHandle;
                    secure = handle.secure & 0x02;
                    break;
                }
                else if (handle.type === "descriptor" && handle.uuid === uuid) {
                    valueHandle = i;
                    secure = handle.secure & 0x02;
                    break;
                }
            }
            if (secure && !this._aclStream.encrypted) {
                response = this.errorResponse(ATT_OP_READ_BY_TYPE_REQ, startHandle, ATT_ECODE_AUTHENTICATION);
            }
            else if (valueHandle) {
                const callback = ((_valueHandle) => {
                    return (result, _data) => {
                        let callbackResponse = null;
                        if (ATT_ECODE_SUCCESS === result) {
                            const dataLength = Math.min(_data.length, this._mtu - 4);
                            callbackResponse = Buffer.alloc(4 + dataLength);
                            callbackResponse[0] = ATT_OP_READ_BY_TYPE_RESP;
                            callbackResponse[1] = dataLength + 2;
                            callbackResponse.writeUInt16LE(_valueHandle, 2);
                            for (i = 0; i < dataLength; i++) {
                                callbackResponse[4 + i] = _data[i];
                            }
                        }
                        else {
                            callbackResponse = this.errorResponse(requestType, _valueHandle, result);
                        }
                        debug("read by type response: " + callbackResponse.toString("hex"));
                        this.send(callbackResponse);
                    };
                })(valueHandle);
                const data = this._handles[valueHandle].value;
                if (data) {
                    callback(ATT_ECODE_SUCCESS, data);
                }
                else if (handleAttribute) {
                    handleAttribute.emit("readRequest", 0, callback);
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
        const requestType = request[0];
        const valueHandle = request.readUInt16LE(1);
        const offset = requestType === ATT_OP_READ_BLOB_REQ ? request.readUInt16LE(3) : 0;
        const handle = this._handles[valueHandle];
        let i;
        if (handle) {
            let result = null;
            let data = null;
            const handleType = handle.type;
            const callback = ((_requestType, _valueHandle) => {
                return (_result, _data) => {
                    let callbackResponse = null;
                    if (ATT_ECODE_SUCCESS === _result) {
                        const dataLength = Math.min(_data.length, this._mtu - 1);
                        callbackResponse = Buffer.alloc(1 + dataLength);
                        callbackResponse[0] =
                            _requestType === ATT_OP_READ_BLOB_REQ
                                ? ATT_OP_READ_BLOB_RESP
                                : ATT_OP_READ_RESP;
                        for (i = 0; i < dataLength; i++) {
                            callbackResponse[1 + i] = _data[i];
                        }
                    }
                    else {
                        callbackResponse = this.errorResponse(_requestType, _valueHandle, _result);
                    }
                    debug("read response: " + callbackResponse.toString("hex"));
                    this.send(callbackResponse);
                };
            })(requestType, valueHandle);
            if (handleType === "service" || handleType === "includedService") {
                result = ATT_ECODE_SUCCESS;
                data = Buffer.from(handle.uuid
                    .match(/.{1,2}/g)
                    .reverse()
                    .join(""), "hex");
            }
            else if (handleType === "characteristic") {
                const uuid = Buffer.from(handle.uuid
                    .match(/.{1,2}/g)
                    .reverse()
                    .join(""), "hex");
                result = ATT_ECODE_SUCCESS;
                data = Buffer.alloc(3 + uuid.length);
                data.writeUInt8(handle.properties, 0);
                data.writeUInt16LE(handle.valueHandle, 1);
                for (i = 0; i < uuid.length; i++) {
                    data[i + 3] = uuid[i];
                }
            }
            else if (handleType === "characteristicValue" ||
                handleType === "descriptor") {
                let handleProperties = handle.properties;
                let handleSecure = handle.secure;
                let handleAttribute = handle.attribute;
                if (handleType === "characteristicValue") {
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
                            handleAttribute.emit("readRequest", offset, callback);
                        }
                    }
                }
                else {
                    result = ATT_ECODE_READ_NOT_PERM; // non-readable
                }
            }
            if (data && typeof data === "string") {
                data = Buffer.from(data);
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
        const requestType = request[0];
        const withoutResponse = requestType === ATT_OP_WRITE_CMD;
        const valueHandle = request.readUInt16LE(1);
        const data = request.slice(3);
        const offset = 0;
        let handle = this._handles[valueHandle];
        if (handle) {
            if (handle.type === "characteristicValue") {
                handle = this._handles[valueHandle - 1];
            }
            const handleProperties = handle.properties;
            const handleSecure = handle.secure;
            if (handleProperties &&
                (withoutResponse ? handleProperties & 0x04 : handleProperties & 0x08)) {
                const callback = ((_requestType, _valueHandle, _withoutResponse) => {
                    return (result) => {
                        if (!_withoutResponse) {
                            let callbackResponse = null;
                            if (ATT_ECODE_SUCCESS === result) {
                                callbackResponse = Buffer.from([ATT_OP_WRITE_RESP]);
                            }
                            else {
                                callbackResponse = this.errorResponse(_requestType, _valueHandle, result);
                            }
                            debug("write response: " + callbackResponse.toString("hex"));
                            this.send(callbackResponse);
                        }
                    };
                })(requestType, valueHandle, withoutResponse);
                if (handleSecure & (withoutResponse ? 0x04 : 0x08) &&
                    !this._aclStream.encrypted) {
                    response = this.errorResponse(requestType, valueHandle, ATT_ECODE_AUTHENTICATION);
                }
                else if (handle.type === "descriptor" || handle.uuid === "2902") {
                    let result = null;
                    if (data.length !== 2) {
                        result = ATT_ECODE_INVAL_ATTR_VALUE_LEN;
                    }
                    else {
                        const value = data.readUInt16LE(0);
                        const handleAttribute = handle.attribute;
                        handle.value = data;
                        if (value & 0x0003) {
                            const updateValueCallback = ((_valueHandle, _attribute) => {
                                return (_data) => {
                                    const dataLength = Math.min(_data.length, this._mtu - 3);
                                    const useNotify = _attribute.properties.indexOf("notify") !== -1;
                                    const useIndicate = _attribute.properties.indexOf("indicate") !== -1;
                                    let i;
                                    if (useNotify) {
                                        const notifyMessage = Buffer.alloc(3 + dataLength);
                                        notifyMessage.writeUInt8(ATT_OP_HANDLE_NOTIFY, 0);
                                        notifyMessage.writeUInt16LE(_valueHandle, 1);
                                        for (i = 0; i < dataLength; i++) {
                                            notifyMessage[3 + i] = _data[i];
                                        }
                                        debug("notify message: " + notifyMessage.toString("hex"));
                                        this.send(notifyMessage);
                                        _attribute.emit("notify");
                                    }
                                    else if (useIndicate) {
                                        const indicateMessage = Buffer.alloc(3 + dataLength);
                                        indicateMessage.writeUInt8(ATT_OP_HANDLE_IND, 0);
                                        indicateMessage.writeUInt16LE(_valueHandle, 1);
                                        for (i = 0; i < dataLength; i++) {
                                            indicateMessage[3 + i] = _data[i];
                                        }
                                        this._lastIndicatedAttribute = _attribute;
                                        debug("indicate message: " + indicateMessage.toString("hex"));
                                        this.send(indicateMessage);
                                    }
                                };
                            })(valueHandle - 1, handleAttribute);
                            if (handleAttribute.emit) {
                                handleAttribute.emit("subscribe", this._mtu - 3, updateValueCallback);
                            }
                        }
                        else {
                            handleAttribute.emit("unsubscribe");
                        }
                        result = ATT_ECODE_SUCCESS;
                    }
                    callback(result);
                }
                else {
                    handle.attribute.emit("writeRequest", data, offset, withoutResponse, callback);
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
        const requestType = request[0];
        const valueHandle = request.readUInt16LE(1);
        const offset = request.readUInt16LE(3);
        const data = request.slice(5);
        let handle = this._handles[valueHandle];
        if (handle) {
            if (handle.type === "characteristicValue") {
                handle = this._handles[valueHandle - 1];
                const handleProperties = handle.properties;
                const handleSecure = handle.secure;
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
                            handle,
                            valueHandle,
                            offset,
                            data,
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
        const requestType = request[0];
        const flag = request[1];
        if (this._preparedWriteRequest) {
            if (flag === 0x00) {
                response = Buffer.from([ATT_OP_EXEC_WRITE_RESP]);
            }
            else if (flag === 0x01) {
                const callback = ((_requestType, _valueHandle) => {
                    return (result) => {
                        let callbackResponse = null;
                        if (ATT_ECODE_SUCCESS === result) {
                            callbackResponse = Buffer.from([ATT_OP_EXEC_WRITE_RESP]);
                        }
                        else {
                            callbackResponse = this.errorResponse(_requestType, _valueHandle, result);
                        }
                        debug("execute write response: " + callbackResponse.toString("hex"));
                        this.send(callbackResponse);
                    };
                })(requestType, this._preparedWriteRequest.valueHandle);
                this._preparedWriteRequest.handle.attribute.emit("writeRequest", this._preparedWriteRequest.data, this._preparedWriteRequest.offset, false, callback);
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
                this._lastIndicatedAttribute.emit("indicate");
            }
            this._lastIndicatedAttribute = null;
        }
    }
}
exports.default = Gatt;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvcHJvdG9jb2wvcGVyaXBoZXJhbC9nYXR0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXdDO0FBQ3hDLE1BQU0sS0FBSyxHQUFRLEdBQUcsRUFBRTtBQUN4QixDQUFDLENBQUM7QUFFRixNQUFNLE1BQU0sR0FBUSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFdEMsbUNBQW1DO0FBQ25DLE1BQU0sWUFBWSxHQUFRLElBQUksQ0FBQztBQUMvQixNQUFNLGNBQWMsR0FBUSxJQUFJLENBQUM7QUFDakMsTUFBTSxlQUFlLEdBQVEsSUFBSSxDQUFDO0FBQ2xDLE1BQU0sb0JBQW9CLEdBQVEsSUFBSSxDQUFDO0FBQ3ZDLE1BQU0scUJBQXFCLEdBQVEsSUFBSSxDQUFDO0FBQ3hDLE1BQU0sdUJBQXVCLEdBQVEsSUFBSSxDQUFDO0FBQzFDLE1BQU0sd0JBQXdCLEdBQVEsSUFBSSxDQUFDO0FBQzNDLE1BQU0sdUJBQXVCLEdBQVEsSUFBSSxDQUFDO0FBQzFDLE1BQU0sd0JBQXdCLEdBQVEsSUFBSSxDQUFDO0FBQzNDLE1BQU0sZUFBZSxHQUFRLElBQUksQ0FBQztBQUNsQyxNQUFNLGdCQUFnQixHQUFRLElBQUksQ0FBQztBQUNuQyxNQUFNLG9CQUFvQixHQUFRLElBQUksQ0FBQztBQUN2QyxNQUFNLHFCQUFxQixHQUFRLElBQUksQ0FBQztBQUN4QyxNQUFNLHFCQUFxQixHQUFRLElBQUksQ0FBQztBQUN4QyxNQUFNLHNCQUFzQixHQUFRLElBQUksQ0FBQztBQUN6QyxNQUFNLHdCQUF3QixHQUFRLElBQUksQ0FBQztBQUMzQyxNQUFNLHlCQUF5QixHQUFRLElBQUksQ0FBQztBQUM1QyxNQUFNLGdCQUFnQixHQUFRLElBQUksQ0FBQztBQUNuQyxNQUFNLGlCQUFpQixHQUFRLElBQUksQ0FBQztBQUNwQyxNQUFNLGdCQUFnQixHQUFRLElBQUksQ0FBQztBQUNuQyxNQUFNLHFCQUFxQixH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SUFBSSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUV4RCxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQzlDLGNBQWMsRUFDZCxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUMvQixJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxFQUNqQyxLQUFLLEVBQ0wsUUFBUSxDQUNULENBQUM7YUFDSDtpQkFBTTtnQkFDTCxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixDQUFDLENBQUM7YUFDeEU7WUFFRCxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1NBQ25DO2FBQU07WUFDTCxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixDQUFDLENBQUM7U0FDeEU7UUFFRCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBRU0sa0JBQWtCLENBQUMsT0FBWTtRQUNwQyxJQUFJLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtZQUNoQyxJQUFJLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3JDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDL0M7WUFFRCxJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztDQUNGO0FBRUQsa0JBQWUsSUFBSSxDQUFDIiwiZmlsZSI6InNyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvcHJvdG9jb2wvcGVyaXBoZXJhbC9nYXR0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdmFyIGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnZ2F0dCcpO1xuY29uc3QgZGVidWc6IGFueSA9ICgpID0+IHtcbn07XG5cbmNvbnN0IGV2ZW50czogYW55ID0gcmVxdWlyZShcImV2ZW50c1wiKTtcblxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbmNvbnN0IEFUVF9PUF9FUlJPUjogYW55ID0gMHgwMTtcbmNvbnN0IEFUVF9PUF9NVFVfUkVROiBhbnkgPSAweDAyO1xuY29uc3QgQVRUX09QX01UVV9SRVNQOiBhbnkgPSAweDAzO1xuY29uc3QgQVRUX09QX0ZJTkRfSU5GT19SRVE6IGFueSA9IDB4MDQ7XG5jb25zdCBBVFRfT1BfRklORF9JTkZPX1JFU1A6IGFueSA9IDB4MDU7XG5jb25zdCBBVFRfT1BfRklORF9CWV9UWVBFX1JFUTogYW55ID0gMHgwNjtcbmNvbnN0IEFUVF9PUF9GSU5EX0JZX1RZUEVfUkVTUDogYW55ID0gMHgwNztcbmNvbnN0IEFUVF9PUF9SRUFEX0JZX1RZUEVfUkVROiBhbnkgPSAweDA4O1xuY29uc3QgQVRUX09QX1JFQURfQllfVFlQRV9SRVNQOiBhbnkgPSAweDA5O1xuY29uc3QgQVRUX09QX1JFQURfUkVROiBhbnkgPSAweDBhO1xuY29uc3QgQVRUX09QX1JFQURfUkVTUDogYW55ID0gMHgwYjtcbmNvbnN0IEFUVF9PUF9SRUFEX0JMT0JfUkVROiBhbnkgPSAweDBjO1xuY29uc3QgQVRUX09QX1JFQURfQkxPQl9SRVNQOiBhbnkgPSAweDBkO1xuY29uc3QgQVRUX09QX1JFQURfTVVMVElfUkVROiBhbnkgPSAweDBlO1xuY29uc3QgQVRUX09QX1JFQURfTVVMVElfUkVTUDogYW55ID0gMHgwZjtcbmNvbnN0IEFUVF9PUF9SRUFEX0JZX0dST1VQX1JFUTogYW55ID0gMHgxMDtcbmNvbnN0IEFUVF9PUF9SRUFEX0JZX0dST1VQX1JFU1A6IGFueSA9IDB4MTE7XG5jb25zdCBBVFRfT1BfV1JJVEVfUkVROiBhbnkgPSAweDEyO1xuY29uc3QgQVRUX09QX1dSSVRFX1JFU1A6IGFueSA9IDB4MTM7XG5jb25zdCBBVFRfT1BfV1JJVEVfQ01EOiBhbnkgPSAweDUyO1xuY29uc3QgQVRUX09QX1BSRVBfV1JJVEVfUkVROiBhbnkgPSAweDE2O1xuY29uc3QgQVRUX09QX1BSRVBfV1JJVEVfUkVTUDogYW55ID0gMHgxNztcbmNvbnN0IEFUVF9PUF9FWEVDX1dSSVRFX1JFUTogYW55ID0gMHgxODtcbmNvbnN0IEFUVF9PUF9FWEVDX1dSSVRFX1JFU1A6IGFueSA9IDB4MTk7XG5jb25zdCBBVFRfT1BfSEFORExFX05PVElGWTogYW55ID0gMHgxYjtcbmNvbnN0IEFUVF9PUF9IQU5ETEVfSU5EOiBhbnkgPSAweDFkO1xuY29uc3QgQVRUX09QX0hBTkRMRV9DTkY6IGFueSA9IDB4MWU7XG5jb25zdCBBVFRfT1BfU0lHTkVEX1dSSVRFX0NNRDogYW55ID0gMHhkMjtcblxuY29uc3QgR0FUVF9QUklNX1NWQ19VVUlEOiBhbnkgPSAweDI4MDA7XG5jb25zdCBHQVRUX0lOQ0xVREVfVVVJRDogYW55ID0gMHgyODAyO1xuY29uc3QgR0FUVF9DSEFSQUNfVVVJRDogYW55ID0gMHgyODAzO1xuXG5jb25zdCBHQVRUX0NMSUVOVF9DSEFSQUNfQ0ZHX1VVSUQ6IGFueSA9IDB4MjkwMjtcbmNvbnN0IEdBVFRfU0VSVkVSX0NIQVJBQ19DRkdfVVVJRDogYW55ID0gMHgyOTAzO1xuXG5jb25zdCBBVFRfRUNPREVfU1VDQ0VTUzogYW55ID0gMHgwMDtcbmNvbnN0IEFUVF9FQ09ERV9JTlZBTElEX0hBTkRMRTogYW55ID0gMHgwMTtcbmNvbnN0IEFUVF9FQ09ERV9SRUFEX05PVF9QRVJNOiBhbnkgPSAweDAyO1xuY29uc3QgQVRUX0VDT0RFX1dSSVRFX05PVF9QRVJNOiBhbnkgPSAweDAzO1xuY29uc3QgQVRUX0VDT0RFX0lOVkFMSURfUERVOiBhbnkgPSAweDA0O1xuY29uc3QgQVRUX0VDT0RFX0FVVEhFTlRJQ0FUSU9OOiBhbnkgPSAweDA1O1xuY29uc3QgQVRUX0VDT0RFX1JFUV9OT1RfU1VQUDogYW55ID0gMHgwNjtcbmNvbnN0IEFUVF9FQ09ERV9JTlZBTElEX09GRlNFVDogYW55ID0gMHgwNztcbmNvbnN0IEFUVF9FQ09ERV9BVVRIT1JJWkFUSU9OOiBhbnkgPSAweDA4O1xuY29uc3QgQVRUX0VDT0RFX1BSRVBfUVVFVUVfRlVMTDogYW55ID0gMHgwOTtcbmNvbnN0IEFUVF9FQ09ERV9BVFRSX05PVF9GT1VORDogYW55ID0gMHgwYTtcbmNvbnN0IEFUVF9FQ09ERV9BVFRSX05PVF9MT05HOiBhbnkgPSAweDBiO1xuY29uc3QgQVRUX0VDT0RFX0lOU1VGRl9FTkNSX0tFWV9TSVpFOiBhbnkgPSAweDBjO1xuY29uc3QgQVRUX0VDT0RFX0lOVkFMX0FUVFJfVkFMVUVfTEVOOiBhbnkgPSAweDBkO1xuY29uc3QgQVRUX0VDT0RFX1VOTElLRUxZOiBhbnkgPSAweDBlO1xuY29uc3QgQVRUX0VDT0RFX0lOU1VGRl9FTkM6IGFueSA9IDB4MGY7XG5jb25zdCBBVFRfRUNPREVfVU5TVVBQX0dSUF9UWVBFOiBhbnkgPSAweDEwO1xuY29uc3QgQVRUX0VDT0RFX0lOU1VGRl9SRVNPVVJDRVM6IGFueSA9IDB4MTE7XG5cbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbmNvbnN0IEFUVF9DSUQ6IGFueSA9IDB4MDAwNDtcblxuY2xhc3MgR2F0dCBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICBwdWJsaWMgbWF4TXR1OiBhbnk7XG4gIHB1YmxpYyBfbXR1OiBhbnk7XG4gIHB1YmxpYyBfcHJlcGFyZWRXcml0ZVJlcXVlc3Q6IGFueTtcbiAgcHVibGljIG9uQWNsU3RyZWFtRGF0YUJpbmRlZDogYW55O1xuICBwdWJsaWMgb25BY2xTdHJlYW1FbmRCaW5kZWQ6IGFueTtcbiAgcHVibGljIF9oYW5kbGVzOiBhbnk7XG4gIHB1YmxpYyBfYWNsU3RyZWFtOiBhbnk7XG4gIHB1YmxpYyBlbWl0OiBhbnk7XG4gIHB1YmxpYyBfbGFzdEluZGljYXRlZEF0dHJpYnV0ZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5tYXhNdHUgPSAyNTY7XG4gICAgdGhpcy5fbXR1ID0gMjM7XG4gICAgdGhpcy5fcHJlcGFyZWRXcml0ZVJlcXVlc3QgPSBudWxsO1xuXG4gICAgdGhpcy5zZXRTZXJ2aWNlcyhbXSk7XG5cbiAgICB0aGlzLm9uQWNsU3RyZWFtRGF0YUJpbmRlZCA9IHRoaXMub25BY2xTdHJlYW1EYXRhLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbkFjbFN0cmVhbUVuZEJpbmRlZCA9IHRoaXMub25BY2xTdHJlYW1FbmQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRTZXJ2aWNlcyhzZXJ2aWNlczogYW55KSB7XG4gICAgLy8gdmFyIGRldmljZU5hbWUgPSBwcm9jZXNzLmVudi5CTEVOT19ERVZJQ0VfTkFNRSB8fCBvcy5ob3N0bmFtZSgpO1xuXG4gICAgLy8gYmFzZSBzZXJ2aWNlcyBhbmQgY2hhcmFjdGVyaXN0aWNzXG4gICAgY29uc3QgYWxsU2VydmljZXM6IGFueSA9IFtcbiAgICAgIC8vIHtcbiAgICAgIC8vICAgdXVpZDogJzE4MDAnLFxuICAgICAgLy8gICBjaGFyYWN0ZXJpc3RpY3M6IFtcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICB1dWlkOiAnMmEwMCcsXG4gICAgICAvLyAgICAgICBwcm9wZXJ0aWVzOiBbJ3JlYWQnXSxcbiAgICAgIC8vICAgICAgIHNlY3VyZTogW10sXG4gICAgICAvLyAgICAgICB2YWx1ZTogQnVmZmVyLmZyb20oZGV2aWNlTmFtZSksXG4gICAgICAvLyAgICAgICBkZXNjcmlwdG9yczogW11cbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICAgIHtcbiAgICAgIC8vICAgICAgIHV1aWQ6ICcyYTAxJyxcbiAgICAgIC8vICAgICAgIHByb3BlcnRpZXM6IFsncmVhZCddLFxuICAgICAgLy8gICAgICAgc2VjdXJlOiBbXSxcbiAgICAgIC8vICAgICAgIHZhbHVlOiBCdWZmZXIuZnJvbShbMHg4MCwgMHgwMF0pLFxuICAgICAgLy8gICAgICAgZGVzY3JpcHRvcnM6IFtdXG4gICAgICAvLyAgICAgfVxuICAgICAgLy8gICBdXG4gICAgICAvLyB9LFxuICAgICAgLy8ge1xuICAgICAgLy8gICB1dWlkOiAnMTgwMScsXG4gICAgICAvLyAgIGNoYXJhY3RlcmlzdGljczogW1xuICAgICAgLy8gICAgIHtcbiAgICAgIC8vICAgICAgIHV1aWQ6ICcyYTA1JyxcbiAgICAgIC8vICAgICAgIHByb3BlcnRpZXM6IFsnaW5kaWNhdGUnXSxcbiAgICAgIC8vICAgICAgIHNlY3VyZTogW10sXG4gICAgICAvLyAgICAgICB2YWx1ZTogQnVmZmVyLmZyb20oWzB4MDAsIDB4MDAsIDB4MDAsIDB4MDBdKSxcbiAgICAgIC8vICAgICAgIGRlc2NyaXB0b3JzOiBbXVxuICAgICAgLy8gICAgIH1cbiAgICAgIC8vICAgXVxuICAgICAgLy8gfVxuICAgIF0uY29uY2F0KHNlcnZpY2VzKTtcblxuICAgIHRoaXMuX2hhbmRsZXMgPSBbXTtcblxuICAgIGxldCBoYW5kbGU6IGFueSA9IDA7XG4gICAgbGV0IGk6IGFueTtcbiAgICBsZXQgajogYW55O1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGFsbFNlcnZpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzZXJ2aWNlOiBhbnkgPSBhbGxTZXJ2aWNlc1tpXTtcblxuICAgICAgaGFuZGxlKys7XG4gICAgICBjb25zdCBzZXJ2aWNlSGFuZGxlOiBhbnkgPSBoYW5kbGU7XG5cbiAgICAgIHRoaXMuX2hhbmRsZXNbc2VydmljZUhhbmRsZV0gPSB7XG4gICAgICAgIHR5cGU6IFwic2VydmljZVwiLFxuICAgICAgICB1dWlkOiBzZXJ2aWNlLnV1aWQsXG4gICAgICAgIGF0dHJpYnV0ZTogc2VydmljZSxcbiAgICAgICAgc3RhcnRIYW5kbGU6IHNlcnZpY2VIYW5kbGUsXG4gICAgICAgIC8vIGVuZEhhbmRsZSBmaWxsZWQgaW4gYmVsb3dcbiAgICAgIH07XG5cbiAgICAgIGZvciAoaiA9IDA7IGogPCBzZXJ2aWNlLmNoYXJhY3RlcmlzdGljcy5sZW5ndGg7IGorKykge1xuICAgICAgICBjb25zdCBjaGFyYWN0ZXJpc3RpYzogYW55ID0gc2VydmljZS5jaGFyYWN0ZXJpc3RpY3Nbal07XG5cbiAgICAgICAgbGV0IHByb3BlcnRpZXM6IGFueSA9IDA7XG4gICAgICAgIGxldCBzZWN1cmU6IGFueSA9IDA7XG5cbiAgICAgICAgaWYgKGNoYXJhY3RlcmlzdGljLnByb3BlcnRpZXMuaW5kZXhPZihcInJlYWRcIikgIT09IC0xKSB7XG4gICAgICAgICAgcHJvcGVydGllcyB8PSAweDAyO1xuXG4gICAgICAgICAgaWYgKGNoYXJhY3RlcmlzdGljLnNlY3VyZS5pbmRleE9mKFwicmVhZFwiKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHNlY3VyZSB8PSAweDAyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaGFyYWN0ZXJpc3RpYy5wcm9wZXJ0aWVzLmluZGV4T2YoXCJ3cml0ZVdpdGhvdXRSZXNwb25zZVwiKSAhPT0gLTEpIHtcbiAgICAgICAgICBwcm9wZXJ0aWVzIHw9IDB4MDQ7XG5cbiAgICAgICAgICBpZiAoY2hhcmFjdGVyaXN0aWMuc2VjdXJlLmluZGV4T2YoXCJ3cml0ZVdpdGhvdXRSZXNwb25zZVwiKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHNlY3VyZSB8PSAweDA0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaGFyYWN0ZXJpc3RpYy5wcm9wZXJ0aWVzLmluZGV4T2YoXCJ3cml0ZVwiKSAhPT0gLTEpIHtcbiAgICAgICAgICBwcm9wZXJ0aWVzIHw9IDB4MDg7XG5cbiAgICAgICAgICBpZiAoY2hhcmFjdGVyaXN0aWMuc2VjdXJlLmluZGV4T2YoXCJ3cml0ZVwiKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHNlY3VyZSB8PSAweDA4O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaGFyYWN0ZXJpc3RpYy5wcm9wZXJ0aWVzLmluZGV4T2YoXCJub3RpZnlcIikgIT09IC0xKSB7XG4gICAgICAgICAgcHJvcGVydGllcyB8PSAweDEwO1xuXG4gICAgICAgICAgaWYgKGNoYXJhY3RlcmlzdGljLnNlY3VyZS5pbmRleE9mKFwibm90aWZ5XCIpICE9PSAtMSkge1xuICAgICAgICAgICAgc2VjdXJlIHw9IDB4MTA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoYXJhY3RlcmlzdGljLnByb3BlcnRpZXMuaW5kZXhPZihcImluZGljYXRlXCIpICE9PSAtMSkge1xuICAgICAgICAgIHByb3BlcnRpZXMgfD0gMHgyMDtcblxuICAgICAgICAgIGlmIChjaGFyYWN0ZXJpc3RpYy5zZWN1cmUuaW5kZXhPZihcImluZGljYXRlXCIpICE9PSAtMSkge1xuICAgICAgICAgICAgc2VjdXJlIHw9IDB4MjA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaGFuZGxlKys7XG4gICAgICAgIGNvbnN0IGNoYXJhY3RlcmlzdGljSGFuZGxlOiBhbnkgPSBoYW5kbGU7XG5cbiAgICAgICAgaGFuZGxlKys7XG4gICAgICAgIGNvbnN0IGNoYXJhY3RlcmlzdGljVmFsdWVIYW5kbGU6IGFueSA9IGhhbmRsZTtcblxuICAgICAgICB0aGlzLl9oYW5kbGVzW2NoYXJhY3RlcmlzdGljSGFuZGxlXSA9IHtcbiAgICAgICAgICB0eXBlOiBcImNoYXJhY3RlcmlzdGljXCIsXG4gICAgICAgICAgdXVpZDogY2hhcmFjdGVyaXN0aWMudXVpZCxcbiAgICAgICAgICBwcm9wZXJ0aWVzLFxuICAgICAgICAgIHNlY3VyZSxcbiAgICAgICAgICBhdHRyaWJ1dGU6IGNoYXJhY3RlcmlzdGljLFxuICAgICAgICAgIHN0YXJ0SGFuZGxlOiBjaGFyYWN0ZXJpc3RpY0hhbmRsZSxcbiAgICAgICAgICB2YWx1ZUhhbmRsZTogY2hhcmFjdGVyaXN0aWNWYWx1ZUhhbmRsZSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9oYW5kbGVzW2NoYXJhY3RlcmlzdGljVmFsdWVIYW5kbGVdID0ge1xuICAgICAgICAgIHR5cGU6IFwiY2hhcmFjdGVyaXN0aWNWYWx1ZVwiLFxuICAgICAgICAgIGhhbmRsZTogY2hhcmFjdGVyaXN0aWNWYWx1ZUhhbmRsZSxcbiAgICAgICAgICB2YWx1ZTogY2hhcmFjdGVyaXN0aWMudmFsdWUsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFzQ0NDRDogYW55ID0gY2hhcmFjdGVyaXN0aWMuZGVzY3JpcHRvcnMuZmluZCgoZTogYW55KSA9PiBlLnV1aWQgPT09IFwiMjkwMlwiKTtcbiAgICAgICAgaWYgKGhhc0NDQ0QgfHwgcHJvcGVydGllcyAmIDB4MzApIHtcbiAgICAgICAgICAvLyBub3RpZnkgb3IgaW5kaWNhdGVcbiAgICAgICAgICAvLyBhZGQgY2xpZW50IGNoYXJhY3RlcmlzdGljIGNvbmZpZ3VyYXRpb24gZGVzY3JpcHRvclxuXG4gICAgICAgICAgaGFuZGxlKys7XG4gICAgICAgICAgY29uc3QgY2xpZW50Q2hhcmFjdGVyaXN0aWNDb25maWd1cmF0aW9uRGVzY3JpcHRvckhhbmRsZTogYW55ID0gaGFuZGxlO1xuICAgICAgICAgIHRoaXMuX2hhbmRsZXNbY2xpZW50Q2hhcmFjdGVyaXN0aWNDb25maWd1cmF0aW9uRGVzY3JpcHRvckhhbmRsZV0gPSB7XG4gICAgICAgICAgICB0eXBlOiBcImRlc2NyaXB0b3JcIixcbiAgICAgICAgICAgIGhhbmRsZTogY2xpZW50Q2hhcmFjdGVyaXN0aWNDb25maWd1cmF0aW9uRGVzY3JpcHRvckhhbmRsZSxcbiAgICAgICAgICAgIHV1aWQ6IFwiMjkwMlwiLFxuICAgICAgICAgICAgYXR0cmlidXRlOiBjaGFyYWN0ZXJpc3RpYyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IDB4MDIgfCAweDA0IHwgMHgwOCwgLy8gcmVhZC93cml0ZVxuICAgICAgICAgICAgc2VjdXJlOiBzZWN1cmUgJiAweDEwID8gMHgwMiB8IDB4MDQgfCAweDA4IDogMCxcbiAgICAgICAgICAgIHZhbHVlOiBCdWZmZXIuZnJvbShbMHgwMCwgMHgwMF0pLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGNoYXJhY3RlcmlzdGljLmRlc2NyaXB0b3JzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgY29uc3QgZGVzY3JpcHRvcjogYW55ID0gY2hhcmFjdGVyaXN0aWMuZGVzY3JpcHRvcnNba107XG4gICAgICAgICAgaWYgKGRlc2NyaXB0b3IudXVpZCA9PT0gXCIyOTAyXCIpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBoYW5kbGUrKztcbiAgICAgICAgICBjb25zdCBkZXNjcmlwdG9ySGFuZGxlOiBhbnkgPSBoYW5kbGU7XG5cbiAgICAgICAgICB0aGlzLl9oYW5kbGVzW2Rlc2NyaXB0b3JIYW5kbGVdID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkZXNjcmlwdG9yXCIsXG4gICAgICAgICAgICBoYW5kbGU6IGRlc2NyaXB0b3JIYW5kbGUsXG4gICAgICAgICAgICB1dWlkOiBkZXNjcmlwdG9yLnV1aWQsXG4gICAgICAgICAgICBhdHRyaWJ1dGU6IGRlc2NyaXB0b3IsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiAweDAyLCAvLyByZWFkIG9ubHlcbiAgICAgICAgICAgIHNlY3VyZTogMHgwMCxcbiAgICAgICAgICAgIHZhbHVlOiBkZXNjcmlwdG9yLnZhbHVlLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5faGFuZGxlc1tzZXJ2aWNlSGFuZGxlXS5lbmRIYW5kbGUgPSBoYW5kbGU7XG4gICAgfVxuXG4gICAgY29uc3QgZGVidWdIYW5kbGVzOiBhbnkgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5faGFuZGxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaGFuZGxlID0gdGhpcy5faGFuZGxlc1tpXTtcblxuICAgICAgZGVidWdIYW5kbGVzW2ldID0ge307XG4gICAgICBmb3IgKGogaW4gaGFuZGxlKSB7XG4gICAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoaGFuZGxlW2pdKSkge1xuICAgICAgICAgIGRlYnVnSGFuZGxlc1tpXVtqXSA9IGhhbmRsZVtqXVxuICAgICAgICAgICAgPyBcIkJ1ZmZlcignXCIgKyBoYW5kbGVbal0udG9TdHJpbmcoXCJoZXhcIikgKyBcIicsICdoZXgnKVwiXG4gICAgICAgICAgICA6IG51bGw7XG4gICAgICAgIH0gZWxzZSBpZiAoaiAhPT0gXCJhdHRyaWJ1dGVcIikge1xuICAgICAgICAgIGRlYnVnSGFuZGxlc1tpXVtqXSA9IGhhbmRsZVtqXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGRlYnVnKFwiaGFuZGxlcyA9IFwiICsgSlNPTi5zdHJpbmdpZnkoZGVidWdIYW5kbGVzLCBudWxsLCAyKSk7XG4gIH1cblxuICBwdWJsaWMgc2V0QWNsU3RyZWFtKGFjbFN0cmVhbTogYW55KSB7XG4gICAgdGhpcy5fbXR1ID0gMjM7XG4gICAgdGhpcy5fcHJlcGFyZWRXcml0ZVJlcXVlc3QgPSBudWxsO1xuXG4gICAgdGhpcy5fYWNsU3RyZWFtID0gYWNsU3RyZWFtO1xuXG4gICAgdGhpcy5fYWNsU3RyZWFtLm9uKFwiZGF0YVwiLCB0aGlzLm9uQWNsU3RyZWFtRGF0YUJpbmRlZCk7XG4gICAgdGhpcy5fYWNsU3RyZWFtLm9uKFwiZW5kXCIsIHRoaXMub25BY2xTdHJlYW1FbmRCaW5kZWQpO1xuICB9XG5cbiAgcHVibGljIG9uQWNsU3RyZWFtRGF0YShjaWQ6IGFueSwgZGF0YT86IGFueSkge1xuICAgIGlmIChjaWQgIT09IEFUVF9DSUQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZVJlcXVlc3QoZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgb25BY2xTdHJlYW1FbmQoKSB7XG4gICAgdGhpcy5fYWNsU3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZGF0YVwiLCB0aGlzLm9uQWNsU3RyZWFtRGF0YUJpbmRlZCk7XG4gICAgdGhpcy5fYWNsU3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZW5kXCIsIHRoaXMub25BY2xTdHJlYW1FbmRCaW5kZWQpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9oYW5kbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuX2hhbmRsZXNbaV0gJiZcbiAgICAgICAgdGhpcy5faGFuZGxlc1tpXS50eXBlID09PSBcImRlc2NyaXB0b3JcIiAmJlxuICAgICAgICB0aGlzLl9oYW5kbGVzW2ldLnV1aWQgPT09IFwiMjkwMlwiICYmXG4gICAgICAgIHRoaXMuX2hhbmRsZXNbaV0udmFsdWUucmVhZFVJbnQxNkxFKDApICE9PSAwXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5faGFuZGxlc1tpXS52YWx1ZSA9IEJ1ZmZlci5mcm9tKFsweDAwLCAweDAwXSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2hhbmRsZXNbaV0uYXR0cmlidXRlICYmIHRoaXMuX2hhbmRsZXNbaV0uYXR0cmlidXRlLmVtaXQpIHtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVzW2ldLmF0dHJpYnV0ZS5lbWl0KFwidW5zdWJzY3JpYmVcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2VuZChkYXRhOiBhbnkpIHtcbiAgICBkZWJ1ZyhcInNlbmQ6IFwiICsgZGF0YS50b1N0cmluZyhcImhleFwiKSk7XG4gICAgdGhpcy5fYWNsU3RyZWFtLndyaXRlKEFUVF9DSUQsIGRhdGEpO1xuICB9XG5cbiAgcHVibGljIGVycm9yUmVzcG9uc2Uob3Bjb2RlOiBhbnksIGhhbmRsZTogYW55LCBzdGF0dXM6IGFueSkge1xuICAgIGNvbnN0IGJ1ZjogYW55ID0gQnVmZmVyLmFsbG9jKDUpO1xuXG4gICAgYnVmLndyaXRlVUludDgoQVRUX09QX0VSUk9SLCAwKTtcbiAgICBidWYud3JpdGVVSW50OChvcGNvZGUsIDEpO1xuICAgIGJ1Zi53cml0ZVVJbnQxNkxFKGhhbmRsZSwgMik7XG4gICAgYnVmLndyaXRlVUludDgoc3RhdHVzLCA0KTtcblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlUmVxdWVzdChyZXF1ZXN0OiBhbnkpIHtcbiAgICBkZWJ1ZyhcImhhbmRpbmcgcmVxdWVzdDogXCIgKyByZXF1ZXN0LnRvU3RyaW5nKFwiaGV4XCIpKTtcblxuICAgIGNvbnN0IHJlcXVlc3RUeXBlOiBhbnkgPSByZXF1ZXN0WzBdO1xuICAgIGxldCByZXNwb25zZTogYW55ID0gbnVsbDtcblxuICAgIHN3aXRjaCAocmVxdWVzdFR5cGUpIHtcbiAgICAgIGNhc2UgQVRUX09QX01UVV9SRVE6XG4gICAgICAgIHJlc3BvbnNlID0gdGhpcy5oYW5kbGVNdHVSZXF1ZXN0KHJlcXVlc3QpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBBVFRfT1BfRklORF9JTkZPX1JFUTpcbiAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmhhbmRsZUZpbmRJbmZvUmVxdWVzdChyZXF1ZXN0KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgQVRUX09QX0ZJTkRfQllfVFlQRV9SRVE6XG4gICAgICAgIHJlc3BvbnNlID0gdGhpcy5oYW5kbGVGaW5kQnlUeXBlUmVxdWVzdChyZXF1ZXN0KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgQVRUX09QX1JFQURfQllfVFlQRV9SRVE6XG4gICAgICAgIHJlc3BvbnNlID0gdGhpcy5oYW5kbGVSZWFkQnlUeXBlUmVxdWVzdChyZXF1ZXN0KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgQVRUX09QX1JFQURfUkVROlxuICAgICAgY2FzZSBBVFRfT1BfUkVBRF9CTE9CX1JFUTpcbiAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmhhbmRsZVJlYWRPclJlYWRCbG9iUmVxdWVzdChyZXF1ZXN0KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgQVRUX09QX1JFQURfQllfR1JPVVBfUkVROlxuICAgICAgICByZXNwb25zZSA9IHRoaXMuaGFuZGxlUmVhZEJ5R3JvdXBSZXF1ZXN0KHJlcXVlc3QpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBBVFRfT1BfV1JJVEVfUkVROlxuICAgICAgY2FzZSBBVFRfT1BfV1JJVEVfQ01EOlxuICAgICAgICByZXNwb25zZSA9IHRoaXMuaGFuZGxlV3JpdGVSZXF1ZXN0T3JDb21tYW5kKHJlcXVlc3QpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBBVFRfT1BfUFJFUF9XUklURV9SRVE6XG4gICAgICAgIHJlc3BvbnNlID0gdGhpcy5oYW5kbGVQcmVwYXJlV3JpdGVSZXF1ZXN0KHJlcXVlc3QpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBBVFRfT1BfRVhFQ19XUklURV9SRVE6XG4gICAgICAgIHJlc3BvbnNlID0gdGhpcy5oYW5kbGVFeGVjdXRlV3JpdGVSZXF1ZXN0KHJlcXVlc3QpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBBVFRfT1BfSEFORExFX0NORjpcbiAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmhhbmRsZUNvbmZpcm1hdGlvbihyZXF1ZXN0KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICBjYXNlIEFUVF9PUF9SRUFEX01VTFRJX1JFUTpcbiAgICAgIGNhc2UgQVRUX09QX1NJR05FRF9XUklURV9DTUQ6XG4gICAgICAgIHJlc3BvbnNlID0gdGhpcy5lcnJvclJlc3BvbnNlKFxuICAgICAgICAgIHJlcXVlc3RUeXBlLFxuICAgICAgICAgIDB4MDAwMCxcbiAgICAgICAgICBBVFRfRUNPREVfUkVRX05PVF9TVVBQLFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgIGRlYnVnKFwicmVzcG9uc2U6IFwiICsgcmVzcG9uc2UudG9TdHJpbmcoXCJoZXhcIikpO1xuXG4gICAgICB0aGlzLnNlbmQocmVzcG9uc2UpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVNdHVSZXF1ZXN0KHJlcXVlc3Q6IGFueSkge1xuICAgIGxldCBtdHU6IGFueSA9IHJlcXVlc3QucmVhZFVJbnQxNkxFKDEpO1xuXG4gICAgaWYgKG10dSA8IDIzKSB7XG4gICAgICBtdHUgPSAyMztcbiAgICB9IGVsc2UgaWYgKG10dSA+IHRoaXMubWF4TXR1KSB7XG4gICAgICBtdHUgPSB0aGlzLm1heE10dTtcbiAgICB9XG5cbiAgICB0aGlzLl9tdHUgPSBtdHU7XG5cbiAgICB0aGlzLmVtaXQoXCJtdHVDaGFuZ2VcIiwgdGhpcy5fbXR1KTtcblxuICAgIGNvbnN0IHJlc3BvbnNlOiBhbnkgPSBCdWZmZXIuYWxsb2MoMyk7XG5cbiAgICByZXNwb25zZS53cml0ZVVJbnQ4KEFUVF9PUF9NVFVfUkVTUCwgMCk7XG4gICAgcmVzcG9uc2Uud3JpdGVVSW50MTZMRShtdHUsIDEpO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9XG5cbiAgcHVibGljIGhhbmRsZUZpbmRJbmZvUmVxdWVzdChyZXF1ZXN0OiBhbnkpIHtcbiAgICBsZXQgcmVzcG9uc2U6IGFueSA9IG51bGw7XG5cbiAgICBjb25zdCBzdGFydEhhbmRsZTogYW55ID0gcmVxdWVzdC5yZWFkVUludDE2TEUoMSk7XG4gICAgY29uc3QgZW5kSGFuZGxlOiBhbnkgPSByZXF1ZXN0LnJlYWRVSW50MTZMRSgzKTtcblxuICAgIGNvbnN0IGluZm9zOiBhbnkgPSBbXTtcbiAgICBsZXQgdXVpZDogYW55ID0gbnVsbDtcbiAgICBsZXQgaTogYW55O1xuXG4gICAgZm9yIChpID0gc3RhcnRIYW5kbGU7IGkgPD0gZW5kSGFuZGxlOyBpKyspIHtcbiAgICAgIGNvbnN0IGhhbmRsZTogYW55ID0gdGhpcy5faGFuZGxlc1tpXTtcblxuICAgICAgaWYgKCFoYW5kbGUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHV1aWQgPSBudWxsO1xuXG4gICAgICBpZiAoXCJzZXJ2aWNlXCIgPT09IGhhbmRsZS50eXBlKSB7XG4gICAgICAgIHV1aWQgPSBcIjI4MDBcIjtcbiAgICAgIH0gZWxzZSBpZiAoXCJpbmNsdWRlZFNlcnZpY2VcIiA9PT0gaGFuZGxlLnR5cGUpIHtcbiAgICAgICAgdXVpZCA9IFwiMjgwMlwiO1xuICAgICAgfSBlbHNlIGlmIChcImNoYXJhY3RlcmlzdGljXCIgPT09IGhhbmRsZS50eXBlKSB7XG4gICAgICAgIHV1aWQgPSBcIjI4MDNcIjtcbiAgICAgIH0gZWxzZSBpZiAoXCJjaGFyYWN0ZXJpc3RpY1ZhbHVlXCIgPT09IGhhbmRsZS50eXBlKSB7XG4gICAgICAgIHV1aWQgPSB0aGlzLl9oYW5kbGVzW2kgLSAxXS51dWlkO1xuICAgICAgfSBlbHNlIGlmIChcImRlc2NyaXB0b3JcIiA9PT0gaGFuZGxlLnR5cGUpIHtcbiAgICAgICAgdXVpZCA9IGhhbmRsZS51dWlkO1xuICAgICAgfVxuXG4gICAgICBpZiAodXVpZCkge1xuICAgICAgICBpbmZvcy5wdXNoKHtcbiAgICAgICAgICBoYW5kbGU6IGksXG4gICAgICAgICAgdXVpZCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGluZm9zLmxlbmd0aCkge1xuICAgICAgY29uc3QgdXVpZFNpemU6IGFueSA9IGluZm9zWzBdLnV1aWQubGVuZ3RoIC8gMjtcbiAgICAgIGxldCBudW1JbmZvOiBhbnkgPSAxO1xuXG4gICAgICBmb3IgKGkgPSAxOyBpIDwgaW5mb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGluZm9zWzBdLnV1aWQubGVuZ3RoICE9PSBpbmZvc1tpXS51dWlkLmxlbmd0aCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG51bUluZm8rKztcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGVuZ3RoUGVySW5mbzogYW55ID0gdXVpZFNpemUgPT09IDIgPyA0IDogMTg7XG4gICAgICBjb25zdCBtYXhJbmZvOiBhbnkgPSBNYXRoLmZsb29yKCh0aGlzLl9tdHUgLSAyKSAvIGxlbmd0aFBlckluZm8pO1xuICAgICAgbnVtSW5mbyA9IE1hdGgubWluKG51bUluZm8sIG1heEluZm8pO1xuXG4gICAgICByZXNwb25zZSA9IEJ1ZmZlci5hbGxvYygyICsgbnVtSW5mbyAqIGxlbmd0aFBlckluZm8pO1xuXG4gICAgICByZXNwb25zZVswXSA9IEFUVF9PUF9GSU5EX0lORk9fUkVTUDtcbiAgICAgIHJlc3BvbnNlWzFdID0gdXVpZFNpemUgPT09IDIgPyAweDAxIDogMHgyO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtSW5mbzsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGluZm86IGFueSA9IGluZm9zW2ldO1xuXG4gICAgICAgIHJlc3BvbnNlLndyaXRlVUludDE2TEUoaW5mby5oYW5kbGUsIDIgKyBpICogbGVuZ3RoUGVySW5mbyk7XG5cbiAgICAgICAgdXVpZCA9IEJ1ZmZlci5mcm9tKFxuICAgICAgICAgIGluZm8udXVpZFxuICAgICAgICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgICAgIC5qb2luKFwiXCIpLFxuICAgICAgICAgIFwiaGV4XCIsXG4gICAgICAgICk7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdXVpZC5sZW5ndGg7IGorKykge1xuICAgICAgICAgIHJlc3BvbnNlWzIgKyBpICogbGVuZ3RoUGVySW5mbyArIDIgKyBqXSA9IHV1aWRbal07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgIEFUVF9PUF9GSU5EX0lORk9fUkVRLFxuICAgICAgICBzdGFydEhhbmRsZSxcbiAgICAgICAgQVRUX0VDT0RFX0FUVFJfTk9UX0ZPVU5ELFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlRmluZEJ5VHlwZVJlcXVlc3QocmVxdWVzdDogYW55KSB7XG4gICAgbGV0IHJlc3BvbnNlOiBhbnkgPSBudWxsO1xuXG4gICAgY29uc3Qgc3RhcnRIYW5kbGU6IGFueSA9IHJlcXVlc3QucmVhZFVJbnQxNkxFKDEpO1xuICAgIGNvbnN0IGVuZEhhbmRsZTogYW55ID0gcmVxdWVzdC5yZWFkVUludDE2TEUoMyk7XG4gICAgY29uc3QgdXVpZDogYW55ID0gcmVxdWVzdFxuICAgICAgLnNsaWNlKDUsIDcpXG4gICAgICAudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIC5tYXRjaCgvLnsxLDJ9L2cpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAuam9pbihcIlwiKTtcbiAgICBjb25zdCB2YWx1ZTogYW55ID0gcmVxdWVzdFxuICAgICAgLnNsaWNlKDcpXG4gICAgICAudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIC5tYXRjaCgvLnsxLDJ9L2cpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAuam9pbihcIlwiKTtcblxuICAgIGNvbnN0IGhhbmRsZXM6IGFueSA9IFtdO1xuICAgIGxldCBoYW5kbGU6IGFueTtcblxuICAgIGZvciAobGV0IGkgPSBzdGFydEhhbmRsZTsgaSA8PSBlbmRIYW5kbGU7IGkrKykge1xuICAgICAgaGFuZGxlID0gdGhpcy5faGFuZGxlc1tpXTtcblxuICAgICAgaWYgKCFoYW5kbGUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgXCIyODAwXCIgPT09IHV1aWQgJiZcbiAgICAgICAgaGFuZGxlLnR5cGUgPT09IFwic2VydmljZVwiICYmXG4gICAgICAgIGhhbmRsZS51dWlkID09PSB2YWx1ZVxuICAgICAgKSB7XG4gICAgICAgIGhhbmRsZXMucHVzaCh7XG4gICAgICAgICAgc3RhcnQ6IGhhbmRsZS5zdGFydEhhbmRsZSxcbiAgICAgICAgICBlbmQ6IGhhbmRsZS5lbmRIYW5kbGUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYW5kbGVzLmxlbmd0aCkge1xuICAgICAgY29uc3QgbGVuZ3RoUGVySGFuZGxlOiBhbnkgPSA0O1xuICAgICAgbGV0IG51bUhhbmRsZXM6IGFueSA9IGhhbmRsZXMubGVuZ3RoO1xuICAgICAgY29uc3QgbWF4SGFuZGxlczogYW55ID0gTWF0aC5mbG9vcigodGhpcy5fbXR1IC0gMSkgLyBsZW5ndGhQZXJIYW5kbGUpO1xuXG4gICAgICBudW1IYW5kbGVzID0gTWF0aC5taW4obnVtSGFuZGxlcywgbWF4SGFuZGxlcyk7XG5cbiAgICAgIHJlc3BvbnNlID0gQnVmZmVyLmFsbG9jKDEgKyBudW1IYW5kbGVzICogbGVuZ3RoUGVySGFuZGxlKTtcblxuICAgICAgcmVzcG9uc2VbMF0gPSBBVFRfT1BfRklORF9CWV9UWVBFX1JFU1A7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtSGFuZGxlczsgaSsrKSB7XG4gICAgICAgIGhhbmRsZSA9IGhhbmRsZXNbaV07XG5cbiAgICAgICAgcmVzcG9uc2Uud3JpdGVVSW50MTZMRShoYW5kbGUuc3RhcnQsIDEgKyBpICogbGVuZ3RoUGVySGFuZGxlKTtcbiAgICAgICAgcmVzcG9uc2Uud3JpdGVVSW50MTZMRShoYW5kbGUuZW5kLCAxICsgaSAqIGxlbmd0aFBlckhhbmRsZSArIDIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXNwb25zZSA9IHRoaXMuZXJyb3JSZXNwb25zZShcbiAgICAgICAgQVRUX09QX0ZJTkRfQllfVFlQRV9SRVEsXG4gICAgICAgIHN0YXJ0SGFuZGxlLFxuICAgICAgICBBVFRfRUNPREVfQVRUUl9OT1RfRk9VTkQsXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVSZWFkQnlHcm91cFJlcXVlc3QocmVxdWVzdDogYW55KSB7XG4gICAgbGV0IHJlc3BvbnNlOiBhbnkgPSBudWxsO1xuXG4gICAgY29uc3Qgc3RhcnRIYW5kbGU6IGFueSA9IHJlcXVlc3QucmVhZFVJbnQxNkxFKDEpO1xuICAgIGNvbnN0IGVuZEhhbmRsZTogYW55ID0gcmVxdWVzdC5yZWFkVUludDE2TEUoMyk7XG4gICAgY29uc3QgdXVpZDogYW55ID0gcmVxdWVzdFxuICAgICAgLnNsaWNlKDUpXG4gICAgICAudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIC5tYXRjaCgvLnsxLDJ9L2cpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAuam9pbihcIlwiKTtcblxuICAgIGRlYnVnKFxuICAgICAgXCJyZWFkIGJ5IGdyb3VwOiBzdGFydEhhbmRsZSA9IDB4XCIgK1xuICAgICAgc3RhcnRIYW5kbGUudG9TdHJpbmcoMTYpICtcbiAgICAgIFwiLCBlbmRIYW5kbGUgPSAweFwiICtcbiAgICAgIGVuZEhhbmRsZS50b1N0cmluZygxNikgK1xuICAgICAgXCIsIHV1aWQgPSAweFwiICtcbiAgICAgIHV1aWQudG9TdHJpbmcoMTYpLFxuICAgICk7XG5cbiAgICBpZiAoXCIyODAwXCIgPT09IHV1aWQgfHwgXCIyODAyXCIgPT09IHV1aWQpIHtcbiAgICAgIGNvbnN0IHNlcnZpY2VzOiBhbnkgPSBbXTtcbiAgICAgIGNvbnN0IHR5cGU6IGFueSA9IFwiMjgwMFwiID09PSB1dWlkID8gXCJzZXJ2aWNlXCIgOiBcImluY2x1ZGVkU2VydmljZVwiO1xuICAgICAgbGV0IGk6IGFueTtcblxuICAgICAgZm9yIChpID0gc3RhcnRIYW5kbGU7IGkgPD0gZW5kSGFuZGxlOyBpKyspIHtcbiAgICAgICAgY29uc3QgaGFuZGxlOiBhbnkgPSB0aGlzLl9oYW5kbGVzW2ldO1xuXG4gICAgICAgIGlmICghaGFuZGxlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFuZGxlLnR5cGUgPT09IHR5cGUpIHtcbiAgICAgICAgICBzZXJ2aWNlcy5wdXNoKGhhbmRsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNlcnZpY2VzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCB1dWlkU2l6ZTogYW55ID0gc2VydmljZXNbMF0udXVpZC5sZW5ndGggLyAyO1xuICAgICAgICBsZXQgbnVtU2VydmljZXM6IGFueSA9IDE7XG5cbiAgICAgICAgZm9yIChpID0gMTsgaSA8IHNlcnZpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHNlcnZpY2VzWzBdLnV1aWQubGVuZ3RoICE9PSBzZXJ2aWNlc1tpXS51dWlkLmxlbmd0aCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIG51bVNlcnZpY2VzKys7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsZW5ndGhQZXJTZXJ2aWNlOiBhbnkgPSB1dWlkU2l6ZSA9PT0gMiA/IDYgOiAyMDtcbiAgICAgICAgY29uc3QgbWF4U2VydmljZXM6IGFueSA9IE1hdGguZmxvb3IoKHRoaXMuX210dSAtIDIpIC8gbGVuZ3RoUGVyU2VydmljZSk7XG4gICAgICAgIG51bVNlcnZpY2VzID0gTWF0aC5taW4obnVtU2VydmljZXMsIG1heFNlcnZpY2VzKTtcblxuICAgICAgICByZXNwb25zZSA9IEJ1ZmZlci5hbGxvYygyICsgbnVtU2VydmljZXMgKiBsZW5ndGhQZXJTZXJ2aWNlKTtcblxuICAgICAgICByZXNwb25zZVswXSA9IEFUVF9PUF9SRUFEX0JZX0dST1VQX1JFU1A7XG4gICAgICAgIHJlc3BvbnNlWzFdID0gbGVuZ3RoUGVyU2VydmljZTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtU2VydmljZXM7IGkrKykge1xuICAgICAgICAgIGNvbnN0IHNlcnZpY2U6IGFueSA9IHNlcnZpY2VzW2ldO1xuXG4gICAgICAgICAgcmVzcG9uc2Uud3JpdGVVSW50MTZMRShzZXJ2aWNlLnN0YXJ0SGFuZGxlLCAyICsgaSAqIGxlbmd0aFBlclNlcnZpY2UpO1xuICAgICAgICAgIHJlc3BvbnNlLndyaXRlVUludDE2TEUoXG4gICAgICAgICAgICBzZXJ2aWNlLmVuZEhhbmRsZSxcbiAgICAgICAgICAgIDIgKyBpICogbGVuZ3RoUGVyU2VydmljZSArIDIsXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGNvbnN0IHNlcnZpY2VVdWlkOiBhbnkgPSBCdWZmZXIuZnJvbShcbiAgICAgICAgICAgIHNlcnZpY2UudXVpZFxuICAgICAgICAgICAgICAubWF0Y2goLy57MSwyfS9nKVxuICAgICAgICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgICAgICAgIC5qb2luKFwiXCIpLFxuICAgICAgICAgICAgXCJoZXhcIixcbiAgICAgICAgICApO1xuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VydmljZVV1aWQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHJlc3BvbnNlWzIgKyBpICogbGVuZ3RoUGVyU2VydmljZSArIDQgKyBqXSA9IHNlcnZpY2VVdWlkW2pdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgICAgQVRUX09QX1JFQURfQllfR1JPVVBfUkVRLFxuICAgICAgICAgIHN0YXJ0SGFuZGxlLFxuICAgICAgICAgIEFUVF9FQ09ERV9BVFRSX05PVF9GT1VORCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgIEFUVF9PUF9SRUFEX0JZX0dST1VQX1JFUSxcbiAgICAgICAgc3RhcnRIYW5kbGUsXG4gICAgICAgIEFUVF9FQ09ERV9VTlNVUFBfR1JQX1RZUEUsXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVSZWFkQnlUeXBlUmVxdWVzdChyZXF1ZXN0OiBhbnkpIHtcbiAgICBsZXQgcmVzcG9uc2U6IGFueSA9IG51bGw7XG4gICAgY29uc3QgcmVxdWVzdFR5cGU6IGFueSA9IHJlcXVlc3RbMF07XG5cbiAgICBjb25zdCBzdGFydEhhbmRsZTogYW55ID0gcmVxdWVzdC5yZWFkVUludDE2TEUoMSk7XG4gICAgY29uc3QgZW5kSGFuZGxlOiBhbnkgPSByZXF1ZXN0LnJlYWRVSW50MTZMRSgzKTtcbiAgICBjb25zdCB1dWlkOiBhbnkgPSByZXF1ZXN0XG4gICAgICAuc2xpY2UoNSlcbiAgICAgIC50b1N0cmluZyhcImhleFwiKVxuICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC5qb2luKFwiXCIpO1xuICAgIGxldCBpOiBhbnk7XG4gICAgbGV0IGhhbmRsZTogYW55O1xuXG4gICAgZGVidWcoXG4gICAgICBcInJlYWQgYnkgdHlwZTogc3RhcnRIYW5kbGUgPSAweFwiICtcbiAgICAgIHN0YXJ0SGFuZGxlLnRvU3RyaW5nKDE2KSArXG4gICAgICBcIiwgZW5kSGFuZGxlID0gMHhcIiArXG4gICAgICBlbmRIYW5kbGUudG9TdHJpbmcoMTYpICtcbiAgICAgIFwiLCB1dWlkID0gMHhcIiArXG4gICAgICB1dWlkLnRvU3RyaW5nKDE2KSxcbiAgICApO1xuXG4gICAgaWYgKFwiMjgwM1wiID09PSB1dWlkKSB7XG4gICAgICBjb25zdCBjaGFyYWN0ZXJpc3RpY3M6IGFueSA9IFtdO1xuXG4gICAgICBmb3IgKGkgPSBzdGFydEhhbmRsZTsgaSA8PSBlbmRIYW5kbGU7IGkrKykge1xuICAgICAgICBoYW5kbGUgPSB0aGlzLl9oYW5kbGVzW2ldO1xuXG4gICAgICAgIGlmICghaGFuZGxlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFuZGxlLnR5cGUgPT09IFwiY2hhcmFjdGVyaXN0aWNcIikge1xuICAgICAgICAgIGNoYXJhY3RlcmlzdGljcy5wdXNoKGhhbmRsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNoYXJhY3RlcmlzdGljcy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgdXVpZFNpemU6IGFueSA9IGNoYXJhY3RlcmlzdGljc1swXS51dWlkLmxlbmd0aCAvIDI7XG4gICAgICAgIGxldCBudW1DaGFyYWN0ZXJpc3RpY3M6IGFueSA9IDE7XG5cbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGNoYXJhY3RlcmlzdGljcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljc1swXS51dWlkLmxlbmd0aCAhPT0gY2hhcmFjdGVyaXN0aWNzW2ldLnV1aWQubGVuZ3RoXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgbnVtQ2hhcmFjdGVyaXN0aWNzKys7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsZW5ndGhQZXJDaGFyYWN0ZXJpc3RpYzogYW55ID0gdXVpZFNpemUgPT09IDIgPyA3IDogMjE7XG4gICAgICAgIGNvbnN0IG1heENoYXJhY3RlcmlzdGljczogYW55ID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAodGhpcy5fbXR1IC0gMikgLyBsZW5ndGhQZXJDaGFyYWN0ZXJpc3RpYyxcbiAgICAgICAgKTtcbiAgICAgICAgbnVtQ2hhcmFjdGVyaXN0aWNzID0gTWF0aC5taW4obnVtQ2hhcmFjdGVyaXN0aWNzLCBtYXhDaGFyYWN0ZXJpc3RpY3MpO1xuXG4gICAgICAgIHJlc3BvbnNlID0gQnVmZmVyLmFsbG9jKFxuICAgICAgICAgIDIgKyBudW1DaGFyYWN0ZXJpc3RpY3MgKiBsZW5ndGhQZXJDaGFyYWN0ZXJpc3RpYyxcbiAgICAgICAgKTtcblxuICAgICAgICByZXNwb25zZVswXSA9IEFUVF9PUF9SRUFEX0JZX1RZUEVfUkVTUDtcbiAgICAgICAgcmVzcG9uc2VbMV0gPSBsZW5ndGhQZXJDaGFyYWN0ZXJpc3RpYztcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtQ2hhcmFjdGVyaXN0aWNzOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBjaGFyYWN0ZXJpc3RpYzogYW55ID0gY2hhcmFjdGVyaXN0aWNzW2ldO1xuXG4gICAgICAgICAgcmVzcG9uc2Uud3JpdGVVSW50MTZMRShcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljLnN0YXJ0SGFuZGxlLFxuICAgICAgICAgICAgMiArIGkgKiBsZW5ndGhQZXJDaGFyYWN0ZXJpc3RpYyxcbiAgICAgICAgICApO1xuICAgICAgICAgIHJlc3BvbnNlLndyaXRlVUludDgoXG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpYy5wcm9wZXJ0aWVzLFxuICAgICAgICAgICAgMiArIGkgKiBsZW5ndGhQZXJDaGFyYWN0ZXJpc3RpYyArIDIsXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXNwb25zZS53cml0ZVVJbnQxNkxFKFxuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWMudmFsdWVIYW5kbGUsXG4gICAgICAgICAgICAyICsgaSAqIGxlbmd0aFBlckNoYXJhY3RlcmlzdGljICsgMyxcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgY29uc3QgY2hhcmFjdGVyaXN0aWNVdWlkOiBhbnkgPSBCdWZmZXIuZnJvbShcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljLnV1aWRcbiAgICAgICAgICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgICAgICAuam9pbihcIlwiKSxcbiAgICAgICAgICAgIFwiaGV4XCIsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNoYXJhY3RlcmlzdGljVXVpZC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgcmVzcG9uc2VbMiArIGkgKiBsZW5ndGhQZXJDaGFyYWN0ZXJpc3RpYyArIDUgKyBqXSA9XG4gICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljVXVpZFtqXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3BvbnNlID0gdGhpcy5lcnJvclJlc3BvbnNlKFxuICAgICAgICAgIEFUVF9PUF9SRUFEX0JZX1RZUEVfUkVRLFxuICAgICAgICAgIHN0YXJ0SGFuZGxlLFxuICAgICAgICAgIEFUVF9FQ09ERV9BVFRSX05PVF9GT1VORCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGhhbmRsZUF0dHJpYnV0ZTogYW55ID0gbnVsbDtcbiAgICAgIGxldCB2YWx1ZUhhbmRsZTogYW55ID0gbnVsbDtcbiAgICAgIGxldCBzZWN1cmU6IGFueSA9IGZhbHNlO1xuXG4gICAgICBmb3IgKGkgPSBzdGFydEhhbmRsZTsgaSA8PSBlbmRIYW5kbGU7IGkrKykge1xuICAgICAgICBoYW5kbGUgPSB0aGlzLl9oYW5kbGVzW2ldO1xuXG4gICAgICAgIGlmICghaGFuZGxlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFuZGxlLnR5cGUgPT09IFwiY2hhcmFjdGVyaXN0aWNcIiAmJiBoYW5kbGUudXVpZCA9PT0gdXVpZCkge1xuICAgICAgICAgIGhhbmRsZUF0dHJpYnV0ZSA9IGhhbmRsZS5hdHRyaWJ1dGU7XG4gICAgICAgICAgdmFsdWVIYW5kbGUgPSBoYW5kbGUudmFsdWVIYW5kbGU7XG4gICAgICAgICAgc2VjdXJlID0gaGFuZGxlLnNlY3VyZSAmIDB4MDI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSBpZiAoaGFuZGxlLnR5cGUgPT09IFwiZGVzY3JpcHRvclwiICYmIGhhbmRsZS51dWlkID09PSB1dWlkKSB7XG4gICAgICAgICAgdmFsdWVIYW5kbGUgPSBpO1xuICAgICAgICAgIHNlY3VyZSA9IGhhbmRsZS5zZWN1cmUgJiAweDAyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWN1cmUgJiYgIXRoaXMuX2FjbFN0cmVhbS5lbmNyeXB0ZWQpIHtcbiAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgICAgQVRUX09QX1JFQURfQllfVFlQRV9SRVEsXG4gICAgICAgICAgc3RhcnRIYW5kbGUsXG4gICAgICAgICAgQVRUX0VDT0RFX0FVVEhFTlRJQ0FUSU9OLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZUhhbmRsZSkge1xuICAgICAgICBjb25zdCBjYWxsYmFjazogYW55ID0gKChfdmFsdWVIYW5kbGU6IGFueSkgPT4ge1xuICAgICAgICAgIHJldHVybiAocmVzdWx0OiBhbnksIF9kYXRhOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGxldCBjYWxsYmFja1Jlc3BvbnNlOiBhbnkgPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAoQVRUX0VDT0RFX1NVQ0NFU1MgPT09IHJlc3VsdCkge1xuICAgICAgICAgICAgICBjb25zdCBkYXRhTGVuZ3RoOiBhbnkgPSBNYXRoLm1pbihfZGF0YS5sZW5ndGgsIHRoaXMuX210dSAtIDQpO1xuICAgICAgICAgICAgICBjYWxsYmFja1Jlc3BvbnNlID0gQnVmZmVyLmFsbG9jKDQgKyBkYXRhTGVuZ3RoKTtcblxuICAgICAgICAgICAgICBjYWxsYmFja1Jlc3BvbnNlWzBdID0gQVRUX09QX1JFQURfQllfVFlQRV9SRVNQO1xuICAgICAgICAgICAgICBjYWxsYmFja1Jlc3BvbnNlWzFdID0gZGF0YUxlbmd0aCArIDI7XG4gICAgICAgICAgICAgIGNhbGxiYWNrUmVzcG9uc2Uud3JpdGVVSW50MTZMRShfdmFsdWVIYW5kbGUsIDIpO1xuICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YUxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tSZXNwb25zZVs0ICsgaV0gPSBfZGF0YVtpXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2tSZXNwb25zZSA9IHRoaXMuZXJyb3JSZXNwb25zZShcbiAgICAgICAgICAgICAgICByZXF1ZXN0VHlwZSxcbiAgICAgICAgICAgICAgICBfdmFsdWVIYW5kbGUsXG4gICAgICAgICAgICAgICAgcmVzdWx0LFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWJ1ZyhcInJlYWQgYnkgdHlwZSByZXNwb25zZTogXCIgKyBjYWxsYmFja1Jlc3BvbnNlLnRvU3RyaW5nKFwiaGV4XCIpKTtcblxuICAgICAgICAgICAgdGhpcy5zZW5kKGNhbGxiYWNrUmVzcG9uc2UpO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHZhbHVlSGFuZGxlKTtcblxuICAgICAgICBjb25zdCBkYXRhOiBhbnkgPSB0aGlzLl9oYW5kbGVzW3ZhbHVlSGFuZGxlXS52YWx1ZTtcblxuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgIGNhbGxiYWNrKEFUVF9FQ09ERV9TVUNDRVNTLCBkYXRhKTtcbiAgICAgICAgfSBlbHNlIGlmIChoYW5kbGVBdHRyaWJ1dGUpIHtcbiAgICAgICAgICBoYW5kbGVBdHRyaWJ1dGUuZW1pdChcInJlYWRSZXF1ZXN0XCIsIDAsIGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhBVFRfRUNPREVfVU5MSUtFTFkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNwb25zZSA9IHRoaXMuZXJyb3JSZXNwb25zZShcbiAgICAgICAgICBBVFRfT1BfUkVBRF9CWV9UWVBFX1JFUSxcbiAgICAgICAgICBzdGFydEhhbmRsZSxcbiAgICAgICAgICBBVFRfRUNPREVfQVRUUl9OT1RfRk9VTkQsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9XG5cbiAgcHVibGljIGhhbmRsZVJlYWRPclJlYWRCbG9iUmVxdWVzdChyZXF1ZXN0OiBhbnkpIHtcbiAgICBsZXQgcmVzcG9uc2U6IGFueSA9IG51bGw7XG5cbiAgICBjb25zdCByZXF1ZXN0VHlwZTogYW55ID0gcmVxdWVzdFswXTtcbiAgICBjb25zdCB2YWx1ZUhhbmRsZTogYW55ID0gcmVxdWVzdC5yZWFkVUludDE2TEUoMSk7XG4gICAgY29uc3Qgb2Zmc2V0OiBhbnkgPVxuICAgICAgcmVxdWVzdFR5cGUgPT09IEFUVF9PUF9SRUFEX0JMT0JfUkVRID8gcmVxdWVzdC5yZWFkVUludDE2TEUoMykgOiAwO1xuXG4gICAgY29uc3QgaGFuZGxlOiBhbnkgPSB0aGlzLl9oYW5kbGVzW3ZhbHVlSGFuZGxlXTtcbiAgICBsZXQgaTogYW55O1xuXG4gICAgaWYgKGhhbmRsZSkge1xuICAgICAgbGV0IHJlc3VsdDogYW55ID0gbnVsbDtcbiAgICAgIGxldCBkYXRhOiBhbnkgPSBudWxsO1xuICAgICAgY29uc3QgaGFuZGxlVHlwZTogYW55ID0gaGFuZGxlLnR5cGU7XG5cbiAgICAgIGNvbnN0IGNhbGxiYWNrOiBhbnkgPSAoKF9yZXF1ZXN0VHlwZTogYW55LCBfdmFsdWVIYW5kbGU6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gKF9yZXN1bHQ6IGFueSwgX2RhdGE6IGFueSkgPT4ge1xuICAgICAgICAgIGxldCBjYWxsYmFja1Jlc3BvbnNlOiBhbnkgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKEFUVF9FQ09ERV9TVUNDRVNTID09PSBfcmVzdWx0KSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhTGVuZ3RoOiBhbnkgPSBNYXRoLm1pbihfZGF0YS5sZW5ndGgsIHRoaXMuX210dSAtIDEpO1xuICAgICAgICAgICAgY2FsbGJhY2tSZXNwb25zZSA9IEJ1ZmZlci5hbGxvYygxICsgZGF0YUxlbmd0aCk7XG5cbiAgICAgICAgICAgIGNhbGxiYWNrUmVzcG9uc2VbMF0gPVxuICAgICAgICAgICAgICBfcmVxdWVzdFR5cGUgPT09IEFUVF9PUF9SRUFEX0JMT0JfUkVRXG4gICAgICAgICAgICAgICAgPyBBVFRfT1BfUkVBRF9CTE9CX1JFU1BcbiAgICAgICAgICAgICAgICA6IEFUVF9PUF9SRUFEX1JFU1A7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YUxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrUmVzcG9uc2VbMSArIGldID0gX2RhdGFbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrUmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgICAgICAgIF9yZXF1ZXN0VHlwZSxcbiAgICAgICAgICAgICAgX3ZhbHVlSGFuZGxlLFxuICAgICAgICAgICAgICBfcmVzdWx0LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkZWJ1ZyhcInJlYWQgcmVzcG9uc2U6IFwiICsgY2FsbGJhY2tSZXNwb25zZS50b1N0cmluZyhcImhleFwiKSk7XG5cbiAgICAgICAgICB0aGlzLnNlbmQoY2FsbGJhY2tSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICB9KShyZXF1ZXN0VHlwZSwgdmFsdWVIYW5kbGUpO1xuXG4gICAgICBpZiAoaGFuZGxlVHlwZSA9PT0gXCJzZXJ2aWNlXCIgfHwgaGFuZGxlVHlwZSA9PT0gXCJpbmNsdWRlZFNlcnZpY2VcIikge1xuICAgICAgICByZXN1bHQgPSBBVFRfRUNPREVfU1VDQ0VTUztcbiAgICAgICAgZGF0YSA9IEJ1ZmZlci5mcm9tKFxuICAgICAgICAgIGhhbmRsZS51dWlkXG4gICAgICAgICAgICAubWF0Y2goLy57MSwyfS9nKVxuICAgICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgICAgLmpvaW4oXCJcIiksXG4gICAgICAgICAgXCJoZXhcIixcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoaGFuZGxlVHlwZSA9PT0gXCJjaGFyYWN0ZXJpc3RpY1wiKSB7XG4gICAgICAgIGNvbnN0IHV1aWQ6IGFueSA9IEJ1ZmZlci5mcm9tKFxuICAgICAgICAgIGhhbmRsZS51dWlkXG4gICAgICAgICAgICAubWF0Y2goLy57MSwyfS9nKVxuICAgICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgICAgLmpvaW4oXCJcIiksXG4gICAgICAgICAgXCJoZXhcIixcbiAgICAgICAgKTtcblxuICAgICAgICByZXN1bHQgPSBBVFRfRUNPREVfU1VDQ0VTUztcbiAgICAgICAgZGF0YSA9IEJ1ZmZlci5hbGxvYygzICsgdXVpZC5sZW5ndGgpO1xuICAgICAgICBkYXRhLndyaXRlVUludDgoaGFuZGxlLnByb3BlcnRpZXMsIDApO1xuICAgICAgICBkYXRhLndyaXRlVUludDE2TEUoaGFuZGxlLnZhbHVlSGFuZGxlLCAxKTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdXVpZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGRhdGFbaSArIDNdID0gdXVpZFtpXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgaGFuZGxlVHlwZSA9PT0gXCJjaGFyYWN0ZXJpc3RpY1ZhbHVlXCIgfHxcbiAgICAgICAgaGFuZGxlVHlwZSA9PT0gXCJkZXNjcmlwdG9yXCJcbiAgICAgICkge1xuICAgICAgICBsZXQgaGFuZGxlUHJvcGVydGllczogYW55ID0gaGFuZGxlLnByb3BlcnRpZXM7XG4gICAgICAgIGxldCBoYW5kbGVTZWN1cmU6IGFueSA9IGhhbmRsZS5zZWN1cmU7XG4gICAgICAgIGxldCBoYW5kbGVBdHRyaWJ1dGU6IGFueSA9IGhhbmRsZS5hdHRyaWJ1dGU7XG4gICAgICAgIGlmIChoYW5kbGVUeXBlID09PSBcImNoYXJhY3RlcmlzdGljVmFsdWVcIikge1xuICAgICAgICAgIGhhbmRsZVByb3BlcnRpZXMgPSB0aGlzLl9oYW5kbGVzW3ZhbHVlSGFuZGxlIC0gMV0ucHJvcGVydGllcztcbiAgICAgICAgICBoYW5kbGVTZWN1cmUgPSB0aGlzLl9oYW5kbGVzW3ZhbHVlSGFuZGxlIC0gMV0uc2VjdXJlO1xuICAgICAgICAgIGhhbmRsZUF0dHJpYnV0ZSA9IHRoaXMuX2hhbmRsZXNbdmFsdWVIYW5kbGUgLSAxXS5hdHRyaWJ1dGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFuZGxlUHJvcGVydGllcyAmIDB4MDIpIHtcbiAgICAgICAgICBpZiAoaGFuZGxlU2VjdXJlICYgMHgwMiAmJiAhdGhpcy5fYWNsU3RyZWFtLmVuY3J5cHRlZCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gQVRUX0VDT0RFX0FVVEhFTlRJQ0FUSU9OO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhID0gaGFuZGxlLnZhbHVlO1xuXG4gICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICByZXN1bHQgPSBBVFRfRUNPREVfU1VDQ0VTUztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGhhbmRsZUF0dHJpYnV0ZS5lbWl0KFwicmVhZFJlcXVlc3RcIiwgb2Zmc2V0LCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCA9IEFUVF9FQ09ERV9SRUFEX05PVF9QRVJNOyAvLyBub24tcmVhZGFibGVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZGF0YSAmJiB0eXBlb2YgZGF0YSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBkYXRhID0gQnVmZmVyLmZyb20oZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXN1bHQgPT09IEFUVF9FQ09ERV9TVUNDRVNTICYmIGRhdGEgJiYgb2Zmc2V0KSB7XG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA8IG9mZnNldCkge1xuICAgICAgICAgIHJlc3VsdCA9IEFUVF9FQ09ERV9JTlZBTElEX09GRlNFVDtcbiAgICAgICAgICBkYXRhID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkYXRhID0gZGF0YS5zbGljZShvZmZzZXQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgY2FsbGJhY2socmVzdWx0LCBkYXRhKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgIHJlcXVlc3RUeXBlLFxuICAgICAgICB2YWx1ZUhhbmRsZSxcbiAgICAgICAgQVRUX0VDT0RFX0lOVkFMSURfSEFORExFLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlV3JpdGVSZXF1ZXN0T3JDb21tYW5kKHJlcXVlc3Q6IGFueSkge1xuICAgIGxldCByZXNwb25zZTogYW55ID0gbnVsbDtcblxuICAgIGNvbnN0IHJlcXVlc3RUeXBlOiBhbnkgPSByZXF1ZXN0WzBdO1xuICAgIGNvbnN0IHdpdGhvdXRSZXNwb25zZTogYW55ID0gcmVxdWVzdFR5cGUgPT09IEFUVF9PUF9XUklURV9DTUQ7XG4gICAgY29uc3QgdmFsdWVIYW5kbGU6IGFueSA9IHJlcXVlc3QucmVhZFVJbnQxNkxFKDEpO1xuICAgIGNvbnN0IGRhdGE6IGFueSA9IHJlcXVlc3Quc2xpY2UoMyk7XG4gICAgY29uc3Qgb2Zmc2V0OiBhbnkgPSAwO1xuXG4gICAgbGV0IGhhbmRsZTogYW55ID0gdGhpcy5faGFuZGxlc1t2YWx1ZUhhbmRsZV07XG5cbiAgICBpZiAoaGFuZGxlKSB7XG4gICAgICBpZiAoaGFuZGxlLnR5cGUgPT09IFwiY2hhcmFjdGVyaXN0aWNWYWx1ZVwiKSB7XG4gICAgICAgIGhhbmRsZSA9IHRoaXMuX2hhbmRsZXNbdmFsdWVIYW5kbGUgLSAxXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaGFuZGxlUHJvcGVydGllczogYW55ID0gaGFuZGxlLnByb3BlcnRpZXM7XG4gICAgICBjb25zdCBoYW5kbGVTZWN1cmU6IGFueSA9IGhhbmRsZS5zZWN1cmU7XG5cbiAgICAgIGlmIChcbiAgICAgICAgaGFuZGxlUHJvcGVydGllcyAmJlxuICAgICAgICAod2l0aG91dFJlc3BvbnNlID8gaGFuZGxlUHJvcGVydGllcyAmIDB4MDQgOiBoYW5kbGVQcm9wZXJ0aWVzICYgMHgwOClcbiAgICAgICkge1xuICAgICAgICBjb25zdCBjYWxsYmFjazogYW55ID0gKChfcmVxdWVzdFR5cGU6IGFueSwgX3ZhbHVlSGFuZGxlOiBhbnksIF93aXRob3V0UmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICAgIHJldHVybiAocmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmICghX3dpdGhvdXRSZXNwb25zZSkge1xuICAgICAgICAgICAgICBsZXQgY2FsbGJhY2tSZXNwb25zZTogYW55ID0gbnVsbDtcblxuICAgICAgICAgICAgICBpZiAoQVRUX0VDT0RFX1NVQ0NFU1MgPT09IHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrUmVzcG9uc2UgPSBCdWZmZXIuZnJvbShbQVRUX09QX1dSSVRFX1JFU1BdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFja1Jlc3BvbnNlID0gdGhpcy5lcnJvclJlc3BvbnNlKFxuICAgICAgICAgICAgICAgICAgX3JlcXVlc3RUeXBlLFxuICAgICAgICAgICAgICAgICAgX3ZhbHVlSGFuZGxlLFxuICAgICAgICAgICAgICAgICAgcmVzdWx0LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBkZWJ1ZyhcIndyaXRlIHJlc3BvbnNlOiBcIiArIGNhbGxiYWNrUmVzcG9uc2UudG9TdHJpbmcoXCJoZXhcIikpO1xuXG4gICAgICAgICAgICAgIHRoaXMuc2VuZChjYWxsYmFja1Jlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9KShyZXF1ZXN0VHlwZSwgdmFsdWVIYW5kbGUsIHdpdGhvdXRSZXNwb25zZSk7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGhhbmRsZVNlY3VyZSAmICh3aXRob3V0UmVzcG9uc2UgPyAweDA0IDogMHgwOCkgJiZcbiAgICAgICAgICAhdGhpcy5fYWNsU3RyZWFtLmVuY3J5cHRlZFxuICAgICAgICApIHtcbiAgICAgICAgICByZXNwb25zZSA9IHRoaXMuZXJyb3JSZXNwb25zZShcbiAgICAgICAgICAgIHJlcXVlc3RUeXBlLFxuICAgICAgICAgICAgdmFsdWVIYW5kbGUsXG4gICAgICAgICAgICBBVFRfRUNPREVfQVVUSEVOVElDQVRJT04sXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChoYW5kbGUudHlwZSA9PT0gXCJkZXNjcmlwdG9yXCIgfHwgaGFuZGxlLnV1aWQgPT09IFwiMjkwMlwiKSB7XG4gICAgICAgICAgbGV0IHJlc3VsdDogYW55ID0gbnVsbDtcblxuICAgICAgICAgIGlmIChkYXRhLmxlbmd0aCAhPT0gMikge1xuICAgICAgICAgICAgcmVzdWx0ID0gQVRUX0VDT0RFX0lOVkFMX0FUVFJfVkFMVUVfTEVOO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZTogYW55ID0gZGF0YS5yZWFkVUludDE2TEUoMCk7XG4gICAgICAgICAgICBjb25zdCBoYW5kbGVBdHRyaWJ1dGU6IGFueSA9IGhhbmRsZS5hdHRyaWJ1dGU7XG5cbiAgICAgICAgICAgIGhhbmRsZS52YWx1ZSA9IGRhdGE7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSAmIDB4MDAwMykge1xuICAgICAgICAgICAgICBjb25zdCB1cGRhdGVWYWx1ZUNhbGxiYWNrOiBhbnkgPSAoKF92YWx1ZUhhbmRsZTogYW55LCBfYXR0cmlidXRlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKF9kYXRhOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFMZW5ndGg6IGFueSA9IE1hdGgubWluKF9kYXRhLmxlbmd0aCwgdGhpcy5fbXR1IC0gMyk7XG4gICAgICAgICAgICAgICAgICBjb25zdCB1c2VOb3RpZnk6IGFueSA9IF9hdHRyaWJ1dGUucHJvcGVydGllcy5pbmRleE9mKFwibm90aWZ5XCIpICE9PSAtMTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZUluZGljYXRlOiBhbnkgPVxuICAgICAgICAgICAgICAgICAgICBfYXR0cmlidXRlLnByb3BlcnRpZXMuaW5kZXhPZihcImluZGljYXRlXCIpICE9PSAtMTtcbiAgICAgICAgICAgICAgICAgIGxldCBpOiBhbnk7XG5cbiAgICAgICAgICAgICAgICAgIGlmICh1c2VOb3RpZnkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm90aWZ5TWVzc2FnZTogYW55ID0gQnVmZmVyLmFsbG9jKDMgKyBkYXRhTGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgICAgICBub3RpZnlNZXNzYWdlLndyaXRlVUludDgoQVRUX09QX0hBTkRMRV9OT1RJRlksIDApO1xuICAgICAgICAgICAgICAgICAgICBub3RpZnlNZXNzYWdlLndyaXRlVUludDE2TEUoX3ZhbHVlSGFuZGxlLCAxKTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YUxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbm90aWZ5TWVzc2FnZVszICsgaV0gPSBfZGF0YVtpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKFwibm90aWZ5IG1lc3NhZ2U6IFwiICsgbm90aWZ5TWVzc2FnZS50b1N0cmluZyhcImhleFwiKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZChub3RpZnlNZXNzYWdlKTtcblxuICAgICAgICAgICAgICAgICAgICBfYXR0cmlidXRlLmVtaXQoXCJub3RpZnlcIik7XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHVzZUluZGljYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGljYXRlTWVzc2FnZTogYW55ID0gQnVmZmVyLmFsbG9jKDMgKyBkYXRhTGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgICAgICBpbmRpY2F0ZU1lc3NhZ2Uud3JpdGVVSW50OChBVFRfT1BfSEFORExFX0lORCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGluZGljYXRlTWVzc2FnZS53cml0ZVVJbnQxNkxFKF92YWx1ZUhhbmRsZSwgMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGRhdGFMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgIGluZGljYXRlTWVzc2FnZVszICsgaV0gPSBfZGF0YVtpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RJbmRpY2F0ZWRBdHRyaWJ1dGUgPSBfYXR0cmlidXRlO1xuXG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKFxuICAgICAgICAgICAgICAgICAgICAgIFwiaW5kaWNhdGUgbWVzc2FnZTogXCIgKyBpbmRpY2F0ZU1lc3NhZ2UudG9TdHJpbmcoXCJoZXhcIiksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZChpbmRpY2F0ZU1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH0pKHZhbHVlSGFuZGxlIC0gMSwgaGFuZGxlQXR0cmlidXRlKTtcblxuICAgICAgICAgICAgICBpZiAoaGFuZGxlQXR0cmlidXRlLmVtaXQpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVBdHRyaWJ1dGUuZW1pdChcbiAgICAgICAgICAgICAgICAgIFwic3Vic2NyaWJlXCIsXG4gICAgICAgICAgICAgICAgICB0aGlzLl9tdHUgLSAzLFxuICAgICAgICAgICAgICAgICAgdXBkYXRlVmFsdWVDYWxsYmFjayxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBoYW5kbGVBdHRyaWJ1dGUuZW1pdChcInVuc3Vic2NyaWJlXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXN1bHQgPSBBVFRfRUNPREVfU1VDQ0VTUztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjYWxsYmFjayhyZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhhbmRsZS5hdHRyaWJ1dGUuZW1pdChcbiAgICAgICAgICAgIFwid3JpdGVSZXF1ZXN0XCIsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgb2Zmc2V0LFxuICAgICAgICAgICAgd2l0aG91dFJlc3BvbnNlLFxuICAgICAgICAgICAgY2FsbGJhY2ssXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgICAgcmVxdWVzdFR5cGUsXG4gICAgICAgICAgdmFsdWVIYW5kbGUsXG4gICAgICAgICAgQVRUX0VDT0RFX1dSSVRFX05PVF9QRVJNLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXNwb25zZSA9IHRoaXMuZXJyb3JSZXNwb25zZShcbiAgICAgICAgcmVxdWVzdFR5cGUsXG4gICAgICAgIHZhbHVlSGFuZGxlLFxuICAgICAgICBBVFRfRUNPREVfSU5WQUxJRF9IQU5ETEUsXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVQcmVwYXJlV3JpdGVSZXF1ZXN0KHJlcXVlc3Q6IGFueSkge1xuICAgIGxldCByZXNwb25zZTogYW55ID0gbnVsbDtcblxuICAgIGNvbnN0IHJlcXVlc3RUeXBlOiBhbnkgPSByZXF1ZXN0WzBdO1xuICAgIGNvbnN0IHZhbHVlSGFuZGxlOiBhbnkgPSByZXF1ZXN0LnJlYWRVSW50MTZMRSgxKTtcbiAgICBjb25zdCBvZmZzZXQ6IGFueSA9IHJlcXVlc3QucmVhZFVJbnQxNkxFKDMpO1xuICAgIGNvbnN0IGRhdGE6IGFueSA9IHJlcXVlc3Quc2xpY2UoNSk7XG5cbiAgICBsZXQgaGFuZGxlOiBhbnkgPSB0aGlzLl9oYW5kbGVzW3ZhbHVlSGFuZGxlXTtcblxuICAgIGlmIChoYW5kbGUpIHtcbiAgICAgIGlmIChoYW5kbGUudHlwZSA9PT0gXCJjaGFyYWN0ZXJpc3RpY1ZhbHVlXCIpIHtcbiAgICAgICAgaGFuZGxlID0gdGhpcy5faGFuZGxlc1t2YWx1ZUhhbmRsZSAtIDFdO1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZVByb3BlcnRpZXM6IGFueSA9IGhhbmRsZS5wcm9wZXJ0aWVzO1xuICAgICAgICBjb25zdCBoYW5kbGVTZWN1cmU6IGFueSA9IGhhbmRsZS5zZWN1cmU7XG5cbiAgICAgICAgaWYgKGhhbmRsZVByb3BlcnRpZXMgJiYgaGFuZGxlUHJvcGVydGllcyAmIDB4MDgpIHtcbiAgICAgICAgICBpZiAoaGFuZGxlU2VjdXJlICYgMHgwOCAmJiAhdGhpcy5fYWNsU3RyZWFtLmVuY3J5cHRlZCkge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgICAgICAgIHJlcXVlc3RUeXBlLFxuICAgICAgICAgICAgICB2YWx1ZUhhbmRsZSxcbiAgICAgICAgICAgICAgQVRUX0VDT0RFX0FVVEhFTlRJQ0FUSU9OLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3ByZXBhcmVkV3JpdGVSZXF1ZXN0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcHJlcGFyZWRXcml0ZVJlcXVlc3QuaGFuZGxlICE9PSBoYW5kbGUpIHtcbiAgICAgICAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgICAgICAgICAgcmVxdWVzdFR5cGUsXG4gICAgICAgICAgICAgICAgdmFsdWVIYW5kbGUsXG4gICAgICAgICAgICAgICAgQVRUX0VDT0RFX1VOTElLRUxZLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgb2Zmc2V0ID09PVxuICAgICAgICAgICAgICB0aGlzLl9wcmVwYXJlZFdyaXRlUmVxdWVzdC5vZmZzZXQgK1xuICAgICAgICAgICAgICB0aGlzLl9wcmVwYXJlZFdyaXRlUmVxdWVzdC5kYXRhLmxlbmd0aFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHRoaXMuX3ByZXBhcmVkV3JpdGVSZXF1ZXN0LmRhdGEgPSBCdWZmZXIuY29uY2F0KFtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmVwYXJlZFdyaXRlUmVxdWVzdC5kYXRhLFxuICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICAgIHJlc3BvbnNlID0gQnVmZmVyLmFsbG9jKHJlcXVlc3QubGVuZ3RoKTtcbiAgICAgICAgICAgICAgcmVxdWVzdC5jb3B5KHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgcmVzcG9uc2VbMF0gPSBBVFRfT1BfUFJFUF9XUklURV9SRVNQO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgICAgICAgICAgcmVxdWVzdFR5cGUsXG4gICAgICAgICAgICAgICAgdmFsdWVIYW5kbGUsXG4gICAgICAgICAgICAgICAgQVRUX0VDT0RFX0lOVkFMSURfT0ZGU0VULFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wcmVwYXJlZFdyaXRlUmVxdWVzdCA9IHtcbiAgICAgICAgICAgICAgaGFuZGxlLFxuICAgICAgICAgICAgICB2YWx1ZUhhbmRsZSxcbiAgICAgICAgICAgICAgb2Zmc2V0LFxuICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmVzcG9uc2UgPSBCdWZmZXIuYWxsb2MocmVxdWVzdC5sZW5ndGgpO1xuICAgICAgICAgICAgcmVxdWVzdC5jb3B5KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHJlc3BvbnNlWzBdID0gQVRUX09QX1BSRVBfV1JJVEVfUkVTUDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UoXG4gICAgICAgICAgICByZXF1ZXN0VHlwZSxcbiAgICAgICAgICAgIHZhbHVlSGFuZGxlLFxuICAgICAgICAgICAgQVRUX0VDT0RFX1dSSVRFX05PVF9QRVJNLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3BvbnNlID0gdGhpcy5lcnJvclJlc3BvbnNlKFxuICAgICAgICAgIHJlcXVlc3RUeXBlLFxuICAgICAgICAgIHZhbHVlSGFuZGxlLFxuICAgICAgICAgIEFUVF9FQ09ERV9BVFRSX05PVF9MT05HLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXNwb25zZSA9IHRoaXMuZXJyb3JSZXNwb25zZShcbiAgICAgICAgcmVxdWVzdFR5cGUsXG4gICAgICAgIHZhbHVlSGFuZGxlLFxuICAgICAgICBBVFRfRUNPREVfSU5WQUxJRF9IQU5ETEUsXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVFeGVjdXRlV3JpdGVSZXF1ZXN0KHJlcXVlc3Q6IGFueSkge1xuICAgIGxldCByZXNwb25zZTogYW55ID0gbnVsbDtcblxuICAgIGNvbnN0IHJlcXVlc3RUeXBlOiBhbnkgPSByZXF1ZXN0WzBdO1xuICAgIGNvbnN0IGZsYWc6IGFueSA9IHJlcXVlc3RbMV07XG5cbiAgICBpZiAodGhpcy5fcHJlcGFyZWRXcml0ZVJlcXVlc3QpIHtcbiAgICAgIGlmIChmbGFnID09PSAweDAwKSB7XG4gICAgICAgIHJlc3BvbnNlID0gQnVmZmVyLmZyb20oW0FUVF9PUF9FWEVDX1dSSVRFX1JFU1BdKTtcbiAgICAgIH0gZWxzZSBpZiAoZmxhZyA9PT0gMHgwMSkge1xuICAgICAgICBjb25zdCBjYWxsYmFjazogYW55ID0gKChfcmVxdWVzdFR5cGU6IGFueSwgX3ZhbHVlSGFuZGxlOiBhbnkpID0+IHtcbiAgICAgICAgICByZXR1cm4gKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgICAgICBsZXQgY2FsbGJhY2tSZXNwb25zZTogYW55ID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKEFUVF9FQ09ERV9TVUNDRVNTID09PSByZXN1bHQpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2tSZXNwb25zZSA9IEJ1ZmZlci5mcm9tKFtBVFRfT1BfRVhFQ19XUklURV9SRVNQXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjYWxsYmFja1Jlc3BvbnNlID0gdGhpcy5lcnJvclJlc3BvbnNlKFxuICAgICAgICAgICAgICAgIF9yZXF1ZXN0VHlwZSxcbiAgICAgICAgICAgICAgICBfdmFsdWVIYW5kbGUsXG4gICAgICAgICAgICAgICAgcmVzdWx0LFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWJ1ZyhcbiAgICAgICAgICAgICAgXCJleGVjdXRlIHdyaXRlIHJlc3BvbnNlOiBcIiArIGNhbGxiYWNrUmVzcG9uc2UudG9TdHJpbmcoXCJoZXhcIiksXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLnNlbmQoY2FsbGJhY2tSZXNwb25zZSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkocmVxdWVzdFR5cGUsIHRoaXMuX3ByZXBhcmVkV3JpdGVSZXF1ZXN0LnZhbHVlSGFuZGxlKTtcblxuICAgICAgICB0aGlzLl9wcmVwYXJlZFdyaXRlUmVxdWVzdC5oYW5kbGUuYXR0cmlidXRlLmVtaXQoXG4gICAgICAgICAgXCJ3cml0ZVJlcXVlc3RcIixcbiAgICAgICAgICB0aGlzLl9wcmVwYXJlZFdyaXRlUmVxdWVzdC5kYXRhLFxuICAgICAgICAgIHRoaXMuX3ByZXBhcmVkV3JpdGVSZXF1ZXN0Lm9mZnNldCxcbiAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICBjYWxsYmFjayxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3BvbnNlID0gdGhpcy5lcnJvclJlc3BvbnNlKHJlcXVlc3RUeXBlLCAweDAwMDAsIEFUVF9FQ09ERV9VTkxJS0VMWSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3ByZXBhcmVkV3JpdGVSZXF1ZXN0ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzcG9uc2UgPSB0aGlzLmVycm9yUmVzcG9uc2UocmVxdWVzdFR5cGUsIDB4MDAwMCwgQVRUX0VDT0RFX1VOTElLRUxZKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlQ29uZmlybWF0aW9uKHJlcXVlc3Q6IGFueSkge1xuICAgIGlmICh0aGlzLl9sYXN0SW5kaWNhdGVkQXR0cmlidXRlKSB7XG4gICAgICBpZiAodGhpcy5fbGFzdEluZGljYXRlZEF0dHJpYnV0ZS5lbWl0KSB7XG4gICAgICAgIHRoaXMuX2xhc3RJbmRpY2F0ZWRBdHRyaWJ1dGUuZW1pdChcImluZGljYXRlXCIpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9sYXN0SW5kaWNhdGVkQXR0cmlidXRlID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2F0dDtcbiJdfQ==
