"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../../obniz/ObnizPartsBleAbstract");
const batteryService_1 = require("../services/batteryService");
const genericAccess_1 = require("../services/genericAccess");
const PinCodeFlag = {
    Authentication: 0x00,
    Rewrite: 0x01,
};
/** abstract class common to the Logtta series Logttaシリーズ共通の抽象クラス */
class Logtta extends ObnizPartsBleAbstract_1.ObnizPartsBleConnectable {
    constructor(peripheral, mode) {
        super(peripheral, mode);
        this.serviceUuid = '';
        this.authenticated = false;
    }
    /**
     * Connect to the services of a device
     *
     * デバイスのサービスに接続
     *
     * @param keys Key acquired when pairing previously 以前にペアリングしたときに取得されたキー
     */
    async connectWait(keys) {
        var _a;
        this.serviceUuid = ((_a = this.staticClass.getServiceUuids('Connectable')) !== null && _a !== void 0 ? _a : [
            '',
        ])[0];
        await super.connectWait(keys);
        const service1800 = this.peripheral.getService('1800');
        if (service1800) {
            this.genericAccess = new genericAccess_1.BleGenericAccess(service1800);
        }
        const service180F = this.peripheral.getService('180F');
        if (service180F) {
            this.batteryService = new batteryService_1.BleBatteryService(service180F);
        }
    }
    async beforeOnDisconnectWait() {
        this.authenticated = false;
        this.genericAccess = undefined;
        this.batteryService = undefined;
    }
    /**
     * Get data with connected state
     *
     * 接続状態でデータを取得
     *
     * @returns received value from each sensor それぞれのセンサから取得した値
     */
    async getDataWait() {
        this.checkConnected();
        const data = await this.readCharWait(this.serviceUuid, this.getCharUuid(0x21));
        return this.parseData(data);
    }
    /**
     * Notify when the data have got from the device with connected state
     *
     * 接続状態でデータを取得したとき通知
     *
     * @param callback callback function コールバック関数
     *
     * @returns
     */
    async startNotifyWait(callback) {
        // TODO: delete try-catch
        try {
            this.checkConnected();
        }
        catch (e) {
            console.error(e);
            return;
        }
        // TODO: delete if
        if (callback)
            this.onNotify = callback;
        return await this.subscribeWait(this.serviceUuid, this.getCharUuid(0x21), (data) => {
            if (this.onNotify) {
                this.onNotify(this.parseData(data));
            }
        });
    }
    /**
     * Authorize PIN code
     *
     * ピンコードを認証
     *
     * @param code PIN code ピンコード
     *
     * @returns Whether authentication was/is passed 認証が通った/通っているかどうか
     */
    async authPinCodeWait(code) {
        // TODO: delete try-catch
        try {
            this.checkConnected();
        }
        catch (e) {
            console.error(e);
            return false;
        }
        if (this.authenticated)
            return true;
        if (typeof code === 'string')
            code = parseInt(code); // TODO: delete string type
        this.authenticated = await this.sendPinCodeWait('Authentication', code);
        return this.authenticated;
    }
    async sendPinCodeWait(type, code) {
        if (code < 0 || code > 9999)
            throw new Error(`Authorization code can only be entered from 0000~9999. input: ${code}`);
        return await this.writeCharWait(this.serviceUuid, this.getCharUuid(0x30), [
            PinCodeFlag[type],
            Math.floor(code / 1000) % 10 | Math.floor(code / 100) % 10,
            Math.floor(code / 10) % 10 | Math.floor(code / 1) % 10,
        ]);
    }
    checkAuthenticated() {
        if (!this.authenticated)
            throw new Error('Certification is required, execute authPinCodeWait() in advance.');
    }
    /**
     * Set / unset to Beacon Mode
     *
     * ビーコンモードに設定/解除
     *
     * @param enable enable / disable 有効 / 無効
     *
     * @returns data write result
     */
    async setBeaconModeWait(enable) {
        // TODO: delete try-catch
        try {
            this.checkConnected();
            this.checkAuthenticated();
        }
        catch (e) {
            console.error(e);
            return false;
        }
        return this.writeCharWait(this.serviceUuid, this.getCharUuid(0x2d), [
            enable ? 1 : 0,
        ]);
    }
    getName() {
        const array = this.peripheral.adv_data.slice(16);
        return array
            .slice(0, array.indexOf(0) + 1)
            .map((d) => String.fromCharCode(d))
            .join('');
    }
    getCharUuid(code) {
        return `${this.serviceUuid.slice(0, 6)}${code.toString(16)}${this.serviceUuid.slice(8)}`;
    }
}
exports.default = Logtta;
Logtta.AvailableBleMode = ['Connectable', 'Beacon'];
Logtta.LocalName = {
    Connectable: undefined,
    Beacon: /null/,
};
Logtta.BeaconDataLength = {
    Connectable: null,
    Beacon: 0x1b,
};
Logtta.CompanyID = {
    Connectable: null,
    Beacon: [0x10, 0x05],
};
