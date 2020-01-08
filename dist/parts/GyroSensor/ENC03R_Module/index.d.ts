export = ENC03R_Module;
declare class ENC03R_Module {
    static info(): {
        name: string;
    };
    keys: string[];
    required: string[];
    Sens: number;
    wired(obniz: any): void;
    obniz: any;
    ad0: any;
    ad1: any;
    sens1: number | undefined;
    sens2: number | undefined;
    get1Wait(): Promise<any>;
    get2Wait(): Promise<any>;
}
