export = SharpMemoryTFT;
declare class SharpMemoryTFT {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    commands: {};
    _canvas: any;
    wired(obniz: any): void;
    obniz: any;
    io_cs: any;
    io_disp: any;
    io_extcomin: any;
    io_extmode: any;
    spi: any;
    width: any;
    height: any;
    _reverseBits(data: any): number;
    sendLSB(data: any): void;
    sendClear(): void;
    raw(rawData: any): void;
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
    _draw(ctx: any): void;
    draw(ctx: any): void;
    drawing(autoFlush: any): void;
}
