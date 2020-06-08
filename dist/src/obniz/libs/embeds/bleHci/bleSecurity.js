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
/**
 * Deprecated class
 */
class BleSecurity {
    constructor(Obniz) {
        this.Obniz = Obniz;
        this.emitter = new eventemitter3_1.default();
    }
    /**
     * Deprecated function
     * @param mode
     * @param level
     */
    setModeLevel(mode, level) {
        throw new Error("setModeLevel is deprecated method");
    }
    /**
     * Deprecated function
     * @param introducedVersion
     * @param functionName
     */
    checkIntroducedFirmware(introducedVersion, functionName) {
        throw new Error("checkIntroducedFirmware is deprecated method");
    }
    /**
     * Deprecated function
     * @param authTypes
     */
    setAuth(authTypes) {
        throw new Error("setAuth is deprecated method");
    }
    /**
     * Deprecated function
     * @param level
     */
    setIndicateSecurityLevel(level) {
        throw new Error("setIndicateSecurityLevel is deprecated method");
    }
    /**
     * Deprecated function
     * @param keyTypes
     */
    setEnableKeyTypes(keyTypes) {
        throw new Error("setEnableKeyTypes is deprecated method");
    }
    /**
     * Deprecated function
     * @param size
     */
    setKeyMaxSize(size) {
        throw new Error("setKeyMaxSize is deprecated method");
    }
    /**
     * Deprecated function
     */
    clearBondingDevicesList() {
        throw new Error("clearBondingDevicesList is deprecated method");
    }
    /**
     * @ignore
     * @param params
     */
    onerror(params) { } // dummy
    /**
     * @ignore
     * @param notifyName
     * @param params
     */
    notifyFromServer(notifyName, params) {
        switch (notifyName) {
            case "onerror": {
                this.Obniz._runUserCreatedFunction(this.onerror, params);
                break;
            }
        }
    }
}
exports.default = BleSecurity;

//# sourceMappingURL=bleSecurity.js.map
