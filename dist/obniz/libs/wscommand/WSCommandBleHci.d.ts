export = WSCommandBleHci;
declare class WSCommandBleHci {
    constructor(delegate: any);
    _delegate: any;
    _CommandHCIInit: number;
    _CommandHCIDeinit: number;
    _CommandHCISend: number;
    _CommandHCIRecv: number;
    schemaData(): {
        uri: string;
        onValid: (params: any, module: any) => void;
    }[];
    notifyFunctionList(): {};
    send(params: any, module: any): void;
    recv(objToSend: any, payload: any): void;
}
