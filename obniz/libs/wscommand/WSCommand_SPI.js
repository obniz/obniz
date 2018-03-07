class WSCommand_SPI extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 5;

    this._CommandInit      = 0
    this._CommandDeinit    = 1
    this._CommandWriteRead = 2
    this._CommandWrite     = 3
  }

  // Commands

  init(module, obj) {

    var mode;
    switch(obj.mode) {
      case "master":
        mode = 0;
        break;
      default:
        throw new Error("spi: unknown mode");
        return;
    }

    let clk  = this.isValidIO(obj.clk) ? parseInt(obj.clk)  : null;
    let mosi = this.isValidIO(obj.mosi) ? parseInt(obj.mosi) : null;
    let miso = this.isValidIO(obj.miso) ? parseInt(obj.miso) : null;
    let cs   = this.isValidIO(obj.cs) ? parseInt(obj.cs)   : null;

    var clock = (typeof obj.clock == "number") ? parseInt(obj.clock): null;

    if (mode === 0) {
      if (clk === null && mosi === null && miso === null) {
        throw new Error("spi: master mode require one of clk/mosi/miso");
        return;
      }
      if (!clock) {
        throw new Error("spi: please provide clock");
      }
      if (clock <= 0 || clock > 80*1000*1000)  { // 0~80Mhz
        throw new Error("spi: clock must be 1 Hz to 80 Mhz");
        return;
      }
    } else {
      if (clk === null) {
        throw new Error("spi: slave require clk io");
        return;
      }
      if (cs === null) {
        throw new Error("spi: slave require cs. please specify io for cs use");
        return;
      }
    }

    if (clk  === null) clk  = this.ioNotUsed;
    if (mosi === null) mosi = this.ioNotUsed;
    if (miso === null) miso = this.ioNotUsed;
    if (cs === null)   cs   = this.ioNotUsed;

    var buf = new Uint8Array( mode == 0 ? 11 : 12 );
    buf[0]  = module;
    buf[1]  = mode;
    buf[2]  = clk;
    buf[3]  = mosi;
    buf[4]  = miso;
    buf[5]  = this.ioNotUsed; //wp
    buf[6]  = this.ioNotUsed; // hd
    buf[7]  = clock >> (3*8);
    buf[8]  = clock >> (2*8);
    buf[9]  = clock >> (1*8);
    buf[10] = clock;
    if (mode === 1) {
      buf[11] = cs;
    }

    this.sendCommand(this._CommandInit, buf);
  }

  deinit(module) {
    var buf = new Uint8Array([module]);
    this.sendCommand(this._CommandDeinit, buf);
  }

  writeread(module, data) {
    var buf = new Uint8Array(1 + data.length);
    buf[0] = module;
    buf.set(data, 1);
    this.sendCommand(this._CommandWriteRead, buf);
  }

  write(module, data) {
    var buf = new Uint8Array(1 + data.length);
    buf[0] = module;
    buf.set(data, 1);
    this.sendCommand(this._CommandWrite, buf);
  }

  parseFromJson(json) {
    for (var i=0; i<2;i++) {
      var module = json["spi"+i];
      if (module === null) {
        this.deinit(i);
        continue;
      }
      if (typeof(module) != "object") {
        continue;
      }
      if (typeof module.mode === "string") {
        this.init(i, module);
      }
      if (module.data) {
        if (module.data.length > 32) {
          throw new Error("spi: data must be <= 32 byte");
          return;
        }
        if (module.read) {
          this.writeread(i, module.data);
        } else {
          this.write(i, module.data);
        } 
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    if (func === this._CommandWriteRead && payload.byteLength > 1) {
      var module_index = payload[0];
      var received = payload.slice(1);

      var arr = new Array(payload.byteLength - 1);
      for (var i=0; i<arr.length;i++) {
        arr[i] = payload[i + 1];
      }
      objToSend["spi"+module_index] = {
        data: arr
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload)
    }
  }
}
