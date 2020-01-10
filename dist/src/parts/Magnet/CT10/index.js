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
class CT10 {
    constructor() {
        this.keys = ["signal", "gnd", "vcc"];
        this.requiredKeys = ["signal"];
        this.onChangeForStateWait = () => {
        };
    }
    static info() {
        return {
            name: "CT10",
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
        this.io_signal.pull("0v");
        const self = this;
        this.io_signal.input((value) => {
            self.isNear = value;
            if (self.onchange) {
                self.onchange(value);
            }
            self.onChangeForStateWait(value);
        });
    }
    isNearWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.io_signal.inputWait();
            return ret;
        });
    }
    stateWait(isNear) {
        return new Promise((resolve, reject) => {
            this.onChangeForStateWait = (near) => {
                if (isNear === near) {
                    this.onChangeForStateWait = () => {
                    };
                    resolve();
                }
            };
        });
    }
}
exports.default = CT10;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9NYWduZXQvQ1QxMC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLE1BQU0sSUFBSTtJQWtCUjtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUvQixJQUFJLENBQUMsb0JBQW9CLEdBQUcsR0FBRyxFQUFFO1FBQ2pDLENBQUMsQ0FBQztJQUNKLENBQUM7SUF0Qk0sTUFBTSxDQUFDLElBQUk7UUFDaEIsT0FBTztZQUNMLElBQUksRUFBRSxNQUFNO1NBQ2IsQ0FBQztJQUNKLENBQUM7SUFvQk0sS0FBSyxDQUFDLEtBQVU7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFakQsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUI7UUFFRCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNwQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM5QjtRQUVELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTFCLE1BQU0sSUFBSSxHQUFRLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQVUsRUFBRSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN0QjtZQUNELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFWSxVQUFVOztZQUNyQixNQUFNLEdBQUcsR0FBUSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDbEQsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFTSxTQUFTLENBQUMsTUFBVztRQUMxQixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFO2dCQUN4QyxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7b0JBQ25CLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxHQUFHLEVBQUU7b0JBQ2pDLENBQUMsQ0FBQztvQkFDRixPQUFPLEVBQUUsQ0FBQztpQkFDWDtZQUNILENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsa0JBQWUsSUFBSSxDQUFDIiwiZmlsZSI6InNyYy9wYXJ0cy9NYWduZXQvQ1QxMC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIENUMTAge1xuXG4gIHB1YmxpYyBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJDVDEwXCIsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBrZXlzOiBhbnk7XG4gIHB1YmxpYyByZXF1aXJlZEtleXM6IGFueTtcbiAgcHVibGljIG9uQ2hhbmdlRm9yU3RhdGVXYWl0OiBhbnk7XG4gIHB1YmxpYyBpb19zaWduYWw6IGFueTtcbiAgcHVibGljIHBhcmFtczogYW55O1xuICBwdWJsaWMgaW9fdmNjOiBhbnk7XG4gIHB1YmxpYyBpb19zdXBwbHk6IGFueTtcbiAgcHVibGljIGlzTmVhcjogYW55O1xuICBwdWJsaWMgb25jaGFuZ2U6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbXCJzaWduYWxcIiwgXCJnbmRcIiwgXCJ2Y2NcIl07XG4gICAgdGhpcy5yZXF1aXJlZEtleXMgPSBbXCJzaWduYWxcIl07XG5cbiAgICB0aGlzLm9uQ2hhbmdlRm9yU3RhdGVXYWl0ID0gKCkgPT4ge1xuICAgIH07XG4gIH1cblxuICBwdWJsaWMgd2lyZWQob2JuaXo6IGFueSkge1xuICAgIHRoaXMuaW9fc2lnbmFsID0gb2JuaXouZ2V0SU8odGhpcy5wYXJhbXMuc2lnbmFsKTtcblxuICAgIGlmIChvYm5pei5pc1ZhbGlkSU8odGhpcy5wYXJhbXMudmNjKSkge1xuICAgICAgdGhpcy5pb192Y2MgPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy52Y2MpO1xuICAgICAgdGhpcy5pb192Y2Mub3V0cHV0KHRydWUpO1xuICAgIH1cblxuICAgIGlmIChvYm5pei5pc1ZhbGlkSU8odGhpcy5wYXJhbXMuZ25kKSkge1xuICAgICAgdGhpcy5pb19zdXBwbHkgPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5nbmQpO1xuICAgICAgdGhpcy5pb19zdXBwbHkub3V0cHV0KGZhbHNlKTtcbiAgICB9XG5cbiAgICB0aGlzLmlvX3NpZ25hbC5wdWxsKFwiMHZcIik7XG5cbiAgICBjb25zdCBzZWxmOiBhbnkgPSB0aGlzO1xuICAgIHRoaXMuaW9fc2lnbmFsLmlucHV0KCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICBzZWxmLmlzTmVhciA9IHZhbHVlO1xuICAgICAgaWYgKHNlbGYub25jaGFuZ2UpIHtcbiAgICAgICAgc2VsZi5vbmNoYW5nZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgICBzZWxmLm9uQ2hhbmdlRm9yU3RhdGVXYWl0KHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBpc05lYXJXYWl0KCkge1xuICAgIGNvbnN0IHJldDogYW55ID0gYXdhaXQgdGhpcy5pb19zaWduYWwuaW5wdXRXYWl0KCk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0ZVdhaXQoaXNOZWFyOiBhbnkpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5vbkNoYW5nZUZvclN0YXRlV2FpdCA9IChuZWFyOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKGlzTmVhciA9PT0gbmVhcikge1xuICAgICAgICAgIHRoaXMub25DaGFuZ2VGb3JTdGF0ZVdhaXQgPSAoKSA9PiB7XG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ1QxMDtcbiJdfQ==
