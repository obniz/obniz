/**
 * @packageDocumentation
 * @module Parts.Switchbot_Bot
 */
/* eslint rulesdir/non-ascii: 0 */

// import {BleRemotePeripheral, ObnizPartsBleInterface, ObnizPartsBleInfo} from 'obniz';

import {
  BleConnectSetting,
  BlePairingOptions,
  BleRemotePeripheral,
} from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';
import { BleAdvBinaryAnalyzer } from '../utils/advertisement/advertismentAnalyzer';
import roundTo from 'round-to';
import Obniz from '../../../obniz';
import { RS_BTWATTCH2Options } from '../RS_BTWATTCH2';
import { BleRemoteCharacteristic } from '../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic';
import { BleRemoteCommandSequence } from '../../../obniz/libs/embeds/bleHci/bleRemoteCommandSequence';
import { Switchbot } from '../utils/abstracts/Switchbot';

export interface Switchbot_BotOptions {}

/**
 * advertisement data from Switchbot_Bot
 *
 * Switchbot_Botからのadvertisementデータ
 */
export interface Switchbot_Bot_Data {
  mode: boolean;
  state: boolean;
  battery: number;
}

const SWITCHBOT_BOT_ACTION = {
  PushAndPullBack: 0x00,
  LightSwitchOn: 0x01,
  LightSwitchOff: 0x02,
  PushStop: 0x03,
  Back: 0x04,
} as const;
type SwitchbotBotAction = typeof SWITCHBOT_BOT_ACTION[keyof typeof SWITCHBOT_BOT_ACTION];

/** Switchbot_WoSensor management class Switchbot_Botを管理するクラス */
export default class Switchbot_Bot extends Switchbot {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'Switchbot_Bot',
    };
  }

  /**
   * Verify that the received peripheral is from the Switchbot_WoSensor
   *
   * 受け取ったPeripheralがSwitchbot_Botのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the Switchbot_Bot
   *
   * Switchbot_Botかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return Switchbot.isSwitchbotDevice(
      peripheral,
      [0x48, 0xc8], // bot : 0x48(no encryption) or 0xC8(encryption algorithm 1)
      2
    );
  }

  /**
   * Get a data from the Switchbot_WoSensor
   *
   * Switchbot_Botらデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the Switchbot_Bot Switchbot_Botから受け取ったデータ
   */
  public static getData(
    peripheral: BleRemotePeripheral
  ): Switchbot_Bot_Data | null {
    if (!Switchbot_Bot.isDevice(peripheral)) {
      return null;
    }

    const serviceData = Switchbot.getServiceDataPayload(
      peripheral,
      [0x48, 0xc8], // bot : 0x48(no encryption) or 0xC8(encryption algorithm 1)
      2
    );

    if (!serviceData) return null; // not target device

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

  public ondisconnect?: (reason: any) => void;

  public params?: Switchbot_BotOptions;

  public wired(obniz: Obniz): void {
    // do nothing.
  }

  public async getDeviceInfoWait() {
    const rand = Math.random();
    console.log(rand, 'start');
    if (!this._peripheral.connected || !this._commandSequence) {
      throw new Error('connect device at first');
    }
    const results = await this._commandSequence.transactionWait(
      this._createCommand(0x02, [])
    );
    const commandResponseDeviceInfoAnalyzer = new BleAdvBinaryAnalyzer()

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

  protected async executeActionWait(action: SwitchbotBotAction) {
    if (!this._peripheral.connected || !this._commandSequence) {
      throw new Error('connect device at first');
    }
    const results = await this._commandSequence.transactionWait(
      this._createCommand(0x01, [action])
    );
    if (results[0] !== 0x01) {
      throw new Error('execute action failed ' + results[0]);
    }
    return results;
  }

  public async pressWait() {
    return await this.executeActionWait(SWITCHBOT_BOT_ACTION.PushAndPullBack);
  }

  public async turnOnWait() {
    return await this.executeActionWait(SWITCHBOT_BOT_ACTION.LightSwitchOn);
  }

  public async turnOffWait() {
    return await this.executeActionWait(SWITCHBOT_BOT_ACTION.LightSwitchOff);
  }

  public async downWait() {
    return await this.executeActionWait(SWITCHBOT_BOT_ACTION.PushStop);
  }

  public async upWait() {
    return await this.executeActionWait(SWITCHBOT_BOT_ACTION.Back);
  }
}
