"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("../utils/util"));
const isNode = typeof window === "undefined";
class PeripheralUART {
    constructor(obniz, id) {
        this.Obniz = obniz;
        this.id = id;
        this._reset();
    }
    _reset() {
        this.received = new Uint8Array([]);
        this.used = false;
    }
    start(params) {
        const err = util_1.default._requiredKeys(params, ["tx", "rx"]);
        if (err) {
            throw new Error("uart start param '" + err + "' required, but not found ");
        }
        this.params = util_1.default._keyFilter(params, [
            "tx",
            "rx",
            "baud",
            "stop",
            "bits",
            "parity",
            "flowcontrol",
            "rts",
            "cts",
            "drive",
            "pull",
            "gnd",
        ]);
        const ioKeys = ["rx", "tx", "rts", "cts", "gnd"];
        for (const key of ioKeys) {
            if (this.params[key] && !this.Obniz.isValidIO(this.params[key])) {
                throw new Error("uart start param '" + key + "' are to be valid io no");
            }
        }
        if (this.params.hasOwnProperty("drive")) {
            this.Obniz.getIO(this.params.rx).drive(this.params.drive);
            this.Obniz.getIO(this.params.tx).drive(this.params.drive);
        }
        else {
            this.Obniz.getIO(this.params.rx).drive("5v");
            this.Obniz.getIO(this.params.tx).drive("5v");
        }
        if (this.params.hasOwnProperty("pull")) {
            this.Obniz.getIO(this.params.rx).pull(this.params.pull);
            this.Obniz.getIO(this.params.tx).pull(this.params.pull);
        }
        else {
            this.Obniz.getIO(this.params.rx).pull(null);
            this.Obniz.getIO(this.params.tx).pull(null);
        }
        if (this.params.hasOwnProperty("gnd")) {
            this.Obniz.getIO(this.params.gnd).output(false);
            const ioNames = {};
            ioNames[this.params.gnd] = "gnd";
            if (this.Obniz.display) {
                this.Obniz.display.setPinNames("uart" + this.id, ioNames);
            }
        }
        const obj = {};
        const sendParams = util_1.default._keyFilter(this.params, [
            "tx",
            "rx",
            "baud",
            "stop",
            "bits",
            "parity",
            "flowcontrol",
            "rts",
            "cts",
        ]);
        obj["uart" + this.id] = sendParams;
        this.Obniz.send(obj);
        this.received = [];
        this.used = true;
    }
    send(data) {
        if (!this.used) {
            throw new Error(`uart${this.id} is not started`);
        }
        let send_data = null;
        if (data === undefined) {
            return;
        }
        if (typeof data === "number") {
            data = [data];
        }
        if (isNode && data instanceof Buffer) {
            send_data = [...data];
        }
        else if (data.constructor === Array) {
            send_data = data;
        }
        else if (typeof data === "string") {
            const buf = Buffer.from(data);
            send_data = [...buf];
        }
        const obj = {};
        obj["uart" + this.id] = {};
        obj["uart" + this.id].data = send_data;
        //  console.log(obj);
        this.Obniz.send(obj);
    }
    isDataExists() {
        return this.received && this.received.length > 0;
    }
    readBytes() {
        const results = [];
        if (this.isDataExists()) {
            for (let i = 0; i < this.received.length; i++) {
                results.push(this.received[i]);
            }
        }
        this.received = [];
        return results;
    }
    readByte() {
        const results = [];
        if (this.isDataExists()) {
            return results.unshift();
        }
        return null;
    }
    readText() {
        let string = null;
        if (this.isDataExists()) {
            const data = this.readBytes();
            string = this.tryConvertString(data);
        }
        this.received = [];
        return string;
    }
    tryConvertString(data) {
        return util_1.default.dataArray2string(data);
    }
    notified(obj) {
        if (this.onreceive) {
            const string = this.tryConvertString(obj.data);
            this.onreceive(obj.data, string);
        }
        else {
            if (!this.received) {
                this.received = [];
            }
            this.received.push.apply(this.received, obj.data);
        }
    }
    isUsed() {
        return this.used;
    }
    end() {
        const obj = {};
        obj["uart" + this.id] = null;
        this.params = null;
        this.Obniz.send(obj);
        this.used = false;
    }
}
exports.default = PeripheralUART;

//# sourceMappingURL=uart.js.map
