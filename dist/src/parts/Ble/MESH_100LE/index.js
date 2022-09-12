"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100LE
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const LED_1 = require("../utils/abstracts/MESHjs/block/LED");
/** MESH_100TH management class */
class MESH_100LE extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        this.colors = { red: 0, green: 0, blue: 0 };
        this.staticClass = MESH_100LE;
    }
    /**
     * Check MESH block
     *
     * @param peripheral
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(peripheral, opt_serialnumber = '') {
        return LED_1.LED.isMESHblock(peripheral.localName, opt_serialnumber);
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
    /**
     * setLed
     *
     * @param colors { red: 0-127, green: 0-127, blue: 0-127 }
     * @param totalTime 0-65,535 [ms]
     * @param cycleOnTime 0-65,535 [ms]
     * @param cycleOffTime 0-65,535 [ms]
     * @param pattern Pattern.BLINK or Pattern.FIREFLY
     * @returns void
     */
    setLed(colors, totalTime, cycleOnTime, cycleOffTime, pattern) {
        const ledBlock = this.meshBlock;
        const command = ledBlock.createLedCommand(colors, totalTime, cycleOnTime, cycleOffTime, pattern);
        this.writeWOResponse(command);
    }
    prepareConnect() {
        this.meshBlock = new LED_1.LED();
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
}
exports.default = MESH_100LE;
MESH_100LE.PartsName = 'MESH_100LE';
MESH_100LE.LocalName = /^MESH-100LE/;
MESH_100LE.Pattern = LED_1.LED.PATTERN;
