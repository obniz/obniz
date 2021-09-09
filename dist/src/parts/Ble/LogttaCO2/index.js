"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */
/* eslint rulesdir/non-ascii: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const batteryService_1 = __importDefault(require("../utils/services/batteryService"));
const genericAccess_1 = __importDefault(require("../utils/services/genericAccess"));
/** Logtta_CO2 management class Logtta_CO2を管理するクラス */
class Logtta_CO2 {
    constructor(peripheral) {
        if (peripheral && !Logtta_CO2.isDevice(peripheral)) {
            throw new Error('peripheral is not Logtta CO2');
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: 'Logtta_CO2',
        };
    }
    /**
     * Verify that the received peripheral is from the Logtta_CO2
     *
     * 受け取ったPeripheralがLogtta_CO2のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_CO2
     *
     * Logtta_CO2かどうか
     */
    static isDevice(peripheral) {
        return peripheral.localName === 'CO2 Sensor';
    }
    /**
     * Verify that the received advertisement is from the Logtta_CO2
     *
     * 受け取ったAdvertisementがLogtta_CO2のものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_CO2
     *
     * Logtta_CO2かどうか
     */
    static isAdvDevice(peripheral) {
        if (peripheral.adv_data.length !== 31) {
            return false;
        }
        const data = peripheral.adv_data;
        if (data[5] !== 0x10 ||
            data[6] !== 0x05 ||
            data[7] !== 0x02 ||
            data[16] !== 0x43 ||
            data[17] !== 0x4f ||
            data[18] !== 0x32) {
            // CompanyID, Appearance, "C" "O" "2"
            return false;
        }
        return true;
    }
    /**
     * Get a data from the Logtta_CO2 advertisement
     *
     * Logtta_CO2のadvertisementからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Logtta_CO2 advertisement
     *
     * Logtta_CO2のadvertisementからのデータ
     */
    static getData(peripheral) {
        if (!this.isAdvDevice(peripheral)) {
            return null;
        }
        const data = peripheral.adv_data;
        const alert = data[15];
        const interval = (data[13] << 8) | data[14];
        const advData = {
            battery: data[12],
            co2: (data[8] << 8) | data[9],
            interval,
            address: peripheral.address,
        };
        return advData;
    }
    static getName(data) {
        let name = '';
        for (let i = 16; i < data.length; i++) {
            if (data[i] === 0) {
                break;
            }
            name += String.fromCharCode(data[i]);
        }
        return name;
    }
    static get_uuid(uuid) {
        return `31f3${uuid}-bd1c-46b1-91e4-f57abcf7d449`;
    }
    /**
     * Connect the sensor
     *
     * センサへ接続
     */
    async connectWait() {
        if (!this._peripheral) {
            throw new Error('Logtta CO2 not found');
        }
        if (!this._peripheral.connected) {
            this._peripheral.ondisconnect = (reason) => {
                if (typeof this.ondisconnect === 'function') {
                    this.ondisconnect(reason);
                }
            };
            await this._peripheral.connectWait();
            const service1800 = this._peripheral.getService('1800');
            if (service1800) {
                this.genericAccess = new genericAccess_1.default(service1800);
            }
            const service180F = this._peripheral.getService('180F');
            if (service180F) {
                this.batteryService = new batteryService_1.default(service180F);
            }
        }
    }
    /**
     * Disconnect from the sensor
     *
     * センサとの接続を切断
     */
    async disconnectWait() {
        if (this._peripheral && this._peripheral.connected) {
            await this._peripheral.disconnectWait();
        }
    }
    /**
     * Get CO2 concentration data with connected state
     *
     * 接続している状態でCO2濃度データを取得
     *
     * @returns CO2 concentration data from the Logtta_CO2
     *
     * Logtta_CO2から受け取ったCO2濃度データ
     */
    async getWait() {
        if (!(this._peripheral && this._peripheral.connected)) {
            return null;
        }
        const c = this._peripheral
            .getService(Logtta_CO2.get_uuid('AB20'))
            .getCharacteristic(Logtta_CO2.get_uuid('AB21'));
        const data = await c.readWait();
        return data[0] * 256 + data[1];
    }
    /**
     * Notify when the CO2 concentration data have got from the Logtta_CO2 with connected state
     *
     * 接続している状態でLogtta_CO2からCO2濃度データを取得したとき通知
     *
     * @returns
     */
    async startNotifyWait() {
        if (!(this._peripheral && this._peripheral.connected)) {
            return;
        }
        const c = this._peripheral
            .getService(Logtta_CO2.get_uuid('AB20'))
            .getCharacteristic(Logtta_CO2.get_uuid('AB21'));
        await c.registerNotifyWait((data) => {
            if (this.onNotify) {
                this.onNotify(data[0] * 256 + data[1]);
            }
        });
    }
    /**
     * Authenticate with the sensor using pin code
     *
     * ピンコードによってセンサと認証
     *
     * @param code pin code (default: "0000")
     *
     * ピンコード (デフォルト: "0000")
     *
     * @returns
     */
    async authPinCodeWait(code) {
        if (!(this._peripheral && this._peripheral.connected)) {
            return;
        }
        if (code.length !== 4) {
            throw new Error('Invalid length auth code');
        }
        const data = [0];
        for (let i = 0; i < code.length; i += 2) {
            data.push((this.checkNumber(code.charAt(i)) << 4) |
                this.checkNumber(code.charAt(i + 1)));
        }
        const c = this._peripheral
            .getService(Logtta_CO2.get_uuid('AB20'))
            .getCharacteristic(Logtta_CO2.get_uuid('AB30'));
        await c.writeWait(data);
    }
    /**
     * @deprecated Please use {@linkplain setBeaconModeWait}
     *
     * {@linkplain setBeaconModeWait} の使用を推奨
     *
     * @param enable enable the beacon mode or not ビーコンモードを有効にするかどうか
     *
     */
    setBeaconMode(enable) {
        return this.setBeaconModeWait(enable);
    }
    /**
     * Set enable / disable for beacon mode (periodic beacon transmission)
     *
     * Call this function after authenticating with the sensor
     *
     * After setting, disconnect once to enable it
     *
     * To stop beacon mode, you need to hold the button on the sensor for more than 2 seconds
     *
     * (For more detail, please see http://www.uni-elec.co.jp/logtta_page.html )
     *
     * ビーコンモード(定期的なビーコン発信)の有効/無効の設定
     *
     * センサとの認証を済ませた状態で実行してください
     *
     * 設定後に切断した後から有効になります
     *
     * ビーコンモードの終了は、デバイスのボタンを2秒以上長押しする操作が必要です(詳しくは http://www.uni-elec.co.jp/logtta_page.html )
     *
     * @param enable enable the beacon mode or not ビーコンモードを有効にするかどうか
     *
     * @returns
     */
    async setBeaconModeWait(enable) {
        if (!(this._peripheral && this._peripheral.connected)) {
            return;
        }
        const c = this._peripheral
            .getService(Logtta_CO2.get_uuid('AB20'))
            .getCharacteristic(Logtta_CO2.get_uuid('AB2D'));
        if (enable) {
            await c.writeWait([1]);
        }
        else {
            await c.writeWait([0]);
        }
    }
    checkNumber(data) {
        if (data >= '0' && data <= '9') {
            return parseInt(data, 10);
        }
        else {
            throw new Error(`authorization code can only be entered from 0-9.input word : ${data}`);
        }
    }
}
exports.default = Logtta_CO2;
