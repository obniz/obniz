class MPU9250 {

  public static info() {
    return {
      name: "MPU9250",
    };
  }

  public keys: any;
  public required: any;
  public obniz: any;
  public params: any;
  public _address: any;
  public i2c: any;
  public mpu6050: any;
  public ak8963: any;

  constructor(obniz: any) {
    this.keys = ["gnd", "vcc", "sda", "scl", "i2c", "address"];
    this.required = [];
  }

  public wired(obniz: any) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this._address = this.params.address || 0x68;
    this.params.clock = 100000;
    this.params.pull = "3v";
    this.params.mode = "master";
    this.i2c = obniz.getI2CWithConfig(this.params);

    this.i2c.write(this._address, [0x6b, 0x00]); // activate MPU9250
    this.i2c.write(this._address, [0x37, 0x02]); // activate AK8963 (bypass)
    this.i2c.write(this._address, [0x1a, 0x06]); // activate LPF (search datasheet_p.13)
    this.i2c.write(this._address, [0x1d, 0x02]); // accel LPF set.

    this.mpu6050 = obniz.wired("MPU6050", {i2c: this.i2c});
    this.ak8963 = obniz.wired("AK8963", {i2c: this.i2c});
  }

  public setConfig(accel_range: any, gyro_range: any, ADC_cycle: any) {
    this.mpu6050.setConfig(accel_range, gyro_range);
    this.ak8963.setConfig(ADC_cycle);
  }

  public async _getAK8963Wait() {
    await this.i2c.write(this._address, [0x02]); // request AK8983 data
    const ST1: any = await this.i2c.readWait(this._address, 1); // confirm magnet value readable
    if (ST1 & 0x01) {
      return await this.ak8963.getWait();
    }
    return {};
  }

  public async getAllWait() {
    const data: any = await this.mpu6050.getWait();
    data.compass = await this.ak8963.getWait();
    return data;
  }

  public async getCompassWait() {
    return await this.ak8963.getWait();
  }

  public async getAccelerometerWait() {
    return (await this.mpu6050.getWait()).accelerometer;
  }

  public async getGyroscopeWait() {
    return (await this.mpu6050.getWait()).gyroscope;
  }
}

if (typeof module === "object") {
  module.exports = MPU9250;
}
