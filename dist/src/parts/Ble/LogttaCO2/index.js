"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Logtta_CO2 {
    constructor() {
        this.keys = [];
        this.requiredKeys = [];
        this.periperal = null;
    }
    static info() {
        return {
            name: "Logtta_CO2",
        };
    }
    static get_uuid(uuid) {
        return `31f3${uuid}-bd1c-46b1-91e4-f57abcf7d449`;
    }
    wired(obniz) {
        this.obniz = obniz;
    }
    async findWait() {
        const target = {
            localName: "CO2 Sensor",
        };
        await this.obniz.ble.initWait();
        this.periperal = await this.obniz.ble.scan.startOneWait(target);
        return this.periperal;
    }
    async findListWait() {
        const target = {
            localName: "TH Sensor",
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
            throw new Error("Logtta CO2 not found");
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
    async getWait() {
        if (!(await this.connectWait())) {
            return -1;
        }
        const c = this.periperal.getService(Logtta_CO2.get_uuid("AB20")).getCharacteristic(Logtta_CO2.get_uuid("AB21"));
        const data = await c.readWait();
        return data[0] * 256 + data[1];
    }
    async startNotifyWait() {
        if (!(await this.connectWait())) {
            return;
        }
        const c = this.periperal.getService(Logtta_CO2.get_uuid("AB20")).getCharacteristic(Logtta_CO2.get_uuid("AB21"));
        await c.registerNotifyWait((data) => {
            if (this.onNotify) {
                this.onNotify(data[0] * 256 + data[1]);
            }
        });
    }
}
exports.default = Logtta_CO2;

//# sourceMappingURL=index.js.map
