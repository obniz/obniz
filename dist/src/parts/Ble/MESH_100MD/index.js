"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100MD
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MeshJsMd_1 = require("../MESH_js/MeshJsMd");
/** MESH_100MD management class */
class MESH_100MD extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        // Event Handler
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
            motion_state: _md.getResponse.motionState,
            detection_mode: _md.getResponse.detectionMode,
            request_id: _md.getResponse.requestId,
        };
    }
    setMode(detection_mode, opt_detection_time = 500, opt_response_time = 500, opt_requestid = 0) {
        const _md = this._mesh;
        this.writeWOResponse(_md.parseSetmodeCommand(detection_mode, opt_detection_time, opt_response_time, opt_requestid));
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100MD.PREFIX) !== -1;
    }
    prepareConnect() {
        this._mesh = new MeshJsMd_1.MeshJsMd();
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
MESH_100MD.PREFIX = 'MESH-100MD';
