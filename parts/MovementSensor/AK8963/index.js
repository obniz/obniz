class AK8963 {
  constructor() {
    this.keys = ['gnd', 'vcc', 'sda', 'scl', 'i2c', 'address', 'adb_cycle'];
    this.required = [];
  }

  static info() {
    return {
      name: 'AK8963',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.params.clock = 100000;
    this.params.pull = '3v';
    this.params.mode = 'master';
    this._address = this.params.address || 0x0c;
    this.i2c = obniz.getI2CWithConfig(this.params);
    this.setConfig(this.params.adc_cycle || 8);
  }

  setConfig(ADC_cycle) {
    switch (ADC_cycle) {
      case 8:
        this.i2c.write(this._address, [0x0a, 0x12]);
        break;
      case 100:
        this.i2c.write(this._address, [0x0a, 0x16]);
        break;
      default:
        throw new Error('ADC_cycle variable 8,100 setting');
    }
    this._adc_cycle = ADC_cycle;
  }

  async getWait() {
    this.i2c.write(this._address, [0x03]); //request AK8963 data
    let raw_data_AK8963 = await this.i2c.readWait(this._address, 7); //read 7byte(read mag_data[6] to refresh)
    return {
      x: this.char2short(raw_data_AK8963[0], raw_data_AK8963[1]),
      y: this.char2short(raw_data_AK8963[2], raw_data_AK8963[3]),
      z: this.char2short(raw_data_AK8963[4], raw_data_AK8963[5]),
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
  module.exports = AK8963;
}
