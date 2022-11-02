"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const ComponentAbstact_1 = require("../ComponentAbstact");
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
