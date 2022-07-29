"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100LE
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MeshJsLe_1 = require("../MESH_js/MeshJsLe");
/** MESH_100TH management class */
class MESH_100LE extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        this.staticClass = MESH_100LE;
    }
    async getDataWait() {
        this.checkConnected();
        return {
            name: this.peripheral.localName,
            address: this.peripheral.address,
            battery: this.meshBlock.battery,
        };
    }
    /**
     * setLed
     *
     * @param red 0 ~ 127
     * @param green 0 ~ 127
     * @param blue 0 ~ 127
     * @param totalTime 0 ~ 65,535 [ms]
     * @param cycleOnTime 0 ~ 65,535 [ms]
     * @param cycleOffTime 0 ~ 65,535 [ms]
     * @param pattern Pattern.BLINK or Pattern.FIREFLY
     * @returns
     */
    setLed(red, green, blue, totalTime, cycleOnTime, cycleOffTime, pattern) {
        const ledBlock = this.meshBlock;
        const command = ledBlock.parseLedCommand(red, green, blue, totalTime, cycleOnTime, cycleOffTime, pattern);
        this.writeWOResponse(command);
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100LE.PREFIX) !== -1;
    }
    prepareConnect() {
        this.meshBlock = new MeshJsLe_1.MeshJsLe();
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
}
exports.default = MESH_100LE;
MESH_100LE.PartsName = 'MESH_100LE';
MESH_100LE.PREFIX = 'MESH-100LE';
MESH_100LE.Pattern = MeshJsLe_1.MeshJsLe.PATTERN;
