"use strict";
/**
 * @packageDocumentation
 * @module Parts.StepperMotor
 */
Object.defineProperty(exports, "__esModule", { value: true });
class StepperMotor {
    constructor() {
        this.currentStep = 0;
        this.frequency = 100;
        this.rotationStepCount = 100;
        this.milliMeterStepCount = 1;
        this.ios = [];
        this._stepInstructions = {
            '1': [
                [0, 1, 1, 1],
                [1, 0, 1, 1],
                [1, 1, 0, 1],
                [1, 1, 1, 0],
            ],
            '2': [
                [0, 0, 1, 1],
                [1, 0, 0, 1],
                [1, 1, 0, 0],
                [0, 1, 1, 0],
            ],
            '1-2': [
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
        this._stepType = '2';
        this.keys = ['a', 'b', 'aa', 'bb', 'common'];
        this.requiredKeys = ['a', 'b', 'aa', 'bb'];
    }
    static info() {
        return {
            name: 'StepperMotor',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        if (obniz.isValidIO(this.params.common)) {
            this.common = obniz.getIO(this.params.common);
            this.common.output(true);
            this.type = 'unipolar';
        }
        else {
            this.type = 'bipolar';
        }
        this.ios = [];
        this.ios.push(obniz.getIO(this.params.a));
        this.ios.push(obniz.getIO(this.params.b));
        this.ios.push(obniz.getIO(this.params.aa));
        this.ios.push(obniz.getIO(this.params.bb));
    }
    async stepWait(step_count) {
        if (typeof step_count !== 'number') {
            throw new Error('must provide number');
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
        await this.obniz.io.repeatWait(states, step_count_abs);
        this.currentStep += step_count;
    }
    async stepToWait(destination) {
        const mustmove = destination - this.currentStep;
        await this.stepWait(mustmove);
    }
    async holdWait() {
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
    async freeWait() {
        for (let i = 0; i < this.ios.length; i++) {
            this.ios[i].output(true);
        }
        await this.obniz.pingWait();
    }
    stepType(stepType) {
        const newType = this._stepInstructions[stepType];
        if (!newType) {
            throw new Error('unknown step type ' + stepType);
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
    async rotateWait(rotation) {
        rotation /= 360;
        const needed = rotation * this.rotationStepCount;
        await this.stepWait(needed);
    }
    async rotateToWait(angle) {
        let needed = angle - this.currentAngle();
        if (Math.abs(needed) > 180) {
            needed = needed > 0 ? needed - 360 : 360 + needed;
        }
        needed = (needed / 360) * this.rotationStepCount;
        await this.stepWait(needed);
    }
    currentDistance() {
        // => mm
        return this.currentStep / this.milliMeterStepCount;
    }
    async moveWait(distance) {
        const needed = distance * this.milliMeterStepCount;
        await this.stepWait(needed);
    }
    async moveToWait(destination) {
        const needed = (destination - this.currentDistance()) * this.milliMeterStepCount;
        await this.stepWait(needed);
    }
    _getStepInstructions() {
        return this._stepInstructions[this._stepType];
    }
}
exports.default = StepperMotor;
