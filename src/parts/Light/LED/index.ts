import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";

export interface LEDOptions {
  anode: number;
  cathode?: number;
}
class LED implements ObnizPartsInterface {

  public static info() {
    return {
      name: "LED",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public obniz!: Obniz;
  public io_anode: any;
  public params: any;
  public io_cathode: any;
  public animationName: any;

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
    this.io_anode = getIO(this.params.anode);
    this.io_anode.output(false);
    if (this.obniz!.isValidIO(this.params.cathode)) {
      this.io_cathode = getIO(this.params.cathode);
      this.io_cathode.output(false);
    }
    this.animationName = "Led-" + this.params.anode;
  }

  public on() {
    this.endBlink();
    this.io_anode.output(true);
  }

  public off() {
    this.endBlink();
    this.io_anode.output(false);
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

  public blink(interval: any) {
    if (!interval) {
      interval = 100;
    }
    const frames: any = [
      {
        duration: interval,
        state: (index: any) => {
          // index = 0
          this.io_anode.output(true); // on
        },
      },
      {
        duration: interval,
        state: (index: any) => {
          // index = 0
          this.io_anode.output(false); // off
        },
      },
    ];

    this.obniz!.io!.animation(this.animationName, "loop", frames);
  }
}

export default LED;
