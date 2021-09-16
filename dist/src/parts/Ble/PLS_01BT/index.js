"use strict";
/**
 * @packageDocumentation
 * @module Parts.PLS_01BT
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** PLS_01BT management class PLS_01BTを管理するクラス */
class PLS_01BT {
    constructor(peripheral) {
        this.keys = [];
        this.requiredKeys = [];
        /**
         * Callback when receiving the measured data
         *
         * 計測結果を受け取ったときにコールバック
         */
        this.onmeasured = null;
        this._uuids = {
            service: 'CDEACB80-5235-4C07-8846-93A37EE6B86D',
            rxChar: 'CDEACB81-5235-4C07-8846-93A37EE6B86D',
        };
        this._peripheral = null;
        this._rxCharacteristic = null;
        this._txCharacteristic = null;
        if (peripheral && !PLS_01BT.isDevice(peripheral)) {
            throw new Error('peripheral is not PLS_01BT');
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: 'PLS_01BT',
        };
    }
    /**
     * Verify that the received peripheral is from the PLS_01BT
     *
     * 受け取ったPeripheralがPLS_01BTのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the PLS_01BT
     *
     * PLS_01BTかどうか
     */
    static isDevice(peripheral) {
        if (peripheral.localName &&
            peripheral.localName.startsWith('My Oximeter')) {
            return true;
        }
        return false;
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
            throw new Error('PLS_01BT is not find.');
        }
        this._peripheral.ondisconnect = (reason) => {
            if (this.ondisconnect) {
                this.ondisconnect(reason);
            }
        };
        await this._peripheral.connectWait();
        this._rxCharacteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.rxChar);
        if (!this._rxCharacteristic) {
            throw new Error('device is not PLS_01BT');
        }
        await this._rxCharacteristic.registerNotifyWait((data) => {
            if (data.length === 4 && data[0] === 0x81) {
                if (data[1] !== 255 && data[2] !== 177) {
                    const pulseRate = data[1];
                    const bloodOxygenLevel = data[2];
                    const perfusionIndex = data[3];
                    if (this.onmeasured) {
                        this.onmeasured({
                            pulseRate,
                            bloodOxygenLevel,
                            perfusionIndex,
                        });
                    }
                }
            }
        });
    }
    /**
     * Disconnect from the sensor
     *
     * センサから切断
     */
    async disconnectWait() {
        if (!this._peripheral) {
            throw new Error('PLS_01BT is not find.');
        }
        await this._peripheral.disconnectWait();
    }
}
exports.default = PLS_01BT;
