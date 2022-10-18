"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmpCommon = exports.SmpAssociationModelValue = exports.SMP = void 0;
/**
 * @packageDocumentation
 * @ignore
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
var SMP;
(function (SMP) {
    SMP.CID = 0x0006;
    SMP.PAIRING_REQUEST = 0x01;
    SMP.PAIRING_RESPONSE = 0x02;
    SMP.PAIRING_CONFIRM = 0x03;
    SMP.PAIRING_RANDOM = 0x04;
    SMP.PAIRING_FAILED = 0x05;
    SMP.ENCRYPT_INFO = 0x06;
    SMP.MASTER_IDENT = 0x07;
    SMP.IDENTITY_INFORMATION = 0x08;
    SMP.IDENTITY_ADDRESS_INFORMATION = 0x09;
    SMP.SIGNING_INFORMATION = 0x0a;
    SMP.PAIRING_PUBLIC_KEY = 0x0c;
    SMP.PAIRING_DHKEY_CHECK = 0x0d;
    SMP.SMP_SECURITY_REQUEST = 0x0b;
    SMP.UNSPECIFIED = 0x08;
})(SMP = exports.SMP || (exports.SMP = {}));
exports.SmpAssociationModelValue = {
    JustWorks: 0,
    PasskeyEntryInitInputs: 1,
    PasskeyEntryRspInputs: 2,
    PasskeyEntryBothInputs: 3,
    NumericComparison: 4,
};
class SmpCommon {
    parsePairingReqRsp(data) {
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
    combinePairingParam(a, b) {
        const combined = {
            bondingFlags: (a.bondingFlags === 'Bonding' &&
                b.bondingFlags === 'Bonding'
                ? 'Bonding'
                : 'NoBonding'),
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
        return Object.assign(Object.assign({}, combined), { association: this._calcAssosiationModel(a, b, combined) });
    }
    _calcAssosiationModel(req, rsp, combined) {
        if (!combined.mitm) {
            return 'JustWorks';
        }
        const reqDisplay = !combined.sc && req.ioCap === 'displayYesNo' ? 'displayOnly' : req.ioCap;
        const rspDisplay = !combined.sc && rsp.ioCap === 'displayYesNo' ? 'displayOnly' : rsp.ioCap;
        if (reqDisplay === 'noInputNoOutput' || rspDisplay === 'noInputNoOutput') {
            return 'JustWorks';
        }
        else if (reqDisplay === 'keyboardOnly' && rspDisplay === 'keyboardOnly') {
            return 'PasskeyEntryBothInputs';
        }
        else if (reqDisplay === 'keyboardOnly') {
            return 'PasskeyEntryInitInputs';
        }
        else if (rspDisplay === 'keyboardOnly') {
            return 'PasskeyEntryRspInputs';
        }
        else if (reqDisplay === 'keyboardDisplay' &&
            rspDisplay === 'keyboardDisplay') {
            return combined.sc ? 'NumericComparison' : 'PasskeyEntryRspInputs';
        }
        else if (reqDisplay === 'displayOnly' &&
            rspDisplay === 'keyboardDisplay') {
            return 'PasskeyEntryRspInputs';
        }
        else if (rspDisplay === 'displayOnly' &&
            reqDisplay === 'keyboardDisplay') {
            return 'PasskeyEntryInitInputs';
        }
        else if (reqDisplay === 'displayOnly' || rspDisplay === 'displayOnly') {
            return 'JustWorks';
        }
        return 'NumericComparison';
    }
    ioCapability2value(capability) {
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
    value2ioCapability(value) {
        const map = {
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
exports.SmpCommon = SmpCommon;
