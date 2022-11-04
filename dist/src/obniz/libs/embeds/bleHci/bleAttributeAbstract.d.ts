/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import EventEmitter from 'eventemitter3';
import { BleDeviceAddress, UUID } from './bleTypes';
export declare type BleAttributeParentName = 'peripheral' | 'service' | 'characteristic';
export declare type BleAttributeChildrenName = 'service' | 'characteristics' | 'descriptors';
export declare abstract class BleAttributeAbstract<ParentClass, ChildrenClass> {
    /**
     * @ignore
     */
    get childrenClass(): any;
    /**
     * @ignore
     */
    get childrenName(): BleAttributeChildrenName | null;
    /**
     * @ignore
     */
    get parentName(): BleAttributeParentName | null;
    /**
     * It is uuid as string.
     *
     * ```javascript
     * console.log(attr.uuid); // => '4C84'
     * ```
     */
    uuid: UUID;
    /**
     * @ignore
     */
    onwrite?: (result: any) => void;
    /**
     * @ignore
     */
    onread?: (data: any) => void;
    /**
     * @ignore
     */
    onwritefromremote?: (address: BleDeviceAddress, data: number[]) => void;
    /**
     * @ignore
     */
    onreadfromremote?: (address: BleDeviceAddress) => void;
    /**
     * @ignore
     */
    discoverdOnRemote: boolean;
    /**
     * @ignore
     */
    parent: ParentClass | null;
    protected children: ChildrenClass[];
    protected isRemote: boolean;
    protected data: any;
    protected emitter: EventEmitter;
    protected constructor(params: any);
    /**
     * @ignore
     * @param child
     */
    addChild(child: {
        uuid: UUID;
    } | ChildrenClass): ChildrenClass;
    /**
     * @ignore
     * @param uuid
     */
    getChild(uuid: UUID): ChildrenClass | null;
    /**
     * @ignore
     */
    toJSON(): any;
    /**
     * WS COMMANDS
     */
    /**
     * @ignore
     */
    abstract readWait(): Promise<number[]>;
    /**
     * @ignore
     */
    readTextWait(): Promise<string | null>;
    /**
     * @ignore
     */
    readNumberWait(): Promise<number | null>;
    /**
     * @ignore
     */
    abstract writeWait(data: number[], needResponse?: boolean): Promise<boolean>;
    /**
     * Use writeTextWait() instead from 3.5.0
     *
     * @ignore
     * @deprecated
     */
    writeText(str: string, needResponse?: boolean): void;
    /**
     * @ignore
     */
    writeTextWait(str: string, needResponse?: boolean): Promise<boolean>;
    /**
     * Use writeNumberWait() instead from 3.5.0
     *
     * @ignore
     * @deprecated
     */
    writeNumber(val: number, needResponse?: boolean): void;
    /**
     * @ignore
     */
    writeNumberWait(val: number, needResponse?: boolean): Promise<boolean>;
    /**
     * @ignore
     */
    readFromRemoteWait(): Promise<void>;
    /**
     * @ignore
     */
    writeFromRemoteWait(): Promise<number[]>;
    /**
     * @ignore
     * @param err
     */
    onerror(err: any): void;
    /**
     * @ignore
     * @param notifyName
     * @param params
     */
    notifyFromServer(notifyName: any, params: any): void;
    /**
     * @ignore
     * @private
     */
    _runUserCreatedFunction(func?: (..._args: any) => any, ...args: any[]): void;
    protected setFunctions(): void;
}
