import Obniz from "../../index";
declare class Directive {
    Obniz: Obniz;
    observers: any;
    _animationIdentifier: any;
    constructor(obniz: Obniz, id: number);
    _reset(): void;
    addObserver(name: any, resolve: any, reject: any): void;
    animation(name: any, status: any, array?: any, repeat?: any): void;
    repeatWait(array: any, repeat: any): Promise<unknown>;
    notified(obj: any): void;
}
export default Directive;
