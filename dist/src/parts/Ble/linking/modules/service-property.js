/**
 * @packageDocumentation
 * @module Parts.Linking
 */
/* ------------------------------------------------------------------
 * node-linking - service-property.js
 *
 * Copyright (c) 2017-2019, Futomi Hatano, All rights reserved.
 * Released under the MIT license
 * Date: 2019-10-24
 * ---------------------------------------------------------------- */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class LinkingServiceProperty {
    constructor() {
        this.SERVICE_ID = 0x00;
        this.SERVICE_NAME = 'PeripheralDevicePropertyInformation';
        this.MESSAGE_NAME_MAP = {
            '00': 'GET_DEVICE_INFORMATION',
            '01': 'GET_DEVICE_INFORMATION_RESP',
        };
        // Private
        this._WRITE_MESSAGE_ID_MAP = {
            GET_DEVICE_INFORMATION: 0x00,
        };
        this._device = {};
    }
    setDeviceInfo(info) {
        this._device = info;
    }
    parsePayload(pnum, buf) {
        let offset = 0;
        const parameters = [];
        try {
            for (let i = 0; i < pnum; i++) {
                const pid = buf.readUInt8(offset++);
                let plen_buf = buf.slice(offset, offset + 3);
                plen_buf = Buffer.concat([plen_buf, Buffer.from([0x00])]);
                const plen = plen_buf.readUInt32LE(0);
                offset += 3;
                const pvalue_buf = buf.slice(offset, offset + plen);
                offset += plen;
                parameters.push(this._parseParameter(pid, pvalue_buf));
            }
        }
        catch (e) {
            // do nothing.
        }
        return parameters;
    }
    _parseParameter(pid, buf) {
        let parsed = null;
        if (pid === 0x00) {
            parsed = this._parseResultCode(buf);
        }
        else if (pid === 0x01) {
            parsed = this._parseCancel(buf);
        }
        else if (pid === 0x02) {
            parsed = this._parseServiceList(buf);
        }
        else if (pid === 0x03) {
            parsed = this._parseDeviceId(buf);
        }
        else if (pid === 0x04) {
            parsed = this._parseDeviceUid(buf);
        }
        else if (pid === 0x05) {
            parsed = this._parseDeviceCapability(buf);
        }
        else if (pid === 0x06) {
            parsed = this._parseOriginalInformation(buf);
        }
        else if (pid === 0x07) {
            parsed = this._parseExSensorType(buf);
        }
        if (parsed) {
            parsed.parameterId = pid;
        }
        return parsed;
    }
    _parseResultCode(buf) {
        const code = buf.readUInt8(0);
        let text = '';
        if (code === 0x00) {
            text = 'OK, request processed correctly';
        }
        else if (code === 0x01) {
            text = 'Cancel';
        }
        else if (code === 0x02) {
            text = 'Error, failed';
        }
        else if (code === 0x03) {
            text = 'Error, no reason defined';
        }
        else if (code === 0x04) {
            text = 'Error, data not available';
        }
        else if (code === 0x05) {
            text = 'Error, not supported';
        }
        return {
            name: 'ResultCode',
            resultCode: code,
            resultText: text,
        };
    }
    _parseCancel(buf) {
        const code = buf.readUInt8(0);
        let text = '';
        if (code === 0x00) {
            text = 'User cancel';
        }
        return {
            name: 'Cancel',
            cancelCode: code,
            cancelText: text,
        };
    }
    _parseServiceList(buf) {
        const v = buf.readUInt8(0);
        const list = [];
        if (v & 0b00000001) {
            list.push({ id: 0, name: 'PeripheralDevicePropertyInformation' });
        }
        if (v & 0b00000010) {
            list.push({ id: 1, name: 'PeripheralDeviceNotification' });
        }
        if (v & 0b00000100) {
            list.push({ id: 2, name: 'PeripheralDeviceOperation' });
        }
        if (v & 0b00001000) {
            list.push({ id: 3, name: 'PeripheralDeviceSensorInformation' });
        }
        if (v & 0b00010000) {
            list.push({ id: 4, name: 'PeripheralDeviceSettingOperation' });
        }
        return {
            name: 'ServiceList',
            serviceList: list,
        };
    }
    _parseDeviceId(buf) {
        return {
            name: 'DeviceId',
            deviceId: buf.toString('hex'),
        };
    }
    _parseDeviceUid(buf) {
        return {
            name: 'DeviceUid',
            deviceUid: buf.toString('hex'),
        };
    }
    _parseDeviceCapability(buf) {
        const v = buf.readUInt8(0);
        const list = [];
        if (v & 0b00000010) {
            list.push({ id: 1, name: 'Gyroscope' });
        }
        if (v & 0b00000100) {
            list.push({ id: 2, name: 'Accelerometer' });
        }
        if (v & 0b00001000) {
            list.push({ id: 3, name: 'Orientation' });
        }
        if (v & 0b00010000) {
            list.push({ id: 4, name: 'Battery' });
        }
        if (v & 0b00100000) {
            list.push({ id: 5, name: 'Temperature' });
        }
        if (v & 0b01000000) {
            list.push({ id: 6, name: 'Humidity' });
        }
        if (v & 0b10000000) {
            list.push({ id: 7, name: 'Atmospheric pressure' });
        }
        return {
            name: 'DeviceCapability',
            deviceCapability: list,
        };
    }
    _parseOriginalInformation(buf) {
        const type = buf.readUInt8(0);
        let type_name = '';
        if (type === 0x00) {
            type_name = 'AppName';
        }
        else if (type === 0x01) {
            type_name = 'AppNameLocal';
        }
        else if (type === 0x02) {
            type_name = 'AppDLURL1';
        }
        else if (type === 0x03) {
            type_name = 'AppDLURL2';
        }
        else if (type === 0x04) {
            type_name = 'AppDLURL3';
        }
        else if (type === 0x05) {
            type_name = 'AppExecInfo1';
        }
        else if (type === 0x06) {
            type_name = 'AppExecInfo2';
        }
        else if (type === 0x07) {
            type_name = 'AppExecInfo3';
        }
        else if (type === 0x08) {
            type_name = 'AppPackage';
        }
        return {
            name: 'OriginalInformation',
            originalInformationCode: type,
            originalInformationName: type_name,
            originalInformationText: buf.slice(1).toString('UTF-8'),
        };
    }
    _parseExSensorType(buf) {
        const v = buf.readUInt8(0);
        const list = [];
        if (v & 0b00000001) {
            list.push({ id: 0, name: 'Version' });
        }
        if (v & 0b00000010) {
            list.push({ id: 1, name: 'Version' });
        }
        if (v & 0b00000100) {
            list.push({ id: 2, name: 'Flag' });
        }
        if (v & 0b00001000) {
            list.push({ id: 3, name: 'Button' });
        }
        if (v & 0b00010000) {
            list.push({ id: 4, name: 'Opening and closing' });
        }
        if (v & 0b00100000) {
            list.push({ id: 5, name: 'Human detection' });
        }
        if (v & 0b01000000) {
            list.push({ id: 6, name: 'Move' });
        }
        if (v & 0b10000000) {
            list.push({ id: 7, name: 'Illuminance' });
        }
        return {
            name: 'ExSensorType',
            exSensorType: list,
        };
    }
    createRequest(message_name, params) {
        if (!(message_name in this._WRITE_MESSAGE_ID_MAP)) {
            return null;
        }
        const buf_list = [];
        // packet header
        const header_buf = Buffer.alloc(1);
        header_buf.writeUInt8(parseInt('00000001', 2));
        buf_list.push(header_buf);
        // Service ID
        const sid_buf = Buffer.alloc(1);
        sid_buf.writeUInt8(this.SERVICE_ID);
        buf_list.push(sid_buf);
        // Message ID
        const mid_buf = Buffer.alloc(2);
        mid_buf.writeUInt16LE(this._WRITE_MESSAGE_ID_MAP[message_name]);
        buf_list.push(mid_buf);
        // Number of parameters + Payload
        const pl_buf = this._createPayload(message_name, params);
        if (!pl_buf) {
            return null;
        }
        buf_list.push(pl_buf);
        return Buffer.concat(buf_list);
    }
    _createPayload(message_name, params) {
        if (message_name === 'GET_DEVICE_INFORMATION') {
            return this._createPayloadGetDeviceInformation(params);
        }
        else {
            return null;
        }
    }
    _createPayloadGetDeviceInformation(params) {
        const pnum_buf = Buffer.alloc(1);
        pnum_buf.writeUInt8(0);
        return pnum_buf;
    }
}
exports.default = LinkingServiceProperty;
