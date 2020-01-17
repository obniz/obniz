import Obniz from "../../../obniz";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface HMC5883LOptions { }
class HMC5883L implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "HMC5883L",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public address: any;
  public obniz!: Obniz;
  public params: any;
  public i2c: any;

  constructor() {
    this.keys = ["gnd", "sda", "scl", "i2c"];
    this.requiredKeys = [];

    this.address = {};
    this.address.device = 0x1e;
    this.address.reset = [0x02, 0x00]; // Continuous Measurment Mode
    this.address.xMSB = [0x03];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(null, this.params.gnd, "3v");

    this.params.clock = 100000;
    this.params.pull = "3v";
    this.params.mode = "master";

    this.i2c = obniz.getI2CWithConfig(this.params);

    this.obniz.wait(500);
  }

  public init() {
    this.i2c.write(this.address.device, this.address.reset);
    this.obniz.wait(500);
  }

  public async get() {
    this.i2c.write(this.address.device, this.address.xMSB);
    const readed: any = await this.i2c.readWait(this.address.device, 2 * 3);

    const obj: any = {};
    const keys: any = ["x", "y", "z"];
    for (let i = 0; i < 3; i++) {
      let val: any = (readed[i * 2] << 8) | readed[i * 2 + 1];
      if (val & 0x8000) {
        val = val - 65536;
      }
      obj[keys[i]] = val;
    }

    return obj;
  }
}

export default HMC5883L;
