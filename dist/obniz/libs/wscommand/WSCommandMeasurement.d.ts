export = WSCommandMeasurement;
declare const WSCommandMeasurement_base: typeof import("./WSCommand.js").default;
declare class WSCommandMeasurement extends WSCommandMeasurement_base {
    _CommandMeasurementEcho: number;
    echo(params: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
