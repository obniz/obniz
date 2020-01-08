export = WSCommandSystem;
declare const WSCommandSystem_base: typeof import("./WSCommand.js").default;
declare class WSCommandSystem extends WSCommandSystem_base {
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
    reboot(params: any): void;
    reset(params: any): void;
    selfCheck(params: any): void;
    wait(params: any): void;
    keepWorkingAtOffline(params: any): void;
    ping(params: any): void;
    resetOnDisconnect(mustReset: any): void;
    parseFromJson(json: any): void;
    pong(objToSend: any, payload: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
    sleepSeconds(params: any): void;
    sleepMinute(params: any): void;
    sleepIoTrigger(params: any): void;
}
