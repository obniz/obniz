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
class Button {
    constructor() {
        this.keys = ['signal', 'gnd', 'pull'];
        this.requiredKeys = ['signal'];
        this.onChangeForStateWait = function () { };
    }
    static info() {
        return {
            name: 'Button',
        };
    }
    wired(obniz) {
        this.io_signal = obniz.getIO(this.params.signal);
        if (obniz.isValidIO(this.params.gnd)) {
            this.io_supply = obniz.getIO(this.params.gnd);
            this.io_supply.output(false);
        }
        // start input
        if (this.params.pull === '3v') {
            this.io_signal.pull('3v');
        }
        else if (this.params.pull === '0v') {
            this.io_signal.pull('0v');
        }
        else {
            this.io_signal.pull('5v');
        }
        let self = this;
        this.io_signal.input(function (value) {
            self.isPressed = value === false;
            if (self.onchange) {
                self.onchange(value === false);
            }
            self.onChangeForStateWait(value === false);
        });
    }
    isPressedWait() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.io_signal.inputWait();
            return ret === false;
        });
    }
    stateWait(isPressed) {
        return new Promise((resolve, reject) => {
            this.onChangeForStateWait = pressed => {
                if (isPressed == pressed) {
                    this.onChangeForStateWait = function () { };
                    resolve();
                }
            };
        });
    }
}
if (typeof module === 'object') {
    module.exports = Button;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Nb3ZlbWVudFNlbnNvci9CdXR0b24vaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE1BQU0sTUFBTTtJQUNWO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRS9CLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxjQUFZLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPO1lBQ0wsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLO1FBQ1QsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFakQsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUI7UUFFRCxjQUFjO1FBQ2QsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDM0I7YUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtZQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMzQjthQUFNO1lBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDM0I7UUFFRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBUyxLQUFLO1lBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxLQUFLLEtBQUssQ0FBQztZQUNqQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDO2FBQ2hDO1lBQ0QsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFSyxhQUFhOztZQUNqQixJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDM0MsT0FBTyxHQUFHLEtBQUssS0FBSyxDQUFDO1FBQ3ZCLENBQUM7S0FBQTtJQUVELFNBQVMsQ0FBQyxTQUFTO1FBQ2pCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxFQUFFO2dCQUNwQyxJQUFJLFNBQVMsSUFBSSxPQUFPLEVBQUU7b0JBQ3hCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxjQUFZLENBQUMsQ0FBQztvQkFDMUMsT0FBTyxFQUFFLENBQUM7aUJBQ1g7WUFDSCxDQUFDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO0lBQzlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0NBQ3pCIiwiZmlsZSI6InBhcnRzL01vdmVtZW50U2Vuc29yL0J1dHRvbi9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEJ1dHRvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFsnc2lnbmFsJywgJ2duZCcsICdwdWxsJ107XG4gICAgdGhpcy5yZXF1aXJlZEtleXMgPSBbJ3NpZ25hbCddO1xuXG4gICAgdGhpcy5vbkNoYW5nZUZvclN0YXRlV2FpdCA9IGZ1bmN0aW9uKCkge307XG4gIH1cblxuICBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0J1dHRvbicsXG4gICAgfTtcbiAgfVxuXG4gIHdpcmVkKG9ibml6KSB7XG4gICAgdGhpcy5pb19zaWduYWwgPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5zaWduYWwpO1xuXG4gICAgaWYgKG9ibml6LmlzVmFsaWRJTyh0aGlzLnBhcmFtcy5nbmQpKSB7XG4gICAgICB0aGlzLmlvX3N1cHBseSA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLmduZCk7XG4gICAgICB0aGlzLmlvX3N1cHBseS5vdXRwdXQoZmFsc2UpO1xuICAgIH1cblxuICAgIC8vIHN0YXJ0IGlucHV0XG4gICAgaWYgKHRoaXMucGFyYW1zLnB1bGwgPT09ICczdicpIHtcbiAgICAgIHRoaXMuaW9fc2lnbmFsLnB1bGwoJzN2Jyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnBhcmFtcy5wdWxsID09PSAnMHYnKSB7XG4gICAgICB0aGlzLmlvX3NpZ25hbC5wdWxsKCcwdicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmlvX3NpZ25hbC5wdWxsKCc1dicpO1xuICAgIH1cblxuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICB0aGlzLmlvX3NpZ25hbC5pbnB1dChmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgc2VsZi5pc1ByZXNzZWQgPSB2YWx1ZSA9PT0gZmFsc2U7XG4gICAgICBpZiAoc2VsZi5vbmNoYW5nZSkge1xuICAgICAgICBzZWxmLm9uY2hhbmdlKHZhbHVlID09PSBmYWxzZSk7XG4gICAgICB9XG4gICAgICBzZWxmLm9uQ2hhbmdlRm9yU3RhdGVXYWl0KHZhbHVlID09PSBmYWxzZSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBpc1ByZXNzZWRXYWl0KCkge1xuICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmlvX3NpZ25hbC5pbnB1dFdhaXQoKTtcbiAgICByZXR1cm4gcmV0ID09PSBmYWxzZTtcbiAgfVxuXG4gIHN0YXRlV2FpdChpc1ByZXNzZWQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5vbkNoYW5nZUZvclN0YXRlV2FpdCA9IHByZXNzZWQgPT4ge1xuICAgICAgICBpZiAoaXNQcmVzc2VkID09IHByZXNzZWQpIHtcbiAgICAgICAgICB0aGlzLm9uQ2hhbmdlRm9yU3RhdGVXYWl0ID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gQnV0dG9uO1xufVxuIl19
