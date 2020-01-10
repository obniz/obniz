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
class AnalogTemperatureSensor {
    constructor() {
        this.keys = ["vcc", "gnd", "output"];
        this.requiredKeys = ["output"];
        this.drive = "5v";
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, this.drive);
        this.ad = obniz.getAD(this.params.output);
        this.ad.start((voltage) => {
            this.temp = this.calc(voltage);
            this.onchange(this.temp);
        });
    }
    getWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const voltage = yield this.ad.getWait();
            this.temp = this.calc(voltage);
            return this.temp;
        });
    }
    onchange(temp) {
    }
    calc(voltage) {
        return 0;
    }
}
exports.default = AnalogTemperatureSensor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLHVCQUF1QjtJQVMzQjtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUNwQixDQUFDO0lBRU0sS0FBSyxDQUFDLEtBQVU7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFMUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQ1gsQ0FBQyxPQUFZLEVBQUUsRUFBRTtZQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFWSxPQUFPOztZQUNsQixNQUFNLE9BQU8sR0FBUSxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDN0MsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9CLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztRQUNuQixDQUFDO0tBQUE7SUFFTSxRQUFRLENBQUMsSUFBUztJQUN6QixDQUFDO0lBRU0sSUFBSSxDQUFDLE9BQVk7UUFDdEIsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDO0NBQ0Y7QUFFRCxrQkFBZSx1QkFBdUIsQ0FBQyIsImZpbGUiOiJzcmMvcGFydHMvVGVtcGVyYXR1cmVTZW5zb3IvYW5hbG9nL0FuYWxvZ1RlbXBlcmF0dXJlU2Vuc29yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3Ige1xuICBwdWJsaWMga2V5czogYW55O1xuICBwdWJsaWMgcmVxdWlyZWRLZXlzOiBhbnk7XG4gIHB1YmxpYyBkcml2ZTogYW55O1xuICBwdWJsaWMgb2JuaXo6IGFueTtcbiAgcHVibGljIHBhcmFtczogYW55O1xuICBwdWJsaWMgYWQ6IGFueTtcbiAgcHVibGljIHRlbXA6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbXCJ2Y2NcIiwgXCJnbmRcIiwgXCJvdXRwdXRcIl07XG4gICAgdGhpcy5yZXF1aXJlZEtleXMgPSBbXCJvdXRwdXRcIl07XG4gICAgdGhpcy5kcml2ZSA9IFwiNXZcIjtcbiAgfVxuXG4gIHB1YmxpYyB3aXJlZChvYm5pejogYW55KSB7XG4gICAgdGhpcy5vYm5peiA9IG9ibml6O1xuICAgIG9ibml6LnNldFZjY0duZCh0aGlzLnBhcmFtcy52Y2MsIHRoaXMucGFyYW1zLmduZCwgdGhpcy5kcml2ZSk7XG4gICAgdGhpcy5hZCA9IG9ibml6LmdldEFEKHRoaXMucGFyYW1zLm91dHB1dCk7XG5cbiAgICB0aGlzLmFkLnN0YXJ0KFxuICAgICAgKHZvbHRhZ2U6IGFueSkgPT4ge1xuICAgICAgICB0aGlzLnRlbXAgPSB0aGlzLmNhbGModm9sdGFnZSk7XG4gICAgICAgIHRoaXMub25jaGFuZ2UodGhpcy50ZW1wKTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRXYWl0KCkge1xuICAgIGNvbnN0IHZvbHRhZ2U6IGFueSA9IGF3YWl0IHRoaXMuYWQuZ2V0V2FpdCgpO1xuICAgIHRoaXMudGVtcCA9IHRoaXMuY2FsYyh2b2x0YWdlKTtcbiAgICByZXR1cm4gdGhpcy50ZW1wO1xuICB9XG5cbiAgcHVibGljIG9uY2hhbmdlKHRlbXA6IGFueSkge1xuICB9XG5cbiAgcHVibGljIGNhbGModm9sdGFnZTogYW55KSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3I7XG4iXX0=
