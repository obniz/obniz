"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class StepperMotor {
    constructor() {
        this.keys = ['a', 'b', 'aa', 'bb', 'common'];
        this.requiredKeys = ['a', 'b', 'aa', 'bb'];
        this._stepInstructions = {
            '1': [[0, 1, 1, 1], [1, 0, 1, 1], [1, 1, 0, 1], [1, 1, 1, 0]],
            '2': [[0, 0, 1, 1], [1, 0, 0, 1], [1, 1, 0, 0], [0, 1, 1, 0]],
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
        this.type = undefined; // common exist? => unipolar : bipolar
        this.currentStep = 0;
        this._stepType = '2';
        this.frequency = 100;
        this.rotationStepCount = 100;
        this.milliMeterStepCount = 1;
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
    stepWait(step_count) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof step_count !== 'number') {
                throw new Error('must provide number');
            }
            step_count = Math.round(step_count);
            if (step_count == 0) {
                return;
            }
            const step_count_abs = Math.abs(step_count);
            const instructions = this._getStepInstructions();
            const instruction_length = instructions.length;
            let array = [];
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
            const state = index => {
                const instruction = array[index];
                for (let i = 0; i < this.ios.length; i++) {
                    this.ios[i].output(instruction[i]);
                }
            };
            let states = [];
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
        let angle = (parseInt(this.currentRotation() * 1000) % 360000) / 1000;
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
if (typeof module === 'object') {
    module.exports = StepperMotor;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Nb3ZpbmcvU3RlcHBlck1vdG9yL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxNQUFNLFlBQVk7SUFDaEI7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsaUJBQWlCLEdBQUc7WUFDdkIsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3RCxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdELEtBQUssRUFBRTtnQkFDTCxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDWixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDWixDQUFDLENBQUMsRUFBRSxDQUFDLEVB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RUssVUFBVSxDQUFDLFdBQVc7O1lBQzFCLE1BQU0sTUFBTSxHQUNWLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztZQUNwRSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUIsQ0FBQztLQUFBO0lBRUQsb0JBQW9CO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBQ0Y7QUFFRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtJQUM5QixNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQztDQUMvQiIsImZpbGUiOiJwYXJ0cy9Nb3ZpbmcvU3RlcHBlck1vdG9yL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU3RlcHBlck1vdG9yIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5rZXlzID0gWydhJywgJ2InLCAnYWEnLCAnYmInLCAnY29tbW9uJ107XG4gICAgdGhpcy5yZXF1aXJlZEtleXMgPSBbJ2EnLCAnYicsICdhYScsICdiYiddO1xuXG4gICAgdGhpcy5fc3RlcEluc3RydWN0aW9ucyA9IHtcbiAgICAgICcxJzogW1swLCAxLCAxLCAxXSwgWzEsIDAsIDEsIDFdLCBbMSwgMSwgMCwgMV0sIFsxLCAxLCAxLCAwXV0sXG4gICAgICAnMic6IFtbMCwgMCwgMSwgMV0sIFsxLCAwLCAwLCAxXSwgWzEsIDEsIDAsIDBdLCBbMCwgMSwgMSwgMF1dLFxuICAgICAgJzEtMic6IFtcbiAgICAgICAgWzAsIDEsIDEsIDFdLFxuICAgICAgICBbMCwgMCwgMSwgMV0sXG4gICAgICAgIFsxLCAwLCAxLCAxXSxcbiAgICAgICAgWzEsIDAsIDAsIDFdLFxuICAgICAgICBbMSwgMSwgMCwgMV0sXG4gICAgICAgIFsxLCAxLCAwLCAwXSxcbiAgICAgICAgWzEsIDEsIDEsIDBdLFxuICAgICAgICBbMCwgMSwgMSwgMF0sXG4gICAgICBdLFxuICAgIH07XG5cbiAgICB0aGlzLnR5cGUgPSB1bmRlZmluZWQ7IC8vIGNvbW1vbiBleGlzdD8gPT4gdW5pcG9sYXIgOiBiaXBvbGFyXG4gICAgdGhpcy5jdXJyZW50U3RlcCA9IDA7XG4gICAgdGhpcy5fc3RlcFR5cGUgPSAnMic7XG4gICAgdGhpcy5mcmVxdWVuY3kgPSAxMDA7XG5cbiAgICB0aGlzLnJvdGF0aW9uU3RlcENvdW50ID0gMTAwO1xuICAgIHRoaXMubWlsbGlNZXRlclN0ZXBDb3VudCA9IDE7XG4gIH1cblxuICBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1N0ZXBwZXJNb3RvcicsXG4gICAgfTtcbiAgfVxuXG4gIHdpcmVkKG9ibml6KSB7XG4gICAgdGhpcy5vYm5peiA9IG9ibml6O1xuXG4gICAgaWYgKG9ibml6LmlzVmFsaWRJTyh0aGlzLnBhcmFtcy5jb21tb24pKSB7XG4gICAgICB0aGlzLmNvbW1vbiA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLmNvbW1vbik7XG4gICAgICB0aGlzLmNvbW1vbi5vdXRwdXQodHJ1ZSk7XG4gICAgICB0aGlzLnR5cGUgPSAndW5pcG9sYXInO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnR5cGUgPSAnYmlwb2xhcic7XG4gICAgfVxuICAgIHRoaXMuaW9zID0gW107XG4gICAgdGhpcy5pb3MucHVzaChvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5hKSk7XG4gICAgdGhpcy5pb3MucHVzaChvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5iKSk7XG4gICAgdGhpcy5pb3MucHVzaChvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5hYSkpO1xuICAgIHRoaXMuaW9zLnB1c2gob2JuaXouZ2V0SU8odGhpcy5wYXJhbXMuYmIpKTtcbiAgfVxuXG4gIGFzeW5jIHN0ZXBXYWl0KHN0ZXBfY291bnQpIHtcbiAgICBpZiAodHlwZW9mIHN0ZXBfY291bnQgIT09ICdudW1iZXInKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ211c3QgcHJvdmlkZSBudW1iZXInKTtcbiAgICB9XG4gICAgc3RlcF9jb3VudCA9IE1hdGgucm91bmQoc3RlcF9jb3VudCk7XG4gICAgaWYgKHN0ZXBfY291bnQgPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzdGVwX2NvdW50X2FicyA9IE1hdGguYWJzKHN0ZXBfY291bnQpO1xuICAgIGNvbnN0IGluc3RydWN0aW9ucyA9IHRoaXMuX2dldFN0ZXBJbnN0cnVjdGlvbnMoKTtcbiAgICBjb25zdCBpbnN0cnVjdGlvbl9sZW5ndGggPSBpbnN0cnVjdGlvbnMubGVuZ3RoO1xuICAgIGxldCBhcnJheSA9IFtdO1xuICAgIC8vIHNldCBpbnN0cnVjdGlvbnNcbiAgICBsZXQgY3VycmVudFBoYXNlID0gdGhpcy5jdXJyZW50U3RlcCAlIGluc3RydWN0aW9uX2xlbmd0aDtcbiAgICBpZiAoY3VycmVudFBoYXNlIDwgMCkge1xuICAgICAgY3VycmVudFBoYXNlID0gaW5zdHJ1Y3Rpb25fbGVuZ3RoIC0gY3VycmVudFBoYXNlICogLTE7XG4gICAgfVxuICAgIGlmIChzdGVwX2NvdW50ID4gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnN0cnVjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKCsrY3VycmVudFBoYXNlID49IGluc3RydWN0aW9uX2xlbmd0aCkge1xuICAgICAgICAgIGN1cnJlbnRQaGFzZSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgYXJyYXkucHVzaChpbnN0cnVjdGlvbnNbY3VycmVudFBoYXNlXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5zdHJ1Y3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICgtLWN1cnJlbnRQaGFzZSA8IDApIHtcbiAgICAgICAgICBjdXJyZW50UGhhc2UgPSBpbnN0cnVjdGlvbl9sZW5ndGggLSAxO1xuICAgICAgICB9XG4gICAgICAgIGFycmF5LnB1c2goaW5zdHJ1Y3Rpb25zW2N1cnJlbnRQaGFzZV0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBwcmVwYXJlIGFuaW1hdGlvblxuICAgIGxldCBtc2VjID0gMTAwMCAvIHRoaXMuZnJlcXVlbmN5O1xuICAgIG1zZWMgPSBwYXJzZUludChtc2VjKTtcbiAgICBpZiAobXNlYyA8IDEpIHtcbiAgICAgIG1zZWMgPSAxO1xuICAgIH1cbiAgICBjb25zdCBzdGF0ZSA9IGluZGV4ID0+IHtcbiAgICAgIGNvbnN0IGluc3RydWN0aW9uID0gYXJyYXlbaW5kZXhdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmlvc1tpXS5vdXRwdXQoaW5zdHJ1Y3Rpb25baV0pO1xuICAgICAgfVxuICAgIH07XG4gICAgbGV0IHN0YXRlcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5zdHJ1Y3Rpb25fbGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0YXRlcy5wdXNoKHtcbiAgICAgICAgZHVyYXRpb246IG1zZWMsXG4gICAgICAgIHN0YXRlLFxuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIGV4ZWN1dGUgYW5kIHdhaXRcbiAgICBhd2FpdCB0aGlzLm9ibml6LmlvLnJlcGVhdFdhaXQoc3RhdGVzLCBzdGVwX2NvdW50X2Ficyk7XG4gICAgdGhpcy5jdXJyZW50U3RlcCArPSBzdGVwX2NvdW50O1xuICB9XG5cbiAgYXN5bmMgc3RlcFRvV2FpdChkZXN0aW5hdGlvbikge1xuICAgIGNvbnN0IG11c3Rtb3ZlID0gZGVzdGluYXRpb24gLSB0aGlzLmN1cnJlbnRTdGVwO1xuICAgIGF3YWl0IHRoaXMuc3RlcFdhaXQobXVzdG1vdmUpO1xuICB9XG5cbiAgYXN5bmMgaG9sZFdhaXQoKSB7XG4gICAgY29uc3QgaW5zdHJ1Y3Rpb25zID0gdGhpcy5fZ2V0U3RlcEluc3RydWN0aW9ucygpO1xuICAgIGNvbnN0IGluc3RydWN0aW9uX2xlbmd0aCA9IGluc3RydWN0aW9ucy5sZW5ndGg7XG4gICAgLy8gc2V0IGluc3RydWN0aW9uc1xuICAgIGxldCBjdXJyZW50UGhhc2UgPSB0aGlzLmN1cnJlbnRTdGVwICUgaW5zdHJ1Y3Rpb25fbGVuZ3RoO1xuICAgIGlmIChjdXJyZW50UGhhc2UgPCAwKSB7XG4gICAgICBjdXJyZW50UGhhc2UgPSBpbnN0cnVjdGlvbl9sZW5ndGggLSBjdXJyZW50UGhhc2UgKiAtMTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaW9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmlvc1tpXS5vdXRwdXQoaW5zdHJ1Y3Rpb25zW2N1cnJlbnRQaGFzZV1baV0pO1xuICAgIH1cbiAgICBhd2FpdCB0aGlzLm9ibml6LnBpbmdXYWl0KCk7XG4gIH1cblxuICBhc3luYyBmcmVlV2FpdCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaW9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmlvc1tpXS5vdXRwdXQodHJ1ZSk7XG4gICAgfVxuICAgIGF3YWl0IHRoaXMub2JuaXoucGluZ1dhaXQoKTtcbiAgfVxuXG4gIHN0ZXBUeXBlKHN0ZXBUeXBlKSB7XG4gICAgY29uc3QgbmV3VHlwZSA9IHRoaXMuX3N0ZXBJbnN0cnVjdGlvbnNbc3RlcFR5cGVdO1xuICAgIGlmICghbmV3VHlwZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmtub3duIHN0ZXAgdHlwZSAnICsgc3RlcFR5cGUpO1xuICAgIH1cbiAgICB0aGlzLl9zdGVwVHlwZSA9IHN0ZXBUeXBlO1xuICB9XG5cbiAgc3BlZWQoc3RlcF9wZXJfc2VjKSB7XG4gICAgdGhpcy5mcmVxdWVuY3kgPSBzdGVwX3Blcl9zZWM7XG4gIH1cblxuICBjdXJyZW50Um90YXRpb24oKSB7XG4gICAgLy8gPT4gZGVncmVlXG4gICAgcmV0dXJuICh0aGlzLmN1cnJlbnRTdGVwIC8gdGhpcy5yb3RhdGlvblN0ZXBDb3VudCkgKiAzNjA7XG4gIH1cblxuICBjdXJyZW50QW5nbGUoKSB7XG4gICAgLy8gPT4gZGVncmVlXG4gICAgbGV0IGFuZ2xlID0gKHBhcnNlSW50KHRoaXMuY3VycmVudFJvdGF0aW9uKCkgKiAxMDAwKSAlIDM2MDAwMCkgLyAxMDAwO1xuICAgIGlmIChhbmdsZSA8IDApIHtcbiAgICAgIGFuZ2xlID0gMzYwIC0gYW5nbGU7XG4gICAgfVxuICAgIHJldHVybiBhbmdsZTtcbiAgfVxuXG4gIGFzeW5jIHJvdGF0ZVdhaXQocm90YXRpb24pIHtcbiAgICByb3RhdGlvbiAvPSAzNjA7XG4gICAgY29uc3QgbmVlZGVkID0gcm90YXRpb24gKiB0aGlzLnJvdGF0aW9uU3RlcENvdW50O1xuICAgIGF3YWl0IHRoaXMuc3RlcFdhaXQobmVlZGVkKTtcbiAgfVxuXG4gIGFzeW5jIHJvdGF0ZVRvV2FpdChhbmdsZSkge1xuICAgIGxldCBuZWVkZWQgPSBhbmdsZSAtIHRoaXMuY3VycmVudEFuZ2xlKCk7XG4gICAgaWYgKE1hdGguYWJzKG5lZWRlZCkgPiAxODApIHtcbiAgICAgIG5lZWRlZCA9IG5lZWRlZCA+IDAgPyBuZWVkZWQgLSAzNjAgOiAzNjAgKyBuZWVkZWQ7XG4gICAgfVxuICAgIG5lZWRlZCA9IChuZWVkZWQgLyAzNjApICogdGhpcy5yb3RhdGlvblN0ZXBDb3VudDtcbiAgICBhd2FpdCB0aGlzLnN0ZXBXYWl0KG5lZWRlZCk7XG4gIH1cblxuICBjdXJyZW50RGlzdGFuY2UoKSB7XG4gICAgLy8gPT4gbW1cbiAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RlcCAvIHRoaXMubWlsbGlNZXRlclN0ZXBDb3VudDtcbiAgfVxuXG4gIGFzeW5jIG1vdmVXYWl0KGRpc3RhbmNlKSB7XG4gICAgY29uc3QgbmVlZGVkID0gZGlzdGFuY2UgKiB0aGlzLm1pbGxpTWV0ZXJTdGVwQ291bnQ7XG4gICAgYXdhaXQgdGhpcy5zdGVwV2FpdChuZWVkZWQpO1xuICB9XG5cbiAgYXN5bmMgbW92ZVRvV2FpdChkZXN0aW5hdGlvbikge1xuICAgIGNvbnN0IG5lZWRlZCA9XG4gICAgICAoZGVzdGluYXRpb24gLSB0aGlzLmN1cnJlbnREaXN0YW5jZSgpKSAqIHRoaXMubWlsbGlNZXRlclN0ZXBDb3VudDtcbiAgICBhd2FpdCB0aGlzLnN0ZXBXYWl0KG5lZWRlZCk7XG4gIH1cblxuICBfZ2V0U3RlcEluc3RydWN0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RlcEluc3RydWN0aW9uc1t0aGlzLl9zdGVwVHlwZV07XG4gIH1cbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gU3RlcHBlck1vdG9yO1xufVxuIl19
