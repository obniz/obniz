"use strict";
/**
 * @packageDocumentation
 * @module Parts.PLAYBULB_candle
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAYBULB_candle_SPEED = exports.PLAYBULB_candle_MODE = void 0;
const advertismentAnalyzer_1 = require("../utils/advertisement/advertismentAnalyzer");
const batteryService_1 = require("../utils/services/batteryService");
exports.PLAYBULB_candle_MODE = {
    Fade: 0x01,
    JumpRGB: 0x02,
    FadeRGB: 0x03,
    CandleEffect: 0x04,
    NoEffect: 0x05,
};
exports.PLAYBULB_candle_SPEED = {
    ReallySlow: 0x00,
    ReallyFast: 0x01,
    Slower: 0x02,
    Faster: 0xff,
};
/** PLAYBULB_candle management class PLAYBULB_candleを管理するクラス */
class PLAYBULB_candle {
    constructor(_peripheral) {
        this._peripheral = _peripheral;
        this._candleDeviceNameCharacteristics = null;
        this._candleColorCharacteristics = null;
        this._candleEffectCharacteristics = null;
    }
    static info() {
        return {
            name: 'PLAYBULB_candle',
        };
    }
    /**
     * Verify that the received peripheral is from the PLAYBULB_candle
     *
     * 受け取ったPeripheralがPLAYBULB_candleのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the PLAYBULB_candle
     *
     * PLAYBULB_candleかどうか
     */
    static isDevice(peripheral) {
        // [
        //   2, 1, 6,
        //   3, 3, 2, 255,
        //   3,
        //   25,
        //   64,
        //   3,
        //   2,
        //   10,
        //   254,
        //   6,
        //   255,
        //   77,
        //   73,
        //   80,
        //   79,
        //   87
        // ]
        var _a;
        // scan resp
        // [
        //   16,
        //   9,
        //   80,
        //   76,
        //   65,
        //   89,
        //   66,
        //   85,
        //   76,
        //   66,
        //   32,
        //   67,
        //   65,
        //   78,
        //   68,
        //   76,
        //   69
        // ]
        const isNameMatched = (_a = peripheral.localName) === null || _a === void 0 ? void 0 : _a.startsWith('PLAYBULB CANDLE');
        const advData = PLAYBULB_candle._deviceAdvAnalyzerType.getAllData(peripheral.adv_data);
        return advData != null;
    }
    async connectWait(setting) {
        await this._peripheral.connectWait(setting);
        this._peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === 'function') {
                this.ondisconnect(reason);
            }
        };
        const service = this._peripheral.getService(PLAYBULB_candle.CANDLE_SERVICE_UUID);
        if (!service) {
            throw new Error(`no service found`);
        }
        this._candleDeviceNameCharacteristics = service.getCharacteristic(PLAYBULB_candle.CANDLE_DEVICE_NAME_UUID);
        this._candleColorCharacteristics = service.getCharacteristic(PLAYBULB_candle.CANDLE_COLOR_UUID);
        this._candleEffectCharacteristics = service.getCharacteristic(PLAYBULB_candle.CANDLE_EFFECT_UUID);
        const service180F = this._peripheral.getService('180F');
        if (service180F) {
            this.batteryService = new batteryService_1.BleBatteryService(service180F);
        }
    }
    getBatteryLevelWait() {
        if (!this._peripheral.connected) {
            throw new Error(`Device is not connected`);
        }
        if (!this.batteryService) {
            throw new Error(`no batteryService found`);
        }
        return this.batteryService.getBatteryLevelWait();
    }
    getDeviceNameWait() {
        if (!this._peripheral.connected) {
            throw new Error(`Device is not connected`);
        }
        if (!this._candleDeviceNameCharacteristics) {
            throw new Error(`no characteristic found`);
        }
        const deviceName = this._candleDeviceNameCharacteristics.readTextWait();
        return deviceName;
    }
    setCandleEffectColorWait(red, green, blue) {
        return this.setEffectWait({
            red,
            green,
            blue,
            white: 0x00,
        }, exports.PLAYBULB_candle_MODE.CandleEffect, exports.PLAYBULB_candle_SPEED.ReallyFast);
    }
    setFlashingColorWait(red, green, blue) {
        return this.setEffectWait({
            red,
            green,
            blue,
            white: 0x00,
        }, exports.PLAYBULB_candle_MODE.FadeRGB, exports.PLAYBULB_candle_SPEED.Faster);
    }
    setEffectWait(color, mode, speed) {
        if (!this._peripheral.connected) {
            throw new Error(`Device is not connected`);
        }
        if (!this._candleEffectCharacteristics) {
            throw new Error(`no characteristic found`);
        }
        const data = [
            color.white,
            color.red,
            color.green,
            color.blue,
            mode,
            0x00,
            speed,
            0x00,
        ];
        return this._candleEffectCharacteristics.writeWait(data, false);
    }
    // 単色
    setColorWait(r, g, b) {
        if (!this._peripheral.connected) {
            throw new Error(`Device is not connected`);
        }
        if (!this._candleColorCharacteristics) {
            throw new Error(`no characteristic found`);
        }
        const data = [0x00, r, g, b];
        this.setEffectWait({
            white: 0,
            red: r,
            green: g,
            blue: b,
        }, exports.PLAYBULB_candle_MODE.NoEffect, exports.PLAYBULB_candle_SPEED.ReallyFast);
        return this._candleColorCharacteristics.writeWait(data, false);
    }
}
exports.default = PLAYBULB_candle;
PLAYBULB_candle.CANDLE_SERVICE_UUID = 'FF02';
PLAYBULB_candle.CANDLE_DEVICE_NAME_UUID = 'FFFF';
PLAYBULB_candle.CANDLE_COLOR_UUID = 'FFFC';
PLAYBULB_candle.CANDLE_EFFECT_UUID = 'FFFB';
PLAYBULB_candle._deviceAdvAnalyzerType = new advertismentAnalyzer_1.BleAdvBinaryAnalyzer()
    .addTarget('flag', [0x02, 0x01, 0x06])
    .groupStart('manufacture')
    .addTarget('length', [3])
    .addTarget('type', [3])
    .addTarget('candle_service_uuid', [0x02, 0xff]) // この後にも続いてる
    .groupEnd();
