export = Tcp;
declare class Tcp {
    constructor(Obniz: any, id: any);
    Obniz: any;
    id: any;
    _reset(): void;
    connectObservers: any[] | undefined;
    readObservers: any[] | undefined;
    used: boolean | undefined;
    _addConnectObserver(callback: any): void;
    _addReadObserver(callback: any): void;
    connectWait(port: any, domain: any): Promise<any>;
    close(): void;
    write(data: any): void;
    readWait(): Promise<any>;
    end(): void;
    notified(obj: any): void;
    isUsed(): boolean | undefined;
}
