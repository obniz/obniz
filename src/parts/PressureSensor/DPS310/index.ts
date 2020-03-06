/**
 * @packageDocumentation
 * @module Parts.DPS310
 */

import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface DPS310Options {}

export default class DPS310 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "DPS310",
      datasheet: "",
    };
  }

  public requiredKeys: string[];
  public keys: string[];
  public ioKeys: string[];
  public params: any;

  private configration = {
    DPS310__STD_SLAVE_ADDRESS: 0x77,
  };

  private DPS310__OSR_SE = 3;
  private DPS310__LSB = 0x01;
  private DPS310__PRS_STD_MR = 2;
  private DPS310__PRS_STD_OSR = 3;
  private DPS310__TEMP_STD_MR = 2;
  private DPS310__TEMP_STD_OSR = 3;

  private DPS310__SUCCEEDED = 0;
  private DPS310__FAIL_UNKNOWN = -1;
  private DPS310__FAIL_INIT_FAILED = -2;
  private DPS310__FAIL_TOOBUSY = -3;
  private DPS310__FAIL_UNFINISHED = -4;
  private prsMr = 0;
  private prsOsr = 0;
  private tempMr = 0;
  private tempOsr = 0;
  private m_lastTempScal = 0;
  private mode = {
    IDLE: 0x00,
    CMD_PRS: 0x01,
    CMD_TEMP: 0x02,
    INVAL_OP_CMD_BOTH: 0x03, // invalid
    INVAL_OP_CONT_NONE: 0x04, // invalid
    CONT_PRS: 0x05,
    CONT_TMP: 0x06,
    CONT_BOTH: 0x07,
  };
  private bitFileds = {
    DPS310__REG_INFO_PROD_ID: {
      address: 0x0d,
      mask: 0x0f,
      shift: 0,
    },
    DPS310__REG_INFO_REV_ID: {
      address: 0x0d,
      mask: 0xf0,
      shift: 4,
    },
    DPS310__REG_INFO_TEMP_SENSORREC: {
      address: 0x28,
      mask: 0x80,
      shift: 7,
    },
    DPS310__REG_INFO_TEMP_SENSOR: {
      address: 0x07,
      mask: 0x80,
      shift: 7,
    },
    DPS310__REG_INFO_OPMODE: {
      address: 0x08,
      mask: 0x07,
      shift: 0,
    },
    DPS310__REG_INFO_FIFO_FL: {
      address: 0x0c,
      mask: 0x80,
      shift: 7,
    },
    DPS310__REG_INFO_FIFO_EN: {
      address: 0x09,
      mask: 0x02,
      shift: 1,
    },
    DPS310__REG_INFO_TEMP_MR: {
      address: 0x07,
      mask: 0x70,
      shift: 4,
    },
    DPS310__REG_INFO_TEMP_OSR: {
      address: 0x07,
      mask: 0x07,
      shift: 0,
    },
    DPS310__REG_INFO_PRS_MR: {
      address: 0x06,
      mask: 0x70,
      shift: 4,
    },
    DPS310__REG_INFO_PRS_OSR: {
      address: 0x06,
      mask: 0x07,
      shift: 0,
    },
    DPS310__REG_INFO_PRS_SE: {
      address: 0x09,
      mask: 0x04,
      shift: 2,
    },
    DPS310__REG_INFO_PRS_RDY: {
      address: 0x08,
      mask: 0x10,
      shift: 4,
    },
    DPS310__REG_INFO_TEMP_SE: {
      address: 0x09,
      mask: 0x08,
      shift: 3,
    },
    DPS310__REG_INFO_TEMP_RDY: {
      address: 0x08,
      mask: 0x20,
      shift: 5,
    },
  };

  private dataBlock = {
    DPS310__REG_ADR_COEF: {
      address: 0x10,
      length: 18,
    },
    DPS310__REG_ADR_PRS: {
      address: 0x00,
      length: 3,
    },
    DPS310__REG_ADR_TEMP: {
      address: 0x03,
      length: 3,
    },
  };
  private scaling_facts = [524288, 1572864, 3670016, 7864320, 253952, 516096, 1040384, 2088960];
  private opMode: any;
  private coeffs: any;
  private obniz!: Obniz;
  private address: any;
  private i2c!: PeripheralI2C;

  constructor() {
    this.requiredKeys = ["sda", "scl"];
    this.keys = ["gpio3", "vcc", "gnd", "scl", "sda"];
    this.ioKeys = ["gpio3", "vcc", "gnd", "scl", "sda"];

    this.coeffs = {};

    this.opMode = this.mode.IDLE;
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.address = 0x77;
    this.params.sda = this.params.sda;
    this.params.scl = this.params.scl;
    this.params.clock = this.params.clock || 100 * 1000;
    this.params.mode = "master";
    this.params.pull = "3v";
    this.i2c = obniz.getI2CWithConfig(this.params);
    this.obniz.wait(10);
  }

  public async initWait(): Promise<void> {
    const prodId: any = await this.readByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_PROD_ID);
    if (prodId !== 0) {
      throw new Error("invalid prodId");
    }
    await this.readByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_REV_ID);

    await this.readByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_TEMP_SENSORREC);

    await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_TEMP_SENSOR, 0);

    await this.readCoeffsWait();
    await this.standbyWait();
    await this.configTempWait(this.DPS310__TEMP_STD_MR, this.DPS310__TEMP_STD_OSR);
    await this.configPressureWait(this.DPS310__PRS_STD_MR, this.DPS310__PRS_STD_OSR);
    await this.standbyWait();
    await this.measureTempOnceWait();
    await this.standbyWait();
    await this.correctTempWait();
  }

  public async measurePressureOnceWait(oversamplingRate: any) {
    if (oversamplingRate === undefined) {
      oversamplingRate = this.prsOsr;
    }
    await this.startMeasurePressureOnceWait(oversamplingRate);
    await this.obniz.wait(100);
    const ret: any = await this.getSingleResultWait();
    return ret;
  }

  private async readByteWait(regAddress: any): Promise<number> {
    this.i2c.write(this.address, [regAddress]);
    await this.obniz.wait(1);
    const results: number[] = await this.i2c.readWait(this.address, 1);
    return results[0];
  }

  private async readByteBitfieldWait(field: any): Promise<number> {
    const regAddress: any = field.address;
    const mask: any = field.mask;
    const shift: any = field.shift;
    let ret: number = await this.readByteWait(regAddress);
    if (ret < 0) {
      return ret;
    }
    if (mask !== undefined) {
      ret = ret & mask;
    }
    if (shift !== undefined) {
      ret = ret >> shift;
    }
    return ret;
  }

  private async readBlockWait(datablock: any): Promise<number[]> {
    const address: any = datablock.address;
    const length: any = datablock.length;
    await this.obniz.wait(1);
    this.i2c.write(this.address, [address]);
    const results: number[] = await this.i2c.readWait(this.address, length);
    return results;
  }

  private async writeByteWait(regAddress: any, data: any, check?: any): Promise<void> {
    this.i2c.write(this.address, [regAddress, data]);
    if (check) {
      if ((await this.readByteWait(regAddress)) !== data) {
        throw new Error("DPS310 data write failed");
      }
    }
  }

  private async writeByteBitfield(field: any, data: any, check?: any): Promise<void> {
    const old: any = await this.readByteWait(field.address);
    const sendData: any = (old & ~field.mask) | ((data << field.shift) & field.mask);

    await this.writeByteWait(field.address, sendData, check);
  }

  private async setOpModeDetailWait(background: any, temperature: any, pressure: any): Promise<void> {
    const opMode: any =
      ((background & this.DPS310__LSB) << 2) | ((temperature & this.DPS310__LSB) << 1) | (pressure & this.DPS310__LSB);
    return await this.setOpModeWait(opMode);
  }

  private async setOpModeWait(opMode: any): Promise<void> {
    opMode &= this.bitFileds.DPS310__REG_INFO_OPMODE.mask >> this.bitFileds.DPS310__REG_INFO_OPMODE.shift;

    await this.writeByteWait(this.bitFileds.DPS310__REG_INFO_OPMODE.address, opMode);
    this.opMode = opMode;
  }

  private async standbyWait(): Promise<void> {
    this.setOpModeWait(this.mode.IDLE);
    await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_FIFO_FL, 1);
    await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_FIFO_EN, 0);
  }

  private async configTempWait(tempMr: any, tempOsr: any): Promise<void> {
    await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_TEMP_MR, tempMr);
    await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_TEMP_OSR, tempOsr);

    if (tempOsr > this.DPS310__OSR_SE) {
      await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_TEMP_SE, 1);
    } else {
      await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_TEMP_SE, 0);
    }

    this.tempMr = tempMr;
    this.tempOsr = tempOsr;
  }

  private async configPressureWait(prsMr: any, prsOsr: any): Promise<void> {
    await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_PRS_MR, prsMr);
    await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_PRS_OSR, prsOsr);

    if (prsOsr > this.DPS310__OSR_SE) {
      await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_PRS_SE, 1);
    } else {
      await this.writeByteBitfield(this.bitFileds.DPS310__REG_INFO_PRS_SE, 0);
    }
    this.prsMr = prsMr;
    this.prsOsr = prsOsr;
  }

  private async readCoeffsWait(): Promise<void> {
    const buffer: any = await this.readBlockWait(this.dataBlock.DPS310__REG_ADR_COEF);

    this.coeffs.m_c0Half = (buffer[0] << 4) | ((buffer[1] >> 4) & 0x0f);
    if (this.coeffs.m_c0Half & (1 << 11)) {
      this.coeffs.m_c0Half -= 1 << 12;
    }
    this.coeffs.m_c0Half = this.coeffs.m_c0Half / 2;

    this.coeffs.m_c1 = ((buffer[1] & 0x0f) << 8) | buffer[2];
    if (this.coeffs.m_c1 & (1 << 11)) {
      this.coeffs.m_c1 -= 1 << 12;
    }
    this.coeffs.m_c00 = (buffer[3] << 12) | (buffer[4] << 4) | ((buffer[5] >> 4) & 0x0f);
    if (this.coeffs.m_c00 & (1 << 19)) {
      this.coeffs.m_c00 -= 1 << 20;
    }

    this.coeffs.m_c10 = ((buffer[5] & 0x0f) << 16) | (buffer[6] << 8) | buffer[7];
    if (this.coeffs.m_c10 & (1 << 19)) {
      this.coeffs.m_c10 -= 1 << 20;
    }

    this.coeffs.m_c01 = (buffer[8] << 8) | buffer[9];
    if (this.coeffs.m_c01 & (1 << 15)) {
      this.coeffs.m_c01 -= 1 << 16;
    }

    this.coeffs.m_c11 = (buffer[10] << 8) | buffer[11];
    if (this.coeffs.m_c11 & (1 << 15)) {
      this.coeffs.m_c11 -= 1 << 16;
    }

    this.coeffs.m_c20 = (buffer[12] << 8) | buffer[13];
    if (this.coeffs.m_c20 & (1 << 15)) {
      this.coeffs.m_c20 -= 1 << 16;
    }

    this.coeffs.m_c21 = (buffer[14] << 8) | buffer[15];
    if (this.coeffs.m_c21 & (1 << 15)) {
      this.coeffs.m_c21 -= 1 << 16;
    }

    this.coeffs.m_c30 = (buffer[16] << 8) | buffer[17];
    if (this.coeffs.m_c30 & (1 << 15)) {
      this.coeffs.m_c30 -= 1 << 16;
    }
  }

  private async getSingleResultWait(): Promise<number> {
    let rdy: any;
    switch (this.opMode) {
      case this.mode.CMD_TEMP:
        rdy = await this.readByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_TEMP_RDY);
        break;
      case this.mode.CMD_PRS:
        rdy = await this.readByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_PRS_RDY);
        break;
      default:
        return this.DPS310__FAIL_TOOBUSY;
    }

    let oldMode: any;
    switch (rdy) {
      case this.DPS310__FAIL_UNKNOWN:
        throw new Error("DPS310__FAIL_UNKNOWN");
      case 0:
        return this.obniz.wait(10).then(() => {
          return this.getSingleResultWait();
        });
      case 1:
        oldMode = this.opMode;
        this.opMode = this.mode.IDLE;
        switch (oldMode) {
          case this.mode.CMD_TEMP:
            return await this.getTempWait();
          case this.mode.CMD_PRS:
            return await this.getPressureWait();
          default:
            throw new Error("DPS310__FAIL_UNKNOWN");
        }
    }
    throw new Error("DPS310__FAIL_UNKNOWN");
  }

  private async startMeasureTempOnceWait(oversamplingRate: any): Promise<void> {
    await this.configTempWait(0, oversamplingRate);
    await this.setOpModeDetailWait(0, 1, 0);
  }

  private async startMeasurePressureOnceWait(oversamplingRate: any): Promise<void> {
    await this.configPressureWait(0, oversamplingRate);
    await this.setOpModeDetailWait(0, 0, 1);
  }

  private calcPressure(raw: any): number {
    let prs: any = raw;
    prs /= this.scaling_facts[this.prsOsr];
    prs =
      this.coeffs.m_c00 +
      prs * (this.coeffs.m_c10 + prs * (this.coeffs.m_c20 + prs * this.coeffs.m_c30)) +
      this.m_lastTempScal * (this.coeffs.m_c01 + prs * (this.coeffs.m_c11 + prs * this.coeffs.m_c21));
    return prs;
  }

  private calcTemp(raw: any): number {
    let temp: any = raw;
    temp /= this.scaling_facts[this.tempOsr];
    this.m_lastTempScal = temp;
    temp = this.coeffs.m_c0Half + this.coeffs.m_c1 * temp;
    return temp;
  }

  private async correctTempWait(): Promise<void> {
    this.writeByteWait(0x0e, 0xe5);
    this.writeByteWait(0x0f, 0x96);
    this.writeByteWait(0x62, 0x02);
    this.writeByteWait(0x0e, 0x00);
    this.writeByteWait(0x0f, 0x00);

    await this.measureTempOnceWait();
  }

  private async measureTempOnceWait(oversamplingRate?: any): Promise<number> {
    if (oversamplingRate === undefined) {
      oversamplingRate = this.tempOsr;
    }
    await this.startMeasureTempOnceWait(oversamplingRate);
    await this.obniz.wait(100);
    return await this.getSingleResultWait();
  }

  private async getTempWait(): Promise<number> {
    const data: any = await this.readBlockWait(this.dataBlock.DPS310__REG_ADR_TEMP);

    let temp: any = (data[0] << 16) | (data[1] << 8) | data[2];
    if (temp & (1 << 23)) {
      temp -= 1 << 24;
    }
    return this.calcTemp(temp);
  }

  private async getPressureWait(): Promise<number> {
    const data: any = await this.readBlockWait(this.dataBlock.DPS310__REG_ADR_PRS);
    let prs: any = (data[0] << 16) | (data[1] << 8) | data[2];
    if (prs & (1 << 23)) {
      prs -= 1 << 24;
    }
    return this.calcPressure(prs);
  }
}
