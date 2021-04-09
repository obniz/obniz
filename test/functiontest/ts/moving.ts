/* tslint:disable:class-name max-classes-per-file */
import Obniz from '../../../dist/src/obniz/index';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/DCMotor/README.md
 */
class DCMotorTest {
  public forward() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('DCMotor', { forward: 0, back: 1 });
      motor.forward();
    };
  }

  public reverse() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('DCMotor', { forward: 0, back: 1 });
      motor.reverse();
    };
  }

  public stop() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('DCMotor', { forward: 0, back: 1 });

      motor.forward();
      setTimeout(() => {
        motor.stop();
      }, 1000);
    };
  }

  public move() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('DCMotor', { forward: 0, back: 1 });

      motor.move(true); // = motor.forward();
    };
  }

  public power() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('DCMotor', { forward: 0, back: 1 });

      motor.power(3);
      motor.move(true);
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/PCA9685/README.md
 */
class PCA9685Test {
  public getPWM() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const driver = obniz.wired('PCA9685', {
        gnd: 0,
        oe: 1,
        scl: 2,
        sda: 3,
        vcc: 4,
      });
      const pwm0 = driver.getPWM(0);
      pwm0.freq(1000);
      pwm0.duty(50);

      const servo0 = obniz.wired('ServoMotor', { pwm: driver.getPWM(0) });
      const servo1 = obniz.wired('ServoMotor', { pwm: driver.getPWM(1) });
      const servo2 = obniz.wired('ServoMotor', { pwm: driver.getPWM(2) });
      servo0.angle(90);
      servo1.angle(95);
      servo2.angle(100);
    };
  }

  public freq() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const driver = obniz.wired('PCA9685', {
        gnd: 0,
        oe: 1,
        scl: 2,
        sda: 3,
        vcc: 4,
      });
      driver.freq(1000);
    };
  }

  public duty() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const driver = obniz.wired('PCA9685', {
        gnd: 0,
        oe: 1,
        scl: 2,
        sda: 3,
        vcc: 4,
      });
      driver.freq(1000);
      driver.duty(0, 50);
      driver.duty(1, 60);
    };
  }

  public pulse() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const driver = obniz.wired('PCA9685', {
        gnd: 0,
        oe: 1,
        scl: 2,
        sda: 3,
        vcc: 4,
      });
      driver.freq(100); // 100hz = 10msec interval
      driver.pulse(0, 5);
      driver.pulse(1, 6);
    };
  }

  public setEnable() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const driver = obniz.wired('PCA9685', {
        gnd: 0,
        oe: 1,
        scl: 2,
        sda: 3,
        vcc: 4,
        enabled: false,
      });
      driver.setEnable(true);
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/ServoMotor/README.md
 */
class ServoMotorTest {
  public wired() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const pwm = obniz.getFreePwm();
      const servo = obniz.wired('ServoMotor', { pwm });
    };
  }

  public angle() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const servo = obniz.wired('ServoMotor', { signal: 0, vcc: 1, gnd: 2 });

      servo.angle(90.0); // half position
    };
  }

  public range() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const servo = obniz.wired('ServoMotor', { signal: 0, vcc: 1, gnd: 2 });
      servo.range = {
        min: 0.8,
        max: 2.4,
      };
      servo.angle(90.0); // half position
    };
  }

  public on() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const servo = obniz.wired('ServoMotor', { signal: 0, vcc: 1, gnd: 2 });

      servo.angle(90.0); // half position
      servo.off();
      servo.on();
    };
  }

  public off() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const servo = obniz.wired('ServoMotor', { signal: 0, vcc: 1, gnd: 2 });

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
  public on() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const solenoid = obniz.wired('Solenoid', { gnd: 0, signal: 1 });
      solenoid.on();
    };
  }

  public off() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const solenoid = obniz.wired('Solenoid', { gnd: 0, signal: 1 });
      solenoid.on();
      await obniz.wait(1000);
      solenoid.off();
    };
  }

  public click() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const solenoid = obniz.wired('Solenoid', { gnd: 0, signal: 1 });
      solenoid.click();
    };
  }

  public doubleClick() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const solenoid = obniz.wired('Solenoid', { gnd: 0, signal: 1 });
      solenoid.doubleClick();
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/StepperMotor/README.md
 */
class StepperMotorTest {
  public stepType() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      motor.stepType('1');
      await motor.stepWait(100);
      await motor.stepWait(200);
      console.log(motor.currentStep); // => 300
    };
  }

  public speed() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      motor.speed(1000);
      await motor.stepWait(100);
    };
  }

  public stepWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      await motor.stepWait(100);
      await motor.stepWait(-100);
      // now returned to start position.
    };
  }

  public stepToWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      await motor.stepWait(100);
      await motor.stepToWait(-150); // it move -250 steps
      console.log(motor.currentStep); // => -150
    };
  }

  public holdWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      await motor.holdWait();
    };
  }

  public freeWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      await motor.stepWait(100);
      await motor.freeWait();
    };
  }

  public currentStep() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      await motor.stepWait(100);
      await motor.stepToWait(-150); // it move -250 steps
      console.log(motor.currentStep); // => -150
    };
  }

  public rotateWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      motor.rotationStepCount = 100;
      await motor.rotateWait(360 * 2);
      console.log(motor.currentRotation()); // => 720
      console.log(motor.currentAngle()); // => 0
    };
  }

  public rotateToWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      motor.rotationStepCount = 100;
      await motor.rotateToWait(90);
    };
  }

  public rotationStepCount() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      motor.rotationStepCount = 100;
      await motor.rotateToWait(90);
    };
  }

  public moveWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      motor.milliMeterStepCount = 10;
      await motor.moveWait(100);
      await motor.moveWait(-10);
      console.log(motor.currentDistance()); // => 90
    };
  }

  public moveToWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      motor.milliMeterStepCount = 10;
      await motor.moveWait(100);
      await motor.moveToWait(-10);
      console.log(motor.currentDistance()); // => -10
    };
  }

  public milliMeterStepCount() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const motor = obniz.wired('StepperMotor', { a: 0, aa: 1, b: 2, bb: 3 });
      motor.milliMeterStepCount = 10;
      await motor.moveWait(100);
      await motor.moveToWait(-10);
      console.log(motor.currentDistance()); // => -10
    };
  }
}
