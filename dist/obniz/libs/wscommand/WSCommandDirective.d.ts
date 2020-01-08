export = WSCommandDirective;
declare const WSCommandDirective_base: typeof import("./WSCommand.js").default;
declare class WSCommandDirective extends WSCommandDirective_base {
    _CommandRegistrate: number;
    _CommandPause: number;
    _CommandResume: number;
    _CommandNotify: number;
    availableCommands: any[];
    init(params: any, originalParams: any): void;
    changeState(params: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
