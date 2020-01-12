declare class ENC03R_Module {
    static info(): {
        name: string;
    };
    keys: any;
    required: any;
    Sens: any;
    obniz: any;
    params: any;
    ad0: any;
    ad1: any;
    sens1: any;
    onchange1: any;
    sens2: any;
    onchange2: any;
    constructor();
    wired(obniz: any): void;
    get1Wait(): Promise<unknown>;
    get2Wait(): Promise<unknown>;
}
export default ENC03R_Module;
