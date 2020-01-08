export = Obniz;
declare const Obniz_base: any;
declare class Obniz extends Obniz_base {
    [x: string]: any;
    /**
     *
     * @returns {ObnizApi}
     */
    static get api(): ObnizApi;
    constructor(id: any, options: any);
    util: any;
    repeat(callback: any, interval: any): void;
    looper: any;
    repeatInterval: any;
    loop(): Promise<void>;
    _callOnConnect(): void;
    message(target: any, message: any): void;
    notifyToModule(obj: any): void;
    warning(msg: any): void;
    error(msg: any): void;
}
