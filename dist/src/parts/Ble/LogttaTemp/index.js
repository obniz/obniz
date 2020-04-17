"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_TH
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Logtta_TH {
    constructor(peripheral) {
        if (peripheral && !Logtta_TH.isDevice(peripheral)) {
            throw new Error("peripheral is not logtta TH");
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: "Logtta_TH",
        };
    }
    static isDevice(peripheral) {
        return peripheral.localName === "TH Sensor";
    }
    static get_uuid(uuid) {
        return `f7ee${uuid}-276e-4165-aa69-7e3de7fc627e`;
    }
    async connectWait() {
        if (!this._peripheral) {
            throw new Error("Logtta TH not found");
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
        const c = this._peripheral.getService(Logtta_TH.get_uuid("AA20")).getCharacteristic(Logtta_TH.get_uuid("AA21"));
        const data = await c.readWait();
        return {
            temperature: (((data[0] << 8) | data[1]) / 65536) * 175.72 - 46.85,
            humidity: (((data[2] << 8) | data[3]) / 65536) * 125 - 6,
        };
    }
    async getTemperatureWait() {
        return (await this.getAllWait()).temperature;
    }
    async getHumidityWait() {
        return (await this.getAllWait()).humidity;
    }
    async startNotifyWait() {
        if (!(this._peripheral && this._peripheral.connected)) {
            return;
        }
        const c = this._peripheral.getService(Logtta_TH.get_uuid("AA20")).getCharacteristic(Logtta_TH.get_uuid("AA21"));
        await c.registerNotifyWait((data) => {
            if (this.onNotify) {
                this.onNotify({
                    temperature: (((data[0] << 8) | data[1]) / 65536) * 175.72 - 46.85,
                    humidity: (((data[2] << 8) | data[3]) / 65536) * 125 - 6,
                });
            }
        });
    }
}
exports.default = Logtta_TH;

//# sourceMappingURL=index.js.map
