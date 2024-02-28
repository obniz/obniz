"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleRemoteCommandSequence = void 0;
const p_limit_1 = __importDefault(require("p-limit"));
class BleRemoteCommandSequence {
    constructor(_toTargetCharacteristic, _fromTargetCharacteristic) {
        this._toTargetCharacteristic = _toTargetCharacteristic;
        this._fromTargetCharacteristic = _fromTargetCharacteristic;
        this._commandCallback = null;
        this._setupFinishd = false;
        this._transactionLimit = (0, p_limit_1.default)(1);
    }
    async setupWait() {
        if (this._setupFinishd) {
            return;
        }
        await this._fromTargetCharacteristic.registerNotifyWait((data) => {
            if (this._commandCallback) {
                this._commandCallback(data);
            }
        });
        this._setupFinishd = true;
    }
    async transactionWait(data, timeout = 30 * 1000) {
        await this.setupWait();
        let timeoutFunc = null;
        const timeoutError = new Error('Timed out for waiting');
        const limitError = new Error('Cannot multi command send at once');
        const timeoutHandle = setTimeout(() => {
            if (timeoutFunc)
                timeoutFunc(timeoutError);
        }, timeout * 1000);
        return await this._transactionLimit(async () => {
            try {
                const waitData = new Promise((resolve, reject) => {
                    if (this._commandCallback) {
                        reject(limitError);
                    }
                    timeoutFunc = reject;
                    this._commandCallback = resolve;
                });
                await this._toTargetCharacteristic.writeWait(data);
                const result = await waitData;
                this._commandCallback = null;
                return result;
            }
            catch (e) {
                this._commandCallback = null;
                clearTimeout(timeoutHandle);
                throw e;
            }
        });
    }
}
exports.BleRemoteCommandSequence = BleRemoteCommandSequence;
