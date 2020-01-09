class PaPIRsVZ {

  public static info() {
    return {
      name: "PaPIRsVZ",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public obniz: any;
  public io_signal: any;
  public params: any;
  public onchange: any;

  constructor() {
    this.keys = ["vcc", "gnd", "signal"];
    this.requiredKeys = ["signal"];
  }

  public wired(obniz: any) {
    this.obniz = obniz;
    this.io_signal = obniz.getIO(this.params.signal);
    this.io_signal.pull("0v");

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    this.io_signal.input((value: any) => {
      if (this.onchange) {
        this.onchange(value);
      }
    });
  }
}

export default PaPIRsVZ;
