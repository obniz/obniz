/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandPlugin extends WSCommandAbstract {
    module: number;
    _CommandSend: number;
    _CommandReceive: number;
    send(params: any, index: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
