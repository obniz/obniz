export = LM60;
declare class LM60 {
    static info(): {
        name: string;
    };
    calc(voltage: any): number;
}
