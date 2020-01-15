import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface Puls08M5stickcSOptions {
}
declare class Puls08M5stickcS implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    delimiter: any;
    obniz: Obniz;
    params: any;
    uart: any;
    receivingData: any;
    constructor();
    onbpmupdate(data: any): void;
    onrawupdate(data: any): void;
    wired(obniz: Obniz): void;
    decode(data: any): string;
    init(): void;
}
export default Puls08M5stickcS;
