"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100PA
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MeshJsPa_1 = require("../MESH_js/MeshJsPa");
/** MESH_100PA management class */
class MESH_100PA extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onSensorEvent = null;
        this.staticClass = MESH_100PA;
    }
    async getDataWait() {
        this.checkConnected();
        const brightnessBlock = this.meshBlock;
        return {
            name: this.peripheral.localName,
            address: this.peripheral.address,
        };
    }
    setMode(type, opt_requestId = 0) {
        const brightnessBlock = this.meshBlock;
        const command = brightnessBlock.parseSetmodeCommand(type, opt_requestId);
        this.writeWOResponse(command);
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100PA.PREFIX) !== -1;
    }
    prepareConnect() {
        this.meshBlock = new MeshJsPa_1.MeshJsPa();
        const brightnessBlock = this.meshBlock;
        brightnessBlock.onSensorEvent = (proximity, brightness, requestId) => {
            if (typeof this.onSensorEvent !== 'function') {
                return;
            }
            this.onSensorEvent(proximity, brightness);
        };
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
}
exports.default = MESH_100PA;
MESH_100PA.PartsName = 'MESH_100PA';
MESH_100PA.PREFIX = 'MESH-100PA';
MESH_100PA.NotifyType = MeshJsPa_1.MeshJsPa.NOTIFY_TYPE;
