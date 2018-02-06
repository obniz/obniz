var WS2811 = function() {

};

WS2811.prototype.wired = function(obniz, din ,nc0, nc1){
  this.obniz = obniz;

  obniz.getIO(din).outputType("push-pull3v");
  this.spi = obniz.spi0;// TODO:
  this.spi.start("master", nc0, din, nc1, 2*1000*1000); 
};

WS2811.prototype.rgb = function(r, g, b){

  var generateFromByte = function(val) {
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

  let array = generateFromByte(r);
  array = array.concat(generateFromByte(g));
  array = array.concat(generateFromByte(b));
  console.log(array);
  this.spi.write(array);
};

if (PartsRegistrate) {
  PartsRegistrate("WS2811", WS2811);
}