import Obniz from "../../../obniz";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface IRModuleOptions { }
class IRModule implements ObnizPartsInterface {

  get dataSymbolLength() {
    return this.sensor.dataSymbolLength;
  }

  set dataSymbolLength(x) {
    this.sensor.dataSymbolLength = x;
    this.led.dataSymbolLength = x;
  }

  public static info(): ObnizPartsInfo {
    return {
      name: "IRModule",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public obniz!: Obniz;
  public params: any;
  public sensor: any;
  public led: any;

  constructor() {
    this.keys = ["recv", "vcc", "send", "gnd"];
    this.requiredKeys = ["recv", "send"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    if (!obniz.isValidIO(this.params.recv)) {
      throw new Error("recv is not valid io");
    }

    if (!obniz.isValidIO(this.params.send)) {
      throw new Error("send is not valid io");
    }

    this.sensor = obniz.wired("IRSensor", {
      output: this.params.recv,
    });
    this.setGetterSetter("sensor", "duration");
    this.setGetterSetter("sensor", "dataInverted");
    this.setGetterSetter("sensor", "cutTail");
    this.setGetterSetter("sensor", "output_pullup");
    this.setGetterSetter("sensor", "ondetect");

    this.led = obniz.wired("InfraredLED", {
      anode: this.params.send,
    });
  }

  // link
  public send(arr: any) {
    this.led.send(arr);
  }

  public start(callback: any) {
    this.sensor.start(callback);
  }

  public setGetterSetter(partsName: any, varName: any) {
    Object.defineProperty(this, varName, {
      get() {
        return this[partsName][varName];
      }
      ,
      set(x: any) {
        this[partsName][varName] = x;
      }
      ,
    })
    ;
  }
}

export default IRModule;
