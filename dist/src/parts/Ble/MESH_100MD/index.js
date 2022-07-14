"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100MD
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MESH_js_MD_1 = require("../MESH_js/MESH_js_MD");
/** MESH_100MD management class */
class MESH_100MD extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        // event handler
        this.onNotify = null;
        this.staticClass = MESH_100MD;
    }
    async getDataWait() {
        this.checkConnected();
        const _md = this._mesh;
        return {
            name: this.peripheral.localName,
            address: this.peripheral.address,
            battery: this._mesh.battery,
            motion_state: _md.getResponse.motion_state,
            detection_mode: _md.getResponse.detection_mode,
            request_id: _md.getResponse.requestId,
        };
    }
    setMode(detection_mode, detection_time = 500, response_time = 500, requestid = 0) {
        const _md = this._mesh;
        this.writeWOResponse(_md.parseSetmodeCommand(detection_mode, detection_time, response_time, requestid));
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100MD._LocalName) !== -1;
    }
    prepareConnect() {
        this._mesh = new MESH_js_MD_1.MESH_js_MD();
        // set Event handler
        const _md = this._mesh;
        _md.onNotify = (response) => {
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
exports.default = MESH_100MD;
MESH_100MD.PartsName = 'MESH_100MD';
MESH_100MD._LocalName = 'MESH-100MD';
