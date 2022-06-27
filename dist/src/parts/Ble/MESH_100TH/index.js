"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
/** MESH_100TH management class MESH_100THを管理するクラス */
class MESH_100TH extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        this.staticClass = MESH_100TH;
        /** 例） Event handler for button ボタンのイベントハンドラー */
        this.onButtonPressed = null;
    }
    /**
     * adからこのデバイスであること判定する
     */
    static isDeviceWithMode(peripheral, mode) {
        if (mode !== 'Connectable') {
            return false;
        }
        const ad = peripheral.adv_data;
        // sample
        // if(ad[0] === 0 && ad[1] === 1){
        //   return true
        // }
        return true;
    }
    /**
     * Connect to the services of a device
     *
     * デバイスのサービスに接続
     */
    async connectWait() {
        await super.connectWait();
        await this.authWait();
    }
    // 接続してデータを取ってくる
    async getDataWait() {
        this.checkConnected();
        return {
            battery: 0,
            temperature: 0,
            humidity: 0,
        };
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
}
exports.default = MESH_100TH;
MESH_100TH.PartsName = 'MESH_100TH';
MESH_100TH.AvailableBleMode = 'Connectable';
