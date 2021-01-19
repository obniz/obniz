"use strict";
/**
 * @packageDocumentation
 * @module Parts.ENERTALK_TOUCH
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const batteryService_1 = __importDefault(require("../abstract/services/batteryService"));
class ENERTALK_TOUCH {
    constructor(peripheral) {
        this.keys = [];
        this.requiredKeys = [];
        this.onbuttonpressed = null;
        this._peripheral = null;
        this._uuids = {
            service: "3526797e-448b-4bbb-9145-c5083e0e09dc",
            temperatureChar: "2A6E",
            humidityChar: "2A6F",
            illuminanceChar: "74c3fe9d-25b2-4903-8dcd-680e5ef0a6b3",
            accelerometerChar: "71ef0979-0e2c-4a55-8d3c-78083869fae6",
        };
        this._service = null;
        this._temperatureChar = null;
        this._humidityChar = null;
        this._illuminanceChar = null;
        this._accelerometerChar = null;
        if (peripheral && !ENERTALK_TOUCH.isDevice(peripheral)) {
            throw new Error("peripheral is not RS_BTIREX2");
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: "ENERTALK_TOUCH",
        };
    }
    static isDevice(peripheral) {
        if (peripheral.localName && peripheral.localName.startsWith("ensensor_")) {
            return true;
        }
        return false;
    }
    async connectWait() {
        if (!this._peripheral) {
            throw new Error("RS_BTIREX2 is not find.");
        }
        this._peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === "function") {
                this.ondisconnect(reason);
            }
        };
        await this._peripheral.connectWait();
        this._service = this._peripheral.getService(this._uuids.service);
        this._temperatureChar = this._service.getCharacteristic(this._uuids.temperatureChar);
        this._humidityChar = this._service.getCharacteristic(this._uuids.humidityChar);
        this._illuminanceChar = this._service.getCharacteristic(this._uuids.illuminanceChar);
        this._accelerometerChar = this._service.getCharacteristic(this._uuids.accelerometerChar);
        const service180F = this._peripheral.getService("180F");
        if (service180F) {
            this.batteryService = new batteryService_1.default(service180F);
        }
    }
    async disconnectWait() {
        var _a;
        await ((_a = this._peripheral) === null || _a === void 0 ? void 0 : _a.disconnectWait());
    }
    async getTemperatureWait() {
        if (!this._temperatureChar) {
            throw new Error("device is not connected");
        }
        const tempData = await this._temperatureChar.readWait();
        const buf = Buffer.from(tempData);
        const temp = buf.readInt16BE(0) / 100;
        return temp;
    }
    async getHumidityWait() {
        if (!this._humidityChar) {
            throw new Error("device is not connected");
        }
        const humidityData = await this._humidityChar.readWait();
        const humidity = humidityData[0];
        return humidity;
    }
    async getIlluminationWait() {
        if (!this._illuminanceChar) {
            throw new Error("device is not connected");
        }
        const illuminanceData = await this._illuminanceChar.readWait();
        const buf = Buffer.from(illuminanceData);
        const illuminance = buf.readInt16BE(0);
        return illuminance;
    }
    async getAccelerometerWait() {
        if (!this._accelerometerChar) {
            throw new Error("device is not connected");
        }
        const accelerometerData = await this._accelerometerChar.readWait();
        const buf = Buffer.from(accelerometerData);
        const x = buf.readInt16BE(0) / 1000;
        const y = buf.readInt16BE(2) / 1000;
        const z = buf.readInt16BE(4) / 1000;
        return { x, y, z };
    }
}
exports.default = ENERTALK_TOUCH;
