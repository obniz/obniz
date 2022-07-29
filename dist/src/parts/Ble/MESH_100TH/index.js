"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MeshJsTh_1 = require("../MESH_js/MeshJsTh");
/** MESH_100TH management class */
class MESH_100TH extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onNotify = null;
        this.staticClass = MESH_100TH;
    }
    async getDataWait() {
        this.checkConnected();
        const _th = this.meshBlock;
        return {
            name: this.peripheral.localName,
            address: this.peripheral.address,
            battery: this.meshBlock.battery,
            temperature: _th.getResponse.temperature,
            humidity: _th.getResponse.humidity,
        };
    }
    setMode(temperatureUpper, temperatureBottom, temperatureCondition, humidityUpper, humidityBottom, humidityCondision, type, opt_requestId = 0) {
        const temperatureAndHumidityBlock = this.meshBlock;
        const command = temperatureAndHumidityBlock.parseSetmodeCommand(temperatureUpper, temperatureBottom, humidityUpper, humidityBottom, temperatureCondition, humidityCondision, type, opt_requestId);
        this.writeWOResponse(command);
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100TH.PREFIX) !== -1;
    }
    prepareConnect() {
        this.meshBlock = new MeshJsTh_1.MeshJsTh();
        const temperatureAndHumidityBlock = this.meshBlock;
        temperatureAndHumidityBlock.onNotify = (response) => {
            if (typeof this.onNotify !== 'function') {
                return;
            }
            this.onNotify(response);
        };
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
}
exports.default = MESH_100TH;
MESH_100TH.PartsName = 'MESH_100TH';
MESH_100TH.PREFIX = 'MESH-100TH';
MESH_100TH.NotifyType = MeshJsTh_1.MeshJsTh.NOTIFY_TYPE;
