"use strict";
/**
 * @packageDocumentation
 * @module Parts.PLS_01BT
 */
Object.defineProperty(exports, "__esModule", { value: true });
class PLS_01BT {
    constructor(peripheral) {
        this.keys = [];
        this.requiredKeys = [];
        this.onmesured = null;
        this._uuids = {
            service: "CDEACB80-5235-4C07-8846-93A37EE6B86D",
            rxChar: "CDEACB81-5235-4C07-8846-93A37EE6B86D",
        };
        this._peripheral = null;
        this._rxCharacteristic = null;
        this._txCharacteristic = null;
        if (peripheral && !PLS_01BT.isDevice(peripheral)) {
            throw new Error("peripheral is not PLS_01BT");
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: "PLS_01BT",
        };
    }
    static isDevice(peripheral) {
        if (peripheral.localName && peripheral.localName.startsWith("My Oximeter")) {
            return true;
        }
        return false;
    }
    // @ts-ignore
    wired(obniz) { }
    async connectWait() {
        if (!this._peripheral) {
            throw new Error("PLS_01BT is not find.");
        }
        this._peripheral.ondisconnect = (reason) => {
            if (this.ondisconnect) {
                this.ondisconnect(reason);
            }
        };
        await this._peripheral.connectWait();
        this._rxCharacteristic = this._peripheral.getService(this._uuids.service).getCharacteristic(this._uuids.rxChar);
        if (!this._rxCharacteristic) {
            throw new Error("device is not PLS_01BT");
        }
        await this._rxCharacteristic.registerNotifyWait((data) => {
            if (data.length === 4 && data[0] === 0x81) {
                if (data[1] !== 255 && data[2] !== 177) {
                    const pulseRate = data[1];
                    const bloodOxygenLevel = data[2];
                    const perfusionIndex = data[3];
                    if (this.onmesured) {
                        this.onmesured({
                            pulseRate,
                            bloodOxygenLevel,
                            perfusionIndex,
                        });
                    }
                }
            }
        });
    }
    async disconnectWait() {
        if (!this._peripheral) {
            throw new Error("PLS_01BT is not find.");
        }
        await this._peripheral.disconnectWait();
    }
}
exports.default = PLS_01BT;
