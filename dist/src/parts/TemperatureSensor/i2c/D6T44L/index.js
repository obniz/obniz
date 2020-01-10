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
class D6T44L {
    constructor() {
        this.requiredKeys = [];
        this.keys = ["vcc", "gnd", "sda", "scl", "clock"];
        this.address = 0x0a;
        this.ioKeys = ["vcc", "gnd", "sda", "scl"];
        this.commands = {};
        this.commands.read_data = [0x4c];
    }
    static info() {
        return {
            name: "D6T44L",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.params.clock = this.params.clock || 100 * 1000; // for i2c
        this.params.mode = this.params.mode || "master"; // for i2c
        this.params.pull = this.params.pull || null; // for i2c
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.obniz.wait(50);
    }
    getOnePixWait(pixcel) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.getAllPixWait();
            return data[pixcel];
        });
    }
    getAllPixWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address, [0x4c]);
            // await obniz.wait(160);
            const raw = yield this.i2c.readWait(this.address, 35);
            const data = [];
            for (let i = 0; i < 16; i++) {
                data[i] = parseFloat(((raw[i * 2 + 2] + (raw[i * 2 + 3] << 8)) * 0.1).toFixed(1));
            }
            return data;
        });
    }
}
exports.default = D6T44L;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9pMmMvRDZUNDRML2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsTUFBTSxNQUFNO0lBaUJWO1FBQ0UsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUVwQixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBdkJNLE1BQU0sQ0FBQyxJQUFJO1FBQ2hCLE9BQU87WUFDTCxJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7SUFDSixDQUFDO0lBcUJNLEtBQUssQ0FBQyxLQUFVO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTdELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVO1FBQy9ELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxDQUFDLFVBQVU7UUFDM0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsVUFBVTtRQUN2RCxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVZLGFBQWEsQ0FBQyxNQUFXOztZQUNwQyxNQUFNLElBQUksR0FBUSxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUM3QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QixDQUFDO0tBQUE7SUFFWSxhQUFhOztZQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNyQyx5QkFBeUI7WUFDekIsTUFBTSxHQUFHLEdBQVEsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRTNELE1BQU0sSUFBSSxHQUFRLEVBQUUsQ0FBQztZQUVyQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMzQixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUNsQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FDNUQsQ0FBQzthQUNIO1lBRUQsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO0tBQUE7Q0FDRjtBQUVELGtCQUFlLE1BQU0sQ0FBQyIsImZpbGUiOiJzcmMvcGFydHMvVGVtcGVyYXR1cmVTZW5zb3IvaTJjL0Q2VDQ0TC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEQ2VDQ0TCB7XG5cbiAgcHVibGljIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBcIkQ2VDQ0TFwiLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgcmVxdWlyZWRLZXlzOiBhbnk7XG4gIHB1YmxpYyBrZXlzOiBhbnk7XG4gIHB1YmxpYyBhZGRyZXNzOiBhbnk7XG4gIHB1YmxpYyBpb0tleXM6IGFueTtcbiAgcHVibGljIGNvbW1hbmRzOiBhbnk7XG4gIHB1YmxpYyBvYm5pejogYW55O1xuICBwdWJsaWMgcGFyYW1zOiBhbnk7XG4gIHB1YmxpYyBpMmM6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFtdO1xuICAgIHRoaXMua2V5cyA9IFtcInZjY1wiLCBcImduZFwiLCBcInNkYVwiLCBcInNjbFwiLCBcImNsb2NrXCJdO1xuICAgIHRoaXMuYWRkcmVzcyA9IDB4MGE7XG5cbiAgICB0aGlzLmlvS2V5cyA9IFtcInZjY1wiLCBcImduZFwiLCBcInNkYVwiLCBcInNjbFwiXTtcbiAgICB0aGlzLmNvbW1hbmRzID0ge307XG4gICAgdGhpcy5jb21tYW5kcy5yZWFkX2RhdGEgPSBbMHg0Y107XG4gIH1cblxuICBwdWJsaWMgd2lyZWQob2JuaXo6IGFueSkge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcbiAgICB0aGlzLm9ibml6LnNldFZjY0duZCh0aGlzLnBhcmFtcy52Y2MsIHRoaXMucGFyYW1zLmduZCwgXCI1dlwiKTtcblxuICAgIHRoaXMucGFyYW1zLmNsb2NrID0gdGhpcy5wYXJhbXMuY2xvY2sgfHwgMTAwICogMTAwMDsgLy8gZm9yIGkyY1xuICAgIHRoaXMucGFyYW1zLm1vZGUgPSB0aGlzLnBhcmFtcy5tb2RlIHx8IFwibWFzdGVyXCI7IC8vIGZvciBpMmNcbiAgICB0aGlzLnBhcmFtcy5wdWxsID0gdGhpcy5wYXJhbXMucHVsbCB8fCBudWxsOyAvLyBmb3IgaTJjXG4gICAgdGhpcy5pMmMgPSBvYm5pei5nZXRJMkNXaXRoQ29uZmlnKHRoaXMucGFyYW1zKTtcbiAgICB0aGlzLm9ibml6LndhaXQoNTApO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldE9uZVBpeFdhaXQocGl4Y2VsOiBhbnkpIHtcbiAgICBjb25zdCBkYXRhOiBhbnkgPSBhd2FpdCB0aGlzLmdldEFsbFBpeFdhaXQoKTtcbiAgICByZXR1cm4gZGF0YVtwaXhjZWxdO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldEFsbFBpeFdhaXQoKSB7XG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5hZGRyZXNzLCBbMHg0Y10pO1xuICAgIC8vIGF3YWl0IG9ibml6LndhaXQoMTYwKTtcbiAgICBjb25zdCByYXc6IGFueSA9IGF3YWl0IHRoaXMuaTJjLnJlYWRXYWl0KHRoaXMuYWRkcmVzcywgMzUpO1xuXG4gICAgY29uc3QgZGF0YTogYW55ID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICAgIGRhdGFbaV0gPSBwYXJzZUZsb2F0KFxuICAgICAgICAoKHJhd1tpICogMiArIDJdICsgKHJhd1tpICogMiArIDNdIDw8IDgpKSAqIDAuMSkudG9GaXhlZCgxKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRDZUNDRMO1xuIl19
