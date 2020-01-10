declare class Puls08M5stickcS {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    delimiter: any;
    obniz: any;
    params: any;
    uart: any;
    receivingData: any;
    constructor();
    onbpmupdate(data: any): void;
    onrawupdate(data: any): void;
    wired(obniz: any): void;
    decode(data: any): string;
    init(): void;
}
export default Puls08M5stickcS;
