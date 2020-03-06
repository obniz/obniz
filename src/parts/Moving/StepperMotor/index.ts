/**
 * @packageDocumentation
 * @module Parts.StepperMotor
 */

import Obniz from "../../../obniz";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface StepperMotorOptions {
  a: number;
  b: number;
  aa: number;
  bb: number;
  common?: number;
}

export type StepType = "1" | "2" | "1-2";

export default class StepperMotor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "StepperMotor",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public type?: string;
  public currentStep = 0;
  public frequency = 100;
  public rotationStepCount = 100;
  public milliMeterStepCount = 1;
  public common: any;
  public ios: PeripheralIO[] = [];

  protected obniz!: Obniz;

  private _stepInstructions = {
    "1": [
      [0, 1, 1, 1],
      [1, 0, 1, 1],
      [1, 1, 0, 1],
      [1, 1, 1, 0],
    ],
    "2": [
      [0, 0, 1, 1],
      [1, 0, 0, 1],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
    ],
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
  private _stepType: StepType = "2";

  constructor() {
    this.keys = ["a", "b", "aa", "bb", "common"];
    this.requiredKeys = ["a", "b", "aa", "bb"];
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

  public async stepWait(step_count: number) {
    if (typeof step_count !== "number") {
      throw new Error("must provide number");
    }
    step_count = Math.round(step_count);
    if (step_count === 0) {
      return;
    }
    const step_count_abs = Math.abs(step_count);
    const instructions = this._getStepInstructions();
    const instruction_length = instructions.length;
    const array: any = [];
    // set instructions
    let currentPhase = this.currentStep % instruction_length;
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
    let msec = 1000 / this.frequency;
    msec = parseInt(msec as any);
    if (msec < 1) {
      msec = 1;
    }
    const state = (index: number) => {
      const instruction = array[index];
      for (let i = 0; i < this.ios.length; i++) {
        this.ios[i].output(instruction[i]);
      }
    };
    const states = [];
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

  public async stepToWait(destination: number) {
    const mustmove = destination - this.currentStep;
    await this.stepWait(mustmove);
  }

  public async holdWait() {
    const instructions = this._getStepInstructions();
    const instruction_length = instructions.length;
    // set instructions
    let currentPhase = this.currentStep % instruction_length;
    if (currentPhase < 0) {
      currentPhase = instruction_length - currentPhase * -1;
    }

    for (let i = 0; i < this.ios.length; i++) {
      this.ios[i].output(instructions[currentPhase][i] === 1);
    }
    await this.obniz.pingWait();
  }

  public async freeWait() {
    for (let i = 0; i < this.ios.length; i++) {
      this.ios[i].output(true);
    }
    await this.obniz.pingWait();
  }

  public stepType(stepType: StepType) {
    const newType = this._stepInstructions[stepType];
    if (!newType) {
      throw new Error("unknown step type " + stepType);
    }
    this._stepType = stepType;
  }

  public speed(step_per_sec: number) {
    this.frequency = step_per_sec;
  }

  public currentRotation() {
    // => degree
    return (this.currentStep / this.rotationStepCount) * 360;
  }

  public currentAngle() {
    // => degree
    let angle = (Math.floor(this.currentRotation() * 1000) % 360000) / 1000;
    if (angle < 0) {
      angle = 360 - angle;
    }
    return angle;
  }

  public async rotateWait(rotation: number) {
    rotation /= 360;
    const needed = rotation * this.rotationStepCount;
    await this.stepWait(needed);
  }

  public async rotateToWait(angle: number) {
    let needed = angle - this.currentAngle();
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

  public async moveWait(distance: number) {
    const needed = distance * this.milliMeterStepCount;
    await this.stepWait(needed);
  }

  public async moveToWait(destination: number) {
    const needed = (destination - this.currentDistance()) * this.milliMeterStepCount;
    await this.stepWait(needed);
  }

  public _getStepInstructions() {
    return this._stepInstructions[this._stepType];
  }
}
