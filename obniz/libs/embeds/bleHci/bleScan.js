/* eslint-disable */

const emitter = require('eventemitter3');
const BleHelper = require('./bleHelper');

class BleScan {
  constructor(obnizBle) {
    this.scanTarget = null;
    this.obnizBle = obnizBle;
    this.emitter = new emitter();

    this.scanedPeripherals = [];

    this._bind();
  }

  start(target, settings) {

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

    // todo
    // this.Obniz.send(obj);

    this.obnizBle._bindings.startScanning(null, false)
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

    // todo
    // this.Obniz.send(obj);
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

  _bind() {

    this.obnizBle._bindings.on('discover', (uuid, address, addressType, connectable, advertisement, rssi)=>{
      console.log(uuid);

    });

    this.obnizBle._bindings.on('scanStop', ()=>{
      this.emitter.emit(notifyName, this.scanedPeripherals);
      this.onfinish(this.scanedPeripherals);
    });


  }}

module.exports = BleScan;
