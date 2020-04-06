"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleLocalAttributeAbstract_1 = __importDefault(require("./bleLocalAttributeAbstract"));
/**
 * @category Use as Peripheral
 */
class BleLocalValueAttributeAbstract extends bleLocalAttributeAbstract_1.default {
    constructor(params) {
        super(params);
    }
    /**
     * @ignore
     * @param dataArray
     */
    write(dataArray) {
        this.data = dataArray;
        this.notifyFromServer("onwrite", { result: "success" });
    }
    /**
     * @ignore
     * @param dataArray
     */
    read() {
        this.notifyFromServer("onread", { data: this.data });
    }
    /**
     * This writes dataArray.
     * It throws an error when failed.
     *
     * ```javascript
     * // Javascript Example
     * await attr.writeWait([0xf0,0x27]);
     * console.log("write success");
     * ```
     *
     * @param data
     */
    writeWait(data) {
        return new Promise((resolve, reject) => {
            this.emitter.once("onwrite", (params) => {
                if (params.result === "success") {
                    resolve(true);
                }
                else {
                    reject(new Error("writeWait failed"));
                }
            });
            this.write(data);
        });
    }
    /**
     * It reads data.
     *
     * Even you wrote string or number, it returns binary array.
     * It throws an error when failed.
     *
     * ```javascript
     * // Javascript Example
     * let data =  await attr.readWait()
     *  console.log("data: " , data );
     * ```
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
     * @param notifyName
     * @param params
     */
    notifyFromServer(notifyName, params) {
        super.notifyFromServer(notifyName, params);
        this.emitter.emit(notifyName, params);
        switch (notifyName) {
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
}
exports.default = BleLocalValueAttributeAbstract;

//# sourceMappingURL=bleLocalValueAttributeAbstract.js.map
