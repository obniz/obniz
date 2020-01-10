declare class Tcp {
    Obniz: any;
    id: any;
    connectObservers: any;
    readObservers: any;
    used: any;
    onconnection: any;
    onreceive: any;
    onerror: any;
    constructor(Obniz: any, id: any);
    _reset(): void;
    _addConnectObserver(callback: any): void;
    _addReadObserver(callback: any): void;
    connectWait(port: any, domain: any): Promise<{}>;
    close(): void;
    write(data: any): void;
    readWait(): Promise<{}>;
    end(): void;
    notified(obj: any): void;
    isUsed(): any;
}
export default Tcp;
