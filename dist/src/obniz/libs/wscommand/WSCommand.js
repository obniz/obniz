"use strict";
/**
 * @packageDocumentation
 * @ignore
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WSSchema_1 = __importDefault(require("./WSSchema"));
const commandClasses = {};
class WSCommand {
    constructor() {
        this._hw = {
            hw: undefined,
            firmware: undefined,
        };
        // constants
        this.COMMAND_FUNC_ID_ERROR = 0xff;
        this.ioNotUsed = 0xff;
    }
    static get schema() {
        return WSSchema_1.default;
    }
    static get CommandClasses() {
        return commandClasses;
    }
    get WSCommandNotFoundError() {
        return WSCommandNotFoundError;
    }
    static addCommandClass(name, classObj) {
        commandClasses[name] = classObj;
    }
    static framed(module, func, payload) {
        let payload_length = 0;
        if (payload) {
            payload_length = payload.length;
        }
        let length_type;
        if (payload_length <= 0x3f) {
            length_type = 0;
        }
        else if (payload_length <= 0x3fff) {
            length_type = 1;
        }
        else if (payload_length <= 0x3fffffff) {
            length_type = 2;
        }
        else {
            throw new Error("too big payload");
        }
        let length_extra_bytse = length_type === 0 ? 0 : length_type === 1 ? 1 : 3;
        const header_length = 3 + length_extra_bytse;
        const result = new Uint8Array(header_length + payload_length);
        let index = 0;
        result[index++] = module & 0x7f;
        result[index++] = func;
        result[index++] = (length_type << 6) | (payload_length >> (length_extra_bytse * 8));
        while (length_extra_bytse > 0) {
            length_extra_bytse--;
            result[index++] = payload_length >> (length_extra_bytse * 8);
        }
        if (payload_length === 0) {
            return result;
        }
        else {
            result.set(payload, header_length);
            return result;
        }
    }
    static dequeueOne(buf) {
        if (!buf || buf.byteLength === 0) {
            return null;
        }
        if (buf.byteLength < 3) {
            throw new Error("something wrong. buf less than 3");
        }
        if (buf[0] & 0x80) {
            throw new Error("reserved bit 1");
        }
        const module = 0x7f & buf[0];
        const func = buf[1];
        const length_type = (buf[2] >> 6) & 0x3;
        const length_extra_bytse = length_type === 0 ? 0 : length_type === 1 ? 1 : 3;
        if (length_type === 4) {
            throw new Error("invalid length");
        }
        let length = (buf[2] & 0x3f) << (length_extra_bytse * 8);
        let index = 3;
        let shift = length_extra_bytse;
        while (shift > 0) {
            shift--;
            length += buf[index] << (shift * 8);
            index++;
        }
        return {
            module,
            func,
            payload: buf.slice(3 + length_extra_bytse, 3 + length_extra_bytse + length),
            next: buf.slice(3 + length_extra_bytse + length),
        };
    }
    static compress(wscommands, json) {
        let ret = null;
        function append(module, func, payload) {
            const frame = WSCommand.framed(module, func, payload);
            if (ret) {
                const combined = new Uint8Array(ret.length + frame.length);
                combined.set(ret, 0);
                combined.set(frame, ret.length);
                ret = combined;
            }
            else {
                ret = frame;
            }
        }
        for (const wscommand of wscommands) {
            wscommand.parsed = append;
            wscommand.parseFromJson(json);
        }
        return ret;
    }
    setHw(obj) {
        this._hw = obj;
    }
    sendCommand(func, payload) {
        if (this.parsed) {
            this.parsed(this.module, func, payload);
        }
    }
    parseFromJson(json) {
        // abstract
    }
    notifyFromBinary(objToSend, func, payload) {
        if (func === this.COMMAND_FUNC_ID_ERROR) {
            if (!objToSend.debug) {
                objToSend.debug = {};
            }
            const err = {
                module: this.module,
                _args: [...payload],
            };
            if (payload.byteLength === 3) {
                err.err0 = payload[0];
                err.err1 = payload[1];
                err.function = payload[2];
                err.message = `Error module=${this.module} func=${err.function} err0=${err.err0} returned=${err.err1}`;
            }
            else {
                err.message = `Error module=${this.module} with + ${err._args}`;
            }
            objToSend.debug.error = err;
        }
        else {
            // unknown
        }
    }
    envelopWarning(objToSend, module_key, obj) {
        if (!objToSend[module_key]) {
            objToSend[module_key] = {};
        }
        objToSend[module_key].warning = obj;
    }
    envelopError(objToSend, module_key, obj) {
        if (!objToSend[module_key]) {
            objToSend[module_key] = {};
        }
        objToSend[module_key].error = obj;
    }
    isValidIO(io) {
        return typeof io === "number" && 0 <= io && io <= 11;
    }
    getSchema(uri) {
        // chack isFirst
        return WSSchema_1.default.getSchema(uri);
    }
    validateCommandSchema(uriList, json, rootPath, customArg) {
        const res = { valid: 0, invalid: 0, results: [], invalidButLike: [] };
        for (const oneRow of uriList) {
            const errors = this.validate(oneRow.uri, json);
            res.results.push(errors);
            if (errors.valid) {
                res.valid++;
                if (oneRow.onValid) {
                    oneRow.onValid.bind(this)(this.filter(oneRow.uri, json), customArg);
                }
            }
            else {
                res.invalid++;
                const message = this.onlyTypeErrorMessage(errors, rootPath);
                if (message) {
                    res.invalidButLike.push({ uri: oneRow.uri, message });
                }
            }
        }
        return res;
    }
    validate(commandUri, json) {
        const schema = this.getSchema(commandUri);
        const results = WSSchema_1.default.validateMultiple(json, schema);
        return results;
    }
    onlyTypeErrorMessage(validateError, rootPath) {
        if (validateError.valid) {
            return true;
        }
        if (validateError.missing && validateError.missing.length > 0) {
            return false;
        }
        const badErrorCodes = [
            WSSchema_1.default.errorCodes.ANY_OF_MISSING,
            WSSchema_1.default.errorCodes.ONE_OF_MISSING,
            WSSchema_1.default.errorCodes.ONE_OF_MULTIPLE,
            WSSchema_1.default.errorCodes.NOT_PASSED,
            WSSchema_1.default.errorCodes.OBJECT_REQUIRED,
            WSSchema_1.default.errorCodes.OBJECT_ADDITIONAL_PROPERTIES,
            WSSchema_1.default.errorCodes.CIRCULAR_REFERENCE,
            WSSchema_1.default.errorCodes.FORMAT_CUSTOM,
            WSSchema_1.default.errorCodes.KEYWORD_CUSTOM,
            WSSchema_1.default.errorCodes.UNKNOWN_PROPERTY,
        ];
        const messages = [];
        for (const error of validateError.errors) {
            if (error.code === WSSchema_1.default.errorCodes.INVALID_TYPE) {
                if (error.params.type === "object" || error.params.expected === "object") {
                    return false;
                }
            }
            else if (badErrorCodes.includes(error.code)) {
                return false;
            }
            const path = rootPath + (error.dataPath || "").replace(/\//g, ".");
            messages.push(`[${path}]${error.message}`);
        }
        return messages.join(";");
    }
    filter(commandUri, json) {
        const schema = this.getSchema(commandUri);
        return this._filterSchema(schema, json);
    }
    _filterSchema(schema, json) {
        if (schema.$ref) {
            const refSchema = WSSchema_1.default.getSchema(schema.$ref);
            return this._filterSchema(refSchema, json);
        }
        if (json === undefined) {
            return schema.default;
        }
        if (schema.type === "string" ||
            schema.type === "integer" ||
            schema.type === "boolean" ||
            schema.type === "number" ||
            schema.type === "null" ||
            schema.filter === "pass_all") {
            return json;
        }
        if (schema.type === "array") {
            const results = [];
            for (const key in json) {
                results[key] = this._filterSchema(schema.items, json[key]);
            }
            return results;
        }
        if (schema.type === "object") {
            const results = {};
            for (const key in schema.properties) {
                results[key] = this._filterSchema(schema.properties[key], json[key]);
            }
            for (const pattern in schema.patternProperties) {
                const reg = new RegExp(pattern);
                for (const key of Object.keys(json)) {
                    if (reg.test(key)) {
                        results[key] = this._filterSchema(schema.patternProperties[pattern], json[key]);
                    }
                }
            }
            return results;
        }
        throw Error("unknown json schema type");
    }
}
exports.default = WSCommand;
// tslint:disable:max-classes-per-file
class WSCommandNotFoundError extends Error {
}
