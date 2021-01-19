"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_AD
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Logtta_AD {
    constructor(peripheral) {
        if (peripheral && !Logtta_AD.isDevice(peripheral)) {
            throw new Error("peripheral is not logtta AD");
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: "Logtta_AD",
        };
    }
    static isDevice(peripheral) {
        return peripheral.localName === "Analog";
    }
    static get_uuid(uuid) {
        return `4e43${uuid}-6687-4f3c-a1c3-1c327583f29d`;
    }
    async connectWait() {
        if (!this._peripheral) {
            throw new Error("Logtta AD not found");
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
    async getAllWait() {
        if (!(this._peripheral && this._peripheral.connected)) {
            return null;
        }
        const c = this._peripheral.getService(Logtta_AD.get_uuid("AE20")).getCharacteristic(Logtta_AD.get_uuid("AE21"));
        const data = await c.readWait();
        return {
            ampere: (((data[0] << 8) | data[1]) * 916) / 16,
            volt: (((data[0] << 8) | data[1]) * 916) / 4,
            count: (data[2] << 8) | data[3],
        };
    }
    async getAmpereWait() {
        return (await this.getAllWait()).ampere;
    }
    async getVoltWait() {
        return (await this.getAllWait()).volt;
    }
    async getCountWait() {
        return (await this.getAllWait()).count;
    }
    async startNotifyWait() {
        if (!(this._peripheral && this._peripheral.connected)) {
            return;
        }
        const c = this._peripheral.getService(Logtta_AD.get_uuid("AE20")).getCharacteristic(Logtta_AD.get_uuid("AE21"));
        await c.registerNotifyWait((data) => {
            if (this.onNotify) {
                this.onNotify({
                    ampere: (16 / 916) * ((data[0] << 8) | data[1]),
                    volt: (4 / 916) * ((data[0] << 8) | data[1]),
                    count: (data[2] << 8) | data[3],
                });
            }
        });
    }
}
exports.default = Logtta_AD;
