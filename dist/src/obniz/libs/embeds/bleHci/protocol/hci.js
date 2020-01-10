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
Object.defineProperty(exports, "__esModule", { value: true });
// let debug = require('debug')('hci');
const debug = () => {
};
const events = require("events");
const HCI_COMMAND_PKT = 0x01;
const HCI_ACLDATA_PKT = 0x02;
const HCI_EVENT_PKT = 0x04;
const ACL_START_NO_FLUSH = 0x00;
const ACL_CONT = 0x01;
const ACL_START = 0x02;
const EVT_DISCONN_COMPLETE = 0x05;
const EVT_ENCRYPT_CHANGE = 0x08;
const EVT_CMD_COMPLETE = 0x0e;
const EVT_CMD_STATUS = 0x0f;
const EVT_NUMBER_OF_COMPLETED_PACKETS = 0x13;
const EVT_LE_META_EVENT = 0x3e;
const EVT_LE_CONN_COMPLETE = 0x01;
const EVT_LE_ADVERTISING_REPORT = 0x02;
const EVT_LE_CONN_UPDATE_COMPLETE = 0x03;
const OGF_LINK_CTL = 0x01;
const OCF_DISCONNECT = 0x0006;
const OGF_HOST_CTL = 0x03;
const OCF_SET_EVENT_MASK = 0x0001;
const OCF_RESET = 0x0003;
const OCF_READ_LE_HOST_SUPPORTED = 0x006c;
const OCF_WRITE_LE_HOST_SUPPORTED = 0x006d;
const OGF_INFO_PARAM = 0x04;
const OCF_READ_LOCAL_VERSION = 0x0001;
const OCF_READ_BUFFER_SIZE = 0x0005;
const OCF_READ_BD_ADDR = 0x0009;
const OGF_STATUS_PARAM = 0x05;
const OCF_READ_RSSI = 0x0005;
const OGF_LE_CTL = 0x08;
const OCF_LE_SET_EVENT_MASK = 0x0001;
const OCF_LE_READ_BUFFER_SIZE = 0x0002;
const OCF_LE_SET_ADVERTISING_PARAMETERS = 0x0006;
const OCF_LE_SET_ADVERTISING_DATA = 0x0008;
const OCF_LE_SET_SCAN_RESPONSE_DATA = 0x0009;
const OCF_LE_SET_ADVERTISE_ENABLE = 0x000a;
const OCF_LE_SET_SCAN_PARAMETERS = 0x000b;
const OCF_LE_SET_SCAN_ENABLE = 0x000c;
const OCF_LE_CREATE_CONN = 0x000d;
const OCF_LE_CONN_UPDATE = 0x0013;
const OCF_LE_START_ENCRYPTION = 0x0019;
const OCF_LE_LTK_NEG_REPLY = 0x001b;
const DISCONNECT_CMD = OCF_DISCONNECT | (OGF_LINK_CTL << 10);
const SET_EVENT_MASK_CMD = OCF_SET_EVENT_MASK | (OGF_HOST_CTL << 10);
const RESET_CMD = OCF_RESET | (OGF_HOST_CTL << 10);
const READ_LE_HOST_SUPPORTED_CMD = OCF_READ_LE_HOST_SUPPORTED | (OGF_HOST_CTL << 10);
const WRITE_LE_HOST_SUPPORTED_CMD = OCF_WRITE_LE_HOST_SUPPORTED | (OGF_HOST_CTL << 10);
const READ_LOCAL_VERSION_CMD = OCF_READ_LOCAL_VERSION | (OGF_INFO_PARAM << 10);
const READ_BUFFER_SIZE_CMD = OCF_READ_BUFFER_SIZE | (OGF_INFO_PARAM << 10);
const READ_BD_ADDR_CMD = OCF_READ_BD_ADDR | (OGF_INFO_PARAM << 10);
const READ_RSSI_CMD = OCF_READ_RSSI | (OGF_STATUS_PARAM << 10);
const LE_SET_EVENT_MASK_CMD = OCF_LE_SET_EVENT_MASK | (OGF_LE_CTL << 10);
const LE_READ_BUFFER_SIZE_CMD = OCF_LE_READ_BUFFER_SIZE | (OGF_LE_CTL << 10);
const LE_SET_SCAN_PARAMETERS_CMD = OCF_LE_SET_SCAN_PARAMETERS | (OGF_LE_CTL << 10);
const LE_SET_SCAN_ENABLE_CMD = OCF_LE_SET_SCAN_ENABLE | (OGF_LE_CTL << 10);
const LE_CREATE_CONN_CMD = OCF_LE_CREATE_CONN | (OGF_LE_CTL << 10);
const LE_CONN_UPDATE_CMD = OCF_LE_CONN_UPDATE | (OGF_LE_CTL << 10);
const LE_START_ENCRYPTION_CMD = OCF_LE_START_ENCRYPTION | (OGF_LE_CTL << 10);
const LE_SET_ADVERTISING_PARAMETERS_CMD = OCF_LE_SET_ADVERTISING_PARAMETERS | (OGF_LE_CTL << 10);
const LE_SET_ADVERTISING_DATA_CMD = OCF_LE_SET_ADVERTISING_DATA | (OGF_LE_CTL << 10);
const LE_SET_SCAN_RESPONSE_DATA_CMD = OCF_LE_SET_SCAN_RESPONSE_DATA | (OGF_LE_CTL << 10);
const LE_SET_ADVERTISE_ENABLE_CMD = OCF_LE_SET_ADVERTISE_ENABLE | (OGF_LE_CTL << 10);
const LE_LTK_NEG_REPLY_CMD = OCF_LE_LTK_NEG_REPLY | (OGF_LE_CTL << 10);
const HCI_OE_USER_ENDED_CONNECTION = 0x13;
const STATUS_MAPPER = require("./hci-status");
class Hci extends events.EventEmitter {
    constructor(obnizHci) {
        super();
        this._obnizHci = obnizHci;
        this._state = null;
        this._handleBuffers = {};
        this.on("stateChange", this.onStateChange.bind(this));
        this._socket = {
            write: (data) => {
                const arr = Array.from(data);
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
            return new Promise((resolve) => {
                this.once("stateChange", () => {
                    // console.log('te');
                    resolve();
                });
            });
        });
    }
    setEventMask() {
        const cmd = Buffer.alloc(12);
        const eventMask = Buffer.from("fffffbff07f8bf3d", "hex");
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(SET_EVENT_MASK_CMD, 1);
        // length
        cmd.writeUInt8(eventMask.length, 3);
        eventMask.copy(cmd, 4);
        debug("set event mask - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    reset() {
        const cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(OCF_RESET | (OGF_HOST_CTL << 10), 1);
        // length
        cmd.writeUInt8(0x00, 3);
        debug("reset - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    resetBuffers() {
        this._handleAclsInProgress = {};
        this._handleBuffers = {};
        this._aclOutQueue = [];
    }
    readLocalVersion() {
        const cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(READ_LOCAL_VERSION_CMD, 1);
        // length
        cmd.writeUInt8(0x0, 3);
        debug("read local version - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    readBdAddr() {
        const cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(READ_BD_ADDR_CMD, 1);
        // length
        cmd.writeUInt8(0x0, 3);
        debug("read bd addr - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    setLeEventMask() {
        const cmd = Buffer.alloc(12);
        const leEventMask = Buffer.from("1f00000000000000", "hex");
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(LE_SET_EVENT_MASK_CMD, 1);
        // length
        cmd.writeUInt8(leEventMask.length, 3);
        leEventMask.copy(cmd, 4);
        debug("set le event mask - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    readLeHostSupported() {
        const cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(READ_LE_HOST_SUPPORTED_CMD, 1);
        // length
        cmd.writeUInt8(0x00, 3);
        debug("read LE host supported - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    writeLeHostSupported() {
        const cmd = Buffer.alloc(6);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(WRITE_LE_HOST_SUPPORTED_CMD, 1);
        // length
        cmd.writeUInt8(0x02, 3);
        // data
        cmd.writeUInt8(0x01, 4); // le
        cmd.writeUInt8(0x00, 5); // simul
        debug("write LE host supported - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    setScanParameters() {
        const cmd = Buffer.alloc(11);
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
        debug("set scan parameters - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    setScanEnabled(enabled, filterDuplicates) {
        const cmd = Buffer.alloc(6);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(LE_SET_SCAN_ENABLE_CMD, 1);
        // length
        cmd.writeUInt8(0x02, 3);
        // data
        cmd.writeUInt8(enabled ? 0x01 : 0x00, 4); // enable: 0 -> disabled, 1 -> enabled
        cmd.writeUInt8(filterDuplicates ? 0x01 : 0x00, 5); // duplicates: 0 -> duplicates, 0 -> duplicates
        debug("set scan enabled - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    createLeConn(address, addressType) {
        const cmd = Buffer.alloc(29);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(LE_CREATE_CONN_CMD, 1);
        // length
        cmd.writeUInt8(0x19, 3);
        // data
        cmd.writeUInt16LE(0x0060, 4); // interval
        cmd.writeUInt16LE(0x0030, 6); // window
        cmd.writeUInt8(0x00, 8); // initiator filter
        cmd.writeUInt8(addressType === "random" ? 0x01 : 0x00, 9); // peer address type
        Buffer.from(address
            .split(":")
            .reverse()
            .join(""), "hex").copy(cmd, 10); // peer address
        cmd.writeUInt8(0x00, 16); // own address type
        cmd.writeUInt16LE(0x0006, 17); // min interval
        cmd.writeUInt16LE(0x000c, 19); // max interval
        cmd.writeUInt16LE(0x0000, 21); // latency
        cmd.writeUInt16LE(0x00c8, 23); // supervision timeout
        cmd.writeUInt16LE(0x0004, 25); // min ce length
        cmd.writeUInt16LE(0x0006, 27); // max ce length
        debug("create le conn - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    connUpdateLe(handle, minInterval, maxInterval, latency, supervisionTimeout) {
        const cmd = Buffer.alloc(18);
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
        debug("conn update le - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    startLeEncryption(handle, random, diversifier, key) {
        const cmd = Buffer.alloc(32);
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
        debug("start le encryption - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    disconnect(handle, reason) {
        const cmd = Buffer.alloc(7);
        reason = reason || HCI_OE_USER_ENDED_CONNECTION;
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(DISCONNECT_CMD, 1);
        // length
        cmd.writeUInt8(0x03, 3);
        // data
        cmd.writeUInt16LE(handle, 4); // handle
        cmd.writeUInt8(reason, 6); // reason
        debug("disconnect - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    readRssi(handle) {
        const cmd = Buffer.alloc(6);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(READ_RSSI_CMD, 1);
        // length
        cmd.writeUInt8(0x02, 3);
        // data
        cmd.writeUInt16LE(handle, 4); // handle
        debug("read rssi - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    writeAclDataPkt(handle, cid, data) {
        const pkt = Buffer.alloc(9 + data.length);
        // header
        pkt.writeUInt8(HCI_ACLDATA_PKT, 0);
        pkt.writeUInt16LE(handle | (ACL_START_NO_FLUSH << 12), 1);
        pkt.writeUInt16LE(data.length + 4, 3); // data length 1
        pkt.writeUInt16LE(data.length, 5); // data length 2
        pkt.writeUInt16LE(cid, 7);
        data.copy(pkt, 9);
        debug("write acl data pkt - writing: " + pkt.toString("hex"));
        this._socket.write(pkt);
    }
    setAdvertisingParameters() {
        const cmd = Buffer.alloc(19);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(LE_SET_ADVERTISING_PARAMETERS_CMD, 1);
        // length
        cmd.writeUInt8(15, 3);
        const advertisementInterval = Math.floor((process.env.BLENO_ADVERTISING_INTERVAL
            ? parseFloat(process.env.BLENO_ADVERTISING_INTERVAL)
            : 100) * 1.6);
        // data
        cmd.writeUInt16LE(advertisementInterval, 4); // min interval
        cmd.writeUInt16LE(advertisementInterval, 6); // max interval
        cmd.writeUInt8(0x00, 8); // adv type
        cmd.writeUInt8(0x00, 9); // own addr typ
        cmd.writeUInt8(0x00, 10); // direct addr type
        Buffer.from("000000000000", "hex").copy(cmd, 11); // direct addr
        cmd.writeUInt8(0x07, 17);
        cmd.writeUInt8(0x00, 18);
        debug("set advertisement parameters - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    setAdvertisingData(data) {
        const cmd = Buffer.alloc(36);
        cmd.fill(0x00);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(LE_SET_ADVERTISING_DATA_CMD, 1);
        // length
        cmd.writeUInt8(32, 3);
        // data
        cmd.writeUInt8(data.length, 4);
        data.copy(cmd, 5);
        debug("set advertisement data - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    setScanResponseData(data) {
        const cmd = Buffer.alloc(36);
        cmd.fill(0x00);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(LE_SET_SCAN_RESPONSE_DATA_CMD, 1);
        // length
        cmd.writeUInt8(32, 3);
        // data
        cmd.writeUInt8(data.length, 4);
        data.copy(cmd, 5);
        debug("set scan response data - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    setAdvertiseEnable(enabled) {
        const cmd = Buffer.alloc(5);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(LE_SET_ADVERTISE_ENABLE_CMD, 1);
        // length
        cmd.writeUInt8(0x01, 3);
        // data
        cmd.writeUInt8(enabled ? 0x01 : 0x00, 4); // enable: 0 -> disabled, 1 -> enabled
        debug("set advertise enable - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    leReadBufferSize() {
        const cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(LE_READ_BUFFER_SIZE_CMD, 1);
        // length
        cmd.writeUInt8(0x0, 3);
        debug("le read buffer size - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    readBufferSize() {
        const cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(READ_BUFFER_SIZE_CMD, 1);
        // length
        cmd.writeUInt8(0x0, 3);
        debug("read buffer size - writing: " + cmd.toString("hex"));
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
            const frag = l2capPdu.slice(0, this._aclMtu);
            l2capPdu = l2capPdu.slice(frag.length);
            const pkt = Buffer.alloc(5 + frag.length);
            // hci header
            pkt.writeUInt8(HCI_ACLDATA_PKT, 0);
            pkt.writeUInt16LE(hf, 1);
            hf |= ACL_CONT << 12;
            pkt.writeUInt16LE(frag.length, 3); // hci pdu length
            frag.copy(pkt, 5);
            this._aclOutQueue.push({
                handle,
                pkt,
                fragId: fragId++,
            });
        }
        this.pushAclOutQueue();
    }
    pushAclOutQueue() {
        debug("pushAclOutQueue");
        let inProgress = 0;
        for (const handle in this._handleAclsInProgress) {
            inProgress += this._handleAclsInProgress[handle];
        }
        debug(inProgress, this._aclMaxInProgress, this._aclOutQueue.length);
        while (inProgress < this._aclMaxInProgress && this._aclOutQueue.length) {
            inProgress++;
            this.writeOneAclDataPkt();
        }
        if (inProgress >= this._aclMaxInProgress && this._aclOutQueue.length) {
            debug("acl out queue congested");
            debug("\tin progress = " + inProgress);
            debug("\twaiting = " + this._aclOutQueue.length);
        }
    }
    writeOneAclDataPkt() {
        debug("writeOneAclDataPkt");
        const pkt = this._aclOutQueue.shift();
        this._handleAclsInProgress[pkt.handle]++;
        debug("write acl data pkt frag " +
            pkt.fragId +
            " handle " +
            pkt.handle +
            " - writing: " +
            pkt.pkt.toString("hex"));
        this._socket.write(pkt.pkt);
    }
    onSocketData(array) {
        const data = Buffer.from(array);
        debug("onSocketData: " + data.toString("hex"));
        const eventType = data.readUInt8(0);
        debug("\tevent type = " + eventType);
        if (HCI_EVENT_PKT === eventType) {
            const subEventType = data.readUInt8(1);
            debug("\tsub event type = " + subEventType);
            if (subEventType === EVT_DISCONN_COMPLETE) {
                const handle = data.readUInt16LE(4);
                const reason = data.readUInt8(6);
                debug("\t\thandle = " + handle);
                debug("\t\treason = " + reason);
                delete this._handleAclsInProgress[handle];
                const aclOutQueue = [];
                let discarded = 0;
                for (const i in this._aclOutQueue) {
                    if (this._aclOutQueue[i].handle !== handle) {
                        aclOutQueue.push(this._aclOutQueue[i]);
                    }
                    else {
                        discarded++;
                    }
                }
                if (discarded) {
                    debug("\t\tacls discarded = " + discarded);
                }
                this._aclOutQueue = aclOutQueue;
                this.pushAclOutQueue();
                this.emit("disconnComplete", handle, reason);
            }
            else if (subEventType === EVT_ENCRYPT_CHANGE) {
                const handle = data.readUInt16LE(4);
                const encrypt = data.readUInt8(6);
                debug("\t\thandle = " + handle);
                debug("\t\tencrypt = " + encrypt);
                this.emit("encryptChange", handle, encrypt);
            }
            else if (subEventType === EVT_CMD_COMPLETE) {
                const ncmd = data.readUInt8(3);
                const cmd = data.readUInt16LE(4);
                const status = data.readUInt8(6);
                const result = data.slice(7);
                debug("\t\tncmd = " + ncmd);
                debug("\t\tcmd = " + cmd);
                debug("\t\tstatus = " + status);
                debug("\t\tresult = " + result.toString("hex"));
                this.processCmdCompleteEvent(cmd, status, result);
            }
            else if (subEventType === EVT_CMD_STATUS) {
                const status = data.readUInt8(3);
                const cmd = data.readUInt16LE(5);
                debug("\t\tstatus = " + status);
                debug("\t\tcmd = " + cmd);
                this.processCmdStatusEvent(cmd, status);
            }
            else if (subEventType === EVT_LE_META_EVENT) {
                const leMetaEventType = data.readUInt8(3);
                const leMetaEventStatus = data.readUInt8(4);
                const leMetaEventData = data.slice(5);
                debug("\t\tLE meta event type = " + leMetaEventType);
                debug("\t\tLE meta event status = " + leMetaEventStatus);
                debug("\t\tLE meta event data = " + leMetaEventData.toString("hex"));
                this.processLeMetaEvent(leMetaEventType, leMetaEventStatus, leMetaEventData);
            }
            else if (subEventType === EVT_NUMBER_OF_COMPLETED_PACKETS) {
                const handles = data.readUInt8(3);
                for (let i = 0; i < handles; i++) {
                    const handle = data.readUInt16LE(4 + i * 4);
                    const pkts = data.readUInt16LE(6 + i * 4);
                    debug("\thandle = " + handle);
                    debug("\t\tcompleted = " + pkts);
                    if (this._handleAclsInProgress[handle] === undefined) {
                        debug("\t\talready closed");
                        continue;
                    }
                    if (pkts > this._handleAclsInProgress[handle]) {
                        // Linux kernel may send acl packets by itself, so be ready for underflow
                        this._handleAclsInProgress[handle] = 0;
                    }
                    else {
                        this._handleAclsInProgress[handle] -= pkts;
                    }
                    debug("\t\tin progress = " + this._handleAclsInProgress[handle]);
                }
                this.pushAclOutQueue();
            }
        }
        else if (HCI_ACLDATA_PKT === eventType) {
            const flags = data.readUInt16LE(1) >> 12;
            const handle = data.readUInt16LE(1) & 0x0fff;
            if (ACL_START === flags) {
                const cid = data.readUInt16LE(7);
                const length = data.readUInt16LE(5);
                const pktData = data.slice(9);
                debug("\t\tcid = " + cid);
                if (length === pktData.length) {
                    debug("\t\thandle = " + handle);
                    debug("\t\tdata = " + pktData.toString("hex"));
                    this.emit("aclDataPkt", handle, cid, pktData);
                }
                else {
                    this._handleBuffers[handle] = {
                        length,
                        cid,
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
                    this.emit("aclDataPkt", handle, this._handleBuffers[handle].cid, this._handleBuffers[handle].data);
                    delete this._handleBuffers[handle];
                }
            }
        }
        else if (HCI_COMMAND_PKT === eventType) {
            const cmd = data.readUInt16LE(1);
            const len = data.readUInt8(3);
            debug("\t\tcmd = " + cmd);
            debug("\t\tdata len = " + len);
            if (cmd === LE_SET_SCAN_ENABLE_CMD) {
                const enable = data.readUInt8(4) === 0x1;
                const filterDuplicates = data.readUInt8(5) === 0x1;
                debug("\t\t\tLE enable scan command");
                debug("\t\t\tenable scanning = " + enable);
                debug("\t\t\tfilter duplicates = " + filterDuplicates);
                this.emit("leScanEnableSetCmd", enable, filterDuplicates);
            }
        }
    }
    onSocketError(error) {
        debug("onSocketError: " + error.message);
        if (error.message === "Operation not permitted") {
            this.emit("stateChange", "unauthorized");
        }
        else if (error.message === "Network is down") {
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
                const le = result.readUInt8(0);
                const simul = result.readUInt8(1);
                debug("\t\t\tle = " + le);
                debug("\t\t\tsimul = " + simul);
            }
        }
        else if (cmd === READ_LOCAL_VERSION_CMD) {
            const hciVer = result.readUInt8(0);
            const hciRev = result.readUInt16LE(1);
            const lmpVer = result.readInt8(3);
            const manufacturer = result.readUInt16LE(4);
            const lmpSubVer = result.readUInt16LE(6);
            if (hciVer < 0x06) {
                this.emit("stateChange", "unsupported");
            }
            else if (this._state !== "poweredOn") {
                this.setScanEnabled(false, true);
                this.setScanParameters();
            }
            this.emit("readLocalVersion", hciVer, hciRev, lmpVer, manufacturer, lmpSubVer);
        }
        else if (cmd === READ_BD_ADDR_CMD) {
            this.addressType = "public";
            this.address = result
                .toString("hex")
                .match(/.{1,2}/g)
                .reverse()
                .join(":");
            debug("address = " + this.address);
            this.emit("addressChange", this.address);
        }
        else if (cmd === LE_SET_SCAN_PARAMETERS_CMD) {
            this.emit("stateChange", "poweredOn");
            this.emit("leScanParametersSet");
        }
        else if (cmd === LE_SET_SCAN_ENABLE_CMD) {
            this.emit("leScanEnableSet", status);
        }
        else if (cmd === LE_SET_ADVERTISING_PARAMETERS_CMD) {
            this.emit("stateChange", "poweredOn");
            this.emit("leAdvertisingParametersSet", status);
        }
        else if (cmd === LE_SET_ADVERTISING_DATA_CMD) {
            this.emit("leAdvertisingDataSet", status);
        }
        else if (cmd === LE_SET_SCAN_RESPONSE_DATA_CMD) {
            this.emit("leScanResponseDataSet", status);
        }
        else if (cmd === LE_SET_ADVERTISE_ENABLE_CMD) {
            this.emit("leAdvertiseEnableSet", status);
        }
        else if (cmd === READ_RSSI_CMD) {
            const handle = result.readUInt16LE(0);
            const rssi = result.readInt8(2);
            debug("\t\t\thandle = " + handle);
            debug("\t\t\trssi = " + rssi);
            this.emit("rssiRead", handle, rssi);
        }
        else if (cmd === LE_LTK_NEG_REPLY_CMD) {
            const handle = result.readUInt16LE(0);
            debug("\t\t\thandle = " + handle);
            this.emit("leLtkNegReply", handle);
        }
        else if (cmd === LE_READ_BUFFER_SIZE_CMD) {
            if (!status) {
                this.processLeReadBufferSize(result);
            }
        }
        else if (cmd === READ_BUFFER_SIZE_CMD) {
            if (!status) {
                const aclMtu = result.readUInt16LE(0);
                const aclMaxInProgress = result.readUInt16LE(3);
                // sanity
                if (aclMtu && aclMaxInProgress) {
                    debug("br/edr acl mtu = " + aclMtu);
                    debug("br/edr acl max pkts = " + aclMaxInProgress);
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
        const handle = data.readUInt16LE(0);
        const role = data.readUInt8(2);
        const addressType = data.readUInt8(3) === 0x01 ? "random" : "public";
        const address = data
            .slice(4, 10)
            .toString("hex")
            .match(/.{1,2}/g)
            .reverse()
            .join(":");
        const interval = data.readUInt16LE(10) * 1.25;
        const latency = data.readUInt16LE(12); // TODO: multiplier?
        const supervisionTimeout = data.readUInt16LE(14) * 10;
        const masterClockAccuracy = data.readUInt8(16); // TODO: multiplier?
        debug("\t\t\thandle = " + handle);
        debug("\t\t\trole = " + role);
        debug("\t\t\taddress type = " + addressType);
        debug("\t\t\taddress = " + address);
        debug("\t\t\tinterval = " + interval);
        debug("\t\t\tlatency = " + latency);
        debug("\t\t\tsupervision timeout = " + supervisionTimeout);
        debug("\t\t\tmaster clock accuracy = " + masterClockAccuracy);
        this._handleAclsInProgress[handle] = 0;
        this.emit("leConnComplete", status, handle, role, addressType, address, interval, latency, supervisionTimeout, masterClockAccuracy);
    }
    processLeAdvertisingReport(count, data) {
        for (let i = 0; i < count; i++) {
            const type = data.readUInt8(0);
            const addressType = data.readUInt8(1) === 0x01 ? "random" : "public";
            const address = data
                .slice(2, 8)
                .toString("hex")
                .match(/.{1,2}/g)
                .reverse()
                .join(":");
            const eirLength = data.readUInt8(8);
            const eir = data.slice(9, eirLength + 9);
            const rssi = data.readInt8(eirLength + 9);
            debug("\t\t\ttype = " + type);
            debug("\t\t\taddress = " + address);
            debug("\t\t\taddress type = " + addressType);
            debug("\t\t\teir = " + eir.toString("hex"));
            debug("\t\t\trssi = " + rssi);
            this.emit("leAdvertisingReport", 0, type, address, addressType, eir, rssi);
            data = data.slice(eirLength + 10);
        }
    }
    processLeConnUpdateComplete(status, data) {
        const handle = data.readUInt16LE(0);
        const interval = data.readUInt16LE(2) * 1.25;
        const latency = data.readUInt16LE(4); // TODO: multiplier?
        const supervisionTimeout = data.readUInt16LE(6) * 10;
        debug("\t\t\thandle = " + handle);
        debug("\t\t\tinterval = " + interval);
        debug("\t\t\tlatency = " + latency);
        debug("\t\t\tsupervision timeout = " + supervisionTimeout);
        this.emit("leConnUpdateComplete", status, handle, interval, latency, supervisionTimeout);
    }
    processCmdStatusEvent(cmd, status) {
        if (cmd === LE_CREATE_CONN_CMD) {
            if (status !== 0) {
                this.emit("leConnComplete", status);
            }
        }
    }
    processLeReadBufferSize(result) {
        const aclMtu = result.readUInt16LE(0);
        const aclMaxInProgress = result.readUInt8(2);
        if (!aclMtu) {
            // as per Bluetooth specs
            debug("falling back to br/edr buffer size");
            this.readBufferSize();
        }
        else {
            debug("le acl mtu = " + aclMtu);
            debug("le acl max in progress = " + aclMaxInProgress);
            this._aclMtu = aclMtu;
            this._aclMaxInProgress = aclMaxInProgress;
        }
    }
    onStateChange(state) {
        this._state = state;
    }
}
Hci.STATUS_MAPPER = STATUS_MAPPER;
exports.default = Hci;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvcHJvdG9jb2wvaGNpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsdUNBQXVDO0FBQ3ZDLE1BQU0sS0FBSyxHQUFRLEdBQUcsRUFBRTtBQUN4QixDQUFDLENBQUM7QUFFRixNQUFNLE1BQU0sR0FBUSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFdEMsTUFBTSxlQUFlLEdBQVEsSUFBSSxDQUFDO0FBQ2xDLE1BQU0sZUFBZSxHQUFRLElBQUksQ0FBQztBQUNsQyxNQUFNLGFBQWEsR0FBUSxJQUFJLENBQUM7QUFFaEMsTUFBTSxrQkFBa0IsR0FBUSxJQUFJLENBQUM7QUFDckMsTUFBTSxRQUFRLEdBQVEsSUFBSSxDQUFDO0FBQzNCLE1BQU0sU0FBUyxHQUFRLElBQUksQ0FBQztBQUU1QixNQUFNLG9CQUFvQixHQUFRLElBQUksQ0FBQztBQUN2QyxNQUFNLGtCQUFrQixHQUFRLElBQUksQ0FBQztBQUNyQyxNQUFNLGdCQUFnQixHQUFRLElBQUksQ0FBQztBQUNuQyxNQUFNLGNBQWMsR0FBUSxJQUFJLENBQUM7QUFDakMsTUFBTSwrQkFBK0IsR0FBUSxJQUFJLENBQUM7QUFDbEQsTUFBTSxpQkFBaUIsR0FBUSxJQUFJLENBQUM7QUFFcEMsTUFBTSxvQkFBb0IsR0FBUSxJQUFJLENBQUM7QUFDdkMsTUFBTSx5QkFBeUIsR0FBUSxJQUFJLENBQUM7QUFDNUMsTUFBTSwyQkFBMkIsR0FBUSxJQUFJLENBQUM7QUFFOUMsTUFBTSxZQUFZLEdBQVEsSUFBSSxDQUFDO0FBQy9CLE1BQU0sY0FBYyxHQUFRLE1BQU0sQ0FBQztBQUVuQyxNQUFNLFlBQVksR0FBUSxJQUFJLENBQUM7QUFDL0IsTUFBTSxrQkFBa0IsR0FBUSxNQUFNLENBQUM7QUFDdkMsTUFBTSxTQUFTLEdBQVEsTUFBTSxDQUFDO0FBQzlCLE1BQU0sMEJBQTBCLEdBQVEsTUFBTSxDQUFDO0FBQy9DLE1BQU0sMkJB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SUFFTSx1QkFBdUIsQ0FBQyxNQUFXO1FBQ3hDLE1BQU0sTUFBTSxHQUFRLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsTUFBTSxnQkFBZ0IsR0FBUSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCx5QkFBeUI7WUFDekIsS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7WUFDNUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3ZCO2FBQU07WUFDTCxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1lBQ2hDLEtBQUssQ0FBQywyQkFBMkIsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQztTQUMzQztJQUNILENBQUM7SUFFTSxhQUFhLENBQUMsS0FBVTtRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0NBQ0Y7QUFFRCxHQUFHLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztBQUNsQyxrQkFBZSxHQUFHLENBQUMiLCJmaWxlIjoic3JjL29ibml6L2xpYnMvZW1iZWRzL2JsZUhjaS9wcm90b2NvbC9oY2kuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsZXQgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdoY2knKTtcbmNvbnN0IGRlYnVnOiBhbnkgPSAoKSA9PiB7XG59O1xuXG5jb25zdCBldmVudHM6IGFueSA9IHJlcXVpcmUoXCJldmVudHNcIik7XG5cbmNvbnN0IEhDSV9DT01NQU5EX1BLVDogYW55ID0gMHgwMTtcbmNvbnN0IEhDSV9BQ0xEQVRBX1BLVDogYW55ID0gMHgwMjtcbmNvbnN0IEhDSV9FVkVOVF9QS1Q6IGFueSA9IDB4MDQ7XG5cbmNvbnN0IEFDTF9TVEFSVF9OT19GTFVTSDogYW55ID0gMHgwMDtcbmNvbnN0IEFDTF9DT05UOiBhbnkgPSAweDAxO1xuY29uc3QgQUNMX1NUQVJUOiBhbnkgPSAweDAyO1xuXG5jb25zdCBFVlRfRElTQ09OTl9DT01QTEVURTogYW55ID0gMHgwNTtcbmNvbnN0IEVWVF9FTkNSWVBUX0NIQU5HRTogYW55ID0gMHgwODtcbmNvbnN0IEVWVF9DTURfQ09NUExFVEU6IGFueSA9IDB4MGU7XG5jb25zdCBFVlRfQ01EX1NUQVRVUzogYW55ID0gMHgwZjtcbmNvbnN0IEVWVF9OVU1CRVJfT0ZfQ09NUExFVEVEX1BBQ0tFVFM6IGFueSA9IDB4MTM7XG5jb25zdCBFVlRfTEVfTUVUQV9FVkVOVDogYW55ID0gMHgzZTtcblxuY29uc3QgRVZUX0xFX0NPTk5fQ09NUExFVEU6IGFueSA9IDB4MDE7XG5jb25zdCBFVlRfTEVfQURWRVJUSVNJTkdfUkVQT1JUOiBhbnkgPSAweDAyO1xuY29uc3QgRVZUX0xFX0NPTk5fVVBEQVRFX0NPTVBMRVRFOiBhbnkgPSAweDAzO1xuXG5jb25zdCBPR0ZfTElOS19DVEw6IGFueSA9IDB4MDE7XG5jb25zdCBPQ0ZfRElTQ09OTkVDVDogYW55ID0gMHgwMDA2O1xuXG5jb25zdCBPR0ZfSE9TVF9DVEw6IGFueSA9IDB4MDM7XG5jb25zdCBPQ0ZfU0VUX0VWRU5UX01BU0s6IGFueSA9IDB4MDAwMTtcbmNvbnN0IE9DRl9SRVNFVDogYW55ID0gMHgwMDAzO1xuY29uc3QgT0NGX1JFQURfTEVfSE9TVF9TVVBQT1JURUQ6IGFueSA9IDB4MDA2YztcbmNvbnN0IE9DRl9XUklURV9MRV9IT1NUX1NVUFBPUlRFRDogYW55ID0gMHgwMDZkO1xuXG5jb25zdCBPR0ZfSU5GT19QQVJBTTogYW55ID0gMHgwNDtcbmNvbnN0IE9DRl9SRUFEX0xPQ0FMX1ZFUlNJT046IGFueSA9IDB4MDAwMTtcbmNvbnN0IE9DRl9SRUFEX0JVRkZFUl9TSVpFOiBhbnkgPSAweDAwMDU7XG5jb25zdCBPQ0ZfUkVBRF9CRF9BRERSOiBhbnkgPSAweDAwMDk7XG5cbmNvbnN0IE9HRl9TVEFUVVNfUEFSQU06IGFueSA9IDB4MDU7XG5jb25zdCBPQ0ZfUkVBRF9SU1NJOiBhbnkgPSAweDAwMDU7XG5cbmNvbnN0IE9HRl9MRV9DVEw6IGFueSA9IDB4MDg7XG5jb25zdCBPQ0ZfTEVfU0VUX0VWRU5UX01BU0s6IGFueSA9IDB4MDAwMTtcbmNvbnN0IE9DRl9MRV9SRUFEX0JVRkZFUl9TSVpFOiBhbnkgPSAweDAwMDI7XG5jb25zdCBPQ0ZfTEVfU0VUX0FEVkVSVElTSU5HX1BBUkFNRVRFUlM6IGFueSA9IDB4MDAwNjtcbmNvbnN0IE9DRl9MRV9TRVRfQURWRVJUSVNJTkdfREFUQTogYW55ID0gMHgwMDA4O1xuY29uc3QgT0NGX0xFX1NFVF9TQ0FOX1JFU1BPTlNFX0RBVEE6IGFueSA9IDB4MDAwOTtcbmNvbnN0IE9DRl9MRV9TRVRfQURWRVJUSVNFX0VOQUJMRTogYW55ID0gMHgwMDBhO1xuY29uc3QgT0NGX0xFX1NFVF9TQ0FOX1BBUkFNRVRFUlM6IGFueSA9IDB4MDAwYjtcbmNvbnN0IE9DRl9MRV9TRVRfU0NBTl9FTkFCTEU6IGFueSA9IDB4MDAwYztcbmNvbnN0IE9DRl9MRV9DUkVBVEVfQ09OTjogYW55ID0gMHgwMDBkO1xuY29uc3QgT0NGX0xFX0NPTk5fVVBEQVRFOiBhbnkgPSAweDAwMTM7XG5jb25zdCBPQ0ZfTEVfU1RBUlRfRU5DUllQVElPTjogYW55ID0gMHgwMDE5O1xuY29uc3QgT0NGX0xFX0xUS19ORUdfUkVQTFk6IGFueSA9IDB4MDAxYjtcblxuY29uc3QgRElTQ09OTkVDVF9DTUQ6IGFueSA9IE9DRl9ESVNDT05ORUNUIHwgKE9HRl9MSU5LX0NUTCA8PCAxMCk7XG5cbmNvbnN0IFNFVF9FVkVOVF9NQVNLX0NNRDogYW55ID0gT0NGX1NFVF9FVkVOVF9NQVNLIHwgKE9HRl9IT1NUX0NUTCA8PCAxMCk7XG5jb25zdCBSRVNFVF9DTUQ6IGFueSA9IE9DRl9SRVNFVCB8IChPR0ZfSE9TVF9DVEwgPDwgMTApO1xuY29uc3QgUkVBRF9MRV9IT1NUX1NVUFBPUlRFRF9DTUQ6IGFueSA9XG4gIE9DRl9SRUFEX0xFX0hPU1RfU1VQUE9SVEVEIHwgKE9HRl9IT1NUX0NUTCA8PCAxMCk7XG5jb25zdCBXUklURV9MRV9IT1NUX1NVUFBPUlRFRF9DTUQ6IGFueSA9XG4gIE9DRl9XUklURV9MRV9IT1NUX1NVUFBPUlRFRCB8IChPR0ZfSE9TVF9DVEwgPDwgMTApO1xuXG5jb25zdCBSRUFEX0xPQ0FMX1ZFUlNJT05fQ01EOiBhbnkgPSBPQ0ZfUkVBRF9MT0NBTF9WRVJTSU9OIHwgKE9HRl9JTkZPX1BBUkFNIDw8IDEwKTtcbmNvbnN0IFJFQURfQlVGRkVSX1NJWkVfQ01EOiBhbnkgPSBPQ0ZfUkVBRF9CVUZGRVJfU0laRSB8IChPR0ZfSU5GT19QQVJBTSA8PCAxMCk7XG5jb25zdCBSRUFEX0JEX0FERFJfQ01EOiBhbnkgPSBPQ0ZfUkVBRF9CRF9BRERSIHwgKE9HRl9JTkZPX1BBUkFNIDw8IDEwKTtcblxuY29uc3QgUkVBRF9SU1NJX0NNRDogYW55ID0gT0NGX1JFQURfUlNTSSB8IChPR0ZfU1RBVFVTX1BBUkFNIDw8IDEwKTtcblxuY29uc3QgTEVfU0VUX0VWRU5UX01BU0tfQ01EOiBhbnkgPSBPQ0ZfTEVfU0VUX0VWRU5UX01BU0sgfCAoT0dGX0xFX0NUTCA8PCAxMCk7XG5jb25zdCBMRV9SRUFEX0JVRkZFUl9TSVpFX0NNRDogYW55ID0gT0NGX0xFX1JFQURfQlVGRkVSX1NJWkUgfCAoT0dGX0xFX0NUTCA8PCAxMCk7XG5jb25zdCBMRV9TRVRfU0NBTl9QQVJBTUVURVJTX0NNRDogYW55ID1cbiAgT0NGX0xFX1NFVF9TQ0FOX1BBUkFNRVRFUlMgfCAoT0dGX0xFX0NUTCA8PCAxMCk7XG5jb25zdCBMRV9TRVRfU0NBTl9FTkFCTEVfQ01EOiBhbnkgPSBPQ0ZfTEVfU0VUX1NDQU5fRU5BQkxFIHwgKE9HRl9MRV9DVEwgPDwgMTApO1xuY29uc3QgTEVfQ1JFQVRFX0NPTk5fQ01EOiBhbnkgPSBPQ0ZfTEVfQ1JFQVRFX0NPTk4gfCAoT0dGX0xFX0NUTCA8PCAxMCk7XG5jb25zdCBMRV9DT05OX1VQREFURV9DTUQ6IGFueSA9IE9DRl9MRV9DT05OX1VQREFURSB8IChPR0ZfTEVfQ1RMIDw8IDEwKTtcbmNvbnN0IExFX1NUQVJUX0VOQ1JZUFRJT05fQ01EOiBhbnkgPSBPQ0ZfTEVfU1RBUlRfRU5DUllQVElPTiB8IChPR0ZfTEVfQ1RMIDw8IDEwKTtcbmNvbnN0IExFX1NFVF9BRFZFUlRJU0lOR19QQVJBTUVURVJTX0NNRDogYW55ID1cbiAgT0NGX0xFX1NFVF9BRFZFUlRJU0lOR19QQVJBTUVURVJTIHwgKE9HRl9MRV9DVEwgPDwgMTApO1xuXG5jb25zdCBMRV9TRVRfQURWRVJUSVNJTkdfREFUQV9DTUQ6IGFueSA9XG4gIE9DRl9MRV9TRVRfQURWRVJUSVNJTkdfREFUQSB8IChPR0ZfTEVfQ1RMIDw8IDEwKTtcbmNvbnN0IExFX1NFVF9TQ0FOX1JFU1BPTlNFX0RBVEFfQ01EOiBhbnkgPVxuICBPQ0ZfTEVfU0VUX1NDQU5fUkVTUE9OU0VfREFUQSB8IChPR0ZfTEVfQ1RMIDw8IDEwKTtcbmNvbnN0IExFX1NFVF9BRFZFUlRJU0VfRU5BQkxFX0NNRDogYW55ID1cbiAgT0NGX0xFX1NFVF9BRFZFUlRJU0VfRU5BQkxFIHwgKE9HRl9MRV9DVEwgPDwgMTApO1xuY29uc3QgTEVfTFRLX05FR19SRVBMWV9DTUQ6IGFueSA9IE9DRl9MRV9MVEtfTkVHX1JFUExZIHwgKE9HRl9MRV9DVEwgPDwgMTApO1xuXG5jb25zdCBIQ0lfT0VfVVNFUl9FTkRFRF9DT05ORUNUSU9OOiBhbnkgPSAweDEzO1xuXG5jb25zdCBTVEFUVVNfTUFQUEVSOiBhbnkgPSByZXF1aXJlKFwiLi9oY2ktc3RhdHVzXCIpO1xuXG5jbGFzcyBIY2kgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgcHVibGljIF9vYm5pekhjaTogYW55O1xuICBwdWJsaWMgX3N0YXRlOiBhbnk7XG4gIHB1YmxpYyBfaGFuZGxlQnVmZmVyczogYW55O1xuICBwdWJsaWMgb246IGFueTtcbiAgcHVibGljIF9zb2NrZXQ6IGFueTtcbiAgcHVibGljIG9uY2U6IGFueTtcbiAgcHVibGljIF9oYW5kbGVBY2xzSW5Qcm9ncmVzczogYW55O1xuICBwdWJsaWMgX2FjbE91dFF1ZXVlOiBhbnk7XG4gIHB1YmxpYyBfYWNsTXR1OiBhbnk7XG4gIHB1YmxpYyBfYWNsTWF4SW5Qcm9ncmVzczogYW55O1xuICBwdWJsaWMgZW1pdDogYW55O1xuICBwdWJsaWMgYWRkcmVzc1R5cGU6IGFueTtcbiAgcHVibGljIGFkZHJlc3M6IGFueTtcblxuICBjb25zdHJ1Y3RvcihvYm5pekhjaTogYW55KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9vYm5pekhjaSA9IG9ibml6SGNpO1xuICAgIHRoaXMuX3N0YXRlID0gbnVsbDtcblxuICAgIHRoaXMuX2hhbmRsZUJ1ZmZlcnMgPSB7fTtcblxuICAgIHRoaXMub24oXCJzdGF0ZUNoYW5nZVwiLCB0aGlzLm9uU3RhdGVDaGFuZ2UuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLl9zb2NrZXQgPSB7XG4gICAgICB3cml0ZTogKGRhdGE6IGFueSApID0+IHtcbiAgICAgICAgY29uc3QgYXJyOiBhbnkgPSBBcnJheS5mcm9tKGRhdGEpO1xuICAgICAgICB0aGlzLl9vYm5pekhjaS53cml0ZShhcnIpO1xuICAgICAgfSxcbiAgICB9O1xuICAgIHRoaXMuX29ibml6SGNpLm9ucmVhZCA9IHRoaXMub25Tb2NrZXREYXRhLmJpbmQodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgaW5pdFdhaXQoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICAgIC8vIHRoaXMuc2V0RXZlbnRNYXNrKCk7XG4gICAgLy8gdGhpcy5zZXRMZUV2ZW50TWFzaygpO1xuICAgIC8vIHRoaXMucmVhZExvY2FsVmVyc2lvbigpO1xuICAgIC8vIHRoaXMud3JpdGVMZUhvc3RTdXBwb3J0ZWQoKTtcbiAgICAvLyB0aGlzLnJlYWRMZUhvc3RTdXBwb3J0ZWQoKTtcbiAgICAvLyB0aGlzLnJlYWRCZEFkZHIoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSAoKHJlc29sdmU6IGFueSApID0+IHtcbiAgICAgIHRoaXMub25jZShcInN0YXRlQ2hhbmdlXCIsICgpID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3RlJyk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHNldEV2ZW50TWFzaygpIHtcbiAgICBjb25zdCBjbWQ6IGFueSA9IEJ1ZmZlci5hbGxvYygxMik7XG4gICAgY29uc3QgZXZlbnRNYXNrOiBhbnkgPSBCdWZmZXIuZnJvbShcImZmZmZmYmZmMDdmOGJmM2RcIiwgXCJoZXhcIik7XG5cbiAgICAvLyBoZWFkZXJcbiAgICBjbWQud3JpdGVVSW50OChIQ0lfQ09NTUFORF9QS1QsIDApO1xuICAgIGNtZC53cml0ZVVJbnQxNkxFKFNFVF9FVkVOVF9NQVNLX0NNRCwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OChldmVudE1hc2subGVuZ3RoLCAzKTtcblxuICAgIGV2ZW50TWFzay5jb3B5KGNtZCwgNCk7XG5cbiAgICBkZWJ1ZyhcInNldCBldmVudCBtYXNrIC0gd3JpdGluZzogXCIgKyBjbWQudG9TdHJpbmcoXCJoZXhcIikpO1xuICAgIHRoaXMuX3NvY2tldC53cml0ZShjbWQpO1xuICB9XG5cbiAgcHVibGljIHJlc2V0KCkge1xuICAgIGNvbnN0IGNtZDogYW55ID0gQnVmZmVyLmFsbG9jKDQpO1xuXG4gICAgLy8gaGVhZGVyXG4gICAgY21kLndyaXRlVUludDgoSENJX0NPTU1BTkRfUEtULCAwKTtcbiAgICBjbWQud3JpdGVVSW50MTZMRShPQ0ZfUkVTRVQgfCAoT0dGX0hPU1RfQ1RMIDw8IDEwKSwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OCgweDAwLCAzKTtcblxuICAgIGRlYnVnKFwicmVzZXQgLSB3cml0aW5nOiBcIiArIGNtZC50b1N0cmluZyhcImhleFwiKSk7XG4gICAgdGhpcy5fc29ja2V0LndyaXRlKGNtZCk7XG4gIH1cblxuICBwdWJsaWMgcmVzZXRCdWZmZXJzKCkge1xuICAgIHRoaXMuX2hhbmRsZUFjbHNJblByb2dyZXNzID0ge307XG4gICAgdGhpcy5faGFuZGxlQnVmZmVycyA9IHt9O1xuICAgIHRoaXMuX2FjbE91dFF1ZXVlID0gW107XG4gIH1cblxuICBwdWJsaWMgcmVhZExvY2FsVmVyc2lvbigpIHtcbiAgICBjb25zdCBjbWQ6IGFueSA9IEJ1ZmZlci5hbGxvYyg0KTtcblxuICAgIC8vIGhlYWRlclxuICAgIGNtZC53cml0ZVVJbnQ4KEhDSV9DT01NQU5EX1BLVCwgMCk7XG4gICAgY21kLndyaXRlVUludDE2TEUoUkVBRF9MT0NBTF9WRVJTSU9OX0NNRCwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OCgweDAsIDMpO1xuXG4gICAgZGVidWcoXCJyZWFkIGxvY2FsIHZlcnNpb24gLSB3cml0aW5nOiBcIiArIGNtZC50b1N0cmluZyhcImhleFwiKSk7XG4gICAgdGhpcy5fc29ja2V0LndyaXRlKGNtZCk7XG4gIH1cblxuICBwdWJsaWMgcmVhZEJkQWRkcigpIHtcbiAgICBjb25zdCBjbWQ6IGFueSA9IEJ1ZmZlci5hbGxvYyg0KTtcblxuICAgIC8vIGhlYWRlclxuICAgIGNtZC53cml0ZVVJbnQ4KEhDSV9DT01NQU5EX1BLVCwgMCk7XG4gICAgY21kLndyaXRlVUludDE2TEUoUkVBRF9CRF9BRERSX0NNRCwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OCgweDAsIDMpO1xuXG4gICAgZGVidWcoXCJyZWFkIGJkIGFkZHIgLSB3cml0aW5nOiBcIiArIGNtZC50b1N0cmluZyhcImhleFwiKSk7XG4gICAgdGhpcy5fc29ja2V0LndyaXRlKGNtZCk7XG4gIH1cblxuICBwdWJsaWMgc2V0TGVFdmVudE1hc2soKSB7XG4gICAgY29uc3QgY21kOiBhbnkgPSBCdWZmZXIuYWxsb2MoMTIpO1xuICAgIGNvbnN0IGxlRXZlbnRNYXNrOiBhbnkgPSBCdWZmZXIuZnJvbShcIjFmMDAwMDAwMDAwMDAwMDBcIiwgXCJoZXhcIik7XG5cbiAgICAvLyBoZWFkZXJcbiAgICBjbWQud3JpdGVVSW50OChIQ0lfQ09NTUFORF9QS1QsIDApO1xuICAgIGNtZC53cml0ZVVJbnQxNkxFKExFX1NFVF9FVkVOVF9NQVNLX0NNRCwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OChsZUV2ZW50TWFzay5sZW5ndGgsIDMpO1xuXG4gICAgbGVFdmVudE1hc2suY29weShjbWQsIDQpO1xuXG4gICAgZGVidWcoXCJzZXQgbGUgZXZlbnQgbWFzayAtIHdyaXRpbmc6IFwiICsgY21kLnRvU3RyaW5nKFwiaGV4XCIpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkTGVIb3N0U3VwcG9ydGVkKCkge1xuICAgIGNvbnN0IGNtZDogYW55ID0gQnVmZmVyLmFsbG9jKDQpO1xuXG4gICAgLy8gaGVhZGVyXG4gICAgY21kLndyaXRlVUludDgoSENJX0NPTU1BTkRfUEtULCAwKTtcbiAgICBjbWQud3JpdGVVSW50MTZMRShSRUFEX0xFX0hPU1RfU1VQUE9SVEVEX0NNRCwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OCgweDAwLCAzKTtcblxuICAgIGRlYnVnKFwicmVhZCBMRSBob3N0IHN1cHBvcnRlZCAtIHdyaXRpbmc6IFwiICsgY21kLnRvU3RyaW5nKFwiaGV4XCIpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHB1YmxpYyB3cml0ZUxlSG9zdFN1cHBvcnRlZCgpIHtcbiAgICBjb25zdCBjbWQ6IGFueSA9IEJ1ZmZlci5hbGxvYyg2KTtcblxuICAgIC8vIGhlYWRlclxuICAgIGNtZC53cml0ZVVJbnQ4KEhDSV9DT01NQU5EX1BLVCwgMCk7XG4gICAgY21kLndyaXRlVUludDE2TEUoV1JJVEVfTEVfSE9TVF9TVVBQT1JURURfQ01ELCAxKTtcblxuICAgIC8vIGxlbmd0aFxuICAgIGNtZC53cml0ZVVJbnQ4KDB4MDIsIDMpO1xuXG4gICAgLy8gZGF0YVxuICAgIGNtZC53cml0ZVVJbnQ4KDB4MDEsIDQpOyAvLyBsZVxuICAgIGNtZC53cml0ZVVJbnQ4KDB4MDAsIDUpOyAvLyBzaW11bFxuXG4gICAgZGVidWcoXCJ3cml0ZSBMRSBob3N0IHN1cHBvcnRlZCAtIHdyaXRpbmc6IFwiICsgY21kLnRvU3RyaW5nKFwiaGV4XCIpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRTY2FuUGFyYW1ldGVycygpIHtcbiAgICBjb25zdCBjbWQ6IGFueSA9IEJ1ZmZlci5hbGxvYygxMSk7XG5cbiAgICAvLyBoZWFkZXJcbiAgICBjbWQud3JpdGVVSW50OChIQ0lfQ09NTUFORF9QS1QsIDApO1xuICAgIGNtZC53cml0ZVVJbnQxNkxFKExFX1NFVF9TQ0FOX1BBUkFNRVRFUlNfQ01ELCAxKTtcblxuICAgIC8vIGxlbmd0aFxuICAgIGNtZC53cml0ZVVJbnQ4KDB4MDcsIDMpO1xuXG4gICAgLy8gZGF0YVxuICAgIGNtZC53cml0ZVVJbnQ4KDB4MDEsIDQpOyAvLyB0eXBlOiAwIC0+IHBhc3NpdmUsIDEgLT4gYWN0aXZlXG4gICAgY21kLndyaXRlVUludDE2TEUoMHgwMDEwLCA1KTsgLy8gaW50ZXJuYWwsIG1zICogMS42XG4gICAgY21kLndyaXRlVUludDE2TEUoMHgwMDEwLCA3KTsgLy8gd2luZG93LCBtcyAqIDEuNlxuICAgIGNtZC53cml0ZVVJbnQ4KDB4MDAsIDkpOyAvLyBvd24gYWRkcmVzcyB0eXBlOiAwIC0+IHB1YmxpYywgMSAtPiByYW5kb21cbiAgICBjbWQud3JpdGVVSW50OCgweDAwLCAxMCk7IC8vIGZpbHRlcjogMCAtPiBhbGwgZXZlbnQgdHlwZXNcblxuICAgIGRlYnVnKFwic2V0IHNjYW4gcGFyYW1ldGVycyAtIHdyaXRpbmc6IFwiICsgY21kLnRvU3RyaW5nKFwiaGV4XCIpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRTY2FuRW5hYmxlZChlbmFibGVkOiBhbnksIGZpbHRlckR1cGxpY2F0ZXM6IGFueSkge1xuICAgIGNvbnN0IGNtZDogYW55ID0gQnVmZmVyLmFsbG9jKDYpO1xuXG4gICAgLy8gaGVhZGVyXG4gICAgY21kLndyaXRlVUludDgoSENJX0NPTU1BTkRfUEtULCAwKTtcbiAgICBjbWQud3JpdGVVSW50MTZMRShMRV9TRVRfU0NBTl9FTkFCTEVfQ01ELCAxKTtcblxuICAgIC8vIGxlbmd0aFxuICAgIGNtZC53cml0ZVVJbnQ4KDB4MDIsIDMpO1xuXG4gICAgLy8gZGF0YVxuICAgIGNtZC53cml0ZVVJbnQ4KGVuYWJsZWQgPyAweDAxIDogMHgwMCwgNCk7IC8vIGVuYWJsZTogMCAtPiBkaXNhYmxlZCwgMSAtPiBlbmFibGVkXG4gICAgY21kLndyaXRlVUludDgoZmlsdGVyRHVwbGljYXRlcyA/IDB4MDEgOiAweDAwLCA1KTsgLy8gZHVwbGljYXRlczogMCAtPiBkdXBsaWNhdGVzLCAwIC0+IGR1cGxpY2F0ZXNcblxuICAgIGRlYnVnKFwic2V0IHNjYW4gZW5hYmxlZCAtIHdyaXRpbmc6IFwiICsgY21kLnRvU3RyaW5nKFwiaGV4XCIpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHB1YmxpYyBjcmVhdGVMZUNvbm4oYWRkcmVzczogYW55LCBhZGRyZXNzVHlwZTogYW55KSB7XG4gICAgY29uc3QgY21kOiBhbnkgPSBCdWZmZXIuYWxsb2MoMjkpO1xuXG4gICAgLy8gaGVhZGVyXG4gICAgY21kLndyaXRlVUludDgoSENJX0NPTU1BTkRfUEtULCAwKTtcbiAgICBjbWQud3JpdGVVSW50MTZMRShMRV9DUkVBVEVfQ09OTl9DTUQsIDEpO1xuXG4gICAgLy8gbGVuZ3RoXG4gICAgY21kLndyaXRlVUludDgoMHgxOSwgMyk7XG5cbiAgICAvLyBkYXRhXG4gICAgY21kLndyaXRlVUludDE2TEUoMHgwMDYwLCA0KTsgLy8gaW50ZXJ2YWxcbiAgICBjbWQud3JpdGVVSW50MTZMRSgweDAwMzAsIDYpOyAvLyB3aW5kb3dcbiAgICBjbWQud3JpdGVVSW50OCgweDAwLCA4KTsgLy8gaW5pdGlhdG9yIGZpbHRlclxuXG4gICAgY21kLndyaXRlVUludDgoYWRkcmVzc1R5cGUgPT09IFwicmFuZG9tXCIgPyAweDAxIDogMHgwMCwgOSk7IC8vIHBlZXIgYWRkcmVzcyB0eXBlXG4gICAgQnVmZmVyLmZyb20oXG4gICAgICBhZGRyZXNzXG4gICAgICAgIC5zcGxpdChcIjpcIilcbiAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAuam9pbihcIlwiKSxcbiAgICAgIFwiaGV4XCIsXG4gICAgKS5jb3B5KGNtZCwgMTApOyAvLyBwZWVyIGFkZHJlc3NcblxuICAgIGNtZC53cml0ZVVJbnQ4KDB4MDAsIDE2KTsgLy8gb3duIGFkZHJlc3MgdHlwZVxuXG4gICAgY21kLndyaXRlVUludDE2TEUoMHgwMDA2LCAxNyk7IC8vIG1pbiBpbnRlcnZhbFxuICAgIGNtZC53cml0ZVVJbnQxNkxFKDB4MDAwYywgMTkpOyAvLyBtYXggaW50ZXJ2YWxcbiAgICBjbWQud3JpdGVVSW50MTZMRSgweDAwMDAsIDIxKTsgLy8gbGF0ZW5jeVxuICAgIGNtZC53cml0ZVVJbnQxNkxFKDB4MDBjOCwgMjMpOyAvLyBzdXBlcnZpc2lvbiB0aW1lb3V0XG4gICAgY21kLndyaXRlVUludDE2TEUoMHgwMDA0LCAyNSk7IC8vIG1pbiBjZSBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50MTZMRSgweDAwMDYsIDI3KTsgLy8gbWF4IGNlIGxlbmd0aFxuXG4gICAgZGVidWcoXCJjcmVhdGUgbGUgY29ubiAtIHdyaXRpbmc6IFwiICsgY21kLnRvU3RyaW5nKFwiaGV4XCIpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHB1YmxpYyBjb25uVXBkYXRlTGUoaGFuZGxlOiBhbnksIG1pbkludGVydmFsOiBhbnksIG1heEludGVydmFsOiBhbnksIGxhdGVuY3k6IGFueSwgc3VwZXJ2aXNpb25UaW1lb3V0OiBhbnkpIHtcbiAgICBjb25zdCBjbWQ6IGFueSA9IEJ1ZmZlci5hbGxvYygxOCk7XG5cbiAgICAvLyBoZWFkZXJcbiAgICBjbWQud3JpdGVVSW50OChIQ0lfQ09NTUFORF9QS1QsIDApO1xuICAgIGNtZC53cml0ZVVJbnQxNkxFKExFX0NPTk5fVVBEQVRFX0NNRCwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OCgweDBlLCAzKTtcblxuICAgIC8vIGRhdGFcbiAgICBjbWQud3JpdGVVSW50MTZMRShoYW5kbGUsIDQpO1xuICAgIGNtZC53cml0ZVVJbnQxNkxFKE1hdGguZmxvb3IobWluSW50ZXJ2YWwgLyAxLjI1KSwgNik7IC8vIG1pbiBpbnRlcnZhbFxuICAgIGNtZC53cml0ZVVJbnQxNkxFKE1hdGguZmxvb3IobWF4SW50ZXJ2YWwgLyAxLjI1KSwgOCk7IC8vIG1heCBpbnRlcnZhbFxuICAgIGNtZC53cml0ZVVJbnQxNkxFKGxhdGVuY3ksIDEwKTsgLy8gbGF0ZW5jeVxuICAgIGNtZC53cml0ZVVJbnQxNkxFKE1hdGguZmxvb3Ioc3VwZXJ2aXNpb25UaW1lb3V0IC8gMTApLCAxMik7IC8vIHN1cGVydmlzaW9uIHRpbWVvdXRcbiAgICBjbWQud3JpdGVVSW50MTZMRSgweDAwMDAsIDE0KTsgLy8gbWluIGNlIGxlbmd0aFxuICAgIGNtZC53cml0ZVVJbnQxNkxFKDB4MDAwMCwgMTYpOyAvLyBtYXggY2UgbGVuZ3RoXG5cbiAgICBkZWJ1ZyhcImNvbm4gdXBkYXRlIGxlIC0gd3JpdGluZzogXCIgKyBjbWQudG9TdHJpbmcoXCJoZXhcIikpO1xuICAgIHRoaXMuX3NvY2tldC53cml0ZShjbWQpO1xuICB9XG5cbiAgcHVibGljIHN0YXJ0TGVFbmNyeXB0aW9uKGhhbmRsZTogYW55LCByYW5kb206IGFueSwgZGl2ZXJzaWZpZXI6IGFueSwga2V5OiBhbnkpIHtcbiAgICBjb25zdCBjbWQ6IGFueSA9IEJ1ZmZlci5hbGxvYygzMik7XG5cbiAgICAvLyBoZWFkZXJcbiAgICBjbWQud3JpdGVVSW50OChIQ0lfQ09NTUFORF9QS1QsIDApO1xuICAgIGNtZC53cml0ZVVJbnQxNkxFKExFX1NUQVJUX0VOQ1JZUFRJT05fQ01ELCAxKTtcblxuICAgIC8vIGxlbmd0aFxuICAgIGNtZC53cml0ZVVJbnQ4KDB4MWMsIDMpO1xuXG4gICAgLy8gZGF0YVxuICAgIGNtZC53cml0ZVVJbnQxNkxFKGhhbmRsZSwgNCk7IC8vIGhhbmRsZVxuICAgIHJhbmRvbS5jb3B5KGNtZCwgNik7XG4gICAgZGl2ZXJzaWZpZXIuY29weShjbWQsIDE0KTtcbiAgICBrZXkuY29weShjbWQsIDE2KTtcblxuICAgIGRlYnVnKFwic3RhcnQgbGUgZW5jcnlwdGlvbiAtIHdyaXRpbmc6IFwiICsgY21kLnRvU3RyaW5nKFwiaGV4XCIpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHB1YmxpYyBkaXNjb25uZWN0KGhhbmRsZTogYW55LCByZWFzb246IGFueSkge1xuICAgIGNvbnN0IGNtZDogYW55ID0gQnVmZmVyLmFsbG9jKDcpO1xuXG4gICAgcmVhc29uID0gcmVhc29uIHx8IEhDSV9PRV9VU0VSX0VOREVEX0NPTk5FQ1RJT047XG5cbiAgICAvLyBoZWFkZXJcbiAgICBjbWQud3JpdGVVSW50OChIQ0lfQ09NTUFORF9QS1QsIDApO1xuICAgIGNtZC53cml0ZVVJbnQxNkxFKERJU0NPTk5FQ1RfQ01ELCAxKTtcblxuICAgIC8vIGxlbmd0aFxuICAgIGNtZC53cml0ZVVJbnQ4KDB4MDMsIDMpO1xuXG4gICAgLy8gZGF0YVxuICAgIGNtZC53cml0ZVVJbnQxNkxFKGhhbmRsZSwgNCk7IC8vIGhhbmRsZVxuICAgIGNtZC53cml0ZVVJbnQ4KHJlYXNvbiwgNik7IC8vIHJlYXNvblxuXG4gICAgZGVidWcoXCJkaXNjb25uZWN0IC0gd3JpdGluZzogXCIgKyBjbWQudG9TdHJpbmcoXCJoZXhcIikpO1xuICAgIHRoaXMuX3NvY2tldC53cml0ZShjbWQpO1xuICB9XG5cbiAgcHVibGljIHJlYWRSc3NpKGhhbmRsZTogYW55KSB7XG4gICAgY29uc3QgY21kOiBhbnkgPSBCdWZmZXIuYWxsb2MoNik7XG5cbiAgICAvLyBoZWFkZXJcbiAgICBjbWQud3JpdGVVSW50OChIQ0lfQ09NTUFORF9QS1QsIDApO1xuICAgIGNtZC53cml0ZVVJbnQxNkxFKFJFQURfUlNTSV9DTUQsIDEpO1xuXG4gICAgLy8gbGVuZ3RoXG4gICAgY21kLndyaXRlVUludDgoMHgwMiwgMyk7XG5cbiAgICAvLyBkYXRhXG4gICAgY21kLndyaXRlVUludDE2TEUoaGFuZGxlLCA0KTsgLy8gaGFuZGxlXG5cbiAgICBkZWJ1ZyhcInJlYWQgcnNzaSAtIHdyaXRpbmc6IFwiICsgY21kLnRvU3RyaW5nKFwiaGV4XCIpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHB1YmxpYyB3cml0ZUFjbERhdGFQa3QoaGFuZGxlOiBhbnksIGNpZDogYW55LCBkYXRhOiBhbnkpIHtcbiAgICBjb25zdCBwa3Q6IGFueSA9IEJ1ZmZlci5hbGxvYyg5ICsgZGF0YS5sZW5ndGgpO1xuXG4gICAgLy8gaGVhZGVyXG4gICAgcGt0LndyaXRlVUludDgoSENJX0FDTERBVEFfUEtULCAwKTtcbiAgICBwa3Qud3JpdGVVSW50MTZMRShoYW5kbGUgfCAoQUNMX1NUQVJUX05PX0ZMVVNIIDw8IDEyKSwgMSk7XG4gICAgcGt0LndyaXRlVUludDE2TEUoZGF0YS5sZW5ndGggKyA0LCAzKTsgLy8gZGF0YSBsZW5ndGggMVxuICAgIHBrdC53cml0ZVVJbnQxNkxFKGRhdGEubGVuZ3RoLCA1KTsgLy8gZGF0YSBsZW5ndGggMlxuICAgIHBrdC53cml0ZVVJbnQxNkxFKGNpZCwgNyk7XG5cbiAgICBkYXRhLmNvcHkocGt0LCA5KTtcblxuICAgIGRlYnVnKFwid3JpdGUgYWNsIGRhdGEgcGt0IC0gd3JpdGluZzogXCIgKyBwa3QudG9TdHJpbmcoXCJoZXhcIikpO1xuICAgIHRoaXMuX3NvY2tldC53cml0ZShwa3QpO1xuICB9XG5cbiAgcHVibGljIHNldEFkdmVydGlzaW5nUGFyYW1ldGVycygpIHtcbiAgICBjb25zdCBjbWQ6IGFueSA9IEJ1ZmZlci5hbGxvYygxOSk7XG5cbiAgICAvLyBoZWFkZXJcbiAgICBjbWQud3JpdGVVSW50OChIQ0lfQ09NTUFORF9QS1QsIDApO1xuICAgIGNtZC53cml0ZVVJbnQxNkxFKExFX1NFVF9BRFZFUlRJU0lOR19QQVJBTUVURVJTX0NNRCwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OCgxNSwgMyk7XG5cbiAgICBjb25zdCBhZHZlcnRpc2VtZW50SW50ZXJ2YWw6IGFueSA9IE1hdGguZmxvb3IoXG4gICAgICAocHJvY2Vzcy5lbnYuQkxFTk9fQURWRVJUSVNJTkdfSU5URVJWQUxcbiAgICAgICAgPyBwYXJzZUZsb2F0KHByb2Nlc3MuZW52LkJMRU5PX0FEVkVSVElTSU5HX0lOVEVSVkFMKVxuICAgICAgICA6IDEwMCkgKiAxLjYsXG4gICAgKTtcblxuICAgIC8vIGRhdGFcbiAgICBjbWQud3JpdGVVSW50MTZMRShhZHZlcnRpc2VtZW50SW50ZXJ2YWwsIDQpOyAvLyBtaW4gaW50ZXJ2YWxcbiAgICBjbWQud3JpdGVVSW50MTZMRShhZHZlcnRpc2VtZW50SW50ZXJ2YWwsIDYpOyAvLyBtYXggaW50ZXJ2YWxcbiAgICBjbWQud3JpdGVVSW50OCgweDAwLCA4KTsgLy8gYWR2IHR5cGVcbiAgICBjbWQud3JpdGVVSW50OCgweDAwLCA5KTsgLy8gb3duIGFkZHIgdHlwXG4gICAgY21kLndyaXRlVUludDgoMHgwMCwgMTApOyAvLyBkaXJlY3QgYWRkciB0eXBlXG4gICAgQnVmZmVyLmZyb20oXCIwMDAwMDAwMDAwMDBcIiwgXCJoZXhcIikuY29weShjbWQsIDExKTsgLy8gZGlyZWN0IGFkZHJcbiAgICBjbWQud3JpdGVVSW50OCgweDA3LCAxNyk7XG4gICAgY21kLndyaXRlVUludDgoMHgwMCwgMTgpO1xuXG4gICAgZGVidWcoXCJzZXQgYWR2ZXJ0aXNlbWVudCBwYXJhbWV0ZXJzIC0gd3JpdGluZzogXCIgKyBjbWQudG9TdHJpbmcoXCJoZXhcIikpO1xuICAgIHRoaXMuX3NvY2tldC53cml0ZShjbWQpO1xuICB9XG5cbiAgcHVibGljIHNldEFkdmVydGlzaW5nRGF0YShkYXRhOiBhbnkpIHtcbiAgICBjb25zdCBjbWQ6IGFueSA9IEJ1ZmZlci5hbGxvYygzNik7XG5cbiAgICBjbWQuZmlsbCgweDAwKTtcblxuICAgIC8vIGhlYWRlclxuICAgIGNtZC53cml0ZVVJbnQ4KEhDSV9DT01NQU5EX1BLVCwgMCk7XG4gICAgY21kLndyaXRlVUludDE2TEUoTEVfU0VUX0FEVkVSVElTSU5HX0RBVEFfQ01ELCAxKTtcblxuICAgIC8vIGxlbmd0aFxuICAgIGNtZC53cml0ZVVJbnQ4KDMyLCAzKTtcblxuICAgIC8vIGRhdGFcbiAgICBjbWQud3JpdGVVSW50OChkYXRhLmxlbmd0aCwgNCk7XG4gICAgZGF0YS5jb3B5KGNtZCwgNSk7XG5cbiAgICBkZWJ1ZyhcInNldCBhZHZlcnRpc2VtZW50IGRhdGEgLSB3cml0aW5nOiBcIiArIGNtZC50b1N0cmluZyhcImhleFwiKSk7XG4gICAgdGhpcy5fc29ja2V0LndyaXRlKGNtZCk7XG4gIH1cblxuICBwdWJsaWMgc2V0U2NhblJlc3BvbnNlRGF0YShkYXRhOiBhbnkpIHtcbiAgICBjb25zdCBjbWQ6IGFueSA9IEJ1ZmZlci5hbGxvYygzNik7XG5cbiAgICBjbWQuZmlsbCgweDAwKTtcblxuICAgIC8vIGhlYWRlclxuICAgIGNtZC53cml0ZVVJbnQ4KEhDSV9DT01NQU5EX1BLVCwgMCk7XG4gICAgY21kLndyaXRlVUludDE2TEUoTEVfU0VUX1NDQU5fUkVTUE9OU0VfREFUQV9DTUQsIDEpO1xuXG4gICAgLy8gbGVuZ3RoXG4gICAgY21kLndyaXRlVUludDgoMzIsIDMpO1xuXG4gICAgLy8gZGF0YVxuICAgIGNtZC53cml0ZVVJbnQ4KGRhdGEubGVuZ3RoLCA0KTtcbiAgICBkYXRhLmNvcHkoY21kLCA1KTtcblxuICAgIGRlYnVnKFwic2V0IHNjYW4gcmVzcG9uc2UgZGF0YSAtIHdyaXRpbmc6IFwiICsgY21kLnRvU3RyaW5nKFwiaGV4XCIpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRBZHZlcnRpc2VFbmFibGUoZW5hYmxlZDogYW55KSB7XG4gICAgY29uc3QgY21kOiBhbnkgPSBCdWZmZXIuYWxsb2MoNSk7XG5cbiAgICAvLyBoZWFkZXJcbiAgICBjbWQud3JpdGVVSW50OChIQ0lfQ09NTUFORF9QS1QsIDApO1xuICAgIGNtZC53cml0ZVVJbnQxNkxFKExFX1NFVF9BRFZFUlRJU0VfRU5BQkxFX0NNRCwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OCgweDAxLCAzKTtcblxuICAgIC8vIGRhdGFcbiAgICBjbWQud3JpdGVVSW50OChlbmFibGVkID8gMHgwMSA6IDB4MDAsIDQpOyAvLyBlbmFibGU6IDAgLT4gZGlzYWJsZWQsIDEgLT4gZW5hYmxlZFxuXG4gICAgZGVidWcoXCJzZXQgYWR2ZXJ0aXNlIGVuYWJsZSAtIHdyaXRpbmc6IFwiICsgY21kLnRvU3RyaW5nKFwiaGV4XCIpKTtcbiAgICB0aGlzLl9zb2NrZXQud3JpdGUoY21kKTtcbiAgfVxuXG4gIHB1YmxpYyBsZVJlYWRCdWZmZXJTaXplKCkge1xuICAgIGNvbnN0IGNtZDogYW55ID0gQnVmZmVyLmFsbG9jKDQpO1xuXG4gICAgLy8gaGVhZGVyXG4gICAgY21kLndyaXRlVUludDgoSENJX0NPTU1BTkRfUEtULCAwKTtcbiAgICBjbWQud3JpdGVVSW50MTZMRShMRV9SRUFEX0JVRkZFUl9TSVpFX0NNRCwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OCgweDAsIDMpO1xuXG4gICAgZGVidWcoXCJsZSByZWFkIGJ1ZmZlciBzaXplIC0gd3JpdGluZzogXCIgKyBjbWQudG9TdHJpbmcoXCJoZXhcIikpO1xuICAgIHRoaXMuX3NvY2tldC53cml0ZShjbWQpO1xuICB9XG5cbiAgcHVibGljIHJlYWRCdWZmZXJTaXplKCkge1xuICAgIGNvbnN0IGNtZDogYW55ID0gQnVmZmVyLmFsbG9jKDQpO1xuXG4gICAgLy8gaGVhZGVyXG4gICAgY21kLndyaXRlVUludDgoSENJX0NPTU1BTkRfUEtULCAwKTtcbiAgICBjbWQud3JpdGVVSW50MTZMRShSRUFEX0JVRkZFUl9TSVpFX0NNRCwgMSk7XG5cbiAgICAvLyBsZW5ndGhcbiAgICBjbWQud3JpdGVVSW50OCgweDAsIDMpO1xuXG4gICAgZGVidWcoXCJyZWFkIGJ1ZmZlciBzaXplIC0gd3JpdGluZzogXCIgKyBjbWQudG9TdHJpbmcoXCJoZXhcIikpO1xuICAgIHRoaXMuX3NvY2tldC53cml0ZShjbWQpO1xuICB9XG5cbiAgcHVibGljIHF1ZXVlQWNsRGF0YVBrdChoYW5kbGU6IGFueSwgY2lkOiBhbnksIGRhdGE6IGFueSkge1xuICAgIGxldCBoZjogYW55ID0gaGFuZGxlIHwgKEFDTF9TVEFSVF9OT19GTFVTSCA8PCAxMik7XG4gICAgLy8gbDJjYXAgcGR1IG1heSBiZSBmcmFnbWVudGVkIG9uIGhjaSBsZXZlbFxuICAgIGxldCBsMmNhcFBkdTogYW55ID0gQnVmZmVyLmFsbG9jKDQgKyBkYXRhLmxlbmd0aCk7XG4gICAgbDJjYXBQZHUud3JpdGVVSW50MTZMRShkYXRhLmxlbmd0aCwgMCk7XG4gICAgbDJjYXBQZHUud3JpdGVVSW50MTZMRShjaWQsIDIpO1xuICAgIGRhdGEuY29weShsMmNhcFBkdSwgNCk7XG4gICAgbGV0IGZyYWdJZDogYW55ID0gMDtcblxuICAgIHdoaWxlIChsMmNhcFBkdS5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGZyYWc6IGFueSA9IGwyY2FwUGR1LnNsaWNlKDAsIHRoaXMuX2FjbE10dSk7XG4gICAgICBsMmNhcFBkdSA9IGwyY2FwUGR1LnNsaWNlKGZyYWcubGVuZ3RoKTtcbiAgICAgIGNvbnN0IHBrdDogYW55ID0gQnVmZmVyLmFsbG9jKDUgKyBmcmFnLmxlbmd0aCk7XG5cbiAgICAgIC8vIGhjaSBoZWFkZXJcbiAgICAgIHBrdC53cml0ZVVJbnQ4KEhDSV9BQ0xEQVRBX1BLVCwgMCk7XG4gICAgICBwa3Qud3JpdGVVSW50MTZMRShoZiwgMSk7XG4gICAgICBoZiB8PSBBQ0xfQ09OVCA8PCAxMjtcbiAgICAgIHBrdC53cml0ZVVJbnQxNkxFKGZyYWcubGVuZ3RoLCAzKTsgLy8gaGNpIHBkdSBsZW5ndGhcblxuICAgICAgZnJhZy5jb3B5KHBrdCwgNSk7XG5cbiAgICAgIHRoaXMuX2FjbE91dFF1ZXVlLnB1c2goe1xuICAgICAgICBoYW5kbGUsXG4gICAgICAgIHBrdCxcbiAgICAgICAgZnJhZ0lkOiBmcmFnSWQrKyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMucHVzaEFjbE91dFF1ZXVlKCk7XG4gIH1cblxuICBwdWJsaWMgcHVzaEFjbE91dFF1ZXVlKCkge1xuICAgIGRlYnVnKFwicHVzaEFjbE91dFF1ZXVlXCIpO1xuICAgIGxldCBpblByb2dyZXNzOiBhbnkgPSAwO1xuICAgIGZvciAoY29uc3QgaGFuZGxlIGluIHRoaXMuX2hhbmRsZUFjbHNJblByb2dyZXNzKSB7XG4gICAgICBpblByb2dyZXNzICs9IHRoaXMuX2hhbmRsZUFjbHNJblByb2dyZXNzW2hhbmRsZV07XG4gICAgfVxuICAgIGRlYnVnKGluUHJvZ3Jlc3MsIHRoaXMuX2FjbE1heEluUHJvZ3Jlc3MsIHRoaXMuX2FjbE91dFF1ZXVlLmxlbmd0aCk7XG4gICAgd2hpbGUgKGluUHJvZ3Jlc3MgPCB0aGlzLl9hY2xNYXhJblByb2dyZXNzICYmIHRoaXMuX2FjbE91dFF1ZXVlLmxlbmd0aCkge1xuICAgICAgaW5Qcm9ncmVzcysrO1xuICAgICAgdGhpcy53cml0ZU9uZUFjbERhdGFQa3QoKTtcbiAgICB9XG5cbiAgICBpZiAoaW5Qcm9ncmVzcyA+PSB0aGlzLl9hY2xNYXhJblByb2dyZXNzICYmIHRoaXMuX2FjbE91dFF1ZXVlLmxlbmd0aCkge1xuICAgICAgZGVidWcoXCJhY2wgb3V0IHF1ZXVlIGNvbmdlc3RlZFwiKTtcbiAgICAgIGRlYnVnKFwiXFx0aW4gcHJvZ3Jlc3MgPSBcIiArIGluUHJvZ3Jlc3MpO1xuICAgICAgZGVidWcoXCJcXHR3YWl0aW5nID0gXCIgKyB0aGlzLl9hY2xPdXRRdWV1ZS5sZW5ndGgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB3cml0ZU9uZUFjbERhdGFQa3QoKSB7XG4gICAgZGVidWcoXCJ3cml0ZU9uZUFjbERhdGFQa3RcIik7XG4gICAgY29uc3QgcGt0OiBhbnkgPSB0aGlzLl9hY2xPdXRRdWV1ZS5zaGlmdCgpO1xuICAgIHRoaXMuX2hhbmRsZUFjbHNJblByb2dyZXNzW3BrdC5oYW5kbGVdKys7XG4gICAgZGVidWcoXG4gICAgICBcIndyaXRlIGFjbCBkYXRhIHBrdCBmcmFnIFwiICtcbiAgICAgIHBrdC5mcmFnSWQgK1xuICAgICAgXCIgaGFuZGxlIFwiICtcbiAgICAgIHBrdC5oYW5kbGUgK1xuICAgICAgXCIgLSB3cml0aW5nOiBcIiArXG4gICAgICBwa3QucGt0LnRvU3RyaW5nKFwiaGV4XCIpLFxuICAgICk7XG4gICAgdGhpcy5fc29ja2V0LndyaXRlKHBrdC5wa3QpO1xuICB9XG5cbiAgcHVibGljIG9uU29ja2V0RGF0YShhcnJheTogYW55KSB7XG4gICAgY29uc3QgZGF0YTogYW55ID0gQnVmZmVyLmZyb20oYXJyYXkpO1xuICAgIGRlYnVnKFwib25Tb2NrZXREYXRhOiBcIiArIGRhdGEudG9TdHJpbmcoXCJoZXhcIikpO1xuXG4gICAgY29uc3QgZXZlbnRUeXBlOiBhbnkgPSBkYXRhLnJlYWRVSW50OCgwKTtcblxuICAgIGRlYnVnKFwiXFx0ZXZlbnQgdHlwZSA9IFwiICsgZXZlbnRUeXBlKTtcblxuICAgIGlmIChIQ0lfRVZFTlRfUEtUID09PSBldmVudFR5cGUpIHtcbiAgICAgIGNvbnN0IHN1YkV2ZW50VHlwZTogYW55ID0gZGF0YS5yZWFkVUludDgoMSk7XG5cbiAgICAgIGRlYnVnKFwiXFx0c3ViIGV2ZW50IHR5cGUgPSBcIiArIHN1YkV2ZW50VHlwZSk7XG5cbiAgICAgIGlmIChzdWJFdmVudFR5cGUgPT09IEVWVF9ESVNDT05OX0NPTVBMRVRFKSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZTogYW55ID0gZGF0YS5yZWFkVUludDE2TEUoNCk7XG4gICAgICAgIGNvbnN0IHJlYXNvbjogYW55ID0gZGF0YS5yZWFkVUludDgoNik7XG5cbiAgICAgICAgZGVidWcoXCJcXHRcXHRoYW5kbGUgPSBcIiArIGhhbmRsZSk7XG4gICAgICAgIGRlYnVnKFwiXFx0XFx0cmVhc29uID0gXCIgKyByZWFzb24pO1xuXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9oYW5kbGVBY2xzSW5Qcm9ncmVzc1toYW5kbGVdO1xuICAgICAgICBjb25zdCBhY2xPdXRRdWV1ZTogYW55ID0gW107XG4gICAgICAgIGxldCBkaXNjYXJkZWQ6IGFueSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiB0aGlzLl9hY2xPdXRRdWV1ZSkge1xuICAgICAgICAgIGlmICh0aGlzLl9hY2xPdXRRdWV1ZVtpXS5oYW5kbGUgIT09IGhhbmRsZSkge1xuICAgICAgICAgICAgYWNsT3V0UXVldWUucHVzaCh0aGlzLl9hY2xPdXRRdWV1ZVtpXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc2NhcmRlZCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlzY2FyZGVkKSB7XG4gICAgICAgICAgZGVidWcoXCJcXHRcXHRhY2xzIGRpc2NhcmRlZCA9IFwiICsgZGlzY2FyZGVkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hY2xPdXRRdWV1ZSA9IGFjbE91dFF1ZXVlO1xuICAgICAgICB0aGlzLnB1c2hBY2xPdXRRdWV1ZSgpO1xuXG4gICAgICAgIHRoaXMuZW1pdChcImRpc2Nvbm5Db21wbGV0ZVwiLCBoYW5kbGUsIHJlYXNvbik7XG4gICAgICB9IGVsc2UgaWYgKHN1YkV2ZW50VHlwZSA9PT0gRVZUX0VOQ1JZUFRfQ0hBTkdFKSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZTogYW55ID0gZGF0YS5yZWFkVUludDE2TEUoNCk7XG4gICAgICAgIGNvbnN0IGVuY3J5cHQ6IGFueSA9IGRhdGEucmVhZFVJbnQ4KDYpO1xuXG4gICAgICAgIGRlYnVnKFwiXFx0XFx0aGFuZGxlID0gXCIgKyBoYW5kbGUpO1xuICAgICAgICBkZWJ1ZyhcIlxcdFxcdGVuY3J5cHQgPSBcIiArIGVuY3J5cHQpO1xuXG4gICAgICAgIHRoaXMuZW1pdChcImVuY3J5cHRDaGFuZ2VcIiwgaGFuZGxlLCBlbmNyeXB0KTtcbiAgICAgIH0gZWxzZSBpZiAoc3ViRXZlbnRUeXBlID09PSBFVlRfQ01EX0NPTVBMRVRFKSB7XG4gICAgICAgIGNvbnN0IG5jbWQ6IGFueSA9IGRhdGEucmVhZFVJbnQ4KDMpO1xuICAgICAgICBjb25zdCBjbWQ6IGFueSA9IGRhdGEucmVhZFVJbnQxNkxFKDQpO1xuICAgICAgICBjb25zdCBzdGF0dXM6IGFueSA9IGRhdGEucmVhZFVJbnQ4KDYpO1xuICAgICAgICBjb25zdCByZXN1bHQ6IGFueSA9IGRhdGEuc2xpY2UoNyk7XG5cbiAgICAgICAgZGVidWcoXCJcXHRcXHRuY21kID0gXCIgKyBuY21kKTtcbiAgICAgICAgZGVidWcoXCJcXHRcXHRjbWQgPSBcIiArIGNtZCk7XG4gICAgICAgIGRlYnVnKFwiXFx0XFx0c3RhdHVzID0gXCIgKyBzdGF0dXMpO1xuICAgICAgICBkZWJ1ZyhcIlxcdFxcdHJlc3VsdCA9IFwiICsgcmVzdWx0LnRvU3RyaW5nKFwiaGV4XCIpKTtcblxuICAgICAgICB0aGlzLnByb2Nlc3NDbWRDb21wbGV0ZUV2ZW50KGNtZCwgc3RhdHVzLCByZXN1bHQpO1xuICAgICAgfSBlbHNlIGlmIChzdWJFdmVudFR5cGUgPT09IEVWVF9DTURfU1RBVFVTKSB7XG4gICAgICAgIGNvbnN0IHN0YXR1czogYW55ID0gZGF0YS5yZWFkVUludDgoMyk7XG4gICAgICAgIGNvbnN0IGNtZDogYW55ID0gZGF0YS5yZWFkVUludDE2TEUoNSk7XG5cbiAgICAgICAgZGVidWcoXCJcXHRcXHRzdGF0dXMgPSBcIiArIHN0YXR1cyk7XG4gICAgICAgIGRlYnVnKFwiXFx0XFx0Y21kID0gXCIgKyBjbWQpO1xuXG4gICAgICAgIHRoaXMucHJvY2Vzc0NtZFN0YXR1c0V2ZW50KGNtZCwgc3RhdHVzKTtcbiAgICAgIH0gZWxzZSBpZiAoc3ViRXZlbnRUeXBlID09PSBFVlRfTEVfTUVUQV9FVkVOVCkge1xuICAgICAgICBjb25zdCBsZU1ldGFFdmVudFR5cGU6IGFueSA9IGRhdGEucmVhZFVJbnQ4KDMpO1xuICAgICAgICBjb25zdCBsZU1ldGFFdmVudFN0YXR1czogYW55ID0gZGF0YS5yZWFkVUludDgoNCk7XG4gICAgICAgIGNvbnN0IGxlTWV0YUV2ZW50RGF0YTogYW55ID0gZGF0YS5zbGljZSg1KTtcblxuICAgICAgICBkZWJ1ZyhcIlxcdFxcdExFIG1ldGEgZXZlbnQgdHlwZSA9IFwiICsgbGVNZXRhRXZlbnRUeXBlKTtcbiAgICAgICAgZGVidWcoXCJcXHRcXHRMRSBtZXRhIGV2ZW50IHN0YXR1cyA9IFwiICsgbGVNZXRhRXZlbnRTdGF0dXMpO1xuICAgICAgICBkZWJ1ZyhcIlxcdFxcdExFIG1ldGEgZXZlbnQgZGF0YSA9IFwiICsgbGVNZXRhRXZlbnREYXRhLnRvU3RyaW5nKFwiaGV4XCIpKTtcblxuICAgICAgICB0aGlzLnByb2Nlc3NMZU1ldGFFdmVudChcbiAgICAgICAgICBsZU1ldGFFdmVudFR5cGUsXG4gICAgICAgICAgbGVNZXRhRXZlbnRTdGF0dXMsXG4gICAgICAgICAgbGVNZXRhRXZlbnREYXRhLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChzdWJFdmVudFR5cGUgPT09IEVWVF9OVU1CRVJfT0ZfQ09NUExFVEVEX1BBQ0tFVFMpIHtcbiAgICAgICAgY29uc3QgaGFuZGxlczogYW55ID0gZGF0YS5yZWFkVUludDgoMyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFuZGxlczsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgaGFuZGxlOiBhbnkgPSBkYXRhLnJlYWRVSW50MTZMRSg0ICsgaSAqIDQpO1xuICAgICAgICAgIGNvbnN0IHBrdHM6IGFueSA9IGRhdGEucmVhZFVJbnQxNkxFKDYgKyBpICogNCk7XG4gICAgICAgICAgZGVidWcoXCJcXHRoYW5kbGUgPSBcIiArIGhhbmRsZSk7XG4gICAgICAgICAgZGVidWcoXCJcXHRcXHRjb21wbGV0ZWQgPSBcIiArIHBrdHMpO1xuICAgICAgICAgIGlmICh0aGlzLl9oYW5kbGVBY2xzSW5Qcm9ncmVzc1toYW5kbGVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGRlYnVnKFwiXFx0XFx0YWxyZWFkeSBjbG9zZWRcIik7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHBrdHMgPiB0aGlzLl9oYW5kbGVBY2xzSW5Qcm9ncmVzc1toYW5kbGVdKSB7XG4gICAgICAgICAgICAvLyBMaW51eCBrZXJuZWwgbWF5IHNlbmQgYWNsIHBhY2tldHMgYnkgaXRzZWxmLCBzbyBiZSByZWFkeSBmb3IgdW5kZXJmbG93XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVBY2xzSW5Qcm9ncmVzc1toYW5kbGVdID0gMDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlQWNsc0luUHJvZ3Jlc3NbaGFuZGxlXSAtPSBwa3RzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWJ1ZyhcIlxcdFxcdGluIHByb2dyZXNzID0gXCIgKyB0aGlzLl9oYW5kbGVBY2xzSW5Qcm9ncmVzc1toYW5kbGVdKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnB1c2hBY2xPdXRRdWV1ZSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoSENJX0FDTERBVEFfUEtUID09PSBldmVudFR5cGUpIHtcbiAgICAgIGNvbnN0IGZsYWdzOiBhbnkgPSBkYXRhLnJlYWRVSW50MTZMRSgxKSA+PiAxMjtcbiAgICAgIGNvbnN0IGhhbmRsZTogYW55ID0gZGF0YS5yZWFkVUludDE2TEUoMSkgJiAweDBmZmY7XG5cbiAgICAgIGlmIChBQ0xfU1RBUlQgPT09IGZsYWdzKSB7XG4gICAgICAgIGNvbnN0IGNpZDogYW55ID0gZGF0YS5yZWFkVUludDE2TEUoNyk7XG5cbiAgICAgICAgY29uc3QgbGVuZ3RoOiBhbnkgPSBkYXRhLnJlYWRVSW50MTZMRSg1KTtcbiAgICAgICAgY29uc3QgcGt0RGF0YTogYW55ID0gZGF0YS5zbGljZSg5KTtcblxuICAgICAgICBkZWJ1ZyhcIlxcdFxcdGNpZCA9IFwiICsgY2lkKTtcblxuICAgICAgICBpZiAobGVuZ3RoID09PSBwa3REYXRhLmxlbmd0aCkge1xuICAgICAgICAgIGRlYnVnKFwiXFx0XFx0aGFuZGxlID0gXCIgKyBoYW5kbGUpO1xuICAgICAgICAgIGRlYnVnKFwiXFx0XFx0ZGF0YSA9IFwiICsgcGt0RGF0YS50b1N0cmluZyhcImhleFwiKSk7XG5cbiAgICAgICAgICB0aGlzLmVtaXQoXCJhY2xEYXRhUGt0XCIsIGhhbmRsZSwgY2lkLCBwa3REYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVCdWZmZXJzW2hhbmRsZV0gPSB7XG4gICAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICAgICBjaWQsXG4gICAgICAgICAgICBkYXRhOiBwa3REYXRhLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoQUNMX0NPTlQgPT09IGZsYWdzKSB7XG4gICAgICAgIGlmICghdGhpcy5faGFuZGxlQnVmZmVyc1toYW5kbGVdIHx8ICF0aGlzLl9oYW5kbGVCdWZmZXJzW2hhbmRsZV0uZGF0YSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2hhbmRsZUJ1ZmZlcnNbaGFuZGxlXS5kYXRhID0gQnVmZmVyLmNvbmNhdChbXG4gICAgICAgICAgdGhpcy5faGFuZGxlQnVmZmVyc1toYW5kbGVdLmRhdGEsXG4gICAgICAgICAgZGF0YS5zbGljZSg1KSxcbiAgICAgICAgXSk7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuX2hhbmRsZUJ1ZmZlcnNbaGFuZGxlXS5kYXRhLmxlbmd0aCA9PT1cbiAgICAgICAgICB0aGlzLl9oYW5kbGVCdWZmZXJzW2hhbmRsZV0ubGVuZ3RoXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgICAgIFwiYWNsRGF0YVBrdFwiLFxuICAgICAgICAgICAgaGFuZGxlLFxuICAgICAgICAgICAgdGhpcy5faGFuZGxlQnVmZmVyc1toYW5kbGVdLmNpZCxcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZUJ1ZmZlcnNbaGFuZGxlXS5kYXRhLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBkZWxldGUgdGhpcy5faGFuZGxlQnVmZmVyc1toYW5kbGVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChIQ0lfQ09NTUFORF9QS1QgPT09IGV2ZW50VHlwZSkge1xuICAgICAgY29uc3QgY21kOiBhbnkgPSBkYXRhLnJlYWRVSW50MTZMRSgxKTtcbiAgICAgIGNvbnN0IGxlbjogYW55ID0gZGF0YS5yZWFkVUludDgoMyk7XG5cbiAgICAgIGRlYnVnKFwiXFx0XFx0Y21kID0gXCIgKyBjbWQpO1xuICAgICAgZGVidWcoXCJcXHRcXHRkYXRhIGxlbiA9IFwiICsgbGVuKTtcblxuICAgICAgaWYgKGNtZCA9PT0gTEVfU0VUX1NDQU5fRU5BQkxFX0NNRCkge1xuICAgICAgICBjb25zdCBlbmFibGU6IGFueSA9IGRhdGEucmVhZFVJbnQ4KDQpID09PSAweDE7XG4gICAgICAgIGNvbnN0IGZpbHRlckR1cGxpY2F0ZXM6IGFueSA9IGRhdGEucmVhZFVJbnQ4KDUpID09PSAweDE7XG5cbiAgICAgICAgZGVidWcoXCJcXHRcXHRcXHRMRSBlbmFibGUgc2NhbiBjb21tYW5kXCIpO1xuICAgICAgICBkZWJ1ZyhcIlxcdFxcdFxcdGVuYWJsZSBzY2FubmluZyA9IFwiICsgZW5hYmxlKTtcbiAgICAgICAgZGVidWcoXCJcXHRcXHRcXHRmaWx0ZXIgZHVwbGljYXRlcyA9IFwiICsgZmlsdGVyRHVwbGljYXRlcyk7XG5cbiAgICAgICAgdGhpcy5lbWl0KFwibGVTY2FuRW5hYmxlU2V0Q21kXCIsIGVuYWJsZSwgZmlsdGVyRHVwbGljYXRlcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uU29ja2V0RXJyb3IoZXJyb3I6IGFueSkge1xuICAgIGRlYnVnKFwib25Tb2NrZXRFcnJvcjogXCIgKyBlcnJvci5tZXNzYWdlKTtcblxuICAgIGlmIChlcnJvci5tZXNzYWdlID09PSBcIk9wZXJhdGlvbiBub3QgcGVybWl0dGVkXCIpIHtcbiAgICAgIHRoaXMuZW1pdChcInN0YXRlQ2hhbmdlXCIsIFwidW5hdXRob3JpemVkXCIpO1xuICAgIH0gZWxzZSBpZiAoZXJyb3IubWVzc2FnZSA9PT0gXCJOZXR3b3JrIGlzIGRvd25cIikge1xuICAgICAgLy8gbm8tb3BcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcHJvY2Vzc0NtZENvbXBsZXRlRXZlbnQoY21kOiBhbnksIHN0YXR1czogYW55LCByZXN1bHQ6IGFueSkge1xuICAgIGlmIChjbWQgPT09IFJFU0VUX0NNRCkge1xuICAgICAgdGhpcy5yZXNldEJ1ZmZlcnMoKTtcbiAgICAgIHRoaXMuc2V0RXZlbnRNYXNrKCk7XG4gICAgICB0aGlzLnNldExlRXZlbnRNYXNrKCk7XG4gICAgICB0aGlzLnJlYWRMb2NhbFZlcnNpb24oKTtcbiAgICAgIHRoaXMucmVhZEJkQWRkcigpO1xuICAgICAgdGhpcy53cml0ZUxlSG9zdFN1cHBvcnRlZCgpO1xuICAgICAgdGhpcy5yZWFkTGVIb3N0U3VwcG9ydGVkKCk7XG4gICAgICB0aGlzLmxlUmVhZEJ1ZmZlclNpemUoKTtcbiAgICB9IGVsc2UgaWYgKGNtZCA9PT0gUkVBRF9MRV9IT1NUX1NVUFBPUlRFRF9DTUQpIHtcbiAgICAgIGlmIChzdGF0dXMgPT09IDApIHtcbiAgICAgICAgY29uc3QgbGU6IGFueSA9IHJlc3VsdC5yZWFkVUludDgoMCk7XG4gICAgICAgIGNvbnN0IHNpbXVsOiBhbnkgPSByZXN1bHQucmVhZFVJbnQ4KDEpO1xuXG4gICAgICAgIGRlYnVnKFwiXFx0XFx0XFx0bGUgPSBcIiArIGxlKTtcbiAgICAgICAgZGVidWcoXCJcXHRcXHRcXHRzaW11bCA9IFwiICsgc2ltdWwpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY21kID09PSBSRUFEX0xPQ0FMX1ZFUlNJT05fQ01EKSB7XG4gICAgICBjb25zdCBoY2lWZXI6IGFueSA9IHJlc3VsdC5yZWFkVUludDgoMCk7XG4gICAgICBjb25zdCBoY2lSZXY6IGFueSA9IHJlc3VsdC5yZWFkVUludDE2TEUoMSk7XG4gICAgICBjb25zdCBsbXBWZXI6IGFueSA9IHJlc3VsdC5yZWFkSW50OCgzKTtcbiAgICAgIGNvbnN0IG1hbnVmYWN0dXJlcjogYW55ID0gcmVzdWx0LnJlYWRVSW50MTZMRSg0KTtcbiAgICAgIGNvbnN0IGxtcFN1YlZlcjogYW55ID0gcmVzdWx0LnJlYWRVSW50MTZMRSg2KTtcblxuICAgICAgaWYgKGhjaVZlciA8IDB4MDYpIHtcbiAgICAgICAgdGhpcy5lbWl0KFwic3RhdGVDaGFuZ2VcIiwgXCJ1bnN1cHBvcnRlZFwiKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fc3RhdGUgIT09IFwicG93ZXJlZE9uXCIpIHtcbiAgICAgICAgdGhpcy5zZXRTY2FuRW5hYmxlZChmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc2V0U2NhblBhcmFtZXRlcnMoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5lbWl0KFxuICAgICAgICBcInJlYWRMb2NhbFZlcnNpb25cIixcbiAgICAgICAgaGNpVmVyLFxuICAgICAgICBoY2lSZXYsXG4gICAgICAgIGxtcFZlcixcbiAgICAgICAgbWFudWZhY3R1cmVyLFxuICAgICAgICBsbXBTdWJWZXIsXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoY21kID09PSBSRUFEX0JEX0FERFJfQ01EKSB7XG4gICAgICB0aGlzLmFkZHJlc3NUeXBlID0gXCJwdWJsaWNcIjtcbiAgICAgIHRoaXMuYWRkcmVzcyA9IHJlc3VsdFxuICAgICAgICAudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAuam9pbihcIjpcIik7XG5cbiAgICAgIGRlYnVnKFwiYWRkcmVzcyA9IFwiICsgdGhpcy5hZGRyZXNzKTtcblxuICAgICAgdGhpcy5lbWl0KFwiYWRkcmVzc0NoYW5nZVwiLCB0aGlzLmFkZHJlc3MpO1xuICAgIH0gZWxzZSBpZiAoY21kID09PSBMRV9TRVRfU0NBTl9QQVJBTUVURVJTX0NNRCkge1xuICAgICAgdGhpcy5lbWl0KFwic3RhdGVDaGFuZ2VcIiwgXCJwb3dlcmVkT25cIik7XG5cbiAgICAgIHRoaXMuZW1pdChcImxlU2NhblBhcmFtZXRlcnNTZXRcIik7XG4gICAgfSBlbHNlIGlmIChjbWQgPT09IExFX1NFVF9TQ0FOX0VOQUJMRV9DTUQpIHtcbiAgICAgIHRoaXMuZW1pdChcImxlU2NhbkVuYWJsZVNldFwiLCBzdGF0dXMpO1xuICAgIH0gZWxzZSBpZiAoY21kID09PSBMRV9TRVRfQURWRVJUSVNJTkdfUEFSQU1FVEVSU19DTUQpIHtcbiAgICAgIHRoaXMuZW1pdChcInN0YXRlQ2hhbmdlXCIsIFwicG93ZXJlZE9uXCIpO1xuXG4gICAgICB0aGlzLmVtaXQoXCJsZUFkdmVydGlzaW5nUGFyYW1ldGVyc1NldFwiLCBzdGF0dXMpO1xuICAgIH0gZWxzZSBpZiAoY21kID09PSBMRV9TRVRfQURWRVJUSVNJTkdfREFUQV9DTUQpIHtcbiAgICAgIHRoaXMuZW1pdChcImxlQWR2ZXJ0aXNpbmdEYXRhU2V0XCIsIHN0YXR1cyk7XG4gICAgfSBlbHNlIGlmIChjbWQgPT09IExFX1NFVF9TQ0FOX1JFU1BPTlNFX0RBVEFfQ01EKSB7XG4gICAgICB0aGlzLmVtaXQoXCJsZVNjYW5SZXNwb25zZURhdGFTZXRcIiwgc3RhdHVzKTtcbiAgICB9IGVsc2UgaWYgKGNtZCA9PT0gTEVfU0VUX0FEVkVSVElTRV9FTkFCTEVfQ01EKSB7XG4gICAgICB0aGlzLmVtaXQoXCJsZUFkdmVydGlzZUVuYWJsZVNldFwiLCBzdGF0dXMpO1xuICAgIH0gZWxzZSBpZiAoY21kID09PSBSRUFEX1JTU0lfQ01EKSB7XG4gICAgICBjb25zdCBoYW5kbGU6IGFueSA9IHJlc3VsdC5yZWFkVUludDE2TEUoMCk7XG4gICAgICBjb25zdCByc3NpOiBhbnkgPSByZXN1bHQucmVhZEludDgoMik7XG5cbiAgICAgIGRlYnVnKFwiXFx0XFx0XFx0aGFuZGxlID0gXCIgKyBoYW5kbGUpO1xuICAgICAgZGVidWcoXCJcXHRcXHRcXHRyc3NpID0gXCIgKyByc3NpKTtcblxuICAgICAgdGhpcy5lbWl0KFwicnNzaVJlYWRcIiwgaGFuZGxlLCByc3NpKTtcbiAgICB9IGVsc2UgaWYgKGNtZCA9PT0gTEVfTFRLX05FR19SRVBMWV9DTUQpIHtcbiAgICAgIGNvbnN0IGhhbmRsZTogYW55ID0gcmVzdWx0LnJlYWRVSW50MTZMRSgwKTtcblxuICAgICAgZGVidWcoXCJcXHRcXHRcXHRoYW5kbGUgPSBcIiArIGhhbmRsZSk7XG4gICAgICB0aGlzLmVtaXQoXCJsZUx0a05lZ1JlcGx5XCIsIGhhbmRsZSk7XG4gICAgfSBlbHNlIGlmIChjbWQgPT09IExFX1JFQURfQlVGRkVSX1NJWkVfQ01EKSB7XG4gICAgICBpZiAoIXN0YXR1cykge1xuICAgICAgICB0aGlzLnByb2Nlc3NMZVJlYWRCdWZmZXJTaXplKHJlc3VsdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjbWQgPT09IFJFQURfQlVGRkVSX1NJWkVfQ01EKSB7XG4gICAgICBpZiAoIXN0YXR1cykge1xuICAgICAgICBjb25zdCBhY2xNdHU6IGFueSA9IHJlc3VsdC5yZWFkVUludDE2TEUoMCk7XG4gICAgICAgIGNvbnN0IGFjbE1heEluUHJvZ3Jlc3M6IGFueSA9IHJlc3VsdC5yZWFkVUludDE2TEUoMyk7XG4gICAgICAgIC8vIHNhbml0eVxuICAgICAgICBpZiAoYWNsTXR1ICYmIGFjbE1heEluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICBkZWJ1ZyhcImJyL2VkciBhY2wgbXR1ID0gXCIgKyBhY2xNdHUpO1xuICAgICAgICAgIGRlYnVnKFwiYnIvZWRyIGFjbCBtYXggcGt0cyA9IFwiICsgYWNsTWF4SW5Qcm9ncmVzcyk7XG4gICAgICAgICAgdGhpcy5fYWNsTXR1ID0gYWNsTXR1O1xuICAgICAgICAgIHRoaXMuX2FjbE1heEluUHJvZ3Jlc3MgPSBhY2xNYXhJblByb2dyZXNzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHByb2Nlc3NMZU1ldGFFdmVudChldmVudFR5cGU6IGFueSwgc3RhdHVzOiBhbnksIGRhdGE6IGFueSkge1xuICAgIGlmIChldmVudFR5cGUgPT09IEVWVF9MRV9DT05OX0NPTVBMRVRFKSB7XG4gICAgICB0aGlzLnByb2Nlc3NMZUNvbm5Db21wbGV0ZShzdGF0dXMsIGRhdGEpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnRUeXBlID09PSBFVlRfTEVfQURWRVJUSVNJTkdfUkVQT1JUKSB7XG4gICAgICB0aGlzLnByb2Nlc3NMZUFkdmVydGlzaW5nUmVwb3J0KHN0YXR1cywgZGF0YSk7XG4gICAgfSBlbHNlIGlmIChldmVudFR5cGUgPT09IEVWVF9MRV9DT05OX1VQREFURV9DT01QTEVURSkge1xuICAgICAgdGhpcy5wcm9jZXNzTGVDb25uVXBkYXRlQ29tcGxldGUoc3RhdHVzLCBkYXRhKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcHJvY2Vzc0xlQ29ubkNvbXBsZXRlKHN0YXR1czogYW55LCBkYXRhOiBhbnkpIHtcbiAgICBjb25zdCBoYW5kbGU6IGFueSA9IGRhdGEucmVhZFVJbnQxNkxFKDApO1xuICAgIGNvbnN0IHJvbGU6IGFueSA9IGRhdGEucmVhZFVJbnQ4KDIpO1xuICAgIGNvbnN0IGFkZHJlc3NUeXBlOiBhbnkgPSBkYXRhLnJlYWRVSW50OCgzKSA9PT0gMHgwMSA/IFwicmFuZG9tXCIgOiBcInB1YmxpY1wiO1xuICAgIGNvbnN0IGFkZHJlc3M6IGFueSA9IGRhdGFcbiAgICAgIC5zbGljZSg0LCAxMClcbiAgICAgIC50b1N0cmluZyhcImhleFwiKVxuICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC5qb2luKFwiOlwiKTtcbiAgICBjb25zdCBpbnRlcnZhbDogYW55ID0gZGF0YS5yZWFkVUludDE2TEUoMTApICogMS4yNTtcbiAgICBjb25zdCBsYXRlbmN5OiBhbnkgPSBkYXRhLnJlYWRVSW50MTZMRSgxMik7IC8vIFRPRE86IG11bHRpcGxpZXI/XG4gICAgY29uc3Qgc3VwZXJ2aXNpb25UaW1lb3V0OiBhbnkgPSBkYXRhLnJlYWRVSW50MTZMRSgxNCkgKiAxMDtcbiAgICBjb25zdCBtYXN0ZXJDbG9ja0FjY3VyYWN5OiBhbnkgPSBkYXRhLnJlYWRVSW50OCgxNik7IC8vIFRPRE86IG11bHRpcGxpZXI/XG5cbiAgICBkZWJ1ZyhcIlxcdFxcdFxcdGhhbmRsZSA9IFwiICsgaGFuZGxlKTtcbiAgICBkZWJ1ZyhcIlxcdFxcdFxcdHJvbGUgPSBcIiArIHJvbGUpO1xuICAgIGRlYnVnKFwiXFx0XFx0XFx0YWRkcmVzcyB0eXBlID0gXCIgKyBhZGRyZXNzVHlwZSk7XG4gICAgZGVidWcoXCJcXHRcXHRcXHRhZGRyZXNzID0gXCIgKyBhZGRyZXNzKTtcbiAgICBkZWJ1ZyhcIlxcdFxcdFxcdGludGVydmFsID0gXCIgKyBpbnRlcnZhbCk7XG4gICAgZGVidWcoXCJcXHRcXHRcXHRsYXRlbmN5ID0gXCIgKyBsYXRlbmN5KTtcbiAgICBkZWJ1ZyhcIlxcdFxcdFxcdHN1cGVydmlzaW9uIHRpbWVvdXQgPSBcIiArIHN1cGVydmlzaW9uVGltZW91dCk7XG4gICAgZGVidWcoXCJcXHRcXHRcXHRtYXN0ZXIgY2xvY2sgYWNjdXJhY3kgPSBcIiArIG1hc3RlckNsb2NrQWNjdXJhY3kpO1xuXG4gICAgdGhpcy5faGFuZGxlQWNsc0luUHJvZ3Jlc3NbaGFuZGxlXSA9IDA7XG5cbiAgICB0aGlzLmVtaXQoXG4gICAgICBcImxlQ29ubkNvbXBsZXRlXCIsXG4gICAgICBzdGF0dXMsXG4gICAgICBoYW5kbGUsXG4gICAgICByb2xlLFxuICAgICAgYWRkcmVzc1R5cGUsXG4gICAgICBhZGRyZXNzLFxuICAgICAgaW50ZXJ2YWwsXG4gICAgICBsYXRlbmN5LFxuICAgICAgc3VwZXJ2aXNpb25UaW1lb3V0LFxuICAgICAgbWFzdGVyQ2xvY2tBY2N1cmFjeSxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIHByb2Nlc3NMZUFkdmVydGlzaW5nUmVwb3J0KGNvdW50OiBhbnksIGRhdGE6IGFueSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgY29uc3QgdHlwZTogYW55ID0gZGF0YS5yZWFkVUludDgoMCk7XG4gICAgICBjb25zdCBhZGRyZXNzVHlwZTogYW55ID0gZGF0YS5yZWFkVUludDgoMSkgPT09IDB4MDEgPyBcInJhbmRvbVwiIDogXCJwdWJsaWNcIjtcbiAgICAgIGNvbnN0IGFkZHJlc3M6IGFueSA9IGRhdGFcbiAgICAgICAgLnNsaWNlKDIsIDgpXG4gICAgICAgIC50b1N0cmluZyhcImhleFwiKVxuICAgICAgICAubWF0Y2goLy57MSwyfS9nKVxuICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgIC5qb2luKFwiOlwiKTtcbiAgICAgIGNvbnN0IGVpckxlbmd0aDogYW55ID0gZGF0YS5yZWFkVUludDgoOCk7XG4gICAgICBjb25zdCBlaXI6IGFueSA9IGRhdGEuc2xpY2UoOSwgZWlyTGVuZ3RoICsgOSk7XG4gICAgICBjb25zdCByc3NpOiBhbnkgPSBkYXRhLnJlYWRJbnQ4KGVpckxlbmd0aCArIDkpO1xuXG4gICAgICBkZWJ1ZyhcIlxcdFxcdFxcdHR5cGUgPSBcIiArIHR5cGUpO1xuICAgICAgZGVidWcoXCJcXHRcXHRcXHRhZGRyZXNzID0gXCIgKyBhZGRyZXNzKTtcbiAgICAgIGRlYnVnKFwiXFx0XFx0XFx0YWRkcmVzcyB0eXBlID0gXCIgKyBhZGRyZXNzVHlwZSk7XG4gICAgICBkZWJ1ZyhcIlxcdFxcdFxcdGVpciA9IFwiICsgZWlyLnRvU3RyaW5nKFwiaGV4XCIpKTtcbiAgICAgIGRlYnVnKFwiXFx0XFx0XFx0cnNzaSA9IFwiICsgcnNzaSk7XG5cbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgXCJsZUFkdmVydGlzaW5nUmVwb3J0XCIsXG4gICAgICAgIDAsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGFkZHJlc3MsXG4gICAgICAgIGFkZHJlc3NUeXBlLFxuICAgICAgICBlaXIsXG4gICAgICAgIHJzc2ksXG4gICAgICApO1xuXG4gICAgICBkYXRhID0gZGF0YS5zbGljZShlaXJMZW5ndGggKyAxMCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHByb2Nlc3NMZUNvbm5VcGRhdGVDb21wbGV0ZShzdGF0dXM6IGFueSwgZGF0YTogYW55KSB7XG4gICAgY29uc3QgaGFuZGxlOiBhbnkgPSBkYXRhLnJlYWRVSW50MTZMRSgwKTtcbiAgICBjb25zdCBpbnRlcnZhbDogYW55ID0gZGF0YS5yZWFkVUludDE2TEUoMikgKiAxLjI1O1xuICAgIGNvbnN0IGxhdGVuY3k6IGFueSA9IGRhdGEucmVhZFVJbnQxNkxFKDQpOyAvLyBUT0RPOiBtdWx0aXBsaWVyP1xuICAgIGNvbnN0IHN1cGVydmlzaW9uVGltZW91dDogYW55ID0gZGF0YS5yZWFkVUludDE2TEUoNikgKiAxMDtcblxuICAgIGRlYnVnKFwiXFx0XFx0XFx0aGFuZGxlID0gXCIgKyBoYW5kbGUpO1xuICAgIGRlYnVnKFwiXFx0XFx0XFx0aW50ZXJ2YWwgPSBcIiArIGludGVydmFsKTtcbiAgICBkZWJ1ZyhcIlxcdFxcdFxcdGxhdGVuY3kgPSBcIiArIGxhdGVuY3kpO1xuICAgIGRlYnVnKFwiXFx0XFx0XFx0c3VwZXJ2aXNpb24gdGltZW91dCA9IFwiICsgc3VwZXJ2aXNpb25UaW1lb3V0KTtcblxuICAgIHRoaXMuZW1pdChcbiAgICAgIFwibGVDb25uVXBkYXRlQ29tcGxldGVcIixcbiAgICAgIHN0YXR1cyxcbiAgICAgIGhhbmRsZSxcbiAgICAgIGludGVydmFsLFxuICAgICAgbGF0ZW5jeSxcbiAgICAgIHN1cGVydmlzaW9uVGltZW91dCxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIHByb2Nlc3NDbWRTdGF0dXNFdmVudChjbWQ6IGFueSwgc3RhdHVzOiBhbnkpIHtcbiAgICBpZiAoY21kID09PSBMRV9DUkVBVEVfQ09OTl9DTUQpIHtcbiAgICAgIGlmIChzdGF0dXMgIT09IDApIHtcbiAgICAgICAgdGhpcy5lbWl0KFwibGVDb25uQ29tcGxldGVcIiwgc3RhdHVzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcHJvY2Vzc0xlUmVhZEJ1ZmZlclNpemUocmVzdWx0OiBhbnkpIHtcbiAgICBjb25zdCBhY2xNdHU6IGFueSA9IHJlc3VsdC5yZWFkVUludDE2TEUoMCk7XG4gICAgY29uc3QgYWNsTWF4SW5Qcm9ncmVzczogYW55ID0gcmVzdWx0LnJlYWRVSW50OCgyKTtcbiAgICBpZiAoIWFjbE10dSkge1xuICAgICAgLy8gYXMgcGVyIEJsdWV0b290aCBzcGVjc1xuICAgICAgZGVidWcoXCJmYWxsaW5nIGJhY2sgdG8gYnIvZWRyIGJ1ZmZlciBzaXplXCIpO1xuICAgICAgdGhpcy5yZWFkQnVmZmVyU2l6ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1ZyhcImxlIGFjbCBtdHUgPSBcIiArIGFjbE10dSk7XG4gICAgICBkZWJ1ZyhcImxlIGFjbCBtYXggaW4gcHJvZ3Jlc3MgPSBcIiArIGFjbE1heEluUHJvZ3Jlc3MpO1xuICAgICAgdGhpcy5fYWNsTXR1ID0gYWNsTXR1O1xuICAgICAgdGhpcy5fYWNsTWF4SW5Qcm9ncmVzcyA9IGFjbE1heEluUHJvZ3Jlc3M7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uU3RhdGVDaGFuZ2Uoc3RhdGU6IGFueSkge1xuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gIH1cbn1cblxuSGNpLlNUQVRVU19NQVBQRVIgPSBTVEFUVVNfTUFQUEVSO1xuZXhwb3J0IGRlZmF1bHQgSGNpO1xuIl19
