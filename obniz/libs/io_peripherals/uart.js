const ObnizUtil = require('../utils/util');
const isNode = typeof window === 'undefined';

class PeripheralUART {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this.received = new Uint8Array([]);
    this.used = false;
  }

  start(params) {
    var err = ObnizUtil._requiredKeys(params, ['tx', 'rx']);
    if (err) {
      throw new Error(
        "uart start param '" + err + "' required, but not found "
      );
    }
    this.params = ObnizUtil._keyFilter(params, [
      'tx',
      'rx',
      'baud',
      'stop',
      'bits',
      'parity',
      'flowcontrol',
      'rts',
      'cts',
      'drive',
      'pull',
    ]);

    let ioKeys = ['rx', 'tx', 'rts', 'cts'];
    for (let key of ioKeys) {
      if (this.params[key] && !this.Obniz.isValidIO(this.params[key])) {
        throw new Error("uart start param '" + key + "' are to be valid io no");
      }
    }

    if (this.params.hasOwnProperty('drive')) {
      this.Obniz.getIO(this.params.rx).drive(this.params.drive);
      this.Obniz.getIO(this.params.tx).drive(this.params.drive);
    } else {
      this.Obniz.getIO(this.params.rx).drive('5v');
      this.Obniz.getIO(this.params.tx).drive('5v');
    }

    if (this.params.hasOwnProperty('pull')) {
      this.Obniz.getIO(this.params.rx).pull(this.params.pull);
      this.Obniz.getIO(this.params.tx).pull(this.params.pull);
    } else {
      this.Obniz.getIO(this.params.rx).pull(null);
      this.Obniz.getIO(this.params.tx).pull(null);
    }

    var obj = {};
    obj['uart' + this.id] = this.params;
    this.Obniz.send(obj);
    this.received = [];
    this.used = true;
  }

  send(data) {
    var send_data = null;
    if (data === undefined) {
      return;
    }
    if (typeof data === 'number') {
      data = [data];
    }
    if (isNode && data instanceof Buffer) {
      var arr = [...data];
    } else if (data.constructor === Array) {
      send_data = data;
    } else if (typeof data === 'string') {
      const buf = Buffer(data);
      send_data = [...buf];
    }
    var obj = {};
    obj['uart' + this.id] = {};
    obj['uart' + this.id].data = send_data;
    //  console.log(obj);
    this.Obniz.send(obj);
  }

  isDataExists() {
    return this.received && this.received.length > 0;
  }

  readBytes() {
    var results = [];
    if (this.isDataExists()) {
      for (var i = 0; i < this.received.length; i++) {
        results.push(this.received[i]);
      }
    }
    this.received = [];
    return results;
  }

  readText() {
    var string = null;
    if (this.isDataExists()) {
      var data = this.readBytes();
      string = this.tryConvertString(data);
    }
    this.received = [];
    return string;
  }

  tryConvertString(data) {
    return ObnizUtil.dataArray2string(data);
  }

  notified(obj) {
    if (this.onreceive) {
      var string = this.tryConvertString(obj.data);
      this.onreceive(obj.data, string);
    } else {
      if (!this.received) {
        this.received = [];
      }

      this.received.push.apply(this.received, obj.data);
    }
  }

  isUsed() {
    return this.used;
  }

  end() {
    var obj = {};
    obj['uart' + this.id] = null;
    this.params = null;
    this.Obniz.send(obj);
    this.used = false;
  }
}
module.exports = PeripheralUART;
