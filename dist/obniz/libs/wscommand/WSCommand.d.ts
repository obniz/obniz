/// <reference types="tv4" />
/// <reference types="node" />
import WSSchema from "./WSSchema";
export default abstract class WSCommand {
    static get schema(): WSSchema.TV4;
    static get CommandClasses(): any;
    get WSCommandNotFoundError(): typeof WSCommandNotFoundError;
    static addCommandClass(name: string, classObj: any): void;
    static framed(module: number, func: number, payload: Uint8Array): Uint8Array;
    static dequeueOne(buf: Buffer): {
        module: number;
        func: number;
        payload: Buffer;
        next: Buffer;
    } | null;
    static compress(wscommands: WSCommand[], json: object): Uint8Array | null;
    protected abstract module: number;
    private parsed?;
    private ioNotUsed;
    private COMMAND_FUNC_ID_ERROR;
    private _hw;
    constructor();
    setHw(obj: object): void;
    sendCommand(func: number, payload: Uint8Array): void;
    parseFromJson(json: object): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
    envelopWarning(objToSend: any, module_key: string, obj: any): void;
    envelopError(objToSend: any, module_key: string, obj: any): void;
    isValidIO(io: any): boolean;
    getSchema(uri: string): WSSchema.JsonSchema;
    validateCommandSchema(uriList: any[], json: any, rootPath: string, customArg: any[]): any;
    validate(commandUri: string, json: any): WSSchema.MultiResult;
    onlyTypeErrorMessage(validateError: WSSchema.MultiResult, rootPath: string): string | boolean;
    filter(commandUri: string, json: any): any;
    _filterSchema(schema: any, json: any): any;
}
declare class WSCommandNotFoundError extends Error {
}
export {};
