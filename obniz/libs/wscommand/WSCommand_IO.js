const COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_HIGH = 1
const COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_LOW = 2
const COMMAND_IO_ERRORS_IO_TOO_LOW  = 3
const COMMAND_IO_ERRORS_IO_TOO_HIGH = 4

const COMMAND_IO_ERROR_MESSAGES = {
  0: 'unknown error',
  1: 'heavy output. output voltage is too low when driving high',
  2: 'heavy output. output voltage is too high when driving low',
  3: 'output voltage is too low when driving high. io state has changed output to input',
  4: 'output voltage is too high when driving low. io state has changed output to input',
}

class WSCommand_IO extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 2;

    this._CommandOutput           = 0;
    this._CommandInputStream      = 1;
    this._CommandInputOnece       = 2;
    this._CommandOutputType       = 3;
    this._CommandPullResisterType = 4;
  }

  // Commands

  output(id, value) {
    var buf = new Uint8Array([id, value]);
    this.sendCommand(this._CommandOutput, buf);
  }

  input(id, isStream) {
    var buf = new Uint8Array([id]);
    this.sendCommand( isStream ? this._CommandInputStream : this._CommandInputOnece, buf);
  }

  outputtype(id, type) {
    var buf = new Uint8Array(2);
    buf[0] = id;
    if (type === "push-pull5v") {
      buf[1] = 0;
    } else if (type === "push-pull3v") {
      buf[1] = 2;
    } else if (type === "open-drain") {
      buf[1] = 3;
    } else {
      return "io unknown outputtype: "+type;
    }
    this.sendCommand(this._CommandOutputType, buf);
  }

  pulltype(id, type) {
    var buf = new Uint8Array(2);
    buf[0] = id;
    if (type === "float") {
      buf[1] = 0;
    } else if (type === "pull-up3v") {
      buf[1] = 1;
    } else if (type === "pull-down") {
      buf[1] = 2;
    } else if (type === "pull-up5v") {
      buf[1] = 3;
    } else {
      return "io unknown pull_type: "+type;;
    }
    this.sendCommand(this._CommandPullResisterType, buf);
  }

  parseFromJson(json) {
    for (var i=0; i<=11;i++) {
      var module = json["io"+i];
      if (module === null) {
        // this.direction(i, );
        continue;
      }
      if (typeof(module) == "object") {
        if (typeof(module.direction) == "string") {
          if (module.direction === "input") {
            this.input(i, (module.stream === true));
          } else if (module.direction === "output") {
            this.output(i, (module.value) ? 1 : 0);
          } else {
            // unknwon direction
            throw new Error("io: unknown direction:"+module.direction)
          }
        } else if(module.direction) {
          // invalid type
            throw new Error("io: invalid type. io.direction must be string")
        }
        
        if (module.output_type) {
          var err = this.outputtype(i, module.output_type);
          if (err) {
            throw new Error(err);
          }
        }
        if (module.pull_type) {
          var err = this.pulltype(i, module.pull_type);
          if (err) {
            throw new Error(err);
          }
        }
        continue;
      }
      if (typeof module === "string" ) {
        if (module === "get") {
          this.input(i, false);
        } else {
          throw new Error("io: unknown command")
        }
      } else if (typeof module === "number") {
        var value = parseInt(module);
        this.output(i, (value !== 0) ? 1 : 0);
      }else if (typeof module === "boolean") {
        this.output(i, module ? 1 : 0);
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {

    let esperr;
    let module_index;
    let err;
    let ref_func_id;
    let envelopFunc;

    switch(func) {
      case this._CommandInputStream:
      case this._CommandInputOnece:
        for (var i=0; i<payload.byteLength; i+=2) {
          objToSend["io"+payload[i]] = (payload[i+1] > 0);
        }
        break;

      case this.COMMAND_FUNC_ID_ERROR:
        if (payload.byteLength == 4) {
          esperr = payload[0];
          err = payload[1];
          ref_func_id = payload[2];
          module_index = payload[3];
  
          switch(err) {
            case COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_HIGH:
              envelopFunc = this.envelopWarning;
              break;
            case COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_LOW:
              envelopFunc = this.envelopWarning;
              break;
            case COMMAND_IO_ERRORS_IO_TOO_LOW:
              envelopFunc = this.envelopError;
              break;
            case COMMAND_IO_ERRORS_IO_TOO_HIGH:
              envelopFunc = this.envelopError;
              break;
            default:
              super.notifyFromBinary(objToSend, func, payload);
              break;
          }
          if (envelopFunc)
            envelopFunc(objToSend, `io${module_index}`, { message: COMMAND_IO_ERROR_MESSAGES[err] })
        } else {
          super.notifyFromBinary(objToSend, func, payload);
        }
        break;

      default:
        // unknown
        break;
    }
  }
};