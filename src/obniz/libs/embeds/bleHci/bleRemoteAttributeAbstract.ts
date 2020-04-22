/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleAttributeAbstract from "./bleAttributeAbstract";

/**
 * @category Use as Central
 */
export default abstract class BleRemoteAttributeAbstract<ParentClass, ChildrenClass> extends BleAttributeAbstract<
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
  public abstract ondiscover(child: any): void;

  /**
   * @ignore
   * @param children
   */
  public abstract ondiscoverfinished(children: any): void;
}
