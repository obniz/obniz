import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface Grove_ButtonOptions {
}
declare class Grove_Button implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    onChangeForStateWait: any;
    io_signal: any;
    params: any;
    io_vcc: any;
    io_supply: any;
    isPressed: any;
    onchange: any;
    constructor();
    wired(obniz: Obniz): void;
    isPressedWait(): Promise<any>;
    stateWait(isPressed: any): Promise<unknown>;
}
export default Grove_Button;
