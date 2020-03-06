/**
 * @packageDocumentation
 * @ignore
 */
class JsonBinaryConverter {
  public static convertFromBinaryToJson(schema: any, binary: any) {
    const types: any = {
      "hex": this.hexFromBinary.bind(this),
      "uuid": this.uuidFromBinary.bind(this),
      "number": this.numberFromBinary.bind(this),
      "signed number": this.signedNumberFromBinary.bind(this),
      "int": this.numberFromBinary.bind(this),
      "char": this.numberFromBinary.bind(this),
      "enum": this.enumFromBinary.bind(this),
      "dataArray": this.dataArrayFromBinary.bind(this),
    };
    const json: any = {};
    let count: any = 0;
    for (let i = 0; i < schema.length; i++) {
      const data: any = binary.slice(count, schema[i].length ? count + schema[i].length : undefined);
      json[schema[i].name] = types[schema[i].type](data, schema[i]);

      if (schema[i].length) {
        count += schema[i].length;
      } else {
        break;
      }
    }
    return json;
  }

  public static hexFromBinary(data: any, schema?: any) {
    let str: any = "";
    for (let i = 0; i < data.length; i++) {
      if (schema.endianness && schema.endianness === "little") {
        str = ("00" + data[i].toString(16)).slice(-2) + str;
      } else {
        str = str + ("00" + data[i].toString(16)).slice(-2);
      }
    }
    return str;
  }

  public static uuidFromBinary(data: any) {
    const len: any = data[0] * 16 + data[1];
    if (len === 0) {
      return null;
    }
    const uuidData: any = data.slice(2);
    let str: any = "";
    for (let i = 0; i < len; i++) {
      str = ("00" + uuidData[i].toString(16)).slice(-2) + str;
    }
    return str;
  }

  public static signedNumberFromBinary(data: any) {
    // big adian
    let val: any = data[0] & 0x7f;
    for (let i = 1; i < data.length; i++) {
      val = val * 256 + data[i];
    }
    if ((data[0] & 0x80) !== 0) {
      val = val - Math.pow(2, data.length * 8 - 1);
    }
    return val;
  }

  public static numberFromBinary(data: any) {
    // big adian
    let val: any = 0;
    for (let i = 0; i < data.length; i++) {
      val = val * 256 + data[i];
    }
    return val;
  }

  public static keyForVal(enumvals: any, val: any) {
    return Object.keys(enumvals).filter((k: any) => {
      return enumvals[k] === val;
    })[0];
  }

  public static enumFromBinary(data: any, schema?: any) {
    const enumVals: any = schema.enum;
    let val: any = this.numberFromBinary(data);

    if (schema.flags === true) {
      const temp: any = [];
      for (const key of Object.keys(enumVals)) {
        const flag: any = enumVals[key] & val;
        if (flag) {
          temp.push(key);
        }
      }
      val = temp;
    } else {
      const tmp: any = this.keyForVal(enumVals, val);
      if (tmp) {
        val = tmp;
      }
    }
    return val;
  }

  public static dataArrayFromBinary(data: any) {
    const arr: any = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
      arr[i] = data[i];
    }
    return arr;
  }

  public static createSendBuffer(schema: any, data: any) {
    const array: any = [];
    for (let i = 0; i < schema.length; i++) {
      const schemaRow: any = schema[i];

      let row: any;
      if (Array.isArray(schemaRow)) {
        for (const key in schemaRow) {
          const customSchemaRow: any = Object.assign({}, schemaRow[key], {
            required: true,
          });
          row = this.analyzeSchema(data, customSchemaRow);
          if (row) {
            break;
          }
        }
      } else {
        row = this.analyzeSchema(data, schemaRow);
      }

      Array.prototype.push.apply(array, row);
    }
    return new Uint8Array(array);
  }

  public static analyzeSchema(allData: any, schemaRow: any) {
    const types: any = {
      hex: this.hexToBinary.bind(this),
      uuid: this.uuidToBinary.bind(this),
      int: this.intToBinary.bind(this),
      char: this.charToBinary.bind(this),
      dataArray: this.dataArrayToBinary.bind(this),
      enum: this.enumToBinary.bind(this),
      string: this.stringToBinary.bind(this),
      text: this.stringToBinary.bind(this),
      flag: this.flagToBinary.bind(this),
    };

    let val: any;
    if (schemaRow.path) {
      val = this.getProperty(allData, schemaRow.path);
    }
    if (val === undefined && schemaRow.required) {
      return null;
    }
    if (val === undefined && schemaRow.default) {
      val = schemaRow.default;
    }

    const row: any = types[schemaRow.type](val, schemaRow);

    if (schemaRow.length && row.length !== schemaRow.length) {
      console.log("JSON->BINARY SCHEMA ERROR: (", val, ")", schemaRow);
    }

    return row;
  }

  public static getProperty(object: any, path: any) {
    if (path === "" || path === undefined) {
      return object;
    }
    if (typeof path === "string") {
      path = path.split(".");
    }
    if (!Array.isArray(path)) {
      path = [path];
    }

    let index: any = 0;
    const length: any = path.length;

    while (index < length) {
      object = object[path[index++]];
      if (object === undefined) {
        return undefined;
      }
    }
    return index && index === length ? object : undefined;
  }

  public static hexToBinary(data: any, schema?: any) {
    const array: any = [];
    const hex: any = data.toLowerCase().replace(/[^0-9abcdef]/g, "");
    for (let i = 0; i < hex.length / 2; i++) {
      array[i] = parseInt(hex[i * 2] + hex[i * 2 + 1], 16);
    }
    if (schema && schema.endianness && schema.endianness === "little") {
      array.reverse();
    }
    return array;
  }

  public static intToBinary(data: any) {
    const array: any = [];
    array[0] = (data >> (8 * 3)) & 0xff;
    array[1] = (data >> (8 * 2)) & 0xff;
    array[2] = (data >> (8 * 1)) & 0xff;
    array[3] = (data >> (8 * 0)) & 0xff;
    return array;
  }

  public static charToBinary(data: any) {
    const array: any = [];
    array[0] = data & 0xff;
    return array;
  }

  public static dataArrayToBinary(data: any) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    return data;
  }

  public static uuidToBinary(data: any) {
    const uuid: any = this.hexToBinary(data);
    uuid.reverse(); // big endianness -> little endianness;
    const length: any = uuid.length;

    const array: any = [];

    array[0] = (length >> (8 * 1)) & 0xff;
    array[1] = (length >> (8 * 0)) & 0xff;

    Array.prototype.push.apply(array, uuid);
    for (let i = array.length; i < 16 + 2; i++) {
      array[i] = 0;
    }

    return array;
  }

  public static enumToBinary(data: any, schema?: any) {
    const array: any = [];
    array.push(schema.enum[data]);
    return array;
  }

  public static flagToBinary(data: any, schema?: any) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    const flags: any = schema.flags;
    let value: any = 0;
    for (const key in flags) {
      if (data.includes(flags[key])) {
        value += parseInt(key);
      }
    }
    const array: any = [];
    const length: any = schema.length || 1;
    for (let i = length - 1; i >= 0; i--) {
      array.push((value >> (i * 8)) & 0xff);
    }

    return array;
  }

  public static stringToBinary(data: any) {
    return new Uint8Array(Buffer.from(data, "utf8"));
  }
}

export default JsonBinaryConverter;
