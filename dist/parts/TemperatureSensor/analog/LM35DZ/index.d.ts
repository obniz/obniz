export = LM35DZ;
declare class LM35DZ {
    static info(): {
        name: string;
    };
    calc(voltage: any): number;
}
