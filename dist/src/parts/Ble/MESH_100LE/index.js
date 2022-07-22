"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100LE
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MeshJsLe_1 = require("../MESH_js/MeshJsLe");
/** MESH_100TH management class */
class MESH_100LE extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        this.staticClass = MESH_100LE;
    }
    async getDataWait() {
        this.checkConnected();
        return {
            name: this.peripheral.localName,
            address: this.peripheral.address,
            battery: this._mesh.battery,
        };
    }
    /**
     * Light Up
     *
     * @param red 0 ~ 127
     * @param green 0 ~ 127
     * @param blue 0 ~ 127
     * @param time 0 ~ 65535 [ms]
     * @param cycle_on 0 ~ 65535 [ms]
     * @param cycle_off 0 ~ 65535 [ms]
     * @param pattern Pattern.Blink or Pattern.Soft
     * @returns
     */
    lightup(red, green, blue, time, cycle_on, cycle_off, pattern) {
        const _le = this._mesh;
        this.writeWOResponse(_le.parseLightupCommand(red, green, blue, time, cycle_on, cycle_off, pattern));
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100LE._LocalName) !== -1;
    }
    prepareConnect() {
        this._mesh = new MeshJsLe_1.MeshJsLe();
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
}
exports.default = MESH_100LE;
MESH_100LE.PartsName = 'MESH_100LE';
MESH_100LE._LocalName = 'MESH-100LE';
MESH_100LE.Pattern = MeshJsLe_1.MeshJsLe.Pattern;
