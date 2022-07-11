"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MESH_js_TH_1 = require("../MESH_js/MESH_js_TH");
/** MESH_100TH management class */
class MESH_100TH extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        this.onNotify = null;
        this.staticClass = MESH_100TH;
    }
    async getDataWait() {
        this.checkConnected();
        const _th = this._mesh;
        return {
            localname: this.peripheral.localName,
            address: this.peripheral.address,
            battery: this._mesh.battery,
            temperature: _th.getResponse.temperature,
            humidity: _th.getResponse.humidity,
        };
    }
    setMode(temperature_upper, temperature_bottom, temperature_condition, humidity_upper, humidity_bottom, humidity_condision, type) {
        const _th = this._mesh;
        this.writeWOResponse(_th.parseSetmodeCommand(temperature_upper, temperature_bottom, humidity_upper, humidity_bottom, temperature_condition, humidity_condision, type));
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100TH._LocalName) !== -1;
    }
    prepareConnect() {
        this._mesh = new MESH_js_TH_1.MESH_js_TH();
        const _th = this._mesh;
        _th.onNotify = (response) => {
            if (typeof this.onNotify !== 'function') {
                return;
            }
            this.onNotify(response);
        };
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
}
exports.default = MESH_100TH;
MESH_100TH.PartsName = 'MESH_100TH';
MESH_100TH._LocalName = 'MESH-100TH';
