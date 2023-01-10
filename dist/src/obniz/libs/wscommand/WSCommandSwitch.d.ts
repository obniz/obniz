/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandSwitch extends WSCommandAbstract {
    module: number;
    _CommandNotifyValue: number;
    _CommandOnece: number;
    get(params: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
