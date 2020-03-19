"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class REX_BTPM25V {
    constructor(peripheral) {
        this.keys = [];
        this.requiredKeys = [];
        this.onbuttonpressed = null;
        this._uuids = {
            service: "00001523-1212-EFDE-1523-785FEABCD123",
            buttonChar: "000000A1-1212-EFDE-1523-785FEABCD123",
            continuousMeasurementChar: "000000A5-1212-EFDE-1523-785FEABCD123",
            oneShotMeasurementChar: "000000A8-1212-EFDE-1523-785FEABCD123",
            ledChar: "000000A9-1212-EFDE-1523-785FEABCD123",
        };
        this._peripheral = null;
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
    async measureOneShotWait() {
        if (!this._oneShotMeasurementCharacteristic) {
            throw new Error("device is not connected");
        }
        const sendData = new Array(20);
        sendData[0] = 0x01;
        const data = await this._sendAndReceiveWait(this._oneShotMeasurementCharacteristic, sendData);
        return this._analyzeResult(data);
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
        const pressure = buf.readInt16LE(9);
        const temperature = buf.readInt8(11);
        const humidity = buf.readInt8(12);
        const lux = buf.readUInt16LE(13);
        const dummy = buf.slice(15, 19);
        const mode = buf.readInt8(19);
        return {
            minutes,
            hour,
            day,
            month,
            year,
            pm2_5,
            pm10,
            pressure,
            temperature,
            humidity,
            lux,
            mode,
        };
    }
}
exports.default = REX_BTPM25V;

//# sourceMappingURL=index.js.map
