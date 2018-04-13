const ObnizUtil = require("../../utils/util");
const emitter = require("eventemitter3");
const BleAttributeAbstract = require("./bleAttributeAbstract");

class BleRemoteAttributreAbstruct extends BleAttributeAbstract {

  constructor(params) {
    super(params);

    this.isRemote = false;
    this.discoverdOnRemote = false;


  }


  get wsChildUuidName() {
    let childrenName = this.childrenName;
    if (!childrenName) {
      return null
    }
    let childName = childrenName.slice(0, -1);
    return childName + "_uuid";
  }

  getChild(uuid) {
    let obj = super.getChild(uuid);
    if (!obj) {
      obj = this.addChild({uuid});
    }
    return obj;
  }

  discoverChildren() {

  }

  discoverChildrenWait() {
    return new Promise(resolve => {
      this.emitter.once("discoverfinished", (params) => {
        let children = this.children.filter(elm => {
          return elm.discoverdOnRemote;
        });
        resolve(children);
      });
    })
  }


  /**
   * CALLBACKS
   */
  ondiscover() {

  };

  ondiscoverfinished() {

  };

  notify(notifyName, params) {
    super.notify(notifyName, params);
    switch (notifyName) {
      case "discover" : {
        let child = this.getChild(params[this.wsChildUuidName]);
        child.discoverdOnRemote = true;
        child.properties = params.properties || [];
        this.ondiscover(child);
        break;
      }
      case "discoverfinished" : {
        let children = this.children.filter(elm => {
          return elm.discoverdOnRemote;
        });
        this.ondiscoverfinished(children);
        break;
      }
    }
  }
}

module.exports = BleRemoteAttributreAbstruct;