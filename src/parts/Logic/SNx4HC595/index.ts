
class SNx4HC595_IO {
  public chip: any;
  public id: any;
  public value: any;

  constructor(chip: any, id: any) {
    this.chip = chip;
    this.id = id;
    this.value = 0;
  }

  public output(value: any) {
    this.chip.output(this.id, value);
  }
}

// tslint:disable-next-line:max-classes-per-file
class SNx4HC595 {

  public static info() {
    return {
      name: "SNx4HC595",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public autoFlash: any;
  public obniz: any;
  public io_ser: any;
  public params: any;
  public io_srclk: any;
  public io_rclk: any;
  public io_srclr: any;
  public io_oe: any;
  public chip: any;
  public id: any;
  public value: any;
  public _io_num: any;
  public io: any;

  constructor() {
    /* http://www.ti.com/lit/ds/symlink/sn74hc595.pdf */
    this.keys = [
      "gnd",
      "vcc",
      "ser",
      "srclk",
      "rclk",
      "oe",
      "srclr",
      "io_num",
      "enabled",
    ];
    this.requiredKeys = ["ser", "srclk", "rclk"];

    this.autoFlash = true;
  }

  public wired(obniz: any) {
    this.obniz = obniz;

    this.io_ser = this.obniz.getIO(this.params.ser);
    this.io_srclk = this.obniz.getIO(this.params.srclk);
    this.io_rclk = this.obniz.getIO(this.params.rclk);

    this.io_ser.output(false);
    this.io_srclk.output(false);
    this.io_rclk.output(false);

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    if (this.obniz.isValidIO(this.params.srclr)) {
      this.io_srclr = this.obniz.getIO(this.params.srclr);
      this.io_srclr.output(true);
    }

    if (this.obniz.isValidIO(this.params.oe)) {
      this.io_oe = this.obniz.getIO(this.params.oe);
      this.io_oe.output(true);
    }

    if (
      this.obniz.isValidIO(this.params.vcc) ||
      this.obniz.isValidIO(this.params.gnd)
    ) {
      this.obniz.wait(100);
    }

    if (typeof this.params.io_num !== "number") {
      this.params.io_num = 8;
    }
    this.ioNum(this.params.io_num);

    if (typeof this.params.enabled !== "boolean") {
      this.params.enabled = true;
    }
    if (this.io_oe && this.params.enabled) {
      this.io_oe.output(false);
    }
  }

  public ioNum(num: any) {

    if (typeof num === "number" && this._io_num !== num) {
      this._io_num = num;
      this.io = [];
      for (let i: any = 0; i < num; i++) {
        this.io.push(new SNx4HC595_IO(this, i));
      }
      this.flush();
    } else {
      throw new Error("io num should be a number");
    }
  }

  public isValidIO(io: any) {
    return typeof io === "number" && io >= 0 && io < this._io_num;
  }

  public getIO(io: any) {
    if (!this.isValidIO(io)) {
      throw new Error("io " + io + " is not valid io");
    }
    return this.io[io];
  }

  public output(id: any, value: any) {
    value = value === true;
    this.io[id].value = value;
    if (this.autoFlash) {
      this.flush();
    }
  }

  public onece(operation: any) {
    if (typeof operation !== "function") {
      throw new Error("please provide function");
    }
    const lastValue: any = this.autoFlash;
    this.autoFlash = false;
    operation();
    this.flush();
    this.autoFlash = lastValue;
  }

  public setEnable(enable: any) {
    if (!this.io_oe && enable === false) {
      throw new Error('pin "oe" is not specified');
    }
    this.io_oe.output(!enable);
  }

  public flush() {
    /* this code will works with 5v. But you should pay more attention when 3v. Timing is more tight. see chip reference */
    this.io_rclk.output(false);
    for (let i: any = this.io.length - 1; i >= 0; i--) {
      this.io_ser.output(this.io[i].value);
      this.io_srclk.output(true);
      this.io_srclk.output(false);
    }
    this.io_rclk.output(true);
  }
}

if (typeof module === "object") {
  module.exports = SNx4HC595;
}
