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

  init(module, obj) {

    var mode;
    if (obj.mode === "master") { 
      mode = 0;
    } else if (obj.mode === "slave") {
      mode = 1;
    } else {
      throw new Error("i2c0 unknown mode")
    }

    var sda = parseInt(obj.sda);
    var scl = parseInt(obj.scl);
    if (this.isValidIO(sda) == false || this.isValidIO(scl) == false) {
      throw new Error("i2c: invalid sda/scl. please specify io number.")
    }
    var clock = 0;
    if (mode === 0) {
      clock = parseInt(obj.clock);
      if (isNaN(clock)) {
        throw new Error("i2c: invalid clock.")
      }
      if (clock <= 0 || clock > 1*1000*1000)  { // 0~1Mhz
        throw new Error("invalid clock frequency. specify 1hz to 1Mhz" );
      }
    }

    var buf = new Uint8Array( (mode == 0) ? 8 : 11 );
    buf[0] = module;
    buf[1] = mode;
    buf[2] = sda;
    buf[3] = scl;
    buf[4] = clock >> (3*8);
    buf[5] = clock >> (2*8);
    buf[6] = clock >> (1*8);
    buf[7] = clock;

    if (mode == 1) {
      var addressLength = 7;
      var address = parseInt(obj.slave_address);
      if (isNaN(address)) {
        throw new Error("i2c: please specify slave_address");
      }
      if (address < 0 || address > 0x3FF) {
        throw new Error("i2c: invalid slave_address");
      }
      if (obj.slave_address_length === 10 || address > 0x7F) {
        addressLength = 10;
      }
      buf[8] = addressLength;
      buf[9] = address >> 8;
      buf[10] = address;
    }
    this.sendCommand(this._CommandInit, buf);
  }

  deinit(module) {
    var buf = new Uint8Array([module]);
    this.sendCommand(this._CommandDeinit, buf);
  }

  write(module, address, data) {
    address = parseInt(address)
    if (address > 0x7F) {
      address = address | 0x8000; // mark 10bit mode
    }
    if (!data) {
      throw new Error("please provide data");
    }
    if (data.length > 1024) {
      throw new Error("data should be under 1024 bytes");
    }
    var buf = new Uint8Array(3 + data.length);
    buf[0] = module;
    buf[1] = address >> 8;
    buf[2] = address;
    buf.set(data, 3);
    this.sendCommand(this._CommandWrite, buf);
  }

  read(module, address, read_length) {
    read_length = parseInt(read_length);
    if (isNaN(read_length) || read_length < 0) {
      throw new Error("invalid length to read");
    }
    if (read_length > 1024) {
      throw new Error("data length should be under 1024 bytes");
    }
    var buf = new Uint8Array(7);
    buf[0] = module;
    buf[1] = address >> 8;
    buf[2] = address;
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
      if (module === null) {
        this.deinit(i);
        continue;
      }
      if (typeof(module) != "object") {
        continue;
      }
      if (typeof module.mode === "string") {
        if (module.mode === "master" || module.mode === "slave") {
          this.init(i, module);
        } else {
          throw new Error(`i2c: invalid mode ${module.mode}. master/slave is available`);
        }
      }

      if (typeof(module.address) === "number") {
        var address = parseInt(module.address);
        if (isNaN(address)) {
          throw Error("i2c: invalid address " + module.address)
        }
        if (module.address_bits === 10) {
          address = address | 0x8000;
        }
        if (module.data) {
          this.write(i, address, module.data);
        }
        if (typeof(module.read) == "number") {
          this.read(i, address, module.read);
        }
      }
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