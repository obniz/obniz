const i2cParts = require('../../i2cParts');

class SH200Q extends i2cParts {
  static info() {
    return {
      name: 'SH200Q',
    };
  }

  constructor() {
    super();
    this.commands = {};
    this.commands.whoami = 0x30;

    this.commands.accConfig = 0x0e;
    this.commands.gyroConfig = 0x0f;
    this.commands.gyroDlpf = 0x11;
    this.commands.fifoConfig = 0x12;
    this.commands.accRange = 0x16;
    this.commands.gyroRange = 0x2b;
    this.commands.outputAcc = 0x00;
    this.commands.outputGyro = 0x06;
    this.commands.outputTemp = 0x0c;
    this.commands.regSet1 = 0xba;
    this.commands.regSet2 = 0xca;
    this.commands.adcReset = 0xc2;
    this.commands.softReset = 0x7f;
    this.commands.reset = 0x75;
  }

  wired(obniz) {
    super.wired(obniz);
  }

  i2cInfo() {
    return {
      address: 0x6c,
      clock: 100000,
      voltage: '3v',
    };
  }

  whoamiWait() {
    return this.readWait(this.commands.whoami, 1)[0];
  }

  async initWait() {
    await this.resetAdcWait();

    await this.writeFlagWait(0xd8, 7);
    await this.obniz.wait(1);
    await this.clearFlagWait(0xd8, 7);

    await this.write(0x78, 0x61);
    await this.obniz.wait(1);
    await this.write(0x78, 0x00);

    //set acc odr 256hz
    await this.write(this.commands.accConfig, 0x91);

    //set gyro odr 500hz
    await this.write(this.commands.gyroConfig, 0x13);

    //set gyro dlpf 50hz
    await this.write(this.commands.gyroDlpf, 0x03);

    //set no buffer mode
    await this.write(this.commands.fifoConfig, 0x00);

    this.setConfig(8, 2000);

    await this.write(this.commands.regSet1, 0xc0);

    //ADC Reset
    await this.writeFlagWait(this.commands.regSet2, 4);
    await this.obniz.wait(1);
    await this.clearFlagWait(this.commands.regSet2, 4);
    await this.obniz.wait(10);
  }

  setConfig(accelerometer_range, gyroscope_range) {
    //accel range set (0x00:2g, 0x08:4g, 0x10:8g, 0x18:16g)
    switch (accelerometer_range) {
      case 4:
        this.write(this.commands.accRange, 0x00);
        break;
      case 8:
        this.write(this.commands.accRange, 0x01);
        break;
      case 16:
        this.write(this.commands.accRange, 0x10);
        break;
      default:
        throw new Error('accel_range variable 4,8,16 setting');
    }
    //gyro range & LPF set (0x00:250, 0x08:500, 0x10:1000, 0x18:2000[deg/s])
    switch (gyroscope_range) {
      case 125:
        this.write(this.commands.gyroRange, 0x04);
        break;
      case 250:
        this.write(this.commands.gyroRange, 0x03);
        break;
      case 500:
        this.write(this.commands.gyroRange, 0x02);
        break;
      case 1000:
        this.write(this.commands.gyroRange, 0x01);
        break;
      case 2000:
        this.write(this.commands.gyroRange, 0x00);
        break;
      default:
        throw new Error(
          'gyroscope_range variable 125,250,500,1000,2000 setting'
        );
    }
    this._accel_range = accelerometer_range;
    this._gyro_range = gyroscope_range;
  }

  async resetAdcWait() {
    //set 0xC2 bit2 1-->0
    let tempdata = await this.readWait(this.commands.adcReset, 1);
    tempdata[0] = tempdata[0] | 0x04; //tempdata[0] = 0x0E; //CC
    this.write(this.commands.adcReset, tempdata);
    await this.obniz.wait(1);
    tempdata[0] = tempdata[0] & 0xfb; //tempdata[0] = 0x0A; //C8
    this.write(this.commands.adcReset, tempdata);
  }

  async getAllDataWait() {
    let raw_data = await this.readWait(this.commands.outputAcc, 14); //request all data
    let ac_scale = this._accel_range / 32768;
    let gy_scale = this._gyro_range / 32768;

    const accelerometer = {
      x: this.char2short(raw_data[0], raw_data[1]) * ac_scale,
      y: this.char2short(raw_data[2], raw_data[3]) * ac_scale,
      z: this.char2short(raw_data[4], raw_data[5]) * ac_scale,
    };
    const gyroscope = {
      x: this.char2short(raw_data[6], raw_data[7]) * gy_scale,
      y: this.char2short(raw_data[8], raw_data[9]) * gy_scale,
      z: this.char2short(raw_data[10], raw_data[11]) * gy_scale,
    };

    const temperature =
      this.char2short(raw_data[12], raw_data[13]) / 333.87 + 21.0;

    return {
      accelerometer,
      temperature,
      gyroscope,
    };
  }

  async getTempWait() {
    let raw_data = await this.readWait(this.commands.outputTemp, 2); //request all data
    return this.char2short(raw_data[1], raw_data[0]) / 333.87 + 21.0;
  }

  async getAccelWait() {
    return (await this.getAllDataWait()).accelerometer;
  }

  async getGyroWait() {
    return (await this.getAllDataWait()).gyroscope;
  }
}

if (typeof module === 'object') {
  module.exports = SH200Q;
}
