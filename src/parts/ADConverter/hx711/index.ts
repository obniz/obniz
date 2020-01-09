class Hx711 {

  public static info() {
    return {
      name: "hx711",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public _offset: any;
  public _scale: any;
  public obniz: any;
  public spi: any;
  public params: any;
  public sck: any;
  public dout: any;

  constructor() {
    this.keys = ["vcc", "gnd", "sck", "dout"];
    this.requiredKeys = ["sck", "dout"];
    this._offset = 0;
    this._scale = 1;
  }

  public wired(obniz: any) {
    this.obniz = obniz;
    this.spi = obniz.getFreeSpi();
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    const ioKeys: any = ["clk", "dout"];
    for (const key of ioKeys) {
      if (this.params[key] && !this.obniz.isValidIO(this.params[key])) {
        throw new Error("spi start param '" + key + "' are to be valid io no");
      }
    }
    this.sck = obniz.getIO(this.params.sck);
    this.dout = obniz.getIO(this.params.dout);

    this.sck.output(true);
    obniz.wait(500);
  }

  public async readWait() {
    this.sck.output(false);

    while (true) {
      const val: any = await this.dout.inputWait();
      if (val === false) {
        break;
      }
    }
    this.spi.start({
      mode: "master",
      mosi: this.params.sck,
      miso: this.params.dout,
      frequency: 500 * 1000,
    });

    const ret_double: any = await this.spi.writeWait([
      0xaa,
      0xaa,
      0xaa,
      0xaa,
      0xaa,
      0xaa,
      0x80,
    ]);
    this.spi.end(true);
    this.sck.output(false);
    const ret: any = [
      this.doubleBit2singleBit(ret_double[0], ret_double[1]),
      this.doubleBit2singleBit(ret_double[2], ret_double[3]),
      this.doubleBit2singleBit(ret_double[4], ret_double[5]),
    ];
    const flag: any = (ret[0] & 0x80) === 0 ? 1 : -1;
    return flag * (((ret[0] & 0x7f) << 16) + (ret[1] << 8) + (ret[2] << 0));
  }

  public doubleBit2singleBit(a: any, b: any) {
    return (
      (this.bit(a, 7) << 7) |
      (this.bit(a, 5) << 6) |
      (this.bit(a, 3) << 5) |
      (this.bit(a, 1) << 4) |
      (this.bit(b, 7) << 3) |
      (this.bit(b, 5) << 2) |
      (this.bit(b, 3) << 1) |
      (this.bit(b, 1) << 0)
    );
  }

  public bit(a: any, n: any) {
    return a & (1 << n) ? 1 : 0;
  }

  public async readAverageWait(times: any) {
    const results: any = [];
    for (let i = 0; i < times; i++) {
      results.push(await this.readWait());
    }
    return (
      results.reduce((prev: any, current: any, i: any) => {
        return prev + current;
      }, 0) / results.length
    );
  }

  public powerDown() {
    this.sck.output(true);
  }

  public powerUp() {
    this.sck.output(false);
  }

  public async zeroAdjustWait(times: any) {
    times = parseInt(times) || 1;
    this._offset = await this.readAverageWait(times);
  }

  public async getValueWait(times: any) {
    times = parseInt(times) || 1;
    const val: any = await this.readAverageWait(times);
    return (val - this._offset) / this._scale;
  }

  public setOffset(offset: any) {
    if (typeof offset !== "number") {
      throw new Error("offset variable is Number");
    }
    this._offset = offset;
  }

  public setScale(scale: any) {
    if (typeof scale !== "number") {
      throw new Error("scale variable is Number");
    }
    this._scale = scale;
  }
}

export default Hx711;
