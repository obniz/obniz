class AM2320 {

  public static info() {
    return {
      name: "AM2320",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public obniz: any;
  public params: any;
  public address: any;
  public i2c: any;

  constructor() {
    this.keys = ["vcc", "gnd", "sda", "scl", "i2c"];
    this.requiredKeys = [];
  }

  public wired(obniz: any) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.address = 0x5c;
    this.params.pull = "5v";
    this.params.mode = "master";
    this.params.clock = this.params.clock || 100 * 1000;
    this.i2c = obniz.getI2CWithConfig(this.params);
  }

  public async getAllWait() {
    const i2cOnerror: any = this.i2c.onerror;
    this.i2c.onerror = () => {
    };
    this.i2c.write(this.address, [0]); // wake
    this.obniz.wait(2);
    this.i2c.write(this.address, [0x03, 0x00, 0x04]);
    this.obniz.wait(2);
    this.i2c.write(this.address, [0x03, 0x00, 0x04]);
    const ret: any = await this.i2c.readWait(this.address, 6);
    this.i2c.onerror = i2cOnerror;
    if (ret[0] !== 3 || ret[1] !== 4) {
      console.log("AM2320: Could not receive data correctly");
      return {};
    }
    const humidity: any = (ret[2] * 256 + ret[3]) / 10.0;
    const temperature: any = (ret[4] * 256 + ret[5]) / 10.0;
    return {temperature, humidity};
  }

  public async getTempWait() {
    return (await this.getAllWait()).temperature;
  }

  public async getHumdWait() {
    return (await this.getAllWait()).humidity;
  }
}

export default AM2320;