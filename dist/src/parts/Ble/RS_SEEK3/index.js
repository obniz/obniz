"use strict";
/**
 * @packageDocumentation
 * @module Parts.RS_Seek3
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** RS_Seek3 management class RS_Seek3を管理するクラス */
class RS_Seek3 {
    constructor(peripheral) {
        this.keys = [];
        this.requiredKeys = [];
        /**
         * Callback when the button is pressed
         *
         * ボタンが押されたときにコールバック
         */
        this.onpressed = null;
        this._peripheral = null;
        this._uuids = {
            service: '0EE71523-981A-46B8-BA64-019261C88478',
            buttonChar: '0EE71524-981A-46B8-BA64-019261C88478',
            tempHumidChar: '0EE7152C-981A-46B8-BA64-019261C88478',
        };
        this._buttonCharacteristic = null;
        this._tempHumidCharacteristic = null;
        if (peripheral && !RS_Seek3.isDevice(peripheral)) {
            throw new Error('peripheral is not RS_Seek3');
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: 'RS_Seek3',
        };
    }
    /**
     * Verify that the received peripheral is from the RS_Seek3
     *
     * 受け取ったPeripheralがRS_Seek3のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the RS_Seek3
     *
     * RS_Seek3かどうか
     */
    static isDevice(peripheral) {
        if (peripheral.localName !== 'Seek3') {
            return false;
        }
        return true;
    }
    wired(obniz) {
        // do nothing.
    }
    /**
     * Connect the sensor
     *
     * センサへ接続
     */
    async connectWait() {
        if (!this._peripheral) {
            throw new Error('RS_Seek3 is not find.');
        }
        this._peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === 'function') {
                this.ondisconnect(reason);
            }
        };
        await this._peripheral.connectWait();
        this._buttonCharacteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.buttonChar);
        this._tempHumidCharacteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.tempHumidChar);
        if (this._buttonCharacteristic) {
            this._buttonCharacteristic.registerNotify((data) => {
                if (typeof this.onpressed === 'function') {
                    this.onpressed();
                }
            });
        }
    }
    /**
     * Disconnect from the sensor
     *
     * センサから切断
     */
    async disconnectWait() {
        var _a;
        await ((_a = this._peripheral) === null || _a === void 0 ? void 0 : _a.disconnectWait());
    }
    /**
     * Get temperature and humidity data from the RS_SEEK3
     *
     * RS_SEEK3から温湿度データを取得
     *
     * @returns temperature and humidity data 温湿度データ
     *
     * ```
     * {
     *
     * temperature: temperature 温度,
     *
     * humidity: humidity 湿度
     *
     * }
     * ```
     */
    async getTempHumidWait() {
        if (!this._tempHumidCharacteristic) {
            throw new Error('device is not connected');
        }
        const data = await this._tempHumidCharacteristic.readWait();
        return { temperature: data[0], humidity: data[1] };
    }
}
exports.default = RS_Seek3;
