"use strict";
/**
 * @packageDocumentation
 * @module Parts.DR_MARK
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** DR MARK management class DR MARKを管理するクラス */
class DR_MARK {
    constructor(peripheral) {
        this.keys = [];
        this.requiredKeys = [];
        this.onsystempulse = null;
        this._peripheral = null;
        this._uuids = {
            deviceInfoSystem: '180a',
            systemId: '2a23',
            firmwareVersion: '2a26',
            customService: 'fff0',
            requestChar: 'fff3',
            notifyChar: 'fff4',
        };
        this._deviceInfoSystem = null;
        this._requestChar = null;
        this.callbackArray = [];
        this.notifyCallback = (data) => {
            let result = 'errorId';
            switch (data[1]) {
                case 0:
                    result = 'ok';
                    break;
                case 0xf0:
                    result = 'errorId';
                    break;
                case 0xf1:
                    result = 'errorMode';
                    break;
                case 0xf2:
                    result = 'errorExecution';
                    break;
                case 0xf3:
                    result = 'errorParams';
                    break;
                case 0xf4:
                    result = 'errorFrom';
                    break;
                case 0xf5:
                    result = 'errorTimeout';
                    break;
                case 0xf6:
                    result = 'errorObject';
                    break;
            }
            const notifyData = {
                commandId: data[0],
                result,
                data: data.slice(2),
            };
            if (DR_MARK.onnotify && typeof DR_MARK.onnotify === 'function') {
                DR_MARK.onnotify(notifyData);
            }
            if (DR_MARK.onfinish &&
                typeof DR_MARK.onfinish === 'function' &&
                notifyData.commandId === 0x88) {
                DR_MARK.onfinish();
            }
            const callback = this.callbackArray.filter((value) => value.commandId === notifyData.commandId);
            callback.forEach((value) => value.function(notifyData));
            if (notifyData.commandId === 0xa0) {
                const buffer = Buffer.from(notifyData.data);
                const status = buffer.readUInt8(7);
                const scanData = {
                    sequenceNumber: buffer.readUInt32LE(0),
                    pulse: buffer.readUInt32LE(4) & 0x00ffffff,
                    status,
                    error: {
                        outRange: Boolean(status & 0b01000000),
                        changeSetting: Boolean(status & 0b00100000),
                        overSumFlow: Boolean(status & 0b00010000),
                        lowInstantFlow: Boolean(status & 0b00001000),
                        highInstantFlow: Boolean(status & 0b00000100),
                        shutdownBattery: Boolean(status & 0b00000010),
                        lowBattery: Boolean(status & 0b00000001),
                        isError: Boolean(status),
                    },
                    instantFlowRate: buffer.readUInt16LE(8),
                    sumFlowRate: buffer.readUInt16LE(10),
                    averageFlowRate: buffer.readUInt16LE(12),
                    batteryVoltage: buffer.readUInt16LE(14),
                };
                DR_MARK.pulseDataArray.push(scanData);
                if (DR_MARK.onpulse && typeof DR_MARK.onpulse === 'function') {
                    DR_MARK.onpulse(scanData);
                }
                if (this.onsystempulse && typeof this.onsystempulse === 'function') {
                    this.onsystempulse(scanData);
                }
            }
        };
        if (peripheral && !DR_MARK.isDevice(peripheral)) {
            throw new Error('peripheral is not DR_MARK');
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: 'DR_MARK',
        };
    }
    /**
     * Verify that the received peripheral is from the DR MARK
     *
     * 受け取ったperipheralがDR MARKのものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the DR MARK
     *
     * DR MARKかどうか
     */
    static isDevice(peripheral) {
        return !!(peripheral.localName && peripheral.localName.startsWith('DR Mark BLE'));
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
            throw new Error('DR_MARK is not find.');
        }
        this._peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === 'function') {
                this.ondisconnect(reason);
            }
        };
        await this._peripheral.connectWait({ autoDiscovery: false });
        await this._peripheral.discoverAllServicesWait();
        const customService = this._peripheral.getService(this._uuids.customService);
        if (!customService) {
            await this._peripheral.disconnectWait();
            throw new Error('service is not find.');
        }
        await customService.discoverAllCharacteristicsWait();
        this._requestChar = customService.getCharacteristic(this._uuids.requestChar);
        const notifyChar = customService.getCharacteristic(this._uuids.notifyChar);
        if (notifyChar) {
            await notifyChar.registerNotifyWait(this.notifyCallback);
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
     * Get the System ID from the sensor
     *
     * 8 バイトの固有ID
     * 6 バイトの BD アドレスを逆順にし、真中に 0000 を追加
     * 例)BD アドレスが< 18:04:ED:3B:7B:18 >の場合
     * System ID は、< 187B3B0000ED0418 >になる
     *
     * @returns value System ID
     *
     */
    async getSystemIdWait() {
        if (!this._deviceInfoSystem) {
            if (this._peripheral) {
                this._deviceInfoSystem = this._peripheral.getService(this._uuids.deviceInfoSystem);
                if (!this._deviceInfoSystem) {
                    await this._peripheral.disconnectWait();
                    throw new Error('device info service is not find.');
                }
                await this._deviceInfoSystem.discoverAllCharacteristicsWait();
            }
            else {
                throw new Error('device is not connected');
            }
        }
        const char = await this._deviceInfoSystem.getCharacteristic(this._uuids.systemId);
        if (!char) {
            return null;
        }
        const data = await char.readWait();
        return data.reduce((previousValue, currentValue) => previousValue +
            ('00' + currentValue.toString(16).toUpperCase()).slice(-2), '');
    }
    /**
     * Get the FirmwareVersion from the sensor
     *
     * FW バージョン
     * 例) “0.04(2020/09/04)”
     *
     * @returns value FW バージョン
     *
     */
    async getFirmwareVersionWait() {
        if (!this._deviceInfoSystem) {
            if (this._peripheral) {
                this._deviceInfoSystem = this._peripheral.getService(this._uuids.deviceInfoSystem);
                if (!this._deviceInfoSystem) {
                    await this._peripheral.disconnectWait();
                    throw new Error('device info service is not find.');
                }
                await this._deviceInfoSystem.discoverAllCharacteristicsWait();
            }
            else {
                throw new Error('device is not connected');
            }
        }
        const char = await this._deviceInfoSystem.getCharacteristic(this._uuids.firmwareVersion);
        if (!char) {
            return null;
        }
        return char.readTextWait();
    }
    /**
     * DR MARKにコマンドを送る
     *
     * @param commandId REQUESTコマンド(00h ～ 7Fh)
     * @param data 送信データ(詳細は下記)
     *
     * 17 Bytes 固定
     * 使われない領域は、00h にクリア
     * 2Bytes 以上のデータ(WORD, DWORD 等)は、LITTLE-ENDIAN
     */
    async writeCommandWait(commandId, data) {
        if (!this._requestChar) {
            throw new Error('device is not connected');
        }
        if (commandId < 0 || commandId > 255) {
            throw new Error('commandId range 0 <= commandId <= 255');
        }
        let array;
        if (data) {
            if (data.length === 17) {
                array = data;
            }
            else {
                array = new Uint8Array(17).fill(0);
                data.forEach((value, index) => (array[index] = value));
            }
        }
        else {
            array = new Uint8Array(17).fill(0);
        }
        await this._requestChar.writeWait(new Uint8Array([commandId, ...array]));
    }
    /**
     * 動作モード取得
     */
    async getActionModeWait() {
        const data = await this.getCommandResultWait(0x00);
        let res = 'stop';
        switch (data.data[0]) {
            case 1:
                res = 'stop';
                break;
            case 2:
                res = 'adjust';
                break;
            case 3:
                res = 'monitor';
                break;
            case 4:
                res = 'suspend';
                break;
            case 5:
                res = 'finish';
                break;
            case 6:
                res = 'log';
                break;
        }
        return res;
    }
    /**
     * 動作モード設定
     *
     * @param mode 動作モード
     */
    async setActionModeWait(mode) {
        switch (mode) {
            case 'start':
                await this.getCommandResultWait(0x01);
                break;
            case 'stop':
                await this.getCommandResultWait(0x02);
                break;
            case 'adjust':
                await this.getCommandResultWait(0x03);
                break;
            case 'monitor':
                await this.getCommandResultWait(0x04);
                break;
            case 'pause':
                await this.getCommandResultWait(0x05);
                break;
            case 'log':
                await this.getCommandResultWait(0x06);
                break;
        }
    }
    /**
     * RTC set
     *
     * @param timeOffsetMinute 時差を入れる
     */
    async setRtcWait(timeOffsetMinute) {
        const date = new Date();
        date.setTime(Date.now() + 1000 * 60 * timeOffsetMinute);
        const buf = Buffer.alloc(8);
        buf.writeUInt32LE(date.getUTCFullYear() * 10000 +
            (date.getUTCMonth() + 1) * 100 +
            date.getUTCDate(), 0);
        buf.writeUInt32LE(date.getUTCHours() * 10000 +
            date.getUTCMinutes() * 100 +
            date.getUTCSeconds(), 4);
        await this.getCommandResultWait(0x10, Uint8Array.from(buf));
    }
    /**
     * RTC get
     *
     * @param timeOffsetMinute 時差を入れる
     */
    async getRtcWait(timeOffsetMinute) {
        const data = await this.getCommandResultWait(0x11);
        const buffer = Buffer.from(data.data);
        const d = String('00000000' + buffer.readUInt32LE(0))
            .slice(-8)
            .match(/.{2}/g);
        const t = String('00000000' + buffer.readUInt32LE(4))
            .slice(-8)
            .match(/.{2}/g);
        if (d === null || t === null) {
            throw new Error('rtc error');
        }
        const date = new Date(`${d[0]}${d[1]}/${d[2]}/${d[3]} ${t[1]}:${t[2]}:${t[3]}`);
        date.setTime(date.getTime() + 1000 * 60 * timeOffsetMinute);
        return date;
    }
    /**
     * 接続確認
     */
    async checkConnectWait() {
        await this.getCommandResultWait(0x12);
    }
    /**
     * 計測データ送信リクエスト
     */
    async requestPulseDataWait(enable) {
        await this.getCommandResultWait(0x21, new Uint8Array([enable ? 1 : 0]));
    }
    /**
     * 計測条件設定
     *
     * @param infusionDropCount 輸液セットタイプ default 20滴
     * @param targetSumFlowRate 設定量 (ml) default 500ml
     * @param targetFlowRate 目標流量(ml/h) default 250ml/h
     * @param correctionFactor 流量を補正する(-20% ～ 20%) default 0%
     */
    async setConditionSettingWait(infusionDropCount, targetSumFlowRate, targetFlowRate, correctionFactor) {
        const buf = Buffer.alloc(8);
        buf.writeUInt16LE(infusionDropCount, 0);
        buf.writeUInt16LE(targetSumFlowRate, 2);
        buf.writeUInt16LE(targetFlowRate, 4);
        buf.writeUInt16LE(correctionFactor, 6);
        await this.getCommandResultWait(0x22, Uint8Array.from(buf));
    }
    /**
     * 基本設定
     *
     * @param effectiveInstantFlowRate 有効瞬時流量(%) 瞬時流量判定に使用 目標流量に対する瞬時流量の差分 default 30%
     * @param finishJudgmentSec 輸液終了判定時間(秒後) 輸液終了判定（センサ信号無応答時間） default 60秒後
     * @param effectiveIntegratedFlowRate 有効積算流量(%) 総積算流量を判定する ※計測中の流量異常判定無効区間を算出 default 10%
     * @param powerOffSec 自動電源断時間(秒後) default 60秒後
     */
    async setBaseSettingWait(effectiveInstantFlowRate, finishJudgmentSec, effectiveIntegratedFlowRate, powerOffSec) {
        const buf = Buffer.alloc(4);
        buf.writeUInt8(effectiveInstantFlowRate, 0);
        buf.writeUInt8(finishJudgmentSec, 1);
        buf.writeUInt8(effectiveIntegratedFlowRate, 2);
        buf.writeUInt8(powerOffSec, 3);
        await this.getCommandResultWait(0x23, Uint8Array.from(buf));
    }
    /**
     * エンジニア設定
     *
     * @param movingAverage 移動平均回数(回) 最大30回 default 30回
     * @param lowVoltage Lowバッテリ判定レベル(mv) この電圧値以下で黄色LED ハーフ点灯 default 3400mv
     * @param shutdownVoltage バッテリ電源断レベル(mv) この電圧値以下で電源断実行 default 3300mv
     * @param offsetSec 時刻補正(秒) 時刻設定時の遅延時間補正 default 0秒
     */
    async setEngineerSettingWait(movingAverage, lowVoltage, shutdownVoltage, offsetSec) {
        if (movingAverage > 30 || movingAverage < 0) {
            throw new Error('movingAverage 0 <= movingAverage <= 30');
        }
        const buf = Buffer.alloc(8);
        buf.writeUInt16LE(movingAverage, 0);
        buf.writeUInt16LE(lowVoltage, 2);
        buf.writeUInt16LE(shutdownVoltage, 4);
        buf.writeUInt16LE(offsetSec, 6);
        await this.getCommandResultWait(0x24, Uint8Array.from(buf));
    }
    /**
     * LED設定
     *
     * @param bright LED 調光(trueの時明るい)
     */
    async setLedSettingWait(bright) {
        const buf = Buffer.alloc(1);
        buf.writeUInt8(bright ? 1 : 0, 0);
        await this.getCommandResultWait(0x25, Uint8Array.from(buf));
    }
    /**
     * 計測条件取得
     *
     * @return ConditionSettingData
     */
    async getConditionSettingWait() {
        const data = await this.getCommandResultWait(0x28);
        const buffer = Buffer.from(data.data);
        return {
            infusionDropCount: buffer.readUInt16LE(0),
            targetSumFlowRate: buffer.readUInt16LE(2),
            targetFlowRate: buffer.readUInt16LE(4),
            correctionFactor: buffer.readUInt16LE(6),
        };
    }
    /**
     * 基本設定取得
     *
     * @return BaseSettingData
     */
    async getBaseSettingWait() {
        const data = await this.getCommandResultWait(0x29);
        const buffer = Buffer.from(data.data);
        return {
            effectiveInstantFlowRate: buffer.readUInt8(0),
            finishJudgmentSec: buffer.readUInt8(1),
            effectiveIntegratedFlowRate: buffer.readUInt8(2),
            powerOffSec: buffer.readUInt8(3),
        };
    }
    /**
     * エンジニア設定
     *
     * @return EngineerSettingData
     */
    async getEngineerSettingWait() {
        const data = await this.getCommandResultWait(0x2a);
        const buffer = Buffer.from(data.data);
        return {
            movingAverage: buffer.readUInt16LE(0),
            lowVoltage: buffer.readUInt16LE(2),
            shutdownVoltage: buffer.readUInt16LE(4),
            offsetSec: buffer.readUInt16LE(6),
        };
    }
    /**
     * LED設定
     *
     * @return true:bright mode
     */
    async isBrightLedWait() {
        const data = await this.getCommandResultWait(0x2b);
        const buffer = Buffer.from(data.data);
        return Boolean(buffer.readUInt8(0));
    }
    /**
     * 電圧値読出し
     *
     * @return バッテリ電圧（mV）
     */
    async getBatteryVoltageWait() {
        const data = await this.getCommandResultWait(0x2c);
        const buffer = Buffer.from(data.data);
        return buffer.readUInt16LE(0);
    }
    /**
     * Pulseデータをの取得を開始
     */
    async startPulseDataWait() {
        DR_MARK.pulseDataArray = [];
        await this.requestPulseDataWait(true);
    }
    /**
     * Pulseデータの取得を停止かつ、開始時からのパルスデータの配列を返却
     */
    async stopPulseDataWait() {
        await this.requestPulseDataWait(false);
        return DR_MARK.pulseDataArray;
    }
    /**
     * Pulseデータを1件取得する
     */
    async getPulseDataWait(timeoutMs) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.onsystempulse = null;
                reject(new Error('timeout'));
            }, timeoutMs ? timeoutMs : 5000);
            this.onsystempulse = (data) => {
                this.onsystempulse = null;
                this.requestPulseDataWait(false).then(() => resolve(data));
            };
            this.requestPulseDataWait(true);
        });
    }
    /* FlashROM */
    /**
     * Erase FlashROM
     *
     */
    async eraseFlashRomWait() {
        await this.getCommandResultWait(0x40);
    }
    /**
     * FlashROMに保存されているデータ数確認用
     * 最新の計測日時と最古の計測日時を確認できる
     *
     * @param timeOffsetMinute 時差を入れる
     * @return FlashRomInfoData
     */
    async getFlashRomInfoWait(timeOffsetMinute) {
        const data = await this.getCommandResultWait(0x41);
        const buffer = Buffer.from(data.data);
        const total = buffer.readUInt16LE(0);
        if (total === 0) {
            return {
                total,
            };
        }
        const sd = String('00000000' + buffer.readUInt32LE(2))
            .slice(-8)
            .match(/.{2}/g);
        const ed = String('00000000' + buffer.readUInt32LE(6))
            .slice(-8)
            .match(/.{2}/g);
        if (sd === null || ed === null) {
            throw new Error('getFlashRomInfoWait error');
        }
        const startDate = new Date(`${sd[0]}${sd[1]}/${sd[2]}/${sd[3]} 0:0:0`);
        startDate.setTime(startDate.getTime() + 1000 * 60 * timeOffsetMinute);
        const endDate = new Date(`${ed[0]}${ed[1]}/${ed[2]}/${ed[3]} 0:0:0`);
        endDate.setTime(endDate.getTime() + 1000 * 60 * timeOffsetMinute);
        return {
            total,
            startDate,
            endDate,
        };
    }
    /**
     * FlashROMに保存されているデータ数確認用
     * 最新の計測日時と最古の計測日時を確認できる
     *
     * @param startDate 検索開始日(UTC)
     * @param endDate 検索終了日(UTC)
     * @param timeOffsetMinute 時差を入れる
     * @return FlashRomSearchData
     */
    async getFlashRomSearchWait(startDate, endDate, timeOffsetMinute) {
        startDate.setTime(startDate.getTime() + 1000 * 60 * timeOffsetMinute);
        endDate.setTime(endDate.getTime() + 1000 * 60 * timeOffsetMinute);
        const buf = Buffer.alloc(8);
        buf.writeUInt32LE(startDate.getUTCFullYear() * 10000 +
            (startDate.getUTCMonth() + 1) * 100 +
            startDate.getUTCDate(), 0);
        buf.writeUInt32LE(endDate.getUTCFullYear() * 10000 +
            (endDate.getUTCMonth() + 1) * 100 +
            endDate.getUTCDate(), 4);
        const data = await this.getCommandResultWait(0x42, Uint8Array.from(buf));
        const buffer = Buffer.from(data.data);
        return {
            total: buffer.readUInt16LE(0),
            hit: buffer.readUInt16LE(2),
            startIndex: buffer.readUInt16LE(4),
            endIndex: buffer.readUInt16LE(6),
        };
    }
    /**
     * FlashROMに保存されている計測履歴を取得
     * 終了モードの時に0xFFFFでリクエストすると最新の結果を取得
     * それ以外の場合は、getFlashRomSearchWaitで取得したIndexを元に取得する
     *
     * @param index データIndex
     * @param timeOffsetMinute 時差を入れる
     * @return FlashRomHistoryData
     */
    async getFlashRomHistoryDataWait(index, timeOffsetMinute) {
        const buf = Buffer.alloc(2);
        buf.writeUInt16LE(index, 0);
        const data = await this.getCommandFlashRomHistoryWait(0x43, Uint8Array.from(buf));
        const recode1 = data.find((value) => value.commandId === 0xc3);
        const recode2 = data.find((value) => value.commandId === 0xc4);
        const recode3 = data.find((value) => value.commandId === 0xc5);
        if (!(recode1 !== undefined && recode2 !== undefined && recode3 !== undefined)) {
            throw new Error('getFlashRomDataWait error');
        }
        const buffer = Buffer.from(recode1.data);
        const buffer2 = Buffer.from(recode2.data);
        const buffer3 = Buffer.from(recode3.data);
        return {
            index: buffer.readUInt16LE(0),
            monitoringStatus: {
                outRange: Boolean(buffer.readUInt8(2) & 0b01000000),
                changeSetting: Boolean(buffer.readUInt8(2) & 0b00100000),
                overSumFlow: Boolean(buffer.readUInt8(2) & 0b00010000),
                lowInstantFlow: Boolean(buffer.readUInt8(2) & 0b00001000),
                highInstantFlow: Boolean(buffer.readUInt8(2) & 0b00000100),
                shutdownBattery: Boolean(buffer.readUInt8(2) & 0b00000010),
                lowBattery: Boolean(buffer.readUInt8(2) & 0b00000001),
                isError: Boolean(buffer.readUInt8(2)),
            },
            monitoringResultStatus: {
                shutdownBattery: Boolean(buffer.readUInt8(3) & 0b00100000),
                swFinish: Boolean(buffer.readUInt8(3) & 0b00010000),
                userFinish: Boolean(buffer.readUInt8(3) & 0b00001000),
                overSumFlow: Boolean(buffer.readUInt8(3) & 0b00000100),
                lowSumFlow: Boolean(buffer.readUInt8(3) & 0b00000010),
                isError: Boolean(buffer.readUInt8(3)),
            },
            averageFlowRate: buffer.readUInt16LE(4),
            sumFlowRate: buffer.readUInt16LE(6),
            startDatetime: this.convertBufferToDate(buffer, 8, timeOffsetMinute),
            endDatetime: this.convertBufferToDate(buffer2, 0, timeOffsetMinute),
            startBatteryVoltage: buffer2.readUInt16LE(8),
            endBatteryVoltage: buffer2.readUInt16LE(10),
            logIndex: buffer2.readUInt16LE(12),
            reserved1: buffer2.readUInt16LE(14),
            infusionDropCount: buffer3.readUInt16LE(0),
            targetSumFlowRate: buffer3.readUInt16LE(2),
            targetFlowRate: buffer3.readUInt16LE(4),
            correctionFactor: buffer3.readUInt16LE(6),
            effectiveInstantFlowRate: buffer3.readUInt8(8),
            finishJudgmentSec: buffer3.readUInt8(9),
            effectiveIntegratedFlowRate: buffer3.readUInt8(10),
            powerOffSec: buffer3.readUInt8(11),
            reserved2: buffer3.readUInt32LE(12),
        };
    }
    convertBufferToDate(buffer, index, timeOffsetMinute) {
        const d = String('00000000' + buffer.readUInt32LE(index))
            .slice(-8)
            .match(/.{2}/g);
        const t = String('00000000' + buffer.readUInt32LE(index + 4))
            .slice(-8)
            .match(/.{2}/g);
        if (d === null || t === null) {
            throw new Error('rtc error');
        }
        const date = new Date(`${d[0]}${d[1]}/${d[2]}/${d[3]} ${t[1]}:${t[2]}:${t[3]}`);
        date.setTime(date.getTime() + 1000 * 60 * timeOffsetMinute);
        return date;
    }
    async getCommandResultWait(commandId, data, timeoutMs) {
        const promise = this.createCommandCallback(commandId, timeoutMs);
        await this.writeCommandWait(commandId, data);
        return promise;
    }
    createCommandCallback(commandId, timeoutMs) {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error(`timeout command:${commandId}`)), timeoutMs ? timeoutMs : 5000);
            // callbackは0x80を加算する
            this.setCommandCallback(commandId + 0x80, (notifyData) => {
                this.removeCommandCallback(commandId + 0x80);
                if (notifyData.result !== 'ok') {
                    reject(new Error(`id:${notifyData.commandId},error:${notifyData.result}`));
                }
                resolve(notifyData);
            });
        });
    }
    async getCommandFlashRomHistoryWait(commandId, data, timeoutMs) {
        const promise = Promise.all([
            this.createCommandCallback(commandId, timeoutMs),
            this.createCommandCallback(commandId + 1, timeoutMs),
            this.createCommandCallback(commandId + 2, timeoutMs),
        ]);
        await this.writeCommandWait(commandId, data);
        return promise;
    }
    setCommandCallback(commandId, callback) {
        this.callbackArray = [
            ...this.callbackArray,
            { commandId, function: callback },
        ];
    }
    removeCommandCallback(commandId) {
        this.callbackArray = this.callbackArray.filter((value) => value.commandId !== commandId);
    }
}
exports.default = DR_MARK;
DR_MARK.onnotify = null;
DR_MARK.onfinish = null;
DR_MARK.onpulse = null;
DR_MARK.pulseDataArray = [];
