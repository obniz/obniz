/**
 * @packageDocumentation
 * @ignore
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SMP {
  export const CID = 0x0006;
  export const PAIRING_REQUEST = 0x01;
  export const PAIRING_RESPONSE = 0x02;
  export const PAIRING_CONFIRM = 0x03;
  export const PAIRING_RANDOM = 0x04;
  export const PAIRING_FAILED = 0x05;
  export const ENCRYPT_INFO = 0x06;
  export const MASTER_IDENT = 0x07;
  export const IDENTITY_INFORMATION = 0x08;
  export const IDENTITY_ADDRESS_INFORMATION = 0x09;
  export const SIGNING_INFORMATION = 0x0a;
  export const PAIRING_PUBLIC_KEY = 0x0c;
  export const PAIRING_DHKEY_CHECK = 0x0d;
  export const SMP_SECURITY_REQUEST = 0x0b;
  export const UNSPECIFIED = 0x08;
}

export type BondingType = 'NoBonding' | 'Bonding';

/**
 * @ignore
 */
export type SmpEventTypes = 'masterIdent' | 'ltk' | 'fail' | 'end';

/**
 * @ignore
 */
export type SmpIoCapability =
  | 'displayOnly'
  | 'displayYesNo'
  | 'keyboardOnly'
  | 'keyboardDisplay'
  | 'noInputNoOutput';

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

export interface SmpPairingCombinedParam
  extends Omit<SmpPairingParam, 'ioCap' | 'keypress'> {
  association: SmpAssociationModel;
}

export const SmpAssociationModelValue = {
  JustWorks: 0,
  PasskeyEntryInitInputs: 1,
  PasskeyEntryRspInputs: 2,
  PasskeyEntryBothInputs: 3,
  NumericComparison: 4,
} as const;

export type SmpAssociationModel = keyof typeof SmpAssociationModelValue;

export class SmpCommon {
  parsePairingReqRsp(data: Buffer): SmpPairingParam {
    return {
      ioCap: this.value2ioCapability(data[1]),
      bondingFlags: (data[3] & 3) === 0 ? 'NoBonding' : 'Bonding',
      mitm: (data[3] & 4) !== 0,
      sc: (data[3] & 8) !== 0,
      keypress: (data[3] & 16) !== 0,
      maxKeySize: data[4],
      initKeyDistr: {
        encKey: (data[5] & 1) !== 0,
        idKey: (data[5] & 2) !== 0,
      },
      rspKeyDistr: {
        encKey: (data[6] & 1) !== 0,
        idKey: (data[6] & 2) !== 0,
      },
    };
  }

  combinePairingParam(
    a: SmpPairingParam,
    b: SmpPairingParam
  ): SmpPairingCombinedParam {
    const combined = {
      bondingFlags: (a.bondingFlags === 'Bonding' &&
      b.bondingFlags === 'Bonding'
        ? 'Bonding'
        : 'NoBonding') as BondingType,
      mitm: a.mitm && b.mitm,
      sc: a.sc && b.sc,
      maxKeySize: Math.min(a.maxKeySize, b.maxKeySize),
      initKeyDistr: {
        encKey: a.initKeyDistr.encKey && b.initKeyDistr.encKey,
        idKey: a.initKeyDistr.idKey && b.initKeyDistr.idKey,
      },
      rspKeyDistr: {
        encKey: a.rspKeyDistr.encKey && b.rspKeyDistr.encKey,
        idKey: a.rspKeyDistr.idKey && b.rspKeyDistr.idKey,
      },
    };
    return {
      ...combined,
      association: this._calcAssosiationModel(a, b, combined),
    };
  }

  private _calcAssosiationModel(
    req: SmpPairingParam,
    rsp: SmpPairingParam,
    combined: Omit<SmpPairingParam, 'ioCap' | 'keypress'>
  ): SmpAssociationModel {
    if (!combined.mitm) {
      return 'JustWorks';
    }
    const reqDisplay: SmpIoCapability =
      !combined.sc && req.ioCap === 'displayYesNo' ? 'displayOnly' : req.ioCap;
    const rspDisplay: SmpIoCapability =
      !combined.sc && rsp.ioCap === 'displayYesNo' ? 'displayOnly' : rsp.ioCap;

    if (reqDisplay === 'noInputNoOutput' || rspDisplay === 'noInputNoOutput') {
      return 'JustWorks';
    } else if (reqDisplay === 'keyboardOnly' && rspDisplay === 'keyboardOnly') {
      return 'PasskeyEntryBothInputs';
    } else if (reqDisplay === 'keyboardOnly') {
      return 'PasskeyEntryInitInputs';
    } else if (rspDisplay === 'keyboardOnly') {
      return 'PasskeyEntryRspInputs';
    } else if (
      reqDisplay === 'keyboardDisplay' &&
      rspDisplay === 'keyboardDisplay'
    ) {
      return combined.sc ? 'NumericComparison' : 'PasskeyEntryRspInputs';
    } else if (
      reqDisplay === 'displayOnly' &&
      rspDisplay === 'keyboardDisplay'
    ) {
      return 'PasskeyEntryRspInputs';
    } else if (
      rspDisplay === 'displayOnly' &&
      reqDisplay === 'keyboardDisplay'
    ) {
      return 'PasskeyEntryInitInputs';
    } else if (reqDisplay === 'displayOnly' || rspDisplay === 'displayOnly') {
      return 'JustWorks';
    }
    return 'NumericComparison';
  }

  ioCapability2value(capability: SmpIoCapability): number {
    switch (capability) {
      case 'displayOnly':
        return 0x00;
      case 'displayYesNo':
        return 0x01;
      case 'keyboardDisplay':
        return 0x04;
      case 'keyboardOnly':
        return 0x02;
    }
    return 0x03;
  }

  value2ioCapability(value: number): SmpIoCapability {
    const map: { [key: number]: SmpIoCapability } = {
      0x00: 'displayOnly',
      0x01: 'displayYesNo',
      0x02: 'keyboardOnly',
      0x03: 'noInputNoOutput',
      0x04: 'keyboardDisplay',
    };
    if (map[value]) {
      return map[value];
    }
    throw new Error('unknown value');
  }
}
