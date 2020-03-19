"use strict";
/**
 * @packageDocumentation
 * @module Parts.uPRISM
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class acr1255 {
    constructor() {
        this.readIndex = -1;
        this.target = {
            localNamePrefix: "uPrism_",
        };
        this.masterKey = [
            0x41,
            0x43,
            0x52,
            0x31,
            0x32,
            0x35,
            0x35,
            0x55,
            0x2d,
            0x4a,
            0x31,
            0x20,
            0x41,
            0x75,
            0x74,
            0x68,
        ];
        this.keys = [];
        this.requiredKeys = [];
        this.periperal = null;
    }
    static info() {
        return {
            name: "acr1255",
        };
    }
    static signed16FromBinary(val1, val2) {
        let val = val1 + val2 * 256;
        if ((val & 0x8000) !== 0) {
            val = val - 0x10000;
        }
        return val;
    }
    wired(obniz) {
        this.obniz = obniz;
        this.encrypt([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16]);
        this.decrypt([0x0c, 0xbe, 0xab, 0xf1, 0xa2, 0x0f, 0x07, 0xfb, 0x26, 0x74, 0x20, 0xc7, 0xda, 0xc6, 0xab, 0x8b]);
    }
    async findWait() {
        await this.obniz.ble.initWait();
        this.periperal = await this.obniz.ble.scan.startOneWait(this.target);
        return this.periperal;
    }
    async findListWait() {
        await this.obniz.ble.initWait();
        return await this.obniz.ble.scan.startAllWait(this.target);
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
            throw new Error("uPrism not found");
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
    async startNotifyWait() {
        if (!(await this.connectWait())) {
            return;
        }
        const rc = this.periperal.getService("a587905b-ac98-4cb1-8b1d-5e22ae747d17").getCharacteristic("51bc99bd-b22e-4ff5-807e-b641d21af060");
        await rc.writeWait([0x04, 0x03, 0x01]);
        const c = this.periperal.getService("a587905b-ac98-4cb1-8b1d-5e22ae747d17").getCharacteristic("0d6fcf18-d935-49d1-836d-384c7b857b83");
        await c.registerNotifyWait((data) => { });
    }
    async stopNotifyWait() {
        if (!(await this.connectWait())) {
            return;
        }
        const rc = this.periperal.getService("a587905b-ac98-4cb1-8b1d-5e22ae747d17").getCharacteristic("51bc99bd-b22e-4ff5-807e-b641d21af060");
        await rc.writeWait([0x04, 0x03, 0x00]);
        const c = this.periperal.getService("a587905b-ac98-4cb1-8b1d-5e22ae747d17").getCharacteristic("0d6fcf18-d935-49d1-836d-384c7b857b83");
        await c.unregisterNotifyWait();
    }
    encrypt(data) {
        // @ts-ignore
        const c = crypto_1.default.createCipher("aes-128-cbc", new Buffer(this.masterKey));
        // @ts-ignore
        c.update(new Buffer(data), "binary", "hex");
        const t = c.final("hex");
        console.log(`encrypt ${t}`);
        // 0cbeabf1a20f07fb267420c7dac6ab8b
    }
    decrypt(data) {
        // @ts-ignore
        const d = crypto_1.default.createDecipher("aes-128-cbc", new Buffer(this.masterKey));
        // @ts-ignore
        // d.update(new Buffer(data), "binary", "hex");
        d.update("0cbeabf1a20f07fb267420c7dac6ab8b", "hex", "hex");
        const t = d.final("hex");
        console.log(`decrypt ${t}`);
        // 0cbeabf1a20f07fb267420c7dac6ab8b
    }
}
exports.default = acr1255;

//# sourceMappingURL=index.js.map
