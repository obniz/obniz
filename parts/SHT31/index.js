var SHT31 = function() {

};

SHT31.prototype.wired = function(obniz, pwr, sda, scl, gnd, adr, adr_select) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.io_gnd = obniz.getIO(gnd);
  this.io_sda = obniz.getIO(sda);
  this.io_scl = obniz.getIO(scl);
  this.io_adr = obniz.getIO(adr);

  this.io_pwr.output(true);
  if (gnd) {
    this.io_gnd = obniz.getIO(gnd);
    this.io_gnd.output(false);
  }
  if (adr_select == 4){
    this.io_adr.output(false);
    address = 0x44;
  }else if(adr_select == 5){
    this.io_adr.pull(null);
    address = 0x45;
  }

  obniz.i2c0.start("master", sda, scl, 400000, "float");
  //obniz.i2c0.write(address, [0x20, 0x24]);
}

  SHT31.prototype.getTempWait = async function() {
    obniz.i2c0.write(address, [0x20, 0x24]);
    obniz.i2c0.write(address, [0xE0, 0x00]);
    var ret = await obniz.i2c0.readWait(address, 4);
    var tempBin = (ret[0]).toString(2) + ( '00000000' + (ret[1]).toString(2) ).slice( -8 );
    var temperature = (-45)+(175*(parseInt(tempBin,2)/(65536-1)));
    return temperature;
  }

  SHT31.prototype.getHumdWait = async function() {
    obniz.i2c0.write(address, [0x20, 0x24]);
    obniz.i2c0.write(address, [0xE0, 0x00]);
    var ret = await obniz.i2c0.readWait(address, 4);
    var humdBin = (ret[2]).toString(2) + ( '00000000' + (ret[3]).toString(2) ).slice( -8 );
    var humidity = 100 * (parseInt(humdBin,2)/(65536-1));
    return humidity;
  }

if (PartsRegistrate) {
  PartsRegistrate("SHT31", SHT31);
}
