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
}
exports.default = Logtta_CO2;

//# sourceMappingURL=index.js.map
