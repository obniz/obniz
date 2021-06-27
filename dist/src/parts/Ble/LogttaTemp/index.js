"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_TH
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../obniz/ObnizPartsBleAbstract");
const PinCodeFlag = {
    Authentication: 0x00,
    Rewrite: 0x01,
};
class Logtta_TH extends ObnizPartsBleAbstract_1.ObnizPartsBleConnectable {
    constructor() {
        super(...arguments);
        this.staticClass = Logtta_TH;
        this.authenticated = false;
    }
    static parseTemperatureData(data, func = ObnizPartsBleAbstract_1.uint) {
        return (func(data) / 0x10000) * 175.72 - 46.85;
    }
    static parseHumidityData(data, func = ObnizPartsBleAbstract_1.uint) {
        return (func(data) / 0x10000) * 125 - 6;
    }
    async beforeOnDisconnectWait() {
        this.authenticated = false;
    }
    async getDataWait() {
        this.checkConnected();
        const data = await this.readCharWait(this.getUuid('AA20'), this.getUuid('AA21'));
        return {
            temperature: Logtta_TH.parseTemperatureData(data.slice(0, 2), ObnizPartsBleAbstract_1.uintBE),
            humidity: Logtta_TH.parseHumidityData(data.slice(0, 2), ObnizPartsBleAbstract_1.uintBE),
        };
    }
    /** @deprecated */
    async getAllWait() {
        try {
            return await this.getDataWait();
        }
        catch (_a) {
            return null;
        }
    }
    async getTemperatureWait() {
        return (await this.getDataWait()).temperature;
    }
    async getHumidityWait() {
        return (await this.getDataWait()).humidity;
    }
    async startNotifyWait(callback) {
        // TODO: delete try-catch
        try {
            this.checkConnected();
        }
        catch (e) {
            console.error(e);
            return;
        }
        // TODO: delete if
        if (callback)
            this.onNotify = callback;
        return await this.subscribeWait(this.getUuid('AB20'), this.getUuid('AB21'), (data) => {
            if (this.onNotify) {
                this.onNotify({
                    temperature: Logtta_TH.parseTemperatureData(data.slice(0, 2), ObnizPartsBleAbstract_1.uintBE),
                    humidity: Logtta_TH.parseHumidityData(data.slice(0, 2), ObnizPartsBleAbstract_1.uintBE),
                });
            }
        });
    }
    async authPinCodeWait(code) {
        // TODO: delete try-catch
        try {
            this.checkConnected();
        }
        catch (e) {
            console.error(e);
            return false;
        }
        if (this.authenticated)
            return true;
        if (typeof code === 'string')
            code = parseInt(code); // TODO: delete string type
        this.authenticated = await this.sendPinCodeWait('Authentication', code);
        return this.authenticated;
    }
    async sendPinCodeWait(type, code) {
        if (code < 0 || code > 9999)
            throw new Error(`Authorization code can only be entered from 0000~9999. input: ${code}`);
        return await this.writeCharWait(this.getUuid('AA20'), this.getUuid('AA30'), [
            PinCodeFlag[type],
            Math.floor(code / 1000) % 10 | Math.floor(code / 100) % 10,
            Math.floor(code / 10) % 10 | Math.floor(code / 1) % 10,
        ]);
    }
    checkAuthenticated() {
        if (!this.authenticated)
            throw new Error('Certification is required, execute authPinCodeWait() in advance.');
    }
    /**
     * @deprecated
     * @param enable
     */
    setBeaconMode(enable) {
        return this.setBeaconModeWait(enable);
    }
    async setBeaconModeWait(enable) {
        // TODO: delete try-catch
        try {
            this.checkConnected();
            this.checkAuthenticated();
        }
        catch (e) {
            console.error(e);
            return false;
        }
        return this.writeCharWait(this.getUuid('AA20'), this.getUuid('AA2D'), [
            enable ? 1 : 0,
        ]);
    }
    getName() {
        const array = this.peripheral.adv_data.slice(16);
        return array
            .slice(0, array.indexOf(0) + 1)
            .map((d) => String.fromCharCode(d))
            .join('');
    }
    getUuid(uuid) {
        return `f7ee${uuid}-276e-4165-aa69-7e3de7fc627e`;
    }
}
exports.default = Logtta_TH;
Logtta_TH.PartsName = 'Logtta_TH';
Logtta_TH.AvailableBleMode = [
    'Connectable',
    'Beacon',
];
Logtta_TH.LocalName = {
    Connectable: /TH Sensor/,
    Beacon: /null/,
};
Logtta_TH.BeaconDataLength = 0x1b;
Logtta_TH.CompanyID = [0x10, 0x05];
Logtta_TH.BeaconDataStruct = {
    appearance: {
        index: 0,
        type: 'check',
        data: 0x01,
    },
    temperature: {
        index: 1,
        length: 2,
        type: 'custom',
        func: (data) => Logtta_TH.parseTemperatureData(data),
    },
    humidity: {
        index: 3,
        length: 2,
        type: 'custom',
        func: (data) => Logtta_TH.parseHumidityData(data),
    },
    battery: {
        index: 5,
        type: 'unsignedNumBE',
    },
    interval: {
        index: 6,
        length: 2,
        type: 'unsignedNumBE',
    },
    /* alert: {
      index: 7,
      type: 'uint8',
    },
    name: {
      index: 8,
      length: 15,
      type: 'string',
    } */
    // TODO: delete
    address: {
        index: 0,
        type: 'custom',
        func: (data, peripheral) => peripheral.address,
    },
};
