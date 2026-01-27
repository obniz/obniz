/**
 * @packageDocumentation
 * @ignore
 */
import { HW, WSCommandAbstract } from './WSCommandAbstract';
import { StrictEventEmitter } from 'strict-event-emitter';
export declare type WSCommandConstructor = new () => WSCommandAbstract;
interface Payload {
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
     * raw data
     */
    raw: Uint8Array;
}
interface PayloadChunk extends Payload {
    /**
     * left binary array
     */
    next: Uint8Array;
}
interface WSCommandManagerEventsMap {
    binaryGenerated: (module: number, func: number, binary: Uint8Array | null) => void;
}
export declare class WSCommandManager<C extends Record<string, WSCommandAbstract>> {
    private moduleNo2Name;
    private commandClasses;
    private commands;
    events: StrictEventEmitter<WSCommandManagerEventsMap>;
    static get schema(): any;
    constructor(commandClasses: {
        [K in keyof C]: new () => C[K];
    });
    private createCommandInstances;
    getCommandInstance<Name extends Extract<keyof C, string>>(name: Name): C[Name];
    getCommandInstanceByModule(module: number): C[string];
    framed(module: number, func: number, payload: Uint8Array | null): Uint8Array;
    /**
     * Dequeue a next wscommands from binary array.
     *
     * @param buf binary array received from obniz cloud.
     * @returns chunk
     */
    dequeueOne(buf: Uint8Array): PayloadChunk | null;
    /**
     * json to binary
     *
     * @param json
     */
    compress(json: any): Uint8Array | null;
    binary2frame(data: Uint8Array): Payload[];
    frame2json(frame: Payload): {};
    binary2Json(data: Uint8Array): {}[];
    setHw(obj: HW): void;
}
export {};
