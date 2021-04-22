"use strict";
/**
 * @packageDocumentation
 * @module Parts.RS_BTEVS1
 */
Object.defineProperty(exports, "__esModule", { value: true });
const LED_DISPLAY_MODE = ['Disable', 'PM2.5', 'CO2'];
const PM2_5_CONCENTRATION_MODE = ['Mass', 'Number'];
class RS_BTEVS1 {
    constructor(peripheral) {
        this.keys = [];
        this.requiredKeys = [];
        /** Event handler for button ボタンのイベントハンドラー */
        this.onButtonPressed = null;
        /** Event handler for temperature sensor 温度センサーのイベントハンドラー */
        this.onTempMeasured = null;
        /** Event handler for co2 sensor CO2センサーのイベントハンドラー */
        this.onCo2Measured = null;
        /** Event handler for PM2.5 sensor PM2.5センサーのイベントハンドラー */
        this.onPm2_5Measured = null;
        /** Instance of BleRemotePeripheral BleRemotePeripheralのインスタンス */
        this._peripheral = null;
        this._uuids = {
            service: 'F9CC15234E0A49E58CF30007E819EA1E',
            buttonChar: 'F9CC15244E0A49E58CF30007E819EA1E',
            configChar: 'F9CC15254E0A49E58CF30007E819EA1E',
            tempChar: 'F9CC15264E0A49E58CF30007E819EA1E',
            co2Char: 'F9CC15274E0A49E58CF30007E819EA1E',
            pm2_5Char: 'F9CC15284E0A49E58CF30007E819EA1E',
        };
        this._buttonCharacteristic = null;
        this._configCharacteristic = null;
        this._tempCharacteristic = null;
        this._co2Characteristic = null;
        this._pm2_5Characteristic = null;
        if (peripheral && !RS_BTEVS1.isDevice(peripheral)) {
            throw new Error('peripheral is not RS_BTEVS1');
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: 'RS_BTEVS1',
        };
    }
    /**
     * Determine if it is RS-BTEVS1
     *
     * RS-BTEVS1かどうか判定
     *
     * @param peripheral Instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     * @returns Whether it is RS-BTEVS1 RS-BTEVS1かどうか
     */
    static isDevice(peripheral) {
        return peripheral.localName !== null && peripheral.localName.indexOf('BTEVS') === 0;
    }
    /**
     * Get advertising data
     *
     * アドバタイジングデータを取得
     *
     * @param peripheral Instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     * @returns RS-BTEVS1 advertising data RS-BTEVS1のアドバタイジングデータ
     */
    static getData(peripheral) {
        if (!RS_BTEVS1.isDevice(peripheral)) {
            return null;
        }
        const buf = Buffer.from(peripheral.adv_data);
        const data = {
            co2: buf.readUInt16LE(11),
            pm1_0: buf.readUInt8(13),
            pm2_5: buf.readUInt8(14),
            pm5_0: buf.readUInt8(15),
            pm10_0: buf.readUInt8(16),
            temp: buf.readUInt8(17),
            humid: buf.readUInt8(18)
        };
        return data;
    }
    wired(obniz) { }
    /**
     * Connect to device デバイスに接続
     */
    async connectWait() {
        if (!this._peripheral) {
            throw new Error('RS_BTEVS1 is not find.');
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
        this._configCharacteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.configChar);
        this._tempCharacteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.tempChar);
        this._co2Characteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.co2Char);
        this._pm2_5Characteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.pm2_5Char);
        if (this._buttonCharacteristic) {
            await this._buttonCharacteristic.registerNotifyWait((data) => {
                if (typeof this.onButtonPressed === 'function') {
                    this.onButtonPressed(data[0] === 1);
                }
            });
        }
    }
    /**
     * Disconnect from device デバイスから切断
     */
    async disconnectWait() {
        await this._peripheral.disconnectWait();
    }
    /**
     * Get device settings デバイスの設定を取得
     *
     * @returns Instance of RS_BTEVS1_Config RS_BTEVS1_Configのインスタンス
     */
    async getConfigWait() {
        if (!this._configCharacteristic) {
            throw new Error('device is not connected');
        }
        const data = await this._configCharacteristic.readWait();
        const buf = Buffer.from(data);
        const measureOperation = buf.readUInt8(3);
        return {
            pm2_5ConcentrationMode: PM2_5_CONCENTRATION_MODE[buf.readUInt8(0)],
            advertisementBeacon: buf.readUInt8(1) === 1,
            ledDisplay: LED_DISPLAY_MODE[buf.readUInt8(2)],
            co2MeasureOperation: (measureOperation & 0b001) > 0,
            pm2_5MeasureOperation: (measureOperation & 0b010) > 0,
            tempMeasureOperation: (measureOperation & 0b100) > 0,
            co2Interval: buf.readUInt32LE(4),
            pm2_5Interval: buf.readUInt32LE(8),
            tempInterval: buf.readUInt32LE(12),
        };
    }
    /**
     * Write device settings, blanks write initial values
     *
     * デバイス設定の書き込み、空欄は初期値を書き込み
     *
     * @param config Instance of RS_BTEVS1_Config RS_BTEVS1_Configのインスタンス
     * @returns Write result 書き込み結果
     */
    async setConfigWait(config) {
        var _a, _b, _c;
        if (!this._configCharacteristic) {
            throw new Error('device is not connected');
        }
        const buf = Buffer.alloc(16);
        buf.writeUInt8(PM2_5_CONCENTRATION_MODE.indexOf(config.pm2_5ConcentrationMode && PM2_5_CONCENTRATION_MODE.indexOf(config.pm2_5ConcentrationMode) >= 0 ? config.pm2_5ConcentrationMode : 'Number'), 0);
        buf.writeUInt8(config.advertisementBeacon ? 1 : 0, 1);
        buf.writeUInt8(LED_DISPLAY_MODE.indexOf(config.ledDisplay && LED_DISPLAY_MODE.indexOf(config.ledDisplay) >= 0 ? config.ledDisplay : 'Disable'), 2);
        buf.writeUInt8(0
            + (config.co2MeasureOperation ? 0b001 : 0)
            + (config.pm2_5MeasureOperation ? 0b010 : 0)
            + (config.tempMeasureOperation ? 0b100 : 0), 3);
        buf.writeUInt32LE((_a = config.co2Interval, (_a !== null && _a !== void 0 ? _a : 10000)), 4);
        buf.writeUInt32LE((_b = config.pm2_5Interval, (_b !== null && _b !== void 0 ? _b : 10000)), 8);
        buf.writeUInt32LE((_c = config.tempInterval, (_c !== null && _c !== void 0 ? _c : 10000)), 12);
        return await this._configCharacteristic.writeWait(buf);
    }
    /**
     * Start reading the temperature sensor
     *
     * 温度センサーの読み取りを開始
     */
    async tempMeasureStartWait() {
        //await this._measureStartWait(this._tempCharacteristic);
        if (!this._tempCharacteristic) {
            throw new Error('device is not connected');
        }
        await this._tempCharacteristic.registerNotifyWait((data) => {
            if (typeof this.onTempMeasured !== 'function')
                return;
            const buf = Buffer.from(data);
            this.onTempMeasured(buf.readInt8(0), buf.readUInt8(1));
        });
    }
    /**
     * Start reading the co2 sensor
     *
     * CO2センサーの読み取りを開始
     */
    async co2MeasureStartWait() {
        //await this._measureStartWait(this._co2Characteristic);
        if (!this._co2Characteristic) {
            throw new Error('device is not connected');
        }
        await this._co2Characteristic.registerNotifyWait((data) => {
            if (typeof this.onCo2Measured !== 'function')
                return;
            const buf = Buffer.from(data);
            this.onCo2Measured(buf.readUInt16LE(0));
        });
    }
    /**
     * Start reading the PM2.5 sensor
     *
     * PM2.5センサーの読み取りを開始
     */
    async pm2_5MeasureStartWait() {
        //await this._measureStartWait(this._pm2_5Characteristic);
        if (!this._pm2_5Characteristic) {
            throw new Error('device is not connected');
        }
        await this._pm2_5Characteristic.registerNotifyWait((data) => {
            if (typeof this.onPm2_5Measured !== 'function')
                return;
            const buf = Buffer.from(data);
            this.onPm2_5Measured({
                mass_pm1: buf.readFloatLE(0),
                mass_pm2_5: buf.readFloatLE(4),
                mass_pm5: buf.readFloatLE(8),
                mass_pm10: buf.readFloatLE(12),
                number_pm0_5: buf.readFloatLE(16),
            });
        });
    }
    /**
     * Send 1 to Descriptor of Characteristic argument
     *
     * 引数のCharacteristicのDescriptorに1を送信
     *
     * @param char Instance of BleRemoteCharacteristic BleRemoteCharacteristicのインスタンス
     */
    async _measureStartWait(char) {
        if (!char) {
            throw new Error('device is not connected');
        }
        const descriptor = char.getDescriptor('2902');
        if (!descriptor) {
            throw new Error('device is not connected');
        }
        await descriptor.writeWait([1]);
    }
}
exports.default = RS_BTEVS1;
/** RS-BTEVS1 sample advertising data RS-BTEVS1のサンプルのアドバタイジングデータ */
RS_BTEVS1.deviceAdv = [
    /* LEN TYPE VALUE */
    0x03, 0x19, 0x40, 0x05,
    0x02, 0x01, 0x05,
    0x0B, 0xFF, 0x00, 0xFF,
    -1, -1,
    -1, -1, -1, -1,
    -1, -1,
    0x0B, 0x08, 0x42, 0x54, 0x45, 0x56, 0x53, 0x2D, -1, -1, -1, -1 // localName
];
