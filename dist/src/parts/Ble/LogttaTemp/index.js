"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_TH
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Logtta_TH(Logtta_Temp) management class
 *
 * Logtta_TH(Logtta_Temp)を管理するクラス
 */
class Logtta_TH {
    constructor(peripheral) {
        if (peripheral && !Logtta_TH.isDevice(peripheral)) {
            throw new Error('peripheral is not logtta TH');
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: 'Logtta_TH',
        };
    }
    /**
     * Verify that the received peripheral is from the Logtta_TH(Logtta_Temp)
     *
     * 受け取ったPeripheralがLogtta_TH(Logtta_Temp)のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_TH(Logtta_Temp)
     *
     * Logtta_TH(Logtta_Temp)かどうか
     */
    static isDevice(peripheral) {
        return peripheral.localName === 'TH Sensor';
    }
    /**
     * Verify that the received advertisement is from the Logtta_TH(Logtta_Temp)
     *
     * 受け取ったAdvertisementがLogtta_TH(Logtta_Temp)のものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_TH(Logtta_Temp)
     *
     * Logtta_TH(Logtta_Temp)かどうか
     */
    static isAdvDevice(peripheral) {
        if (peripheral.adv_data.length !== 31) {
            return false;
        }
        const data = peripheral.adv_data;
        if (data[5] !== 0x10 ||
            data[6] !== 0x05 ||
            data[7] !== 0x01 ||
            data[16] !== 0x54 ||
            data[17] !== 0x48) {
            // CompanyID, Appearance, "T" "H"
            return false;
        }
        return true;
    }
    /**
     * Get a data from the Logtta_TH(Logtta_Temp) advertisement
     *
     * Logtta_TH(Logtta_Temp)のadvertisementからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Logtta_TH(Logtta_Temp) advertisement
     *
     * Logtta_TH(Logtta_Temp)のadvertisementからのデータ
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
            temperature: (((data[8] << 8) | data[9]) / 65536) * 175.72 - 46.85,
            humidity: (((data[10] << 8) | data[11]) / 65536) * 125 - 6,
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
        return `f7ee${uuid}-276e-4165-aa69-7e3de7fc627e`;
    }
    /**
     * Connect the sensor
     *
     * センサへ接続
     */
    async connectWait() {
        if (!this._peripheral) {
            throw new Error('Logtta TH not found');
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
     * Get the both temperature and humidity data with connected state
     *
     * 接続している状態で温度と湿度の両方のデータを取得
     *
     * @returns both temperature and humidity data from the Logtta_TH(Logtta_Temp)
     *
     * Logtta_TH(Logtta_Temp)から受け取った温度と湿度の両方のデータ
     */
    async getAllWait() {
        if (!(this._peripheral && this._peripheral.connected)) {
            return null;
        }
        const c = this._peripheral
            .getService(Logtta_TH.get_uuid('AA20'))
            .getCharacteristic(Logtta_TH.get_uuid('AA21'));
        const data = await c.readWait();
        return {
            temperature: (((data[0] << 8) | data[1]) / 65536) * 175.72 - 46.85,
            humidity: (((data[2] << 8) | data[3]) / 65536) * 125 - 6,
        };
    }
    /**
     * Get the temperature data with connected state
     *
     * 接続している状態で温度のデータを取得
     *
     * @returns temperature data from the Logtta_TH(Logtta_Temp)
     *
     * Logtta_TH(Logtta_Temp)から受け取った温度データ
     */
    async getTemperatureWait() {
        return (await this.getAllWait()).temperature;
    }
    /**
     * Get the humidity data with connected state
     *
     * 接続している状態で湿度のデータを取得
     *
     * @returns humidity data from the Logtta_TH(Logtta_Temp)
     *
     * Logtta_TH(Logtta_Temp)から受け取った湿度データ
     */
    async getHumidityWait() {
        return (await this.getAllWait()).humidity;
    }
    /**
     * Notify when the data have got from the Logtta_TH(Logtta_Temp) with connected state
     *
     * 接続している状態でLogtta_TH(Logtta_Temp)からデータを取得したとき通知
     *
     * @returns
     */
    async startNotifyWait() {
        if (!(this._peripheral && this._peripheral.connected)) {
            return;
        }
        const c = this._peripheral
            .getService(Logtta_TH.get_uuid('AA20'))
            .getCharacteristic(Logtta_TH.get_uuid('AA21'));
        await c.registerNotifyWait((data) => {
            if (this.onNotify) {
                this.onNotify({
                    temperature: (((data[0] << 8) | data[1]) / 65536) * 175.72 - 46.85,
                    humidity: (((data[2] << 8) | data[3]) / 65536) * 125 - 6,
                });
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
            .getService(Logtta_TH.get_uuid('AA20'))
            .getCharacteristic(Logtta_TH.get_uuid('AA30'));
        await c.writeWait(data);
    }
    /**
     * @deprecated Please use {@linkplain setBeaconModeWait}
     *
     * {@linkplain setBeaconModeWait} の使用を推奨
     *
     * @param enable enable the beacon mode or not ビーコンモードを有効にするかどうか
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
            .getService(Logtta_TH.get_uuid('AA20'))
            .getCharacteristic(Logtta_TH.get_uuid('AA2D'));
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
exports.default = Logtta_TH;
