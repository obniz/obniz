/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandPlugin extends WSCommandAbstract {
    module: number;
    _CommandReceive: number;
    _CommandSend: number;
    constructor();
    send(params: any, index: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
