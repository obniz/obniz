import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface SNx4HC595Options {
}
declare class SNx4HC595 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    autoFlash: any;
    obniz: Obniz;
    io_ser: any;
    params: any;
    io_srclk: any;
    io_rclk: any;
    io_srclr: any;
    io_oe: any;
    chip: any;
    id: any;
    value: any;
    _io_num: any;
    io: any;
    constructor();
    wired(obniz: Obniz): void;
    ioNum(num: any): void;
    isValidIO(io: any): boolean;
    getIO(io: any): any;
    output(id: any, value: any): void;
    onece(operation: any): void;
    setEnable(enable: any): void;
    flush(): void;
}
export default SNx4HC595;
