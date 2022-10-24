"use strict";
/**
 * @packageDocumentation
 * @module Parts.REX_BTPM25V
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** REX_BTPM25V management class REX_BTPM25Vを管理するクラス */
class REX_BTPM25V {
    constructor(peripheral) {
        this.keys = [];
        this.requiredKeys = [];
        /**
         * Callback when the button is pressed
         *
         * ボタンが押されたときにコールバック
         */
        this.onbuttonpressed = null;
        this._peripheral = null;
        this._uuids = {
            service: '00001523-1212-EFDE-1523-785FEABCD123',
            buttonChar: '000000A1-1212-EFDE-1523-785FEABCD123',
            continuousMeasurementChar: '000000A5-1212-EFDE-1523-785FEABCD123',
            oneShotMeasurementChar: '000000A8-1212-EFDE-1523-785FEABCD123',
            ledChar: '000000A9-1212-EFDE-1523-785FEABCD123',
        };
        this._oneShotMeasurementCharacteristic = null;
        this._continuousMeasurementCharacteristic = null;
        this._ledCharacteristic = null;
        this._buttonCharacteristic = null;
        if (peripheral && !REX_BTPM25V.isDevice(peripheral)) {
            throw new Error('peripheral is not REX_BTPM25V');
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: 'REX_BTPM25V',
        };
    }
    /**
     * Verify that the received peripheral is from the REX_BTPM25V
     *
     * 受け取ったPeripheralがREX_BTPM25Vのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the REX_BTPM25V
     *
     * REX_BTPM25Vかどうか
     */
    static isDevice(peripheral) {
        if (peripheral.localName !== 'PM25V') {
            return false;
        }
        return true;
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
            throw new Error('REX_BTPM25V is not find.');
        }
        this._peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === 'function') {
                this.ondisconnect(reason);
            }
        };
        await this._peripheral.connectWait();
        this._oneShotMeasurementCharacteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.oneShotMeasurementChar);
        this._continuousMeasurementCharacteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.continuousMeasurementChar);
        this._ledCharacteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.ledChar);
        this._buttonCharacteristic = this._peripheral
            .getService(this._uuids.service)
            .getCharacteristic(this._uuids.buttonChar);
        if (this._buttonCharacteristic) {
            this._buttonCharacteristic.registerNotify((data) => {
                if (typeof this.onbuttonpressed === 'function') {
                    this.onbuttonpressed(data[0] === 1);
                }
            });
        }
    }
    /**
     * Disconnect from the sensor
     *
     * センサから切断
     */
    async disconnectWait() {
        var _a;
        await ((_a = this._peripheral) === null || _a === void 0 ? void 0 : _a.disconnectWait());
    }
    /**
     * Do one shot measurement
     *
     * ワンショット計測
     *
     * @returns one shot measurement data ワンショット計測データ
     *
     * ```
     * {
     *
     * pm2_5: PM2.5 concentration PM2.5濃度 (25~1000 [ug/m3]),
     *
     * pm10: PM10 concentration M10濃度 (25~1000 [ug/m3]),
     *
     * barometricPressure: barometric pressure 気圧 (300~1100 [hPa]),
     *
     * temperature: temperature 温度 (-20~85 [degC]),
     *
     * humidity: relative humidity 湿度 (10~70 [%RH]),
     *
     * lux: illuminance 照度 (0~65535 [lx]),
     *
     * mode: mode flag モードフラグ (0: 連続計測, 1: 最新計測データ, 3: ワンショット)
     *
     * }
     * ```
     *
     */
    async measureOneShotWait() {
        if (!this._oneShotMeasurementCharacteristic) {
            throw new Error('device is not connected');
        }
        const sendData = new Array(20);
        sendData[0] = 0x01;
        const data = await this._sendAndReceiveWait(this._oneShotMeasurementCharacteristic, sendData);
        return this._analyzeResult(data);
    }
    /**
     * Do extended one shot measurement
     *
     * 拡張ワンショット計測
     *
     * @returns one extended shot measurement data 拡張ワンショット計測データ
     *
     * ```
     * {
     *
     * pm2_5: PM2.5 concentration PM2.5濃度 (25~1000 [ug/m3]),
     *
     * pm10: PM10 concentration M10濃度 (25~1000 [ug/m3]),
     *
     * barometricPressure: barometric pressure 気圧 (300.0~1100.0 [hPa]),
     *
     * temperature: temperature 温度 (-20.0~85.0 [degC]),
     *
     * humidity: relative humidity 湿度 (0.0~100.0 [%RH]),
     *
     * lux: illuminance 照度 (0~65534 [lx]),
     *
     * tvoc: TVOC (Total Volatile Organic Compounds) (0~1187 [ppb])
     *
     * eco2: eCO2 (equivalent CO2) 等価CO2濃度 (400~8190 [ppm])
     *
     * uv: UV Index (0~11)
     *
     * }
     * ```
     */
    async measureOneShotExtWait() {
        if (!this._oneShotMeasurementCharacteristic) {
            throw new Error('device is not connected');
        }
        const sendData = new Array(20);
        sendData[0] = 0x10;
        const data = await this._sendAndReceiveWait(this._oneShotMeasurementCharacteristic, sendData);
        return this._analyzeResultExt(data);
    }
    /**
     * @deprecated Please use {@linkplain getLedModeWait}
     *
     * {@linkplain getLedModeWait} の使用を推奨
     *
     * @returns
     */
    getLedMode() {
        return this.getLedModeWait();
    }
    /**
     * Get LED mode LEDモードの取得
     *
     * @returns current LED mode 現在のLEDモード
     *
     * 0: off 消灯
     *
     * 1: PM2.5 mode PM2.5モード
     *
     * 2: PM10 mode PM10モード
     *
     * 3: VOC mode VOCモード
     *
     * 4: UV mode UVモード
     *
     * 5: temperature mode 温度モード
     *
     * 6: humidity mode 湿度モード
     *
     * 128: power LED 電源LED
     */
    async getLedModeWait() {
        if (!this._ledCharacteristic) {
            throw new Error('device is not connected');
        }
        const data = this._sendAndReceiveWait(this._ledCharacteristic, [
            0xff,
            0x00,
        ]);
    }
    _sendAndReceiveWait(char, data) {
        return new Promise((resolve) => {
            char.registerNotifyWait(resolve).then(() => {
                return char.writeWait(data);
            });
        });
    }
    _analyzeResult(data) {
        const buf = Buffer.from(data);
        const [minutes, hour, day, month, year] = buf.slice(0, 5);
        const pm2_5 = buf.readInt16LE(5);
        const pm10 = buf.readInt16LE(7);
        const barometricPressure = buf.readInt16LE(9);
        const temperature = buf.readInt8(11);
        const humidity = buf.readInt8(12);
        const lux = buf.readUInt16LE(13);
        const dummy = buf.slice(15, 19);
        const mode = buf.readInt8(19);
        return {
            // minutes,
            // hour,
            // day,
            // month,
            // year,
            pm2_5,
            pm10,
            barometricPressure,
            temperature,
            humidity,
            lux,
            mode,
        };
    }
    _bitValue(buffer, location) {
        const startLoc = {
            byte: Math.floor(location.start / 8),
            bit: location.start % 8,
        };
        const endLoc = {
            byte: Math.floor(location.end / 8),
            bit: location.end % 8,
        };
        let result = 0;
        result =
            buffer.readUInt8(endLoc.byte) & (~(0xff << (endLoc.bit + 1)) & 0xff);
        if (startLoc.byte === endLoc.byte) {
            return result >> startLoc.bit;
        }
        for (let byte = endLoc.byte - 1; byte > startLoc.byte; byte--) {
            result = result << (8 + buffer.readInt8(byte));
        }
        result =
            (result << (8 - startLoc.bit)) +
                (buffer.readUInt8(startLoc.byte) >> startLoc.bit);
        return result;
    }
    _analyzeResultExt(data) {
        const buf = Buffer.from(data);
        const buf1 = buf.slice(0, 4);
        const minutes = this._bitValue(buf1, { start: 5, end: 10 });
        const hour = this._bitValue(buf1, { start: 11, end: 15 });
        const day = this._bitValue(buf1, { start: 16, end: 20 });
        const month = this._bitValue(buf1, { start: 21, end: 24 });
        const year = this._bitValue(buf1, { start: 25, end: 31 });
        const buf2 = buf.slice(4, 8);
        const pm2_5 = this._bitValue(buf2, { start: 0, end: 9 });
        const pm10 = this._bitValue(buf2, { start: 10, end: 19 });
        const uv = this._bitValue(buf2, { start: 20, end: 23 });
        const buf3 = buf.slice(8, 12);
        const temperature = this._bitValue(buf3, { start: 0, end: 10 }) / 10 - 40;
        const humidity = this._bitValue(buf3, { start: 11, end: 20 }) / 10;
        const buf4 = buf.slice(12, 16);
        const barometricPressure = this._bitValue(buf4, { start: 0, end: 13 }) / 10;
        const vocState_init = this._bitValue(buf4, { start: 14, end: 14 });
        const vocState_wakeup = this._bitValue(buf4, { start: 15, end: 15 });
        const lux = this._bitValue(buf4, { start: 16, end: 31 });
        const buf5 = buf.slice(16, 20);
        const tvoc = this._bitValue(buf5, { start: 0, end: 10 });
        const eco2 = this._bitValue(buf5, { start: 11, end: 23 });
        const mode = this._bitValue(buf5, { start: 24, end: 31 });
        return {
            // minutes,
            // hour,
            // day,
            // month,
            // year,
            pm2_5,
            pm10,
            barometricPressure,
            temperature,
            humidity,
            lux,
            // mode,
            tvoc,
            eco2,
            uv,
            // vocState_init,
            // vocState_wakeup,
        };
    }
}
exports.default = REX_BTPM25V;
