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
class Hci extends events.EventEmitter {
    constructor(obnizHci) {
        super();
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
    }
    initWait() {
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
    }
    setEventMask() {
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
    }
    reset() {
        let cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(OCF_RESET | (OGF_HOST_CTL << 10), 1);
        // length
        cmd.writeUInt8(0x00, 3);
        debug('reset - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
    }
    resetBuffers() {
        this._handleAclsInProgress = {};
        this._handleBuffers = {};
        this._aclOutQueue = [];
    }
    readLocalVersion() {
        let cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(READ_LOCAL_VERSION_CMD, 1);
        // length
        cmd.writeUInt8(0x0, 3);
        debug('read local version - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
    }
    readBdAddr() {
        let cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(READ_BD_ADDR_CMD, 1);
        // length
        cmd.writeUInt8(0x0, 3);
        debug('read bd addr - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
    }
    setLeEventMask() {
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
    }
    readLeHostSupported() {
        let cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(READ_LE_HOST_SUPPORTED_CMD, 1);
        // length
        cmd.writeUInt8(0x00, 3);
        debug('read LE host supported - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
    }
    writeLeHostSupported() {
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
    }
    setScanParameters() {
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
    }
    setScanEnabled(enabled, filterDuplicates) {
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
    }
    createLeConn(address, addressType) {
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
    }
    connUpdateLe(handle, minInterval, maxInterval, latency, supervisionTimeout) {
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
    }
    startLeEncryption(handle, random, diversifier, key) {
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
    }
    disconnect(handle, reason) {
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
    }
    readRssi(handle) {
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
    }
    writeAclDataPkt(handle, cid, data) {
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
    }
    setAdvertisingParameters() {
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
    }
    setAdvertisingData(data) {
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
    }
    setScanResponseData(data) {
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
    }
    setAdvertiseEnable(enabled) {
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
    }
    leReadBufferSize() {
        let cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(LE_READ_BUFFER_SIZE_CMD, 1);
        // length
        cmd.writeUInt8(0x0, 3);
        debug('le read buffer size - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
    }
    readBufferSize() {
        let cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(READ_BUFFER_SIZE_CMD, 1);
        // length
        cmd.writeUInt8(0x0, 3);
        debug('read buffer size - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
    }
    queueAclDataPkt(handle, cid, data) {
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
    }
    pushAclOutQueue() {
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
    }
    writeOneAclDataPkt() {
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
    }
    onSocketData(array) {
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
    }
    onSocketError(error) {
        debug('onSocketError: ' + error.message);
        if (error.message === 'Operation not permitted') {
            this.emit('stateChange', 'unauthorized');
        }
        else if (error.message === 'Network is down') {
            // no-op
        }
    }
    processCmdCompleteEvent(cmd, status, result) {
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
    }
    processLeMetaEvent(eventType, status, data) {
        if (eventType === EVT_LE_CONN_COMPLETE) {
            this.processLeConnComplete(status, data);
        }
        else if (eventType === EVT_LE_ADVERTISING_REPORT) {
            this.processLeAdvertisingReport(status, data);
        }
        else if (eventType === EVT_LE_CONN_UPDATE_COMPLETE) {
            this.processLeConnUpdateComplete(status, data);
        }
    }
    processLeConnComplete(status, data) {
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
    }
    processLeAdvertisingReport(count, data) {
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
    }
    processLeConnUpdateComplete(status, data) {
        let handle = data.readUInt16LE(0);
        let interval = data.readUInt16LE(2) * 1.25;
        let latency = data.readUInt16LE(4); // TODO: multiplier?
        let supervisionTimeout = data.readUInt16LE(6) * 10;
        debug('\t\t\thandle = ' + handle);
        debug('\t\t\tinterval = ' + interval);
        debug('\t\t\tlatency = ' + latency);
        debug('\t\t\tsupervision timeout = ' + supervisionTimeout);
        this.emit('leConnUpdateComplete', status, handle, interval, latency, supervisionTimeout);
    }
    processCmdStatusEvent(cmd, status) {
        if (cmd === LE_CREATE_CONN_CMD) {
            if (status !== 0) {
                this.emit('leConnComplete', status);
            }
        }
    }
    processLeReadBufferSize(result) {
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
    }
    onStateChange(state) {
        this._state = state;
    }
}
Hci.STATUS_MAPPER = STATUS_MAPPER;
module.exports = Hci;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvcHJvdG9jb2wvaGNpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx1Q0FBdUM7QUFDdkMsTUFBTSxLQUFLLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0FBRXZCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUUvQixJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDM0IsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBQzNCLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQztBQUV6QixJQUFJLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUM5QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDcEIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBRXJCLElBQUksb0JBQW9CLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLElBQUksa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0FBQzlCLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzVCLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQztBQUMxQixJQUFJLCtCQUErQixHQUFHLElBQUksQ0FBQztBQUMzQyxJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQztBQUU3QixJQUFJLG9CQUFvQixHQUFHLElBQUksQ0FBQztBQUNoQyxJQUFJLHlCQUF5QixHQUFHLElBQUksQ0FBQztBQUNyQyxJQUFJLDJCQUEyQixHQUFHLElBQUksQ0FBQztBQUV2QyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDeEIsSUFBSSxjQUFjLEdBQUcsTUFBTSxDQUFDO0FBRTVCLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQztBQUN4QixJQUFJLGtCQUFrQixHQUFHLE1BQU0sQ0FBQztBQUNoQyxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDdkIsSUFBSSwwQkFBMEIsR0FBRyxNQUFNLENBQUM7QUFDeEMsSUFBSSwyQkFB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O0lBQ0gsQ0FBQztJQUVELHVCQUF1QixDQUFDLE1BQU07UUFDNUIsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxJQUFJLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLHlCQUF5QjtZQUN6QixLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDdkI7YUFBTTtZQUNMLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDaEMsS0FBSyxDQUFDLDJCQUEyQixHQUFHLGdCQUFnQixDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDdEIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGdCQUFnQixDQUFDO1NBQzNDO0lBQ0gsQ0FBQztJQUVELGFBQWEsQ0FBQyxLQUFLO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7Q0FDRjtBQUVELEdBQUcsQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO0FBQ2xDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDIiwiZmlsZSI6Im9ibml6L2xpYnMvZW1iZWRzL2JsZUhjaS9wcm90b2NvbC9oY2kuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsZXQgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdoY2knKTtcbmNvbnN0IGRlYnVnID0gKCkgPT4ge307XG5cbmxldCBldmVudHMgPSByZXF1aXJlKCdldmVudHMnKTtcblxubGV0IEhDSV9DT01NQU5EX1BLVCA9IDB4MDE7XG5sZXQgSENJX0FDTERBVEFfUEtUID0gMHgwMjtcbmxldCBIQ0lfRVZFTlRfUEtUID0gMHgwNDtcblxubGV0IEFDTF9TVEFSVF9OT19GTFVTSCA9IDB4MDA7XG5sZXQgQUNMX0NPTlQgPSAweDAxO1xubGV0IEFDTF9TVEFSVCA9IDB4MDI7XG5cbmxldCBFVlRfRElTQ09OTl9DT01QTEVURSA9IDB4MDU7XG5sZXQgRVZUX0VOQ1JZUFRfQ0hBTkdFID0gMHgwODtcbmxldCBFVlRfQ01EX0NPTVBMRVRFID0gMHgwZTtcbmxldCBFVlRfQ01EX1NUQVRVUyA9IDB4MGY7XG5sZXQgRVZUX05VTUJFUl9PRl9DT01QTEVURURfUEFDS0VUUyA9IDB4MTM7XG5sZXQgRVZUX0xFX01FVEFfRVZFTlQgPSAweDNlO1xuXG5sZXQgRVZUX0xFX0NPTk5fQ09NUExFVEUgPSAweDAxO1xubGV0IEVWVF9MRV9BRFZFUlRJU0lOR19SRVBPUlQgPSAweDAyO1xubGV0IEVWVF9MRV9DT05OX1VQREFURV9DT01QTEVURSA9IDB4MDM7XG5cbmxldCBPR0ZfTElOS19DVEwgPSAweDAxO1xubGV0IE9DRl9ESVNDT05ORUNUID0gMHgwMDA2O1xuXG5sZXQgT0dGX0hPU1RfQ1RMID0gMHgwMztcbmxldCBPQ0ZfU0VUX0VWRU5UX01BU0sgPSAweDAwMDE7XG5sZXQgT0NGX1JFU0VUID0gMHgwMDAzO1xubGV0IE9DRl9SRUFEX0xFX0hPU1RfU1VQUE9SVEVEID0gMHgwMDZjO1xubGV0IE9DRl9XUklURV9MRV9IT1NUX1NVUFBPUlRFRCA9IDB4MDA2ZDtcblxubGV0IE9HRl9JTkZPX1BBUkFNID0gMHgwNDtcbmxldCBPQ0ZfUkVBRF9MT0NBTF9WRVJTSU9OID0gMHgwMDAxO1xubGV0IE9DRl9SRUFEX0JVRkZFUl9TSVpFID0gMHgwMDA1O1xubGV0IE9DRl9SRUFEX0JEX0FERFIgPSAweDAwMDk7XG5cbmxldCBPR0ZfU1RBVFVTX1BBUkFNID0gMHgwNTtcbmxldCBPQ0ZfUkVBRF9SU1NJID0gMHgwMDA1O1xuXG5sZXQgT0dGX0xFX0NUTCA9IDB4MDg7XG5sZXQgT0NGX0xFX1NFVF9FVkVOVF9NQVNLID0gMHgwMDAxO1xubGV0IE9DRl9MRV9SRUFEX0JVRkZFUl9TSVpFID0gMHgwMDAyO1xubGV0IE9DRl9MRV9TRVRfQURWRVJUSVNJTkdfUEFSQU1FVEVSUyA9IDB4MDAwNjtcbmxldCBPQ0ZfTEVfU0VUX0FEVkVSVElTSU5HX0RBVEEgPSAweDAwMDg7XG5sZXQgT0NGX0xFX1NFVF9TQ0FOX1JFU1BPTlNFX0RBVEEgPSAweDAwMDk7XG5sZXQgT0NGX0xFX1NFVF9BRFZFUlRJU0VfRU5BQkxFID0gMHgwMDBhO1xubGV0IE9DRl9MRV9TRVRfU0NBTl9QQVJBTUVURVJTID0gMHgwMDBiO1xubGV0IE9DRl9MRV9TRVRfU0NBTl9FTkFCTEUgPSAweDAwMGM7XG5sZXQgT0NGX0xFX0NSRUFURV9DT05OID0gMHgwMDBkO1xubGV0IE9DRl9MRV9DT05OX1VQREFURSA9IDB4MDAxMztcbmxldCBPQ0ZfTEVfU1RBUlRfRU5DUllQVElPTiA9IDB4MDAxOTtcbmxldCBPQ0ZfTEVfTFRLX05FR19SRVBMWSA9IDB4MDAxYjtcblxubGV0IERJU0NPTk5FQ1RfQ01EID0gT0NGX0RJU0NPTk5FQ1QgfCAoT0dGX0xJTktfQ1RMIDw8IDEwKTtcblxubGV0IFNFVF9FVkVOVF9NQVNLX0NNRCA9IE9DRl9TRVRfRVZFTlRfTUFTSyB8IChPR0ZfSE9TVF9DVEwgPDwgMTApO1xubGV0IFJFU0VUX0NNRCA9IE9DRl9SRVNFVCB8IChPR0ZfSE9TVF9DVEwgPDwgMTApO1xubGV0IFJFQURfTEVfSE9TVF9TVVBQT1JURURfQ01EID1cbiAgT0NGX1JFQURfTEVfSE9TVF9TVVBQT1JURUQgfCAoT0dGX0hPU1RfQ1RMIDw8IDEwKTtcbmxldCBXUklURV9MRV9IT1NUX1NVUFBPUlRFRF9DTUQgPVxuICBPQ0ZfV1JJVEVfTEVfSE9TVF9TVVBQT1JURUQgfCAoT0dGX0hPU1RfQ1RMIDw8IDEwKTtcblxubGV0IFJFQURfTE9DQUxfVkVSU0lPTl9DTUQgPSBPQ0ZfUkVBRF9MT0NBTF9WRVJTSU9OIHwgKE9HRl9JTkZPX1BBUkFNIDw8IDEwKTtcbmxldCBSRUFEX0JVRkZFUl9TSVpFX0NNRCA9IE9DRl9SRUFEX0JVRkZFUl9TSVpFIHwgKE9HRl9JTkZPX1BBUkFNIDw8IDEwKTtcbmxldCBSRUFEX0JEX0FERFJfQ01EID0gT0NGX1JFQURfQkRfQUREUiB8IChPR0ZfSU5GT19QQVJBTSA8PCAxMCk7XG5cbmxldCBSRUFEX1JTU0lfQ01EID0gT0NGX1JFQURfUlNTSSB8IChPR0ZfU1RBVFVTX1BBUkFNIDw8IDEwKTtcblxubGV0IExFX1NFVF9FVkVOVF9NQVNLX0NNRCA9IE9DRl9MRV9TRVRfRVZFTlRfTUFTSyB8IChPR0ZfTEVfQ1RMIDw8IDEwKTtcbmxldCBMRV9SRUFEX0JVRkZFUl9TSVpFX0NNRCA9IE9DRl9MRV9SRUFEX0JVRkZFUl9TSVpFIHwgKE9HRl9MRV9DVEwgPDwgMTApO1xubGV0IExFX1NFVF9TQ0FOX1BBUkFNRVRFUlNfQ01EID1cbiAgT0NGX0xFX1NFVF9TQ0FOX1BBUkFNRVRFUlMgfCAoT0dGX0xFX0NUTCA8PCAxMCk7XG5sZXQgTEVfU0VUX1NDQU5fRU5BQkxFX0NNRCA9IE9DRl9MRV9TRVRfU0NBTl9FTkFCTEUgfCAoT0dGX0xFX0NUTCA8PCAxMCk7XG5sZXQgTEVfQ1JFQVRFX0NPTk5fQ01EID0gT0NGX0xFX0NSRUFURV9DT05OIHwgKE9HRl9MRV9DVEwgPDwgMTApO1xubGV0IExFX0NPTk5fVVBEQVRFX0NNRCA9IE9DRl9MRV9DT05OX1VQREFURSB8IChPR0ZfTEVfQ1RMIDw8IDEwKTtcbmxldCBMRV9TVEFSVF9FTkNSWVBUSU9OX0NNRCA9IE9DRl9MRV9TVEFSVF9FTkNSWVBUSU9OIHwgKE9HRl9MRV9DVEwgPDwgMTApO1xubGV0IExFX1NFVF9BRFZFUlRJU0lOR19QQVJBTUVURVJTX0NNRCA9XG4gIE9DRl9MRV9TRVRfQURWRVJUSVNJTkdfUEFSQU1FVEVSUyB8IChPR0ZfTEVfQ1RMIDw8IDEwKTtcblxubGV0IExFX1NFVF9BRFZFUlRJU0lOR19EQVRBX0NNRCA9XG4gIE9DRl9MRV9TRVRfQURWRVJUSVNJTkdfREFUQSB8IChPR0ZfTEVfQ1RMIDw8IDEwKTtcbmxldCBMRV9TRVRfU0NBTl9SRVNQT05TRV9EQVRBX0NNRCA9XG4gIE9DRl9MRV9TRVRfU0NBTl9SRVNQT05TRV9EQVRBIHwgKE9HRl9MRV9DVEwgPDwgMTApO1xubGV0IExFX1NFVF9BRFZFUlRJU0VfRU5BQkxFX0NNRCA9XG4gIE9DRl9MRV9TRVRfQURWRVJUSVNFX0VOQUJMRSB8IChPR0ZfTEVfQ1RMIDw8IDEwKTtcbmxldCBMRV9MVEtfTkVHX1JFUExZX0NNRCA9IE9DRl9MRV9MVEtfTkVHX1JFUExZIHwgKE9HRl9MRV9DVEwgPDwgMTApO1xuXG5sZXQgSENJX09FX1VTRVJfRU5ERURfQ09OTkVDVElPTiA9IDB4MTM7XG5cbmxldCBTVEFUVVNfTUFQUEVSID0gcmVxdWlyZSgnLi9oY2ktc3RhdHVzJyk7XG5cbmNsYXNzIEhjaSBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcihvYm5pekhjaSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fb2JuaXpIY2kgPSBvYm5pekhjaTtcbiAgICB0aGlzLl9zdGF0ZSA9IG51bGw7XG5cbiAgICB0aGlzLl9oYW5kbGVCdWZmZXJzID0ge307XG5cbiAgICB0aGlzLm9uKCdzdGF0ZUNoYW5nZScsIHRoaXMub25TdGF0ZUNoYW5nZS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuX3NvY2tldCA9IHtcbiAgICAgIHdyaXRlOiBkYXRhID0+IHtcbiAgICAgICAgbGV0IGFyciA9IEFycmF5LmZyb20oZGF0YSk7XG4gICAgICAgIHRoaXMuX29ibml6SGNpLndyaXRlKGFycik7XG4gICAgICB9LFxuICAgIH07XG4gICAgdGhpcy5fb2JuaXpIY2kub25yZWFkID0gdGhpcy5vblNvY2tldERhdGEuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRXYWl0KCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICAvLyB0aGlzLnNldEV2ZW50TWFzaygpO1xuICAgIC8vIHRoaXMuc2V0TGVFdmVudE1hc2soKTtcbiAgICAvLyB0aGlzLnJlYWRMb2NhbFZlcnNpb24oKTtcbiAgICAvLyB0aGlzLndyaXRlTGVIb3N0U3VwcG9ydGVkKCk7XG4gICAgLy8gdGhpcy5yZWFkTGVIb3N0U3VwcG9ydGVkKCk7XG4gICAgLy8gdGhpcy5yZWFkQmRBZGRyKCk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLm9uY2UoJ3N0YXRlQ2hhbmdlJywgKCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygndGUnKTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXRFdmVudE1hc2soKSB7XG4gICAgbGV0IGNtZCA9IEJ1ZmZlci5hbGxvYygxMik7XG4gICAgbGV0IGV2ZW50TWFzayA9IEJ1ZmZlci5mcm9tKCdmZmZmZmJmZjA3ZjhiZjNkJywgJ2hleCcpO1xuXG4gICAgLy8gaGVhZGVyXG4gICAgY21kLndyaXRlVUludDgoSENJX0NPTU1BTkRfUEtULCAwKTtcbiAgICBjbWQud3JpdGVVSW50MTZMRShTRVRfRVZFTlRfTUFTS19DTUQsIDEpO1xuXG4gICAgLy8gbGVuZ3RoXG4gICAgY21kLndyaXRlVUludDgoZXZlbnRNYXNrLmxlbmd0aCwgMyk7XG5cbiAgICBldmVudE1hc2suY29weShjbWQsIDQpO1xuXG4gICAgZGVidWcoJ3NldCBldmVudCBtYXNrIC0gd3JpdGluZzogJyArIGNtZC50b1N0cmluZygnaGV4JykpO1xuICAgIHRoaXMuX3NvY2tldC53cml0ZShjbWQpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgbGV0IGNtZCA9IEJ1ZmZlci5hbGxvYyg0KTtcblxuICAgIC8vIGhlYWRlclxuICAgIGNtZC53cml0ZVVJbnQ4KEhDSV9DT01NQU5EX1BLVCwgMCk7XG4gICAgY21kLndyaXRlVUludDE2TEUoT0NGX1JFU0VUIHwgKE9HRl9IT1NUX0NUTCA8PCAxMCksIDEpO1xuXG4gICAgLy8gbGVuZ3RoXG4gICAgY21kLndyaXRlVUludDgoMHgwMCwgMyk7XG5cbiAgICBkZWJ1ZygncmVzZXQgLSB3cml0aW5nOiAnICsgY21kLnRvU3RyaW5nKCdoZXgnKSk7XG4gICAgdGhpcy5fc29ja2V0LndyaXRlKGNtZCk7XG4gIH1cblxuICByZXNldEJ1ZmZlcnMoKSB7XG4gICAgdGhpcy5faGFuZGxlQWNsc0luUHJvZ3Jlc3MgPSB7fTtcbiAgICB0aGlzLl9oYW5kbGVCdWZmZXJzID0ge307XG4gICAgdGhpcy5fYWNsT3V0UXVldWUgPSBbXTtcbiAgfVxuXG4gIHJlYWRMb2NhbFZlcnNpb24oKSB7XG4gICAgbGV0IGNtZCA9IEJ1ZmZlci5hbGxvYyg0KTtcblxuICAgIC8vIGhlYWRlclxuICAgIGNtZC53cml0ZVVJbnQ4KEhDSV9DT01NQU5EX1BLVCwgMCk7XG4gICAgY21kLndyaXRlVUludDE2TEUoUkVBRF9MT0NBTF9WRVJTSU9OX0NNRCwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OCgweDAsIDMpO1xuXG4gICAgZGVidWcoJ3JlYWQgbG9jYWwgdmVyc2lvbiAtIHdyaXRpbmc6ICcgKyBjbWQudG9TdHJpbmcoJ2hleCcpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHJlYWRCZEFkZHIoKSB7XG4gICAgbGV0IGNtZCA9IEJ1ZmZlci5hbGxvYyg0KTtcblxuICAgIC8vIGhlYWRlclxuICAgIGNtZC53cml0ZVVJbnQ4KEhDSV9DT01NQU5EX1BLVCwgMCk7XG4gICAgY21kLndyaXRlVUludDE2TEUoUkVBRF9CRF9BRERSX0NNRCwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OCgweDAsIDMpO1xuXG4gICAgZGVidWcoJ3JlYWQgYmQgYWRkciAtIHdyaXRpbmc6ICcgKyBjbWQudG9TdHJpbmcoJ2hleCcpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHNldExlRXZlbnRNYXNrKCkge1xuICAgIGxldCBjbWQgPSBCdWZmZXIuYWxsb2MoMTIpO1xuICAgIGxldCBsZUV2ZW50TWFzayA9IEJ1ZmZlci5mcm9tKCcxZjAwMDAwMDAwMDAwMDAwJywgJ2hleCcpO1xuXG4gICAgLy8gaGVhZGVyXG4gICAgY21kLndyaXRlVUludDgoSENJX0NPTU1BTkRfUEtULCAwKTtcbiAgICBjbWQud3JpdGVVSW50MTZMRShMRV9TRVRfRVZFTlRfTUFTS19DTUQsIDEpO1xuXG4gICAgLy8gbGVuZ3RoXG4gICAgY21kLndyaXRlVUludDgobGVFdmVudE1hc2subGVuZ3RoLCAzKTtcblxuICAgIGxlRXZlbnRNYXNrLmNvcHkoY21kLCA0KTtcblxuICAgIGRlYnVnKCdzZXQgbGUgZXZlbnQgbWFzayAtIHdyaXRpbmc6ICcgKyBjbWQudG9TdHJpbmcoJ2hleCcpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHJlYWRMZUhvc3RTdXBwb3J0ZWQoKSB7XG4gICAgbGV0IGNtZCA9IEJ1ZmZlci5hbGxvYyg0KTtcblxuICAgIC8vIGhlYWRlclxuICAgIGNtZC53cml0ZVVJbnQ4KEhDSV9DT01NQU5EX1BLVCwgMCk7XG4gICAgY21kLndyaXRlVUludDE2TEUoUkVBRF9MRV9IT1NUX1NVUFBPUlRFRF9DTUQsIDEpO1xuXG4gICAgLy8gbGVuZ3RoXG4gICAgY21kLndyaXRlVUludDgoMHgwMCwgMyk7XG5cbiAgICBkZWJ1ZygncmVhZCBMRSBob3N0IHN1cHBvcnRlZCAtIHdyaXRpbmc6ICcgKyBjbWQudG9TdHJpbmcoJ2hleCcpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHdyaXRlTGVIb3N0U3VwcG9ydGVkKCkge1xuICAgIGxldCBjbWQgPSBCdWZmZXIuYWxsb2MoNik7XG5cbiAgICAvLyBoZWFkZXJcbiAgICBjbWQud3JpdGVVSW50OChIQ0lfQ09NTUFORF9QS1QsIDApO1xuICAgIGNtZC53cml0ZVVJbnQxNkxFKFdSSVRFX0xFX0hPU1RfU1VQUE9SVEVEX0NNRCwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OCgweDAyLCAzKTtcblxuICAgIC8vIGRhdGFcbiAgICBjbWQud3JpdGVVSW50OCgweDAxLCA0KTsgLy8gbGVcbiAgICBjbWQud3JpdGVVSW50OCgweDAwLCA1KTsgLy8gc2ltdWxcblxuICAgIGRlYnVnKCd3cml0ZSBMRSBob3N0IHN1cHBvcnRlZCAtIHdyaXRpbmc6ICcgKyBjbWQudG9TdHJpbmcoJ2hleCcpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHNldFNjYW5QYXJhbWV0ZXJzKCkge1xuICAgIGxldCBjbWQgPSBCdWZmZXIuYWxsb2MoMTEpO1xuXG4gICAgLy8gaGVhZGVyXG4gICAgY21kLndyaXRlVUludDgoSENJX0NPTU1BTkRfUEtULCAwKTtcbiAgICBjbWQud3JpdGVVSW50MTZMRShMRV9TRVRfU0NBTl9QQVJBTUVURVJTX0NNRCwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OCgweDA3LCAzKTtcblxuICAgIC8vIGRhdGFcbiAgICBjbWQud3JpdGVVSW50OCgweDAxLCA0KTsgLy8gdHlwZTogMCAtPiBwYXNzaXZlLCAxIC0+IGFjdGl2ZVxuICAgIGNtZC53cml0ZVVJbnQxNkxFKDB4MDAxMCwgNSk7IC8vIGludGVybmFsLCBtcyAqIDEuNlxuICAgIGNtZC53cml0ZVVJbnQxNkxFKDB4MDAxMCwgNyk7IC8vIHdpbmRvdywgbXMgKiAxLjZcbiAgICBjbWQud3JpdGVVSW50OCgweDAwLCA5KTsgLy8gb3duIGFkZHJlc3MgdHlwZTogMCAtPiBwdWJsaWMsIDEgLT4gcmFuZG9tXG4gICAgY21kLndyaXRlVUludDgoMHgwMCwgMTApOyAvLyBmaWx0ZXI6IDAgLT4gYWxsIGV2ZW50IHR5cGVzXG5cbiAgICBkZWJ1Zygnc2V0IHNjYW4gcGFyYW1ldGVycyAtIHdyaXRpbmc6ICcgKyBjbWQudG9TdHJpbmcoJ2hleCcpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHNldFNjYW5FbmFibGVkKGVuYWJsZWQsIGZpbHRlckR1cGxpY2F0ZXMpIHtcbiAgICBsZXQgY21kID0gQnVmZmVyLmFsbG9jKDYpO1xuXG4gICAgLy8gaGVhZGVyXG4gICAgY21kLndyaXRlVUludDgoSENJX0NPTU1BTkRfUEtULCAwKTtcbiAgICBjbWQud3JpdGVVSW50MTZMRShMRV9TRVRfU0NBTl9FTkFCTEVfQ01ELCAxKTtcblxuICAgIC8vIGxlbmd0aFxuICAgIGNtZC53cml0ZVVJbnQ4KDB4MDIsIDMpO1xuXG4gICAgLy8gZGF0YVxuICAgIGNtZC53cml0ZVVJbnQ4KGVuYWJsZWQgPyAweDAxIDogMHgwMCwgNCk7IC8vIGVuYWJsZTogMCAtPiBkaXNhYmxlZCwgMSAtPiBlbmFibGVkXG4gICAgY21kLndyaXRlVUludDgoZmlsdGVyRHVwbGljYXRlcyA/IDB4MDEgOiAweDAwLCA1KTsgLy8gZHVwbGljYXRlczogMCAtPiBkdXBsaWNhdGVzLCAwIC0+IGR1cGxpY2F0ZXNcblxuICAgIGRlYnVnKCdzZXQgc2NhbiBlbmFibGVkIC0gd3JpdGluZzogJyArIGNtZC50b1N0cmluZygnaGV4JykpO1xuICAgIHRoaXMuX3NvY2tldC53cml0ZShjbWQpO1xuICB9XG5cbiAgY3JlYXRlTGVDb25uKGFkZHJlc3MsIGFkZHJlc3NUeXBlKSB7XG4gICAgbGV0IGNtZCA9IEJ1ZmZlci5hbGxvYygyOSk7XG5cbiAgICAvLyBoZWFkZXJcbiAgICBjbWQud3JpdGVVSW50OChIQ0lfQ09NTUFORF9QS1QsIDApO1xuICAgIGNtZC53cml0ZVVJbnQxNkxFKExFX0NSRUFURV9DT05OX0NNRCwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OCgweDE5LCAzKTtcblxuICAgIC8vIGRhdGFcbiAgICBjbWQud3JpdGVVSW50MTZMRSgweDAwNjAsIDQpOyAvLyBpbnRlcnZhbFxuICAgIGNtZC53cml0ZVVJbnQxNkxFKDB4MDAzMCwgNik7IC8vIHdpbmRvd1xuICAgIGNtZC53cml0ZVVJbnQ4KDB4MDAsIDgpOyAvLyBpbml0aWF0b3IgZmlsdGVyXG5cbiAgICBjbWQud3JpdGVVSW50OChhZGRyZXNzVHlwZSA9PT0gJ3JhbmRvbScgPyAweDAxIDogMHgwMCwgOSk7IC8vIHBlZXIgYWRkcmVzcyB0eXBlXG4gICAgQnVmZmVyLmZyb20oXG4gICAgICBhZGRyZXNzXG4gICAgICAgIC5zcGxpdCgnOicpXG4gICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgLmpvaW4oJycpLFxuICAgICAgJ2hleCdcbiAgICApLmNvcHkoY21kLCAxMCk7IC8vIHBlZXIgYWRkcmVzc1xuXG4gICAgY21kLndyaXRlVUludDgoMHgwMCwgMTYpOyAvLyBvd24gYWRkcmVzcyB0eXBlXG5cbiAgICBjbWQud3JpdGVVSW50MTZMRSgweDAwMDYsIDE3KTsgLy8gbWluIGludGVydmFsXG4gICAgY21kLndyaXRlVUludDE2TEUoMHgwMDBjLCAxOSk7IC8vIG1heCBpbnRlcnZhbFxuICAgIGNtZC53cml0ZVVJbnQxNkxFKDB4MDAwMCwgMjEpOyAvLyBsYXRlbmN5XG4gICAgY21kLndyaXRlVUludDE2TEUoMHgwMGM4LCAyMyk7IC8vIHN1cGVydmlzaW9uIHRpbWVvdXRcbiAgICBjbWQud3JpdGVVSW50MTZMRSgweDAwMDQsIDI1KTsgLy8gbWluIGNlIGxlbmd0aFxuICAgIGNtZC53cml0ZVVJbnQxNkxFKDB4MDAwNiwgMjcpOyAvLyBtYXggY2UgbGVuZ3RoXG5cbiAgICBkZWJ1ZygnY3JlYXRlIGxlIGNvbm4gLSB3cml0aW5nOiAnICsgY21kLnRvU3RyaW5nKCdoZXgnKSk7XG4gICAgdGhpcy5fc29ja2V0LndyaXRlKGNtZCk7XG4gIH1cblxuICBjb25uVXBkYXRlTGUoaGFuZGxlLCBtaW5JbnRlcnZhbCwgbWF4SW50ZXJ2YWwsIGxhdGVuY3ksIHN1cGVydmlzaW9uVGltZW91dCkge1xuICAgIGxldCBjbWQgPSBCdWZmZXIuYWxsb2MoMTgpO1xuXG4gICAgLy8gaGVhZGVyXG4gICAgY21kLndyaXRlVUludDgoSENJX0NPTU1BTkRfUEtULCAwKTtcbiAgICBjbWQud3JpdGVVSW50MTZMRShMRV9DT05OX1VQREFURV9DTUQsIDEpO1xuXG4gICAgLy8gbGVuZ3RoXG4gICAgY21kLndyaXRlVUludDgoMHgwZSwgMyk7XG5cbiAgICAvLyBkYXRhXG4gICAgY21kLndyaXRlVUludDE2TEUoaGFuZGxlLCA0KTtcbiAgICBjbWQud3JpdGVVSW50MTZMRShNYXRoLmZsb29yKG1pbkludGVydmFsIC8gMS4yNSksIDYpOyAvLyBtaW4gaW50ZXJ2YWxcbiAgICBjbWQud3JpdGVVSW50MTZMRShNYXRoLmZsb29yKG1heEludGVydmFsIC8gMS4yNSksIDgpOyAvLyBtYXggaW50ZXJ2YWxcbiAgICBjbWQud3JpdGVVSW50MTZMRShsYXRlbmN5LCAxMCk7IC8vIGxhdGVuY3lcbiAgICBjbWQud3JpdGVVSW50MTZMRShNYXRoLmZsb29yKHN1cGVydmlzaW9uVGltZW91dCAvIDEwKSwgMTIpOyAvLyBzdXBlcnZpc2lvbiB0aW1lb3V0XG4gICAgY21kLndyaXRlVUludDE2TEUoMHgwMDAwLCAxNCk7IC8vIG1pbiBjZSBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50MTZMRSgweDAwMDAsIDE2KTsgLy8gbWF4IGNlIGxlbmd0aFxuXG4gICAgZGVidWcoJ2Nvbm4gdXBkYXRlIGxlIC0gd3JpdGluZzogJyArIGNtZC50b1N0cmluZygnaGV4JykpO1xuICAgIHRoaXMuX3NvY2tldC53cml0ZShjbWQpO1xuICB9XG5cbiAgc3RhcnRMZUVuY3J5cHRpb24oaGFuZGxlLCByYW5kb20sIGRpdmVyc2lmaWVyLCBrZXkpIHtcbiAgICBsZXQgY21kID0gQnVmZmVyLmFsbG9jKDMyKTtcblxuICAgIC8vIGhlYWRlclxuICAgIGNtZC53cml0ZVVJbnQ4KEhDSV9DT01NQU5EX1BLVCwgMCk7XG4gICAgY21kLndyaXRlVUludDE2TEUoTEVfU1RBUlRfRU5DUllQVElPTl9DTUQsIDEpO1xuXG4gICAgLy8gbGVuZ3RoXG4gICAgY21kLndyaXRlVUludDgoMHgxYywgMyk7XG5cbiAgICAvLyBkYXRhXG4gICAgY21kLndyaXRlVUludDE2TEUoaGFuZGxlLCA0KTsgLy8gaGFuZGxlXG4gICAgcmFuZG9tLmNvcHkoY21kLCA2KTtcbiAgICBkaXZlcnNpZmllci5jb3B5KGNtZCwgMTQpO1xuICAgIGtleS5jb3B5KGNtZCwgMTYpO1xuXG4gICAgZGVidWcoJ3N0YXJ0IGxlIGVuY3J5cHRpb24gLSB3cml0aW5nOiAnICsgY21kLnRvU3RyaW5nKCdoZXgnKSk7XG4gICAgdGhpcy5fc29ja2V0LndyaXRlKGNtZCk7XG4gIH1cblxuICBkaXNjb25uZWN0KGhhbmRsZSwgcmVhc29uKSB7XG4gICAgbGV0IGNtZCA9IEJ1ZmZlci5hbGxvYyg3KTtcblxuICAgIHJlYXNvbiA9IHJlYXNvbiB8fCBIQ0lfT0VfVVNFUl9FTkRFRF9DT05ORUNUSU9OO1xuXG4gICAgLy8gaGVhZGVyXG4gICAgY21kLndyaXRlVUludDgoSENJX0NPTU1BTkRfUEtULCAwKTtcbiAgICBjbWQud3JpdGVVSW50MTZMRShESVNDT05ORUNUX0NNRCwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OCgweDAzLCAzKTtcblxuICAgIC8vIGRhdGFcbiAgICBjbWQud3JpdGVVSW50MTZMRShoYW5kbGUsIDQpOyAvLyBoYW5kbGVcbiAgICBjbWQud3JpdGVVSW50OChyZWFzb24sIDYpOyAvLyByZWFzb25cblxuICAgIGRlYnVnKCdkaXNjb25uZWN0IC0gd3JpdGluZzogJyArIGNtZC50b1N0cmluZygnaGV4JykpO1xuICAgIHRoaXMuX3NvY2tldC53cml0ZShjbWQpO1xuICB9XG5cbiAgcmVhZFJzc2koaGFuZGxlKSB7XG4gICAgbGV0IGNtZCA9IEJ1ZmZlci5hbGxvYyg2KTtcblxuICAgIC8vIGhlYWRlclxuICAgIGNtZC53cml0ZVVJbnQ4KEhDSV9DT01NQU5EX1BLVCwgMCk7XG4gICAgY21kLndyaXRlVUludDE2TEUoUkVBRF9SU1NJX0NNRCwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OCgweDAyLCAzKTtcblxuICAgIC8vIGRhdGFcbiAgICBjbWQud3JpdGVVSW50MTZMRShoYW5kbGUsIDQpOyAvLyBoYW5kbGVcblxuICAgIGRlYnVnKCdyZWFkIHJzc2kgLSB3cml0aW5nOiAnICsgY21kLnRvU3RyaW5nKCdoZXgnKSk7XG4gICAgdGhpcy5fc29ja2V0LndyaXRlKGNtZCk7XG4gIH1cblxuICB3cml0ZUFjbERhdGFQa3QoaGFuZGxlLCBjaWQsIGRhdGEpIHtcbiAgICBsZXQgcGt0ID0gQnVmZmVyLmFsbG9jKDkgKyBkYXRhLmxlbmd0aCk7XG5cbiAgICAvLyBoZWFkZXJcbiAgICBwa3Qud3JpdGVVSW50OChIQ0lfQUNMREFUQV9QS1QsIDApO1xuICAgIHBrdC53cml0ZVVJbnQxNkxFKGhhbmRsZSB8IChBQ0xfU1RBUlRfTk9fRkxVU0ggPDwgMTIpLCAxKTtcbiAgICBwa3Qud3JpdGVVSW50MTZMRShkYXRhLmxlbmd0aCArIDQsIDMpOyAvLyBkYXRhIGxlbmd0aCAxXG4gICAgcGt0LndyaXRlVUludDE2TEUoZGF0YS5sZW5ndGgsIDUpOyAvLyBkYXRhIGxlbmd0aCAyXG4gICAgcGt0LndyaXRlVUludDE2TEUoY2lkLCA3KTtcblxuICAgIGRhdGEuY29weShwa3QsIDkpO1xuXG4gICAgZGVidWcoJ3dyaXRlIGFjbCBkYXRhIHBrdCAtIHdyaXRpbmc6ICcgKyBwa3QudG9TdHJpbmcoJ2hleCcpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUocGt0KTtcbiAgfVxuXG4gIHNldEFkdmVydGlzaW5nUGFyYW1ldGVycygpIHtcbiAgICBsZXQgY21kID0gQnVmZmVyLmFsbG9jKDE5KTtcblxuICAgIC8vIGhlYWRlclxuICAgIGNtZC53cml0ZVVJbnQ4KEhDSV9DT01NQU5EX1BLVCwgMCk7XG4gICAgY21kLndyaXRlVUludDE2TEUoTEVfU0VUX0FEVkVSVElTSU5HX1BBUkFNRVRFUlNfQ01ELCAxKTtcblxuICAgIC8vIGxlbmd0aFxuICAgIGNtZC53cml0ZVVJbnQ4KDE1LCAzKTtcblxuICAgIGxldCBhZHZlcnRpc2VtZW50SW50ZXJ2YWwgPSBNYXRoLmZsb29yKFxuICAgICAgKHByb2Nlc3MuZW52LkJMRU5PX0FEVkVSVElTSU5HX0lOVEVSVkFMXG4gICAgICAgID8gcGFyc2VGbG9hdChwcm9jZXNzLmVudi5CTEVOT19BRFZFUlRJU0lOR19JTlRFUlZBTClcbiAgICAgICAgOiAxMDApICogMS42XG4gICAgKTtcblxuICAgIC8vIGRhdGFcbiAgICBjbWQud3JpdGVVSW50MTZMRShhZHZlcnRpc2VtZW50SW50ZXJ2YWwsIDQpOyAvLyBtaW4gaW50ZXJ2YWxcbiAgICBjbWQud3JpdGVVSW50MTZMRShhZHZlcnRpc2VtZW50SW50ZXJ2YWwsIDYpOyAvLyBtYXggaW50ZXJ2YWxcbiAgICBjbWQud3JpdGVVSW50OCgweDAwLCA4KTsgLy8gYWR2IHR5cGVcbiAgICBjbWQud3JpdGVVSW50OCgweDAwLCA5KTsgLy8gb3duIGFkZHIgdHlwXG4gICAgY21kLndyaXRlVUludDgoMHgwMCwgMTApOyAvLyBkaXJlY3QgYWRkciB0eXBlXG4gICAgQnVmZmVyLmZyb20oJzAwMDAwMDAwMDAwMCcsICdoZXgnKS5jb3B5KGNtZCwgMTEpOyAvLyBkaXJlY3QgYWRkclxuICAgIGNtZC53cml0ZVVJbnQ4KDB4MDcsIDE3KTtcbiAgICBjbWQud3JpdGVVSW50OCgweDAwLCAxOCk7XG5cbiAgICBkZWJ1Zygnc2V0IGFkdmVydGlzZW1lbnQgcGFyYW1ldGVycyAtIHdyaXRpbmc6ICcgKyBjbWQudG9TdHJpbmcoJ2hleCcpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHNldEFkdmVydGlzaW5nRGF0YShkYXRhKSB7XG4gICAgbGV0IGNtZCA9IEJ1ZmZlci5hbGxvYygzNik7XG5cbiAgICBjbWQuZmlsbCgweDAwKTtcblxuICAgIC8vIGhlYWRlclxuICAgIGNtZC53cml0ZVVJbnQ4KEhDSV9DT01NQU5EX1BLVCwgMCk7XG4gICAgY21kLndyaXRlVUludDE2TEUoTEVfU0VUX0FEVkVSVElTSU5HX0RBVEFfQ01ELCAxKTtcblxuICAgIC8vIGxlbmd0aFxuICAgIGNtZC53cml0ZVVJbnQ4KDMyLCAzKTtcblxuICAgIC8vIGRhdGFcbiAgICBjbWQud3JpdGVVSW50OChkYXRhLmxlbmd0aCwgNCk7XG4gICAgZGF0YS5jb3B5KGNtZCwgNSk7XG5cbiAgICBkZWJ1Zygnc2V0IGFkdmVydGlzZW1lbnQgZGF0YSAtIHdyaXRpbmc6ICcgKyBjbWQudG9TdHJpbmcoJ2hleCcpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHNldFNjYW5SZXNwb25zZURhdGEoZGF0YSkge1xuICAgIGxldCBjbWQgPSBCdWZmZXIuYWxsb2MoMzYpO1xuXG4gICAgY21kLmZpbGwoMHgwMCk7XG5cbiAgICAvLyBoZWFkZXJcbiAgICBjbWQud3JpdGVVSW50OChIQ0lfQ09NTUFORF9QS1QsIDApO1xuICAgIGNtZC53cml0ZVVJbnQxNkxFKExFX1NFVF9TQ0FOX1JFU1BPTlNFX0RBVEFfQ01ELCAxKTtcblxuICAgIC8vIGxlbmd0aFxuICAgIGNtZC53cml0ZVVJbnQ4KDMyLCAzKTtcblxuICAgIC8vIGRhdGFcbiAgICBjbWQud3JpdGVVSW50OChkYXRhLmxlbmd0aCwgNCk7XG4gICAgZGF0YS5jb3B5KGNtZCwgNSk7XG5cbiAgICBkZWJ1Zygnc2V0IHNjYW4gcmVzcG9uc2UgZGF0YSAtIHdyaXRpbmc6ICcgKyBjbWQudG9TdHJpbmcoJ2hleCcpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHNldEFkdmVydGlzZUVuYWJsZShlbmFibGVkKSB7XG4gICAgbGV0IGNtZCA9IEJ1ZmZlci5hbGxvYyg1KTtcblxuICAgIC8vIGhlYWRlclxuICAgIGNtZC53cml0ZVVJbnQ4KEhDSV9DT01NQU5EX1BLVCwgMCk7XG4gICAgY21kLndyaXRlVUludDE2TEUoTEVfU0VUX0FEVkVSVElTRV9FTkFCTEVfQ01ELCAxKTtcblxuICAgIC8vIGxlbmd0aFxuICAgIGNtZC53cml0ZVVJbnQ4KDB4MDEsIDMpO1xuXG4gICAgLy8gZGF0YVxuICAgIGNtZC53cml0ZVVJbnQ4KGVuYWJsZWQgPyAweDAxIDogMHgwMCwgNCk7IC8vIGVuYWJsZTogMCAtPiBkaXNhYmxlZCwgMSAtPiBlbmFibGVkXG5cbiAgICBkZWJ1Zygnc2V0IGFkdmVydGlzZSBlbmFibGUgLSB3cml0aW5nOiAnICsgY21kLnRvU3RyaW5nKCdoZXgnKSk7XG4gICAgdGhpcy5fc29ja2V0LndyaXRlKGNtZCk7XG4gIH1cblxuICBsZVJlYWRCdWZmZXJTaXplKCkge1xuICAgIGxldCBjbWQgPSBCdWZmZXIuYWxsb2MoNCk7XG5cbiAgICAvLyBoZWFkZXJcbiAgICBjbWQud3JpdGVVSW50OChIQ0lfQ09NTUFORF9QS1QsIDApO1xuICAgIGNtZC53cml0ZVVJbnQxNkxFKExFX1JFQURfQlVGRkVSX1NJWkVfQ01ELCAxKTtcblxuICAgIC8vIGxlbmd0aFxuICAgIGNtZC53cml0ZVVJbnQ4KDB4MCwgMyk7XG5cbiAgICBkZWJ1ZygnbGUgcmVhZCBidWZmZXIgc2l6ZSAtIHdyaXRpbmc6ICcgKyBjbWQudG9TdHJpbmcoJ2hleCcpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHJlYWRCdWZmZXJTaXplKCkge1xuICAgIGxldCBjbWQgPSBCdWZmZXIuYWxsb2MoNCk7XG5cbiAgICAvLyBoZWFkZXJcbiAgICBjbWQud3JpdGVVSW50OChIQ0lfQ09NTUFORF9QS1QsIDApO1xuICAgIGNtZC53cml0ZVVJbnQxNkxFKFJFQURfQlVGRkVSX1NJWkVfQ01ELCAxKTtcblxuICAgIC8vIGxlbmd0aFxuICAgIGNtZC53cml0ZVVJbnQ4KDB4MCwgMyk7XG5cbiAgICBkZWJ1ZygncmVhZCBidWZmZXIgc2l6ZSAtIHdyaXRpbmc6ICcgKyBjbWQudG9TdHJpbmcoJ2hleCcpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHF1ZXVlQWNsRGF0YVBrdChoYW5kbGUsIGNpZCwgZGF0YSkge1xuICAgIGxldCBoZiA9IGhhbmRsZSB8IChBQ0xfU1RBUlRfTk9fRkxVU0ggPDwgMTIpO1xuICAgIC8vIGwyY2FwIHBkdSBtYXkgYmUgZnJhZ21lbnRlZCBvbiBoY2kgbGV2ZWxcbiAgICBsZXQgbDJjYXBQZHUgPSBCdWZmZXIuYWxsb2MoNCArIGRhdGEubGVuZ3RoKTtcbiAgICBsMmNhcFBkdS53cml0ZVVJbnQxNkxFKGRhdGEubGVuZ3RoLCAwKTtcbiAgICBsMmNhcFBkdS53cml0ZVVJbnQxNkxFKGNpZCwgMik7XG4gICAgZGF0YS5jb3B5KGwyY2FwUGR1LCA0KTtcbiAgICBsZXQgZnJhZ0lkID0gMDtcblxuICAgIHdoaWxlIChsMmNhcFBkdS5sZW5ndGgpIHtcbiAgICAgIGxldCBmcmFnID0gbDJjYXBQZHUuc2xpY2UoMCwgdGhpcy5fYWNsTXR1KTtcbiAgICAgIGwyY2FwUGR1ID0gbDJjYXBQZHUuc2xpY2UoZnJhZy5sZW5ndGgpO1xuICAgICAgbGV0IHBrdCA9IEJ1ZmZlci5hbGxvYyg1ICsgZnJhZy5sZW5ndGgpO1xuXG4gICAgICAvLyBoY2kgaGVhZGVyXG4gICAgICBwa3Qud3JpdGVVSW50OChIQ0lfQUNMREFUQV9QS1QsIDApO1xuICAgICAgcGt0LndyaXRlVUludDE2TEUoaGYsIDEpO1xuICAgICAgaGYgfD0gQUNMX0NPTlQgPDwgMTI7XG4gICAgICBwa3Qud3JpdGVVSW50MTZMRShmcmFnLmxlbmd0aCwgMyk7IC8vIGhjaSBwZHUgbGVuZ3RoXG5cbiAgICAgIGZyYWcuY29weShwa3QsIDUpO1xuXG4gICAgICB0aGlzLl9hY2xPdXRRdWV1ZS5wdXNoKHtcbiAgICAgICAgaGFuZGxlOiBoYW5kbGUsXG4gICAgICAgIHBrdDogcGt0LFxuICAgICAgICBmcmFnSWQ6IGZyYWdJZCsrLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5wdXNoQWNsT3V0UXVldWUoKTtcbiAgfVxuXG4gIHB1c2hBY2xPdXRRdWV1ZSgpIHtcbiAgICBkZWJ1ZygncHVzaEFjbE91dFF1ZXVlJyk7XG4gICAgbGV0IGluUHJvZ3Jlc3MgPSAwO1xuICAgIGZvciAobGV0IGhhbmRsZSBpbiB0aGlzLl9oYW5kbGVBY2xzSW5Qcm9ncmVzcykge1xuICAgICAgaW5Qcm9ncmVzcyArPSB0aGlzLl9oYW5kbGVBY2xzSW5Qcm9ncmVzc1toYW5kbGVdO1xuICAgIH1cbiAgICBkZWJ1ZyhpblByb2dyZXNzLCB0aGlzLl9hY2xNYXhJblByb2dyZXNzLCB0aGlzLl9hY2xPdXRRdWV1ZS5sZW5ndGgpO1xuICAgIHdoaWxlIChpblByb2dyZXNzIDwgdGhpcy5fYWNsTWF4SW5Qcm9ncmVzcyAmJiB0aGlzLl9hY2xPdXRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgIGluUHJvZ3Jlc3MrKztcbiAgICAgIHRoaXMud3JpdGVPbmVBY2xEYXRhUGt0KCk7XG4gICAgfVxuXG4gICAgaWYgKGluUHJvZ3Jlc3MgPj0gdGhpcy5fYWNsTWF4SW5Qcm9ncmVzcyAmJiB0aGlzLl9hY2xPdXRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgIGRlYnVnKCdhY2wgb3V0IHF1ZXVlIGNvbmdlc3RlZCcpO1xuICAgICAgZGVidWcoJ1xcdGluIHByb2dyZXNzID0gJyArIGluUHJvZ3Jlc3MpO1xuICAgICAgZGVidWcoJ1xcdHdhaXRpbmcgPSAnICsgdGhpcy5fYWNsT3V0UXVldWUubGVuZ3RoKTtcbiAgICB9XG4gIH1cblxuICB3cml0ZU9uZUFjbERhdGFQa3QoKSB7XG4gICAgZGVidWcoJ3dyaXRlT25lQWNsRGF0YVBrdCcpO1xuICAgIGxldCBwa3QgPSB0aGlzLl9hY2xPdXRRdWV1ZS5zaGlmdCgpO1xuICAgIHRoaXMuX2hhbmRsZUFjbHNJblByb2dyZXNzW3BrdC5oYW5kbGVdKys7XG4gICAgZGVidWcoXG4gICAgICAnd3JpdGUgYWNsIGRhdGEgcGt0IGZyYWcgJyArXG4gICAgICAgIHBrdC5mcmFnSWQgK1xuICAgICAgICAnIGhhbmRsZSAnICtcbiAgICAgICAgcGt0LmhhbmRsZSArXG4gICAgICAgICcgLSB3cml0aW5nOiAnICtcbiAgICAgICAgcGt0LnBrdC50b1N0cmluZygnaGV4JylcbiAgICApO1xuICAgIHRoaXMuX3NvY2tldC53cml0ZShwa3QucGt0KTtcbiAgfVxuXG4gIG9uU29ja2V0RGF0YShhcnJheSkge1xuICAgIGxldCBkYXRhID0gQnVmZmVyLmZyb20oYXJyYXkpO1xuICAgIGRlYnVnKCdvblNvY2tldERhdGE6ICcgKyBkYXRhLnRvU3RyaW5nKCdoZXgnKSk7XG5cbiAgICBsZXQgZXZlbnRUeXBlID0gZGF0YS5yZWFkVUludDgoMCk7XG5cbiAgICBkZWJ1ZygnXFx0ZXZlbnQgdHlwZSA9ICcgKyBldmVudFR5cGUpO1xuXG4gICAgaWYgKEhDSV9FVkVOVF9QS1QgPT09IGV2ZW50VHlwZSkge1xuICAgICAgbGV0IHN1YkV2ZW50VHlwZSA9IGRhdGEucmVhZFVJbnQ4KDEpO1xuXG4gICAgICBkZWJ1ZygnXFx0c3ViIGV2ZW50IHR5cGUgPSAnICsgc3ViRXZlbnRUeXBlKTtcblxuICAgICAgaWYgKHN1YkV2ZW50VHlwZSA9PT0gRVZUX0RJU0NPTk5fQ09NUExFVEUpIHtcbiAgICAgICAgbGV0IGhhbmRsZSA9IGRhdGEucmVhZFVJbnQxNkxFKDQpO1xuICAgICAgICBsZXQgcmVhc29uID0gZGF0YS5yZWFkVUludDgoNik7XG5cbiAgICAgICAgZGVidWcoJ1xcdFxcdGhhbmRsZSA9ICcgKyBoYW5kbGUpO1xuICAgICAgICBkZWJ1ZygnXFx0XFx0cmVhc29uID0gJyArIHJlYXNvbik7XG5cbiAgICAgICAgZGVsZXRlIHRoaXMuX2hhbmRsZUFjbHNJblByb2dyZXNzW2hhbmRsZV07XG4gICAgICAgIGxldCBhY2xPdXRRdWV1ZSA9IFtdO1xuICAgICAgICBsZXQgZGlzY2FyZGVkID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSBpbiB0aGlzLl9hY2xPdXRRdWV1ZSkge1xuICAgICAgICAgIGlmICh0aGlzLl9hY2xPdXRRdWV1ZVtpXS5oYW5kbGUgIT0gaGFuZGxlKSB7XG4gICAgICAgICAgICBhY2xPdXRRdWV1ZS5wdXNoKHRoaXMuX2FjbE91dFF1ZXVlW2ldKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGlzY2FyZGVkKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkaXNjYXJkZWQpIHtcbiAgICAgICAgICBkZWJ1ZygnXFx0XFx0YWNscyBkaXNjYXJkZWQgPSAnICsgZGlzY2FyZGVkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hY2xPdXRRdWV1ZSA9IGFjbE91dFF1ZXVlO1xuICAgICAgICB0aGlzLnB1c2hBY2xPdXRRdWV1ZSgpO1xuXG4gICAgICAgIHRoaXMuZW1pdCgnZGlzY29ubkNvbXBsZXRlJywgaGFuZGxlLCByZWFzb24pO1xuICAgICAgfSBlbHNlIGlmIChzdWJFdmVudFR5cGUgPT09IEVWVF9FTkNSWVBUX0NIQU5HRSkge1xuICAgICAgICBsZXQgaGFuZGxlID0gZGF0YS5yZWFkVUludDE2TEUoNCk7XG4gICAgICAgIGxldCBlbmNyeXB0ID0gZGF0YS5yZWFkVUludDgoNik7XG5cbiAgICAgICAgZGVidWcoJ1xcdFxcdGhhbmRsZSA9ICcgKyBoYW5kbGUpO1xuICAgICAgICBkZWJ1ZygnXFx0XFx0ZW5jcnlwdCA9ICcgKyBlbmNyeXB0KTtcblxuICAgICAgICB0aGlzLmVtaXQoJ2VuY3J5cHRDaGFuZ2UnLCBoYW5kbGUsIGVuY3J5cHQpO1xuICAgICAgfSBlbHNlIGlmIChzdWJFdmVudFR5cGUgPT09IEVWVF9DTURfQ09NUExFVEUpIHtcbiAgICAgICAgbGV0IG5jbWQgPSBkYXRhLnJlYWRVSW50OCgzKTtcbiAgICAgICAgbGV0IGNtZCA9IGRhdGEucmVhZFVJbnQxNkxFKDQpO1xuICAgICAgICBsZXQgc3RhdHVzID0gZGF0YS5yZWFkVUludDgoNik7XG4gICAgICAgIGxldCByZXN1bHQgPSBkYXRhLnNsaWNlKDcpO1xuXG4gICAgICAgIGRlYnVnKCdcXHRcXHRuY21kID0gJyArIG5jbWQpO1xuICAgICAgICBkZWJ1ZygnXFx0XFx0Y21kID0gJyArIGNtZCk7XG4gICAgICAgIGRlYnVnKCdcXHRcXHRzdGF0dXMgPSAnICsgc3RhdHVzKTtcbiAgICAgICAgZGVidWcoJ1xcdFxcdHJlc3VsdCA9ICcgKyByZXN1bHQudG9TdHJpbmcoJ2hleCcpKTtcblxuICAgICAgICB0aGlzLnByb2Nlc3NDbWRDb21wbGV0ZUV2ZW50KGNtZCwgc3RhdHVzLCByZXN1bHQpO1xuICAgICAgfSBlbHNlIGlmIChzdWJFdmVudFR5cGUgPT09IEVWVF9DTURfU1RBVFVTKSB7XG4gICAgICAgIGxldCBzdGF0dXMgPSBkYXRhLnJlYWRVSW50OCgzKTtcbiAgICAgICAgbGV0IGNtZCA9IGRhdGEucmVhZFVJbnQxNkxFKDUpO1xuXG4gICAgICAgIGRlYnVnKCdcXHRcXHRzdGF0dXMgPSAnICsgc3RhdHVzKTtcbiAgICAgICAgZGVidWcoJ1xcdFxcdGNtZCA9ICcgKyBjbWQpO1xuXG4gICAgICAgIHRoaXMucHJvY2Vzc0NtZFN0YXR1c0V2ZW50KGNtZCwgc3RhdHVzKTtcbiAgICAgIH0gZWxzZSBpZiAoc3ViRXZlbnRUeXBlID09PSBFVlRfTEVfTUVUQV9FVkVOVCkge1xuICAgICAgICBsZXQgbGVNZXRhRXZlbnRUeXBlID0gZGF0YS5yZWFkVUludDgoMyk7XG4gICAgICAgIGxldCBsZU1ldGFFdmVudFN0YXR1cyA9IGRhdGEucmVhZFVJbnQ4KDQpO1xuICAgICAgICBsZXQgbGVNZXRhRXZlbnREYXRhID0gZGF0YS5zbGljZSg1KTtcblxuICAgICAgICBkZWJ1ZygnXFx0XFx0TEUgbWV0YSBldmVudCB0eXBlID0gJyArIGxlTWV0YUV2ZW50VHlwZSk7XG4gICAgICAgIGRlYnVnKCdcXHRcXHRMRSBtZXRhIGV2ZW50IHN0YXR1cyA9ICcgKyBsZU1ldGFFdmVudFN0YXR1cyk7XG4gICAgICAgIGRlYnVnKCdcXHRcXHRMRSBtZXRhIGV2ZW50IGRhdGEgPSAnICsgbGVNZXRhRXZlbnREYXRhLnRvU3RyaW5nKCdoZXgnKSk7XG5cbiAgICAgICAgdGhpcy5wcm9jZXNzTGVNZXRhRXZlbnQoXG4gICAgICAgICAgbGVNZXRhRXZlbnRUeXBlLFxuICAgICAgICAgIGxlTWV0YUV2ZW50U3RhdHVzLFxuICAgICAgICAgIGxlTWV0YUV2ZW50RGF0YVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChzdWJFdmVudFR5cGUgPT09IEVWVF9OVU1CRVJfT0ZfQ09NUExFVEVEX1BBQ0tFVFMpIHtcbiAgICAgICAgbGV0IGhhbmRsZXMgPSBkYXRhLnJlYWRVSW50OCgzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYW5kbGVzOyBpKyspIHtcbiAgICAgICAgICBsZXQgaGFuZGxlID0gZGF0YS5yZWFkVUludDE2TEUoNCArIGkgKiA0KTtcbiAgICAgICAgICBsZXQgcGt0cyA9IGRhdGEucmVhZFVJbnQxNkxFKDYgKyBpICogNCk7XG4gICAgICAgICAgZGVidWcoJ1xcdGhhbmRsZSA9ICcgKyBoYW5kbGUpO1xuICAgICAgICAgIGRlYnVnKCdcXHRcXHRjb21wbGV0ZWQgPSAnICsgcGt0cyk7XG4gICAgICAgICAgaWYgKHRoaXMuX2hhbmRsZUFjbHNJblByb2dyZXNzW2hhbmRsZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZGVidWcoJ1xcdFxcdGFscmVhZHkgY2xvc2VkJyk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHBrdHMgPiB0aGlzLl9oYW5kbGVBY2xzSW5Qcm9ncmVzc1toYW5kbGVdKSB7XG4gICAgICAgICAgICAvLyBMaW51eCBrZXJuZWwgbWF5IHNlbmQgYWNsIHBhY2tldHMgYnkgaXRzZWxmLCBzbyBiZSByZWFkeSBmb3IgdW5kZXJmbG93XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVBY2xzSW5Qcm9ncmVzc1toYW5kbGVdID0gMDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlQWNsc0luUHJvZ3Jlc3NbaGFuZGxlXSAtPSBwa3RzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWJ1ZygnXFx0XFx0aW4gcHJvZ3Jlc3MgPSAnICsgdGhpcy5faGFuZGxlQWNsc0luUHJvZ3Jlc3NbaGFuZGxlXSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wdXNoQWNsT3V0UXVldWUoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKEhDSV9BQ0xEQVRBX1BLVCA9PT0gZXZlbnRUeXBlKSB7XG4gICAgICBsZXQgZmxhZ3MgPSBkYXRhLnJlYWRVSW50MTZMRSgxKSA+PiAxMjtcbiAgICAgIGxldCBoYW5kbGUgPSBkYXRhLnJlYWRVSW50MTZMRSgxKSAmIDB4MGZmZjtcblxuICAgICAgaWYgKEFDTF9TVEFSVCA9PT0gZmxhZ3MpIHtcbiAgICAgICAgbGV0IGNpZCA9IGRhdGEucmVhZFVJbnQxNkxFKDcpO1xuXG4gICAgICAgIGxldCBsZW5ndGggPSBkYXRhLnJlYWRVSW50MTZMRSg1KTtcbiAgICAgICAgbGV0IHBrdERhdGEgPSBkYXRhLnNsaWNlKDkpO1xuXG4gICAgICAgIGRlYnVnKCdcXHRcXHRjaWQgPSAnICsgY2lkKTtcblxuICAgICAgICBpZiAobGVuZ3RoID09PSBwa3REYXRhLmxlbmd0aCkge1xuICAgICAgICAgIGRlYnVnKCdcXHRcXHRoYW5kbGUgPSAnICsgaGFuZGxlKTtcbiAgICAgICAgICBkZWJ1ZygnXFx0XFx0ZGF0YSA9ICcgKyBwa3REYXRhLnRvU3RyaW5nKCdoZXgnKSk7XG5cbiAgICAgICAgICB0aGlzLmVtaXQoJ2FjbERhdGFQa3QnLCBoYW5kbGUsIGNpZCwgcGt0RGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5faGFuZGxlQnVmZmVyc1toYW5kbGVdID0ge1xuICAgICAgICAgICAgbGVuZ3RoOiBsZW5ndGgsXG4gICAgICAgICAgICBjaWQ6IGNpZCxcbiAgICAgICAgICAgIGRhdGE6IHBrdERhdGEsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChBQ0xfQ09OVCA9PT0gZmxhZ3MpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9oYW5kbGVCdWZmZXJzW2hhbmRsZV0gfHwgIXRoaXMuX2hhbmRsZUJ1ZmZlcnNbaGFuZGxlXS5kYXRhKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faGFuZGxlQnVmZmVyc1toYW5kbGVdLmRhdGEgPSBCdWZmZXIuY29uY2F0KFtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVCdWZmZXJzW2hhbmRsZV0uZGF0YSxcbiAgICAgICAgICBkYXRhLnNsaWNlKDUpLFxuICAgICAgICBdKTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5faGFuZGxlQnVmZmVyc1toYW5kbGVdLmRhdGEubGVuZ3RoID09PVxuICAgICAgICAgIHRoaXMuX2hhbmRsZUJ1ZmZlcnNbaGFuZGxlXS5sZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAgICAgJ2FjbERhdGFQa3QnLFxuICAgICAgICAgICAgaGFuZGxlLFxuICAgICAgICAgICAgdGhpcy5faGFuZGxlQnVmZmVyc1toYW5kbGVdLmNpZCxcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZUJ1ZmZlcnNbaGFuZGxlXS5kYXRhXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9oYW5kbGVCdWZmZXJzW2hhbmRsZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKEhDSV9DT01NQU5EX1BLVCA9PT0gZXZlbnRUeXBlKSB7XG4gICAgICBsZXQgY21kID0gZGF0YS5yZWFkVUludDE2TEUoMSk7XG4gICAgICBsZXQgbGVuID0gZGF0YS5yZWFkVUludDgoMyk7XG5cbiAgICAgIGRlYnVnKCdcXHRcXHRjbWQgPSAnICsgY21kKTtcbiAgICAgIGRlYnVnKCdcXHRcXHRkYXRhIGxlbiA9ICcgKyBsZW4pO1xuXG4gICAgICBpZiAoY21kID09PSBMRV9TRVRfU0NBTl9FTkFCTEVfQ01EKSB7XG4gICAgICAgIGxldCBlbmFibGUgPSBkYXRhLnJlYWRVSW50OCg0KSA9PT0gMHgxO1xuICAgICAgICBsZXQgZmlsdGVyRHVwbGljYXRlcyA9IGRhdGEucmVhZFVJbnQ4KDUpID09PSAweDE7XG5cbiAgICAgICAgZGVidWcoJ1xcdFxcdFxcdExFIGVuYWJsZSBzY2FuIGNvbW1hbmQnKTtcbiAgICAgICAgZGVidWcoJ1xcdFxcdFxcdGVuYWJsZSBzY2FubmluZyA9ICcgKyBlbmFibGUpO1xuICAgICAgICBkZWJ1ZygnXFx0XFx0XFx0ZmlsdGVyIGR1cGxpY2F0ZXMgPSAnICsgZmlsdGVyRHVwbGljYXRlcyk7XG5cbiAgICAgICAgdGhpcy5lbWl0KCdsZVNjYW5FbmFibGVTZXRDbWQnLCBlbmFibGUsIGZpbHRlckR1cGxpY2F0ZXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uU29ja2V0RXJyb3IoZXJyb3IpIHtcbiAgICBkZWJ1Zygnb25Tb2NrZXRFcnJvcjogJyArIGVycm9yLm1lc3NhZ2UpO1xuXG4gICAgaWYgKGVycm9yLm1lc3NhZ2UgPT09ICdPcGVyYXRpb24gbm90IHBlcm1pdHRlZCcpIHtcbiAgICAgIHRoaXMuZW1pdCgnc3RhdGVDaGFuZ2UnLCAndW5hdXRob3JpemVkJyk7XG4gICAgfSBlbHNlIGlmIChlcnJvci5tZXNzYWdlID09PSAnTmV0d29yayBpcyBkb3duJykge1xuICAgICAgLy8gbm8tb3BcbiAgICB9XG4gIH1cblxuICBwcm9jZXNzQ21kQ29tcGxldGVFdmVudChjbWQsIHN0YXR1cywgcmVzdWx0KSB7XG4gICAgaWYgKGNtZCA9PT0gUkVTRVRfQ01EKSB7XG4gICAgICB0aGlzLnJlc2V0QnVmZmVycygpO1xuICAgICAgdGhpcy5zZXRFdmVudE1hc2soKTtcbiAgICAgIHRoaXMuc2V0TGVFdmVudE1hc2soKTtcbiAgICAgIHRoaXMucmVhZExvY2FsVmVyc2lvbigpO1xuICAgICAgdGhpcy5yZWFkQmRBZGRyKCk7XG4gICAgICB0aGlzLndyaXRlTGVIb3N0U3VwcG9ydGVkKCk7XG4gICAgICB0aGlzLnJlYWRMZUhvc3RTdXBwb3J0ZWQoKTtcbiAgICAgIHRoaXMubGVSZWFkQnVmZmVyU2l6ZSgpO1xuICAgIH0gZWxzZSBpZiAoY21kID09PSBSRUFEX0xFX0hPU1RfU1VQUE9SVEVEX0NNRCkge1xuICAgICAgaWYgKHN0YXR1cyA9PT0gMCkge1xuICAgICAgICBsZXQgbGUgPSByZXN1bHQucmVhZFVJbnQ4KDApO1xuICAgICAgICBsZXQgc2ltdWwgPSByZXN1bHQucmVhZFVJbnQ4KDEpO1xuXG4gICAgICAgIGRlYnVnKCdcXHRcXHRcXHRsZSA9ICcgKyBsZSk7XG4gICAgICAgIGRlYnVnKCdcXHRcXHRcXHRzaW11bCA9ICcgKyBzaW11bCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjbWQgPT09IFJFQURfTE9DQUxfVkVSU0lPTl9DTUQpIHtcbiAgICAgIGxldCBoY2lWZXIgPSByZXN1bHQucmVhZFVJbnQ4KDApO1xuICAgICAgbGV0IGhjaVJldiA9IHJlc3VsdC5yZWFkVUludDE2TEUoMSk7XG4gICAgICBsZXQgbG1wVmVyID0gcmVzdWx0LnJlYWRJbnQ4KDMpO1xuICAgICAgbGV0IG1hbnVmYWN0dXJlciA9IHJlc3VsdC5yZWFkVUludDE2TEUoNCk7XG4gICAgICBsZXQgbG1wU3ViVmVyID0gcmVzdWx0LnJlYWRVSW50MTZMRSg2KTtcblxuICAgICAgaWYgKGhjaVZlciA8IDB4MDYpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdzdGF0ZUNoYW5nZScsICd1bnN1cHBvcnRlZCcpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9zdGF0ZSAhPT0gJ3Bvd2VyZWRPbicpIHtcbiAgICAgICAgdGhpcy5zZXRTY2FuRW5hYmxlZChmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc2V0U2NhblBhcmFtZXRlcnMoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAncmVhZExvY2FsVmVyc2lvbicsXG4gICAgICAgIGhjaVZlcixcbiAgICAgICAgaGNpUmV2LFxuICAgICAgICBsbXBWZXIsXG4gICAgICAgIG1hbnVmYWN0dXJlcixcbiAgICAgICAgbG1wU3ViVmVyXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoY21kID09PSBSRUFEX0JEX0FERFJfQ01EKSB7XG4gICAgICB0aGlzLmFkZHJlc3NUeXBlID0gJ3B1YmxpYyc7XG4gICAgICB0aGlzLmFkZHJlc3MgPSByZXN1bHRcbiAgICAgICAgLnRvU3RyaW5nKCdoZXgnKVxuICAgICAgICAubWF0Y2goLy57MSwyfS9nKVxuICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgIC5qb2luKCc6Jyk7XG5cbiAgICAgIGRlYnVnKCdhZGRyZXNzID0gJyArIHRoaXMuYWRkcmVzcyk7XG5cbiAgICAgIHRoaXMuZW1pdCgnYWRkcmVzc0NoYW5nZScsIHRoaXMuYWRkcmVzcyk7XG4gICAgfSBlbHNlIGlmIChjbWQgPT09IExFX1NFVF9TQ0FOX1BBUkFNRVRFUlNfQ01EKSB7XG4gICAgICB0aGlzLmVtaXQoJ3N0YXRlQ2hhbmdlJywgJ3Bvd2VyZWRPbicpO1xuXG4gICAgICB0aGlzLmVtaXQoJ2xlU2NhblBhcmFtZXRlcnNTZXQnKTtcbiAgICB9IGVsc2UgaWYgKGNtZCA9PT0gTEVfU0VUX1NDQU5fRU5BQkxFX0NNRCkge1xuICAgICAgdGhpcy5lbWl0KCdsZVNjYW5FbmFibGVTZXQnLCBzdGF0dXMpO1xuICAgIH0gZWxzZSBpZiAoY21kID09PSBMRV9TRVRfQURWRVJUSVNJTkdfUEFSQU1FVEVSU19DTUQpIHtcbiAgICAgIHRoaXMuZW1pdCgnc3RhdGVDaGFuZ2UnLCAncG93ZXJlZE9uJyk7XG5cbiAgICAgIHRoaXMuZW1pdCgnbGVBZHZlcnRpc2luZ1BhcmFtZXRlcnNTZXQnLCBzdGF0dXMpO1xuICAgIH0gZWxzZSBpZiAoY21kID09PSBMRV9TRVRfQURWRVJUSVNJTkdfREFUQV9DTUQpIHtcbiAgICAgIHRoaXMuZW1pdCgnbGVBZHZlcnRpc2luZ0RhdGFTZXQnLCBzdGF0dXMpO1xuICAgIH0gZWxzZSBpZiAoY21kID09PSBMRV9TRVRfU0NBTl9SRVNQT05TRV9EQVRBX0NNRCkge1xuICAgICAgdGhpcy5lbWl0KCdsZVNjYW5SZXNwb25zZURhdGFTZXQnLCBzdGF0dXMpO1xuICAgIH0gZWxzZSBpZiAoY21kID09PSBMRV9TRVRfQURWRVJUSVNFX0VOQUJMRV9DTUQpIHtcbiAgICAgIHRoaXMuZW1pdCgnbGVBZHZlcnRpc2VFbmFibGVTZXQnLCBzdGF0dXMpO1xuICAgIH0gZWxzZSBpZiAoY21kID09PSBSRUFEX1JTU0lfQ01EKSB7XG4gICAgICBsZXQgaGFuZGxlID0gcmVzdWx0LnJlYWRVSW50MTZMRSgwKTtcbiAgICAgIGxldCByc3NpID0gcmVzdWx0LnJlYWRJbnQ4KDIpO1xuXG4gICAgICBkZWJ1ZygnXFx0XFx0XFx0aGFuZGxlID0gJyArIGhhbmRsZSk7XG4gICAgICBkZWJ1ZygnXFx0XFx0XFx0cnNzaSA9ICcgKyByc3NpKTtcblxuICAgICAgdGhpcy5lbWl0KCdyc3NpUmVhZCcsIGhhbmRsZSwgcnNzaSk7XG4gICAgfSBlbHNlIGlmIChjbWQgPT09IExFX0xUS19ORUdfUkVQTFlfQ01EKSB7XG4gICAgICBsZXQgaGFuZGxlID0gcmVzdWx0LnJlYWRVSW50MTZMRSgwKTtcblxuICAgICAgZGVidWcoJ1xcdFxcdFxcdGhhbmRsZSA9ICcgKyBoYW5kbGUpO1xuICAgICAgdGhpcy5lbWl0KCdsZUx0a05lZ1JlcGx5JywgaGFuZGxlKTtcbiAgICB9IGVsc2UgaWYgKGNtZCA9PT0gTEVfUkVBRF9CVUZGRVJfU0laRV9DTUQpIHtcbiAgICAgIGlmICghc3RhdHVzKSB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xlUmVhZEJ1ZmZlclNpemUocmVzdWx0KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNtZCA9PT0gUkVBRF9CVUZGRVJfU0laRV9DTUQpIHtcbiAgICAgIGlmICghc3RhdHVzKSB7XG4gICAgICAgIGxldCBhY2xNdHUgPSByZXN1bHQucmVhZFVJbnQxNkxFKDApO1xuICAgICAgICBsZXQgYWNsTWF4SW5Qcm9ncmVzcyA9IHJlc3VsdC5yZWFkVUludDE2TEUoMyk7XG4gICAgICAgIC8vIHNhbml0eVxuICAgICAgICBpZiAoYWNsTXR1ICYmIGFjbE1heEluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICBkZWJ1ZygnYnIvZWRyIGFjbCBtdHUgPSAnICsgYWNsTXR1KTtcbiAgICAgICAgICBkZWJ1ZygnYnIvZWRyIGFjbCBtYXggcGt0cyA9ICcgKyBhY2xNYXhJblByb2dyZXNzKTtcbiAgICAgICAgICB0aGlzLl9hY2xNdHUgPSBhY2xNdHU7XG4gICAgICAgICAgdGhpcy5fYWNsTWF4SW5Qcm9ncmVzcyA9IGFjbE1heEluUHJvZ3Jlc3M7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm9jZXNzTGVNZXRhRXZlbnQoZXZlbnRUeXBlLCBzdGF0dXMsIGRhdGEpIHtcbiAgICBpZiAoZXZlbnRUeXBlID09PSBFVlRfTEVfQ09OTl9DT01QTEVURSkge1xuICAgICAgdGhpcy5wcm9jZXNzTGVDb25uQ29tcGxldGUoc3RhdHVzLCBkYXRhKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50VHlwZSA9PT0gRVZUX0xFX0FEVkVSVElTSU5HX1JFUE9SVCkge1xuICAgICAgdGhpcy5wcm9jZXNzTGVBZHZlcnRpc2luZ1JlcG9ydChzdGF0dXMsIGRhdGEpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnRUeXBlID09PSBFVlRfTEVfQ09OTl9VUERBVEVfQ09NUExFVEUpIHtcbiAgICAgIHRoaXMucHJvY2Vzc0xlQ29ublVwZGF0ZUNvbXBsZXRlKHN0YXR1cywgZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgcHJvY2Vzc0xlQ29ubkNvbXBsZXRlKHN0YXR1cywgZGF0YSkge1xuICAgIGxldCBoYW5kbGUgPSBkYXRhLnJlYWRVSW50MTZMRSgwKTtcbiAgICBsZXQgcm9sZSA9IGRhdGEucmVhZFVJbnQ4KDIpO1xuICAgIGxldCBhZGRyZXNzVHlwZSA9IGRhdGEucmVhZFVJbnQ4KDMpID09PSAweDAxID8gJ3JhbmRvbScgOiAncHVibGljJztcbiAgICBsZXQgYWRkcmVzcyA9IGRhdGFcbiAgICAgIC5zbGljZSg0LCAxMClcbiAgICAgIC50b1N0cmluZygnaGV4JylcbiAgICAgIC5tYXRjaCgvLnsxLDJ9L2cpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAuam9pbignOicpO1xuICAgIGxldCBpbnRlcnZhbCA9IGRhdGEucmVhZFVJbnQxNkxFKDEwKSAqIDEuMjU7XG4gICAgbGV0IGxhdGVuY3kgPSBkYXRhLnJlYWRVSW50MTZMRSgxMik7IC8vIFRPRE86IG11bHRpcGxpZXI/XG4gICAgbGV0IHN1cGVydmlzaW9uVGltZW91dCA9IGRhdGEucmVhZFVJbnQxNkxFKDE0KSAqIDEwO1xuICAgIGxldCBtYXN0ZXJDbG9ja0FjY3VyYWN5ID0gZGF0YS5yZWFkVUludDgoMTYpOyAvLyBUT0RPOiBtdWx0aXBsaWVyP1xuXG4gICAgZGVidWcoJ1xcdFxcdFxcdGhhbmRsZSA9ICcgKyBoYW5kbGUpO1xuICAgIGRlYnVnKCdcXHRcXHRcXHRyb2xlID0gJyArIHJvbGUpO1xuICAgIGRlYnVnKCdcXHRcXHRcXHRhZGRyZXNzIHR5cGUgPSAnICsgYWRkcmVzc1R5cGUpO1xuICAgIGRlYnVnKCdcXHRcXHRcXHRhZGRyZXNzID0gJyArIGFkZHJlc3MpO1xuICAgIGRlYnVnKCdcXHRcXHRcXHRpbnRlcnZhbCA9ICcgKyBpbnRlcnZhbCk7XG4gICAgZGVidWcoJ1xcdFxcdFxcdGxhdGVuY3kgPSAnICsgbGF0ZW5jeSk7XG4gICAgZGVidWcoJ1xcdFxcdFxcdHN1cGVydmlzaW9uIHRpbWVvdXQgPSAnICsgc3VwZXJ2aXNpb25UaW1lb3V0KTtcbiAgICBkZWJ1ZygnXFx0XFx0XFx0bWFzdGVyIGNsb2NrIGFjY3VyYWN5ID0gJyArIG1hc3RlckNsb2NrQWNjdXJhY3kpO1xuXG4gICAgdGhpcy5faGFuZGxlQWNsc0luUHJvZ3Jlc3NbaGFuZGxlXSA9IDA7XG5cbiAgICB0aGlzLmVtaXQoXG4gICAgICAnbGVDb25uQ29tcGxldGUnLFxuICAgICAgc3RhdHVzLFxuICAgICAgaGFuZGxlLFxuICAgICAgcm9sZSxcbiAgICAgIGFkZHJlc3NUeXBlLFxuICAgICAgYWRkcmVzcyxcbiAgICAgIGludGVydmFsLFxuICAgICAgbGF0ZW5jeSxcbiAgICAgIHN1cGVydmlzaW9uVGltZW91dCxcbiAgICAgIG1hc3RlckNsb2NrQWNjdXJhY3lcbiAgICApO1xuICB9XG5cbiAgcHJvY2Vzc0xlQWR2ZXJ0aXNpbmdSZXBvcnQoY291bnQsIGRhdGEpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIGxldCB0eXBlID0gZGF0YS5yZWFkVUludDgoMCk7XG4gICAgICBsZXQgYWRkcmVzc1R5cGUgPSBkYXRhLnJlYWRVSW50OCgxKSA9PT0gMHgwMSA/ICdyYW5kb20nIDogJ3B1YmxpYyc7XG4gICAgICBsZXQgYWRkcmVzcyA9IGRhdGFcbiAgICAgICAgLnNsaWNlKDIsIDgpXG4gICAgICAgIC50b1N0cmluZygnaGV4JylcbiAgICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAuam9pbignOicpO1xuICAgICAgbGV0IGVpckxlbmd0aCA9IGRhdGEucmVhZFVJbnQ4KDgpO1xuICAgICAgbGV0IGVpciA9IGRhdGEuc2xpY2UoOSwgZWlyTGVuZ3RoICsgOSk7XG4gICAgICBsZXQgcnNzaSA9IGRhdGEucmVhZEludDgoZWlyTGVuZ3RoICsgOSk7XG5cbiAgICAgIGRlYnVnKCdcXHRcXHRcXHR0eXBlID0gJyArIHR5cGUpO1xuICAgICAgZGVidWcoJ1xcdFxcdFxcdGFkZHJlc3MgPSAnICsgYWRkcmVzcyk7XG4gICAgICBkZWJ1ZygnXFx0XFx0XFx0YWRkcmVzcyB0eXBlID0gJyArIGFkZHJlc3NUeXBlKTtcbiAgICAgIGRlYnVnKCdcXHRcXHRcXHRlaXIgPSAnICsgZWlyLnRvU3RyaW5nKCdoZXgnKSk7XG4gICAgICBkZWJ1ZygnXFx0XFx0XFx0cnNzaSA9ICcgKyByc3NpKTtcblxuICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAnbGVBZHZlcnRpc2luZ1JlcG9ydCcsXG4gICAgICAgIDAsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGFkZHJlc3MsXG4gICAgICAgIGFkZHJlc3NUeXBlLFxuICAgICAgICBlaXIsXG4gICAgICAgIHJzc2lcbiAgICAgICk7XG5cbiAgICAgIGRhdGEgPSBkYXRhLnNsaWNlKGVpckxlbmd0aCArIDEwKTtcbiAgICB9XG4gIH1cblxuICBwcm9jZXNzTGVDb25uVXBkYXRlQ29tcGxldGUoc3RhdHVzLCBkYXRhKSB7XG4gICAgbGV0IGhhbmRsZSA9IGRhdGEucmVhZFVJbnQxNkxFKDApO1xuICAgIGxldCBpbnRlcnZhbCA9IGRhdGEucmVhZFVJbnQxNkxFKDIpICogMS4yNTtcbiAgICBsZXQgbGF0ZW5jeSA9IGRhdGEucmVhZFVJbnQxNkxFKDQpOyAvLyBUT0RPOiBtdWx0aXBsaWVyP1xuICAgIGxldCBzdXBlcnZpc2lvblRpbWVvdXQgPSBkYXRhLnJlYWRVSW50MTZMRSg2KSAqIDEwO1xuXG4gICAgZGVidWcoJ1xcdFxcdFxcdGhhbmRsZSA9ICcgKyBoYW5kbGUpO1xuICAgIGRlYnVnKCdcXHRcXHRcXHRpbnRlcnZhbCA9ICcgKyBpbnRlcnZhbCk7XG4gICAgZGVidWcoJ1xcdFxcdFxcdGxhdGVuY3kgPSAnICsgbGF0ZW5jeSk7XG4gICAgZGVidWcoJ1xcdFxcdFxcdHN1cGVydmlzaW9uIHRpbWVvdXQgPSAnICsgc3VwZXJ2aXNpb25UaW1lb3V0KTtcblxuICAgIHRoaXMuZW1pdChcbiAgICAgICdsZUNvbm5VcGRhdGVDb21wbGV0ZScsXG4gICAgICBzdGF0dXMsXG4gICAgICBoYW5kbGUsXG4gICAgICBpbnRlcnZhbCxcbiAgICAgIGxhdGVuY3ksXG4gICAgICBzdXBlcnZpc2lvblRpbWVvdXRcbiAgICApO1xuICB9XG5cbiAgcHJvY2Vzc0NtZFN0YXR1c0V2ZW50KGNtZCwgc3RhdHVzKSB7XG4gICAgaWYgKGNtZCA9PT0gTEVfQ1JFQVRFX0NPTk5fQ01EKSB7XG4gICAgICBpZiAoc3RhdHVzICE9PSAwKSB7XG4gICAgICAgIHRoaXMuZW1pdCgnbGVDb25uQ29tcGxldGUnLCBzdGF0dXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3NMZVJlYWRCdWZmZXJTaXplKHJlc3VsdCkge1xuICAgIGxldCBhY2xNdHUgPSByZXN1bHQucmVhZFVJbnQxNkxFKDApO1xuICAgIGxldCBhY2xNYXhJblByb2dyZXNzID0gcmVzdWx0LnJlYWRVSW50OCgyKTtcbiAgICBpZiAoIWFjbE10dSkge1xuICAgICAgLy8gYXMgcGVyIEJsdWV0b290aCBzcGVjc1xuICAgICAgZGVidWcoJ2ZhbGxpbmcgYmFjayB0byBici9lZHIgYnVmZmVyIHNpemUnKTtcbiAgICAgIHRoaXMucmVhZEJ1ZmZlclNpemUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWcoJ2xlIGFjbCBtdHUgPSAnICsgYWNsTXR1KTtcbiAgICAgIGRlYnVnKCdsZSBhY2wgbWF4IGluIHByb2dyZXNzID0gJyArIGFjbE1heEluUHJvZ3Jlc3MpO1xuICAgICAgdGhpcy5fYWNsTXR1ID0gYWNsTXR1O1xuICAgICAgdGhpcy5fYWNsTWF4SW5Qcm9ncmVzcyA9IGFjbE1heEluUHJvZ3Jlc3M7XG4gICAgfVxuICB9XG5cbiAgb25TdGF0ZUNoYW5nZShzdGF0ZSkge1xuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gIH1cbn1cblxuSGNpLlNUQVRVU19NQVBQRVIgPSBTVEFUVVNfTUFQUEVSO1xubW9kdWxlLmV4cG9ydHMgPSBIY2k7XG4iXX0=
