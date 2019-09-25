const WSSchema = require('./WSSchema');

let commandClasses = {};

module.exports = class WSCommand {
  constructor() {
    this._hw = {
      hw: undefined,
      firmware: undefined,
    };

    //constants
    this.COMMAND_FUNC_ID_ERROR = 0xff;
    this.ioNotUsed = 0xff;
  }

  static get schema() {
    return WSSchema;
  }
  static get CommandClasses() {
    return commandClasses;
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
    } else if (payload_length <= 0x3fff) {
      length_type = 1;
    } else if (payload_length <= 0x3fffffff) {
      length_type = 2;
    } else {
      throw new Error('too big payload');
    }
    let length_extra_bytse = length_type == 0 ? 0 : length_type == 1 ? 1 : 3;
    let header_length = 3 + length_extra_bytse;
    let result = new Uint8Array(header_length + payload_length);
    let index = 0;
    result[index++] = module & 0x7f;
    result[index++] = func;
    result[index++] =
      (length_type << 6) | (payload_length >> (length_extra_bytse * 8));
    while (length_extra_bytse > 0) {
      length_extra_bytse--;
      result[index++] = payload_length >> (length_extra_bytse * 8);
    }
    if (payload_length == 0) {
      return result;
    } else {
      result.set(payload, header_length);
      return result;
    }
  }

  static dequeueOne(buf) {
    if (!buf || buf.byteLength == 0) return null;
    if (buf.byteLength < 3) {
      throw new Error('something wrong. buf less than 3');
    }
    if (buf[0] & 0x80) {
      throw new Error('reserved bit 1');
    }
    let module = 0x7f & buf[0];
    let func = buf[1];
    let length_type = (buf[2] >> 6) & 0x3;
    let length_extra_bytse = length_type == 0 ? 0 : length_type == 1 ? 1 : 3;
    if (length_type == 4) {
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
      module: module,
      func: func,
      payload: buf.slice(
        3 + length_extra_bytse,
        3 + length_extra_bytse + length
      ),
      next: buf.slice(3 + length_extra_bytse + length),
    };
  }

  static compress(wscommands, json) {
    let ret = null;
    function append(module, func, payload) {
      let frame = WSCommand.framed(module, func, payload);
      if (ret) {
        let combined = new Uint8Array(ret.length + frame.length);
        combined.set(ret, 0);
        combined.set(frame, ret.length);
        ret = combined;
      } else {
        ret = frame;
      }
    }
    for (let i = 0; i < wscommands.length; i++) {
      const wscommand = wscommands[i];
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

  parseFromJson(json) {}

  notifyFromBinary(objToSend, func, payload) {
    if (func === this.COMMAND_FUNC_ID_ERROR) {
      if (!objToSend.debug) objToSend.debug = {};
      let err = {
        module: this.module,
        _args: [...payload],
      };

      if (payload.byteLength == 3) {
        err.err0 = payload[0];
        err.err1 = payload[1];
        err.function = payload[2];
        err.message = `Error module=${this.module} func=${err.function} err0=${
          err.err0
        } returned=${err.err1}`;
      } else {
        err.message = `Error module=${this.module} with + ${err._args}`;
      }
      objToSend.debug.error = err;
    } else {
      // unknown
    }
  }

  envelopWarning(objToSend, module_key, obj) {
    if (!objToSend[module_key]) objToSend[module_key] = {};
    objToSend[module_key].warning = obj;
  }

  envelopError(objToSend, module_key, obj) {
    if (!objToSend[module_key]) objToSend[module_key] = {};
    objToSend[module_key].error = obj;
  }

  isValidIO(io) {
    return typeof io === 'number' && 0 <= io && io <= 11;
  }

  getSchema(uri) {
    //chack isFirst

    return WSSchema.getSchema(uri);
  }

  validateCommandSchema(uriList, json, rootPath, customArg) {
    let res = { valid: 0, invalid: 0, results: [], invalidButLike: [] };
    for (let oneRow of uriList) {
      let errors = this.validate(oneRow.uri, json);
      res.results.push(errors);
      if (errors.valid) {
        res.valid++;
        if (oneRow.onValid) {
          oneRow.onValid.bind(this)(this.filter(oneRow.uri, json), customArg);
        }
      } else {
        res.invalid++;
        let message = this.onlyTypeErrorMessage(errors, rootPath);
        if (message) {
          res.invalidButLike.push({ uri: oneRow.uri, message });
        }
      }
    }

    return res;
  }

  validate(commandUri, json) {
    let schema = this.getSchema(commandUri);
    let results = WSSchema.validateMultiple(json, schema);
    return results;
  }

  onlyTypeErrorMessage(validateError, rootPath) {
    if (validateError.valid) {
      return true;
    }
    if (validateError.missing && validateError.missing.length > 0) {
      return false;
    }

    let badErrorCodes = [
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
    let messages = [];
    for (let error of validateError.errors) {
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

      let path = rootPath + error.dataPath.replace(/\//g, '.');
      messages.push(`[${path}]${error.message}`);
    }
    return messages.join(';');
  }

  filter(commandUri, json) {
    let schema = this.getSchema(commandUri);
    return this._filterSchema(schema, json);
  }

  _filterSchema(schema, json) {
    if (schema['$ref']) {
      let refSchema = WSSchema.getSchema(schema['$ref']);
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
      let results = [];
      for (let key in json) {
        results[key] = this._filterSchema(schema.items, json[key]);
      }
      return results;
    }

    if (schema.type === 'object') {
      let results = {};
      for (let key in schema.properties) {
        results[key] = this._filterSchema(schema.properties[key], json[key]);
      }

      for (let pattern in schema.patternProperties) {
        let reg = new RegExp(pattern);
        for (let key of Object.keys(json)) {
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

  get WSCommandNotFoundError() {
    return WSCommandNotFoundError;
  }
};

class WSCommandNotFoundError extends Error {}
