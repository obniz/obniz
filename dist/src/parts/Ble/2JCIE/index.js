"use strict";
/**
 * @packageDocumentation
 * @module Parts.OMRON_2JCIE
 */
/* eslint rulesdir/non-ascii: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = require("../../../obniz/ObnizPartsBleInterface");
const round_to_1 = __importDefault(require("round-to"));
/** 2JCIE management class 2JCIEを管理するクラス */
class OMRON_2JCIE {
    constructor(peripheral) {
        this._peripheral = null;
        this.vibrationState = {
            0x00: 'NONE',
            0x01: 'during vibration (Earthquake judgment in progress)',
            0x02: 'during earthquake',
        };
        if (peripheral && !OMRON_2JCIE.isDevice(peripheral)) {
            throw new Error('peripheral is not OMRON_2JCIE');
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: '2JCIE',
        };
    }
    /**
     * Verify that the received peripheral is from the 2JCIE Environmental Sensor series of OMRON
     *
     * 受け取ったperipheralがOMRON 環境センサ 2JCIEシリーズのものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the 2JCIE Environmental Sensor series of OMRON
     *
     * OMRON 環境センサ 2JCIEシリーズかどうか
     */
    static isDevice(peripheral) {
        if (peripheral.localName === null)
            return false;
        return (peripheral.localName.indexOf('Env') >= 0 ||
            peripheral.localName.indexOf('IM') >= 0 ||
            peripheral.localName.indexOf('Rbt') >= 0);
    }
    /**
     * Get a data from advertisement mode of the 2JCIE Environmental Sensor series of OMRON
     *
     * advertisementモードのOMRON 環境センサ 2JCIEシリーズからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the sensor センサから受け取ったデータ
     *
     * `2JCIE-BL01(BAG type バッグ形状) localName: IM`
     *
     * → {@linkplain OMRON_2JCIE_AdvData}
     *
     *
     * `2JCIE-BU01(USB connection USB接続) localName: Rbt`
     *
     * → {@linkplain OMRON_2JCIE_AdvSensorData}
     */
    static getData(peripheral) {
        const adv_data = peripheral.adv_data;
        if (peripheral.localName && peripheral.localName.indexOf('IM') >= 0) {
            return {
                temperature: ObnizPartsBleInterface_1.ObnizPartsBleInterface.signed16FromBinary(adv_data[9], adv_data[8]) *
                    0.01,
                relative_humidity: (0, round_to_1.default)(ObnizPartsBleInterface_1.ObnizPartsBleInterface.signed16FromBinary(adv_data[11], adv_data[10]) * 0.01, 2),
                light: ObnizPartsBleInterface_1.ObnizPartsBleInterface.signed16FromBinary(adv_data[13], adv_data[12]) * 1,
                uv_index: (0, round_to_1.default)(ObnizPartsBleInterface_1.ObnizPartsBleInterface.signed16FromBinary(adv_data[15], adv_data[14]) * 0.01, 2),
                barometric_pressure: (0, round_to_1.default)(ObnizPartsBleInterface_1.ObnizPartsBleInterface.signed16FromBinary(adv_data[17], adv_data[16]) * 0.1, 1),
                sound_noise: (0, round_to_1.default)(ObnizPartsBleInterface_1.ObnizPartsBleInterface.signed16FromBinary(adv_data[19], adv_data[18]) * 0.01, 2),
                acceleration_x: ObnizPartsBleInterface_1.ObnizPartsBleInterface.signed16FromBinary(adv_data[21], adv_data[20]),
                acceleration_y: ObnizPartsBleInterface_1.ObnizPartsBleInterface.signed16FromBinary(adv_data[23], adv_data[22]),
                acceleration_z: ObnizPartsBleInterface_1.ObnizPartsBleInterface.signed16FromBinary(adv_data[25], adv_data[24]),
                battery: (adv_data[26] + 100) / 100,
            };
        }
        else if (peripheral.localName &&
            peripheral.localName.indexOf('Rbt') >= 0 &&
            adv_data[6] === 0x02 &&
            adv_data[6] === 0x02 &&
            adv_data[7] === 0x01) {
            return {
                temperature: ObnizPartsBleInterface_1.ObnizPartsBleInterface.signed16FromBinary(adv_data[10], adv_data[9]) *
                    0.01,
                relative_humidity: (0, round_to_1.default)(ObnizPartsBleInterface_1.ObnizPartsBleInterface.signed16FromBinary(adv_data[12], adv_data[11]) * 0.01, 2),
                light: ObnizPartsBleInterface_1.ObnizPartsBleInterface.signed16FromBinary(adv_data[14], adv_data[13]) * 1,
                barometric_pressure: (0, round_to_1.default)(ObnizPartsBleInterface_1.ObnizPartsBleInterface.signed32FromBinary(adv_data[18], adv_data[17], adv_data[16], adv_data[15]) * 0.001, 3),
                sound_noise: (0, round_to_1.default)(ObnizPartsBleInterface_1.ObnizPartsBleInterface.signed16FromBinary(adv_data[20], adv_data[19]) * 0.01, 2),
                etvoc: ObnizPartsBleInterface_1.ObnizPartsBleInterface.signed16FromBinary(adv_data[22], adv_data[21]),
                eco2: ObnizPartsBleInterface_1.ObnizPartsBleInterface.signed16FromBinary(adv_data[24], adv_data[23]),
            };
        }
        return null;
    }
    wired(obniz) {
        this.obniz = obniz;
    }
    /**
     * Search for the 2JCIE Environmental Sensor series of OMRON
     *
     * OMRON 環境センサ 2JCIEシリーズを検索
     *
     * @returns if found: Instance of BleRemotePeripheral / if not found: null
     *
     * 見つかった場合: BleRemotePeripheralのインスタンス / 見つからなかった場合: null
     */
    async findWait() {
        const target = {
            localName: ['Env', 'Rbt'],
        };
        await this.obniz.ble.initWait();
        this._peripheral = await this.obniz.ble.scan.startOneWait(target);
        return this._peripheral;
    }
    omron_uuid(uuid, type) {
        if (type === 'BAG') {
            return `0C4C${uuid}-7700-46F4-AA96D5E974E32A54`;
        }
        else if (type === 'USB') {
            return `AB70${uuid}-0A3A-11E8-BA89-0ED5F89F718B`;
        }
        else {
            return undefined;
        }
    }
    /**
     * (Search for the device and) connect the sensor
     *
     * Throw an error if the device is not found
     *
     * (デバイスを検索し、)センサへ接続
     *
     * デバイスが見つからなかった場合はエラーをthrow
     *
     * `supported types&modes 対応形状&モード`
     * - 2JCIE-BL01(BAG type バッグ形状) localName: Env
     * - 2JCIE-BU01(USB connection USB接続) localName: Rbt
     */
    async connectWait() {
        if (!this._peripheral) {
            await this.findWait();
        }
        if (!this._peripheral) {
            throw new Error('2JCIE not found');
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
     * センサから切断
     */
    async disconnectWait() {
        if (this._peripheral && this._peripheral.connected) {
            await this._peripheral.disconnectWait();
        }
    }
    signedNumberFromBinary(data) {
        // little endian
        let val = data[data.length - 1] & 0x7f;
        for (let i = data.length - 2; i >= 0; i--) {
            val = val * 256 + data[i];
        }
        if ((data[data.length - 1] & 0x80) !== 0) {
            val = val - Math.pow(2, data.length * 8 - 1);
        }
        return val;
    }
    unsignedNumberFromBinary(data) {
        // little endian
        let val = data[data.length - 1];
        for (let i = data.length - 2; i >= 0; i--) {
            val = val * 256 + data[i];
        }
        return val;
    }
    /**
     * @deprecated Please use {@linkplain getLatestDataWait}
     *
     * {@linkplain getLatestDataWait} の使用を推奨
     */
    async getLatestDataBAGWait() {
        return this.getLatestDataWait();
    }
    /**
     * @deprecated Please use {@linkplain getLatestDataWait}
     *
     * {@linkplain getLatestDataWait} の使用を推奨
     */
    getLatestData() {
        return this.getLatestDataWait();
    }
    /**
     * Get the latest data from the 2JCIE-BL01(BAG type) sensor
     *
     * 2JCIE-BL01(バッグ形状)のセンサの最新のデータを取得
     *
     * @returns received data from the sensor センサから受け取ったデータ
     *
     */
    async getLatestDataWait() {
        await this.connectWait();
        const c = this._peripheral.getService(this.omron_uuid('3000', 'BAG')).getCharacteristic(this.omron_uuid('3001', 'BAG'));
        const data = await c.readWait();
        const json = {
            row_number: data[0],
            temperature: (0, round_to_1.default)(this.signedNumberFromBinary(data.slice(1, 3)) * 0.01, 2),
            relative_humidity: (0, round_to_1.default)(this.signedNumberFromBinary(data.slice(3, 5)) * 0.01, 2),
            light: this.signedNumberFromBinary(data.slice(5, 7)) * 1,
            uv_index: (0, round_to_1.default)(this.signedNumberFromBinary(data.slice(7, 9)) * 0.01, 2),
            barometric_pressure: (0, round_to_1.default)(this.signedNumberFromBinary(data.slice(9, 11)) * 0.1, 1),
            sound_noise: (0, round_to_1.default)(this.signedNumberFromBinary(data.slice(11, 13)) * 0.01, 2),
            discomfort_index: (0, round_to_1.default)(this.signedNumberFromBinary(data.slice(13, 15)) * 0.01, 2),
            heatstroke_risk_factor: (0, round_to_1.default)(this.signedNumberFromBinary(data.slice(15, 17)) * 0.01, 2),
            battery_voltage: (0, round_to_1.default)(this.unsignedNumberFromBinary(data.slice(17, 19)) * 0.001, 3),
        };
        return json;
    }
    /**
     * @deprecated Please use {@linkplain getLatestSensorDataUSBWait}
     *
     * {@linkplain getLatestSensorDataUSBWait} の使用を推奨
     */
    getLatestSensorDataUSB() {
        return this.getLatestSensorDataUSBWait();
    }
    /**
     * Get the latest data from the 2JCIE-BU01(USB connection) sensor
     *
     * 2JCIE-BU01(USB接続)のセンサの最新のデータを取得
     *
     * @returns received data from the sensor センサから受け取ったデータ
     */
    async getLatestSensorDataUSBWait() {
        await this.connectWait();
        const c = this._peripheral.getService(this.omron_uuid('5010', 'USB')).getCharacteristic(this.omron_uuid('5012', 'USB'));
        const data = await c.readWait();
        const json = {
            sequence_number: data[0],
            temperature: (0, round_to_1.default)(this.signedNumberFromBinary(data.slice(1, 3)) * 0.01, 2),
            relative_humidity: (0, round_to_1.default)(this.signedNumberFromBinary(data.slice(3, 5)) * 0.01, 2),
            light: this.signedNumberFromBinary(data.slice(5, 7)) * 1,
            barometric_pressure: (0, round_to_1.default)(this.signedNumberFromBinary(data.slice(7, 11)) * 0.001, 3),
            sound_noise: (0, round_to_1.default)(this.signedNumberFromBinary(data.slice(11, 13)) * 0.01, 2),
            etvoc: this.signedNumberFromBinary(data.slice(13, 15)) * 1,
            eco2: this.signedNumberFromBinary(data.slice(15, 17)) * 1,
        };
        return json;
    }
    /**
     * @deprecated Please use {@linkplain getLatestCalculationDataUSBWait}
     *
     * {@linkplain getLatestCalculationDataUSBWait} の使用を推奨
     */
    getLatestCalculationDataUSB() {
        return this.getLatestCalculationDataUSBWait();
    }
    /**
     * Get the latest index data and acceleration data from the 2JCIE-BU01(USB connection) sensor
     *
     * 2JCIE-BU01(USB接続)のセンサの最新の指標データや加速度データを取得
     *
     * @returns received data from the sensor センサから受け取ったデータ
     */
    async getLatestCalculationDataUSBWait() {
        await this.connectWait();
        const c = this._peripheral.getService(this.omron_uuid('5010', 'USB')).getCharacteristic(this.omron_uuid('5013', 'USB'));
        const data = await c.readWait();
        const json = {
            sequence_number: data[0],
            discomfort_index: (0, round_to_1.default)(this.signedNumberFromBinary(data.slice(1, 3)) * 0.01, 2),
            heatstroke_risk_factor: (0, round_to_1.default)(this.signedNumberFromBinary(data.slice(3, 5)) * 0.01, 2),
            vibration_information: this.vibrationState[data[5]],
            si_value: (0, round_to_1.default)(this.unsignedNumberFromBinary(data.slice(6, 8)) * 0.1, 1),
            pga: (0, round_to_1.default)(this.unsignedNumberFromBinary(data.slice(8, 10)) * 0.1, 1),
            seismic_intensity: (0, round_to_1.default)(this.unsignedNumberFromBinary(data.slice(10, 12)) * 0.001, 3),
            acceleration_x: this.signedNumberFromBinary(data.slice(12, 14)) * 1,
            acceleration_y: this.signedNumberFromBinary(data.slice(14, 16)) * 1,
            acceleration_z: this.signedNumberFromBinary(data.slice(16, 18)) * 1,
        };
        return json;
    }
}
exports.default = OMRON_2JCIE;
