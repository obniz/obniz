class JpegSerialCam {

  constructor() {
    this.keys = [ "vcc", "tx", "rx", "gnd"];
    this.requiredKeys = [ "vcc", "tx", "rx", "gnd"];
  }

  wired(){
    this.obniz.getIO(this.params.vcc).output(true);
    this.obniz.getIO(this.params.gnd).output(false);
    this.my_tx = this.params.rx;
    this.my_rx = this.params.tx;

    this.obniz.getIO(this.my_tx).drive("3v");
    
    this.uart = this.obniz.getFreeUart(); 
  };

  async _drainUntil(uart, search, recv) {
    if (!recv) recv = [];
    while(true) {
      var readed = uart.readBytes();
      for (var i=0; i<readed.length; i++) { recv = recv.concat(readed[i]); }
      var tail = this._seekTail(search, recv);
      if (tail >= 0) {
        recv.splice(0, tail);
        return recv;
      }
      await this.obniz.wait(10);
    }
  }

  _seekTail(search, src) {
    var f=0;
    for (var i=0;i<src.length; i++) {
      if (src[i] === search[f]) {
        f++;
        if (f === search.length) {
          return i+1;
        }
      } else {
        f = 0;
      }
    }
    return -1;
  }
  
  arrayToBase64(buf) {
    if (typeof btoa === "function") {
      var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
      }).join('');
      return btoa(binstr);
    }
    // TODO: 
  }

  async startwait(obj) {
    if (!obj) obj = {};
    this.uart.start({tx:this.my_tx, rx:this.my_rx, baud:obj.baud || 38400});
    await this.obniz.wait(2500);
  }

  async resetwait() {
    this.uart.send([0x56, 0x00, 0x26, 0x00]);
    await this._drainUntil(this.uart, [0x76, 0x00, 0x26, 0x00]);
    await this.obniz.wait(2500);
  }

  async setResolusionWait(resolution) {
    let val;
    if (resolution === "640*480") {
      val = 0x00;
    } else if (resolution === "320*240") {
      val = 0x11;
    } else if (resolution === "160*120") {
      val = 0x22;
    } else {
      throw new Error("invalid resolution");
    }
    this.uart.send([0x56, 0x00, 0x31, 0x05, 0x04, 0x01, 0x00, 0x19, val]);
    await this._drainUntil(this.uart, [0x76, 0x00, 0x31, 0x00]);
    await this.resetwait();
  }

  async setBaudWait(baud) {
    let val;
    switch(baud) {
      case 9600:
        val = [0xAE, 0xC8];
        break;
      case 19200:
        val = [0x56, 0xE4];
        break;
      case 38400:
        val = [0x2A, 0xF2];
        break;
      case 57600:
        val = [0x1C, 0x4C];
        break;
      case 115200:
        val = [0x0D, 0xA6];
        break;
      default:
        throw new Error("invalid baud rate");
    }
    this.uart.send([0x56, 0x00, 0x31, 0x06, 0x04, 0x02, 0x00, 0x08, val[0], val[1]]);
    await this._drainUntil(this.uart, [0x76, 0x00, 0x31, 0x00]);
    //await this.obniz.wait(1000);
    await this.startwait({
      baud
    });
  }

  async takewait() {
    const uart = this.uart;
    //console.log("stop a photo")
    uart.send([0x56, 0x00, 0x36, 0x01, 0x02]);
    await this._drainUntil(uart, [0x76, 0x00, 0x36, 0x00, 0x00]); 
    
    //console.log("take a photo")
    uart.send([0x56, 0x00, 0x36, 0x01, 0x00]);
    await this._drainUntil(uart, [0x76, 0x00, 0x36, 0x00, 0x00]);
    
    //console.log("read length")
    uart.send([0x56, 0x00, 0x34, 0x01, 0x00]); // read length of image data
    var recv = await this._drainUntil(uart, [0x76, 0x00, 0x34, 0x00, 0x04, 0x00, 0x00]); // ack
    var XX;
    var YY;
    while(true) {
      var readed = uart.readBytes();
      //console.log(recv);
      for (var i=0; i<readed.length; i++) { recv = recv.concat(readed[i]); }
      if (recv.length >= 2) {
        XX = recv[0];
        YY = recv[1];
        break;
      }
      await this.obniz.wait(1000);
    }
    let databytes = XX * 256 + YY;
    //console.log("image: " + databytes + " Bytes");
    const high = (databytes >> 8) & 0xFF;
    const low = databytes & 0xFF;
    
    //console.log("start reading image")
    uart.send([0x56, 0x00, 0x32, 0x0C, 0x00, 0x0A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, XX, YY, 0x00, 0xFF]);
    var recv = await this._drainUntil(uart, [0x76, 0x00, 0x32, 0x00, 0x00]);
    //console.log("reading...");
    while(true) {
      var readed = uart.readBytes();
      for (var i=0; i<readed.length; i++) { recv = recv.concat(readed[i]); }
      //console.log(readed.length);
      if (recv.length >= databytes) {
        break;
      }
      await this.obniz.wait(10);
    }
    //console.log("done");
    recv = recv.splice(0, databytes); // remove tail
    recv = recv.concat([0xFF, 0xD9]);
    return recv;
  }

}

if (PartsRegistrate) {
  PartsRegistrate("JpegSerialCam", JpegSerialCam);
}