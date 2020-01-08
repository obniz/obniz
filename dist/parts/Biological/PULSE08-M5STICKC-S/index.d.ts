export = Puls08M5stickcS;
declare class Puls08M5stickcS {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    delimiter: number;
    onbpmupdate(data: any): void;
    onrawupdate(data: any): void;
    wired(obniz: any): void;
    obniz: any;
    uart: any;
    receivingData: any[] | undefined;
    decode(data: any): string;
    init(): void;
}
