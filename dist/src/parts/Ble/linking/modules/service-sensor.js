/**
 * @packageDocumentation
 * @module Parts.Linking
 */
/* ------------------------------------------------------------------
 * node-linking - service-sensor.js
 *
 * Copyright (c) 2017-2019, Futomi Hatano, All rights reserved.
 * Released under the MIT license
 * Date: 2019-11-02
 * ---------------------------------------------------------------- */
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ieee754_1 = __importDefault(require("./ieee754"));
class LinkingServiceSensor {
    constructor() {
        this.SERVICE_ID = 0x03;
        this.SERVICE_NAME = 'PeripheralDeviceSensorInformation';
        this.MESSAGE_NAME_MAP = {
            '00': 'GET_SENSOR_INFO',
            '01': 'GET_SENSOR_INFO_RESP',
            '02': 'SET_NOTIFY_SENSOR_INFO',
            '03': 'SET_NOTIFY_SENSOR_INFO_RESP',
            '04': 'NOTIFY_PD_SENSOR_INFO',
        };
        // Private
        this._WRITE_MESSAGE_ID_MAP = {
            GET_SENSOR_INFO: 0x00,
            SET_NOTIFY_SENSOR_INFO: 0x02,
        };
        this._device = {};
    }
    setDeviceInfo(info) {
        this._device = info;
    }
    parsePayload(pnum, buf) {
        let offset = 0;
        const parameters = [];
        let sensor_type = 0;
        try {
            for (let i = 0; i < pnum; i++) {
                const pid = buf.readUInt8(offset++);
                let plen_buf = buf.slice(offset, offset + 3);
                plen_buf = Buffer.concat([plen_buf, Buffer.from([0x00])]);
                const plen = plen_buf.readUInt32LE(0);
                offset += 3;
                const pvalue_buf = buf.slice(offset, offset + plen);
                offset += plen;
                const p = this._parseParameter(pid, pvalue_buf, sensor_type);
                if (pid === 0x02 && 'sensorTypeCode' in p) {
                    sensor_type = p.sensorTypeCode;
                }
                parameters.push(p);
            }
        }
        catch (e) {
            // do nothing.
        }
        return parameters;
    }
    _parseParameter(pid, buf, sensor_type) {
        let parsed = {};
        if (pid === 0x00) {
            parsed = this._parseResultCode(buf);
        }
        else if (pid === 0x01) {
            parsed = this._parseCancel(buf);
        }
        else if (pid === 0x02) {
            parsed = this._parseSensorType(buf);
        }
        else if (pid === 0x03) {
            parsed = this._parseStatus(buf);
        }
        else if (pid === 0x04) {
            parsed = this._parseX_value(buf);
        }
        else if (pid === 0x05) {
            parsed = this._parseY_value(buf);
        }
        else if (pid === 0x06) {
            parsed = this._parseZ_value(buf);
        }
        else if (pid === 0x07) {
            parsed = this._parseX_threshold(buf);
        }
        else if (pid === 0x08) {
            parsed = this._parseY_threshold(buf);
        }
        else if (pid === 0x09) {
            parsed = this._parseZ_threshold(buf);
        }
        else if (pid === 0x0a) {
            parsed = this._parseOriginalData(buf, sensor_type);
        }
        parsed.parameterId = pid;
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
    _parseSensorType(buf) {
        const code = buf.readUInt8(0);
        let text = '';
        if (code === 0x00) {
            text = 'Gyroscope';
        }
        else if (code === 0x01) {
            text = 'Accelerometer';
        }
        else if (code === 0x02) {
            text = 'Orientation';
        }
        else if (code === 0x03) {
            text = 'Battery';
        }
        else if (code === 0x04) {
            text = 'Temperature';
        }
        else if (code === 0x05) {
            text = 'Humidity';
        }
        else if (code === 0x06) {
            text = 'Atmospheric pressure';
        }
        else if (code === 0x07) {
            text = 'Opening and closing';
        }
        else if (code === 0x08) {
            text = 'Human detection';
        }
        else if (code === 0x09) {
            text = 'Move';
        }
        else if (code === 0x0a) {
            text = 'Illuminance';
        }
        return {
            name: 'SensorType',
            sensorTypeCode: code,
            sensorTypeText: text,
        };
    }
    _parseStatus(buf) {
        const code = buf.readUInt8(0);
        let text = '';
        if (code === 0x00) {
            text = 'OFF';
        }
        else if (code === 0x01) {
            text = 'ON';
        }
        return {
            name: 'Status',
            statusCode: code,
            statusText: text,
        };
    }
    _parseX_value(buf) {
        return {
            name: 'X_value',
            xValue: buf.readFloatLE(0),
        };
    }
    _parseY_value(buf) {
        return {
            name: 'Y_value',
            yValue: buf.readFloatLE(0),
        };
    }
    _parseZ_value(buf) {
        return {
            name: 'Z_value',
            zValue: buf.readFloatLE(0),
        };
    }
    _parseX_threshold(buf) {
        return {
            name: 'X_threshold',
            xThreshold: buf.readFloatLE(0),
        };
    }
    _parseY_threshold(buf) {
        return {
            name: 'Y_threshold',
            yThreshold: buf.readFloatLE(0),
        };
    }
    _parseZ_threshold(buf) {
        return {
            name: 'Z_threshold',
            zThreshold: buf.readFloatLE(0),
        };
    }
    _parseOriginalData(buf, sensor_type) {
        const n = buf.readUInt16LE(0) & 0b0000111111111111;
        if (sensor_type === 0x03) {
            // Battery
            return {
                chargeRequired: n & 0b0000100000000000 ? true : false,
                chargeLevel: Math.min((n & 0b0000011111111111) / 10, 100),
            };
        }
        else if (sensor_type === 0x04) {
            // Temperature
            return {
                temperature: ieee754_1.default.read(n, 1, 4, 7),
            };
        }
        else if (sensor_type === 0x05) {
            // Humidity
            const v = ieee754_1.default.read(n, 0, 4, 8);
            return {
                humidity: v,
            };
        }
        else if (sensor_type === 0x06) {
            // Atmospheric pressure
            return {
                pressure: buf.readFloatLE(0),
            };
        }
        else if (sensor_type === 0x07) {
            // Opening and closing
            return {
                openingStatus: n & 0b0000100000000000 ? true : false,
                openingCount: Math.min((n & 0b0000011111111111) / 10, 100),
            };
        }
        else if (sensor_type === 0x08) {
            // Human detection
            return {
                humanDetectionResponse: n & 0b0000100000000000 ? true : false,
                humanDetectionCount: n & 0b0000011111111111,
            };
        }
        else if (sensor_type === 0x09) {
            // Move (Vibration Sensor)
            return {
                moveResponse: n & 0b0000100000000000 ? true : false,
                moveCount: n & 0b0000011111111111,
            };
        }
        else if (sensor_type === 0x0a) {
            // Illuminance
            return {
                illuminance: buf.readFloatLE(0),
            };
        }
        else {
            return {};
        }
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
        if (message_name === 'GET_SENSOR_INFO') {
            return this._createPayloadGetSensorInfo(params);
        }
        else if (message_name === 'SET_NOTIFY_SENSOR_INFO') {
            return this._createPayloadSetNotifySensorInfo(params);
        }
        else {
            return null;
        }
    }
    _createPropertyBlockBuffer(pid, val_buf) {
        const pid_buf = Buffer.from([pid]);
        let len = 0;
        if (val_buf) {
            len = val_buf.length;
        }
        let len_buf = Buffer.alloc(4);
        len_buf.writeUInt32LE(len);
        len_buf = len_buf.slice(0, 3);
        const buf_list = [pid_buf, len_buf];
        if (val_buf) {
            buf_list.push(val_buf);
        }
        return Buffer.concat(buf_list);
    }
    _createPayloadGetSensorInfo(params) {
        let pnum = 0;
        let sensor_type = null;
        if ('SensorType' in params &&
            typeof params.SensorType === 'number' &&
            params.SensorType >= 0x00 &&
            params.SensorType <= 0xff &&
            params.SensorType % 1 === 0) {
            sensor_type = params.SensorType;
            pnum++;
        }
        else {
            return null;
        }
        // buffer list
        const buf_list = [];
        // Number of parameters
        const pnum_buf = Buffer.from([pnum]);
        buf_list.push(pnum_buf);
        // SensorType
        if (sensor_type !== null) {
            const val_buf = Buffer.from([sensor_type]);
            buf_list.push(this._createPropertyBlockBuffer(0x02, val_buf));
        }
        // Create a packet
        return Buffer.concat(buf_list);
    }
    _createPayloadSetNotifySensorInfo(params) {
        let pnum = 0;
        let sensor_type = null;
        if ('SensorType' in params &&
            typeof params.SensorType === 'number' &&
            params.SensorType >= 0x00 &&
            params.SensorType <= 0xff &&
            params.SensorType % 1 === 0) {
            sensor_type = params.SensorType;
            pnum++;
        }
        else {
            return null;
        }
        let status = null;
        if ('Status' in params) {
            status = params.Status ? 1 : 0;
            pnum++;
        }
        else {
            return null;
        }
        let x = null;
        let y = null;
        let z = null;
        if (sensor_type <= 0x02) {
            if ('X_threshold' in params) {
                if (typeof params.X_threshold === 'number') {
                    x = params.X_threshold;
                    pnum++;
                }
                else {
                    return null;
                }
            }
            if ('Y_threshold' in params) {
                if (typeof params.Y_threshold === 'number') {
                    y = params.Y_threshold;
                    pnum++;
                }
                else {
                    return null;
                }
            }
            if ('Z_threshold' in params) {
                if (typeof params.Z_threshold === 'number') {
                    z = params.Z_threshold;
                    pnum++;
                }
                else {
                    return null;
                }
            }
        }
        let odata = null;
        if ('OriginalData' in params) {
            if (params.OriginalData && params.OriginalData instanceof Buffer) {
                odata = params.OriginalData;
                pnum++;
            }
            else {
                return null;
            }
        }
        // buffer list
        const buf_list = [];
        // Number of parameters
        const pnum_buf = Buffer.from([pnum]);
        buf_list.push(pnum_buf);
        // SensorType
        if (sensor_type !== null) {
            const val_buf = Buffer.from([sensor_type]);
            buf_list.push(this._createPropertyBlockBuffer(0x02, val_buf));
        }
        // Status
        if (status !== null) {
            const val_buf = Buffer.from([status]);
            buf_list.push(this._createPropertyBlockBuffer(0x03, val_buf));
        }
        // X_threshold
        if (x !== null) {
            const val_buf = Buffer.alloc(4);
            val_buf.writeFloatLE(x, 0);
            buf_list.push(this._createPropertyBlockBuffer(0x07, val_buf));
        }
        // Y_threshold
        if (y !== null) {
            const val_buf = Buffer.alloc(4);
            val_buf.writeFloatLE(y, 0);
            buf_list.push(this._createPropertyBlockBuffer(0x08, val_buf));
        }
        // Z_threshold
        if (z !== null) {
            const val_buf = Buffer.alloc(4);
            val_buf.writeFloatLE(z, 0);
            buf_list.push(this._createPropertyBlockBuffer(0x09, val_buf));
        }
        // OriginalData
        if (odata !== null) {
            const val_buf = odata;
            buf_list.push(this._createPropertyBlockBuffer(0x0a, val_buf));
        }
        // Create a packet
        return Buffer.concat(buf_list);
    }
}
exports.default = LinkingServiceSensor;
