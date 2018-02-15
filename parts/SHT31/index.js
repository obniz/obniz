var SHT31 = function() {
  this.requiredKeys = [ "pwr", "adr", "addressmode","i2c"];
  this.keys = [ "pwr", "sda", "scl", "gnd", "adr", "addressmode","i2c"];
};

SHT31.prototype.wired = function(obniz,) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(this.params.pwr);
  this.io_adr = obniz.getIO(this.params.adr);

  this.io_pwr.output(true);
  if (this.params.gnd) {
    this.io_gnd = obniz.getIO(this.params.gnd);
    this.io_gnd.output(false);
  }
  if (this.params.addressmode === 4){
    this.io_adr.output(false);
    this.address = 0x44;
  }else if(this.params.addressmode === 5){
    this.io_adr.pull(null);
    this.address = 0x45;
  }

  
  this.params.clock = this.params.clock || 400*1000; //for i2c
  this.params.mode = this.params.mode || "master"; //for i2c
  this.params.pullType = this.params.pullType || "float"; //for i2c
  this.i2c = obniz.getI2CWithConfig(this.params);
  //obniz.i2c0.write(address, [0x20, 0x24]);
};

  SHT31.prototype.getTempWait = async function() {
    this.i2c.write(this.address, [0x20, 0x24]);
    this.i2c.write(this.address, [0xE0, 0x00]);
    var ret = await this.i2c0.readWait(this.address, 4);
    var tempBin = (ret[0]).toString(2) + ( '00000000' + (ret[1]).toString(2) ).slice( -8 );
    var temperature = (-45)+(175*(parseInt(tempBin,2)/(65536-1)));
    return temperature;
  };

  SHT31.prototype.getHumdWait = async function() {
    this.i2c.i2c0.write(this.address, [0x20, 0x24]);
    this.i2c.i2c0.write(this.address, [0xE0, 0x00]);
    var ret = await this.i2c.i2c0.readWait(this.address, 4);
    var humdBin = (ret[2]).toString(2) + ( '00000000' + (ret[3]).toString(2) ).slice( -8 );
    var humidity = 100 * (parseInt(humdBin,2)/(65536-1));
    return humidity;
  };

if (PartsRegistrate) {
  PartsRegistrate("SHT31", SHT31);
}
