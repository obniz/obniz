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
  
  static _generateHsvColor(h, s, v) {
    var C = v * s ;
    var Hp = h / 60;
    var X = C * (1 - Math.abs(Hp % 2 - 1));

    var R, G, B;
    if (0 <= Hp && Hp < 1) {[R,G,B]=[C,X,0];};
    if (1 <= Hp && Hp < 2) {[R,G,B]=[X,C,0];};
    if (2 <= Hp && Hp < 3) {[R,G,B]=[0,C,X];};
    if (3 <= Hp && Hp < 4) {[R,G,B]=[0,X,C];};
    if (4 <= Hp && Hp < 5) {[R,G,B]=[X,0,C];};
    if (5 <= Hp && Hp < 6) {[R,G,B]=[C,0,X];};

    var m = v - C;
    [R, G, B] = [R+m, G+m, B+m];

    R = Math.floor(R * 255);
    G = Math.floor(G * 255);
    B = Math.floor(B * 255);
    
    let array = WS2811._generateFromByte(R);
    array = array.concat(WS2811._generateFromByte(G));
    array = array.concat(WS2811._generateFromByte(B));
    return array;
  }

  rgb(r, g, b){
    this.spi.write(WS2811._generateColor(r, g, b));
  }
  
  hsv(h,s,v){
     this.spi.write(WS2811._generateHsvColor(h, s, v));
  }

  rgbs(array) {
    let bytes = [];
    for (var i=0; i<array.length; i++) {
      const oneArray = array[i];
      bytes = bytes.concat(WS2811._generateColor(oneArray[0], oneArray[1], oneArray[2]));
    }
    this.spi.write(bytes);
  }

  hsvs(array) {
    let bytes = [];
    for (var i=0; i<array.length; i++) {
      const oneArray = array[i];
      bytes = bytes.concat(WS2811._generateHsvColor(oneArray[0], oneArray[1], oneArray[2]));
    }
    this.spi.write(bytes);
  }

}

if (PartsRegistrate) {
  PartsRegistrate("WS2811", WS2811);
}