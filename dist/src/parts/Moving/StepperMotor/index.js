"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class StepperMotor {
    static info() {
        return {
            name: "StepperMotor",
        };
    }
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
    wired(obniz) {
        this.obniz = obniz;
        if (obniz.isValidIO(this.params.common)) {
            this.common = obniz.getIO(this.params.common);
            this.common.output(true);
            this.type = "unipolar";
        }
        else {
            this.type = "bipolar";
        }
        this.ios = [];
        this.ios.push(obniz.getIO(this.params.a));
        this.ios.push(obniz.getIO(this.params.b));
        this.ios.push(obniz.getIO(this.params.aa));
        this.ios.push(obniz.getIO(this.params.bb));
    }
    stepWait(step_count) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const array = [];
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
            }
            else {
                for (let i = 0; i < instructions.length; i++) {
                    if (--currentPhase < 0) {
                        currentPhase = instruction_length - 1;
                    }
                    array.push(instructions[currentPhase]);
                }
            }
            // prepare animation
            let msec = 1000 / this.frequency;
            msec = parseInt(msec);
            if (msec < 1) {
                msec = 1;
            }
            const state = (index) => {
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
            yield this.obniz.io.repeatWait(states, step_count_abs);
            this.currentStep += step_count;
        });
    }
    stepToWait(destination) {
        return __awaiter(this, void 0, void 0, function* () {
            const mustmove = destination - this.currentStep;
            yield this.stepWait(mustmove);
        });
    }
    holdWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const instructions = this._getStepInstructions();
            const instruction_length = instructions.length;
            // set instructions
            let currentPhase = this.currentStep % instruction_length;
            if (currentPhase < 0) {
                currentPhase = instruction_length - currentPhase * -1;
            }
            for (let i = 0; i < this.ios.length; i++) {
                this.ios[i].output(instructions[currentPhase][i]);
            }
            yield this.obniz.pingWait();
        });
    }
    freeWait() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.ios.length; i++) {
                this.ios[i].output(true);
            }
            yield this.obniz.pingWait();
        });
    }
    stepType(stepType) {
        const newType = this._stepInstructions[stepType];
        if (!newType) {
            throw new Error("unknown step type " + stepType);
        }
        this._stepType = stepType;
    }
    speed(step_per_sec) {
        this.frequency = step_per_sec;
    }
    currentRotation() {
        // => degree
        return (this.currentStep / this.rotationStepCount) * 360;
    }
    currentAngle() {
        // => degree
        let angle = (Math.floor(this.currentRotation() * 1000) % 360000) / 1000;
        if (angle < 0) {
            angle = 360 - angle;
        }
        return angle;
    }
    rotateWait(rotation) {
        return __awaiter(this, void 0, void 0, function* () {
            rotation /= 360;
            const needed = rotation * this.rotationStepCount;
            yield this.stepWait(needed);
        });
    }
    rotateToWait(angle) {
        return __awaiter(this, void 0, void 0, function* () {
            let needed = angle - this.currentAngle();
            if (Math.abs(needed) > 180) {
                needed = needed > 0 ? needed - 360 : 360 + needed;
            }
            needed = (needed / 360) * this.rotationStepCount;
            yield this.stepWait(needed);
        });
    }
    currentDistance() {
        // => mm
        return this.currentStep / this.milliMeterStepCount;
    }
    moveWait(distance) {
        return __awaiter(this, void 0, void 0, function* () {
            const needed = distance * this.milliMeterStepCount;
            yield this.stepWait(needed);
        });
    }
    moveToWait(destination) {
        return __awaiter(this, void 0, void 0, function* () {
            const needed = (destination - this.currentDistance()) * this.milliMeterStepCount;
            yield this.stepWait(needed);
        });
    }
    _getStepInstructions() {
        return this._stepInstructions[this._stepType];
    }
}
exports.default = StepperMotor;
//# sourceMappingURL=index.js.map