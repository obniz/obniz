/**
 * @packageDocumentation
 * @module Parts.Linking
 */
/* ------------------------------------------------------------------
 * node-linking - service-setting.js
 *
 * Copyright (c) 2017-2019, Futomi Hatano, All rights reserved.
 * Released under the MIT license
 * Date: 2019-10-24
 * ---------------------------------------------------------------- */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class LinkingServiceSetting {
    constructor() {
        this.SERVICE_ID = 0x04;
        this.SERVICE_NAME = 'PeripheralDeviceSettingOperation';
        this.MESSAGE_NAME_MAP = {
            '00': 'GET_APP_VERSION',
            '01': 'GET_APP_VERSION_RESP',
            '02': 'CONFIRM_INSTALL_APP',
            '03': 'CONFIRM_INSTALL_APP_RESP',
            '04': 'GET_SETTING_INFORMATION',
            '05': 'GET_SETTING_INFORMATION_RESP',
            '06': 'GET_SETTING_NAME',
            '07': 'GET_SETTING_NAME_RESP',
            '08': 'SELECT_SETTING_INFORMATION',
            '09': 'SELECT_SETTING_INFORMATION_RESP',
        };
        // Private
        this._WRITE_MESSAGE_ID_MAP = {
            GET_APP_VERSION: 0x00,
            CONFIRM_INSTALL_APP: 0x02,
            GET_SETTING_INFORMATION: 0x04,
            GET_SETTING_NAME: 0x06,
            SELECT_SETTING_INFORMATION: 0x08,
        };
        this._SETTING_NAME_TYPE_MAP = {
            LEDColorName: 0x00,
            LEDPatternName: 0x01,
            VibrationPatternName: 0x02,
            BeepPatternName: 0x03,
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
            parsed = this._parseSettingNameType(buf);
        }
        else if (pid === 0x03) {
            parsed = this._parseAppName(buf);
        }
        else if (pid === 0x04) {
            parsed = this._parseFileVer(buf);
        }
        else if (pid === 0x05) {
            parsed = this._parseFileSize(buf);
        }
        else if (pid === 0x06) {
            parsed = this._parseInstallConfirmStatus(buf);
        }
        else if (pid === 0x07) {
            parsed = this._parseSettingInformationRequest(buf);
        }
        else if (pid === 0x08) {
            parsed = this._parseSettingInformationData(buf);
        }
        else if (pid === 0x09) {
            parsed = this._parseSettingNameData(buf);
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
    _parseSettingNameType(buf) {
        const code = buf.readUInt8(0);
        let text = '';
        if (code === 0x00) {
            text = 'LEDColorName';
        }
        else if (code === 0x01) {
            text = 'LEDPatternName';
        }
        else if (code === 0x02) {
            text = 'VibrationPatternName';
        }
        else if (code === 0x03) {
            text = 'BeepPatternName';
        }
        return {
            name: 'SettingNameType',
            settingNameTypeCode: code,
            settingNameTypeText: text,
        };
    }
    _parseAppName(buf) {
        return {
            name: 'AppName',
            appName: buf.toString('UTF-8'),
        };
    }
    _parseFileVer(buf) {
        const list = [];
        for (let i = 0; i < buf.length; i++) {
            list.push(buf.readUInt8(i));
        }
        return {
            name: 'FileVer',
            fileVer: list.join('.'),
        };
    }
    _parseFileSize(buf) {
        return {
            name: 'FileSize',
            fileSize: buf.readUInt32LE(0),
        };
    }
    _parseInstallConfirmStatus(buf) {
        const code = buf.readUInt8(0);
        let text = '';
        if (code === 0x00) {
            text = 'OK, Device has been ready for install';
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
        else if (code === 0x06) {
            text = 'Error, Device has no space to install';
        }
        else if (code === 0x07) {
            text = 'Error, Requested file was already installed';
        }
        else if (code === 0x08) {
            text = 'Error, Newest file was already installed';
        }
        return {
            name: 'InstallConfirmStatus',
            installConfirmStatusCode: code,
            installConfirmStatusText: text,
        };
    }
    _parseSettingInformationRequest(buf) {
        const code = buf.readUInt8(0);
        let text = '';
        if (code === 0x00) {
            text = 'SETTING';
        }
        else if (code === 0x01) {
            text = 'START_DEMONSTRATION';
        }
        else if (code === 0x02) {
            text = 'STOP_DEMONSTRATION';
        }
        let offset = 1;
        const settings = [];
        while (true) {
            const setting_code = buf.readUInt8(offset);
            if (setting_code === 0x00) {
                settings.push({
                    settingCode: setting_code,
                    settingName: 'LED',
                    colorMax: buf.readUInt8(offset + 1),
                    colorNumber: buf.readUInt8(offset + 2),
                    patternMax: buf.readUInt8(offset + 3),
                    patternNumber: buf.readUInt8(offset + 4),
                    duration: buf.readUInt8(offset + 5),
                });
                offset += 5;
            }
            else if (setting_code === 0x01) {
                settings.push({
                    settingCode: setting_code,
                    settingName: 'Vibration',
                    patternMax: buf.readUInt8(offset + 1),
                    patternNumber: buf.readUInt8(offset + 2),
                    duration: buf.readUInt8(offset + 3),
                });
                offset += 3;
            }
            else if (setting_code === 0x02) {
                settings.push({
                    settingCode: setting_code,
                    settingName: 'Beep',
                    patternMax: buf.readUInt8(offset + 1),
                    patternNumber: buf.readUInt8(offset + 2),
                    duration: buf.readUInt8(offset + 3),
                });
                offset += 3;
            }
            if (offset >= buf.length) {
                break;
            }
        }
        return {
            name: 'SettingInformationRequest',
            settingInformationRequestCode: code,
            settingInformationRequestName: text,
            settingInformationRequestData: settings,
        };
    }
    _parseSettingInformationData(buf) {
        let offset = 0;
        const settings = [];
        while (true) {
            const setting_code = buf.readUInt8(offset);
            if (setting_code === 0x00) {
                settings.push({
                    id: setting_code,
                    name: 'LED',
                    colorMax: buf.readUInt8(offset + 1),
                    colorNumber: buf.readUInt8(offset + 2),
                    patternMax: buf.readUInt8(offset + 3),
                    patternNumber: buf.readUInt8(offset + 4),
                    duration: buf.readUInt8(offset + 5),
                });
                offset += 6;
            }
            else if (setting_code === 0x01) {
                settings.push({
                    id: setting_code,
                    name: 'Vibration',
                    patternMax: buf.readUInt8(offset + 1),
                    patternNumber: buf.readUInt8(offset + 2),
                    duration: buf.readUInt8(offset + 3),
                });
                offset += 4;
            }
            else if (setting_code === 0x02) {
                settings.push({
                    id: setting_code,
                    name: 'Beep',
                    patternMax: buf.readUInt8(offset + 1),
                    patternNumber: buf.readUInt8(offset + 2),
                    duration: buf.readUInt8(offset + 3),
                });
                offset += 4;
            }
            if (offset >= buf.length) {
                break;
            }
        }
        return {
            name: 'SettingInformationData',
            settingInformationData: settings,
        };
    }
    _parseSettingNameData(buf) {
        const list = [];
        let offset = 0;
        while (true) {
            const len = buf.readUInt8(offset++);
            const name = buf.slice(offset, offset + len - 1).toString('utf-8');
            offset += len;
            list.push(name);
            if (offset >= buf.length) {
                break;
            }
        }
        return {
            name: 'SettingNameData',
            settingNameData: list,
        };
    }
    /* ------------------------------------------------------------------
     * Method: createRequest(message_name, params)
     * ---------------------------------------------------------------- */
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
        if (!params || typeof params !== 'object') {
            params = {};
        }
        if (message_name === 'GET_APP_VERSION') {
            return this._createPayloadGetAppVersion(params);
        }
        else if (message_name === 'CONFIRM_INSTALL_APP') {
            return this._createPayloadConfirmInstallApp(params);
        }
        else if (message_name === 'GET_SETTING_INFORMATION') {
            return this._createPayloadGetSettingInformation(params);
        }
        else if (message_name === 'GET_SETTING_NAME') {
            return this._createPayloadGetSettingName(params);
        }
        else if (message_name === 'SELECT_SETTING_INFORMATION') {
            return this._createPayloadSelectSettingInformation(params);
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
    _createPayloadGetAppVersion(params) {
        let pnum = 0;
        let app_name = null;
        if ('AppName' in params && typeof params.AppName === 'string') {
            app_name = params.AppName;
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
        // AppName
        if (app_name !== null) {
            const val_buf = Buffer.from(app_name);
            buf_list.push(this._createPropertyBlockBuffer(0x02, val_buf));
        }
        // Create a packet
        return Buffer.concat(buf_list);
    }
    _createPayloadConfirmInstallApp(params) {
        let pnum = 0;
        let app_name = null;
        if ('AppName' in params && typeof params.AppName === 'string') {
            app_name = params.AppName;
            pnum++;
        }
        else {
            return null;
        }
        let file_ver = null;
        if ('FileVer' in params && typeof params.FileVer === 'string') {
            file_ver = params.FileVer;
            pnum++;
        }
        let file_size = null;
        if ('FileSize' in params &&
            typeof params.FileSize === 'number' &&
            file_size % 1 === 0) {
            file_size = params.FileSize;
            pnum++;
        }
        // buffer list
        const buf_list = [];
        // Number of parameters
        const pnum_buf = Buffer.from([pnum]);
        buf_list.push(pnum_buf);
        // AppName
        if (app_name !== null) {
            const val_buf = Buffer.from(app_name);
            buf_list.push(this._createPropertyBlockBuffer(0x03, val_buf));
        }
        // FileVer
        if (file_ver !== null) {
            const val_buf = Buffer.from(file_ver);
            buf_list.push(this._createPropertyBlockBuffer(0x04, val_buf));
        }
        // FileSize
        if (file_size !== null) {
            const val_buf = Buffer.alloc(4);
            val_buf.writeUInt32LE(file_size);
            buf_list.push(this._createPropertyBlockBuffer(0x05, val_buf));
        }
        // Create a packet
        return Buffer.concat(buf_list);
    }
    _createPayloadGetSettingInformation(params) {
        const pnum_buf = Buffer.from([0]);
        return pnum_buf;
    }
    _createPayloadGetSettingName(params) {
        let pnum = 0;
        let type = null;
        if ('SettingNameType' in params) {
            type = params.SettingNameType;
            if (typeof type === 'number') {
                let setting_name = '';
                for (const name in this._SETTING_NAME_TYPE_MAP) {
                    if (this._SETTING_NAME_TYPE_MAP[name] === type) {
                        setting_name = name;
                        break;
                    }
                }
                if (!setting_name) {
                    return null;
                }
            }
            else if (typeof type === 'string') {
                if (type in this._SETTING_NAME_TYPE_MAP) {
                    type = this._SETTING_NAME_TYPE_MAP[type];
                }
                else {
                    return null;
                }
            }
        }
        else {
            return null;
        }
        pnum++;
        // buffer list
        const buf_list = [];
        // Number of parameters
        const pnum_buf = Buffer.from([pnum]);
        buf_list.push(pnum_buf);
        // SettingNameType
        if (type !== null) {
            const val_buf = Buffer.from([type]);
            buf_list.push(this._createPropertyBlockBuffer(0x02, val_buf));
        }
        // Create a packet
        return Buffer.concat(buf_list);
    }
    _createPayloadSelectSettingInformation(params) {
        let pnum = 0;
        let code = null;
        if ('SettingInformationRequest' in params &&
            typeof params.SettingInformationRequest === 'object') {
            const req = params.SettingInformationRequest;
            if ('requestCode' in req &&
                typeof req.requestCode === 'number' &&
                req.requestCode >= 0 &&
                req.requestCode <= 0x02 &&
                req.requestCode % 1 === 0) {
                code = req.requestCode;
            }
            else if ('requestName' in req && typeof req.requestName === 'string') {
                const name = req.requestName;
                if (name === 'SETTING') {
                    code = 0x00;
                }
                else if (name === 'START_DEMONSTRATION') {
                    code = 0x01;
                }
                else if (name === 'STOP_DEMONSTRATION') {
                    code = 0x02;
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
        pnum++;
        let settings = null;
        if ('SettingInformationData' in params) {
            if (Array.isArray(params.SettingInformationData)) {
                settings = [];
                for (let i = 0; i < params.SettingInformationData.length; i++) {
                    const s = params.SettingInformationData[i];
                    let scode = null;
                    let sname = '';
                    if ('settingCode' in s &&
                        typeof s.settingCode === 'number' &&
                        s.settingCode >= 0x00 &&
                        s.settingCode <= 0x02 &&
                        s.settingCode % 1 === 0) {
                        scode = s.settingCode;
                        if (scode === 0x00) {
                            sname = 'LED';
                        }
                        else if (scode === 0x01) {
                            sname = 'Vibration';
                        }
                        else if (scode === 0x02) {
                            sname = 'Beep';
                        }
                    }
                    else if ('settingName' in s && typeof s.settingName === 'string') {
                        sname = s.settingName;
                        if (sname === 'LED') {
                            scode = 0x00;
                        }
                        else if (sname === 'Vibration') {
                            scode = 0x01;
                        }
                        else if (sname === 'Beep') {
                            scode = 0x02;
                        }
                        else {
                            return null;
                        }
                    }
                    if (!(sname in this._device.settings)) {
                        return null;
                    }
                    let cn = null;
                    let cm = null;
                    if (scode === 0x00) {
                        // LED
                        if ('colorNumber' in s) {
                            if (typeof s.colorNumber === 'number' &&
                                s.colorNumber >= 0 &&
                                s.colorNumber <= this._device.settings.LED.colorMax &&
                                s.colorNumber % 1 === 0) {
                                cn = s.colorNumber;
                            }
                            else {
                                return null;
                            }
                        }
                        else {
                            cn = this._device.settings.LED.colorNumber;
                        }
                        cm = this._device.settings.LED.colorMax;
                    }
                    let pn = null;
                    if ('patternNumber' in s) {
                        if (typeof s.patternNumber === 'number' &&
                            s.patternNumber >= 0 &&
                            s.patternNumber <= this._device.settings[sname].patternMax &&
                            s.patternNumber % 1 === 0) {
                            pn = s.patternNumber;
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        pn = this._device.settings[sname].patternNumber;
                    }
                    const pm = this._device.settings[sname].patternMax;
                    let dur = null;
                    if ('duration' in s) {
                        if (typeof s.duration === 'number' &&
                            s.duration >= 0 &&
                            s.duration <= 0xff &&
                            s.duration % 1 === 0) {
                            dur = s.duration;
                            if (dur <= 0x05) {
                                dur = 0x05;
                            }
                            else if (dur <= 0x0a) {
                                dur = 0x0a;
                            }
                            else if (dur <= 0x1e) {
                                dur = 0x1e;
                            }
                            else if (dur <= 0x3c) {
                                dur = 0x3c;
                            }
                            else if (dur <= 0xb4) {
                                dur = 0xb4;
                            }
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        dur = this._device.settings[sname].duration;
                    }
                    settings.push({
                        settingCode: scode,
                        colorNumber: cn,
                        colorMax: cm,
                        patternNumber: pn,
                        patternMax: pm,
                        duration: dur,
                    });
                }
            }
            else {
                return null;
            }
            if (settings.length === 0) {
                settings = null;
            }
            else {
                pnum++;
            }
        }
        // buffer list
        const buf_list = [];
        // Number of parameters
        const pnum_buf = Buffer.from([pnum]);
        buf_list.push(pnum_buf);
        // SettingInformationRequest
        if (code !== null) {
            const val_buf = Buffer.from([code]);
            buf_list.push(this._createPropertyBlockBuffer(0x07, val_buf));
        }
        // SettingInformationData
        if (settings !== null) {
            const val_buf_list = [];
            settings.forEach((s) => {
                val_buf_list.push(Buffer.from([s.settingCode]));
                if (s.colorNumber !== null) {
                    val_buf_list.push(Buffer.from([s.colorMax, s.colorNumber]));
                }
                val_buf_list.push(Buffer.from([s.patternMax, s.patternNumber]));
                val_buf_list.push(Buffer.from([s.duration]));
            });
            const val_buf = Buffer.concat(val_buf_list);
            buf_list.push(this._createPropertyBlockBuffer(0x08, val_buf));
        }
        // Create a packet
        return Buffer.concat(buf_list);
    }
}
exports.default = LinkingServiceSetting;
