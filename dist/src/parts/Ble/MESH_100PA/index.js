"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100PA
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MESH_js_1 = require("../MESH_js");
/** MESH_100PA management class */
class MESH_100PA extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        this.staticClass = MESH_100PA;
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100PA._LocalName) !== -1;
    }
    prepareConnect() {
        this._mesh = new MESH_js_1.MESH_PA();
        super.prepareConnect();
    }
    _notify(data) {
        // console.log('data : ' + data);
        const res = this._mesh.notify(data);
        // console.log('res: ' + res);
        //  this.getDataWait();
    }
    async getDataWait() {
        this.checkConnected();
        return {
            battery: this._mesh.getBattery(),
        };
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
}
exports.default = MESH_100PA;
MESH_100PA.PartsName = 'MESH_100PA';
MESH_100PA._LocalName = 'MESH-100PA';
MESH_100PA.AvailableBleMode = 'Connectable';
