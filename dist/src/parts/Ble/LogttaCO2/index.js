"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = require("../../../obniz/ObnizPartsBleInterface");
const batteryService_1 = __importDefault(require("../utils/services/batteryService"));
const genericAccess_1 = __importDefault(require("../utils/services/genericAccess"));
const PinCodeFlag = {
    Authentication: 0x00,
    Rewrite: 0x01,
};
class Logtta_CO2 extends ObnizPartsBleInterface_1.ObnizPartsBleConnectable {
    constructor() {
        super(...arguments);
        this.static = Logtta_CO2;
        this.authenticated = false;
    }
    async connectWait(keys) {
        await super.connectWait(keys);
        const service1800 = this.peripheral.getService('1800');
        if (service1800) {
            this.genericAccess = new genericAccess_1.default(service1800);
        }
        const service180F = this.peripheral.getService('180F');
        if (service180F) {
            this.batteryService = new batteryService_1.default(service180F);
        }
    }
    async beforeOnDisconnectWait() {
        this.authenticated = false;
        this.genericAccess = undefined;
        this.batteryService = undefined;
    }
    async getDataWait() {
        this.checkConnected();
        const data = await this.readCharWait(this.getUuid('AB20'), this.getUuid('AB21'));
        return ObnizPartsBleInterface_1.uintBE(data);
    }
    /** @deprecated */
    async getWait() {
        try {
            return await this.getDataWait();
        }
        catch (_a) {
            return null;
        }
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
                this.onNotify(ObnizPartsBleInterface_1.uintBE(data));
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
    async changeAuthPinCodeWait(code) {
        this.checkConnected();
        this.checkAuthenticated();
        return await this.sendPinCodeWait('Rewrite', code);
    }
    async sendPinCodeWait(type, code) {
        if (code < 0 || code > 9999)
            throw new Error(`Authorization code can only be entered from 0000~9999. input: ${code}`);
        return await this.writeCharWait(this.getUuid('AB20'), this.getUuid('AB30'), [
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
        return this.writeCharWait(this.getUuid('AB20'), this.getUuid('AB2D'), [
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
        return `31f3${uuid}-bd1c-46b1-91e4-f57abcf7d449`;
    }
}
exports.default = Logtta_CO2;
Logtta_CO2.PartsName = 'Logtta_CO2';
Logtta_CO2.AvailableBleMode = [
    'Connectable',
    'Beacon',
];
Logtta_CO2.LocalName = {
    Connectable: /CO2 Sensor/,
    Beacon: /null/,
};
Logtta_CO2.BeaconDataLength = 0x1b;
Logtta_CO2.CompanyID = [0x10, 0x05];
Logtta_CO2.BeaconDataStruct = {
    appearance: {
        index: 0,
        type: 'check',
        data: 0x02,
    },
    co2: {
        index: 1,
        length: 2,
        type: 'unsignedNumBE',
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
      index: 8,
      type: 'uint8',
    },
    name: {
      index: 9,
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
