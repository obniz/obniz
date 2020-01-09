class Solenoid {

  public static info() {
    return {
      name: "Solenoid",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public obniz: any;
  public params: any;
  public io_gnd: any;
  public io_signal: any;

  constructor() {
    this.keys = ["gnd", "signal"];
    this.requiredKeys = ["signal"];
  }

  public wired(obniz: any) {
    this.obniz = obniz;

    if (obniz.isValidIO(this.params.gnd)) {
      this.io_gnd = obniz.getIO(this.params.gnd);
      this.io_gnd.output(false);
    }

    this.io_signal = obniz.getIO(this.params.signal);
    this.io_signal.output(false);
  }

  public on() {
    this.io_signal.output(true);
  }

  public off() {
    this.io_signal.output(false);
  }

  public click(time_msec: any) {
    this.on();
    if (typeof time_msec !== "number") {
      time_msec = 100;
    }
    this.obniz.wait(time_msec);
    this.off();
  }

  public doubleClick(time_msec: any) {
    if (typeof time_msec !== "number") {
      time_msec = 100;
    }
    this.click(time_msec);
    this.obniz.wait(time_msec);
    this.click(time_msec);
  }
}

export default Solenoid;
