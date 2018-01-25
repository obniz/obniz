var ADT7310 = function() {

};

ADT7310.prototype.wired = async function(obniz, pwr, gnd, clk, mosi, miso) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.io_gnd = obniz.getIO(gnd);
  this.io_clk = obniz.getIO(clk);
  this.io_mosi = obniz.getIO(mosi);
  this.io_mosi = obniz.getIO(miso);

  this.io_pwr.output(true);
  if (gnd) {
    this.io_gnd = obniz.getIO(gnd);
    this.io_gnd.output(false);
  }

  obniz.spi0.start("master", clk, mosi, miso, 500000);
}

  ADT7310.prototype.getTempWait = async function() {
    await obniz.spi0.writeWait([0x54]); //毎回コマンドを送らないと安定しない
    await obniz.wait(200); //適度な値でないと安定しない
    var ret = await obniz.spi0.writeWait([0x00, 0x00]);
    var tempBin = ret[0] << 8;
    tempBin |= ret[1];
    tempBin = tempBin >> 3;

    if(tempBin & (0x1000)) { //0度以下の時の処理
      tempBin = tempBin  - 8192;
    }

    return (tempBin/16);
  }

if (PartsRegistrate) {
  PartsRegistrate("ADT7310", ADT7310);
}
