"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100AC
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const Move_1 = require("../utils/abstracts/MESHjs/block/Move");
/** MESH_100AC management class */
class MESH_100AC extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        this.accele = { x: 0, y: 0, z: 0 };
        // Event Handler
        this.onTapped = null;
        this.onShaked = null;
        this.onFlipped = null;
        this.onOrientationChanged = null;
        this.staticClass = MESH_100AC;
    }
    /**
     * Check MESH block
     *
     * @param peripheral
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(peripheral, opt_serialnumber = '') {
        return Move_1.Move.isMESHblock(peripheral.localName, opt_serialnumber);
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
        this.meshBlock = new Move_1.Move();
        const moveBlock = this.meshBlock;
        moveBlock.onTapped = (accele) => {
            if (typeof this.onTapped !== 'function') {
                return;
            }
            this.onTapped(accele);
        };
        moveBlock.onShaked = (accele) => {
            if (typeof this.onShaked !== 'function') {
                return;
            }
            this.onShaked(accele);
        };
        moveBlock.onFlipped = (accele) => {
            if (typeof this.onFlipped !== 'function') {
                return;
            }
            this.onFlipped(accele);
        };
        moveBlock.onOrientationChanged = (face, accele) => {
            if (typeof this.onOrientationChanged !== 'function') {
                return;
            }
            this.onOrientationChanged(face, accele);
        };
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
}
exports.default = MESH_100AC;
MESH_100AC.PartsName = 'MESH_100AC';
MESH_100AC.LocalName = /^MESH-100AC/;
