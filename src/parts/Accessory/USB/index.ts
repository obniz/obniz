class USB {

  public static info() {
    return {
      name: "USB",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public displayIoNames: any;
  public obniz: any;
  public io_vdd: any;
  public params: any;
  public io_gnd: any;

  constructor() {
    this.keys = ["vcc", "gnd"];
    this.requiredKeys = ["vcc", "gnd"];

    this.displayIoNames = {
      vcc: "vcc",
      gnd: "gnd",
    };
  }

  public wired(obniz: any) {
    this.obniz = obniz;
    this.io_vdd = obniz.getIO(this.params.vcc);
    this.io_gnd = obniz.getIO(this.params.gnd);

    this.io_gnd.output(false);
  }

  public on() {
    this.io_vdd.output(true);
  }

  public off() {
    this.io_vdd.output(false);
  }
}

export default USB;
