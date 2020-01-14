import Obniz from "../../index";
declare class Display {
    Obniz: Obniz;
    width: number;
    height: number;
    autoFlush: boolean;
    fontSize: number;
    createCanvas: any;
    private _canvas?;
    private _pos;
    constructor(obniz: any);
    _reset(): void;
    warnCanvasAvailability(): void;
    _preparedCanvas(): HTMLCanvasElement | null | undefined;
    _ctx(): any;
    font(font: any, size: any): void;
    clear(): void;
    pos(x: any, y: any): {
        x: number;
        y: number;
    };
    print(text: string): void;
    line(x_0: number, y_0: number, x_1: number, y_1: number): void;
    rect(x: number, y: number, width: number, height: number, mustFill: boolean): void;
    circle(x: number, y: number, r: number, mustFill: boolean): void;
    qr(text: string, correction: "L" | "M" | "Q" | "H"): void;
    raw(data: any): void;
    setPinName(io: number, moduleName: string, funcName: string): void;
    setPinNames(moduleName: string, data: any): void;
    _draw(ctx: CanvasRenderingContext2D): void;
    draw(ctx: CanvasRenderingContext2D): void;
    drawing(autoFlush: any): void;
}
export default Display;
