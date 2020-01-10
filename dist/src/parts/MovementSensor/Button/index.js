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
class Button {
    constructor() {
        this.keys = ["signal", "gnd", "pull"];
        this.requiredKeys = ["signal"];
        this.onChangeForStateWait = () => {
        };
    }
    static info() {
        return {
            name: "Button",
        };
    }
    wired(obniz) {
        this.io_signal = obniz.getIO(this.params.signal);
        if (obniz.isValidIO(this.params.gnd)) {
            this.io_supply = obniz.getIO(this.params.gnd);
            this.io_supply.output(false);
        }
        // start input
        if (this.params.pull === "3v") {
            this.io_signal.pull("3v");
        }
        else if (this.params.pull === "0v") {
            this.io_signal.pull("0v");
        }
        else {
            this.io_signal.pull("5v");
        }
        const self = this;
        this.io_signal.input((value) => {
            self.isPressed = value === false;
            if (self.onchange) {
                self.onchange(value === false);
            }
            self.onChangeForStateWait(value === false);
        });
    }
    isPressedWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.io_signal.inputWait();
            return ret === false;
        });
    }
    stateWait(isPressed) {
        return new Promise((resolve, reject) => {
            this.onChangeForStateWait = (pressed) => {
                if (isPressed === pressed) {
                    this.onChangeForStateWait = () => {
                    };
                    resolve();
                }
            };
        });
    }
}
exports.default = Button;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Nb3ZlbWVudFNlbnNvci9CdXR0b24vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLE1BQU07SUFpQlY7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFL0IsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEdBQUcsRUFBRTtRQUNqQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBckJNLE1BQU0sQ0FBQyxJQUFJO1FBQ2hCLE9BQU87WUFDTCxJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7SUFDSixDQUFDO0lBbUJNLEtBQUssQ0FBQyxLQUFVO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWpELElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlCO1FBRUQsY0FBYztRQUNkLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzNCO2FBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDM0I7YUFBTTtZQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzNCO1FBRUQsTUFBTSxJQUFJLEdBQVEsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUU7WUFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLEtBQUssS0FBSyxDQUFDO1lBQ2pDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUM7YUFDaEM7WUFDRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVZLGFBQWE7O1lBQ3hCLE1BQU0sR0FBRyxHQUFRLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNsRCxPQUFPLEdBQUcsS0FBSyxLQUFLLENBQUM7UUFDdkIsQ0FBQztLQUFBO0lBRU0sU0FBUyxDQUFDLFNBQWM7UUFDN0IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNyQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxPQUFZLEVBQUUsRUFBRTtnQkFDM0MsSUFBSSxTQUFTLEtBQUssT0FBTyxFQUFFO29CQUN6QixJQUFJLENBQUMsb0JBQW9CLEdBQUcsR0FBRyxFQUFFO29CQUNqQyxDQUFDLENBQUM7b0JBQ0YsT0FBTyxFQUFFLENBQUM7aUJBQ1g7WUFDSCxDQUFDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELGtCQUFlLE1BQU0sQ0FBQyIsImZpbGUiOiJzcmMvcGFydHMvTW92ZW1lbnRTZW5zb3IvQnV0dG9uL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQnV0dG9uIHtcblxuICBwdWJsaWMgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IFwiQnV0dG9uXCIsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBrZXlzOiBhbnk7XG4gIHB1YmxpYyByZXF1aXJlZEtleXM6IGFueTtcbiAgcHVibGljIG9uQ2hhbmdlRm9yU3RhdGVXYWl0OiBhbnk7XG4gIHB1YmxpYyBpb19zaWduYWw6IGFueTtcbiAgcHVibGljIHBhcmFtczogYW55O1xuICBwdWJsaWMgaW9fc3VwcGx5OiBhbnk7XG4gIHB1YmxpYyBpc1ByZXNzZWQ6IGFueTtcbiAgcHVibGljIG9uY2hhbmdlOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5rZXlzID0gW1wic2lnbmFsXCIsIFwiZ25kXCIsIFwicHVsbFwiXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFtcInNpZ25hbFwiXTtcblxuICAgIHRoaXMub25DaGFuZ2VGb3JTdGF0ZVdhaXQgPSAoKSA9PiB7XG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyB3aXJlZChvYm5pejogYW55KSB7XG4gICAgdGhpcy5pb19zaWduYWwgPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5zaWduYWwpO1xuXG4gICAgaWYgKG9ibml6LmlzVmFsaWRJTyh0aGlzLnBhcmFtcy5nbmQpKSB7XG4gICAgICB0aGlzLmlvX3N1cHBseSA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLmduZCk7XG4gICAgICB0aGlzLmlvX3N1cHBseS5vdXRwdXQoZmFsc2UpO1xuICAgIH1cblxuICAgIC8vIHN0YXJ0IGlucHV0XG4gICAgaWYgKHRoaXMucGFyYW1zLnB1bGwgPT09IFwiM3ZcIikge1xuICAgICAgdGhpcy5pb19zaWduYWwucHVsbChcIjN2XCIpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wYXJhbXMucHVsbCA9PT0gXCIwdlwiKSB7XG4gICAgICB0aGlzLmlvX3NpZ25hbC5wdWxsKFwiMHZcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW9fc2lnbmFsLnB1bGwoXCI1dlwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxmOiBhbnkgPSB0aGlzO1xuICAgIHRoaXMuaW9fc2lnbmFsLmlucHV0KCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICBzZWxmLmlzUHJlc3NlZCA9IHZhbHVlID09PSBmYWxzZTtcbiAgICAgIGlmIChzZWxmLm9uY2hhbmdlKSB7XG4gICAgICAgIHNlbGYub25jaGFuZ2UodmFsdWUgPT09IGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIHNlbGYub25DaGFuZ2VGb3JTdGF0ZVdhaXQodmFsdWUgPT09IGZhbHNlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBpc1ByZXNzZWRXYWl0KCkge1xuICAgIGNvbnN0IHJldDogYW55ID0gYXdhaXQgdGhpcy5pb19zaWduYWwuaW5wdXRXYWl0KCk7XG4gICAgcmV0dXJuIHJldCA9PT0gZmFsc2U7XG4gIH1cblxuICBwdWJsaWMgc3RhdGVXYWl0KGlzUHJlc3NlZDogYW55KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMub25DaGFuZ2VGb3JTdGF0ZVdhaXQgPSAocHJlc3NlZDogYW55KSA9PiB7XG4gICAgICAgIGlmIChpc1ByZXNzZWQgPT09IHByZXNzZWQpIHtcbiAgICAgICAgICB0aGlzLm9uQ2hhbmdlRm9yU3RhdGVXYWl0ID0gKCkgPT4ge1xuICAgICAgICAgIH07XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1dHRvbjtcbiJdfQ==
