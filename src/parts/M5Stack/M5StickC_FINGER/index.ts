/**
 * @packageDocumentation
 * @module Parts.M5StickC_FINGER
 */
import Obniz from "../../../obniz";
import PeripheralUART from "../../../obniz/libs/io_peripherals/uart";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface M5StickC_FINGEROptions {
  tx: number;
  rx: number;
  gnd?: number;
}

export default class M5StickC_FINGER implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "M5StickC_FINGER",
    };
  }

  public requiredKeys: string[];
  public keys: string[];
  public params: any;

  public ack: any;
  public cmd: any;
  public HEAD = 0;
  public CMD = 1;
  public CHK = 6;
  public TAIL = 7;
  public P1 = 2;
  public P2 = 3;
  public P3 = 4;
  public Q1 = 2;
  public Q2 = 3;
  public Q3 = 4;

  public TxBuf = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  public RxBuf = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  protected obniz!: Obniz;
  protected uart!: PeripheralUART;

  constructor() {
    this.requiredKeys = [];
    this.keys = ["tx", "rx", "gnd"];
    this.ack = {
      SUCCESS: 0x00,
      FAIL: 0x01,
      FULL: 0x04,
      NOUSER: 0x05,
      USER_EXIST: 0x07,
      TIMEOUT: 0x08,
      GO_OUT: 0x0f,
      ALL_USER: 0x00,
      GUEST_USER: 0x01,
      NORMAL_USER: 0x02,
      MASTER_USER: 0x03,
    };
    this.cmd = {
      HEAD: 0xf5,
      TAIL: 0xf5,
      ADD_1: 0x01,
      ADD_2: 0x02,
      ADD_3: 0x03,
      GET_PERMISSION: 0x0a,
      MATCH: 0x0c,
      DEL: 0x04,
      DEL_ALL: 0x05,
      USER_CNT: 0x09,
      SECURITY_LEVEL: 0x28,
      SLEEP_MODE: 0x2c,
      ADD_MODE: 0x2d,
      FINGER_DETECTED: 0x14,
    };
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(null, this.params.gnd, "3v");
    if (!this.obniz.isValidIO(this.params.tx) && !this.obniz.isValidIO(this.params.rx)) {
      if (this.obniz.hasExtraInterface("m5stickc_hat")) {
        const hatI2c = this.obniz.getExtraInterface("m5stickc_hat").uart;
        this.params.tx = hatI2c.tx;
        this.params.rx = hatI2c.rx;
      } else {
        throw new Error("Cannot find m5stickc hat interface. Please set param 'tx'/'rx'");
      }
    }

    this.uart = this.obniz.getFreeUart();
    this.uart.start({
      tx: this.params.tx,
      rx: this.params.rx,
      baud: 19200,
    });
  }

  public async getUserNumWait() {
    this.TxBuf[this.CMD] = this.cmd.USER_CNT;
    this.TxBuf[this.P1] = 0;
    this.TxBuf[this.P2] = 0;
    this.TxBuf[this.P3] = 0;

    const res = await this.sendAndReceiveWait(200);
    if (res === this.ack.SUCCESS && this.RxBuf[this.Q3] === this.ack.SUCCESS) {
      return this.RxBuf[this.Q2];
    } else {
      return 0xff;
    }
  }

  public async addUserWait(userNum: number, userPermission: number) {
    this.TxBuf[this.CMD] = this.cmd.ADD_1;
    this.TxBuf[this.P1] = 0;
    this.TxBuf[this.P2] = userNum;
    this.TxBuf[this.P3] = userPermission;

    let res = await this.sendAndReceiveWait(3000);

    if (res === this.ack.SUCCESS) {
      if (this.RxBuf[this.Q3] === this.ack.SUCCESS) {
        this.TxBuf[this.CMD] = this.cmd.ADD_2;
        res = await this.sendAndReceiveWait(3000);

        if (res === this.ack.SUCCESS) {
          this.TxBuf[this.CMD] = this.cmd.ADD_3;
          res = await this.sendAndReceiveWait(3000);

          if (this.ack.SUCCESS) {
            return this.RxBuf[this.Q3];
          }
        }
      }
    }

    return res;
  }

  public async compareFingerWait() {
    this.TxBuf[this.CMD] = this.cmd.MATCH;
    this.TxBuf[this.P1] = 0;
    this.TxBuf[this.P2] = 0;
    this.TxBuf[this.P3] = 0;

    const res = await this.sendAndReceiveWait(3000);

    if (res === this.ack.SUCCESS) {
      if (this.RxBuf[this.Q3] === this.ack.NOUSER) {
        return this.ack.NOUSER;
      }
      if (this.RxBuf[this.Q3] === this.ack.TIMEOUT) {
        return this.ack.TIMEOUT;
      }
      return this.RxBuf[this.Q3];
    }
    return res;
  }

  public async sleepWait() {
    this.TxBuf[this.CMD] = this.cmd.SLEEP_MODE;
    this.TxBuf[this.P1] = 0;
    this.TxBuf[this.P2] = 0;
    this.TxBuf[this.P3] = 0;

    const res = await this.sendAndReceiveWait(500);

    if (res === this.ack.SUCCESS) {
      return this.ack.SUCCESS;
    } else {
      return this.ack.FAIL;
    }
  }

  public async setAddModeWait(mode: number) {
    this.TxBuf[this.CMD] = this.cmd.ADD_MODE;
    this.TxBuf[this.P1] = 0;
    this.TxBuf[this.P2] = mode;
    this.TxBuf[this.P3] = 0;

    await this.sendAndReceiveWait(200);

    if (this.RxBuf[this.Q3] === this.ack.SUCCESS) {
      return this.ack.SUCCESS;
    }

    throw Error("failed to set add mode.");
  }

  public async readAddModeWait() {
    this.TxBuf[this.CMD] = this.cmd.ADD_MODE;
    this.TxBuf[this.P1] = 0;
    this.TxBuf[this.P2] = 0;
    this.TxBuf[this.P3] = 0x01;

    await this.sendAndReceiveWait(200);

    if (this.RxBuf[this.Q3] === this.ack.SUCCESS) {
      return this.RxBuf[this.Q2];
    }

    throw Error("failed to read add mode.");
  }

  public async deleteAllUserWait() {
    this.TxBuf[this.CMD] = this.cmd.DEL_ALL;
    this.TxBuf[this.P1] = 0;
    this.TxBuf[this.P2] = 0;
    this.TxBuf[this.P3] = 0;

    await this.sendAndReceiveWait(200);

    if (this.RxBuf[this.Q3] === this.ack.SUCCESS) {
      return this.ack.SUCCESS;
    }

    throw Error("failed to delete all users.");
  }

  public async deleteUserWait(userNum: number) {
    this.TxBuf[this.CMD] = this.cmd.DEL;
    this.TxBuf[this.P1] = 0;
    this.TxBuf[this.P2] = userNum;
    this.TxBuf[this.P3] = 0;

    await this.sendAndReceiveWait(200);

    if (this.RxBuf[this.Q3] === this.ack.SUCCESS) {
      return this.ack.SUCCESS;
    }

    throw Error("failed to delete user: " + userNum);
  }

  public async getUserPermissionWait(userNum: number) {
    this.TxBuf[this.CMD] = this.cmd.GET_PERMISSION;
    this.TxBuf[this.P1] = 0;
    this.TxBuf[this.P2] = userNum;
    this.TxBuf[this.P3] = 0;

    await this.sendAndReceiveWait(200);

    return this.RxBuf[this.Q3];
  }

  public async setSecurityLevelWait(level: number) {
    if (level < 0 || level > 9) {
      throw Error("security level argument must be between 0 and 9");
    }

    this.TxBuf[this.CMD] = this.cmd.SECURITY_LEVEL;
    this.TxBuf[this.P1] = 0;
    this.TxBuf[this.P2] = level;
    this.TxBuf[this.P3] = 0x00;

    await this.sendAndReceiveWait(200);

    if (this.RxBuf[this.Q3] === this.ack.SUCCESS) {
      return this.ack.SUCCESS;
    }

    throw Error("failed to set security level.");
  }

  public async getSecurityLevelWait() {
    this.TxBuf[this.CMD] = this.cmd.SECURITY_LEVEL;
    this.TxBuf[this.P1] = 0;
    this.TxBuf[this.P2] = 0;
    this.TxBuf[this.P3] = 0x01;

    await this.sendAndReceiveWait(200);

    if (this.RxBuf[this.Q3] === this.ack.SUCCESS) {
      return this.RxBuf[this.Q2];
    }

    throw Error("failed to get security level.");
  }

  private async sendAndReceiveWait(timeout: number) {
    let checkSum = 0;

    this.TxBuf[5] = 0;
    this.uart.send(this.cmd.HEAD);
    for (let i = 1; i < 6; i++) {
      this.uart.send(this.TxBuf[i]);
      checkSum ^= this.TxBuf[i];
    }
    this.uart.send(checkSum);
    this.uart.send(this.cmd.TAIL);

    await this.obniz.wait(timeout);

    if (!this.uart.isDataExists()) {
      return this.ack.TIMEOUT;
    }
    this.RxBuf = this.uart.readBytes();
    // console.log("RxBuf: " + this.RxBuf);
    if (this.RxBuf.length !== 8) {
      return this.ack.TIMEOUT;
    }
    if (this.RxBuf[this.HEAD] !== this.cmd.HEAD) {
      throw Error("communication failed.");
    }
    if (this.RxBuf[this.TAIL] !== this.cmd.TAIL) {
      throw Error("communication failed.");
    }
    if (this.RxBuf[this.CMD] !== this.TxBuf[this.CMD]) {
      throw Error("communication failed.");
    }

    checkSum = 0;
    for (let i = 1; i < this.CHK; i++) {
      checkSum ^= this.RxBuf[i];
    }
    if (checkSum !== this.RxBuf[this.CHK]) {
      throw Error("communication failed.");
    }

    return this.ack.SUCCESS;
  }
}
