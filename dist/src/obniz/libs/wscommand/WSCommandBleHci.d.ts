/**
 * @packageDocumentation
 * @ignore
 */
export declare class WSCommandBleHci {
    _delegate: any;
    _CommandHCIInit: number;
    _CommandHCIDeinit: number;
    _CommandHCISend: number;
    _CommandHCIRecv: number;
    _CommandHCIAdvertisementFilter: number;
    constructor(delegate: any);
    schemaData(): {
        uri: string;
        onValid: (params: any, module?: any) => void;
    }[];
    notifyFunctionList(): any;
    init(params: any, module?: any): void;
    deinit(params: any, module?: any): void;
    send(params: any, module?: any): void;
    recv(objToSend: any, payload?: any): void;
    advertisementFilter(params: any): void;
}
