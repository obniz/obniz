"use strict";
/**
 * @packageDocumentation
 * @module Parts.RS_BTEVS1
 */
/* eslint rulesdir/non-ascii: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../obniz/ObnizPartsBleAbstract");
const semver_1 = __importDefault(require("semver"));
const advertismentAnalyzer_1 = require("../utils/advertisement/advertismentAnalyzer");
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
        this.firmwareSemRevision = null;
    }
    static isDevice(peripheral) {
        var _a;
        if (!((_a = peripheral.localName) === null || _a === void 0 ? void 0 : _a.match(this.LocalName))) {
            return false;
        }
        return true;
    }
    /**
     * Connect to the services of a device
     *
     * デバイスのサービスに接続
     */
    async connectWait() {
        await super.connectWait();
        this.firmwareRevision = Buffer.from(await this.readCharWait('180A', '2A26')).toString();
        this.firmwareSemRevision = semver_1.default.parse(this.firmwareRevision.replace('Ver.', ''));
    }
    static getData(peripheral) {
        var _a;
        if (!RS_BTEVS1.isDevice(peripheral)) {
            return null;
        }
        const measureData = RS_BTEVS1._deviceAdvAnalyzer.getData(peripheral.adv_data, 'manufacture', 'data');
        if (!measureData)
            return null;
        if ((_a = peripheral.localName) === null || _a === void 0 ? void 0 : _a.startsWith('BT')) {
            return {
                co2: Buffer.from(measureData).readUInt16LE(0),
                pm1_0: Buffer.from(measureData).readUInt8(2),
                pm2_5: Buffer.from(measureData).readUInt8(3),
                pm4_0: Buffer.from(measureData).readUInt8(4),
                pm10_0: Buffer.from(measureData).readUInt8(5),
                temp: Buffer.from(measureData).readUInt8(6),
                humid: Buffer.from(measureData).readUInt8(7),
            };
        }
        return {
            co2: Buffer.from(measureData).readUInt16LE(0),
            pm1_0: Buffer.from(measureData).readUInt8(2),
            pm2_5: Buffer.from(measureData).readUInt8(3),
            pm4_0: Buffer.from(measureData).readUInt8(4),
            pm10_0: Buffer.from(measureData).readUInt8(5),
            temp: Buffer.from(measureData).readInt16LE(6) / 10,
            humid: Buffer.from(measureData).readUInt8(8),
        };
    }
    /**
     * Get device all data
     * Version 1.0.x is not supported
     * デバイスの全てのデータの取得
     * バージョン1.0.xはサポートされません
     *
     * @returns
     */
    async getDataWait() {
        this.checkConnected();
        this.checkVersion('1.1.0');
        return new Promise((res, rej) => {
            this.subscribeWait(this.serviceUuid, this.getCharUuid(0x152a), (data) => {
                const buf = Buffer.from(data);
                const result = {
                    temp: (0, ObnizPartsBleAbstract_1.uint)(data.slice(0, 2)) * 0.1,
                    humid: data[2],
                    co2: (0, ObnizPartsBleAbstract_1.uint)(data.slice(3, 5)),
                    pm1_0: buf.readFloatLE(5),
                    pm2_5: buf.readFloatLE(9),
                    pm4_0: buf.readFloatLE(13),
                    pm10_0: buf.readFloatLE(17),
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore for compatibility
                    pm5_0: buf.readFloatLE(13),
                };
                res(result);
            });
        });
    }
    async beforeOnDisconnectWait() {
        if (!this.firmwareSemRevision) {
            return;
        }
        if (semver_1.default.gte(this.firmwareSemRevision, '1.1.2')) {
            await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1524));
            // await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1525));
            await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1526));
            await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1527));
            await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1528));
            // await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1529));
            await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x152a));
            await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x152b));
        }
    }
    /**
     * Get device settings デバイスの設定を取得
     *
     * @returns Instance of RS_BTEVS1_Config RS_BTEVS1_Configのインスタンス
     */
    async getConfigWait() {
        this.checkConnected();
        const data = await this.readCharWait(this.serviceUuid, this.getCharUuid(0x1525));
        const buf = Buffer.from(data);
        const measureOperation = buf.readInt8(12);
        return {
            tempInterval: buf.readUInt32LE(0),
            pm2_5Interval: buf.readUInt32LE(4),
            co2Interval: buf.readUInt32LE(8),
            tempMeasureOperation: (measureOperation & 0b100) > 0,
            pm2_5MeasureOperation: (measureOperation & 0b010) > 0,
            co2MeasureOperation: (measureOperation & 0b001) > 0,
            ledDisplay: LED_DISPLAY_MODE[buf.readInt8(13)],
            advertisementBeacon: buf.readInt8(14) === 1,
            pm2_5ConcentrationMode: PM2_5_CONCENTRATION_MODE[buf.readInt8(15)],
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
        const buf = Buffer.alloc(16);
        buf.writeUInt32LE((_a = config.tempInterval) !== null && _a !== void 0 ? _a : 10000, 0);
        buf.writeUInt32LE((_b = config.pm2_5Interval) !== null && _b !== void 0 ? _b : 10000, 4);
        buf.writeUInt32LE((_c = config.co2Interval) !== null && _c !== void 0 ? _c : 10000, 8);
        buf.writeUInt8((config.co2MeasureOperation ? 0b001 : 0) +
            (config.pm2_5MeasureOperation ? 0b010 : 0) +
            (config.tempMeasureOperation ? 0b100 : 0), 12);
        buf.writeUInt8(LED_DISPLAY_MODE.indexOf(config.ledDisplay && LED_DISPLAY_MODE.indexOf(config.ledDisplay) >= 0
            ? config.ledDisplay
            : 'Disable'), 13);
        buf.writeUInt8(config.advertisementBeacon ? 1 : 0, 14);
        buf.writeUInt8(semver_1.default.lt(this.firmwareSemRevision, '1.1.0')
            ? PM2_5_CONCENTRATION_MODE.indexOf(config.pm2_5ConcentrationMode &&
                PM2_5_CONCENTRATION_MODE.indexOf(config.pm2_5ConcentrationMode) >=
                    0
                ? config.pm2_5ConcentrationMode
                : 'Number')
            : 0, 15);
        return await this.writeCharWait(this.serviceUuid, this.getCharUuid(0x1525), Array.from(buf));
    }
    /**
     * Change pairing LED flashing status
     * Version 1.0.x is not supported
     * ペアリングLEDの点滅状態の変更
     * バージョン1.0.xはサポートされません
     *
     * @param blink Whether it blinks 点滅するかどうか
     * @returns Write result 書き込み結果
     */
    async setModeLEDWait(blink) {
        await this.checkConnected();
        this.checkVersion('1.1.0');
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
     * Version 1.0.x is not supported
     * 温度センサーの読み取りを開始
     * バージョン1.0.xはサポートされません
     */
    async tempMeasureStartWait() {
        this.checkConnected();
        this.checkVersion('1.1.0');
        await this.subscribeWait(this.serviceUuid, this.getCharUuid(0x1526), (data) => {
            if (typeof this.onTempMeasured !== 'function')
                return;
            this.onTempMeasured((0, ObnizPartsBleAbstract_1.int)(data.slice(0, 2)) / 10, data[2]);
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
            this.onCo2Measured((0, ObnizPartsBleAbstract_1.uint)(data));
        });
    }
    /**
     * @deprecated
     *
     * Start reading the PM2.5 sensor
     * Version 1.1 is not supported
     * PM2.5センサーの読み取りを開始
     * バージョン1.1より上のバージョンはサポートされません
     */
    async pm2_5MeasureStartWait() {
        this.checkConnected();
        this.checkLessVersion('1.1.0');
        await this.subscribeWait(this.serviceUuid, this.getCharUuid(0x1528), (data) => {
            if (typeof this.onPm2_5Measured !== 'function')
                return;
            const buf = Buffer.from(data);
            this.onPm2_5Measured({
                mass_pm1: buf.readFloatLE(0),
                mass_pm2_5: buf.readFloatLE(4),
                mass_pm4: buf.readFloatLE(8),
                mass_pm10: buf.readFloatLE(12),
                // number_pm0_5: buf.readFloatLE(16), // 1パケット=20バイトしか来ない // TODO
                // number_pm1: buf.readFloatLE(20),
                // number_pm2_5: buf.readFloatLE(24),
                // number_pm4: buf.readFloatLE(28),
                // number_pm10: buf.readFloatLE(32),
            });
        });
    }
    getCharUuid(code) {
        return `${this.serviceUuid.slice(0, 4)}${code.toString(16)}${this.serviceUuid.slice(8)}`;
    }
    checkVersion(version) {
        var _a;
        if (semver_1.default.lt(this.firmwareSemRevision, version)) {
            throw new Error(`This operation is not supported. required firmware v${version}, but device v${(_a = this.firmwareSemRevision) === null || _a === void 0 ? void 0 : _a.version}`);
        }
    }
    checkLessVersion(version) {
        var _a;
        if (semver_1.default.gte(this.firmwareSemRevision, version)) {
            throw new Error(`This operation is not supported. required firmware less than v${version}, but device v${(_a = this.firmwareSemRevision) === null || _a === void 0 ? void 0 : _a.version}`);
        }
    }
}
exports.default = RS_BTEVS1;
RS_BTEVS1.AvailableBleMode = ['Connectable', 'Beacon'];
RS_BTEVS1.PartsName = 'RS_BTEVS1';
/**
 * BTEVS-1234: ~1.0.2
 * EVS-1234: 1.1.2~
 * EVS_1234 1.2~
 */
RS_BTEVS1.LocalName = /^(BT)?EVS[-_][0-9A-F]{4}/;
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
        round: 1,
        func: (data, p) => {
            var _a, _b, _c;
            return ((_b = (_a = p.manufacturerSpecificData) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) + 1 === 0x0b &&
                ((_c = p.localName) !== null && _c !== void 0 ? _c : '').startsWith('BT')
                ? data[0]
                : (0, ObnizPartsBleAbstract_1.int)(data) * 0.1;
        },
    },
    humid: {
        index: 7,
        length: 2,
        type: 'custom',
        func: (data, p) => {
            var _a, _b, _c;
            return ((_b = (_a = p.manufacturerSpecificData) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) + 1 === 0x0b &&
                ((_c = p.localName) !== null && _c !== void 0 ? _c : '').startsWith('BT')
                ? data[0]
                : data[1];
        },
    },
};
RS_BTEVS1._deviceAdvAnalyzer = new advertismentAnalyzer_1.BleAdvBinaryAnalyzer()
    .addTarget('flag', [0x03, 0x19, 0x40, 0x05, 0x02, 0x01, 0x05])
    .groupStart('manufacture')
    .addTarget('length', [0x0c])
    .addTarget('type', [0xff])
    .addTargetByLength('companyId', 2)
    .addTargetByLength('data', 9)
    .groupEnd();
