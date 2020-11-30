import Obniz from "../../../dist/src/obniz/index";

const OBNIZ_ID = "1234-5678";

/**
 * https://obniz.io/ja/sdk/parts/SNx4HC595/README.md
 */
class SNx4HC595Test {
  public ioNum() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const ioext = obniz.wired("SNx4HC595", {
        gnd: 0,
        vcc: 1,
        ser: 2,
        rclk: 3,
        srclk: 4,
      });
      ioext.ioNum(16);
      ioext.output(15, true);
    };
  }

  public output() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const ioext = obniz.wired("SNx4HC595", {
        gnd: 0,
        vcc: 1,
        ser: 2,
        rclk: 3,
        srclk: 4,
      });
      ioext.output(3, true);
      ioext.output(4, true); // io4 will be changed to true "after" io3 changed to true.
      ioext.output(5, true);
    };
  }

  public onece() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const ioext = obniz.wired("SNx4HC595", {
        gnd: 0,
        vcc: 1,
        ser: 2,
        rclk: 3,
        srclk: 4,
      });
      ioext.onece(() => {
        // io 4 and 5 will be changed to false state at same timing.
        ioext.output(4, false);
        ioext.output(5, false);
      });
    };
  }

  public getIO() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const ioext = obniz.wired("SNx4HC595", {
        gnd: 0,
        vcc: 1,
        ser: 2,
        rclk: 3,
        srclk: 4,
      });

      const io1 = ioext.getIO(1);
      io1.output(true);

      const io2 = ioext.getIO(2);
      const led = obniz.wired("LED", { anode: io2 });
      led.blink();

      const io3 = ioext.getIO(3);
      const io4 = ioext.getIO(4);
      const seg = obniz.wired("7SegmentLED", {
        a: io3,
        b: io4,
        c: 5,
        d: 6,
        e: 7,
        f: 8,
        g: 9,
        common: 10,
      });
      seg.print(0);
    };
  }

  public setEnable() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const ioext = obniz.wired("SNx4HC595", {
        gnd: 0,
        vcc: 1,
        ser: 2,
        rclk: 3,
        srclk: 4,
        oe: 5,
        enabled: false,
      });
      ioext.output(0, true); // no affect
      ioext.setEnable(true); // 0 is true
    };
  }
}
