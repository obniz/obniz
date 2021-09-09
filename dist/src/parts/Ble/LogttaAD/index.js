"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_AD
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** Logtta_AD management class Logtta_ADを管理するクラス */
class Logtta_AD {
    constructor(peripheral) {
        if (peripheral && !Logtta_AD.isDevice(peripheral)) {
            throw new Error('peripheral is not logtta AD');
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: 'Logtta_AD',
        };
    }
    /**
     * Verify that the received peripheral is from the Logtta_AD
     *
     * 受け取ったPeripheralがLogtta_ADのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_AD
     *
     * Logtta_ADかどうか
     */
    static isDevice(peripheral) {
        return peripheral.localName === 'Analog';
    }
    static get_uuid(uuid) {
        return `4e43${uuid}-6687-4f3c-a1c3-1c327583f29d`;
    }
    /**
     * Connect to the Logtta_AD
     *
     * Logtta_ADに接続
     */
    async connectWait() {
        if (!this._peripheral) {
            throw new Error('Logtta AD not found');
        }
        if (!this._peripheral.connected) {
            this._peripheral.ondisconnect = (reason) => {
                if (typeof this.ondisconnect === 'function') {
                    this.ondisconnect(reason);
                }
            };
            await this._peripheral.connectWait();
        }
    }
    /**
     * Disconnect from the Logtta_AD
     *
     * Logtta_ADとの接続を解除
     */
    async disconnectWait() {
        if (this._peripheral && this._peripheral.connected) {
            await this._peripheral.disconnectWait();
        }
    }
    /**
     * Get all data available from the Logtta_AD
     *
     * Logtta_ADから取得可能なデータを全て取得
     *
     * @returns all data available from the Logtta_AD
     *
     * Logtta_ADから受け取った全てのデータ
     */
    async getAllWait() {
        if (!(this._peripheral && this._peripheral.connected)) {
            return null;
        }
        const c = this._peripheral
            .getService(Logtta_AD.get_uuid('AE20'))
            .getCharacteristic(Logtta_AD.get_uuid('AE21'));
        const data = await c.readWait();
        return {
            ampere: (((data[0] << 8) | data[1]) * 916) / 16,
            volt: (((data[0] << 8) | data[1]) * 916) / 4,
            count: (data[2] << 8) | data[3],
        };
    }
    /**
     * Get the current value from the Logtta_AD
     *
     * Logtta_ADから電流値を取得
     *
     * @returns the current value from the Logtta_AD
     *
     * Logtta_ADから受け取った電流値
     */
    async getAmpereWait() {
        return (await this.getAllWait()).ampere;
    }
    /**
     * Get the voltage value from the Logtta_AD
     *
     * Logtta_ADから電圧値を取得
     *
     * @returns the voltage value from the Logtta_AD
     *
     * Logtta_ADから受け取った電圧値
     */
    async getVoltWait() {
        return (await this.getAllWait()).volt;
    }
    /**
     * Get the count data from the Logtta_AD
     *
     * Logtta_ADからカウントデータを取得
     *
     * @returns the count data from the Logtta_AD
     *
     * Logtta_ADから受け取ったカウントデータ
     */
    async getCountWait() {
        return (await this.getAllWait()).count;
    }
    /**
     * Notify when the data have got from the Logtta_AD
     *
     * Logtta_ADからデータを取得したとき通知
     *
     * @returns
     */
    async startNotifyWait() {
        if (!(this._peripheral && this._peripheral.connected)) {
            return;
        }
        const c = this._peripheral
            .getService(Logtta_AD.get_uuid('AE20'))
            .getCharacteristic(Logtta_AD.get_uuid('AE21'));
        await c.registerNotifyWait((data) => {
            if (this.onNotify) {
                this.onNotify({
                    ampere: (16 / 916) * ((data[0] << 8) | data[1]),
                    volt: (4 / 916) * ((data[0] << 8) | data[1]),
                    count: (data[2] << 8) | data[3],
                });
            }
        });
    }
}
exports.default = Logtta_AD;
