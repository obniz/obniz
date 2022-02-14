"use strict";
/**
 * @packageDocumentation
 * @module Parts.RS_BTEVS1
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../obniz/ObnizPartsBleAbstract");
const LED_DISPLAY_MODE = ['Disable', 'PM2.5', 'CO2'];
const PM2_5_CONCENTRATION_MODE = ['Mass', 'Number'];
/** RS_BTEVS1 management class RS_BTEVS1を管理するクラス */
class RS_BTEVS1 extends ObnizPartsBleAbstract_1.ObnizPartsBleConnectable {
    constructor() {
        super(...arguments);
        this.staticClass = RS_BTEVS1;
        /** Event handler for button ボタンのイベントハンドラー */
        this.onButtonPressed = null;
        /** Event handler for temperature sensor 温度センサーのイベントハンドラー */
        this.onTempMeasured = null;
        /** Event handler for co2 sensor CO2センサーのイベントハンドラー */
        this.onCo2Measured = null;
        /** Event handler for PM2.5 sensor PM2.5センサーのイベントハンドラー */
        this.onPm2_5Measured = null;
        this.serviceUuid = 'F9CC15234E0A49E58CF30007E819EA1E';
        this.firmwareRevision = '';
    }
    /**
     * Connect to the services of a device
     *
     * デバイスのサービスに接続
     */
    async connectWait() {
        await super.connectWait();
        this.firmwareRevision = Buffer.from(await this.readCharWait('180A', '2A26')).toString();
    }
    async getDataWait() {
        if (this.firmwareRevision.startsWith('Ver.1.0')) {
            throw new Error('This operation is not supported.');
        }
        this.checkConnected();
        const data = await this.readCharWait(this.serviceUuid, this.getCharUuid(0x152a));
        const buf = Buffer.from(data);
        return {
            temp: ObnizPartsBleAbstract_1.uint(data.slice(0, 2)) * 0.1,
            humid: data[2],
            co2: ObnizPartsBleAbstract_1.uint(data.slice(3, 5)),
            pm1_0: buf.readFloatLE(5),
            pm2_5: buf.readFloatLE(9),
            pm4_0: buf.readFloatLE(13),
            pm10_0: buf.readFloatLE(17),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore for compatibility
            pm5_0: buf.readFloatLE(13),
        };
    }
    async beforeOnDisconnectWait() {
        // await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1524));
        // await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1525));
        // await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1526));
        // await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1527));
        // await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1528));
        // await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1529));
        // await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x152a));
        // await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x152b));
    }
    /**
     * Get device settings デバイスの設定を取得
     *
     * @returns Instance of RS_BTEVS1_Config RS_BTEVS1_Configのインスタンス
     */
    async getConfigWait() {
        this.checkConnected();
        const data = await this.readCharWait(this.serviceUuid, this.getCharUuid(0x1525));
        return {
            pm2_5ConcentrationMode: PM2_5_CONCENTRATION_MODE[data[0]],
            advertisementBeacon: data[1] === 1,
            ledDisplay: LED_DISPLAY_MODE[data[2]],
            co2MeasureOperation: (data[3] & 0b001) > 0,
            pm2_5MeasureOperation: (data[3] & 0b010) > 0,
            tempMeasureOperation: (data[3] & 0b100) > 0,
            co2Interval: ObnizPartsBleAbstract_1.uint(data.slice(4, 8)),
            pm2_5Interval: ObnizPartsBleAbstract_1.uint(data.slice(8, 12)),
            tempInterval: ObnizPartsBleAbstract_1.uint(data.slice(12, 16)),
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
        await this.checkConnected();
        return await this.writeCharWait(this.serviceUuid, this.getCharUuid(0x1525), [
            this.firmwareRevision.startsWith('Ver.1.0')
                ? PM2_5_CONCENTRATION_MODE.indexOf(config.pm2_5ConcentrationMode &&
                    PM2_5_CONCENTRATION_MODE.indexOf(config.pm2_5ConcentrationMode) >= 0
                    ? config.pm2_5ConcentrationMode
                    : 'Number')
                : 0,
            config.advertisementBeacon ? 1 : 0,
            LED_DISPLAY_MODE.indexOf(config.ledDisplay && LED_DISPLAY_MODE.indexOf(config.ledDisplay) >= 0
                ? config.ledDisplay
                : 'Disable'),
            (config.co2MeasureOperation ? 0b001 : 0) +
                (config.pm2_5MeasureOperation ? 0b010 : 0) +
                (config.tempMeasureOperation ? 0b100 : 0),
            ...ObnizPartsBleAbstract_1.uintToArray((_a = config.co2Interval, (_a !== null && _a !== void 0 ? _a : 10000)), 4),
            ...ObnizPartsBleAbstract_1.uintToArray((_b = config.pm2_5Interval, (_b !== null && _b !== void 0 ? _b : 10000)), 4),
            ...ObnizPartsBleAbstract_1.uintToArray((_c = config.tempInterval, (_c !== null && _c !== void 0 ? _c : 10000)), 4),
        ]);
    }
    /**
     * Change pairing LED flashing status
     *
     * ペアリングLEDの点滅状態の変更
     *
     * @param blink Whether it blinks 点滅するかどうか
     * @returns Write result 書き込み結果
     */
    async setModeLEDWait(blink) {
        await this.checkConnected();
        return await this.writeCharWait(this.serviceUuid, this.getCharUuid(0x1529), [blink ? 1 : 0]);
    }
    /**
     * Start reading the button state
     *
     * ボタンの状態読み取りを開始
     */
    async buttonChangeStartWait() {
        this.checkConnected();
        await this.subscribeWait(this.serviceUuid, this.getCharUuid(0x1524), (data) => {
            if (typeof this.onButtonPressed !== 'function')
                return;
            this.onButtonPressed(data[0] === 1);
        });
    }
    /**
     * @deprecated
     *
     * Start reading the temperature sensor
     *
     * 温度センサーの読み取りを開始
     */
    async tempMeasureStartWait() {
        this.checkConnected();
        await this.subscribeWait(this.serviceUuid, this.getCharUuid(0x1526), (data) => {
            if (typeof this.onTempMeasured !== 'function')
                return;
            this.onTempMeasured(ObnizPartsBleAbstract_1.int(data.slice(0, 2)), data[2]);
        });
    }
    /**
     * @deprecated
     *
     * Start reading the co2 sensor
     *
     * CO2センサーの読み取りを開始
     */
    async co2MeasureStartWait() {
        this.checkConnected();
        await this.subscribeWait(this.serviceUuid, this.getCharUuid(0x1527), (data) => {
            if (typeof this.onCo2Measured !== 'function')
                return;
            this.onCo2Measured(ObnizPartsBleAbstract_1.uint(data));
        });
    }
    /**
     * @deprecated
     *
     * Start reading the PM2.5 sensor
     *
     * PM2.5センサーの読み取りを開始
     */
    async pm2_5MeasureStartWait() {
        this.checkConnected();
        await this.subscribeWait(this.serviceUuid, this.getCharUuid(0x1528), (data) => {
            if (typeof this.onPm2_5Measured !== 'function')
                return;
            const buf = Buffer.from(data);
            this.onPm2_5Measured({
                mass_pm1: buf.readFloatLE(0),
                mass_pm2_5: buf.readFloatLE(4),
                mass_pm4: buf.readFloatLE(8),
                mass_pm10: buf.readFloatLE(12),
                number_pm0_5: buf.readFloatLE(16),
            });
        });
    }
    getCharUuid(code) {
        return `${this.serviceUuid.slice(0, 4)}${code.toString(16)}${this.serviceUuid.slice(8)}`;
    }
}
exports.default = RS_BTEVS1;
RS_BTEVS1.AvailableBleMode = ['Connectable', 'Beacon'];
RS_BTEVS1.PartsName = 'RS_BTEVS1';
/**
 * BTEVS-1234: ~1.0.2
 * EVS-1234: 1.1.2~
 */
RS_BTEVS1.LocalName = /(BT|)EVS-[0-9A-E]{4}/;
// public static readonly BeaconDataLength: ObnizPartsBleCompare<
//   number | null
// > = 0x0c;
RS_BTEVS1.CompanyID = [
    0x00,
    0xff,
];
RS_BTEVS1.BeaconDataStruct = {
    co2: {
        index: 0,
        length: 2,
        type: 'unsignedNumLE',
    },
    pm1_0: {
        index: 2,
        type: 'unsignedNumLE',
    },
    pm2_5: {
        index: 3,
        type: 'unsignedNumLE',
    },
    pm4_0: {
        index: 4,
        type: 'unsignedNumLE',
    },
    pm5_0: {
        // for compatibility
        index: 4,
        type: 'unsignedNumLE',
    },
    pm10_0: {
        index: 5,
        type: 'unsignedNumLE',
    },
    temp: {
        index: 6,
        length: 2,
        type: 'custom',
        multiple: 0.1,
        func: (data, p) => {
            var _a, _b, _c;
            return (_b = (_a = p.manufacturerSpecificData) === null || _a === void 0 ? void 0 : _a.length, (_b !== null && _b !== void 0 ? _b : 0)) + 1 === 0x0b &&
                (_c = p.localName, (_c !== null && _c !== void 0 ? _c : '')).startsWith('BT')
                ? data[0]
                : ObnizPartsBleAbstract_1.int(data) * 0.1;
        },
    },
    humid: {
        index: 7,
        length: 2,
        type: 'custom',
        func: (data, p) => {
            var _a, _b, _c;
            return (_b = (_a = p.manufacturerSpecificData) === null || _a === void 0 ? void 0 : _a.length, (_b !== null && _b !== void 0 ? _b : 0)) + 1 === 0x0b &&
                (_c = p.localName, (_c !== null && _c !== void 0 ? _c : '')).startsWith('BT')
                ? data[0]
                : data[1];
        },
    },
};
