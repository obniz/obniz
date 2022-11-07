"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UC352BLE {
    constructor(peripheral) {
        if (!peripheral || !UC352BLE.isDevice(peripheral)) {
            throw new Error('peripheral is not UC352BLE');
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: 'UC352BLE',
        };
    }
    static isDevice(peripheral) {
        if (!peripheral.localName)
            return false;
        return peripheral.localName.startsWith('A&D_UC-352BLE');
    }
    /**
     * Pair with the device
     *
     * デバイスとペアリング 裏のボタンを押しながら起動してペアリングする必要あり
     *
     * @returns pairing key ペアリングキー
     */
    async pairingWait() {
        if (!this._peripheral) {
            throw new Error('UC352BLE not found');
        }
        this._peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === 'function') {
                this.ondisconnect(reason);
            }
        };
        let key = null;
        await this._peripheral.connectWait({
            pairingOption: {
                onPairedCallback: (pairingKey) => {
                    key = pairingKey;
                },
            },
        });
        return key;
    }
    /**
     * Get Weight Data from Device
     *
     * デバイスから計測データをとる
     *
     * @returns 受け取ったデータ
     */
    async getDataWait(pairingKeys) {
        if (!this._peripheral) {
            throw new Error('UC352BLE not found');
        }
        let result = { weight: 0 };
        await this._peripheral.connectWait({
            pairingOption: { keys: pairingKeys },
            waitUntilPairing: true,
        });
        const service = this._peripheral.getService('181D');
        const chara = await (service === null || service === void 0 ? void 0 : service.getCharacteristic('2A9D'));
        const waitDisconnect = new Promise((resolve, reject) => {
            if (!this._peripheral)
                return;
            this._peripheral.ondisconnect = (reason) => {
                resolve(result);
            };
        });
        await (chara === null || chara === void 0 ? void 0 : chara.registerNotifyWait((data) => {
            const _result = { weight: 0 };
            _result.weight = ((data[2] << 8) | data[1]) * 0.005;
            result = _result;
        }));
        return await waitDisconnect;
    }
}
exports.default = UC352BLE;
