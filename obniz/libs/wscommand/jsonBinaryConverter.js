class JsonBinaryConverter {

  static convertFromBinaryToJson(schema, binary) {
    var types = {
      hex: this.hexFromBinary.bind(this),
      uuid: this.uuidFromBinary.bind(this),
      number: this.numberFromBinary.bind(this),
      "signed number": this.signedNumberFromBinary.bind(this),
      int: this.numberFromBinary.bind(this),
      char: this.numberFromBinary.bind(this),
      enum: this.enumFromBinary.bind(this),
      dataArray: this.dataArrayFromBinary.bind(this)
    };
    var json = {};
    var count = 0;
    for (var i = 0; i < schema.length; i++) {
      var data = binary.slice(count, schema[i].length ? count + schema[i].length : undefined);
      json[schema[i].name] = types[schema[i].type](data, schema[i]);

      if (schema[i].length) {
        count += schema[i].length;
      } else {
        break;
      }
    }
    return json;
  }

  static hexFromBinary(data, schema) {
    var str = "";
    for (var i = 0; i < data.length; i++) {
      if (schema.endianness && schema.endianness === "little") {
        str = ("00" + data[i].toString(16)).slice(-2) + str;
      } else {
        str = str + ("00" + data[i].toString(16)).slice(-2);
      }
    }
    return str;
  }

  static uuidFromBinary(data) {
    var len = data[0] * 16 + data[1];
    if (len === 0) {
      return null;
    }
    var uuidData = data.slice(2);
    var str = "";
    for (var i = 0; i < len; i++) {
      str = ("00" + uuidData[i].toString(16)).slice(-2) + str;
    }
    return str;
  }

  static signedNumberFromBinary(data, schema) {  //big adian
    var val = data[0] & 0x7F;
    for (var i = 1; i < data.length; i++) {
      val = val * 256 + data[i];
    }
    if ((data[0] & 0x80) !== 0) {
      val = val - Math.pow(2, (data.length * 8 - 1));
    }
    return val;
  }

  static numberFromBinary(data) {  //big adian
    var val = 0;
    for (var i = 0; i < data.length; i++) {
      val = val * 256 + data[i];
    }
    return val;
  }

  static keyForVal(enumvals, val) {
    return Object.keys(enumvals).filter(function (k) {
      return enumvals[k] === val;
    })[0];
    return undefined;
  }

  static enumFromBinary(data, schema) {
    let enumVals = schema.enum;
    let val = this.numberFromBinary(data);

    if (schema.flags === true) {
      let temp = [];
      for (let key of Object.keys(enumVals)) {
        let flag = (enumVals[key] & val);
        if (flag) {
          temp.push(key);
        }
      }
      val = temp;

    } else {
      let tmp = this.keyForVal(enumVals, val);
      if (tmp) {
        val = tmp;
      }
    }
    return val;
  }

  static dataArrayFromBinary(data) {
    var arr = new Array(data.length);
    for (var i = 0; i < data.length; i++) {
      arr[i] = data[i];
    }
    return arr;
  }

  static createSendBuffer(schema, data) {
    var array = [];
    for (var i = 0; i < schema.length; i++) {
      var schemaRow = schema[i];

      var row = undefined;
      if (Array.isArray(schemaRow)) {
        for (var key in schemaRow) {
          var customSchemaRow = Object.assign({}, schemaRow[key], {required: true});
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

  static analyzeSchema(allData, schemaRow) {
    var types = {
      hex: this.hexToBinary.bind(this),
      uuid: this.uuidToBinary.bind(this),
      int: this.intToBinary.bind(this),
      char: this.charToBinary.bind(this),
      dataArray: this.dataArrayToBinary.bind(this),
      enum: this.enumToBinary.bind(this),
      string: this.stringToBinary.bind(this),
      text: this.stringToBinary.bind(this),
      flag: this.flagToBinary.bind(this)
    };

    var val = undefined;
    if (schemaRow.path) {
      val = this.getProperty(allData, schemaRow.path);
    }
    if (val === undefined && schemaRow.required) {
      return null;
    }
    if (val === undefined && schemaRow.default) {
      val = schemaRow.default;
    }


    var row = types[schemaRow.type](val, schemaRow);

    if (schemaRow.length && row.length !== schemaRow.length) {
      console.log("JSON->BINARY SCHEMA ERROR: (", val, ")", schemaRow);
    }

    return row;
  }


  static getProperty(object, path) {
    if (path === "" || path === undefined) {
      return object;
    }
    if (typeof path === 'string')
      path = path.split('.');
    if (!Array.isArray(path))
      path = [path];

    var index = 0,
        length = path.length;

    while (index < length) {
      object = object[path[index++]];
      if (object === undefined) {
        return undefined;
      }
    }
    return (index && index === length) ? object : undefined;

  }

  static hexToBinary(data, schema) {
    var array = [];
    var hex = data.toLowerCase().replace(/[^0-9abcdef]/g, '');
    for (var i = 0; i < hex.length / 2; i++) {
      array[i] = parseInt(hex[i * 2] + hex[i * 2 + 1], 16);
    }
    if (schema && schema.endianness && schema.endianness === "little") {
      array.reverse();
    }
    return array;
  }


  static intToBinary(data) {
    var array = [];
    array[0] = (data >> 8 * 3) & 0xFF;
    array[1] = (data >> 8 * 2) & 0xFF;
    array[2] = (data >> 8 * 1) & 0xFF;
    array[3] = (data >> 8 * 0) & 0xFF;
    return array;
  }

  static charToBinary(data) {
    var array = [];
    array[0] = data & 0xFF;
    return array;
  }

  static dataArrayToBinary(data) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    return data;
  }

  static uuidToBinary(data) {

    var uuid = this.hexToBinary(data)
    uuid.reverse();  //big endianness -> little endianness;
    var length = uuid.length;

    var array = [];

    array[0] = (length >> 8 * 1) & 0xFF;
    array[1] = (length >> 8 * 0) & 0xFF;

    Array.prototype.push.apply(array, uuid);
    for (var i = array.length; i < 16 + 2; i++) {
      array[i] = 0;
    }

    return array;
  }

  static enumToBinary(data, schema) {
    var array = [];
    array.push(schema.enum[data]);
    return array;
  }


  static flagToBinary(data, schema) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    var flags = schema.flags;
    var value = 0;
    for (var key in flags) {
      if (data.includes(flags[key])) {
        value += parseInt(key);
      }
    }
    var array = [];
    let length = schema.length || 1;
    for (let i = length - 1; i >= 0; i--) {
      array.push((value >> i) & 0xFF);
    }

    return array;
  }

  static stringToBinary(data) {
    var array = [];
    return new Uint8Array(Buffer(data, 'utf8'));

  }
}

module.exports = JsonBinaryConverter;