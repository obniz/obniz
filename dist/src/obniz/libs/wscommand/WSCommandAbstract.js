"use strict";
/**
 * @packageDocumentation
 * @ignore
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSCommandAbstract = void 0;
const WSSchema_1 = __importDefault(require("./WSSchema"));
class WSCommandAbstract {
    constructor() {
        this._hw = {
            hw: undefined,
            firmware: undefined,
        };
        // constants
        this.COMMAND_FUNC_ID_ERROR = 0xff;
        this.ioNotUsed = 0xff;
    }
    get WSCommandNotFoundError() {
        return WSCommandNotFoundError;
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
    // NOTE: payload is sent from obniz OS.
    notifyFromBinary(objToSend, func, payload) {
        if (func === this.COMMAND_FUNC_ID_ERROR) {
            if (!objToSend.debug) {
                objToSend.debug = {};
            }
            const err = {
                module: this.module,
                _args: [...payload],
                message: ``,
            };
            if (payload.byteLength === 3) {
                err.err0 = payload[0];
                err.err1 = payload[1];
                err.function = payload[2];
                // NOTE: Why two errors exist?
                err.message = `obnizOS recieved wscommand(moduleNo=${this.module}, funcNo=${err.function}) but it encountered an error(err0=${err.err0}, returned=${err.err1}).`;
            }
            else {
                err.message = `obnizOS recieved wscommand(moduleNo=${this.module}) but it encountered an error(errDetails(payload)=${err._args}).`;
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
        return typeof io === 'number' && 0 <= io && io <= 11;
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
    fastValidate(commandUri, json) {
        const schema = this.getSchema(commandUri);
        const results = WSSchema_1.default.validate(json, schema);
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
                if (error.params.type === 'object' ||
                    error.params.expected === 'object') {
                    return false;
                }
            }
            else if (badErrorCodes.includes(error.code)) {
                return false;
            }
            const path = rootPath + (error.dataPath || '').replace(/\//g, '.');
            messages.push(`[${path}]${error.message}`);
        }
        return messages.join(';');
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
        if (schema.type === 'string' ||
            schema.type === 'integer' ||
            schema.type === 'boolean' ||
            schema.type === 'number' ||
            schema.type === 'null' ||
            schema.filter === 'pass_all') {
            return json;
        }
        if (schema.type === 'array') {
            const results = [];
            for (const key in json) {
                results[key] = this._filterSchema(schema.items, json[key]);
            }
            return results;
        }
        if (schema.type === 'object') {
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
        throw Error('unknown json schema type');
    }
}
exports.WSCommandAbstract = WSCommandAbstract;
/* eslint max-classes-per-file: 0 */
class WSCommandNotFoundError extends Error {
}
