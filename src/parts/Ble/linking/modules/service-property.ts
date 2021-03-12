/**
 * @packageDocumentation
 * @module Parts.Linking
 */

/* ------------------------------------------------------------------
 * node-linking - service-property.js
 *
 * Copyright (c) 2017-2019, Futomi Hatano, All rights reserved.
 * Released under the MIT license
 * Date: 2019-10-24
 * ---------------------------------------------------------------- */
"use strict";

export default class LinkingServiceProperty {
  public SERVICE_ID = 0x00;
  public SERVICE_NAME = "PeripheralDevicePropertyInformation";
  public MESSAGE_NAME_MAP: any = {
    "00": "GET_DEVICE_INFORMATION",
    "01": "GET_DEVICE_INFORMATION_RESP",
  };

  // Private
  private _WRITE_MESSAGE_ID_MAP: any = {
    GET_DEVICE_INFORMATION: 0x00,
  };
  private _device: any = {};

  constructor() {}

  public setDeviceInfo(info: any) {
    this._device = info;
  }

  public parsePayload(pnum: any, buf: any) {
    let offset = 0;
    const parameters = [];
    try {
      for (let i = 0; i < pnum; i++) {
        const pid = buf.readUInt8(offset++);
        let plen_buf = buf.slice(offset, offset + 3);
        plen_buf = Buffer.concat([plen_buf, Buffer.from([0x00])]);
        const plen = plen_buf.readUInt32LE(0);
        offset += 3;
        const pvalue_buf = buf.slice(offset, offset + plen);
        offset += plen;
        parameters.push(this._parseParameter(pid, pvalue_buf));
      }
    } catch (e) {}
    return parameters;
  }

  public _parseParameter(pid: any, buf: any) {
    let parsed: any = null;
    if (pid === 0x00) {
      parsed = this._parseResultCode(buf);
    } else if (pid === 0x01) {
      parsed = this._parseCancel(buf);
    } else if (pid === 0x02) {
      parsed = this._parseServiceList(buf);
    } else if (pid === 0x03) {
      parsed = this._parseDeviceId(buf);
    } else if (pid === 0x04) {
      parsed = this._parseDeviceUid(buf);
    } else if (pid === 0x05) {
      parsed = this._parseDeviceCapability(buf);
    } else if (pid === 0x06) {
      parsed = this._parseOriginalInformation(buf);
    } else if (pid === 0x07) {
      parsed = this._parseExSensorType(buf);
    }
    if (parsed) {
      parsed.parameterId = pid;
    }
    return parsed;
  }

  public _parseResultCode(buf: any) {
    const code = buf.readUInt8(0);
    let text = "";
    if (code === 0x00) {
      text = "OK, request processed correctly";
    } else if (code === 0x01) {
      text = "Cancel";
    } else if (code === 0x02) {
      text = "Error, failed";
    } else if (code === 0x03) {
      text = "Error, no reason defined";
    } else if (code === 0x04) {
      text = "Error, data not available";
    } else if (code === 0x05) {
      text = "Error, not supported";
    }
    return {
      name: "ResultCode",
      resultCode: code,
      resultText: text,
    };
  }

  public _parseCancel(buf: any) {
    const code = buf.readUInt8(0);
    let text = "";
    if (code === 0x00) {
      text = "User cancel";
    }
    return {
      name: "Cancel",
      cancelCode: code,
      cancelText: text,
    };
  }

  public _parseServiceList(buf: any) {
    const v = buf.readUInt8(0);
    const list = [];
    if (v & 0b00000001) {
      list.push({ id: 0, name: "PeripheralDevicePropertyInformation" });
    }
    if (v & 0b00000010) {
      list.push({ id: 1, name: "PeripheralDeviceNotification" });
    }
    if (v & 0b00000100) {
      list.push({ id: 2, name: "PeripheralDeviceOperation" });
    }
    if (v & 0b00001000) {
      list.push({ id: 3, name: "PeripheralDeviceSensorInformation" });
    }
    if (v & 0b00010000) {
      list.push({ id: 4, name: "PeripheralDeviceSettingOperation" });
    }
    return {
      name: "ServiceList",
      serviceList: list,
    };
  }

  public _parseDeviceId(buf: any) {
    return {
      name: "DeviceId",
      deviceId: buf.toString("hex"),
    };
  }

  public _parseDeviceUid(buf: any) {
    return {
      name: "DeviceUid",
      deviceUid: buf.toString("hex"),
    };
  }

  public _parseDeviceCapability(buf: any) {
    const v = buf.readUInt8(0);
    const list = [];
    if (v & 0b00000010) {
      list.push({ id: 1, name: "Gyroscope" });
    }
    if (v & 0b00000100) {
      list.push({ id: 2, name: "Accelerometer" });
    }
    if (v & 0b00001000) {
      list.push({ id: 3, name: "Orientation" });
    }
    if (v & 0b00010000) {
      list.push({ id: 4, name: "Battery" });
    }
    if (v & 0b00100000) {
      list.push({ id: 5, name: "Temperature" });
    }
    if (v & 0b01000000) {
      list.push({ id: 6, name: "Humidity" });
    }
    if (v & 0b10000000) {
      list.push({ id: 7, name: "Atmospheric pressure" });
    }
    return {
      name: "DeviceCapability",
      deviceCapability: list,
    };
  }

  public _parseOriginalInformation(buf: any) {
    const type = buf.readUInt8(0);
    let type_name = "";
    if (type === 0x00) {
      type_name = "AppName";
    } else if (type === 0x01) {
      type_name = "AppNameLocal";
    } else if (type === 0x02) {
      type_name = "AppDLURL1";
    } else if (type === 0x03) {
      type_name = "AppDLURL2";
    } else if (type === 0x04) {
      type_name = "AppDLURL3";
    } else if (type === 0x05) {
      type_name = "AppExecInfo1";
    } else if (type === 0x06) {
      type_name = "AppExecInfo2";
    } else if (type === 0x07) {
      type_name = "AppExecInfo3";
    } else if (type === 0x08) {
      type_name = "AppPackage";
    }
    return {
      name: "OriginalInformation",
      originalInformationCode: type,
      originalInformationName: type_name,
      originalInformationText: buf.slice(1).toString("UTF-8"),
    };
  }

  public _parseExSensorType(buf: any) {
    const v = buf.readUInt8(0);
    const list = [];
    if (v & 0b00000001) {
      list.push({ id: 0, name: "Version" });
    }
    if (v & 0b00000010) {
      list.push({ id: 1, name: "Version" });
    }
    if (v & 0b00000100) {
      list.push({ id: 2, name: "Flag" });
    }
    if (v & 0b00001000) {
      list.push({ id: 3, name: "Button" });
    }
    if (v & 0b00010000) {
      list.push({ id: 4, name: "Opening and closing" });
    }
    if (v & 0b00100000) {
      list.push({ id: 5, name: "Human detection" });
    }
    if (v & 0b01000000) {
      list.push({ id: 6, name: "Move" });
    }
    if (v & 0b10000000) {
      list.push({ id: 7, name: "Illuminance" });
    }
    return {
      name: "ExSensorType",
      exSensorType: list,
    };
  }

  public createRequest(message_name: any, params: any) {
    if (!(message_name in this._WRITE_MESSAGE_ID_MAP)) {
      return null;
    }
    const buf_list = [];
    // packet header
    const header_buf: any = Buffer.alloc(1);
    header_buf.writeUInt8(parseInt("00000001", 2));
    buf_list.push(header_buf);
    // Service ID
    const sid_buf: any = Buffer.alloc(1);
    sid_buf.writeUInt8(this.SERVICE_ID);
    buf_list.push(sid_buf);
    // Message ID
    const mid_buf: any = Buffer.alloc(2);
    mid_buf.writeUInt16LE(this._WRITE_MESSAGE_ID_MAP[message_name]);
    buf_list.push(mid_buf);
    // Number of parameters + Payload
    const pl_buf = this._createPayload(message_name, params);
    if (!pl_buf) {
      return null;
    }
    buf_list.push(pl_buf);

    return Buffer.concat(buf_list);
  }

  public _createPayload(message_name: any, params: any) {
    if (message_name === "GET_DEVICE_INFORMATION") {
      return this._createPayloadGetDeviceInformation(params);
    } else {
      return null;
    }
  }

  public _createPayloadGetDeviceInformation(params: any) {
    const pnum_buf: any = Buffer.alloc(1);
    pnum_buf.writeUInt8(0);
    return pnum_buf;
  }
}
