/**
 * @packageDocumentation
 * @module ObnizCore
 */
import ObnizComponents from "./ObnizComponents";
export default class ObnizSystemMethods extends ObnizComponents {
    constructor(id: any, options?: any);
    wait(msec: any): Promise<unknown>;
    reset(): void;
    reboot(): void;
    selfCheck(): void;
    keepWorkingAtOffline(working: any): void;
    resetOnDisconnect(reset: any): void;
    sleepSeconds(sec: any): void;
    sleepMinute(minute: any): void;
    sleep(date: any): void;
    sleepIoTrigger(trigger: any): void;
    pingWait(unixtime?: any, rand?: any, forceGlobalNetwork?: any): Promise<unknown>;
}
