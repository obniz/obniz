/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from './WSCommand';
declare class WSCommandSystem extends WSCommand {
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
}
export default WSCommandSystem;
