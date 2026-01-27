"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const ComponentAbstact_1 = require("../ComponentAbstact");
const semver_1 = __importDefault(require("semver"));
class Storage extends ComponentAbstact_1.ComponentAbstract {
    schemaBasePath() {
        return 'storage';
    }
    _reset() {
        // What should I do?
    }
    constructor(obniz, info) {
        super(obniz);
    }
    save(fileName, data) {
        if (semver_1.default.major(this.Obniz.firmware_ver) < 4) {
            throw new Error(`Please update obniz firmware >= 4.0.0`);
        }
        const obj = {
            storage: {
                save: {
                    fileName,
                    data,
                },
            },
        };
        this.Obniz.send(obj);
    }
    savePluginLua(lua_script) {
        if (semver_1.default.major(this.Obniz.firmware_ver) < 7) {
            throw new Error(`Please update obniz firmware >= 7.0.0`);
        }
        let send_data = null;
        if (this.Obniz.isNode && lua_script instanceof Buffer) {
            send_data = [...lua_script];
        }
        else if (lua_script.constructor === Array) {
            send_data = lua_script;
        }
        else if (typeof lua_script === 'string') {
            const buf = Buffer.from(lua_script);
            send_data = [...buf];
        }
        if (!send_data) {
            throw new Error(`no correct lua_script supplied`);
        }
        this.save('plua', send_data);
    }
    async readWait(fileName) {
        const obj = {
            storage: {
                read: {
                    fileName,
                },
            },
        };
        const json = await this.sendAndReceiveJsonWait(obj, '/response/storage/read');
        return json.read;
    }
}
exports.Storage = Storage;
