/**
 * @packageDocumentation
 * @module Parts.Linking
 */
/* ------------------------------------------------------------------
 * node-linking - service-operation.js
 *
 * Copyright (c) 2017-2019, Futomi Hatano, All rights reserved.
 * Released under the MIT license
 * Date: 2019-11-02
 * ---------------------------------------------------------------- */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class LinkingServiceOperation {
    constructor() {
        this.SERVICE_ID = 0x02;
        this.SERVICE_NAME = 'PeripheralDeviceOperation';
        this.MESSAGE_NAME_MAP = {
            '00': 'NOTIFY_PD_OPERATION',
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
            parsed = this._parseButtonId(buf);
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
    _parseButtonId(buf) {
        const code = buf.readUInt8(0);
        let text = '';
        if (code === 0x00) {
            text = 'Power';
        }
        else if (code === 0x01) {
            text = 'Return';
        }
        else if (code === 0x02) {
            text = 'SingleClick';
        }
        else if (code === 0x03) {
            text = 'Home';
        }
        else if (code === 0x04) {
            text = 'DoubleClick';
        }
        else if (code === 0x05) {
            text = 'VolumeUp';
        }
        else if (code === 0x06) {
            text = 'VolumeDown';
        }
        else if (code === 0x07) {
            text = 'LongPress';
        }
        else if (code === 0x08) {
            text = 'Pause';
        }
        else if (code === 0x09) {
            text = 'LongPressRelease';
        }
        else if (code === 0x0a) {
            text = 'FastForward';
        }
        else if (code === 0x0b) {
            text = 'ReWind';
        }
        else if (code === 0x0c) {
            text = 'Shutter';
        }
        else if (code === 0x0d) {
            text = 'Up';
        }
        else if (code === 0x0e) {
            text = 'Down';
        }
        else if (code === 0x0f) {
            text = 'Left';
        }
        else if (code === 0x10) {
            text = 'Right';
        }
        else if (code === 0x11) {
            text = 'Enter';
        }
        else if (code === 0x12) {
            text = 'Menu';
        }
        else if (code === 0x13) {
            text = 'Play';
        }
        else if (code === 0x14) {
            text = 'Stop';
        }
        return {
            name: 'ButtonId',
            buttonId: code,
            buttonName: text,
        };
    }
}
exports.default = LinkingServiceOperation;
