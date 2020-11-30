"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const batteryService_1 = __importDefault(require("../abstract/services/batteryService"));
const genericAccess_1 = __importDefault(require("../abstract/services/genericAccess"));
class Logtta_CO2 {
    constructor(peripheral) {
        if (!peripheral || !Logtta_CO2.isDevice(peripheral)) {
            throw new Error("peripheral is not Logtta CO2");
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: "Logtta_CO2",
        };
    }
    static isDevice(peripheral) {
        return peripheral.localName === "CO2 Sensor";
    }
    static isAdvDevice(peripheral) {
        if (peripheral.adv_data.length !== 31) {
            return false;
        }
        const data = peripheral.adv_data;
        if (Logtta_CO2.getName(data) !== "CO2 Sensor") {
            return false;
        }
        return true;
    }
    static getData(peripheral) {
        if (peripheral.adv_data.length !== 31) {
            return null;
        }
        const data = peripheral.adv_data;
        if (Logtta_CO2.getName(data) !== "CO2 Sensor") {
            return null;
        }
        const alert = data[15];
        const interval = (data[13] << 8) | data[14];
        const advData = {
            battery: data[12],
            co2: (data[8] << 8) | data[9],
            interval,
            address: peripheral.address,
        };
        return advData;
    }
    static getName(data) {
        let name = "";
        for (let i = 16; i < data.length; i++) {
            if (data[i] === 0) {
                break;
            }
            name += String.fromCharCode(data[i]);
        }
        return name;
    }
    static get_uuid(uuid) {
        return `31f3${uuid}-bd1c-46b1-91e4-f57abcf7d449`;
    }
    async connectWait() {
        if (!this._peripheral) {
            throw new Error("Logtta CO2 not found");
        }
        if (!this._peripheral.connected) {
            this._peripheral.ondisconnect = (reason) => {
                if (typeof this.ondisconnect === "function") {
                    this.ondisconnect(reason);
                }
            };
            await this._peripheral.connectWait();
            const service1800 = this._peripheral.getService("1800");
            if (service1800) {
                this.genericAccess = new genericAccess_1.default(service1800);
            }
            const service180F = this._peripheral.getService("180F");
            if (service180F) {
                this.batteryService = new batteryService_1.default(service180F);
            }
        }
    }
    async disconnectWait() {
        if (this._peripheral && this._peripheral.connected) {
            await this._peripheral.disconnectWait();
        }
    }
    async getWait() {
        if (!(this._peripheral && this._peripheral.connected)) {
            return null;
        }
        const c = this._peripheral.getService(Logtta_CO2.get_uuid("AB20")).getCharacteristic(Logtta_CO2.get_uuid("AB21"));
        const data = await c.readWait();
        return data[0] * 256 + data[1];
    }
    async startNotifyWait() {
        if (!(this._peripheral && this._peripheral.connected)) {
            return;
        }
        const c = this._peripheral.getService(Logtta_CO2.get_uuid("AB20")).getCharacteristic(Logtta_CO2.get_uuid("AB21"));
        await c.registerNotifyWait((data) => {
            if (this.onNotify) {
                this.onNotify(data[0] * 256 + data[1]);
            }
        });
    }
    async authPinCodeWait(code) {
        if (!(this._peripheral && this._peripheral.connected)) {
            return;
        }
        if (code.length !== 4) {
            throw new Error("Invalid length auth code");
        }
        const data = [0];
        for (let i = 0; i < code.length; i += 2) {
            data.push((this.checkNumber(code.charAt(i)) << 4) | this.checkNumber(code.charAt(i + 1)));
        }
        const c = this._peripheral.getService(Logtta_CO2.get_uuid("AB20")).getCharacteristic(Logtta_CO2.get_uuid("AB30"));
        await c.writeWait(data);
    }
    // 有効にしたあと、切断するとビーコンが発信される
    async setBeaconMode(enable) {
        if (!(this._peripheral && this._peripheral.connected)) {
            return;
        }
        const c = this._peripheral.getService(Logtta_CO2.get_uuid("AB20")).getCharacteristic(Logtta_CO2.get_uuid("AB2D"));
        if (enable) {
            await c.writeWait([1]);
        }
        else {
            await c.writeWait([0]);
        }
    }
    checkNumber(data) {
        if (data >= "0" && data <= "9") {
            return parseInt(data, 10);
        }
        else {
            throw new Error(`authorization code can only be entered from 0-9.input word : ${data}`);
        }
    }
}
exports.default = Logtta_CO2;
