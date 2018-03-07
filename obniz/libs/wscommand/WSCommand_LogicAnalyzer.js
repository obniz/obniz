class WSCommand_LogicAnalyzer extends WSCommand {
  
  constructor(delegate) {
    super(delegate);
    this.module = 10;

    this._CommandInit     = 0
    this._CommandDeinit   = 1
    this._CommandRecv     = 2
  }

  // Commands

  init(io, intervalUsec, durationUsec, matchValue, matchCount) {
    var buf = new Uint8Array(12);
    buf[0] = 1;
    buf[1] = io;
    buf[2] = intervalUsec >> (8*3);
    buf[3] = intervalUsec >> (8*2);
    buf[4] = intervalUsec >> (8*1);
    buf[5] = intervalUsec;
    buf[6] = durationUsec >> (8*3);
    buf[7] = durationUsec >> (8*2);
    buf[8] = durationUsec >> (8*1);
    buf[9] = durationUsec;
    buf[10] = matchValue;
    buf[11] = matchCount;
    this.sendCommand(this._CommandInit, buf);
  }

  deinit() {
    var buf = new Uint8Array(0);
    this.sendCommand(this._CommandDeinit, buf);
  }

  parseFromJson(json) {
    var module = json["logic_analyzer"];
    if (module === null) {
      this.deinit();
      return;
    }
    if (typeof(module) == "object") {
      if (typeof(module.io) == "object" && typeof(module.io[0]) == "number" && typeof(module.interval) == "number" && typeof(module.duration == "number")) {
        var intervalUSec = parseInt(module.interval * 1000);
        if(isNaN(intervalUSec)) {
          return;
        }
        var duration = parseInt(module.duration * 1000);
        if(isNaN(duration)) {
          return;
        }
        var trigerLevel = 0;
        var trigerSamples = 0;

        if (module.triger && typeof module.triger == "object") {
          let triger = module.triger;
          trigerLevel = (triger.value) ? 1 : 0;
          if (typeof(triger.samples) == "number" && triger.samples > 0 && triger.samples <= 0xFF) {
            trigerSamples = parseInt(triger.samples);
          }
        }
        
        this.init(module.io[0], intervalUSec, duration, trigerLevel, trigerSamples);
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    if (func === this._CommandRecv) {
      var arr = new Array(payload.byteLength);
      for (var i=0; i<payload.byteLength;i++) {
        arr[i] = payload[i];
      }
      objToSend["logic_analyzer"] = {
        data: arr
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload)
    }
  }
}
