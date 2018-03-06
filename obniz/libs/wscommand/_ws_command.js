class WSCommand {

  constructor(obj) {

    //constants
    this.COMMAND_FUNC_ID_ERROR = 0xFF
    this.ioNotUsed = 0xFF;
  }

  static get CommandClasses() {
    return [
      WSCommand_System,
      // WSCommand_Directive,
      WSCommand_IO,
      WSCommand_PWM,
      WSCommand_UART,
      WSCommand_AD,
      WSCommand_SPI,
      WSCommand_I2C,
      WSCommand_LogicAnalyzer,
      WSCommand_Display,
      WSCommand_Switch,
      WSCommand_Ble,
      WSCommand_Measurement
    ];
  }
  
  static framed(module, func, payload) {
    var payload_length = 0;
    if (payload) {
      payload_length = payload.length;
    }
    var length_type;
    if (payload_length <= 0x3F) {
      length_type = 0;
    } else if (payload_length <= 0x3FFF) {
      length_type = 1;
    } else if (payload_length <= 0x3FFFFFFF) {
      length_type = 2;
    } else {
      throw new Error("too big payload");
      return null;
    }
    var length_extra_bytse = (length_type == 0) ? 0 : ( (length_type == 1) ? 1 : 3 );
    var header_length = 3 + length_extra_bytse;
    var result = new Uint8Array(header_length + payload_length);
    var index = 0;
    result[index++] = module & 0x7F;
    result[index++] = func;
    result[index++] = (length_type << 6) | (payload_length >> (length_extra_bytse*8));
    while(length_extra_bytse > 0) {
      length_extra_bytse--;
      result[index++] = payload_length >> (length_extra_bytse*8);
    }
    if (payload_length == 0) {
      return result;
    } else {
      result.set(payload, header_length);
      return result;
    }
  }

  static compress(wscommands, json) {
    var ret;
    function append(module, func, payload) {
      var frame = WSCommand.framed(module, func, payload);
      if (ret) {
        var combined = new Uint8Array(ret.length + frame.length);
        combined.set(ret, 0);
        combined.set(frame, ret.length);
        ret = combined;
      } else {
        ret = frame;
      }
    }
    for (let i=0; i<wscommands.length; i++) {
      const wscommand = wscommands[i];
      wscommand.parsed = append;
      wscommand.parseFromJson(json);
    }
    return ret;
  }

  sendCommand(func, payload) {
    this.parsed(this.module, func, payload);
  }

  parseFromJson(json) {

  }

  notifyFromBinary(objToSend, module, func, payload) {
    
  }

  envelopWarning(objToSend, module_key, obj) {
    if (!objToSend[module_key]) objToSend[module_key] = {};
    if (!objToSend[module_key].warnings) objToSend[module_key].warnings = [];
    objToSend[module_key].warnings.push(obj);
  }

  envelopError(objToSend, module_key, obj) {
    if (!objToSend[module_key]) objToSend[module_key] = {};
    if (!objToSend[module_key].errors) objToSend[module_key].errors = [];
    objToSend[module_key].errors.push(obj);
  }

  isValidIO(io) {
    return (typeof(io) === "number" && 0 <= io && io <= 11) 
  }
}