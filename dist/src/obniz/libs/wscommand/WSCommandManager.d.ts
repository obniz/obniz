/**
 * @packageDocumentation
 * @ignore
 */
import { HW, WSCommandAbstract } from './WSCommandAbstract';
declare type WSCommandConstructor = new () => WSCommandAbstract;
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
export declare class WSCommandManager {
    private commandClasses;
    private commands;
    static get schema(): any;
    addCommandClass(name: string, classObj: WSCommandConstructor): void;
    createCommandInstances(): void;
    getCommandInstance(name: string): WSCommandAbstract;
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
    binary2Json(data: Uint8Array): {}[];
    setHw(obj: HW): void;
}
export {};
