/**
 * @packageDocumentation
 * @module ObnizCore.Errors
 */
export interface ObnizErrorStatic {
    new (): ObnizError;
}
export declare class ObnizError extends Error {
    code: number;
    constructor(code: number, e?: string, { cause }?: {
        cause?: Error;
    });
}
export declare class ObnizOfflineError extends ObnizError {
    constructor({ cause }?: {
        cause?: Error;
    });
}
export declare class ObnizTimeoutError extends ObnizError {
    waitingFor?: string | undefined;
    constructor(waitingFor?: string | undefined, { cause }?: {
        cause?: Error;
    });
}
export declare class ObnizI2cError extends ObnizError {
    constructor({ cause }?: {
        cause?: Error;
    });
}
export declare class ObnizI2cWarning extends ObnizError {
    constructor({ cause }?: {
        cause?: Error;
    });
}
export declare class ObnizBleUnknownPeripheralError extends ObnizError {
    peripheralUuid: string;
    constructor(peripheralUuid: string, { cause }?: {
        cause?: Error;
    });
}
export declare class ObnizBleUnknownServiceError extends ObnizError {
    peripheralUuid: string;
    serviceUuid: string;
    constructor(peripheralUuid: string, serviceUuid: string, { cause }?: {
        cause?: Error;
    });
}
export declare class ObnizBleUnknownCharacteristicError extends ObnizError {
    peripheralUuid: string;
    serviceUuid: string;
    characteristicUuid: string;
    constructor(peripheralUuid: string, serviceUuid: string, characteristicUuid: string, { cause }?: {
        cause?: Error;
    });
}
export declare class ObnizBleUnknownDescriptorError extends ObnizError {
    peripheralUuid: string;
    serviceUuid: string;
    characteristicUuid: string;
    descriptorUuid: string;
    constructor(peripheralUuid: string, serviceUuid: string, characteristicUuid: string, descriptorUuid: string, { cause }?: {
        cause?: Error;
    });
}
export declare class ObnizBleOpError extends ObnizError {
    constructor({ cause }?: {
        cause?: Error;
    });
}
export declare class ObnizBleHciStateError extends ObnizError {
    state: number;
    static Errors: {
        [key: number]: string;
    };
    constructor(state: number, params?: any, { cause }?: {
        cause?: Error;
    });
}
export declare class ObnizBleAttError extends ObnizError {
    state: number;
    static Errors: {
        [key: number]: string;
    };
    constructor(state: number, params?: string, { cause }?: {
        cause?: Error;
    });
}
export declare class ObnizDeprecatedFunctionError extends ObnizError {
    deprecateFunctionName: string;
    constructor(deprecateFunctionName: string, replaceFunction: string, { cause }?: {
        cause?: Error;
    });
}
export declare class ObnizBleUnsupportedHciError extends ObnizError {
    needVer: number;
    currentVer: number;
    constructor(needVer: number, currentVer: number, { cause }?: {
        cause?: Error;
    });
}
export declare class ObnizParameterError extends ObnizError {
    parameter: string;
    should: string;
    constructor(parameter: string, should: string, { cause }?: {
        cause?: Error;
    });
}
export declare class ObnizBleUnSupportedOSVersionError extends ObnizError {
    deviceOS: string;
    atLeast: string;
    constructor(deviceOS: string, atLeast: string, { cause }?: {
        cause?: Error;
    });
}
export declare class ObnizBlePairingRejectByRemoteError extends ObnizError {
    static Errors: {
        [key: number]: string;
    };
    constructor(reason: number, { cause }?: {
        cause?: Error;
    });
}
export declare class ObnizBleScanStartError extends ObnizError {
    constructor(state: number, msg: any, { cause }?: {
        cause?: Error;
    });
}
export declare class ObnizBleGattHandleError extends ObnizError {
    constructor(msg: any, { cause }?: {
        cause?: Error;
    });
}
export declare class ObnizBleUnSupportedPeripheralError extends ObnizError {
    constructor(target: string, { cause }?: {
        cause?: Error;
    });
}
export declare class ObnizBleInvalidPasskeyError extends ObnizError {
    constructor(passkey: number, { cause }?: {
        cause?: Error;
    });
}
export declare class ObnizBleInvalidParameterError extends ObnizError {
    constructor(guideMessage: string, input: string, { cause }?: {
        cause?: Error;
    });
}
