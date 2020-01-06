"use strict";
// let debug = require('debug')('mgmt');
const debug = () => { };
let LTK_INFO_SIZE = 36;
let MGMT_OP_LOAD_LONG_TERM_KEYS = 0x0013;
class Mgmt {
    construcotr(hciProtocol) {
        this._ltkInfos = [];
        this._hci = hciProtocol;
    }
    nSocketData(data) {
        debug('on data ->' + data.toString('hex'));
    }
    nSocketError(error) {
        debug('on error ->' + error.message);
    }
    ddLongTermKey(address, addressType, authenticated, master, ediv, rand, key) {
        let ltkInfo = Buffer.alloc(LTK_INFO_SIZE);
        address.copy(ltkInfo, 0);
        ltkInfo.writeUInt8(addressType.readUInt8(0) + 1, 6); // BDADDR_LE_PUBLIC = 0x01, BDADDR_LE_RANDOM 0x02, so add one
        ltkInfo.writeUInt8(authenticated, 7);
        ltkInfo.writeUInt8(master, 8);
        ltkInfo.writeUInt8(key.length, 9);
        ediv.copy(ltkInfo, 10);
        rand.copy(ltkInfo, 12);
        key.copy(ltkInfo, 20);
        this._ltkInfos.push(ltkInfo);
        this.loadLongTermKeys();
    }
    learLongTermKeys() {
        this._ltkInfos = [];
        this.loadLongTermKeys();
    }
    oadLongTermKeys() {
        let numLongTermKeys = this._ltkInfos.length;
        let op = Buffer.alloc(2 + numLongTermKeys * LTK_INFO_SIZE);
        op.writeUInt16LE(numLongTermKeys, 0);
        for (let i = 0; i < numLongTermKeys; i++) {
            this._ltkInfos[i].copy(op, 2 + i * LTK_INFO_SIZE);
        }
        this.write(MGMT_OP_LOAD_LONG_TERM_KEYS, 0, op);
    }
    rite(opcode, index, data) {
        let length = 0;
        if (data) {
            length = data.length;
        }
        let pkt = Buffer.alloc(6 + length);
        pkt.writeUInt16LE(opcode, 0);
        pkt.writeUInt16LE(index, 2);
        pkt.writeUInt16LE(length, 4);
        if (length) {
            data.copy(pkt, 6);
        }
        debug('writing -> ' + pkt.toString('hex'));
        this._hci._socket.write(pkt);
    }
}
module.exports = Mgmt;
