var ADT7310 = function() {
  this.keys = ["vcc", "gnd", "frequency", "din", "dout", "clk", "spi"];
  this.requiredKeys = [];
};

ADT7310.prototype.wired = async function(obniz) {
  this.obniz = obniz;

  if (obniz.isValidIO(this.params.vcc)) {
    obniz.getIO(this.params.vcc).output(true);
  }
  if (obniz.isValidIO(this.params.gnd)) {
    this.io_gnd = obniz.getIO(this.params.gnd);
    this.io_gnd.output(false);
  }

  this.params.mode = this.params.mode || "master";
  this.params.frequency = this.params.frequency || 500000;
  this.params.frequency = this.params.frequency || 500000;
  this.params.mosi = this.params.din;
  this.params.miso = this.params.dout;
  this.spi = this.obniz.getSpiWithConfig(this.params);
};

  ADT7310.prototype.getTempWait = async function() {
    await this.spi.writeWait([0x54]); //毎回コマンドを送らないと安定しない
    await this.obniz.wait(200); //適度な値でないと安定しない
    var ret = await this.spi.writeWait([0x00, 0x00]);
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
