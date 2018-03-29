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

  init(params, module) {
    var buf = new Uint8Array(13);
    buf[0] = module;
    buf[1] = parseInt(params.tx);
    buf[2] = parseInt(params.rx);

    buf[3] = params.baud >> (3*8);
    buf[4] = params.baud >> (2*8);
    buf[5] = params.baud >> (1*8);
    buf[6] = params.baud;

    if (params.stop === 1) {
      buf[7] = 1;
    } else if (params.stop === 1.5) {
      buf[7] = 2;
    } else if (params.stop === 2) {
      buf[7] = 3;
    } else if (params.stop === 0) {
      buf[7] = 0;
    } else {
      //ここには来ない
      throw new Error("uart: invalid stop bits")
    }

    buf[8] = params.bits;

    if (params.parity === "even") {
      buf[9] = 2;
    } else if (params.parity === "odd") {
      buf[9] = 3;
    }

    if (params.flowcontrol === "rts") {
      buf[10] = 2;
    } else if (params.flowcontrol === "cts") {
      buf[10] = 3;
    } else if (params.flowcontrol === "rts-cts") {
      buf[10] = 4;
    }

    if(params.rts !== null)buf[11] = params.rts;
    if(params.cts !== null)buf[12] = params.cts;
    
    this.sendCommand(this._CommandInit, buf);
  }

  deinit(params, module) {
    var buf = new Uint8Array(1);
    buf[0] = module;
    this.sendCommand(this._CommandDeinit, buf);
  }

  send(params, module) {
    var buf = new Uint8Array(1 + params.data.length);
    buf[0] = module;
    buf.set(params.data, 1);
    this.sendCommand(this._CommandSend, buf);
  }

  parseFromJson(json) {
    // 0~2
    for (var i=0; i<3;i++) {
      var module = json["uart"+i];
      if (module === undefined) {
        continue;
      }
      let schemaData = [
        {uri : "/request/uart/init",       onValid: this.init},
        {uri : "/request/uart/send",       onValid: this.send},
        {uri : "/request/uart/deinit",     onValid: this.deinit},
      ];
      let res = this.validateCommandSchema(schemaData, module, "uart"+i, i);

      if(res.valid === 0){
        if(res.invalidButLike.length > 0) {
          throw new Error(res.invalidButLike[0].message);
        }else{
          throw new Error(`[uart${i}]unknown command`);
        }
      }
      //
      //
      // if (typeof(module) !== "object") {
      //   continue;
      // }
      // if (module.tx || module.rx) {
      //   if (this.isValidIO(module.tx) && this.isValidIO(module.rx)) {
      //     this.init(i, module);
      //   } else {
      //     throw new Error("uart: tx rx is not valid obniz io")
      //   }
      // }
      // if (module.data) {
      //   this.send(i, module.data);
      // }
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
    } else {
      super.notifyFromBinary(objToSend, func, payload)
    }
  }
};
