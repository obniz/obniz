class WS2811 {

  constructor() {

  }

  wired(obniz, din ,nc0, nc1){

    this.obniz = obniz;
    obniz.getIO(din).outputType("push-pull3v");
    this.spi = obniz.spi0;// TODO:
    this.spi.start("master", nc0, din, nc1, 2*1000*1000); 
  };

  static _generateFromByte(val) {

    val = parseInt(val);
    const zero = 0x8;
    const one  = 0xE;
    let ret = [];
    for (var i=0; i<8;i+=2) {
      let byte = 0;
      if (val & (0x80 >> i)) {
        byte = one << 4;
      } else {
        byte = zero << 4;
      }
      if (val & (0x80 >> (i+1))) {
        byte |= one
      } else {
        byte |= zero
      }
      ret.push(byte);
    }
    return ret;
  }

  static _generateColor(r, g, b) {
  
    let array = WS2811._generateFromByte(r);
    array = array.concat(WS2811._generateFromByte(g));
    array = array.concat(WS2811._generateFromByte(b));
    return array;
  }

  rgb(r, g, b){

    this.spi.write(_generateColor(r, g, b));
  }

  rgbs(array) {
    let bytes = [];
    for (var i=0; i<array.length; i++) {
      const oneArray = array[i];
      bytes = bytes.concat(WS2811._generateColor(oneArray[0], oneArray[1], oneArray[2]));
    }
    this.spi.write(bytes);
  }

}

if (PartsRegistrate) {
  PartsRegistrate("WS2811", WS2811);
}