import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface Grove_ButtonOptions {
}
declare class Grove_Button implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
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
    stateWait(isPressed: any): Promise<{}>;
}
export default Grove_Button;
