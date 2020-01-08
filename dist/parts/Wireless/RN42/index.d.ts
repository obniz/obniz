export = RN42;
declare class RN42 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    uart: any;
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
