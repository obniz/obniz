class WSCommand_UART extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 4;

    this._CommandInit     = 0;
    this._CommandDeinit   = 1;
    this._CommandSend     = 2;
    this._CommandRecv     = 3;
  }

  // Commands

  init(module, obj) {
    var buf = new Uint8Array(13);
    buf[0] = module;
    buf[1] = parseInt(obj.tx);
    buf[2] = parseInt(obj.rx);
    if (typeof(obj.baud) === "number") {
      var baud = parseInt(obj.baud);
      if (!isNaN(baud)) {
        buf[3] = baud >> (3*8);
        buf[4] = baud >> (2*8);
        buf[5] = baud >> (1*8);
        buf[6] = baud;
      }
    }
    if (typeof(obj.stop) === "number") {
      if (obj.stop === 1) {
        buf[7] = 1;
      } else if (obj.stop === 1.5) {
        buf[7] = 2;
      } else if (obj.stop === 2) {
        buf[7] = 3;
      } else {
        // ???
      }
    }
    if (typeof(obj.bits) === "number") {
      var bits = parseInt(obj.bits);
      if (5 <= bits && bits <= 8) {
        buf[8] = bits;
      } else {
        // ???
      }
    }
    if (obj.parity === "even") {
      buf[9] = 2;
    } else if (obj.parity === "odd") {
      buf[9] = 3;
    }
    if (obj.flowcontrol === "rts") {
      buf[10] = 2;
    } else if (obj.flowcontrol === "cts") {
      buf[10] = 3;
    } else if (obj.flowcontrol === "rts-cts") {
      buf[10] = 4;
    }
    if (typeof(obj.rts) === "number") {
      buf[11] = parseInt(obj.rts);
    }
    if (typeof(obj.cts) === "number") {
      buf[12] = parseInt(obj.cts);
    }
    
    this.sendCommand(this._CommandInit, buf);
  }

  deinit(module) {
    var buf = new Uint8Array(1);
    buf[0] = module;
    this.sendCommand(this._CommandDeinit, buf);
  }

  send(module, data) {
    var buf = new Uint8Array(1 + data.length);
    buf[0] = module;
    buf.set(data, 1);
    this.sendCommand(this._CommandSend, buf);
  }

  parseFromJson(json) {
    // 0~2
    for (var i=0; i<3;i++) {
      var module = json["uart"+i];
      if (module === null) {
        this.deinit(i);
        continue;
      }
      if (typeof(module) !== "object") {
        continue;
      }
      if (typeof(module.tx) === "number" && typeof(module.rx) === "number") {
        this.init(i, module);
      }
      if (module.data) {
        this.send(i, module.data);
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    if (func === this._CommandRecv && payload.byteLength > 1) {
      var module_index = payload[0];
      var arr = new Array(payload.byteLength - 1);
      for (var i=0; i<arr.length;i++) {
        arr[i] = payload[i + 1];
      }

      objToSend["uart"+module_index] = {
        data: arr
      };
    }
  }
};
