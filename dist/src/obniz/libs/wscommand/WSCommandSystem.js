"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSCommandSystem = void 0;
/**
 * @packageDocumentation
 * @ignore
 */
const WSCommandAbstract_1 = require("./WSCommandAbstract");
class WSCommandSystem extends WSCommandAbstract_1.WSCommandAbstract {
    constructor() {
        super(...arguments);
        this.module = 0;
        this._CommandReboot = 0;
        this._CommandUpdateFirmware = 1; // for only admin
        this._CommandReset = 2;
        this._CommandSelfCheck = 3;
        this._CommandWait = 4;
        this._CommandResetOnDisconnect = 5;
        this._CommandSign = 6; // for only admin
        this._CommandCoreDump = 7; // for only admin
        this._CommandPingPong = 8;
        this._CommandVCC = 9;
        this._CommandSleepSeconds = 10;
        this._CommandSleepMinute = 11;
        this._CommandSleepIoTrigger = 12;
        this._CommandApInfo = 13; // for only admin
        this._CommandGetNetworkSetting = 14; // for only admin
        this._CommandSetNetworkSetting = 15; // for only admin
        this._CommandUpdateNetworkStatus = 16; // for only admin
        this._CommandUpdateFirmwareFromUrl = 17; // for only admin
        this._CommandUpdatePingCheckInterval = 18; // for only admin
        this._CommandUpdateLocalConnect = 19; // for only admin
    }
    // Commands
    reboot() {
        this.sendCommand(this._CommandReboot, null);
    }
    reset() {
        this.sendCommand(this._CommandReset, null);
    }
    selfCheck() {
        this.sendCommand(this._CommandSelfCheck, null);
    }
    wait(params) {
        const msec = params.wait;
        const buf = new Uint8Array([msec >> 8, msec]);
        this.sendCommand(this._CommandWait, buf);
    }
    keepWorkingAtOffline(params) {
        this.resetOnDisconnect(!params.keep_working_at_offline);
    }
    ping(params) {
        const unixtime = new Date().getTime();
        const buf = new Uint8Array(params.ping.key.length + 8);
        const upper = Math.floor(unixtime / Math.pow(2, 32));
        const lower = unixtime - upper * Math.pow(2, 32);
        buf[0] = upper >> (8 * 3);
        buf[1] = upper >> (8 * 2);
        buf[2] = upper >> (8 * 1);
        buf[3] = upper >> (8 * 0);
        buf[4] = lower >> (8 * 3);
        buf[5] = lower >> (8 * 2);
        buf[6] = lower >> (8 * 1);
        buf[7] = lower >> (8 * 0);
        for (let i = 0; i < params.ping.key.length; i++) {
            buf[8 + i] = params.ping.key[i];
        }
        this.sendCommand(this._CommandPingPong, buf);
    }
    resetOnDisconnect(mustReset) {
        const buf = new Uint8Array([mustReset ? 1 : 0]);
        this.sendCommand(this._CommandResetOnDisconnect, buf);
    }
    // Commands
    /**
     * ペリフェラルなどのリセットに加えて、ローカルコネクト切断も行います。またOS4.0.0以降はローカルコネクト用のport80のlistenも停止します
     */
    hardReset() {
        const buf = new Uint8Array([1]);
        this.sendCommand(this._CommandReset, buf);
    }
    /**
     * firmareのbinaryを使ってupdateします
     *
     * @param {Buffer} firmware
     */
    update_firmware(firmware) {
        this.sendCommand(this._CommandUpdateFirmware, firmware);
    }
    /**
     * CC3235用。URLを送ることでDownlaod->更新を行います。
     * obniz.comである必要があります。また、CC3235は署名チェックをするため適当なビルドでは動作しません。
     *
     * @param {string} urlFirmware
     */
    updateFirmwareFromUrl(urlFirmware) {
        const bufUrl = Buffer.from(urlFirmware);
        const bufNull = Buffer.from([0x00]);
        const buf = Buffer.concat([bufUrl, bufNull]);
        const uint8array = new Uint8Array(buf);
        this.sendCommand(this._CommandUpdateFirmwareFromUrl, uint8array);
    }
    /**
     * デバイスのpingの間隔を更新します。これはクラウドから一度切り離されると再度もとに戻ります。
     *
     * @param {number} intervalMilliSec
     */
    updatePingCheckInterval(intervalMilliSec) {
        const buf = new Uint8Array(4);
        buf[0] = intervalMilliSec >> (8 * 3);
        buf[1] = intervalMilliSec >> (8 * 2);
        buf[2] = intervalMilliSec >> (8 * 1);
        buf[3] = intervalMilliSec >> (8 * 0);
        this.sendCommand(this._CommandUpdatePingCheckInterval, buf);
    }
    /**
     * ローカルコネクトを開始する・停止する。これは一時的なものでマイコンが再起動したら元の状態に戻る
     *
     * @param {boolean} isOn
     */
    updateLocalConnect(isOn) {
        const buf = new Uint8Array(1);
        buf[0] = isOn ? 1 : 0;
        this.sendCommand(this._CommandUpdateLocalConnect, buf);
    }
    /**
     * 署名リクエストを送ります。
     *
     * @param {Buffer} message
     */
    sign(message) {
        this.sendCommand(this._CommandSign, message);
    }
    /**
     * 現在のネットワーク情報を送るようにリクエストを送ります。
     */
    getApInfo() {
        this.sendCommand(this._CommandApInfo, null);
    }
    /**
     * 現在のflash内に保存されている設定を送るようにリクエストを送ります。
     */
    getNetworkSetting() {
        this.sendCommand(this._CommandGetNetworkSetting, null);
    }
    /**
     * flash内に設定を保存します。
     *
     */
    setNetworkSetting(params) {
        this.sendCommand(this._CommandSetNetworkSetting, Buffer.from(params.network.value, 'utf8'));
    }
    parseFromJson(json) {
        const module = json.system;
        if (module === undefined) {
            return;
        }
        const schemaData = [
            { uri: '/request/system/reboot', onValid: this.reboot },
            { uri: '/request/system/reset', onValid: this.reset },
            { uri: '/request/system/wait', onValid: this.wait },
            { uri: '/request/system/selfCheck', onValid: this.selfCheck },
            {
                uri: '/request/system/keepWorkingAtOffline',
                onValid: this.keepWorkingAtOffline,
            },
            { uri: '/request/system/ping', onValid: this.ping },
            { uri: '/request/system/sleepSeconds', onValid: this.sleepSeconds },
            { uri: '/request/system/sleepMinute', onValid: this.sleepMinute },
            { uri: '/request/system/sleepIoTrigger', onValid: this.sleepIoTrigger },
            // for admin
            { uri: '/request/system/network_value', onValid: this.setNetworkSetting },
            { uri: '/request/system/network_get', onValid: this.getNetworkSetting },
        ];
        const res = this.validateCommandSchema(schemaData, module, 'system');
        if (module.firmware) {
            this.update_firmware(module.firmware);
            return;
        }
        else if (module.hardReset) {
            this.hardReset();
            return;
        }
        if (res.valid === 0) {
            if (res.invalidButLike.length > 0) {
                throw new Error(res.invalidButLike[0].message);
            }
            else {
                throw new this.WSCommandNotFoundError(`[system]unknown command`);
            }
        }
    }
    pong(objToSend, payload) {
        objToSend.system = objToSend.system || {};
        const pongServerTime = new Date().getTime();
        if (payload.length >= 16) {
            const buf = Buffer.from(payload);
            const obnizTime = buf.readUIntBE(0, 4) * Math.pow(2, 32) + buf.readUIntBE(4, 4);
            const pingServerTime = buf.readUIntBE(8, 4) * Math.pow(2, 32) + buf.readUIntBE(12, 4);
            const key = [];
            for (let i = 16; i < buf.length; i++) {
                key.push(buf.readUInt8(i));
            }
            objToSend.system.pong = {
                key,
                obnizTime,
                pingServerTime,
                pongServerTime,
            };
        }
        else {
            objToSend.system.pong = {
                pongServerTime,
            };
        }
    }
    notifyFromBinary(objToSend, func, payload) {
        var _a, _b, _c, _d;
        switch (func) {
            case this._CommandVCC:
                if (payload.byteLength === 3) {
                    let value = (payload[1] << 8) + payload[2];
                    value = value / 100.0;
                    this.envelopWarning(objToSend, 'debug', {
                        message: `Low Voltage ${value}v. connect obniz to more powerful USB.`,
                    });
                }
                break;
            case this._CommandPingPong:
                this.pong(objToSend, payload);
                break;
            case this._CommandSign: {
                const hashLength = payload[0];
                const hash = payload.slice(1, 1 + hashLength);
                const signature = payload.slice(1 + hashLength);
                (_a = this.delegate) === null || _a === void 0 ? void 0 : _a.onSignatureReceived(hash, signature);
                break;
            }
            case this._CommandCoreDump:
                (_b = this.delegate) === null || _b === void 0 ? void 0 : _b.onCoreDumpReceived(payload);
                break;
            case this._CommandApInfo: {
                const wifis = this.decodeWiFiInfo(payload);
                (_c = this.delegate) === null || _c === void 0 ? void 0 : _c.onApInfoReceived(wifis);
                break;
            }
            case this._CommandGetNetworkSetting:
                (_d = this.delegate) === null || _d === void 0 ? void 0 : _d.onNetworkSettingReceived(payload);
                break;
            default:
                super.notifyFromBinary(objToSend, func, payload);
                break;
        }
    }
    sleepSeconds(params) {
        const sec = params.sleep_seconds;
        const buf = new Uint8Array([sec >> 8, sec]);
        this.sendCommand(this._CommandSleepSeconds, buf);
    }
    sleepMinute(params) {
        const minute = params.sleep_minute;
        const buf = new Uint8Array([minute >> 8, minute]);
        this.sendCommand(this._CommandSleepMinute, buf);
    }
    sleepIoTrigger(params) {
        const trigger = params.sleep_io_trigger;
        const triggerNum = trigger === true ? 1 : 0;
        const buf = new Uint8Array([triggerNum]);
        this.sendCommand(this._CommandSleepIoTrigger, buf);
    }
    isWSRoomOnlyCommand(func) {
        return (func === this._CommandSign ||
            func === this._CommandCoreDump ||
            func === this._CommandApInfo ||
            func === this._CommandGetNetworkSetting ||
            func === this._CommandSetNetworkSetting ||
            func === this._CommandUpdateLocalConnect);
    }
    decodeWiFiInfo(payload) {
        const ScanState = {
            SCAN_SSID_LEN: 0,
            SCAN_SSID: 1,
            SCAN_MAC: 2,
            SCAN_RSSI: 3,
        };
        let mode = ScanState.SCAN_SSID_LEN;
        let tmpIndex = 0;
        let ssid = '';
        let macAddress = '';
        let rssi = 0;
        const scanArray = [];
        try {
            for (let i = 0; i < payload.length; i++) {
                switch (mode) {
                    case ScanState.SCAN_SSID_LEN:
                        tmpIndex = payload[i];
                        mode = ScanState.SCAN_SSID;
                        break;
                    case ScanState.SCAN_SSID:
                        ssid += String.fromCharCode(payload[i]);
                        tmpIndex--;
                        if (tmpIndex === 0) {
                            mode = ScanState.SCAN_MAC;
                            tmpIndex = 0;
                        }
                        break;
                    case ScanState.SCAN_MAC:
                        macAddress += String.fromCharCode(payload[i]);
                        tmpIndex++;
                        if (tmpIndex === 12) {
                            mode = ScanState.SCAN_RSSI;
                            macAddress = macAddress.toLowerCase();
                        }
                        break;
                    case ScanState.SCAN_RSSI:
                        rssi = this._signedNumberFromBinary([payload[i]]);
                        mode = ScanState.SCAN_SSID_LEN;
                        scanArray.push({
                            ssid,
                            macAddress,
                            rssi,
                        });
                        ssid = '';
                        macAddress = '';
                        rssi = 0;
                        break;
                }
            }
        }
        catch (e) {
            console.log(e);
        }
        return scanArray;
    }
    _signedNumberFromBinary(data) {
        // big adian
        let val = data[0] & 0x7f;
        for (let i = 1; i < data.length; i++) {
            val = val * 256 + data[i];
        }
        if ((data[0] & 0x80) !== 0) {
            val = val - Math.pow(2, data.length * 8 - 1);
        }
        return val;
    }
}
exports.WSCommandSystem = WSCommandSystem;
