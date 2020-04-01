/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleAttributeAbstract from "./bleAttributeAbstract";

/**
 * @category Use as Central
 */
export default class BleRemoteAttributeAbstract<ParentClass, ChildrenClass> extends BleAttributeAbstract<
  ParentClass,
  ChildrenClass
> {
  constructor(params: any) {
    super(params);

    this.isRemote = false;
    this.discoverdOnRemote = false;
  }

  /**
   * @ignore
   */
  get wsChildUuidName() {
    const childrenName: any = this.childrenName;
    if (!childrenName) {
      return null;
    }
    const childName: any = childrenName.slice(0, -1);
    return childName + "_uuid";
  }

  /**
   * @ignore
   * @param child
   */
  public ondiscover(child: any) {}

  /**
   * @ignore
   * @param children
   */
  public ondiscoverfinished(children: any) {}

  /**
   * @ignore
   * @param notifyName
   * @param params
   */
  public notifyFromServer(notifyName: any, params: any) {
    super.notifyFromServer(notifyName, params);
    switch (notifyName) {
      case "discover": {
        const uuid: any = params[this.wsChildUuidName!];
        let child: any = this.getChild(uuid);
        if (!child) {
          child = this.addChild({ uuid });
        }
        child.discoverdOnRemote = true;
        child.properties = params.properties || [];
        this.ondiscover(child);
        break;
      }
      case "discoverfinished": {
        const children: any = this.children.filter((elm: any) => {
          return elm.discoverdOnRemote;
        });
        this.ondiscoverfinished(children);
        break;
      }
    }
  }
}
