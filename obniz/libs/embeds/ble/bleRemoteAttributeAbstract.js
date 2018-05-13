const BleAttributeAbstract = require('./bleAttributeAbstract');

class BleRemoteAttributeAbstract extends BleAttributeAbstract {
  constructor(params) {
    super(params);

    this.isRemote = false;
    this.discoverdOnRemote = false;
  }

  get wsChildUuidName() {
    let childrenName = this.childrenName;
    if (!childrenName) {
      return null;
    }
    let childName = childrenName.slice(0, -1);
    return childName + '_uuid';
  }

  getChild(uuid) {
    let obj = super.getChild(uuid);
    if (!obj) {
      obj = this.addChild({ uuid });
    }
    return obj;
  }

  discoverChildren() {}

  discoverChildrenWait() {
    return new Promise(resolve => {
      this.emitter.once('discoverfinished', () => {
        let children = this.children.filter(elm => {
          return elm.discoverdOnRemote;
        });
        resolve(children);
      });
      this.discoverChildren();
    });
  }

  /**
   * CALLBACKS
   */
  ondiscover() {}

  ondiscoverfinished() {}

  notifyFromServer(notifyName, params) {
    super.notifyFromServer(notifyName, params);
    switch (notifyName) {
      case 'discover': {
        let child = this.getChild(params[this.wsChildUuidName]);
        child.discoverdOnRemote = true;
        child.properties = params.properties || [];
        this.ondiscover(child);
        break;
      }
      case 'discoverfinished': {
        let children = this.children.filter(elm => {
          return elm.discoverdOnRemote;
        });
        this.ondiscoverfinished(children);
        break;
      }
    }
  }
}

module.exports = BleRemoteAttributeAbstract;
