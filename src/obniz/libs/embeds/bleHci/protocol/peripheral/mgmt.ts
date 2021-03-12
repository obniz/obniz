/**
 * @packageDocumentation
 *
 * @ignore
 */
// let debug = require('debug')('mgmt');
import Hci from "../hci";

/**
 * @ignore
 */
const debug: any = () => {};

/**
 * @ignore
 */
const LTK_INFO_SIZE: any = 36;
/**
 * @ignore
 */
const MGMT_OP_LOAD_LONG_TERM_KEYS: any = 0x0013;
/**
 * @ignore
 */
export default class Mgmt {
  public _ltkInfos: any;
  public _hci: Hci;
  public loadLongTermKeys: any;
  public write: any;

  public constructor(hciProtocol: any) {
    this._ltkInfos = [];
    this._hci = hciProtocol;
  }

  public nSocketData(data: any) {
    debug("on data ->" + data.toString("hex"));
  }

  public nSocketError(error: any) {
    debug("on error ->" + error.message);
  }

  public ddLongTermKey(
    address: any,
    addressType: any,
    authenticated: any,
    master: any,
    ediv: any,
    rand: any,
    key: any,
  ) {
    const ltkInfo: any = Buffer.alloc(LTK_INFO_SIZE);

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

  public learLongTermKeys() {
    this._ltkInfos = [];

    this.loadLongTermKeys();
  }

  public oadLongTermKeys() {
    const numLongTermKeys: any = this._ltkInfos.length;
    const op: any = Buffer.alloc(2 + numLongTermKeys * LTK_INFO_SIZE);

    op.writeUInt16LE(numLongTermKeys, 0);

    for (let i = 0; i < numLongTermKeys; i++) {
      this._ltkInfos[i].copy(op, 2 + i * LTK_INFO_SIZE);
    }

    this.write(MGMT_OP_LOAD_LONG_TERM_KEYS, 0, op);
  }

  // public rite(opcode: any, index: any, data: any) {
  //   let length: any = 0;

  //   if (data) {
  //     length = data.length;
  //   }

  //   const pkt: any = Buffer.alloc(6 + length);

  //   pkt.writeUInt16LE(opcode, 0);
  //   pkt.writeUInt16LE(index, 2);
  //   pkt.writeUInt16LE(length, 4);

  //   if (length) {
  //     data.copy(pkt, 6);
  //   }

  //   debug("writing -> " + pkt.toString("hex"));
  //   this._hci._socket.write(pkt);
  // }
}
