/**
 * @packageDocumentation
 * @module Parts.MCP23S08
 */

import Obniz from '../../../obniz';
import PeripheralIO from '../../../obniz/libs/io_peripherals/io';
import PeripheralSPI from '../../../obniz/libs/io_peripherals/spi';
import ObnizPartsInterface, {
  ObnizPartsInfo,
} from '../../../obniz/ObnizPartsInterface';

export interface MCP23S08Options {
  vcc: number;
  gnd: number;
  din: number;
  dout: number;
  sclk: number;
}

class MCP23S08_IO {
  public chip: any;
  public id: any;
  public direction: boolean;
  public value: boolean;

  constructor(chip: any, id: any) {
    this.chip = chip;
    this.id = id;
    this.value = false;
    this.direction = true; // true is input. false is output
  }

  public output(value: any) {
    this.chip.output(this.id, value);
  }

  public async inputWait() {
    return await this.chip.inputWait(this.id);
  }
}

export const MCP23S08_IO_DIRECTION = {
  OUTPUT: false,
  INPUT: true,
};
export const MCP23S08_REGISTER = {
  IODIR: 0x00,
  IPOL: 0x01,
  GPINTEN: 0x02,
  DEFVAL: 0x03,
  INTCON: 0x04,
  IOCON: 0x05,
  GPPU: 0x06,
  INTF: 0x07,
  INTCAP: 0x08,
  GPIO: 0x09,
  OLAT: 0x0a,
};

/* eslint max-classes-per-file: 0 */

export default class MCP23S08 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: 'MCP23S08',
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  protected obniz!: Obniz;
  protected spi!: PeripheralSPI;
  public csPin!: PeripheralIO;
  public writeSlaveAddress!: number;
  public readSlaveAddress!: number;
  private ios: MCP23S08_IO[] = [];

  public readonly io0!: MCP23S08_IO;
  public readonly io1!: MCP23S08_IO;
  public readonly io2!: MCP23S08_IO;
  public readonly io3!: MCP23S08_IO;
  public readonly io4!: MCP23S08_IO;
  public readonly io5!: MCP23S08_IO;
  public readonly io6!: MCP23S08_IO;
  public readonly io7!: MCP23S08_IO;

  constructor() {
    this.keys = ['vcc', 'gnd', 'frequency', 'mosi', 'miso', 'clk', 'spi', 'cs'];
    this.requiredKeys = ['cs'];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    this.params.mode = this.params.mode || 'master';
    this.params.frequency = this.params.frequency || 500000;
    this.spi = this.obniz.getSpiWithConfig(this.params);

    this.csPin = obniz.getIO(this.params.cs);

    this.readSlaveAddress = 0b01000001;
    this.writeSlaveAddress = 0b01000000;
    this.ios = [];
    for (let i = 0; i < 8; i++) {
      const io = new MCP23S08_IO(this, i);
      this.ios.push(io);
      (this as any)['io' + i] = io;
    }
  }

  /**
   * Initialize all ios. set direction=input.
   */
  public async initWait() {
    await this.writeWait(MCP23S08_REGISTER.IODIR, 0xff); // input
    for (let i = MCP23S08_REGISTER.IPOL; i <= MCP23S08_REGISTER.OLAT; i++) {
      await this.writeWait(i, 0x00);
    }
    await this.flushWait('direction');
    await this.flushWait('gpio');
  }

  /**
   * Read byte from address
   *
   * @param address internal register address
   * @returns readed value of address
   */
  public async readWait(address: number) {
    this.csPin.output(false);
    await this.spi.writeWait([this.readSlaveAddress, address]);
    const ret = await this.spi.writeWait([0x00]);
    this.csPin.output(true);
    return ret[0];
  }

  /**
   * Write byte to address. It will wait until success response receive
   *
   * @param address internal register address
   * @param data
   */
  public async writeWait(address: number, data: number) {
    this.csPin.output(false);
    await this.spi.writeWait([this.writeSlaveAddress, address, data]);
    this.csPin.output(true);
  }

  /**
   * Write byte to address without wait.
   *
   * @param address internal register address
   * @param data
   */
  public write(address: number, data: number) {
    this.csPin.output(false);
    this.spi.write([this.writeSlaveAddress, address, data]);
    this.csPin.output(true);
  }

  /**
   * Bulk write to addresses
   *
   * @param address start address
   * @param data
   */
  public async writeBulkWait(address: number, data: number[]) {
    this.csPin.output(false);
    await this.spi.writeWait([this.writeSlaveAddress, address, ...data]);
    this.csPin.output(true);
  }

  /**
   * set output value for io. It will apply immidiately.
   * This function never change direction. set direction output before.
   * If you want to hold some changes and flush once.
   * ```
   * use following examle steps
   * this.io0.value = true;
   * this.io1.value = true;
   * this.flush("gpio");
   * ```
   *
   * @param id io address. 0-7
   * @param value boolean. true or false
   */
  public output(id: number, value: boolean) {
    value = value === true;
    this.ios[id].value = value;
    this.flush();
  }

  /**
   * Read current all GPIO value.
   */
  public async readAllGPIOWait() {
    const ret = await this.readWait(MCP23S08_REGISTER.GPIO);
    for (let i = 0; i < 8; i++) {
      this.ios[i].value = (ret & (1 << i)) !== 0;
    }
  }

  /**
   * Read current all GPIO value and return single io value.
   *
   * @param id io 0-7
   * @returns GPIO value
   */
  public async inputWait(id: number): Promise<boolean> {
    await this.readAllGPIOWait();
    return this.ios[id].value;
  }

  public async flushWait(type = 'gpio') {
    const keys: any = {
      gpio: { key: 'value', address: MCP23S08_REGISTER.GPIO },
      direction: { key: 'direction', address: MCP23S08_REGISTER.IODIR },
    };
    const key = keys[type].key;
    const address = keys[type].address;
    let value = 0;
    for (let i = 0; i < 8; i++) {
      if ((this.ios[i] as any)[key]) {
        value = value | (1 << i);
      }
    }
    await this.writeWait(address, value);
    // console.log("write",value);
    // console.log(await this.readWait(MCP23S08_REGISTER.OLAT), await this.readWait(MCP23S08_REGISTER.GPIO));
  }

  public flush(type = 'gpio') {
    const keys: any = {
      gpio: { key: 'value', address: MCP23S08_REGISTER.GPIO },
      direction: { key: 'direction', address: MCP23S08_REGISTER.IODIR },
    };
    const key = keys[type].key;
    const address = keys[type].address;
    let value = 0;
    for (let i = 0; i < 8; i++) {
      if ((this.ios[i] as any)[key]) {
        value = value | (1 << i);
      }
    }
    this.write(address, value);
    // console.log("write",value);
    // console.log(await this.readWait(MCP23S08_REGISTER.OLAT), await this.readWait(MCP23S08_REGISTER.GPIO));
  }
}
