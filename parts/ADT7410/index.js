var ADT7410 = function() {

};

ADT7410.prototype.wired = function(obniz, pwr, gnd, sda, scl, adr_select) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.io_gnd = obniz.getIO(gnd);
  this.io_sda = obniz.getIO(sda);
  this.io_scl = obniz.getIO(scl);

  this.io_pwr.output(true);
  if (gnd) {
    this.io_gnd = obniz.getIO(gnd);
    this.io_gnd.output(false);
  }
  if (adr_select == 8){
    address = 0x48;
  }else if(adr_select == 9){
    address = 0x49;
  }

  obniz.i2c0.start("master", sda, scl, 400000, "pullup5v");

}

  ADT7410.prototype.getTempWait = async function() {
    var ret = await obniz.i2c0.readWait(address, 2);
    var tempBin = ret[0] << 8;
    tempBin |= ret[1];
    tempBin = tempBin >> 3;

    if(tempBin & (0x1000)) { //0度以下の時の処理
      tempBin = tempBin  - 8192;
    }

    return (tempBin/16);
  }

if (PartsRegistrate) {
  PartsRegistrate("ADT7410", ADT7410);
}
