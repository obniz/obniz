/**
 * @packageDocumentation
 * @module Parts.BME280
 */

import Obniz from "../../../../obniz";
import PeripheralI2C from "../../../../obniz/libs/io_peripherals/i2c";
import PeripheralIO from "../../../../obniz/libs/io_peripherals/io";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";

export interface BME280Options {
  vio?: number;
  vcore?: number;
  gnd?: number;
  csb?: number;
  sdi?: number;
  sck?: number;
  sdo?: number;
  address?: number;
  i2c?: any;
}

export default class BME280 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "BME280",
      datasheet: "https://ae-bst.resource.bosch.com/media/_tech/media/datasheets/BST-BME280_DS001-12.pdf",
    };
  }

  public requiredKeys: string[];
  public keys: string[];
  public ioKeys: string[];
  public configration: any;
  public commands: any;
  public params: any;
  public io_csb?: PeripheralIO;
  public address: any;
  public io_sdo?: PeripheralIO;

  protected obniz!: Obniz;
  protected i2c!: PeripheralI2C;

  private _calibrated: any;
  private _t_fine: any;

  constructor() {
    this.requiredKeys = [];
    this.keys = ["vcore", "vio", "gnd", "csb", "sdi", "sck", "sdo", "i2c", "address"];

    this.ioKeys = ["vcore", "vio", "gnd", "csb", "sdi", "sdo", "sck"];

    this.configration = {
      sampling: {
        temp: 1, // 0 never. 0b001 to 0b101
        hum: 1,
        pres: 1,
      },
      interval: 5, // 0b000 to 0b111
      iir_strength: 0, // 000 to 100 (0=disable)
      mode: 3,

      Modes: {
        sleep: 0,
        forced: 1, // or 2
        normal: 3,
      },
    };

    this.commands = {};

    this.commands.addresses = {
      config: 0xf5,
      ctrl_meas: 0xf4,
      ctrl_hum: 0xf2,
    };
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    if (obniz.isValidIO(this.params.csb)) {
      // selecting I2C mode before powerup
      this.io_csb = obniz.getIO(this.params.csb);
      this.io_csb.drive("3v");
      this.io_csb.output(true);
    }

    this.obniz.setVccGnd(this.params.vio, null, "3v");
    this.obniz.setVccGnd(this.params.vcore, null, "3v");
    this.obniz.setVccGnd(null, this.params.gnd, "5v");
    this.obniz.wait(10);

    this.address = 0x76;
    if (this.params.address === 0x76) {
      this.address = 0x76;
    } else if (this.params.address === 0x77) {
      this.address = 0x77;
    } else if (this.params.address !== undefined) {
      throw new Error("address must be 0x76 or 0x77");
    }

    if (obniz.isValidIO(this.params.sdo)) {
      this.io_sdo = obniz.getIO(this.params.sdo);
      this.io_sdo.drive("3v");
      this.io_sdo.output(this.address === 0x76 ? false : true);
    }

    this.params.sda = this.params.sda || this.params.sdi;
    this.params.scl = this.params.scl || this.params.sck;
    this.params.clock = this.params.clock || 100 * 1000;
    this.params.mode = "master";
    this.params.pull = "3v";
    this.i2c = obniz.getI2CWithConfig(this.params);

    this.obniz.wait(10);

    this.config();

    this.obniz.wait(10);
  }

  public async config() {
    this.write([
      this.commands.addresses.config,
      (this.configration.interval << 5) | (this.configration.iir_strength << 2) | 0,
    ]);
    this.write([this.commands.addresses.ctrl_hum, this.configration.sampling.hum]);
    this.write([
      this.commands.addresses.ctrl_meas,
      (this.configration.sampling.temp << 5) | (this.configration.sampling.pres << 2) | this.configration.mode,
    ]);
  }

  public async setIIRStrength(strengh: any) {
    this.configration.iir_strength = strengh;
    this.config();
  }

  public async applyCalibration() {
    this.i2c.write(this.address, [0x88]);
    const data: any = await this.i2c.readWait(this.address, 24);
    this.i2c.write(this.address, [0xa1]);
    let data_next: any = await this.i2c.readWait(this.address, 1);
    data.push(...data_next);
    this.i2c.write(this.address, [0xe1]);
    data_next = await this.i2c.readWait(this.address, 7);
    data.push(...data_next);
    this._calibrated = {
      dig_T1: (data[1] << 8) | data[0],
      dig_T2: this._readSigned16((data[3] << 8) | data[2]),
      dig_T3: this._readSigned16((data[5] << 8) | data[4]),
      dig_P1: (data[7] << 8) | data[6],
      dig_P2: this._readSigned16((data[9] << 8) | data[8]),
      dig_P3: this._readSigned16((data[11] << 8) | data[10]),
      dig_P4: this._readSigned16((data[13] << 8) | data[12]),
      dig_P5: this._readSigned16((data[15] << 8) | data[14]),
      dig_P6: this._readSigned16((data[17] << 8) | data[16]),
      dig_P7: this._readSigned16((data[19] << 8) | data[18]),
      dig_P8: this._readSigned16((data[21] << 8) | data[20]),
      dig_P9: this._readSigned16((data[23] << 8) | data[22]),
      dig_H1: this._readSigned8(data[24]),
      dig_H2: this._readSigned16((data[26] << 8) | data[25]),
      dig_H3: this._readSigned8(data[27]),
      dig_H4: this._readSigned16((data[28] << 4) | (0x0f & data[29])),
      dig_H5: this._readSigned16((data[30] << 4) | ((data[29] >> 4) & 0x0f)),
      dig_H6: this._readSigned8(data[31]),
    };
    this._t_fine = 0;
  }

  public _readSigned16(value: number) {
    if (value >= 0x8000) {
      value = value - 0x10000;
    }
    return value;
  }

  public _readSigned8(value: number) {
    if (value >= 0x80) {
      value = value - 0x100;
    }
    return value;
  }

  public write(data: any) {
    this.i2c.write(this.address, data);
  }

  public async getData() {
    this.i2c.write(this.address, [0xf7]);
    return await this.i2c.readWait(this.address, 8);
  }

  public async getAllWait(): Promise<{
    temperature: number;
    humidity: number;
    pressure: number;
  }> {
    const data = await this.getData();

    const press_raw = (data[0] << 12) | (data[1] << 4) | (data[2] >> 4);
    const temp_raw = (data[3] << 12) | (data[4] << 4) | (data[5] >> 4);
    const hum_raw = (data[6] << 8) | data[7];

    const temperature = this.calibration_T(temp_raw) / 100.0;
    const pressure = this.calibration_P(press_raw) / 100.0;
    const humidity = this.calibration_H(hum_raw);

    return { temperature, humidity, pressure };
  }

  public calibration_T(adc_T: any) {
    let var1: any;
    let var2: any;
    let T: any;
    var1 = (((adc_T >> 3) - (this._calibrated.dig_T1 << 1)) * this._calibrated.dig_T2) >> 11;
    var2 =
      (((((adc_T >> 4) - this._calibrated.dig_T1) * ((adc_T >> 4) - this._calibrated.dig_T1)) >> 12) *
        this._calibrated.dig_T3) >>
      14;

    this._t_fine = var1 + var2;
    T = (this._t_fine * 5 + 128) >> 8;
    return T;
  }

  public calibration_P(adc_P: any) {
    let pvar1: any = this._t_fine / 2 - 64000;
    let pvar2: any = (pvar1 * pvar1 * this._calibrated.dig_P6) / 32768;
    pvar2 = pvar2 + pvar1 * this._calibrated.dig_P5 * 2;
    pvar2 = pvar2 / 4 + this._calibrated.dig_P4 * 65536;
    pvar1 = ((this._calibrated.dig_P3 * pvar1 * pvar1) / 524288 + this._calibrated.dig_P2 * pvar1) / 524288;
    pvar1 = (1 + pvar1 / 32768) * this._calibrated.dig_P1;

    if (pvar1 !== 0) {
      let p: any = 1048576 - adc_P;
      p = ((p - pvar2 / 4096) * 6250) / pvar1;
      pvar1 = (this._calibrated.dig_P9 * p * p) / 2147483648;
      pvar2 = (p * this._calibrated.dig_P8) / 32768;
      p = p + (pvar1 + pvar2 + this._calibrated.dig_P7) / 16;
      return p;
    }
    return 0;
  }

  public calibration_H(adc_H: any) {
    let h: any = this._t_fine - 76800;
    h =
      (adc_H - (this._calibrated.dig_H4 * 64 + (this._calibrated.dig_H5 / 16384) * h)) *
      ((this._calibrated.dig_H2 / 65536) *
        (1 + (this._calibrated.dig_H6 / 67108864) * h * (1 + (this._calibrated.dig_H3 / 67108864) * h)));
    h = h * (1 - (this._calibrated.dig_H1 * h) / 524288);
    return h;
  }

  public async getTempWait(): Promise<number> {
    return (await this.getAllWait()).temperature;
  }

  public async getHumdWait(): Promise<number> {
    return await this.getHumidWait();
  }
  public async getHumidWait(): Promise<number> {
    return (await this.getAllWait()).humidity;
  }

  public async getPressureWait(): Promise<number> {
    return (await this.getAllWait()).pressure;
  }

  public async getAltitudeWait() {
    const pressure: any = await this.getPressureWait();
    return this.calcAltitude(pressure);
  }

  public calcAltitude(pressure: number, seaPressure?: number): number {
    if (typeof seaPressure !== "number") {
      seaPressure = 1013.25;
    }
    return (1.0 - Math.pow(pressure / seaPressure, 1 / 5.2553)) * 145366.45 * 0.3048;
  }
}
