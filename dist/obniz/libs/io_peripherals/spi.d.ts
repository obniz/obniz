export = PeripheralSPI;
declare class PeripheralSPI {
    constructor(Obniz: any, id: any);
    Obniz: any;
    id: any;
    _reset(): void;
    observers: any[] | undefined;
    used: boolean | undefined;
    addObserver(callback: any): void;
    start(params: any): void;
    params: any;
    writeWait(data: any): Promise<any>;
    write(data: any): void;
    notified(obj: any): void;
    isUsed(): boolean | undefined;
    end(reuse: any): void;
}
