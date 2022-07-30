"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100PA
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MeshJsPa_1 = require("../MESH_js/MeshJsPa");
const MeshJsError_1 = require("../MESH_js/MeshJsError");
/** MESH_100PA management class */
class MESH_100PA extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onSensorEvent = null;
        this.staticClass = MESH_100PA;
        this.proximity_ = -1;
        this.brightness_ = -1;
    }
    async getDataWait() {
        this.checkConnected();
        const brightnessBlock = this.meshBlock;
        return {
            name: this.peripheral.localName,
            address: this.peripheral.address,
        };
    }
    async getSensorDataWait() {
        this.checkConnected();
        const _requestId = this.requestId.next();
        this.setMode_(MESH_100PA.NotifyMode.ONCE, _requestId);
        const _TIMEOUT_MSEC = 1500;
        const _timeoutId = setTimeout(() => {
            throw new MeshJsError_1.MeshJsTimeOutError(MESH_100PA.PartsName);
        }, _TIMEOUT_MSEC);
        const INTERVAL_TIME = 50;
        const _result = await new Promise((resolve) => {
            const _intervalId = setInterval(() => {
                if (!this.requestId.isReceived(_requestId)) {
                    return;
                }
                clearTimeout(_timeoutId);
                clearInterval(_intervalId);
                resolve({ proximity: this.proximity_, brightness: this.brightness_ });
            }, INTERVAL_TIME);
        });
        return _result;
    }
    setMode(type) {
        this.setMode_(type, this.requestId.defaultId());
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100PA.PREFIX) !== -1;
    }
    prepareConnect() {
        this.meshBlock = new MeshJsPa_1.MeshJsPa();
        const brightnessBlock = this.meshBlock;
        brightnessBlock.onSensorEvent = (proximity, brightness, requestId) => {
            if (typeof this.onSensorEvent !== 'function') {
                return;
            }
            if (this.requestId.isDefaultId(requestId)) {
                // Emit Event
                this.onSensorEvent(proximity, brightness);
                return;
            }
            // Update Inner Values
            this.requestId.received(requestId);
            this.proximity_ = proximity;
            this.brightness_ = brightness;
        };
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
    setMode_(notifyMode, requestId) {
        const brightnessBlock = this.meshBlock;
        const command = brightnessBlock.parseSetmodeCommand(notifyMode, requestId);
        this.writeWOResponse(command);
    }
}
exports.default = MESH_100PA;
MESH_100PA.PartsName = 'MESH_100PA';
MESH_100PA.PREFIX = 'MESH-100PA';
MESH_100PA.NotifyMode = MeshJsPa_1.MeshJsPa.NotifyMode;
