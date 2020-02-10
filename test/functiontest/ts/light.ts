
/* tslint:disable:class-name max-classes-per-file */
import Obniz  = require( "../../../dist/src/obniz/index");

const OBNIZ_ID = "1234-5678";

/**
 * https://obniz.io/ja/sdk/parts/LED/README.md
 */
class LEDTest {
  public led() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("LED", { anode: 0 }); // io0 is anode. cathode is connected obniz GND other way.
      led.on();
    };
  }
  public on() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("LED", { anode: 0, cathode: 1 });
      led.on();
    };
  }
  public off() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("LED", { anode: 0, cathode: 1 });
      led.output(true);
    };
  }
  public blink() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("LED", { anode: 0, cathode: 1 });
      led.blink(); // 100msec
    };
  }
  public endBlick() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("LED", { anode: 0, cathode: 1 });
      led.endBlink();
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/FullcolorLED/README.md
 */
class FullColorLED {
  public rgb() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("FullColorLED", { r: 3, g: 0, b: 1, common: 2, commonType: "anode_common" });
      led.rgb(0xff, 255, 0);
    };
  }

  public hsv() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("FullColorLED", { r: 3, g: 0, b: 1, common: 2, commonType: "anode_common" });
      led.hsv(180, 0.5, 1);
    };
  }

  public gradation() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("FullColorLED", { r: 3, g: 0, b: 1, common: 2, commonType: "anode_common" });
      led.gradation(1000); // 1000 msec loop
    };
  }

  public async stopgradation() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("FullColorLED", { r: 3, g: 0, b: 1, common: 2, commonType: "anode_common" });
      led.gradation(1000); // 1000 msec loop

      await obniz.wait(5000);
      led.stopgradation();
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/WS2811/README.md
 */
class WS2811Test {
  public rgb() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("WS2811", { gnd: 0, vcc: 1, din: 2 });
      led.rgb(0xff, 255, 0); // Yellow
    };
  }

  public hsv() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("WS2811", { gnd: 0, vcc: 1, din: 2 });
      led.hsv(180, 0.5, 1);
    };
  }

  public rgbs() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("WS2811", { gnd: 0, vcc: 1, din: 2 });
      led.rgbs([
        [0xff, 0x00, 0x00], // red
        [0x00, 0x00, 0xff], // blue
      ]);
    };
  }

  public hsvs() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("WS2811", { gnd: 0, vcc: 1, din: 2 });
      led.hsvs([[180, 0.5, 1], [0, 1, 1]]);
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/WS2812/README.md
 */
class WS2812Test {
  public rgb() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("WS2812", { gnd: 0, vcc: 1, din: 2 });
      led.rgb(0xff, 255, 0); // Yellow
    };
  }

  public hsv() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("WS2812", { gnd: 0, vcc: 1, din: 2 });
      led.hsv(180, 0.5, 1);
    };
  }

  public rgbs() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("WS2812", { gnd: 0, vcc: 1, din: 2 });
      led.rgbs([
        [0xff, 0x00, 0x00], // red
        [0x00, 0x00, 0xff], // blue
      ]);
    };
  }

  public hsvs() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("WS2812", { gnd: 0, vcc: 1, din: 2 });
      led.hsvs([[180, 0.5, 1], [0, 1, 1]]);
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/WS2812B/README.md
 */
class WS2812BTest {
  public rgb() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("WS2812B", { gnd: 0, vcc: 1, din: 2 });
      led.rgb(0xff, 255, 0); // Yellow
    };
  }

  public hsv() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("WS2812B", { gnd: 0, vcc: 1, din: 2 });
      led.hsv(180, 0.5, 1);
    };
  }

  public rgbs() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("WS2812B", { gnd: 0, vcc: 1, din: 2 });
      led.rgbs([
        [0xff, 0x00, 0x00], // red
        [0x00, 0x00, 0xff], // blue
      ]);
    };
  }

  public hsvs() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const led = obniz.wired("WS2812B", { gnd: 0, vcc: 1, din: 2 });
      led.hsvs([[180, 0.5, 1], [0, 1, 1]]);
    };
  }
}
