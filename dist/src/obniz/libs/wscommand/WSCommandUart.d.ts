/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from './WSCommand';
declare class WSCommandUart extends WSCommand {
    module: number;
    _CommandInit: number;
    _CommandDeinit: number;
    _CommandSend: number;
    _CommandRecv: number;
    constructor();
    init(params: any, module: any): void;
    deinit(params: any, module: any): void;
    send(params: any, module: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
export default WSCommandUart;
