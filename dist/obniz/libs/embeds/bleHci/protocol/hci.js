"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// let debug = require('debug')('hci');
const debug = () => { };
let events = require('events');
let util = require('util');
let HCI_COMMAND_PKT = 0x01;
let HCI_ACLDATA_PKT = 0x02;
let HCI_EVENT_PKT = 0x04;
let ACL_START_NO_FLUSH = 0x00;
let ACL_CONT = 0x01;
let ACL_START = 0x02;
let EVT_DISCONN_COMPLETE = 0x05;
let EVT_ENCRYPT_CHANGE = 0x08;
let EVT_CMD_COMPLETE = 0x0e;
let EVT_CMD_STATUS = 0x0f;
let EVT_NUMBER_OF_COMPLETED_PACKETS = 0x13;
let EVT_LE_META_EVENT = 0x3e;
let EVT_LE_CONN_COMPLETE = 0x01;
let EVT_LE_ADVERTISING_REPORT = 0x02;
let EVT_LE_CONN_UPDATE_COMPLETE = 0x03;
let OGF_LINK_CTL = 0x01;
let OCF_DISCONNECT = 0x0006;
let OGF_HOST_CTL = 0x03;
let OCF_SET_EVENT_MASK = 0x0001;
let OCF_RESET = 0x0003;
let OCF_READ_LE_HOST_SUPPORTED = 0x006c;
let OCF_WRITE_LE_HOST_SUPPORTED = 0x006d;
let OGF_INFO_PARAM = 0x04;
let OCF_READ_LOCAL_VERSION = 0x0001;
let OCF_READ_BUFFER_SIZE = 0x0005;
let OCF_READ_BD_ADDR = 0x0009;
let OGF_STATUS_PARAM = 0x05;
let OCF_READ_RSSI = 0x0005;
let OGF_LE_CTL = 0x08;
let OCF_LE_SET_EVENT_MASK = 0x0001;
let OCF_LE_READ_BUFFER_SIZE = 0x0002;
let OCF_LE_SET_ADVERTISING_PARAMETERS = 0x0006;
let OCF_LE_SET_ADVERTISING_DATA = 0x0008;
let OCF_LE_SET_SCAN_RESPONSE_DATA = 0x0009;
let OCF_LE_SET_ADVERTISE_ENABLE = 0x000a;
let OCF_LE_SET_SCAN_PARAMETERS = 0x000b;
let OCF_LE_SET_SCAN_ENABLE = 0x000c;
let OCF_LE_CREATE_CONN = 0x000d;
let OCF_LE_CONN_UPDATE = 0x0013;
let OCF_LE_START_ENCRYPTION = 0x0019;
let OCF_LE_LTK_NEG_REPLY = 0x001b;
let DISCONNECT_CMD = OCF_DISCONNECT | (OGF_LINK_CTL << 10);
let SET_EVENT_MASK_CMD = OCF_SET_EVENT_MASK | (OGF_HOST_CTL << 10);
let RESET_CMD = OCF_RESET | (OGF_HOST_CTL << 10);
let READ_LE_HOST_SUPPORTED_CMD = OCF_READ_LE_HOST_SUPPORTED | (OGF_HOST_CTL << 10);
let WRITE_LE_HOST_SUPPORTED_CMD = OCF_WRITE_LE_HOST_SUPPORTED | (OGF_HOST_CTL << 10);
let READ_LOCAL_VERSION_CMD = OCF_READ_LOCAL_VERSION | (OGF_INFO_PARAM << 10);
let READ_BUFFER_SIZE_CMD = OCF_READ_BUFFER_SIZE | (OGF_INFO_PARAM << 10);
let READ_BD_ADDR_CMD = OCF_READ_BD_ADDR | (OGF_INFO_PARAM << 10);
let READ_RSSI_CMD = OCF_READ_RSSI | (OGF_STATUS_PARAM << 10);
let LE_SET_EVENT_MASK_CMD = OCF_LE_SET_EVENT_MASK | (OGF_LE_CTL << 10);
let LE_READ_BUFFER_SIZE_CMD = OCF_LE_READ_BUFFER_SIZE | (OGF_LE_CTL << 10);
let LE_SET_SCAN_PARAMETERS_CMD = OCF_LE_SET_SCAN_PARAMETERS | (OGF_LE_CTL << 10);
let LE_SET_SCAN_ENABLE_CMD = OCF_LE_SET_SCAN_ENABLE | (OGF_LE_CTL << 10);
let LE_CREATE_CONN_CMD = OCF_LE_CREATE_CONN | (OGF_LE_CTL << 10);
let LE_CONN_UPDATE_CMD = OCF_LE_CONN_UPDATE | (OGF_LE_CTL << 10);
let LE_START_ENCRYPTION_CMD = OCF_LE_START_ENCRYPTION | (OGF_LE_CTL << 10);
let LE_SET_ADVERTISING_PARAMETERS_CMD = OCF_LE_SET_ADVERTISING_PARAMETERS | (OGF_LE_CTL << 10);
let LE_SET_ADVERTISING_DATA_CMD = OCF_LE_SET_ADVERTISING_DATA | (OGF_LE_CTL << 10);
let LE_SET_SCAN_RESPONSE_DATA_CMD = OCF_LE_SET_SCAN_RESPONSE_DATA | (OGF_LE_CTL << 10);
let LE_SET_ADVERTISE_ENABLE_CMD = OCF_LE_SET_ADVERTISE_ENABLE | (OGF_LE_CTL << 10);
let LE_LTK_NEG_REPLY_CMD = OCF_LE_LTK_NEG_REPLY | (OGF_LE_CTL << 10);
let HCI_OE_USER_ENDED_CONNECTION = 0x13;
let STATUS_MAPPER = require('./hci-status');
let Hci = function (obnizHci) {
    this._obnizHci = obnizHci;
    this._state = null;
    this._handleBuffers = {};
    this.on('stateChange', this.onStateChange.bind(this));
    this._socket = {
        write: data => {
            let arr = Array.from(data);
            this._obnizHci.write(arr);
        },
    };
    this._obnizHci.onread = this.onSocketData.bind(this);
};
util.inherits(Hci, events.EventEmitter);
Hci.STATUS_MAPPER = STATUS_MAPPER;
Hci.prototype.initWait = function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.reset();
        // this.setEventMask();
        // this.setLeEventMask();
        // this.readLocalVersion();
        // this.writeLeHostSupported();
        // this.readLeHostSupported();
        // this.readBdAddr();
        return new Promise(resolve => {
            this.once('stateChange', () => {
                // console.log('te');
                resolve();
            });
        });
    });
};
Hci.prototype.setEventMask = function () {
    let cmd = Buffer.alloc(12);
    let eventMask = Buffer.from('fffffbff07f8bf3d', 'hex');
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(SET_EVENT_MASK_CMD, 1);
    // length
    cmd.writeUInt8(eventMask.length, 3);
    eventMask.copy(cmd, 4);
    debug('set event mask - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.reset = function () {
    let cmd = Buffer.alloc(4);
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(OCF_RESET | (OGF_HOST_CTL << 10), 1);
    // length
    cmd.writeUInt8(0x00, 3);
    debug('reset - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.resetBuffers = function () {
    this._handleAclsInProgress = {};
    this._handleBuffers = {};
    this._aclOutQueue = [];
};
Hci.prototype.readLocalVersion = function () {
    let cmd = Buffer.alloc(4);
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(READ_LOCAL_VERSION_CMD, 1);
    // length
    cmd.writeUInt8(0x0, 3);
    debug('read local version - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.readBdAddr = function () {
    let cmd = Buffer.alloc(4);
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(READ_BD_ADDR_CMD, 1);
    // length
    cmd.writeUInt8(0x0, 3);
    debug('read bd addr - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.setLeEventMask = function () {
    let cmd = Buffer.alloc(12);
    let leEventMask = Buffer.from('1f00000000000000', 'hex');
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(LE_SET_EVENT_MASK_CMD, 1);
    // length
    cmd.writeUInt8(leEventMask.length, 3);
    leEventMask.copy(cmd, 4);
    debug('set le event mask - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.readLeHostSupported = function () {
    let cmd = Buffer.alloc(4);
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(READ_LE_HOST_SUPPORTED_CMD, 1);
    // length
    cmd.writeUInt8(0x00, 3);
    debug('read LE host supported - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.writeLeHostSupported = function () {
    let cmd = Buffer.alloc(6);
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(WRITE_LE_HOST_SUPPORTED_CMD, 1);
    // length
    cmd.writeUInt8(0x02, 3);
    // data
    cmd.writeUInt8(0x01, 4); // le
    cmd.writeUInt8(0x00, 5); // simul
    debug('write LE host supported - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.setScanParameters = function () {
    let cmd = Buffer.alloc(11);
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(LE_SET_SCAN_PARAMETERS_CMD, 1);
    // length
    cmd.writeUInt8(0x07, 3);
    // data
    cmd.writeUInt8(0x01, 4); // type: 0 -> passive, 1 -> active
    cmd.writeUInt16LE(0x0010, 5); // internal, ms * 1.6
    cmd.writeUInt16LE(0x0010, 7); // window, ms * 1.6
    cmd.writeUInt8(0x00, 9); // own address type: 0 -> public, 1 -> random
    cmd.writeUInt8(0x00, 10); // filter: 0 -> all event types
    debug('set scan parameters - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.setScanEnabled = function (enabled, filterDuplicates) {
    let cmd = Buffer.alloc(6);
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(LE_SET_SCAN_ENABLE_CMD, 1);
    // length
    cmd.writeUInt8(0x02, 3);
    // data
    cmd.writeUInt8(enabled ? 0x01 : 0x00, 4); // enable: 0 -> disabled, 1 -> enabled
    cmd.writeUInt8(filterDuplicates ? 0x01 : 0x00, 5); // duplicates: 0 -> duplicates, 0 -> duplicates
    debug('set scan enabled - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.createLeConn = function (address, addressType) {
    let cmd = Buffer.alloc(29);
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(LE_CREATE_CONN_CMD, 1);
    // length
    cmd.writeUInt8(0x19, 3);
    // data
    cmd.writeUInt16LE(0x0060, 4); // interval
    cmd.writeUInt16LE(0x0030, 6); // window
    cmd.writeUInt8(0x00, 8); // initiator filter
    cmd.writeUInt8(addressType === 'random' ? 0x01 : 0x00, 9); // peer address type
    Buffer.from(address
        .split(':')
        .reverse()
        .join(''), 'hex').copy(cmd, 10); // peer address
    cmd.writeUInt8(0x00, 16); // own address type
    cmd.writeUInt16LE(0x0006, 17); // min interval
    cmd.writeUInt16LE(0x000c, 19); // max interval
    cmd.writeUInt16LE(0x0000, 21); // latency
    cmd.writeUInt16LE(0x00c8, 23); // supervision timeout
    cmd.writeUInt16LE(0x0004, 25); // min ce length
    cmd.writeUInt16LE(0x0006, 27); // max ce length
    debug('create le conn - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.connUpdateLe = function (handle, minInterval, maxInterval, latency, supervisionTimeout) {
    let cmd = Buffer.alloc(18);
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(LE_CONN_UPDATE_CMD, 1);
    // length
    cmd.writeUInt8(0x0e, 3);
    // data
    cmd.writeUInt16LE(handle, 4);
    cmd.writeUInt16LE(Math.floor(minInterval / 1.25), 6); // min interval
    cmd.writeUInt16LE(Math.floor(maxInterval / 1.25), 8); // max interval
    cmd.writeUInt16LE(latency, 10); // latency
    cmd.writeUInt16LE(Math.floor(supervisionTimeout / 10), 12); // supervision timeout
    cmd.writeUInt16LE(0x0000, 14); // min ce length
    cmd.writeUInt16LE(0x0000, 16); // max ce length
    debug('conn update le - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.startLeEncryption = function (handle, random, diversifier, key) {
    let cmd = Buffer.alloc(32);
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(LE_START_ENCRYPTION_CMD, 1);
    // length
    cmd.writeUInt8(0x1c, 3);
    // data
    cmd.writeUInt16LE(handle, 4); // handle
    random.copy(cmd, 6);
    diversifier.copy(cmd, 14);
    key.copy(cmd, 16);
    debug('start le encryption - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.disconnect = function (handle, reason) {
    let cmd = Buffer.alloc(7);
    reason = reason || HCI_OE_USER_ENDED_CONNECTION;
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(DISCONNECT_CMD, 1);
    // length
    cmd.writeUInt8(0x03, 3);
    // data
    cmd.writeUInt16LE(handle, 4); // handle
    cmd.writeUInt8(reason, 6); // reason
    debug('disconnect - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.readRssi = function (handle) {
    let cmd = Buffer.alloc(6);
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(READ_RSSI_CMD, 1);
    // length
    cmd.writeUInt8(0x02, 3);
    // data
    cmd.writeUInt16LE(handle, 4); // handle
    debug('read rssi - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.writeAclDataPkt = function (handle, cid, data) {
    let pkt = Buffer.alloc(9 + data.length);
    // header
    pkt.writeUInt8(HCI_ACLDATA_PKT, 0);
    pkt.writeUInt16LE(handle | (ACL_START_NO_FLUSH << 12), 1);
    pkt.writeUInt16LE(data.length + 4, 3); // data length 1
    pkt.writeUInt16LE(data.length, 5); // data length 2
    pkt.writeUInt16LE(cid, 7);
    data.copy(pkt, 9);
    debug('write acl data pkt - writing: ' + pkt.toString('hex'));
    this._socket.write(pkt);
};
Hci.prototype.setAdvertisingParameters = function () {
    let cmd = Buffer.alloc(19);
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(LE_SET_ADVERTISING_PARAMETERS_CMD, 1);
    // length
    cmd.writeUInt8(15, 3);
    let advertisementInterval = Math.floor((process.env.BLENO_ADVERTISING_INTERVAL
        ? parseFloat(process.env.BLENO_ADVERTISING_INTERVAL)
        : 100) * 1.6);
    // data
    cmd.writeUInt16LE(advertisementInterval, 4); // min interval
    cmd.writeUInt16LE(advertisementInterval, 6); // max interval
    cmd.writeUInt8(0x00, 8); // adv type
    cmd.writeUInt8(0x00, 9); // own addr typ
    cmd.writeUInt8(0x00, 10); // direct addr type
    Buffer.from('000000000000', 'hex').copy(cmd, 11); // direct addr
    cmd.writeUInt8(0x07, 17);
    cmd.writeUInt8(0x00, 18);
    debug('set advertisement parameters - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.setAdvertisingData = function (data) {
    let cmd = Buffer.alloc(36);
    cmd.fill(0x00);
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(LE_SET_ADVERTISING_DATA_CMD, 1);
    // length
    cmd.writeUInt8(32, 3);
    // data
    cmd.writeUInt8(data.length, 4);
    data.copy(cmd, 5);
    debug('set advertisement data - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.setScanResponseData = function (data) {
    let cmd = Buffer.alloc(36);
    cmd.fill(0x00);
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(LE_SET_SCAN_RESPONSE_DATA_CMD, 1);
    // length
    cmd.writeUInt8(32, 3);
    // data
    cmd.writeUInt8(data.length, 4);
    data.copy(cmd, 5);
    debug('set scan response data - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.setAdvertiseEnable = function (enabled) {
    let cmd = Buffer.alloc(5);
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(LE_SET_ADVERTISE_ENABLE_CMD, 1);
    // length
    cmd.writeUInt8(0x01, 3);
    // data
    cmd.writeUInt8(enabled ? 0x01 : 0x00, 4); // enable: 0 -> disabled, 1 -> enabled
    debug('set advertise enable - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.leReadBufferSize = function () {
    let cmd = Buffer.alloc(4);
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(LE_READ_BUFFER_SIZE_CMD, 1);
    // length
    cmd.writeUInt8(0x0, 3);
    debug('le read buffer size - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.readBufferSize = function () {
    let cmd = Buffer.alloc(4);
    // header
    cmd.writeUInt8(HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(READ_BUFFER_SIZE_CMD, 1);
    // length
    cmd.writeUInt8(0x0, 3);
    debug('read buffer size - writing: ' + cmd.toString('hex'));
    this._socket.write(cmd);
};
Hci.prototype.queueAclDataPkt = function (handle, cid, data) {
    let hf = handle | (ACL_START_NO_FLUSH << 12);
    // l2cap pdu may be fragmented on hci level
    let l2capPdu = Buffer.alloc(4 + data.length);
    l2capPdu.writeUInt16LE(data.length, 0);
    l2capPdu.writeUInt16LE(cid, 2);
    data.copy(l2capPdu, 4);
    let fragId = 0;
    while (l2capPdu.length) {
        let frag = l2capPdu.slice(0, this._aclMtu);
        l2capPdu = l2capPdu.slice(frag.length);
        let pkt = Buffer.alloc(5 + frag.length);
        // hci header
        pkt.writeUInt8(HCI_ACLDATA_PKT, 0);
        pkt.writeUInt16LE(hf, 1);
        hf |= ACL_CONT << 12;
        pkt.writeUInt16LE(frag.length, 3); // hci pdu length
        frag.copy(pkt, 5);
        this._aclOutQueue.push({
            handle: handle,
            pkt: pkt,
            fragId: fragId++,
        });
    }
    this.pushAclOutQueue();
};
Hci.prototype.pushAclOutQueue = function () {
    debug('pushAclOutQueue');
    let inProgress = 0;
    for (let handle in this._handleAclsInProgress) {
        inProgress += this._handleAclsInProgress[handle];
    }
    debug(inProgress, this._aclMaxInProgress, this._aclOutQueue.length);
    while (inProgress < this._aclMaxInProgress && this._aclOutQueue.length) {
        inProgress++;
        this.writeOneAclDataPkt();
    }
    if (inProgress >= this._aclMaxInProgress && this._aclOutQueue.length) {
        debug('acl out queue congested');
        debug('\tin progress = ' + inProgress);
        debug('\twaiting = ' + this._aclOutQueue.length);
    }
};
Hci.prototype.writeOneAclDataPkt = function () {
    debug('writeOneAclDataPkt');
    let pkt = this._aclOutQueue.shift();
    this._handleAclsInProgress[pkt.handle]++;
    debug('write acl data pkt frag ' +
        pkt.fragId +
        ' handle ' +
        pkt.handle +
        ' - writing: ' +
        pkt.pkt.toString('hex'));
    this._socket.write(pkt.pkt);
};
Hci.prototype.onSocketData = function (array) {
    let data = Buffer.from(array);
    debug('onSocketData: ' + data.toString('hex'));
    let eventType = data.readUInt8(0);
    debug('\tevent type = ' + eventType);
    if (HCI_EVENT_PKT === eventType) {
        let subEventType = data.readUInt8(1);
        debug('\tsub event type = ' + subEventType);
        if (subEventType === EVT_DISCONN_COMPLETE) {
            let handle = data.readUInt16LE(4);
            let reason = data.readUInt8(6);
            debug('\t\thandle = ' + handle);
            debug('\t\treason = ' + reason);
            delete this._handleAclsInProgress[handle];
            let aclOutQueue = [];
            let discarded = 0;
            for (let i in this._aclOutQueue) {
                if (this._aclOutQueue[i].handle != handle) {
                    aclOutQueue.push(this._aclOutQueue[i]);
                }
                else {
                    discarded++;
                }
            }
            if (discarded) {
                debug('\t\tacls discarded = ' + discarded);
            }
            this._aclOutQueue = aclOutQueue;
            this.pushAclOutQueue();
            this.emit('disconnComplete', handle, reason);
        }
        else if (subEventType === EVT_ENCRYPT_CHANGE) {
            let handle = data.readUInt16LE(4);
            let encrypt = data.readUInt8(6);
            debug('\t\thandle = ' + handle);
            debug('\t\tencrypt = ' + encrypt);
            this.emit('encryptChange', handle, encrypt);
        }
        else if (subEventType === EVT_CMD_COMPLETE) {
            let ncmd = data.readUInt8(3);
            let cmd = data.readUInt16LE(4);
            let status = data.readUInt8(6);
            let result = data.slice(7);
            debug('\t\tncmd = ' + ncmd);
            debug('\t\tcmd = ' + cmd);
            debug('\t\tstatus = ' + status);
            debug('\t\tresult = ' + result.toString('hex'));
            this.processCmdCompleteEvent(cmd, status, result);
        }
        else if (subEventType === EVT_CMD_STATUS) {
            let status = data.readUInt8(3);
            let cmd = data.readUInt16LE(5);
            debug('\t\tstatus = ' + status);
            debug('\t\tcmd = ' + cmd);
            this.processCmdStatusEvent(cmd, status);
        }
        else if (subEventType === EVT_LE_META_EVENT) {
            let leMetaEventType = data.readUInt8(3);
            let leMetaEventStatus = data.readUInt8(4);
            let leMetaEventData = data.slice(5);
            debug('\t\tLE meta event type = ' + leMetaEventType);
            debug('\t\tLE meta event status = ' + leMetaEventStatus);
            debug('\t\tLE meta event data = ' + leMetaEventData.toString('hex'));
            this.processLeMetaEvent(leMetaEventType, leMetaEventStatus, leMetaEventData);
        }
        else if (subEventType === EVT_NUMBER_OF_COMPLETED_PACKETS) {
            let handles = data.readUInt8(3);
            for (let i = 0; i < handles; i++) {
                let handle = data.readUInt16LE(4 + i * 4);
                let pkts = data.readUInt16LE(6 + i * 4);
                debug('\thandle = ' + handle);
                debug('\t\tcompleted = ' + pkts);
                if (this._handleAclsInProgress[handle] === undefined) {
                    debug('\t\talready closed');
                    continue;
                }
                if (pkts > this._handleAclsInProgress[handle]) {
                    // Linux kernel may send acl packets by itself, so be ready for underflow
                    this._handleAclsInProgress[handle] = 0;
                }
                else {
                    this._handleAclsInProgress[handle] -= pkts;
                }
                debug('\t\tin progress = ' + this._handleAclsInProgress[handle]);
            }
            this.pushAclOutQueue();
        }
    }
    else if (HCI_ACLDATA_PKT === eventType) {
        let flags = data.readUInt16LE(1) >> 12;
        let handle = data.readUInt16LE(1) & 0x0fff;
        if (ACL_START === flags) {
            let cid = data.readUInt16LE(7);
            let length = data.readUInt16LE(5);
            let pktData = data.slice(9);
            debug('\t\tcid = ' + cid);
            if (length === pktData.length) {
                debug('\t\thandle = ' + handle);
                debug('\t\tdata = ' + pktData.toString('hex'));
                this.emit('aclDataPkt', handle, cid, pktData);
            }
            else {
                this._handleBuffers[handle] = {
                    length: length,
                    cid: cid,
                    data: pktData,
                };
            }
        }
        else if (ACL_CONT === flags) {
            if (!this._handleBuffers[handle] || !this._handleBuffers[handle].data) {
                return;
            }
            this._handleBuffers[handle].data = Buffer.concat([
                this._handleBuffers[handle].data,
                data.slice(5),
            ]);
            if (this._handleBuffers[handle].data.length ===
                this._handleBuffers[handle].length) {
                this.emit('aclDataPkt', handle, this._handleBuffers[handle].cid, this._handleBuffers[handle].data);
                delete this._handleBuffers[handle];
            }
        }
    }
    else if (HCI_COMMAND_PKT === eventType) {
        let cmd = data.readUInt16LE(1);
        let len = data.readUInt8(3);
        debug('\t\tcmd = ' + cmd);
        debug('\t\tdata len = ' + len);
        if (cmd === LE_SET_SCAN_ENABLE_CMD) {
            let enable = data.readUInt8(4) === 0x1;
            let filterDuplicates = data.readUInt8(5) === 0x1;
            debug('\t\t\tLE enable scan command');
            debug('\t\t\tenable scanning = ' + enable);
            debug('\t\t\tfilter duplicates = ' + filterDuplicates);
            this.emit('leScanEnableSetCmd', enable, filterDuplicates);
        }
    }
};
Hci.prototype.onSocketError = function (error) {
    debug('onSocketError: ' + error.message);
    if (error.message === 'Operation not permitted') {
        this.emit('stateChange', 'unauthorized');
    }
    else if (error.message === 'Network is down') {
        // no-op
    }
};
Hci.prototype.processCmdCompleteEvent = function (cmd, status, result) {
    if (cmd === RESET_CMD) {
        this.resetBuffers();
        this.setEventMask();
        this.setLeEventMask();
        this.readLocalVersion();
        this.readBdAddr();
        this.writeLeHostSupported();
        this.readLeHostSupported();
        this.leReadBufferSize();
    }
    else if (cmd === READ_LE_HOST_SUPPORTED_CMD) {
        if (status === 0) {
            let le = result.readUInt8(0);
            let simul = result.readUInt8(1);
            debug('\t\t\tle = ' + le);
            debug('\t\t\tsimul = ' + simul);
        }
    }
    else if (cmd === READ_LOCAL_VERSION_CMD) {
        let hciVer = result.readUInt8(0);
        let hciRev = result.readUInt16LE(1);
        let lmpVer = result.readInt8(3);
        let manufacturer = result.readUInt16LE(4);
        let lmpSubVer = result.readUInt16LE(6);
        if (hciVer < 0x06) {
            this.emit('stateChange', 'unsupported');
        }
        else if (this._state !== 'poweredOn') {
            this.setScanEnabled(false, true);
            this.setScanParameters();
        }
        this.emit('readLocalVersion', hciVer, hciRev, lmpVer, manufacturer, lmpSubVer);
    }
    else if (cmd === READ_BD_ADDR_CMD) {
        this.addressType = 'public';
        this.address = result
            .toString('hex')
            .match(/.{1,2}/g)
            .reverse()
            .join(':');
        debug('address = ' + this.address);
        this.emit('addressChange', this.address);
    }
    else if (cmd === LE_SET_SCAN_PARAMETERS_CMD) {
        this.emit('stateChange', 'poweredOn');
        this.emit('leScanParametersSet');
    }
    else if (cmd === LE_SET_SCAN_ENABLE_CMD) {
        this.emit('leScanEnableSet', status);
    }
    else if (cmd === LE_SET_ADVERTISING_PARAMETERS_CMD) {
        this.emit('stateChange', 'poweredOn');
        this.emit('leAdvertisingParametersSet', status);
    }
    else if (cmd === LE_SET_ADVERTISING_DATA_CMD) {
        this.emit('leAdvertisingDataSet', status);
    }
    else if (cmd === LE_SET_SCAN_RESPONSE_DATA_CMD) {
        this.emit('leScanResponseDataSet', status);
    }
    else if (cmd === LE_SET_ADVERTISE_ENABLE_CMD) {
        this.emit('leAdvertiseEnableSet', status);
    }
    else if (cmd === READ_RSSI_CMD) {
        let handle = result.readUInt16LE(0);
        let rssi = result.readInt8(2);
        debug('\t\t\thandle = ' + handle);
        debug('\t\t\trssi = ' + rssi);
        this.emit('rssiRead', handle, rssi);
    }
    else if (cmd === LE_LTK_NEG_REPLY_CMD) {
        let handle = result.readUInt16LE(0);
        debug('\t\t\thandle = ' + handle);
        this.emit('leLtkNegReply', handle);
    }
    else if (cmd === LE_READ_BUFFER_SIZE_CMD) {
        if (!status) {
            this.processLeReadBufferSize(result);
        }
    }
    else if (cmd === READ_BUFFER_SIZE_CMD) {
        if (!status) {
            let aclMtu = result.readUInt16LE(0);
            let aclMaxInProgress = result.readUInt16LE(3);
            // sanity
            if (aclMtu && aclMaxInProgress) {
                debug('br/edr acl mtu = ' + aclMtu);
                debug('br/edr acl max pkts = ' + aclMaxInProgress);
                this._aclMtu = aclMtu;
                this._aclMaxInProgress = aclMaxInProgress;
            }
        }
    }
};
Hci.prototype.processLeMetaEvent = function (eventType, status, data) {
    if (eventType === EVT_LE_CONN_COMPLETE) {
        this.processLeConnComplete(status, data);
    }
    else if (eventType === EVT_LE_ADVERTISING_REPORT) {
        this.processLeAdvertisingReport(status, data);
    }
    else if (eventType === EVT_LE_CONN_UPDATE_COMPLETE) {
        this.processLeConnUpdateComplete(status, data);
    }
};
Hci.prototype.processLeConnComplete = function (status, data) {
    let handle = data.readUInt16LE(0);
    let role = data.readUInt8(2);
    let addressType = data.readUInt8(3) === 0x01 ? 'random' : 'public';
    let address = data
        .slice(4, 10)
        .toString('hex')
        .match(/.{1,2}/g)
        .reverse()
        .join(':');
    let interval = data.readUInt16LE(10) * 1.25;
    let latency = data.readUInt16LE(12); // TODO: multiplier?
    let supervisionTimeout = data.readUInt16LE(14) * 10;
    let masterClockAccuracy = data.readUInt8(16); // TODO: multiplier?
    debug('\t\t\thandle = ' + handle);
    debug('\t\t\trole = ' + role);
    debug('\t\t\taddress type = ' + addressType);
    debug('\t\t\taddress = ' + address);
    debug('\t\t\tinterval = ' + interval);
    debug('\t\t\tlatency = ' + latency);
    debug('\t\t\tsupervision timeout = ' + supervisionTimeout);
    debug('\t\t\tmaster clock accuracy = ' + masterClockAccuracy);
    this._handleAclsInProgress[handle] = 0;
    this.emit('leConnComplete', status, handle, role, addressType, address, interval, latency, supervisionTimeout, masterClockAccuracy);
};
Hci.prototype.processLeAdvertisingReport = function (count, data) {
    for (let i = 0; i < count; i++) {
        let type = data.readUInt8(0);
        let addressType = data.readUInt8(1) === 0x01 ? 'random' : 'public';
        let address = data
            .slice(2, 8)
            .toString('hex')
            .match(/.{1,2}/g)
            .reverse()
            .join(':');
        let eirLength = data.readUInt8(8);
        let eir = data.slice(9, eirLength + 9);
        let rssi = data.readInt8(eirLength + 9);
        debug('\t\t\ttype = ' + type);
        debug('\t\t\taddress = ' + address);
        debug('\t\t\taddress type = ' + addressType);
        debug('\t\t\teir = ' + eir.toString('hex'));
        debug('\t\t\trssi = ' + rssi);
        this.emit('leAdvertisingReport', 0, type, address, addressType, eir, rssi);
        data = data.slice(eirLength + 10);
    }
};
Hci.prototype.processLeConnUpdateComplete = function (status, data) {
    let handle = data.readUInt16LE(0);
    let interval = data.readUInt16LE(2) * 1.25;
    let latency = data.readUInt16LE(4); // TODO: multiplier?
    let supervisionTimeout = data.readUInt16LE(6) * 10;
    debug('\t\t\thandle = ' + handle);
    debug('\t\t\tinterval = ' + interval);
    debug('\t\t\tlatency = ' + latency);
    debug('\t\t\tsupervision timeout = ' + supervisionTimeout);
    this.emit('leConnUpdateComplete', status, handle, interval, latency, supervisionTimeout);
};
Hci.prototype.processCmdStatusEvent = function (cmd, status) {
    if (cmd === LE_CREATE_CONN_CMD) {
        if (status !== 0) {
            this.emit('leConnComplete', status);
        }
    }
};
Hci.prototype.processLeReadBufferSize = function (result) {
    let aclMtu = result.readUInt16LE(0);
    let aclMaxInProgress = result.readUInt8(2);
    if (!aclMtu) {
        // as per Bluetooth specs
        debug('falling back to br/edr buffer size');
        this.readBufferSize();
    }
    else {
        debug('le acl mtu = ' + aclMtu);
        debug('le acl max in progress = ' + aclMaxInProgress);
        this._aclMtu = aclMtu;
        this._aclMaxInProgress = aclMaxInProgress;
    }
};
Hci.prototype.onStateChange = function (state) {
    this._state = state;
};
module.exports = Hci;
