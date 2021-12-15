/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from './WSCommand';
declare class WSCommandLogicAnalyzer extends WSCommand {
    module: number;
    _CommandInit: number;
    _CommandDeinit: number;
    _CommandRecv: number;
    constructor();
    init(params: any): void;
    deinit(params: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
export default WSCommandLogicAnalyzer;
