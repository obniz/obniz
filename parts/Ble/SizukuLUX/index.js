class SizukuLUX {
  constructor() {
    this.keys = ['serial'];
    this.requiredKeys = ['serial'];
    this.periperal = null;
  }

  static info() {
    return {
      name: 'SizukuLUX',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
  }

  async connectWait() {
    let target = {
      localName: 'Sizuku_Lux' + this.params.serial,
    };
    this.periperal = await this.obniz.ble.scan.startOneWait(target);
  }

  getSensors() {
    return this.periperal.sensorData;
  }

  updateSensors() {
    this.periperal.onSensorData = this.onSensorData;
    this.periperal.updateSensorData();
  }

  onSensorData() {}
}

if (typeof module === 'object') {
  module.exports = SizukuLUX;
}
