/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandMotion extends WSCommandAbstract {
    module: number;
    _CommandInit: number;
    _CommandDeinit: number;
    _CommandNotifyRawTemp: number;
    _CommandNotifyRawAcc: number;
    _CommandNotifyRecognition: number;
    init(params: any): void;
    deinit(params: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
