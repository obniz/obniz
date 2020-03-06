"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const util_1 = __importDefault(require("../../utils/util"));
const bleHelper_1 = __importDefault(require("./bleHelper"));
class BleAttributeAbstract {
    constructor(params) {
        this.uuid = bleHelper_1.default.uuidFilter(params.uuid);
        this.parent = null;
        this.children = [];
        this.isRemote = false;
        this.discoverdOnRemote = false;
        this.data = params.data || null;
        if (!this.data && params.text) {
            this.data = util_1.default.string2dataArray(params.text);
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
        this.emitter = new eventemitter3_1.default();
    }
    /**
     * @ignore
     */
    get childrenClass() {
        return Object;
    }
    /**
     * @ignore
     */
    get childrenName() {
        return null;
    }
    /**
     * @ignore
     */
    get parentName() {
        return null;
    }
    /**
     * @ignore
     * @param child
     */
    addChild(child) {
        if (!(child instanceof this.childrenClass)) {
            const childrenClass = this.childrenClass;
            child = new childrenClass(child);
        }
        const childobj = child;
        childobj.parent = this;
        this.children.push(childobj);
        return childobj;
    }
    /**
     * @ignore
     * @param uuid
     */
    getChild(uuid) {
        uuid = bleHelper_1.default.uuidFilter(uuid);
        const result = this.children
            .filter((element) => {
            return bleHelper_1.default.uuidFilter(element.uuid) === uuid;
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
    toJSON() {
        const obj = {
            uuid: bleHelper_1.default.uuidFilter(this.uuid),
        };
        if (this.childrenName) {
            const key = this.childrenName;
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
    read() { }
    /**
     * @ignore
     */
    write(data, needResponse) { }
    /**
     * @ignore
     */
    writeNumber(val, needResponse) {
        this.write([val], needResponse);
    }
    /**
     * @ignore
     */
    writeText(str, needResponse) {
        this.write(util_1.default.string2dataArray(str), needResponse);
    }
    /**
     * @ignore
     */
    readWait() {
        return new Promise((resolve, reject) => {
            this.emitter.once("onread", (params) => {
                if (params.result === "success") {
                    resolve(params.data);
                }
                else {
                    reject(new Error("readWait failed"));
                }
            });
            this.read();
        });
    }
    /**
     * @ignore
     */
    writeWait(data, needResponse) {
        return new Promise((resolve, reject) => {
            this.emitter.once("onwrite", (params) => {
                if (params.result === "success") {
                    resolve(true);
                }
                else {
                    reject(new Error("writeWait failed"));
                }
            });
            this.write(data, needResponse);
        });
    }
    /**
     * @ignore
     */
    writeTextWait(data, needResponse) {
        return new Promise((resolve, reject) => {
            this.emitter.once("onwrite", (params) => {
                if (params.result === "success") {
                    resolve(true);
                }
                else {
                    reject(new Error("writeTextWait failed"));
                }
            });
            this.writeText(data, needResponse);
        });
    }
    /**
     * @ignore
     */
    writeNumberWait(data, needResponse) {
        return new Promise((resolve, reject) => {
            this.emitter.once("onwrite", (params) => {
                if (params.result === "success") {
                    resolve(true);
                }
                else {
                    reject(new Error("writeNumberWait failed"));
                }
            });
            this.writeNumber(data, needResponse);
        });
    }
    /**
     * @ignore
     */
    readFromRemoteWait() {
        return new Promise((resolve) => {
            this.emitter.once("onreadfromremote", () => {
                resolve();
            });
        });
    }
    /**
     * @ignore
     */
    writeFromRemoteWait() {
        return new Promise((resolve) => {
            this.emitter.once("onreadfromremote", (params) => {
                resolve(params.data);
            });
        });
    }
    /**
     * @ignore
     * @param err
     */
    onerror(err) {
        console.error(err.message);
    }
    /**
     * @ignore
     * @param notifyName
     * @param params
     */
    notifyFromServer(notifyName, params) {
        this.emitter.emit(notifyName, params);
        switch (notifyName) {
            case "onerror": {
                this.onerror(params);
                break;
            }
            case "onwrite": {
                if (this.onwrite) {
                    this.onwrite(params.result);
                }
                break;
            }
            case "onread": {
                if (this.onread) {
                    this.onread(params.data);
                }
                break;
            }
            case "onwritefromremote": {
                if (this.onwritefromremote) {
                    this.onwritefromremote(params.address, params.data);
                }
                break;
            }
            case "onreadfromremote": {
                if (this.onreadfromremote) {
                    this.onreadfromremote(params.address);
                }
                break;
            }
        }
    }
    setFunctions() {
        let childrenName = this.childrenName;
        if (childrenName) {
            childrenName = childrenName.charAt(0).toUpperCase() + childrenName.slice(1);
            const childName = childrenName.slice(0, -1);
            let funcName = "add" + childName;
            this[funcName] = this.addChild;
            funcName = "get" + childName;
            this[funcName] = this.getChild;
        }
        const parentName = this.parentName;
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
}
exports.default = BleAttributeAbstract;
//# sourceMappingURL=bleAttributeAbstract.js.map