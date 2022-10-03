/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from './WSCommand';
declare class WSCommandSPI extends WSCommand {
    module: number;
    _CommandInit: number;
    _CommandDeinit: number;
    _CommandWriteRead: number;
    _CommandWrite: number;
    ioNotUsed: any;
    constructor();
    initMaster(params: any, module: any): void;
    deinit(params: any, module: any): void;
    write(params: any, module: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
export default WSCommandSPI;
