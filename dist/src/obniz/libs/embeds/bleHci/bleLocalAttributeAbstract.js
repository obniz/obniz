"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleAttributeAbstract_1 = __importDefault(require("./bleAttributeAbstract"));
const bleHelper_1 = __importDefault(require("./bleHelper"));
class BleLocalAttributeAbstract extends bleAttributeAbstract_1.default {
    constructor(params) {
        super(params);
        this.RESULT_SUCCESS = 0x00;
        this.RESULT_INVALID_OFFSET = 0x07;
        this.RESULT_ATTR_NOT_LONG = 0x0b;
        this.RESULT_INVALID_ATTRIBUTE_LENGTH = 0x0d;
        this.RESULT_UNLIKELY_ERROR = 0x0e;
    }
    toBufferObj() {
        const obj = {
            uuid: bleHelper_1.default.uuidFilter(this.uuid),
        };
        if (this.childrenName) {
            const key = this.childrenName;
            obj[key] = this.children.map((e) => e.toBufferObj());
        }
        obj.emit = this.emit.bind(this);
        return obj;
    }
    emit(name, ...params) {
        switch (name) {
            case "readRequest":
                this._onReadRequest(...params);
                return true;
            case "writeRequest":
                this._onWriteRequest(...params);
                return true;
        }
        return false;
    }
    _onReadRequest(offset, callback) {
        if (this.data.length >= offset) {
            callback(this.RESULT_SUCCESS, Buffer.from(this.data.slice(offset)));
            let address = null;
            if (this.parentName === "characteristic") {
                address = this.characteristic.service.peripheral
                    .currentConnectedDeviceAddress;
            }
            else if (this.parentName === "service") {
                address = this.service.peripheral.currentConnectedDeviceAddress;
            }
            this.notifyFromServer("onreadfromremote", { address });
        }
        else {
            callback(this.RESULT_UNLIKELY_ERROR, null);
        }
    }
    _onWriteRequest(data, offset, withoutResponse, callback) {
        // console.log('onWriteRequest');
        this.data = Array.from(data);
        callback(this.RESULT_SUCCESS);
        let address = null;
        if (this.parentName === "characteristic") {
            address = this.characteristic.service.peripheral
                .currentConnectedDeviceAddress;
        }
        else if (this.parentName === "service") {
            address = this.service.peripheral.currentConnectedDeviceAddress;
        }
        this.notifyFromServer("onwritefromremote", { address, data });
    }
    write(dataArray) {
        this.data = dataArray;
        this.notifyFromServer("onwrite", { result: "success" });
    }
    read() {
        this.notifyFromServer("onread", { data: this.data });
    }
}
exports.default = BleLocalAttributeAbstract;

//# sourceMappingURL=bleLocalAttributeAbstract.js.map
