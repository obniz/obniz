"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100BU
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const Button_1 = require("../MESH_js/block/Button");
/** MESH_100BU management class */
class MESH_100BU extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        /** Event Handler */
        this.onSinglePressed = null;
        this.onLongPressed = null;
        this.onDoublePressed = null;
        this.staticClass = MESH_100BU;
    }
    async getDataWait() {
        this.checkConnected();
        return {
            name: this.peripheral.localName,
            address: this.peripheral.address,
        };
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100BU.PREFIX) !== -1;
    }
    prepareConnect() {
        this.meshBlock = new Button_1.Button();
        const buttonBlock = this.meshBlock;
        buttonBlock.onSinglePressed = () => {
            if (typeof this.onSinglePressed !== 'function') {
                return;
            }
            this.onSinglePressed();
        };
        buttonBlock.onLongPressed = () => {
            if (typeof this.onLongPressed !== 'function') {
                return;
            }
            this.onLongPressed();
        };
        buttonBlock.onDoublePressed = () => {
            if (typeof this.onDoublePressed !== 'function') {
                return;
            }
            this.onDoublePressed();
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
