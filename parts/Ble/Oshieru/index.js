const LOCAL_SERVICES = ['Battery', 'Open/Close information'];

class Oshieru {
  constructor() {
    this.keys = ['serial'];
    this.requiredKeys = ['serial'];
    this.periperal = null;
  }

  static info() {
    return {
      name: 'Oshieru',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
  }

  async connectWait() {
    let target = {
      localName: 'Oshieru' + this.params.serial,
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
  module.exports = Oshieru;
}
