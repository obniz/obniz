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
class Logtta_CO2 extends ObnizPartsBleInterface_1.ObnizPartsBle {
    constructor() {
        super(...arguments);
        this.static = Logtta_CO2;
    }
    /**
     * not used
     *
     * @returns name
     */
    getName() {
        const data = this.peripheral.adv_data.slice(16, this.peripheral.adv_data.slice(16).indexOf(0) + 16);
        return data.map((d) => String.fromCharCode(d)).join('');
    }
    static getUuid(uuid) {
        return `31f3${uuid}-bd1c-46b1-91e4-f57abcf7d449`;
    }
    async connectWait() {
        if (!this.peripheral.connected) {
            await this.peripheral.connectWait();
        }
        const service1800 = this.peripheral.getService('1800');
        if (service1800) {
            this.genericAccess = new genericAccess_1.default(service1800);
        }
        const service180F = this.peripheral.getService('180F');
        if (service180F) {
            this.batteryService = new batteryService_1.default(service180F);
        }
    }
    async disconnectWait() {
        if (!this.peripheral.connected) {
            return;
        }
        await this.peripheral.disconnectWait();
    }
    async getWait() {
        if (!this.peripheral.connected) {
            return null;
        }
        const data = await this.readCharWait(Logtta_CO2.getUuid('AB20'), Logtta_CO2.getUuid('AB21'));
        return data ? ObnizPartsBleInterface_1.uint16BE(data) : null;
    }
    async startNotifyWait(callback) {
        if (!this.peripheral.connected) {
            return false;
        }
        // TODO: delete if
        if (callback)
            this.onNotify = callback;
        return await this.subscribeWait(Logtta_CO2.getUuid('AB20'), Logtta_CO2.getUuid('AB21'), (data) => {
            if (this.onNotify) {
                this.onNotify(ObnizPartsBleInterface_1.uint16BE(data));
            }
        });
    }
    async authPinCodeWait(code) {
        if (!this.peripheral.connected) {
            return false;
        }
        if (code.length !== 4) {
            throw new Error('Invalid length auth code');
        }
        const data = [0]; // TODO: number[]?
        for (let i = 0; i < code.length; i += 2) {
            data.push((this.checkNumber(code.charAt(i)) << 4) |
                this.checkNumber(code.charAt(i + 1)));
        }
        return this.writeCharWait(Logtta_CO2.getUuid('AB20'), Logtta_CO2.getUuid('AB30'), data);
    }
    /**
     * @deprecated
     * @param enable
     */
    setBeaconMode(enable) {
        return this.setBeaconModeWait(enable);
    }
    async setBeaconModeWait(enable) {
        if (!this.peripheral.connected) {
            return false;
        }
        return this.writeCharWait(Logtta_CO2.getUuid('AB20'), Logtta_CO2.getUuid('AB2D'), [enable ? 1 : 0]);
    }
    checkNumber(data) {
        if (data >= '0' && data <= '9') {
            return parseInt(data, 10);
        }
        else {
            throw new Error(`authorization code can only be entered from 0-9.input word : ${data}`);
        }
    }
    /**
     * @deprecated
     */
    static getData(peripheral) {
        if (this.getDeviceMode(peripheral) !== 'Beacon') {
            return null;
        }
        const dev = new this(peripheral, 'Beacon');
        return dev.getData();
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
Logtta_CO2.CompanyID = {
    Connectable: null,
    Beacon: [0x10, 0x05],
};
Logtta_CO2.BeaconDataStruct = {
    Connectable: null,
    Beacon: {
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
    },
};
