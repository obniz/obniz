"use strict";
/**
 * @packageDocumentation
 * @module Parts.OMRON_2JCIE
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = __importDefault(require("../../../obniz/ObnizPartsBleInterface"));
class OMRON_2JCIE {
    constructor(peripheral) {
        this._peripheral = null;
        if (peripheral && !OMRON_2JCIE.isDevice(peripheral)) {
            throw new Error("peripheral is not RS_BTIREX2");
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: "2JCIE",
        };
    }
    static isDevice(peripheral) {
        return ((peripheral.localName && peripheral.localName.indexOf("Env") >= 0) ||
            (peripheral.localName && peripheral.localName.indexOf("IM") >= 0));
    }
    /**
     * Get a datas from advertisement mode of OMRON 2JCIE
     */
    static getData(peripheral) {
        if (peripheral.localName && peripheral.localName.indexOf("IM") >= 0) {
            const adv_data = peripheral.adv_data;
            return {
                temperature: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[8], adv_data[9]) * 0.01,
                relative_humidity: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[10], adv_data[11]) * 0.01,
                light: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[12], adv_data[13]) * 1,
                uv_index: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[14], adv_data[15]) * 0.01,
                barometric_pressure: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[16], adv_data[17]) * 0.1,
                soud_noise: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[18], adv_data[18]) * 0.01,
            };
        }
        return null;
    }
    wired(obniz) {
        this.obniz = obniz;
    }
    async findWait() {
        const target = {
            localName: "Env",
        };
        await this.obniz.ble.initWait();
        this._peripheral = await this.obniz.ble.scan.startOneWait(target);
        return this._peripheral;
    }
    omron_uuid(uuid) {
        return `0C4C${uuid}-7700-46F4-AA96D5E974E32A54`;
    }
    async connectWait() {
        if (!this._peripheral) {
            await this.findWait();
        }
        if (!this._peripheral) {
            throw new Error("2JCIE not found");
        }
        if (!this._peripheral.connected) {
            this._peripheral.ondisconnect = (reason) => {
                if (typeof this.ondisconnect === "function") {
                    this.ondisconnect(reason);
                }
            };
            await this._peripheral.connectWait();
        }
    }
    async disconnectWait() {
        if (this._peripheral && this._peripheral.connected) {
            await this._peripheral.disconnectWait();
        }
    }
    signedNumberFromBinary(data) {
        // little adian
        let val = data[data.length - 1] & 0x7f;
        for (let i = data.length - 2; i >= 0; i--) {
            val = val * 256 + data[i];
        }
        if ((data[data.length - 1] & 0x80) !== 0) {
            val = val - Math.pow(2, data.length * 8 - 1);
        }
        return val;
    }
    unsignedNumberFromBinary(data) {
        // little adian
        let val = data[data.length - 1];
        for (let i = data.length - 2; i >= 0; i--) {
            val = val * 256 + data[i];
        }
        return val;
    }
    async getLatestData() {
        await this.connectWait();
        const c = this._peripheral.getService(this.omron_uuid("3000")).getCharacteristic(this.omron_uuid("3001"));
        const data = await c.readWait();
        const json = {
            row_number: data[0],
            temperature: this.signedNumberFromBinary(data.slice(1, 3)) * 0.01,
            relative_humidity: this.signedNumberFromBinary(data.slice(3, 5)) * 0.01,
            light: this.signedNumberFromBinary(data.slice(5, 7)) * 1,
            uv_index: this.signedNumberFromBinary(data.slice(7, 9)) * 0.01,
            barometric_pressure: this.signedNumberFromBinary(data.slice(9, 11)) * 0.1,
            soud_noise: this.signedNumberFromBinary(data.slice(11, 13)) * 0.01,
            discomfort_index: this.signedNumberFromBinary(data.slice(13, 15)) * 0.01,
            heatstroke_risk_factor: this.signedNumberFromBinary(data.slice(15, 17)) * 0.01,
            battery_voltage: this.unsignedNumberFromBinary(data.slice(17, 19)) * 0.001,
        };
        return json;
    }
}
exports.default = OMRON_2JCIE;
