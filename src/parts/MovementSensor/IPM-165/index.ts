class IPM_165 {

  public static info() {
    return {
      name: "IPM-165",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public obniz: any;
  public params: any;
  public signal: any;
  public onchange: any;

  constructor() {
    this.keys = ["signal", "vcc", "gnd"];
    this.requiredKeys = ["signal"];
  }

  public wired(obniz: any) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.signal = this.obniz.getAD(this.params.signal);
    this.signal.start((value: any) => {
      if (this.onchange) {
        this.onchange(value);
      }
    });
  }

  public async getWait() {
    const value: any = await this.signal.getWait();
    return value;
  }
}

export default IPM_165;
