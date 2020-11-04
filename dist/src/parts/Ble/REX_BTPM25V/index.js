"use strict";
/**
 * @packageDocumentation
 * @module Parts.REX_BTPM25V
 */
Object.defineProperty(exports, "__esModule", { value: true });
class REX_BTPM25V {
    constructor(peripheral) {
        this.keys = [];
        this.requiredKeys = [];
        this.onbuttonpressed = null;
        this._peripheral = null;
        this._uuids = {
            service: "00001523-1212-EFDE-1523-785FEABCD123",
            buttonChar: "000000A1-1212-EFDE-1523-785FEABCD123",
            continuousMeasurementChar: "000000A5-1212-EFDE-1523-785FEABCD123",
            oneShotMeasurementChar: "000000A8-1212-EFDE-1523-785FEABCD123",
            ledChar: "000000A9-1212-EFDE-1523-785FEABCD123",
        };
        this._oneShotMeasurementCharacteristic = null;
        this._continuousMeasurementCharacteristic = null;
        this._ledCharacteristic = null;
        this._buttonCharacteristic = null;
        if (peripheral && !REX_BTPM25V.isDevice(peripheral)) {
            throw new Error("peripheral is not RS_Seek3");
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: "REX_BTPM25V",
        };
    }
    static isDevice(peripheral) {
        if (peripheral.localName !== "PM25V") {
            return false;
        }
        return true;
    }
    // @ts-ignore
    wired(obniz) { }
    async connectWait() {
        if (!this._peripheral) {
            throw new Error("RS_Seek3 is not find.");
        }
        this._peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === "function") {
                this.ondisconnect(reason);
            }
        };
        await this._peripheral.connectWait();
        this._oneShotMeasurementCharacteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.oneShotMeasurementChar);
        this._continuousMeasurementCharacteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.continuousMeasurementChar);
        this._ledCharacteristic = this._peripheral.getService(this._uuids.service).getCharacteristic(this._uuids.ledChar);
        this._buttonCharacteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.buttonChar);
        if (this._buttonCharacteristic) {
            this._buttonCharacteristic.registerNotify((data) => {
                if (typeof this.onbuttonpressed === "function") {
                    this.onbuttonpressed(data[0] === 1);
                }
            });
        }
    }
    async disconnectWait() {
        var _a;
        await ((_a = this._peripheral) === null || _a === void 0 ? void 0 : _a.disconnectWait());
    }
    async measureOneShotWait() {
        if (!this._oneShotMeasurementCharacteristic) {
            throw new Error("device is not connected");
        }
        const sendData = new Array(20);
        sendData[0] = 0x01;
        const data = await this._sendAndReceiveWait(this._oneShotMeasurementCharacteristic, sendData);
        return this._analyzeResult(data);
    }
    async measureOneShotExtWait() {
        if (!this._oneShotMeasurementCharacteristic) {
            throw new Error("device is not connected");
        }
        const sendData = new Array(20);
        sendData[0] = 0x10;
        const data = await this._sendAndReceiveWait(this._oneShotMeasurementCharacteristic, sendData);
        return this._analyzeResultExt(data);
    }
    async getLedMode() {
        if (!this._ledCharacteristic) {
            throw new Error("device is not connected");
        }
        const data = this._sendAndReceiveWait(this._ledCharacteristic, [0xff, 0x00]);
    }
    _sendAndReceiveWait(char, data) {
        return new Promise((resolve) => {
            char.registerNotify(resolve);
            char.write(data);
        });
    }
    _analyzeResult(data) {
        const buf = Buffer.from(data);
        const [minutes, hour, day, month, year] = buf.slice(0, 5);
        const pm2_5 = buf.readInt16LE(5);
        const pm10 = buf.readInt16LE(7);
        const barometricPressure = buf.readInt16LE(9);
        const temperature = buf.readInt8(11);
        const humidity = buf.readInt8(12);
        const lux = buf.readUInt16LE(13);
        const dummy = buf.slice(15, 19);
        const mode = buf.readInt8(19);
        return {
            // minutes,
            // hour,
            // day,
            // month,
            // year,
            pm2_5,
            pm10,
            barometricPressure,
            temperature,
            humidity,
            lux,
            mode,
        };
    }
    _bitValue(buffer, location) {
        const startLoc = { byte: Math.floor(location.start / 8), bit: location.start % 8 };
        const endLoc = { byte: Math.floor(location.end / 8), bit: location.end % 8 };
        let result = 0;
        result = buffer.readUInt8(endLoc.byte) & (~(0xff << (endLoc.bit + 1)) & 0xff);
        if (startLoc.byte === endLoc.byte) {
            return result >> startLoc.bit;
        }
        for (let byte = endLoc.byte - 1; byte > startLoc.byte; byte--) {
            result = result << (8 + buffer.readInt8(byte));
        }
        result = (result << (8 - startLoc.bit)) + (buffer.readUInt8(startLoc.byte) >> startLoc.bit);
        return result;
    }
    _analyzeResultExt(data) {
        const buf = Buffer.from(data);
        const buf1 = buf.slice(0, 4);
        const minutes = this._bitValue(buf1, { start: 5, end: 10 });
        const hour = this._bitValue(buf1, { start: 11, end: 15 });
        const day = this._bitValue(buf1, { start: 16, end: 20 });
        const month = this._bitValue(buf1, { start: 21, end: 24 });
        const year = this._bitValue(buf1, { start: 25, end: 31 });
        const buf2 = buf.slice(4, 8);
        const pm2_5 = this._bitValue(buf2, { start: 0, end: 9 });
        const pm10 = this._bitValue(buf2, { start: 10, end: 19 });
        const uv = this._bitValue(buf2, { start: 20, end: 23 });
        const buf3 = buf.slice(8, 12);
        const temperature = this._bitValue(buf3, { start: 0, end: 10 }) / 10 - 40;
        const humidity = this._bitValue(buf3, { start: 11, end: 20 }) / 10;
        const buf4 = buf.slice(12, 16);
        const barometricPressure = this._bitValue(buf4, { start: 0, end: 13 }) / 10;
        const vocState_init = this._bitValue(buf4, { start: 14, end: 14 });
        const vocState_wakeup = this._bitValue(buf4, { start: 15, end: 15 });
        const lux = this._bitValue(buf4, { start: 16, end: 31 });
        const buf5 = buf.slice(16, 20);
        const tvoc = this._bitValue(buf5, { start: 0, end: 10 });
        const eco2 = this._bitValue(buf5, { start: 11, end: 23 });
        const mode = this._bitValue(buf5, { start: 24, end: 31 });
        return {
            // minutes,
            // hour,
            // day,
            // month,
            // year,
            pm2_5,
            pm10,
            barometricPressure,
            temperature,
            humidity,
            lux,
            // mode,
            tvoc,
            eco2,
            uv,
        };
    }
}
exports.default = REX_BTPM25V;
