//センサからの反応なし
var S5851A = function() {

};

S5851A.prototype.wired = function(obniz, pwr, gnd, sda, scl, adr0, adr1, adr_select) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.io_gnd = obniz.getIO(gnd);
  this.io_sda = obniz.getIO(sda);
  this.io_scl = obniz.getIO(scl);
  this.io_adr0 = obniz.getIO(adr0);
  this.io_adr1 = obniz.getIO(adr1);

  this.io_pwr.output(true);
  if (gnd) {
    this.io_gnd = obniz.getIO(gnd);
    this.io_gnd.output(false);
  }

  switch (adr_select){
    case 8:
      this.io_adr0.output(false);
      this.io_adr1.output(false);
      address = 0x48;
      break;
    case 9:
      this.io_adr0.float();
      this.io_adr1.output(false);
      address = 0x49;
      break;
    case 'A':
      this.io_adr0.output(true);
      this.io_adr1.output(false);
      address = 0x4A;
      break;
    case 'B':
      this.io_adr0.output(false);
      this.io_adr1.output(true);
      address = 0x4B;
      break;
    case 'C':
      this.io_adr0.float();
      this.io_adr1.output(true);
      address = 0x4C;
      break;
    case 'D':
      this.io_adr0.output(true);
      this.io_adr1.output(true);
      address = 0x4D;
      break;
    case 'E':
      this.io_adr0.output(false);
      this.io_adr1.float();
      address = 0x4E;
      break;
    case 'F':
      this.io_adr0.output(true);
      this.io_adr1.float();
      address = 0x4F;
      break;
    default:
      this.io_adr0.output(false);
      this.io_adr1.output(false);
      address = 0x48;
      break;
  }
  console.log('i2c address='+address);

  obniz.i2c0.start("master", sda, scl, 400000, "pullup5v");
  //obniz.i2c0.write(address, [0x20, 0x24]);
}

  S5851A.prototype.getTempWait = async function() {
    console.log("gettempwait");
    //obniz.i2c0.write(address, [0x20, 0x24]);
    //obniz.i2c0.write(address, [0xE0, 0x00]);
    var ret = await obniz.i2c0.readWait(address, 2);
    console.log('ret:' + ret);
    var tempBin = (ret[0]).toString(2) + ( '00000000' + (ret[1]).toString(2) ).slice( -8 );
    var temperature = (-45)+(175*(parseInt(tempBin,2)/(65536-1)));
    return temperature;
  }

  S5851A.prototype.getHumdWait = async function() {
    obniz.i2c0.write(address, [0x20, 0x24]);
    obniz.i2c0.write(address, [0xE0, 0x00]);
    var ret = await obniz.i2c0.readWait(address, 4);
    var humdBin = (ret[2]).toString(2) + ( '00000000' + (ret[3]).toString(2) ).slice( -8 );
    var humidity = 100 * (parseInt(humdBin,2)/(65536-1));
    return humidity;
  }

if (PartsRegistrate) {
  PartsRegistrate("S5851A", S5851A);
}
