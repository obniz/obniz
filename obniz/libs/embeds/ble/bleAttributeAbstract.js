const ObnizUtil = require('../../utils/util');
const emitter = require('eventemitter3');
const BleHelper = require('./bleHelper');

class BleAttributeAbstract {
  constructor(params) {
    this.uuid = BleHelper.uuidFilter(params.uuid);
    this.parent = null;
    this.children = [];

    this.isRemote = false;
    this.discoverdOnRemote = false;

    this.data = params.data || null;
    if (!this.data && params.text) {
      this.data = ObnizUtil.string2dataArray(params.text);
    }
    if (!this.data && params.value) {
      this.data = [params.value];
    }

    if (params[this.childrenName]) {
      for (let child of params[this.childrenName]) {
        this.addChild(child);
      }
    }

    this.setFunctions();

    this.emitter = new emitter();
  }

  setFunctions() {
    let childrenName = this.childrenName;
    if (childrenName) {
      childrenName =
        childrenName.charAt(0).toUpperCase() + childrenName.slice(1);
      let childName = childrenName.slice(0, -1);

      let funcName = 'add' + childName;
      this[funcName] = this.addChild;

      funcName = 'get' + childName;
      this[funcName] = this.getChild;
    }

    let parentName = this.parentName;
    if (parentName) {
      Object.defineProperty(this, parentName, {
        get() {
          return this.parent;
        },
        set(newValue) {
          this.parent = newValue;
        },
      });
    }
  }

  get childrenClass() {
    return Object;
  }
  get childrenName() {
    return null;
  }
  get parentName() {
    return null;
  }

  addChild(child) {
    if (!(child instanceof this.childrenClass)) {
      let childrenClass = this.childrenClass;
      child = new childrenClass(child);
    }
    child.parent = this;

    this.children.push(child);
    return child;
  }

  getChild(uuid) {
    uuid = BleHelper.uuidFilter(uuid);
    return this.children
      .filter(function(element) {
        return BleHelper.uuidFilter(element.uuid) === uuid;
      })
      .shift();
  }

  toJSON() {
    let obj = {
      uuid: BleHelper.uuidFilter(this.uuid),
    };

    if (this.children.length > 0) {
      let key = this.childrenName;
      obj[key] = this.children;
    }
    if (this.data) {
      obj.data = this.data;
    }
    return obj;
  }

  /**
   * WS COMMANDS
   */

  read() {}
  write() {}

  writeNumber(val, needResponse) {
    this.write([val], needResponse);
  }

  writeText(str, needResponse) {
    this.write(ObnizUtil.string2dataArray(str), needResponse);
  }

  readWait() {
    return new Promise(resolve => {
      this.emitter.once('onread', params => {
        if (params.result === 'success') {
          resolve(params.data);
        } else {
          resolve(undefined);
        }
      });
      this.read();
    });
  }

  writeWait(data, needResponse) {
    return new Promise(resolve => {
      this.emitter.once('onwrite', params => {
        resolve(params.result === 'success');
      });
      this.write(data, needResponse);
    });
  }

  writeTextWait(data) {
    return new Promise(resolve => {
      this.emitter.once('onwrite', params => {
        resolve(params.result === 'success');
      });
      this.writeText(data);
    });
  }

  writeNumberWait(data) {
    return new Promise(resolve => {
      this.emitter.once('onwrite', params => {
        resolve(params.result === 'success');
      });
      this.writeNumber(data);
    });
  }

  readFromRemoteWait() {
    return new Promise(resolve => {
      this.emitter.once('onreadfromremote', () => {
        resolve();
      });
    });
  }

  writeFromRemoteWait() {
    return new Promise(resolve => {
      this.emitter.once('onreadfromremote', params => {
        resolve(params.data);
      });
    });
  }

  /**
   * CALLBACKS
   */
  onwrite() {}
  onread() {}
  onwritefromremote() {}
  onreadfromremote() {}

  onerror(err) {
    console.error(err.message);
  }

  notifyFromServer(notifyName, params) {
    this.emitter.emit(notifyName, params);
    switch (notifyName) {
      case 'onerror': {
        this.onerror(params);
        break;
      }
      case 'onwrite': {
        this.onwrite(params.result);
        break;
      }
      case 'onread': {
        this.onread(params.data);
        break;
      }
      case 'onwritefromremote': {
        this.onwritefromremote(params.address, params.data);
        break;
      }
      case 'onreadfromremote': {
        this.onreadfromremote(params.address);
        break;
      }
    }
  }
}

module.exports = BleAttributeAbstract;
