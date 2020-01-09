// Todo: add weight and calc pressure(kg)

class FSR40X {

  public static info() {
    return {
      name: "FSR40X",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public obniz: any;
  public io_pwr: any;
  public params: any;
  public ad: any;
  public press: any;
  public onchange: any;

  constructor() {
    this.keys = ["pin0", "pin1"];
    this.requiredKeys = ["pin0", "pin1"];
  }

  public wired(obniz: any) {
    this.obniz = obniz;

    this.io_pwr = obniz.getIO(this.params.pin0);
    this.ad = obniz.getAD(this.params.pin1);

    this.io_pwr.drive("5v");
    this.io_pwr.output(true);

    const self: any = this;
    this.ad.start((value: any) => {
      const pressure: any = value * 100;
      self.press = pressure;
      if (self.onchange) {
        self.onchange(self.press);
      }
    });
  }

  public async getWait() {
    const value: any = await this.ad.getWait();
    const pressure: any = value * 100;
    this.press = pressure;
    return this.press;
  }
}

export default FSR40X;
