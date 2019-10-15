const i2cParts = require('../../../i2cParts');

class DHT12 extends i2cParts {
  static info() {
    return {
      name: 'DHT12',
    };
  }

  i2cInfo() {
    return {
      address: 0x5c,
      clock: 100000,
      voltage: '3v',
    };
  }

  async getAllDataWait() {
    const data = await this.readWait(0x00, 5);
    const humidity = data[0] + data[1] * 0.1;
    let temperature = data[2] + (data[3] & 0x7f) * 0.1;
    if (data[3] & 0x80) {
      temperature *= -1;
    }

    const checksum = data[0] + data[1] + data[2] + data[3];
    if (checksum !== data[4]) {
      return null;
    }

    return {
      humidity,
      temperature,
    };
  }

  async getTempWait() {
    return (await this.getAllDataWait()).temperature;
  }

  async getHumdWait() {
    return (await this.getAllDataWait()).humidity;
  }
}

if (typeof module === 'object') {
  module.exports = DHT12;
}
