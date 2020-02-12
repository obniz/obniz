import WSCommand from "./WSCommand";
export default class WSCommandDirective extends WSCommand {
    availableCommands: any;
    protected module: number;
    protected _CommandRegistrate: number;
    protected _CommandPause: number;
    protected _CommandResume: number;
    protected _CommandNotify: number;
    constructor();
    init(params: any, originalParams: any): void;
    changeState(params: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
