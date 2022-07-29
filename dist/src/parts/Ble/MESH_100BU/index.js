"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100BU
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MeshJsBu_1 = require("../MESH_js/MeshJsBu");
/** MESH_100BU management class */
class MESH_100BU extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        /** Event Handler */
        this.onSinglePressedNotify = null;
        this.onLongPressedNotify = null;
        this.onDoublePressedNotify = null;
        this.staticClass = MESH_100BU;
    }
    async getDataWait() {
        this.checkConnected();
        return {
            name: this.peripheral.localName,
            address: this.peripheral.address,
            battery: this.meshBlock.battery,
        };
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100BU.PREFIX) !== -1;
    }
    prepareConnect() {
        this.meshBlock = new MeshJsBu_1.MeshJsBu();
        const buttonBlock = this.meshBlock;
        buttonBlock.onSinglePressedNotify = () => {
            if (typeof this.onSinglePressedNotify !== 'function') {
                return;
            }
            this.onSinglePressedNotify();
        };
        buttonBlock.onLongPressedNotify = () => {
            if (typeof this.onLongPressedNotify !== 'function') {
                return;
            }
            this.onLongPressedNotify();
        };
        buttonBlock.onDoublePressedNotify = () => {
            if (typeof this.onDoublePressedNotify !== 'function') {
                return;
            }
            this.onDoublePressedNotify();
        };
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
}
exports.default = MESH_100BU;
MESH_100BU.PartsName = 'MESH_100BU';
MESH_100BU.PREFIX = 'MESH-100BU';
