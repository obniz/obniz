"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100BU
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const Button_1 = require("../utils/abstracts/MESHjs/block/Button");
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
    /**
     * Check MESH block
     *
     * @param peripheral
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(peripheral, opt_serialnumber = '') {
        return Button_1.Button.isMESHblock(peripheral.localName, opt_serialnumber);
    }
    /**
     * getDataWait
     *
     * @returns
     */
    async getDataWait() {
        this.checkConnected();
        return {
            name: this.peripheral.localName,
            address: this.peripheral.address,
        };
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
MESH_100BU.LocalName = /^MESH-100BU/;
