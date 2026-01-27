/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandSystem extends WSCommandAbstract {
    module: number;
    _CommandReboot: number;
    _CommandReset: number;
    _CommandSelfCheck: number;
    _CommandWait: number;
    _CommandResetOnDisconnect: number;
    _CommandPingPong: number;
    _CommandVCC: number;
    _CommandSleepSeconds: number;
    _CommandSleepMinute: number;
    _CommandSleepIoTrigger: number;
    _CommandUpdatePingCheckInterval: number;
    _CommandNotifyTimeStamp: number;
    _CommandSetQueueMode: number;
    _CommandSetClock: number;
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
     * デバイスのpingの間隔を更新します。これはクラウドから一度切り離されると再度もとに戻ります。
     *
     * @param {number} intervalMilliSec
     */
    updatePingCheckInterval(intervalMilliSec: number): void;
    parseFromJson(json: any): void;
    pong(objToSend: any, payload: Uint8Array): void;
    timestamp(objToSend: any, payload: Uint8Array): void;
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
    setQueueMode(params: {
        queue_mode: {
            interval: number;
            timestamp: string;
        };
    }): void;
    setClock(params: {
        clock: number;
    }): void;
}
