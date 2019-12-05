/* eslint-disable */

const emitter = require('eventemitter3');
const BleHelper = require('./bleHelper');

class BleScan {
  constructor(obnizBle) {
    this.scanTarget = null;
    this.obnizBle = obnizBle;
    this.emitter = new emitter();

    this.scanedPeripherals = [];

  }

  start(target, settings) {

    let timeout = (settings || {} ).duration || 30;
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


    this.obnizBle.centralBindings.startScanning(null, false);

    setTimeout(()=>{ this.end() },timeout * 1000);
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
    this.obnizBle.centralBindings.stopScanning()
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
