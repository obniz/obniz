/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import Obniz from "../../index";
export declare type DirectiveStatuse = "loop" | "registrate" | "pause" | "resume";
export default class Directive {
    Obniz: Obniz;
    observers: any[];
    _animationIdentifier: number;
    constructor(obniz: Obniz, id: number);
    _reset(): void;
    addObserver(name: string, resolve: any, reject: any): void;
    animation(name: string, status: DirectiveStatuse, array?: any[], repeat?: number): void;
    repeatWait(array: any[], repeat: number): Promise<unknown>;
    notified(obj: {
        [key: string]: any;
    }): void;
}
