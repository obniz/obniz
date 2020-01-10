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
class Grove_Button {
    constructor() {
        this.keys = ["signal", "gnd", "vcc"];
        this.requiredKeys = ["signal"];
        this.onChangeForStateWait = () => {
        };
    }
    static info() {
        return {
            name: "Grove_Button",
        };
    }
    wired(obniz) {
        this.io_signal = obniz.getIO(this.params.signal);
        if (obniz.isValidIO(this.params.vcc)) {
            this.io_vcc = obniz.getIO(this.params.vcc);
            this.io_vcc.output(true);
        }
        if (obniz.isValidIO(this.params.gnd)) {
            this.io_supply = obniz.getIO(this.params.gnd);
            this.io_supply.output(false);
        }
        this.io_signal.pull("5v");
        const self = this;
        this.io_signal.input((value) => {
            self.isPressed = value;
            if (self.onchange) {
                self.onchange(value);
            }
            self.onChangeForStateWait(value);
        });
    }
    isPressedWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.io_signal.inputWait();
            return ret;
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
exports.default = Grove_Button;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Hcm92ZS9Hcm92ZV9CdXR0b24vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLFlBQVk7SUFrQmhCO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRS9CLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxHQUFHLEVBQUU7UUFDakMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQXRCTSxNQUFNLENBQUMsSUFBSTtRQUNoQixPQUFPO1lBQ0wsSUFBSSxFQUFFLGNBQWM7U0FDckIsQ0FBQztJQUNKLENBQUM7SUFvQk0sS0FBSyxDQUFDLEtBQVU7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFakQsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUI7UUFFRCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNwQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM5QjtRQUVELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTFCLE1BQU0sSUFBSSxHQUFRLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQVUsRUFBRSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN0QjtZQUNELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFWSxhQUFhOztZQUN4QixNQUFNLEdBQUcsR0FBUSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDbEQsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFTSxTQUFTLENBQUMsU0FBYztRQUM3QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxDQUFDLE9BQVksRUFBRSxFQUFFO2dCQUMzQyxJQUFJLFNBQVMsS0FBSyxPQUFPLEVBQUU7b0JBQ3pCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxHQUFHLEVBQUU7b0JBQ2pDLENBQUMsQ0FBQztvQkFDRixPQUFPLEVBQUUsQ0FBQztpQkFDWDtZQUNILENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsa0JBQWUsWUFBWSxDQUFDIiwiZmlsZSI6InNyYy9wYXJ0cy9Hcm92ZS9Hcm92ZV9CdXR0b24vaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBHcm92ZV9CdXR0b24ge1xuXG4gIHB1YmxpYyBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJHcm92ZV9CdXR0b25cIixcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGtleXM6IGFueTtcbiAgcHVibGljIHJlcXVpcmVkS2V5czogYW55O1xuICBwdWJsaWMgb25DaGFuZ2VGb3JTdGF0ZVdhaXQ6IGFueTtcbiAgcHVibGljIGlvX3NpZ25hbDogYW55O1xuICBwdWJsaWMgcGFyYW1zOiBhbnk7XG4gIHB1YmxpYyBpb192Y2M6IGFueTtcbiAgcHVibGljIGlvX3N1cHBseTogYW55O1xuICBwdWJsaWMgaXNQcmVzc2VkOiBhbnk7XG4gIHB1YmxpYyBvbmNoYW5nZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFtcInNpZ25hbFwiLCBcImduZFwiLCBcInZjY1wiXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFtcInNpZ25hbFwiXTtcblxuICAgIHRoaXMub25DaGFuZ2VGb3JTdGF0ZVdhaXQgPSAoKSA9PiB7XG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyB3aXJlZChvYm5pejogYW55KSB7XG4gICAgdGhpcy5pb19zaWduYWwgPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5zaWduYWwpO1xuXG4gICAgaWYgKG9ibml6LmlzVmFsaWRJTyh0aGlzLnBhcmFtcy52Y2MpKSB7XG4gICAgICB0aGlzLmlvX3ZjYyA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLnZjYyk7XG4gICAgICB0aGlzLmlvX3ZjYy5vdXRwdXQodHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKG9ibml6LmlzVmFsaWRJTyh0aGlzLnBhcmFtcy5nbmQpKSB7XG4gICAgICB0aGlzLmlvX3N1cHBseSA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLmduZCk7XG4gICAgICB0aGlzLmlvX3N1cHBseS5vdXRwdXQoZmFsc2UpO1xuICAgIH1cblxuICAgIHRoaXMuaW9fc2lnbmFsLnB1bGwoXCI1dlwiKTtcblxuICAgIGNvbnN0IHNlbGY6IGFueSA9IHRoaXM7XG4gICAgdGhpcy5pb19zaWduYWwuaW5wdXQoKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgIHNlbGYuaXNQcmVzc2VkID0gdmFsdWU7XG4gICAgICBpZiAoc2VsZi5vbmNoYW5nZSkge1xuICAgICAgICBzZWxmLm9uY2hhbmdlKHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHNlbGYub25DaGFuZ2VGb3JTdGF0ZVdhaXQodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGlzUHJlc3NlZFdhaXQoKSB7XG4gICAgY29uc3QgcmV0OiBhbnkgPSBhd2FpdCB0aGlzLmlvX3NpZ25hbC5pbnB1dFdhaXQoKTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgcHVibGljIHN0YXRlV2FpdChpc1ByZXNzZWQ6IGFueSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLm9uQ2hhbmdlRm9yU3RhdGVXYWl0ID0gKHByZXNzZWQ6IGFueSkgPT4ge1xuICAgICAgICBpZiAoaXNQcmVzc2VkID09PSBwcmVzc2VkKSB7XG4gICAgICAgICAgdGhpcy5vbkNoYW5nZUZvclN0YXRlV2FpdCA9ICgpID0+IHtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHcm92ZV9CdXR0b247XG4iXX0=
