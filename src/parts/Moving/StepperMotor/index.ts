import Obniz from "../../../obniz";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface StepperMotorOptions { }
class StepperMotor implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "StepperMotor",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public _stepInstructions: any;
  public type: any;
  public currentStep: any;
  public _stepType: any;
  public frequency: any;
  public rotationStepCount: any;
  public milliMeterStepCount: any;
  public obniz!: Obniz;
  public params: any;
  public common: any;
  public ios: any;

  constructor() {
    this.keys = ["a", "b", "aa", "bb", "common"];
    this.requiredKeys = ["a", "b", "aa", "bb"];

    this._stepInstructions = {
      "1": [[0, 1, 1, 1], [1, 0, 1, 1], [1, 1, 0, 1], [1, 1, 1, 0]],
      "2": [[0, 0, 1, 1], [1, 0, 0, 1], [1, 1, 0, 0], [0, 1, 1, 0]],
      "1-2": [
        [0, 1, 1, 1],
        [0, 0, 1, 1],
        [1, 0, 1, 1],
        [1, 0, 0, 1],
        [1, 1, 0, 1],
        [1, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 1, 1, 0],
      ],
    };

    this.type = undefined; // common exist? => unipolar : bipolar
    this.currentStep = 0;
    this._stepType = "2";
    this.frequency = 100;

    this.rotationStepCount = 100;
    this.milliMeterStepCount = 1;
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    if (obniz.isValidIO(this.params.common)) {
      this.common = obniz.getIO(this.params.common);
      this.common.output(true);
      this.type = "unipolar";
    } else {
      this.type = "bipolar";
    }
    this.ios = [];
    this.ios.push(obniz.getIO(this.params.a));
    this.ios.push(obniz.getIO(this.params.b));
    this.ios.push(obniz.getIO(this.params.aa));
    this.ios.push(obniz.getIO(this.params.bb));
  }

  public async stepWait(step_count: any) {
    if (typeof step_count !== "number") {
      throw new Error("must provide number");
    }
    step_count = Math.round(step_count);
    if (step_count === 0) {
      return;
    }
    const step_count_abs: any = Math.abs(step_count);
    const instructions: any = this._getStepInstructions();
    const instruction_length: any = instructions.length;
    const array: any = [];
    // set instructions
    let currentPhase: any = this.currentStep % instruction_length;
    if (currentPhase < 0) {
      currentPhase = instruction_length - currentPhase * -1;
    }
    if (step_count > 0) {
      for (let i = 0; i < instructions.length; i++) {
        if (++currentPhase >= instruction_length) {
          currentPhase = 0;
        }
        array.push(instructions[currentPhase]);
      }
    } else {
      for (let i = 0; i < instructions.length; i++) {
        if (--currentPhase < 0) {
          currentPhase = instruction_length - 1;
        }
        array.push(instructions[currentPhase]);
      }
    }
    // prepare animation
    let msec: any = 1000 / this.frequency;
    msec = parseInt(msec);
    if (msec < 1) {
      msec = 1;
    }
    const state: any = (index: any) => {
      const instruction: any = array[index];
      for (let i = 0; i < this.ios.length; i++) {
        this.ios[i].output(instruction[i]);
      }
    };
    const states: any = [];
    for (let i = 0; i < instruction_length; i++) {
      states.push({
        duration: msec,
        state,
      });
    }
    // execute and wait
    await this.obniz.io!.repeatWait(states, step_count_abs);
    this.currentStep += step_count;
  }

  public async stepToWait(destination: any) {
    const mustmove: any = destination - this.currentStep;
    await this.stepWait(mustmove);
  }

  public async holdWait() {
    const instructions: any = this._getStepInstructions();
    const instruction_length: any = instructions.length;
    // set instructions
    let currentPhase: any = this.currentStep % instruction_length;
    if (currentPhase < 0) {
      currentPhase = instruction_length - currentPhase * -1;
    }

    for (let i = 0; i < this.ios.length; i++) {
      this.ios[i].output(instructions[currentPhase][i]);
    }
    await this.obniz.pingWait();
  }

  public async freeWait() {
    for (let i = 0; i < this.ios.length; i++) {
      this.ios[i].output(true);
    }
    await this.obniz.pingWait();
  }

  public stepType(stepType: any) {
    const newType: any = this._stepInstructions[stepType];
    if (!newType) {
      throw new Error("unknown step type " + stepType);
    }
    this._stepType = stepType;
  }

  public speed(step_per_sec: any) {
    this.frequency = step_per_sec;
  }

  public currentRotation() {
    // => degree
    return (this.currentStep / this.rotationStepCount) * 360;
  }

  public currentAngle() {
    // => degree
    let angle: any = (Math.floor(this.currentRotation() * 1000) % 360000) / 1000;
    if (angle < 0) {
      angle = 360 - angle;
    }
    return angle;
  }

  public async rotateWait(rotation: any) {
    rotation /= 360;
    const needed: any = rotation * this.rotationStepCount;
    await this.stepWait(needed);
  }

  public async rotateToWait(angle: any) {
    let needed: any = angle - this.currentAngle();
    if (Math.abs(needed) > 180) {
      needed = needed > 0 ? needed - 360 : 360 + needed;
    }
    needed = (needed / 360) * this.rotationStepCount;
    await this.stepWait(needed);
  }

  public currentDistance() {
    // => mm
    return this.currentStep / this.milliMeterStepCount;
  }

  public async moveWait(distance: any) {
    const needed: any = distance * this.milliMeterStepCount;
    await this.stepWait(needed);
  }

  public async moveToWait(destination: any) {
    const needed: any =
      (destination - this.currentDistance()) * this.milliMeterStepCount;
    await this.stepWait(needed);
  }

  public _getStepInstructions() {
    return this._stepInstructions[this._stepType];
  }
}

export default StepperMotor;
