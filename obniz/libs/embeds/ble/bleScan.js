const emitter = require('eventemitter3');
const BleHelper = require('./bleHelper');

class BleScan {
  constructor(Obniz) {
    this.scanTarget = null;
    this.Obniz = Obniz;
    this.emitter = new emitter();

    this.scanedPeripherals = [];
  }

  start(target, settings) {
    let obj = {};
    obj['ble'] = {};
    obj['ble']['scan'] = {
      //    "targetUuid" : settings && settings.targetUuid ? settings.targetUuid : null,
      //    "interval" : settings && settings.interval ? settings.interval : 30,
      duration: settings && settings.duration ? settings.duration : 30,
    };

    this.scanTarget = target;
    if (
      this.scanTarget &&
      this.scanTarget.uuids &&
      Array.isArray(this.scanTarget.uuids)
    ) {
      this.scanTarget.uuids = this.scanTarget.uuids.map(elm => {
        return BleHelper.uuidFilter(elm);
      });
    }
    this.scanedPeripherals = [];
    this.Obniz.send(obj);
  }

  startOneWait(target, settings) {
    let state = 0;

    return new Promise(resolve => {
      this.emitter.once('onfind', param => {
        if (state === 0) {
          state = 1;
          this.end();
          resolve(param);
        }
      });

      this.emitter.once('onfinish', () => {
        if (state === 0) {
          state = 1;
          resolve(null);
        }
      });

      this.start(target, settings);
    });
  }

  startAllWait(target, settings) {
    return new Promise(resolve => {
      this.emitter.once('onfinish', () => {
        resolve(this.scanedPeripherals);
      });

      this.start(target, settings);
    });
  }

  end() {
    let obj = {};
    obj['ble'] = {};
    obj['ble']['scan'] = null;
    this.Obniz.send(obj);
  }

  isTarget(peripheral) {
    if (
      this.scanTarget &&
      this.scanTarget.localName &&
      peripheral.localName !== this.scanTarget.localName
    ) {
      return false;
    }
    if (this.scanTarget && this.scanTarget.uuids) {
      let uuids = peripheral.advertisementServiceUuids().map(e => {
        return BleHelper.uuidFilter(e);
      });
      for (let uuid of this.scanTarget.uuids) {
        if (!uuids.includes(uuid)) {
          return false;
        }
      }
    }
    return true;
  }

  onfinish() {} //dummy
  onfind() {} //dummy

  notifyFromServer(notifyName, params) {
    switch (notifyName) {
      case 'onfind': {
        if (this.isTarget(params)) {
          this.scanedPeripherals.push(params);
          this.emitter.emit(notifyName, params);
          this.onfind(params);
        }
        break;
      }
      case 'onfinish': {
        this.emitter.emit(notifyName, this.scanedPeripherals);
        this.onfinish(this.scanedPeripherals);
        break;
      }
    }
  }
}

module.exports = BleScan;
