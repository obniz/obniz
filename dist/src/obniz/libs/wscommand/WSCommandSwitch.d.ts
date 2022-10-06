/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommand } from './WSCommand';
export declare class WSCommandSwitch extends WSCommand {
    module: number;
    _CommandNotifyValue: number;
    _CommandOnece: number;
    constructor();
    get(params: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
