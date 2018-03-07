class WSCommand_AD extends WSCommand {
  
  constructor(delegate) {
    super(delegate);
    this.module = 7;

    this._CommandInitNormalInterval     = 0
    this._CommandDeinit       = 1
    this._CommandNotifyValue  = 2
    this._CommandDoOnece      = 3
  }

  // Commands

  init(module) {
    var buf = new Uint8Array([module]);
    this.sendCommand(this._CommandInitNormalInterval, buf);
  }

  deinit(module) {
    var buf = new Uint8Array([module]);
    this.sendCommand(this._CommandDeinit, buf);
  }

  onece(module) {
    var buf = new Uint8Array([module]);
    this.sendCommand(this._CommandDoOnece, buf);
  }

  parseFromJson(json) {
    for (var i=0; i<12;i++) {
      var module = json["ad"+i];
      if (module === null) {
        this.deinit(i);
        continue;
      }
      // if (typeof module == "string") {
      //   if (module === "get") {
      //     this.onece(i);
      //   } else if (module === "stream") {
      //     this.init(i);
      //   }
      // }
      if (typeof module != "object") {
        continue;
      }
      if (module.stream === true) {
        this.init(i);
      } else {
        this.onece(i);
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    if (func === this._CommandNotifyValue) {
      for (var i=0; i<payload.byteLength; i+=3) {
        var value = (payload[i+1] << 8) + payload[i+2];
        value = value / 100.0;
        objToSend["ad"+payload[i]] = value;
      }
    } else {
      super.notifyFromBinary(objToSend, func, payload)
    }
  }
}
