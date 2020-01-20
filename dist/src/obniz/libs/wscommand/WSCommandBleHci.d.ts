declare class WSCommandBleHci {
    _delegate: any;
    _CommandHCIInit: any;
    _CommandHCIDeinit: any;
    _CommandHCISend: any;
    _CommandHCIRecv: any;
    constructor(delegate: any);
    schemaData(): {
        uri: string;
        onValid: (params: any, module?: any) => void;
    }[];
    notifyFunctionList(): any;
    send(params: any, module?: any): void;
    recv(objToSend: any, payload?: any): void;
}
export default WSCommandBleHci;
