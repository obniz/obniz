/**
 * @packageDocumentation
 * @ignore
 */
/// <reference types="tv4" />
import WSSchema from './WSSchema';
export interface HW {
    /**
     * hardware identifer. "esp32w"
     */
    hw: string | undefined;
    /**
     * version code of obnizOS. "3.1.0"
     */
    firmware: string | undefined;
}
export declare abstract class WSCommandAbstract {
    get WSCommandNotFoundError(): any;
    _hw: HW;
    ioNotUsed: number;
    COMMAND_FUNC_ID_ERROR: number;
    abstract module: number;
    parsed?: (module: number, func: number, payload: Uint8Array | null) => void;
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
