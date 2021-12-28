/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from './WSCommand';
declare class WSCommandPlugin extends WSCommand {
    module: number;
    _CommandReceive: number;
    _CommandSend: number;
    constructor();
    send(params: any, index: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
export default WSCommandPlugin;
