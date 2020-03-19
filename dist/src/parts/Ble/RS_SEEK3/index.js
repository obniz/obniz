"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RS_Seek3 {
    constructor(peripheral) {
        this.keys = [];
        this.requiredKeys = [];
        this.onchange = null;
        this._uuids = {
            service: "0EE71523-981A-46B8-BA64-019261C88478",
            buttonChar: "0EE71524-981A-46B8-BA64-019261C88478",
            tempHumidChar: "0EE7152C-981A-46B8-BA64-019261C88478",
        };
        this._peripheral = null;
        this._buttonCharacteristic = null;
        this._tempHumidCharacteristic = null;
        if (peripheral && !RS_Seek3.isDevice(peripheral)) {
            throw new Error("peripheral is not RS_Seek3");
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: "RS_Seek3",
        };
    }
    static isDevice(peripheral) {
        if (peripheral.localName !== "Seek3") {
            return false;
        }
        return true;
    }
    // @ts-ignore
    wired(obniz) { }
    async connectWait() {
        if (!this._peripheral) {
            throw new Error("RS_Seek3 is not find.");
        }
        await this._peripheral.connectWait();
        this._buttonCharacteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.buttonChar);
        this._tempHumidCharacteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.tempHumidChar);
        if (this._buttonCharacteristic) {
            this._buttonCharacteristic.registerNotify((data) => {
                if (typeof this.onchange === "function") {
                    this.onchange(data[0] === 1);
                }
            });
        }
    }
    async getTempHumidWait() {
        if (!this._tempHumidCharacteristic) {
            throw new Error("device is not connected");
        }
        const data = await this._tempHumidCharacteristic.readWait();
        return { temperature: data[0], humidity: data[1] };
    }
}
exports.default = RS_Seek3;

//# sourceMappingURL=index.js.map
