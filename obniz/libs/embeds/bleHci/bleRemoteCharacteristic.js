/* eslint-disable */

const BleRemoteDescriptor = require('./bleRemoteDescriptor');
const BleRemoteAttributeAbstract = require('./bleRemoteAttributeAbstract');
const BleHelper = require('./bleHelper');

class BleRemoteCharacteristic extends BleRemoteAttributeAbstract {
  constructor(params) {
    super(params);

    this.properties = params.properties || [];
    if (!Array.isArray(this.properties)) {
      this.properties = [this.properties];
    }
  }

  get parentName() {
    return 'service';
  }

  get childrenClass() {
    return BleRemoteDescriptor;
  }

  get childrenName() {
    return 'descriptors';
  }

  get descriptors(){
    return this.children;
  }

  addDescriptor(params) {
    return this.addChild(params);
  }


  getDescriptor(uuid) {
    let obj = this.getChild(uuid);
    if (obj) {
      return obj;
    }
    let newCharacteristic = new BleRemoteDescriptor(this.Obniz, this, uuid);
    this.addChild(newCharacteristic);
    return newCharacteristic;
  }

  registerNotify(callback) {
    this.onnotify = callback;
    this.service.peripheral.obnizBle.centralBindings.notify(
        this.service.peripheral.address,
        this.service.uuid,
        this.uuid,
        true
    );
  }


  registerNotifyWait(callback) {
    return new Promise(resolve => {
      this.emitter.once('onregisternotify', () => {
        resolve();
      });
      this.registerNotify(callback);
    });
  }


  unregisterNotify() {
    this.onnotify = function() {};

    this.service.peripheral.obnizBle.centralBindings.notify(
        this.service.peripheral.address,
        this.service.uuid,
        this.uuid,
        false
    );
  }


  unregisterNotifyWait() {
    return new Promise(resolve => {
      this.emitter.once('onunregisternotify', () => {
        resolve();
      });
      this.unregisterNotify();
    });
  }

  read() {
    this.service.peripheral.obnizBle.centralBindings.read(
        this.service.peripheral.address,
        this.service.uuid,
        this.uuid
    );
  }

  write(array, needResponse) {
    if (needResponse === undefined) {
      needResponse = true;
    }
    this.service.peripheral.obnizBle.centralBindings.write(
        this.service.peripheral.address,
        this.service.uuid,
        this.uuid,
        Buffer.from(array),
        !needResponse
    );

  }

  discoverChildren() {
    this.service.peripheral.obnizBle.centralBindings.discoverDescriptors(
        this.service.peripheral.address,
        this.service.uuid,
        this.uuid
    );
  }

  discoverAllDescriptors() {
    return this.discoverChildren();
  }

  discoverAllDescriptorsWait() {
    return this.discoverChildrenWait();
  }

  toJSON() {
    let obj = super.toJSON();

    if (this.properties.length > 0) {
      obj.properties = this.properties;
    }
    return obj;
  }

  canBroadcast() {
    return this.properties.includes('broadcast');
  }

  canNotify() {
    return this.properties.includes('notify');
  }

  canRead() {
    return this.properties.includes('read');
  }

  canWrite() {
    return this.properties.includes('write');
  }

  canWriteWithoutResponse() {
    return this.properties.includes('write_without_response');
  }

  canIndicate() {
    return this.properties.includes('indicate');
  }

  ondiscover(descriptor) {
    this.ondiscoverdescriptor(descriptor);
  }

  ondiscoverfinished(descriptors) {
    this.ondiscoverdescriptorfinished(descriptors);
  }

  ondiscoverdescriptor() {}

  ondiscoverdescriptorfinished() {}

  onregisternotify() {}

  onunregisternotify() {}

  onnotify() {}

  notifyFromServer(notifyName, params) {
    super.notifyFromServer(notifyName, params);
    switch (notifyName) {
      case 'onregisternotify': {
        this.onregisternotify();
        break;
      }
      case 'onunregisternotify': {
        this.onunregisternotify();
        break;
      }
      case 'onnotify': {
        this.onnotify(params.data || undefined);
        break;
      }
    }
  }
}

module.exports = BleRemoteCharacteristic;
