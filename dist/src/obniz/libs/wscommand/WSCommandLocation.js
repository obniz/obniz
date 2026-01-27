"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSCommandLocation = void 0;
/**
 * @packageDocumentation
 * @ignore
 */
const WSCommandAbstract_1 = require("./WSCommandAbstract");
class WSCommandLocation extends WSCommandAbstract_1.WSCommandAbstract {
    constructor() {
        super(...arguments);
        this.module = 20;
        this._CommandInit = 0;
        this._CommandDeinit = 1;
        this._CommandNotify = 2;
    }
    // Commands
    init(params) {
        const buf = new Uint8Array(0);
        this.sendCommand(this._CommandInit, buf);
    }
    deinit(params) {
        const buf = new Uint8Array(0);
        this.sendCommand(this._CommandDeinit, buf);
    }
    parseFromJson(json) {
        const module = json.location;
        if (!module)
            return;
        const schemaData = [
            { uri: '/request/location/init', onValid: this.init },
            { uri: '/request/location/deinit', onValid: this.deinit },
        ];
        const res = this.validateCommandSchema(schemaData, module, 'location');
        if (res.valid === 0) {
            if (res.invalidButLike.length > 0) {
                throw new Error(res.invalidButLike[0].message);
            }
            else {
                throw new this.WSCommandNotFoundError('[location]unknown commnad');
            }
        }
    }
    notifyFromBinary(objToSend, func, payload) {
        if (func === this._CommandNotify && payload.length === 4 * 5) {
            const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
            const latitude = view.getFloat32(0, false);
            const longitude = view.getFloat32(4, false);
            const altitude = view.getFloat32(8, false);
            const accuracy = view.getFloat32(12, false);
            const speed = view.getFloat32(16, false);
            objToSend.location = {
                latitude,
                longitude,
                altitude,
                accuracy,
                speed,
            };
        }
        else {
            super.notifyFromBinary(objToSend, func, payload);
        }
    }
}
exports.WSCommandLocation = WSCommandLocation;
