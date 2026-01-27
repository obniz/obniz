import { WSCommandAbstract } from './WSCommandAbstract';
import { WSCommandIO } from './WSCommandIO';
import { WSCommandPWM } from './WSCommandPWM';
import { WSCommandManager } from './WSCommandManager';
export declare class WSCommandDirective extends WSCommandAbstract {
    module: number;
    _CommandRegistrate: number;
    _CommandPause: number;
    _CommandResume: number;
    _CommandNotify: number;
    subCommandManager: WSCommandManager<{
        WSCommandIO: WSCommandIO;
        WSCommandPWM: WSCommandPWM;
    }>;
    constructor();
    init(params: any, originalParams: any): void;
    changeState(params: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
