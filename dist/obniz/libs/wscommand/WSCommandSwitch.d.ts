export = WSCommandSwitch;
declare const WSCommandSwitch_base: typeof import("./WSCommand.js").default;
declare class WSCommandSwitch extends WSCommandSwitch_base {
    _CommandNotifyValue: number;
    _CommandOnece: number;
    get(params: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
