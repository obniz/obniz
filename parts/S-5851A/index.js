//センサからの反応なし
var S5851A = function() {
  this.requiredKeys = ["vcc","gnd","adr0","adr1","adr_select"];
  this.keys = ["sda","scl","adr0","adr1","adr_select","i2c"];
};

S5851A.prototype.wired = function(obniz) {
  //params: pwr, gnd, sda, scl, adr0, adr1, adr_select
  this.io_adr0 = obniz.getIO(this.params.adr0);
  this.io_adr1 = obniz.getIO(this.params.adr1);


  this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

  switch (this.params.adr_select){
    case 8:
      this.io_adr0.output(false);
      this.io_adr1.output(false);
      this.address = 0x48;
      break;
    case 9:
      this.io_adr0.pull(null);
      this.io_adr1.output(false);
      this.address = 0x49;
      break;
    case 'A':
      this.io_adr0.output(true);
      this.io_adr1.output(false);
      this.address = 0x4A;
      break;
    case 'B':
      this.io_adr0.output(false);
      this.io_adr1.output(true);
      this.address = 0x4B;
      break;
    case 'C':
      this.io_adr0.pull(null);
      this.io_adr1.output(true);
      this.address = 0x4C;
      break;
    case 'D':
      this.io_adr0.output(true);
      this.io_adr1.output(true);
      this.address = 0x4D;
      break;
    case 'E':
      this.io_adr0.output(false);
      this.io_adr1.pull(null);
      this.address = 0x4E;
      break;
    case 'F':
      this.io_adr0.output(true);
      this.io_adr1.pull(null);
      this.address = 0x4F;
      break;
    default:
      this.io_adr0.output(false);
      this.io_adr1.output(false);
      this.address = 0x48;
      break;
  }
  console.log('i2c address='+this.address);

  this.params.clock = this.params.clock || 400*1000; //for i2c
  this.params.mode = this.params.mode || "master"; //for i2c
  this.params.pull = this.params.pull || "5v"; //for i2c
  this.i2c = obniz.getI2CWithConfig(this.params);
  //obniz.i2c0.write(address, [0x20, 0x24]);
};

  S5851A.prototype.getTempWait = async function() {
    //console.log("gettempwait");
    //obniz.i2c0.write(address, [0x20, 0x24]);
    //obniz.i2c0.write(address, [0xE0, 0x00]);
    var ret = await this.i2c0.readWait(address, 2);
    //console.log('ret:' + ret);
    var tempBin = (ret[0]).toString(2) + ( '00000000' + (ret[1]).toString(2) ).slice( -8 );
    var temperature = (-45)+(175*(parseInt(tempBin,2)/(65536-1)));
    return temperature;
  };

  S5851A.prototype.getHumdWait = async function() {
    this.i2c.write(address, [0x20, 0x24]);
    this.i2c.write(address, [0xE0, 0x00]);
    var ret = await this.i2c.readWait(address, 4);
    var humdBin = (ret[2]).toString(2) + ( '00000000' + (ret[3]).toString(2) ).slice( -8 );
    var humidity = 100 * (parseInt(humdBin,2)/(65536-1));
    return humidity;
  };

if (PartsRegistrate) {
  PartsRegistrate("S5851A", S5851A);
}
