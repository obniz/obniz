/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import EventEmitter from "eventemitter3";
import { ObnizDeprecatedFunctionError } from "../../../ObnizError";
import ObnizUtil from "../../utils/util";
import BleHelper from "./bleHelper";
import { BleDeviceAddress, UUID } from "./bleTypes";

export default abstract class BleAttributeAbstract<ParentClass, ChildrenClass> {
  /**
   * @ignore
   */
  get childrenClass(): any {
    return Object;
  }

  /**
   * @ignore
   */
  get childrenName(): string | null {
    return null;
  }

  /**
   * @ignore
   */
  get parentName(): string | null {
    return null;
  }

  /**
   * It is uuid as string.
   *
   * ```javascript
   * console.log(attr.uuid); // => '4C84'
   * ```
   */
  public uuid: UUID;

  /**
   * @ignore
   */
  public onwrite?: (result: any) => void;

  /**
   * @ignore
   */
  public onread?: (data: any) => void;

  /**
   * @ignore
   */
  public onwritefromremote?: (address: BleDeviceAddress, data: number[]) => void;

  /**
   * @ignore
   */
  public onreadfromremote?: (address: BleDeviceAddress) => void;

  protected parent: ParentClass | null;
  protected children: ChildrenClass[];
  protected isRemote: boolean;
  protected discoverdOnRemote: any;
  protected data: any;
  protected emitter: EventEmitter;

  constructor(params: any) {
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

    if (params[this.childrenName!]) {
      for (const child of params[this.childrenName!]) {
        this.addChild(child);
      }
    }

    this.setFunctions();

    this.emitter = new EventEmitter();
  }

  /**
   * @ignore
   * @param child
   */
  public addChild(child: { uuid: UUID } | ChildrenClass): ChildrenClass {
    if (!(child instanceof this.childrenClass)) {
      const childrenClass: any = this.childrenClass;
      child = new childrenClass(child);
    }
    const childobj = child as any;
    childobj.parent = this;

    this.children.push(childobj);
    return childobj;
  }

  /**
   * @ignore
   * @param uuid
   */
  public getChild(uuid: UUID): ChildrenClass | null {
    uuid = BleHelper.uuidFilter(uuid);
    const result = this.children
      .filter((element: any) => {
        return BleHelper.uuidFilter(element.uuid) === uuid;
      })
      .shift();
    if (!result) {
      return null;
    }
    return result;
  }

  /**
   * @ignore
   */
  public toJSON() {
    const obj: any = {
      uuid: BleHelper.uuidFilter(this.uuid),
    };

    if (this.childrenName) {
      const key: any = this.childrenName;
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

  /**
   * @ignore
   */
  public abstract readWait(): Promise<number[]>;

  /**
   * @ignore
   */
  public async readTextWait(): Promise<string | null> {
    const data = await this.readWait();
    return ObnizUtil.dataArray2string(data);
  }

  /**
   * @ignore
   */
  public async readNumberWait(): Promise<number | null> {
    const data = await this.readWait();
    return data.length > 0 ? data[0] : null;
  }

  /**
   * @ignore
   */
  public abstract writeWait(data: number[], needResponse?: boolean): Promise<boolean>;

  /**
   * Use writeTextWait() instead from 3.5.0
   * @ignore
   * @deprecated
   */
  public writeText(str: string, needResponse?: boolean) {
    throw new ObnizDeprecatedFunctionError("writeText", "writeTextWait");
  }

  /**
   * @ignore
   */
  public async writeTextWait(str: string, needResponse?: boolean): Promise<boolean> {
    return await this.writeWait(ObnizUtil.string2dataArray(str), needResponse);
  }

  /**
   * Use writeNumberWait() instead from 3.5.0
   * @ignore
   * @deprecated
   */
  public writeNumber(val: number, needResponse?: boolean) {
    throw new ObnizDeprecatedFunctionError("writeNumber", "writeNumberWait");
  }

  /**
   * @ignore
   */
  public async writeNumberWait(val: number, needResponse?: boolean): Promise<boolean> {
    return await this.writeWait([val], needResponse);
  }

  /**
   * @ignore
   */
  public readFromRemoteWait(): Promise<void> {
    return new Promise((resolve: any) => {
      this.emitter.once("onreadfromremote", () => {
        resolve();
      });
    });
  }

  /**
   * @ignore
   */
  public writeFromRemoteWait(): Promise<number[]> {
    return new Promise((resolve: any) => {
      this.emitter.once("onreadfromremote", (params: any) => {
        resolve(params.data);
      });
    });
  }

  /**
   * @ignore
   * @param err
   */
  public onerror(err: any) {
    console.error(err.message);
  }

  /**
   * @ignore
   * @param notifyName
   * @param params
   */
  public notifyFromServer(notifyName: any, params: any) {
    this.emitter.emit(notifyName, params);
    switch (notifyName) {
      case "onerror": {
        this.onerror(params);
        break;
      }
    }
  }

  /**
   * @ignore
   * @private
   */
  public _runUserCreatedFunction(func?: (...args: any) => any, ...args: any[]) {
    if (!func) {
      return;
    }

    if (typeof func !== "function") {
      return;
    }

    try {
      func(...args);
    } catch (err) {
      setTimeout(() => {
        throw err;
      });
    }
  }

  protected setFunctions() {
    let childrenName: any = this.childrenName;
    if (childrenName) {
      childrenName = childrenName.charAt(0).toUpperCase() + childrenName.slice(1);
      const childName: any = childrenName.slice(0, -1);

      let funcName: string = "add" + childName;
      (this as any)[funcName] = this.addChild;

      funcName = "get" + childName;
      (this as any)[funcName] = this.getChild;
    }

    const parentName: any = this.parentName;
    if (parentName) {
      Object.defineProperty(this, parentName, {
        get() {
          return this.parent;
        },
        set(newValue: any) {
          this.parent = newValue;
        },
      });
    }
  }
}
