import { WSCommand } from './WSCommand';
export declare class WSCommandWiFi extends WSCommand {
    module: number;
    _CommandScan: number;
    constructor();
    scan(params: any, index: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
