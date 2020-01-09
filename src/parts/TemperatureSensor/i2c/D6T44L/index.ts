class D6T44L {

  public static info() {
    return {
      name: "D6T44L",
    };
  }

  public requiredKeys: any;
  public keys: any;
  public address: any;
  public ioKeys: any;
  public commands: any;
  public obniz: any;
  public params: any;
  public i2c: any;

  constructor() {
    this.requiredKeys = [];
    this.keys = ["vcc", "gnd", "sda", "scl", "clock"];
    this.address = 0x0a;

    this.ioKeys = ["vcc", "gnd", "sda", "scl"];
    this.commands = {};
    this.commands.read_data = [0x4c];
  }

  public wired(obniz: any) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    this.params.clock = this.params.clock || 100 * 1000; // for i2c
    this.params.mode = this.params.mode || "master"; // for i2c
    this.params.pull = this.params.pull || null; // for i2c
    this.i2c = obniz.getI2CWithConfig(this.params);
    this.obniz.wait(50);
  }

  public async getOnePixWait(pixcel: any) {
    const data: any = await this.getAllPixWait();
    return data[pixcel];
  }

  public async getAllPixWait() {
    this.i2c.write(this.address, [0x4c]);
    // await obniz.wait(160);
    const raw: any = await this.i2c.readWait(this.address, 35);

    const data: any = [];

    for (let i = 0; i < 16; i++) {
      data[i] = parseFloat(
        ((raw[i * 2 + 2] + (raw[i * 2 + 3] << 8)) * 0.1).toFixed(1),
      );
    }

    return data;
  }
}

if (typeof module === "object") {
  export default D6T44L;
}
