/**
 * @packageDocumentation
 * @ignore
 */

import WSSchema from './WSSchema';

type WSCommandConstructor = new () => WSCommand;
const commandClasses: { [key: string]: WSCommandConstructor } = {};

interface WSError {
  module: number;
  _args: number[];
  err0?: number;
  err1?: number;
  function?: number;
  message: string;
}

interface PayloadChunk {
  /**
   * module number
   */
  module: number;

  /**
   * function index number
   */
  func: number;

  /**
   * payload for wscommand
   */
  payload: Uint8Array;

  /**
   * left binary array
   */
  next: Uint8Array;
}

interface HW {
  /**
   * hardware identifer. "esp32w"
   */
  hw: string | undefined;

  /**
   * version code of obnizOS. "3.1.0"
   */
  firmware: string | undefined;
}

export default abstract class WSCommand {
  static get schema(): any {
    return WSSchema;
  }

  static get CommandClasses(): { [key: string]: WSCommandConstructor } {
    return commandClasses;
  }

  get WSCommandNotFoundError(): typeof WSCommandNotFoundError {
    return WSCommandNotFoundError;
  }

  public static addCommandClass(
    name: string,
    classObj: WSCommandConstructor
  ): void {
    commandClasses[name] = classObj;
  }

  public static framed(
    module: number,
    func: number,
    payload: Uint8Array | null
  ): Uint8Array {
    let payload_length = 0;
    if (payload) {
      payload_length = payload.length;
    }
    let length_type: 0 | 1 | 2;
    if (payload_length <= 0x3f) {
      length_type = 0;
    } else if (payload_length <= 0x3fff) {
      length_type = 1;
    } else if (payload_length <= 0x3fffffff) {
      length_type = 2;
    } else {
      throw new Error('too big payload');
    }
    let length_extra_bytse = length_type === 0 ? 0 : length_type === 1 ? 1 : 3;
    const header_length = 3 + length_extra_bytse;
    const result = new Uint8Array(header_length + payload_length);
    let index = 0;
    result[index++] = module & 0x7f;
    result[index++] = func;
    result[index++] =
      (length_type << 6) | (payload_length >> (length_extra_bytse * 8));
    while (length_extra_bytse > 0) {
      length_extra_bytse--;
      result[index++] = payload_length >> (length_extra_bytse * 8);
    }
    if (payload_length === 0 || !payload) {
      return result;
    } else {
      result.set(payload, header_length);
      return result;
    }
  }

  /**
   * Dequeue a next wscommands from binary array.
   *
   * @param buf binary array received from obniz cloud.
   * @returns chunk
   */
  public static dequeueOne(buf: Uint8Array): PayloadChunk | null {
    if (!buf || buf.byteLength === 0) {
      return null;
    }
    if (buf.byteLength < 3) {
      throw new Error('something wrong. buf less than 3');
    }
    if (buf[0] & 0x80) {
      throw new Error('reserved bit 1');
    }
    const module = 0x7f & buf[0];
    const func = buf[1];
    const length_type = (buf[2] >> 6) & 0x3;
    const length_extra_bytse =
      length_type === 0 ? 0 : length_type === 1 ? 1 : 3;
    if (length_type === 4) {
      throw new Error('invalid length');
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
      payload: buf.slice(
        3 + length_extra_bytse,
        3 + length_extra_bytse + length
      ),
      next: buf.slice(3 + length_extra_bytse + length),
    };
  }

  public static onCompressed: (data: Uint8Array) => void = () => {
    // do nothing
  };

  public static compress(
    wscommands: WSCommand[],
    json: any
  ): Uint8Array | null {
    let ret: Uint8Array | null = null;

    const append = (
      module: number,
      func: number,
      payload: Uint8Array | null
    ) => {
      const frame = WSCommand.framed(module, func, payload);
      if (ret) {
        const combined = new Uint8Array(ret.length + frame.length);
        combined.set(ret, 0);
        combined.set(frame, ret.length);
        ret = combined;
      } else {
        ret = frame;
      }
    };

    for (const wscommand of wscommands) {
      wscommand.onParsed = append;
      wscommand.parseFromJson(json);
    }
    if (ret) {
      this.onCompressed(ret);
    }
    return ret;
  }

  public _hw: HW;
  public ioNotUsed: number;
  public COMMAND_FUNC_ID_ERROR: number;

  public abstract module: number;
  public onParsed?: (
    module: number,
    func: number,
    payload: Uint8Array | null
  ) => void;

  constructor() {
    this._hw = {
      hw: undefined,
      firmware: undefined,
    };

    // constants
    this.COMMAND_FUNC_ID_ERROR = 0xff;
    this.ioNotUsed = 0xff;
  }

  public setHw(obj: HW): void {
    this._hw = obj;
  }

  // This function does NOT send command to websocket. Just doing creating frame and append it to some variable.
  public sendCommand(func: number, payload: Uint8Array | null): void {
    if (this.onParsed) {
      this.onParsed(this.module, func, payload);
    }
  }

  public parseFromJson(json: { [k: string]: unknown }) {
    // abstract
  }

  // NOTE: payload is sent from obniz OS.
  public notifyFromBinary(
    objToSend: { [key: string]: any },
    func: number,
    payload: Uint8Array
  ): void {
    if (func === this.COMMAND_FUNC_ID_ERROR) {
      if (!objToSend.debug) {
        objToSend.debug = {};
      }
      const err: WSError = {
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
      } else {
        err.message = `obnizOS recieved wscommand(moduleNo=${this.module}) but it encountered an error(errDetails(payload)=${err._args}).`;
      }
      objToSend.debug.error = err;
    } else {
      // unknown
    }
  }

  public envelopWarning(
    objToSend: { [key: string]: any },
    module_key: any,
    obj: any
  ): void {
    if (!objToSend[module_key]) {
      objToSend[module_key] = {};
    }
    objToSend[module_key].warning = obj;
  }

  public envelopError(
    objToSend: { [key: string]: any },
    module_key: any,
    obj: any
  ): void {
    if (!objToSend[module_key]) {
      objToSend[module_key] = {};
    }
    objToSend[module_key].error = obj;
  }

  public isValidIO(io: number): boolean {
    return typeof io === 'number' && 0 <= io && io <= 11;
  }

  public getSchema(uri: any): any {
    // chack isFirst

    return WSSchema.getSchema(uri);
  }

  public validateCommandSchema(
    uriList: any,
    json: any,
    rootPath: any,
    customArg?: any
  ) {
    const res: any = { valid: 0, invalid: 0, results: [], invalidButLike: [] };
    for (const oneRow of uriList) {
      const errors = this.validate(oneRow.uri, json);
      res.results.push(errors);
      if (errors.valid) {
        res.valid++;
        if (oneRow.onValid) {
          oneRow.onValid.bind(this)(this.filter(oneRow.uri, json), customArg);
        }
      } else {
        res.invalid++;
        const message = this.onlyTypeErrorMessage(errors, rootPath);
        if (message) {
          res.invalidButLike.push({ uri: oneRow.uri, message });
        }
      }
    }

    return res;
  }

  public validate(commandUri: any, json: any): WSSchema.MultiResult {
    const schema = this.getSchema(commandUri);
    const results = WSSchema.validateMultiple(json, schema);
    return results;
  }

  public fastValidate(commandUri: any, json: any): boolean {
    const schema = this.getSchema(commandUri);
    const results: boolean = WSSchema.validate(json, schema);
    return results;
  }

  public onlyTypeErrorMessage(validateError: any, rootPath: any) {
    if (validateError.valid) {
      return true;
    }
    if (validateError.missing && validateError.missing.length > 0) {
      return false;
    }

    const badErrorCodes = [
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
    const messages = [];
    for (const error of validateError.errors) {
      if (error.code === WSSchema.errorCodes.INVALID_TYPE) {
        if (
          error.params.type === 'object' ||
          error.params.expected === 'object'
        ) {
          return false;
        }
      } else if (badErrorCodes.includes(error.code)) {
        return false;
      }

      const path = rootPath + (error.dataPath || '').replace(/\//g, '.');
      messages.push(`[${path}]${error.message}`);
    }
    return messages.join(';');
  }

  public filter(commandUri: any, json: any) {
    const schema = this.getSchema(commandUri);
    return this._filterSchema(schema, json);
  }

  public _filterSchema(schema: any, json: any): any {
    if (schema.$ref) {
      const refSchema = WSSchema.getSchema(schema.$ref);
      return this._filterSchema(refSchema, json);
    }

    if (json === undefined) {
      return schema.default;
    }

    if (
      schema.type === 'string' ||
      schema.type === 'integer' ||
      schema.type === 'boolean' ||
      schema.type === 'number' ||
      schema.type === 'null' ||
      schema.filter === 'pass_all'
    ) {
      return json;
    }

    if (schema.type === 'array') {
      const results: any = [];
      for (const key in json) {
        results[key] = this._filterSchema(schema.items, json[key]);
      }
      return results;
    }

    if (schema.type === 'object') {
      const results: any = {};
      for (const key in schema.properties) {
        results[key] = this._filterSchema(schema.properties[key], json[key]);
      }

      for (const pattern in schema.patternProperties) {
        const reg = new RegExp(pattern);
        for (const key of Object.keys(json)) {
          if (reg.test(key)) {
            results[key] = this._filterSchema(
              schema.patternProperties[pattern],
              json[key]
            );
          }
        }
      }
      return results;
    }

    throw Error('unknown json schema type');
  }
}

/* eslint max-classes-per-file: 0 */

class WSCommandNotFoundError extends Error {}
