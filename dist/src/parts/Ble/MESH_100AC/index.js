"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100AC
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MESH_js_1 = require("../MESH_js");
/** MESH_100AC management class */
class MESH_100AC extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        this.staticClass = MESH_100AC;
        this.onTapped = null;
        this.onShaked = null;
        this.onFlipped = null;
        this.onDirection = null;
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100AC._LocalName) !== -1;
    }
    prepareConnect() {
        this._mesh = new MESH_js_1.MESH_AC();
        this._mesh.onTapped = (accele) => {
            if (typeof this.onTapped !== 'function') {
                return;
            }
            this.onTapped(accele);
        };
        this._mesh.onShaked = (accele) => {
            if (typeof this.onShaked !== 'function') {
                return;
            }
            this.onShaked(accele);
        };
        this._mesh.onFlipped = (accele) => {
            if (typeof this.onFlipped !== 'function') {
                return;
            }
            this.onFlipped(accele);
        };
        this._mesh.onDirection = (face, accele) => {
            if (typeof this.onDirection !== 'function') {
                return;
            }
            this.onDirection(face, accele);
        };
        super.prepareConnect();
    }
    _notify(data) {
        this._mesh.notify(data);
        //  this.getDataWait();
    }
    async getDataWait() {
        this.checkConnected();
        this._mesh.printData();
        return {
            localname: this.peripheral.localName,
            address: this.peripheral.address,
            battery: this._mesh.getBattery(),
            accele_x: this._mesh.getAccele().x,
            accele_y: this._mesh.getAccele().y,
            accele_z: this._mesh.getAccele().z,
            face: this._mesh.getFace(),
        };
    }
    async writeTestWait() {
        var _a;
        await ((_a = this._writeWOCharacteristic) === null || _a === void 0 ? void 0 : _a.writeWait([1, 1, 15, 0, 2, 19]));
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
}
exports.default = MESH_100AC;
MESH_100AC.PartsName = 'MESH_100AC';
MESH_100AC._LocalName = 'MESH-100AC';
MESH_100AC.AvailableBleMode = 'Connectable';
