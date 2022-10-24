/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
/// <reference types="tv4" />
import EventEmitter from 'eventemitter3';
import Obniz from '../index';
import { ObnizErrorStatic } from '../ObnizError';
import WSSchema from './wscommand/WSSchema';
export declare type EventHandler = (...args: any) => any;
export interface ReceiveJsonOptions {
    /**
     * Indicate timeout in milliseconds.
     * If not appliced, default timeout will be applied.
     */
    timeout?: number;
    /**
     * Indicate sequencial operation or not
     */
    queue?: boolean;
    errors?: {
        [schema: string]: ObnizErrorStatic;
    };
}
export declare abstract class ComponentAbstract<EventTypes extends string = string> extends EventEmitter<EventTypes> {
    /**
     * obniz to be used
     */
    Obniz: Obniz;
    /**
     * Rsponse waiting timeout in milliseconds
     */
    timeout: number;
    protected _eventHandlerQueue: {
        [key: string]: EventHandler[];
    };
    constructor(obniz: Obniz);
    notifyFromObniz(json: any): void;
    validate(commandUri: any, json: any): WSSchema.MultiResult;
    fastValidate(commandUri: any, json: any): boolean;
    abstract schemaBasePath(): string | null;
    protected abstract _reset(): void;
    protected onceQueue(eventName: string, func: EventHandler): void;
    protected removeFromOnceQueue(eventName: string, func: EventHandler): void;
    protected sendAndReceiveJsonWait(sendObj: any, schemaPath: string, option?: ReceiveJsonOptions): Promise<any>;
    protected receiveJsonWait(schemaPath: string, option?: ReceiveJsonOptions): Promise<any>;
}
