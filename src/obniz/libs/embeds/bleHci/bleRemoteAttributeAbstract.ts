const BleAttributeAbstract: any = require("./bleAttributeAbstract");

class BleRemoteAttributeAbstract extends BleAttributeAbstract {
  public isRemote: any;
  public discoverdOnRemote: any;
  public childrenName: any;
  public emitter: any;
  public children: any;
  public getChild: any;
  public addChild: any;

  constructor(params: any) {
    super(params);

    this.isRemote = false;
    this.discoverdOnRemote = false;
  }

  get wsChildUuidName() {
    const childrenName: any = this.childrenName;
    if (!childrenName) {
      return null;
    }
    const childName: any = childrenName.slice(0, -1);
    return childName + "_uuid";
  }

  public discoverChildren() {
  }

  public discoverChildrenWait() {
    return new Promise((resolve) => {
      this.emitter.once("discoverfinished", () => {
        const children: any = this.children.filter((elm) => {
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
  public ondiscover() {
  }

  public ondiscoverfinished() {
  }

  public notifyFromServer(notifyName: any, params: any) {
    super.notifyFromServer(notifyName, params);
    switch (notifyName) {
      case "discover": {
        const uuid: any = params[this.wsChildUuidName];
        let child: any = this.getChild(uuid);
        if (!child) {
          child = this.addChild({uuid});
        }
        child.discoverdOnRemote = true;
        child.properties = params.properties || [];
        this.ondiscover(child);
        break;
      }
      case "discoverfinished": {
        const children: any = this.children.filter((elm) => {
          return elm.discoverdOnRemote;
        });
        this.ondiscoverfinished(children);
        break;
      }
    }
  }
}

module.exports = BleRemoteAttributeAbstract;
