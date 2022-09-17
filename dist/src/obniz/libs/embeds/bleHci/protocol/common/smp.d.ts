/// <reference types="node" />
/// <reference types="node" />
/**
 * @packageDocumentation
 * @ignore
 */
export declare namespace SMP {
    const CID = 6;
    const PAIRING_REQUEST = 1;
    const PAIRING_RESPONSE = 2;
    const PAIRING_CONFIRM = 3;
    const PAIRING_RANDOM = 4;
    const PAIRING_FAILED = 5;
    const ENCRYPT_INFO = 6;
    const MASTER_IDENT = 7;
    const IDENTITY_INFORMATION = 8;
    const IDENTITY_ADDRESS_INFORMATION = 9;
    const SIGNING_INFORMATION = 10;
    const PAIRING_PUBLIC_KEY = 12;
    const PAIRING_DHKEY_CHECK = 13;
    const SMP_SECURITY_REQUEST = 11;
    const UNSPECIFIED = 8;
}
export declare type BondingType = 'NoBonding' | 'Bonding';
/**
 * @ignore
 */
export declare type SmpEventTypes = 'masterIdent' | 'ltk' | 'fail' | 'end';
/**
 * @ignore
 */
export declare type SmpIoCapability = 'displayOnly' | 'displayYesNo' | 'keyboardOnly' | 'keyboardDisplay' | 'noInputNoOutput';
export interface SmpPairingParam {
    ioCap: SmpIoCapability;
    bondingFlags: BondingType;
    mitm: boolean;
    sc: boolean;
    keypress: boolean;
    maxKeySize: number;
    initKeyDistr: {
        encKey: boolean;
        idKey: boolean;
    };
    rspKeyDistr: {
        encKey: boolean;
        idKey: boolean;
    };
}
export interface SmpPairingCombinedParam extends Omit<SmpPairingParam, 'ioCap' | 'keypress'> {
    association: SmpAssociationModel;
}
export declare const SmpAssociationModelValue: {
    readonly JustWorks: 0;
    readonly PasskeyEntryInitInputs: 1;
    readonly PasskeyEntryRspInputs: 2;
    readonly PasskeyEntryBothInputs: 3;
    readonly NumericComparison: 4;
};
export declare type SmpAssociationModel = keyof typeof SmpAssociationModelValue;
export declare class SmpCommon {
    parsePairingReqRsp(data: Buffer): SmpPairingParam;
    combinePairingParam(a: SmpPairingParam, b: SmpPairingParam): SmpPairingCombinedParam;
    private _calcAssosiationModel;
    ioCapability2value(capability: SmpIoCapability): number;
    value2ioCapability(value: number): SmpIoCapability;
}
