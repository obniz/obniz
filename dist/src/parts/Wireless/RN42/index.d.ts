import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface RN42Options {
}
declare class RN42 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    uart: any;
    obniz: Obniz;
    onreceive: any;
    constructor();
    wired(obniz: Obniz): void;
    send(data: any): void;
    sendCommand(data: any): void;
    enterCommandMode(): void;
    config(json: any): void;
    config_reboot(): void;
    config_masterslave(mode: any): void;
    config_displayName(name: any): void;
    config_HIDflag(flag: any): void;
    config_profile(mode: any): void;
    config_revert_localecho(): void;
    config_auth(mode: any): void;
    config_power(dbm: any): void;
    config_get_setting(): void;
    config_get_extendSetting(): void;
}
export default RN42;
