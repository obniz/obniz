"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MESH_js_1 = require("../MESH_js");
/** MESH_100TH management class */
class MESH_100TH extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        this.staticClass = MESH_100TH;
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100TH._LocalName) !== -1;
    }
    prepareConnect() {
        this._mesh = new MESH_js_1.MESH_TH();
        super.prepareConnect();
    }
    _notify(data) {
        console.log('th data: ' + data);
        this._mesh.notify(data);
    }
    async getDataWait() {
        this.checkConnected();
        return {
            battery: 0,
            temperature: 0,
            humidity: 0,
        };
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
    setMode(temperature_upper, temperature_bottom, temperature_condition, humidity_upper, humidity_bottom, humidity_condision, type) {
        if (!this._writeWOCharacteristic) {
            return;
        }
        if (this._writeWOCharacteristic === null) {
            return;
        }
        this._writeWOCharacteristic.writeWait(this._mesh.setMode(temperature_upper, temperature_bottom, humidity_upper, humidity_bottom, temperature_condition, humidity_condision, type));
    }
}
exports.default = MESH_100TH;
MESH_100TH.PartsName = 'MESH_100TH';
MESH_100TH._LocalName = 'MESH-100TH';
MESH_100TH.AvailableBleMode = 'Connectable';
