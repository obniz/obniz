const i2cParts = require('../../i2cParts');

class MPU6886 extends i2cParts {
  static info() {
    return {
      name: 'MPU6886',
    };
  }

  constructor() {
    super();
    this.commands = {};
    this.commands.whoami = 0x75;
    this.commands.accelIntelCtrl = 0x69;
    this.commands.smplrtDiv = 0x19;
    this.commands.intPinCfg = 0x37;
    this.commands.intEnable = 0x38;
    this.commands.accelXoutH = 0x3b;
    this.commands.accelXoutL = 0x3c;
    this.commands.accelYoutH = 0x3d;
    this.commands.accelYoutL = 0x3e;
    this.commands.accelZoutH = 0x3f;
    this.commands.accelZoutL = 0x40;

    this.commands.tempOutH = 0x41;
    this.commands.tempOutL = 0x42;

    this.commands.gyroXoutH = 0x43;
    this.commands.gyroXoutL = 0x44;
    this.commands.gyroYoutH = 0x45;
    this.commands.gyroYoutL = 0x46;
    this.commands.gyroZoutH = 0x47;
    this.commands.gyroZoutL = 0x48;

    this.commands.userCtrl = 0x6a;
    this.commands.pwrMgmt1 = 0x6b;
    this.commands.pwrMgmt2 = 0x6c;
    this.commands.config = 0x1a;
    this.commands.gyroConfig = 0x1b;
    this.commands.accelConfig = 0x1c;
    this.commands.accelConfig2 = 0x1d;
    this.commands.fifoEn = 0x23;
  }

  wired(obniz) {
    super.wired(obniz);

    this.init();
  }

  i2cInfo() {
    return {
      address: 0x68,
      clock: 100000,
      voltage: '3v',
    };
  }

  whoamiWait() {
    return this.readWait(this.commands.whoami, 1)[0];
  }

  init() {
    this.write(this.commands.pwrMgmt1, 0x00);
    this.obniz.wait(10);
    this.write(this.commands.pwrMgmt1, 0x01 << 7);
    this.obniz.wait(10);
    this.write(this.commands.pwrMgmt1, 0x01 << 0);
    this.obniz.wait(10);
    this.setConfig(
      this.params.accelerometer_range || 2,
      this.params.gyroscope_range || 250
    );
    this.obniz.wait(1);
    this.write(this.commands.config, 0x01);
    this.obniz.wait(1);
    this.write(this.commands.smplrtDiv, 0x05);
    this.obniz.wait(1);
    this.write(this.commands.intEnable, 0x00);
    this.obniz.wait(1);
    this.write(this.commands.accelConfig2, 0x00);
    this.obniz.wait(1);
    this.write(this.commands.userCtrl, 0x00);
    this.obniz.wait(1);
    this.write(this.commands.fifoEn, 0x00);
    this.obniz.wait(1);
    this.write(this.commands.intPinCfg, 0x22);
    this.obniz.wait(1);
    this.write(this.commands.intEnable, 0x01);
    this.obniz.wait(1);
  }

  setConfig(accelerometer_range, gyroscope_range) {
    //accel range set (0x00:2g, 0x08:4g, 0x10:8g, 0x18:16g)
    switch (accelerometer_range) {
      case 2:
        this.write(this.commands.accelConfig, 0x00);
        break;
      case 4:
        this.write(this.commands.accelConfig, 0x08);
        break;
      case 8:
        this.write(this.commands.accelConfig, 0x10);
        break;
      case 16:
        this.write(this.commands.accelConfig, 0x18);
        break;
      default:
        throw new Error('accel_range variable 2,4,8,16 setting');
    }
    //gyro range & LPF set (0x00:250, 0x08:500, 0x10:1000, 0x18:2000[deg/s])
    switch (gyroscope_range) {
      case 250:
        this.write(this.commands.gyroConfig, 0x00);
        break;
      case 500:
        this.write(this.commands.gyroConfig, 0x08);
        break;
      case 1000:
        this.write(this.commands.gyroConfig, 0x10);
        break;
      case 2000:
        this.write(this.commands.gyroConfig, 0x18);
        break;
      default:
        throw new Error('accel_range variable 250,500,1000,2000 setting');
    }
    this._accel_range = accelerometer_range;
    this._gyro_range = gyroscope_range;
  }

  async getAllDataWait() {
    let raw_data = await this.readWait(this.commands.accelXoutH, 14); //request all data
    let ac_scale = this._accel_range / 32768;
    let gy_scale = this._gyro_range / 32768;

    const accelerometer = {
      x: this.char2short(raw_data[0], raw_data[1]) * ac_scale,
      y: this.char2short(raw_data[2], raw_data[3]) * ac_scale,
      z: this.char2short(raw_data[4], raw_data[5]) * ac_scale,
    };
    const temperature =
      this.char2short(raw_data[6], raw_data[7]) / 326.8 + 25.0;
    const gyroscope = {
      x: this.char2short(raw_data[8], raw_data[9]) * gy_scale,
      y: this.char2short(raw_data[10], raw_data[11]) * gy_scale,
      z: this.char2short(raw_data[12], raw_data[13]) * gy_scale,
    };

    return {
      accelerometer,
      temperature,
      gyroscope,
    };
  }

  async getTempWait() {
    return (await this.getAllDataWait()).temperature;
  }

  async getAccelWait() {
    return (await this.getAllDataWait()).accelerometer;
  }

  async getGyroWait() {
    return (await this.getAllDataWait()).gyroscope;
  }
}

if (typeof module === 'object') {
  module.exports = MPU6886;
}
