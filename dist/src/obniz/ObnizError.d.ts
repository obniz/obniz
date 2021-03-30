/**
 * @packageDocumentation
 * @module ObnizCore.Errors
 */
export declare class ObnizError extends Error {
    code: number;
    constructor(code: number, e?: string);
}
export declare class ObnizOfflineError extends ObnizError {
    constructor();
}
export declare class ObnizTimeoutError extends ObnizError {
    waitingFor?: string | undefined;
    constructor(waitingFor?: string | undefined);
}
export declare class ObnizI2cError extends ObnizError {
    constructor();
}
export declare class ObnizI2cWarning extends ObnizError {
    constructor();
}
export declare class ObnizBleUnknownPeripheralError extends ObnizError {
    peripheralUuid: string;
    constructor(peripheralUuid: string);
}
export declare class ObnizBleUnknownServiceError extends ObnizError {
    peripheralUuid: string;
    serviceUuid: string;
    constructor(peripheralUuid: string, serviceUuid: string);
}
export declare class ObnizBleUnknownCharacteristicError extends ObnizError {
    peripheralUuid: string;
    serviceUuid: string;
    characteristicUuid: string;
    constructor(peripheralUuid: string, serviceUuid: string, characteristicUuid: string);
}
export declare class ObnizBleUnknownDescriptorError extends ObnizError {
    peripheralUuid: string;
    serviceUuid: string;
    characteristicUuid: string;
    descriptorUuid: string;
    constructor(peripheralUuid: string, serviceUuid: string, characteristicUuid: string, descriptorUuid: string);
}
export declare class ObnizBleOpError extends ObnizError {
    constructor();
}
export declare class ObnizBleHciStateError extends ObnizError {
    state: number;
    static Errors: {
        [key: number]: string;
    };
    constructor(state: number, params?: any);
}
export declare class ObnizBleAttError extends ObnizError {
    state: number;
    static Errors: {
        [key: number]: string;
    };
    constructor(state: number, params?: any);
}
export declare class ObnizDeprecatedFunctionError extends ObnizError {
    deprecateFunctionName: string;
    constructor(deprecateFunctionName: string, replaceFunction: string);
}
export declare class ObnizBleUnsupportedHciError extends ObnizError {
    needVer: number;
    currentVer: number;
    constructor(needVer: number, currentVer: number);
}
export declare class ObnizParameterError extends ObnizError {
    parameter: string;
    should: string;
    constructor(parameter: string, should: string);
}
export declare class ObnizBleUnSupportedOSVersionError extends ObnizError {
    deviceOS: string;
    atLeast: string;
    constructor(deviceOS: string, atLeast: string);
}
export declare class ObnizBlePairingRejectByRemoteError extends ObnizError {
    static Errors: {
        [key: number]: string;
    };
    constructor(reason: number);
}
export declare class ObnizBleScanStartError extends ObnizError {
    constructor(state: number, msg: any);
}
