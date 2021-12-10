/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from './WSCommand';
declare class WSCommandAD extends WSCommand {
    module: number;
    _CommandInitNormalInterval: number;
    _CommandDeinit: number;
    _CommandNotifyValue: number;
    _CommandDoOnece: number;
    constructor();
    get(params: any, no: any): void;
    deinit(params: any, no: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
export default WSCommandAD;
