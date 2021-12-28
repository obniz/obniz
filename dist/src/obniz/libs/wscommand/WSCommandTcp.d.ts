/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from './WSCommand';
declare class WSCommandTcp extends WSCommand {
    module: number;
    _MaxPort: number;
    _CommandConnect: number;
    _CommandClose: number;
    _CommandConnection: number;
    _CommandWrite: number;
    _CommandRead: number;
    constructor();
    connect(params: any, index: any): void;
    disconnect(params: any, index: any): void;
    write(params: any, index: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
export default WSCommandTcp;
