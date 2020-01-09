class KXR94_2050 {

  public static info() {
    return {
      name: "KXR94-2050",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public obniz: any;
  public params: any;
  public ad_x: any;
  public ad_y: any;
  public ad_z: any;
  public _x_val: any;
  public onChangeX: any;
  public onChange: any;
  public _y_val: any;
  public onChangeY: any;
  public _z_val: any;
  public onChangeZ: any;
  public sensitivity: any;
  public offsetVoltage: any;

  constructor() {
    this.keys = ["x", "y", "z", "vcc", "gnd", "enable", "self_test"];
    this.requiredKeys = ["x", "y", "z"];
  }

  public wired(obniz: any) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    this.ad_x = obniz.getAD(this.params.x);
    this.ad_y = obniz.getAD(this.params.y);
    this.ad_z = obniz.getAD(this.params.z);

    if (obniz.isValidIO(this.params.enable)) {
      obniz.getIO(this.params.enable).drive("5v");
      obniz.getIO(this.params.enable).output(true);
      obniz.display.setPinName(this.params.enable, "KXR94_2050", "E");
    }
    if (obniz.isValidIO(this.params.self_test)) {
      obniz.getIO(this.params.self_test).drive("5v");
      obniz.getIO(this.params.self_test).output(false);
      obniz.display.setPinName(this.params.self_test, "KXR94_2050", "T");
    }

    this.changeVccVoltage(5);

    this.ad_x.start((value: any) => {
      this._x_val = value;
      if (this.onChangeX) {
        this.onChangeX(this.voltage2gravity(value));
      }
      if (this.onChange) {
        this.onChange(this._get());
      }
    });

    this.ad_y.start((value: any) => {
      this._y_val = value;
      if (this.onChangeY) {
        this.onChangeY(this.voltage2gravity(value));
      }
      if (this.onChange) {
        this.onChange(this._get());
      }
    });

    this.ad_z.start((value: any) => {
      this._z_val = value;
      if (this.onChangeZ) {
        this.onChangeZ(this.voltage2gravity(value));
      }
      if (this.onChange) {
        this.onChange(this._get());
      }
    });

    if (this.obniz.isValidIO(this.params.vcc)) {
      this.obniz.getAD(this.params.vcc).start((value: any) => {
        this.changeVccVoltage(value);
      });
    }

    obniz.display.setPinName(this.params.x, "KXR94_2050", "x");
    obniz.display.setPinName(this.params.y, "KXR94_2050", "y");
    obniz.display.setPinName(this.params.z, "KXR94_2050", "z");

    if (this.obniz.isValidIO(this.params.vcc)) {
      obniz.display.setPinName(this.params.vcc, "KXR94_2050", "vcc");
    }
  }

  public changeVccVoltage(pwrVoltage: any) {
    this.sensitivity = pwrVoltage / 5; // Set sensitivity (unit:V)
    this.offsetVoltage = pwrVoltage / 2; // Set offset voltage (Output voltage at 0g, unit:V)
  }

  public voltage2gravity(volt: any) {
    return (volt - this.offsetVoltage) / this.sensitivity;
  }

  public get() {
    return this._get();
  }

  public _get() {
    return {
      x: this.voltage2gravity(this._x_val),
      y: this.voltage2gravity(this._y_val),
      z: this.voltage2gravity(this._z_val),
    };
  }

  public async getWait() {
    this._x_val = await this.ad_x.getWait();
    this._y_val = await this.ad_y.getWait();
    this._z_val = await this.ad_z.getWait();

    return this._get();
  }
}

if (typeof module === "object") {
  export default KXR94_2050;
}
