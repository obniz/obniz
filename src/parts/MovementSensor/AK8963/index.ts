import Obniz from "../../../obniz";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface AK8963Options { }
class AK8963 implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "AK8963",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public obniz!: Obniz;
  public params: any;
  public _address: any;
  public i2c: any;
  public _adc_cycle: any;

  constructor() {
    this.keys = ["gnd", "vcc", "sda", "scl", "i2c", "address", "adb_cycle"];
    this.requiredKeys = [];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.params.clock = 100000;
    this.params.pull = "3v";
    this.params.mode = "master";
    this._address = this.params.address || 0x0c;
    this.i2c = obniz.getI2CWithConfig(this.params);
    this.setConfig(this.params.adc_cycle || 8);
  }

  public setConfig(ADC_cycle: any) {
    switch (ADC_cycle) {
      case 8:
        this.i2c.write(this._address, [0x0a, 0x12]);
        break;
      case 100:
        this.i2c.write(this._address, [0x0a, 0x16]);
        break;
      default:
        throw new Error("ADC_cycle variable 8,100 setting");
    }
    this._adc_cycle = ADC_cycle;
  }

  public async getWait() {
    this.i2c.write(this._address, [0x03]); // request AK8963 data
    const raw_data_AK8963: any = await this.i2c.readWait(this._address, 7); // read 7byte(read mag_data[6] to refresh)
    return {
      x: this.char2short(raw_data_AK8963[0], raw_data_AK8963[1]),
      y: this.char2short(raw_data_AK8963[2], raw_data_AK8963[3]),
      z: this.char2short(raw_data_AK8963[4], raw_data_AK8963[5]),
    };
  }

  public char2short(valueH: any, valueL: any) {
    const buffer: any = new ArrayBuffer(2);
    const dv: any = new DataView(buffer);
    dv.setUint8(0, valueH);
    dv.setUint8(1, valueL);
    return dv.getInt16(0, false);
  }
}

export default AK8963;
