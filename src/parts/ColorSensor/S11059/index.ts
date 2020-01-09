class S11059 {

  public static info() {
    return {
      name: "S11059",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public address: any;
  public regAdrs: any;
  public obniz: any;
  public params: any;
  public i2c: any;

  constructor() {
    this.keys = ["vcc", "sda", "scl", "i2c", "gnd"];
    this.requiredKeys = [];

    this.address = 0x2a;
    this.regAdrs = {};
    this.regAdrs.ctrl = 0x00;
    this.regAdrs.manualTiming = 0x01;
    this.regAdrs.sensorRed = 0x03;
  }

  public wired(obniz: any) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "3v");
    this.obniz.wait(100);

    this.params.clock = 100000;
    this.params.pull = "3v";
    this.params.mode = "master";
    this.i2c = obniz.getI2CWithConfig(this.params);
    this.obniz.wait(100);
  }

  public init(gain: any, intTime: any) {
    this.i2c.write(this.address, [this.regAdrs.ctrl, 0x80]); // Reset
    const val: any = (gain << 3) | intTime;
    this.i2c.write(this.address, [this.regAdrs.ctrl, val]); // Set gain,interger time
  }

  public async getVal() {
    this.i2c.write(this.address, [this.regAdrs.sensorRed]);
    const ret: any = await this.i2c.readWait(this.address, 8);
    const level: any = [0, 0, 0, 0];
    level[0] = (ret[0] << 8) | ret[1];
    level[1] = (ret[2] << 8) | ret[3];
    level[2] = (ret[4] << 8) | ret[5];
    level[3] = (ret[6] << 8) | ret[7];
    return level;
  }
}

if (typeof module === "object") {
  export default S11059;
}
