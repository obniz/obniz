
途中。いつも0を受信してしまう。

参考: https://www.ti.com/lit/ds/symlink/ads1015.pdf?ts=1744181195694&ref_url=https%253A%252F%252Fwww.google.com%252F
https://github.com/adafruit/Adafruit_ADS1X15

import Obniz, { PeripheralI2C } from "../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

/**
 * Read AD value from Qwiic signal port
 */

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id} ${obniz.hw}`)

  // obniz.debugprint = true;

  const ads1015 = new ADS1015();
  ads1015.params = {
    sda: 1,
    scl: 2,
  }
  ads1015.wired(obniz);
  const voltage = await ads1015.getVoltageWait();
  console.log(`Voltage: ${voltage.toFixed(4)} V`);
  obniz.onloop = async () => {
    const voltage = await ads1015.getVoltageWait();
    console.log(`Voltage: ${voltage.toFixed(4)} V`);
  }
};

const ADS1015_ADDRESS = 0x48;
const POINTER_CONVERSION = 0x00;
const POINTER_CONFIG = 0x01;

const ADS1X15_REG_CONFIG_OS_SINGLE = (0x8000)  ///< High threshold

const ADS1X15_REG_CONFIG_MUX_SINGLE_0 = (0x4000) ///< Single-ended AIN0
const ADS1X15_REG_CONFIG_MUX_SINGLE_1 = (0x5000) ///< Single-ended AIN1
const ADS1X15_REG_CONFIG_MUX_SINGLE_2 = (0x6000) ///< Single-ended AIN2
const ADS1X15_REG_CONFIG_MUX_SINGLE_3 = (0x7000)

const ADS1X15_REG_POINTER_MASK = (0x03)      ///< Point mask
const ADS1X15_REG_POINTER_CONVERT = (0x00)   ///< Conversion
const ADS1X15_REG_POINTER_CONFIG = (0x01)    ///< Configuration
const ADS1X15_REG_POINTER_LOWTHRESH = (0x02) ///< Low threshold
const ADS1X15_REG_POINTER_HITHRESH = (0x03)  ///< High threshold

const ADS1X15_REG_CONFIG_CQUE_1CONV = (0x0000)
const ADS1X15_REG_CONFIG_CLAT_NONLAT = (0x0000)
const ADS1X15_REG_CONFIG_CPOL_ACTVLOW = (0x0000)
const ADS1X15_REG_CONFIG_CMODE_TRAD = (0x0000)
const ADS1X15_REG_CONFIG_MODE_SINGLE = (0x0100)

const ADS1X15_REG_CONFIG_PGA_MASK = (0x0E00)   ///< PGA Mask
const ADS1X15_REG_CONFIG_PGA_6_144V = (0x0000) ///< +/-6.144V range = Gain 2/3
const ADS1X15_REG_CONFIG_PGA_4_096V = (0x0200) ///< +/-4.096V range = Gain 1
const ADS1X15_REG_CONFIG_PGA_2_048V = (0x0400) ///< +/-2.048V range = Gain 2 (default)
const ADS1X15_REG_CONFIG_PGA_1_024V = (0x0600) ///< +/-1.024V range = Gain 4
const ADS1X15_REG_CONFIG_PGA_0_512V = (0x0800) ///< +/-0.512V range = Gain 8
const ADS1X15_REG_CONFIG_PGA_0_256V = (0x0A00) ///< +/-0.256V range = Gain 16


const RATE_ADS1015_128SPS = (0x0000)  ///< 128 samples per second
const RATE_ADS1015_250SPS = (0x0020)  ///< 250 samples per second
const RATE_ADS1015_490SPS = (0x0040)  ///< 490 samples per second
const RATE_ADS1015_920SPS = (0x0060)  ///< 920 samples per second
const RATE_ADS1015_1600SPS = (0x0080) ///< 1600 samples per second (default)
const RATE_ADS1015_2400SPS = (0x00A0) ///< 2400 samples per second
const RATE_ADS1015_3300SPS = (0x00C0) ///< 3300 samples per second

enum GAINS {
  GAIN_TWOTHIRDS = ADS1X15_REG_CONFIG_PGA_6_144V,
  GAIN_ONE = ADS1X15_REG_CONFIG_PGA_4_096V,
  GAIN_TWO = ADS1X15_REG_CONFIG_PGA_2_048V,
  GAIN_FOUR = ADS1X15_REG_CONFIG_PGA_1_024V,
  GAIN_EIGHT = ADS1X15_REG_CONFIG_PGA_0_512V,
  GAIN_SIXTEEN = ADS1X15_REG_CONFIG_PGA_0_256V
};

let m_bitShift = 4;
let m_gain = GAINS.GAIN_TWOTHIRDS; /* +/- 6.144V range (limited to VDD +0.3V max!) */
let m_dataRate = RATE_ADS1015_1600SPS;

class ADS1015 {

  public keys: string[];
  public requiredKeys: string[];
  public params: any = {}

  public address: number;

  protected obniz!: Obniz;
  protected i2c!: PeripheralI2C;

  constructor() {
    this.keys = ['vcc', 'gnd', 'sda', 'scl', 'i2c'];
    this.requiredKeys = [];

    this.address = ADS1015_ADDRESS;
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    this.params.mode = 'master';
    this.params.clock = 400 * 1000;
    this.i2c = this.obniz.getI2CWithConfig(this.params);
  }

  public async getVoltageWait() {
    let config =
      ADS1X15_REG_CONFIG_CQUE_1CONV |   // Set CQUE to any value other than
      // None so we can use it in RDY mode
      ADS1X15_REG_CONFIG_CLAT_NONLAT |  // Non-latching (default val)
      ADS1X15_REG_CONFIG_CPOL_ACTVLOW | // Alert/Rdy active low   (default val)
      ADS1X15_REG_CONFIG_CMODE_TRAD;    // Traditional comparator (default val)

    // if (continuous) {
    //   config |= ADS1X15_REG_CONFIG_MODE_CONTIN;
    // } else {
    config |= ADS1X15_REG_CONFIG_MODE_SINGLE;
    // }

    // Set PGA/voltage range
    config |= m_gain;

    // Set data rate
    config |= m_dataRate;

    const mux = ADS1X15_REG_CONFIG_MUX_SINGLE_0;

    // Set channels
    config |= mux;

    // Set 'start single-conversion' bit
    config |= ADS1X15_REG_CONFIG_OS_SINGLE;

    this.i2c.write(ADS1015_ADDRESS, [ADS1X15_REG_POINTER_CONFIG, config >> 8, config & 0xFF]);
    this.i2c.write(ADS1015_ADDRESS, [ADS1X15_REG_POINTER_HITHRESH, 0x80, 0x00]);
    this.i2c.write(ADS1015_ADDRESS, [ADS1X15_REG_POINTER_LOWTHRESH, 0x00, 0x00]);

    obniz.wait(1);

    const raw = await this.getWait();
    console.log(raw);

    const value = (raw[0] << 4) | (raw[1] >> 4); // 12ビットデータ
    const signed = value > 0x7FF ? value - 0x1000 : value; // 負の補正

    let fsRange;
    switch (m_gain) {
      case GAINS.GAIN_TWOTHIRDS:
        fsRange = 6.144;
        break;
      case GAINS.GAIN_ONE:
        fsRange = 4.096;
        break;
      case GAINS.GAIN_TWO:
        fsRange = 2.048;
        break;
      case GAINS.GAIN_FOUR:
        fsRange = 1.024;
        break;
      case GAINS.GAIN_EIGHT:
        fsRange = 0.512;
        break;
      case GAINS.GAIN_SIXTEEN:
        fsRange = 0.256;
        break;
      default:
        fsRange = 0.0;
    }
    const voltage = signed * (fsRange / (32768 >> m_bitShift));

    // 電圧変換（±4.096Vスケール時: 1bit = 2mV）
    // const voltage = signed * 0.002;

    console.log(`ADC raw: ${signed}, Voltage: ${voltage.toFixed(4)} V`);
    return voltage
  }

  private async getWait() {

    // コンバージョンレジスタの値を読み出し
    this.i2c.write(ADS1015_ADDRESS, [ADS1X15_REG_POINTER_CONVERT]);
    let raw = await this.i2c.readWait(ADS1015_ADDRESS, 2);
    return raw;
  }
}