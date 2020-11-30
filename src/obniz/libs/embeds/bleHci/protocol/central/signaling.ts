/**
 * @packageDocumentation
 *
 * @ignore
 */
// let debug = require('debug')('signaling');
const debug: any = () => {};

import EventEmitter from "eventemitter3";

/**
 * @ignore
 */
const CONNECTION_PARAMETER_UPDATE_REQUEST: any = 0x12;

/**
 * @ignore
 */
const CONNECTION_PARAMETER_UPDATE_RESPONSE: any = 0x13;

/**
 * @ignore
 */
const SIGNALING_CID: any = 0x0005;

type SignalingEventTypes = "connectionParameterUpdateRequest";
/**
 * @ignore
 */
class Signaling extends EventEmitter<SignalingEventTypes> {
  public _handle: any;
  public _aclStream: any;
  public onAclStreamDataBinded: any;
  public onAclStreamEndBinded: any;

  constructor(handle: any, aclStream: any) {
    super();
    this._handle = handle;
    this._aclStream = aclStream;

    this.onAclStreamDataBinded = this.onAclStreamData.bind(this);
    this.onAclStreamEndBinded = this.onAclStreamEnd.bind(this);

    this._aclStream.on("data", this.onAclStreamDataBinded);
    this._aclStream.on("end", this.onAclStreamEndBinded);
  }

  public onAclStreamData(cid: any, data?: any) {
    if (cid !== SIGNALING_CID) {
      return;
    }

    debug("onAclStreamData: " + data.toString("hex"));

    const code: any = data.readUInt8(0);
    const identifier: any = data.readUInt8(1);
    const length: any = data.readUInt16LE(2);
    const signalingData: any = data.slice(4);

    debug("\tcode = " + code);
    debug("\tidentifier = " + identifier);
    debug("\tlength = " + length);

    if (code === CONNECTION_PARAMETER_UPDATE_REQUEST) {
      this.processConnectionParameterUpdateRequest(identifier, signalingData);
    }
  }

  public onAclStreamEnd() {
    this._aclStream.removeListener("data", this.onAclStreamDataBinded);
    this._aclStream.removeListener("end", this.onAclStreamEndBinded);
  }

  public processConnectionParameterUpdateRequest(identifier: any, data: any) {
    const minInterval: any = data.readUInt16LE(0) * 1.25;
    const maxInterval: any = data.readUInt16LE(2) * 1.25;
    const latency: any = data.readUInt16LE(4);
    const supervisionTimeout: any = data.readUInt16LE(6) * 10;

    debug("\t\tmin interval = ", minInterval);
    debug("\t\tmax interval = ", maxInterval);
    debug("\t\tlatency = ", latency);
    debug("\t\tsupervision timeout = ", supervisionTimeout);

    const response: any = Buffer.alloc(6);

    response.writeUInt8(CONNECTION_PARAMETER_UPDATE_RESPONSE, 0); // code
    response.writeUInt8(identifier, 1); // identifier
    response.writeUInt16LE(2, 2); // length
    response.writeUInt16LE(0, 4);

    this._aclStream.write(SIGNALING_CID, response);

    this.emit("connectionParameterUpdateRequest", this._handle, minInterval, maxInterval, latency, supervisionTimeout);
  }
}

export default Signaling;
