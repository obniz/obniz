declare class MatrixLED_MAX7219 {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    cs: any;
    params: any;
    spi: any;
    obniz: any;
    width: any;
    height: any;
    vram: any;
    constructor();
    wired(obniz: any): void;
    init(width: any, height: any): void;
    initModule(): void;
    test(): void;
    passingCommands(): void;
    brightness(val: any): void;
    preparevram(width: any, height: any): void;
    write(data: any): void;
    writeVram(): void;
    clear(): void;
    draw(ctx: any): void;
}
export default MatrixLED_MAX7219;
