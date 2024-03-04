/**
 * @packageDocumentation
 * @module Parts.Switchbot_Bot
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import Obniz from '../../../obniz';
import { Switchbot } from '../utils/abstracts/Switchbot';
export interface Switchbot_BotOptions {
}
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
declare const SWITCHBOT_BOT_ACTION: {
    readonly PushAndPullBack: 0;
    readonly LightSwitchOn: 1;
    readonly LightSwitchOff: 2;
    readonly PushStop: 3;
    readonly Back: 4;
};
declare type SwitchbotBotAction = typeof SWITCHBOT_BOT_ACTION[keyof typeof SWITCHBOT_BOT_ACTION];
/** Switchbot_Bot management class Switchbot_Botを管理するクラス */
export default class Switchbot_Bot extends Switchbot {
    static info(): ObnizPartsBleInfo;
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
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the Switchbot_Bot
     *
     * Switchbot_Botらデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Switchbot_Bot Switchbot_Botから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): Switchbot_Bot_Data | null;
    ondisconnect?: (reason: any) => void;
    params?: Switchbot_BotOptions;
    wired(obniz: Obniz): void;
    getDeviceInfoWait(): Promise<void>;
    protected executeActionWait(action: SwitchbotBotAction): Promise<number[]>;
    pressWait(): Promise<number[]>;
    turnOnWait(): Promise<number[]>;
    turnOffWait(): Promise<number[]>;
    downWait(): Promise<number[]>;
    upWait(): Promise<number[]>;
}
export {};
