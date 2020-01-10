declare class BleSecurity {
    Obniz: any;
    emitter: any;
    constructor(Obniz: any);
    setModeLevel(mode: any, level: any): void;
    checkIntroducedFirmware(introducedVersion: any, functionName: any): void;
    setAuth(authTypes: any): void;
    setIndicateSecurityLevel(level: any): void;
    setEnableKeyTypes(keyTypes: any): void;
    setKeyMaxSize(size: any): void;
    clearBondingDevicesList(): void;
    onerror(params: any): void;
    notifyFromServer(notifyName: any, params: any): void;
}
export default BleSecurity;
