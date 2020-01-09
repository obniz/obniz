class DCMotor {

  public static info() {
    return {
      name: "DCMotor",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public status: any;
  public pwm1_io_num: any;
  public params: any;
  public pwm2_io_num: any;
  public pwm1: any;
  public pwm2: any;

  constructor() {
    this.keys = ["forward", "back"];
    this.requiredKeys = ["forward", "back"];
  }

  public wired(obniz: any) {
    this.status = {
      direction: null,
      power: null,
    };

    this.pwm1_io_num = this.params.forward;
    this.pwm2_io_num = this.params.back;

    this.pwm1 = obniz.getFreePwm();
    this.pwm1.start({io: this.pwm1_io_num});
    this.pwm1.freq(100000);
    this.pwm2 = obniz.getFreePwm();
    this.pwm2.start({io: this.pwm2_io_num});
    this.pwm2.freq(100000);
    this.power(30);
  }

  // Module functions

  public forward() {
    this.move(true);
  }

  public reverse() {
    this.move(false);
  }

  public stop() {
    if (this.status.direction === null) {
      return;
    }
    this.status.direction = null;
    this.pwm1.duty(0);
    this.pwm2.duty(0);
  }

  public move(forward: any) {
    if (forward) {
      if (this.status.direction === true) {
        return;
      }
      this.status.direction = true;
    } else {
      if (this.status.direction === false) {
        return;
      }
      this.status.direction = false;
    }
    const power: any = this.power();
    this.power(0);
    this.power(power);
  }

  public power(power?: any) {
    if (power === undefined) {
      return this.status.power;
    }
    this.status.power = power;
    if (this.status.direction === null) {
      this.pwm1.duty(0);
      this.pwm2.duty(0);
      return;
    }
    if (this.status.direction) {
      this.pwm1.duty(power);
      this.pwm2.duty(0);
    } else {
      this.pwm1.duty(0);
      this.pwm2.duty(power);
    }
  }
}

export default DCMotor;
