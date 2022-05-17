"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WSCommand_1 = __importDefault(require("./WSCommand"));
class WSCommandStorage extends WSCommand_1.default {
    constructor() {
        super(...arguments);
        this.module = 17;
        this._CommandSave = 0;
        this._CommandRead = 1;
    }
    // public _CommandErase = 2; // TODO: Implement this in the future.
    save(json) {
        // request payload format
        // length of filename | filename | data
        const { fileName, data } = json.save;
        const buf = Buffer.from(fileName);
        const fileNameUintArr = new Uint8Array(buf);
        const joined = new Uint8Array(1 /* this 1 byte indicates length of filename */ +
            fileNameUintArr.length +
            data.length);
        const iLenFileName = 0;
        const iFileName = iLenFileName + 1;
        const iData = iFileName + fileNameUintArr.length;
        joined.set(new Uint8Array([fileNameUintArr.length]), iLenFileName);
        joined.set(fileNameUintArr, iFileName);
        joined.set(data, iData);
        this.sendCommand(this._CommandSave, joined);
    }
    read(json) {
        // request payload format
        // length of filename | filename
        const { fileName } = json.read;
        const buf = Buffer.from(fileName);
        const fileNameUintArr = new Uint8Array(buf);
        const joined = new Uint8Array(1 /* this 1 byte indicates length of filename */ + fileNameUintArr.length);
        const iLenFileName = 0;
        const iFileName = iLenFileName + 1;
        joined.set(new Uint8Array([fileNameUintArr.length]), iLenFileName);
        joined.set(fileNameUintArr, iFileName);
        this.sendCommand(this._CommandRead, joined);
    }
    parseFromJson(json) {
        const module = json.storage;
        if (!module)
            return;
        const schemaData = [
            { uri: '/request/storage/save', onValid: this.save },
            { uri: '/request/storage/read', onValid: this.read },
        ];
        const res = this.validateCommandSchema(schemaData, module, 'storage');
        if (res.valid === 0) {
            if (res.invalidButLike.length > 0) {
                throw new Error(res.invalidButLike[0].message);
            }
            else {
                throw new this.WSCommandNotFoundError('[storage]unknown commnad');
            }
        }
    }
    notifyFromBinary(objToSend, func, payload) {
        switch (func) {
            case this._CommandSave: {
                super.notifyFromBinary(objToSend, func, payload);
                break;
            }
            case this._CommandRead: {
                // parse binary and build up json out of it
                // binary format: lenFileName | bytesFileName | bytesData
                const lenFileName = payload[0];
                const bytesFileName = payload.slice(1, lenFileName + 1);
                const uBytesData = payload.slice(1 + bytesFileName.length);
                objToSend.storage = {
                    read: Array.from(uBytesData),
                };
                break;
            }
            default: {
                break;
            }
        }
    }
}
exports.default = WSCommandStorage;
