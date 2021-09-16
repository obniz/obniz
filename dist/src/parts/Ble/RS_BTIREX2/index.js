"use strict";
/**
 * @packageDocumentation
 * @module Parts.RS_BTIREX2
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
// not working
/** 【NOT WORKING】 RS_BTIREX2 management class RS_BTIREX2を管理するクラス */
class RS_BTIREX2 {
    constructor(peripheral) {
        this.keys = [];
        this.requiredKeys = [];
        /**
         * Callback when the button is pressed
         *
         * ボタンが押されたときにコールバック
         */
        this.onbuttonpressed = null;
        this._uuids = {
            service: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
            rxChar: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
            txChar: '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
        };
        this._peripheral = null;
        this._rxCharacteristic = null;
        this._txCharacteristic = null;
        if (peripheral && !RS_BTIREX2.isDevice(peripheral)) {
            throw new Error('peripheral is not RS_BTIREX2');
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: 'RS_BTIREX2',
        };
    }
    /**
     * Verify that the received peripheral is from the RS_BTIREX2
     *
     * 受け取ったPeripheralがRS_BTIREX2のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the RS_BTIREX2
     *
     * RS_BTIREX2かどうか
     */
    static isDevice(peripheral) {
        if (peripheral.localName && peripheral.localName.startsWith('BTIR')) {
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
            throw new Error('RS_BTIREX2 is not find.');
        }
        this._peripheral.ondisconnect = () => {
            console.log('disconnect');
        };
        await this._peripheral.connectWait();
        console.error('encrypt start');
        // const handle = this._peripheral.obnizBle.centralBindings._handles[this._peripheral.address];
        // this._peripheral.obnizBle.centralBindings._aclStreams[handle].encrypt();
        this._rxCharacteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.rxChar);
        this._txCharacteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.txChar);
    }
    /**
     * Make and send a command
     *
     * コマンドの作成と送信
     *
     * @param payload payload ペイロード
     *
     * @param crc CRC of the payload ペイロードのCRC
     *
     * @returns
     */
    _sendAndReceiveWait(payload, crc = 0xb6) {
        if (!this._rxCharacteristic || !this._txCharacteristic) {
            throw new Error('device is not connected');
        }
        const data = new Array(payload.length + 4);
        data[0] = 0xaa;
        data[1] = 0;
        data[2] = payload.length;
        for (let index = 0; index < payload.length; index++) {
            data[3 + index] = payload[index];
        }
        data[payload.length + 3] = crc;
        const tx = this._txCharacteristic;
        const p = new Promise((resolve) => {
            tx.registerNotify((resultData) => {
                console.error('CRC ' + crc);
                resolve(resultData);
            });
        });
        this._rxCharacteristic.write(data);
        return p;
    }
}
exports.default = RS_BTIREX2;
