import * as Obniz from '../../obniz';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/Button/README.md
 */
class ButtonTest {
  onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var button = obniz.wired('Button', { signal: 0, gnd: 1 });
      button.onchange = function(pressed) {
        console.log('pressed:' + pressed);
      };
    };
  }

  isPressedWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var button = obniz.wired('Button', { signal: 0, gnd: 1 });
      var pressed = await button.isPressedWait();
      console.log('Pressed = ' + pressed);
    };
  }

  stateWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var button = obniz.wired('Button', { signal: 0, gnd: 1 });
      await button.stateWait(true);
      console.log('button pushed!');
      await button.stateWait(false);
      console.log('button released');
    };
  }
}

class FlickHatTest {}

/**
 * https://obniz.io/sdk/parts/HC-SR505/README.md
 */
class HC_SR505Test {
  onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var sensor = obniz.wired('HC-SR505', { vcc: 0, signal: 1, gnd: 2 });
      sensor.onchange = function(val) {
        console.log(val ? 'Moving Something!' : 'Nothing moving');
      };
    };
  }

  getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var sensor = obniz.wired('HC-SR505', { vcc: 0, signal: 1, gnd: 2 });
      var val = await sensor.getWait();
      console.log(val ? 'Moving Something!' : 'Nothing moving');
    };
  }
}

/**
 * https://obniz.io/sdk/parts/JoyStick/README.md
 */
class JoyStickTest {
  onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var joystick = obniz.wired('JoyStick', { gnd: 4, sw: 0, y: 1, x: 2, vcc: 3 });
      joystick.onchangex = function(val) {
        console.log(val);
      };

      joystick.onchangey = function(val) {
        console.log(val);
      };
    };
  }

  onchangesw() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var joystick = obniz.wired('JoyStick', { gnd: 4, sw: 0, y: 1, x: 2, vcc: 3 });
      joystick.onchangesw = function(pressed) {
        console.log(pressed);
      };
    };
  }

  isPressedWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var joystick = obniz.wired('JoyStick', { gnd: 4, sw: 0, y: 1, x: 2, vcc: 3 });
      var isPressed = await joystick.isPressedWait();
      if (isPressed) {
        console.log('PRESSED');
      }
    };
  }

  getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var joystick = obniz.wired('JoyStick', { gnd: 4, sw: 0, y: 1, x: 2, vcc: 3 });
      var x = await joystick.getXWait();
      var y = await joystick.getYWait();

      console.log('x:' + x + ' y:' + y);
    };
  }
}

/**
 * https://obniz.io/sdk/parts/KXR94-2050/README.md
 */
class KXR94_2050Test {
  onChange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var sensor = obniz.wired('KXR94-2050', { vcc: 0, gnd: 1, x: 2, y: 3, z: 4, enable: 5, self_test: 6 });

      sensor.onChange = function(values) {
        console.log('x:' + values.x);
        console.log('y:' + values.y);
        console.log('z:' + values.z);
      };

      sensor.onChangeX = function(value) {
        console.log('x:' + value);
      };

      sensor.onChangeY = function(value) {
        console.log('y:' + value);
      };

      sensor.onChangeZ = function(value) {
        console.log('z:' + value);
      };
    };
  }

  get() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var sensor = obniz.wired('KXR94-2050', { vcc: 0, gnd: 1, x: 2, y: 3, z: 4, enable: 5, self_test: 6 });

      while (true) {
        let values = sensor.get();
        console.log('x:' + values.x);
        console.log('y:' + values.y);
        console.log('z:' + values.z);
        await obniz.wait(30);
      }
    };
  }

  getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var sensor = obniz.wired('KXR94-2050', { vcc: 0, gnd: 1, x: 2, y: 3, z: 4, enable: 5, self_test: 6 });

      while (true) {
        let values = await sensor.getWait();
        console.log('x:' + values.x);
        console.log('y:' + values.y);
        console.log('z:' + values.z);
      }
    };
  }
}

class KXSC7_2050Test {}

/**
 * https://obniz.io/sdk/parts/PaPIRsVZ/README.md
 */
class PaPIRsVZTest {
  onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var sensor = obniz.wired('PaPIRsVZ', { gnd: 0, signal: 1, vcc: 2 });
      sensor.onchange = function(val) {
        console.log(val ? 'Moving Something!' : 'Nothing moving');
      };
    };
  }
}

/**
 * https://obniz.io/sdk/parts/Potentiometer/README.md
 */
class PotentiometerTest {
  onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var meter = obniz.wired('Potentiometer', { pin0: 0, pin1: 1, pin2: 2 });
      meter.onchange = function(position) {
        console.log('position: ' + position);
      };
    };
  }
}
