/**
 * @packageDocumentation
 * @ignore
 */

import WSSchema from './WSSchema';

interface WSError {
  module: number;
  _args: number[];
  err0?: number;
  err1?: number;
  function?: number;
  message: string;
}

export interface HW {
  /**
   * hardware identifer. "esp32w"
   */
  hw: string | undefined;

  /**
   * version code of obnizOS. "3.1.0"
   */
  firmware: string | undefined;
}

export abstract class WSCommandAbstract {
  get WSCommandNotFoundError(): any {
    return WSCommandNotFoundError;
  }

  public _hw: HW;
  public ioNotUsed: number;
  public COMMAND_FUNC_ID_ERROR: number;

  public abstract module: number;
  public parsed?: (
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
    if (this.parsed) {
      this.parsed(this.module, func, payload);
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

  isWSRoomOnlyCommand(func: number, payload: Uint8Array) {
    return false;
  }
}

/* eslint max-classes-per-file: 0 */

class WSCommandNotFoundError extends Error {}
