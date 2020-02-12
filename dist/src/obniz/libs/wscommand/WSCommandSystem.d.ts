/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";
declare class WSCommandSystem extends WSCommand {
    module: any;
    _CommandReboot: any;
    _CommandReset: any;
    _CommandSelfCheck: any;
    _CommandWait: any;
    _CommandResetOnDisconnect: any;
    _CommandPingPong: any;
    _CommandVCC: any;
    _CommandSleepSeconds: any;
    _CommandSleepMinute: any;
    _CommandSleepIoTrigger: any;
    sendCommand: any;
    validateCommandSchema: any;
    WSCommandNotFoundError: any;
    envelopWarning: any;
    constructor();
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
export default WSCommandSystem;
