const LOCAL_SERVICES = ['Battery', 'Vibration'];

class Furueru {
  constructor() {
    this.keys = ['serial'];
    this.requiredKeys = ['serial'];
    this.periperal = null;
  }

  static info() {
    return {
      name: 'Furueru',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
  }

  async connectWait() {
    let target = {
      localName: 'Furueru' + this.params.serial,
    };
    this.periperal = await this.obniz.ble.scan.startOneWait(target);
    if (this.periperal) {
      await this.periperal.setLocalServices(LOCAL_SERVICES);
      this.periperal.registerNotify(this._responseParser);
    }
  }

  /*
   * Based on PDLP spec data should be a byte array
   * Header (1 byte) + Payload (19 bytes)
   * Payload (19 bytes) = FunctionID (1 byte) + MessageID (2 bytes) + ParamNo (1 byte) + ParamList (variable)
   */
  _responseParser(data) {
    if (Array.isArray(data)) {
      if (data[0] >> 7 === 1) {
        let fnID = data[1];
        let reply = null;
        switch (fnID) {
          case 0:
            reply = this.obniz.ble.PdlpPropertyInformation.parse(data);
            break;
          case 1:
            reply = this.obniz.ble.PdlpNotification.parse(data);
            break;
          case 2:
            reply = this.obniz.ble.PdlpOperation.parse(data);
            break;
          case 3:
            reply = this.obniz.ble.PdlpSensorInformation.parse(data);
            break;
          case 4:
            reply = this.obniz.ble.PdlpSettingOperation.parse(data);
            break;
          default:
            reply = {};
        }
        this.onNotify(reply);
      }
    }
  }

  onNotify() {}

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
  module.exports = Furueru;
}
