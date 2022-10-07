/// <reference types="node" />
/// <reference types="node" />
/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';
interface WiFiInfo {
    ssid: string;
    macAddress: string;
    rssi: number;
}
export declare class WSCommandSystem extends WSCommandAbstract {
    module: number;
    _CommandReboot: number;
    _CommandUpdateFirmware: number;
    _CommandReset: number;
    _CommandSelfCheck: number;
    _CommandWait: number;
    _CommandResetOnDisconnect: number;
    _CommandSign: number;
    _CommandCoreDump: number;
    _CommandPingPong: number;
    _CommandVCC: number;
    _CommandSleepSeconds: number;
    _CommandSleepMinute: number;
    _CommandSleepIoTrigger: number;
    _CommandApInfo: number;
    _CommandGetNetworkSetting: number;
    _CommandSetNetworkSetting: number;
    _CommandUpdateNetworkStatus: number;
    _CommandUpdateFirmwareFromUrl: number;
    _CommandUpdatePingCheckInterval: number;
    _CommandUpdateLocalConnect: number;
    delegate?: {
        onSignatureReceived: (hash: Uint8Array, signature: Uint8Array) => void;
        onCoreDumpReceived: (payload: Uint8Array) => void;
        onApInfoReceived: (wiFiInfos: WiFiInfo[]) => void;
        onNetworkSettingReceived: (payload: Uint8Array) => void;
    };
    reboot(): void;
    reset(): void;
    selfCheck(): void;
    wait(params: {
        wait: number;
    }): void;
    keepWorkingAtOffline(params: {
        keep_working_at_offline: boolean;
    }): void;
    ping(params: {
        ping: {
            key: number[];
        };
    }): void;
    resetOnDisconnect(mustReset: boolean): void;
    /**
     * ペリフェラルなどのリセットに加えて、ローカルコネクト切断も行います。またOS4.0.0以降はローカルコネクト用のport80のlistenも停止します
     */
    hardReset(): void;
    /**
     * firmareのbinaryを使ってupdateします
     *
     * @param {Buffer} firmware
     */
    update_firmware(firmware: Buffer): void;
    /**
     * CC3235用。URLを送ることでDownlaod->更新を行います。
     * obniz.comである必要があります。また、CC3235は署名チェックをするため適当なビルドでは動作しません。
     *
     * @param {string} urlFirmware
     */
    updateFirmwareFromUrl(urlFirmware: string): void;
    /**
     * デバイスのpingの間隔を更新します。これはクラウドから一度切り離されると再度もとに戻ります。
     *
     * @param {number} intervalMilliSec
     */
    updatePingCheckInterval(intervalMilliSec: number): void;
    /**
     * ローカルコネクトを開始する・停止する。これは一時的なものでマイコンが再起動したら元の状態に戻る
     *
     * @param {boolean} isOn
     */
    updateLocalConnect(isOn: boolean): void;
    /**
     * 署名リクエストを送ります。
     *
     * @param {Buffer} message
     */
    sign(message: Buffer): void;
    /**
     * 現在のネットワーク情報を送るようにリクエストを送ります。
     */
    getApInfo(): void;
    /**
     * 現在のflash内に保存されている設定を送るようにリクエストを送ります。
     */
    getNetworkSetting(): void;
    /**
     * flash内に設定を保存します。
     *
     */
    setNetworkSetting(params: {
        network: {
            value: string;
        };
    }): void;
    parseFromJson(json: any): void;
    pong(objToSend: any, payload: Uint8Array): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
    sleepSeconds(params: {
        sleep_seconds: number;
    }): void;
    sleepMinute(params: {
        sleep_minute: number;
    }): void;
    sleepIoTrigger(params: {
        sleep_io_trigger: boolean;
    }): void;
    isWSRoomOnlyCommand(func: number): boolean;
    decodeWiFiInfo(payload: Uint8Array): WiFiInfo[];
    _signedNumberFromBinary(data: number[]): number;
}
export {};
