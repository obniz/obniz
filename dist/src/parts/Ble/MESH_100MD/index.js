"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100MD
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MESH_js_1 = require("../MESH_js");
/** MESH_100MD management class */
class MESH_100MD extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        this.staticClass = MESH_100MD;
    }
    static _isMESHblock(name) {
        console.log('name:' + name);
        return name.indexOf(MESH_100MD._LocalName) !== -1;
    }
    prepareConnect() {
        this._mesh = new MESH_js_1.MESH_MD();
        super.prepareConnect();
    }
    _notify(data) {
        console.log('md data: ' + data);
        this._mesh.notify(data);
        //  this.getDataWait();
    }
    async getDataWait() {
        this.checkConnected();
        return {
            localname: this.peripheral.localName,
            address: this.peripheral.address,
            battery: this._mesh.battery,
        };
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
    setMode(requestid, mode, time1, time2) {
        if (!this._writeWOCharacteristic) {
            return;
        }
        if (this._writeWOCharacteristic === null) {
            return;
        }
        this._writeWOCharacteristic.writeWait(this._mesh.setMode(requestid, mode, time1, time2));
    }
}
exports.default = MESH_100MD;
MESH_100MD.PartsName = 'MESH_100MD';
MESH_100MD._LocalName = 'MESH-100MD';
MESH_100MD.AvailableBleMode = 'Connectable';
