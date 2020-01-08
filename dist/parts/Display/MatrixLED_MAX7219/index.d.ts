export = MatrixLED_MAX7219;
declare class MatrixLED_MAX7219 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    cs: any;
    spi: any;
    init(width: any, height: any): void;
    width: any;
    height: any;
    initModule(): void;
    test(): void;
    passingCommands(): void;
    brightness(val: any): void;
    preparevram(width: any, height: any): void;
    vram: any[] | undefined;
    write(data: any): void;
    writeVram(): void;
    clear(): void;
    draw(ctx: any): void;
}
