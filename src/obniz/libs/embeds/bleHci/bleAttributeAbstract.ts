import emitter = require("eventemitter3");
import ObnizUtil from "../../utils/util";
import BleHelper from "./bleHelper";

class BleAttributeAbstract {
  public uuid: any;
  public parent: any;
  public children: any;
  public isRemote: any;
  public discoverdOnRemote: any;
  public data: any;
  public emitter: any;

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

    if (params[this.childrenName]) {
      for (const child of params[this.childrenName]) {
        this.addChild(child);
      }
    }

    this.setFunctions();

    this.emitter = new emitter();
  }

  public setFunctions() {
    let childrenName: any = this.childrenName;
    if (childrenName) {
      childrenName =
        childrenName.charAt(0).toUpperCase() + childrenName.slice(1);
      const childName: any = childrenName.slice(0, -1);

      let funcName: any = "add" + childName;
      this[funcName] = this.addChild;

      funcName = "get" + childName;
      this[funcName] = this.getChild;
    }

    const parentName: any = this.parentName;
    if (parentName) {
      Object.defineProperty(this, parentName, {
        public get() {
        return this.parent;
      }
    ,
    public
      set(newValue
    :
      any,
    ) {
        this.parent = newValue;
      }
    ,
    })
      ;
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

  public addChild(child: any) {
    if (!(child instanceof this.childrenClass)) {
      const childrenClass: any = this.childrenClass;
      child = new childrenClass(child);
    }
    child.parent = this;

    this.children.push(child);
    return child;
  }

  public getChild(uuid: any) {
    uuid = BleHelper.uuidFilter(uuid);
    return this.children
      .filter((element) => {
        return BleHelper.uuidFilter(element.uuid) === uuid;
      })
      .shift();
  }

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

  public read() {
  }

  public write() {
  }

  public writeNumber(val: any, needResponse?: any) {
    this.write([val], needResponse);
  }

  public writeText(str: any, needResponse?: any) {
    this.write(ObnizUtil.string2dataArray(str), needResponse);
  }

  public readWait() {
    return new Promise((resolve, reject) => {
      this.emitter.once("onread", (params) => {
        if (params.result === "success") {
          resolve(params.data);
        } else {
          reject(new Error("readWait failed"));
        }
      });
      this.read();
    });
  }

  public writeWait(data: any, needResponse: any) {
    return new Promise((resolve, reject) => {
      this.emitter.once("onwrite", (params) => {
        if (params.result === "success") {
          resolve(true);
        } else {
          reject(new Error("writeWait failed"));
        }
      });
      this.write(data, needResponse);
    });
  }

  public writeTextWait(data: any) {
    return new Promise((resolve, reject) => {
      this.emitter.once("onwrite", (params) => {
        if (params.result === "success") {
          resolve(true);
        } else {
          reject(new Error("writeTextWait failed"));
        }
      });
      this.writeText(data);
    });
  }

  public writeNumberWait(data: any) {
    return new Promise((resolve, reject) => {
      this.emitter.once("onwrite", (params) => {
        if (params.result === "success") {
          resolve(true);
        } else {
          reject(new Error("writeNumberWait failed"));
        }
      });
      this.writeNumber(data);
    });
  }

  public readFromRemoteWait() {
    return new Promise((resolve) => {
      this.emitter.once("onreadfromremote", () => {
        resolve();
      });
    });
  }

  public writeFromRemoteWait() {
    return new Promise((resolve) => {
      this.emitter.once("onreadfromremote", (params) => {
        resolve(params.data);
      });
    });
  }

  /**
   * CALLBACKS
   */
  public onwrite() {
  }

  public onread() {
  }

  public onwritefromremote() {
  }

  public onreadfromremote() {
  }

  public onerror(err: any) {
    console.error(err.message);
  }

  public notifyFromServer(notifyName: any, params: any) {
    this.emitter.emit(notifyName, params);
    switch (notifyName) {
      case "onerror": {
        this.onerror(params);
        break;
      }
      case "onwrite": {
        this.onwrite(params.result);
        break;
      }
      case "onread": {
        this.onread(params.data);
        break;
      }
      case "onwritefromremote": {
        this.onwritefromremote(params.address, params.data);
        break;
      }
      case "onreadfromremote": {
        this.onreadfromremote(params.address);
        break;
      }
    }
  }
}

export default BleAttributeAbstract;
