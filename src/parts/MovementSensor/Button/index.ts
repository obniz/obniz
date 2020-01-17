import Obniz from "../../../obniz";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface ButtonOptions { }
class Button implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "Button",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public onChangeForStateWait: any;
  public io_signal: any;
  public params: any;
  public io_supply: any;
  public isPressed: any;
  public onchange: any;

  constructor() {
    this.keys = ["signal", "gnd", "pull"];
    this.requiredKeys = ["signal"];

    this.onChangeForStateWait = () => {
    };
  }

  public wired(obniz: Obniz) {
    this.io_signal = obniz.getIO(this.params.signal);

    if (obniz.isValidIO(this.params.gnd)) {
      this.io_supply = obniz.getIO(this.params.gnd);
      this.io_supply.output(false);
    }

    // start input
    if (this.params.pull === "3v") {
      this.io_signal.pull("3v");
    } else if (this.params.pull === "0v") {
      this.io_signal.pull("0v");
    } else {
      this.io_signal.pull("5v");
    }

    const self: any = this;
    this.io_signal.input((value: any) => {
      self.isPressed = value === false;
      if (self.onchange) {
        self.onchange(value === false);
      }
      self.onChangeForStateWait(value === false);
    });
  }

  public async isPressedWait() {
    const ret: any = await this.io_signal.inputWait();
    return ret === false;
  }

  public stateWait(isPressed: any) {
    return new Promise((resolve, reject) => {
      this.onChangeForStateWait = (pressed: any) => {
        if (isPressed === pressed) {
          this.onChangeForStateWait = () => {
          };
          resolve();
        }
      };
    });
  }
}

export default Button;
