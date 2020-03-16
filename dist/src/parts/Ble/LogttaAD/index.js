"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_AD
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Logtta_AD {
    constructor() {
        this.keys = [];
        this.requiredKeys = [];
        this.periperal = null;
    }
    static info() {
        return {
            name: "Logtta_AD",
        };
    }
    static get_uuid(uuid) {
        return `4e43${uuid}-6687-4f3c-a1c3-1c327583f29d`;
    }
    wired(obniz) {
        this.obniz = obniz;
    }
    async findWait() {
        const target = {
            localName: "Analog",
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
            throw new Error("Logtta AD not found");
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
            return { ampere: -1, volt: -1, count: -1 };
        }
        const c = this.periperal.getService(Logtta_AD.get_uuid("AE20")).getCharacteristic(Logtta_AD.get_uuid("AE21"));
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
        if (!(await this.connectWait())) {
            return;
        }
        const c = this.periperal.getService(Logtta_AD.get_uuid("AE20")).getCharacteristic(Logtta_AD.get_uuid("AE21"));
        await c.registerNotifyWait((data) => {
            if (this.onNotify) {
                this.onNotify({
                    ampere: (((data[0] << 8) | data[1]) * 916) / 16,
                    volt: (((data[0] << 8) | data[1]) * 916) / 4,
                    count: (data[2] << 8) | data[3],
                });
            }
        });
    }
}
exports.default = Logtta_AD;

//# sourceMappingURL=index.js.map
