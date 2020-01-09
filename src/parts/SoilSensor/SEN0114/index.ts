class SEN0114 {

  public static info() {
    return {
      name: "SEN0114",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public obniz: any;
  public params: any;
  public ad: any;
  public value: any;
  public onchange: any;

  constructor() {
    this.keys = ["vcc", "output", "gnd"];
    this.requiredKeys = ["output"];
  }

  public wired(obniz: any) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.ad = obniz.getAD(this.params.output);

    this.ad.start((value: any) => {
      this.value = value;
      if (this.onchange) {
        this.onchange(this.value);
      }
    });
  }

  public async getHumidityWait() {
    this.value = await this.ad.getWait();
    return this.value;
  }
}

if (typeof module === "object") {
  export default SEN0114;
}
