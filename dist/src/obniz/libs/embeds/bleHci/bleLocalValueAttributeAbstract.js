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
        return super.writeWait(data);
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
        return super.readWait();
    }
}
exports.default = BleLocalValueAttributeAbstract;
//# sourceMappingURL=bleLocalValueAttributeAbstract.js.map