/**
 * @packageDocumentation
 * @module Parts.RN42
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface RN42Options {
    tx: number;
    rx: number;
    gnd?: number;
}
export declare type RN42Config_Mode = 'slave' | 'master' | 'trigger' | 'auto-connect-master' | 'auto-connect-dtr' | 'auto-connect-any' | 'pairing';
export declare type RN42Config_Profile = 'SPP' | 'DUN-DCE' | 'DUN-DTE' | 'MDM-SPP' | 'SPP-DUN-DCE' | 'APL' | 'HID';
export declare type RN42Config_Auth = 'open' | 'ssp-keyboard' | 'just-work' | 'pincode';
export declare type RN43Config_Power = 16 | 12 | 8 | 4 | 0 | -4 | -8;
export interface RN42Config {
    display_name?: string;
    master_slave?: RN42Config_Mode;
    profile?: RN42Config_Profile;
    auth?: RN42Config_Auth;
    power?: RN43Config_Power;
    hid_flag?: any;
}
export default class RN42 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    onreceive?: (data: any, text: string) => void;
    protected obniz: Obniz;
    private uart;
    constructor();
    wired(obniz: Obniz): void;
    send(data: any): void;
    sendCommand(data: any): void;
    enterCommandMode(): void;
    config(json: RN42Config): void;
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
