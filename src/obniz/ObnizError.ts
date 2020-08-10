/**
 * @packageDocumentation
 * @module ObnizCore.Errors
 */

// tslint:disable:max-classes-per-file

import { deprecate } from "util";

export class ObnizError extends Error {
  constructor(public code: number, e?: string) {
    super(e);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype); // for ES3, ES5
  }
}

export class ObnizOfflineError extends ObnizError {
  constructor() {
    super(1, "obniz is not online.");
  }
}

export class ObnizTimeoutError extends ObnizError {
  constructor(public waitingFor?: string) {
    super(2, "Receive data timeout." + (waitingFor ? " Waiting for " + waitingFor : ""));
  }
}

export class ObnizI2cError extends ObnizError {
  constructor() {
    super(3, "I2C error.");
  }
}

export class ObnizI2cWarning extends ObnizError {
  constructor() {
    super(4, "I2C error.");
  }
}

export class ObnizBleUnknownPeripheralError extends ObnizError {
  constructor(public peripheralUuid: string) {
    super(5, "unknown peripheral :" + peripheralUuid);
  }
}

export class ObnizBleUnknownServiceError extends ObnizError {
  constructor(public peripheralUuid: string, public serviceUuid: string) {
    super(6, "unknown service.  peripheral :" + peripheralUuid + " service :" + serviceUuid);
  }
}

export class ObnizBleUnknownCharacteristicError extends ObnizError {
  constructor(public peripheralUuid: string, public serviceUuid: string, public characteristicUuid: string) {
    super(
      7,
      "unknown characteristic.  peripheral :" +
        peripheralUuid +
        " service :" +
        serviceUuid +
        " characteristic :" +
        characteristicUuid,
    );
  }
}

export class ObnizBleUnknownDescriptorError extends ObnizError {
  constructor(
    public peripheralUuid: string,
    public serviceUuid: string,
    public characteristicUuid: string,
    public descriptorUuid: string,
  ) {
    super(
      8,
      "unknown descriptor.  peripheral :" +
        peripheralUuid +
        " service :" +
        serviceUuid +
        " characteristic :" +
        characteristicUuid +
        " descriptor :" +
        descriptorUuid,
    );
  }
}

export class ObnizBleOpError extends ObnizError {
  constructor() {
    super(9, "BLE operation error");
  }
}

export class ObnizBleHciStateError extends ObnizError {
  public static Errors: { [key: number]: string } = {
    0x00: "Success",
    0x01: "Unknown HCI Command",
    0x02: "Unknown Connection Identifier ",
    0x03: "Hardware Failure ",
    0x04: "Page Timeout ",
    0x05: "Authentication Failure ",
    0x06: "PIN or Key Missing ",
    0x07: "Memory Capacity Exceeded ",
    0x08: "Connection Timeout ",
    0x09: "Connection Limit Exceeded ",
    0x0a: "Synchronous Connection Limit To A Device Exceeded ",
    0x0b: "Connection Already Exists ",
    0x0c: "Command Disallowed ",
    0x0d: "Connection Rejected due to Limited Resources ",
    0x0e: "Connection Rejected Due To Security Reasons ",
    0x0f: "Connection Rejected due to Unacceptable BD_ADDR ",
    0x10: "Connection Accept Timeout Exceeded ",
    0x11: "Unsupported Feature or Parameter Value ",
    0x12: "Invalid HCI Command Parameters ",
    0x13: "Remote User Terminated Connection ",
    0x14: "Remote Device Terminated Connection due to Low Resources ",
    0x15: "Remote Device Terminated Connection due to Power Off ",
    0x16: "Connection Terminated By Local Host ",
    0x17: "Repeated Attempts ",
    0x18: "Pairing Not Allowed ",
    0x19: "Unknown LMP PDU ",
    0x1a: "Unsupported Remote Feature / Unsupported LMP Feature ",
    0x1b: "SCO Offset Rejected ",
    0x1c: "SCO Interval Rejected ",
    0x1d: "SCO Air Mode Rejected ",
    0x1e: "Invalid LMP Parameters / Invalid LL Parameters ",
    0x1f: "Unspecified Error ",
    0x20: "Unsupported LMP Parameter Value / Unsupported LL Parameter Value ",
    0x21: "Role Change Not Allowed ",
    0x22: "LMP Response Timeout / LL Response Timeout ",
    0x23: "LMP Error Transaction Collision / LL Procedure Collision ",
    0x24: "LMP PDU Not Allowed ",
    0x25: "Encryption Mode Not Acceptable ",
    0x26: "Link Key cannot be Changed ",
    0x27: "Requested QoS Not Supported ",
    0x28: "Instant Passed ",
    0x29: "Pairing With Unit Key Not Supported ",
    0x2a: "Different Transaction Collision ",
    0x2b: "Reserved for future use ",
    0x2c: "QoS Unacceptable Parameter ",
    0x2d: "QoS Rejected ",
    0x2e: "Channel Classification Not Supported ",
    0x2f: "Insufficient Security ",
    0x30: "Parameter Out Of Mandatory Range ",
    0x31: "Reserved for future use ",
    0x32: "Role Switch Pending ",
    0x33: "Reserved for future use ",
    0x34: "Reserved Slot Violation ",
    0x35: "Role Switch Failed ",
    0x36: "Extended Inquiry Response Too Large ",
    0x37: "Secure Simple Pairing Not Supported By Host ",
    0x38: "Host Busy - Pairing ",
    0x39: "Connection Rejected due to No Suitable Channel Found ",
    0x3a: "Controller Busy ",
    0x3b: "Unacceptable Connection Parameters ",
    0x3c: "Advertising Timeout ",
    0x3d: "Connection Terminated due to MIC Failure ",
    0x3e: "Connection Failed to be Established / Synchronization Timeout ",
    0x3f: "MAC Connection Failed ",
    0x40: "Coarse Clock Adjustment Rejected but Will Try to Adjust Using Clock Dragging ",
    0x41: "Type0 Submap Not Defined ",
    0x42: "Unknown Advertising Identifier ",
    0x43: "Limit Reached ",
    0x44: "Operation Cancelled by Host ",
    0x45: "Packet Too Long ",
  };

  constructor(public state: number, params?: any) {
    super(
      10,
      (ObnizBleHciStateError.Errors[state] ? ObnizBleHciStateError.Errors[state] : "Ble Hci state Error") +
        (params ? ` ${JSON.stringify(params)}` : ""),
    );
  }
}

// todo error code to message
export class ObnizBleAttError extends ObnizError {
  public static Errors: { [key: number]: string } = {};

  constructor(public state: number, params?: any) {
    super(11, `ATT Error: ${params}`);
  }
}

export class ObnizDeprecatedFunctionError extends ObnizError {
  constructor(public deprecateFunctionName: string, replaceFunction: string) {
    super(12, `${deprecateFunctionName} is deprecated function, please use ${replaceFunction}`);
  }
}

export class ObnizBleUnsupportedHciError extends ObnizError {
  constructor(public needVer: number, public currentVer: number) {
    super(13, `Unsupported hci version, need version : ${needVer}, current version ${currentVer}`);
  }
}

export class ObnizParameterError extends ObnizError {
  constructor(public parameter: string, public should: string) {
    super(14, `Parameter ${parameter} should satisfy ${should}`);
  }
}

export class ObnizBleUnSupportedOSVersionError extends ObnizError {
  constructor(public deviceOS: string, public atLeast: string) {
    super(
      15,
      `Connected Device has OS=${deviceOS}. But This SDK Support at least ${atLeast} or above. Upgrade Your OS or Downgrade your SDK to use this function`,
    );
  }
}

export class ObnizBlePairingRejectByRemoteError extends ObnizError {
  public static Errors: { [key: number]: string } = {
    0x00: "Unknown",
    0x01: "Passkey Entry Failed",
    0x02: "OOB Not Available",
    0x03: "Authentication Requirements",
    0x04: "Confirm Value Failed",
    0x05: "Pairing Not Supported",
    0x06: "Encryption Key Size",
    0x07: "Command Not Supported",
    0x08: "Unspecified Reason",
    0x09: "Repeated Attempts",
    0x0a: "Invalid Parameters",
    0x0b: "DHKey Check Failed",
    0x0c: "Numeric Comparison Failed",
    0x0d: "BR/EDR pairing in progress",
    0x0e: "Cross-transport Key Deriva- tion/Generation not allowed",
  };

  constructor(reason: number) {
    super(
      16,
      `pairing sequence reject by remote peripheral. reason : ${ObnizBlePairingRejectByRemoteError.Errors[reason]}`,
    );
  }
}

export class ObnizBleScanStartError extends ObnizError {
  constructor(state: number, msg: any) {
    super(
      17,
      `${msg} state=${state}(${ObnizBleHciStateError.Errors[state] ? ObnizBleHciStateError.Errors[state] : ""})`,
    );
  }
}
