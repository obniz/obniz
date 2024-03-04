"use strict";
/**
 * @packageDocumentation
 * @module Parts.Switchbot_Bot
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const advertismentAnalyzer_1 = require("../utils/advertisement/advertismentAnalyzer");
const Switchbot_1 = require("../utils/abstracts/Switchbot");
const SWITCHBOT_BOT_ACTION = {
    PushAndPullBack: 0x00,
    LightSwitchOn: 0x01,
    LightSwitchOff: 0x02,
    PushStop: 0x03,
    Back: 0x04,
};
/** Switchbot_Bot management class Switchbot_Botを管理するクラス */
class Switchbot_Bot extends Switchbot_1.Switchbot {
    static info() {
        return {
            name: 'Switchbot_Bot',
        };
    }
    /**
     * Verify that the received peripheral is from the Switchbot_Bot
     *
     * 受け取ったPeripheralがSwitchbot_Botのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Switchbot_Bot
     *
     * Switchbot_Botかどうか
     */
    static isDevice(peripheral) {
        return Switchbot_1.Switchbot.isSwitchbotDevice(peripheral, [0x48, 0xc8], // bot : 0x48(no encryption) or 0xC8(encryption algorithm 1)
        2);
    }
    /**
     * Get a data from the Switchbot_Bot
     *
     * Switchbot_Botらデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Switchbot_Bot Switchbot_Botから受け取ったデータ
     */
    static getData(peripheral) {
        if (!Switchbot_Bot.isDevice(peripheral)) {
            return null;
        }
        const serviceData = Switchbot_1.Switchbot.getServiceDataPayload(peripheral, [0x48, 0xc8], // bot : 0x48(no encryption) or 0xC8(encryption algorithm 1)
        2);
        if (!serviceData)
            return null; // not target device
        const buf = Buffer.from(serviceData);
        const byte1 = buf.readUInt8(0);
        const byte2 = buf.readUInt8(1);
        const mode = !!(byte1 & 0b10000000); // Whether the light switch Add-on is used or not
        const state = !!(byte1 & 0b01000000); // Whether the switch status is ON or OFF
        const battery = byte2 & 0b01111111; // %
        const data = {
            mode,
            state,
            battery,
        };
        return data;
    }
    wired(obniz) {
        // do nothing.
    }
    async getDeviceInfoWait() {
        const rand = Math.random();
        console.log(rand, 'start');
        if (!this._peripheral.connected || !this._commandSequence) {
            throw new Error('connect device at first');
        }
        const results = await this._commandSequence.transactionWait(this._createCommand(0x02, []));
        const commandResponseDeviceInfoAnalyzer = new advertismentAnalyzer_1.BleAdvBinaryAnalyzer()
            // status
            // 0x01 - OK Action executed
            // 0x02 - ERROR Error while executing an Action
            // 0x03 - BUSY Device is busy now, please try later
            // 0x04 - Communication protocol version incompatible
            // 0x05 - Device does not support this Command
            // 0x06 - Device low battery
            // 0x07 - Device is encrypted
            // 0x08 - Device is unencrypted
            // 0x09 - Password error
            // 0x0A - Device does not support this encription method
            // 0x0B - Failed to locate a nearby mesh Device
            // 0x0C - Failed to connect to the network
            .addTarget('status', [-1])
            .addTarget('battery', [-1])
            .addTarget('firmware_version', [-1])
            .addTarget('nc', [-1, -1, -1, -1, -1])
            .addTarget('timer_num', [-1])
            .addTarget('act_mode', [-1])
            .addTarget('hold_times', [-1])
            .addTarget('service_data', [-1, -1]);
        console.log(rand, commandResponseDeviceInfoAnalyzer.getAllData(results));
    }
    async executeActionWait(action) {
        if (!this._peripheral.connected || !this._commandSequence) {
            throw new Error('connect device at first');
        }
        const results = await this._commandSequence.transactionWait(this._createCommand(0x01, [action]));
        if (results[0] !== 0x01) {
            throw new Error('execute action failed ' + results[0]);
        }
        return results;
    }
    async pressWait() {
        return await this.executeActionWait(SWITCHBOT_BOT_ACTION.PushAndPullBack);
    }
    async turnOnWait() {
        return await this.executeActionWait(SWITCHBOT_BOT_ACTION.LightSwitchOn);
    }
    async turnOffWait() {
        return await this.executeActionWait(SWITCHBOT_BOT_ACTION.LightSwitchOff);
    }
    async downWait() {
        return await this.executeActionWait(SWITCHBOT_BOT_ACTION.PushStop);
    }
    async upWait() {
        return await this.executeActionWait(SWITCHBOT_BOT_ACTION.Back);
    }
}
exports.default = Switchbot_Bot;
