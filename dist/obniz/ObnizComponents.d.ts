export = ObnizComponents;
declare class ObnizComponents {
    constructor(id: any, options: any);
    pongObservers: any[];
    _allComponentKeys: any[];
    close(): void;
    _callOnConnect(): void;
    _prepareComponents(): void;
    _resetComponents(): void;
    notifyToModule(obj: any): void;
    handleSystemCommand(wsObj: any): void;
    addPongObserver(callback: any): void;
    removePongObserver(callback: any): void;
    isValidIO(io: any): boolean;
    setVccGnd(vcc: any, gnd: any, drive: any): void;
    getIO(io: any): any;
    getAD(io: any): any;
    _getFreePeripheralUnit(peripheral: any): any;
    getFreePwm(): any;
    getFreeI2C(): any;
    getI2CWithConfig(config: any): any;
    getFreeSpi(): any;
    getSpiWithConfig(config: any): any;
    getFreeUart(): any;
    getFreeTcp(): any;
}
