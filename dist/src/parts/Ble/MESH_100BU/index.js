"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100BU
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MESH_js_1 = require("../MESH_js");
/** MESH_100BU management class MESH_100BUを管理するクラス */
class MESH_100BU extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        this.staticClass = MESH_100BU;
        // public readonly single = MESH_BU.type.single;
        // public readonly longpress = MESH_BU.type.long;
        // public readonly double = MESH_BU.type.double;
        /** event handler */
        // public onButtonPressed: ((press_type: number) => void) | null = null;
        this.onSinglePressed = null;
        this.onLongPressed = null;
        this.onDoublePressed = null;
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100BU._LocalName) !== -1;
    }
    prepareConnect() {
        this._mesh = new MESH_js_1.MESH_BU();
        // (this._mesh as MESH_BU).onButton = (button: number) => {
        //   if (typeof this.onButtonPressed !== 'function') {
        //     return;
        //   }
        //   this.onButtonPressed(button);
        // };
        this._mesh.onSinglePressed = () => {
            if (typeof this.onSinglePressed !== 'function') {
                return;
            }
            this.onSinglePressed();
        };
        this._mesh.onLongPressed = () => {
            if (typeof this.onLongPressed !== 'function') {
                return;
            }
            this.onLongPressed();
        };
        this._mesh.onDoublePressed = () => {
            if (typeof this.onDoublePressed !== 'function') {
                return;
            }
            this.onDoublePressed();
        };
        super.prepareConnect();
    }
    _notify(data) {
        const res = this._mesh.notify(data);
        // console.log('res : ' + res);
    }
    // 接続してデータを取ってくる
    async getDataWait() {
        this.checkConnected();
        return {
            localname: this.peripheral.localName,
            address: this.peripheral.address,
            battery: this._mesh.getBattery(),
        };
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
}
exports.default = MESH_100BU;
MESH_100BU.PartsName = 'MESH_100BU';
MESH_100BU._LocalName = 'MESH-100BU';
MESH_100BU.AvailableBleMode = 'Connectable';
