import WSCommand from './WSCommand';
export default class WSCommandDirective extends WSCommand {
    availableCommands: any[];
    module: number;
    protected _CommandRegistrate: number;
    protected _CommandPause: number;
    protected _CommandResume: number;
    protected _CommandNotify: number;
    constructor();
    init(params: any, originalParams: any): void;
    changeState(params: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
