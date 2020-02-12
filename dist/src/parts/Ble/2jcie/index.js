"use strict";
/**
 * @packageDocumentation
 * @module Parts.OMRON_2JCIE
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class OMRON_2JCIE {
    constructor() {
        this.keys = [];
        this.requiredKeys = [];
        this.periperal = null;
    }
    static info() {
        return {
            name: "2JCIE",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
    }
    findWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const target = {
                localName: "Env",
            };
            this.periperal = yield this.obniz.ble.scan.startOneWait(target);
            return this.periperal;
        });
    }
    omron_uuid(uuid) {
        return `0C4C${uuid}-7700-46F4-AA96D5E974E32A54`;
    }
    connectWait() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.periperal) {
                yield this.findWait();
            }
            if (!this.periperal) {
                throw new Error("2JCIE not found");
            }
            if (!this.periperal.connected) {
                yield this.periperal.connectWait();
            }
        });
    }
    disconnectWait() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.periperal && this.periperal.connected) {
                this.periperal.disconnectWait();
            }
        });
    }
    signedNumberFromBinary(data) {
        // little adian
        let val = data[data.length - 1] & 0x7f;
        for (let i = data.length - 2; i >= 0; i--) {
            val = val * 256 + data[i];
        }
        if ((data[data.length - 1] & 0x80) !== 0) {
            val = val - Math.pow(2, data.length * 8 - 1);
        }
        return val;
    }
    unsignedNumberFromBinary(data) {
        // little adian
        let val = data[data.length - 1];
        for (let i = data.length - 2; i >= 0; i--) {
            val = val * 256 + data[i];
        }
        return val;
    }
    getLatestData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectWait();
            const c = this.periperal
                .getService(this.omron_uuid("3000"))
                .getCharacteristic(this.omron_uuid("3001"));
            const data = yield c.readWait();
            const json = {
                row_number: data[0],
                temperature: this.signedNumberFromBinary(data.slice(1, 3)) * 0.01,
                relative_humidity: this.signedNumberFromBinary(data.slice(3, 5)) * 0.01,
                light: this.signedNumberFromBinary(data.slice(5, 7)) * 1,
                uv_index: this.signedNumberFromBinary(data.slice(7, 9)) * 0.01,
                barometric_pressure: this.signedNumberFromBinary(data.slice(9, 11)) * 0.1,
                soud_noise: this.signedNumberFromBinary(data.slice(11, 13)) * 0.01,
                discomfort_index: this.signedNumberFromBinary(data.slice(13, 15)) * 0.01,
                heatstroke_risk_factor: this.signedNumberFromBinary(data.slice(15, 17)) * 0.01,
                battery_voltage: this.unsignedNumberFromBinary(data.slice(17, 19)) * 0.001,
            };
            return json;
        });
    }
}
exports.default = OMRON_2JCIE;

//# sourceMappingURL=index.js.map
