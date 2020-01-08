export = ObnizSystemMethods;
declare const ObnizSystemMethods_base: any;
declare class ObnizSystemMethods extends ObnizSystemMethods_base {
    [x: string]: any;
    constructor(id: any, options: any);
    wait(msec: any): Promise<any>;
    reset(): void;
    reboot(): void;
    selfCheck(): void;
    keepWorkingAtOffline(working: any): void;
    resetOnDisconnect(reset: any): void;
    sleepSeconds(sec: any): void;
    sleepMinute(minute: any): void;
    sleep(date: any): void;
    sleepIoTrigger(trigger: any): void;
    pingWait(unixtime: any, rand: any, forceGlobalNetwork: any): Promise<any>;
}
