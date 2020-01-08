export = BleSecurity;
declare class BleSecurity {
    constructor(Obniz: any);
    Obniz: any;
    emitter: import("eventemitter3")<string | symbol>;
    setModeLevel(mode: any, level: any): void;
    checkIntroducedFirmware(introducedVersion: any, functionName: any): void;
    setAuth(authTypes: any): void;
    setIndicateSecurityLevel(level: any): void;
    setEnableKeyTypes(keyTypes: any): void;
    setKeyMaxSize(size: any): void;
    clearBondingDevicesList(): void;
    onerror(): void;
    notifyFromServer(notifyName: any, params: any): void;
}
