"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleAdvertisementBuilder_1 = __importDefault(require("./bleAdvertisementBuilder"));
/**
 * Deprecated class.
 * Please update obnizOS >= 3.0.0 and use [[ObnizCore.Components.Ble.Hci]]
 * @category Use as Central
 */
class BleAdvertisement {
    constructor(Obniz) {
        this.Obniz = Obniz;
        this.adv_data = [];
        this.scan_resp = [];
    }
    start() {
        const obj = {};
        obj.ble = {};
        obj.ble.advertisement = {
            adv_data: this.adv_data,
        };
        if (this.scan_resp.length > 0) {
            obj.ble.advertisement.scan_resp = this.scan_resp;
        }
        this.Obniz.send(obj);
    }
    end() {
        const obj = {};
        obj.ble = {};
        obj.ble.advertisement = null;
        this.Obniz.send(obj);
    }
    setAdvDataRaw(adv_data) {
        this.adv_data = adv_data;
    }
    setAdvData(json) {
        const builder = this.advDataBulider(json);
        this.setAdvDataRaw(builder.build());
    }
    advDataBulider(jsonVal) {
        return new bleAdvertisementBuilder_1.default(this.Obniz, jsonVal);
    }
    scanRespDataBuilder(json) {
        return new bleAdvertisementBuilder_1.default(this.Obniz, json);
    }
    setScanRespDataRaw(scan_resp) {
        this.scan_resp = scan_resp;
    }
    setScanRespData(json) {
        this.setScanRespDataRaw(this.scanRespDataBuilder(json).build());
    }
}
exports.default = BleAdvertisement;

//# sourceMappingURL=bleAdvertisement.js.map
