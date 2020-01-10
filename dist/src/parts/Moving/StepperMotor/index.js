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
Object.defineProperty(exports, "__esModule", { value: true });
class StepperMotor {
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
    static info() {
        return {
            name: "StepperMotor",
        };
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Nb3ZpbmcvU3RlcHBlck1vdG9yL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsTUFBTSxZQUFZO0lBc0JoQjtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTNDLElBQUksQ0FBQyxpQkFBaUIsR0FBRztZQUN2QixHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdELEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDN0QsS0FBSyxFQUFFO2dCQUNMLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNaLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNaLENBQUMsQ0FBQyxFQUFFLENBQUMs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TSxDQUFDLENBQUM7UUFDOUIsQ0FBQztLQUFBO0lBRVksVUFBVSxDQUFDLFdBQWdCOztZQUN0QyxNQUFNLE1BQU0sR0FDVixDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7WUFDcEUsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLENBQUM7S0FBQTtJQUVNLG9CQUFvQjtRQUN6QixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEQsQ0FBQztDQUNGO0FBRUQsa0JBQWUsWUFBWSxDQUFDIiwiZmlsZSI6InNyYy9wYXJ0cy9Nb3ZpbmcvU3RlcHBlck1vdG9yL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU3RlcHBlck1vdG9yIHtcblxuICBwdWJsaWMgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IFwiU3RlcHBlck1vdG9yXCIsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBrZXlzOiBhbnk7XG4gIHB1YmxpYyByZXF1aXJlZEtleXM6IGFueTtcbiAgcHVibGljIF9zdGVwSW5zdHJ1Y3Rpb25zOiBhbnk7XG4gIHB1YmxpYyB0eXBlOiBhbnk7XG4gIHB1YmxpYyBjdXJyZW50U3RlcDogYW55O1xuICBwdWJsaWMgX3N0ZXBUeXBlOiBhbnk7XG4gIHB1YmxpYyBmcmVxdWVuY3k6IGFueTtcbiAgcHVibGljIHJvdGF0aW9uU3RlcENvdW50OiBhbnk7XG4gIHB1YmxpYyBtaWxsaU1ldGVyU3RlcENvdW50OiBhbnk7XG4gIHB1YmxpYyBvYm5pejogYW55O1xuICBwdWJsaWMgcGFyYW1zOiBhbnk7XG4gIHB1YmxpYyBjb21tb246IGFueTtcbiAgcHVibGljIGlvczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFtcImFcIiwgXCJiXCIsIFwiYWFcIiwgXCJiYlwiLCBcImNvbW1vblwiXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFtcImFcIiwgXCJiXCIsIFwiYWFcIiwgXCJiYlwiXTtcblxuICAgIHRoaXMuX3N0ZXBJbnN0cnVjdGlvbnMgPSB7XG4gICAgICBcIjFcIjogW1swLCAxLCAxLCAxXSwgWzEsIDAsIDEsIDFdLCBbMSwgMSwgMCwgMV0sIFsxLCAxLCAxLCAwXV0sXG4gICAgICBcIjJcIjogW1swLCAwLCAxLCAxXSwgWzEsIDAsIDAsIDFdLCBbMSwgMSwgMCwgMF0sIFswLCAxLCAxLCAwXV0sXG4gICAgICBcIjEtMlwiOiBbXG4gICAgICAgIFswLCAxLCAxLCAxXSxcbiAgICAgICAgWzAsIDAsIDEsIDFdLFxuICAgICAgICBbMSwgMCwgMSwgMV0sXG4gICAgICAgIFsxLCAwLCAwLCAxXSxcbiAgICAgICAgWzEsIDEsIDAsIDFdLFxuICAgICAgICBbMSwgMSwgMCwgMF0sXG4gICAgICAgIFsxLCAxLCAxLCAwXSxcbiAgICAgICAgWzAsIDEsIDEsIDBdLFxuICAgICAgXSxcbiAgICB9O1xuXG4gICAgdGhpcy50eXBlID0gdW5kZWZpbmVkOyAvLyBjb21tb24gZXhpc3Q/ID0+IHVuaXBvbGFyIDogYmlwb2xhclxuICAgIHRoaXMuY3VycmVudFN0ZXAgPSAwO1xuICAgIHRoaXMuX3N0ZXBUeXBlID0gXCIyXCI7XG4gICAgdGhpcy5mcmVxdWVuY3kgPSAxMDA7XG5cbiAgICB0aGlzLnJvdGF0aW9uU3RlcENvdW50ID0gMTAwO1xuICAgIHRoaXMubWlsbGlNZXRlclN0ZXBDb3VudCA9IDE7XG4gIH1cblxuICBwdWJsaWMgd2lyZWQob2JuaXo6IGFueSkge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcblxuICAgIGlmIChvYm5pei5pc1ZhbGlkSU8odGhpcy5wYXJhbXMuY29tbW9uKSkge1xuICAgICAgdGhpcy5jb21tb24gPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5jb21tb24pO1xuICAgICAgdGhpcy5jb21tb24ub3V0cHV0KHRydWUpO1xuICAgICAgdGhpcy50eXBlID0gXCJ1bmlwb2xhclwiO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnR5cGUgPSBcImJpcG9sYXJcIjtcbiAgICB9XG4gICAgdGhpcy5pb3MgPSBbXTtcbiAgICB0aGlzLmlvcy5wdXNoKG9ibml6LmdldElPKHRoaXMucGFyYW1zLmEpKTtcbiAgICB0aGlzLmlvcy5wdXNoKG9ibml6LmdldElPKHRoaXMucGFyYW1zLmIpKTtcbiAgICB0aGlzLmlvcy5wdXNoKG9ibml6LmdldElPKHRoaXMucGFyYW1zLmFhKSk7XG4gICAgdGhpcy5pb3MucHVzaChvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5iYikpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHN0ZXBXYWl0KHN0ZXBfY291bnQ6IGFueSkge1xuICAgIGlmICh0eXBlb2Ygc3RlcF9jb3VudCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwibXVzdCBwcm92aWRlIG51bWJlclwiKTtcbiAgICB9XG4gICAgc3RlcF9jb3VudCA9IE1hdGgucm91bmQoc3RlcF9jb3VudCk7XG4gICAgaWYgKHN0ZXBfY291bnQgPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc3RlcF9jb3VudF9hYnM6IGFueSA9IE1hdGguYWJzKHN0ZXBfY291bnQpO1xuICAgIGNvbnN0IGluc3RydWN0aW9uczogYW55ID0gdGhpcy5fZ2V0U3RlcEluc3RydWN0aW9ucygpO1xuICAgIGNvbnN0IGluc3RydWN0aW9uX2xlbmd0aDogYW55ID0gaW5zdHJ1Y3Rpb25zLmxlbmd0aDtcbiAgICBjb25zdCBhcnJheTogYW55ID0gW107XG4gICAgLy8gc2V0IGluc3RydWN0aW9uc1xuICAgIGxldCBjdXJyZW50UGhhc2U6IGFueSA9IHRoaXMuY3VycmVudFN0ZXAgJSBpbnN0cnVjdGlvbl9sZW5ndGg7XG4gICAgaWYgKGN1cnJlbnRQaGFzZSA8IDApIHtcbiAgICAgIGN1cnJlbnRQaGFzZSA9IGluc3RydWN0aW9uX2xlbmd0aCAtIGN1cnJlbnRQaGFzZSAqIC0xO1xuICAgIH1cbiAgICBpZiAoc3RlcF9jb3VudCA+IDApIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5zdHJ1Y3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICgrK2N1cnJlbnRQaGFzZSA+PSBpbnN0cnVjdGlvbl9sZW5ndGgpIHtcbiAgICAgICAgICBjdXJyZW50UGhhc2UgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGFycmF5LnB1c2goaW5zdHJ1Y3Rpb25zW2N1cnJlbnRQaGFzZV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluc3RydWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoLS1jdXJyZW50UGhhc2UgPCAwKSB7XG4gICAgICAgICAgY3VycmVudFBoYXNlID0gaW5zdHJ1Y3Rpb25fbGVuZ3RoIC0gMTtcbiAgICAgICAgfVxuICAgICAgICBhcnJheS5wdXNoKGluc3RydWN0aW9uc1tjdXJyZW50UGhhc2VdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gcHJlcGFyZSBhbmltYXRpb25cbiAgICBsZXQgbXNlYzogYW55ID0gMTAwMCAvIHRoaXMuZnJlcXVlbmN5O1xuICAgIG1zZWMgPSBwYXJzZUludChtc2VjKTtcbiAgICBpZiAobXNlYyA8IDEpIHtcbiAgICAgIG1zZWMgPSAxO1xuICAgIH1cbiAgICBjb25zdCBzdGF0ZTogYW55ID0gKGluZGV4OiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGluc3RydWN0aW9uOiBhbnkgPSBhcnJheVtpbmRleF07XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaW9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuaW9zW2ldLm91dHB1dChpbnN0cnVjdGlvbltpXSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBzdGF0ZXM6IGFueSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5zdHJ1Y3Rpb25fbGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0YXRlcy5wdXNoKHtcbiAgICAgICAgZHVyYXRpb246IG1zZWMsXG4gICAgICAgIHN0YXRlLFxuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIGV4ZWN1dGUgYW5kIHdhaXRcbiAgICBhd2FpdCB0aGlzLm9ibml6LmlvLnJlcGVhdFdhaXQoc3RhdGVzLCBzdGVwX2NvdW50X2Ficyk7XG4gICAgdGhpcy5jdXJyZW50U3RlcCArPSBzdGVwX2NvdW50O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHN0ZXBUb1dhaXQoZGVzdGluYXRpb246IGFueSkge1xuICAgIGNvbnN0IG11c3Rtb3ZlOiBhbnkgPSBkZXN0aW5hdGlvbiAtIHRoaXMuY3VycmVudFN0ZXA7XG4gICAgYXdhaXQgdGhpcy5zdGVwV2FpdChtdXN0bW92ZSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgaG9sZFdhaXQoKSB7XG4gICAgY29uc3QgaW5zdHJ1Y3Rpb25zOiBhbnkgPSB0aGlzLl9nZXRTdGVwSW5zdHJ1Y3Rpb25zKCk7XG4gICAgY29uc3QgaW5zdHJ1Y3Rpb25fbGVuZ3RoOiBhbnkgPSBpbnN0cnVjdGlvbnMubGVuZ3RoO1xuICAgIC8vIHNldCBpbnN0cnVjdGlvbnNcbiAgICBsZXQgY3VycmVudFBoYXNlOiBhbnkgPSB0aGlzLmN1cnJlbnRTdGVwICUgaW5zdHJ1Y3Rpb25fbGVuZ3RoO1xuICAgIGlmIChjdXJyZW50UGhhc2UgPCAwKSB7XG4gICAgICBjdXJyZW50UGhhc2UgPSBpbnN0cnVjdGlvbl9sZW5ndGggLSBjdXJyZW50UGhhc2UgKiAtMTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaW9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmlvc1tpXS5vdXRwdXQoaW5zdHJ1Y3Rpb25zW2N1cnJlbnRQaGFzZV1baV0pO1xuICAgIH1cbiAgICBhd2FpdCB0aGlzLm9ibml6LnBpbmdXYWl0KCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZnJlZVdhaXQoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlvcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5pb3NbaV0ub3V0cHV0KHRydWUpO1xuICAgIH1cbiAgICBhd2FpdCB0aGlzLm9ibml6LnBpbmdXYWl0KCk7XG4gIH1cblxuICBwdWJsaWMgc3RlcFR5cGUoc3RlcFR5cGU6IGFueSkge1xuICAgIGNvbnN0IG5ld1R5cGU6IGFueSA9IHRoaXMuX3N0ZXBJbnN0cnVjdGlvbnNbc3RlcFR5cGVdO1xuICAgIGlmICghbmV3VHlwZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biBzdGVwIHR5cGUgXCIgKyBzdGVwVHlwZSk7XG4gICAgfVxuICAgIHRoaXMuX3N0ZXBUeXBlID0gc3RlcFR5cGU7XG4gIH1cblxuICBwdWJsaWMgc3BlZWQoc3RlcF9wZXJfc2VjOiBhbnkpIHtcbiAgICB0aGlzLmZyZXF1ZW5jeSA9IHN0ZXBfcGVyX3NlYztcbiAgfVxuXG4gIHB1YmxpYyBjdXJyZW50Um90YXRpb24oKSB7XG4gICAgLy8gPT4gZGVncmVlXG4gICAgcmV0dXJuICh0aGlzLmN1cnJlbnRTdGVwIC8gdGhpcy5yb3RhdGlvblN0ZXBDb3VudCkgKiAzNjA7XG4gIH1cblxuICBwdWJsaWMgY3VycmVudEFuZ2xlKCkge1xuICAgIC8vID0+IGRlZ3JlZVxuICAgIGxldCBhbmdsZTogYW55ID0gKE1hdGguZmxvb3IodGhpcy5jdXJyZW50Um90YXRpb24oKSAqIDEwMDApICUgMzYwMDAwKSAvIDEwMDA7XG4gICAgaWYgKGFuZ2xlIDwgMCkge1xuICAgICAgYW5nbGUgPSAzNjAgLSBhbmdsZTtcbiAgICB9XG4gICAgcmV0dXJuIGFuZ2xlO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHJvdGF0ZVdhaXQocm90YXRpb246IGFueSkge1xuICAgIHJvdGF0aW9uIC89IDM2MDtcbiAgICBjb25zdCBuZWVkZWQ6IGFueSA9IHJvdGF0aW9uICogdGhpcy5yb3RhdGlvblN0ZXBDb3VudDtcbiAgICBhd2FpdCB0aGlzLnN0ZXBXYWl0KG5lZWRlZCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcm90YXRlVG9XYWl0KGFuZ2xlOiBhbnkpIHtcbiAgICBsZXQgbmVlZGVkOiBhbnkgPSBhbmdsZSAtIHRoaXMuY3VycmVudEFuZ2xlKCk7XG4gICAgaWYgKE1hdGguYWJzKG5lZWRlZCkgPiAxODApIHtcbiAgICAgIG5lZWRlZCA9IG5lZWRlZCA+IDAgPyBuZWVkZWQgLSAzNjAgOiAzNjAgKyBuZWVkZWQ7XG4gICAgfVxuICAgIG5lZWRlZCA9IChuZWVkZWQgLyAzNjApICogdGhpcy5yb3RhdGlvblN0ZXBDb3VudDtcbiAgICBhd2FpdCB0aGlzLnN0ZXBXYWl0KG5lZWRlZCk7XG4gIH1cblxuICBwdWJsaWMgY3VycmVudERpc3RhbmNlKCkge1xuICAgIC8vID0+IG1tXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFN0ZXAgLyB0aGlzLm1pbGxpTWV0ZXJTdGVwQ291bnQ7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgbW92ZVdhaXQoZGlzdGFuY2U6IGFueSkge1xuICAgIGNvbnN0IG5lZWRlZDogYW55ID0gZGlzdGFuY2UgKiB0aGlzLm1pbGxpTWV0ZXJTdGVwQ291bnQ7XG4gICAgYXdhaXQgdGhpcy5zdGVwV2FpdChuZWVkZWQpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIG1vdmVUb1dhaXQoZGVzdGluYXRpb246IGFueSkge1xuICAgIGNvbnN0IG5lZWRlZDogYW55ID1cbiAgICAgIChkZXN0aW5hdGlvbiAtIHRoaXMuY3VycmVudERpc3RhbmNlKCkpICogdGhpcy5taWxsaU1ldGVyU3RlcENvdW50O1xuICAgIGF3YWl0IHRoaXMuc3RlcFdhaXQobmVlZGVkKTtcbiAgfVxuXG4gIHB1YmxpYyBfZ2V0U3RlcEluc3RydWN0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RlcEluc3RydWN0aW9uc1t0aGlzLl9zdGVwVHlwZV07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3RlcHBlck1vdG9yO1xuIl19
