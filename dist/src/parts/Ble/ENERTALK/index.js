"use strict";
/**
 * @packageDocumentation
 * @module Parts.ENERTALK_TOUCH
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const batteryService_1 = require("../utils/services/batteryService");
/** ENERTALK TOUCH management class ENERTALK TOUCHを管理するクラス */
class ENERTALK_TOUCH {
    constructor(peripheral) {
        this.keys = [];
        this.requiredKeys = [];
        this._peripheral = null;
        this._uuids = {
            service: '3526797e-448b-4bbb-9145-c5083e0e09dc',
            temperatureChar: '2A6E',
            humidityChar: '2A6F',
            illuminanceChar: '74c3fe9d-25b2-4903-8dcd-680e5ef0a6b3',
            accelerometerChar: '71ef0979-0e2c-4a55-8d3c-78083869fae6',
        };
        this._service = null;
        this._temperatureChar = null;
        this._humidityChar = null;
        this._illuminanceChar = null;
        this._accelerometerChar = null;
        if (peripheral && !ENERTALK_TOUCH.isDevice(peripheral)) {
            throw new Error('peripheral is not ENERTALK_TOUCH');
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: 'ENERTALK_TOUCH',
        };
    }
    /**
     * Verify that the received peripheral is from the ENERTALK TOUCH
     *
     * 受け取ったperipheralがENERTALK TOUCHのものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the ENERTALK TOUCH
     *
     * ENERTALK TOUCHかどうか
     */
    static isDevice(peripheral) {
        if (peripheral.localName && peripheral.localName.startsWith('ensensor_')) {
            return true;
        }
        return false;
    }
    /**
     * Connect the sensor
     *
     * Throw an error if the device is not found
     *
     * センサへ接続
     *
     * デバイスが見つからなかった場合はエラーをthrow
     */
    async connectWait() {
        if (!this._peripheral) {
            throw new Error('ENERTALK_TOUCH is not find.');
        }
        this._peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === 'function') {
                this.ondisconnect(reason);
            }
        };
        await this._peripheral.connectWait();
        this._service = this._peripheral.getService(this._uuids.service);
        if (!this._service) {
            await this._peripheral.disconnectWait();
            throw new Error('service is not find.');
        }
        this._temperatureChar = this._service.getCharacteristic(this._uuids.temperatureChar);
        this._humidityChar = this._service.getCharacteristic(this._uuids.humidityChar);
        this._illuminanceChar = this._service.getCharacteristic(this._uuids.illuminanceChar);
        this._accelerometerChar = this._service.getCharacteristic(this._uuids.accelerometerChar);
        const service180F = this._peripheral.getService('180F');
        if (service180F) {
            this.batteryService = new batteryService_1.BleBatteryService(service180F);
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
     * Get the temperature data from the sensor
     *
     * センサから温度データを取得
     *
     * @returns temperature value 温度の値
     *
     * Range 範囲: -1000~5000
     *
     * (Unit 単位: 0.01 degC)
     */
    async getTemperatureWait() {
        if (!this._temperatureChar) {
            throw new Error('device is not connected');
        }
        const tempData = await this._temperatureChar.readWait();
        const buf = Buffer.from(tempData);
        const temp = buf.readInt16BE(0) / 100;
        return temp;
    }
    /**
     * Get the humidity data from the sensor
     *
     * センサから湿度データを取得
     *
     * @returns humidity value 湿度の値
     *
     * Range 範囲: 0~100
     *
     * (Unit 単位: 1 %RH)
     */
    async getHumidityWait() {
        if (!this._humidityChar) {
            throw new Error('device is not connected');
        }
        const humidityData = await this._humidityChar.readWait();
        const humidity = humidityData[0];
        return humidity;
    }
    /**
     * Get the illumination data from the sensor
     *
     * センサから照度データを取得
     *
     * @returns illumination value 照度の値
     *
     * Range 範囲: 0~65535
     *
     * (Unit 単位: 1 lx)
     */
    async getIlluminationWait() {
        if (!this._illuminanceChar) {
            throw new Error('device is not connected');
        }
        const illuminanceData = await this._illuminanceChar.readWait();
        const buf = Buffer.from(illuminanceData);
        const illuminance = buf.readInt16BE(0);
        return illuminance;
    }
    /**
     * Get the acceleration data from the sensor
     *
     * センサから加速度データを取得
     *
     * @returns acceleration values 加速度の値
     *
     * Range 範囲: -2000~2000
     *
     * (Unit 単位: 1 mg)
     */
    async getAccelerometerWait() {
        if (!this._accelerometerChar) {
            throw new Error('device is not connected');
        }
        const accelerometerData = await this._accelerometerChar.readWait();
        const buf = Buffer.from(accelerometerData);
        const x = buf.readInt16BE(0) / 1000;
        const y = buf.readInt16BE(2) / 1000;
        const z = buf.readInt16BE(4) / 1000;
        return { x, y, z };
    }
}
exports.default = ENERTALK_TOUCH;
