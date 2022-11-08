"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mgmt = void 0;
/**
 * @ignore
 */
const debug = () => {
    // do nothing.
};
/**
 * @ignore
 */
const LTK_INFO_SIZE = 36;
/**
 * @ignore
 */
const MGMT_OP_LOAD_LONG_TERM_KEYS = 0x0013;
/**
 * @ignore
 */
class Mgmt {
    constructor(hciProtocol) {
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
        const ltkInfo = Buffer.alloc(LTK_INFO_SIZE);
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
        const numLongTermKeys = this._ltkInfos.length;
        const op = Buffer.alloc(2 + numLongTermKeys * LTK_INFO_SIZE);
        op.writeUInt16LE(numLongTermKeys, 0);
        for (let i = 0; i < numLongTermKeys; i++) {
            this._ltkInfos[i].copy(op, 2 + i * LTK_INFO_SIZE);
        }
        this.write(MGMT_OP_LOAD_LONG_TERM_KEYS, 0, op);
    }
}
exports.Mgmt = Mgmt;
