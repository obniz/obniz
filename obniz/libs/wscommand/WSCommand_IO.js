const COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_HIGH = 1
const COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_LOW = 2
const COMMAND_IO_ERRORS_IO_TOO_LOW  = 3
const COMMAND_IO_ERRORS_IO_TOO_HIGH = 4
const COMMAND_IO_ERRORS_IO_FORCE_RELEASED = 0xF0

const COMMAND_IO_ERROR_MESSAGES = {
  0: 'unknown error',
  1: 'heavy output. output voltage is too low when driving high',
  2: 'heavy output. output voltage is too high when driving low',
  3: 'output voltage is too low when driving high. io state has changed output to input',
  4: 'output voltage is too high when driving low. io state has changed output to input',
}

const COMMAND_IO_MUTEX_NAMES = {
  1: 'io.input',
  2: 'io.output',
  3: 'pwm',
  4: 'uart',
  5: 'i2c',
  6: 'spi',
  7: 'LogicAnalyzer',
  8: 'Measure'
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
    
    if (func === this._CommandInputStream || func === this._CommandInputOnece) {
      for (var i=0; i<payload.byteLength; i+=2) {
        objToSend["io"+payload[i]] = (payload[i+1] > 0);
      }

    } else if (func === this.COMMAND_FUNC_ID_ERROR && payload.byteLength >= 4) {
      const esperr = payload[0];
      const err = payload[1];
      const ref_func_id = payload[2];
      const module_index = payload[3];

      if (err === COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_HIGH || err === COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_LOW) {
        this.envelopWarning(objToSend, `io${module_index}`, { message: COMMAND_IO_ERROR_MESSAGES[err] })

      } else if (err === COMMAND_IO_ERRORS_IO_TOO_LOW || err === COMMAND_IO_ERRORS_IO_TOO_HIGH)  {
        this.envelopError(objToSend, `io${module_index}`, { message: COMMAND_IO_ERROR_MESSAGES[err] })

      } else if (err === COMMAND_IO_ERRORS_IO_FORCE_RELEASED && payload.byteLength >= 6){
        const oldMutexOwner = payload[4];
        const newMutexOwner = payload[5];
        this.envelopWarning(objToSend, 'debug', { message: `io${module_index} binded "${COMMAND_IO_MUTEX_NAMES[oldMutexOwner]}" was stopped. "${COMMAND_IO_MUTEX_NAMES[newMutexOwner]}" have started using this io.` })
      }
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
};