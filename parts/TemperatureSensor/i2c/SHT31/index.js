class SHT31 {
  constructor() {
    this.requiredKeys = ["adr", "addressmode"];
    this.keys = ["vcc", "sda", "scl", "gnd", "adr", "addressmode", "i2c", "pull"];
    this.ioKeys = ["vcc", "sda", "scl", "gnd", "adr"];

    this.commands = {};
    this.commands.softReset = [0x30, 0xA2];
    this.commands.highRepeatStreach = [0x2C, 0x06];
    this.commands.middleRepeatStreach = [0x2C, 0x0D];
    this.commands.lowRepeatStreach = [0x2C, 0x10];
    this.commands.highRepeat = [0x24, 0x00];
    this.commands.mediumRepeat = [0x24, 0x0B];
    this.commands.lowRepeat = [0x24, 0x16];

    this.waitTime = {};
    this.waitTime.wakeup = 1;
    this.waitTime.softReset = 1;
    this.waitTime.lowRepeat = 4;
    this.waitTime.mediumRepeat = 6;
    this.waitTime.highRepeat = 15;

    //not tested
    this.commands.readStatus = [0xF3, 0x2D];
  };

  wired(obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.io_adr = obniz.getIO(this.params.adr);

    if (this.params.addressmode === 4) {
      this.io_adr.output(false);
      this.address = 0x44;
    } else if (this.params.addressmode === 5) {
      this.io_adr.pull(null);
      this.address = 0x45;
    }
    
    this.params.clock = this.params.clock || 100 * 1000; //for i2c
    this.params.mode = this.params.mode || "master"; //for i2c
    this.params.pull = this.params.pull || "5v"; //for i2c
    this.i2c = obniz.getI2CWithConfig(this.params);
    obniz.i2c0.write(this.address, this.commands.softReset);
  };

  async getData() {
    this.i2c.write(this.address,  this.commands.highRepeat);
    await obniz.wait(this.waitTime.highRepeat);
    return await this.i2c.readWait(this.address, 6);
  };

  async getTempWait() {
    return (await this.getAllWait()).temperature;
  };

  async getHumdWait() {
    return (await this.getAllWait()).humidity;
  };

  async getAllWait() {
    let ret = await this.getData();

    let tempBin = ret[0]*256 + ret[1];
    let temperature = (-45) + (175 * (tempBin / (65536 - 1)));

    let humdBin = ret[3]*256 + ret[4];
    let humidity = 100 * (humdBin / (65536 - 1));
    return {temperature,humidity};
  };
}

let Obniz = require("../../../../obniz/index.js");
Obniz.PartsRegistrate("SHT31", SHT31);
