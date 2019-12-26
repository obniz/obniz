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

  get descriptors() {
    return this.children;
  }

  addDescriptor(params) {
    return this.addChild(params);
  }

  //
  // getCharacteristic(params) {
  //   return this.getChild(params)
  // }

  getDescriptor(uuid) {
    let obj = this.getChild(uuid);
    if (obj) {
      return obj;
    }
    let newCharacteristic = new BleRemoteDescriptor(this.Obniz, this, uuid);
    this.addChild(newCharacteristic);
    return newCharacteristic;
  }

  async registerNotify(callback) {
    this.onnotify = callback;
    let cccd = this.getDescriptor('2902');
    await cccd.writeWait([0x01, 0x00]);

    const obj = {
      ble: {
        register_notify_characteristic: {
          address: this.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.uuid),
        },
      },
    };
    this.service.peripheral.Obniz.send(obj);
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
    const obj = {
      ble: {
        unregister_notify_characteristic: {
          address: this.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.uuid),
        },
      },
    };
    this.service.peripheral.Obniz.send(obj);
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
    const obj = {
      ble: {
        read_characteristic: {
          address: this.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.uuid),
        },
      },
    };
    this.service.peripheral.Obniz.send(obj);
  }

  write(array, needResponse) {
    if (needResponse === undefined) {
      needResponse = true;
    }
    const obj = {
      ble: {
        write_characteristic: {
          address: this.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.uuid),
          data: array,
          needResponse,
        },
      },
    };
    this.service.peripheral.Obniz.send(obj);
  }

  discoverChildren() {
    const obj = {
      ble: {
        get_descriptors: {
          address: this.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.uuid),
        },
      },
    };
    this.service.peripheral.Obniz.send(obj);
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
