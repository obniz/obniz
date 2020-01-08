export = IRModule;
declare class IRModule {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    obniz: any;
    sensor: any;
    led: any;
    send(arr: any): void;
    start(callback: any): void;
    set dataSymbolLength(arg: any);
    get dataSymbolLength(): any;
    setGetterSetter(partsName: any, varName: any): void;
}
