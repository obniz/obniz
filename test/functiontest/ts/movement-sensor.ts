
/* tslint:disable:class-name max-classes-per-file */
import Obniz  = require( "../../../dist/src/obniz/index");

const OBNIZ_ID = "1234-5678";

/**
 * https://obniz.io/ja/sdk/parts/Button/README.md
 */
class ButtonTest {
  public onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const button = obniz.wired("Button", { signal: 0, gnd: 1 });
      button.onchange = (pressed) => {
        console.log("pressed:" + pressed);
      };
    };
  }

  public isPressedWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const button = obniz.wired("Button", { signal: 0, gnd: 1 });
      const pressed = await button.isPressedWait();
      console.log("Pressed = " + pressed);
    };
  }

  public stateWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const button = obniz.wired("Button", { signal: 0, gnd: 1 });
      await button.stateWait(true);
      console.log("button pushed!");
      await button.stateWait(false);
      console.log("button released");
    };
  }
}

class FlickHatTest {}

/**
 * https://obniz.io/sdk/parts/HC-SR505/README.md
 */
class HC_SR505Test {
  public onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const sensor = obniz.wired("HC-SR505", { vcc: 0, signal: 1, gnd: 2 });
      sensor.onchange = (val) => {
        console.log(val ? "Moving Something!" : "Nothing moving");
      };
    };
  }

  public getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const sensor = obniz.wired("HC-SR505", { vcc: 0, signal: 1, gnd: 2 });
      const val = await sensor.getWait();
      console.log(val ? "Moving Something!" : "Nothing moving");
    };
  }
}

/**
 * https://obniz.io/sdk/parts/JoyStick/README.md
 */
class JoyStickTest {
  public onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const joystick = obniz.wired("JoyStick", { gnd: 4, sw: 0, y: 1, x: 2, vcc: 3 });
      joystick.onchangex = (val) => {
        console.log(val);
      };

      joystick.onchangey = (val) => {
        console.log(val);
      };
    };
  }

  public onchangesw() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const joystick = obniz.wired("JoyStick", { gnd: 4, sw: 0, y: 1, x: 2, vcc: 3 });
      joystick.onchangesw = (pressed) => {
        console.log(pressed);
      };
    };
  }

  public isPressedWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const joystick = obniz.wired("JoyStick", { gnd: 4, sw: 0, y: 1, x: 2, vcc: 3 });
      const isPressed = await joystick.isPressedWait();
      if (isPressed) {
        console.log("PRESSED");
      }
    };
  }

  public getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const joystick = obniz.wired("JoyStick", { gnd: 4, sw: 0, y: 1, x: 2, vcc: 3 });
      const x = await joystick.getXWait();
      const y = await joystick.getYWait();

      console.log("x:" + x + " y:" + y);
    };
  }
}

/**
 * https://obniz.io/sdk/parts/KXR94-2050/README.md
 */
class KXR94_2050Test {
  public onChange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const sensor = obniz.wired("KXR94-2050", { vcc: 0, gnd: 1, x: 2, y: 3, z: 4, enable: 5, self_test: 6 });

      sensor.onChange = (values) => {
        console.log("x:" + values.x);
        console.log("y:" + values.y);
        console.log("z:" + values.z);
      };

      sensor.onChangeX = (value) => {
        console.log("x:" + value);
      };

      sensor.onChangeY = (value) => {
        console.log("y:" + value);
      };

      sensor.onChangeZ = (value) => {
        console.log("z:" + value);
      };
    };
  }

  public get() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const sensor = obniz.wired("KXR94-2050", { vcc: 0, gnd: 1, x: 2, y: 3, z: 4, enable: 5, self_test: 6 });

      while (true) {
        const values = sensor.get();
        console.log("x:" + values.x);
        console.log("y:" + values.y);
        console.log("z:" + values.z);
        await obniz.wait(30);
      }
    };
  }

  public getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const sensor = obniz.wired("KXR94-2050", { vcc: 0, gnd: 1, x: 2, y: 3, z: 4, enable: 5, self_test: 6 });

      while (true) {
        const values = await sensor.getWait();
        console.log("x:" + values.x);
        console.log("y:" + values.y);
        console.log("z:" + values.z);
      }
    };
  }
}

class KXSC7_2050Test {}

/**
 * https://obniz.io/sdk/parts/PaPIRsVZ/README.md
 */
class PaPIRsVZTest {
  public onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const sensor = obniz.wired("PaPIRsVZ", { gnd: 0, signal: 1, vcc: 2 });
      sensor.onchange = (val) => {
        console.log(val ? "Moving Something!" : "Nothing moving");
      };
    };
  }
}

/**
 * https://obniz.io/sdk/parts/Potentiometer/README.md
 */
class PotentiometerTest {
  public onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const meter = obniz.wired("Potentiometer", { pin0: 0, pin1: 1, pin2: 2 });
      meter.onchange = (position) => {
        console.log("position: " + position);
      };
    };
  }
}
