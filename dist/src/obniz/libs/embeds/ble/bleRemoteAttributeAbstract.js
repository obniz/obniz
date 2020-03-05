"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */
const bleAttributeAbstract_1 = __importDefault(require("./bleAttributeAbstract"));
/**
 * Deprecated class.
 * Please update obnizOS >= 3.0.0 and use [[ObnizCore.Components.Ble.Hci]]
 * @category Use as Central
 */
class BleRemoteAttributeAbstract extends bleAttributeAbstract_1.default {
    constructor(params) {
        super(params);
        this.isRemote = false;
        this.discoverdOnRemote = false;
    }
    get wsChildUuidName() {
        const childrenName = this.childrenName;
        if (!childrenName) {
            return null;
        }
        const childName = childrenName.slice(0, -1);
        return childName + "_uuid";
    }
    discoverChildren() {
    }
    discoverChildrenWait() {
        return new Promise((resolve) => {
            this.emitter.once("discoverfinished", () => {
                const children = this.children.filter((elm) => {
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
    ondiscover(child) {
    }
    ondiscoverfinished(children) {
    }
    notifyFromServer(notifyName, params) {
        super.notifyFromServer(notifyName, params);
        switch (notifyName) {
            case "discover": {
                const uuid = params[this.wsChildUuidName];
                let child = this.getChild(uuid);
                if (!child) {
                    child = this.addChild({ uuid });
                }
                child.discoverdOnRemote = true;
                child.properties = params.properties || [];
                this.ondiscover(child);
                break;
            }
            case "discoverfinished": {
                const children = this.children.filter((elm) => {
                    return elm.discoverdOnRemote;
                });
                this.ondiscoverfinished(children);
                break;
            }
        }
    }
}
exports.default = BleRemoteAttributeAbstract;
//# sourceMappingURL=bleRemoteAttributeAbstract.js.map