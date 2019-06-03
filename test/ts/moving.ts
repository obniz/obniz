import * as Obniz from '../../obniz';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/DCMotor/README.md
 */
class DCMotorTest {
  forward() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('DCMotor', { forward: 0, back: 1 });
      motor.forward();
    };
  }

  reverse() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('DCMotor', { forward: 0, back: 1 });
      motor.reverse();
    };
  }

  stop() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('DCMotor', { forward: 0, back: 1 });

      motor.forward();
      setTimeout(function() {
        motor.stop();
      }, 1000);
    };
  }

  move() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('DCMotor', { forward: 0, back: 1 });

      motor.move(true); // = motor.forward();
    };
  }

  power() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('DCMotor', { forward: 0, back: 1 });

      motor.power(3);
      motor.move(true);
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/PCA9685/README.md
 */
class PCA9685Test {
  getPWM() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var driver = obniz.wired('PCA9685', { gnd: 0, oe: 1, scl: 2, sda: 3, vcc: 4 });
      var pwm0 = driver.getPWM(0);
      pwm0.freq(1000);
      pwm0.duty(50);

      var servo0 = obniz.wired('ServoMotor', { pwm: driver.getPWM(0) });
      var servo1 = obniz.wired('ServoMotor', { pwm: driver.getPWM(1) });
      var servo2 = obniz.wired('ServoMotor', { pwm: driver.getPWM(2) });
      servo0.angle(90);
      servo1.angle(95);
      servo2.angle(100);
    };
  }

  freq() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var driver = obniz.wired('PCA9685', { gnd: 0, oe: 1, scl: 2, sda: 3, vcc: 4 });
      driver.freq(1000);
    };
  }

  duty() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var driver = obniz.wired('PCA9685', { gnd: 0, oe: 1, scl: 2, sda: 3, vcc: 4 });
      driver.freq(1000);
      driver.duty(0, 50);
      driver.duty(1, 60);
    };
  }

  pulse() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var driver = obniz.wired('PCA9685', { gnd: 0, oe: 1, scl: 2, sda: 3, vcc: 4 });
      driver.freq(100); // 100hz = 10msec interval
      driver.pulse(0, 5);
      driver.pulse(1, 6);
    };
  }

  setEnable() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var driver = obniz.wired('PCA9685', { gnd: 0, oe: 1, scl: 2, sda: 3, vcc: 4, enabled: false });
      driver.setEnable(true);
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/ServoMotor/README.md
 */
class ServoMotorTest {
  wired() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var pwm = obniz.getFreePwm();
      var servo = obniz.wired('ServoMotor', { pwm: pwm });
    };
  }

  angle() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var servo = obniz.wired('ServoMotor', { signal: 0, vcc: 1, gnd: 2 });

      servo.angle(90.0); // half position
    };
  }

  range() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var servo = obniz.wired('ServoMotor', { signal: 0, vcc: 1, gnd: 2 });
      servo.range = {
        min: 0.8,
        max: 2.4
      };
      servo.angle(90.0); // half position
    };
  }

  on() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var servo = obniz.wired('ServoMotor', { signal: 0, vcc: 1, gnd: 2 });

      servo.angle(90.0); // half position
      servo.off();
      servo.on();
    };
  }

  off() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var servo = obniz.wired('ServoMotor', { signal: 0, vcc: 1, gnd: 2 });

      servo.angle(90.0); // half position
      servo.off();
      servo.on();
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/Solenoid/README.md
 */
class SolenoidTest {
  on() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var solenoid = obniz.wired('Solenoid', { gnd: 0, signal: 1 });
      solenoid.on();
    };
  }

  off() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var solenoid = obniz.wired('Solenoid', { gnd: 0, signal: 1 });
      solenoid.on();
      await obniz.wait(1000);
      solenoid.off();
    };
  }

  click() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var solenoid = obniz.wired('Solenoid', { gnd: 0, signal: 1 });
      solenoid.click();
    };
  }

  doubleClick() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var solenoid = obniz.wired('Solenoid', { gnd: 0, signal: 1 });
      solenoid.doubleClick();
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/StepperMotor/README.md
 */
class StepperMotorTest {
  stepType() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      motor.stepType('1');
      await motor.stepWait(100);
      await motor.stepWait(200);
      console.log(motor.currentStep); // => 300
    };
  }

  speed() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      motor.speed(1000);
      await motor.stepWait(100);
    };
  }

  stepWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      await motor.stepWait(100);
      await motor.stepWait(-100);
      // now returned to start position.
    };
  }

  stepToWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      await motor.stepWait(100);
      await motor.stepToWait(-150); // it move -250 steps
      console.log(motor.currentStep); // => -150
    };
  }

  holdWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      await motor.holdWait();
    };
  }

  freeWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      await motor.stepWait(100);
      await motor.freeWait();
    };
  }

  currentStep() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      await motor.stepWait(100);
      await motor.stepToWait(-150); // it move -250 steps
      console.log(motor.currentStep); // => -150
    };
  }

  rotateWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      motor.rotationStepCount = 100;
      await motor.rotateWait(360 * 2);
      console.log(motor.currentRotation()); // => 720
      console.log(motor.currentAngle()); // => 0
    };
  }

  rotateToWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      motor.rotationStepCount = 100;
      await motor.rotateToWait(90);
    };
  }

  rotationStepCount() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      motor.rotationStepCount = 100;
      await motor.rotateToWait(90);
    };
  }

  moveWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      motor.milliMeterStepCount = 10;
      await motor.moveWait(100);
      await motor.moveWait(-10);
      console.log(motor.currentDistance()); // => 90
    };
  }

  moveToWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      motor.milliMeterStepCount = 10;
      await motor.moveWait(100);
      await motor.moveToWait(-10);
      console.log(motor.currentDistance()); // => -10
    };
  }

  milliMeterStepCount() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      motor.milliMeterStepCount = 10;
      await motor.moveWait(100);
      await motor.moveToWait(-10);
      console.log(motor.currentDistance()); // => -10
    };
  }
}
