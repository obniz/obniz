import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandWiFi extends WSCommandAbstract {
    module: number;
    _CommandScan: number;
    scan(params: any, index: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
