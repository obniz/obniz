export = Display;
declare class Display {
    constructor(Obniz: any);
    Obniz: any;
    width: number;
    height: number;
    _canvas: any;
    _reset(): void;
    _pos: {
        x: number;
        y: number;
    } | undefined;
    autoFlush: boolean | undefined;
    warnCanvasAvailability(): void;
    _preparedCanvas(): any;
    fontSize: any;
    _ctx(): any;
    font(font: any, size: any): void;
    clear(): void;
    pos(x: any, y: any): {
        x: number;
        y: number;
    } | undefined;
    print(text: any): void;
    line(x_0: any, y_0: any, x_1: any, y_1: any): void;
    rect(x: any, y: any, width: any, height: any, mustFill: any): void;
    circle(x: any, y: any, r: any, mustFill: any): void;
    qr(text: any, correction: any): void;
    raw(data: any): void;
    setPinName(io: any, moduleName: any, funcName: any): void;
    setPinNames(moduleName: any, data: any): void;
    _draw(ctx: any): void;
    draw(ctx: any): void;
    drawing(autoFlush: any): void;
}
