import Obniz from "../../../obniz";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface LEDOptions {
  anode: number;
  cathode?: number;
}

export default class LED implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "LED",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  protected obniz!: Obniz;

  private io_anode?: PeripheralIO;
  private io_cathode?: PeripheralIO;
  private animationName!: string;

  constructor() {
    this.keys = ["anode", "cathode"];
    this.requiredKeys = ["anode"];
  }

  public wired(obniz: Obniz) {
    function getIO(io: any) {
      if (io && typeof io === "object") {
        if (typeof io.output === "function") {
          return io;
        }
      }
      return obniz.getIO(io);
    }

    this.obniz = obniz;

    if (this.obniz.isValidIO(this.params.anode)) {
      this.io_anode = getIO(this.params.anode);
    }
    if (this.obniz.isValidIO(this.params.cathode)) {
      this.io_cathode = getIO(this.params.cathode);
    }
    this.animationName = "Led-" + this.params.anode;
  }

  public on() {
    this.endBlink();
    if (this.io_anode) {
      this.io_anode.output(true);
    }
    if (this.io_cathode) {
      this.io_cathode.output(false);
    }
  }

  public off() {
    this.endBlink();
    if (this.io_anode) {
      this.io_anode.output(false);
    }
    if (this.io_cathode) {
      this.io_cathode.output(true);
    }
  }

  public output(value: any) {
    if (value) {
      this.on();
    } else {
      this.off();
    }
  }

  public endBlink() {
    this.obniz!.io!.animation(this.animationName, "pause");
  }

  public blink(interval?: number) {
    if (!interval) {
      interval = 100;
    }
    const frames = [
      {
        duration: interval,
        state: (index: number) => {
          // index = 0
          this.on(); // on
        },
      },
      {
        duration: interval,
        state: (index: any) => {
          // index = 0
          this.off();
        },
      },
    ];

    this.obniz.io!.animation(this.animationName, "loop", frames);
  }
}
