export = SNx4HC595;
declare class SNx4HC595 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    autoFlash: any;
    wired(obniz: any): void;
    obniz: any;
    io_ser: any;
    io_srclk: any;
    io_rclk: any;
    io_srclr: any;
    io_oe: any;
    ioNum(num: any): void;
    _io_num: any;
    io: any[] | undefined;
    isValidIO(io: any): boolean;
    getIO(io: any): any;
    output(id: any, value: any): void;
    onece(operation: any): void;
    setEnable(enable: any): void;
    flush(): void;
}
