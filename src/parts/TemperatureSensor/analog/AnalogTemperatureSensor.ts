class AnalogTemperatureSensor {
  public keys: any;
  public requiredKeys: any;
  public drive: any;
  public obniz: any;
  public params: any;
  public ad: any;
  public temp: any;

  constructor() {
    this.keys = ["vcc", "gnd", "output"];
    this.requiredKeys = ["output"];
    this.drive = "5v";
  }

  public wired(obniz: any) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, this.drive);
    this.ad = obniz.getAD(this.params.output);

    this.ad.start(
      (voltage) => {
        this.temp = this.calc(voltage);
        this.onchange(this.temp);
      },
    );
  }

  public async getWait() {
    const voltage: any = await this.ad.getWait();
    this.temp = this.calc(voltage);
    return this.temp;
  }

  public onchange(temp: any) {
  }

  public calc(voltage: any) {
    return 0;
  }
}

export default AnalogTemperatureSensor;
