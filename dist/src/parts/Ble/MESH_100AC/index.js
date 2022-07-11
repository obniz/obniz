"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100AC
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MESH_js_AC_1 = require("../MESH_js/MESH_js_AC");
/** MESH_100AC management class */
class MESH_100AC extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        // event handler
        this.onTapped = null;
        this.onShaked = null;
        this.onFlipped = null;
        this.onDirection = null;
        this.staticClass = MESH_100AC;
    }
    async getDataWait() {
        this.checkConnected();
        const _ac = this._mesh;
        return {
            localname: this.peripheral.localName,
            address: this.peripheral.address,
            battery: this._mesh.battery,
            accele_x: _ac.getAccele.x,
            accele_y: _ac.getAccele.y,
            accele_z: _ac.getAccele.z,
            face: _ac.getFace,
        };
    }
    // public setMode(event: number, mode: number, requestid = 0): void {
    //   if (!this._writeCharacteristic) {
    //     return;
    //   }
    //   const _ac = this._mesh as MESH_js_AC;
    //   this._writeCharacteristic
    //     .writeWait(_ac.parseSetmodeCommand(event, mode, requestid))
    //     .then((resp) => {
    //       console.log('response: ' + resp);
    //     });
    // }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100AC._LocalName) === 0;
    }
    prepareConnect() {
        this._mesh = new MESH_js_AC_1.MESH_js_AC();
        const _ac = this._mesh;
        _ac.onTapped = (accele) => {
            if (typeof this.onTapped !== 'function') {
                return;
            }
            this.onTapped(accele);
        };
        _ac.onShaked = (accele) => {
            if (typeof this.onShaked !== 'function') {
                return;
            }
            this.onShaked(accele);
        };
        _ac.onFlipped = (accele) => {
            if (typeof this.onFlipped !== 'function') {
                return;
            }
            this.onFlipped(accele);
        };
        _ac.onDirection = (face, accele) => {
            if (typeof this.onDirection !== 'function') {
                return;
            }
            this.onDirection(face, accele);
        };
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
}
exports.default = MESH_100AC;
MESH_100AC.PartsName = 'MESH_100AC';
MESH_100AC._LocalName = 'MESH-100AC';
