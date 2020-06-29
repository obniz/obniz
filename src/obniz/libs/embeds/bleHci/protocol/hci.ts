/**
 * @packageDocumentation
 * @ignore
 */
import EventEmitter from "eventemitter3";
import ObnizBLEHci from "../hci";

import { ObnizBleHciStateError, ObnizBleUnsupportedHciError } from "../../../../ObnizError";
import { Handle } from "../bleTypes";

namespace COMMANDS {
  export const HCI_COMMAND_PKT: any = 0x01;
  export const HCI_ACLDATA_PKT: any = 0x02;
  export const HCI_EVENT_PKT: any = 0x04;

  export const ACL_START_NO_FLUSH: any = 0x00;
  export const ACL_CONT: any = 0x01;
  export const ACL_START: any = 0x02;

  export const EVT_DISCONN_COMPLETE: any = 0x05;
  export const EVT_ENCRYPT_CHANGE: any = 0x08;
  export const EVT_CMD_COMPLETE: any = 0x0e;
  export const EVT_CMD_STATUS: any = 0x0f;
  export const EVT_NUMBER_OF_COMPLETED_PACKETS: any = 0x13;
  export const EVT_ENCRYPTION_KEY_REFRESH_COMPLETE: any = 0x30;
  export const EVT_LE_META_EVENT: any = 0x3e;

  export const EVT_LE_CONN_COMPLETE: any = 0x01;
  export const EVT_LE_ADVERTISING_REPORT: any = 0x02;
  export const EVT_LE_CONN_UPDATE_COMPLETE: any = 0x03;

  export const OGF_LINK_CTL: any = 0x01;
  export const OCF_DISCONNECT: any = 0x0006;

  export const OGF_HOST_CTL: any = 0x03;
  export const OCF_SET_EVENT_MASK: any = 0x0001;
  export const OCF_RESET: any = 0x0003;
  export const OCF_READ_LE_HOST_SUPPORTED: any = 0x006c;
  export const OCF_WRITE_LE_HOST_SUPPORTED: any = 0x006d;

  export const OGF_INFO_PARAM: any = 0x04;
  export const OCF_READ_LOCAL_VERSION: any = 0x0001;
  export const OCF_READ_BUFFER_SIZE: any = 0x0005;
  export const OCF_READ_BD_ADDR: any = 0x0009;

  export const OGF_STATUS_PARAM: any = 0x05;
  export const OCF_READ_RSSI: any = 0x0005;

  export const OGF_LE_CTL: any = 0x08;
  export const OCF_LE_SET_EVENT_MASK: any = 0x0001;
  export const OCF_LE_READ_BUFFER_SIZE: any = 0x0002;
  export const OCF_LE_SET_ADVERTISING_PARAMETERS: any = 0x0006;
  export const OCF_LE_SET_ADVERTISING_DATA: any = 0x0008;
  export const OCF_LE_SET_SCAN_RESPONSE_DATA: any = 0x0009;
  export const OCF_LE_SET_ADVERTISE_ENABLE: any = 0x000a;
  export const OCF_LE_SET_SCAN_PARAMETERS: any = 0x000b;
  export const OCF_LE_SET_SCAN_ENABLE: any = 0x000c;
  export const OCF_LE_CREATE_CONN: any = 0x000d;
  export const OCF_LE_CREATE_CONN_CANCEL: any = 0x000e;
  export const OCF_LE_CONN_UPDATE: any = 0x0013;
  export const OCF_LE_START_ENCRYPTION: any = 0x0019;
  export const OCF_LE_LTK_NEG_REPLY: any = 0x001b;

  export const DISCONNECT_CMD: any = OCF_DISCONNECT | (OGF_LINK_CTL << 10);

  export const SET_EVENT_MASK_CMD: any = OCF_SET_EVENT_MASK | (OGF_HOST_CTL << 10);
  export const RESET_CMD: any = OCF_RESET | (OGF_HOST_CTL << 10);
  export const READ_LE_HOST_SUPPORTED_CMD: any = OCF_READ_LE_HOST_SUPPORTED | (OGF_HOST_CTL << 10);
  export const WRITE_LE_HOST_SUPPORTED_CMD: any = OCF_WRITE_LE_HOST_SUPPORTED | (OGF_HOST_CTL << 10);

  export const READ_LOCAL_VERSION_CMD: any = OCF_READ_LOCAL_VERSION | (OGF_INFO_PARAM << 10);
  export const READ_BUFFER_SIZE_CMD: any = OCF_READ_BUFFER_SIZE | (OGF_INFO_PARAM << 10);
  export const READ_BD_ADDR_CMD: any = OCF_READ_BD_ADDR | (OGF_INFO_PARAM << 10);

  export const READ_RSSI_CMD: any = OCF_READ_RSSI | (OGF_STATUS_PARAM << 10);

  export const LE_SET_EVENT_MASK_CMD: any = OCF_LE_SET_EVENT_MASK | (OGF_LE_CTL << 10);
  export const LE_READ_BUFFER_SIZE_CMD: any = OCF_LE_READ_BUFFER_SIZE | (OGF_LE_CTL << 10);
  export const LE_SET_SCAN_PARAMETERS_CMD: any = OCF_LE_SET_SCAN_PARAMETERS | (OGF_LE_CTL << 10);
  export const LE_SET_SCAN_ENABLE_CMD: any = OCF_LE_SET_SCAN_ENABLE | (OGF_LE_CTL << 10);
  export const LE_CREATE_CONN_CMD: any = OCF_LE_CREATE_CONN | (OGF_LE_CTL << 10);
  export const LE_CREATE_CONN_CANCEL_CMD: any = OCF_LE_CREATE_CONN_CANCEL | (OGF_LE_CTL << 10);
  export const LE_CONN_UPDATE_CMD: any = OCF_LE_CONN_UPDATE | (OGF_LE_CTL << 10);
  export const LE_START_ENCRYPTION_CMD: any = OCF_LE_START_ENCRYPTION | (OGF_LE_CTL << 10);
  export const LE_SET_ADVERTISING_PARAMETERS_CMD: any = OCF_LE_SET_ADVERTISING_PARAMETERS | (OGF_LE_CTL << 10);

  export const LE_SET_ADVERTISING_DATA_CMD: any = OCF_LE_SET_ADVERTISING_DATA | (OGF_LE_CTL << 10);
  export const LE_SET_SCAN_RESPONSE_DATA_CMD: any = OCF_LE_SET_SCAN_RESPONSE_DATA | (OGF_LE_CTL << 10);
  export const LE_SET_ADVERTISE_ENABLE_CMD: any = OCF_LE_SET_ADVERTISE_ENABLE | (OGF_LE_CTL << 10);
  export const LE_LTK_NEG_REPLY_CMD: any = OCF_LE_LTK_NEG_REPLY | (OGF_LE_CTL << 10);

  export const HCI_OE_USER_ENDED_CONNECTION: any = 0x13;
}

/**
 * @ignore
 */
const STATUS_MAPPER: any = require("./hci-status");

type HciEventTypes =
  // central
  | "leAdvertisingReport"

  // peripheral
  | "leConnComplete" // central also use, but slave only emit

  // common
  | "stateChange"
  | "leConnUpdateComplete" // update interval, latency, timeout are complete
  | "disconnComplete"
  | "encryptChange"
  | "aclDataPkt";

type HciState = "poweredOn" | "poweredOff";

/**
 * @ignore
 */
class Hci extends EventEmitter<HciEventTypes> {
  public static STATUS_MAPPER: any;
  public _obnizHci: ObnizBLEHci;
  public _handleBuffers: any;
  public _socket: any;
  public _handleAclsInProgress: any;
  public _aclOutQueue: any;
  public _aclMtu: any;
  public _aclMaxInProgress: any;
  public addressType: any;
  public address: any;
  private _state: HciState;
  private _aclStreamObservers: { [handle: string]: { [key: string]: Array<(arg0: Buffer) => any> } } = {};

  constructor(obnizHci: any) {
    super();
    this._obnizHci = obnizHci;
    this._state = "poweredOff";

    this.resetBuffers();

    this._obnizHci.Obniz.on("disconnect", () => {
      this.stateChange("poweredOff");
    });

    this._socket = {
      write: (data: any) => {
        const arr: any = Array.from(data);
        this._obnizHci.write(arr);
      },
    };
    this._obnizHci.onread = this.onSocketData.bind(this);
  }
  public debugHandler: any = () => {};

  public async initWait() {
    await this.resetWait();
  }

  public setEventMask() {
    const cmd: any = Buffer.alloc(12);
    const eventMask: any = Buffer.from("fffffbff07f8bf3d", "hex");

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.SET_EVENT_MASK_CMD, 1);

    // length
    cmd.writeUInt8(eventMask.length, 3);

    eventMask.copy(cmd, 4);

    this.debug("set event mask - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public async resetWait(): Promise<void> {
    const cmd: any = Buffer.alloc(4);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.OCF_RESET | (COMMANDS.OGF_HOST_CTL << 10), 1);

    // length
    cmd.writeUInt8(0x00, 3);

    const p = this.readCmdCompleteEventWait(COMMANDS.RESET_CMD);
    this.debug("reset - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);

    const resetResult = await p;
    this.resetBuffers();
    this.setEventMask();
    this.setLeEventMask();
    const p1 = this.readLocalVersionWait();
    const p2 = this.readBdAddrWait();
    this.writeLeHostSupported();
    const p3 = this.readLeHostSupportedWait();
    const p4 = this.leReadBufferSizeWait();
    await Promise.all([p1, p2, p3, p4]);

    if (this._state !== "poweredOn") {
      const p5 = this.setScanEnabledWait(false, true);
      const p6 = this.setScanParametersWait(false);
      await Promise.all([p5, p6]);
      this.stateChange("poweredOn");
    }
  }

  public resetBuffers() {
    this._handleAclsInProgress = {};
    this._handleBuffers = {};
    this._aclOutQueue = [];
  }

  public async readLocalVersionWait() {
    const cmd: any = Buffer.alloc(4);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.READ_LOCAL_VERSION_CMD, 1);

    // length
    cmd.writeUInt8(0x0, 3);

    const p = this.readCmdCompleteEventWait(COMMANDS.READ_LOCAL_VERSION_CMD);
    this.debug("read local version - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
    const data = await p;
    const hciVer: any = data.result.readUInt8(0);
    const hciRev: any = data.result.readUInt16LE(1);
    const lmpVer: any = data.result.readInt8(3);
    const manufacturer: any = data.result.readUInt16LE(4);
    const lmpSubVer: any = data.result.readUInt16LE(6);

    if (hciVer < 0x06) {
      throw new ObnizBleUnsupportedHciError(0x06, hciVer);
    }

    return { hciVer, hciRev, lmpVer, manufacturer, lmpSubVer };
  }

  public async readBdAddrWait() {
    const cmd: any = Buffer.alloc(4);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.READ_BD_ADDR_CMD, 1);

    // length
    cmd.writeUInt8(0x0, 3);

    const p = this.readCmdCompleteEventWait(COMMANDS.READ_BD_ADDR_CMD);
    this.debug("read bd addr - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);

    const data = await p;
    this.addressType = "public";
    this.address = data.result
      .toString("hex")
      .match(/.{1,2}/g)!
      .reverse()
      .join(":");

    this.debug("address = " + this.address);

    return this.address;
  }

  public setLeEventMask() {
    const cmd: any = Buffer.alloc(12);
    const leEventMask: any = Buffer.from("1f00000000000000", "hex");

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_SET_EVENT_MASK_CMD, 1);

    // length
    cmd.writeUInt8(leEventMask.length, 3);

    leEventMask.copy(cmd, 4);

    this.debug("set le event mask - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public async readLeHostSupportedWait() {
    const cmd: any = Buffer.alloc(4);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.READ_LE_HOST_SUPPORTED_CMD, 1);

    // length
    cmd.writeUInt8(0x00, 3);

    const p = this.readCmdCompleteEventWait(COMMANDS.READ_LE_HOST_SUPPORTED_CMD);
    this.debug("read LE host supported - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
    const data = await p;

    if (data.status === 0) {
      const le: any = data.result.readUInt8(0);
      const simul: any = data.result.readUInt8(1);

      this.debug("\t\t\tle = " + le);
      this.debug("\t\t\tsimul = " + simul);
    }
    return data;
  }

  public writeLeHostSupported() {
    const cmd: any = Buffer.alloc(6);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.WRITE_LE_HOST_SUPPORTED_CMD, 1);

    // length
    cmd.writeUInt8(0x02, 3);

    // data
    cmd.writeUInt8(0x01, 4); // le
    cmd.writeUInt8(0x00, 5); // simul

    this.debug("write LE host supported - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public async setScanParametersWait(isActiveScan: boolean) {
    const cmd: any = Buffer.alloc(11);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_SET_SCAN_PARAMETERS_CMD, 1);

    // length
    cmd.writeUInt8(0x07, 3);

    // data
    cmd.writeUInt8(isActiveScan ? 0x01 : 0x00, 4); // type: 0 -> passive, 1 -> active
    cmd.writeUInt16LE(0x0010, 5); // internal, ms * 1.6
    cmd.writeUInt16LE(0x0010, 7); // window, ms * 1.6
    cmd.writeUInt8(0x00, 9); // own address type: 0 -> public, 1 -> random
    cmd.writeUInt8(0x00, 10); // filter: 0 -> all event types

    const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_SCAN_PARAMETERS_CMD);
    this.debug("set scan parameters - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
    const data = await p;
    return data.status;
  }

  public async setScanEnabledWait(enabled: boolean, filterDuplicates: boolean) {
    const cmd: any = Buffer.alloc(6);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_SET_SCAN_ENABLE_CMD, 1);

    // length
    cmd.writeUInt8(0x02, 3);

    // data
    cmd.writeUInt8(enabled ? 0x01 : 0x00, 4); // enable: 0 -> disabled, 1 -> enabled
    cmd.writeUInt8(filterDuplicates ? 0x01 : 0x00, 5); // duplicates: 0 -> duplicates, 0 -> duplicates

    this.debug("set scan enabled - writing: " + cmd.toString("hex"));
    const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_SCAN_ENABLE_CMD);
    this._socket.write(cmd);
    const data = await p;
    return data.status;
  }

  public async createLeConnWait(address: any, addressType: any, timeout: number = 90 * 1000) {
    const cmd: any = Buffer.alloc(29);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_CREATE_CONN_CMD, 1);

    // length
    cmd.writeUInt8(0x19, 3);

    // data
    cmd.writeUInt16LE(0x0060, 4); // interval
    cmd.writeUInt16LE(0x0030, 6); // window
    cmd.writeUInt8(0x00, 8); // initiator filter

    cmd.writeUInt8(addressType === "random" ? 0x01 : 0x00, 9); // peer address type
    Buffer.from(
      address
        .split(":")
        .reverse()
        .join(""),
      "hex",
    ).copy(cmd, 10); // peer address

    cmd.writeUInt8(0x00, 16); // own address type

    cmd.writeUInt16LE(0x0006, 17); // min interval
    cmd.writeUInt16LE(0x000c, 19); // max interval
    cmd.writeUInt16LE(0x0000, 21); // latency
    cmd.writeUInt16LE(0x00c8, 23); // supervision timeout
    cmd.writeUInt16LE(0x0004, 25); // min ce length
    cmd.writeUInt16LE(0x0006, 27); // max ce length

    this.debug("create le conn - writing: " + cmd.toString("hex"));
    const p = this.readLeMetaEventWait(COMMANDS.EVT_LE_CONN_COMPLETE, {
      timeout,
      onTimeout: async () => {
        // 一定時間経過。onTimeoutをオーバーライドしてreject()されるのを防ぎ、キャンセルリクエストする。キャンセルされると接続失敗が返るので待つ
        await this.createLeConnCancelWait();
      },
    });
    this._socket.write(cmd);

    try {
      const { status, data } = await p;
      return this.processLeConnComplete(status, data);
    } catch (e) {
      throw e;
    }
  }

  public async createLeConnCancelWait() {
    const cmd: any = Buffer.alloc(4);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_CREATE_CONN_CANCEL_CMD, 1);

    // length
    cmd.writeUInt8(0x0, 3);

    /*
     * 成功すると0x00 失敗で 0x01~0xFFが帰る
     * 特に接続処理中じゃない場合は 0x0x(command disallowed)がかえる
     * キャンセルに成功してその応答が来たあとには
     * LE Connection Complete or an HCI_LE_Enhanced_Connection_Complete event
     * のどちらかがちゃんと返る
     */
    this.debug("create le conn cancel - writing: " + cmd.toString("hex"));
    const p = this.readCmdCompleteEventWait(COMMANDS.LE_CREATE_CONN_CANCEL_CMD);
    this._socket.write(cmd);

    const { status } = await p;
    if (status !== 0x00) {
      throw new ObnizBleHciStateError(status);
    }
  }

  public async connUpdateLeWait(
    handle: Handle,
    minInterval: number,
    maxInterval: number,
    latency: number,
    supervisionTimeout: number,
  ) {
    const cmd: any = Buffer.alloc(18);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_CONN_UPDATE_CMD, 1);

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

    this.debug("conn update le - writing: " + cmd.toString("hex"));
    const p = this.readLeMetaEventWait(COMMANDS.EVT_LE_CONN_UPDATE_COMPLETE);
    this._socket.write(cmd);

    const { status, data } = await p;
    return this.processLeConnUpdateComplete(status, data);
  }

  // this function is use by connUpdateLeWait / processLeMetaEvent.
  public processLeConnUpdateComplete(status: any, data: any) {
    const handle: Handle = data.readUInt16LE(0);
    const interval: any = data.readUInt16LE(2) * 1.25;
    const latency: any = data.readUInt16LE(4); // TODO: multiplier?
    const supervisionTimeout: any = data.readUInt16LE(6) * 10;

    this.debug("\t\t\thandle = " + handle);
    this.debug("\t\t\tinterval = " + interval);
    this.debug("\t\t\tlatency = " + latency);
    this.debug("\t\t\tsupervision timeout = " + supervisionTimeout);

    return { status, handle, interval, latency, supervisionTimeout };
  }

  public async startLeEncryptionWait(handle: Handle, random: Buffer, diversifier: Buffer, key: Buffer) {
    const cmd: any = Buffer.alloc(32);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_START_ENCRYPTION_CMD, 1);

    // length
    cmd.writeUInt8(0x1c, 3);

    // data
    cmd.writeUInt16LE(handle, 4); // handle
    random.copy(cmd, 6);
    diversifier.copy(cmd, 14);
    key.copy(cmd, 16);

    // console.log("start le encryption - writing: " + cmd.toString("hex"));
    const p1 = this._obnizHci.readWait([COMMANDS.HCI_EVENT_PKT, COMMANDS.EVT_ENCRYPT_CHANGE], {
      waitingFor: "EVT_ENCRYPT_CHANGE",
    });
    const p2 = this._obnizHci.readWait([COMMANDS.HCI_EVENT_PKT, COMMANDS.EVT_ENCRYPTION_KEY_REFRESH_COMPLETE], {
      waitingFor: "EVT_ENCRYPTION_KEY_REFRESH_COMPLETE",
    });

    this.debug("start le encryption - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);

    const data = await Promise.race([p1, p2]);
    // const data = await p1;
    // console.log("start le encryption - data: " + data.toString("hex"));
    if (data.readUInt8(1) === COMMANDS.EVT_ENCRYPT_CHANGE) {
      if (data.length !== 7) {
        throw new Error(`le encryption event EVT_ENCRYPT_CHANGE length must be 7 but recieved ${data.length}`);
      }
      const status = data.readUInt8(3);
      if (status !== 0x00) {
        throw new Error(`le encryption event EVT_ENCRYPT_CHANGE failed with error ${status}`);
      }
      const encHandle: Handle = data.readUInt16LE(4);
      const encrypt: any = data.readUInt8(6);

      this.debug("\t\thandle = " + encHandle);
      this.debug("\t\tencrypt = " + encrypt);

      this.emit("encryptChange", encHandle, encrypt);
      return encrypt;
    } else if (data[1] === COMMANDS.EVT_ENCRYPTION_KEY_REFRESH_COMPLETE) {
      if (data.length !== 6) {
        throw new Error(
          `le encryption event EVT_ENCRYPTION_KEY_REFRESH_COMPLETE length must be 7 but recieved ${data.length}`,
        );
      }
      const status = data.readUInt8(3);
      if (status !== 0x00) {
        throw new Error(`le encryption event EVT_ENCRYPTION_KEY_REFRESH_COMPLETE failed with error ${status}`);
      }
      const encHandle: Handle = data.readUInt16LE(4);

      this.debug("\t\thandle = " + encHandle);
      return "refresh";
    }
    throw new Error("Never Happend");
  }

  public disconnect(handle: Handle, reason?: number) {
    const cmd: any = Buffer.alloc(7);

    reason = reason || COMMANDS.HCI_OE_USER_ENDED_CONNECTION;

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.DISCONNECT_CMD, 1);

    // length
    cmd.writeUInt8(0x03, 3);

    // data
    cmd.writeUInt16LE(handle, 4); // handle
    cmd.writeUInt8(reason, 6); // reason

    this.debug("disconnect - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public async readRssiWait(handle: Handle) {
    const cmd: any = Buffer.alloc(6);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.READ_RSSI_CMD, 1);

    // length
    cmd.writeUInt8(0x02, 3);

    // data
    cmd.writeUInt16LE(handle, 4); // handle

    const p = this.readCmdCompleteEventWait(COMMANDS.READ_RSSI_CMD, [handle & 0xff, (handle >> 8) & 0xff]);
    this.debug("read rssi - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);

    const data = await p;
    if (handle !== data.result.readUInt16LE(0)) {
      throw new Error("handle is different");
    }
    const rssi: any = data.result.readInt8(2);

    this.debug("\t\t\thandle = " + handle);
    this.debug("\t\t\trssi = " + rssi);

    return rssi;
  }

  public async setAdvertisingParametersWait() {
    const cmd: any = Buffer.alloc(19);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_SET_ADVERTISING_PARAMETERS_CMD, 1);

    // length
    cmd.writeUInt8(15, 3);

    const advertisementInterval: any = Math.floor(
      (process.env.BLENO_ADVERTISING_INTERVAL ? parseFloat(process.env.BLENO_ADVERTISING_INTERVAL) : 100) * 1.6,
    );

    // data
    cmd.writeUInt16LE(advertisementInterval, 4); // min interval
    cmd.writeUInt16LE(advertisementInterval, 6); // max interval
    cmd.writeUInt8(0x00, 8); // adv type
    cmd.writeUInt8(0x00, 9); // own addr typ
    cmd.writeUInt8(0x00, 10); // direct addr type
    Buffer.from("000000000000", "hex").copy(cmd, 11); // direct addr
    cmd.writeUInt8(0x07, 17);
    cmd.writeUInt8(0x00, 18);

    const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_ADVERTISING_PARAMETERS_CMD);
    this.debug("set advertisement parameters - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);

    const data = await p;

    // this.emit("stateChange", "poweredOn"); // TODO : really need?
    return data.status;
  }

  public async setAdvertisingDataWait(data: any) {
    const cmd: any = Buffer.alloc(36);

    cmd.fill(0x00);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_SET_ADVERTISING_DATA_CMD, 1);

    // length
    cmd.writeUInt8(32, 3);

    // data
    cmd.writeUInt8(data.length, 4);
    data.copy(cmd, 5);

    const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_ADVERTISING_DATA_CMD);

    this.debug("set advertisement data - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
    const result = await p;

    return result.status;
  }

  public async setScanResponseDataWait(data: any) {
    const cmd: any = Buffer.alloc(36);

    cmd.fill(0x00);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_SET_SCAN_RESPONSE_DATA_CMD, 1);

    // length
    cmd.writeUInt8(32, 3);

    // data
    cmd.writeUInt8(data.length, 4);
    data.copy(cmd, 5);

    const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_SCAN_RESPONSE_DATA_CMD);
    this.debug("set scan response data - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
    const result = await p;

    return result.status;
  }

  public async setAdvertiseEnableWait(enabled: any) {
    const cmd: any = Buffer.alloc(5);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_SET_ADVERTISE_ENABLE_CMD, 1);

    // length
    cmd.writeUInt8(0x01, 3);

    // data
    cmd.writeUInt8(enabled ? 0x01 : 0x00, 4); // enable: 0 -> disabled, 1 -> enabled

    const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_ADVERTISE_ENABLE_CMD);
    this.debug("set advertise enable - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
    const data = await p;
    return data.status;
  }

  public async leReadBufferSizeWait() {
    const cmd: any = Buffer.alloc(4);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_READ_BUFFER_SIZE_CMD, 1);

    // length
    cmd.writeUInt8(0x0, 3);

    const p = this.readCmdCompleteEventWait(COMMANDS.LE_READ_BUFFER_SIZE_CMD);
    this.debug("le read buffer size - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);

    const data = await p;
    if (!data.status) {
      await this.processLeReadBufferSizeWait(data.result);
    }
  }

  public async readBufferSizeWait() {
    const cmd: any = Buffer.alloc(4);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.READ_BUFFER_SIZE_CMD, 1);

    // length
    cmd.writeUInt8(0x0, 3);

    const p = this.readCmdCompleteEventWait(COMMANDS.READ_BUFFER_SIZE_CMD);
    this.debug("read buffer size - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
    const data = await p;
    if (!data.status) {
      const aclMtu: any = data.result.readUInt16LE(0);
      const aclMaxInProgress: any = data.result.readUInt16LE(3);
      // sanity
      if (aclMtu && aclMaxInProgress) {
        this.debug("br/edr acl mtu = " + aclMtu);
        this.debug("br/edr acl max pkts = " + aclMaxInProgress);
        this._aclMtu = aclMtu;
        this._aclMaxInProgress = aclMaxInProgress;
        return { aclMtu, aclMaxInProgress };
      }
    }
    return null;
  }

  public queueAclDataPkt(handle: Handle, cid: any, data: any) {
    let hf: any = handle | (COMMANDS.ACL_START_NO_FLUSH << 12);
    // l2cap pdu may be fragmented on hci level
    let l2capPdu: any = Buffer.alloc(4 + data.length);
    l2capPdu.writeUInt16LE(data.length, 0);
    l2capPdu.writeUInt16LE(cid, 2);
    data.copy(l2capPdu, 4);
    let fragId: any = 0;

    while (l2capPdu.length) {
      const frag: any = l2capPdu.slice(0, this._aclMtu);
      l2capPdu = l2capPdu.slice(frag.length);
      const pkt: any = Buffer.alloc(5 + frag.length);

      // hci header
      pkt.writeUInt8(COMMANDS.HCI_ACLDATA_PKT, 0);
      pkt.writeUInt16LE(hf, 1);
      hf |= COMMANDS.ACL_CONT << 12;
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

  public pushAclOutQueue() {
    this.debug("pushAclOutQueue");
    let inProgress: any = 0;
    for (const handle in this._handleAclsInProgress) {
      inProgress += this._handleAclsInProgress[handle];
    }
    this.debug(inProgress, this._aclMaxInProgress, this._aclOutQueue.length);
    while (inProgress < this._aclMaxInProgress && this._aclOutQueue.length) {
      inProgress++;
      this.writeOneAclDataPkt();
    }

    if (inProgress >= this._aclMaxInProgress && this._aclOutQueue.length) {
      this.debug("acl out queue congested");
      this.debug("\tin progress = " + inProgress);
      this.debug("\twaiting = " + this._aclOutQueue.length);
    }
  }

  public writeOneAclDataPkt() {
    this.debug("writeOneAclDataPkt");
    const pkt: any = this._aclOutQueue.shift();
    this._handleAclsInProgress[pkt.handle]++;
    this.debug(
      "write acl data pkt frag " + pkt.fragId + " handle " + pkt.handle + " - writing: " + pkt.pkt.toString("hex"),
    );
    this._socket.write(pkt.pkt);
  }

  public writeAclDataPkt(handle: Handle, cid: any, data: any) {
    const pkt: any = Buffer.alloc(9 + data.length);

    // header
    pkt.writeUInt8(COMMANDS.HCI_ACLDATA_PKT, 0);
    pkt.writeUInt16LE(handle | (COMMANDS.ACL_START_NO_FLUSH << 12), 1);
    pkt.writeUInt16LE(data.length + 4, 3); // data length 1  for acl data on HCI
    pkt.writeUInt16LE(data.length, 5); // data length 2  for l2cap
    pkt.writeUInt16LE(cid, 7);

    data.copy(pkt, 9);

    this.debug("write acl data pkt - writing: " + pkt.toString("hex"));
    this._socket.write(pkt);
  }

  public async longTermKeyRequestNegativeReply(handle: Handle) {
    throw new Error("TODO: no checked");

    const cmd: any = Buffer.alloc(5);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_LTK_NEG_REPLY_CMD, 1);

    // length
    cmd.writeUInt16LE(handle, 3);

    const p = this.readCmdCompleteEventWait(COMMANDS.LE_LTK_NEG_REPLY_CMD);
    this._socket.write(cmd);
    const data = await p;
    return data.status;
  }

  public processLeMetaEvent(eventType: any, status: any, data: any) {
    if (eventType === COMMANDS.EVT_LE_ADVERTISING_REPORT) {
      this.processLeAdvertisingReport(status, data);
    } else if (eventType === COMMANDS.EVT_LE_CONN_COMPLETE) {
      this.processLeConnComplete(status, data);
    } else if (eventType === COMMANDS.EVT_LE_CONN_UPDATE_COMPLETE) {
      const { handle, interval, latency, supervisionTimeout } = this.processLeConnUpdateComplete(status, data);
      this.emit("leConnUpdateComplete", status, handle, interval, latency, supervisionTimeout);
    }
  }

  public processLeConnComplete(status: any, data: any) {
    const handle: Handle = data.readUInt16LE(0);
    const role: any = data.readUInt8(2);
    const addressType: any = data.readUInt8(3) === 0x01 ? "random" : "public";
    const address: any = data
      .slice(4, 10)
      .toString("hex")
      .match(/.{1,2}/g)
      .reverse()
      .join(":");
    const interval: any = data.readUInt16LE(10) * 1.25;
    const latency: any = data.readUInt16LE(12); // TODO: multiplier?
    const supervisionTimeout: any = data.readUInt16LE(14) * 10;
    const masterClockAccuracy: any = data.readUInt8(16); // TODO: multiplier?

    this.debug("\t\t\thandle = " + handle);
    this.debug("\t\t\trole = " + role);
    this.debug("\t\t\taddress type = " + addressType);
    this.debug("\t\t\taddress = " + address);
    this.debug("\t\t\tinterval = " + interval);
    this.debug("\t\t\tlatency = " + latency);
    this.debug("\t\t\tsupervision timeout = " + supervisionTimeout);
    this.debug("\t\t\tmaster clock accuracy = " + masterClockAccuracy);

    this._handleAclsInProgress[handle] = 0;

    if (role === 1) {
      // only slave, emit

      this.emit(
        "leConnComplete",
        status,
        handle,
        role,
        addressType,
        address,
        interval,
        latency,
        supervisionTimeout,
        masterClockAccuracy,
      );
    }

    return {
      status,
      handle,
      role,
      addressType,
      address,
      interval,
      latency,
      supervisionTimeout,
      masterClockAccuracy,
    };
  }

  public processLeAdvertisingReport(count: any, data: any) {
    for (let i = 0; i < count; i++) {
      const type: any = data.readUInt8(0);
      const addressType: any = data.readUInt8(1) === 0x01 ? "random" : "public";
      const address: any = data
        .slice(2, 8)
        .toString("hex")
        .match(/.{1,2}/g)
        .reverse()
        .join(":");
      const eirLength: any = data.readUInt8(8);
      const eir: any = data.slice(9, eirLength + 9);
      const rssi: any = data.readInt8(eirLength + 9);

      this.debug("\t\t\ttype = " + type);
      this.debug("\t\t\taddress = " + address);
      this.debug("\t\t\taddress type = " + addressType);
      this.debug("\t\t\teir = " + eir.toString("hex"));
      this.debug("\t\t\trssi = " + rssi);

      this.emit("leAdvertisingReport", 0, type, address, addressType, eir, rssi);

      data = data.slice(eirLength + 10);
    }
  }

  public processCmdStatusEvent(cmd: any, status: any) {
    if (cmd === COMMANDS.LE_CREATE_CONN_CMD) {
      if (status !== 0) {
        this.emit("leConnComplete", status);
      }
    }
  }

  public async processLeReadBufferSizeWait(result: any) {
    const aclMtu: any = result.readUInt16LE(0);
    const aclMaxInProgress: any = result.readUInt8(2);
    if (!aclMtu) {
      // as per Bluetooth specs
      this.debug("falling back to br/edr buffer size");
      await this.readBufferSizeWait();
    } else {
      this.debug("le acl mtu = " + aclMtu);
      this.debug("le acl max in progress = " + aclMaxInProgress);
      this._aclMtu = aclMtu;
      this._aclMaxInProgress = aclMaxInProgress;
    }
  }

  public stateChange(state: HciState) {
    this._state = state;
    this.emit("stateChange", state);
  }

  public async readAclStreamWait(handle: Handle, cid: number, firstData: number, timeout?: number): Promise<Buffer> {
    return this._obnizHci.timeoutPromiseWrapper(
      new Promise((resolve) => {
        const key = (cid << 8) + firstData;
        this._aclStreamObservers[handle] = this._aclStreamObservers[handle] || [];
        this._aclStreamObservers[handle][key] = this._aclStreamObservers[handle][cid] || [];
        this._aclStreamObservers[handle][key].push(resolve);
      }),
      { timeout, waitingFor: `readAclStream handle:${handle} cid:${cid} firstData:${firstData}` },
    );
  }

  protected async readLeMetaEventWait(eventType: number, options?: any) {
    const filter = this.createLeMetaEventFilter(eventType);
    options = options || {};
    options.waitingFor = "LeMetaEvent " + JSON.stringify(filter);
    const data = await this._obnizHci.readWait(filter, options);

    const type: any = data.readUInt8(3);
    const status: any = data.readUInt8(4);
    const _data: any = data.slice(5);
    return { type, status, data: _data };
  }

  protected createLeMetaEventFilter(eventType: number): number[] {
    return [COMMANDS.HCI_EVENT_PKT, COMMANDS.EVT_LE_META_EVENT, -1, eventType];
  }

  protected async readCmdCompleteEventWait(
    requestCmd: number,
    additionalResultFilter?: number[],
  ): Promise<{ eventType: number; subEventType: number; ncmd: number; cmd: number; status: number; result: Buffer }> {
    additionalResultFilter = additionalResultFilter || [];
    let filter = this.createCmdCompleteEventFilter(requestCmd);
    if (additionalResultFilter.length > 0) {
      filter = [
        ...filter,
        -1, // status
        ...additionalResultFilter,
      ];
    }
    const options: any = {};
    options.waitingFor = "CmdCompleteEvent " + JSON.stringify(filter);
    const data = await this._obnizHci.readWait(filter, options);

    const eventType: any = data.readUInt8(0);
    const subEventType: any = data.readUInt8(1);
    const ncmd: any = data.readUInt8(3);
    const cmd: any = data.readUInt16LE(4);
    const status: any = data.readUInt8(6);
    const result: any = data.slice(7);

    return { eventType, subEventType, ncmd, cmd, status, result };
  }

  protected createCmdCompleteEventFilter(cmd: number): number[] {
    return [COMMANDS.HCI_EVENT_PKT, COMMANDS.EVT_CMD_COMPLETE, -1, -1, (cmd >> 0) & 0xff, (cmd >> 8) & 0xff];
  }

  private debug(...args: any) {
    this.debugHandler(`${args[0]}`);
  }

  private onHciAclData(data: Buffer) {
    const flags: any = data.readUInt16LE(1) >> 12;
    const handle: Handle = data.readUInt16LE(1) & 0x0fff;

    if (COMMANDS.ACL_START === flags) {
      const cid: any = data.readUInt16LE(7);

      const length: any = data.readUInt16LE(5);
      const pktData: Buffer = data.slice(9);

      this.debug("\t\tcid = " + cid);

      if (length === pktData.length) {
        this.debug("\t\thandle = " + handle);
        this.debug("\t\tdata = " + pktData.toString("hex"));

        this.emit("aclDataPkt", handle, cid, pktData);
        const key = (cid << 8) + pktData.readUInt8(0);
        if (
          this._aclStreamObservers[handle] &&
          this._aclStreamObservers[handle][key] &&
          this._aclStreamObservers[handle][key].length > 0
        ) {
          const resolve = this._aclStreamObservers[handle][key].shift()!;
          resolve(pktData);
        }
      } else {
        this._handleBuffers[handle] = {
          length,
          cid,
          data: pktData,
        };
      }
    } else if (COMMANDS.ACL_CONT === flags) {
      if (!this._handleBuffers[handle] || !this._handleBuffers[handle].data) {
        return;
      }

      this._handleBuffers[handle].data = Buffer.concat([this._handleBuffers[handle].data, data.slice(5)]);

      if (this._handleBuffers[handle].data.length === this._handleBuffers[handle].length) {
        this.emit("aclDataPkt", handle, this._handleBuffers[handle].cid, this._handleBuffers[handle].data);
        const key = (this._handleBuffers[handle].cid << 8) + this._handleBuffers[handle].data.readUInt8(0);
        if (
          this._aclStreamObservers[handle] &&
          this._aclStreamObservers[handle][key] &&
          this._aclStreamObservers[handle][key].length > 0
        ) {
          const resolve = this._aclStreamObservers[handle][key].shift()!;
          resolve(this._handleBuffers[handle].data);
        }
        delete this._handleBuffers[handle];
      }
    }
  }

  private onHciEventData(data: Buffer) {
    const subEventType: any = data.readUInt8(1);

    this.debug("\tsub event type = 0x" + subEventType.toString(16));

    if (subEventType === COMMANDS.EVT_DISCONN_COMPLETE) {
      const handle: Handle = data.readUInt16LE(4);
      const reason: any = data.readUInt8(6);

      this.debug("\t\thandle = " + handle);
      this.debug("\t\treason = " + reason);

      delete this._handleAclsInProgress[handle];
      const aclOutQueue: any = [];
      let discarded: any = 0;
      for (const i in this._aclOutQueue) {
        if (this._aclOutQueue[i].handle !== handle) {
          aclOutQueue.push(this._aclOutQueue[i]);
        } else {
          discarded++;
        }
      }
      if (discarded) {
        this.debug("\t\tacls discarded = " + discarded);
      }
      this._aclOutQueue = aclOutQueue;
      this.pushAclOutQueue();

      this.emit("disconnComplete", handle, reason);
    } else if (subEventType === COMMANDS.EVT_ENCRYPT_CHANGE) {
      const status: any = data.readUInt8(3);
      const handle: Handle = data.readUInt16LE(4);
      const encrypt: any = data.readUInt8(6);

      if (status === 0) {
        this.debug("\t\thandle = " + handle);
        this.debug("\t\tencrypt = " + encrypt);
        this.emit("encryptChange", handle, encrypt);
      } else {
        this.debug("\t\tencrypt status = " + status);
        this.debug("\t\thandle = " + handle);
        this.debug("\t\tencrypt = " + encrypt);
        this.emit("encryptChange", handle, encrypt);
      }
    } else if (subEventType === COMMANDS.EVT_CMD_COMPLETE) {
      // command complete event are handle each command send functions;
    } else if (subEventType === COMMANDS.EVT_CMD_STATUS) {
      const status: any = data.readUInt8(3);
      const cmd: any = data.readUInt16LE(5);

      this.debug("\t\tstatus = " + status);
      this.debug("\t\tcmd = " + cmd);

      this.processCmdStatusEvent(cmd, status);
    } else if (subEventType === COMMANDS.EVT_LE_META_EVENT) {
      const leMetaEventType: any = data.readUInt8(3);
      const leMetaEventStatus: any = data.readUInt8(4);
      const leMetaEventData: any = data.slice(5);

      this.debug("\t\tLE meta event type = " + leMetaEventType);
      this.debug("\t\tLE meta event status = " + leMetaEventStatus);
      this.debug("\t\tLE meta event data = " + leMetaEventData.toString("hex"));

      this.processLeMetaEvent(leMetaEventType, leMetaEventStatus, leMetaEventData);
    } else if (subEventType === COMMANDS.EVT_NUMBER_OF_COMPLETED_PACKETS) {
      const handles: any = data.readUInt8(3);
      for (let i = 0; i < handles; i++) {
        const handle: Handle = data.readUInt16LE(4 + i * 4);
        const pkts: any = data.readUInt16LE(6 + i * 4);
        this.debug("\thandle = " + handle);
        this.debug("\t\tcompleted = " + pkts);
        if (this._handleAclsInProgress[handle] === undefined) {
          this.debug("\t\talready closed");
          continue;
        }
        if (pkts > this._handleAclsInProgress[handle]) {
          // Linux kernel may send acl packets by itself, so be ready for underflow
          this._handleAclsInProgress[handle] = 0;
        } else {
          this._handleAclsInProgress[handle] -= pkts;
        }
        this.debug("\t\tin progress = " + this._handleAclsInProgress[handle]);
      }
      this.pushAclOutQueue();
    }
  }

  private onSocketData(array: any) {
    const data: any = Buffer.from(array);
    this.debug("onSocketData: " + data.toString("hex"));

    const eventType: any = data.readUInt8(0);

    this.debug("\tevent type = 0x" + eventType.toString(16));

    if (COMMANDS.HCI_EVENT_PKT === eventType) {
      this.onHciEventData(data);
    } else if (COMMANDS.HCI_ACLDATA_PKT === eventType) {
      this.onHciAclData(data);
    }
  }
}

Hci.STATUS_MAPPER = STATUS_MAPPER;
export default Hci;
