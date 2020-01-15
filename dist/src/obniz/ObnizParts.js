"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("./libs/utils/util"));
const ObnizConnection_1 = __importDefault(require("./ObnizConnection"));
const _parts = {};
class ObnizParts extends ObnizConnection_1.default {
    static _parts() {
        return _parts;
    }
    static PartsRegistrate(arg0, arg1) {
        if (arg0 &&
            typeof arg0.info === "function" &&
            typeof arg0.info().name === "string") {
            _parts[arg0.info().name] = arg0;
        }
        else if (typeof arg0 === "string" && typeof arg1 === "object") {
            _parts[arg0] = arg1;
        }
    }
    static Parts(name) {
        if (!_parts[name]) {
            throw new Error(`unknown parts [${name}]`);
        }
        return new _parts[name]();
    }
    constructor(id, options) {
        super(id, options);
    }
    isValidIO(io) {
        return typeof io === "number" && this["io" + io] !== null;
    }
    wired(partsname, options) {
        const parts = ObnizParts.Parts(partsname);
        if (!parts) {
            throw new Error("No such a parts [" + partsname + "] found");
        }
        const args = Array.from(arguments);
        args.shift();
        args.unshift(this);
        if (parts.keys) {
            if (parts.requiredKeys) {
                const err = util_1.default._requiredKeys(args[1], parts.requiredKeys);
                if (err) {
                    throw new Error(partsname + " wired param '" + err + "' required, but not found ");
                }
            }
            parts.params = util_1.default._keyFilter(args[1], parts.keys);
        }
        parts.obniz = this;
        parts.wired.apply(parts, args);
        if (parts.keys || parts.ioKeys) {
            const keys = parts.ioKeys || parts.keys;
            const displayPartsName = parts.displayName || partsname;
            const ioNames = {};
            for (const index in keys) {
                let pinName = keys[index];
                const io = args[1][pinName];
                if (this.isValidIO(io)) {
                    if (parts.displayIoNames && parts.displayIoNames[pinName]) {
                        pinName = parts.displayIoNames[pinName];
                    }
                    ioNames[io] = pinName;
                }
            }
            const display = this.display;
            if (display) {
                display.setPinNames(displayPartsName, ioNames);
            }
        }
        return parts;
    }
}
exports.default = ObnizParts;
//# sourceMappingURL=ObnizParts.js.map