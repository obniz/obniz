"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100PA
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MESH_js_PA_1 = require("../MESH_js/MESH_js_PA");
/** MESH_100PA management class */
class MESH_100PA extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        // event handler
        this.onNotify = null;
        this.staticClass = MESH_100PA;
    }
    async getDataWait() {
        this.checkConnected();
        const _pa = this._mesh;
        return {
            localname: this.peripheral.localName,
            address: this.peripheral.address,
            battery: this._mesh.battery,
            proximity: _pa.getResponse.proximity,
            brightness: _pa.getResponse.brightness,
        };
    }
    setMode(type) {
        const _pa = this._mesh;
        this.writeWOResponse(_pa.parseSetmodeCommand(type));
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100PA._LocalName) !== -1;
    }
    prepareConnect() {
        this._mesh = new MESH_js_PA_1.MESH_js_PA();
        const _pa = this._mesh;
        _pa.onNotify = (response) => {
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
exports.default = MESH_100PA;
MESH_100PA.PartsName = 'MESH_100PA';
MESH_100PA._LocalName = 'MESH-100PA';
