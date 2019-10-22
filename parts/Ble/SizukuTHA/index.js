const LOCAL_SERVICES = [
  'Battery',
  'LED',
  'Temperature',
  'Humidity',
  'Atmospheric pressure',
];

class SizukuTHA {
  constructor() {
    this.keys = ['serial'];
    this.requiredKeys = ['serial'];
    this.periperal = null;
  }

  static info() {
    return {
      name: 'SizukuTHA',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
  }

  async connectWait() {
    let target = {
      localName: 'Sizuku_tha' + this.params.serial,
    };
    this.periperal = await this.obniz.ble.scan.startOneWait(target);
    if (this.periperal) this.periperal.setLocalServices(LOCAL_SERVICES);
  }

  getSensors() {
    if (this.periperal) return this.peripral.sensorData;
    else return { error: 'Not connected' };
  }

  updateSensors() {
    if (this.periperal) {
      this.periperal.onSensorData = this.onSensorData;
      this.periperal.updateSensorData();
    } else {
      this.onSensorData({ error: 'Not connected' });
    }
  }

  onSensorData() {}
}

if (typeof module === 'object') {
  module.exports = SizukuTHA;
}
