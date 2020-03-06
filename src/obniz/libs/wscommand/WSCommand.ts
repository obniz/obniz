/**
 * @packageDocumentation
 * @ignore
 */

import WSSchema from "./WSSchema";

const commandClasses: any = {};
export default abstract class WSCommand {
  static get schema() {
    return WSSchema;
  }

  static get CommandClasses() {
    return commandClasses;
  }

  get WSCommandNotFoundError() {
    return WSCommandNotFoundError;
  }

  public static addCommandClass(name: any, classObj: any) {
    commandClasses[name] = classObj;
  }

  public static framed(module: any, func: any, payload: any): Uint8Array {
    let payload_length: any = 0;
    if (payload) {
      payload_length = payload.length;
    }
    let length_type: any;
    if (payload_length <= 0x3f) {
      length_type = 0;
    } else if (payload_length <= 0x3fff) {
      length_type = 1;
    } else if (payload_length <= 0x3fffffff) {
      length_type = 2;
    } else {
      throw new Error("too big payload");
    }
    let length_extra_bytse: any = length_type === 0 ? 0 : length_type === 1 ? 1 : 3;
    const header_length: any = 3 + length_extra_bytse;
    const result: any = new Uint8Array(header_length + payload_length);
    let index: any = 0;
    result[index++] = module & 0x7f;
    result[index++] = func;
    result[index++] = (length_type << 6) | (payload_length >> (length_extra_bytse * 8));
    while (length_extra_bytse > 0) {
      length_extra_bytse--;
      result[index++] = payload_length >> (length_extra_bytse * 8);
    }
    if (payload_length === 0) {
      return result;
    } else {
      result.set(payload, header_length);
      return result;
    }
  }

  public static dequeueOne(buf: any) {
    if (!buf || buf.byteLength === 0) {
      return null;
    }
    if (buf.byteLength < 3) {
      throw new Error("something wrong. buf less than 3");
    }
    if (buf[0] & 0x80) {
      throw new Error("reserved bit 1");
    }
    const module: any = 0x7f & buf[0];
    const func: any = buf[1];
    const length_type: any = (buf[2] >> 6) & 0x3;
    const length_extra_bytse: any = length_type === 0 ? 0 : length_type === 1 ? 1 : 3;
    if (length_type === 4) {
      throw new Error("invalid length");
    }
    let length: any = (buf[2] & 0x3f) << (length_extra_bytse * 8);
    let index: any = 3;
    let shift: any = length_extra_bytse;
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

  public static compress(wscommands: any, json: any): Uint8Array | null {
    let ret: any = null;

    function append(module: any, func: any, payload: any) {
      const frame: any = WSCommand.framed(module, func, payload);
      if (ret) {
        const combined: any = new Uint8Array(ret.length + frame.length);
        combined.set(ret, 0);
        combined.set(frame, ret.length);
        ret = combined;
      } else {
        ret = frame;
      }
    }

    for (const wscommand of wscommands) {
      wscommand.parsed = append;
      wscommand.parseFromJson(json);
    }
    return ret;
  }

  public _hw: any;
  public ioNotUsed: number;
  public COMMAND_FUNC_ID_ERROR: number;

  protected abstract module: number;
  private parsed?: (module: number, func: number, payload: Uint8Array) => void;

  constructor() {
    this._hw = {
      hw: undefined,
      firmware: undefined,
    };

    // constants
    this.COMMAND_FUNC_ID_ERROR = 0xff;
    this.ioNotUsed = 0xff;
  }

  public setHw(obj: any) {
    this._hw = obj;
  }

  public sendCommand(func: any, payload: any) {
    if (this.parsed) {
      this.parsed(this.module, func, payload);
    }
  }

  public parseFromJson(json: any) {
    // abstract
  }

  public notifyFromBinary(objToSend: any, func: any, payload: any) {
    if (func === this.COMMAND_FUNC_ID_ERROR) {
      if (!objToSend.debug) {
        objToSend.debug = {};
      }
      const err: any = {
        module: this.module,
        _args: [...payload],
      };

      if (payload.byteLength === 3) {
        err.err0 = payload[0];
        err.err1 = payload[1];
        err.function = payload[2];
        err.message = `Error module=${this.module} func=${err.function} err0=${err.err0} returned=${err.err1}`;
      } else {
        err.message = `Error module=${this.module} with + ${err._args}`;
      }
      objToSend.debug.error = err;
    } else {
      // unknown
    }
  }

  public envelopWarning(objToSend: any, module_key: any, obj: any) {
    if (!objToSend[module_key]) {
      objToSend[module_key] = {};
    }
    objToSend[module_key].warning = obj;
  }

  public envelopError(objToSend: any, module_key: any, obj: any) {
    if (!objToSend[module_key]) {
      objToSend[module_key] = {};
    }
    objToSend[module_key].error = obj;
  }

  public isValidIO(io: any) {
    return typeof io === "number" && 0 <= io && io <= 11;
  }

  public getSchema(uri: any) {
    // chack isFirst

    return WSSchema.getSchema(uri);
  }

  public validateCommandSchema(uriList: any, json: any, rootPath: any, customArg: any) {
    const res: any = { valid: 0, invalid: 0, results: [], invalidButLike: [] };
    for (const oneRow of uriList) {
      const errors: any = this.validate(oneRow.uri, json);
      res.results.push(errors);
      if (errors.valid) {
        res.valid++;
        if (oneRow.onValid) {
          oneRow.onValid.bind(this)(this.filter(oneRow.uri, json), customArg);
        }
      } else {
        res.invalid++;
        const message: any = this.onlyTypeErrorMessage(errors, rootPath);
        if (message) {
          res.invalidButLike.push({ uri: oneRow.uri, message });
        }
      }
    }

    return res;
  }

  public validate(commandUri: any, json: any): WSSchema.MultiResult {
    const schema: any = this.getSchema(commandUri);
    const results: any = WSSchema.validateMultiple(json, schema);
    return results;
  }

  public onlyTypeErrorMessage(validateError: any, rootPath: any) {
    if (validateError.valid) {
      return true;
    }
    if (validateError.missing && validateError.missing.length > 0) {
      return false;
    }

    const badErrorCodes: any = [
      WSSchema.errorCodes.ANY_OF_MISSING,
      WSSchema.errorCodes.ONE_OF_MISSING,
      WSSchema.errorCodes.ONE_OF_MULTIPLE,
      WSSchema.errorCodes.NOT_PASSED,
      WSSchema.errorCodes.OBJECT_REQUIRED,
      WSSchema.errorCodes.OBJECT_ADDITIONAL_PROPERTIES,
      WSSchema.errorCodes.CIRCULAR_REFERENCE,
      WSSchema.errorCodes.FORMAT_CUSTOM,
      WSSchema.errorCodes.KEYWORD_CUSTOM,
      WSSchema.errorCodes.UNKNOWN_PROPERTY,
    ];
    const messages: any = [];
    for (const error of validateError.errors) {
      if (error.code === WSSchema.errorCodes.INVALID_TYPE) {
        if ((error as any).params.type === "object" || (error as any).params.expected === "object") {
          return false;
        }
      } else if (badErrorCodes.includes(error.code)) {
        return false;
      }

      const path: any = rootPath + (error.dataPath || "").replace(/\//g, ".");
      messages.push(`[${path}]${error.message}`);
    }
    return messages.join(";");
  }

  public filter(commandUri: any, json: any) {
    const schema: any = this.getSchema(commandUri);
    return this._filterSchema(schema, json);
  }

  public _filterSchema(schema: any, json: any): any {
    if (schema.$ref) {
      const refSchema: any = WSSchema.getSchema(schema.$ref);
      return this._filterSchema(refSchema, json);
    }

    if (json === undefined) {
      return schema.default;
    }

    if (
      schema.type === "string" ||
      schema.type === "integer" ||
      schema.type === "boolean" ||
      schema.type === "number" ||
      schema.type === "null" ||
      schema.filter === "pass_all"
    ) {
      return json;
    }

    if (schema.type === "array") {
      const results: any = [];
      for (const key in json) {
        results[key] = this._filterSchema(schema.items, json[key]);
      }
      return results;
    }

    if (schema.type === "object") {
      const results: any = {};
      for (const key in schema.properties) {
        results[key] = this._filterSchema(schema.properties[key], json[key]);
      }

      for (const pattern in schema.patternProperties) {
        const reg: any = new RegExp(pattern);
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

// tslint:disable:max-classes-per-file

class WSCommandNotFoundError extends Error {}
