class WSCommand_I2C extends WSCommand {
  
  constructor(delegate) {
    super(delegate);
    this.module = 6;

    this._CommandInit     = 0
    this._CommandDeinit   = 1
    this._CommandWrite    = 2
    this._CommandRead     = 3
    this._CommandSlvWritten = 4
  }

  // Commands

  initMaster(params, module) {

    var mode = 0;
    var sda = parseInt(params.sda);
    var scl = parseInt(params.scl);
    var clock = parseInt(params.clock);

    var buf = new Uint8Array(8 );
    buf[0] = module;
    buf[1] = mode;
    buf[2] = sda;
    buf[3] = scl;
    buf[4] = clock >> (3*8);
    buf[5] = clock >> (2*8);
    buf[6] = clock >> (1*8);
    buf[7] = clock;

    this.sendCommand(this._CommandInit, buf);
  }

  initSlave(params, module) {

    var mode = 1;
    var sda = parseInt(params.sda);
    var scl = parseInt(params.scl);
    var clock = 0;

    var addressLength = params.slave_address_length;
    var address = params.slave_address;
    if (address > 0x7F) {
      addressLength = 10;
    }

    var buf = new Uint8Array( 11 );
    buf[0] = module;
    buf[1] = mode;
    buf[2] = sda;
    buf[3] = scl;
    buf[4] = clock >> (3*8);
    buf[5] = clock >> (2*8);
    buf[6] = clock >> (1*8);
    buf[7] = clock;
    buf[8] = addressLength;
    buf[9] = address >> 8;
    buf[10] = address;

    this.sendCommand(this._CommandInit, buf);
  }

  deinit(params, module) {
    var buf = new Uint8Array([module]);
    this.sendCommand(this._CommandDeinit, buf);
  }

  write(params, module) {
    let address = parseInt(params.address);

    if ( params.address_bits === 10 || address > 0x7F) {
      address = address | 0x8000; // mark 10bit mode
    }
    var buf = new Uint8Array(3 + params.data.length);
    buf[0] = module;
    buf[1] = address >> 8;
    buf[2] = address;
    buf.set(params.data, 3);
    this.sendCommand(this._CommandWrite, buf);
  }

  read(params, module) {
    let read_length = params.read;
    var buf = new Uint8Array(7);
    buf[0] = module;
    buf[1] = params.address >> 8;
    buf[2] = params.address;
    buf[3] = read_length >> (3*8);
    buf[4] = read_length >> (2*8);
    buf[5] = read_length >> (1*8);
    buf[6] = read_length;
    this.sendCommand(this._CommandRead, buf);
  }

  parseFromJson(json) {
    // 0
    for (var i=0; i<1;i++) {
      var module = json["i2c"+i];
      if (module === undefined) {
        continue;
      }

      let schemaData = [
        {uri : "/request/i2c/init_master",  onValid: this.initMaster},
        {uri : "/request/i2c/init_slave",   onValid: this.initSlave},
        {uri : "/request/i2c/write",        onValid: this.write},
        {uri : "/request/i2c/read",         onValid: this.read},
        {uri : "/request/i2c/deinit",       onValid: this.deinit},
      ];
      let res = this.validateCommandSchema(schemaData, module, "i2c"+i, i);

      if(res.valid === 0){
        if(res.invalidButLike.length > 0) {
          throw new Error(res.invalidButLike[0].message);
        }else{
          throw new Error(`[i2c${i}]unknown command`);
        }
      }
      //
      // if (typeof(module) != "object") {
      //   continue;
      // }
      // if (typeof module.mode === "string") {
      //   if (module.mode === "master" || module.mode === "slave") {
      //     this.init(i, module);
      //   } else {
      //     throw new Error(`i2c: invalid mode ${module.mode}. master/slave is available`);
      //   }
      // }
      //
      // if (typeof(module.address) === "number") {
      //   var address = parseInt(module.address);
      //   if (isNaN(address)) {
      //     throw Error("i2c: invalid address " + module.address)
      //   }
      //   if (module.address_bits === 10) {
      //     address = address | 0x8000;
      //   }
      //   if (module.data) {
      //     this.write(i, address, module.data);
      //   }
      //   if (typeof(module.read) == "number") {
      //     this.read(i, address, module.read);
      //   }
      // }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    if (func === this._CommandRead && payload.byteLength > 3) {
      var module_index = payload[0];
      var address = (payload[1] << 8) + payload[2];

      var arr = new Array(payload.byteLength - 3);
      for (var i=0; i<arr.length;i++) {
        arr[i] = payload[i + 3];
      }
      
      objToSend["i2c"+module_index] = {
        mode: "master",
        address: address,
        data: arr
      };
    } else if (func === this._CommandSlvWritten && payload.byteLength > 4) {
      var module_index = payload[0];
      var address_bit_length = payload[1]
      var address = (payload[2] << 8) + payload[3];

      var arr = new Array(payload.byteLength - 4);
      for (var i=0; i<arr.length; i++) {
        arr[i] = payload[i + 4];
      }

      objToSend["i2c"+module_index] = {
        mode: "slave",
        is_fragmented: true,
        address: address,
        data: arr
      };
    } else if(func === this.COMMAND_FUNC_ID_ERROR && payload.byteLength > 2){
      const esperr = payload[0];
      const err = payload[1];
      const ref_func_id = payload[2];

      if (ref_func_id === this._CommandWrite || ref_func_id === this._CommandRead) {
        let reason = '' + ( (ref_func_id === this._CommandWrite) ? 'writing' : 'reading' ) + ' error. ';
        if (err === 7) { // in fact. it is 0x107. but truncated
          reason += 'Communication Timeout. Maybe, target is not connected.'
        } else if (err === 255) {
          reason += 'Communication Failed. Maybe, target is not connected.'
        }
        this.envelopError(objToSend, `i2c0`, { message: reason })
      } else {
        super.notifyFromBinary(objToSend, func, payload)
      }
    } else {
      super.notifyFromBinary(objToSend, func, payload)
    }
  }
}