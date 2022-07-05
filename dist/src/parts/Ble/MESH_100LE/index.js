"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100LE
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MESH_js_1 = require("../MESH_js");
/** MESH_100TH management class */
class MESH_100LE extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        this.staticClass = MESH_100LE;
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100LE._LocalName) !== -1;
    }
    prepareConnect() {
        this._mesh = new MESH_js_1.MESH_LE();
        super.prepareConnect();
    }
    async getDataWait() {
        this.checkConnected();
        return {
            localname: this.peripheral.localName,
            address: this.peripheral.address,
            battery: this._mesh.getBattery(),
        };
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
    /**
     *
     * @param red
     * @param green
     * @param blue
     * @param time
     * @param cycle_on
     * @param cycle_off
     * @param pattern
     * @returns
     */
    lightup(red, green, blue, time, cycle_on, cycle_off, pattern) {
        if (!this._writeWOCharacteristic) {
            return;
        }
        if (this._writeWOCharacteristic === null) {
            return;
        }
        this._writeWOCharacteristic.writeWait(this._mesh.lightup(red, green, blue, time, cycle_on, cycle_off, pattern));
    }
}
exports.default = MESH_100LE;
MESH_100LE.PartsName = 'MESH_100LE';
MESH_100LE._LocalName = 'MESH-100LE';
MESH_100LE.AvailableBleMode = 'Connectable';
