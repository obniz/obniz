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
    static isAdvDevice(peripheral) {
        if (peripheral.adv_data.length !== 31) {
            return false;
        }
        const data = peripheral.adv_data;
        if (Logtta_TH.getName(data) !== "TH Sensor") {
            return false;
        }
        return true;
    }
    static getData(peripheral) {
        if (peripheral.adv_data.length !== 31) {
            return null;
        }
        const data = peripheral.adv_data;
        if (Logtta_TH.getName(data) !== "TH Sensor") {
            return null;
        }
        const alert = data[15];
        const interval = (data[13] << 8) | data[14];
        const advData = {
            battery: data[12],
            temperature: (((data[8] << 8) | data[9]) / 65536) * 175.72 - 46.85,
            humidity: (((data[10] << 8) | data[11]) / 65536) * 125 - 6,
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
        const c = this._peripheral.getService(Logtta_TH.get_uuid("AA20")).getCharacteristic(Logtta_TH.get_uuid("AA30"));
        await c.writeWait(data);
    }
    // 有効にしたあと、切断するとビーコンが発信される
    async setBeaconMode(enable) {
        if (!(this._peripheral && this._peripheral.connected)) {
            return;
        }
        const c = this._peripheral.getService(Logtta_TH.get_uuid("AA20")).getCharacteristic(Logtta_TH.get_uuid("AA2D"));
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
exports.default = Logtta_TH;
