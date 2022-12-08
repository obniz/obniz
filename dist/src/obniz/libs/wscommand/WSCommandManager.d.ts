/**
 * @packageDocumentation
 * @ignore
 */
import { HW, WSCommandAbstract } from './WSCommandAbstract';
import { StrictEventEmitter } from 'strict-event-emitter';
declare type WSCommandConstructor = new () => WSCommandAbstract;
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
export declare class WSCommandManager {
    private moduleNo2Name;
    private commandClasses;
    private commands;
    events: StrictEventEmitter<WSCommandManagerEventsMap>;
    static get schema(): any;
    addCommandClass(name: string, classObj: WSCommandConstructor): void;
    createCommandInstances(): void;
    getCommandInstance(name: string): WSCommandAbstract;
    getCommandInstanceByModule(module: number): WSCommandAbstract;
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
