import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";

export interface JoyStickOptions { }
class JoyStick implements ObnizPartsInterface {

  public static info() {
    return {
      name: "JoyStick",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public pins: any;
  public pinname: any;
  public shortName: any;
  public obniz!: Obniz;
  public params: any;
  public io_sig_sw: any;
  public ad_x: any;
  public ad_y: any;
  public positionX: any;
  public positionY: any;
  public onchangex: any;
  public onchangey: any;
  public isPressed: any;
  public onchangesw: any;

  constructor() {
    this.keys = ["sw", "y", "x", "vcc", "gnd", "i2c"];
    this.requiredKeys = ["sw", "y", "x"];
    this.pins = this.keys || ["sw", "y", "x", "vcc", "gnd"];
    this.pinname = {sw: "sw12"};
    this.shortName = "joyS";
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    this.io_sig_sw = obniz.getIO(this.params.sw);
    this.ad_x = obniz.getAD(this.params.x);
    this.ad_y = obniz.getAD(this.params.y);

    this.io_sig_sw.pull("5v");

    const self: any = this;
    this.ad_x.start((value: any) => {
      self.positionX = value / 5.0;
      if (self.onchangex) {
        self.onchangex(self.positionX * 2 - 1);
      }
    });

    this.ad_y.start((value: any) => {
      self.positionY = value / 5.0;
      if (self.onchangey) {
        self.onchangey(self.positionY * 2 - 1);
      }
    });

    this.io_sig_sw.input((value: any) => {
      self.isPressed = value === false;
      if (self.onchangesw) {
        self.onchangesw(value === false);
      }
    });
  }

  public async isPressedWait() {
    const ret: any = await this.io_sig_sw.inputWait();
    return ret === false;
  }

  public async getXWait() {
    const value: any = await this.ad_x.getWait();
    this.positionX = value / 5.0;
    return this.positionX * 2 - 1;
  }

  public async getYWait() {
    const value: any = await this.ad_y.getWait();
    this.positionY = value / 5.0;
    return this.positionY * 2 - 1;
  }
}

export default JoyStick;
