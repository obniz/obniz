class MPU9250 {
  constructor(obniz) {
    this.keys = ['gnd', 'vcc', 'sda', 'scl', 'i2c'];
    this.required = ['sda', 'scl'];
  }

  static info() {
    return {
      name: 'MPU9250',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.params.clock = 100000;
    this.params.pull = '3v';
    this.params.mode = 'master';
    this.i2c = obniz.getI2CWithConfig(this.params);

    this.mpu6050 = obniz.wired('MPU6050', { i2c: this.i2c });
    this.ak8963 = obniz.wired('AK8963', { i2c: this.i2c });
    this.obniz.wait(100);
  }

  setConfig(accel_range, gyro_range, ADC_cycle) {
    this.i2c.write(0x68, [0x6b, 0x00]); //activate MPU9250
    this.i2c.write(0x68, [0x37, 0x02]); //activate AK8963 (bypass)
    this.i2c.write(0x68, [0x1a, 0x06]); //activate LPF (search datasheet_p.13)
    this.i2c.write(0x68, [0x1d, 0x02]); //accel LPF set.

    this.mpu6050.setConfig(accel_range, gyro_range);
    this.ak8963.setConfig(ADC_cycle);
  }

  async _getAK8963Wait() {
    this.i2c.write(0x68, [0x02]); //request AK8983 data
    let ST1 = await this.i2c.readWait(0x68, 1); //confirm magnet value readable
    if (ST1 & 0x01) {
      return await this.ak8963.getWait();
    }
    return {};
  }

  async getAllWait() {
    let data = await this.mpu6050.getWait();
    //data.compass = await this.ak8963.getWait();
    console.log(data);
  }
}
if (typeof module === 'object') {
  module.exports = MPU9250;
}
