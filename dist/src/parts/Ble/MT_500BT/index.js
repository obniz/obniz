"use strict";
/**
 * @packageDocumentation
 * @module Parts.MT_500BT
 */
/* eslint rulesdir/non-ascii: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const util_1 = require("../../../obniz/libs/utils/util");
/** MT_500BT management class MT_500BTを管理するクラス */
class MT_500BT {
    constructor(peripheral) {
        this.keys = [];
        this.requiredKeys = [];
        this._uuids = {
            MSDPService: '1ef19620a8034af0ae954b4b0aa26f29',
            rxChar: '1ef19621a8034af0ae954b4b0aa26f29',
            txChar: '1ef19622a8034af0ae954b4b0aa26f29',
        };
        if (peripheral && !MT_500BT.isDevice(peripheral)) {
            throw new Error('peripheral is not MT_500BT');
        }
        this._peripheral = peripheral;
        this._emitter = new eventemitter3_1.default();
    }
    static info() {
        return {
            name: 'MT_500BT',
        };
    }
    /**
     * Verify that the received peripheral is from the MT_500BT
     *
     * 受け取ったPeripheralがMT_500BTのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the MT_500BT
     *
     * MT_500BTかどうか
     */
    static isDevice(peripheral) {
        if (peripheral.localName && peripheral.localName.startsWith('MT-500')) {
            return true;
        }
        return false;
    }
    /**
     * Get IFUID from the localName
     *
     * localNameからIFUIDを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns IFUID
     */
    static getIFUID(peripheral) {
        if (!this.isDevice(peripheral) || peripheral.localName.length < 12) {
            return null;
        }
        const hexStr = peripheral.localName.slice(7, 11);
        return Buffer.from(hexStr, 'hex').readUInt16BE(0);
    }
    /**
     * Decrypt CNKEY from IFUID
     *
     * IFUIDからCNKEYを復号
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns decrypted CNKEY 復号されたされたCNKEY
     */
    static getCNKey(peripheral) {
        const ifuid = this.getIFUID(peripheral);
        if (ifuid === null) {
            return null;
        }
        const cnkey = (((ifuid ^ 0xb452) << 3) & 0xffff) | ((ifuid ^ 0xb452) >> (16 - 3));
        return cnkey;
    }
    wired(obniz) {
        // do nothing.
    }
    /**
     * Connect (and authenticate) the sensor
     *
     * センサへ接続(+ センサの認証)
     */
    async connectWait() {
        if (!this._peripheral) {
            throw new Error('MT-500BT is not find.');
        }
        this._peripheral.ondisconnect = (reason) => {
            // console.log("disconnect");
            if (this.ondisconnect) {
                this.ondisconnect(reason);
            }
        };
        // console.log("connecting");
        await this._peripheral.connectWait();
        try {
            // console.log("connected");
            this.MSDPService = this._peripheral.getService(this._uuids.MSDPService);
            this.MSDPRxChar = this.MSDPService.getCharacteristic(this._uuids.rxChar);
            this.MSDPTxChar = this.MSDPService.getCharacteristic(this._uuids.txChar);
            // console.log("char set");
            await this.MSDPRxChar.registerNotifyWait((data) => {
                // console.log("recv array", data);
                if (data.length !== 20) {
                    throw new Error('unknown format received');
                }
                if (data[0] !== 0xe7) {
                    throw new Error('unknown header');
                }
                const calcedChecksum = this._checksum(data.slice(0, 19));
                if (data[19] !== calcedChecksum) {
                    throw new Error('checksum failed');
                }
                const replyBuf = Buffer.from(data);
                this._emitter.emit('' + replyBuf.readUInt8(1), replyBuf);
            });
            // console.log("registerNotifyWait");
            await this.startCommunicationCommandWait();
        }
        catch (e) {
            await this.disconnectWait();
        }
    }
    /**
     * Send the communication start command
     *
     * 通信開始コマンドを送信
     */
    async startCommunicationCommandWait() {
        const cnkey = ('' + MT_500BT.getCNKey(this._peripheral)).padStart(4, '0'); // to string
        const CNKeyBuf = Buffer.from(cnkey, 'utf8');
        const startCommand = this._createCommand(0xfd, Array.from(CNKeyBuf));
        // console.log("sendDataReplyWait");
        const res = await this._sendDataReplyWait(startCommand);
        if (res.readUInt8(2) !== 0) {
            throw new Error('StartCommunicationError ' + res.readUInt8(2));
        }
    }
    /**
     * Get device information from the MT_500BT
     *
     * MT_500BTからのデバイス情報データ取得
     *
     * @returns received device information data from the MT_500BT
     *
     * MT_500BTからのデバイス情報データ
     *
     * ```
     * {
     *
     * cls: device type デバイスタイプ
     *
     * ('Pulse rate meter', 'SpO2(BO)', 'Thermometer', 'SpO2(MP)', 'Blood pressure meter'),
     *
     * dvnm: product information 製品情報,
     *
     * swif: detailed information 詳細情報
     *
     * }
     * ```
     */
    async getDeviceInformationWait() {
        const res1 = await this._sendDataReplyWait(this._createCommand(0x00, [0x01]));
        const res2 = await this._sendDataReplyWait(this._createCommand(0x00, [0x02]));
        const deviceType = {
            2: 'Pulse rate meter',
            3: 'SpO2(BO)',
            4: 'Thermometer',
            5: 'SpO2(MP)',
            6: 'Blood pressure meter',
        };
        return {
            cls: deviceType[res1.readUInt8(3)],
            dvnm: util_1.ObnizUtil.dataArray2string(Array.from(res1.slice(4, -1))),
            swif: util_1.ObnizUtil.dataArray2string(Array.from(res2.slice(3, -1))),
        };
    }
    // device always throw error
    // public async getDatetimeWait(): Promise<any> {
    //   const res = await this._sendDataReplyWait(this._createCommand(0x01, [0x00]));
    //   const year = res.readUInt8(3) !== 0xff ? res.readUInt8(3) : undefined;
    //   const month = res.readUInt8(4) !== 0xff ? res.readUInt8(4) : undefined;
    //   const day = res.readUInt8(5) !== 0xff ? res.readUInt8(5) : undefined;
    //   const hour = res.readUInt8(6) !== 0xff ? res.readUInt8(6) : undefined;
    //   const minute = res.readUInt8(7) !== 0xff ? res.readUInt8(7) : undefined;
    //   const second = res.readUInt8(8) !== 0xff ? res.readUInt8(8) : undefined;
    //   return {
    //     year,
    //     month,
    //     day,
    //     hour,
    //     minute,
    //     second,
    //   };
    // }
    //
    // device always throw error
    // public async setDatetimeWait(timeOffsetMinute: number): Promise<any> {
    //   const date = new Date();
    //   date.setTime(Date.now() + 1000 * 60 * timeOffsetMinute);
    //
    //   const res = await this._sendDataReplyWait(
    //     this._createCommand(0x01, [
    //       0x01, // write
    //       date.getUTCFullYear() - 2000,
    //       date.getUTCMonth() + 1,
    //       date.getUTCDate(),
    //       date.getUTCHours(),
    //       date.getUTCMinutes(),
    //       date.getUTCSeconds(),
    //     ]),
    //   );
    //   if (res.readUInt8(3) !== 0) {
    //     throw new Error("setDatetimeWait error " + res.readUInt8(3));
    //   }
    // }
    /**
     * Get temperature and humidity data from the MT_500BT
     *
     * MT_500BTから温湿度データを取得
     *
     * @returns received temperature and humidity data from the MT_500BT
     *
     * MT_500BTからの温湿度データ
     *
     * ```
     * {
     *
     * timestamp: timestamp タイムスタンプ,
     *
     * temperature: {
     *
     *   body: body temperature 体温,
     *
     *   material: material temperature 物体温度,
     *
     *   air: air temperature 気温
     *
     *   }
     *
     * }
     * ```
     */
    async getTemperatureWait() {
        const res = await this._sendDataReplyWait(this._createCommand(0x80));
        const year = res.readUInt8(3) !== 0xff ? res.readUInt8(3) + 2000 : undefined;
        const month = res.readUInt8(4) !== 0xff ? res.readUInt8(4) : undefined;
        const day = res.readUInt8(5) !== 0xff ? res.readUInt8(5) : undefined;
        const hour = res.readUInt8(6) !== 0xff ? res.readUInt8(6) : undefined;
        const minute = res.readUInt8(7) !== 0xff ? res.readUInt8(7) : undefined;
        const second = res.readUInt8(8) !== 0xff ? res.readUInt8(8) : undefined;
        const bodyTemperature = res.readUInt16LE(9) !== 0xff7f ? res.readUInt16LE(9) / 10 : undefined;
        const materialTemperature = res.readUInt16LE(11) !== 0xff7f ? res.readUInt16LE(11) / 10 : undefined;
        const airTemperature = res.readUInt16LE(13) !== 0xff7f ? res.readUInt16LE(13) / 10 : undefined;
        return {
            timestamp: {
                year,
                month,
                day,
                hour,
                minute,
                second,
            },
            temperature: {
                body: bodyTemperature,
                material: materialTemperature,
                air: airTemperature,
            },
        };
    }
    /**
     * Disconnect from the sensor
     *
     * センサから切断
     */
    async disconnectWait() {
        if (!this._peripheral) {
            throw new Error('MT-500BT is not find.');
        }
        if (this._peripheral.connected) {
            await this._peripheral.disconnectWait();
        }
    }
    _createCommand(cid, data = []) {
        if (data.length >= 18) {
            throw new Error('too many data length');
        }
        const command = [0xe7, cid, ...data];
        for (let i = 0; i < 19; i++) {
            if (command[i] === undefined) {
                command[i] = 0xff; // N/A
            }
        }
        command.push(this._checksum(command));
        return Buffer.from(command);
    }
    _checksum(data) {
        if (data.length !== 19) {
            throw Error('unknown format');
        }
        const sum = data.reduce((a, b) => a + b, 0);
        const inv = (0xa5 + sum) & 0xff;
        const result = (inv ^ 0xff) + 1;
        return result;
    }
    _sendDataReplyWait(sendData) {
        return new Promise((resolve, reject) => {
            if (!this.MSDPRxChar) {
                reject(new Error('MSDPRxChar is not found'));
                return;
            }
            if (!this.MSDPTxChar) {
                reject(new Error('MSDPTxChar is not found'));
                return;
            }
            // console.log("write array", Array.from(sendData));
            this._emitter.once('' + sendData.readUInt8(1), resolve);
            this.MSDPTxChar.writeWait(Array.from(sendData));
        });
    }
}
exports.default = MT_500BT;
