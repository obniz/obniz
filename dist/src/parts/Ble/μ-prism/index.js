"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_TH
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Logtta_TH {
    constructor() {
        this.keys = [];
        this.requiredKeys = [];
        this.periperal = null;
    }
    static info() {
        return {
            name: "Logtta_TH",
        };
    }
    static get_uuid(uuid) {
        return `f7ee${uuid}-276e-4165-aa69-7e3de7fc627e`;
    }
    wired(obniz) {
        this.obniz = obniz;
    }
    async findWait() {
        const target = {
            localName: "uPrism",
        };
        await this.obniz.ble.initWait();
        this.periperal = await this.obniz.ble.scan.startOneWait(target);
        return this.periperal;
    }
    async findListWait() {
        const target = {
            localName: "uPrism",
        };
        await this.obniz.ble.initWait();
        return await this.obniz.ble.scan.startAllWait(target);
    }
    async directConnectWait(address) {
        try {
            this.periperal = await this.obniz.ble.scan.directConnectWait(address, "public");
        }
        catch (e) {
            return false;
        }
        return true;
    }
    async connectWait() {
        if (!this.periperal) {
            await this.findWait();
        }
        if (!this.periperal) {
            throw new Error("Logtta TH not found");
        }
        if (!this.periperal.connected) {
            try {
                await this.periperal.connectWait();
            }
            catch (e) {
                return false;
            }
        }
        return true;
    }
    async disconnectWait() {
        if (this.periperal && this.periperal.connected) {
            await this.periperal.disconnectWait();
        }
    }
    async getAllWait() {
        if (!(await this.connectWait())) {
            return { temperature: -1, humidity: -1 };
        }
        const c = this.periperal.getService(Logtta_TH.get_uuid("AA20")).getCharacteristic(Logtta_TH.get_uuid("AA21"));
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
        if (!(await this.connectWait())) {
            return;
        }
        const c = this.periperal.getService("a587905b-ac98-4cb1-8b1d-5e22ae747d17").getCharacteristic("0d6fcf18-d935-49d1-836d-384c7b857b83");
        await c.registerNotifyWait((data) => {
            if (this.onNotify) {
                console.log("data arrive", data);
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
