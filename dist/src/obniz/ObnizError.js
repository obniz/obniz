"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Errors
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObnizBleInvalidParameterError = exports.ObnizBleInvalidPasskeyError = exports.ObnizBleUnSupportedPeripheralError = exports.ObnizBleGattHandleError = exports.ObnizBleScanStartError = exports.ObnizBlePairingRejectByRemoteError = exports.ObnizBleUnSupportedOSVersionError = exports.ObnizParameterError = exports.ObnizBleUnsupportedHciError = exports.ObnizDeprecatedFunctionError = exports.ObnizBleAttError = exports.ObnizBleHciStateError = exports.ObnizBleOpError = exports.ObnizBleUnknownDescriptorError = exports.ObnizBleUnknownCharacteristicError = exports.ObnizBleUnknownServiceError = exports.ObnizBleUnknownPeripheralError = exports.ObnizI2cWarning = exports.ObnizI2cError = exports.ObnizTimeoutError = exports.ObnizOfflineError = exports.ObnizError = void 0;
class ObnizError extends Error {
    constructor(code, e, { cause } = {}) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore for ES2022 Error Cause
        super(e, { cause });
        this.code = code;
        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype); // for ES3, ES5
    }
}
exports.ObnizError = ObnizError;
class ObnizOfflineError extends ObnizError {
    constructor({ cause } = {}) {
        super(1, 'obniz is not online.', { cause });
    }
}
exports.ObnizOfflineError = ObnizOfflineError;
class ObnizTimeoutError extends ObnizError {
    constructor(waitingFor, { cause } = {}) {
        super(2, 'Receive data timeout.' +
            (waitingFor ? ' Waiting for ' + waitingFor : ''), { cause });
        this.waitingFor = waitingFor;
    }
}
exports.ObnizTimeoutError = ObnizTimeoutError;
class ObnizI2cError extends ObnizError {
    constructor({ cause } = {}) {
        super(3, 'I2C error.', { cause });
    }
}
exports.ObnizI2cError = ObnizI2cError;
class ObnizI2cWarning extends ObnizError {
    constructor({ cause } = {}) {
        super(4, 'I2C error.', { cause });
    }
}
exports.ObnizI2cWarning = ObnizI2cWarning;
class ObnizBleUnknownPeripheralError extends ObnizError {
    constructor(peripheralUuid, { cause } = {}) {
        super(5, 'unknown peripheral :' + peripheralUuid, { cause });
        this.peripheralUuid = peripheralUuid;
    }
}
exports.ObnizBleUnknownPeripheralError = ObnizBleUnknownPeripheralError;
class ObnizBleUnknownServiceError extends ObnizError {
    constructor(peripheralUuid, serviceUuid, { cause } = {}) {
        super(6, 'unknown service.  peripheral :' +
            peripheralUuid +
            ' service :' +
            serviceUuid, { cause });
        this.peripheralUuid = peripheralUuid;
        this.serviceUuid = serviceUuid;
    }
}
exports.ObnizBleUnknownServiceError = ObnizBleUnknownServiceError;
class ObnizBleUnknownCharacteristicError extends ObnizError {
    constructor(peripheralUuid, serviceUuid, characteristicUuid, { cause } = {}) {
        super(7, 'unknown characteristic.  peripheral :' +
            peripheralUuid +
            ' service :' +
            serviceUuid +
            ' characteristic :' +
            characteristicUuid, { cause });
        this.peripheralUuid = peripheralUuid;
        this.serviceUuid = serviceUuid;
        this.characteristicUuid = characteristicUuid;
    }
}
exports.ObnizBleUnknownCharacteristicError = ObnizBleUnknownCharacteristicError;
class ObnizBleUnknownDescriptorError extends ObnizError {
    constructor(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid, { cause } = {}) {
        super(8, 'unknown descriptor.  peripheral :' +
            peripheralUuid +
            ' service :' +
            serviceUuid +
            ' characteristic :' +
            characteristicUuid +
            ' descriptor :' +
            descriptorUuid, { cause });
        this.peripheralUuid = peripheralUuid;
        this.serviceUuid = serviceUuid;
        this.characteristicUuid = characteristicUuid;
        this.descriptorUuid = descriptorUuid;
    }
}
exports.ObnizBleUnknownDescriptorError = ObnizBleUnknownDescriptorError;
class ObnizBleOpError extends ObnizError {
    constructor({ cause } = {}) {
        super(9, 'BLE operation error', { cause });
    }
}
exports.ObnizBleOpError = ObnizBleOpError;
class ObnizBleHciStateError extends ObnizError {
    constructor(state, params, { cause } = {}) {
        super(10, (ObnizBleHciStateError.Errors[state]
            ? ObnizBleHciStateError.Errors[state]
            : 'Ble Hci state Error') + (params ? ` ${JSON.stringify(params)}` : ''), { cause });
        this.state = state;
    }
}
exports.ObnizBleHciStateError = ObnizBleHciStateError;
ObnizBleHciStateError.Errors = {
    0x00: 'Success',
    0x01: 'Unknown HCI Command',
    0x02: 'Unknown Connection Identifier ',
    0x03: 'Hardware Failure ',
    0x04: 'Page Timeout ',
    0x05: 'Authentication Failure ',
    0x06: 'PIN or Key Missing ',
    0x07: 'Memory Capacity Exceeded ',
    0x08: 'Connection Timeout ',
    0x09: 'Connection Limit Exceeded ',
    0x0a: 'Synchronous Connection Limit To A Device Exceeded ',
    0x0b: 'Connection Already Exists ',
    0x0c: 'Command Disallowed ',
    0x0d: 'Connection Rejected due to Limited Resources ',
    0x0e: 'Connection Rejected Due To Security Reasons ',
    0x0f: 'Connection Rejected due to Unacceptable BD_ADDR ',
    0x10: 'Connection Accept Timeout Exceeded ',
    0x11: 'Unsupported Feature or Parameter Value ',
    0x12: 'Invalid HCI Command Parameters ',
    0x13: 'Remote User Terminated Connection ',
    0x14: 'Remote Device Terminated Connection due to Low Resources ',
    0x15: 'Remote Device Terminated Connection due to Power Off ',
    0x16: 'Connection Terminated By Local Host ',
    0x17: 'Repeated Attempts ',
    0x18: 'Pairing Not Allowed ',
    0x19: 'Unknown LMP PDU ',
    0x1a: 'Unsupported Remote Feature / Unsupported LMP Feature ',
    0x1b: 'SCO Offset Rejected ',
    0x1c: 'SCO Interval Rejected ',
    0x1d: 'SCO Air Mode Rejected ',
    0x1e: 'Invalid LMP Parameters / Invalid LL Parameters ',
    0x1f: 'Unspecified Error ',
    0x20: 'Unsupported LMP Parameter Value / Unsupported LL Parameter Value ',
    0x21: 'Role Change Not Allowed ',
    0x22: 'LMP Response Timeout / LL Response Timeout ',
    0x23: 'LMP Error Transaction Collision / LL Procedure Collision ',
    0x24: 'LMP PDU Not Allowed ',
    0x25: 'Encryption Mode Not Acceptable ',
    0x26: 'Link Key cannot be Changed ',
    0x27: 'Requested QoS Not Supported ',
    0x28: 'Instant Passed ',
    0x29: 'Pairing With Unit Key Not Supported ',
    0x2a: 'Different Transaction Collision ',
    0x2b: 'Reserved for future use ',
    0x2c: 'QoS Unacceptable Parameter ',
    0x2d: 'QoS Rejected ',
    0x2e: 'Channel Classification Not Supported ',
    0x2f: 'Insufficient Security ',
    0x30: 'Parameter Out Of Mandatory Range ',
    0x31: 'Reserved for future use ',
    0x32: 'Role Switch Pending ',
    0x33: 'Reserved for future use ',
    0x34: 'Reserved Slot Violation ',
    0x35: 'Role Switch Failed ',
    0x36: 'Extended Inquiry Response Too Large ',
    0x37: 'Secure Simple Pairing Not Supported By Host ',
    0x38: 'Host Busy - Pairing ',
    0x39: 'Connection Rejected due to No Suitable Channel Found ',
    0x3a: 'Controller Busy ',
    0x3b: 'Unacceptable Connection Parameters ',
    0x3c: 'Advertising Timeout ',
    0x3d: 'Connection Terminated due to MIC Failure ',
    0x3e: 'Connection Failed to be Established / Synchronization Timeout ',
    0x3f: 'MAC Connection Failed ',
    0x40: 'Coarse Clock Adjustment Rejected but Will Try to Adjust Using Clock Dragging ',
    0x41: 'Type0 Submap Not Defined ',
    0x42: 'Unknown Advertising Identifier ',
    0x43: 'Limit Reached ',
    0x44: 'Operation Cancelled by Host ',
    0x45: 'Packet Too Long ',
};
// todo error code to message
class ObnizBleAttError extends ObnizError {
    constructor(state, params, { cause } = {}) {
        super(11, `ATT Error: ${params || ''}`, { cause });
        this.state = state;
    }
}
exports.ObnizBleAttError = ObnizBleAttError;
ObnizBleAttError.Errors = {};
class ObnizDeprecatedFunctionError extends ObnizError {
    constructor(deprecateFunctionName, replaceFunction, { cause } = {}) {
        super(12, `${deprecateFunctionName} is deprecated function, please use ${replaceFunction}`, { cause });
        this.deprecateFunctionName = deprecateFunctionName;
    }
}
exports.ObnizDeprecatedFunctionError = ObnizDeprecatedFunctionError;
class ObnizBleUnsupportedHciError extends ObnizError {
    constructor(needVer, currentVer, { cause } = {}) {
        super(13, `Unsupported hci version, need version : ${needVer}, current version ${currentVer}`, { cause });
        this.needVer = needVer;
        this.currentVer = currentVer;
    }
}
exports.ObnizBleUnsupportedHciError = ObnizBleUnsupportedHciError;
class ObnizParameterError extends ObnizError {
    constructor(parameter, should, { cause } = {}) {
        super(14, `Parameter ${parameter} should satisfy ${should}`, { cause });
        this.parameter = parameter;
        this.should = should;
    }
}
exports.ObnizParameterError = ObnizParameterError;
class ObnizBleUnSupportedOSVersionError extends ObnizError {
    constructor(deviceOS, atLeast, { cause } = {}) {
        super(15, `Connected Device has OS=${deviceOS}. But This SDK Support at least ${atLeast} or above. Upgrade Your OS or Downgrade your SDK to use this function`, { cause });
        this.deviceOS = deviceOS;
        this.atLeast = atLeast;
    }
}
exports.ObnizBleUnSupportedOSVersionError = ObnizBleUnSupportedOSVersionError;
class ObnizBlePairingRejectByRemoteError extends ObnizError {
    constructor(reason, { cause } = {}) {
        super(16, `pairing sequence reject by remote peripheral. reason : ${ObnizBlePairingRejectByRemoteError.Errors[reason]}`, { cause });
    }
}
exports.ObnizBlePairingRejectByRemoteError = ObnizBlePairingRejectByRemoteError;
ObnizBlePairingRejectByRemoteError.Errors = {
    0x00: 'Unknown',
    0x01: 'Passkey Entry Failed',
    0x02: 'OOB Not Available',
    0x03: 'Authentication Requirements',
    0x04: 'Confirm Value Failed',
    0x05: 'Pairing Not Supported',
    0x06: 'Encryption Key Size',
    0x07: 'Command Not Supported',
    0x08: 'Unspecified Reason',
    0x09: 'Repeated Attempts',
    0x0a: 'Invalid Parameters',
    0x0b: 'DHKey Check Failed',
    0x0c: 'Numeric Comparison Failed',
    0x0d: 'BR/EDR pairing in progress',
    0x0e: 'Cross-transport Key Deriva- tion/Generation not allowed',
};
class ObnizBleScanStartError extends ObnizError {
    constructor(state, msg, { cause } = {}) {
        super(17, `${msg} state=${state}(${ObnizBleHciStateError.Errors[state]
            ? ObnizBleHciStateError.Errors[state]
            : ''})`, { cause });
    }
}
exports.ObnizBleScanStartError = ObnizBleScanStartError;
class ObnizBleGattHandleError extends ObnizError {
    constructor(msg, { cause } = {}) {
        super(18, msg, { cause });
    }
}
exports.ObnizBleGattHandleError = ObnizBleGattHandleError;
class ObnizBleUnSupportedPeripheralError extends ObnizError {
    constructor(target, { cause } = {}) {
        super(19, `${target} is not supported by remote peripheral`, { cause });
    }
}
exports.ObnizBleUnSupportedPeripheralError = ObnizBleUnSupportedPeripheralError;
class ObnizBleInvalidPasskeyError extends ObnizError {
    constructor(passkey, { cause } = {}) {
        super(20, `passkey required >0 and <999999, But input: ${passkey}`, {
            cause,
        });
    }
}
exports.ObnizBleInvalidPasskeyError = ObnizBleInvalidPasskeyError;
class ObnizBleInvalidParameterError extends ObnizError {
    constructor(guideMessage, input, { cause } = {}) {
        super(21, `${guideMessage}, But input: ${input}`, { cause });
    }
}
exports.ObnizBleInvalidParameterError = ObnizBleInvalidParameterError;
