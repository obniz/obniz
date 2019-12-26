class MPU6050 {
  constructor() {
    this.keys = [
      'gnd',
      'vcc',
      'sda',
      'scl',
      'i2c',
      'address',
      'accelerometer_range',
      'gyroscope_range',
    ];
    this.required = [];
  }

  static info() {
    return {
      name: 'MPU6050',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.params.clock = 100000;
    this.params.pull = '3v';
    this.params.mode = 'master';
    this._address = this.params.address || 0x68;
    this.i2c = obniz.getI2CWithConfig(this.params);
    this.setConfig(
      this.params.accelerometer_range || 2,
      this.params.gyroscope_range || 250
    );
  }

  setConfig(accelerometer_range, gyroscope_range) {
    //accel range set (0x00:2g, 0x08:4g, 0x10:8g, 0x18:16g)
    switch (accelerometer_range) {
      case 2:
        this.i2c.write(this._address, [0x1c, 0x00]);
        break;
      case 4:
        this.i2c.write(this._address, [0x1c, 0x08]);
        break;
      case 8:
        this.i2c.write(this._address, [0x1c, 0x10]);
        break;
      case 16:
        this.i2c.write(this._address, [0x1c, 0x18]);
        break;
      default:
        throw new Error('accel_range variable 2,4,8,16 setting');
    }
    //gyro range & LPF set (0x00:250, 0x08:500, 0x10:1000, 0x18:2000[deg/s])
    switch (gyroscope_range) {
      case 250:
        this.i2c.write(this._address, [0x1b, 0x00]);
        break;
      case 500:
        this.i2c.write(this._address, [0x1b, 0x08]);
        break;
      case 1000:
        this.i2c.write(this._address, [0x1b, 0x10]);
        break;
      case 2000:
        this.i2c.write(this._address, [0x1b, 0x18]);
        break;
      default:
        throw new Error('accel_range variable 250,500,1000,2000 setting');
    }
    this._accel_range = accelerometer_range;
    this._gyro_range = gyroscope_range;
  }

  async getWait() {
    this.i2c.write(this._address, [0x3b]); //request MPU6050 data
    let raw_data_MPU6050 = await this.i2c.readWait(this._address, 14); //read 14byte
    let ac_scale = this._accel_range / 32768;
    let gy_scale = this._gyro_range / 32768;
    return {
      accelerometer: {
        x: this.char2short(raw_data_MPU6050[0], raw_data_MPU6050[1]) * ac_scale,
        y: this.char2short(raw_data_MPU6050[2], raw_data_MPU6050[3]) * ac_scale,
        z: this.char2short(raw_data_MPU6050[4], raw_data_MPU6050[5]) * ac_scale,
      },
      temp:
        this.char2short(raw_data_MPU6050[6], raw_data_MPU6050[7]) / 333.87 + 21,
      gyroscope: {
        x: this.char2short(raw_data_MPU6050[8], raw_data_MPU6050[9]) * gy_scale,
        y:
          this.char2short(raw_data_MPU6050[10], raw_data_MPU6050[11]) *
          gy_scale,
        z:
          this.char2short(raw_data_MPU6050[12], raw_data_MPU6050[13]) *
          gy_scale,
      },
    };
  }

  char2short(valueH, valueL) {
    const buffer = new ArrayBuffer(2);
    const dv = new DataView(buffer);
    dv.setUint8(0, valueH);
    dv.setUint8(1, valueL);
    return dv.getInt16(0, false);
  }
}
if (typeof module === 'object') {
  module.exports = MPU6050;
}
