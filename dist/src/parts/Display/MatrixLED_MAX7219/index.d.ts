import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface MatrixLED_MAX7219Options {
}
declare class MatrixLED_MAX7219 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    cs: any;
    params: any;
    spi: any;
    obniz: Obniz;
    width: any;
    height: any;
    vram: any;
    constructor();
    wired(obniz: Obniz): void;
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
