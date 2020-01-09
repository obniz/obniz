class Potentiometer {

  public static info() {
    return {
      name: "Potentiometer",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public vcc_voltage: any;
  public obniz: any;
  public params: any;
  public ad: any;
  public position: any;
  public onchange: any;

  constructor() {
    this.keys = ["pin0", "pin1", "pin2"];
    this.requiredKeys = ["pin0", "pin1", "pin2"];

    this.vcc_voltage = 5.0;
  }

  public wired(obniz: any) {
    this.obniz.setVccGnd(this.params.pin0, this.params.pin2, "5v");
    this.ad = obniz.getAD(this.params.pin1);

    const self: any = this;

    obniz.getAD(this.params.pin0).start((value: any) => {
      self.vcc_voltage = value;
    });

    this.ad.start((value: any) => {
      self.position = value / self.vcc_voltage;
      if (self.onchange) {
        self.onchange(self.position);
      }
    });
  }
}

export default Potentiometer;
