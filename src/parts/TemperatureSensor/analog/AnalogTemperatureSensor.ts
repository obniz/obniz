import Obniz from "../../../obniz";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface AnalogTemperatureSensorOptions { }
class AnalogTemperatureSensor implements ObnizPartsInterface {
  public keys: string[];
  public requiredKeys: string[];
  public drive: any;
  public obniz!: Obniz;
  public params: any;
  public ad: any;
  public temp: any;

  constructor() {
    this.keys = ["vcc", "gnd", "output"];
    this.requiredKeys = ["output"];
    this.drive = "5v";
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, this.drive);
    this.ad = obniz.getAD(this.params.output);

    this.ad.start(
      (voltage: any) => {
        this.temp = this.calc(voltage);
        this.onchange(this.temp);
      },
    );
  }

  public async getWait() {
    const voltage: any = await this.ad.getWait();
    this.temp = this.calc(voltage);
    return this.temp;
  }

  public onchange(temp: any) {
  }

  public calc(voltage: any) {
    return 0;
  }
}

export default AnalogTemperatureSensor;
