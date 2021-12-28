/**
 * @packageDocumentation
 * @ignore
 */
/// <reference types="tv4" />
import WSSchema from './WSSchema';
declare type WSCommandConstructor = new () => WSCommand;
interface PayloadChunk {
    /**
     * module number
     */
    module: number;
    /**
     * function index number
     */
    func: number;
    /**
     * payload for wscommand
     */
    payload: Uint8Array;
    /**
     * left binary array
     */
    next: Uint8Array;
}
interface HW {
    /**
     * hardware identifer. "esp32w"
     */
    hw: string | undefined;
    /**
     * version code of obnizOS. "3.1.0"
     */
    firmware: string | undefined;
}
export default abstract class WSCommand {
    static get schema(): any;
    static get CommandClasses(): {
        [key: string]: WSCommandConstructor;
    };
    get WSCommandNotFoundError(): any;
    static addCommandClass(name: string, classObj: WSCommandConstructor): void;
    static framed(module: number, func: number, payload: Uint8Array | null): Uint8Array;
    /**
     * Dequeue a next wscommands from binary array.
     *
     * @param buf binary array received from obniz cloud.
     * @returns chunk
     */
    static dequeueOne(buf: Uint8Array): PayloadChunk | null;
    static compress(wscommands: any, json: any): Uint8Array | null;
    _hw: HW;
    ioNotUsed: number;
    COMMAND_FUNC_ID_ERROR: number;
    abstract module: number;
    private parsed?;
    constructor();
    setHw(obj: HW): void;
    sendCommand(func: number, payload: Uint8Array | null): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: {
        [key: string]: any;
    }, func: number, payload: Uint8Array): void;
    envelopWarning(objToSend: {
        [key: string]: any;
    }, module_key: any, obj: any): void;
    envelopError(objToSend: {
        [key: string]: any;
    }, module_key: any, obj: any): void;
    isValidIO(io: number): boolean;
    getSchema(uri: any): any;
    validateCommandSchema(uriList: any, json: any, rootPath: any, customArg?: any): any;
    validate(commandUri: any, json: any): WSSchema.MultiResult;
    fastValidate(commandUri: any, json: any): boolean;
    onlyTypeErrorMessage(validateError: any, rootPath: any): string | boolean;
    filter(commandUri: any, json: any): any;
    _filterSchema(schema: any, json: any): any;
}
export {};
