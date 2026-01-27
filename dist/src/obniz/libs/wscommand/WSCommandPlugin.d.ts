/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandPlugin extends WSCommandAbstract {
    module: number;
    _CommandSend: number;
    _CommandReceive: number;
    _CommandFrame: number;
    _CommandExec: number;
    _CommandDirective: number;
    send(params: any, index: any): void;
    exec_lua(json: {
        exec_lua: string;
    }): void;
    reload_lua(json: {
        reload: boolean;
    }): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
