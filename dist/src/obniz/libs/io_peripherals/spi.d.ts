declare class PeripheralSPI {
    Obniz: any;
    id: any;
    observers: any;
    used: any;
    params: any;
    constructor(Obniz: any, id: any);
    _reset(): void;
    addObserver(callback: any): void;
    start(params: any): void;
    writeWait(data: any): Promise<unknown>;
    write(data: any): void;
    notified(obj: any): void;
    isUsed(): any;
    end(reuse: any): void;
}
export default PeripheralSPI;
