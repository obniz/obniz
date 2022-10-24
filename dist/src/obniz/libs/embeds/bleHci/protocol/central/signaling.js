"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signaling = void 0;
/**
 * @packageDocumentation
 *
 * @ignore
 */
// let debug = require('debug')('signaling');
const debug = () => {
    // do nothing.
};
const eventemitter3_1 = __importDefault(require("eventemitter3"));
/**
 * @ignore
 */
const CONNECTION_PARAMETER_UPDATE_REQUEST = 0x12;
/**
 * @ignore
 */
const CONNECTION_PARAMETER_UPDATE_RESPONSE = 0x13;
/**
 * @ignore
 */
const SIGNALING_CID = 0x0005;
/**
 * @ignore
 */
class Signaling extends eventemitter3_1.default {
    constructor(handle, aclStream) {
        super();
        this._handle = handle;
        this._aclStream = aclStream;
        this.onAclStreamDataBinded = this.onAclStreamData.bind(this);
        this.onAclStreamEndBinded = this.onAclStreamEnd.bind(this);
        this._aclStream.on('data', this.onAclStreamDataBinded);
        this._aclStream.on('end', this.onAclStreamEndBinded);
    }
    onAclStreamData(cid, data) {
        if (cid !== SIGNALING_CID) {
            return;
        }
        debug('onAclStreamData: ' + data.toString('hex'));
        const code = data.readUInt8(0);
        const identifier = data.readUInt8(1);
        const length = data.readUInt16LE(2);
        const signalingData = data.slice(4);
        debug('\tcode = ' + code);
        debug('\tidentifier = ' + identifier);
        debug('\tlength = ' + length);
        if (code === CONNECTION_PARAMETER_UPDATE_REQUEST) {
            this.processConnectionParameterUpdateRequest(identifier, signalingData);
        }
    }
    onAclStreamEnd() {
        this._aclStream.removeListener('data', this.onAclStreamDataBinded);
        this._aclStream.removeListener('end', this.onAclStreamEndBinded);
    }
    processConnectionParameterUpdateRequest(identifier, data) {
        const minInterval = data.readUInt16LE(0) * 1.25;
        const maxInterval = data.readUInt16LE(2) * 1.25;
        const latency = data.readUInt16LE(4);
        const supervisionTimeout = data.readUInt16LE(6) * 10;
        debug('\t\tmin interval = ', minInterval);
        debug('\t\tmax interval = ', maxInterval);
        debug('\t\tlatency = ', latency);
        debug('\t\tsupervision timeout = ', supervisionTimeout);
        const response = Buffer.alloc(6);
        response.writeUInt8(CONNECTION_PARAMETER_UPDATE_RESPONSE, 0); // code
        response.writeUInt8(identifier, 1); // identifier
        response.writeUInt16LE(2, 2); // length
        response.writeUInt16LE(0, 4);
        this._aclStream.write(SIGNALING_CID, response);
        this.emit('connectionParameterUpdateRequest', this._handle, minInterval, maxInterval, latency, supervisionTimeout);
    }
}
exports.Signaling = Signaling;
