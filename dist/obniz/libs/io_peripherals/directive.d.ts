export = Directive;
declare class Directive {
    constructor(Obniz: any, id: any);
    Obniz: any;
    observers: any[];
    _reset(): void;
    _animationIdentifier: number | undefined;
    addObserver(name: any, resolve: any, reject: any): void;
    animation(name: any, status: any, array: any, repeat: any): void;
    repeatWait(array: any, repeat: any): Promise<any>;
    notified(obj: any): void;
}
