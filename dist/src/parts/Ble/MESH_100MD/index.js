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
        this.onSensorEvent = null;
        this.staticClass = MESH_100MD;
    }
    async getDataWait() {
        this.checkConnected();
        const motionBlock = this.meshBlock;
        return {
            name: this.peripheral.localName,
            address: this.peripheral.address,
        };
    }
    setMode(detectionMode, opt_detectionTime = 500, opt_responseTime = 500, opt_requestId = 0) {
        const motionBlock = this.meshBlock;
        const command = motionBlock.parseSetmodeCommand(detectionMode, opt_detectionTime, opt_responseTime, opt_requestId);
        this.writeWOResponse(command);
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100MD.PREFIX) !== -1;
    }
    prepareConnect() {
        this.meshBlock = new MeshJsMd_1.MeshJsMd();
        // set Event handler
        const motionBlock = this.meshBlock;
        motionBlock.onSensorEvent = (motionState, detectionMode, requestId) => {
            if (typeof this.onSensorEvent !== 'function') {
                return;
            }
            this.onSensorEvent(motionState, detectionMode);
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
