declare class IRModule {
    get dataSymbolLength(): any;
    set dataSymbolLength(x: any);
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    obniz: any;
    params: any;
    sensor: any;
    led: any;
    constructor();
    wired(obniz: any): void;
    send(arr: any): void;
    start(callback: any): void;
    setGetterSetter(partsName: any, varName: any): void;
}
export default IRModule;
