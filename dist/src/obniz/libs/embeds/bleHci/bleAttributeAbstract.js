"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emitter = require("eventemitter3");
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
        this.emitter = new emitter();
    }
    setFunctions() {
        let childrenName = this.childrenName;
        if (childrenName) {
            childrenName =
                childrenName.charAt(0).toUpperCase() + childrenName.slice(1);
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
            const childrenClass = this.childrenClass;
            child = new childrenClass(child);
        }
        child.parent = this;
        this.children.push(child);
        return child;
    }
    getChild(uuid) {
        uuid = bleHelper_1.default.uuidFilter(uuid);
        return this.children
            .filter((element) => {
            return bleHelper_1.default.uuidFilter(element.uuid) === uuid;
        })
            .shift();
    }
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
    read() {
    }
    write(data, needResponse) {
    }
    writeNumber(val, needResponse) {
        this.write([val], needResponse);
    }
    writeText(str, needResponse) {
        this.write(util_1.default.string2dataArray(str), needResponse);
    }
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
    writeTextWait(data) {
        return new Promise((resolve, reject) => {
            this.emitter.once("onwrite", (params) => {
                if (params.result === "success") {
                    resolve(true);
                }
                else {
                    reject(new Error("writeTextWait failed"));
                }
            });
            this.writeText(data);
        });
    }
    writeNumberWait(data) {
        return new Promise((resolve, reject) => {
            this.emitter.once("onwrite", (params) => {
                if (params.result === "success") {
                    resolve(true);
                }
                else {
                    reject(new Error("writeNumberWait failed"));
                }
            });
            this.writeNumber(data);
        });
    }
    readFromRemoteWait() {
        return new Promise((resolve) => {
            this.emitter.once("onreadfromremote", () => {
                resolve();
            });
        });
    }
    writeFromRemoteWait() {
        return new Promise((resolve) => {
            this.emitter.once("onreadfromremote", (params) => {
                resolve(params.data);
            });
        });
    }
    /**
     * CALLBACKS
     */
    onwrite(result) {
    }
    onread(data) {
    }
    onwritefromremote(address, data) {
    }
    onreadfromremote(address) {
    }
    onerror(err) {
        console.error(err.message);
    }
    notifyFromServer(notifyName, params) {
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
exports.default = BleAttributeAbstract;
//# sourceMappingURL=bleAttributeAbstract.js.map