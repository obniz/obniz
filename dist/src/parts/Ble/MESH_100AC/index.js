"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100AC
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MeshJsAc_1 = require("../MESH_js/MeshJsAc");
/** MESH_100AC management class */
class MESH_100AC extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onTapped = null;
        this.onShaked = null;
        this.onFlipped = null;
        this.onOrientation = null;
        this.staticClass = MESH_100AC;
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
        return name.indexOf(MESH_100AC.PREFIX) === 0;
    }
    prepareConnect() {
        this.meshBlock = new MeshJsAc_1.MeshJsAc();
        const moveBlock = this.meshBlock;
        moveBlock.onTapped = (acceleX, acceleY, acceleZ) => {
            if (typeof this.onTapped !== 'function') {
                return;
            }
            this.onTapped(acceleX, acceleY, acceleZ);
        };
        moveBlock.onShaked = (acceleX, acceleY, acceleZ) => {
            if (typeof this.onShaked !== 'function') {
                return;
            }
            this.onShaked(acceleX, acceleY, acceleZ);
        };
        moveBlock.onFlipped = (acceleX, acceleY, acceleZ) => {
            if (typeof this.onFlipped !== 'function') {
                return;
            }
            this.onFlipped(acceleX, acceleY, acceleZ);
        };
        moveBlock.onOrientation = (face, acceleX, acceleY, acceleZ) => {
            if (typeof this.onOrientation !== 'function') {
                return;
            }
            this.onOrientation(face, acceleX, acceleY, acceleZ);
        };
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
}
exports.default = MESH_100AC;
MESH_100AC.PartsName = 'MESH_100AC';
MESH_100AC.PREFIX = 'MESH-100AC';
