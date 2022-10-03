/**
 * @packageDocumentation
 * @module Parts.Linking
 */
/* ------------------------------------------------------------------
 * node-linking - service-notification.js
 *
 * Copyright (c) 2017-2019, Futomi Hatano, All rights reserved.
 * Released under the MIT license
 * Date: 2019-10-24
 * ---------------------------------------------------------------- */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/* ------------------------------------------------------------------
 * Constructor: LinkingServiceNotification()
 * ---------------------------------------------------------------- */
class LinkingServiceNotification {
    constructor() {
        this.SERVICE_ID = 0x01;
        this.SERVICE_NAME = 'PeripheralDeviceNotification';
        this.MESSAGE_NAME_MAP = {
            '00': 'CONFIRM_NOTIFY_CATEGORY',
            '01': 'CONFIRM_NOTIFY_CATEGORY_RESP',
            '02': 'NOTIFY_INFORMATION',
            '03': 'GET_PD_NOTIFY_DETAIL_DATA',
            '04': 'GET_PD_NOTIFY_DETAIL_DATA_RESP',
            '05': 'NOTIFY_PD_GENERAL_INFORMATION',
            '06': 'START_PD_APPLICATION',
            '07': 'START_PD_APPLICATION_RESP',
        };
        // Private
        this._WRITE_MESSAGE_ID_MAP = {
            CONFIRM_NOTIFY_CATEGORY: 0x00,
            NOTIFY_INFORMATION: 0x02,
            GET_PD_NOTIFY_DETAIL_DATA_RESP: 0x04,
            START_PD_APPLICATION_RESP: 0x07,
        };
        this._NOTIFY_CATEGORY_NAME_ID_MAP = {
            NotNotify: 0,
            All: 1,
            PhoneIncomingCall: 2,
            PhoneInCall: 3,
            PhoneIdle: 4,
            Mail: 5,
            Schedule: 6,
            General: 7,
            Etc: 8,
        };
        this._device = {};
    }
    setDeviceInfo(info) {
        this._device = info;
    }
    parsePayload(pnum, buf) {
        let offset = 0;
        const parameters = [];
        let notify_cateogry_id = 0;
        try {
            for (let i = 0; i < pnum; i++) {
                const pid = buf.readUInt8(offset++);
                let plen_buf = buf.slice(offset, offset + 3);
                plen_buf = Buffer.concat([plen_buf, Buffer.from([0x00])]);
                const plen = plen_buf.readUInt32LE(0);
                offset += 3;
                const pvalue_buf = buf.slice(offset, offset + plen);
                offset += plen;
                const p = this._parseParameter(pid, pvalue_buf);
                parameters.push(this._parseParameter(pid, pvalue_buf, notify_cateogry_id));
                if (pid === 0x04 && 'id' in p) {
                    notify_cateogry_id = p.id;
                }
            }
        }
        catch (e) {
            // do nothing.
        }
        return parameters;
    }
    _parseParameter(pid, buf, notify_cateogory_id) {
        let parsed = null;
        if (pid === 0x00) {
            parsed = this._parseResultCode(buf);
        }
        else if (pid === 0x01) {
            parsed = this._parseCancel(buf);
        }
        else if (pid === 0x02) {
            parsed = this._parseGetStatus(buf);
        }
        else if (pid === 0x03) {
            parsed = this._parseNotifyCategory(buf);
        }
        else if (pid === 0x04) {
            parsed = this._parseNotifyCategoryID(buf);
        }
        else if (pid === 0x05) {
            parsed = this._parseGetParameterID(buf);
        }
        else if (pid === 0x06) {
            parsed = this._parseGetParameterLength(buf);
        }
        else if (pid === 0x07) {
            parsed = this._parseParameterIdList(buf, notify_cateogory_id);
        }
        else if (pid === 0x08) {
            parsed = this._parseUniqueId(buf);
        }
        else if (pid === 0x09) {
            parsed = this._parseNotifyId(buf);
        }
        else if (pid === 0x0a) {
            parsed = this._parseNotificationOperation(buf);
        }
        else if (pid === 0x0b) {
            parsed = this._parseTittle(buf);
        }
        else if (pid === 0x0c) {
            parsed = this._parseText(buf);
        }
        else if (pid === 0x0d) {
            parsed = this._parseAppName(buf);
        }
        else if (pid === 0x0e) {
            parsed = this._parseAppNameLocal(buf);
        }
        else if (pid === 0x0f) {
            parsed = this._parseNotifyApp(buf);
        }
        else if (pid === 0x10) {
            parsed = this._parseRumblingSetting(buf);
        }
        else if (pid === 0x11) {
            parsed = this._parseVibrationPattern(buf);
        }
        else if (pid === 0x12) {
            parsed = this._parseLedPattern(buf);
        }
        else if (pid === 0x13) {
            parsed = this._parseSender(buf);
        }
        else if (pid === 0x14) {
            parsed = this._parseSenderAddress(buf);
        }
        else if (pid === 0x15) {
            parsed = this._parseReceiveDate(buf);
        }
        else if (pid === 0x16) {
            parsed = this._parseStartDate(buf);
        }
        else if (pid === 0x17) {
            parsed = this._parseEndDate(buf);
        }
        else if (pid === 0x18) {
            parsed = this._parseArea(buf);
        }
        else if (pid === 0x19) {
            parsed = this._parsePerson(buf);
        }
        else if (pid === 0x1a) {
            parsed = this._parseMimeTypeForImage(buf);
        }
        else if (pid === 0x1b) {
            parsed = this._parseMimeTypeForMedia(buf);
        }
        else if (pid === 0x1c) {
            parsed = this._parseImage(buf);
        }
        else if (pid >= 0x1d && pid <= 0x26) {
            parsed = this._parseContents(buf, pid);
        }
        else if (pid === 0x27) {
            parsed = this._parseMedia(buf);
        }
        else if (pid === 0x28) {
            parsed = this._parsePackage(buf);
        }
        else if (pid === 0x29) {
            parsed = this._parseClass(buf);
        }
        else if (pid === 0x2a) {
            parsed = this._parseSharingInformation(buf);
        }
        else if (pid === 0x2b) {
            parsed = this._parseBeepPattern(buf);
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
    _parseGetStatus(buf) {
        const code = buf.readUInt8(0);
        let text = '';
        if (code === 0x00) {
            text = 'OK, request processed correctly';
        }
        else if (code === 0x01) {
            text = 'OK, request processed ,but some parameter not';
        }
        else if (code === 0x02) {
            text = 'Cancel';
        }
        else if (code === 0x03) {
            text = 'Error, failed';
        }
        else if (code === 0x04) {
            text = 'Error, no reason defined';
        }
        else if (code === 0x05) {
            text = 'Error, data not available';
        }
        else if (code === 0x06) {
            text = 'Error, not supported';
        }
        return {
            name: 'GetStatus',
            statusCode: code,
            statusText: text,
        };
    }
    _parseNotifyCategory(buf) {
        const list = [];
        const v1 = buf.readUInt8(0);
        if (v1 & 0b00000001) {
            list.push({
                id: 0,
                name: 'NotNotify',
            });
        }
        if (v1 & 0b00000010) {
            list.push({
                id: 1,
                name: 'All',
            });
        }
        if (v1 & 0b00000100) {
            list.push({
                id: 2,
                name: 'PhoneIncomingCall',
            });
        }
        if (v1 & 0b00001000) {
            list.push({
                id: 3,
                name: 'PhoneInCall',
            });
        }
        if (v1 & 0b00010000) {
            list.push({
                id: 4,
                name: 'PhoneIdle',
            });
        }
        if (v1 & 0b00100000) {
            list.push({
                id: 5,
                name: 'Mail',
            });
        }
        if (v1 & 0b01000000) {
            list.push({
                id: 6,
                name: 'Schedule',
            });
        }
        if (v1 & 0b10000000) {
            list.push({
                id: 7,
                name: 'General',
            });
        }
        const v2 = buf.readUInt8(1);
        if (v2 & 0b00000001) {
            list.push({
                id: 8,
                name: 'Etc',
            });
        }
        return {
            name: 'NotifyCategory',
            notifyCategory: list,
        };
    }
    _parseNotifyCategoryID(buf) {
        let res = null;
        const v1 = buf.readUInt8(0);
        const v2 = buf.readUInt8(1);
        if (v1 & 0b00000001) {
            res = { id: 0, text: 'NotNotify' };
        }
        else if (v1 & 0b00000010) {
            res = { id: 1, text: 'All' };
        }
        else if (v1 & 0b00000100) {
            res = { id: 2, text: 'PhoneIncomingCall' };
        }
        else if (v1 & 0b00001000) {
            res = { id: 3, text: 'PhoneInCall' };
        }
        else if (v1 & 0b00010000) {
            res = { id: 4, text: 'PhoneIdle' };
        }
        else if (v1 & 0b00100000) {
            res = { id: 5, text: 'Mail' };
        }
        else if (v1 & 0b01000000) {
            res = { id: 6, text: 'Schedule' };
        }
        else if (v1 & 0b10000000) {
            res = { id: 7, text: 'General' };
        }
        else if (v2 & 0b00000001) {
            res = { id: 8, text: 'Etc' };
        }
        return {
            name: 'NotifyCategoryID',
            notifyCategoryId: res.id,
            NotifyCategoryText: res.text,
        };
    }
    _parseGetParameterID(buf) {
        return {
            name: 'GetParameterID',
            getParameterId: buf.readUInt8(0),
        };
    }
    _parseGetParameterLength(buf) {
        return {
            name: 'GetParameterLength',
            getParameterLength: buf.readUInt32LE(0),
        };
    }
    _parseParameterIdList(buf, notify_cateogry_id) {
        const v = buf.readUInt16LE(0);
        const list = [];
        if (notify_cateogry_id >= 2 && notify_cateogry_id <= 4) {
            // PhoneIncomingCall/PhoneInCall/PhoneIdle
            if (v & 0b0000000000000001) {
                list.push({ id: 0x09, name: 'NotifyId' });
            }
            if (v & 0b0000000000000010) {
                list.push({ id: 0x04, name: 'NotifyCategoryID' });
            }
        }
        else if (notify_cateogry_id === 5) {
            // Mail
            if (v & 0b0000000000000001) {
                list.push({ id: 0x0d, name: 'AppName' });
            }
            if (v & 0b0000000000000010) {
                list.push({ id: 0x0e, name: 'AppNameLocal' });
            }
            if (v & 0b0000000000000100) {
                list.push({ id: 0x28, name: 'Package' });
            }
            if (v & 0b0000000000001000) {
                list.push({ id: 0x0b, name: 'Tittle' });
            }
            if (v & 0b0000000000010000) {
                list.push({ id: 0x0c, name: 'Text' });
            }
            if (v & 0b0000000000100000) {
                list.push({ id: 0x13, name: 'Sender' });
            }
            if (v & 0b0000000001000000) {
                list.push({ id: 0x14, name: 'SenderAddress' });
            }
            if (v & 0b0000000010000000) {
                list.push({ id: 0x15, name: 'ReceiveDate' });
            }
            if (v & 0b0000000100000000) {
                list.push({ id: 0x09, name: 'NotifyId' });
            }
            if (v & 0b0000001000000000) {
                list.push({ id: 0x04, name: 'NotifyCategoryID' });
            }
        }
        else if (notify_cateogry_id === 6) {
            // Schedule
            if (v & 0b0000000000000001) {
                list.push({ id: 0x0d, name: 'AppName' });
            }
            if (v & 0b0000000000000010) {
                list.push({ id: 0x0e, name: 'AppNameLocal' });
            }
            if (v & 0b0000000000000100) {
                list.push({ id: 0x28, name: 'Package' });
            }
            if (v & 0b0000000000001000) {
                list.push({ id: 0x0b, name: 'Tittle' });
            }
            if (v & 0b0000000000010000) {
                list.push({ id: 0x16, name: 'StartDate' });
            }
            if (v & 0b0000000000100000) {
                list.push({ id: 0x17, name: 'EndDate' });
            }
            if (v & 0b0000000001000000) {
                list.push({ id: 0x18, name: 'Area' });
            }
            if (v & 0b0000000010000000) {
                list.push({ id: 0x19, name: 'Person' });
            }
            if (v & 0b0000000100000000) {
                list.push({ id: 0x0c, name: 'Text' });
            }
            if (v & 0b0000001000000000) {
                list.push({ id: 0x1d, name: 'Contents1' });
            }
            if (v & 0b0000010000000000) {
                list.push({ id: 0x1e, name: 'Contents2' });
            }
            if (v & 0b0000100000000000) {
                list.push({ id: 0x1f, name: 'Contents3' });
            }
            if (v & 0b0001000000000000) {
                list.push({ id: 0x09, name: 'NotifyId' });
            }
            if (v & 0b0010000000000000) {
                list.push({ id: 0x04, name: 'NotifyCategoryID' });
            }
        }
        else if (notify_cateogry_id === 7) {
            // General
            if (v & 0b0000000000000001) {
                list.push({ id: 0x0d, name: 'AppName' });
            }
            if (v & 0b0000000000000010) {
                list.push({ id: 0x0e, name: 'AppNameLocal' });
            }
            if (v & 0b0000000000000100) {
                list.push({ id: 0x28, name: 'Package' });
            }
            if (v & 0b0000000000001000) {
                list.push({ id: 0x0b, name: 'Tittle' });
            }
            if (v & 0b0000000000010000) {
                list.push({ id: 0x0c, name: 'Text' });
            }
            if (v & 0b0000000000100000) {
                list.push({ id: 0x09, name: 'NotifyId' });
            }
            if (v & 0b0000000001000000) {
                list.push({ id: 0x04, name: 'NotifyCategoryID' });
            }
        }
        else if (notify_cateogry_id === 8) {
            // Etc
            if (v & 0b0000000000000001) {
                list.push({ id: 0x0d, name: 'AppName' });
            }
            if (v & 0b0000000000000010) {
                list.push({ id: 0x0e, name: 'AppNameLocal' });
            }
            if (v & 0b0000000000000100) {
                list.push({ id: 0x28, name: 'Package' });
            }
            if (v & 0b0000000000001000) {
                list.push({ id: 0x1d, name: 'Contents1' });
            }
            if (v & 0b0000000000010000) {
                list.push({ id: 0x1e, name: 'Contents2' });
            }
            if (v & 0b0000000000100000) {
                list.push({ id: 0x1f, name: 'Contents3' });
            }
            if (v & 0b0000000001000000) {
                list.push({ id: 0x20, name: 'Contents4' });
            }
            if (v & 0b0000000010000000) {
                list.push({ id: 0x21, name: 'Contents5' });
            }
            if (v & 0b0000000100000000) {
                list.push({ id: 0x22, name: 'Contents6' });
            }
            if (v & 0b0000001000000000) {
                list.push({ id: 0x23, name: 'Contents7' });
            }
            if (v & 0b0000010000000000) {
                list.push({ id: 0x1b, name: 'MimeTypeForMedia' });
            }
            if (v & 0b0000100000000000) {
                list.push({ id: 0x27, name: 'Media' });
            }
            if (v & 0b0001000000000000) {
                list.push({ id: 0x1a, name: 'MimeTypeForImage' });
            }
            if (v & 0b0010000000000000) {
                list.push({ id: 0x1c, name: 'Image' });
            }
            if (v & 0b0100000000000000) {
                list.push({ id: 0x09, name: 'NotifyId' });
            }
            if (v & 0b1000000000000000) {
                list.push({ id: 0x04, name: 'NotifyCategoryID' });
            }
        }
        return {
            name: 'ParameterIdList',
            parameterIdList: list,
        };
    }
    _parseUniqueId(buf) {
        return {
            name: 'UniqueId',
            uniqueId: buf.readUInt16LE(0),
        };
    }
    _parseNotifyId(buf) {
        return {
            name: 'NotifyId',
            notifyId: buf.readUInt16LE(0),
        };
    }
    _parseNotificationOperation(buf) {
        const code = buf.readUInt8(0);
        let text = '';
        if (code === 0x00) {
            text = 'AlreadyRead';
        }
        else if (code === 0x01) {
            text = 'Delete';
        }
        return {
            name: 'NotificationOperation',
            notificationOperationCode: code,
            notificationOperationText: text,
        };
    }
    _parseTittle(buf) {
        return {
            name: 'Tittle',
            title: buf.toString('UTF-8'),
        };
    }
    _parseText(buf) {
        return {
            name: 'Text',
            text: buf.toString('UTF-8'),
        };
    }
    _parseAppName(buf) {
        return {
            name: 'AppName',
            appName: buf.toString('UTF-8'),
        };
    }
    _parseAppNameLocal(buf) {
        return {
            name: 'AppNameLocal',
            appNameLocal: buf.toString('UTF-8'),
        };
    }
    _parseNotifyApp(buf) {
        return {
            name: 'NotifyApp',
            notifyApp: buf.toString('UTF-8'),
        };
    }
    _parseRumblingSetting(buf) {
        const list = [];
        const v = buf.readUInt8(0);
        if (v & 0b00000001) {
            list.push({ id: 0, name: 'LED' });
        }
        if (v & 0b00000010) {
            list.push({ id: 1, name: 'Vibration' });
        }
        if (v & 0b00000100) {
            list.push({ id: 2, name: 'Beep' });
        }
        return {
            name: 'RumblingSetting',
            rumblingSetting: list,
        };
    }
    _parseVibrationPattern(buf) {
        const list = [];
        let offset = 0;
        while (true) {
            const len = buf.readUInt8(offset++);
            let name = '';
            for (let i = 0; i < len; i++) {
                name += String.fromCharCode(buf.readUInt8(offset++));
            }
            list.push(name);
            if (offset >= buf.length) {
                break;
            }
        }
        return {
            name: 'VibrationPattern',
            vibrationPattern: list,
        };
    }
    _parseLedPattern(buf) {
        const list = [];
        let offset = 0;
        while (true) {
            const len = buf.readUInt8(offset++);
            let name = '';
            for (let i = 0; i < len; i++) {
                name += String.fromCharCode(buf.readUInt8(offset++));
            }
            list.push(name);
            if (offset >= buf.length) {
                break;
            }
        }
        return {
            name: 'LedPattern',
            LedPattern: list,
        };
    }
    _parseSender(buf) {
        return {
            name: 'Sender',
            sender: buf.toString('UTF-8'),
        };
    }
    _parseSenderAddress(buf) {
        return {
            name: 'SenderAddress',
            senderAddress: buf.toString('UTF-8'),
        };
    }
    _parseReceiveDate(buf) {
        const Y = buf.readUInt16LE(0);
        const M = buf.readUInt8(2);
        const D = buf.readUInt8(3);
        const h = buf.readUInt8(4);
        const m = buf.readUInt8(5);
        const s = buf.readUInt8(6);
        const dt = new Date(Y, M, D, h, m, s);
        return {
            name: 'ReceiveDate',
            receiveDate: dt,
        };
    }
    _parseStartDate(buf) {
        const Y = buf.readUInt16LE(0);
        const M = buf.readUInt8(2);
        const D = buf.readUInt8(3);
        const h = buf.readUInt8(4);
        const m = buf.readUInt8(5);
        const s = buf.readUInt8(6);
        const dt = new Date(Y, M, D, h, m, s);
        return {
            name: 'StartDate',
            startDate: dt,
        };
    }
    _parseEndDate(buf) {
        const Y = buf.readUInt16LE(0);
        const M = buf.readUInt8(2);
        const D = buf.readUInt8(3);
        const h = buf.readUInt8(4);
        const m = buf.readUInt8(5);
        const s = buf.readUInt8(6);
        const dt = new Date(Y, M, D, h, m, s);
        return {
            name: 'EndDate',
            endDate: dt,
        };
    }
    _parseArea(buf) {
        return {
            name: 'Area',
            area: buf.toString('UTF-8'),
        };
    }
    _parsePerson(buf) {
        const buf_list = [];
        let offset = 0;
        let start = 0;
        while (true) {
            if (buf.readUInt8(offset) === 0x00) {
                if (start !== offset) {
                    buf_list.push(buf.slice(start, offset));
                    start = offset;
                }
            }
            offset++;
            if (offset >= buf.length) {
                if (start !== offset) {
                    buf_list.push(buf.slice(start, offset));
                }
                break;
            }
        }
        const list = [];
        buf_list.forEach((b) => {
            list.push(b.toString('UTF-8'));
        });
        return {
            name: 'Person',
            person: list,
        };
    }
    _parseMimeTypeForImage(buf) {
        return {
            name: 'MimeTypeForImage',
            mimeTypeForImage: buf.toString('UTF-8'),
        };
    }
    _parseMimeTypeForMedia(buf) {
        return {
            name: 'MimeTypeForMedia',
            mimeTypeForMedia: buf.toString('UTF-8'),
        };
    }
    _parseImage(buf) {
        return {
            name: 'Image',
            image: buf,
        };
    }
    _parseContents(buf, pid) {
        return {
            name: 'Contents' + pid,
            contents: buf.toString('UTF-8'),
        };
    }
    _parseMedia(buf) {
        return {
            name: 'Media',
            media: buf,
        };
    }
    _parsePackage(buf) {
        return {
            name: 'Package',
            package: buf.toString('UTF-8'),
        };
    }
    _parseClass(buf) {
        return {
            name: 'Class',
            class: buf.toString('UTF-8'),
        };
    }
    _parseSharingInformation(buf) {
        return {
            name: 'SharingInformation',
            sharingInformation: buf.toString('UTF-8'),
        };
    }
    _parseBeepPattern(buf) {
        const list = [];
        let offset = 0;
        while (true) {
            const len = buf.readUInt8(offset++);
            let name = '';
            for (let i = 0; i < len; i++) {
                name += String.fromCharCode(buf.readUInt8(offset++));
            }
            list.push(name);
            if (offset >= buf.length) {
                break;
            }
        }
        return {
            name: 'BeepPattern',
            beepPattern: list,
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
        if (message_name === 'CONFIRM_NOTIFY_CATEGORY') {
            return this._createPayloadConfirmNotifyCategory(params);
        }
        else if (message_name === 'NOTIFY_INFORMATION') {
            return this._createPayloadNotifyInformation(params);
        }
        else if (message_name === 'GET_PD_NOTIFY_DETAIL_DATA_RESP') {
            return this._createPayloadGetPdNotifyDetailDataResp(params);
        }
        else if (message_name === 'START_PD_APPLICATION_RESP') {
            return this._createPayloadStartPdApplicationResp(params);
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
    _createPayloadConfirmNotifyCategory(params) {
        const pnum_buf = Buffer.alloc(1);
        pnum_buf.writeUInt8(0);
        return pnum_buf;
    }
    _createPayloadNotifyInformation(params) {
        /*
            NotifyCategory   M 2 0x03
            UniqueId         M 2 0x08
            ParameterIdList  M 2 0x07
            RumblingSetting  O 1 0x10
            VibrationPattern O   0x11
            LedPattern       O   0x12
            BeepPattern      O   0x2B
            */
        /*
            let pnum = 0;
            let notify_category = null;
            let notify_category_name = '';
            if('NotifyCategory' in params) {
                notify_category =  params['NotifyCategory'];
                if(typeof(notify_category) === 'number') {
                    if(notify_category >= 0 && notify_category <= 0xFF && notify_category % 1 === 0) {
                        let hit = false;
                        for(let name in this._NOTIFY_CATEGORY_NAME_ID_MAP) {
                            if(this._NOTIFY_CATEGORY_NAME_ID_MAP[name] === notify_category) {
                                hit = true;
                                notify_category_name = name;
                                break;
                            }
                        }
                        if(hit === true) {
                            pnum ++;
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                } else if(typeof(notify_category) === 'string') {
                    if(notify_category in this._NOTIFY_CATEGORY_NAME_ID_MAP) {
                        notify_category = this._NOTIFY_CATEGORY_NAME_ID_MAP[notify_category];
                        notify_category_name = notify_category;
                        pnum ++;
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            } else {
                return null;
            }
            let uid = null;
            if(('UniqueId' in params) && typeof(params['UniqueId']) === 'number' && params['UniqueId'] >= 0 && params['UniqueId'] <= 0xFFFF && params['UniqueId'] % 1 === 0) {
                uid = params['UniqueId'];
                pnum ++;
            } else {
                return null;
            }
            // buffer list
            let buf_list = [];
            // Number of parameters
            let pnum_buf = Buffer.from([pnum]);
            buf_list.push(pnum_buf);
            // NotifyCategory
            if(notify_category !== null) {
                let n = 1 << notify_category;
                let val_buf = Buffer.alloc(2);
                val_buf.writeUInt16LE(n);
                buf_list.push(this._createPropertyBlockBuffer(0x03, val_buf));
            }
            // UniqueId
            if(uid !== null) {
                let val_buf = Buffer.alloc(2);
                val_buf.writeUInt16LE(uid);
                buf_list.push(this._createPropertyBlockBuffer(0x08, val_buf));
            }
            // Create a packet
            return Buffer.concat(buf_list);
            */
        return null;
    }
    _createPayloadGetPdNotifyDetailDataResp(params) {
        let pnum = 0;
        let rcode = null;
        if ('ResultCode' in params &&
            typeof params.ResultCode === 'number' &&
            params.ResultCode >= 0 &&
            params.ResultCode <= 0xff &&
            params.ResultCode % 1 === 0) {
            rcode = params.ResultCode;
            pnum++;
        }
        else {
            return null;
        }
        let uid = null;
        if ('UniqueId' in params &&
            typeof params.UniqueId === 'number' &&
            params.UniqueId >= 0 &&
            params.UniqueId <= 0xff &&
            params.UniqueId % 1 === 0) {
            uid = params.UniqueId;
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
        // ResultCode
        if (rcode !== null) {
            const val_buf = Buffer.alloc(1);
            val_buf.writeUInt8(rcode);
            buf_list.push(this._createPropertyBlockBuffer(0x00, val_buf));
        }
        // UniqueId
        if (uid !== null) {
            const val_buf = Buffer.alloc(2);
            val_buf.writeUInt16LE(uid);
            buf_list.push(this._createPropertyBlockBuffer(0x08, val_buf));
        }
        // Create a packet
        return Buffer.concat(buf_list);
    }
    _createPayloadStartPdApplicationResp(params) {
        let pnum = 0;
        let rcode;
        if ('ResultCode' in params &&
            typeof params.ResultCode === 'number' &&
            params.ResultCode >= 0 &&
            params.ResultCode <= 0xff &&
            params.ResultCode % 1 === 0) {
            rcode = params.ResultCode;
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
        // ResultCode
        if (rcode !== null) {
            const val_buf = Buffer.alloc(1);
            val_buf.writeUInt8(rcode);
            buf_list.push(this._createPropertyBlockBuffer(0x00, val_buf));
        }
        // Create a packet
        return Buffer.concat(buf_list);
    }
}
exports.default = LinkingServiceNotification;
