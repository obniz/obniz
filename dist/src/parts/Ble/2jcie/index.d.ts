import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface OMRON_2JCIEOptions {
}
declare class OMRON_2JCIE implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    periperal: any;
    obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
    findWait(): Promise<any>;
    omron_uuid(uuid: any): string;
    connectWait(): Promise<void>;
    disconnectWait(): Promise<void>;
    signedNumberFromBinary(data: any): any;
    unsignedNumberFromBinary(data: any): any;
    getLatestData(): Promise<any>;
}
export default OMRON_2JCIE;
