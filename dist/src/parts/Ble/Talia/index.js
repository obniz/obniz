"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Talia {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'Talia',
        };
    }
    /**
     * UIDフレームとTLMフレームの2種類のadがあり、UIDフレームからしかTaliaかどうか判断できない。
     * TLMフレームの判断はクライアント側でdevice addressをキャッシュして行う。
     */
    static isDeviceFromUid(peripheral) {
        if (peripheral.adv_data
            .toString()
            .includes('69,84,65,84,65,76,73,65,82,69') ||
            peripheral.adv_data.toString().includes('69,84,65,84,65,76,76,89,82,69') // ETATALIARE or ETATALLYRE
        ) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * TLMフレームからデータを取得する。
     * getMode()で先にUIDかTLMか判断した方が良い。
     */
    static getData(peripheral) {
        if (this.getMode(peripheral) !== 'TLM') {
            return null;
        }
        const ad = peripheral.adv_data.slice(11);
        const data = {
            address: peripheral.address,
            primary_count: ad[8],
            secondary_count: ad[9],
            flow_enter: ad[10],
            flow_exit: ad[11],
            // battery: ad[12], // 現在のファームウェアでは未対応で常に100が返ってくる
        };
        return data;
    }
    /**
     * adのモード(UID or TLM)を返す。
     */
    static getMode(peripheral) {
        const ad = peripheral.adv_data.slice(11);
        if (ad[0] === 0) {
            return 'UID';
        }
        else if (ad[0] === 32) {
            return 'TLM';
        }
        else {
            return;
        }
    }
}
exports.default = Talia;
